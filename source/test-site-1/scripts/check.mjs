import { readdir, readFile, stat } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { Script } from 'node:vm';
import { spawnSync } from 'node:child_process';
import assert from 'node:assert/strict';
import * as sourceModule from '../src/fixtures.mjs';
import {siteForProject,checkManifest,checkDeployment} from '../../site-tools.mjs';
const root=resolve('dist');
async function walk(dir){const files=[];for(const f of await readdir(dir,{withFileTypes:true})){const p=join(dir,f.name);files.push(...(f.isDirectory()?await walk(p):[p]));}return files;}
const files=await walk(root);let refs=0,html=0;
for(const file of files){
 if(file.endsWith('.js')){const checked=spawnSync(process.execPath,['--check',file],{encoding:'utf8'});assert.equal(checked.status,0,checked.stderr);}
 if(!file.endsWith('.html'))continue;html++;const text=await readFile(file,'utf8');assert(text.includes('charset="utf-8"'),file+' must declare UTF-8');
 for(const match of text.matchAll(/<(?:a|link|script|iframe)\b[^>]*\b(?:href|src)="([^"]*)"/g)){const raw=match[1].replace(/&amp;/g,'&');if(/^(?:https?:|data:|#|mailto:)/.test(raw))continue;const url=new URL(raw,'file:///'+file.replaceAll('\\','/'));let p=decodeURIComponent(url.pathname).replace(/^\/([A-Za-z]:)/,'$1');if((await stat(p)).isDirectory())p=join(p,'index.html');assert((await stat(p)).isFile(),`${file}: missing ${raw}`);refs++;}
 for(const match of text.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)){if(match[1].trim())new Script(match[1],{filename:file});}
 if(!file.includes(join('dist','lab')))assert(!/href="[^\"]*\/lab\//.test(text),'Target must not link to answer room');
}
const site=await siteForProject(import.meta.url);
const counts=await checkManifest(site,sourceModule);
const deploymentFiles=await checkDeployment(site);
console.log(JSON.stringify({ok:true,site:site.targetDirectory,htmlDocuments:html,localReferences:refs,deploymentFiles,...counts}));
