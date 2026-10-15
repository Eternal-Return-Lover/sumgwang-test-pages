> 경로 이관 검증 **PASS** (전체 30조건·실제 DOM·비교·화면 검사). 경로 통일: 현재 프로젝트는 `source/test-site-6/`입니다. 아래는 제작 당시 검증 기록이며, 당시 증거·snapshot은 `artifacts/history/`에 원본 그대로 보존합니다. 과거 해시는 현재 경로의 재검증 결과가 아닙니다. 이번 이관 검증은 [공통 경로 검사 결과](../test-site-10/artifacts/path-migration-report.json)와 `artifacts/path-migration-snapshot.json`을 참조합니다.

# 사이트 6 실제 독립 검증 기록

검증일: 2026-10-15 (Asia/Seoul). 상태: **로컬 독립 검증 PASS**.

Node.js 24.14.0, Playwright 1.63.0과 설치된 Chrome headless로 실제 HTTP 페이지·DOM·iframe·다운로드·파일 업로드를 검사했다. 구현 담당자와 별도의 verifier가 실행과 화면을 확인했다. 기준 HEAD는 `35d518b62c56aa9a0a926501e992b3bd97c03152`이며 사이트 6는 검사 당시 미커밋 상태였다. 최종 커밋 내용 연결·push·PR·병합은 코디네이터가 별도로 처리한다.

이 기록은 테스트 사이트와 검증실 자체 검사이며 실제 탐지기의 성능이나 공모전 공식 점수를 의미하지 않는다.

## 수량과 정적 검사

| 구분 | 실제 결과 |
| --- | ---: |
| 콘텐츠 시나리오·고유 URL | 56: 고정 48 + 쿼리 8 |
| 광고 포함 URL / 정상 URL | 42 / 14 |
| 광고 요소 / 정상 대조 요소 | 48 / 14 |
| 전수 DOM 요소 | 62 |
| 기대 findings | 64 |
| HOMOGLYPH / JAMO / TRANSPARENT / OFFSCREEN | 14 / 15 / 18 / 17 |
| 콘텐츠 HTML / 구조 HTML / 프레임 HTML / lab HTML | 49 / 12 / 9 / 1 |
| 전체 HTML / 대상 HTML | 71 / 70 |
| 검사한 로컬 링크·자산·프레임 참조 | 866 |
| 대상 전용 배포 파일 | 76 |
| 목록 | 55행, 12행씩 5페이지, 마지막 7행 |

`node source/manage.mjs check`로 사이트 1~6의 문법·참조·manifest·배포 파일·루트 목록을 독립 검사했다. `node --test source/site-tools.test.mjs` 공통 회귀 5개도 통과했다. 원본 사례 정의·정답표·lab manifest의 원문·기법·위치·프레임과 수량이 일치한다.

대상 76파일의 HTML class/id/title 속성 1,561개에 정답 사례번호·기법코드 노출이 없었다. 대상에서 source/lab/정답으로 연결되는 링크가 없으며 대상에 lab/reference/src/scripts 폴더가 없다. 실제 DOM의 HOMOGLYPH 14건·JAMO 15건 원문 문자도 확인했다.

## 브라우저 실제 검사

