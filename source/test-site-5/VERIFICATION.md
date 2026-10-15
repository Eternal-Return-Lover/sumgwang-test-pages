> 경로 이관 검증 **PASS** (전체 30조건·실제 DOM·비교·화면 검사). 경로 통일: 현재 프로젝트는 `source/test-site-5/`입니다. 아래는 제작 당시 검증 기록이며, 당시 증거·snapshot은 `artifacts/history/`에 원본 그대로 보존합니다. 과거 해시는 현재 경로의 재검증 결과가 아닙니다. 이번 이관 검증은 [공통 경로 검사 결과](../test-site-10/artifacts/path-migration-report.json)와 `artifacts/path-migration-snapshot.json`을 참조합니다.

# 사이트 5 실제 독립 검증 기록

검증일: 2026-10-15 (Asia/Seoul). 상태: **로컬 독립 검증 PASS**.

Node.js 24.14.0, Playwright 1.63.0과 설치된 Chrome headless로 실제 HTTP 페이지·DOM·iframe·다운로드·파일 업로드를 검사했다. 제작 담당자와 별도의 verifier가 실행과 화면을 확인했다. 기준 HEAD는 `043fadc85a486521c23da1ee1da215916ce6ba89`이며 검사 당시 사이트 5는 미커밋 상태였다. 최종 커밋 연결·push·PR·병합은 코디네이터가 별도로 처리한다.

이 기록은 테스트 사이트와 검증실의 자체 동작 확인이며 실제 탐지기 성능이나 공모전 공식 점수를 의미하지 않는다.

## 수량과 정적 검사

| 구분 | 실제 결과 |
| --- | ---: |
| 콘텐츠 시나리오·고유 URL | 52: 고정 46 + 쿼리 6 |
| 광고 포함 URL / 정상 URL | 40 / 12 |
| 광고 요소 / 정상 대조 요소 | 46 / 12 |
| 전수 DOM 검사 요소 | 58 |
| 기대 findings | 60 |
| HOMOGLYPH / JAMO / TRANSPARENT / OFFSCREEN | 13 / 14 / 17 / 16 |
| 실제 콘텐츠 HTML / 구조 HTML / 프레임 HTML / lab HTML | 47 / 13 / 10 / 1 |
| 검증실 포함 전체 HTML / 대상 HTML | 71 / 70 |
| 검사한 로컬 링크·자산·프레임 참조 | 909 |
| 대상 전용 배포 파일 | 76 |
| 목록 | 51행, 11행씩 5페이지, 마지막 7행 |

`node source/manage.mjs check`로 사이트 1~5의 문법·참조·manifest·배포 파일·루트 목록을 검사했다. 모바일 일정 수정 후 재빌드된 최종 파일로도 전체 검사에 통과했다. `node --test source/site-tools.test.mjs`의 공통 회귀 5개도 통과했다. 원본 정의·보관용 정답표·lab manifest의 원문·기법·위치·프레임과 수량이 일치한다.

대상 76파일의 HTML class/id/title 속성 1,551개에서 정답 사례번호·기법코드 노출은 0개였다. 대상에서 source/lab/정답으로 연결되는 링크가 없고 대상 폴더에 lab/reference/src/scripts가 없다. 실제 DOM의 HOMOGLYPH 13건·JAMO 14건 원문 문자도 별도로 확인했다.

## 실제 브라우저 검사

| 검사 | 실제 결과 |
| --- | --- |
| 홈 1440×1000 / 390×844 | 구역도·교육 달력·관측표·순환 안내 렌더링, 가로 넘침 없음, 스크린샷 시각 확인 |
| 관측 목록 | 5페이지·11행씩·마지막 7행, 깊은 기록 1개는 목록에서 제외 |
| 제목 검색·빈 결과·초기화 | 검색 결과·빈 안내·입력 및 페이지 상태 복원 정상 |
| 생태 구역 탐색 | 갈대습지·실개천·순환정원 3구역, 데스크톱·모바일 화면 확인 |
| 교육 일정·자원순환 안내 | 각 3개 항목, 데스크톱·모바일 렌더링 확인 |
| 쿼리 분기 | station 3값 × season 2값 = 6본문, 제목·원문 각각 확인 |
| 쿼리 순서·fragment / 알 수 없는 값 | 같은 본문 대응 / 자료 없음 안내 |
| 400·1800·2800ms 광고 의견 / 900ms 정상 상태 | 초기 없음, 고정 지연 후 해당 원문 생성 |
| T30 지연 프레임·내부 의견 | 외부 iframe 900ms + 마지막 프레임 의견 400ms, 명목 합계 1300ms 확인 |
| 1·3단계 iframe 전수 | 부모 URL·실제 src·유일 선택자·마지막 프레임 원문 일치, 정상 프레임 포함 |
| 깊은 기록 발견 | 직전 링크 900ms 지연, 실제 링크 클릭으로 T34 도달 |
| 독립 전수 DOM 기록 | 광고 46·정상 12 = 58/58, 유일 선택자·원문·computed style·조상·bounds 통과 |
| 검증실 자체 DOM 검사 | 58/58, 실패 사례 0 |
| 검증실 시작 URL 순회 | 고유 문서 65개, 대상 52/52, 최대 깊이 5, 누락·로딩 오류 0 |
| 별도 독립 BFS | lab crawl helper 없이 Playwright 큐로 65개 방문·52/52 도달·최소 깊이 5 재확인 |
| 검증실 필터·검색 | 전체 58·정상 12·4종 기법 필터·사례 검색 통과 |
| 사례 상세 표시 | 3단계 경로·1300ms·정규화 전 원문 확인 |
| 주소 복사·정답표 다운로드 | 실제 clipboard 주소 확인, reference/ground-truth.json과 내용 일치 |
| 예상 결과 다운로드 | 60건, 실행 배포 주소 반영, UTF-8 BOM 없음 |
| 공개 대상 lab·manifest | 모두 HTTP 404 |
| 검증실 모바일 | 가로 넘침 없음, 통계·필터·사례·업로드 화면 확인 |
| 단독 dist | 전체 정답 TP60/FN0/FP0·DOM58/58·BFS52/52·깊이5 |
| 저장소 접두 경로·두 자리 번호 | 가상 /sumgwang-test-pages/test-site-10/에서 TP60/FN0/FP0·DOM58/58·lab404 |
| 브라우저 JavaScript 오류 | 최종 공식 검사 0, 독립 보강 0 |

