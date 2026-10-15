// Deliberately imperfect result used to verify the local comparison tool.
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import {siteForProject} from '../../site-tools.mjs';
const site=await siteForProject(import.meta.url);
const manifest=JSON.parse(await readFile('reference/ground-truth.json','utf8'));
const base=new URL(process.env.ENTRY_URL||`http://127.0.0.1:${process.env.PORT||site.port}/`);
const expected=manifest.cases.flatMap(c=>c.techniques.map(t=>({id:`${c.caseId}_${t}`,url:new URL(c.page,base).href,is_violation:true,location:[...c.frames.map(f=>`iframe[src="${new URL(f.src,base).href}"]`),c.selector].join(' >>> '),evidence_text:c.text,technique:t})));
expected[0].location='p'; // Ambiguous selector: FP, and expected target FN.
expected.splice(1,1); // Missing target: second FN.
expected[2].location='.article-body .entry-fragment .excerpt'; // Equivalent selector must count as TP.
expected.push({...expected[1],id:'duplicate_with_new_id'}); // Duplicate detection must count only once.
const normal=manifest.negativeControls[0];
expected.push({id:'false_positive',url:new URL(normal.page,base).href,is_violation:true,location:normal.selector,evidence_text:normal.text,technique:'OFFSCREEN'});
expected.push({id:'missing_required_field',url:new URL(normal.page,base).href,is_violation:true,location:normal.selector,evidence_text:normal.text});
const now=new Date().toISOString();
await mkdir('tmp',{recursive:true});
await writeFile('tmp/qa-result.json',JSON.stringify({meta:{topic:'TOPIC',entry_url:new URL('index.html',base).href,started_at:now,finished_at:now,elapsed_sec:42},findings:expected},null,2));
console.log('Expected: TP 38, FN 2, FP 2, field errors 1, duplicates 1.');
