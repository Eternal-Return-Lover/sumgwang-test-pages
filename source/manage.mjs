import {spawnSync} from 'node:child_process';
import {readFile,readdir} from 'node:fs/promises';
import {join} from 'node:path';
import assert from 'node:assert/strict';
import {repositoryRoot,loadSites,renderIndex,updateIndex,checkDeployment} from './site-tools.mjs';

const [command='list',selection='all',...extra]=process.argv.slice(2);
try{
 assert(!extra.length,'Usage: node source/manage.mjs list|index|build|check [all|N]');
 const sites=await loadSites();
 const chosen=selection==='all'?sites:sites.filter(s=>String(s.number)===selection);
 assert(chosen.length,'Unknown site number: '+selection);
 if(command==='list')for(const s of chosen)console.log(s.number+'\t'+s.targetDirectory+'\t'+s.project+'\tport '+s.port+'\t'+s.title);
 else if(command==='index')await updateIndex();
 else if(command==='build'||command==='check'){
  for(const site of chosen){
   console.log(command+' '+site.targetDirectory);
   const result=spawnSync(process.execPath,['scripts/'+command+'.mjs'],{cwd:join(repositoryRoot,'source',site.project),stdio:'inherit'});
   if(result.error)throw result.error;assert.equal(result.status,0,site.targetDirectory+' '+command+' failed');
   if(command==='check')await checkDeployment(site);
  }
  if(command==='build')await updateIndex();
  else{
   assert.equal(await readFile(join(repositoryRoot,'index.html'),'utf8'),renderIndex(sites),'Run node source/manage.mjs index to refresh the site list');
   const directories=(await readdir(repositoryRoot,{withFileTypes:true})).filter(f=>f.isDirectory()&&/^test-site-\d+$/.test(f.name)).map(f=>f.name);
   for(const directory of directories)assert(sites.some(s=>s.targetDirectory===directory),'Unregistered deployment: '+directory);
   console.log('Site registry, root index and deployment files OK');
  }
 }else throw new Error('Usage: node source/manage.mjs list|index|build|check [all|N]');
}catch(error){console.error(error.message);process.exitCode=1;}
