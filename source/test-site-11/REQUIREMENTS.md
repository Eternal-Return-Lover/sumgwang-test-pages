# 생활나침반 구현 명세

## 범위와 출처

사이트 11, `saebom-consumer`, 「새봄시 소비자안전센터 생활나침반」을 구현합니다. 사용자 첨부 제작 요청과 저장소의 `AGENTS.md`, `source/test-site-request.md`를 따릅니다. 최신 요청의 11개 광고 카테고리는 팀 자체 모의 테스트 범위입니다. 공식 심사 사이트·분류 체계·환산 점수를 재현한다고 표시하지 않습니다.

사이트는 크림·차콜·코럴 색상, 영수증 모티프의 메인 시각물, 분야별 가로 탐색, 편집형 상담 목록, 문장 읽기 본문과 측면 정보로 구성합니다. 이전 사이트의 천문 도해·농업 달력·기록 검색을 재명명하지 않았습니다. 제목·작성자·본문은 소비자 상담·제품 표시·금융 문장·온라인 안내의 새로운 합성 자료입니다.

## 수량과 집계 단위

| 단위 | 정의에서 산출한 값 | 구분 |
| --- | ---: | --- |
| 콘텐츠 시나리오·고유 부모 URL | 65 | 정적 59 + 쿼리 값별 6 |
| 광고 포함 부모 URL | 43 | 양성 44개 중 두 요소가 같은 부모에 있음 |
| 정상 대조 부모 URL | 22 | 정상 요소 22개와 각각 대응 |
| 광고 요소 | 44 | 카테고리마다 4개 |
| 정상 요소 | 22 | 카테고리마다 예방·교육 1개와 정상 공공정보 1개 |
| 전체 정답 대상 DOM 요소 | 66 | iframe 내부 요소도 부모 URL에 귀속 |
| 복합 기법 요소 | 11 | 카테고리마다 1개 |
| 기대 findings | 55 | 복합 요소는 기법별로 각각 한 건 |
| 목록 표시 행 | 64 | 깊은 기록 1개는 목록·검색에서 제외 |
| 목록 페이지 | 6 | 페이지당 12개, 마지막 4개 |
| 최대 실제 링크 깊이 | 6 | 마지막 발견 링크는 900ms 후 생성 |

HOMOGLYPH 14건, JAMO 13건, TRANSPARENT 14건, OFFSCREEN 14건입니다. 집계의 원본은 `src/fixtures.mjs`이며 generator가 manifest를 기록한 뒤 공통 `writeLab(site)`의 반환값을 사용합니다. 별도의 최종 집계 알고리즘을 복제하지 않습니다.

물리 파일 수는 콘텐츠 URL 수와 다릅니다. 생성 규칙상 대상 HTML은 **86개**입니다: 정적 콘텐츠 59개 + 쿼리 공용 HTML 1개 + 홈·목록·분야·자료실·이용 안내·기록철 HTML 15개 + iframe 보조 HTML 11개. 자산 4개와 robots 1개를 더하면 대상 파일 91개입니다. 단독 생성물의 검증실 HTML을 더한 HTML 수는 87개입니다. 실제 빌드·재빌드·배포 일치 결과는 [VERIFICATION.md](VERIFICATION.md)에 기록합니다. iframe 보조 문서를 독립 콘텐츠 URL이나 추가 검출로 세지 않습니다.

## 주제별 구성

| 코드 | 합성 광고의 주된 대상 | 양성 | 정상 | findings | 복합 요소 |
| --- | --- | ---: | ---: | ---: | --- |
| GAMBLING | 판돈·환전을 내건 도박 회원 모집 | 4 | 2 | 5 | T01 |
| DRUG | 금지 마약류 판매·구매자 모집 | 4 | 2 | 5 | T06 |
| PHARMACEUTICAL | 처방 대상 전문의약품의 확인 없는 판매 | 4 | 2 | 5 | T11 |
| FOOD_HEALTH | 일반 식품·건강식품의 허위 치료 보장 판매 | 4 | 2 | 5 | T16 |
| COSMETIC | 바르는 화장품의 치료·확정 변화 보장 판매 | 4 | 2 | 5 | T17 |
| MEDICAL_DEVICE | 확인 자료가 없는 합성 기기의 만능 치료 판매 | 4 | 2 | 5 | T22 |
| PRIVATE_LOAN | 미등록 합성 대부업자의 대출·이자 약정 모집 | 4 | 2 | 5 | T27 |
| INVESTMENT_SCAM | 실체 없는 사업의 허위 원금·수익 보장 모집 | 4 | 2 | 5 | T32 |
| COUNTERFEIT | 복제 상표와 포장을 붙인 가품 판매 | 4 | 2 | 5 | T33 |
| IDENTITY_TRADE | 범죄용 계좌·접근매체·불법 개인정보 거래 모집 | 4 | 2 | 5 | T38 |
| PROSTITUTION | 성인 대상 대가성 성매매의 비노골적 알선·모집 | 4 | 2 | 5 | T43 |

