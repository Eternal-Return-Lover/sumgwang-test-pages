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
 const sites=validateSites([registration(11),registration(2),{...registration(10),title:'<script> & "title"',description:'<img src=x> & details'}]);
 assert.deepEqual(sites.map(s=>s.number),[2,10,11]);
 const html=renderIndex(sites);
 assert(html.indexOf('test-site-2/')<html.indexOf('test-site-10/'));
 assert(html.indexOf('test-site-10/')<html.indexOf('test-site-11/'));
 assert(html.includes('&lt;script&gt; &amp; &quot;title&quot;'));
 assert(html.includes('&lt;img src=x&gt; &amp; details'));
 assert(html.includes('href="validator/?site=11"'));
 assert.equal((html.match(/data-site-number=/g)||[]).length,3);
 assert(html.includes('등록된 테스트 사이트 <strong>3개</strong>'));
 assert(html.includes('가상 공공기관 콘텐츠에서 탐지 결과를 확인하세요.'));
 assert(!html.includes('<script>')&&!html.includes('<img src=x>'));
 assert.equal(sites[1].port,4182);
});

test('invalid and conflicting registrations fail before file changes',()=>{
 for(const fields of [{number:0},{number:1.5},{project:'../outside'},{project:'agency-name'},{project:'test-site-11'},{project:'test-site-010'},{siteId:'a/b'},{title:''},{description:''},{description:5},{port:65536}]){
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


test('category annotations validate complete coverage and retain the six-field submission contract',async()=>{
 const {CATEGORY_LABELS,validateCategoryAnnotations,categoryCounts}=await import('./shared/categories.js');
 const manifest={categoryProfile:'all-11-v1',cases:[],negativeControls:[],scenarioCount:66,siteId:'test',entry:'index.html',deployment:{targetDirectory:'test-site-11'}};
 for(const code of Object.keys(CATEGORY_LABELS)){
  const tags=[['HOMOGLYPH','TRANSPARENT'],['JAMO'],['TRANSPARENT'],['OFFSCREEN']];
  tags.forEach((techniques,i)=>manifest.cases.push({caseId:code+i,primaryCategory:code,annotationReason:'합성 광고의 명시된 설정',techniques,page:'view.html?k='+code+i,selector:'p.note',frames:[],text:'원문'}));
  for(let i=0;i<2;i++)manifest.negativeControls.push({caseId:code+'N'+i,relatedCategory:code,normalReason:'예방 및 일반 정보 문맥',techniques:[]});
 }
 assert.equal(validateCategoryAnnotations(manifest),true);
 const counts=categoryCounts(manifest);assert.equal(Object.keys(counts).length,11);
 assert(Object.values(counts).every(c=>c.positiveElements===4&&c.negativeControls===2&&c.expectedFindings===5));
 const sample=expectedResultFor(manifest,'https://example.test/repo/');assert.equal(sample.findings.length,55);assert.equal(sample.meta.topic,'TOPIC');assert.deepEqual(Object.keys(sample.findings[0]).sort(),['evidence_text','id','is_violation','location','technique','url']);
 for(const mutate of [
  m=>delete m.categoryProfile,m=>m.categoryProfile='unknown',m=>m.cases[0].primaryCategory=['GAMBLING'],m=>m.cases[0].primaryCategory='__proto__',
  m=>delete m.cases[0].annotationReason,m=>m.negativeControls[0].normalReason=' ',m=>m.cases[0].relatedCategory='GAMBLING',
  m=>m.cases.shift(),m=>m.negativeControls.shift(),m=>m.cases.forEach(c=>c.techniques=c.techniques.filter(t=>t!=='OFFSCREEN')),
  m=>m.cases.forEach(c=>c.techniques=c.techniques.slice(-1))
 ]){const invalid=structuredClone(manifest);mutate(invalid);assert.throws(()=>validateCategoryAnnotations(invalid));}
 for(const value of ['',null,false,0])assert.throws(()=>validateCategoryAnnotations({categoryProfile:value,cases:[],negativeControls:[]}));
 assert.equal(Object.prototype.positiveElements,undefined);
 assert.equal(categoryCounts({cases:[],negativeControls:[]}),null);assert.equal(validateCategoryAnnotations({cases:[],negativeControls:[]}),false);
});

test('category summaries never infer false positive topics from same-page candidates or normal controls',async()=>{
 const {createComparisonTrace}=await import('./shared/comparison-report.js');
 const c={caseId:'A',primaryCategory:'GAMBLING',annotationReason:'합성 설정',page:'view.html',selector:'p.a',frames:[],text:'raw',techniques:['HOMOGLYPH']};
 const b={...c,caseId:'B',primaryCategory:'DRUG',selector:'p.b',techniques:['JAMO']};
 const {CATEGORY_LABELS}=await import('./shared/categories.js');const manifest={categoryProfile:'all-11-v1',cases:[],negativeControls:[]};
 for(const code of Object.keys(CATEGORY_LABELS)){const first=code==='GAMBLING'?c:code==='DRUG'?b:{...c,caseId:code,primaryCategory:code};manifest.cases.push(first);const extra=code==='DRUG'?[['HOMOGLYPH'],['TRANSPARENT'],['OFFSCREEN','HOMOGLYPH']]:[['JAMO'],['TRANSPARENT'],['OFFSCREEN','HOMOGLYPH']];extra.forEach((techniques,i)=>manifest.cases.push({...first,caseId:code+i,techniques}));for(let i=0;i<2;i++)manifest.negativeControls.push({caseId:code+'N'+i,page:c.page,selector:'p.normal',frames:[],text:'예방 안내',relatedCategory:code,normalReason:'예방 안내',techniques:[]});}
 const n=manifest.negativeControls.find(c=>c.relatedCategory==='DRUG'),base=new URL('https://example.test/test-site-11/'),finding={id:'one',url:new URL(c.page,base).href,location:'p.a',evidence_text:'raw',technique:'HOMOGLYPH',is_violation:true,category:'wrong extra field'};
 const trace=createComparisonTrace({manifest,base,entry:base.href,canonical:x=>new URL(x,base).href,locationFor:x=>x.selector,engine:'modern'});
 trace.tp(finding,c);trace.fp({...finding,id:'normal'},'위치·기법·위반 여부가 자체 정답과 다름',n);trace.fp({...finding,id:'missing'},'선택자 없음');trace.invalid({id:'bad'},3,'필드 오류');trace.duplicate({...finding,id:'copy'});
 const report=trace.finish({tp:1,fn:54,fp:2,invalid:1,duplicates:1,total:55},new Set(['A|HOMOGLYPH']),{meta:{},findings:[finding]});
 const summary=report.categorySummary;assert.equal(summary.classificationSupported,false);assert.equal(summary.groups.reduce((a,g)=>a+g.tp,0),1);assert.equal(summary.groups.reduce((a,g)=>a+g.fn,0),54);
 assert.equal(summary.groups.find(g=>g.code==='DRUG').negativeControls,2);assert.deepEqual(summary.unassigned,{fp:2,invalid:1,duplicates:1});
 assert(report.diagnostics.filter(r=>r.type==='fp').every(r=>r.category==='UNASSIGNED'));assert.equal(report.diagnostics.find(r=>r.type==='tp').category,'GAMBLING');
 assert(report.diagnostics.find(r=>r.id==='missing').expected.length>1);assert(!Object.hasOwn(report.diagnostics.find(r=>r.type==='tp').submitted,'category'));
});


function exportFixture(){
 const c={caseId:'T1',page:'view.html?b=2&a=1',selector:'p.note',frames:[{src:'widgets/outer.html',selector:'iframe.reader'}],text:'ｍｅｇａ ㅋㅏㅈㅣㄴㅗ',techniques:['HOMOGLYPH','TRANSPARENT'],delayMs:0};
 const n={caseId:'N1',page:c.page,selector:'p.notice',frames:[],text:'예방 안내',techniques:[],delayMs:0};
 const site={number:2,project:'test-site-2',siteId:'example',title:'합성 도서관'},base=new URL('https://example.test/repo/test-site-2/');
 const manifest={version:'1.0.0',siteId:site.siteId,entry:'index.html',fixtureViewport:{width:1440,height:1000},cases:[c],negativeControls:[n]};
 const f={id:'source',url:new URL(c.page,base).href,location:'iframe.reader >>> p.note',evidence_text:'submitted text differs from reference',technique:'HOMOGLYPH',is_violation:true,confidence:0.7};
 const payload={meta:{topic:'TOPIC',entry_url:new URL('index.html',base).href,elapsed_sec:12,tool_version:'claimed-model',model_name:'unverified'},findings:[f]};
 return {c,n,site,base,manifest,f,payload,entryUrl:payload.meta.entry_url,dashboardUrl:'https://example.test/repo/validator/?site=2',comparisonViewport:{width:1440,height:1000}};
}
async function fixtureReport(v){
 const {createComparisonTrace}=await import('./shared/comparison-report.js');
 const trace=createComparisonTrace({manifest:v.manifest,base:v.base,entry:v.entryUrl,canonical:x=>new URL(x,v.base).href,locationFor:c=>c.selector,engine:'modern'});
 trace.tp(v.f,v.c);
 return trace.finish({tp:1,fn:1,fp:0,invalid:0,duplicates:0,total:2},new Set(['T1|HOMOGLYPH']),v.payload);
}
test('diagnostic provenance links actual fixtures without turning candidates or evidence into labels',async()=>{
 const {createComparisonTrace}=await import('./shared/comparison-report.js'),v=exportFixture(),wrong={...v.f,id:'wrong',technique:'OFFSCREEN'},normal={...v.f,id:'normal'},unknown={...v.f,id:'unknown'},copy={...v.f,id:'copy'};
 const values=[v.f,wrong,normal,unknown,null,copy,null];
 const trace=createComparisonTrace({manifest:v.manifest,base:v.base,entry:v.entryUrl,canonical:x=>new URL(x,v.base).href,locationFor:c=>c.selector,engine:'legacy'});
 trace.tp(v.f,v.c);trace.fp(wrong,'wrong technique',v.c);trace.fp(normal,'normal',v.n);trace.fp(unknown,'unresolved selector');trace.invalid(null,4,'invalid');trace.duplicate(copy);trace.invalid(null,6,'invalid');
 const r=trace.finish({tp:1,fn:1,fp:3,invalid:2,duplicates:1,total:2},new Set(['T1|HOMOGLYPH']),{meta:v.payload.meta,findings:values});
 assert.equal(r.diagnosticSchemaVersion,'1.0.0');
 assert.deepEqual(r.diagnostics.slice(0,7).map(d=>d.submissionIndex),[0,1,2,3,4,5,6]);
 assert.deepEqual(r.diagnostics.filter(d=>d.type==='invalid').map(d=>d.inputIndex),[5,7]);
 const tp=r.diagnostics[0];assert.equal(tp.reference.caseId,'T1');assert.equal(tp.reference.expectedTechnique,'HOMOGLYPH');assert.equal(tp.reference.contentLabelSource,'reference_manifest_element');assert.notEqual(tp.submitted.evidence_text,tp.expected[0].evidence_text);
 assert.equal(r.diagnostics[1].reference.contentLabel,'positive');assert.equal(r.diagnostics[1].reference.expectedTechnique,null);
 assert.equal(r.diagnostics[2].reference.status,'matched_control');assert.equal(r.diagnostics[2].reference.contentLabel,'normal');
 assert.equal(r.diagnostics[3].reference.status,'candidates_only');assert.equal(r.diagnostics[3].reference.contentLabel,null);assert.deepEqual(r.diagnostics[3].reference.candidateCaseIds,['T1','N1']);
 assert.equal(r.diagnostics[5].reference.status,'not_evaluated');assert.equal(r.diagnostics[5].reference.caseId,null);
 const fn=r.diagnostics.at(-1);assert.equal(fn.submissionIndex,null);assert.equal(fn.reference.status,'expected_missing');assert.equal(fn.reference.expectedTechnique,'TRANSPARENT');
});
test('diagnostic indices do not consume occurrences when an API caller repeats object identity',async()=>{
 const {createComparisonTrace}=await import('./shared/comparison-report.js'),v=exportFixture();
 const trace=createComparisonTrace({manifest:v.manifest,base:v.base,entry:v.entryUrl,canonical:x=>new URL(x,v.base).href,locationFor:c=>c.selector,engine:'modern'});
 trace.tp(v.f,v.c);trace.fp(v.f,'existing exception observation');
 const r=trace.finish({tp:1,fn:1,fp:1,invalid:0,duplicates:0,total:2},new Set(['T1|HOMOGLYPH']),{meta:{},findings:[v.f,v.f]});
 assert(r.diagnostics.slice(0,2).every(d=>d.submissionIndex===null&&d.submissionIndexStatus==='ambiguous'));
});
test('export snapshots preserve full API data and hash exact input bytes and parsed reference serialization',async()=>{
 const {createReportSnapshot,exportReport}=await import('../validator/report-export.js'),{createHash}=await import('node:crypto'),v=exportFixture(),report=await fixtureReport(v);
 const text=JSON.stringify(v.payload,null,4)+'\n',file=new File([text],'input.json',{lastModified:123}),snapshot=await createReportSnapshot({...v,report,submissionFile:file,submissionPayload:v.payload});
 const hash=b=>createHash('sha256').update(b).digest('hex');
 assert.equal(snapshot.schema_version,'1.0.0');assert.match(snapshot.report_id,/^[0-9a-f-]{36}$/);
 assert.equal(snapshot.submission.file.sha256,hash(Buffer.from(text)));assert.equal(snapshot.submission.file.size_bytes,Buffer.byteLength(text));
 assert.equal(snapshot.reference.sha256,hash(Buffer.from(JSON.stringify(v.manifest))));assert.deepEqual(snapshot.reference.manifest,v.manifest);
 assert.deepEqual(snapshot.comparison,report);assert.deepEqual(snapshot.submission.payload,v.payload);assert.equal(snapshot.execution.engine.version,null);assert.equal(snapshot.execution.git_sha,null);assert.equal(snapshot.execution.detector_coverage,null);assert.equal(snapshot.interpretation.tn,null);
 assert(Object.isFrozen(snapshot.reference.manifest.cases[0]));assert.throws(()=>{snapshot.comparison.metrics.tp=9;});
 const first=await exportReport(snapshot,{exportedAt:'2026-10-19T05:00:00Z'}),second=await exportReport(snapshot,{exportedAt:'2026-10-19T05:00:01Z'});
 assert.equal(first.filename,'validation-report-test-site-2-20261019T050000Z.json');assert.equal(first.data.exported_at,'2026-10-19T05:00:00.000Z');assert.equal(first.data.report_id,second.data.report_id);first.data.comparison.metrics.tp=9;assert.equal(second.data.comparison.metrics.tp,1);
});
test('export capture is synchronous before delayed file reads and never mixes a later site or report',async()=>{
 const {createReportSnapshot}=await import('../validator/report-export.js'),v=exportFixture(),report=await fixtureReport(v),raw=Buffer.from(JSON.stringify(v.payload)),original=structuredClone({site:v.site,manifest:v.manifest,payload:v.payload,report});
 let release;const gate=new Promise(r=>{release=r;}),file={name:'delayed.json',size:raw.length,lastModified:1,arrayBuffer:async()=>{await gate;return raw.buffer.slice(raw.byteOffset,raw.byteOffset+raw.length);}};
 const pending=createReportSnapshot({...v,report,submissionFile:file,submissionPayload:v.payload});
 v.site.number=11;v.manifest.cases[0].text='mutated';v.payload.findings[0].evidence_text='mutated';report.metrics.tp=99;v.comparisonViewport.width=320;release();
 const snapshot=await pending;assert.equal(snapshot.site.number,original.site.number);assert.deepEqual(snapshot.reference.manifest,original.manifest);assert.deepEqual(snapshot.submission.payload,original.payload);assert.deepEqual(snapshot.comparison,original.report);assert.equal(snapshot.execution.comparison_host_viewport.width,1440);
});
test('export refuses stale contracts or mismatched input and preserves null rates',async()=>{
 const {createReportSnapshot,exportReport}=await import('../validator/report-export.js'),v=exportFixture(),report=await fixtureReport(v),file=new File([JSON.stringify(v.payload)],'result.json'),args={...v,report,submissionFile:file,submissionPayload:v.payload};
 for(const change of [{report:{...report,status:'rejected',metrics:null}},{report:{...report,diagnosticSchemaVersion:undefined}},{entryUrl:'https://wrong.test/'},{site:{...v.site,siteId:'wrong'}},{submissionPayload:{}}])await assert.rejects(createReportSnapshot({...args,...change}));
 const empty=structuredClone(report);empty.metrics={tp:0,fn:2,fp:0,invalid:0,duplicates:0,total:2};empty.rates={recall:0,precision:null,adjusted:null};
 const snapshot=await createReportSnapshot({...args,report:empty}),output=await exportReport(snapshot);assert.equal(output.data.comparison.rates.precision,null);assert.equal(output.data.comparison.rates.adjusted,null);
 await assert.rejects(exportReport(snapshot,{exportedAt:'bad'}));
});


test('export keeps exact numeric tokens and records exceptional parsed number serialization',async()=>{
 const {createReportSnapshot,exportReport}=await import('../validator/report-export.js'),{createComparisonTrace}=await import('./shared/comparison-report.js'),v=exportFixture();
 const raw='{"meta":{"topic":"TOPIC","entry_url":'+JSON.stringify(v.entryUrl)+',"elapsed_sec":0,"huge":1e999},"findings":[1e999,-0]}',payload=JSON.parse(raw);
 const trace=createComparisonTrace({manifest:v.manifest,base:v.base,entry:v.entryUrl,canonical:x=>new URL(x,v.base).href,locationFor:c=>c.selector,engine:'modern'});trace.invalid(payload.findings[0],0,'object required');trace.invalid(payload.findings[1],1,'object required');
 const report=trace.finish({tp:0,fn:2,fp:0,invalid:2,duplicates:0,total:2},new Set(),payload),args={...v,report,submissionFile:new File([raw],'numbers.json'),submissionPayload:payload};
 const snap=await createReportSnapshot(args),{data}=await exportReport(snap),roundtrip=JSON.parse(JSON.stringify(data));
 assert.equal(roundtrip.submission.raw_text,raw);assert.equal(roundtrip.submission.payload.meta.huge,null);assert.equal(roundtrip.submission.payload.findings[1],0);
 assert(roundtrip.serialization.numeric_exceptions.some(e=>e.path==='/submission/payload/findings/0'&&e.kind==='positive_infinity'));
 assert(roundtrip.serialization.numeric_exceptions.some(e=>e.path==='/submission/payload/findings/1'&&e.kind==='negative_zero'));
 assert(roundtrip.serialization.numeric_exceptions.some(e=>e.path==='/comparison/diagnostics/0/submitted/value'&&e.kind==='positive_infinity'));
 const mismatch=structuredClone(payload);mismatch.findings[1]=0;await assert.rejects(createReportSnapshot({...args,submissionPayload:mismatch}),/일치하지/);
});
