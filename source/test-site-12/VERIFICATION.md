# test-site-12 검증 결과

검증 기준: 2026-10-20 KST, Windows의 설치된 Chrome 155.0.8059.82. 결과는 로컬 모의 사이트의 독립 검증 PASS이며 실제 탐지기 성능·공식 심사 점수·운영 배포 결과가 아닙니다.

## 독립 실행 범위

| 항목 | 실제 결과 |
| --- | --- |
| 정답 정의 | 논리 48 URL·양성 45요소·정상 22요소·복합 기법 11요소·기대 56건 |
| 기법 | HOMOGLYPH 14 / JAMO 13 / TRANSPARENT 14 / OFFSCREEN 15 |
| 주제 | 11범주 각각 양성≥4·정상≥2·네 기법 확인 |
| 새 컨텍스트 3회 | root / 저장소 접두 경로 / 단독 생성물 각각 실제 entry-only BFS 48페이지·raw URL 112개·최단 깊이 8 |
| 깊이·중복 | 깊이 5~8 페이지 22개·정확히 8인 페이지 4개·깊이 6~8 양성 22/정상 11요소. 쿼리 순서 동등 쌍 6개·fragment 변형 58개 |
| 전수 DOM | 총 144방문·201요소 감사. 각 실행 67요소의 유일 selector·정확한 textContent/codepoints·최종 computed styles·조상·local/root bounds·프레임 확인 |
| 유한 URL | raw 112개 모두 HTTP 200, 세 경로 합계 336회 응답 확인. iframe src를 상위 페이지 BFS seed로 사용하지 않음 |
| 프레임 | 최대 중첩 6·방문당 최상위 포함 최대 11문서. 실행별 embedding 39·resource URL 36·srcdoc 2, 내부 양성 15/정상 6 |
| 규모·조상 | 큰 body 4,616 / 4,561 / 4,537요소, 전체 방문 문서 합계 최대 4,740요소. 24래퍼 시험 4페이지·큰 페이지마다 앞/중간/끝 배치 확인 |
| 조건 결합 | 실제 증거가 있는 조건 2개 이상 양성 20개·4개 이상 13개 |
| 시간 관찰 | 대상 최상위 DCL 기준 최소 3,500ms·안정 300ms·최대 5,000ms 준수. 두 late 페이지 3,000~4,200ms의 7회 유한 갱신 확인 |
| late 실제 시각 | 세 경로의 마지막 갱신 4,202.2~4,216.6ms, 안정화 종료 4,517.7~4,539.3ms. T03은 초기 원문뿐 아니라 최종 CSS 확정도 확인 |
| 비교·다운로드 | lab 3경로 완전정답 각각 TP56/FN0/FP0. dashboard root 21입력·prefix 5입력, 합계 실제 비교 26회·파일 거부 3회·다운로드 12개 해시 대조 |
| UI | 검색·초기화·빈 결과·페이지 이동·6개 쿼리 구분·필터 불변·복사·JSON 저장 확인. 1440/390/320을 포함한 29회 뷰포트 확인·32장 캡처 중 18장 직접 시각 검토 |
| 내부 모바일 | 정상 N16의 4중첩 프레임을 추가 확인. 320px에서 내부 너비 230/196/162/128과 각각 scrollWidth 일치·원문 가독성 유지 |
| 오류·보존 | 관찰한 페이지/console/HTTP 오류·POST·외부 요청 0. 기존 배포 894파일·reference 33파일은 기준 Git blob과 바이트 동일 |

프레임·시간·스타일의 루트는 실제 탐지 대상 문서입니다. lab/dashboard의 화면 밖 host iframe을 은닉 조상으로 포함하지 않았습니다. opacity에 새 임계값을 부여하지 않았고, leaf 폰트·iframe 안의 음수 좌표·실제 불투명 조상 배경 동색을 구분했습니다. 정상 하단·접근성·접힘·반투명 콘텐츠는 정답 기법을 늘리지 않았습니다.

비교 입력은 누락, 정상/기법 불일치/미해결 FP, 필드 오류, 빈 결과, 유일·동등·모호 CSS, 중복, query 값/순서/fragment, srcdoc·깊은 프레임·동일 src 별도 인스턴스, 4.2초 최종 원문, 긴 분할 원문, JSON/BOM/UTF-8 거부를 포함합니다. 화면 필터 후 전체 지표·주제표·다운로드한 전체 보고서가 유지됩니다. 보고서의 원본 File SHA-256과 UTF-8(JSON.stringify(manifest)) SHA-256을 독립 대조했습니다.

## 검증 기준과 증거

- 기준 HEAD: 5c5ee4469d2487ee2087510e38cb5f95f49cbda5. 최종 검증 커밋 SHA가 아닙니다.
- 실행 코어 1,208파일의 시작·종료 파일 맵과 SHA-256 aggregate가 동일: 6b3f922093c25fdd74f6684b5e79036792cb5b983e4a98f47f977d09bb057af1.
- 코어 맵은 source/공통 엔진/validator/배포 파일과 site12 단독 생성물을 포함하며 Markdown·검사 산출물을 제외합니다. DOM 실행은 다른 브라우저 검사 없이 단독 수행했고, UI 실행 일부는 총괄의 읽기 전용 공통 회귀와 병행했습니다.
- [통합 독립 보고서](../../tmp/verification/stress-site-12/independent-all-report.json), [3회 DOM·시간 원본](../../tmp/verification/stress-site-12/independent-dom-report.json), [UI 원본](../../tmp/verification/stress-site-12/independent-ui-report.json).
- [내용 해시](../../tmp/verification/stress-site-12/content-hashes.json), [snapshot](../../tmp/verification/stress-site-12/verification-snapshot.json), [실제 시각검토 목록·해시](../../tmp/verification/stress-site-12/visual-review.json), [4중첩 정상 모바일](../../tmp/verification/stress-site-12/normal-nested-visual-report.json).
- 독립 검사 소유 브라우저·서버는 모두 종료했습니다. 진행 중이던 총괄 검사는 해당 실행의 별도 증거를 따릅니다. tmp 증거는 Git 제외 로컬 파일입니다.

