import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {fixtures,queryFixtures,extraElements,authors,titleFor} from '../src/fixtures.mjs';
import {siteForProject,deploymentFor,publishSite} from '../../site-tools.mjs';

const site=await siteForProject(import.meta.url);
const root=new URL('../dist/',import.meta.url);
const save=async(path,text)=>{const url=new URL(path,root);await mkdir(dirname(fileURLToPath(url)),{recursive:true});await writeFile(url,text,'utf8');};
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const prefix=path=>'../'.repeat(path.split('?')[0].split('/').length-1);
const label=category=>category==='notice'?'센터 소식':'동호회 이야기';
const heading=(title,sub)=>`<div class="page-heading"><span class="eyebrow">HAESOL SPORTS · MOVE TOGETHER</span><h1>${title}</h1><p>${sub}</p></div>`;
function layout(path,title,body){
 const p=prefix(path);
 return `<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,follow"><title>${esc(title)} | 해솔시 생활체육센터</title><link rel="icon" href="${p}assets/mark.svg"><link rel="stylesheet" href="${p}assets/site.css"></head><body><a class="skip" href="#main">본문 바로가기</a><div class="utility"><span>HAESOL SPORTS CENTER · 가상의 공공 체육시설</span><span>모집요강 기반 모의 테스트 환경 · 합성 콘텐츠</span></div><header class="header"><a class="brand" href="${p}index.html"><img src="${p}assets/mark.svg" width="42" height="42" alt=""><span>해솔시 생활체육센터<small>EVERYDAY MOVEMENT, EVERYONE TOGETHER</small></span></a><nav aria-label="주요 메뉴"><a href="${p}facilities/index.html">시설 안내</a><a href="${p}programs/index.html">운동 프로그램</a><a href="${p}community/list-1.html">시민 이야기</a><a href="${p}records/index.html">활동 기록</a></nav><a class="button outline" href="${p}programs/index.html">이번 달 프로그램 ↗</a></header><main id="main">${path==='index.html'?'':`<div class="breadcrumb"><a href="${p}index.html">홈</a><span>/</span>${esc(title)}</div>`}${body}</main><footer><div><strong>해솔시 생활체육센터</strong><p>오늘의 작은 움직임, 함께 만드는 건강한 일상.</p><small>© 2026 HAESOL SPORTS CENTER</small></div><div><a href="${p}facilities/index.html">이용 안내</a><a href="${p}community/list-1.html">시민 이야기</a><p>가상 기관과 합성 자료입니다. 실제 예약·거래·연락 기능이 없습니다.</p></div></footer></body></html>`;
}
const pnode=f=>`<p class="excerpt"${f.style?` style="${f.style}"`:''}>${esc(f.text)}</p>`;
const box=f=>`<div class="entry-fragment"${f.parentStyle?` style="${f.parentStyle}"`:''}>${pnode(f)}</div>`;
const row=(f,p='')=>`<a class="post-row" href="${p}${f.path.replaceAll('&','&amp;')}"><span class="pill">${label(f.category)}</span><div><strong>${esc(titleFor(f))}</strong><small>${authors[f.index%authors.length]} · 2026.10.${String(1+f.index%4).padStart(2,'0')}</small></div><span>↗</span></a>`;
const cases=[],negativeControls=[];
function register(f,selector,frames=[]){
 const entry={caseId:f.key,page:f.path,name:f.name,selector,frames,text:f.text,techniques:f.techniques,delayMs:(f.delay||0)+(f.innerDelay||0)};
 (f.techniques.length?cases:negativeControls).push(entry);
}

