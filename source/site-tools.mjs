import {readFile,writeFile,readdir,mkdir,cp,rm,stat,lstat} from 'node:fs/promises';
import {resolve,dirname,basename,join,relative,sep} from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
import assert from 'node:assert/strict';

export const repositoryRoot=fileURLToPath(new URL('../',import.meta.url));
const techniques=['HOMOGLYPH','JAMO','TRANSPARENT','OFFSCREEN'];
const escape=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

export function validateSites(input){
 assert(Array.isArray(input)&&input.length>0,'sites.json must be a non-empty array');
 const numbers=new Set(),projects=new Set(),ids=new Set(),ports=new Set();
 const sites=input.map(value=>{
  assert(value&&typeof value==='object'&&!Array.isArray(value),'Invalid site registration');
  assert(Number.isSafeInteger(value.number)&&value.number>0,'Site number must be a positive integer');
  assert(typeof value.project==='string'&&/^[a-z][a-z0-9-]*$/.test(value.project),'Invalid source project directory');
  assert(typeof value.siteId==='string'&&/^[a-z][a-z0-9-]*$/.test(value.siteId),'Invalid siteId');
  assert(typeof value.title==='string'&&value.title.trim(),'Site title is required');
  const port=value.port??4172+value.number;
  assert(Number.isInteger(port)&&port>=1024&&port<=65535,'Set a valid port for this site');
  for(const [seen,key,label] of [[numbers,value.number,'number'],[projects,value.project,'project'],[ids,value.siteId,'siteId'],[ports,port,'port']]){
   assert(!seen.has(key),'Duplicate site '+label+': '+key);seen.add(key);
  }
  const directory='test-site-'+value.number;
  assert.equal(value.project,directory,'Source project must be '+directory);
  return {...value,port,targetDirectory:directory};
 });
 return sites.sort((a,b)=>a.number-b.number);
}
export async function loadSites(root=repositoryRoot){return validateSites(JSON.parse(await readFile(join(root,'source/sites.json'),'utf8')));}
export async function siteForProject(scriptUrl){
 const project=basename(dirname(dirname(fileURLToPath(scriptUrl))));
 const site=(await loadSites()).find(s=>s.project===project);
 assert(site,'Register source/'+project+' in source/sites.json');
 return site;
}
export function deploymentFor(site){return {targetDirectory:site.targetDirectory,sourceDirectory:'source/'+site.project};}
export function renderIndex(sites){
 const rows=validateSites(sites).map(s=>'    <li><a href="'+s.targetDirectory+'/">테스트 사이트 '+s.number+' — '+escape(s.title)+'</a></li>').join('\n');
 return '<!doctype html>\n<html lang="ko">\n<head>\n  <meta charset="utf-8">\n  <meta name="viewport" content="width=device-width,initial-scale=1">\n  <title>불법광고 탐지 테스트 페이지</title>\n</head>\n<body>\n  <h1>테스트 사이트 목록</h1>\n  <ul>\n'+rows+'\n  </ul>\n</body>\n</html>\n';
}
export async function updateIndex(root=repositoryRoot){await writeFile(join(root,'index.html'),renderIndex(await loadSites(root)),'utf8');}
export async function walk(dir){
 const files=[];
 for(const item of await readdir(dir,{withFileTypes:true})){
  assert(!item.isSymbolicLink(),'Generated directories must not contain symlinks');
  const path=join(dir,item.name);files.push(...(item.isDirectory()?await walk(path):[path]));
 }
 return files;
}
export async function publishSite(site,root=repositoryRoot){
 const checked=validateSites([site])[0],repo=resolve(root),target=resolve(repo,checked.targetDirectory);
 // Delete only this registered generated directory, never source or the repository.
 assert(dirname(target)===repo&&basename(target)===checked.targetDirectory,'Unsafe deployment directory');
 const dist=buildDirectoryFor(checked,repo);
 const files=(await walk(dist)).filter(f=>relative(dist,f).split(sep)[0]!=='lab');
 assert(files.includes(join(dist,'index.html')),'Build dist/index.html before publishing');
 const targetInfo=await lstat(target).catch(e=>{if(e.code==='ENOENT')return null;throw e;});
 if(targetInfo)assert(targetInfo.isDirectory(),'Deployment target must be a directory');
 // walk() has completed before cleanup; excluded lab files are never published.
 await rm(target,{recursive:true,force:true});await mkdir(target,{recursive:true});
 for(const file of files){const destination=join(target,relative(dist,file));await mkdir(dirname(destination),{recursive:true});await cp(file,destination);}
 await updateIndex(repo);
}
export async function checkDeployment(site,root=repositoryRoot){
 const dist=buildDirectoryFor(site,root),target=join(root,site.targetDirectory);
 const expected=(await walk(dist)).filter(f=>relative(dist,f).split(sep)[0]!=='lab'),actual=await walk(target);
 assert.equal(actual.length,expected.length,'Deployment contains stale or missing files: '+site.targetDirectory);
 for(const file of expected)assert.deepEqual(await readFile(join(target,relative(dist,file))),await readFile(file),'Deployment differs: '+file);
 return actual.length;
}
export async function checkManifest(site,sourceModule){
 const projectRoot=join(repositoryRoot,'source',site.project),dist=buildDirectoryFor(site);
 const manifest=JSON.parse(await readFile(join(projectRoot,'reference/ground-truth.json'),'utf8'));
 assert.deepEqual(JSON.parse(await readFile(join(dist,'lab/manifest.json'),'utf8')),manifest,'Lab and reference manifests differ');
 assert.equal(manifest.siteId,site.siteId);assert.equal(manifest.siteName,site.title);assert.deepEqual(manifest.deployment,deploymentFor(site));
 const scenarios=[...sourceModule.fixtures,...(sourceModule.queryFixtures||[])];
 const extra=(sourceModule.extraElements||[]).map(f=>({...f,path:scenarios.find(p=>p.key===f.parent)?.path}));
 const definitions=[...scenarios,...extra],cases=[...manifest.cases,...manifest.negativeControls];
 assert.equal(new Set(definitions.map(c=>c.key)).size,definitions.length,'Duplicate source case IDs');
 assert.equal(new Set(cases.map(c=>c.caseId)).size,cases.length,'Duplicate manifest case IDs');
 assert.equal(cases.length,definitions.length);
 for(const definition of definitions){
  const c=cases.find(c=>c.caseId===definition.key);assert(c,'Missing case '+definition.key);
  assert.equal(c.page,definition.path);assert.equal(c.text,definition.text);assert.deepEqual(c.techniques,definition.techniques);
  assert(typeof c.selector==='string'&&c.selector.length);assert(Array.isArray(c.frames));
  for(const code of c.techniques)assert(techniques.includes(code),'Unknown technique '+code);
  assert((await stat(join(dist,c.page.split('?')[0]))).isFile());
  for(const f of c.frames)assert((await stat(join(dist,f.src))).isFile());
 }
 assert.equal(manifest.cases.length,definitions.filter(c=>c.techniques.length).length);
 assert.equal(manifest.negativeControls.length,definitions.filter(c=>!c.techniques.length).length);
 assert.equal(manifest.scenarioCount,scenarios.length);
 const totals={};for(const c of manifest.cases)for(const t of c.techniques)totals[t]=(totals[t]||0)+1;
 return {scenarioPages:new Set(cases.map(c=>c.page)).size,positiveElements:manifest.cases.length,negativeControls:manifest.negativeControls.length,expectedFindings:manifest.cases.reduce((n,c)=>n+c.techniques.length,0),techniques:totals};
}

