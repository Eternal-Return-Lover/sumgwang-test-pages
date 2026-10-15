# 사이트 10 독립 검증 기록

상태: **PASS — 2026-10-15 로컬 검사 대상 snapshot**. 실제 생성된 대상·검증실을 Playwright 1.63.0과 설치된 Chrome으로 확인했습니다. verifier는 배정 artifacts와 이 문서만 작성했습니다. 구현·정답·공유·기존 사이트·대상 배포 파일은 보존했고 빌드·설치·커밋·push·merge는 실행하지 않았습니다.

## 기준과 수량

- 기준 HEAD: `c2fac7768a413169b50c532e42cb2047795ff0e2`. 검사 시작 당시 HEAD이며 최종 검증 커밋 SHA가 아닙니다.
- 콘텐츠61URL = 정적52 + query9. 광고 포함45URL / 정상16URL.
- 광고54요소 + 정상16요소 = 실제 DOM70. 기대78건 = HOMOGLYPH18 / JAMO20 / TRANSPARENT19 / OFFSCREEN21.
- 전체81HTML = 콘텐츠53 / 구조14 / iframe보조13 / lab1. 대상85파일 = 공개HTML80 + 자산4 + robots1.
- 목록60행, 13행씩5쪽, 마지막8행. 시작 URL부터 최단 최대 링크 깊이6.
- 코어192파일 내용 aggregate: `851fca9d277ba67b0a282cf226ceb7bd6e1667d6623bf7aac6f3e939ec8c4e7c`. 개별 SHA-256과 source/reference/dist/deployment/shared 그룹 해시는 artifacts/verification-snapshot.json에 있습니다. 문서·artifacts·node_modules는 코어 snapshot에서 제외합니다.

## 실제 실행 결과

| 검사 | 결과 |
| --- | --- |
| node source/manage.mjs check | 등록 사이트1~10 PASS, 사이트10 HTML81/로컬참조945/배포85 |
| node --test source/site-tools.test.mjs | 공통5개 PASS |
| node scripts/browser-check.mjs 기본 브라우저 검사 | 종료0, ok=true, 비교46종 |
| DOM 전수 | 70/70 유일 선택자·원문·computed style·bounds·조상 영향 일치 |
| 문자 보강 | 실제 DOM의 HOMOGLYPH18/JAMO20 원문·코드포인트38검사 |
| SVG 실제 DOM/paint | 양성2+정상1의 namespace·원문·조상opacity·font0·fill·bounds·viewBox 확인 |
| SVG screenCTM 보강 | 3사례×1440/390/320=9측정, 정상 paint와 투명/0px 사례 구분 |
| template 보강 | 초기 document0/content1/분리fragment → 2100ms후 연결clone1/원본1/중복0 |
| 기본 BFS | 75문서/61콘텐츠 URL/깊이6/누락0/로딩오류0 |
| 별도 독립 BFS | lab helper를 사용하지 않은 실제 a[href] 순회, 75문서/61URL/깊이6/누락0/로딩오류0 |
| query·프로그램 | zone3×session3=9제목·본문, Q02/Q09 부모query와1/3단계frame 일치 |
| 실제 프로그램 클릭 | 9조건×1440/390/320=27회 URL/제목 이동 |
| 목록 | 제목검색·전시구역필터·결합검색·초기화·빈결과·페이지네이션 통과 |
| lab 기본 기능 | 전체70/정상16/4기법필터·검색, 실제 주소복사, 정답표 원본일치, 예상78건/BOM없음 |
| 독립 비교 | 별도30종의 실제 DOM 기반 예상/실제 일치 |
| 화면·내부 레이아웃 | 13화면×1440/390/320=39측정·캡처, 가로 넘침0 |
| JS·네트워크 | 기본/보강 JS오류0, 보강 외부 런타임 요청0 |
| 공개정보·인코딩 | 대상85파일·1869속성의 정답라벨/정답참조/이전기관명0, UTF8/BOM PASS |
| 기존 보존·공백 | 기준 HEAD 대비 사이트1~9 소스·배포 diff0, git diff --check 오류0 |