await save('assets/mark.svg','<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><rect width="48" height="48" rx="13" fill="#2552cf"/><path d="M12 31l9-17h8L18 34zm15 3l7-13h5l-7 13z" fill="#d5ed60"/></svg>');
await save('assets/court.svg','<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 310"><rect x="10" y="10" width="480" height="290" rx="16" fill="#d5ed60"/><g fill="none" stroke="#2552cf" stroke-width="3"><rect x="30" y="30" width="440" height="250"/><path d="M250 30v250M30 80h100v150H30m440-150H370v150h100"/><circle cx="250" cy="155" r="48"/><circle cx="130" cy="155" r="28"/><circle cx="370" cy="155" r="28"/><path d="M30 50a110 110 0 010 210M470 50a110 110 0 000 210"/></g><circle cx="338" cy="74" r="25" fill="#ff805e" stroke="#142643" stroke-width="3"/><path d="M315 74h46m-23-25a35 35 0 010 50m0-50a35 35 0 000 50" fill="none" stroke="#142643" stroke-width="2"/></svg>');
await save('assets/site.css',await readFile(new URL('../src/templates/site.css',import.meta.url),'utf8'));
await save('index.html',layout('index.html','함께 움직이는 건강한 일상',`<section class="hero"><div class="hero-copy"><span class="eyebrow">MOVE YOUR DAY / HAESOL 2026</span><h1>오늘의 움직임이<br><em>내일의 나를</em><br>만듭니다.</h1><p>처음 시작하는 운동도, 함께 즐기는 한 게임도.<br>우리 동네에서 만나는 건강한 일상.</p><a class="button" href="programs/index.html">나에게 맞는 운동 찾기 <span>↗</span></a><div class="hero-note"><span>10월 프로그램</span><b>함께 걷고, 뛰고, 즐기는 계절</b></div></div><div class="court-art" aria-hidden="true"><span>SMALL STEPS. BIG CHANGES.</span><img src="assets/court.svg" alt=""><div class="court-caption">PLAY MORE.<br><i>LIVE BETTER.</i></div><div class="court-stamp">EVERYONE<br>WELCOME<br>↗</div></div></section><section class="quick-grid" aria-label="바로가기"><a href="facilities/index.html"><span>01 / OUR SPACES</span><strong>내 곁의 운동 공간</strong><b>↗</b></a><a href="programs/index.html"><span>02 / YOUR ROUTINE</span><strong>이번 달 운동 프로그램</strong><b>↗</b></a><a href="records/index.html"><span>03 / OUR MOMENTS</span><strong>함께 만든 활동 기록</strong><b>↗</b></a></section><section class="home-content"><div><div class="section-title"><div><span class="eyebrow">COMMUNITY JOURNAL</span><h2>오늘의 시민 이야기</h2></div><a href="community/list-1.html">전체 보기 +</a></div>${fixtures.filter(f=>!f.deep).slice(0,5).map(f=>row(f)).join('')}</div><aside class="hours"><span class="eyebrow">MAKE MOVEMENT A HABIT</span><h2>운동할 시간,<br>언제나 가까이.</h2><dl><dt>평일 체육관</dt><dd>06:00 – 22:00</dd><dt>주말 체육관</dt><dd>08:00 – 18:00</dd><dt>정기 휴관</dt><dd>매월 첫째 월요일</dd></dl><p>가상의 시설 운영 안내입니다.<br>실제 예약·강습 신청은 제공하지 않습니다.</p><a href="facilities/index.html">시설 이용 안내 ↗</a></aside></section><section class="community-banner"><div><strong>첫 걸음부터, 함께하는 사람들.</strong><p>동호회 활동과 가을 걷기 행사의 지난 이야기를 만나보세요.</p></div><a class="button outline" href="records/index.html">활동 기록 보기 ↗</a></section>`));

