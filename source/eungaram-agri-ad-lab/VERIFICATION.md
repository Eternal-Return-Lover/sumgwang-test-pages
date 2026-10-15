# 사이트 9 독립 검증 기록

상태: **PASS — 2026-10-15 로컬 검사 대상 snapshot**. 생성된 실제 대상·검증실을 Playwright 1.63.0과 설치된 Chrome으로 확인했습니다. verifier는 배정 artifacts와 이 문서만 작성했습니다. 구현·정답·공유·기존 사이트·대상 배포 파일은 보존했고 빌드·설치·커밋·push·merge는 실행하지 않았습니다.

## 기준과 수량

- 기준 HEAD: `845985d9e0f2e71fa102f6726c5185fc15585410`. 검사 시작 당시 HEAD로, 최종 검증 커밋 SHA가 아닙니다.
- 콘텐츠 54URL = 정적42 + query12. 광고 포함40URL / 정상14URL.
- 광고48요소 + 정상14요소 = 실제 DOM62. 기대69건 = HOMOGLYPH15 / JAMO16 / TRANSPARENT18 / OFFSCREEN20.
- 전체69HTML = 콘텐츠43 / 구조12 / iframe보조13 / lab1. 대상73파일 = 공개HTML68 + 자산4 + robots1.
- 목록53행, 11행씩5쪽, 마지막9행. 시작부터 최단 최대 링크 깊이5.
- 코어168파일 내용 aggregate: `03462543e33519b2f955c431ff9fca09f3bf9d991e2ea805468578431c467c1d`. 개별 파일 SHA-256과 source/reference/dist/deployment/shared 그룹 해시는 artifacts/verification-snapshot.json에 있습니다. 문서·artifacts·node_modules는 코어에서 제외합니다.

## 실제 실행 결과

| 검사 | 결과 |
| --- | --- |
| node source/manage.mjs check | 등록 사이트1~9 PASS, 사이트9 HTML69/로컬참조796/배포73 |
| node --test source/site-tools.test.mjs | 공통5개 PASS |
| node scripts/browser-check.mjs 기본 브라우저 검사 | 종료0, ok=true, 비교37종 |
| DOM 전수 | 62/62 유일 선택자·원문·computed style·bounds·조상 영향 일치 |
| 문자 보강 | 실제 DOM의 HOMOGLYPH15/JAMO16 원문·코드포인트31검사 |
| 기본 BFS | 66문서/54콘텐츠 URL/깊이5/누락0/로딩오류0 |
| 별도 독립 BFS | lab helper를 사용하지 않고 실제 a[href] 순회, 66문서/54URL/깊이5/누락0/로딩오류0 |
| query | crop3×season4=12개 고유 제목·원문, Q04/Q09 query 부모 URL과 프레임 일치 |
| 상담 목록 | 검색·작물필터·결합검색·초기화·빈결과·페이지네이션 통과 |
| 정상 Q&A | 기본 native details 열기·닫기 및 모바일6개 추가 확인 |
| lab 기능 | 전체62/정상14/4기법필터·검색, 실제 주소복사, 정답표 원본 일치, 예상69건/BOM없음 |
| 독립 비교 보강 | 28종의 실제 DOM 기반 예상/실제 일치 |
| 화면·내부 레이아웃 | 11화면×1440/390/320=33측정·캡처, 가로 넘침0 |
| 모바일 실제 클릭 | 390/320에서 달력12조건씩24회 URL/제목 이동, 정상 문답6개 펼침·닫힘 |
| JS·네트워크 | 기본/보강 JS오류0, 보강 외부 런타임 요청0 |
| 공개 정보·인코딩 | 대상73파일·1633속성의 정답라벨/정답참조/이전기관명0, UTF8/BOM PASS |
| 기존 보존·공백 | 기준 HEAD 대비 사이트1~8 소스·배포 diff0, git diff --check 오류0 |

T19 450ms, T20 1100ms, T27 1700ms, T21 2800ms, 정상 N12 1000ms의 초기 부재와 지연 후 원문을 확인했습니다. T26은 outer700ms+마지막 프레임 leaf900ms=nominal1600ms를 확인했습니다. 일반 T23 1단계, T24 2단계, T25 3단계, T26 2단계와 정상 N08 1단계가 실제 로딩됩니다.

T22 field/rice/2026/autumn/read.html은 최종 autumn/index.html 링크가950ms 후 생기며 실제 최단5링크로 도달합니다. 목록·검색에서의 직접 경로가 없어 깊이를 우회하지 않았습니다. 정상 N14는 display:block, 원문 일치, y=1961.203125로 화면 아래 일반 본문에 존재합니다.

## 같은 클래스의 형제 iframe

T23과 E08은 같은 상담글 consultations/posts/23005.html에 iframe.advice-widget 두 개를 사용합니다. data-slot seasonal/field의 선택자는 각각 유일하며 src는 widgets/23005-seasonal-1.html과 widgets/23005-field-1.html로 다릅니다. 마지막 leaf 선택자 div.widget-content > div.note-wrap > p.advice-message는 같지만 실제 노드와 원문이 다릅니다.

컨테이너와 두 iframe은 보이며 display:block/opacity1/양의 bounds입니다. T23 leaf는 display:none/OFFSCREEN, E08 leaf는 전각 원문과 color rgba(0,0,0,0)/HOMOGLYPH+TRANSPARENT입니다. 두 프레임이 빈 상자처럼 보이는 것은 의도한 leaf 은닉이며 레이아웃 실패가 아닙니다.

