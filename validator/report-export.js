// Export existing comparison observations; never decide matches or training labels.
export const EXPORT_SCHEMA_VERSION='1.0.0';
const clone=value=>structuredClone(value);
function sameJSON(a,b){
 if(Object.is(a,b))return true;
 if(!a||!b||typeof a!=='object'||typeof b!=='object'||Array.isArray(a)!==Array.isArray(b))return false;
 const keys=Object.keys(a);return keys.length===Object.keys(b).length&&keys.every(k=>Object.hasOwn(b,k)&&sameJSON(a[k],b[k]));
}
function encodeNumbers(value,path,exceptions){
 if(typeof value==='number'&&(!Number.isFinite(value)||Object.is(value,-0))){exceptions.push({path,kind:Object.is(value,-0)?'negative_zero':value===Infinity?'positive_infinity':value===-Infinity?'negative_infinity':'nan'});return Object.is(value,-0)?0:null;}
 if(Array.isArray(value))return value.map((child,i)=>encodeNumbers(child,path+'/'+i,exceptions));
 if(value&&typeof value==='object')return Object.fromEntries(Object.entries(value).map(([key,child])=>[key,encodeNumbers(child,path+'/'+key.replaceAll('~','~0').replaceAll('/','~1'),exceptions)]));
 return value;
}
function freeze(value){
 if(value&&typeof value==='object'&&!Object.isFrozen(value)){
  for(const child of Object.values(value))freeze(child);
  Object.freeze(value);
 }
 return value;
}
const requireValue=(condition,message)=>{if(!condition)throw Error(message);};
export async function sha256(bytes){
 requireValue(globalThis.crypto?.subtle,'SHA-256을 사용할 수 없습니다. HTTPS 또는 localhost에서 다시 시도해 주세요.');
 const result=await globalThis.crypto.subtle.digest('SHA-256',bytes);
 return [...new Uint8Array(result)].map(n=>n.toString(16).padStart(2,'0')).join('');
}
export async function createReportSnapshot({report,site,entryUrl,dashboardUrl,manifest,submissionFile,submissionPayload,comparisonViewport}){
 requireValue(report?.status==='complete'&&report.metrics&&Array.isArray(report.diagnostics),'완료된 비교 결과만 내보낼 수 있습니다.');
 requireValue(report.diagnosticSchemaVersion==='1.0.0','검증실이 이전 버전입니다. 브라우저 캐시를 새로고침한 뒤 다시 비교해 주세요.');
 requireValue(Number.isSafeInteger(site?.number)&&site.number>0&&site.siteId===manifest?.siteId,'보고서의 사이트와 정답 데이터가 일치하지 않습니다.');
 requireValue(report.entryUrl===entryUrl,'보고서의 시작 URL이 일치하지 않습니다.');
 requireValue(submissionFile&&typeof submissionFile.arrayBuffer==='function','원본 제출 파일이 없습니다.');
 requireValue(typeof globalThis.crypto?.randomUUID==='function','이 브라우저에서 보고서 식별자를 생성할 수 없습니다. HTTPS 또는 localhost를 사용해 주세요.');
 // Capture every mutable input before the first await. Hashes never refetch data.
 const captured=clone({report,site,entryUrl,dashboardUrl,manifest,submissionPayload,comparisonViewport:comparisonViewport??null});
 const file={name:submissionFile.name,size_bytes:submissionFile.size,last_modified:typeof submissionFile.lastModified==='number'?submissionFile.lastModified:null};
 const reportId=globalThis.crypto.randomUUID(),capturedAt=new Date().toISOString();
 const manifestText=JSON.stringify(captured.manifest),manifestBytes=new TextEncoder().encode(manifestText);
 const inputBytes=new Uint8Array(await submissionFile.arrayBuffer());
 requireValue(inputBytes.byteLength===file.size_bytes,'원본 제출 파일 크기가 일치하지 않습니다.');
 requireValue(!(inputBytes[0]===239&&inputBytes[1]===187&&inputBytes[2]===191),'UTF-8 BOM이 없는 원본 파일이 필요합니다.');
 const rawText=new TextDecoder('utf-8',{fatal:true}).decode(inputBytes),original=JSON.parse(rawText);
 requireValue(sameJSON(original,captured.submissionPayload),'원본 파일과 비교 입력이 일치하지 않습니다. 다시 비교해 주세요.');
 const [inputHash,manifestHash]=await Promise.all([sha256(inputBytes),sha256(manifestBytes)]);
 return freeze({
  schema_version:EXPORT_SCHEMA_VERSION,
  report_id:reportId,
  captured_at:capturedAt,
  status:'complete',
  site:{number:captured.site.number,site_id:captured.site.siteId,name:captured.site.title,source_project:captured.site.project,entry_url:captured.entryUrl},
  execution:{
   dashboard_url:captured.dashboardUrl,
   engine:{kind:captured.report.engine,version:null,diagnostic_schema_version:captured.report.diagnosticSchemaVersion},
   comparison_host_viewport:captured.comparisonViewport,
   fixture_viewport_declared:captured.manifest.fixtureViewport??null,
   detector_coverage:null,
   git_sha:null
  },
  submission:{
   file:{...file,sha256:inputHash,sha256_basis:'original_file_bytes'},
   metadata_source:'unverified_detector_submission',
   raw_text:rawText,
   payload:original
  },
  reference:{
   source:'synthetic_fixture',
   version:captured.manifest.version??null,
   sha256:manifestHash,
   sha256_basis:'UTF-8(JSON.stringify(manifest)); original property order; no BOM; no trailing newline',
   manifest:captured.manifest
  },
  comparison:captured.report,
  interpretation:{
   purpose:'diagnostic_analysis_not_ready_made_training_dataset',
   tp_fn_unit:'reference_case_id_and_technique',
   content_label_source:'reference_manifest_element_not_submitted_evidence',
   fp_is_not_a_normal_content_label:true,
   invalid_and_duplicate_are_not_content_labels:true,
   missing_control_is_not_observed_tn:true,
   tn:null,
   classification_accuracy_supported:false,
   candidate_references_are_not_resolved_matches:true,
   grouping_fields:['site.site_id','reference.manifest.cases[].caseId','reference.manifest.cases[].page','reference.manifest.cases[].frames','reference.manifest.cases[].selector'],
   template_group:null,
   uncollected:['detector_page_coverage','detector_model_confidence_unless_present_in_submission','full_html_context','rendered_images','per_element_computed_styles_and_bounds','verified_model_version','engine_implementation_version','git_commit_sha'],
   usage:'Keep reference labels, reasons and grading outcomes separate from future model inputs. No automatic training labels or train/test split are generated.'
  }
 });
}
export async function exportReport(snapshot,{exportedAt=new Date().toISOString()}={}){
 requireValue(snapshot?.schema_version===EXPORT_SCHEMA_VERSION&&snapshot.status==='complete','저장할 완료 보고서가 없습니다.');
 const date=new Date(exportedAt);
 requireValue(Number.isFinite(date.getTime()),'올바른 내보내기 시각이 필요합니다.');
 const utc=date.toISOString(),stamp=utc.replace(/[-:]/g,'').replace(/\.\d{3}Z$/,'Z');
 const exceptions=[],data=encodeNumbers({...clone(snapshot),exported_at:utc},'',exceptions);
 data.serialization={numeric_exceptions:exceptions,numeric_exception_paths:'RFC 6901 JSON Pointer; nonfinite numbers encode as null, negative zero as 0; kind restores parsed JS value',original_submission:'submission.raw_text preserves the exact decoded UTF-8 text including numeric tokens; payload is the parsed representation'};
 return {filename:'validation-report-test-site-'+snapshot.site.number+'-'+stamp+'.json',data};
}
