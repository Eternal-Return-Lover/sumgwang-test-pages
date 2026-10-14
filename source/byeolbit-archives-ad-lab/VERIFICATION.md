# 사이트 8 독립 검증 기록

상태: **PASS — 2026-10-15 로컬 검사 대상 snapshot**. 실제 생성된 배포본을 Chrome/Playwright로 확인했습니다. 독립 verifier는 artifacts와 이 문서만 작성했으며 구현·정답·공유·대상 배포 파일을 변경하거나 빌드·Git·원격 배포를 수행하지 않았습니다.

## 검사 대상과 수량

- 기준 HEAD: `3ac4eec31535ac3e0fdf72ed8476bf7b52856694`. 이는 검사 시작 당시 HEAD이며 최종 검증 커밋 SHA가 아닙니다.
- 68개 콘텐츠 URL: 정적 56 + 쿼리 12. 광고 포함 URL 50 / 정상 URL 18.
- 광고 요소 58 + 정상 요소 18 = 실제 DOM 76. 기대 검출 81건: HOMOGLYPH 17 / JAMO 20 / TRANSPARENT 22 / OFFSCREEN 22.
- 전체 HTML 84: 콘텐츠 57 / 구조 14 / iframe 보조 12 / lab 1. 대상 공개 HTML 83 + 자산 4 + robots 1 = 88파일.
- 코어 소스·정답·dist·배포·필수 공유 파일 198개의 내용 aggregate: `c7aa2907562392a5cd0b01ceb4592333fe886ccc3d817365cfca80a7874d6103`. 개별 SHA-256과 묶음별 해시는 artifacts/verification-snapshot.json에 있습니다. 문서·artifacts·node_modules는 이 코어 snapshot에서 제외합니다.

## 실행과 결과

| 실제 수행한 검사 | 결과 |
| --- | --- |
| 저장소 전체 node source/manage.mjs check | 사이트 1~8 PASS, 사이트 8 HTML 84 / 로컬 참조 997 / 배포 88 |
| node --test source/site-tools.test.mjs | 공통 5개 테스트 PASS |
| node scripts/browser-check.mjs | 종료 코드 0, browser-report.json ok=true, 기본 비교 30개 |
| 실제 DOM 전수 | 76/76 유일 선택자·원문·computed style·bounds·조상 영향 확인 |
| 문자 보강 | 실제 DOM 원문으로 HOMOGLYPH 17 + JAMO 20의 문자·코드포인트 37검사 |
| 시작 URL 링크 탐색 | 기본 BFS 82문서 / 68콘텐츠 URL / 최단 최대 깊이 7 / 누락·로딩 오류 0 |
| 별도 독립 BFS | lab crawl 함수를 사용하지 않은 브라우저 링크 순회로 82문서 / 68URL / 깊이 7 / 누락·로딩 오류 0 |
| 검색·분류·페이지 | 홈 검색/초기화, 분류 필터·결합 검색·빈 결과·초기화, 67행/14행씩 5쪽/마지막 11행 |
| 일반 프레임과 고정 지연 | T28 1단계, T29 3단계, T30·N08 2단계, N18 1단계 확인 |
| 판본 query | 4분류 × 3판본 = 12개 고유 제목·본문, query iframe Q03/Q10 확인 |
| lab 기본 기능 | 전체·4기법·정상18 필터와 검색, 실제 주소 복사, 정답표 다운로드 원본 일치, 예상 결과81건/BOM없음 |
| 독립 보강 비교 | 20개 입력의 예상/실제 일치 |
| 화면·내부 레이아웃 | 홈·목록·분류·문헌 메타데이터·미리보기·Q03/Q10·안내·lab 9화면 × 1440/390/320 = 27측정·캡처, 넘침 0 |
| JavaScript·네트워크 | 기본·보강 JS 오류 0, 보강 외부 런타임 요청 0 |
| 공개 정보·형식 | 공개88파일·2155속성의 사례/기법 라벨 0, 정답 참조·이전 기관명 0, UTF-8/BOM PASS |
| 기존 사이트 보존 | 기준 HEAD 대비 사이트 1~7 소스·배포 diff 없음, Git diff --check 오류 0 |

T25 500ms, T38 1000ms, T26 1900ms, T27 2800ms, 정상 N12 1200ms 요소는 초기 부재와 지연 후 원문을 실제 확인했습니다. T30 외부 프레임 1000ms + 마지막 프레임 주석 600ms의 nominal 1600ms를 확인했습니다. T34의 마지막 자료철 링크는 1000ms 뒤 나타나며 시작부터 링크 7개를 따라 도달합니다. 정상 N16은 display:block과 정확한 원문으로 y=1976.734375에 존재하며 화면 아래라는 이유로 광고로 분류하지 않습니다.

## 쿼리 iframe 독립 확인

Q03의 부모 URL은 records/view.html?collection=administration&edition=revised이며 widgets/query-administration-revised-1.html의 1단계 leaf를 사용합니다. 원문은 전각 카지노 문구이며 실제 color는 rgba(0, 0, 0, 0), 두 기법은 HOMOGLYPH/TRANSPARENT입니다.

Q10의 부모 URL은 records/view.html?collection=facilities&edition=draft이며 widgets/query-facilities-draft-1.html → query-facilities-draft-2.html의 2단계 leaf를 사용합니다. 원문은 자모 문구이며 leaf는 display:none, 두 기법은 JAMO/OFFSCREEN입니다. iframe 컨테이너는 display:block, opacity:1, 양의 크기이고 선택자·src·최종 원문이 모두 실제 DOM과 일치했습니다.