T27 600ms, T28 1300ms, T29 2800ms, 정상N12 900ms의 초기 부재와 지연 후 원문을 확인했습니다. T30 template2100ms는 별도 검사도 수행했습니다. T33은 outer500ms+마지막 프레임leaf1200ms=nominal1700ms입니다. 일반T31 2단계/T32 3단계/T33 2단계/정상N08 2단계가 실제 로딩됩니다.

T34 observations/2026/autumn/north/notebook/read.html은 마지막 notebook/index.html 링크가850ms 후 생성되며 실제 최단6링크로 발견합니다. 홈·목록·검색의 직접 링크 우회는 없습니다. 정상N14는 display:block/정확한 원문/y1937.25의 화면 아래 일반 본문입니다.

## inline SVG의 실제 텍스트와 paint

T07·T08·N10의 선택자는 각각 해당 페이지에서1개이며 namespaceURI는 http://www.w3.org/2000/svg, localName은 text입니다. 이미지 OCR이 아닌 연결된 실제 DOM 원문을 검사했습니다.

- T07: 전각 원문, text의 양의 bounds를 유지하며 조상g opacity0/누적opacity0입니다. HOMOGLYPH+TRANSPARENT 두 정답입니다.
- T08: 자모 원문, text inline style font-size:0px/computed0px, getBBox와 화면bounds의 width/height0입니다. JAMO+OFFSCREEN 두 정답입니다.
- N10: 정상 원문, computed font-size18px, fill rgb(181,229,239)(#b5e5ef), fillOpacity1, 모든 조상opacity1/가시적display·visibility입니다. bbox와 화면bounds가 양수이며 bbox가620×300 viewBox 안에 있습니다.

정상N10의 getScreenCTM scale은1440px에서1.6080208, 390px에서0.4967708, 320px에서0.3935417입니다. 변환 후 글자 크기는 약28.944/8.942/7.084px, 화면bounds는 각각 약284.25×38 /87.87×12 /69.55×10으로 모두양수입니다. 모바일에서 축소되지만 실제 teal색 글자가 보이며 font0사례와 구분됩니다. visible-SVG-normal-*.png와 SVG-screen-transform-report.json에 증거를 보존했습니다.

기존 lab의 일반 DOM 검사는 SVGfill 자체의 충분한 가시성 판정을 제공하지 않으므로 정상fill/조상/변환/geometry와 실제 스크린샷을 별도로 보강했습니다. 공통 lab 알고리즘을 수정하지 않았습니다. 양성SVG4건 입력은 TP4/FN74/FP0, 정상SVG를 광고로 제출한 입력은 TP0/FN78/FP1입니다.

## template 원본과 연결 clone

T30의 초기 실제 document 선택자는0개, template.content 안 p.observation-text는1개이며 원문이 일치합니다. source와 DocumentFragment는 isConnected=false입니다. 1000ms 뒤에도 document0개를 확인했습니다.

관측된 document time 약2121.8ms에서 연결clone1개가 생성됐고, 원본template.content의 요소1개·원문·innerHTML이 보존됐습니다. clone은 원본과 다른 노드이며 isConnected=true/display:none입니다. 추가600ms 후에도 document1개로 중복이 없습니다. T30의 두 기법 제출은 실제 연결 노드에서 TP2/FN76/FP0입니다. 상세 before/after 객체는 independent-browser-report.json에 있습니다.

## query iframe과 비교 입력

Q02 programs/view.html?zone=dome&session=evening은 program-dome-evening-1.html의1단계이며 HOMOGLYPH/TRANSPARENT입니다. Q09 zone=workshop&session=night는 program-workshop-night-1/2/3.html의3단계이며 JAMO/OFFSCREEN입니다. 각 단계의 유일 선택자/src/원문과 실제 노드를 확인했습니다.

두 query의 정확한2기법, 파라미터순서/fragment, 상대src, 유일 CSS chain은 TP2/FN76/FP0입니다. 틀린zone/session/chain, 한 단계 누락, 다른 query iframe의 서로 다른 기법은 실제 src/leaf 부재 또는 기법불일치로 TP0/FN78/FP1입니다.

같은 query만 맞추는 가정 대신 제출한 실제 노드의 기법으로 기대값을 산출했습니다. Q02 TRANSPARENT를 실제Q05 노드에 정확히 제출하면 공유기법이라 TP1/FN77/FP0, HOMOGLYPH를 제출하면 FP1입니다. Q09의 JAMO/OFFSCREEN을 실제Q08 노드에 각각 정확히 제출하면 둘 다 유효정답으로 TP1/FN77/FP0입니다. node probe의 URL·원문·caseId·기법과 예상/실제를 별도 report에 기록했습니다.

기본46비교에는 완전78정답(TP78/FN0/FP0), 누락·정상FP·다른CSS·원문차이·중복·ID중복·모호한선택자·필수필드·기법enum·boolean/원문타입·JSON/BOM·entry_url/시간타입·빈분모·HTTP/HTTPS/끝슬래시·query/frame/SVG·기존1~9·단독/접두경로가 포함됩니다. 보강30종은 query의 실제node와 공유기법, SVG, template, 추가경로, 필드오류·시간1800/1801을 대조했습니다. 1800초는 초과표시가 없고1801초는30분초과를 표시하며 빈분모는 계산불가입니다.

## 화면·기존 회귀·배포 범위

홈·전시구역·프로그램일정·정상노트메타데이터·관찰표·template·SVG3사례·query2사례·자료이용·lab을1440×1000/390×844/320×844로 측정하고 캡처했습니다. 대표 화면의 본문·도해·일정·노트·표·메타데이터·프레임·안내를 시각검토했고 겹침·가독성 실패가 없었습니다. 긴 lab은 전체와 상단/비교컨트롤의 viewport 캡처로 확인했습니다. 정상SVG는 별도 figure캡처로 실제paint를 확인했습니다.

기존 사이트1~9 완전정답 회귀는 TP40/61/68/50/60/64/71/81/69이며 모두FN0/FP0입니다. 사이트1의 dataset 없는 기존 score-metrics 텍스트fallback도 실제 성공했습니다.

실제 두자리 test-site-10 경로, 단독dist origin에서78건비교/DOM70 audit/BFS61·깊이6·누락0을 확인했습니다. 로컬 브라우저 /sumgwang-test-pages/test-site-12/ 매핑에서도78건비교/DOM70 audit/대상lab404를 확인했습니다. 가상12는 접두경로 호환 시험이며 실제사이트12 생성이나 원격배포가 아닙니다.

코디네이터는 재빌드178파일의 동일해시1a5df5fde4c429ce02433dd9b1d977059ecaa49cc5b14c77834d14999e16c587을 보고했습니다. verifier는 빌드를 실행하지 않았으며 검사 중·종료 시 코어192파일의 내용변경0을 독립 확인했습니다. release/ZIP은 없으며 보강wrapper 실행실패나 제품 수정 요청은 없었습니다.

## 증거와 남은 범위

- artifacts/browser-report.json: 기본46비교/DOM70/audit/BFS·기존회귀·단독/접두경로.
- artifacts/independent-browser-report.json, independent-check.mjs: 보강30비교·query node probe·SVGpaint·template·39레이아웃·27실제클릭·독립BFS.
- artifacts/SVG-screen-transform-report.json: 3사례×3화면폭의 screenCTM·실제 bounds·font/fill/조상.
- artifacts/independent-static-report.json: 정답비노출·이전기관명·UTF8/BOM·실제문자38검사.
- artifacts/verification-snapshot.json: baselineHead와 코어192파일 개별/그룹/전체 SHA-256.
- artifacts/independent-*.png, visible-SVG-normal-*.png, lab-top-*.png, lab-controls-*.png: 화면 증거.

남은 로컬 검사 실패는 없습니다. 모집요강 기반 모의 환경 자체 검사이며 실제 탐지 프로그램 성능이나 공식 점수를 검증하지 않습니다. verifier는 커밋·push·PR·merge·원격main·공개주소 확인을 수행하지 않았습니다. 코디네이터가 snapshot과 최종커밋의 내용 일치를 확인해 verifiedCommitSha에 연결하고 Git/원격 반영을 후속 확인해야 합니다. 이 배치의 마지막 사이트이며 사이트11을 기획·제작하지 않았습니다.
