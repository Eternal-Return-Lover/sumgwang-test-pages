const $=s=>document.querySelector(s);
const labBase=new URL('../',location.href);
let base=labBase,entry=new URL('index.html',base).href;
function configureDeployment(){
 const deployment=manifest.deployment;
 if(!deployment||!/^test-site-[1-9]\d*$/.test(deployment.targetDirectory)||!/^source\/[a-z][a-z0-9-]*\/dist$/.test(deployment.sourceDirectory))throw new Error('정답표의 배포 경로 설정을 확인해 주세요.');
 const suffix='/'+deployment.sourceDirectory+'/';
 base=labBase.pathname.endsWith(suffix)?new URL(deployment.targetDirectory+'/',new URL('../'.repeat(deployment.sourceDirectory.split('/').length),labBase)):labBase;
 entry=new URL(manifest.entry,base).href;
}
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let manifest, filter='all', search='', busy=false;
const status=new Map();
function canonical(input){const u=new URL(input,base);u.hash='';u.searchParams.sort();return u.host+u.pathname.replace(/\/$/,'')+u.search;}
function locationFor(c){return [...c.frames.map(f=>`iframe[src="${new URL(f.src,base).href}"]`),c.selector].join(' >>> ');}
function findings(){return manifest.cases.flatMap(c=>c.techniques.map(t=>({id:`${c.caseId}_${t}`,url:new URL(c.page,base).href,is_violation:true,location:locationFor(c),evidence_text:c.text,technique:t})));}
export function expectedResult(){const now=new Date().toISOString();return {meta:{topic:'TOPIC',entry_url:entry,started_at:now,finished_at:now,elapsed_sec:0,tool_version:'reference-1.0.0'},findings:findings()};}
function toast(t){$('#live-message').textContent=t;setTimeout(()=>$('#live-message').textContent='',2800);}
function download(name,data){const a=document.createElement('a');const url=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)+'\n'],{type:'application/json;charset=utf-8'}));a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1500);}
function render(){const all=[...manifest.cases,...manifest.negativeControls].filter(c=>(filter==='all'||(filter==='normal'?c.techniques.length===0:c.techniques.includes(filter)))&&(`${c.caseId} ${c.name} ${c.page} ${c.text}`).toLowerCase().includes(search.toLowerCase()));$('#case-list').innerHTML=all.map(c=>{const s=status.get(c.caseId);return `<details class="case-row"><summary class="case-summary"><span class="case-id">${c.caseId}</span><span class="case-name">${esc(c.name)}</span><span class="techniques">${(c.techniques.length?c.techniques:['normal']).map(t=>`<span class="tech-tag ${t.toLowerCase()}">${t==='normal'?'정상 · 0건':t}</span>`).join('')}</span><span class="case-condition">${c.frames.length?c.frames.length+'단계 iframe':c.delayMs?c.delayMs+'ms 지연':'DOM'}${c.frames.length&&c.delayMs?' · 지연':''}</span><span class="case-result ${s?.ok?'pass':s?'fail':''}">${s?(s.ok?'확인 완료':'확인 필요'):'미검증'}</span></summary><div class="case-detail"><a href="${new URL(c.page,base).href}" target="_blank" rel="noopener">대상 게시글 ${c.caseId} 열기</a><span>위치</span><code>${esc(locationFor(c))}</code><span>부모 페이지 · 생성 지연</span><p>${esc(c.page)} · ${c.delayMs}ms</p><span>원문</span><p>${esc(c.text)}</p>${s&&!s.ok?`<p>${esc(s.error)}</p>`:''}</div></details>`}).join('')||'<div class="empty-state">조건에 맞는 사례가 없습니다.</div>';}
// All audit navigation is confined to known fixture pages on the same origin.
async function openFixture(c){
 const frame=document.createElement('iframe');
 frame.className='audit-frame';frame.title='정답 검증 중 '+(c.caseId||'페이지');frame.setAttribute('aria-hidden','true');
 const url=new URL(c.page,base);
 if(url.origin!==location.origin||!url.pathname.startsWith(base.pathname))throw new Error('같은 사이트 범위의 페이지만 확인할 수 있습니다.');
 await new Promise((resolve,reject)=>{
  const timer=setTimeout(()=>{frame.remove();reject(new Error('페이지 로딩 시간 초과'));},10000);
  frame.onload=()=>{clearTimeout(timer);resolve();};
  frame.onerror=()=>{clearTimeout(timer);frame.remove();reject(new Error('페이지 로딩 실패'));};
  frame.src=url.href;document.body.append(frame);
 });
 await new Promise(r=>setTimeout(r,c.delayMs?c.delayMs+650:450));
 if(!frame.contentDocument?.querySelector('meta[charset]')){frame.remove();throw new Error('HTML 페이지 로딩 실패');}
 return frame;
}
function expectedNode(doc,c){for(const f of c.frames){const nodes=doc.querySelectorAll(f.selector);if(nodes.length!==1)throw new Error('프레임 선택자 불일치');if(canonical(nodes[0].src)!==canonical(new URL(f.src,base)))throw new Error('프레임 src 불일치');doc=nodes[0].contentDocument;if(!doc?.querySelector('meta[charset]'))throw new Error('프레임 문서 로딩 실패');}const nodes=doc.querySelectorAll(c.selector);if(nodes.length!==1)throw new Error('선택자 일치 요소 수: '+nodes.length);return nodes[0];}
function resolveLocation(doc,value){const parts=value.split(/\s*>>>\s*/);for(const part of parts.slice(0,-1)){let nodes;const match=part.match(/^iframe\[src=["']([^"']+)["']\]$/);if(match){nodes=[...doc.querySelectorAll('iframe[src]')].filter(f=>canonical(f.src)===canonical(new URL(match[1],doc.URL)));}else{nodes=[...doc.querySelectorAll(part)];}if(nodes.length!==1||nodes[0].tagName!=='IFRAME')throw new Error('프레임 위치를 유일하게 찾을 수 없음');doc=nodes[0].contentDocument;if(!doc)throw new Error('프레임 접근 실패');}const nodes=doc.querySelectorAll(parts.at(-1));if(nodes.length!==1)throw new Error('선택자가 '+nodes.length+'개 요소와 일치');return nodes[0];}
function verifyStyles(el,c){let transparent=false,offscreen=false;for(let p=el;p;p=p.parentElement){const s=p.ownerDocument.defaultView.getComputedStyle(p);const r=p.getBoundingClientRect();transparent ||= s.opacity==='0'||(s.color.startsWith('rgba(')&&parseFloat(s.color.split(',').at(-1))===0)||(s.color===s.backgroundColor&&s.color!=='rgba(0, 0, 0, 0)');offscreen ||= s.display==='none'||parseFloat(s.fontSize)<=1||r.right<0||r.bottom<0;}if(c.techniques.includes('TRANSPARENT')&&!transparent)throw new Error('투명 스타일 재현 실패');if(c.techniques.includes('OFFSCREEN')&&!offscreen)throw new Error('화면 밖 은닉 스타일 재현 실패');}
function setBusy(value){busy=value;$('#audit').disabled=value;$('#result-file').disabled=value;$('#crawl').disabled=value;}
export async function audit(){if(busy)return;setBusy(true);status.clear();let cursor=0,done=0;const all=[...manifest.cases,...manifest.negativeControls];const started=performance.now();try{await Promise.all(Array.from({length:4},async()=>{while(cursor<all.length){const c=all[cursor++];let frame;try{frame=await openFixture(c);const el=expectedNode(frame.contentDocument,c);if(el.textContent!==c.text)throw new Error('원문 불일치');verifyStyles(el,c);status.set(c.caseId,{ok:true});}catch(e){status.set(c.caseId,{ok:false,error:e.message});}finally{frame?.remove();done++;$('#audit-status').textContent=`정답 요소 검증 중 · ${done} / ${all.length}`;}}}));const passed=[...status.values()].filter(s=>s.ok).length;$('#audit-status').textContent=`검증 완료 · ${passed} / ${all.length}개 요소 위치·원문 일치 · ${((performance.now()-started)/1000).toFixed(1)}초. 이 검사는 사이트 자체 검증이며 탐지기 성능 점수가 아닙니다.`;render();}finally{setBusy(false);}}
function schemaErrors(data){const errors=[];if(!data||typeof data!=='object'||Array.isArray(data))return ['최상위 JSON 객체가 필요합니다.'];if(Object.keys(data).sort().join(',')!=='findings,meta')errors.push('최상위 키는 meta, findings 두 개여야 합니다.');const m=data.meta;if(!m||typeof m!=='object'||Array.isArray(m))errors.push('meta 객체가 없습니다.');else{if(m.topic!=='TOPIC')errors.push('meta.topic은 TOPIC이어야 합니다.');try{if(typeof m.entry_url!=='string'||!/^https?:$/.test(new URL(m.entry_url).protocol))throw 0;}catch{errors.push('meta.entry_url은 전체 HTTP(S) URL이어야 합니다.');}for(const k of ['started_at','finished_at'])if(typeof m[k]!=='string'||!/^\d{4}-\d{2}-\d{2}T/.test(m[k])||!Number.isFinite(Date.parse(m[k])))errors.push('meta.'+k+' ISO 8601 시각이 필요합니다.');if(typeof m.elapsed_sec!=='number'||!Number.isFinite(m.elapsed_sec)||m.elapsed_sec<0)errors.push('meta.elapsed_sec는 0 이상의 숫자여야 합니다.');if('tool_version' in m&&typeof m.tool_version!=='string')errors.push('meta.tool_version은 문자열이어야 합니다.');if(Date.parse(m.finished_at)<Date.parse(m.started_at))errors.push('완료 시각이 시작 시각보다 빠릅니다.');}if(!Array.isArray(data.findings))errors.push('findings 배열이 없습니다.');return errors;}
export async function score(file){
 if(!file||busy)return;
 const output=$('#score-output');
 delete output.dataset.result;
 if(file.size>5*1024*1024){output.textContent='5MB 이하 JSON 파일을 선택해 주세요.';return;}
 setBusy(true);output.textContent='결과 파일을 확인하고 있습니다…';
 try{
  const bytes=new Uint8Array(await file.arrayBuffer());
  if(bytes[0]===239&&bytes[1]===187&&bytes[2]===191)throw new Error('UTF-8 BOM을 제거해 주세요.');
  let text,data;
  try{text=new TextDecoder('utf-8',{fatal:true}).decode(bytes);}catch{throw new Error('UTF-8 인코딩 파일이 필요합니다.');}
  try{data=JSON.parse(text);}catch{throw new Error('JSON을 읽을 수 없습니다. 문법을 확인해 주세요.');}
  const errors=schemaErrors(data);
  if(errors.length)throw new Error(errors.join('\n'));
  if(data.findings.length>10000)throw new Error('검증실은 한 파일당 최대 10,000개 항목을 지원합니다.');
  if(![canonical(entry),canonical(base.href)].includes(canonical(data.meta.entry_url)))throw new Error('진입 URL이 현재 검증 사이트와 다릅니다. 같은 배포 주소에서 결과를 비교하세요.');
  const allCases=[...manifest.cases,...manifest.negativeControls],groups=new Map(),ids=new Set(),issues=[],matched=new Set(),seen=new Set();
  let invalid=0,fp=0,duplicates=0,done=0;
  for(const [i,f] of data.findings.entries()){
   let error='';
   if(!f||typeof f!=='object'||Array.isArray(f))error='항목 객체가 아닙니다.';
   else{
    for(const k of ['id','url','location','evidence_text','technique'])if(typeof f[k]!=='string'||!f[k].trim())error=k+' 문자열 누락';
    if(typeof f.is_violation!=='boolean')error='is_violation 누락';
    if(!['HOMOGLYPH','JAMO','TRANSPARENT','OFFSCREEN'].includes(f.technique))error='필수 기법 코드 불일치';
    if(typeof f.id==='string'){if(ids.has(f.id))error='id 중복';ids.add(f.id);}
    try{if(typeof f.url!=='string'||!/^https?:$/.test(new URL(f.url).protocol))throw 0;}catch{error='전체 HTTP(S) URL 필요';}
   }
   if(error){invalid++;issues.push(`${i+1}번: ${error}`);continue;}
   const key=canonical(f.url);
   if(!groups.has(key))groups.set(key,[]);
   groups.get(key).push(f);
  }
  const recordUnresolved=(page,f,reason)=>{
   const key=page+'|unresolved|'+f.location+'|'+f.technique;
   if(seen.has(key)){duplicates++;return;}
   seen.add(key);fp++;issues.push(f.id+': '+reason);
  };
  for(const [page,items] of groups){
   const cases=allCases.filter(c=>canonical(new URL(c.page,base))===page);
   let frame;
   try{
    // Also resolve locations on ordinary pages, so equivalent selectors deduplicate.
    const submitted=new URL(items[0].url);
    if(submitted.host!==base.host||!submitted.pathname.startsWith(base.pathname)||submitted.pathname.startsWith(new URL('lab/',base).pathname))throw new Error('탐지 대상 범위 밖의 페이지');
    submitted.protocol=base.protocol;
    if(submitted.pathname.endsWith('/'))submitted.pathname+='index.html';
    frame=await openFixture({page:cases[0]?.page||submitted.href,delayMs:cases.length?Math.max(...cases.map(c=>c.delayMs)):manifest.maxInjectionDelayMs});
    const nodes=new Map();let nextNode=0;
    for(const f of items){
     let element;
     try{element=resolveLocation(frame.contentDocument,f.location);}catch(e){recordUnresolved(page,f,e.message);continue;}
     if(!nodes.has(element))nodes.set(element,++nextNode);
     const key=page+'|node|'+nodes.get(element)+'|'+f.technique;
     if(seen.has(key)){duplicates++;continue;}
     seen.add(key);
     const c=cases.find(c=>expectedNode(frame.contentDocument,c)===element);
     if(c?.techniques.includes(f.technique)&&f.is_violation===true)matched.add(c.caseId+'|'+f.technique);
     else{fp++;issues.push(f.id+': 위치·기법·위반 여부가 자체 정답과 다름');}
    }
   }catch(e){for(const f of items)recordUnresolved(page,f,e.message);}
   finally{frame?.remove();}
   output.textContent=`요소 위치 대조 중 · ${++done} / ${groups.size}개 페이지`;
  }
  const total=findings().length,tp=matched.size,fn=total-tp,denominator=tp+fp+invalid;
  output.dataset.result=JSON.stringify({tp,fn,fp,invalid,duplicates,total});
  output.innerHTML=`<div class="score-metrics"><div>정탐 TP<strong>${tp}</strong></div><div>미탐 FN<strong>${fn}</strong></div><div>오탐 FP<strong>${fp}</strong></div><div>필드 오류<strong>${invalid}</strong></div><div>재현율<strong>${total?(100*tp/total).toFixed(1)+'%':'계산 불가'}</strong></div><div>자체 정탐 비율*<strong>${denominator?(100*tp/denominator).toFixed(1)+'%':'계산 불가'}</strong></div></div><p>중복 ${duplicates}건 통합 · 제출 기록 ${data.meta.elapsed_sec}초${data.meta.elapsed_sec>1800?' · 30분 초과':''}. *자체 정탐 비율 = TP / (TP + FP + 필드 오류). 시간은 제출 파일의 기록이며 독립 측정값이 아닙니다. 공식 점수로 환산하지 않습니다.</p>${issues.length?'<details><summary>불일치 내역 '+issues.length+'건</summary><ul class="score-errors">'+issues.slice(0,200).map(s=>'<li>'+esc(s)+'</li>').join('')+'</ul></details>':''}`;
 }catch(e){delete output.dataset.result;output.textContent='확인 필요: '+e.message;}
 finally{setBusy(false);$('#result-file').value='';}
}
try{const response=await fetch('manifest.json');if(!response.ok)throw new Error('정답표를 불러오지 못했습니다.');manifest=await response.json();configureDeployment();$('#entry-url').textContent=entry;$('#stat-pages').textContent=new Set([...manifest.cases,...manifest.negativeControls].map(c=>canonical(new URL(c.page,base)))).size;$('#stat-findings').textContent=findings().length;$('#stat-normal').textContent=manifest.negativeControls.length;$('#stat-elements').textContent=manifest.cases.length;render();document.querySelectorAll('[data-filter]').forEach(b=>b.addEventListener('click',()=>{filter=b.dataset.filter;document.querySelectorAll('[data-filter]').forEach(x=>x.classList.toggle('active',x===b));render();}));$('#case-search').addEventListener('input',e=>{search=e.target.value;render();});$('#copy-entry').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(entry);toast('진입 URL을 복사했습니다.');}catch{toast('주소를 직접 선택해 복사해 주세요.');}});$('#download-manifest').addEventListener('click',()=>download('ground-truth.json',manifest));$('#download-result').addEventListener('click',()=>download('expected-result.json',expectedResult()));$('#audit').addEventListener('click',audit);$('#crawl').addEventListener('click',crawl);$('#result-file').addEventListener('change',e=>score(e.target.files[0]));}catch(e){$('#audit-status').textContent=e.message;$('#audit').disabled=true;}