각 범주에서 네 기법을 모두 사용하며, 복합 기법을 담당하는 순서를 범주마다 바꿉니다. 본문 메모·표·인용·dl·반복 문단·클래스 없는 문단·동적 댓글·프레임을 순환 배치해 특정 주제와 단일 위치를 고정하지 않습니다. 양성 문장 44개는 단어만 바꾼 공통 문장이 아니라 각 광고의 의도·문장 구조·길이를 달리했습니다.

`DRUG`는 합성 설정의 금지 마약류, `PHARMACEUTICAL`은 처방 대상 전문의약품으로 구분합니다. 일반 식품·건강식품과 전문의약품, 화장품과 기기, 대출 알선과 투자금 모집 역시 실제 원문과 같은 설정을 `annotationReason`에 기록합니다. 특정 단어·은닉 스타일만으로 불법 여부를 정하지 않습니다. 법정 금리·허가 요건·처벌·의학적 사실은 단정하지 않습니다.

정상 사례는 관련 키워드를 쓰는 예방·교육·피해지원 안내와 정상적인 공공 교육·자료실 안내를 범주별로 하나씩 둡니다. 일부 정상 예방 문장은 숨김 스타일을 가지며, 정상 전각 자료 번호(N04), 한글 자모 교육(N10), 정상 iframe(N08), 화면 아래 본문(N22)을 포함합니다. `relatedCategory`는 비교용 연결이며 정상의 불법 판정이 아닙니다.

## 정답과 공개 데이터의 분리

manifest root에 `categoryProfile: "all-11-v1"`을 둡니다. 양성의 `primaryCategory`·`annotationReason`, 정상의 `relatedCategory`·`normalReason`·빈 `techniques`를 정의에서 `register`로 명시 전달합니다. 공통 집계·정적 검사·검증 API가 이 필드를 그대로 사용합니다. counts의 범주별 양성·정상·기법 교차 합계는 manifest에서 자동 생성합니다.

대상 HTML의 제목·class·id·data·주석과 공개 JS에는 사례 ID·카테고리 코드·기법 enum·정답 근거를 내보내지 않습니다. 목록 JS에는 path/title/desk/deskName/author/date만 전달합니다. 쿼리 JS에는 공개 조건 `desk|view`와 완성 HTML만 직렬화하며 fixture 객체를 통째로 넘기지 않습니다. 프레임의 `data-stream="notice"`, `data-stream="reply"`는 자료함 문맥을 구분하는 공개 값입니다.

`expected-result.json`의 최상위 meta/findings, `meta.topic="TOPIC"`, 여섯 finding 필드(id/url/is_violation/location/evidence_text/technique)를 유지합니다. 예측 category 필드를 추가하지 않습니다. categorySummary는 정답 주제별 TP/FN의 관측 집계이며 분류 정확도는 평가 미지원입니다. 정상·미해결 오탐을 같은 페이지의 광고 주제로 추정하지 않습니다.

## 링크·쿼리·프레임·지연

쿼리는 `topics/view.html?desk=<online|goods|money>&view=<note|letter>`의 3×2 분기입니다. T03/T06/T11/T14/T27/T30이 각각 다른 본문을 갖습니다. T06은 2단계 iframe, T30은 지연 2단계 iframe이며 쿼리 값마다 보조 src가 다릅니다. 부모 URL에는 쿼리를 유지합니다. 분야 목록에 파라미터 순서를 바꾸고 fragment를 붙인 실제 링크도 둡니다.

일반 T19는 3단계, 정상 N08은 1단계 프레임입니다. T33 부모 글에는 같은 `iframe.reader-panel` 클래스와 같은 leaf 선택자를 쓰는 형제 프레임 두 개가 있습니다. T33은 `data-stream="notice"`로 1단계, T34는 `data-stream="reply"`로 2단계이며 src와 실제 DOM 노드·기법이 다릅니다. 컨테이너는 보이는 상태이고 은닉은 leaf 또는 명시된 조상에 적용합니다. manifest src는 사이트 base 기준이고, 내부 프레임 HTML src는 현재 widgets 문서 기준 상대 파일명입니다. 결과 location은 부모 URL과 정확한 절대 src 체인을 사용합니다.

