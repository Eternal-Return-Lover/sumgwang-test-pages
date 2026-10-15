import {categoryCounts,validateCategoryAnnotations} from './shared/categories.js';
import {readFile,writeFile,readdir,mkdir,cp,rm,stat,lstat} from 'node:fs/promises';
import {resolve,dirname,basename,join,relative,sep} from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
import assert from 'node:assert/strict';

export const repositoryRoot=fileURLToPath(new URL('../',import.meta.url));
const techniques=['HOMOGLYPH','JAMO','TRANSPARENT','OFFSCREEN'];
const escape=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

export function validateSites(input){
 assert(Array.isArray(input)&&input.length>0,'sites.json must be a non-empty array');
 const numbers=new Set(),projects=new Set(),ids=new Set(),ports=new Set();
 const sites=input.map(value=>{
  assert(value&&typeof value==='object'&&!Array.isArray(value),'Invalid site registration');
  assert(Number.isSafeInteger(value.number)&&value.number>0,'Site number must be a positive integer');
  assert(typeof value.project==='string'&&/^[a-z][a-z0-9-]*$/.test(value.project),'Invalid source project directory');
  assert(typeof value.siteId==='string'&&/^[a-z][a-z0-9-]*$/.test(value.siteId),'Invalid siteId');
  assert(typeof value.title==='string'&&value.title.trim(),'Site title is required');
  assert(value.description===undefined||(typeof value.description==='string'&&value.description.trim()),'Site description must be a non-empty string');
  const port=value.port??4172+value.number;
  assert(Number.isInteger(port)&&port>=1024&&port<=65535,'Set a valid port for this site');
  for(const [seen,key,label] of [[numbers,value.number,'number'],[projects,value.project,'project'],[ids,value.siteId,'siteId'],[ports,port,'port']]){
   assert(!seen.has(key),'Duplicate site '+label+': '+key);seen.add(key);
  }
  const directory='test-site-'+value.number;
  assert.equal(value.project,directory,'Source project must be '+directory);
  return {...value,port,targetDirectory:directory};
 });
 return sites.sort((a,b)=>a.number-b.number);
}
export async function loadSites(root=repositoryRoot){return validateSites(JSON.parse(await readFile(join(root,'source/sites.json'),'utf8')));}
export async function siteForProject(scriptUrl){
 const project=basename(dirname(dirname(fileURLToPath(scriptUrl))));
 const site=(await loadSites()).find(s=>s.project===project);
 assert(site,'Register source/'+project+' in source/sites.json');
 return site;
}
export function deploymentFor(site){return {targetDirectory:site.targetDirectory,sourceDirectory:'source/'+site.project};}
export function renderIndex(sites){
 const entries=validateSites(sites);
 const icon=path=>'<svg class="icon" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">'+path+'</svg>';
 const arrow=icon('<path d="M7 17 17 7M7 7h10v10"/>');
 const chart=icon('<path d="M4 17v3h16v-3M5 13l4-5 4 4 6-8"/><path d="M15 4h4v4"/>');
 const building=icon('<path d="M3 21h18M5 21V9h14v12M3 9l9-6 9 6M9 13v2m6-2v2M10 21v-3h4v3"/>');
 const cards=entries.map(s=>`      <li class="site-card" data-site-number="${s.number}">
        <div class="card-top"><span class="site-number">${s.targetDirectory}</span><span class="card-icon">${building}</span></div>
        <h3><a class="card-title" href="${s.targetDirectory}/">${escape(s.title)}</a></h3>
        <p class="card-description">${escape(s.description||'가상 공공기관 콘텐츠에서 탐지 결과를 확인하세요.')}</p>
        <code class="card-path">${s.targetDirectory}/</code>
        <div class="card-actions">
          <a class="button button-site" data-site-link href="${s.targetDirectory}/" aria-label="${escape(s.title)} 테스트 사이트 열기">사이트 열기 ${arrow}</a>
          <a class="card-validate" data-validation-link href="validator/?site=${s.number}" aria-label="test-site-${s.number} 결과 검증하기">검증하기 ${arrow}</a>
        </div>
      </li>`).join('\n');
 return `<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="description" content="숨광 테스트 사이트를 둘러보고 result.json을 공통 대시보드에서 검증하세요.">
  <meta name="theme-color" content="#087f79">
  <title>테스트 사이트 · 숨광</title>
  <link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40'%3E%3Crect width='40' height='40' rx='12' fill='%23087f79'/%3E%3Cpath d='M10 28h20M11 22l6-9 6 7 6-10' fill='none' stroke='white' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E">
  <link rel="stylesheet" href="assets/hub.css">
</head>
<body class="site-hub">
  <a class="skip-link" href="#main">본문으로 바로가기</a>
  <header class="site-header">
    <div class="container header-inner">
      <a class="brand" href="./" aria-label="숨광 테스트 사이트 홈">
        <span class="brand-mark">${chart}</span>
        <span class="brand-copy"><strong>숨광</strong><small>TEST LAB</small></span>
      </a>
      <nav class="header-nav" aria-label="주요 메뉴"><a class="header-link" href="validator/">검증 대시보드 ${arrow}</a></nav>
    </div>
  </header>
  <main id="main" tabindex="-1">
    <div class="container">
      <section class="hero" aria-labelledby="hero-title">
        <div class="hero-copy">
          <p class="eyebrow">TEST &amp; VALIDATE</p>
          <h1 id="hero-title">테스트와 결과 검증,<br><span>한곳에서 시작하세요.</span></h1>
          <p class="hero-description">기관별 테스트 사이트에서 탐지 도구를 실행하고,<br>result.json을 올려 정답과 비교해 보세요.</p>
          <div class="hero-actions">
            <a class="button button-primary" href="validator/">검증 대시보드 열기 ${arrow}</a>
            <a class="button button-secondary" href="#sites">사이트 둘러보기 <span aria-hidden="true">↓</span></a>
          </div>
          <p class="hero-meta"><span class="status-dot" aria-hidden="true"></span>등록된 테스트 사이트 <strong>${entries.length}개</strong> · 공통 결과 검증</p>
        </div>
        <div class="hero-visual" aria-hidden="true">
          <div class="flow-panel">
            <div class="flow-heading"><span class="flow-icon">${chart}</span><p>탐지에서 검증까지</p></div>
            <ol class="flow-steps">
              <li><span class="step-number">01</span><div><strong>테스트 사이트 선택</strong><span>기관별 콘텐츠를 탐지하세요.</span></div></li>
              <li><span class="step-number">02</span><div><strong>result.json 준비</strong><span>탐지 결과 파일을 올려 주세요.</span></div></li>
              <li><span class="step-number">03</span><div><strong>정답과 결과 비교</strong><span>미탐·오탐과 실패 이유를 확인하세요.</span></div></li>
            </ol>
            <div class="flow-footer">${icon('<path d="m5 12 4 4L19 6"/>')}<span>결과 파일은 브라우저 안에서 처리합니다.</span></div>
          </div>
        </div>
      </section>
      <aside class="crawl-note" aria-labelledby="crawl-title">
        <span class="note-icon">${icon('<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7h.01"/>')}</span>
        <div><h2 id="crawl-title">탐지 시작 주소를 확인해 주세요</h2><p>각 카드의 <strong>사이트 열기</strong>로 이동한 <code>test-site-N/</code> 주소를 탐지기에 입력하세요. 이 목록 페이지에는 검증 대시보드 링크도 포함되어 있습니다.</p></div>
      </aside>
      <section id="sites" class="site-section" aria-labelledby="sites-title">
        <div class="section-heading"><div><p class="eyebrow">TEST SITES</p><h2 id="sites-title">테스트 사이트 목록</h2></div><p class="section-count">총 <strong>${entries.length}</strong>개 사이트</p></div>
        <ul class="site-grid">
${cards}
        </ul>
      </section>
    </div>
  </main>
  <footer class="site-footer"><div class="container footer-inner"><p>모든 기관과 콘텐츠는 테스트용 합성 자료입니다.<br>비교 결과는 공식 심사 점수가 아닙니다.</p><a href="validator/">결과 검증하기 ${arrow}</a></div></footer>
</body>
</html>
`;
}
export async function updateIndex(root=repositoryRoot){await writeFile(join(root,'index.html'),renderIndex(await loadSites(root)),'utf8');}
export async function walk(dir){
 const files=[];
 for(const item of await readdir(dir,{withFileTypes:true})){
  assert(!item.isSymbolicLink(),'Generated directories must not contain symlinks');
  const path=join(dir,item.name);files.push(...(item.isDirectory()?await walk(path):[path]));
 }
 return files;
}
export async function publishSite(site,root=repositoryRoot){
 const checked=validateSites([site])[0],repo=resolve(root),target=resolve(repo,checked.targetDirectory);
 // Delete only this registered generated directory, never source or the repository.
 assert(dirname(target)===repo&&basename(target)===checked.targetDirectory,'Unsafe deployment directory');
 const dist=buildDirectoryFor(checked,repo);
 const files=(await walk(dist)).filter(f=>relative(dist,f).split(sep)[0]!=='lab');
 assert(files.includes(join(dist,'index.html')),'Build dist/index.html before publishing');
 const targetInfo=await lstat(target).catch(e=>{if(e.code==='ENOENT')return null;throw e;});
 if(targetInfo)assert(targetInfo.isDirectory(),'Deployment target must be a directory');
 // walk() has completed before cleanup; excluded lab files are never published.
 await rm(target,{recursive:true,force:true});await mkdir(target,{recursive:true});
 for(const file of files){const destination=join(target,relative(dist,file));await mkdir(dirname(destination),{recursive:true});await cp(file,destination);}
 await updateIndex(repo);
}
export async function checkDeployment(site,root=repositoryRoot){
 const dist=buildDirectoryFor(site,root),target=join(root,site.targetDirectory);
 const expected=(await walk(dist)).filter(f=>relative(dist,f).split(sep)[0]!=='lab'),actual=await walk(target);
 assert.equal(actual.length,expected.length,'Deployment contains stale or missing files: '+site.targetDirectory);
 for(const file of expected)assert.deepEqual(await readFile(join(target,relative(dist,file))),await readFile(file),'Deployment differs: '+file);
 return actual.length;
}
export async function checkManifest(site,sourceModule){
 const projectRoot=join(repositoryRoot,'source',site.project),dist=buildDirectoryFor(site);
 const manifest=JSON.parse(await readFile(join(projectRoot,'reference/ground-truth.json'),'utf8'));
 validateCategoryAnnotations(manifest);
 assert.deepEqual(JSON.parse(await readFile(join(dist,'lab/manifest.json'),'utf8')),manifest,'Lab and reference manifests differ');
 assert.equal(manifest.siteId,site.siteId);assert.equal(manifest.siteName,site.title);assert.deepEqual(manifest.deployment,deploymentFor(site));
 const scenarios=[...sourceModule.fixtures,...(sourceModule.queryFixtures||[])];
 const extra=(sourceModule.extraElements||[]).map(f=>({...f,path:scenarios.find(p=>p.key===f.parent)?.path}));
 const definitions=[...scenarios,...extra],cases=[...manifest.cases,...manifest.negativeControls];
 assert.equal(new Set(definitions.map(c=>c.key)).size,definitions.length,'Duplicate source case IDs');
 assert.equal(new Set(cases.map(c=>c.caseId)).size,cases.length,'Duplicate manifest case IDs');
 assert.equal(cases.length,definitions.length);
 for(const definition of definitions){
  const c=cases.find(c=>c.caseId===definition.key);assert(c,'Missing case '+definition.key);
  for(const field of ['primaryCategory','annotationReason','relatedCategory','normalReason'])assert.deepEqual(c[field],definition[field],'Annotation differs: '+definition.key+' '+field);
  assert.equal(c.page,definition.path);assert.equal(c.text,definition.text);assert.deepEqual(c.techniques,definition.techniques);
  assert(typeof c.selector==='string'&&c.selector.length);assert(Array.isArray(c.frames));
  for(const code of c.techniques)assert(techniques.includes(code),'Unknown technique '+code);
  assert((await stat(join(dist,c.page.split('?')[0]))).isFile());
  for(const f of c.frames)assert((await stat(join(dist,f.src))).isFile());
 }
 assert.equal(manifest.cases.length,definitions.filter(c=>c.techniques.length).length);
 assert.equal(manifest.negativeControls.length,definitions.filter(c=>!c.techniques.length).length);
 assert.equal(manifest.scenarioCount,scenarios.length);
 const totals={};for(const c of manifest.cases)for(const t of c.techniques)totals[t]=(totals[t]||0)+1;
 return {scenarioPages:new Set(cases.map(c=>c.page)).size,positiveElements:manifest.cases.length,negativeControls:manifest.negativeControls.length,expectedFindings:manifest.cases.reduce((n,c)=>n+c.techniques.length,0),techniques:totals};
}