for(const f of fixtures){
 let content='',script='',frames=[],selector='div.article-body > div.entry-fragment > p.excerpt';
 const p=prefix(f.path);
 if(f.frameDepth){
  const paths=Array.from({length:f.frameDepth},(_,i)=>`widgets/${f.postId}-${i+1}.html`);
  frames=paths.map((src,i)=>({src,selector:i===0?'iframe.community-widget':'iframe.detail-widget'}));
  selector='div.widget-content > div.entry-fragment > p.excerpt';
  for(let i=0;i<paths.length;i++){
   const body=i<paths.length-1?`<iframe class="detail-widget" src="${f.postId}-${i+2}.html" title="활동 소식 상세"></iframe>`:f.innerDelay?`<div class="widget-content"></div><script>setTimeout(()=>document.querySelector('.widget-content').innerHTML=${JSON.stringify(box(f))},${f.innerDelay})</script>`:`<div class="widget-content">${box(f)}</div>`;
   await save(paths[i],`<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>이웃 동호회 소식</title><link rel="stylesheet" href="../assets/site.css"></head><body class="widget-body"><h3>함께 운동하는 이웃의 소식</h3>${body}</body></html>`);
  }
  const frame=`<iframe class="community-widget" src="${p}${paths[0]}" title="동호회 소식"></iframe>`;
  content=`<div class="embedded-content">${f.delay?'':frame}</div>`;
  if(f.delay)script=`<script>setTimeout(()=>document.querySelector('.embedded-content').innerHTML=${JSON.stringify(frame)},${f.delay})</script>`;
 }else if(f.delay){
  selector='section.comments > div.comment-list > div.comment-item:nth-of-type(2) > p.excerpt';
  script=`<script>setTimeout(()=>{const d=document.createElement('div');d.className='comment-item';d.innerHTML=${JSON.stringify('<span>새로운 이웃</span>'+pnode(f))};document.querySelector('.comment-list').append(d)},${f.delay})</script>`;
 }else if(f.repeat){
  content=`<div class="notes-stack"><p class="excerpt">함께 운동하니 더욱 즐거웠어요.</p><p class="excerpt">다음 모임 시간도 확인했습니다.</p>${pnode(f)}<p class="excerpt">운동 후에는 충분히 쉬어주세요.</p></div>`;
  selector='div.article-body > div.notes-stack > p.excerpt:nth-of-type(3)';
 }else if(f.plain){
  content=`<div class="training-notes"><section><ul><li><span>준비 운동을 잊지 마세요.</span></li><li><span>${esc(f.text)}</span></li></ul></section></div>`;
  selector='div.article-body > div.training-notes > section > ul > li:nth-of-type(2) > span';
 }else if(f.table){
  content=`<table class="opinion-table"><tbody><tr><th>활동 장소</th><td>해솔 생활체육관</td></tr><tr${f.parentStyle?` style="${f.parentStyle}"`:''}><th>참여자 의견</th><td data-column="message">${esc(f.text)}</td></tr></tbody></table>`;
  selector='div.article-body > table.opinion-table > tbody > tr:nth-of-type(2) > td[data-column="message"]';
 }else if(f.quote){
  content=`<blockquote>${pnode(f)}</blockquote>`;selector='div.article-body > blockquote > p.excerpt';
 }else content=box(f);
 register(f,selector,frames);
 const extra=extraElements.filter(e=>e.parent===f.key);
 extra.forEach((e,i)=>register({...e,path:f.path},`section.comments > div.comment-list > div.comment-item:nth-of-type(${i+2}) > p.excerpt`));
 const intros=['퇴근 후 가까운 체육관에서 이웃들과 가볍게 운동했습니다. 하루 종일 앉아 있다가 몸을 움직이니 기분이 한결 좋아졌어요.','주말 아침에는 서두르지 않고 준비 운동부터 시작했습니다. 처음 참여한 이웃도 편하게 함께할 수 있도록 서로 도왔습니다.','이번 모임에서는 각자의 속도에 맞춰 운동했습니다. 기록보다 꾸준히 즐기는 시간이 더 소중하다는 이야기를 나눴어요.'];
 const body=heading(label(f.category),'함께 움직이고, 이웃과 경험을 나누는 공간')+`<article class="article"><div class="article-heading"><span class="pill">${label(f.category)}</span><h2>${esc(titleFor(f))}</h2><p>${authors[f.index%authors.length]} · 2026.10.${String(1+f.index%4).padStart(2,'0')} · 조회 ${91+f.index*7}</p></div><div class="article-body"><p>${intros[f.index%3]}</p><p>이 공간은 시설 이용 경험과 동호회 이야기를 나누는 곳입니다. 서로의 운동 방식과 속도를 존중해 주세요.</p>${content}<p>다음 모임에서도 무리하지 않고 함께 건강한 일상을 이어가면 좋겠습니다.</p><div class="article-note">시민이 작성한 합성 게시글입니다. 개인정보를 포함하지 않도록 유의해 주세요.</div></div></article><section class="comments"><h3>함께 나누는 의견</h3><div class="comment-list"><div class="comment-item"><span>주말산책</span><p class="excerpt">좋은 이야기 감사합니다. 다음 모임에도 함께하고 싶어요.</p></div>${extra.map(e=>`<div class="comment-item"><span>라켓친구</span>${pnode(e)}</div>`).join('')}</div></section><a class="button outline" href="${p}community/list-1.html">목록으로 돌아가기</a>${script}`;
 await save(f.path,layout(f.path,titleFor(f),body));
}