| 검사 | 실제 결과 |
| --- | --- |
| 홈 데스크톱 1440×1000 / 모바일 390×844 | 출발보드·노선선도·상태·소식 렌더링, 가로 넘침 없음, 시각 확인 |
| 목록·검색·빈 결과·초기화 | 5페이지·12행씩·마지막 7행, 검색과 입력·페이지 상태 복원 정상 |
| 노선 탐색 | 10/20/30/40 4노선·주간/야간 링크, 데스크톱·모바일 정상 |
| 쿼리 분기 | route 4값 × service 2값 = 8본문, 서로 다른 제목·시각·원문 확인 |
| 쿼리 순서·fragment / 알 수 없는 값 | 같은 본문 대응 / 자료 없음 안내 |
| 750·2100·2800ms 메모 / 정상 1100ms 상태 | 초기 없음, 지연 후 해당 원문 생성 |
| T30 지연 프레임 | 외부 750ms + 마지막 프레임 메모 650ms = 명목 1400ms |
| 프레임 전수 | T28/T30/N08 2단계, T29 3단계의 실제 src·선택자·원문 확인 |
| 깊은 기록 | 직전 링크 1100ms 지연, 실제 링크 클릭으로 T34 도달 |
| 독립 전수 DOM 기록 | 광고 48·정상 14 = 62/62, 유일 선택자·원문·computed style·조상·bounds 통과 |
| 검증실 자체 DOM | 62/62, 실패 사례 0 |
| 시작 URL 도달 | 고유 문서 68개 방문, 대상 56/56, 최대 깊이 4, 누락·로딩 오류 0 |
| 별도 독립 BFS | lab crawl helper 없이 Playwright 큐로 68개 방문·56/56·최소 깊이 4 재확인 |
| 필터·검색·사례 상세 | 전체 62·정상 14·4기법·사례 검색, 2단계 경로·1400ms·원문 표시 확인 |
| 주소 복사·정답 다운로드 | 실제 clipboard 주소 확인, reference/ground-truth.json과 일치 |
| 예상 결과 다운로드 | 64건, 현 실행 주소 반영, UTF-8 BOM 없음 |
| 공개 대상 lab·manifest | 모두 HTTP 404 |
| 검증실 모바일 | 통계·필터·사례·업로드 정상, 가로 넘침 없음 |
| 단독 dist | TP64/FN0/FP0·DOM62/62·BFS56/56·깊이4 |
| 저장소 접두 경로·두 자리 번호 | 가상 /sumgwang-test-pages/test-site-10/에서 TP64/FN0/FP0·DOM62/62·lab404 |
| 브라우저 JavaScript 오류 | 공식 전체 검사 0, 독립 보강 0 |

접두 경로 검사는 같은 배포본을 브라우저 요청에서만 임시 매핑했다. 실제 원격 배포 또는 새 사이트 10 제작을 수행한 것이 아니다. 검사 서버는 빈 포트를 사용하므로 예시 파일의 localhost 주소는 당시 실행 주소다. 부모·프레임 문서 로딩이 지연에 추가될 수 있으며 지연 생성 전후 실제 상태를 확인했다.

## 내부 화면과 모바일

시각표·환승 안내·이용 정보·정류장 dd 설명·노선 목록·게시판을 1440/390/320px에서 각각 열어 총 18개 레이아웃의 실제 렌더링·main/문서 폭·가로 넘침을 검사하고 스크린샷을 남겼다. 각 화면의 문서 가로 넘침은 0이다.

홈 데스크톱/모바일, 320px 내부 6종 전체, 390px 환승/dd와 검증실 상단의 스크린샷을 직접 시각 확인했다. 출발 시각·승차 위치가 겹치지 않고, 주간/야간 시각표·환승 연결표·guide·dd·노선의 링크·게시판 제목이 읽을 수 있게 배치됐다. 발견된 시각 실패나 수정 요구는 없다.

## 결과 비교 입력

공식 `npm run verify`의 24개 비교 입력에서 예상과 실제가 모두 일치했다.

| 입력 | 예상 및 실제 |
| --- | --- |
| 완전한 정답 | TP64 / FN0 / FP0 / 필드 오류0 / 중복0 |
| 한 건만 제출 | TP1 / FN63 / FP0 |
| 정상 요소 오탐 | TP0 / FN64 / FP1 |
| 다른 ID·CSS·fragment로 동일 검출 중복 | TP1 / FN63 / FP0 / 중복1 |
| 같은 요소의 다른 CSS와 원문 | TP1 / FN63 / FP0 |
| 모호한 p 선택자 | TP0 / FN64 / FP1 |
| 필수 evidence_text 누락 | TP0 / FN64 / 필드 오류1 |
| 잘못된 JSON / BOM | 파싱 실패 / BOM 제거 안내 |
| 쿼리 순서·fragment 변경 | TP1 / FN63 / FP0 |
| 상대 iframe src | TP1 / FN63 / FP0 |
| 고유 ID 중복 | TP1 / 필드 오류1 |
| 일반 안내의 동일 요소 오탐 중복 | TP0 / FN64 / FP1 / 중복1 |
| 다른 쿼리 값의 다른 기법 | TP0 / FN64 / FP1 |
| HTTP/HTTPS·끝 슬래시 | TP1 / FN63 / FP0 |
| meta.entry_url 배열 타입 | 진입 URL 필드 타입 오류 안내 |
| 유효한 meta와 빈 findings | TP0 / FN64 / FP0 / 필드 오류0, 분모 0 비율 계산 불가 |
| 기존 사이트 1·2·3·4·5 전체 정답: 각각 별도 입력 | TP40 / 61 / 68 / 50 / 60, 각각 FN0·FP0 |
| 단독 dist 전체 정답 | TP64 / FN0 / FP0 / 필드 오류0 / 중복0 |
| 두 자리 번호·접두 경로 전체 정답 | TP64 / FN0 / FP0 / 필드 오류0 / 중복0 |