export function buildDirectoryFor(site,root=repositoryRoot){return join(root,'tmp','build',validateSites([site])[0].targetDirectory);}
export function buildRootFor(site){return pathToFileURL(buildDirectoryFor(site)+sep);}
export function countsFor(manifest){
 const all=[...manifest.cases,...manifest.negativeControls],techniques={};
 for(const c of manifest.cases)for(const t of c.techniques)techniques[t]=(techniques[t]||0)+1;
 const categories=categoryCounts(manifest);validateCategoryAnnotations(manifest);
 return {...(categories?{categories}:{}),scenarios:manifest.scenarioCount,scenarioPages:new Set(all.map(c=>c.page)).size,positiveElements:manifest.cases.length,negativeControls:manifest.negativeControls.length,expectedFindings:manifest.cases.reduce((n,c)=>n+c.techniques.length,0),techniques};
}
export function expectedResultFor(manifest,publicBaseUrl){
 const publicBase=new URL(publicBaseUrl);assert(['http:','https:'].includes(publicBase.protocol),'Public base must use HTTP(S)');assert(!publicBase.search&&!publicBase.hash,'Public base must not contain query or fragment');if(!publicBase.pathname.endsWith('/'))publicBase.pathname+='/';
 const base=new URL(manifest.deployment.targetDirectory+'/',publicBase),timestamp='2000-01-01T00:00:00.000Z';
 return {meta:{topic:'TOPIC',entry_url:new URL(manifest.entry,base).href,started_at:timestamp,finished_at:timestamp,elapsed_sec:0,tool_version:manifest.siteId==='hanbit-civic'?'hanbit-reference-1.0.0':'reference-1.0.0'},findings:manifest.cases.flatMap(c=>c.techniques.map(t=>({id:c.caseId+'_'+t,url:new URL(c.page,base).href,is_violation:true,location:[...c.frames.map(f=>'iframe[src="'+new URL(f.src,base).href+'"]'),c.selector].join(' >>> '),evidence_text:c.text,technique:t})))};
}
export async function writeLab(site){
 const project=join(repositoryRoot,'source',site.project),dist=buildDirectoryFor(site),lab=join(dist,'lab'),source=join(project,'lab');
 const manifest=JSON.parse(await readFile(join(project,'reference/ground-truth.json'),'utf8')),counts=countsFor(manifest),config=JSON.parse(await readFile(join(repositoryRoot,'package.json'),'utf8')).config;
 await mkdir(lab,{recursive:true});
 const html=await readFile(join(source,'index.html'),'utf8'),engine=html.includes('legacy-lab.js')?'legacy-lab.js':'lab.js';
 const standalone=html.replaceAll('../../shared/','').replace('data-manifest="../reference/ground-truth.json"','data-manifest="manifest.json"').replaceAll('../../../'+site.targetDirectory+'/', '../');
 await writeFile(join(lab,'index.html'),standalone,'utf8');
 for(const f of ['lab-base.css','lab.css',engine,'comparison-report.js','categories.js'])await cp(join(repositoryRoot,'source/shared',f),join(lab,f));
 try{await cp(join(source,'theme.css'),join(lab,'theme.css'));}catch(e){if(e.code!=='ENOENT')throw e;}
 await writeFile(join(lab,'manifest.json'),JSON.stringify(manifest,null,2)+'\n','utf8');
 await writeFile(join(project,'reference/counts.json'),JSON.stringify(counts,null,2)+'\n','utf8');
 await writeFile(join(project,'reference/expected-result.json'),JSON.stringify(expectedResultFor(manifest,config.publicBaseUrl),null,2)+'\n','utf8');
 return counts;
}