export async function crawl(){if(busy)return;setBusy(true);const queue=[{page:"index.html",depth:0}],seen=new Map([[canonical(entry),0]]),errors=[];let visited=0;try{while(queue.length){const batch=queue.splice(0,4);await Promise.all(batch.map(async item=>{let frame;try{frame=await openFixture({...item,delayMs:manifest.maxInjectionDelayMs});const visit=doc=>{for(const a of doc.querySelectorAll("a[href]")){const u=new URL(a.href);if(u.origin!==base.origin||!u.pathname.startsWith(base.pathname)||/\/(lab|widgets)\//.test(u.pathname)||!(/\.html$/.test(u.pathname)||u.pathname.endsWith("/")))continue;if(u.pathname.endsWith("/"))u.pathname+="index.html";const key=canonical(u);if(!seen.has(key)){if(seen.size>=250)throw new Error("탐색 상한 250페이지 초과");seen.set(key,item.depth+1);queue.push({page:u.href,depth:item.depth+1});}}for(const f of doc.querySelectorAll("iframe[src]"))if(f.contentDocument)visit(f.contentDocument);};visit(frame.contentDocument);}catch(e){errors.push(item.page+": "+e.message);}finally{frame?.remove();$("#crawl-status").textContent=`내부 링크 탐색 중 · ${++visited}페이지 · 대기 ${queue.length}개`;}}));}const pages=[...new Set([...manifest.cases,...manifest.negativeControls].map(c=>c.page))],missing=pages.filter(p=>!seen.has(canonical(new URL(p,base))));const result={visited,reachable:pages.length-missing.length,total:pages.length,maxDepth:Math.max(...pages.map(p=>seen.get(canonical(new URL(p,base)))??0)),missing,errors};$("#crawl-status").dataset.result=JSON.stringify(result);$("#crawl-status").textContent=`링크 검증 완료 · ${result.reachable} / ${result.total}개 대상 URL 도달 · 최대 ${result.maxDepth}단계 · ${errors.length}개 로딩 오류${missing.length?" · 누락: "+missing.join(", "):""}`;return result;}finally{setBusy(false);}}
