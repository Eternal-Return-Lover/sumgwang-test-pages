# 테스트 사이트 작업 규칙

## 범위와 공통 원칙

- 공공 웹사이트 불법광고 탐지 도구의 모의 테스트 사이트 저장소다. 기관·인물·광고는 합성 자료이며 공식 심사 환경·점수라고 표시하지 않는다.
- 새 사이트는 사용자의 명시적 시작 요청 후에만 만든다. 기본 배치는 새 사이트 1개이며 실행 수량은 최신 요청을 따른다.
- 제작 명세는 source/test-site-request.md를 참조한다. 최신 사용자 요청이 우선하며 release 폴더·ZIP은 만들지 않는다.
- AGENTS.md, .codex/agents/, 제작 프롬프트는 공용으로 Git 관리한다. 별도 파일에 통째로 복제하지 않는다.
- 기존 사이트의 내용·원문·정답·기법·쿼리·프레임·지연은 관련 변경이 요청되지 않으면 보존한다.

## 최소 파일 구조

- test-site-N/: 탐지 대상 배포본. 검증실·정답표·소스 링크를 넣지 않는다.
- source/test-site-N/src/: 사례 정의와 사이트 고유 템플릿.
- source/test-site-N/scripts/: 고유 생성기·브라우저 검사. 공통 도구를 복제하지 않는다.
- source/test-site-N/lab/: 검증실 HTML과 필요한 테마만 둔다.
- source/test-site-N/reference/: ground-truth.json, counts.json, expected-result.json을 빌드로 생성해 함께 관리한다.
- index.html·assets/hub.css: 탐지 대상·검증 대시보드로 연결하는 정적 허브. index.html은 source/sites.json과 renderIndex로 생성하며 직접 수정하지 않는다. 등록의 description은 선택 사항이며 제목·설명을 HTML escape한다.
- validator/: 같은 출처에서 모든 등록 사이트를 검증하는 정적 공통 대시보드. source/sites.json을 읽으며 개별 사이트 번호를 하드코딩하지 않는다.
- source/shared/: 공통 검증 엔진·스타일·comparison-report.js 진단 API. 사이트 1의 기존 비교 동작은 legacy 엔진으로 보존한다.
- source/sites.json, manage.mjs, site-tools.mjs, serve.mjs, check.mjs, verify*.mjs: 공통 등록·빌드·실행·검사.
- tmp/build/test-site-N/: 단독 실행 가능한 전체 생성물. tmp/verification/: 보고서·다운로드·스크린샷·snapshot. 모두 Git에서 제외한다.
- 사이트별 dist/, artifacts/, package.json, node_modules/, 중복 실행기·서버·정적 검사를 추가하지 않는다.
- 루트 package.json·package-lock.json 하나로 관리한다. 런타임 의존성은 없으며 Playwright는 브라우저 검사에 필요한 공통 개발 의존성이다.
- README는 사이트·소스·검증실 링크와 필수 명령 위주로 간결하게 유지한다. 상세 명세는 REQUIREMENTS.md, 최신 검증 요약은 VERIFICATION.md에 기록한다.
- 과거 산출물을 소스에 쌓지 않는다. 이전 버전은 Git 이력으로 조회하며 새 검사 PASS로 재사용하지 않는다.

## 검증 방식

