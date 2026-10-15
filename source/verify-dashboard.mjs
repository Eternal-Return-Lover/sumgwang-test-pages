/**
 * Independent dashboard regression. Run after the coordinator finishes the build.
 * node source/verify-dashboard.mjs all|N [--prefix] [--baseline=REF] [--concurrency=2]
 * --prefix adds a GitHub Pages prefix context to the normal root context.
 * No build/install/Git mutation. Evidence goes only to tmp/verification/dashboard/.
 */
import assert from 'node:assert/strict';
import {spawn,execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {existsSync} from 'node:fs';
import {mkdir,readFile,readdir,writeFile,stat} from 'node:fs/promises';
import {createRequire} from 'node:module';
import {dirname,join,relative,resolve,posix} from 'node:path';
import {fileURLToPath} from 'node:url';

function findRepository(start){
 let dir=resolve(start);
 for(;;){if(existsSync(join(dir,'package.json'))&&existsSync(join(dir,'source/sites.json')))return dir;
 const parent=dirname(dir);if(parent===dir)throw Error('Repository root not found');dir=parent;}
}
const root=findRepository(dirname(fileURLToPath(import.meta.url)));
const cli=process.argv.slice(2),selection=cli.shift();
assert(selection==='all'||/^[1-9]\d*$/.test(selection||''),'Usage: node source/verify-dashboard.mjs all|N [--prefix] [--baseline=REF] [--concurrency=2]');
const options={prefix:false,baseline:'HEAD',concurrency:2,chrome:process.env.CHROME_PATH||process.env.PLAYWRIGHT_CHROME_EXECUTABLE||''};
for(const arg of cli){if(arg==='--prefix'){options.prefix=true;continue;}const m=arg.match(/^--(baseline|concurrency|chrome)=(.+)$/);assert(m,'Unknown option: '+arg);options[m[1]]=m[1]==='concurrency'?Number(m[2]):m[2];}
assert(Number.isInteger(options.concurrency)&&options.concurrency>=1&&options.concurrency<=4);
const output=join(root,'tmp/verification/dashboard'),reportFile=join(output,'dashboard-'+selection+(options.prefix?'-prefix':'')+'-report.json');
const sha=bytes=>createHash('sha256').update(bytes).digest('hex');
const git=(args,opts={})=>execFileSync('git',['-c','safe.directory='+root.replaceAll('\\','/'),...args],{cwd:root,maxBuffer:150*1024*1024,...opts});
const report={status:'RUNNING',startedAt:new Date().toISOString(),selection,options,tests:[],failures:[],harnessAdjustments:[],
 scope:{representativeStateProfiles:['root:1','root:2'],localOnly:true,fullBfsRerun:false,remoteStaticDeploymentChecked:false,buildInstallGitMutationsPerformed:false,manualVisualReviewPerformed:false}};
let saves=Promise.resolve();
function save(){const bytes=JSON.stringify(report,null,2)+'\n';saves=saves.then(()=>writeFile(reportFile,bytes));return saves;}
async function walk(dir,{skip=()=>false}={}){const paths=[];for(const e of await readdir(dir,{withFileTypes:true})){const p=join(dir,e.name);if(skip(p,e))continue;assert(!e.isSymbolicLink(),'Unexpected symlink: '+p);if(e.isDirectory())paths.push(...await walk(p,{skip}));else paths.push(p);}return paths;}
const repoPath=p=>relative(root,p).replaceAll('\\','/');
async function snapshot(allSites){
 const paths=await walk(join(root,'source'),{skip:(p,e)=>e.isDirectory()?['node_modules','dist','artifacts'].includes(e.name):/\.md$/i.test(e.name)});
 paths.push(...await walk(join(root,'validator')));
 for(const s of allSites)paths.push(...await walk(join(root,'test-site-'+s.number)));
 for(const p of ['index.html','package.json','package-lock.json','.gitignore'])if(existsSync(join(root,p)))paths.push(join(root,p));
 const files={};for(const p of [...new Set(paths)].sort((a,b)=>repoPath(a).localeCompare(repoPath(b),'en')))files[repoPath(p)]=sha(await readFile(p));
 return{fileCount:Object.keys(files).length,files,aggregate:sha(Buffer.from(JSON.stringify(files)))};
}
async function preservation(allSites,baselineHead){
 const targets=allSites.map(s=>'test-site-'+s.number),references=allSites.map(s=>'source/'+s.project+'/reference');
 const roots=[...targets,...references],actual=(await Promise.all(roots.map(p=>walk(join(root,p))))).flat().map(repoPath).sort();
 actual.push('source/sites.json');actual.sort();
 const records=git(['ls-tree','-r','-z',baselineHead,'--',...roots,'source/sites.json']).toString('utf8').split('\0').filter(Boolean).map(r=>{
  const m=r.match(/^(\d+) blob ([0-9a-f]+)\t(.+)$/);assert(m,r);return{oid:m[2],path:m[3]};});
 assert.deepEqual(actual,records.map(r=>r.path).sort(),'Public/reference file list changed');
 const bytes=git(['cat-file','--batch'],{input:records.map(r=>r.oid).join('\n')+'\n'});let offset=0;
 const files={};for(const r of records){const end=bytes.indexOf(10,offset),m=bytes.subarray(offset,end).toString('ascii').match(/^([0-9a-f]+) blob (\d+)$/);assert(m);offset=end+1;const length=Number(m[2]),original=bytes.subarray(offset,offset+length),current=await readFile(join(root,r.path));assert(current.equals(original),'Preserved content changed: '+r.path);files[r.path]=sha(current);offset+=length+1;}assert.equal(offset,bytes.length);
 return{status:'PASS',publicFiles:records.filter(r=>/^test-site-\d+\//.test(r.path)).length,referenceFiles:records.filter(r=>/\/reference\//.test(r.path)).length,registryByteIdentical:true,publicAndAllReferencesByteIdentical:true,files,aggregate:sha(Buffer.from(JSON.stringify(files)))};
}
async function startServer(){
 const child=spawn(process.execPath,[join(root,'source/serve.mjs')],{cwd:root,env:{...process.env,PORT:'0',STATIC_ROOT:root},stdio:['ignore','pipe','pipe']});
 try{const origin=await new Promise((accept,reject)=>{let text='',errors='';const timer=setTimeout(()=>reject(Error('Server startup timeout '+errors)),10000);
 child.stderr.on('data',d=>{errors+=d;});child.once('error',e=>{clearTimeout(timer);reject(e);});child.once('exit',c=>{clearTimeout(timer);reject(Error('Server exited '+c+' '+errors));});
 child.stdout.on('data',d=>{text+=d;const m=text.match(/http:\/\/127\.0\.0\.1:\d+\/?/);if(m){clearTimeout(timer);accept(m[0].replace(/\/?$/,'/'));}});});return{origin,child};}catch(e){child.kill();throw e;}
}
const locationFor=(c,base)=>[...c.frames.map(f=>'iframe[src="'+new URL(f.src,base).href+'"]'),c.selector].join(' >>> ');
const findingFor=(c,base,technique=c.techniques[0])=>({id:c.caseId+'_'+technique,url:new URL(c.page,base).href,is_violation:true,location:locationFor(c,base),evidence_text:c.text,technique});
function remapReference(reference,manifest,base){
 const before=new URL('./',reference.meta.entry_url);
 const map=value=>{const u=new URL(value);assert.equal(u.origin,before.origin);assert(u.pathname.startsWith(before.pathname),'Unexpected reference URL '+value);return new URL(u.pathname.slice(before.pathname.length)+u.search+u.hash,base).href;};
 const data=structuredClone(reference);
 data.meta.entry_url=map(data.meta.entry_url);data.meta.started_at='2026-01-01T00:00:00.000Z';data.meta.finished_at='2026-01-01T00:00:00.000Z';data.meta.elapsed_sec=0;
 data.findings=data.findings.map(f=>({...f,url:map(f.url),location:f.location.replace(/iframe\[src=(["'])(.*?)\1\]/g,(_,quote,url)=>'iframe[src='+quote+map(url)+quote+']')}));
 assert.deepEqual(data.findings,manifest.cases.flatMap(c=>c.techniques.map(t=>findingFor(c,base,t))),'Reference remapping differs from manifest-derived expectations');
 return data;
}
function relativeFrames(c,base){let owner=new URL(c.page,base);const chain=[];for(const f of c.frames){const target=new URL(f.src,base);chain.push('iframe[src="'+posix.relative(posix.dirname(owner.pathname),target.pathname)+target.search+'"]');owner=target;}return[...chain,c.selector].join(' >>> ');}

/* Public UI adapter. Keep implementation-dependent selectors in this one block. */
const UI={site:'#site-select',file:'#result-file',compare:'#compare-button',status:'#app-status',results:'#results',
 reset:'#reset-button',diagnostics:'#diagnostic-list',rows:'.diagnostic[data-type]',search:'#diagnostic-search',filter:'#diagnostic-filter'};
async function reset(page,site){
 await page.locator(UI.reset).click();
 assert.equal(await page.locator(UI.file).evaluate(el=>el.files.length),0,'Reset must clear file');
 assert(!await page.locator(UI.results).getAttribute('data-result'),'Reset must clear result');
 await page.locator(UI.site).selectOption(String(site.number));
 await page.waitForFunction(({file,status})=>!document.querySelector(file)?.disabled&&['idle','ready'].includes(document.querySelector(status)?.dataset.state),UI,{timeout:15000});
}
async function readResult(page){
 const text=await page.locator(UI.results).getAttribute('data-result');assert(text,'Missing public results[data-result]');
 const flat=JSON.parse(text),keys=['tp','fn','fp','invalid','duplicates','total'];
 for(const key of keys)assert(Number.isInteger(flat[key])&&flat[key]>=0,'Missing metric '+key);
 const raw=await page.evaluate(()=>window.validationDashboard.lastReport);assert(raw&&raw.status==='complete','Missing completed public lastReport');
 assert(Array.isArray(raw.diagnostics));assert(raw.metrics);for(const key of keys)assert.equal(raw.metrics[key],flat[key],'Dataset versus lastReport '+key);
 for(const key of ['recall','precision','adjusted'])assert(raw.rates[key]===null||(typeof raw.rates[key]==='number'&&Number.isFinite(raw.rates[key])),'Invalid rate '+key);
 assert.equal(raw.rates.recall,flat.total?flat.tp/flat.total:null);
 assert.equal(raw.rates.precision,flat.tp+flat.fp?flat.tp/(flat.tp+flat.fp):null);
 assert.equal(raw.rates.adjusted,flat.tp+flat.fp+flat.invalid?flat.tp/(flat.tp+flat.fp+flat.invalid):null);
 return{raw,metrics:Object.fromEntries(keys.map(key=>[key,flat[key]]))};
}
async function submit(page,site,data,{raw=false,errorPattern}={}){
 await reset(page,site);
 await page.locator(UI.file).setInputFiles({name:'dashboard-verification.json',mimeType:'application/json',buffer:raw?Buffer.from(data):Buffer.from(JSON.stringify(data))});
 await page.waitForFunction(status=>['ready','error'].includes(document.querySelector(status)?.dataset.state),UI.status,{timeout:15000});
 const uploadState=await page.locator(UI.status).getAttribute('data-state');
 if(uploadState==='error'){
  if(raw||Array.isArray(data)||data===null||typeof data!=='object')assert(!await page.locator(UI.compare).isEnabled(),'Malformed upload must disable compare');
  assert(errorPattern,'Unexpected upload rejection: '+await page.locator(UI.status).innerText());
 }else{
  assert(await page.locator(UI.compare).isEnabled(),'Ready file must enable explicit compare');
  await page.locator(UI.compare).click();
  await page.waitForFunction(status=>['complete','error'].includes(document.querySelector(status)?.dataset.state),UI.status,{timeout:180000});
 }
 const status=await page.locator(UI.status).innerText(),state=await page.locator(UI.status).getAttribute('data-state');
 if(errorPattern){
  assert.equal(state,'error');assert(errorPattern.test(status+' '+await page.locator(UI.results).innerText()),'Expected rejection: '+status);
  assert(!await page.locator(UI.results).getAttribute('data-result'),'Rejected file must clear stale metrics');
  const report=await page.evaluate(()=>window.validationDashboard.lastReport);assert(report===null||(report.status==='rejected'&&report.metrics===null),'Rejected input must not retain an old completed report');
  return{rejected:true,status,raw:report};
 }
 assert.equal(state,'complete','Comparison failed: '+status);
 return{...await readResult(page),status};
}
function expectedMetrics(total,counts={}){const expected={tp:0,fp:0,invalid:0,duplicates:0,total,...counts};expected.fn=total-expected.tp;return expected;}
async function checkInput(page,site,row,name,data,counts,opts={}){
 const total=row.expectedFindings,actual=await submit(page,site,data,opts);
 if(!opts.errorPattern)assert.deepEqual(actual.metrics,expectedMetrics(total,counts),name);
 row.inputs.push({name,status:'PASS',expected:opts.errorPattern?'rejected':expectedMetrics(total,counts),actual:actual.metrics||actual.status});
 return actual;
}
async function probe(context,c,base){
 const page=await context.newPage();
 try{
  const response=await page.goto(new URL(c.page,base).href);assert.equal(response.status(),200);
  await page.waitForTimeout((c.delayMs||0)+(c.frames.length?700:120));let frame=page.mainFrame();const frames=[];
  for(const f of c.frames){const element=frame.locator(f.selector);await element.waitFor({state:'attached',timeout:5000});assert.equal(await element.count(),1);const actual=await element.evaluate(n=>n.src);assert.equal(actual,new URL(f.src,base).href);frames.push({selector:f.selector,src:actual});frame=await(await frame.$(f.selector)).contentFrame();assert(frame);}
  const element=frame.locator(c.selector);await element.waitFor({state:'attached',timeout:5000});assert.equal(await element.count(),1);
  const state=await element.evaluate(n=>{const r=n.getBoundingClientRect(),ancestors=[];for(let p=n;p;p=p.parentElement){const s=getComputedStyle(p),b=p.getBoundingClientRect();ancestors.push({tag:p.tagName,opacity:s.opacity,color:s.color,background:s.backgroundColor,display:s.display,fontSize:s.fontSize,right:b.right,bottom:b.bottom,width:b.width,height:b.height});}return{text:n.textContent,namespaceURI:n.namespaceURI,codepoints:Array.from(n.textContent,ch=>'U+'+ch.codePointAt(0).toString(16).toUpperCase()),bounds:{x:r.x,y:r.y,width:r.width,height:r.height},ancestors};});
  assert.equal(state.text,c.text);if(c.techniques.includes('TRANSPARENT'))assert(state.ancestors.some(s=>s.opacity==='0'||(s.color.startsWith('rgba(')&&parseFloat(s.color.split(',').at(-1))===0)||(s.color===s.background&&s.color!=='rgba(0, 0, 0, 0)')));
  if(c.techniques.includes('OFFSCREEN'))assert(state.ancestors.some(s=>s.display==='none'||parseFloat(s.fontSize)<=1||s.right<0||s.bottom<0));
  return{caseId:c.caseId,page:c.page,frames,delayMs:c.delayMs,...state};
 }finally{await page.close();}
}



async function uiDownload(page,selector,{allowError=false}={}){
 const ready=page.waitForEvent('download');await page.locator(selector).click();const item=await ready,stream=await item.createReadStream();assert(stream);const parts=[];for await(const part of stream)parts.push(part);const bytes=Buffer.concat(parts);assert(!bytes.subarray(0,3).equals(Buffer.from([239,187,191])));
 await page.waitForFunction(({status,allowError})=>['idle','ready','complete',...(allowError?['error']:[])].includes(document.querySelector(status)?.dataset.state),{status:UI.status,allowError});
 return{data:JSON.parse(bytes.toString('utf8')),bytes:bytes.length,sha256:sha(bytes),filename:item.suggestedFilename()};
}
async function assertSkipHidden(page){
 const value=await page.locator('.skip-link').evaluate(el=>{const r=el.getBoundingClientRect(),s=getComputedStyle(el);return{focused:document.activeElement===el,visible:s.display!=='none'&&s.visibility!=='hidden'&&r.bottom>0&&r.right>0&&r.top<innerHeight&&r.left<innerWidth,top:r.top,bottom:r.bottom};});
 assert(!value.focused&&!value.visible,'Skip link must stay offscreen without focus');return value;
}
async function keyboardSkipLink(page,row,site,mode){
 const before=await assertSkipHidden(page);await page.keyboard.press('Tab');
 assert(await page.locator('.skip-link').evaluate(el=>document.activeElement===el),'First real Tab must reach skip link');
 const focused=await page.locator('.skip-link').boundingBox();assert(focused&&focused.y>=0&&focused.y+focused.height>0);
 if([1,10].includes(site.number)){const name='dashboard-'+site.number+'-'+mode+'-skip-focused-1440.png';await page.screenshot({path:join(output,name)});row.screenshots.push(name);}
 await page.keyboard.press('Tab');const after=await assertSkipHidden(page);row.skipLink={status:'PASS',before,focusedBounds:focused,after,keyboardUsed:true};
}

async function inputSuite(page,context,site,manifest,base,expected,row){
 const total=expected.findings.length,first=manifest.cases.find(c=>!c.frames.length&&!c.delayMs)||manifest.cases[0];
 const one=findingFor(first,base),meta=structuredClone(expected.meta),make=findings=>({meta:structuredClone(meta),findings});
 let id=0;const clone=(f=one)=>({...f,id:'qa_'+(++id)}),check=(name,data,counts,opts)=>checkInput(page,site,row,name,data,counts,opts);
 row.probes=[await probe(context,first,base)];
 await check('one TP and omitted remaining findings',make([clone()]),{tp:1});
 await check('equivalent CSS deduplicates the actual positive node',make([clone(),{...clone(),location:':is('+first.selector+')'}]),{tp:1,duplicates:1});
 await check('ambiguous selector is FP',make([{...clone(),location:'*'}]),{fp:1});
 await check('missing selector is FP',make([{...clone(),location:'.__qa_missing_node__'}]),{fp:1});
 await check('changed nonempty evidence still resolves by actual node',make([{...clone(),evidence_text:'different evidence'}]),{tp:1});
 await check('boolean false violation is FP',make([{...clone(),is_violation:false}]),{fp:1});
 const another=['HOMOGLYPH','JAMO','TRANSPARENT','OFFSCREEN'].find(t=>!first.techniques.includes(t));
 assert(another,'First direct case must leave one unassigned technique');
 await check('supported but incorrect technique is FP',make([{...clone(),technique:another}]),{fp:1});
 await check('unsupported technique is invalid',make([{...clone(),technique:'UNKNOWN'}]),{invalid:1});
 await check('nonboolean violation is invalid',make([{...clone(),is_violation:'true'}]),{invalid:1});
 const same=clone();await check('duplicate ID is invalid',make([same,{...same}]),{tp:1,invalid:1});
 const fields=['id','url','location','evidence_text','technique','is_violation'].map(key=>{const f=clone();delete f[key];return f;});
 await check('each required finding field',make(fields),{invalid:fields.length});
 await check('whitespace evidence preserves legacy validation',make([{...clone(),evidence_text:'   '}]),site.number===1?{tp:1}:{invalid:1});
 const version=make([clone()]);version.meta.tool_version=123;
 if(site.number===1)await check('legacy optional tool_version type stays permissive',version,{tp:1});
 else await check('modern tool_version rejects wrong type',version,{}, {errorPattern:/tool_version/});
 const normal=manifest.negativeControls.find(c=>!c.frames.length&&!c.delayMs)||manifest.negativeControls[0];assert(normal);
 row.probes.push(await probe(context,normal,base));
 const normalFinding={...clone(),url:new URL(normal.page,base).href,location:locationFor(normal,base),evidence_text:normal.text};
 await check('normal control false positive',make([normalFinding]),{fp:1});
 const home=await context.newPage();await home.goto(base+manifest.entry);assert.equal(await home.locator('h1').count(),1);row.ordinaryPage={url:home.url(),h1:await home.locator('h1').textContent()};await home.close();
 const ordinary={...clone(),url:base+manifest.entry,location:'h1',evidence_text:row.ordinaryPage.h1};
 await check('ordinary noncase equivalent CSS retains legacy dedup difference',make([ordinary,{...clone(ordinary),location:':is(h1)'}]),site.number===1?{fp:2}:{fp:1,duplicates:1});
 const protocol=new URL(one.url);protocol.protocol=protocol.protocol==='http:'?'https:':'http:';
 await check('HTTP HTTPS and fragment canonical equivalence',make([{...clone(),url:protocol.href+'#ignored'}]),{tp:1});
 await check('empty result denominator',make([]),{});
 for(const seconds of [0,1800,1801]){const data=make([]);data.meta.elapsed_sec=seconds;const actual=await check('elapsed boundary '+seconds,data,{});assert.equal(actual.raw.meta.elapsed_sec,seconds);assert.equal(/1,800초 초과/.test(await page.locator('#result-meta').innerText()),seconds>1800);}
 const queries=manifest.cases.filter(c=>c.page.includes('?'));
 if(queries.length){
  const c=queries[0],f=findingFor(c,base);row.probes.push(await probe(context,c,base));
  const sorted=new URL(f.url);sorted.search=new URLSearchParams([...sorted.searchParams.entries()].reverse()).toString();sorted.hash='ignored';
  await check('query order and fragment deduplicate',make([clone(f),{...clone(f),url:sorted.href}]),{tp:1,duplicates:1});
  const wrong=new URL(f.url);wrong.searchParams.set([...wrong.searchParams.keys()][0],'__qa_wrong_query__');
  await check('query values remain distinct',make([{...clone(f),url:wrong.href}]),{fp:1});
  const direct=queries.filter(c=>!c.frames.length);let different,shared;
  for(const left of direct)for(const right of direct){if(left.page===right.page||left.selector!==right.selector||new URL(left.page,base).pathname!==new URL(right.page,base).pathname)continue;
   if(!different&&left.techniques.some(t=>!right.techniques.includes(t)))different=[left,right];
   if(!shared&&left.techniques.some(t=>right.techniques.includes(t)))shared=[left,right];}
  if(different){const[left,right]=different;row.probes.push(await probe(context,right,base));const actual=findingFor(right,base),absent=left.techniques.find(t=>!right.techniques.includes(t));await check('other query actual node absent technique FP',make([{...clone(actual),technique:absent,evidence_text:left.text}]),{fp:1});}
  if(shared){const[left,right]=shared;row.probes.push(await probe(context,right,base));await check('other query actual node shared technique TP',make([{...clone(findingFor(right,base)),technique:left.techniques.find(t=>right.techniques.includes(t)),evidence_text:left.text}]),{tp:1});}
 }
 const framed=manifest.cases.filter(c=>c.frames.length).sort((a,b)=>b.frames.length-a.frames.length)[0];
 if(framed){
  row.probes.push(await probe(context,framed,base));const f=findingFor(framed,base);
  await check('actual nested iframe chain',make([clone(f)]),{tp:1});
  await check('owner-relative iframe src legacy versus modern',make([{...clone(f),location:relativeFrames(framed,base)}]),site.number===1?{fp:1}:{tp:1});
  if(site.number===1)await check('legacy base-relative iframe src remains accepted',make([{...clone(f),location:[...framed.frames.map(x=>'iframe[src="'+x.src+'"]'),framed.selector].join(' >>> ')}]),{tp:1});
  await check('wrong iframe src FP',make([{...clone(f),location:f.location.replace(new URL(framed.frames[0].src,base).href,new URL('widgets/__qa_wrong__.html',base).href)}]),{fp:1});
 }
 const queryFrame=queries.find(c=>c.frames.length);
 if(queryFrame){row.probes.push(await probe(context,queryFrame,base));const f=findingFor(queryFrame,base);
  await check('query parent plus correct iframe chain',make([clone(f)]),{tp:1});
  const other=queries.find(c=>c.page!==queryFrame.page&&new URL(c.page,base).pathname===new URL(queryFrame.page,base).pathname&&c.frames[0]?.src!==queryFrame.frames[0].src);
  if(other){row.probes.push(await probe(context,other,base));await check('wrong parent query cannot reuse iframe chain',make([{...clone(f),url:new URL(other.page,base).href}]),{fp:1});}
 }
 let siblings;
 for(const left of manifest.cases.filter(c=>c.frames.length===1)){const right=manifest.cases.find(c=>c!==left&&c.page===left.page&&c.frames.length===1&&c.selector===left.selector&&c.frames[0].src!==left.frames[0].src&&left.techniques.some(t=>!c.techniques.includes(t)));if(right){siblings=[left,right];break;}}
 if(siblings){const[left,right]=siblings;row.probes.push(await probe(context,left,base),await probe(context,right,base));const f=findingFor(right,base);
  await check('wrong sibling technique is FP at actual other node',make([{...clone(f),technique:left.techniques.find(t=>!right.techniques.includes(t)),evidence_text:left.text}]),{fp:1});
  await check('same-class sibling ambiguous iframe selector',make([{...clone(f),location:'iframe >>> '+right.selector}]),{fp:1});
 }
 const delayed=manifest.cases.filter(c=>c.delayMs>0).sort((a,b)=>b.delayMs-a.delayMs)[0];
 if(delayed){row.probes.push(await probe(context,delayed,base));await check('deterministic delayed positive is still TP',make([clone(findingFor(delayed,base))]),{tp:1});}
 await check('invalid JSON','{',{}, {raw:true,errorPattern:/JSON|문법/});
 await check('UTF-8 BOM',Buffer.concat([Buffer.from([239,187,191]),Buffer.from(JSON.stringify(make([])))]),{}, {raw:true,errorPattern:/BOM/});
 await check('invalid UTF-8',Buffer.from([255,254,253]),{}, {raw:true,errorPattern:/UTF-8/});
 await check('top-level array',[],{}, {errorPattern:/최상위|객체/});
 for(const primitive of [null,true,7,'text'])await check('primitive top-level '+String(primitive),primitive,{}, {errorPattern:/최상위|객체/});
 await check('extra top-level key',{...make([]),extra:true},{}, {errorPattern:/최상위|키/});
 const topic=make([]);topic.meta.topic='WRONG';await check('wrong topic',topic,{}, {errorPattern:/topic|TOPIC/});
 const badEntry=make([]);badEntry.meta.entry_url=new URL('wrong-entry.html',base).href;await check('wrong entry URL',badEntry,{}, {errorPattern:/진입|entry|선택|사이트/});
 const elapsed=make([]);elapsed.meta.elapsed_sec=-1;await check('negative elapsed',elapsed,{}, {errorPattern:/elapsed_sec/});
 const stringElapsed=make([]);stringElapsed.meta.elapsed_sec='0';await check('string elapsed',stringElapsed,{}, {errorPattern:/elapsed_sec/});
 const times=make([]);times.meta.started_at='2026-01-01T00:00:01.000Z';times.meta.finished_at='2026-01-01T00:00:00.000Z';await check('reversed timestamps',times,{}, {errorPattern:/시각|time/});
 await check('findings is not an array',{...make([]),findings:{}},{}, {errorPattern:/findings/});
 await check('too many findings',make(Array(10001).fill({})),{}, {errorPattern:/10,000/});
 await check('file size limit',Buffer.alloc(5*1024*1024+1,32),{}, {raw:true,errorPattern:/5MB/});
 // Composite output supplies FN, FP and invalid diagnostic rows to the public UI.
 const invalid={...clone(),id:'qa_invalid_missing_evidence'};delete invalid.evidence_text;
 const fp={...normalFinding,id:'qa_normal_fp'};
 const mixed=await check('mixed diagnostic categories',make([fp,invalid]),{fp:1,invalid:1});
 return{mixed,fp,invalid};
}
async function expandDiagnostics(page){
 for(let n=0;n<30;n++){const button=page.locator('#show-more');if(!await button.isVisible()||!await button.isEnabled())return;const before=await page.locator(UI.rows).count();await button.click();await page.waitForFunction(({rows,before})=>document.querySelectorAll(rows).length>before,{rows:UI.rows,before});}
 throw Error('Diagnostic show-more did not terminate');
}
async function diagnosticUI(page,site,row,mixed){
 const report=mixed.raw;assert.equal(report.status,'complete');
 assert(Array.isArray(report.diagnostics),'diagnostics array');
 const expected={fn:row.expectedFindings,fp:1,invalid:1};
 for(const type of ['fn','fp','invalid']){
  const records=report.diagnostics.filter(d=>d.type===type);assert.equal(records.length,expected[type],type+' diagnostic records');
  for(const d of records){assert(typeof d.reason==='string'&&d.reason.length);assert(Array.isArray(d.expected));if(type==='fn'){assert(d.expected.length);for(const e of d.expected)for(const key of ['id','url','location','technique','evidence_text','is_violation'])assert(Object.hasOwn(e,key),'Missing expected diagnostic field '+key);}}
  await page.locator(UI.filter).selectOption(type);await page.locator(UI.search).fill('');await expandDiagnostics(page);
  assert.equal(await page.locator(UI.rows).count(),records.length,type+' visible diagnostic rows');
  if(type==='fn'){const detail=page.locator(UI.rows).first();if(await detail.evaluate(el=>el.tagName==='DETAILS'&&!el.open))await detail.locator('summary').click();const text=await detail.innerText();for(const key of ['id','url','location','technique','evidence_text'])assert(text.includes(String(records[0].expected[0][key])),'FN detail field '+key);}
 }
 await page.locator(UI.filter).selectOption('fp');await page.locator(UI.search).fill('qa_normal_fp');assert.equal(await page.locator(UI.rows).count(),1);
 const detail=page.locator(UI.rows).first();if(await detail.evaluate(el=>el.tagName==='DETAILS'&&!el.open))await detail.locator('summary').click();
 const content=await detail.innerText(),submitted=report.diagnostics.find(d=>d.type==='fp').submitted;
 for(const key of ['id','url','location','technique','evidence_text','is_violation'])assert(content.includes(String(submitted[key])),'FP detail missing submitted '+key);
 await page.locator(UI.search).fill(submitted.evidence_text.slice(0,10));assert.equal(await page.locator(UI.rows).count(),1,'Search evidence field');
 await page.locator(UI.search).fill('__qa_no_diagnostic__');assert.equal(await page.locator(UI.rows).count(),0);assert(await page.locator('#empty-results').isVisible());
 await page.locator(UI.search).fill('');await page.locator(UI.filter).selectOption('invalid');assert.equal(await page.locator(UI.rows).count(),1);
 const invalid=page.locator(UI.rows).first();if(await invalid.evaluate(el=>el.tagName==='DETAILS'&&!el.open))await invalid.locator('summary').click();assert((await invalid.innerText()).includes('evidence_text'));
 await page.locator(UI.filter).selectOption('all');row.diagnosticUI={status:'PASS',categories:expected,fields:['id','url','location','technique','evidence_text','is_violation'],searchAndFilter:true};
}


async function waitDashboard(page,allSites){
 await page.waitForFunction(({site,status,count})=>document.querySelector(site)?.options.length>=count+1&&['idle','ready'].includes(document.querySelector(status)?.dataset.state),{site:UI.site,status:UI.status,count:allSites.length},{timeout:15000});
}
async function selectionWorkflow(context,site,allSites,fixtures,dashboard,base,row){
 const page=await context.newPage();
 try{
  const auto=new URL(dashboard);auto.search='';
  await page.goto(auto.href);await waitDashboard(page,allSites);assert.equal(await page.locator(UI.site).inputValue(),'','Initial no-query selection must be empty');
  const data=remapReference(fixtures.get(site.number).expected,fixtures.get(site.number).manifest,base);data.findings=data.findings.slice(0,1);
  await page.locator(UI.file).setInputFiles({name:'auto-selection.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(data))});
  await page.waitForFunction(({site,compare,n})=>document.querySelector(site)?.value===n&&!document.querySelector(compare)?.disabled,{site:UI.site,compare:UI.compare,n:String(site.number)},{timeout:15000});
  await page.locator(UI.compare).click();
  await page.waitForFunction(({status,results})=>document.querySelector(status)?.dataset.state==='complete'&&document.querySelector(results)?.hasAttribute('data-result'),UI,{timeout:180000});
  const result=await readResult(page);assert.deepEqual(result.metrics,expectedMetrics(row.expectedFindings,{tp:1}));
  await page.locator(UI.reset).click();assert.equal(await page.locator(UI.file).evaluate(el=>el.files.length),0);assert(!await page.locator(UI.results).getAttribute('data-result'));
  assert.equal(await page.evaluate(()=>window.validationDashboard.lastReport),null,'Reset must clear the last report');
  const other=allSites.find(s=>s.number!==site.number);assert(other);
  await page.locator(UI.site).selectOption(String(other.number));
  await page.waitForFunction(({file,status})=>!document.querySelector(file)?.disabled&&['idle','ready'].includes(document.querySelector(status)?.dataset.state),UI,{timeout:15000});
  await page.locator(UI.file).setInputFiles({name:'explicit-mismatch.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(data))});
  await page.waitForFunction(({status,compare})=>['ready','error'].includes(document.querySelector(status)?.dataset.state)||!document.querySelector(compare)?.disabled,UI,{timeout:15000});
  if(await page.locator(UI.status).getAttribute('data-state')==='ready')await page.locator(UI.compare).click();
  await page.waitForFunction(status=>document.querySelector(status)?.dataset.state==='error',UI.status);
  assert.equal(await page.locator(UI.site).inputValue(),String(other.number),'Manual selection must not be overwritten');
  assert(!await page.locator(UI.results).getAttribute('data-result'),'Mismatch must clear stale metrics');
  const manualMessage=await page.locator(UI.status).innerText();assert(/선택|사이트|진입|일치/.test(manualMessage));
  await page.goto(dashboard);await waitDashboard(page,allSites);assert.equal(await page.locator(UI.site).inputValue(),String(site.number));
  const otherBase=new URL('../test-site-'+other.number+'/',base).href;
  const wrong=remapReference(fixtures.get(other.number).expected,fixtures.get(other.number).manifest,otherBase);wrong.findings=wrong.findings.slice(0,1);
  await page.locator(UI.file).setInputFiles({name:'query-choice-mismatch.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(wrong))});
  await page.waitForFunction(({status,compare})=>['ready','error'].includes(document.querySelector(status)?.dataset.state)||!document.querySelector(compare)?.disabled,UI,{timeout:15000});
  if(await page.locator(UI.status).getAttribute('data-state')==='ready')await page.locator(UI.compare).click();
  await page.waitForFunction(status=>document.querySelector(status)?.dataset.state==='error',UI.status);
  assert.equal(await page.locator(UI.site).inputValue(),String(site.number),'Query choice must not be overwritten');
  row.selectionWorkflow={status:'PASS',autoDetectedSite:site.number,manualMismatchKept:other.number,queryMismatchKept:site.number,manualMessage,resetClearsFileResultAndLastReport:true};
 }finally{await page.close();}
}

async function waitUISettled(page){
 await page.waitForFunction(({file,status})=>!document.querySelector(file)?.disabled&&['idle','ready','error','complete'].includes(document.querySelector(status)?.dataset.state),UI,{timeout:15000});
}
async function putUIFile(page,data,name){
 await page.locator(UI.file).setInputFiles({name,mimeType:'application/json',buffer:Buffer.isBuffer(data)?data:Buffer.from(JSON.stringify(data))});
 await waitUISettled(page);
}
async function assertNoOldReport(page,label){
 assert(!await page.locator(UI.results).getAttribute('data-result'),label+' stale metrics');
 assert.equal(await page.evaluate(()=>window.validationDashboard.lastReport),null,label+' stale lastReport');
}
async function explicitUISelection(page,number){
 await page.locator(UI.site).selectOption(String(number));await waitUISettled(page);
 assert.equal(await page.locator(UI.site).inputValue(),String(number));
}
async function clickSingleComparison(page,total,label){
 assert.equal(await page.locator(UI.status).getAttribute('data-state'),'ready',label+' ready');
 assert(await page.locator(UI.compare).isEnabled(),label+' enabled');
 await page.locator(UI.compare).click();
 await page.waitForFunction(status=>['complete','error'].includes(document.querySelector(status)?.dataset.state),UI.status,{timeout:180000});
 const result=await readResult(page);assert.deepEqual(result.metrics,expectedMetrics(total,{tp:1}),label);return result.metrics;
}
async function stateTransitionProfile(context,site,allSites,fixtures,dashboard,base,row){
 const page=await context.newPage(),other=allSites.find(s=>s.number!==site.number),proof=row.stateTransitions={status:'RUNNING',checks:[]};assert(other);
 const current=remapReference(fixtures.get(site.number).expected,fixtures.get(site.number).manifest,base);current.findings=current.findings.slice(0,1);
 const otherBase=new URL('../test-site-'+other.number+'/',base).href,foreign=remapReference(fixtures.get(other.number).expected,fixtures.get(other.number).manifest,otherBase);foreign.findings=foreign.findings.slice(0,1);
 const total=fixtures.get(site.number).expected.findings.length,otherTotal=fixtures.get(other.number).expected.findings.length;
 try{
  await page.goto(dashboard);await waitDashboard(page,allSites);
  const variants=[
   {name:'invalid JSON',bytes:Buffer.from('{'),pattern:/JSON/},
   {name:'BOM',bytes:Buffer.concat([Buffer.from([239,187,191]),Buffer.from(JSON.stringify(current))]),pattern:/BOM/},
   {name:'encoding',bytes:Buffer.from([255,254,253]),pattern:/UTF-8/},
   {name:'size',bytes:Buffer.alloc(5*1024*1024+1,32),pattern:/5MB/}
  ];
  for(const variant of variants){
   await putUIFile(page,variant.bytes,'state-'+variant.name+'.json');
   assert.equal(await page.locator(UI.status).getAttribute('data-state'),'error',variant.name+' upload state');
   assert(!await page.locator(UI.compare).isEnabled(),variant.name+' upload disabled');
   const messages=[];
   for(const selected of [other.number,site.number]){
    await explicitUISelection(page,selected);
    const message=await page.locator(UI.status).innerText();messages.push(message);
    assert.equal(await page.locator(UI.status).getAttribute('data-state'),'error',variant.name+' must survive selection '+selected);
    assert(variant.pattern.test(message),variant.name+' original parse reason must survive');
    assert(!await page.locator(UI.compare).isEnabled(),variant.name+' compare remains disabled');
    await assertNoOldReport(page,variant.name);
   }

   if(variant.name==='invalid JSON'){
    const downloaded=await uiDownload(page,'#download-expected',{allowError:true});
    assert.equal(await page.locator(UI.status).getAttribute('data-state'),'error','Example download preserves file error');
    assert(variant.pattern.test(await page.locator(UI.status).innerText()));
    assert(!await page.locator(UI.compare).isEnabled());
    assert.equal(downloaded.data.meta.entry_url,current.meta.entry_url);assert.equal(downloaded.data.findings.length,total);
    proof.checks.push({name:'example download preserves parse error and disabled comparison',status:'PASS',filename:downloaded.filename,sha256:downloaded.sha256});await save();
   }

   await putUIFile(page,current,'state-valid-replacement.json');
   assert.equal(await page.locator(UI.status).getAttribute('data-state'),'ready',variant.name+' valid replacement recovery');
   assert(await page.locator(UI.compare).isEnabled());
   proof.checks.push({name:variant.name+' error survives two selections and valid replacement recovers',status:'PASS',messages});await save();
  }
  const validMetrics=await clickSingleComparison(page,total,'before multiple drop');
  const transfer=await page.evaluateHandle(text=>{const value=new DataTransfer();value.items.add(new File([text],'first.json',{type:'application/json'}));value.items.add(new File([text],'second.json',{type:'application/json'}));return value;},JSON.stringify(current));
  try{await page.locator('#upload-zone').dispatchEvent('drop',{dataTransfer:transfer});}finally{await transfer.dispose();}
  await waitUISettled(page);
  assert.equal(await page.locator(UI.status).getAttribute('data-state'),'error','Multiple drop shows error');
  assert(!await page.locator(UI.compare).isEnabled(),'Multiple drop clears file/data');
  assert.equal(await page.locator(UI.file).evaluate(el=>el.files.length),0);
  await assertNoOldReport(page,'multiple drop');
  assert(!(await page.locator('#file-name').innerText()).includes('state-valid-replacement.json'),'Multiple drop clears filename');
  await explicitUISelection(page,other.number);
  assert.equal(await page.locator(UI.status).getAttribute('data-state'),'idle','No stale file after multiple drop');
  assert(!await page.locator(UI.compare).isEnabled());
  proof.checks.push({name:'multiple drop after complete clears file/data/metrics and later selection stays idle',status:'PASS',before:validMetrics});await save();
  await explicitUISelection(page,site.number);
  await putUIFile(page,foreign,'retained-other-site.json');
  assert.equal(await page.locator(UI.status).getAttribute('data-state'),'error','Manual site/address mismatch');
  assert.equal(await page.locator(UI.site).inputValue(),String(site.number));
  assert.equal(new URL(page.url()).searchParams.get('site'),String(site.number));

  const disabledBeforeExample=await page.locator(UI.compare).isDisabled();
  const addressExample=await uiDownload(page,'#download-expected',{allowError:true});
  assert.equal(await page.locator(UI.status).getAttribute('data-state'),'error','Example download preserves address mismatch');
  assert.equal(await page.locator(UI.site).inputValue(),String(site.number));
  assert.equal(await page.locator(UI.compare).isDisabled(),disabledBeforeExample);
  assert.equal(addressExample.data.meta.entry_url,current.meta.entry_url);
  proof.checks.push({name:'example download keeps explicit address mismatch and original selection',status:'PASS',filename:addressExample.filename,sha256:addressExample.sha256});await save();

  await page.locator(UI.site).selectOption('');
  await page.waitForFunction(({site,status,compare,n})=>document.querySelector(site)?.value===n&&document.querySelector(status)?.dataset.state==='ready'&&!document.querySelector(compare)?.disabled,{...UI,n:String(other.number)},{timeout:15000});
  assert.equal(new URL(page.url()).searchParams.get('site'),String(other.number),'Automatic recovery updates query site');
  const recovered=await clickSingleComparison(page,otherTotal,'manual mismatch to automatic detection');
  proof.checks.push({name:'manual A plus B file error recovers to auto B and query B without replacing valid file',status:'PASS',detected:other.number,metrics:recovered});await save();
  await page.locator(UI.reset).click();await waitUISettled(page);await page.locator(UI.site).selectOption('');await waitUISettled(page);
  assert.equal(await page.locator(UI.site).inputValue(),'');assert(!new URL(page.url()).searchParams.has('site'),'Empty auto selection removes site query');
  assert.equal(await page.locator(UI.status).getAttribute('data-state'),'idle');assert(!await page.locator(UI.compare).isEnabled());
  await assertNoOldReport(page,'empty automatic selection');
  proof.checks.push({name:'automatic option with no file clears selection and site query',status:'PASS'});proof.status='PASS';await save();
 }finally{await page.close();}
 return proof;
}
async function manifestFailureProfile(context,site,allSites,fixtures,dashboard,base,row){
 row.manifestFailures=[];
 for(const kind of ['schema','malformed JSON']){
  const page=await context.newPage(),auto=new URL(dashboard);auto.search='';let interceptions=0;
  const pattern=new RegExp('/source/'+site.project+'/reference/ground-truth\\.json(?:\\?.*)?$');
  const handler=async route=>{interceptions++;await route.fulfill({status:200,contentType:'application/json; charset=utf-8',body:kind==='schema'?JSON.stringify({siteId:'__invalid_schema__',deployment:{targetDirectory:'wrong'},cases:[],negativeControls:[]}):'{'});};
  try{
   await page.route(pattern,handler);await page.goto(auto.href);await waitDashboard(page,allSites);assert.equal(await page.locator(UI.site).inputValue(),'');
   const data=remapReference(fixtures.get(site.number).expected,fixtures.get(site.number).manifest,base);data.findings=data.findings.slice(0,1);
   await putUIFile(page,data,'manifest-failure-'+kind+'.json');
   assert.equal(await page.locator(UI.status).getAttribute('data-state'),'error','Automatic manifest '+kind+' must stay error');
   assert(interceptions>0,'Fault response was actually requested');
   assert(!await page.locator(UI.compare).isEnabled(),'Failed manifest cannot enable comparison');
   await assertNoOldReport(page,'manifest '+kind);
   const message=await page.locator(UI.status).innerText();assert(message.length);
   // Only a 200 JSON payload is replaced. No HTTP/network/console errors are exempted.
   await page.unroute(pattern,handler);
   await putUIFile(page,data,'manifest-valid-recovery.json');
   assert.equal(await page.locator(UI.status).getAttribute('data-state'),'ready',kind+' retry after removing injection');
   const metrics=await clickSingleComparison(page,fixtures.get(site.number).expected.findings.length,'manifest '+kind+' recovery');
   row.manifestFailures.push({kind,status:'PASS',transportStatus:200,interceptions,message,recoveredMetrics:metrics,httpOrConsoleErrorsIgnored:false});await save();
  }finally{await page.close();}
 }
}


async function diagnosticEdgeProfile(context,site,allSites,fixtures,dashboard,base,row){
 const page=await context.newPage(),proof=row.diagnosticEdges={status:'RUNNING',checks:[]};
 try{
  await page.goto(dashboard);await waitDashboard(page,allSites);
  const {manifest,expected}=fixtures.get(site.number),sample=remapReference(expected,manifest,base),first=manifest.cases.find(c=>!c.frames.length&&!c.delayMs)||manifest.cases[0],normal=manifest.negativeControls.find(c=>!c.frames.length&&!c.delayMs)||manifest.negativeControls[0];
  const missing={...findingFor(first,base),id:'v2_technique_missing'};delete missing.technique;
  const empty={...findingFor(first,base),id:'v2_technique_empty',technique:''};
  const normalFalse={...findingFor(normal,base,'HOMOGLYPH'),id:'v2_normal_false',is_violation:false};
  sample.findings=[missing,empty,normalFalse];
  const result=await submit(page,site,sample);
  assert.deepEqual(result.metrics,expectedMetrics(expected.findings.length,{fp:1,invalid:2}));
  for(const value of [missing,empty]){
   const diagnostic=result.raw.diagnostics.find(d=>d.type==='invalid'&&d.submitted?.id===value.id);assert(diagnostic,value.id+' invalid diagnostic');
   await page.locator(UI.filter).selectOption('invalid');await page.locator(UI.search).fill(value.id);
   assert.equal(await page.locator(UI.rows).count(),1);
   const detail=page.locator(UI.rows).first();if(await detail.evaluate(el=>!el.open))await detail.locator('summary').click();
   const shown=await detail.locator('.diagnostic__submitted').evaluate(section=>[...section.querySelectorAll('dt')].find(el=>el.textContent==='기법')?.nextElementSibling?.textContent??null);
   assert.notEqual(shown,null,'Submitted technique field is rendered');
   assert(!/정상|기법 없음/.test(shown),value.id+' must not be labeled normal');
   await viewport(page,320);await detail.locator('.diagnostic__submitted').evaluate(el=>el.scrollIntoView({block:'start',behavior:'instant'}));
   const name='dashboard-'+site.number+'-root-'+value.id+'-320.png';await page.screenshot({path:join(output,name)});row.screenshots.push(name);
   proof.checks.push({name:value.id+' displayed as missing/invalid instead of normal',status:'PASS',shown,reason:diagnostic.reason,screenshot:name});
   await page.setViewportSize({width:1440,height:1000});
  }
  const fp=result.raw.diagnostics.find(d=>d.type==='fp'&&d.submitted?.id===normalFalse.id);assert(fp);
  assert.equal(fp.submitted.is_violation,false);
  assert(!/광고.*제출/.test(fp.reason),'Normal false finding must not be described as an advertisement submission');
  assert(/정상|기대.*검출|대상/.test(fp.reason));
  await page.locator(UI.filter).selectOption('fp');await page.locator(UI.search).fill(normalFalse.id);
  const detail=page.locator(UI.rows).first();if(await detail.evaluate(el=>!el.open))await detail.locator('summary').click();
  const flag=await detail.locator('.diagnostic__submitted').evaluate(section=>[...section.querySelectorAll('dt')].find(el=>el.textContent==='위반 여부')?.nextElementSibling?.textContent);
  assert.equal(flag,'false');assert((await detail.innerText()).includes(fp.reason));
  proof.checks.push({name:'normal false FP has accurate expected-detection reason and false submitted flag',status:'PASS',reason:fp.reason,flag});
  proof.metrics=result.metrics;proof.status='PASS';await save();
 }finally{await page.close();}
}

async function viewport(page,width){
 await page.setViewportSize({width,height:width===1440?1000:844});
 const value=await page.evaluate(()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,bodyWidth:document.body.scrollWidth}));
 assert(value.scrollWidth<=width&&value.bodyWidth<=width,'Horizontal overflow at '+width);await assertSkipHidden(page);return{...value,overflow:false,nonfocusedSkipHidden:true};
}
async function runContext(browser,server,site,mode,allSites,fixtures,prefixPath){
 const row={site:site.number,mode,status:'RUNNING',phase:'setup',inputs:[],probes:[],pageErrors:[],consoleErrors:[],httpErrors:[],viewports:[],diagnosticViewports:[],screenshots:[]};report.tests.push(row);await save();
 let context;
 try{
  const prefix=mode==='prefix'?prefixPath:'/',base=new URL(prefix+'test-site-'+site.number+'/',server.origin).href;
  const dashboard=new URL(prefix+'validator/index.html?site='+site.number,server.origin).href;
  const {manifest,expected:reference}=fixtures.get(site.number),expected=remapReference(reference,manifest,base);
  Object.assign(row,{dashboard,base,expectedFindings:expected.findings.length,expectedElements:manifest.cases.length+manifest.negativeControls.length});
  context=await browser.newContext({viewport:{width:1440,height:1000}});
  if(mode==='prefix')await context.route('**'+prefixPath+'**',async route=>{
   const u=new URL(route.request().url());if(!u.pathname.startsWith(prefixPath)){await route.continue();return;}
   const mapped=new URL(u.pathname.slice(prefixPath.length)+u.search,server.origin),response=await route.fetch({url:mapped.href});await route.fulfill({response});
  });
  context.on('page',page=>{page.on('pageerror',e=>row.pageErrors.push(e.message));page.on('console',m=>{if(m.type()==='error')row.consoleErrors.push(m.text());});page.on('response',r=>{if(r.status()>=400)row.httpErrors.push({url:r.url(),status:r.status()});});});
  const page=await context.newPage(),response=await page.goto(dashboard);assert.equal(response.status(),200);await waitDashboard(page,allSites);
  assert.equal(await page.locator(UI.site).inputValue(),String(site.number));
  await keyboardSkipLink(page,row,site,mode);
  row.phase='downloads';await save();const truth=await uiDownload(page,'#download-truth');assert.deepEqual(truth.data,manifest);const sample=await uiDownload(page,'#download-expected');assert.deepEqual(sample.data.findings,expected.findings);assert.equal(sample.data.meta.entry_url,expected.meta.entry_url);assert.equal(sample.data.meta.elapsed_sec,0);row.downloads={truth:{bytes:truth.bytes,sha256:truth.sha256,filename:truth.filename},expected:{bytes:sample.bytes,sha256:sample.sha256,filename:sample.filename}};
  row.phase='selection and reset';await save();await selectionWorkflow(context,site,allSites,fixtures,dashboard,base,row);

  if(mode==='root'&&site.number===1){row.phase='representative file/selection/drop states';await save();await stateTransitionProfile(context,site,allSites,fixtures,dashboard,base,row);}
  if(mode==='root'&&site.number===2){row.phase='representative automatic manifest failures';await save();await manifestFailureProfile(context,site,allSites,fixtures,dashboard,base,row);}
  if(mode==='root'&&[1,2].includes(site.number)){row.phase='representative missing technique/normal false diagnostics';await save();await diagnosticEdgeProfile(context,site,allSites,fixtures,dashboard,base,row);}

  row.phase='negative and canonical inputs';await save();const mixed=await inputSuite(page,context,site,manifest,base,expected,row);
  row.phase='diagnostic UI';await save();await diagnosticUI(page,site,row,mixed.mixed);
  await page.locator(UI.filter).selectOption('fp');await page.locator(UI.search).fill('qa_normal_fp');
  for(const width of [1440,390,320]){
   row.diagnosticViewports.push(await viewport(page,width));
   if([1,10].includes(site.number)&&width===320){const item=page.locator(UI.rows).first();if(await item.evaluate(el=>el.tagName==='DETAILS'&&!el.open))await item.locator('summary').click();await item.evaluate(el=>el.scrollIntoView({block:'start',behavior:'instant'}));const file='dashboard-'+site.number+'-'+mode+'-diagnostic-320.png';await page.screenshot({path:join(output,file)});row.screenshots.push(file);}
  }
  await page.setViewportSize({width:1440,height:1000});
  row.phase='perfect comparison';await save();const perfect=await submit(page,site,expected);
  assert.deepEqual(perfect.metrics,expectedMetrics(row.expectedFindings,{tp:row.expectedFindings}));row.perfect=perfect.metrics;
  assert.equal(perfect.raw.status,'complete');assert.equal(perfect.raw.diagnostics.filter(d=>d.type==='fn').length,0);
  row.perfectRates=perfect.raw.rates;
  for(const width of [1440,390,320]){
   row.viewports.push(await viewport(page,width));await page.evaluate(()=>scrollTo({top:0,left:0,behavior:'instant'}));
   const top='dashboard-'+site.number+'-'+mode+'-'+width+'-top.png';await page.screenshot({path:join(output,top)});
   await page.locator(UI.results).evaluate(el=>el.scrollIntoView({block:'start',behavior:'instant'}));
   const result='dashboard-'+site.number+'-'+mode+'-'+width+'-result.png';await page.screenshot({path:join(output,result)});row.screenshots.push(top,result);
  }
  assert.deepEqual(row.pageErrors,[],'Uncaught page errors');assert.deepEqual(row.consoleErrors,[],'Console errors');assert.deepEqual(row.httpErrors,[],'HTTP errors');
  row.status='PASS';row.phase='complete';console.log('DASHBOARD PASS',site.number,mode,'TP',row.perfect.tp,'inputs',row.inputs.length);
 }catch(e){row.status='FAIL';row.failure={message:e.message,stack:e.stack};report.failures.push({site:site.number,mode,phase:row.phase,...row.failure});console.error('DASHBOARD FAIL',site.number,mode,e.message);}
 finally{await context?.close();await save();}
}
let browser,server;
await mkdir(output,{recursive:true});
try{
 const allSites=JSON.parse(await readFile(join(root,'source/sites.json'),'utf8')),sites=selection==='all'?allSites:allSites.filter(s=>s.number===Number(selection));assert(sites.length,'Unregistered site '+selection);
 report.baselineHead=git(['rev-parse',options.baseline],{encoding:'utf8'}).trim();report.startHead=git(['rev-parse','HEAD'],{encoding:'utf8'}).trim();report.branch=git(['branch','--show-current'],{encoding:'utf8'}).trim();
 const packageConfig=JSON.parse(await readFile(join(root,'package.json'),'utf8')),prefixPath=new URL(packageConfig.config.publicBaseUrl).pathname;
 assert(prefixPath.startsWith('/')&&prefixPath.endsWith('/')&&prefixPath!=='/','Set a non-root publicBaseUrl for prefix verification');
 report.scope.modes=options.prefix?['root','prefix']:['root'];report.scope.prefixPath=prefixPath;
 report.coreStart=await snapshot(allSites);report.preservation=await preservation(allSites,report.baselineHead);await save();
 const fixtures=new Map();for(const site of allSites){const path=join(root,'source',site.project,'reference');fixtures.set(site.number,{manifest:JSON.parse(await readFile(join(path,'ground-truth.json'),'utf8')),expected:JSON.parse(await readFile(join(path,'expected-result.json'),'utf8'))});}
 const require=createRequire(join(root,'package.json')),{chromium}=require('playwright'),installed='C:/Program Files/Google/Chrome/Application/chrome.exe',executablePath=options.chrome||(existsSync(installed)?installed:undefined);
 browser=await chromium.launch(executablePath?{executablePath,headless:true}:{channel:'chrome',headless:true});server=await startServer();report.server={pid:server.child.pid,origin:server.origin};
 let next=0;await Promise.all(Array.from({length:Math.min(options.concurrency,sites.length)},async()=>{while(next<sites.length){const site=sites[next++];for(const mode of report.scope.modes)await runContext(browser,server,site,mode,allSites,fixtures,prefixPath);}}));
 report.coreEnd=await snapshot(allSites);report.endHead=git(['rev-parse','HEAD'],{encoding:'utf8'}).trim();assert.deepEqual(report.coreEnd,report.coreStart,'Core changed while verifying');assert.equal(report.endHead,report.startHead);
 report.summary={stateTransitionProfiles:report.tests.filter(t=>t.stateTransitions).length,manifestFailureCases:report.tests.reduce((n,t)=>n+(t.manifestFailures?.length||0),0),diagnosticEdgeProfiles:report.tests.filter(t=>t.diagnosticEdges).length,contexts:report.tests.length,passed:report.tests.filter(t=>t.status==='PASS').length,inputs:report.tests.reduce((n,t)=>n+t.inputs.length,0),perfectComparisons:report.tests.filter(t=>t.perfect).length,viewports:report.tests.reduce((n,t)=>n+t.viewports.length,0),diagnosticViewports:report.tests.reduce((n,t)=>n+t.diagnosticViewports.length,0),independentProbes:report.tests.reduce((n,t)=>n+t.probes.length,0),publicFilesPreserved:report.preservation.publicFiles,referencesPreserved:report.preservation.referenceFiles,coreUnchanged:true};
 assert.equal(report.tests.length,sites.length*report.scope.modes.length);assert.equal(report.failures.length,0);report.status='PASS';
}catch(e){report.status='FAIL';report.failures.push({phase:'setup/preservation/final snapshot',message:e.message,stack:e.stack});console.error('DASHBOARD VERIFICATION FAIL',e.message);}
finally{await browser?.close();server?.child.kill();report.finishedAt=new Date().toISOString();await save();await saves;console.log('FINAL',JSON.stringify({status:report.status,summary:report.summary,failures:report.failures}));if(report.status!=='PASS')process.exitCode=1;}
