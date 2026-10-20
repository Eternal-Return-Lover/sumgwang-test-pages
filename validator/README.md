# 채점 결과 JSON

비교 완료 후 "채점 결과 JSON 다운로드"를 누릅니다. 검색·유형·주제 필터와 화면의 50개 제한에 관계없이 전체 보고서를 저장합니다. 동일 비교의 report_id는 유지되고 저장 시 exported_at만 바뀝니다. 새 입력·사이트·초기화·재비교·채점 오류는 저장 대상을 폐기합니다.

브라우저의 HTTPS/localhost SHA-256·UUID를 사용합니다. 저장 준비 실패는 현재 유효한 채점을 유지하고 버튼을 숨긴 채 이유를 표시합니다. 원인을 해결한 뒤 다시 비교하세요. 이전 API 캐시는 새로고침이 필요합니다.

## 페이지 로딩 대기

채점 중 각 광고 페이지의 로딩 완료를 최대 30초 기다립니다. 기존·현재 채점 엔진에 동일하게 적용되며, 제한을 넘으면 `페이지 로딩 시간 초과`로 기록합니다.

## 스키마 1.0.0

파일명: validation-report-test-site-N-YYYYMMDDTHHmmssZ.json (UTC). UTF-8, BOM 없음, 두 칸 들여쓰기입니다. 기존 제출·정답 JSON과 별도 계약입니다.

| 영역 | 내용 |
| --- | --- |
| schema_version, report_id, captured_at, exported_at, status | 버전·실행 UUID·스냅샷/저장 시각·완료 상태 |
| site | 번호·ID·이름·소스 프로젝트·실제 비교 시작 URL |
| execution | 대시보드 주소·modern/legacy 엔진·관측 가능한 실행 조건 |
| submission.file | 파일명·크기·수정 시각·원본 바이트 SHA-256 |
| submission.raw_text / payload | 정확한 UTF-8 원문 / JSON.parse 결과. 추가 필드도 보존 |
| reference | 실제 엔진 manifest 스냅샷·버전·직렬화 SHA-256 |
| comparison | 전체 metrics·rates·categorySummary·diagnostics·meta |
| interpretation | 라벨·집계·미수집 정보의 한계 |
| serialization | 특수 수치의 JSON 표현과 복원 경로 |

파일 해시는 원본 File 바이트 기준입니다. 정답 해시는 비교 전에 복제한 api.manifest에 JSON.stringify를 적용한 UTF-8 바이트 기준입니다. 원래 키 순서·BOM 없음·끝 줄바꿈 없음이며 HTTP 응답 원본 바이트 해시와 다릅니다. 저장 때 다시 조회하지 않습니다.

엔진 구현 버전·Git SHA·탐지기 방문 범위는 확인할 수 없어 null입니다. diagnostic_schema_version은 관찰용 진단 계약 버전입니다. comparison_host_viewport는 검증실 iframe의 실제 client 크기이고 fixture_viewport_declared는 manifest 선언값입니다. 요소별 실제 viewport·스타일·bounds를 새로 측정한 자료는 아닙니다. 제출 meta의 모델·버전·시간은 제출자 기록이며 독립 검증된 성능 정보가 아닙니다.

## 진단 연결과 숫자

기존 inputIndex는 1-based 오류 위치를 유지합니다. 새 submissionIndex는 원본 findings의 0-based 위치입니다. 연결 없음·같은 객체의 여러 위치 재사용은 null과 submissionIndexStatus로 구분합니다. 진단 개수와 제출 개수가 항상 같다는 집계식을 강제하지 않습니다.

| reference.status | 의미 |
| --- | --- |
| matched_positive | 실제 DOM이 양성 정답 요소에 연결됨. 기법·플래그가 틀린 FP도 가능 |
| matched_control | 실제 DOM이 정상 대조 요소에 연결됨 |
| expected_missing | FN의 기대 정답이며 제출 항목 없음 |
| candidates_only | 페이지 후보는 있지만 확정 연결 없음 |
| unresolved | 확정 연결·후보 없음 |
| not_evaluated | invalid·duplicate처럼 정답 연결을 확정하지 않은 관찰 |

caseId·contentLabel은 정답 fixture 요소의 정보이며 제출 evidence_text 자체의 검증된 라벨이 아닙니다. 기존 엔진은 원문 차이만으로 TP를 취소하지 않습니다. TP/FN의 expectedTechnique는 기법별 기대 단위이고 나머지는 null입니다. expectedTechniques는 확정 요소의 전체 기법입니다. candidateCaseIds·기존 expected의 첫 후보를 실제 정답으로 추정하면 안 됩니다.

정상 relatedCategory는 참고 주제이며 기존 무주석 사이트는 UNASSIGNED입니다. 분류 정확도는 미지원입니다. 비율은 반올림 전 API 값을 보존하고 분모가 없으면 null입니다.

1e999는 JSON.parse에서 Infinity가 되고 -0도 일반 저장 시 달라집니다. raw_text에 숫자 토큰까지 보존하며 numeric_exceptions의 RFC 6901 JSON Pointer·kind로 파싱된 값을 복원할 수 있습니다. nonfinite는 null, 음의 0은 0으로 인코딩합니다. 일반 유한 수·문자열은 바꾸지 않습니다. 큰 정수의 원래 토큰도 raw_text에서 확인하세요.

## ML 분석 범위

이 JSON은 분석 자료이며 완성된 학습셋이 아닙니다.

- TP/FN은 caseId + technique 단위입니다. 한 요소의 복합 기법을 독립 콘텐츠 여러 개로 세지 마세요.
- FP에는 정상 요소뿐 아니라 광고의 잘못된 기법·플래그·위치도 포함됩니다. FP를 정상 라벨로 일괄 변환하지 마세요. invalid·duplicate도 콘텐츠 라벨이 아닙니다.
- 참조 정답은 합성 fixture이며 탐지·방문 기록이 아닙니다. 미제출 정상 사례를 TN으로 세거나 임의의 정확도를 만들지 않습니다.
- 사이트·페이지·caseId·프레임·선택자 그룹을 보존해 동일 사례/변형이 학습·평가 양쪽에 섞이지 않도록 활용하세요. 템플릿 그룹은 미수집입니다.
- 정답 주석·근거·채점 결과·사례 ID는 향후 모델 입력과 분리합니다. 자동 라벨 변환·학습·분할을 수행하지 않습니다.
- 광고 여부·은닉 기법·주제 분류는 구분하며 주제 분류에는 명시적 주제 정답이 있는 자료만 사용할 수 있습니다.
- 전체 HTML 문맥·이미지·요소별 실제 스타일/bounds·방문 범위·확인된 모델 버전·confidence는 별도 수집 후보입니다. 원본에 있는 추가 필드를 보존하되 검증된 관측값으로 승격하지 않습니다.

## 검증과 배포

npm run build, npm run check, npm test를 실행합니다. npm run verify:dashboard는 모든 등록 사이트의 루트·접두 경로에서 기존 DOM 비교와 혼합·완전정답 보고서 다운로드를 확인합니다. 추가 독립 검사·다운로드·화면 증거는 Git 제외 tmp/verification/report-export/에 보관합니다. 실제 최종 결과는 해당 PR에 기록합니다. 로컬·모의 접두 검사는 운영 배포가 아니며 main 병합 후 기존 Pages 배포 성공과 실제 주소를 별도로 확인해야 합니다.