## 초기 후보와 수정 이력

초기 독립 관찰기의 srcdoc 감시 누락과 DCL 리스너 안의 강제 레이아웃 간섭을 보완하고, 실제 문서에 observer가 없으면 STABLE을 허용하지 않도록 했습니다. 미확인 srcdoc DCL은 null로 유지합니다. 조상 배경 동색 집계 누락과 캡처의 class/id 오기도 하네스에서 수정했습니다. 초기 FAIL·동결 대기 INTERRUPTED 후보와 재현 시각은 [하네스 이력](../../tmp/verification/stress-site-12/harness-adjustments.json)에 구분 보존했습니다.

실제 반복 구조가 없는 T01/T02/T03/T12의 부가 repeated-selector 주석은 총괄이 제거하고 명세·정답 메타데이터를 동기화했습니다. 원문·기법·selector·대상 DOM·expected-result는 유지됐습니다. 최종 PASS는 이 정정 이후 새 snapshot의 세 fresh 관측과 새 UI 실행만으로 판정했습니다.

## 총괄 별도 게이트 결과

<!-- COORDINATOR_RESULTS -->

- 생성물이 없는 site12 빌드와 재빌드: 179개 생성 파일의 바이트 동일. 전체 등록 사이트의 빌드·정적 검사와 단위 테스트 20개 PASS.
- 고유 명령 npm run verify -- 12: 새 컨텍스트 3회 각각 실제 BFS 48페이지/raw 112개/67요소, 깊이 8·query·원문·최종 상태·대형 문서·프레임 전수 확인. 검색·페이지 이동·1440/390/320·검증실 연결을 포함해 오류 0으로 종료했습니다. 총괄 공통 회귀와 병행한 실행이며 앞의 독립 DOM 3회는 단독 실행입니다.
- 공통 대시보드: node source/verify-dashboard.mjs all --prefix --baseline=5c5ee4469d2487ee2087510e38cb5f95f49cbda5 --concurrency=2. 24/24환경·입력 1130건·채점 보고서 다운로드 48회·화면 폭 검사 72회 PASS, 실패 0. 사이트1 legacy와 전체12사이트의 기존/새 카테고리·스냅샷 동작을 확인했습니다.
- 공통 검증실: node source/verify-deployment.mjs all --baseline=5c5ee4469d2487ee2087510e38cb5f95f49cbda5 --concurrency=2. 36/36환경(일반/접두/단독), 비교 입력 1299건, 전수 DOM 감사 36회/2280요소, 화면 폭 검사 108회 PASS. 실패 0.
- 실제 검증실 링크 도달 버튼: root/prefix 각각 visited48/reachable48/total48/maxDepth8/missing[]/errors[]. export된 crawl 함수와 버튼 연결·첫 seed가 entry 하나임을 확인했고, 시작/종료 코어 1,117파일의 해시가 동일했습니다.
- 기존 대상 배포 894파일과 reference 33파일, legacy·comparison-report·의존성 파일은 바이트 보존. modern 엔진의 score 판정 본문도 기준 Git과 일치합니다. 새 target84파일에는 정답/기법/caseId 주석이 없습니다.
- 총괄도 새 홈1440/390과 완료 대시보드320 이미지를 직접 확인했습니다. 실행 산출물은 tmp 규칙으로 Git 제외합니다.

[기본 브라우저 보고서](../../tmp/verification/test-site-12/basic-browser-report.json) · [대시보드 회귀](../../tmp/verification/dashboard/dashboard-all-prefix-report.json) · [검증실 회귀](../../tmp/verification/deployment-all-report.json) · [실제 도달 버튼](../../tmp/verification/stress-site-12/lab-crawl/lab-crawl-report.json) · [총괄 화면 확인](../../tmp/verification/stress-site-12/coordinator-visual-review.json)

최종 커밋은 이 검증의 현재 파일 SHA-256 맵과 Git index/blob tree를 대조한 뒤 생성합니다. 자기 자신을 포함하는 커밋 SHA는 이 문서에 하드코딩하지 않고 PR과 로컬 Git 메타데이터의 verifiedCommitSha에 기록합니다. 기준 HEAD와 최종 검증 커밋은 구분합니다. PR은 main 대상이며 병합·자동 병합하지 않고, GitHub Pages main 배포 및 실제 원격 사이트 확인은 리뷰·병합 후 별도 절차입니다.

## 미실행·한계

별도 Java 크롤러의 Worker1/4, 모델 탐지·수집 성능은 실행하지 않았습니다. 별도 저장소의 출력 격리와 외부 네트워크 차단 조건이 확인되지 않았으며, 브라우저 fixture 검증으로 이를 대체하지 않았습니다. FN만으로 URL 미발견·동적 누락·모델 실패를 추정하지 않습니다. 검증자는 빌드·Git 변경·push·PR·병합·운영 배포를 실행하지 않았습니다. 최종 커밋 내용 연결과 원격 상태 확인은 총괄의 후속 범위입니다.
