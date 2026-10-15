import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,mkdir,writeFile,readFile,rm,stat} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join,resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {runInNewContext} from 'node:vm';
import {spawnSync} from 'node:child_process';
import {validateSites,renderIndex,deploymentFor,publishSite,checkDeployment,repositoryRoot,loadSites,buildDirectoryFor,countsFor,expectedResultFor} from './site-tools.mjs';

const registration=number=>({number,project:'test-site-'+number,siteId:'site-'+number,title:'Site '+number});

test('multi-digit numbers sort numerically and titles are escaped',()=>{
 const sites=validateSites([registration(11),registration(2),{...registration(10),title:'<script> & "title"'}]);
 assert.deepEqual(sites.map(s=>s.number),[2,10,11]);
 const html=renderIndex(sites);
 assert(html.indexOf('test-site-2/')<html.indexOf('test-site-10/'));
 assert(html.indexOf('test-site-10/')<html.indexOf('test-site-11/'));
 assert(html.includes('&lt;script&gt; &amp; &quot;title&quot;'));
 assert.equal(sites[1].port,4182);
});

test('invalid and conflicting registrations fail before file changes',()=>{
 for(const fields of [{number:0},{number:1.5},{project:'../outside'},{project:'agency-name'},{project:'test-site-11'},{project:'test-site-010'},{siteId:'a/b'},{title:''},{port:65536}]){
  assert.throws(()=>validateSites([{...registration(10),...fields}]));
 }
 for(const fields of [{number:2},{project:'test-site-2'},{siteId:'site-2'},{port:4174}]){
  assert.throws(()=>validateSites([registration(2),{...registration(10),...fields}]),/Duplicate/);
 }
 assert.equal(validateSites([{...registration(100000),port:8000}])[0].targetDirectory,'test-site-100000');
});

test('publishing site 10 removes stale target files, excludes lab and preserves neighbours',async()=>{
 const temporaryRoot=await mkdtemp(join(tmpdir(),'sumgwang-sites-'));
 // This absolute directory is created by this test and is the only cleanup target.
 assert.equal(dirname(resolve(temporaryRoot)),resolve(tmpdir()));
 try{
  const site=validateSites([registration(10)])[0];
  const dist=buildDirectoryFor(site,temporaryRoot);
  await mkdir(join(dist,'lab'),{recursive:true});
  await mkdir(join(dist,'assets'),{recursive:true});
  await writeFile(join(dist,'index.html'),'<h1>Site 10</h1>');
  await writeFile(join(dist,'assets/style.css'),'body{}');
  await writeFile(join(dist,'lab/index.html'),'private lab');
  await mkdir(join(temporaryRoot,'source'),{recursive:true});
  await writeFile(join(temporaryRoot,'source/sites.json'),JSON.stringify([registration(10)]));
  await mkdir(join(temporaryRoot,'test-site-10'));
  await writeFile(join(temporaryRoot,'test-site-10/stale.html'),'obsolete');
  await mkdir(join(temporaryRoot,'test-site-11'));
  await writeFile(join(temporaryRoot,'test-site-11/index.html'),'neighbour');
  await publishSite(site,temporaryRoot);
  assert.equal(await checkDeployment(site,temporaryRoot),2);
  await assert.rejects(stat(join(temporaryRoot,'test-site-10/stale.html')),e=>e.code==='ENOENT');
  await assert.rejects(stat(join(temporaryRoot,'test-site-10/lab')),e=>e.code==='ENOENT');
  assert.equal(await readFile(join(temporaryRoot,'test-site-11/index.html'),'utf8'),'neighbour');
  assert.equal(await readFile(join(temporaryRoot,'index.html'),'utf8'),renderIndex([site]));
  await writeFile(join(temporaryRoot,'test-site-10/extra.txt'),'unexpected');
  await assert.rejects(checkDeployment(site,temporaryRoot),/stale or missing/);
 }finally{await rm(temporaryRoot,{recursive:true,force:true});}
});

test('all actual labs resolve multi-digit sites under repository prefixes and standalone dist',async()=>{
 const paths=['shared/lab.js','shared/legacy-lab.js'];
 for(const relative of paths){
  const source=await readFile(join(repositoryRoot,'source',relative),'utf8');
  // Execute the actual path initialization up to the next helper declaration.
  const init=source.slice(source.indexOf('const labBase='),source.indexOf('const esc='));
  for(const number of [2,10,11,100]){
   const site=validateSites([registration(number)])[0];
   for(const prefix of ['', '/sumgwang-test-pages']){
    const deployment=deploymentFor(site);
    const href='https://example.test'+prefix+'/'+deployment.sourceDirectory+'/lab/index.html';
    const actual=runInNewContext(init+'\nconfigureDeployment();entry;',{URL,location:{href},manifest:{entry:'index.html',deployment}});
    assert.equal(actual,'https://example.test'+prefix+'/test-site-'+number+'/index.html');
   }
   const actual=runInNewContext(init+'\nconfigureDeployment();entry;',{URL,location:{href:'http://localhost:8000/lab/index.html'},manifest:{entry:'index.html',deployment:deploymentFor(site)}});
   assert.equal(actual,'http://localhost:8000/index.html');
  }
 }
});

