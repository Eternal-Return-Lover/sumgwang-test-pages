import {chromium} from 'playwright';
import {spawn} from 'node:child_process';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {resolve} from 'node:path';
import assert from 'node:assert/strict';
import {siteForProject,loadSites,deploymentFor} from '../../site-tools.mjs';

const site=await siteForProject(import.meta.url),sites=await loadSites();
const manifest=JSON.parse(await readFile('reference/ground-truth.json','utf8'));
const counts=JSON.parse(await readFile('reference/counts.json','utf8'));
const total=counts.expectedFindings,elements=counts.positiveElements+counts.negativeControls;
async function startServer(root){
 const child=spawn(process.execPath,['scripts/serve.mjs'],{cwd:resolve('.'),env:{...process.env,PORT:'0',STATIC_ROOT:root},stdio:'pipe'});
 let stderr='',stdout='';child.stderr.on('data',data=>stderr+=data);
 try{
  const origin=await new Promise((resolve,reject)=>{
   const timer=setTimeout(()=>{cleanup();reject(new Error('파일 서버 시작 시간 초과'));},10000);
   const cleanup=()=>{clearTimeout(timer);child.off('error',onError);child.off('exit',onExit);child.stdout.off('data',onData);};
   const onError=error=>{cleanup();reject(error);};
   const onExit=code=>{cleanup();reject(new Error('파일 서버 시작 실패 ('+code+'): '+stderr));};
   const onData=data=>{stdout+=data;const match=stdout.match(/Local: (http:\/\/127\.0\.0\.1:\d+\/)/);if(match){cleanup();resolve(match[1]);}};
   child.once('error',onError);child.once('exit',onExit);child.stdout.on('data',onData);
  });return {child,origin};
 }catch(error){child.kill();throw error;}
}
const server=await startServer(resolve('../..'));
let browser;
try{browser=await chromium.launch({executablePath:process.env.CHROME_PATH||'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});}
catch(error){server.child.kill();throw error;}
const base=new URL(site.targetDirectory+'/',server.origin).href;
const labUrl=new URL(deploymentFor(site).sourceDirectory+'/lab/index.html',server.origin).href;
const page=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[];
page.on('pageerror',error=>errors.push(error.message));
const report={base,labUrl,counts,checks:[],comparison:[],errors};
const check=(name,detail)=>{report.checks.push({name,detail});console.log(name,JSON.stringify(detail));};
const ready=()=>page.waitForFunction(total=>document.querySelector('#stat-findings')?.textContent===String(total),total);
const downloadResult=async()=>{
 const promise=page.waitForEvent('download');await page.locator('#download-result').click();
 const file=await promise,stream=await file.createReadStream(),chunks=[];
 for await(const chunk of stream)chunks.push(chunk);
 const bytes=Buffer.concat(chunks);assert.notEqual(bytes[0],239);
 return {data:JSON.parse(bytes.toString('utf8')),bytes};
};
const upload=async(name,data,want,raw)=>{
 await page.locator('#result-file').setInputFiles({name:'result.json',mimeType:'application/json',buffer:raw||Buffer.from(JSON.stringify(data))});
 await page.waitForFunction(()=>!document.querySelector('#result-file').disabled,null,{timeout:180000});
 const result=await page.locator('#score-output').evaluate(el=>el.dataset.result?JSON.parse(el.dataset.result):{error:el.textContent});
 for(const [key,value] of Object.entries(want))assert.equal(result[key],value,name+': '+key);
 report.comparison.push({name,expected:want,actual:result});console.log('comparison',name,JSON.stringify(result));
 return result;
};
await mkdir('artifacts',{recursive:true});
try{
 await page.goto(server.origin);
 assert.equal(await page.locator('a').count(),sites.length);
 await page.locator('a[href="'+site.targetDirectory+'/"]').click();
 assert((await page.locator('h1').innerText()).includes('오늘의 움직임이'));
 await page.screenshot({path:'artifacts/portal-desktop.png',fullPage:true});
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
 await page.setViewportSize({width:390,height:844});
 await page.screenshot({path:'artifacts/portal-mobile.png',fullPage:true});
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
 check('portal-layout',{desktop:'1440x1000',mobile:'390x844',overflow:false,rootLinks:sites.length});
 await page.setViewportSize({width:1440,height:1000});

 await page.goto(base+'community/list-1.html');
 assert.equal(await page.locator('.post-row').count(),8);
 assert.equal(await page.locator('.pagination a').count(),8);
 await page.locator('.pagination a').last().click();assert.equal(await page.locator('.post-row').count(),6);
 await page.locator('#board-search').fill('수영');await page.locator('.search-form button').click();assert(await page.locator('.post-row').count()>0);
 await page.locator('#board-search').fill('검색결과없는문장');await page.locator('.search-form button').click();assert.equal(await page.locator('.post-row').count(),0);
 await page.locator('#board-search').fill('');await page.locator('.search-form button').click();assert.equal(await page.locator('.post-row').count(),6);
 check('pagination-search',{pages:8,pageSize:8,lastPageItems:6,search:true,empty:true,reset:true});
 await page.goto(base+'community/view.html?id=901&venue=unknown');assert((await page.locator('#article-slot').innerText()).includes('찾을 수 없습니다'));
 const q1=manifest.cases.find(c=>c.caseId==='Q01'),q2=manifest.cases.find(c=>c.caseId==='Q02');
 for(const c of [q1,q2]){await page.goto(base+c.page);assert.equal(await page.locator(c.selector).textContent(),c.text);}
 check('query-content',{sameIdDifferentVenue:true,unknownMessage:true});

 const delayed=manifest.cases.find(c=>c.caseId==='T27');await page.goto(base+delayed.page);
 assert.equal(await page.locator(delayed.selector).count(),0);await page.locator(delayed.selector).waitFor({state:'attached',timeout:5000});
 check('delayed-comment',{delayMs:delayed.delayMs,before:false,after:true});
 const nested=manifest.cases.find(c=>c.caseId==='T35');await page.goto(base+nested.page);
 assert.equal(await page.locator('iframe.community-widget').count(),0);await page.waitForTimeout(nested.delayMs+600);
 let frame=page.mainFrame();for(const f of nested.frames)frame=await(await frame.$(f.selector)).contentFrame();
 assert.equal(await frame.locator(nested.selector).textContent(),nested.text);
 check('delayed-nested-frame',{frames:nested.frames.length,totalDelayMs:nested.delayMs});
 const triple=manifest.cases.find(c=>c.caseId==='T44');await page.goto(base+triple.page);await page.waitForTimeout(300);
 frame=page.mainFrame();for(const f of triple.frames)frame=await(await frame.$(f.selector)).contentFrame();
 assert.equal(await frame.locator(triple.selector).textContent(),triple.text);
 assert.equal((await page.request.get(base+'lab/index.html')).status(),404);
 check('public-frame-and-scope',{frames:3,labAbsent:true});

 await page.goto(labUrl);await ready();assert.equal(await page.locator('#entry-url').textContent(),base+'index.html');
 assert.equal(await page.locator('.case-row').count(),elements);
 await page.locator('[data-filter="normal"]').click();assert.equal(await page.locator('.case-row').count(),counts.negativeControls);
 await page.locator('[data-filter="OFFSCREEN"]').click();assert.equal(await page.locator('.case-row').count(),counts.techniques.OFFSCREEN);
 await page.locator('[data-filter="all"]').click();await page.locator('#case-search').fill('T44');assert.equal(await page.locator('.case-row').count(),1);await page.locator('#case-search').fill('');
 const downloaded=await downloadResult(),expected=downloaded.data;
 await writeFile('artifacts/expected-result.json',downloaded.bytes);
 assert.equal(expected.findings.length,total);assert.equal(expected.meta.entry_url,base+'index.html');
 const manifestPromise=page.waitForEvent('download');await page.locator('#download-manifest').click();
 const manifestFile=await manifestPromise,manifestStream=await manifestFile.createReadStream(),manifestChunks=[];
 for await(const chunk of manifestStream)manifestChunks.push(chunk);
 assert.deepEqual(JSON.parse(Buffer.concat(manifestChunks).toString('utf8')),manifest);
 check('lab-controls-downloads',{all:elements,normal:counts.negativeControls,findings:total,bom:false});

 const copy=()=>structuredClone(expected);
 await upload('완전한 정답',copy(),{tp:total,fn:0,fp:0,invalid:0,duplicates:0});
 let data=copy();data.findings=data.findings.slice(0,1);await upload('일부 정답 누락',data,{tp:1,fn:total-1,fp:0});
 const normal=manifest.negativeControls[0];data=copy();data.findings=[{id:'normal',url:base+normal.page,is_violation:true,location:normal.selector,evidence_text:normal.text,technique:'OFFSCREEN'}];
 await upload('정상 요소 오탐',data,{tp:0,fn:total,fp:1});
 data=copy();data.findings=[data.findings[0],{...data.findings[0],id:'duplicate',url:data.findings[0].url+'#note',location:'article.article div.entry-fragment > p.excerpt'}];
 await upload('동일 요소 다른 선택자의 중복',data,{tp:1,fn:total-1,fp:0,duplicates:1});
 data=copy();data.findings=[{...data.findings[0],location:'article.article div.entry-fragment > p.excerpt',evidence_text:'다른 원문 표기'}];
 await upload('다른 CSS와 원문',data,{tp:1,fn:total-1,fp:0});
 data=copy();data.findings=[{...data.findings[0],location:'p'}];await upload('모호한 선택자',data,{tp:0,fn:total,fp:1});
 data=copy();data.findings=[data.findings[0]];delete data.findings[0].evidence_text;await upload('필수 필드 누락',data,{tp:0,fn:total,invalid:1});
 assert((await upload('잘못된 JSON',null,{},Buffer.from('{broken'))).error.includes('JSON'));
 assert((await upload('BOM 포함',null,{},Buffer.concat([Buffer.from([239,187,191]),downloaded.bytes]))).error.includes('BOM'));
 const query=expected.findings.find(f=>f.id==='Q01_JAMO');data=copy();data.findings=[{...query,url:query.url.replace('id=901&venue=pool','venue=pool&id=901')+'#note'}];
 await upload('쿼리 순서와 fragment',data,{tp:1,fn:total-1,fp:0});
 data=copy();data.findings=[{...query,url:query.url.replace('venue=pool','venue=gym')}];await upload('쿼리 값이 다른 본문',data,{tp:0,fn:total,fp:1});
 data=copy();data.findings=[data.findings.find(f=>f.id==='T29_JAMO')];data.findings[0].location=data.findings[0].location.replace(base+'widgets/','../../widgets/').replace(base+'widgets/','./');
 await upload('상대 iframe 경로',data,{tp:1,fn:total-1,fp:0});
 data=copy();data.findings=[data.findings[0],{...data.findings[0]}];await upload('ID 중복',data,{tp:1,invalid:1});
 data=copy();data.findings=[{id:'ordinary-1',url:base+'facilities/index.html',is_violation:true,location:'h1',evidence_text:'일반 시설 제목',technique:'HOMOGLYPH'},{id:'ordinary-2',url:base+'facilities/index.html#title',is_violation:true,location:'main > div.page-heading > h1',evidence_text:'일반 시설 제목',technique:'HOMOGLYPH'}];
 await upload('일반 안내 동일 요소 오탐 중복',data,{tp:0,fn:total,fp:1,duplicates:1});
 data=copy();data.findings=[{...data.findings[0],url:data.findings[0].url.replace('http:','https:')+'/'}];await upload('프로토콜과 끝 슬래시',data,{tp:1,fn:total-1,fp:0});
 data=copy();data.meta.entry_url=[data.meta.entry_url];assert((await upload('entry_url 타입 오류',data,{})).error.includes('entry_url'));
 data=copy();data.findings=[];await upload('검출 없음',data,{tp:0,fn:total,fp:0,invalid:0});assert((await page.locator('#score-output').innerText()).includes('계산 불가'));
 data=copy();data.findings=data.findings.filter(f=>f.url===base+'community/posts/7335.html');await upload('한 글의 복수 광고 요소',data,{tp:4,fn:total-4,fp:0});

 await page.locator('#audit').click();await page.waitForFunction(()=>document.querySelector('#audit-status').textContent.startsWith('검증 완료'),null,{timeout:120000});
 const audit=await page.locator('#audit-status').innerText();assert(audit.includes(elements+' / '+elements));check('DOM-audit',{result:audit});
 await page.locator('#crawl').click();await page.waitForFunction(()=>document.querySelector('#crawl-status').dataset.result,null,{timeout:240000});
 const crawl=JSON.parse(await page.locator('#crawl-status').getAttribute('data-result'));
 assert.equal(crawl.reachable,counts.scenarioPages);assert.equal(crawl.maxDepth,6);assert.deepEqual(crawl.errors,[]);assert.deepEqual(crawl.missing,[]);check('entry-link-crawl',crawl);
 await page.screenshot({path:'artifacts/lab-desktop.png',fullPage:true});await page.setViewportSize({width:390,height:844});
 await page.screenshot({path:'artifacts/lab-mobile.png',fullPage:true});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);check('lab-mobile',{overflow:false});
 await page.setViewportSize({width:1440,height:1000});

 const standalone=await startServer(resolve('dist'));
 try{await page.goto(new URL('lab/index.html',standalone.origin).href);await ready();assert.equal(await page.locator('#entry-url').textContent(),new URL('index.html',standalone.origin).href);await page.locator('#audit').click();await page.waitForFunction(()=>document.querySelector('#audit-status').textContent.startsWith('검증 완료'),null,{timeout:120000});assert((await page.locator('#audit-status').innerText()).includes(elements+' / '+elements));check('standalone-dist',{audit:elements+' / '+elements});}
 finally{standalone.child.kill();}

 // Browser-only mount of the real artifact at the expected GitHub Pages prefix.
 const prefix='/sumgwang-test-pages/';
 await page.route('**/sumgwang-test-pages/**',async route=>{
  const url=new URL(route.request().url());
  const response=await route.fetch({url:new URL(url.pathname.slice(prefix.length)+url.search,server.origin).href});
  await route.fulfill({response});
 });
 await page.goto(new URL(prefix+deploymentFor(site).sourceDirectory+'/lab/index.html',server.origin).href);await ready();
 const prefixed=await downloadResult();assert.equal(prefixed.data.meta.entry_url,new URL(prefix+site.targetDirectory+'/index.html',server.origin).href);
 await upload('GitHub Pages 하위 경로',prefixed.data,{tp:total,fn:0,fp:0,invalid:0,duplicates:0});
 check('pages-prefix',{entry:prefixed.data.meta.entry_url,tp:total,fn:0,fp:0});
 await page.unroute('**/sumgwang-test-pages/**');
 assert.deepEqual(errors,[]);report.ok=true;
}finally{
 await writeFile('artifacts/browser-report.json',JSON.stringify(report,null,2)+'\n');
 await browser.close();server.child.kill();
}