- 비교는 같은 출처에서 실제 DOM·iframe을 열어 수행한다. 선택자 문자열만 비교하지 않고 같은 유일 요소인지 확인한다.
- 쿼리 값 보존, 파라미터 순서·fragment 중복, iframe 경로, 고정 지연, 중첩 기법, 정상 대조군을 유지한다.
- HOMOGLYPH·JAMO 원문을 정규화하지 않는다. TRANSPARENT·OFFSCREEN은 요소와 조상 스타일·bounds를 확인한다.
- reference/expected-result.json은 package.json의 publicBaseUrl과 고정 합성 시각을 쓰는 재현 가능한 정답 예시다. 실제 탐지 결과가 아니다.
- 검증실 다운로드는 현재 접속 주소를 사용한다. canonical 예시와 로컬·접두 경로의 주소를 혼동하지 않는다.
- 공통 대시보드 validator/와 사이트별 검증실을 대상 경로 밖에 유지한다. 대시보드는 같은 출처의 검증실을 1440×1000 iframe으로 열고 validationLabReady/compare API를 사용한다. 결과 HTML을 긁거나 비교 알고리즘을 복제하지 않는다.
- 카테고리 주석이 있는 새 사이트는 categoryProfile: all-11-v1과 양성 primaryCategory/annotationReason, 정상 relatedCategory/normalReason을 정의→manifest→집계→진단으로 보존한다. 11개 범주별 양성≥4·정상≥2·네 기법, 전체 복합 요소≥11을 검사한다. 기존 무주석 정답은 변경하지 않는다.
- 카테고리는 정답의 주제이며 제출 JSON은 기존 여섯 finding 필드와 TOPIC을 유지한다. categorySummary와 주제 필터는 기존 판정·전체 지표를 바꾸지 않는다. 정상·미해결 오탐은 UNASSIGNED이며 후보 목록에서 주제를 추정하지 않는다. 분류 정확도는 평가 미지원이다.
- API는 status, metrics, rates, diagnostics, meta를 반환한다. 파일 전체 거부는 metrics:null이며 TP0/FN전체로 표시하지 않는다. 상세 진단은 TP/FN/FP/필드 오류/중복을 구분하고 기대값·제출값·이유를 제공한다.
- 채점 보고서 내보내기는 완료된 동일 실행의 전체 API·실제 엔진 manifest·원본 File을 스냅샷으로 묶고 출처/해시를 보존한다. 필터·화면 제한은 적용하지 않는다. 새 입력·사이트·재비교·오류는 이전 저장 대상을 폐기하며 내보내기 실패는 유효한 채점 자체를 바꾸지 않는다. 상세 계약은 validator/README.md를 따른다.
- 진단의 확정 정답과 후보·미해결을 구분한다. FP/invalid/duplicate를 콘텐츠 라벨로 변환하지 않고 미방문·미제출 대조군의 TN을 추정하지 않는다. 원본/정답/채점 정보는 향후 학습 입력과 구분한다.
- TP/FN은 기법별 기대 단위, FP/필드 오류는 제출 항목, 중복은 통합 정보다. 이를 단일 실패 합계로 중복 집계하지 않는다. 정밀도 TP/(TP+FP)와 기존 필드 오류 반영 비율 TP/(TP+FP+invalid)을 구분한다.
- 실제 DOM 접근용 검증실 iframe을 display:none, 0크기, cross-origin 또는 sandbox로 바꾸지 않는다. 사이트 1의 필드 검사·기대셋 밖 페이지·iframe 해석 차이를 의도 없이 통일하지 않는다.

## 역할

- Main coordinator: 기획·번호, 공통 파일·문서, 의존성·빌드·배포 동기화, Git·완료 판정 담당.
- site_builder: .codex/agents/site_builder.toml을 읽고 배정된 사이트 원본·고유 검사 또는 명시적으로 배정된 대시보드 UI 범위만 구현. 공통 도구·엔진·빌드·배포본·Git은 메인이 담당한다.
- site_verifier: .codex/agents/site_verifier.toml을 읽고 생성물과 실제 DOM을 독립 검사. tmp/verification/와 배정된 검증 요약만 작성하고 구현·정답·빌드·Git은 변경하지 않는다.
- 하위 에이전트 이름은 영어 snake_case를 사용한다. 자동 역할 발견이 안 되면 역할과 소유 범위를 명시적으로 전달한다.

## 명령과 완료 기준

저장소 루트에서 실행한다. 검사에 숨은 자동 빌드를 넣지 않는다.

- npm ci: 개발 의존성 설치.
- npm run build [-- N]: 생성·정답·단독 패키지·대상 배포본 갱신. 메인만 수행한다.
- npm run check: 전체 문법·링크·정답·배포 파일·루트 목록 확인.
- npm test: 공통 코드·경로·정답 생성 회귀 검사.
- npm start: 저장소 전체를 한 서버에서 제공.
- npm run verify -- N: 해당 사이트의 실제 브라우저 검사. 단독 생성물이 먼저 있어야 한다.
- npm run verify:dashboard: 공통 대시보드의 업로드·비교·상세 진단·선택·반응형·접두 경로 독립 브라우저 검사.
- node source/verify-deployment.mjs all: 모든 검증실의 기본·접두·단독 경로 검사.

