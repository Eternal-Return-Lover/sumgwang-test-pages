/**
 * Local deployment regression: N|all [--baseline=REF] [--concurrency=3] [--chrome=PATH].
 * No build, installation, or Git mutation. Output: repository/tmp/verification/.
 * The coordinator must finish the build and stop core edits before starting this check.
 */
import assert from 'node:assert/strict';
import {spawn,execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {existsSync} from 'node:fs';
import {mkdir,readFile,readdir,writeFile} from 'node:fs/promises';
import {createRequire} from 'node:module';
import {dirname,isAbsolute,join,relative,resolve,sep,posix} from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
function findRepository(start){
 let dir=resolve(start);
 for(;;){if(existsSync(join(dir,'source/sites.json'))&&existsSync(join(dir,'.git')))return dir;
 const parent=dirname(dir);if(parent===dir)throw Error('Cannot find repository from '+start);dir=parent;}
}
const root=findRepository(dirname(fileURLToPath(import.meta.url)));
const args=process.argv.slice(2),selection=args.shift();
assert(selection==='all'||/^[1-9]\d*$/.test(selection||''),'Usage: node source/verify-deployment.mjs N|all [--baseline=REF] [--concurrency=3] [--chrome=PATH]');
const options={baseline:'HEAD',concurrency:3,chrome:process.env.CHROME_PATH||process.env.PLAYWRIGHT_CHROME_EXECUTABLE||''};
for(const arg of args){const m=arg.match(/^--(baseline|concurrency|chrome)=(.+)$/);assert(m,'Unknown option: '+arg);options[m[1]]=m[1]==='concurrency'?Number(m[2]):m[2];}
assert(Number.isInteger(options.concurrency)&&options.concurrency>=1&&options.concurrency<=4,'concurrency must be 1 through 4');
const evidence=join(root,'tmp/verification'),reportFile=join(evidence,'deployment-'+selection+'-report.json');
const sha=bytes=>createHash('sha256').update(bytes).digest('hex');
const git=(args,opts={})=>execFileSync('git',['-c','safe.directory='+root.replaceAll('\\','/'),...args],{cwd:root,maxBuffer:150*1024*1024,...opts});
const baselineHead=git(['rev-parse',options.baseline],{encoding:'utf8'}).trim();
const startHead=git(['rev-parse','HEAD'],{encoding:'utf8'}).trim();
const allSites=JSON.parse(await readFile(join(root,'source/sites.json'),'utf8'));
const sites=selection==='all'?allSites:allSites.filter(s=>s.number===Number(selection));
assert(sites.length,'Unregistered site: '+selection);
const {buildDirectoryFor}=await import(pathToFileURL(join(root,'source/site-tools.mjs')).href);
assert.equal(typeof buildDirectoryFor,'function','Missing buildDirectoryFor export');
const buildPaths=new Map(allSites.map(site=>[site.number,buildDirectoryFor(site,root)]));
for(const [n,path]of buildPaths){const rel=relative(root,path);assert(isAbsolute(path)&&rel&&rel!=='..'&&!rel.startsWith('..'+sep)&&!isAbsolute(rel),'Build path outside repository: '+n);}
const report={status:'RUNNING',baselineRef:options.baseline,baselineHead,startHead,branch:git(['branch','--show-current'],{encoding:'utf8'}).trim(),startedAt:new Date().toISOString(),
 scope:{selection,siteNumbers:sites.map(s=>s.number),contexts:['source','prefix','standalone'],viewports:[1440,390,320],concurrency:options.concurrency,fullBfsRerun:false,bfsScopeReason:'Public bytes are compared to baseline; real entry links and representative frame paths are rechecked.',manualVisualReviewPerformed:false,historicalEvidenceExecuted:false,remoteDeploymentTested:false,buildInstallGitMutationsPerformed:false,note:'Local deployment regression; not an official score or detector performance test.'},
 preservation:{},tests:[],failures:[],harnessAdjustments:[]};
let saveQueue=Promise.resolve();
function save(){const content=JSON.stringify(report,null,2)+'\n';saveQueue=saveQueue.then(()=>writeFile(reportFile,content));return saveQueue;}
async function walk(dir,{skip=()=>false}={}){const files=[];for(const item of await readdir(dir,{withFileTypes:true})){const path=join(dir,item.name);if(skip(path,item))continue;assert(!item.isSymbolicLink(),'Unsupported symlink: '+path);if(item.isDirectory())files.push(...await walk(path,{skip}));else if(item.isFile())files.push(path);}return files;}
const repoPath=path=>relative(root,path).replaceAll('\\','/');
async function coreSnapshot(){
 const paths=await walk(join(root,'source'),{skip:(path,item)=>item.isDirectory()?['artifacts','node_modules','dist'].includes(item.name):/\.md$/i.test(item.name)});
 if(existsSync(join(root,'validator')))paths.push(...await walk(join(root,'validator')));
 for(const name of['index.html','package.json','package-lock.json','.gitignore'])if(existsSync(join(root,name)))paths.push(join(root,name));
 for(const site of allSites){paths.push(...await walk(join(root,'test-site-'+site.number)));if(existsSync(buildPaths.get(site.number)))paths.push(...await walk(buildPaths.get(site.number)));}
 const files={};for(const path of[...new Set(paths)].sort((a,b)=>repoPath(a).localeCompare(repoPath(b),'en')))files[repoPath(path)]=sha(await readFile(path));
 return{fileCount:Object.keys(files).length,files,aggregate:sha(Buffer.from(JSON.stringify(files)))};
}
async function preservation(){
 const previous=JSON.parse(git(['show',baselineHead+':source/sites.json'],{encoding:'utf8'}));
 const result={publicFiles:0,publicByteIdentical:true,manifests:[],newSites:[]};
 for(const site of sites){
  assert.equal(site.project,'test-site-'+site.number);const project='source/'+site.project;
  const manifest=JSON.parse(await readFile(join(root,project,'reference/ground-truth.json'),'utf8'));
  assert.deepEqual(JSON.parse(await readFile(join(buildPaths.get(site.number),'lab/manifest.json'),'utf8')),manifest);
  assert.equal(manifest.deployment.sourceDirectory,project);assert.equal(manifest.deployment.targetDirectory,'test-site-'+site.number);
  const before=previous.find(s=>s.number===site.number);
  if(!before){result.newSites.push(site.number);result.manifests.push({site:site.number,status:'NEW'});continue;}
  assert.deepEqual(site,before,'Existing registry entry changed: '+site.number);
  const prior=JSON.parse(git(['show',baselineHead+':source/'+before.project+'/reference/ground-truth.json'],{encoding:'utf8'}));
  const normalized=structuredClone(manifest);normalized.deployment.sourceDirectory=prior.deployment.sourceDirectory;
  assert.deepEqual(normalized,prior,'Ground truth changed beyond deployment.sourceDirectory: '+site.number);
  result.manifests.push({site:site.number,status:'PRESERVED',allowedMetadataChanges:['deployment.sourceDirectory']});
  const target='test-site-'+site.number;
  const tree=git(['ls-tree','-r','-z',baselineHead,'--',target]).toString('utf8').split('\0').filter(Boolean).map(record=>{const m=record.match(/^(\d+) blob ([0-9a-f]+)\t(.+)$/);assert(m,record);return{oid:m[2],path:m[3]};});
  assert.deepEqual((await walk(join(root,target))).map(repoPath).sort(),tree.map(e=>e.path).sort(),target+' file list');
  const blobs=git(['cat-file','--batch'],{input:tree.map(e=>e.oid).join('\n')+'\n'});let offset=0;
  for(const entry of tree){const end=blobs.indexOf(10,offset),m=blobs.subarray(offset,end).toString('ascii').match(/^([0-9a-f]+) blob (\d+)$/);assert(m,'Invalid Git blob header');offset=end+1;const size=Number(m[2]);assert((await readFile(join(root,entry.path))).equals(blobs.subarray(offset,offset+size)),'Public bytes changed: '+entry.path);offset+=size+1;}assert.equal(offset,blobs.length);result.publicFiles+=tree.length;
 }
 return result;
}
async function startServer(staticRoot){
 const child=spawn(process.execPath,[join(root,'source/serve.mjs')],{cwd:root,env:{...process.env,PORT:'0',STATIC_ROOT:staticRoot},stdio:['ignore','pipe','pipe']});
 try{const origin=await new Promise((accept,reject)=>{let stdout='',stderr='';const timer=setTimeout(()=>reject(Error('Server startup timeout: '+stderr)),10000);
 child.stderr.on('data',d=>{stderr+=d;});child.once('error',e=>{clearTimeout(timer);reject(e);});child.once('exit',n=>{clearTimeout(timer);reject(Error('Server exited '+n+': '+stderr));});
 child.stdout.on('data',d=>{stdout+=d;const m=stdout.match(/http:\/\/127\.0\.0\.1:\d+\/?/);if(m){clearTimeout(timer);accept(m[0].replace(/\/?$/,'/'));}});});return{origin,child};}catch(e){child.kill();throw e;}
}
async function download(page,selector){
 const event=page.waitForEvent('download');await page.locator(selector).click();const item=await event,stream=await item.createReadStream(),chunks=[];for await(const chunk of stream)chunks.push(chunk);
 const bytes=Buffer.concat(chunks);assert(!bytes.subarray(0,3).equals(Buffer.from([239,187,191])),'Downloaded JSON BOM');
 return{data:JSON.parse(bytes.toString('utf8')),bytes:bytes.length,sha256:sha(bytes),filename:item.suggestedFilename()};
}
const locationFor=(entry,base)=>[...entry.frames.map(f=>'iframe[src="'+new URL(f.src,base).href+'"]'),entry.selector].join(' >>> ');
function relativeLocationFor(entry,base){let owner=new URL(entry.page,base);const parts=[];for(const f of entry.frames){const target=new URL(f.src,base);parts.push('iframe[src="'+posix.relative(posix.dirname(owner.pathname),target.pathname)+target.search+'"]');owner=target;}return[...parts,entry.selector].join(' >>> ');}
function findingsFor(manifest,base){return manifest.cases.flatMap(c=>c.techniques.map(technique=>({id:c.caseId+'_'+technique,url:new URL(c.page,base).href,is_violation:true,location:locationFor(c,base),evidence_text:c.text,technique})));}
async function readMetrics(page,site,forceText=false){
 return page.locator('#score-output').evaluate((el,opts)=>{
  if(el.dataset.result&&!opts.forceText)return{...JSON.parse(el.dataset.result),source:'dataset'};
  if(opts.number!==1&&!opts.forceText)throw Error('Missing comparison result dataset');
  const labels={'정탐 TP':'tp','미탐 FN':'fn','오탐 FP':'fp','필드 오류':'invalid'},result={source:'legacy text'};
  for(const item of el.querySelectorAll('.score-metrics > div')){const label=[...item.childNodes].filter(n=>n.nodeType===Node.TEXT_NODE).map(n=>n.textContent).join('').trim(),text=item.querySelector('strong')?.textContent.trim();if(labels[label]&&/^\d+$/.test(text||''))result[labels[label]]=Number(text);}
  const dup=el.textContent.match(/중복\s+(\d+)건\s+통합/);if(dup)result.duplicates=Number(dup[1]);return result;
 },{number:site.number,forceText});
}
async function upload(page,value,{raw=false}={}){
 const buffer=raw?Buffer.from(value):Buffer.from(JSON.stringify(value));
 await page.locator('#score-output').evaluate(el=>{delete el.dataset.result;el.textContent='';});
 await page.locator('#result-file').setInputFiles({name:'verification-result.json',mimeType:'application/json',buffer});
 await page.waitForFunction(()=>{const output=document.querySelector('#score-output'),input=document.querySelector('#result-file');return input&&!input.disabled&&output&&(output.querySelector('.score-metrics')||output.textContent.startsWith('확인 필요:')||/^5MB/.test(output.textContent));},null,{timeout:180000});
 return page.locator('#score-output').innerText();
}
function assertMetrics(actual,counts,total,name){const expected={tp:0,fp:0,invalid:0,duplicates:0,...counts};expected.fn=total-expected.tp;for(const key of['tp','fn','fp','invalid','duplicates'])assert.equal(actual[key],expected[key],name+' '+key);}
async function probe(context,entry,base){
 const page=await context.newPage();
 try{
  const response=await page.goto(new URL(entry.page,base).href);assert.equal(response.status(),200);
  await page.waitForTimeout((entry.delayMs||0)+(entry.frames.length?700:120));let frame=page.mainFrame();const chain=[];
  for(const f of entry.frames){const node=frame.locator(f.selector);await node.waitFor({state:'attached',timeout:5000});assert.equal(await node.count(),1,entry.caseId+' frame selector');
   const actual=await node.evaluate(el=>({src:el.getAttribute('src'),href:el.src}));assert.equal(actual.href,new URL(f.src,base).href,entry.caseId+' frame src');chain.push({selector:f.selector,...actual});frame=await(await frame.$(f.selector)).contentFrame();assert(frame);}
  const node=frame.locator(entry.selector);await node.waitFor({state:'attached',timeout:5000});assert.equal(await node.count(),1,entry.caseId+' leaf selector');
  const state=await node.evaluate(el=>{const box=el.getBoundingClientRect(),ancestors=[];for(let p=el;p;p=p.parentElement){const s=getComputedStyle(p),r=p.getBoundingClientRect();ancestors.push({tag:p.tagName,opacity:s.opacity,display:s.display,color:s.color,background:s.backgroundColor,fontSize:s.fontSize,fill:s.fill,fillOpacity:s.fillOpacity,x:r.x,y:r.y,width:r.width,height:r.height,right:r.right,bottom:r.bottom});}
   return{text:el.textContent,namespaceURI:el.namespaceURI,codepoints:Array.from(el.textContent,c=>'U+'+c.codePointAt(0).toString(16).toUpperCase()),bounds:{x:box.x,y:box.y,width:box.width,height:box.height},ancestors};});
  assert.equal(state.text,entry.text,entry.caseId+' raw text');
  if(entry.techniques.includes('TRANSPARENT'))assert(state.ancestors.some(s=>s.opacity==='0'||(s.color.startsWith('rgba(')&&parseFloat(s.color.split(',').at(-1))===0)||(s.color===s.background&&s.color!=='rgba(0, 0, 0, 0)')),entry.caseId+' transparent style');
  if(entry.techniques.includes('OFFSCREEN'))assert(state.ancestors.some(s=>s.display==='none'||parseFloat(s.fontSize)<=1||s.right<0||s.bottom<0),entry.caseId+' offscreen style');
  return{caseId:entry.caseId,page:entry.page,delayMs:entry.delayMs,frameChain:chain,...state};
 }finally{await page.close();}
}
async function exerciseFilters(page,manifest){
 const all=[...manifest.cases,...manifest.negativeControls],counts={};
 for(const filter of['all','HOMOGLYPH','JAMO','TRANSPARENT','OFFSCREEN','normal']){await page.locator('[data-filter="'+filter+'"]').click();const expected=filter==='all'?all.length:filter==='normal'?manifest.negativeControls.length:manifest.cases.filter(c=>c.techniques.includes(filter)).length;assert.equal(await page.locator('#case-list .case-row').count(),expected,'Filter '+filter);counts[filter]=expected;}
 await page.locator('[data-filter="all"]').click();await page.locator('#case-search').fill(all[0].caseId);assert(await page.locator('#case-list .case-row').count()>=1);
 await page.locator('#case-search').fill('__verification_no_matching_case__');assert.equal(await page.locator('#case-list .case-row').count(),0);
 await page.locator('#case-search').fill('');assert.equal(await page.locator('#case-list .case-row').count(),all.length);return counts;
}


async function exerciseSubmissions(page,context,site,manifest,base,expected,row){
 const total=expected.findings.length,firstCase=manifest.cases.find(c=>!c.frames.length&&!c.delayMs)||manifest.cases[0];
 const finding=findingsFor({...manifest,cases:[firstCase]},base)[0],meta=structuredClone(expected.meta);
 const make=findings=>({meta:structuredClone(meta),findings});let serial=0;
 const clone=(item=finding)=>({...item,id:'verify_'+(++serial)});
 row.submissions=[];
 async function check(name,data,counts,extra={}){
  const text=await upload(page,data);assert(!text.startsWith('확인 필요:'),name+': '+text);
  const actual=await readMetrics(page,site);assertMetrics(actual,counts,total,name);
  if(extra.text)assert(extra.text.test(text),name+' output text');
  if(extra.noText)assert(!extra.noText.test(text),name+' unexpected output text');
  row.submissions.push({name,status:'PASS',expected:{tp:0,fp:0,invalid:0,duplicates:0,...counts,fn:total-(counts.tp||0)},actual});return text;
 }
 async function reject(name,data,pattern,options){
  const text=await upload(page,data,options);assert(text.startsWith('확인 필요:')||/^5MB/.test(text),name+' was not rejected: '+text);assert(pattern.test(text),name+': '+text);
  row.submissions.push({name,status:'PASS',rejected:true,message:text});
 }
 row.independentProbes=[await probe(context,firstCase,base)];
 const equivalent=':is('+firstCase.selector+')';
 await check('single correct finding and omissions',make([clone()]),{tp:1});
 await check('same node equivalent CSS deduplicates',make([clone(),{...clone(),location:[...firstCase.frames.map(f=>'iframe[src="'+new URL(f.src,base).href+'"]'),equivalent].join(' >>> ')}]),{tp:1,duplicates:1});
 await check('ambiguous leaf selector',make([{...clone(),location:'*'}]),{fp:1});
 await check('missing leaf selector',make([{...clone(),location:'.__verification_missing_node__'}]),{fp:1});
 await check('node identity accepts changed nonempty evidence',make([{...clone(),evidence_text:'verification evidence'}]),{tp:1});
 await check('false violation flag',make([{...clone(),is_violation:false}]),{fp:1});
 await check('duplicate finding ID invalid',make([clone(),{...clone(),id:'same_id'},{...clone(),id:'same_id'}]),{tp:1,invalid:1,duplicates:1});
 const invalid=['id','url','location','evidence_text','technique','is_violation'].map(key=>{const f=clone();delete f[key];return f;});
 invalid.push({...clone(),technique:'UNKNOWN'},{...clone(),url:'not-an-absolute-url'},{...clone(),is_violation:'true'},null,[]);
 await check('missing fields types and unsupported technique',make(invalid),{invalid:invalid.length});
 const normal=manifest.negativeControls.find(c=>!c.frames.length&&!c.delayMs)||manifest.negativeControls[0];assert(normal);
 row.independentProbes.push(await probe(context,normal,base));
 await check('normal control false positive',make([{...clone(),url:new URL(normal.page,base).href,location:locationFor(normal,base),evidence_text:normal.text}]),{fp:1});
 const protocol=new URL(finding.url);protocol.protocol=protocol.protocol==='http:'?'https:':'http:';
 await check('HTTP HTTPS canonical equivalence',make([{...clone(),url:protocol.href+'#ignored-fragment'}]),{tp:1});
 await check('empty findings and denominator',make([]),{},{noText:/NaN|Infinity/});
 for(const elapsed of[0,1800,1801]){const data=make([]);data.meta.elapsed_sec=elapsed;await check('elapsed boundary '+elapsed,data,{},elapsed>1800?{text:/30분 초과/}:{noText:/30분 초과/});}
 const queryCases=manifest.cases.filter(c=>c.page.includes('?'));
 if(queryCases.length){
  const c=queryCases[0];row.independentProbes.push(await probe(context,c,base));const one=findingsFor({...manifest,cases:[c]},base)[0];
  const reordered=new URL(one.url),params=[...reordered.searchParams.entries()].reverse();reordered.search=new URLSearchParams(params).toString();reordered.hash='ignored';
  await check('query order and fragment equivalence',make([{...clone(one),url:reordered.href}]),{tp:1});
  const wrong=new URL(one.url);wrong.searchParams.set([...wrong.searchParams.keys()][0],'__verification_unknown_value__');
  await check('unknown query value is a different URL',make([{...clone(one),url:wrong.href}]),{fp:1});
  const direct=queryCases.filter(c=>!c.frames.length);let pair;
  for(const left of direct){const right=direct.find(c=>c.page!==left.page&&c.selector===left.selector&&new URL(c.page,base).pathname===new URL(left.page,base).pathname&&left.techniques.some(t=>!c.techniques.includes(t)));if(right){pair=[left,right];break;}}
  if(pair){const[left,right]=pair;row.independentProbes.push(await probe(context,right,base));
   const absent=left.techniques.find(t=>!right.techniques.includes(t)),actual=findingsFor({...manifest,cases:[right]},base)[0];
   await check('known different query absent technique FP',make([{...clone(actual),technique:absent,evidence_text:left.text}]),{fp:1});
   const shared=left.techniques.find(t=>right.techniques.includes(t));if(shared)await check('known different query actual shared technique TP',make([{...clone(actual),technique:shared,evidence_text:left.text}]),{tp:1});
  }
 }
 const framed=manifest.cases.filter(c=>c.frames.length).sort((a,b)=>b.frames.length-a.frames.length)[0];
 if(framed){row.independentProbes.push(await probe(context,framed,base));const one=findingsFor({...manifest,cases:[framed]},base)[0];
  await check('nested absolute iframe location',make([clone(one)]),{tp:1});
  // Site 1 retains its legacy relative-src resolution contract; verify its supported absolute chain.
  if(site.number!==1)await check('nested relative iframe src location',make([{...clone(one),location:relativeLocationFor(framed,base)}]),{tp:1});
  await check('wrong iframe src',make([{...clone(one),location:one.location.replace(new URL(framed.frames[0].src,base).href,new URL('widgets/__verification_missing__.html',base).href)}]),{fp:1});
 }
 const queryFrame=queryCases.find(c=>c.frames.length);
 if(queryFrame){row.independentProbes.push(await probe(context,queryFrame,base));const one=findingsFor({...manifest,cases:[queryFrame]},base)[0];
  await check('query parent and exact iframe chain',make([clone(one)]),{tp:1});
  const other=queryCases.find(c=>c.page!==queryFrame.page&&new URL(c.page,base).pathname===new URL(queryFrame.page,base).pathname&&c.frames[0]?.src!==queryFrame.frames[0].src);
  if(other){row.independentProbes.push(await probe(context,other,base));await check('different query cannot reuse original iframe chain',make([{...clone(one),url:new URL(other.page,base).href}]),{fp:1});}
 }
 let siblingPair;
 for(const left of manifest.cases.filter(c=>c.frames.length===1)){
  const right=manifest.cases.find(c=>c!==left&&c.page===left.page&&c.frames.length===1&&c.selector===left.selector&&c.frames[0].src!==left.frames[0].src&&left.techniques.some(t=>!c.techniques.includes(t)));
  if(right){siblingPair=[left,right];break;}
 }
 if(siblingPair){const[left,right]=siblingPair;row.independentProbes.push(await probe(context,left,base),await probe(context,right,base));
  const absent=left.techniques.find(t=>!right.techniques.includes(t)),one=findingsFor({...manifest,cases:[right]},base)[0];
  await check('actual sibling rejects other sibling technique',make([{...clone(one),technique:absent,evidence_text:left.text}]),{fp:1});
  await check('ambiguous sibling iframe selector',make([{...clone(one),location:'iframe >>> '+right.selector}]),{fp:1});
 }
 const delayed=[...manifest.cases,...manifest.negativeControls].sort((a,b)=>b.delayMs-a.delayMs)[0];
 if(delayed?.delayMs)row.independentProbes.push(await probe(context,delayed,base));
 await reject('invalid JSON syntax','{',/JSON/,{raw:true});
 await reject('UTF-8 BOM',Buffer.concat([Buffer.from([239,187,191]),Buffer.from(JSON.stringify(make([])))]),/BOM/,{raw:true});
 await reject('invalid UTF-8',Buffer.from([255,254,253]),/UTF-8/,{raw:true});
 await reject('top-level array',[],/최상위|객체/);
 await reject('extra top-level field',{...make([]),unexpected:true},/최상위/);
 await reject('missing meta',{findings:[]},/meta/);
 const topic=make([]);topic.meta.topic='WRONG';await reject('wrong topic',topic,/topic|TOPIC/);
 const entry=make([]);entry.meta.entry_url=new URL('wrong-entry.html',base).href;await reject('wrong entry',entry,/진입 URL/);
 const negative=make([]);negative.meta.elapsed_sec=-1;await reject('negative elapsed',negative,/elapsed_sec/);
 const string=make([]);string.meta.elapsed_sec='0';await reject('string elapsed',string,/elapsed_sec/);
 const reversed=make([]);reversed.meta.started_at='2026-10-15T01:00:01.000Z';reversed.meta.finished_at='2026-10-15T01:00:00.000Z';await reject('reversed timestamps',reversed,/완료 시각/);
 const date=make([]);date.meta.started_at='invalid';await reject('invalid ISO timestamp',date,/started_at/);
 await reject('findings is not an array',{...make([]),findings:{}},/findings/);
 await reject('too many findings',make(Array(10001).fill({})),/10,000/);
 await reject('file size limit',Buffer.alloc(5*1024*1024+1,32),/5MB/,{raw:true});
}


async function runContext(browser,shared,site,mode){
 const row={site:site.number,mode,status:'RUNNING',phase:'setup',pageErrors:[],httpErrors:[],viewports:[],screenshots:[]};
 report.tests.push(row);await save();let context,standalone;
 try{
  const project='source/'+site.project,manifest=JSON.parse(await readFile(join(root,project,'reference/ground-truth.json'),'utf8'));
  const total=manifest.cases.reduce((n,c)=>n+c.techniques.length,0),elements=manifest.cases.length+manifest.negativeControls.length;
  let origin=shared.origin;if(mode==='standalone'){standalone=await startServer(buildPaths.get(site.number));origin=standalone.origin;}
  const prefix=mode==='prefix'?'/sumgwang-test-pages/':'/';
  const base=mode==='standalone'?origin:new URL(prefix+'test-site-'+site.number+'/',origin).href;
  const lab=mode==='standalone'?new URL('lab/index.html',origin).href:new URL(prefix+project+'/lab/index.html',origin).href;
  Object.assign(row,{base,lab,expectedFindings:total,expectedElements:elements});
  context=await browser.newContext({viewport:{width:1440,height:1000}});
  await context.grantPermissions(['clipboard-read','clipboard-write'],{origin:new URL(lab).origin});
  if(mode==='prefix')await context.route('**/sumgwang-test-pages/**',async route=>{const url=new URL(route.request().url()),mapped=new URL(url.pathname.slice('/sumgwang-test-pages/'.length)+url.search,shared.origin);const response=await route.fetch({url:mapped.href});await route.fulfill({response});});
  context.on('page',page=>{
   page.on('pageerror',e=>row.pageErrors.push(e.message));
   page.on('response',response=>{if(response.status()>=400&&!(response.status()===404&&response.url()===base+'lab/index.html'))row.httpErrors.push({url:response.url(),status:response.status()});});
  });
  const page=await context.newPage();let response=await page.goto(base+manifest.entry);assert.equal(response.status(),200,'Target entry HTTP');
  const links=await page.locator('a[href]').evaluateAll(ns=>ns.map((n,index)=>({index,href:n.href,target:n.target})));
  const target=links.find(l=>typeof l.href==='string'&&l.href.startsWith(base)&&l.target!=='_blank'&&new URL(l.href).pathname!==new URL(base+manifest.entry).pathname&&!l.href.includes('#')&&!l.href.includes('/lab/'));
  assert(target,'Entry must have a real internal link');await page.locator('a[href]').nth(target.index).click();await page.waitForURL(target.href);
  row.actualEntryLink={href:target.href,reached:page.url()};
  response=await page.goto(lab);assert.equal(response.status(),200,'Lab HTTP');
  await page.waitForFunction(n=>document.querySelector('#stat-findings')?.textContent===String(n),total,{timeout:15000});
  assert.equal(await page.locator('#entry-url').textContent(),base+manifest.entry,'Lab deployment entry');
  const loaded=await page.evaluate(async()=>{const value=document.querySelector('[data-manifest]')?.getAttribute('data-manifest');if(!value)throw Error('Missing data-manifest');const url=new URL(value,document.baseURI).href,response=await fetch(url);return{value,url,status:response.status,data:await response.json()};});
  assert.equal(loaded.value,mode==='standalone'?'manifest.json':'../reference/ground-truth.json');assert.equal(loaded.status,200);assert.deepEqual(loaded.data,manifest);
  row.manifestConfig={value:loaded.value,url:loaded.url,status:loaded.status};
  const truth=await download(page,'#download-manifest');assert.deepEqual(truth.data,manifest);
  const expected=await download(page,'#download-result');assert.equal(expected.data.meta.entry_url,base+manifest.entry);assert.equal(expected.data.meta.topic,'TOPIC');assert.deepEqual(expected.data.findings,findingsFor(manifest,base));
  row.downloads={groundTruth:{bytes:truth.bytes,sha256:truth.sha256,filename:truth.filename},expected:{bytes:expected.bytes,sha256:expected.sha256,filename:expected.filename,entry:expected.data.meta.entry_url,findings:expected.data.findings.length,uniqueUrls:new Set(expected.data.findings.map(f=>f.url)).size}};
  await page.locator('#copy-entry').click();assert.equal(await page.evaluate(()=>navigator.clipboard.readText()),base+manifest.entry);row.clipboard=true;
  row.filters=await exerciseFilters(page,manifest);
  row.phase='negative and canonical submissions';await save();
  await exerciseSubmissions(page,context,site,manifest,base,expected.data,row);
  row.phase='perfect comparison';await save();
  const text=await upload(page,expected.data);assert(!text.startsWith('확인 필요:'),text);
  row.perfectComparison=await readMetrics(page,site);assertMetrics(row.perfectComparison,{tp:total},total,'Perfect comparison');
  if(site.number===1){row.legacyFallback=await readMetrics(page,site,true);assertMetrics(row.legacyFallback,{tp:total},total,'Site 1 text fallback');}
  console.log('COMPARISON PASS',site.number,mode,'TP',total,'submissions',row.submissions.length);
  row.phase='full DOM audit';await save();await page.locator('#audit').click();
  await page.waitForFunction(()=>document.querySelector('#audit-status')?.textContent.startsWith('검증 완료'),null,{timeout:180000});
  const status=await page.locator('#audit-status').innerText();assert(status.includes(elements+' / '+elements),status);assert.equal(await page.locator('.case-result.fail').count(),0);
  row.domAudit={elements,status,failures:0};
  for(const width of[1440,390,320]){
   await page.setViewportSize({width,height:width===1440?1000:844});
   const layout=await page.evaluate(()=>({viewport:innerWidth,scrollWidth:document.documentElement.scrollWidth,heading:document.querySelector('h1')?.textContent}));
   assert(layout.scrollWidth<=width,site.number+' '+mode+' overflow at '+width);row.viewports.push({width,...layout,overflow:false});
   if(selection!=='all'||[1,10].includes(site.number)){
    await page.evaluate(()=>scrollTo(0,0));const top='deployment-'+site.number+'-'+mode+'-'+width+'-top.png';await page.screenshot({path:join(evidence,top)});
    await page.locator('#score-output').scrollIntoViewIfNeeded();const score='deployment-'+site.number+'-'+mode+'-'+width+'-score.png';await page.screenshot({path:join(evidence,score)});row.screenshots.push(top,score);
   }
  }
  if(mode!=='standalone'){row.publicLabStatus=await page.evaluate(async base=>(await fetch(base+'lab/index.html')).status,base);assert.equal(row.publicLabStatus,404,'Target must not expose lab');}else row.standaloneLabAvailable=true;
  assert.deepEqual(row.pageErrors,[],'JavaScript errors');assert.deepEqual(row.httpErrors,[],'Unexpected HTTP errors');
  row.status='PASS';row.phase='complete';console.log('CONTEXT PASS',site.number,mode,'DOM',elements,'TP',total);
 }catch(e){row.status='FAIL';row.failure={message:e.message,stack:e.stack};report.failures.push({site:site.number,mode,phase:row.phase,...row.failure});console.error('CONTEXT FAIL',site.number,mode,e.message);}
 finally{await context?.close();standalone?.child.kill();await save();}
}
let browser,shared;
await mkdir(evidence,{recursive:true});
try{
 report.coreStart=await coreSnapshot();report.preservation=await preservation();await save();
 const require=createRequire(join(root,'package.json')),{chromium}=require('playwright');
 const installedChrome='C:/Program Files/Google/Chrome/Application/chrome.exe',executablePath=options.chrome||(existsSync(installedChrome)?installedChrome:undefined);
 browser=await chromium.launch(executablePath?{executablePath,headless:true}:{channel:'chrome',headless:true});shared=await startServer(root);
 let next=0;await Promise.all(Array.from({length:Math.min(options.concurrency,sites.length)},async()=>{while(next<sites.length){const site=sites[next++];for(const mode of['source','prefix','standalone'])await runContext(browser,shared,site,mode);}}));
 report.coreEnd=await coreSnapshot();report.coreChanges=[...new Set([...Object.keys(report.coreStart.files),...Object.keys(report.coreEnd.files)])].filter(p=>report.coreStart.files[p]!==report.coreEnd.files[p]);
 assert.deepEqual(report.coreEnd,report.coreStart,'Execution core changed during verification');assert.equal(git(['rev-parse','HEAD'],{encoding:'utf8'}).trim(),startHead,'HEAD changed during verification');
 report.summary={contexts:report.tests.length,passed:report.tests.filter(t=>t.status==='PASS').length,comparisons:report.tests.filter(t=>t.perfectComparison).length,negativeAndCanonicalSubmissions:report.tests.reduce((n,t)=>n+(t.submissions?.length||0),0),domAudits:report.tests.filter(t=>t.domAudit).length,totalElementsAudited:report.tests.reduce((n,t)=>n+(t.domAudit?.elements||0),0),viewports:report.tests.reduce((n,t)=>n+t.viewports.length,0),independentProbes:report.tests.reduce((n,t)=>n+(t.independentProbes?.length||0),0),publicFilesByteIdentical:report.preservation.publicFiles,coreUnchanged:report.coreChanges.length===0};
 assert.equal(report.tests.length,sites.length*3,'Missing deployment context');assert.equal(report.failures.length,0,'Deployment context failed');report.status='PASS';
}catch(e){report.status='FAIL';report.failures.push({phase:'setup/preservation/final validation',message:e.message,stack:e.stack});console.error('VERIFICATION FAIL',e.message);}
finally{await browser?.close();shared?.child.kill();report.finishedAt=new Date().toISOString();await save();await saveQueue;console.log('FINAL',JSON.stringify({status:report.status,summary:report.summary,failures:report.failures}));if(report.status!=='PASS')process.exitCode=1;}
