import {categoryFor,summarizeCategories,validateCategoryAnnotations,UNASSIGNED} from './categories.js';
// Diagnostics observe existing engine decisions; they do not decide matches or counts.
export const DIAGNOSTIC_SCHEMA_VERSION='1.0.0';
export function createComparisonTrace({manifest,base,entry,canonical,locationFor,engine}){
 validateCategoryAnnotations(manifest);
 const rows=[],observations=new Map(),matchedRows=new Set(),all=[...manifest.cases,...manifest.negativeControls];
 const submitted=f=>f&&typeof f==='object'&&!Array.isArray(f)?Object.fromEntries(['id','url','location','evidence_text','technique','is_violation'].filter(k=>Object.hasOwn(f,k)).map(k=>[k,f[k]])):{value:f};
 const expected=(c,technique)=>({id:c.caseId,url:new URL(c.page,base).href,location:locationFor(c),technique:technique??c.techniques.join(', '),evidence_text:c.text,is_violation:c.techniques.length>0,...(c.primaryCategory?{primaryCategory:c.primaryCategory,annotationReason:c.annotationReason}:{}),...(c.relatedCategory?{relatedCategory:c.relatedCategory,normalReason:c.normalReason}:{})});
 const candidates=f=>{try{return all.filter(c=>canonical(new URL(c.page,base))===canonical(f?.url)).map(c=>expected(c));}catch{return [];}};
 const reference=(type,c,values,technique=null)=>({
  status:c?(type==='fn'?'expected_missing':c.techniques.length?'matched_positive':'matched_control'):['invalid','duplicate'].includes(type)?'not_evaluated':values.length?'candidates_only':'unresolved',
  caseId:c?.caseId??null,
  contentLabel:c?(c.techniques.length?'positive':'normal'):null,
  contentLabelSource:c?'reference_manifest_element':null,
  expectedTechnique:type==='tp'||type==='fn'?technique:null,
  expectedTechniques:c?[...c.techniques]:null,
  candidateCaseIds:c?[]:[...new Set(values.map(v=>v.id))]
 });
 const add=(type,f,reason,c,index)=>{
  const values=c?[expected(c,type==='tp'?f.technique:undefined)]:candidates(f);
  const row={type,category:c?.techniques.length?categoryFor(c):UNASSIGNED,id:typeof f?.id==='string'?f.id:'',inputIndex:index??null,reason,expected:values,expectedRule:type==='invalid'?'유효한 필수 필드·허용 기법·고유 ID':null,submitted:submitted(f),reference:reference(type,c,values,type==='tp'?f.technique:null)};
  rows.push(row);observations.set(row,f);
 };
 return {
  invalid(f,index,reason){add('invalid',f,reason,null,index+1);},
  fp(f,reason,c){
   if(reason==='위치·기법·위반 여부가 자체 정답과 다름'){
    reason=!c?'요소는 찾았지만 정답 광고 요소에 대응하지 않습니다.':!c.techniques.length?'정상 대조 요소는 기대 검출 대상이 아닙니다.':f.is_violation!==true?'is_violation이 true가 아니어서 정답 검출로 인정하지 않았습니다.':'이 요소의 기대 기법은 '+c.techniques.join(', ')+'이며 제출 기법 '+f.technique+'과 다릅니다.';
   }
   add('fp',f,reason,c);
  },
  duplicate(f){add('duplicate',f,'같은 위치·기법의 반복 검출을 기존 항목에 통합했습니다.');},
  tp(f,c){const key=c.caseId+'|'+f.technique;if(!matchedRows.has(key)){matchedRows.add(key);add('tp',f,'실제 요소 위치·기법·위반 여부가 정답과 일치합니다.',c);}},
  finish(metrics,matched,data){
   for(const c of manifest.cases)for(const technique of c.techniques)if(!matched.has(c.caseId+'|'+technique))rows.push({type:'fn',category:categoryFor(c),id:c.caseId+'_'+technique,inputIndex:null,reason:'이 위치·기법에 대응하는 유효한 검출이 없습니다.',expected:[expected(c,technique)],expectedRule:null,submitted:null,reference:reference('fn',c,[],technique)});
   // File parsing makes each finding object unique. Direct API callers may reuse
   // object identities; ambiguous occurrences must not be guessed or consumed.
   const indices=new Map();
   data.findings.forEach((f,i)=>{if(!indices.has(f))indices.set(f,[]);indices.get(f).push(i);});
   for(const row of rows){
    const found=observations.has(row)?indices.get(observations.get(row))||[]:[];
    const explicit=row.inputIndex!==null,explicitIndex=row.inputIndex-1,explicitMatch=explicit&&Number.isInteger(explicitIndex)&&explicitIndex>=0&&explicitIndex<data.findings.length&&Object.is(data.findings[explicitIndex],observations.get(row));
    row.submissionIndex=row.type==='fn'?null:explicit?explicitMatch?explicitIndex:null:found.length===1?found[0]:null;
    row.submissionIndexStatus=row.type==='fn'?'not_applicable':explicit?explicitMatch?'linked':'unavailable':found.length===1?'linked':found.length>1?'ambiguous':'unavailable';
   }
   return {status:'complete',engine,diagnosticSchemaVersion:DIAGNOSTIC_SCHEMA_VERSION,entryUrl:entry,categorySummary:summarizeCategories(manifest,rows),metrics:{...metrics},rates:{recall:metrics.total?metrics.tp/metrics.total:null,precision:metrics.tp+metrics.fp?metrics.tp/(metrics.tp+metrics.fp):null,adjusted:metrics.tp+metrics.fp+metrics.invalid?metrics.tp/(metrics.tp+metrics.fp+metrics.invalid):null},meta:{...data.meta},submittedCount:data.findings.length,diagnostics:rows};
  }
 };
}
export function createLabBridge(){
 let resolve,reject;
 const ready=new Promise((ok,fail)=>{resolve=ok;reject=fail;});
 // Old lab pages need not consume the API, including when initialization fails.
 ready.catch(()=>{});
 globalThis.validationLabReady=ready;
 return {ready(api){validateCategoryAnnotations(api.manifest);const value=Object.freeze(api);globalThis.validationLab=value;resolve(value);},fail(error){reject(error);}};
}
export function reportProgress(options,done,total){
 try{options.onProgress?.({done,total});}catch{/* A progress renderer cannot change a comparison result. */}
}