const queryArticle=f=>`<article class="article"><div class="article-heading"><span class="pill">시설별 활동</span><h2>${f.venue==='pool'?'수영장':'체육관'} 동호회 활동 기록</h2><p>${authors[f.index%authors.length]} · 2026.10.04 · 시민 활동</p></div><div class="article-body"><p>시설별로 나눈 운동 경험을 모았습니다. 같은 모임도 장소마다 서로 다른 이야기를 남깁니다.</p>${box(f)}<p>준비 운동을 충분히 하고 안전하게 활동해 주세요.</p></div></article>`;
await save('community/view.html',layout('community/view.html','시설별 활동 기록',heading('시설별 활동 기록','물속에서도, 코트 위에서도 함께하는 사람들')+'<div id="article-slot"></div><a class="button outline" href="list-1.html">목록으로</a><script src="../assets/view.js"></script>'));
await save('assets/view.js',`const articles=${JSON.stringify(Object.fromEntries(queryFixtures.map(f=>[f.postId+'|'+f.venue,queryArticle(f)])))};const p=new URLSearchParams(location.search);document.querySelector('#article-slot').innerHTML=articles[p.get('id')+'|'+p.get('venue')]||'<p class="empty-state">활동 기록을 찾을 수 없습니다.</p>';`);
queryFixtures.forEach(f=>register(f,'div.article-body > div.entry-fragment > p.excerpt'));
const list=[...fixtures.filter(f=>!f.deep),...queryFixtures],pageSize=8,pages=Math.ceil(list.length/pageSize);
for(let n=1;n<=pages;n++)await save(`community/list-${n}.html`,layout(`community/list-${n}.html`,'시민 이야기',heading('시민 이야기','운동의 즐거움은 나눌수록 커집니다')+`<form class="search-form" role="search"><label for="board-search">게시글 검색</label><input id="board-search" type="search" placeholder="제목을 입력하세요" maxlength="80"><button class="button">검색</button></form><div class="list-summary"><span>총 ${list.length}개의 이야기</span><span id="page-label">${n} / ${pages} 페이지</span></div><div id="post-list">${list.slice((n-1)*pageSize,n*pageSize).map(f=>row(f,'../')).join('')}</div><nav class="pagination" aria-label="게시판 페이지">${Array.from({length:pages},(_,i)=>`<a href="list-${i+1}.html"${n===i+1?' aria-current="page"':''}>${i+1}</a>`).join('')}</nav><div class="related-box"><strong>시설별 동호회 기록</strong><a href="view.html?venue=pool&amp;id=901#opinion">수영장 모임의 의견 보기</a><a href="view.html?id=902&amp;venue=gym#activity">체육관 모임 다시 보기</a></div><script src="../assets/list.js"></script>`));
await save('assets/list.js',`const records=${JSON.stringify(list.map(f=>({path:'../'+f.path,title:titleFor(f),category:label(f.category),author:authors[f.index%authors.length]})))};const initial=document.querySelector('#post-list').innerHTML,initialLabel=document.querySelector('#page-label').textContent;const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));document.querySelector('.search-form').addEventListener('submit',e=>{e.preventDefault();const q=document.querySelector('#board-search').value.trim(),found=records.filter(r=>r.title.includes(q));document.querySelector('#post-list').innerHTML=q?found.map(r=>'<a class="post-row" href="'+r.path.replaceAll('&','&amp;')+'"><span class="pill">'+r.category+'</span><div><strong>'+esc(r.title)+'</strong><small>'+r.author+'</small></div><span>↗</span></a>').join('')||'<p class="empty-state">검색 결과가 없습니다.</p>':initial;document.querySelector('#page-label').textContent=q?'검색 결과 '+found.length+'건':initialLabel;document.querySelector('.pagination').hidden=!!q;});`);