| 정의 키 | 삽입 방식 | 고정 지연 |
| --- | --- | ---: |
| T04 | 시민 메모 DOM 생성 | 650ms |
| T08 | 시민 메모 DOM 생성 | 1200ms |
| T16 | 시민 메모 DOM 생성 | 2800ms |
| T24 | template.content.cloneNode로 메모 삽입 | 1800ms |
| T30 | 바깥 프레임 생성 + leaf 생성 | 650 + 900 = 1550ms |
| N05 | 정상 메모 DOM 생성 | 1000ms |
| 깊은 기록 마지막 링크 | 기록수첩에서 실제 a href 생성 | 900ms |

최대 정답 요소 지연은 2800ms입니다. iframe 로딩 여유를 고려해 페이지당 3.5초 이상 대기를 권장합니다. 무작위 교체·무한 페이지·외부 runtime은 없습니다. T24는 초기 document 선택자에 없고 template 내부 원형을 복제한 뒤 실제 DOM에 생깁니다.

T40 경로는 `records/2026/autumn/household/notebook/read.html`입니다. 홈 → records/index → 2026/index → autumn/index → household/index → notebook/index → read의 6개 실제 링크를 거칩니다. 마지막 링크는 900ms 후 생성됩니다. 홈·목록·검색 데이터·공통 nav에 이 글의 직접 링크를 넣지 않아 짧은 우회가 없습니다. 탐색은 같은 출처·대상 base의 유한 HTML 링크를 따르고 query 값은 구분하되 순서·fragment는 중복 통합합니다. widgets는 프레임으로 열며 독립 콘텐츠로 다시 탐색하지 않습니다.

## 안전한 합성과 실행 구조

기관·인물·문장·상품·사업자는 합성입니다. 실제 연락처·계좌·인증정보·개인정보·거래 경로·결제·예약·모집 기능은 없습니다. 검색 입력만 로컬 DOM을 갱신하며 외부 전송하지 않습니다. 외부 참고 링크는 `saebom-reading.invalid`입니다. 마약류 문구에는 제조·복용·유통 실행 정보를 넣지 않았고 성매매 문구는 성인 대상의 비노골적인 합성 알선 광고로 한정했습니다.

고유 원본은 fixtures, generator, public CSS, lab HTML/theme, 기본 browser-check와 이 문서입니다. 공통 server·dependencies·engine·schema·dashboard를 복제하지 않습니다. build는 `siteForProject`/`buildRootFor`/`writeLab`/`publishSite`를 사용하며 생성물은 tmp/build와 test-site-11에 분리합니다. 검증실·reference·source 링크를 대상 내부에 넣지 않습니다. release·ZIP·사이트별 package/node_modules/dist/artifacts는 추가하지 않습니다. 새 lab HTML은 `../../shared/lab.js?v=categories-1`을 사용해 주석 지원 엔진의 배포 캐시를 구분합니다.

## 기본 검사와 독립 검증

`scripts/browser-check.mjs`는 정의와 manifest/counts의 일치, 11개 주제의 4/2/5 및 네 기법, 목록·제목 검색·분야 필터·초기화·빈 결과·페이지네이션, 쿼리 값·순서·fragment, 형제 프레임·상대 src, template·지연 프레임, 실제 깊은 링크, JavaScript 없는 초기 탐색을 확인하는 사이트 고유 기본 검사입니다. 1440×1000과 390/320×844에서 홈·목록·분야·자료실·이용 안내·표·dl·프레임·기록 화면의 넘침과 스크린샷을 기록합니다. 스크린샷 생성 자체를 육안 검토 통과로 표시하지 않습니다. 공통 서버를 실행하고 공유 Promise API를 소비하며 결과 HTML을 긁거나 판정 엔진을 복제하지 않습니다.

전체 66개 DOM 원문·스타일·bounds, BFS 65URL/깊이6, 완전 정답·누락·정상 FP·중복·동등/모호 선택자·필드·JSON/BOM·시간·쿼리/프레임 오류, 업로드·다운로드·클립보드, 카테고리 상세·필터·미분류 FP, 기존1~10 호환, 단독·접두·두 자리 경로와 CSS 로딩은 공통 검사와 별도 독립 검증에서 실제 확인합니다. `VERIFICATION.md`는 독립 검증자가 실제 증거를 바탕으로 작성하며 총괄의 전체 회귀 결과를 함께 기록합니다. 운영 배포·main 반영·Pages 확인은 총괄 범위입니다.