test('manager works from another directory and rejects an unregistered selection',()=>{
 const script=fileURLToPath(new URL('./manage.mjs',import.meta.url));
 const list=spawnSync(process.execPath,[script,'list'],{cwd:tmpdir(),encoding:'utf8'});
 assert.equal(list.status,0,list.stderr);assert(list.stdout.includes('test-site-1'));
 const unknown=spawnSync(process.execPath,[script,'build','999'],{cwd:tmpdir(),encoding:'utf8'});
 assert.notEqual(unknown.status,0);assert.match(unknown.stderr,/Unknown site number/);
});

test('reference samples retain raw text, query values and iframe paths without normal findings',()=>{
 const manifest={siteId:'example',entry:'index.html',scenarioCount:2,deployment:{targetDirectory:'test-site-10'},cases:[{caseId:'T1',page:'board/view.html?b=2&a=1',selector:'p.note',frames:[{src:'widgets/outer.html'}],text:'ｃａｓｉｎｏ',techniques:['HOMOGLYPH','TRANSPARENT']}],negativeControls:[{caseId:'N1',page:'normal.html',techniques:[]}]};
 const expected=expectedResultFor(manifest,'https://example.test/repository/');
 assert.equal(expected.meta.entry_url,'https://example.test/repository/test-site-10/index.html');
 assert.equal(expected.meta.started_at,'2000-01-01T00:00:00.000Z');assert.equal(expected.meta.elapsed_sec,0);
 assert.equal(expected.findings.length,2);assert.equal(expected.findings[0].evidence_text,'ｃａｓｉｎｏ');
 assert.equal(expected.findings[0].url,'https://example.test/repository/test-site-10/board/view.html?b=2&a=1');
 assert.equal(expected.findings[0].location,'iframe[src="https://example.test/repository/test-site-10/widgets/outer.html"] >>> p.note');
 assert.equal(countsFor(manifest).negativeControls,1);assert.equal(countsFor(manifest).expectedFindings,2);
 assert.throws(()=>expectedResultFor(manifest,'file:///tmp/'));
 assert.deepEqual(expectedResultFor(manifest,'https://example.test/repository'),expected);
});

test('diagnostics keep technique units, omissions and submitted field errors separate',async()=>{
 const {createComparisonTrace}=await import('./shared/comparison-report.js');
 const c={caseId:'T1',page:'view.html?a=1&b=2',selector:'p.note',frames:[],text:'ｃａｓｉｎｏ',techniques:['HOMOGLYPH','TRANSPARENT']};
 const manifest={cases:[c],negativeControls:[]},base=new URL('https://example.test/repo/test-site-1/');
 const canonical=input=>{const u=new URL(input,base);u.hash='';u.searchParams.sort();return u.host+u.pathname+u.search;};
 const trace=createComparisonTrace({manifest,base,entry:new URL('index.html',base).href,canonical,locationFor:item=>item.selector,engine:'legacy'});
 const finding={id:'detector-1',url:new URL(c.page,base).href,location:'p',evidence_text:'different raw evidence',technique:'HOMOGLYPH',is_violation:true};
 trace.tp(finding,c);trace.tp(finding,c);trace.duplicate({...finding,id:'copy'});trace.invalid({id:'broken'},2,'필수 필드');
 const report=trace.finish({tp:1,fn:1,fp:0,invalid:1,duplicates:1,total:2},new Set(['T1|HOMOGLYPH']),{meta:{elapsed_sec:0},findings:[finding]});
 assert.equal(report.status,'complete');assert.equal(report.diagnostics.filter(row=>row.type==='tp').length,1);
 assert.equal(report.diagnostics.find(row=>row.type==='tp').expected[0].technique,'HOMOGLYPH');
 assert.equal(report.diagnostics.find(row=>row.type==='fn').expected[0].technique,'TRANSPARENT');
 assert.equal(report.diagnostics.find(row=>row.type==='invalid').inputIndex,3);
 assert.equal(report.diagnostics.find(row=>row.type==='tp').submitted.evidence_text,'different raw evidence');
 assert.equal(report.rates.precision,1);assert.equal(report.rates.adjusted,0.5);
});

test('diagnostic rates have no invented value for empty denominators',async()=>{
 const {createComparisonTrace}=await import('./shared/comparison-report.js');
 const trace=createComparisonTrace({manifest:{cases:[],negativeControls:[]},base:new URL('https://example.test/'),entry:'https://example.test/',canonical:String,locationFor:()=>'',engine:'modern'});
 const report=trace.finish({tp:0,fn:0,fp:0,invalid:0,duplicates:0,total:0},new Set(),{meta:{},findings:[]});
 assert.deepEqual(report.rates,{recall:null,precision:null,adjusted:null});
});
