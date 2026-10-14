# 사이트 4 실제 독립 검증 기록

검증일: 2026-10-15 (Asia/Seoul). 상태: **로컬 독립 검증 PASS**.

Node.js 24.14.0, Playwright 1.63.0과 설치된 Chrome headless로 실제 HTTP 페이지·DOM·iframe·다운로드·파일 업로드를 검사했다. 구현 담당자와 별도의 verifier가 실행·화면·증거를 확인했다. 기준 HEAD는 `ee60f4464ae6c50d2c3a71626e7dbedbeefb27a8`이며, 검사 당시 사이트 4는 미커밋 상태였다. 최종 커밋 연결과 push·PR·병합은 코디네이터가 별도로 처리한다.

이 기록은 테스트 사이트와 검증실의 자체 동작 확인이다. 실제 탐지기 성능이나 공모전 공식 점수를 의미하지 않는다.

## 수량과 정적 검사

| 항목 | 실제 결과 |
| --- | ---: |
| 콘텐츠 시나리오·고유 URL | 48 |
| 광고 포함 URL / 정상 URL | 36 / 12 |
| 광고 요소 / 정상 대조 요소 | 40 / 12 |
| 전수 DOM 검사 요소 | 52 |
| 기대 findings | 50 |
| HOMOGLYPH / JAMO / TRANSPARENT / OFFSCREEN | 10 / 12 / 14 / 14 |
| 실제 콘텐츠 HTML | 45: 고정 콘텐츠 44 + 쿼리 공통 문서 1 |
| 검증실 포함 전체 HTML | 67 |
| 검사한 로컬 링크·자산·프레임 참조 | 827 |
| 대상 전용 배포 파일 | 71 |

`node source/manage.mjs check`로 사이트 1·2·3·4 전체 정적 검사와 배포 파일·루트 목록·manifest 일치를 확인했다. `node --test source/site-tools.test.mjs`의 공통 회귀 검사 5개도 통과했다. source/fixtures 정의, 보관용 정답표, lab manifest의 원문·기법·선택자·프레임과 수량이 일치한다.

대상 71파일의 HTML class/id/title 속성 1,530개에서 정답 사례번호·기법코드 노출은 0개였다. 대상에서 source/lab/정답 자료로 연결되는 링크가 없고, 대상 폴더에는 lab/reference/src/scripts가 없다. 실제 DOM 원문에 적용된 HOMOGLYPH 10건과 JAMO 12건의 문자도 별도로 확인했다.

## 실제 브라우저 검사

| 검사 | 실제 결과 |
| --- | --- |
| 홈 데스크톱 1440×1000 / 모바일 390×844 | 정상 렌더링, 가로 넘침 없음, 스크린샷 시각 확인 |
| 카드 목록 | 6페이지, 페이지당 9개, 마지막 2개; 깊은 기록 1개는 목록에서 제외 |
| 제목 검색 / 빈 결과 / 초기화 | 검색 결과 생성, 빈 결과 안내, 입력·페이지 상태 복원 정상 |
| 소장품 연표 | 3개 시대 구분, 데스크톱·모바일 화면 확인 |
| 쿼리 분기 | collection·period 값 조합 4개, 서로 다른 제목·정답 원문 |
| 쿼리 순서·fragment / 알 수 없는 값 | 같은 본문으로 대응 / 찾을 수 없다는 안내 표시 |
| 650·1600·2800ms 광고 의견 | 초기 요소 없음, 고정 지연 후 원문 생성 |
| 650ms 정상 접근성 요소 | 초기 요소 없음, 지연 후 생성 |
| 1200ms 중첩 iframe | 초기 부모 프레임 없음, 2단계 프레임 생성과 원문 확인 |
| 1·2단계 iframe 전수 | 부모 URL·실제 src·선택자·마지막 프레임의 원문 일치 |
| 깊은 기록 발견 | 장부의 링크가 1200ms 뒤 생성, 실제 링크 클릭으로 대상에 도달 |
| 실제 DOM 전수 | 광고 40·정상 12, 총 52/52 유일 선택자·원문·computed style·조상·bounds 통과 |
| 검증실 자체 DOM 검사 | 52/52, 실패 사례 0 |
| 시작 URL 링크 도달 검사 | 고유 문서 62개 방문, 대상 48/48, 최대 깊이 6, 오류·누락 0 |
| 별도 독립 BFS | lab crawl helper 없이 Playwright 방문 큐로 62개 방문·48/48 도달·최소 깊이 6 재확인 |
| 검증실 필터·검색 | 전체 52·정상 12·4종 기법 필터·사례 검색 통과 |
| 프레임 사례 상세 | 원문·2단계 경로·1200ms 지연 표시 확인 |
| 주소 복사 | 현재 test-site-4/index.html 주소를 실제 clipboard에서 확인 |
| 정답표 다운로드 | reference/ground-truth.json과 내용 일치 |
| 예상 결과 다운로드 | 50건, 현재 배포 주소 반영, UTF-8 BOM 없음 |
| 대상 lab·manifest | 모두 HTTP 404 |
| 검증실 모바일 | 가로 넘침 없음, 통계·버튼·필터·사례·업로드 화면 확인 |
| 단독 dist | 진입 URL·전체 정답 TP50/FN0/FP0·DOM52/52·링크48/48·깊이6 |
| 저장소 접두 경로와 두 자리 번호 | 가상 /sumgwang-test-pages/test-site-10/에서 TP50/FN0/FP0·DOM52/52·lab404 |
| 브라우저 JavaScript 오류 | 공식 전체 검사 0, 독립 보강 0 |

