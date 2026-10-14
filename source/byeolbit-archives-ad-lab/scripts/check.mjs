import {readdir,readFile,stat} from 'node:fs/promises';
import {resolve,join} from 'node:path';
import {spawnSync} from 'node:child_process';
import {Script} from 'node:vm';
import assert from 'node:assert/strict';
import * as sourceModule from '../src/fixtures.mjs';
import {siteForProject,checkManifest,checkDeployment} from '../../site-tools.mjs';
const root=resolve('dist');
async function walk(dir){return (await Promise.all((await readdir(dir,{withFileTypes:true})).map(f=>f.isDirectory()?walk(join(dir,f.name)):join(dir,f.name)))).flat();}
const files=await walk(root);let html=0,refs=0;
for(const file of files){const source=await readFile(file,'utf8');if(file.endsWith('.js')){const r=spawnSync(process.execPath,['--check',file],{encoding:'utf8'});assert.equal(r.status,0,r.stderr);}if(!file.endsWith('.html'))continue;html++;assert(source.includes('charset="utf-8"'));for(const match of source.matchAll(/<(?:a|link|script|iframe|img)\b[^>]*\b(?:href|src)="([^"]*)"/g)){const raw=match[1].replaceAll('&amp;','&');if(/^(?:https?:|data:|#)/.test(raw))continue;const u=new URL(raw,'file:///'+file.replaceAll('\\','/'));let p=decodeURIComponent(u.pathname).replace(/^\/([A-Za-z]:)/,'$1');if((await stat(p)).isDirectory())p=join(p,'index.html');assert((await stat(p)).isFile(),file+': '+raw);refs++;}for(const m of source.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g))if(m[1].trim())new Script(m[1],{filename:file});if(!file.includes(join('dist','lab')))assert(!/href="[^\"]*(?:lab\/|ground-truth|manifest\.json)/.test(source));}
const site=await siteForProject(import.meta.url);
const counts=await checkManifest(site,sourceModule);
const deploymentFiles=await checkDeployment(site);
console.log(JSON.stringify({ok:true,site:site.targetDirectory,htmlDocuments:html,localReferences:refs,deploymentFiles,...counts}));