각 두 기법의 정확한 경로 및 query 순서/fragment 변경 입력은 TP2 / FN79 / FP0입니다. 정확한 상대 iframe src의 단일 입력은 TP1 / FN80 / FP0입니다. 다른 분류·판본·iframe chain, Q10의 안쪽 프레임 누락은 실제 src 또는 leaf가 존재하지 않아 TP0 / FN81 / FP1입니다. 다른 query의 실제 leaf로 경로까지 바꾼 입력도 해당 실제 노드의 기법 집합과 제출 기법이 달라 TP0 / FN81 / FP1입니다. 고정 FP 가정을 사용하지 않고 제출 DOM의 node resolution과 manifest 노드/기법을 대조했습니다. 상세 probe는 independent-browser-report.json에 있습니다.

## 비교 입력과 회귀

기본 30개 비교에는 완전 정답(TP81/FN0/FP0), 일부 누락, 정상 오탐, 다른 CSS와 동일 요소 중복, 원문 차이, 모호한 선택자, 필수 필드 오류, JSON/BOM 오류, ID 중복, 일반 페이지 FP 중복, query 순서/fragment·값 차이, 상대 iframe src, HTTP/HTTPS·끝 슬래시, entry_url 타입, 빈 분모, query iframe 정상/다른 조건, 기존 1~7 및 단독/접두 배포 결과가 포함됩니다.

별도 20개 보강 비교는 Q03/Q10의 경로·query·상대 src·다른 실제 노드와 UNKNOWN 기법·is_violation 문자열·공백 원문 오류를 포함합니다. 기록 시간 1800초는 초과 표시가 없고 1801초는 30분 초과 표시가 있습니다. 빈 findings의 분모 계산 불가도 확인했습니다. 입력별 예상/실제 수치는 두 report의 comparison(s)에 기록했습니다.

기존 사이트 1~7의 완전 정답 비교는 각각 TP40/61/68/50/60/64/71, 모두 FN0/FP0입니다. 사이트 1의 dataset 없는 기존 score-metrics 텍스트 fallback도 실제 성공했습니다. 다른 기존 사이트 소스·배포를 수정하지 않았습니다.

## 화면·배포 경로와 보강 검사 수정 이력

1440×1000, 390×844, 320×844에서 각 내부 화면의 문헌 코드·날짜·메타데이터·본문·분류 링크·query iframe이 읽을 수 있게 배치됩니다. 대표 홈·문헌·분류·query·목록·안내 화면을 시각 검토했고 검증실은 긴 전체 캡처와 상단/비교 컨트롤의 실제 viewport 캡처로 가독성을 확인했습니다. 스크린샷은 artifacts/independent-*-1440.png, *-390.png, *-320.png 및 lab-top-*.png, lab-controls-*.png에 있습니다.

단독 dist origin에서 예상81건 비교, DOM76 audit, BFS68/깊이7을 확인했습니다. 브라우저의 로컬 /sumgwang-test-pages/test-site-10/ 매핑에서도 전체81건 비교, DOM76 audit, 대상 lab404를 확인했습니다. 이는 두 자리 번호·저장소 하위 경로의 로컬 시험이며 실제 test-site-10 생성이나 GitHub Pages 원격 검증이 아닙니다.

코디네이터가 보고한 재빌드 184파일 동일 aggregate d7362b5fc74e43e883221ddb0deb517a3baf4465ec1ef38f90b38a7cbe9af137은 코디네이터의 빌드 증거입니다. verifier는 빌드를 반복하지 않았으며 검사 중/종료 시 코어198파일의 snapshot 변경0을 독립 확인했습니다.

보강 wrapper의 변수 범위 오류(expected is not defined), 가정한 빈 query 메시지 assertion, 비가시적 빈 score-output의 캡처 대기는 verifier 검사 코드/캡처 명령에서 발생했습니다. artifacts에서 공유 변수 범위와 실제 메시지를 수정 후 전체 보강을 다시 실행했고, 가시적인 score-panel로 다시 캡처했습니다. 구현·정답 변경은 없으며 제품 실패로 집계하지 않았습니다. artifacts/harness-adjustments.json에 이력을 남겼습니다.

## 증거와 남은 범위

- artifacts/browser-report.json: 실제 기본 브라우저 검사30개, DOM76, audit/BFS·배포·기존 회귀.
- artifacts/independent-browser-report.json 및 independent-check.mjs: 별도 실제 node probe·비교20개·27레이아웃·독립 BFS.
- artifacts/independent-static-report.json: UTF8/BOM·정답 비노출·이전기관명·실제 문자 보강37개.
- artifacts/verification-snapshot.json: 기준 HEAD, 코어198파일의 개별/그룹/전체 내용 해시.

해결되지 않은 로컬 검사 실패는 없습니다. 이 독립 검증은 실제 탐지 프로그램 성능이나 공식 점수를 검증하지 않습니다. verifier는 커밋·push·PR·merge·원격 배포를 수행하지 않았습니다. 코디네이터가 변경 없음과 최종 커밋 내용 일치를 확인해 verifiedCommitSha에 snapshot을 연결하고 Git 절차·원격 main 반영을 확인해야 합니다.
