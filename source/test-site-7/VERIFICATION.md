> 경로 이관 검증 **PASS** (전체 30조건·실제 DOM·비교·화면 검사). 경로 통일: 현재 프로젝트는 `source/test-site-7/`입니다. 아래는 제작 당시 검증 기록이며, 당시 증거·snapshot은 `artifacts/history/`에 원본 그대로 보존합니다. 과거 해시는 현재 경로의 재검증 결과가 아닙니다. 이번 이관 검증은 [공통 경로 검사 결과](../test-site-10/artifacts/path-migration-report.json)와 `artifacts/path-migration-snapshot.json`을 참조합니다.

# 사이트 7 실제 독립 검증 기록

검증일: 2026-10-15 (Asia/Seoul). 상태: **로컬 독립 검증 PASS**.

Node.js 24.14.0, Playwright 1.63.0과 설치된 Chrome headless로 실제 HTTP 페이지·DOM·iframe·다운로드·파일 업로드를 검사했다. 구현 담당자와 별도의 verifier가 실제 실행과 화면을 확인했다. 기준 HEAD는 `77acc2915666d74f75862bdca5d51774b816408f`이고 사이트 7은 검사 당시 미커밋 상태였다. 최종 커밋 연결·push·PR·병합은 코디네이터가 별도로 처리한다.

이 기록은 테스트 사이트와 검증실 자체 검사이며 실제 탐지기의 성능이나 공모전 공식 점수를 의미하지 않는다.

## 수량과 정적 검사

| 구분 | 실제 결과 |
| --- | ---: |
| 콘텐츠 시나리오·고유 URL | 60: 고정 54 + 쿼리 6 |
| 광고 포함 URL / 정상 URL | 44 / 16 |
| 광고 요소 / 정상 대조 요소 | 52 / 16 |
| 전수 DOM 요소 | 68 |
| 기대 findings | 71 |
| HOMOGLYPH / JAMO / TRANSPARENT / OFFSCREEN | 15 / 17 / 20 / 19 |
| 콘텐츠 HTML / 구조 HTML / 프레임 HTML / lab HTML | 55 / 15 / 9 / 1 |
| 전체 HTML / 대상 HTML | 80 / 79 |
| 로컬 링크·자산·프레임 참조 | 987 |
| 대상 전용 배포 파일 | 84 |
| 목록 | 59행, 10행씩 6페이지, 마지막 9행 |

`node source/manage.mjs check`로 사이트 1~7의 문법·참조·manifest·배포 파일·루트 목록을 독립 확인했다. `node --test source/site-tools.test.mjs` 공통 회귀 5개도 통과했다. 사례 정의·보관용 정답표·lab manifest의 원문·기법·위치·프레임과 수량이 일치한다.

대상 84파일의 HTML class/id/title 속성 1,722개에서 정답 사례번호·기법코드 노출은 0개였다. 공개 HTML/JS에서 기대 기법 enum·caseId/techniques·정답 자료 참조·기존 기관명을 찾지 못했다. 대상에서 source/lab/정답으로 연결되는 링크가 없다. 실제 DOM의 HOMOGLYPH 15건·JAMO 17건 원문 문자도 확인했다.

## 실제 브라우저 검사

| 검사 | 실제 결과 |
| --- | --- |
| 홈 1440×1000 / 390×844 | 접근 경로·준비 순서·서비스·자료 목록 정상 렌더링, 가로 넘침 없음, 시각 확인 |
| 목록·검색·빈 결과·초기화 | 6페이지·10행씩·마지막 9행, 검색과 입력·페이지 상태 복원 정상 |
| 서비스 목차 | care/learning/access 3서비스, 성인·어르신 링크 |
| 쿼리 분기 | program 3값 × audience 2값 = 6본문, 서로 다른 제목·원문 확인 |
| 쿼리 순서·fragment / 알 수 없는 값 | 같은 본문 대응 / 자료 없음 안내 |
| 광고 지연 800·1200·2200·2800ms / 정상 1600ms | 초기 없음, 지연 후 해당 원문 생성 |
| T30 지연 프레임 | 외부 1200ms + leaf 의견 800ms = 명목 2000ms |
| 프레임 전수 | 유일 선택자·실제 src·마지막 문서 원문·스타일 확인 |
| 깊은 기록 | 직전 링크 1200ms 지연, 실제 클릭으로 T34 도달 |
| 독립 전수 DOM 기록 | 광고 52·정상 16 = 68/68, 유일 선택자·원문·computed style·조상·bounds 통과 |
| 검증실 자체 DOM | 68/68, 실패 사례 0 |
| 시작 URL 순회 | 고유 문서 75개, 대상 60/60, 최대 깊이 6, 누락·로딩 오류 0 |
| 별도 독립 BFS | lab crawl helper 없이 Playwright 큐로 75개 방문·60/60·최소 깊이 6 재확인 |
| 아래쪽 정상 자료 N16 | y=1891.34375px, display:block, 정답 원문 존재; 단순히 첫 viewport 아래에 있음 |
| 필터·검색·주소 복사·다운로드 | 전체 68·정상 16·4기법·검색 정상, 실제 clipboard 주소와 정답표 내용 일치 |
| 예상 결과 | 71건, 현 실행 주소 반영, UTF-8 BOM 없음 |
| 공개 대상 lab·manifest | 모두 HTTP 404 |
| 검증실 모바일 | 통계·필터·사례·업로드 정상, 가로 넘침 없음 |
| 단독 dist | TP71/FN0/FP0·DOM68/68·BFS60/60·깊이6 |
| 접두 경로·두 자리 번호 | 가상 /sumgwang-test-pages/test-site-10/에서 TP71/FN0/FP0·DOM68/68·lab404 |
| 브라우저 JavaScript 오류 | 공식 전체 검사 0, 독립 보강 0 |

