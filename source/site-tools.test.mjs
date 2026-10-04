import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,mkdir,writeFile,readFile,rm,stat} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join,resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {runInNewContext} from 'node:vm';
import {spawnSync} from 'node:child_process';
import {validateSites,renderIndex,deploymentFor,publishSite,checkDeployment,repositoryRoot} from './site-tools.mjs';

const registration=number=>({number,project:'project-'+number,siteId:'site-'+number,title:'Site '+number});

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
 for(const fields of [{number:0},{number:1.5},{project:'../outside'},{siteId:'a/b'},{title:''},{port:65536}]){
  assert.throws(()=>validateSites([{...registration(10),...fields}]));
 }
 for(const fields of [{number:2},{project:'project-2'},{siteId:'site-2'},{port:4174}]){
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
  const dist=join(temporaryRoot,'source',site.project,'dist');
  await mkdir(join(dist,'lab'),{recursive:true});
  await mkdir(join(dist,'assets'),{recursive:true});
  await writeFile(join(dist,'index.html'),'<h1>Site 10</h1>');
  await writeFile(join(dist,'assets/style.css'),'body{}');
  await writeFile(join(dist,'lab/index.html'),'private lab');
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

test('both actual labs resolve multi-digit sites under repository prefixes and standalone dist',async()=>{
 for(const relative of ['hanbit-civic-ad-lab/dist/lab/lab.js','daon-library-ad-lab/src/templates/lab.js']){
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