접두 경로 시험은 같은 배포본을 브라우저 요청에서만 임시 매핑했다. 실제 원격 배포나 사이트 10 제작을 수행한 것은 아니다. 검사 서버는 운영체제의 빈 포트를 사용하므로 예시 파일의 localhost 주소는 당시 실행 주소다.

홈·목록·구역·교육·자원순환·검증실 데스크톱/모바일과 관측표 게시글 모바일 화면을 실제로 시각 검사했다. 발견한 교육 일정 가독성 문제는 아래처럼 수정·재검증했으며, 최종 화면에는 겹침·심한 제목 압축·가로 넘침 문제가 남아 있지 않다.

## 결과 비교 시험

최종 `npm run verify`의 23개 비교 입력에서 예상과 실제가 모두 일치했다.

| 입력 | 예상 및 실제 |
| --- | --- |
| 완전한 정답 | TP60 / FN0 / FP0 / 필드 오류0 / 중복0 |
| 한 건만 제출 | TP1 / FN59 / FP0 |
| 정상 요소 오탐 | TP0 / FN60 / FP1 |
| 다른 ID·CSS·fragment로 동일 검출 중복 | TP1 / FN59 / FP0 / 중복1 |
| 동일 요소의 다른 CSS와 원문 | TP1 / FN59 / FP0 |
| 모호한 p 선택자 | TP0 / FN60 / FP1 |
| 필수 evidence_text 누락 | TP0 / FN60 / 필드 오류1 |
| 잘못된 JSON | 파싱 실패 안내 |
| BOM 포함 JSON | BOM 제거 안내 |
| 쿼리 순서·fragment 변경 | TP1 / FN59 / FP0 |
| 상대 iframe src | TP1 / FN59 / FP0 |
| 고유 ID 중복 | TP1 / 필드 오류1 |
| 일반 안내의 동일 요소 오탐 중복 | TP0 / FN60 / FP1 / 중복1 |
| 다른 계절 쿼리의 다른 기법 | TP0 / FN60 / FP1 |
| HTTP/HTTPS·끝 슬래시 | TP1 / FN59 / FP0 |
| meta.entry_url 배열 타입 | 진입 URL 필드 타입 오류 안내 |
| 유효한 meta와 빈 findings | TP0 / FN60 / FP0 / 필드 오류0, 분모 0 비율 계산 불가 |
| 기존 사이트 1 전체 정답 | TP40 / FN0 / FP0 |
| 기존 사이트 2 전체 정답 | TP61 / FN0 / FP0 |
| 기존 사이트 3 전체 정답 | TP68 / FN0 / FP0 |
| 기존 사이트 4 전체 정답 | TP50 / FN0 / FP0 |
| 단독 dist 전체 정답 | TP60 / FN0 / FP0 / 필드 오류0 / 중복0 |
| 두 자리 번호·접두 경로 전체 정답 | TP60 / FN0 / FP0 / 필드 오류0 / 중복0 |

계절 값만 바꿔도 목적지에 같은 기법이 적용되어 있으면 유효한 위치·기법 검출이다. URL 변경만으로 모든 입력을 FP라고 가정하지 않고, 별도 실제 업로드 6방향으로 확인했다.

