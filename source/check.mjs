import {readFile,stat} from 'node:fs/promises';
import {join,relative,resolve,sep} from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {spawnSync} from 'node:child_process';
import {Script} from 'node:vm';
import assert from 'node:assert/strict';
import {repositoryRoot,loadSites,buildDirectoryFor,walk,checkManifest,checkDeployment,countsFor,expectedResultFor} from './site-tools.mjs';
export async function checkSite(site){
 const root=buildDirectoryFor(site),source=join(repositoryRoot,'source',site.project),files=await walk(root);let html=0,refs=0;
 for(const file of [...files,join(source,'lab/index.html')]){
  const text=await readFile(file,'utf8');
  if(file.endsWith('.js')){const result=spawnSync(process.execPath,['--check',file],{encoding:'utf8'});assert.equal(result.status,0,result.stderr);}
  if(!file.endsWith('.html'))continue;if(file!==join(source,'lab/index.html'))html++;assert(text.includes('charset="utf-8"'),file+' must declare UTF-8');
  for(const m of text.matchAll(/<(?:a|link|script|iframe|img)\b[^>]*\b(?:href|src)="([^"]*)"/g)){
   const raw=m[1].replaceAll('&amp;','&');if(/^(?:https?:|data:|#|mailto:)/.test(raw))continue;
   let target=fileURLToPath(new URL(raw,pathToFileURL(file)));if((await stat(target)).isDirectory())target=join(target,'index.html');
   assert((await stat(target)).isFile(),file+': missing '+raw);refs++;
  }
  for(const m of text.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g))if(m[1].trim())new Script(m[1],{filename:file});
  const isLab=file===join(source,'lab/index.html')||relative(root,file).split(sep)[0]==='lab';
  if(!isLab)assert(!/href="[^"]*(?:lab\/|ground-truth|manifest\.json)/.test(text),'Target must not link to answers');
 }
 const module=await import(pathToFileURL(join(source,'src/fixtures.mjs')).href),counts=await checkManifest(site,module),manifest=JSON.parse(await readFile(join(source,'reference/ground-truth.json'),'utf8'));
 assert.deepEqual(JSON.parse(await readFile(join(source,'reference/counts.json'),'utf8')),countsFor(manifest));
 const config=JSON.parse(await readFile(join(repositoryRoot,'package.json'),'utf8')).config;
 assert.deepEqual(JSON.parse(await readFile(join(source,'reference/expected-result.json'),'utf8')),expectedResultFor(manifest,config.publicBaseUrl));
 const deploymentFiles=await checkDeployment(site);return {ok:true,site:site.targetDirectory,htmlDocuments:html,localReferences:refs,deploymentFiles,...counts};
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const selection=process.argv[2]||'all',sites=(await loadSites()).filter(s=>selection==='all'||String(s.number)===selection);assert(sites.length,'Unknown site number: '+selection);
 for(const site of sites)console.log(JSON.stringify(await checkSite(site)));
}