정확한 src 경로, 유일한 slot 선택자 경로, 상대 src의 세 입력은 각각 TP3/FN66/FP0입니다. E08의 각 기법을 T23 leaf에 지정하거나 T23 OFFSCREEN을 E08 leaf에 지정하면 실제 노드의 기법이 달라 TP0/FN69/FP1입니다. iframe.advice-widget만 사용하면 실제2노드와 일치하여 TP0/FN69/FP1입니다. 노드·src·선택자 개수·기법 probe와 예상/실제 수치를 independent-browser-report.json에 기록했습니다.

## query iframe과 비교 기준

Q04 calendar/view.html?crop=rice&season=winter는 calendar-rice-winter-1.html → calendar-rice-winter-2.html의2단계이며 JAMO/OFFSCREEN입니다. Q09 crop=potato&season=spring은 calendar-potato-spring-1.html의1단계이며 TRANSPARENT/OFFSCREEN입니다. 부모 query, src, 각 단계 유일 선택자, raw text, 숨김 스타일과 조상을 실제 확인했습니다.

각2기법의 정확한 경로·query순서/fragment·상대src는 TP2/FN67/FP0입니다. 다른 crop/season을 쓰면서 기존 iframe 경로를 제출하거나 틀린 iframe chain을 쓰면 해당 src가 없어 TP0/FN69/FP1입니다. 다른 query의 실제 노드로 부모 URL과 chain을 모두 바꾸면 그 노드의 기법으로 판정합니다. Q04 JAMO→Q09 또는 Q09 TRANSPARENT→Q04는 FP1이지만, 두 노드의 공유 OFFSCREEN을 정확히 지정하면 TP1/FN68/FP0입니다. 잘못된 query라고 무조건 FP를 가정하지 않고 제출한 실제 노드·기법과 대조했습니다.

기본 비교37종은 완전69정답(TP69/FN0/FP0), 일부누락, 정상FP, 다른CSS·원문차이, 중복·ID중복, 모호한 leaf/frame, 필수필드·JSON·BOM·entry_url/시간타입, 빈 findings·분모, HTTP/HTTPS·끝슬래시, query순서/값·프레임·형제, 기존1~8 및 단독/접두경로 결과를 포함합니다. 별도28종은 형제·query의 추가경로/실제노드 probe, UNKNOWN기법, is_violation문자열, 공백원문, 시간1800/1801 경계를 확인합니다. 1800초는 초과표시가 없고1801초는30분초과를 표시합니다. 빈 분모는 계산 불가입니다.

## 화면·기존 회귀·배포 경로

홈·계절표·목록·정상상담dl·관찰표·형제프레임·Q04/Q09·일반계절·자료이용·lab을1440×1000/390×844/320×844로 측정하고 캡처했습니다. 대표 화면의 제목·질문/답변·관찰표·정상문답·프레임·목록·안내를 시각검토했고 겹침·가독성 실패가 없었습니다. 긴 lab은 전체화면과 상단·비교컨트롤 viewport 캡처를 별도로 확인했습니다. 모바일 달력24실제클릭과 정상 문답6개 동작도 통과했습니다.

기존 사이트1~8 완전정답 비교는 TP40/61/68/50/60/64/71/81, 모두 FN0/FP0입니다. 사이트1의 dataset 없는 기존 score-metrics 텍스트 fallback도 실제 성공했습니다.

단독 dist origin에서69건비교/DOM62 audit/BFS54·깊이5·누락0을 확인했습니다. 로컬 브라우저 /sumgwang-test-pages/test-site-10/ 매핑에서도69건비교/DOM62 audit/대상lab404를 확인했습니다. 이는 저장소 접두경로·두자리번호 시험이며 실제 사이트10 생성이나 원격배포가 아닙니다.

코디네이터는 재빌드154파일의 동일 해시 dd90fbadabd1fa3153b2347e33aec0fc6508a2f7b79ec286f8e8c8842f7d6c5a를 보고했습니다. verifier는 빌드를 실행하지 않았으며 검사 중·종료 시 코어168파일의 내용 변경0을 독립 확인했습니다. release/ZIP은 없습니다.

## 검사 코드 수정 이력·증거·남은 범위

추가 모바일 클릭 wrapper가 처음 .calendar-table을 가정하여0개를 찾았습니다. 실제 구현의 .crop-calendar로 artifacts/mobile-interactions.mjs만 수정하고 전체24클릭/6문답 검사를 재실행해 통과했습니다. 구현·정답·기본검사 스크립트 수정은 없으며 제품 오류로 집계하지 않았습니다. artifacts/harness-adjustments.json에 이력을 남겼습니다.

- artifacts/browser-report.json: 기본37비교/DOM62/audit/BFS·기존회귀·단독/접두경로.
- artifacts/independent-browser-report.json, independent-check.mjs: 별도28비교·실제노드probe·33레이아웃·독립BFS.
- artifacts/mobile-interactions-report.json, mobile-interactions.mjs: 실제 모바일 달력24클릭/정상Q&A6개.
- artifacts/independent-static-report.json: UTF8/BOM·정답비노출·이전기관명·실제문자31검사.
- artifacts/verification-snapshot.json: baselineHead와 코어168파일 개별/그룹/전체 SHA-256.
- artifacts/independent-*-1440.png, *-390.png, *-320.png, lab-top-*.png, lab-controls-*.png, calendar-normal-QA-open-*.png: 화면 증거.

남은 로컬 검사 실패는 없습니다. 이 검증은 모집요강 기반 모의 환경 자체 검사이며 탐지 프로그램 성능이나 공식 점수를 검증하지 않습니다. verifier는 커밋·push·PR·merge·원격main·공개주소 검사를 수행하지 않았습니다. 코디네이터가 snapshot과 최종커밋 내용 일치를 확인해 verifiedCommitSha에 연결하고 이후 Git/원격 반영을 확인해야 합니다.