접두 경로 검사는 동일 배포본을 브라우저 요청에서만 임시 매핑했다. 실제 원격 배포나 새 사이트 10 제작을 수행한 것은 아니다. 검사 서버는 운영체제가 할당한 포트를 사용하므로 결과 예시의 localhost 주소는 당시 실행 포트다.

홈·목록·연표·검증실의 데스크톱 및 모바일 스크린샷과 게시글 모바일 화면을 직접 시각 검사했다. 읽기 어려운 겹침·잘림이나 가로 넘침은 발견하지 못했다. 지연 요소의 관측 시간은 폴링·브라우저 스케줄링 때문에 명목 지연보다 늦을 수 있으며, 독립 기록에서 광고 650/1600/2800ms와 정상 650ms가 각각 생성되기 전·후의 상태를 확인했다.

## 결과 비교 시험

공식 `npm run verify` 최종 실행의 20개 비교 입력에서 아래 예상과 실제가 일치했다.

| 입력 | 예상 및 실제 |
| --- | --- |
| 완전한 정답 | TP50 / FN0 / FP0 / 필드 오류0 / 중복0 |
| 한 건만 제출 | TP1 / FN49 / FP0 |
| 정상 요소 오탐 | TP0 / FN50 / FP1 |
| 다른 ID·CSS·fragment로 동일 검출 중복 | TP1 / FN49 / FP0 / 중복1 |
| 같은 요소의 다른 CSS와 원문 | TP1 / FN49 / FP0 |
| 모호한 p 선택자 | TP0 / FN50 / FP1 |
| 필수 evidence_text 누락 | TP0 / FN50 / 필드 오류1 |
| 잘못된 JSON | JSON 파싱 실패 안내 |
| BOM 포함 JSON | BOM 제거 안내 |
| 쿼리 순서·fragment 변경 | TP1 / FN49 / FP0 |
| 상대 iframe src | TP1 / FN49 / FP0 |
| 고유 ID 중복 | TP1 / 필드 오류1 |
| 일반 안내의 같은 요소 오탐 중복 | TP0 / FN50 / FP1 / 중복1 |
| 다른 쿼리 값의 본문 | TP0 / FN50 / FP1 |
| HTTP/HTTPS·끝 슬래시 | TP1 / FN49 / FP0 |
| meta.entry_url 배열 타입 | 진입 URL 필드 타입 오류 안내 |
| 유효한 meta와 빈 findings | TP0 / FN50 / FP0 / 필드 오류0, 분모 0의 비율 계산 불가 |
| 기존 사이트 1 전체 정답 | TP40 / FN0 / FP0 |
| 단독 dist 전체 정답 | TP50 / FN0 / FP0 / 필드 오류0 / 중복0 |
| 두 자리 번호·저장소 접두 경로 전체 정답 | TP50 / FN0 / FP0 / 필드 오류0 / 중복0 |