| 입력의 출발·목적지 / 제출 기법 | 실제 결과 |
| --- | --- |
| Q01 봄습지 → Q04 가을습지 / JAMO | TP1 / FN59 / FP0 |
| Q02 봄실개천 → Q05 가을실개천 / OFFSCREEN | TP0 / FN60 / FP1 |
| Q03 봄정원 → Q06 가을정원 / HOMOGLYPH | TP0 / FN60 / FP1 |
| Q04 가을습지 → Q01 봄습지 / JAMO | TP1 / FN59 / FP0 |
| Q05 가을실개천 → Q02 봄실개천 / HOMOGLYPH | TP0 / FN60 / FP1 |
| Q06 가을정원 → Q03 봄정원 / TRANSPARENT | TP1 / FN59 / FP0 |

허용되지 않은 기법 코드·is_violation 문자열 타입·공백 evidence_text는 각각 필드 오류 1건이었다. 선언된 elapsed_sec 1800은 초과 표시가 없고 1801은 30분 초과를 표시했다. 실제 탐지기의 실행 시간을 측정한 결과는 아니다. 독립 보강 실행의 외부 전송 요청·JavaScript 오류는 각각 0개였다.

## 발견·수정·재검증

첫 시각 검사에서 390px 교육 일정의 날짜·제목·장소가 한 flex 줄에 남아 제목이 매우 좁아졌고 짧은 제목까지 3줄 이상으로 분절됐다. `education-mobile-before-fix.png`와 `visual-failure-report.json`에 재현을 보존했다.

구현 담당자가 800px 이하 일정만 날짜 73px + 내용 minmax(0,1fr)의 2열 grid로 변경하고 장소를 두 번째 열의 별도 행에 배치했다. 데스크톱 CSS·사례·정답·공통 도구·기존 사이트는 변경하지 않았다. verifier의 초기 내용 snapshot과 대조해 변경은 신규 template CSS·dist CSS·test-site-5 CSS 세 파일뿐임을 확인했다.

재빌드 후 1440·390·320px을 측정·촬영했다. 모바일 제목 칸은 390px에서 266px, 320px에서 196px이고 날짜와 겹치지 않으며 장소는 내용 아래에 있다. 제목 가독성이 정상이고 가로 넘침·JS 오류가 없다. 수정 전후 첫 실행은 혼합될 수 있어 보존했으며, 최종 CSS로 공식 전체 검사를 처음부터 다시 실행했다. 최종 종료 코드 0, 비교23종·DOM58/58·링크52/52·회귀·단독·접두 검사가 모두 통과했다.

## 회귀·재현성·내용 snapshot

- 기준 HEAD 대비 기존 사이트 1~4의 source·test-site 폴더 diff는 없다. 최종 실제 전체 정답 회귀도 TP40/61/68/50, 각각 FN0/FP0이다.
- 코디네이터가 최종 생성 160파일을 두 번 빌드해 내용 일치 해시 `4feea1457bfee9477888e80e1a5939fd7c6033493e6adeca73c104c6749d8936`를 확인했다. verifier는 빌드를 실행하지 않고 생성·정답·배포 일치와 수정 범위를 독립 확인했다.
- 검증 대상 소스·정답·dist·배포·공통 파일 174개의 개별 SHA-256과 기준 HEAD는 artifacts/history/verification-snapshot.json에 기록했다. 코디네이터가 최종 커밋 내용과 일치를 확인해 verifiedCommitSha에 연결해야 한다. 내용 snapshot은 커밋 SHA가 아니다.
- UTF-8 디코딩·BOM 부재와 Git diff 공백 검사를 확인했다. 기존 구조를 유지했고 release·ZIP을 추가하지 않았다. README·REQUIREMENTS의 URL/요소/기법/물리 파일 수량은 실제와 일치한다.

## 증거와 한계

- artifacts/history/browser-report.json: 최종 CSS 기준 공식 비교23종·전수 DOM·프레임·스타일·BFS·회귀·경로 검사
- artifacts/history/first-run-browser-report.json: 수정 전후 혼합 가능성이 있는 첫 실행, 최종 판정용이 아님
- artifacts/history/independent-browser-report.json: clipboard·정답 다운로드·별도 BFS·쿼리 6방향·필드/시간/네트워크 보강
- artifacts/history/independent-static-report.json: 대상 비노출·문자 원문
- artifacts/history/visual-failure-report.json·education-mobile-before-fix.png: 수정 전 화면 실패
- artifacts/history/visual-retest-report.json·education-390px/320px-after-fix.png: 수정 후 실제 치수·화면
- artifacts/history/visual-repair-files.json·verification-snapshot.json: 수정 범위·최종 내용 해시
- portal/list/zones/lab·education/resources 데스크톱/모바일 PNG, lab-top·article-table-mobile PNG
- expected-result 및 root/prefix/prior-site 예상 결과, 독립 다운로드 정답표

남은 검증 실패는 없다. 실제 온라인 배포·Git push·PR 병합은 이 독립 검증에서 수행하지 않았다. 동일 출처 정적 페이지와 고정 지연을 시험했으며 교차 출처 iframe·로그인·리다이렉트·CAPTCHA·Shadow DOM·이미지 OCR·실제 탐지 모델과 대규모 성능은 시험하지 않았다. 검증실 분리는 접근 제어가 아니므로 비공개 정답 평가에는 대상 폴더만 제공해야 한다.