await save('facilities/index.html',layout('facilities/index.html','시설 안내',heading('내 곁의 운동 공간','다양한 움직임이 모이는 우리 동네 체육시설')+`<div class="info-grid"><article><span class="facility-number">01</span><h2>해솔 수영장</h2><p>초급 수영부터 자유 수영까지, 물속에서 찾는 새로운 리듬.</p><a href="../programs/index.html">수영 프로그램 보기 ↗</a></article><article><span class="facility-number">02</span><h2>생활체육관</h2><p>배드민턴·탁구·농구를 이웃과 함께 즐기는 열린 공간.</p><a href="../community/list-1.html">시민 이용 이야기 ↗</a></article><article><span class="facility-number">03</span><h2>시민 운동마당</h2><p>가벼운 스트레칭부터 주말 걷기까지, 일상 속에서 꾸준히.</p><a href="../records/index.html">지난 활동 기록 ↗</a></article></div><div class="related-box"><strong>안전한 온라인 정보 이용</strong><p>카지노 가입 보너스, 선입금 대출, 처방전 없는 의약품 판매 광고를 주의하세요. 실제 예약·거래·연락 기능은 제공하지 않습니다.</p><a href="https://sports-info.invalid/haesol" rel="nofollow noopener">외부 참고 주소 (비연결 시험용)</a></div>`));
await save('programs/index.html',layout('programs/index.html','운동 프로그램',heading('나에게 맞는 운동 찾기','처음 시작하는 분도, 꾸준히 즐기는 분도 함께')+`<section class="program-banner"><div><span class="eyebrow">OCTOBER / KEEP MOVING</span><h2>작은 시작,<br>꾸준한 변화.</h2><p>2026년 10월 / 시민 생활체육 프로그램</p></div><strong>MOVE<br>MORE.</strong></section><div class="info-grid"><article><span class="pill">물속의 첫 걸음</span><h2>초급 수영</h2><p>호흡과 기초 자세를 익히는 성인 수영교실</p></article><article><span class="pill">함께 즐기는 한 게임</span><h2>생활 배드민턴</h2><p>이웃과 배우는 라켓 운동의 즐거움</p></article><article><span class="pill">나의 속도로</span><h2>시민 걷기</h2><p>주말 아침 함께 걷는 해솔 둘레길</p></article></div><table class="schedule"><thead><tr><th>프로그램</th><th>요일·시간</th><th>활동 공간</th></tr></thead><tbody><tr><td>초급 수영</td><td>화·목 07:00</td><td>해솔 수영장</td></tr><tr><td>생활 배드민턴</td><td>월·수 19:00</td><td>생활체육관</td></tr><tr><td>시민 걷기</td><td>토 09:00</td><td>시민 운동마당</td></tr></tbody></table><div class="related-box"><p>표의 일정은 합성 안내입니다. 실제 강습 신청 기능은 없습니다.</p><a href="../community/list-1.html">참여자 이야기 읽기 ↗</a></div>`));
await save('records/index.html',layout('records/index.html','활동 기록',heading('함께 움직인 시간','이웃과 나눈 활동을 계절마다 기록합니다')+'<div class="related-box"><a href="2026/index.html">2026년 활동 기록 ↗</a></div>'));
await save('records/2026/index.html',layout('records/2026/index.html','2026년 활동 기록',heading('2026년의 움직임','계절별 동호회 기록')+'<div class="related-box"><a href="autumn/index.html">가을 활동 모음 ↗</a></div>'));
await save('records/2026/autumn/index.html',layout('records/2026/autumn/index.html','가을 활동 모음',heading('함께하는 가을','주말에 만나는 시민 활동')+'<div class="related-box" id="record-links"><p>활동 기록을 불러오고 있습니다.</p></div><script>setTimeout(()=>document.querySelector("#record-links").innerHTML=\'<a href="weekend/index.html">주말 활동 기록 보기 ↗</a>\',950)</script>'));
await save('records/2026/autumn/weekend/index.html',layout('records/2026/autumn/weekend/index.html','주말 활동 기록',heading('우리의 주말','걷기와 동호회 활동의 기록')+'<div class="related-box"><a href="walks/index.html">시민 걷기 기록 ↗</a><a href="teams/index.html">동호회 교류 기록 ↗</a></div>'));
for(const f of fixtures.filter(f=>f.deep)){
 const path=f.path.replace('read.html','index.html');
 await save(path,layout(path,'시민 활동 모음',heading('운동으로 만난 이웃','함께한 시간을 기록으로 남깁니다')+'<div class="related-box"><a href="read.html">참여자의 활동 이야기 ↗</a></div>'));
}

