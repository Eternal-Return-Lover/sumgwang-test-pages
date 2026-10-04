import {chromium} from 'playwright';
import {spawn} from 'node:child_process';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {resolve} from 'node:path';
import assert from 'node:assert/strict';
import {siteForProject,loadSites,deploymentFor} from '../../site-tools.mjs';
const site=await siteForProject(import.meta.url),sites=await loadSites();
async function startServer(root){
 const child=spawn(process.execPath,['scripts/serve.mjs'],{cwd:resolve('.'),env:{...process.env,PORT:'0',STATIC_ROOT:root},stdio:'pipe'});
 let stderr='';child.stderr.on('data',data=>stderr+=data);
 try{const origin=await new Promise((resolve,reject)=>{
  const timer=setTimeout(()=>{cleanup();reject(new Error('파일 서버 시작 시간 초과'));},10000);
  const cleanup=()=>{clearTimeout(timer);child.off('error',onError);child.off('exit',onExit);child.stdout.off('data',onData);};
  const onError=error=>{cleanup();reject(error);};
  const onExit=code=>{cleanup();reject(new Error('파일 서버 시작 실패 ('+code+'): '+stderr));};
  let stdout='';const onData=data=>{stdout+=data;const match=stdout.match(/Local: (http:\/\/127\.0\.0\.1:\d+\/)/);if(match){cleanup();resolve(match[1]);}};
  child.once('error',onError);child.once('exit',onExit);child.stdout.on('data',onData);
 });return {child,origin};}catch(error){child.kill();throw error;}
}
const server=await startServer(resolve('../..'));
const origin=server.origin;
let browser;
try{browser=await chromium.launch({executablePath:process.env.CHROME_PATH||'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});}
catch(error){server.child.kill();throw error;}
const base=new URL(site.targetDirectory+'/',origin).href;
const labUrl=new URL(deploymentFor(site).sourceDirectory+'/lab/index.html',origin).href;
const page=await browser.newPage({viewport:{width:1440,height:1000}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
const report={base,labUrl,checks:[],comparison:[],errors};
const check=(name,detail)=>{report.checks.push({name,detail});console.log(name,JSON.stringify(detail));};
await mkdir('artifacts',{recursive:true});
try{
 await page.goto(base);await page.screenshot({path:'artifacts/portal-desktop.png',fullPage:true});assert(await page.locator('h1').innerText());assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);check('desktop',{viewport:'1440x1000',overflow:false});
 await page.setViewportSize({width:390,height:844});await page.screenshot({path:'artifacts/portal-mobile.png',fullPage:true});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);check('mobile',{viewport:'390x844',overflow:false});await page.setViewportSize({width:1440,height:1000});
 await page.goto(base+'board/list-1.html');assert.equal(await page.locator('.post-row').count(),10);await page.locator('.pagination a').last().click();assert.equal(await page.locator('.post-row').count(),8);await page.locator('#board-search').fill('그림책');await page.locator('.search-form button').click();assert((await page.locator('.post-row').count())>0);await page.locator('#board-search').fill('검색결과없는문장');await page.locator('.search-form button').click();assert.equal(await page.locator('.post-row').count(),0);check('pagination-search',{pages:6,lastPageItems:8,search:true,noResult:true});
 const manifest=JSON.parse(await readFile('reference/ground-truth.json','utf8'));
 const delayed=manifest.cases.find(c=>c.caseId==='T27');await page.goto(base+delayed.page);assert.equal(await page.locator(delayed.selector).count(),0);await page.locator(delayed.selector).waitFor({state:'attached',timeout:4000});check('delayed-node',{delayMs:delayed.delayMs,presentBefore:false,presentAfter:true});
 const nested=manifest.cases.find(c=>c.caseId==='T37');await page.goto(base+nested.page);assert.equal(await page.locator('iframe.community-widget').count(),0);await page.waitForTimeout(2900);let frame=page.mainFrame();for(const f of nested.frames)frame=await (await frame.$(f.selector)).contentFrame();assert.equal(await frame.locator(nested.selector).textContent(),nested.text);check('nested-delayed-frame',{frames:nested.frames.length,totalNominalDelayMs:nested.delayMs});
 await page.goto(labUrl);await page.waitForFunction(()=>document.querySelector('#stat-findings').textContent==='61');assert.equal(await page.locator('.case-row').count(),64);await page.locator('[data-filter="normal"]').click();assert.equal(await page.locator('.case-row').count(),16);await page.locator('[data-filter="all"]').click();await page.locator('#case-search').fill('T38');assert.equal(await page.locator('.case-row').count(),1);await page.locator('#case-search').fill('');check('lab-filter-search',{all:64,normal:16,search:1});
 const downloadPromise=page.waitForEvent('download');await page.locator('#download-result').click();const download=await downloadPromise;await download.saveAs('artifacts/expected-result.json');const bytes=await readFile('artifacts/expected-result.json');assert.notEqual(bytes[0],239);const expected=JSON.parse(bytes.toString('utf8'));assert.equal(expected.findings.length,61);assert.equal(expected.meta.entry_url,base+'index.html');check('download',{findings:61,bom:false,baseReflected:true});
 const upload=async(name,data,want,raw)=>{const buffer=raw||Buffer.from(JSON.stringify(data));await page.locator('#result-file').setInputFiles({name:'result.json',mimeType:'application/json',buffer});await page.waitForFunction(()=>!document.querySelector('#result-file').disabled,null,{timeout:120000});const result=await page.locator('#score-output').evaluate(el=>el.dataset.result?JSON.parse(el.dataset.result):{error:el.textContent});for(const [k,v]of Object.entries(want))assert.equal(result[k],v,name+': '+k);report.comparison.push({name,expected:want,actual:result});console.log('comparison',name,JSON.stringify(result));};
 const copy=()=>structuredClone(expected);
 await upload('완전한 정답',copy(),{tp:61,fn:0,fp:0,invalid:0,duplicates:0});
 let d=copy();d.findings=d.findings.slice(0,1);await upload('일부 정답 누락',d,{tp:1,fn:60,fp:0});
 const negative=manifest.negativeControls[0];d=copy();d.findings=[{id:'normal',url:base+negative.page,is_violation:true,location:negative.selector,evidence_text:negative.text,technique:'OFFSCREEN'}];await upload('정상 요소 오탐',d,{tp:0,fn:61,fp:1});
 d=copy();d.findings=[d.findings[0],{...d.findings[0],id:'duplicate',url:d.findings[0].url+'#reply',location:'article.article div.entry-fragment > p.excerpt'}];await upload('중복과 다른 선택자',d,{tp:1,fn:60,duplicates:1,fp:0});
 d=copy();d.findings=[{...d.findings[0],location:'article.article div.entry-fragment > p.excerpt',evidence_text:'원문 문자열 차이'}];await upload('동일 요소 다른 CSS와 원문',d,{tp:1,fn:60,fp:0});
 d=copy();d.findings=[{...d.findings[0],location:'p'}];await upload('모호한 선택자',d,{tp:0,fn:61,fp:1});
 d=copy();d.findings=[d.findings[0]];delete d.findings[0].evidence_text;await upload('필수 필드 누락',d,{tp:0,fn:61,invalid:1});
 await upload('잘못된 JSON',null,{},Buffer.from('{broken'));assert((await page.locator('#score-output').innerText()).includes('JSON'));
 await upload('BOM 포함',null,{},Buffer.concat([Buffer.from([239,187,191]),Buffer.from(JSON.stringify(expected))]));assert((await page.locator('#score-output').innerText()).includes('BOM'));
 d=copy();const q=d.findings.find(f=>f.id==='Q01_JAMO');d.findings=[{...q,url:q.url.replace('id=1024&edition=autumn','edition=autumn&id=1024')+'#note'}];await upload('쿼리 순서 fragment',d,{tp:1,fn:60,fp:0});
 d=copy();d.findings=[d.findings.find(f=>f.id==='T29_JAMO')];d.findings[0].location=d.findings[0].location.replace(base+'widgets/','../../widgets/').replace(base+'widgets/','./');await upload('상대 iframe src',d,{tp:1,fn:60,fp:0});
 d=copy();d.findings=[d.findings[0],{...d.findings[0]}];await upload('고유 ID 중복',d,{tp:1,invalid:1});
 d=copy();d.findings=[{id:'ordinary-1',url:base+'about/index.html',is_violation:true,location:'h1',evidence_text:'일반 안내 제목',technique:'HOMOGLYPH'},{id:'ordinary-2',url:base+'about/index.html#title',is_violation:true,location:'main > div.page-heading > h1',evidence_text:'일반 안내 제목',technique:'HOMOGLYPH'}];await upload('일반 페이지 오탐의 동일 요소 중복',d,{tp:0,fn:61,fp:1,duplicates:1});
 d=copy();d.findings=[{...q,url:q.url.replace('edition=autumn','edition=winter')}];await upload('다른 쿼리 값은 다른 페이지',d,{tp:0,fn:61,fp:1});
 d=copy();d.findings=[{...d.findings[0],url:d.findings[0].url.replace('http:','https:')+'/'}];await upload('HTTP HTTPS 끝 슬래시 동등성',d,{tp:1,fn:60,fp:0});
 d=copy();d.meta.entry_url=[d.meta.entry_url];await upload('진입 URL 필드 타입 오류',d,{});assert((await page.locator('#score-output').innerText()).includes('entry_url'));
 d=copy();d.findings=[];await upload('검출 없는 정상 스키마',d,{tp:0,fn:61,fp:0,invalid:0});assert((await page.locator('#score-output').innerText()).includes('계산 불가'));
 await page.goto(origin);assert.equal(await page.locator('a').count(),sites.length);await page.locator('a[href="'+site.targetDirectory+'/"]').click();assert((await page.locator('h1').innerText()).includes('책 한 권'));
 const publicBase=base;
 const third=manifest.cases.find(c=>c.caseId==='T38');await page.goto(publicBase+third.page);await page.waitForTimeout(650);let publicFrame=page.mainFrame();for(const f of third.frames)publicFrame=await(await publicFrame.$(f.selector)).contentFrame();assert.equal(await publicFrame.locator(third.selector).textContent(),third.text);check('public-deployment',{rootLinks:sites.length,frames:3,labAbsent:(await page.request.get(publicBase+'lab/index.html')).status()===404});
 assert.equal((await page.request.get(publicBase+'lab/index.html')).status(),404);
 await page.goto(labUrl);await page.waitForFunction(()=>document.querySelector('#stat-findings').textContent==='61');
 await page.locator('#audit').click();await page.waitForFunction(()=>document.querySelector('#audit-status').textContent.startsWith('검증 완료'),null,{timeout:120000});const audit=await page.locator('#audit-status').innerText();assert(audit.includes('64 / 64'));check('DOM-audit',{result:audit});
 await page.locator('#crawl').click();await page.waitForFunction(()=>document.querySelector('#crawl-status').dataset.result,null,{timeout:240000});const crawl=JSON.parse(await page.locator('#crawl-status').getAttribute('data-result'));assert.equal(crawl.reachable,60);assert.equal(crawl.errors.length,0);assert.equal(crawl.maxDepth,5);check('entry-link-crawl',crawl);
 await page.screenshot({path:'artifacts/lab-desktop.png',fullPage:true});await page.setViewportSize({width:390,height:844});await page.screenshot({path:'artifacts/lab-mobile.png',fullPage:true});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);check('lab-mobile',{overflow:false});
 const firstSite=sites.find(s=>s.project==='hanbit-civic-ad-lab');
 await page.goto(new URL(deploymentFor(firstSite).sourceDirectory+'/lab/index.html',origin).href);await page.waitForFunction(()=>document.querySelector('#stat-findings').textContent==='40');assert.equal(await page.locator('#entry-url').textContent(),new URL(firstSite.targetDirectory+'/index.html',origin).href);const firstDownload=page.waitForEvent('download');await page.locator('#download-result').click();const firstFile=await firstDownload;const firstStream=await firstFile.createReadStream();const chunks=[];for await(const chunk of firstStream)chunks.push(chunk);const firstExpected=JSON.parse(Buffer.concat(chunks).toString('utf8'));await page.locator('#result-file').setInputFiles({name:'result.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(firstExpected))});await page.waitForFunction(()=>!document.querySelector('#result-file').disabled,null,{timeout:120000});const firstScore=await page.locator('#score-output').innerText();assert(/정탐 TP\s*40/.test(firstScore)&&/미탐 FN\s*0/.test(firstScore)&&/오탐 FP\s*0/.test(firstScore));check('site-1-published-result',{tp:40,fn:0,fp:0,entry:firstExpected.meta.entry_url});
 // Serve the same artifact at the origin root, without a rewrite rule.
 const rootServer=await startServer(resolve('dist'));try{await page.goto(new URL('lab/index.html',rootServer.origin).href);await page.waitForFunction(()=>document.querySelector('#stat-findings').textContent==='61');await page.locator('#audit').click();await page.waitForFunction(()=>document.querySelector('#audit-status').textContent.startsWith('검증 완료'),null,{timeout:120000});assert((await page.locator('#audit-status').innerText()).includes('64 / 64'));check('root-deployment',{audit:'64 / 64'});}finally{rootServer.child.kill();}
 // Remap existing fixtures only in the browser to prove two-digit numbering and a Pages prefix.
 const prefix='/sumgwang-test-pages/',virtualTarget='test-site-10';
 const virtualBase=new URL(prefix+virtualTarget+'/',origin).href;
 const virtualSource=prefix+deploymentFor(site).sourceDirectory+'/';
 await page.route('**/sumgwang-test-pages/**',async route=>{
  const url=new URL(route.request().url());let original;
  if(url.pathname.startsWith(prefix+virtualTarget+'/'))original=site.targetDirectory+'/'+url.pathname.slice((prefix+virtualTarget+'/').length);
  else if(url.pathname.startsWith(virtualSource))original=deploymentFor(site).sourceDirectory+'/'+url.pathname.slice(virtualSource.length);
  else return route.fulfill({status:404,body:'Unknown virtual path'});
  const response=await route.fetch({url:new URL(original+url.search,origin).href});
  if(original.endsWith('/lab/manifest.json')){
   const remapped=await response.json();remapped.deployment.targetDirectory=virtualTarget;
   await route.fulfill({response,json:remapped});
  }else await route.fulfill({response});
 });
 await page.goto(new URL(virtualSource+'lab/index.html',origin).href);
 await page.waitForFunction(()=>document.querySelector('#stat-findings').textContent==='61');
 assert.equal(await page.locator('#entry-url').textContent(),virtualBase+'index.html');
 const virtualDownload=page.waitForEvent('download');await page.locator('#download-result').click();
 const virtualFile=await virtualDownload,virtualStream=await virtualFile.createReadStream(),virtualChunks=[];
 for await(const chunk of virtualStream)virtualChunks.push(chunk);
 const virtualExpected=JSON.parse(Buffer.concat(virtualChunks).toString('utf8'));
 assert(virtualExpected.findings.every(f=>f.url.startsWith(virtualBase)));
 await upload('두 자리 번호와 GitHub Pages 경로',virtualExpected,{tp:61,fn:0,fp:0,invalid:0,duplicates:0});
 check('multi-digit-pages-deployment',{entry:virtualExpected.meta.entry_url,tp:61,fn:0,fp:0});
 await page.unroute('**/sumgwang-test-pages/**');
 assert.deepEqual(errors,[]);report.ok=true;
}finally{await writeFile('artifacts/browser-report.json',JSON.stringify(report,null,2)+'\n');await browser.close();server.child.kill();}