export function buildDirectoryFor(site,root=repositoryRoot){return join(root,'tmp','build',validateSites([site])[0].targetDirectory);}
export function buildRootFor(site){return pathToFileURL(buildDirectoryFor(site)+sep);}
export function countsFor(manifest){
 const all=[...manifest.cases,...manifest.negativeControls],techniques={};
 for(const c of manifest.cases)for(const t of c.techniques)techniques[t]=(techniques[t]||0)+1;
 return {scenarios:manifest.scenarioCount,scenarioPages:new Set(all.map(c=>c.page)).size,positiveElements:manifest.cases.length,negativeControls:manifest.negativeControls.length,expectedFindings:manifest.cases.reduce((n,c)=>n+c.techniques.length,0),techniques};
}
export function expectedResultFor(manifest,publicBaseUrl){
 const publicBase=new URL(publicBaseUrl);assert(['http:','https:'].includes(publicBase.protocol),'Public base must use HTTP(S)');assert(!publicBase.search&&!publicBase.hash,'Public base must not contain query or fragment');if(!publicBase.pathname.endsWith('/'))publicBase.pathname+='/';
 const base=new URL(manifest.deployment.targetDirectory+'/',publicBase),timestamp='2000-01-01T00:00:00.000Z';
 return {meta:{topic:'TOPIC',entry_url:new URL(manifest.entry,base).href,started_at:timestamp,finished_at:timestamp,elapsed_sec:0,tool_version:manifest.siteId==='hanbit-civic'?'hanbit-reference-1.0.0':'reference-1.0.0'},findings:manifest.cases.flatMap(c=>c.techniques.map(t=>({id:c.caseId+'_'+t,url:new URL(c.page,base).href,is_violation:true,location:[...c.frames.map(f=>'iframe[src="'+new URL(f.src,base).href+'"]'),c.selector].join(' >>> '),evidence_text:c.text,technique:t})))};
}
export async function writeLab(site){
 const project=join(repositoryRoot,'source',site.project),dist=buildDirectoryFor(site),lab=join(dist,'lab'),source=join(project,'lab');
 const manifest=JSON.parse(await readFile(join(project,'reference/ground-truth.json'),'utf8')),counts=countsFor(manifest),config=JSON.parse(await readFile(join(repositoryRoot,'package.json'),'utf8')).config;
 await mkdir(lab,{recursive:true});
 const html=await readFile(join(source,'index.html'),'utf8'),engine=html.includes('legacy-lab.js')?'legacy-lab.js':'lab.js';
 const standalone=html.replaceAll('../../shared/','').replace('data-manifest="../reference/ground-truth.json"','data-manifest="manifest.json"').replaceAll('../../../'+site.targetDirectory+'/', '../');
 await writeFile(join(lab,'index.html'),standalone,'utf8');
 for(const f of ['lab-base.css','lab.css',engine,'comparison-report.js'])await cp(join(repositoryRoot,'source/shared',f),join(lab,f));
 try{await cp(join(source,'theme.css'),join(lab,'theme.css'));}catch(e){if(e.code!=='ENOENT')throw e;}
 await writeFile(join(lab,'manifest.json'),JSON.stringify(manifest,null,2)+'\n','utf8');
 await writeFile(join(project,'reference/counts.json'),JSON.stringify(counts,null,2)+'\n','utf8');
 await writeFile(join(project,'reference/expected-result.json'),JSON.stringify(expectedResultFor(manifest,config.publicBaseUrl),null,2)+'\n','utf8');
 return counts;
}