접두 경로 검사는 같은 배포본을 브라우저 요청에서만 임시 매핑했다. 실제 온라인 배포 또는 사이트 10 제작을 수행한 것이 아니다. 검사 서버는 빈 포트를 사용하므로 예시 파일의 localhost 주소는 당시 실행 주소다. 프레임 문서 로딩이 명목 지연에 추가될 수 있으며 실제 생성 전후 상태를 확인했다.

## 형제 iframe 독립 검사

T28과 E07은 같은 부모 URL의 서로 다른 프레임에 있다. T28은 `iframe.service-widget`의 1단계 자료이고 E07은 `iframe.related-widget → iframe.detail-widget`의 2단계 자료다. 실제 src는 `widgets/15946-1.html`과 `widgets/15946-side-1.html → widgets/15946-side-2.html`로 서로 다르다.

독립 실행에서 각 프레임 선택자가 1개이고 src가 정답표의 상대 경로를 현재 배포 주소로 계산한 값과 정확히 같음을 확인했다. 두 외부 iframe과 내부 프레임의 display는 block, opacity는 1이고 width/height가 양수다. 부모 자료함도 보인다. T28과 E07의 마지막 광고 요소만 display:none이며 원문은 DOM에 존재한다. E07의 실제 기법은 HOMOGLYPH+OFFSCREEN이다.

| 입력 | 예상과 실제 |
| --- | --- |
| E07의 올바른 2단계 경로·2개 기법 | TP2 / FN69 / FP0 / 필드 오류0 |
| E07_HOMOGLYPH를 T28의 다른 형제 leaf에 지정 | TP0 / FN71 / FP1 / 필드 오류0 |

이 결과는 공식 검사와 별도 독립 업로드에서 각각 재확인했다. 형제 프레임을 같은 부모 URL이나 동일한 leaf 선택자 문자열만으로 합치지 않는다.

## 결과 비교 시험

공식 `npm run verify`의 27개 비교 입력에서 예상과 실제가 모두 일치했다.

| 입력 | 예상 및 실제 |
| --- | --- |
| 완전한 정답 | TP71 / FN0 / FP0 / 필드 오류0 / 중복0 |
| 한 건만 제출 | TP1 / FN70 / FP0 |
| 정상 요소 오탐 | TP0 / FN71 / FP1 |
| 다른 ID·CSS·fragment로 동일 검출 중복 | TP1 / FN70 / FP0 / 중복1 |
| 같은 요소의 다른 CSS와 원문 | TP1 / FN70 / FP0 |
| 모호한 p 선택자 | TP0 / FN71 / FP1 |
| 필수 evidence_text 누락 | TP0 / FN71 / 필드 오류1 |
| 잘못된 JSON / BOM: 별도 2개 입력 | 파싱 실패 / BOM 제거 안내 |
| 쿼리 순서·fragment 변경 | TP1 / FN70 / FP0 |
| 상대 iframe src | TP1 / FN70 / FP0 |
| 고유 ID 중복 | TP1 / 필드 오류1 |
| 일반 안내의 동일 요소 오탐 중복 | TP0 / FN71 / FP1 / 중복1 |
| 다른 대상 쿼리의 다른 기법 | TP0 / FN71 / FP1 |
| HTTP/HTTPS·끝 슬래시 | TP1 / FN70 / FP0 |
| meta.entry_url 배열 타입 | 진입 URL 필드 타입 오류 안내 |
| 유효한 meta와 빈 findings | TP0 / FN71 / FP0 / 필드 오류0, 분모 0 비율 계산 불가 |
| 형제 iframe 올바른/다른 경로: 별도 2개 입력 | TP2/FN69/FP0 및 TP0/FN71/FP1 |
| 기존 사이트 1~6 전체 정답: 각각 별도 입력 | TP40 / 61 / 68 / 50 / 60 / 64, 각각 FN0·FP0 |
| 단독 dist 전체 정답 | TP71 / FN0 / FP0 / 필드 오류0 / 중복0 |
| 두 자리 번호·접두 경로 전체 정답 | TP71 / FN0 / FP0 / 필드 오류0 / 중복0 |

동일 서비스의 audience만 바꾸는 6방향(Q01↔Q02, Q03↔Q04, Q05↔Q06)을 별도 실제 업로드로 시험했다. 출발 사례의 첫 기법을 목적지에 제출했으며 이번 6방향은 모두 목적지 기법과 달라 TP0/FN71/FP1이었다. 목적지 정의와 실제 위치·기법에 따라 기대값을 산출했다.