JSON 오류와 BOM은 별도 2개 입력이며 기존 사이트 회귀도 별도 5개 입력이다. 자세한 입력별 예상·실제 객체는 browser-report.json에 있다.

동일 노선의 service만 바꾸는 8방향을 별도 실제 업로드로 시험했다: Q01↔Q02, Q03↔Q04, Q05↔Q06, Q07↔Q08. 출발 사례의 첫 기법을 목적지에 제출했으며 이번 8방향은 모두 목적지의 기대 기법과 달라 TP0/FN64/FP1이었다. URL만 달라졌다고 일괄 판정한 것이 아니라 목적지 정의와 실제 위치·기법으로 기대값을 산출했다.

허용되지 않은 기법·is_violation 문자열 타입·공백 evidence_text는 각각 필드 오류 1건이었다. elapsed_sec 1800은 초과 표시가 없고 1801은 30분 초과를 표시했다. 선언 시간을 확인한 것이며 탐지기 실측 시간이 아니다. 독립 보강의 외부 전송 요청·JS 오류는 각각 0개였다.

## 회귀·재현성·내용 snapshot

- 기준 HEAD 대비 기존 사이트 1~5의 source·test-site 폴더 diff가 없고 실제 완전 정답 회귀도 통과했다.
- 코디네이터가 생성 160파일 재빌드 내용 일치 해시 `dc48d4826dce4505394afcf2b1b59b2de54e5168831163257c0ee947e04484b4`를 확인했다. verifier는 빌드를 실행하지 않고 생성·정답·배포 일치와 파일 보존을 독립 검사했다.
- 소스·정답·dist·배포·공통 파일 174개의 개별 SHA-256과 기준 HEAD는 artifacts/history/verification-snapshot.json에 저장했다. 코디네이터가 최종 커밋 내용과 일치를 확인해 verifiedCommitSha에 연결해야 한다. 내용 snapshot은 커밋 SHA가 아니다.
- UTF-8 디코딩·BOM 부재·Git diff 공백을 확인했다. README·REQUIREMENTS 수량과 실제가 일치하며 기존 구조를 유지하고 release·ZIP을 추가하지 않았다.
- 이번 독립 실행은 첫 공식 실행부터 통과했고 구현·정답·공유 파일의 수정이나 추가 재빌드는 요청하지 않았다.

## 증거와 한계

- artifacts/history/browser-report.json: 공식 비교24종·62DOM·프레임·스타일·BFS·회귀·경로 검사
- artifacts/history/independent-browser-report.json: clipboard·정답·18레이아웃·독립BFS·8쿼리방향·타입/시간/네트워크 보강
- artifacts/history/independent-static-report.json: 대상 비노출·HOMOGLYPH/JAMO 실제 원문
- artifacts/history/verification-snapshot.json: 검증 대상 개별 내용 해시
- portal/list/routes/lab 데스크톱·모바일 PNG, 390/320 내부 화면 PNG, independent 1440/390/320 내부 PNG, lab-top PNG
- expected-result·root/prefix/prior-site 예상 결과와 독립 다운로드 정답표

남은 검증 실패는 없다. 실제 온라인 배포·Git push·PR 병합은 이 독립 검증에서 수행하지 않았다. 동일 출처 정적 페이지와 고정 지연을 시험했고 교차 출처 iframe·로그인·서버 리다이렉트·CAPTCHA·Shadow DOM·이미지 OCR·실제 탐지 모델과 대규모 성능은 시험하지 않았다. 검증실 분리는 접근 제어가 아니므로 정답 비공개 평가에는 대상 폴더만 제공해야 한다.
