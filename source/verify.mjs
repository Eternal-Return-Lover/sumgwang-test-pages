import {spawnSync} from 'node:child_process';
import {existsSync} from 'node:fs';
import {join} from 'node:path';
import assert from 'node:assert/strict';
import {repositoryRoot,loadSites,buildDirectoryFor} from './site-tools.mjs';
const selection=process.argv[2]||'all',sites=(await loadSites()).filter(s=>selection==='all'||String(s.number)===selection);
assert(sites.length,'Unknown site number: '+selection);
for(const site of sites){
 assert(existsSync(join(buildDirectoryFor(site),'index.html')),'Run npm run build -- '+site.number+' first');
 const project=join(repositoryRoot,'source',site.project);
 const scripts=site.number===1?[]:['browser-check.mjs'];
 for(const extra of['independent-check.mjs','mobile-interactions.mjs'])if(existsSync(join(project,'scripts',extra)))scripts.push(extra);
 if(site.number===1){const result=spawnSync(process.execPath,[join(repositoryRoot,'source/verify-deployment.mjs'),'1'],{cwd:repositoryRoot,stdio:'inherit'});if(result.error)throw result.error;assert.equal(result.status,0);}
 for(const script of scripts){const result=spawnSync(process.execPath,['scripts/'+script],{cwd:project,stdio:'inherit'});if(result.error)throw result.error;assert.equal(result.status,0,site.project+' '+script+' failed');}
}
