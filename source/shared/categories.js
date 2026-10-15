export const CATEGORY_LABELS=Object.freeze({
 GAMBLING:'도박',DRUG:'마약류',PHARMACEUTICAL:'의약품',FOOD_HEALTH:'식품·건강식품',COSMETIC:'화장품',MEDICAL_DEVICE:'의료기기',PRIVATE_LOAN:'불법 대부·고금리 대출',INVESTMENT_SCAM:'투자 사기·허위 수익 보장',COUNTERFEIT:'위조 상표·가품',IDENTITY_TRADE:'계좌·접근매체·개인정보 거래',PROSTITUTION:'성매매 알선·모집'
});
export const UNASSIGNED='UNASSIGNED';
export const TECHNIQUES=Object.freeze(['HOMOGLYPH','JAMO','TRANSPARENT','OFFSCREEN']);
export const categoryLabel=code=>typeof code==='string'&&Object.hasOwn(CATEGORY_LABELS,code)?CATEGORY_LABELS[code]:'카테고리 미지정 / 미분류';
export const categoryFor=c=>typeof c?.primaryCategory==='string'&&Object.hasOwn(CATEGORY_LABELS,c.primaryCategory)?c.primaryCategory:UNASSIGNED;
const emptyTechniques=()=>Object.fromEntries(TECHNIQUES.map(t=>[t,0]));
export function categoryCounts(manifest){
 const annotated=Object.hasOwn(manifest,'categoryProfile')||[...manifest.cases,...manifest.negativeControls].some(c=>['primaryCategory','relatedCategory','annotationReason','normalReason'].some(k=>Object.hasOwn(c,k)));
 if(!annotated)return null;
 const counts=Object.fromEntries(Object.keys(CATEGORY_LABELS).map(code=>[code,{positiveElements:0,negativeControls:0,expectedFindings:0,techniques:emptyTechniques()}]));
 for(const c of manifest.cases){if(typeof c.primaryCategory!=='string'||!Object.hasOwn(counts,c.primaryCategory))continue;const group=counts[c.primaryCategory];group.positiveElements++;for(const t of c.techniques){group.expectedFindings++;if(Object.hasOwn(group.techniques,t))group.techniques[t]++;}}
 for(const c of manifest.negativeControls)if(typeof c.relatedCategory==='string'&&Object.hasOwn(counts,c.relatedCategory))counts[c.relatedCategory].negativeControls++;
 return counts;
}
export function validateCategoryAnnotations(manifest){
 const counts=categoryCounts(manifest);if(!counts)return false;
 const require=(condition,message)=>{if(!condition)throw Error('Category annotations: '+message);};
 require(manifest.categoryProfile==='all-11-v1','missing or unsupported categoryProfile');
 for(const [normal,cases]of [[false,manifest.cases],[true,manifest.negativeControls]])for(const c of cases){
  const field=normal?'relatedCategory':'primaryCategory',reason=normal?'normalReason':'annotationReason';
  require(typeof c[field]==='string'&&Object.hasOwn(CATEGORY_LABELS,c[field]),c.caseId+' invalid '+field);
  require(typeof c[reason]==='string'&&c[reason].trim().length>0,c.caseId+' missing '+reason);
  require(!Object.hasOwn(c,normal?'primaryCategory':'relatedCategory')&&!Object.hasOwn(c,normal?'annotationReason':'normalReason'),c.caseId+' annotation role mismatch');
  require(Array.isArray(c.techniques)&&new Set(c.techniques).size===c.techniques.length&&c.techniques.every(t=>TECHNIQUES.includes(t)),c.caseId+' invalid techniques');
  require(normal?c.techniques.length===0:c.techniques.length>0,c.caseId+' positive/normal technique mismatch');
 }
 for(const [code,c]of Object.entries(counts)){
  require(c.positiveElements>=4,code+' needs at least 4 positive elements');require(c.negativeControls>=2,code+' needs at least 2 normal controls');
  require(TECHNIQUES.every(t=>c.techniques[t]>0),code+' must cover all 4 techniques');
 }
 require(manifest.cases.filter(c=>c.techniques.length>1).length>=11,'at least 11 composite elements required');
 return true;
}
export function summarizeCategories(manifest,rows){
 const groups=new Map(),ensure=code=>{if(!groups.has(code))groups.set(code,{code,label:categoryLabel(code),positiveElements:0,negativeControls:0,expectedFindings:0,tp:0,fn:0,techniques:Object.fromEntries(TECHNIQUES.map(t=>[t,{expected:0,tp:0,fn:0}]))});return groups.get(code);};
 for(const c of manifest.cases){const g=ensure(categoryFor(c));g.positiveElements++;for(const t of c.techniques){g.expectedFindings++;if(g.techniques[t])g.techniques[t].expected++;}}
 for(const c of manifest.negativeControls){const code=typeof c.relatedCategory==='string'&&Object.hasOwn(CATEGORY_LABELS,c.relatedCategory)?c.relatedCategory:UNASSIGNED;ensure(code).negativeControls++;}
 const unassigned={fp:0,invalid:0,duplicates:0};
 for(const row of rows){const code=row.category||UNASSIGNED,g=ensure(code);if(row.type==='tp'||row.type==='fn'){g[row.type]++;const t=row.expected[0]?.technique;if(g.techniques[t])g.techniques[t][row.type]++;}else if(code===UNASSIGNED){if(row.type==='fp')unassigned.fp++;if(row.type==='invalid')unassigned.invalid++;if(row.type==='duplicate')unassigned.duplicates++;}}
 return {classificationSupported:false,groups:[...groups.values()],unassigned};
}
