import {categoryLabel,validateCategoryAnnotations} from '../source/shared/categories.js';
const $=selector=>document.querySelector(selector);
const root=new URL('../',location.href),catalog=new Map(),manifests=new Map();
const state={site:null,manifest:null,file:null,data:null,fileError:'',siteError:'',manual:false,busy:false,reading:false,loading:false,siteToken:0,fileToken:0};
let lastReport=null,engineHost=null,engineSite=null,enginePromise=null,visibleRows=50,displayRows=[];
const labels={tp:'정탐 TP',fn:'미탐 FN',fp:'오탐 FP',invalid:'필드 오류',duplicate:'중복 통합'};
const format=value=>new Intl.NumberFormat('ko-KR').format(value);
const canonical=value=>{const u=new URL(value);u.hash='';u.searchParams.sort();return u.host+u.pathname.replace(/\/$/,'')+u.search;};
const entryFor=site=>new URL('test-site-'+site.number+'/index.html',root).href;
const baseFor=site=>new URL('test-site-'+site.number+'/',root).href;
const locked=()=>state.busy||state.reading||state.loading;
function controls(){
 const disabled=locked();$('#site-select').disabled=disabled||!catalog.size;$('#result-file').disabled=disabled;
 $('#compare-button').disabled=disabled||!state.file||!state.data||!state.manifest||Boolean(state.fileError);
 $('#reset-button').disabled=disabled;$('#download-truth').disabled=disabled||!state.manifest;$('#download-expected').disabled=disabled||!state.manifest;
 $('#upload-zone').setAttribute('aria-busy',String(disabled));$('#results').setAttribute('aria-busy',String(state.busy));
}
function status(kind,message){
 const el=$('#app-status');el.dataset.state=kind;el.classList.toggle('is-error',kind==='error');el.classList.toggle('is-success',kind==='complete');el.textContent=message;
 controls();
}
function clearReport(){$('#category-body').replaceChildren();$('#category-filter').replaceChildren(new Option('전체 정답 주제','all'));lastReport=null;displayRows=[];$('#results').hidden=true;delete $('#results').dataset.result;$('#diagnostic-list').replaceChildren();$('#comparison-progress').value=0;}
function resetFile(){
 state.fileToken++;state.file=null;state.data=null;state.fileError='';$('#result-file').value='';$('#file-name').textContent='result.json을 올려주세요';$('#file-meta').textContent='파일을 끌어 놓거나 눌러서 선택하세요';
 clearReport();status(state.siteError?'error':'idle',state.siteError||'파일을 선택하면 비교를 시작할 수 있어요.');
}
function addressError(){
 if(!state.site||!state.data?.meta||!Object.hasOwn(state.data.meta,'entry_url'))return '';
 try{const actual=canonical(state.data.meta.entry_url);if([canonical(entryFor(state.site)),canonical(baseFor(state.site))].includes(actual))return '';
 const found=detectSite(state.data.meta.entry_url);return (found?'파일은 test-site-'+found.number+'의 결과입니다. ':'')+'선택한 test-site-'+state.site.number+'의 시작 URL과 제출 주소가 다릅니다. 사이트와 배포 주소를 확인해 주세요. 예상 주소: '+entryFor(state.site);
 }catch{return '';}
}
function detectSite(value){
 try{const key=canonical(value);return [...catalog.values()].find(site=>[canonical(entryFor(site)),canonical(baseFor(site))].includes(key))||null;}catch{return null;}
}
async function selectSite(number,{manual=false}={}){
 if(!number&&state.data&&!state.fileError){const detected=detectSite(state.data.meta?.entry_url);if(detected)number=detected.number;}
 const site=catalog.get(String(number))||null,token=++state.siteToken;clearReport();state.site=site;state.manifest=null;state.siteError='';state.manual=manual;
 $('#site-select').value=site?String(site.number):'';$('#entry-url').textContent=site?entryFor(site):'사이트를 선택해 주세요';$('#entry-url').href=site?entryFor(site):'#';
 $('#lab-link').href=site?new URL('source/'+site.project+'/lab/index.html',root).href:'#';
 $('#site-description').textContent=site?site.title:'파일의 시작 URL로 사이트를 자동 선택하거나 직접 선택하세요.';
 for(const id of ['expected-count','case-count','normal-count'])$('#'+id).textContent='—';
 if(!site){state.loading=false;const url=new URL(location.href);url.searchParams.delete('site');history.replaceState(null,'',url);const error=state.fileError||(state.file&&state.data?'파일의 시작 URL에 해당하는 사이트를 자동 선택하지 못했습니다. 사이트를 직접 선택해 주세요.':'');status(error?'error':'idle',error||'사이트를 선택하거나 result.json을 올려 주세요.');return;}
 state.loading=true;status('loading','정답 데이터를 불러오고 있습니다…');
 try{
  if(!manifests.has(site.number)){
   const response=await fetch(new URL('source/'+site.project+'/reference/ground-truth.json',root));if(!response.ok)throw Error('정답 데이터를 불러오지 못했습니다 ('+response.status+').');
   const manifest=await response.json();if(manifest.siteId!==site.siteId||manifest.deployment?.targetDirectory!=='test-site-'+site.number||!Array.isArray(manifest.cases)||!Array.isArray(manifest.negativeControls))throw Error('사이트 등록과 정답 데이터가 일치하지 않습니다.');
   validateCategoryAnnotations(manifest);
   manifests.set(site.number,manifest);
  }
  if(token!==state.siteToken)return;state.manifest=manifests.get(site.number);
  $('#expected-count').textContent=format(state.manifest.cases.reduce((n,c)=>n+c.techniques.length,0));$('#case-count').textContent=format(state.manifest.cases.length+state.manifest.negativeControls.length);$('#normal-count').textContent=format(state.manifest.negativeControls.length);
  const url=new URL(location.href);url.searchParams.set('site',site.number);history.replaceState(null,'',url);
 }catch(error){if(token===state.siteToken){state.siteError=error.message;status('error',state.siteError);}}
 finally{if(token===state.siteToken){state.loading=false;controls();}}
 if(token===state.siteToken&&state.manifest){const mismatch=state.fileError||addressError();const ready=state.file&&state.data;status(mismatch?'error':ready?'ready':'idle',mismatch||(ready?'파일 준비가 완료됐습니다. 결과 비교하기를 눌러 주세요.':'파일을 선택하면 비교를 시작할 수 있어요.'));}
}
async function pickFile(file){
 if(!file||locked())return;const token=++state.fileToken;state.reading=true;state.file=file;state.data=null;state.fileError='';clearReport();$('#result-file').value='';
 $('#file-name').textContent=file.name;$('#file-meta').textContent=format(file.size)+' bytes · JSON 결과 파일';status('reading','파일을 읽고 있습니다…');
 try{
  if(file.size>5*1024*1024)throw Error('5MB 이하 JSON 파일을 선택해 주세요.');
  const bytes=new Uint8Array(await file.arrayBuffer());if(token!==state.fileToken)return;
  if(bytes[0]===239&&bytes[1]===187&&bytes[2]===191)throw Error('UTF-8 BOM을 제거해 주세요.');
  let text;try{text=new TextDecoder('utf-8',{fatal:true}).decode(bytes);}catch{throw Error('UTF-8 인코딩 파일이 필요합니다.');}
  try{state.data=JSON.parse(text);}catch{throw Error('JSON을 읽을 수 없습니다. 문법을 확인해 주세요.');}
  if(!state.data||typeof state.data!=='object'||Array.isArray(state.data)){state.data=null;throw Error('최상위 JSON 객체가 필요합니다.');}
  if(!state.manual){const found=detectSite(state.data?.meta?.entry_url);if(found)await selectSite(found.number);else if(!state.site)throw Error('파일의 시작 URL에 해당하는 사이트를 찾지 못했습니다. 이 배포 주소의 사이트를 직접 선택하고 제출 주소를 확인해 주세요.');}else if(state.site&&!state.manifest){await selectSite(state.site.number,{manual:true});}
  if(state.site&&!state.manifest)throw Error(state.siteError||'정답 데이터를 불러오지 못했습니다.');
  if(token!==state.fileToken)return;
  const mismatch=addressError();if(mismatch)throw Error(mismatch);
  status(state.site?'ready':'idle',state.site?'파일 준비가 완료됐습니다. 결과 비교하기를 눌러 주세요.':'비교할 사이트를 선택해 주세요.');
 }catch(error){if(token===state.fileToken){if(!state.data)state.fileError=error.message;status('error',error.message);}}
 finally{if(token===state.fileToken){state.reading=false;controls();}}
}
async function engineFor(site){
 if(engineSite===site.number&&engineHost?.isConnected&&enginePromise)return enginePromise;
 engineHost?.remove();engineSite=site.number;
 const frame=document.createElement('iframe');frame.className='engine-frame';frame.title='결과 비교 처리';frame.setAttribute('aria-hidden','true');frame.tabIndex=-1;frame.inert=true;
 engineHost=frame;
 enginePromise=new Promise((resolve,reject)=>{
  let timer;const fail=error=>{clearTimeout(timer);reject(error);};
  timer=setTimeout(()=>fail(Error('검증실을 불러오는 데 시간이 초과됐습니다. 잠시 후 다시 시도해 주세요.')),20000);
  frame.onerror=()=>fail(Error('검증실을 불러오지 못했습니다.'));
  frame.onload=async()=>{
   try{
    // Module initialization and its manifest fetch can finish after the frame load event.
    for(let tries=0;!frame.contentWindow.validationLabReady&&tries<200;tries++)await new Promise(r=>setTimeout(r,25));
    const ready=frame.contentWindow.validationLabReady;if(!ready)throw Error('검증실 API를 불러오지 못했습니다.');
    const api=await ready;if(api.manifest.siteId!==site.siteId||canonical(api.entry)!==canonical(entryFor(site)))throw Error('검증실과 선택 사이트가 일치하지 않습니다.');
    clearTimeout(timer);resolve(api);
   }catch(error){fail(Error(error.message||'검증실 준비에 실패했습니다.'));}
  };
  frame.src=new URL('source/'+site.project+'/lab/index.html',root).href;document.body.append(frame);
 });
 try{return await enginePromise;}catch(error){frame.remove();if(engineHost===frame){engineHost=null;engineSite=null;enginePromise=null;}throw error;}
}
function download(name,data){
 const link=document.createElement('a'),url=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)+'\n'],{type:'application/json;charset=utf-8'}));link.href=url;link.download=name;link.click();setTimeout(()=>URL.revokeObjectURL(url),1500);
}
function element(tag,className,text){const node=document.createElement(tag);if(className)node.className=className;if(text!==undefined)node.textContent=text;return node;}
function fields(values){
 const list=element('dl','diagnostic__fields');
 for(const [name,value]of values){const pair=element('div','diagnostic__field');pair.append(element('dt','',name));const dd=element('dd');dd.append(element(name==='위치'?'code':'span','',value===undefined?'— (누락)':value===null?'null':typeof value==='object'?JSON.stringify(value):value===''?'(빈 문자열)':String(value)));pair.append(dd);list.append(pair);}
 return list;
}
function describe(value,{expected=false}={}){
 return fields([['ID',value.id],['URL',value.url],['위치',value.location],['기법',expected&&value.is_violation===false&&!value.technique?'정상 · 기법 없음':value.technique],['위반 여부',typeof value.is_violation==='boolean'?String(value.is_violation):value.is_violation],['원문',value.evidence_text],...(expected&&value.primaryCategory?[['정답 주제',categoryLabel(value.primaryCategory)],['판정 근거',value.annotationReason]]:[]),...(expected&&value.relatedCategory?[['정상 대조 주제',categoryLabel(value.relatedCategory)],['정상 근거',value.normalReason]]:[])]);
}
function renderCategories(summary){
 const select=$('#category-filter');select.replaceChildren(new Option('전체 정답 주제','all'));
 const body=$('#category-body');body.replaceChildren();
 for(const group of summary.groups){
  select.append(new Option(group.label+' · '+group.code,group.code));
  const row=element('tr');row.dataset.category=group.code;
  const name=element('th');name.scope='row';name.append(element('strong','',group.label),element('small','',group.code));row.append(name);
  for(const [key,value]of Object.entries({positiveElements:group.positiveElements,negativeControls:group.negativeControls,expectedFindings:group.expectedFindings,tp:group.tp,fn:group.fn})){const cell=element('td','',format(value));cell.dataset.field=key;row.append(cell);}
  const detailCell=element('td'),detail=element('details'),summaryNode=element('summary','','기법별 보기'),list=element('ul');
  for(const [code,values]of Object.entries(group.techniques))list.append(element('li','',code+' · 미탐 '+values.fn+' / 기대 '+values.expected));
  detail.append(summaryNode,list);detailCell.append(detail);row.append(detailCell);body.append(row);
 }
 $('#category-unassigned').textContent='주제 미분류: 오탐 '+format(summary.unassigned.fp)+' · 필드 오류 '+format(summary.unassigned.invalid)+' · 중복 '+format(summary.unassigned.duplicates)+'건. 전체 집계에 포함되며 정상 대조 주제를 광고 범주로 추정하지 않습니다.';
}
function diagnostic(row){
 const detail=element('details','diagnostic');detail.dataset.type=row.type;
 const summary=element('summary','diagnostic__summary'),badge=element('span','diagnostic__badge',labels[row.type]);badge.dataset.type=row.type;
 const title=row.id||((row.inputIndex?row.inputIndex+'번':'제출')+' 항목');summary.append(badge,element('span','diagnostic__title',title),element('span','diagnostic__reason',row.reason));detail.append(summary);
 const body=element('div','diagnostic__body');body.append(element('p','',row.reason));body.append(element('p','category-diagnostic-topic','정답 주제: '+categoryLabel(row.category)));
 const expectedSection=element('section','diagnostic__expected');expectedSection.append(element('h4','','기대 결과'));
 if(row.expected.length)for(const item of row.expected)expectedSection.append(describe(item,{expected:true}));else expectedSection.append(element('p','',row.expectedRule||'이 제출 위치에 대응하는 정답이 없습니다.'));
 const submittedSection=element('section','diagnostic__submitted');submittedSection.append(element('h4','','제출 결과'));
 if(row.submitted===null)submittedSection.append(element('p','','대응하는 유효한 검출이 없습니다.'));
 else if(Object.hasOwn(row.submitted,'value'))submittedSection.append(element('code','',JSON.stringify(row.submitted.value)));
 else submittedSection.append(describe(row.submitted));
 body.append(expectedSection,submittedSection);detail.append(body);return detail;
}
function renderDiagnostics({more=false}={}){
 if(!lastReport)return;if(!more)visibleRows=50;
 const category=$('#category-filter').value,type=$('#diagnostic-filter').value,query=$('#diagnostic-search').value.trim().toLowerCase(),rows=displayRows.filter(item=>(type==='all'||item.row.type===type)&&(category==='all'||(item.row.category||'UNASSIGNED')===category)&&(!query||item.search.includes(query)));
 $('#diagnostic-list').replaceChildren(...rows.slice(0,visibleRows).map(item=>diagnostic(item.row)));
 $('#diagnostic-count').textContent='진단 항목 '+format(rows.length)+'개 · '+format(Math.min(rows.length,visibleRows))+'개 표시';
 $('#empty-results').hidden=rows.length!==0;$('#show-more').hidden=rows.length<=visibleRows;
}
function renderReport(report){
 if(!report.categorySummary)throw Error('이전 버전의 검증실이 로드되었습니다. 브라우저 캐시를 새로고침한 뒤 다시 비교해 주세요.');
 lastReport=report;renderCategories(report.categorySummary);const metrics=report.metrics;$('#results').dataset.result=JSON.stringify(metrics);$('#results').hidden=false;
 for(const key of ['tp','fn','fp','invalid','duplicates','total'])$('#score-'+key).textContent=format(metrics[key]);
 const percent=value=>value===null?'계산 불가':(value*100).toFixed(1)+'%';
 $('#recall-value').textContent=percent(report.rates.recall);$('#precision-value').textContent=percent(report.rates.precision);$('#adjusted-value').textContent=percent(report.rates.adjusted);
 $('#recall-bar').style.width=(report.rates.recall===null?0:report.rates.recall*100)+'%';
 $('#summary-caption').textContent='기대 '+format(metrics.total)+'건 중 '+format(metrics.tp)+'건 일치 · '+format(metrics.fn)+'건 미탐. 재현율 = TP ÷ 기대 탐지 건수.';
 $('#result-meta').textContent='test-site-'+state.site.number+' · 제출 '+format(report.submittedCount)+'건 · 기록 시간 '+format(report.meta.elapsed_sec)+'초'+(report.meta.elapsed_sec>1800?' · 1,800초 초과':'')+' (제출 파일 기록)';
 const order={invalid:0,fn:1,fp:2,tp:3,duplicate:4};displayRows=report.diagnostics.map(row=>({row,search:JSON.stringify(row).toLowerCase()})).sort((a,b)=>order[a.row.type]-order[b.row.type]);
 $('#diagnostic-filter').value='all';$('#diagnostic-search').value='';renderDiagnostics();
}
async function compare(){
 if(locked()||!state.file||!state.manifest)return;const mismatch=addressError();if(mismatch){clearReport();status('error',mismatch);return;}
 state.busy=true;clearReport();$('#comparison-progress').removeAttribute('value');status('loading','비교를 준비하고 있습니다…');
 try{
  const api=await engineFor(state.site);status('comparing','실제 요소 위치를 대조하고 있습니다…');
  const report=await api.compare(state.file,{onProgress:({done,total})=>{$('#comparison-progress').max=Math.max(1,total);$('#comparison-progress').value=done;status('comparing','요소 위치 대조 중 · '+done+' / '+total+'개 페이지');}});
  if(!report||report.status!=='complete')throw Error(report?.error||'비교 결과를 만들지 못했습니다.');
  renderReport(report);$('#comparison-progress').max=100;$('#comparison-progress').value=100;status('complete','비교를 완료했습니다. 정탐·미탐·오탐·필드 오류를 각각 확인해 주세요.');
 }catch(error){clearReport();status('error',error.message);}
 finally{state.busy=false;controls();}
}
$('#result-file').addEventListener('change',event=>pickFile(event.target.files[0]));
$('#site-select').addEventListener('change',()=>{if(!locked())selectSite($('#site-select').value,{manual:Boolean($('#site-select').value)});});
$('#compare-button').addEventListener('click',compare);$('#reset-button').addEventListener('click',()=>{if(!locked())resetFile();});
$('#category-filter').addEventListener('change',()=>renderDiagnostics());$('#diagnostic-filter').addEventListener('change',()=>renderDiagnostics());$('#diagnostic-search').addEventListener('input',()=>renderDiagnostics());
$('#show-more').addEventListener('click',()=>{visibleRows+=50;renderDiagnostics({more:true});});
$('#download-truth').addEventListener('click',()=>{if(state.manifest&&!locked())download('ground-truth.json',state.manifest);});
$('#download-expected').addEventListener('click',async()=>{
 if(!state.manifest||locked())return;state.busy=true;status('loading','결과 예시를 준비하고 있습니다…');
 try{const api=await engineFor(state.site);download('expected-result.json',api.expectedResult());const error=state.fileError||state.siteError||addressError();status(error?'error':lastReport?'complete':state.file&&state.data?'ready':'idle','현재 배포 주소의 결과 예시를 저장했습니다. 예시의 0초는 합성 기록입니다.'+(error?' '+error:''));}catch(error){status('error',error.message);}finally{state.busy=false;controls();}
});
for(const event of ['dragenter','dragover'])$('#upload-zone').addEventListener(event,e=>{e.preventDefault();if(!locked())$('#upload-zone').classList.add('is-dragging');});
for(const event of ['dragleave','drop'])$('#upload-zone').addEventListener(event,e=>{e.preventDefault();$('#upload-zone').classList.remove('is-dragging');if(event==='drop'&&!locked()){const files=e.dataTransfer.files;if(files.length!==1){resetFile();status('error','JSON 파일 하나를 선택해 주세요.');return;}pickFile(files[0]);}});
globalThis.validationDashboard=Object.freeze({get lastReport(){return lastReport;}});
try{
 state.loading=true;status('loading','사이트 목록을 불러오고 있습니다…');
 const response=await fetch(new URL('source/sites.json',root));if(!response.ok)throw Error('사이트 목록을 불러오지 못했습니다 ('+response.status+').');const sites=await response.json();if(!Array.isArray(sites)||!sites.length)throw Error('등록된 테스트 사이트가 없습니다.');
 for(const site of sites){if(!Number.isSafeInteger(site.number)||site.number<1||site.project!=='test-site-'+site.number||!site.siteId||!site.title||catalog.has(String(site.number)))throw Error('사이트 등록 정보를 확인해 주세요.');catalog.set(String(site.number),site);}
 $('#site-select').replaceChildren(new Option('사이트 자동 선택 / 직접 선택',''),...[...catalog.values()].sort((a,b)=>a.number-b.number).map(site=>new Option('test-site-'+site.number+' · '+site.title,site.number)));
 state.loading=false;const initial=new URL(location.href).searchParams.get('site');if(initial){if(!catalog.has(initial))throw Error('등록되지 않은 사이트 번호입니다.');await selectSite(initial,{manual:true});}else{await selectSite('');status('idle','사이트를 선택하거나 result.json을 올려 주세요.');}
}catch(error){state.loading=false;status('error',error.message);}