const manifest={version:'1.0.0',siteId:site.siteId,siteName:site.title,deployment:deploymentFor(site),entry:'index.html',fixtureViewport:{width:1440,height:1000},maxInjectionDelayMs:2800,scenarioCount:fixtures.length+queryFixtures.length,scope:'모집요강 기반 자체 정답. 공식 심사 사이트와 무관.',urlPolicy:'query values preserved; query ordering, fragment, scheme and trailing slash ignored for comparison',iframeUrlPolicy:'findings.url is the top document URL; location contains absolute iframe src chain',cases,negativeControls};
await mkdir(new URL('../reference/',import.meta.url),{recursive:true});
await writeFile(new URL('../reference/ground-truth.json',import.meta.url),JSON.stringify(manifest,null,2)+'\n');
await save('lab/manifest.json',JSON.stringify(manifest));
for(const [source,target] of [['lab.html','lab/index.html'],['lab.js','lab/lab.js'],['lab.css','lab/lab.css'],['lab-base.css','lab/lab-base.css']]){
 const text=await readFile(new URL('../src/templates/'+source,import.meta.url),'utf8');
 await save(target,target==='lab/index.html'?text.replace(/TEST LAB \/ \d+/,'TEST LAB / '+String(site.number).padStart(2,'0')):text);
}
await save('robots.txt','User-agent: *\nAllow: /\nDisallow: /lab/\n');
await publishSite(site);
const counts={scenarios:manifest.scenarioCount,scenarioPages:new Set([...cases,...negativeControls].map(c=>c.page)).size,positiveElements:cases.length,negativeControls:negativeControls.length,expectedFindings:cases.reduce((n,c)=>n+c.techniques.length,0),techniques:{}};
for(const c of cases)for(const technique of c.techniques)counts.techniques[technique]=(counts.techniques[technique]||0)+1;
await writeFile(new URL('../reference/counts.json',import.meta.url),JSON.stringify(counts,null,2)+'\n');
console.log(JSON.stringify(counts));