완료하려면 실제 실행한 결과로 다음을 확인한다.

- 대상·검증실 분리, reference 수량·원문과 생성물·배포본 일치.
- 양성·정상 전수의 유일 선택자·원문·스타일·bounds·프레임·지연, 시작 URL에서 모든 대상 도달.
- 검색·필터·페이지네이션·빈 결과, 정답·누락·오탐·중복·선택자 동등성·모호성·필드·JSON/BOM·시간 경계 비교.
- 데스크톱 1440×1000과 모바일 390/320의 화면·넘침·JS 오류, 단독·저장소 접두 경로.
- 생성물이 없는 상태의 빌드, 재빌드 동일성, 해당 사이트 외 변경 없음, UTF-8/BOM·diff 공백.
- 루트 허브의 등록 수·카드·사이트/검증 링크, JavaScript 없는 접근, 1440·768·390·320 화면·키보드·접두 경로를 확인한다. 탐지기에는 test-site-N/ 주소를 안내한다.
- 대시보드는 자동/명시적 사이트 선택·주소 불일치, 파일 전/중/완료/오류·리셋, 전체 진단·필터·검색·다운로드, 새 등록 확장과 기존 엔진 호환을 확인한다.
- GitHub Pages는 main / 루트 배포다. PR과 로컬·모의 접두 검사를 실제 운영 배포로 표시하지 않는다. 병합 보류 시 구현·검증·PR을 완료하고 병합 후 배포 절차와 URL을 보고한다.
- README·명세·검증 요약과 실제 결과 일치. 미실행·실패·공식 점수를 성공으로 표시하지 않는다.

## Git·순차 제작·재개

- 먼저 실제 작업 트리·진행 기록과 최신 origin/main을 확인한다. 기존 변경을 stash/reset/clean/커밋하지 않는다.
- 작업 유형/영문 소문자-하이픈 이름의 새 브랜치를 사용한다. 새 사이트는 feat/test-site-N, 구조 정리는 refactor/...로 만든다.
- 한 번에 한 사이트를 기획 → 구현 → 메인 빌드 → 독립 검증하며 실패하면 수정·재검증한다.
- 필요한 원본·정답·배포본·공용 변경만 stage한다. tmp/·의존성·개인 파일은 포함하지 않는다.
- 검증 내용 해시를 로컬 기록에 남기고 최종 커밋 내용과 대조한다. 검증 기준 HEAD와 최종 verifiedCommitSha를 구분한다.
- 커밋·push·main 대상 한글 PR은 해당 요청 범위에서 수행한다. 최신 사용자 지시의 메시지·브랜치 규칙을 우선한다.
- PR 병합·자동 병합은 명시적 승인 범위와 실제 필수 검사·리뷰를 모두 충족할 때만 수행한다. 병합 보류 요청을 유지하고 보호 규칙·force push로 우회하지 않는다.
- 순차 배치는 이전 사이트의 원격 main 반영과 로컬 main fast-forward를 확인한 뒤 다음 사이트를 시작한다.
- .codex/agents/workflow-state.json은 공용 초기 템플릿이다. 실제 상태는 git rev-parse --git-path test-site-workflow/state.json으로 구한 Git 메타데이터에 원자적으로 기록한다.
- 요청·완료 수, 번호·브랜치·단계·명세, 실패·수정·검사 증거, baseline·내용 해시·verifiedCommitSha, 원격 SHA·PR·병합 SHA·다음 조치를 보존한다.
- 원격 결과가 불명확하면 실제 PR·main을 조회해 중복 실행을 피한다. 인증·권한·리뷰로 막히면 정확한 상태를 보고한다.
- 기존 Git credential helper를 사용하며 토큰은 메모리에만 두고 출력·파일 저장·URL 삽입하지 않는다. 하위 에이전트도 실제 권한을 상속하며 우회 설정을 넣지 않는다.