별도 실제 업로드로 허용되지 않은 기법 코드, is_violation 문자열 타입, 공백 evidence_text를 각각 필드 오류 1건으로 처리하는 것도 확인했다. 선언된 elapsed_sec가 1800이면 초과 표시가 없고 1801이면 30분 초과를 표시한다. 이는 제출 파일의 선언값 확인이며 탐지기의 실제 시간을 측정한 결과가 아니다. 해당 보강 실행에서 외부 전송 요청은 0개였다.

## 발견·수정·재검증

첫 공식 실행은 신규 DOM52/52, 비교17종, BFS48/48을 통과한 뒤 기존 사이트 1 회귀 검사에서 중단됐다. 사이트 1의 결과 UI가 dataset.result 없이 텍스트를 표시하는데 신규 검사 스크립트가 dataset만 읽어 TP가 undefined가 된 검사 호환 문제였다.

구현 담당자가 신규 scripts/browser-check.mjs의 기존 사이트 1 검사에만 score-metrics 텍스트 fallback을 추가했다. 대상 페이지·정답·공통 도구·기존 사이트는 변경하지 않았다. verifier가 재실행한 최종 공식 검사는 종료 코드 0으로 전체 통과했다. 첫 실패 보고서는 별도 보존했으며 최종 판정 근거는 최종 browser-report.json이다.

## 회귀·재현성·내용 snapshot

- 기준 HEAD 대비 기존 사이트 1·2·3의 source와 test-site 폴더 diff는 없다.
- 별도 브라우저에서 기존 사이트 1·2·3 전체 정답을 직접 비교했다: TP40/61/68, 각각 FN0/FP0. 시작 주소도 실제 대상 배포본으로 계산됐다.
- 코디네이터의 생성 파일 150개 재빌드 내용 일치 결과를 확인했고, verifier는 독립 실행 후 164개 소스·정답·dist·배포·공통 파일을 다시 대조했다. 실패 수정 전후 변경은 신규 browser-check.mjs 한 파일뿐이었다.
- 최종 소스·정답·배포 파일의 개별 SHA-256과 기준 HEAD는 artifacts/verification-snapshot.json에 저장했다. 최종 커밋 SHA는 코디네이터가 내용 일치를 확인해 이 검증 결과에 연결해야 한다.
- UTF-8 디코딩·BOM 부재와 Git diff 공백 검사를 확인했다. 기존 폴더 형식을 유지했고 release·ZIP을 추가하지 않았다.

## 증거와 한계

- artifacts/browser-report.json: 최종 공식 실행, 비교20종·전수 DOM·도달·스타일·프레임 증거
- artifacts/first-run-failure-report.json: 수정 전 실패 재현 기록
- artifacts/independent-browser-report.json: clipboard·정답 다운로드·지연·별도 BFS·기존3사이트 회귀
- artifacts/independent-static-report.json: 정답 비노출·HOMOGLYPH/JAMO 실제 원문
- artifacts/independent-schema-report.json: 프레임 상세·필드 타입·1800초 경계 보강
- artifacts/verification-snapshot.json: 검증 대상 내용 해시
- portal/list/collection/lab 데스크톱·모바일 PNG, lab-top 및 article-mobile PNG
- expected-result.json·root/prefix/prior-site 예상 결과와 독립 다운로드 정답표

남은 검증 실패는 없다. 실제 온라인 배포·Git push·PR 병합은 이 독립 검증에서 수행하지 않았다. 동일 출처 정적 페이지와 고정 지연을 시험했으며 교차 출처 프레임·로그인·서버 리다이렉트·CAPTCHA·Shadow DOM·이미지 OCR·실제 탐지 모델과 대규모 성능은 시험하지 않았다. 검증실 분리는 접근 제어가 아니므로 정답 비공개 평가에는 대상 폴더만 제공해야 한다.