허용되지 않은 기법·is_violation 문자열 타입·공백 evidence_text는 각각 필드 오류 1건이었다. elapsed_sec 1800은 초과 표시가 없고 1801은 30분 초과를 표시했다. 선언 시간 확인이며 탐지기 실측 시간이 아니다. 독립 보강에서 외부 전송 요청·JS 오류는 각각 0개였다.

## 화면 확인과 소규모 조판 보완

서비스 대상 자료·지원 절차·센터 이용·상담 dd·서비스 목차·목록·형제 프레임을 1440/390/320px에서 총 21개 레이아웃으로 검사·촬영했다. 문서 가로 넘침은 0이며 홈·320px 서비스/목록/형제 프레임·검증실 등 화면을 시각 확인했다.

320px 지원 절차 제목의 '단계'가 음절 사이에서 줄바꿈되는 작은 조판 문제를 관찰했다. 내용 폭 압축·겹침·기능 실패는 아니며 전체 검사 FAIL로 판정하지 않았다. 제작 담당자가 800px 이하 `.page-heading h1`에 word-break:keep-all 한 속성을 추가했다.

최종 CSS로 390/320px 관련 7페이지씩 14개 화면을 모두 재측정·재촬영했다. h1의 keep-all 적용·가로 넘침0·JS0, '단계' Range의 단일 줄 rect를 확인했다. 320px 절차·서비스·목록을 직접 시각 재검토해 단어 단위 줄바꿈이 정상임을 확인했다.

데스크톱 1440px의 절차·서비스·guide·목록 h1 computed style, 글자 크기·줄높이·색·폭·높이를 보완 전과 비교해 완전 일치를 확인했다. 초기 내용 snapshot과 비교한 변경은 신규 template CSS·dist CSS·test-site-7 CSS 세 파일뿐이며 HTML/JS·fixtures·정답·공통 도구는 바뀌지 않았다.

공식 기능 검사는 이 조판 보완과 진행 시점이 겹쳤다. 최종 판정은 변경이 없는 데스크톱 전수 DOM·프레임·결과 비교·BFS의 공식 증거와 최종 CSS의 새 모바일 14화면 증거를 함께 사용한다. 보완 전 모바일 스크린샷은 최종 CSS를 증명하는 자료로 사용하지 않는다. 미디어 범위 밖 computed 불변과 변경 범위를 확인했으므로 같은 기능 전체 suite를 추가 반복하지 않았다.

## 회귀·재현성·내용 snapshot

- 기준 HEAD 대비 기존 사이트 1~6의 source·test-site 폴더 diff가 없고 완전 정답 실제 회귀도 통과했다.
- 코디네이터가 최종 생성 176파일 재빌드 일치 해시 `be96b450a90139281c998915670db12080ae70d946808884af57893f7cc3766d`를 확인했다. verifier는 빌드를 실행하지 않고 원본·정답·배포 일치와 보존 범위를 독립 검사했다.
- 소스·정답·dist·배포·공통 파일 190개의 개별 SHA-256과 기준 HEAD는 artifacts/history/verification-snapshot.json에 저장했다. 최종 커밋 내용 일치를 코디네이터가 확인해 verifiedCommitSha에 연결해야 한다. 내용 snapshot은 커밋 SHA가 아니다.
- UTF-8 디코딩·BOM 부재·Git diff 공백을 확인했다. 문서의 URL/요소/기법/물리 파일 단위가 실제와 일치하며 기존 구조를 유지하고 release·ZIP을 추가하지 않았다.

## 증거와 한계

- artifacts/history/browser-report.json: 공식 비교27종·전수 DOM·프레임·스타일·BFS·회귀·경로 검사
- artifacts/history/independent-browser-report.json: 독립 형제·21레이아웃·BFS·대상6방향·타입/시간/네트워크 보강
- artifacts/history/independent-static-report.json: 대상 비노출·기대 enum/기존 기관명·문자 원문
- artifacts/history/procedure-320-before-typography.png·desktop-heading-before-typography.json: 조판 보완 전 증거
- artifacts/history/typography-retest-report.json·after-typography-*-390/320.png: 최종 모바일 및 데스크톱 불변 증거
- artifacts/history/typography-repair-files.json·verification-snapshot.json: 수정 범위·최종 내용 해시
- portal/list/services/lab·internal/independent PNG, lab-top PNG, expected-result 및 root/prefix/prior-site 예시, 독립 정답 다운로드

남은 검증 실패는 없다. 실제 온라인 배포·Git push·PR 병합은 이 독립 검증에서 수행하지 않았다. 동일 출처 정적 페이지와 고정 지연을 시험했고 교차 출처 iframe·로그인·서버 리다이렉트·CAPTCHA·Shadow DOM·이미지 OCR·실제 탐지 모델과 대규모 성능은 시험하지 않았다. 검증실 분리는 접근 제어가 아니므로 비공개 정답 평가에는 대상 폴더만 제공해야 한다.
