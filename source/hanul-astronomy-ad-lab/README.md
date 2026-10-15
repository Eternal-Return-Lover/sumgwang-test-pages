# 한울시 천문과학관 별숲

별자리 전시 도해·관측 프로그램·전시구역·관측노트를 제공하는 가상 공공과학관입니다. siteId는 `hanul-astronomy`입니다. 모집요강 기반 모의 테스트 환경이며 실제 기관이나 공식 심사 사이트와 무관합니다. 도해·자료·인물·광고는 합성입니다. 실제 천문 사실·관측시각·날씨·예약·결제·연락을 제공하지 않습니다.

## 실행

프로젝트 폴더에서 Node.js로 실행합니다. 의존성 설치와 빌드·배포 동기화는 코디네이터가 담당합니다.

```sh
npm run build
npm start
```

기본 서버는 `dist/`를 제공합니다. 대상 주소는 `http://127.0.0.1:4182/`, 검증실은 `http://127.0.0.1:4182/lab/index.html`입니다. Windows에서는 `START_LOCAL.cmd`도 사용할 수 있습니다. 저장소 루트의 생성 명령은 `node source/manage.mjs build 10`이며 대상 배포본은 `test-site-10/`입니다.

```sh
npm run check
npm run verify
```

`verify`는 **기본 검사**입니다. Playwright 1.63.0과 설치된 Chrome을 사용하며 필요하면 `CHROME_PATH`를 지정합니다. 동적 빈 포트의 정적 서버를 시작·종료하고 비교 입력·DOM·스크린샷을 `artifacts/`에 기록합니다. 실제 탐지 프로그램 성능이나 공식 평가 점수를 측정하지 않습니다. 독립 검증 상태는 `VERIFICATION.md`에서 확인합니다.

## 수량과 파일 단위

| 구분 | 수량 |
| --- | ---: |
| 콘텐츠 시나리오·고유 URL | 61 |
| 정적 URL / 쿼리 URL | 52 / 9 |
| 광고 포함 URL / 정상 URL | 45 / 16 |
| 광고 요소 / 정상 요소 | 54 / 16 |
| 전수 DOM 검사 요소 | 70 |
| 기대 검출 건수 | 78 |
| HOMOGLYPH / JAMO | 18 / 20 |
| TRANSPARENT / OFFSCREEN | 19 / 21 |
| 실제 콘텐츠 HTML | 53 |
| 구조 HTML / iframe 보조 HTML / 검증실 HTML | 14 / 13 / 1 |
| 전체 HTML / 대상 공개 HTML | 81 / 80 |
| 대상 공개 파일 | 85: HTML 80 + 자산 4 + robots 1 |
| 관측노트 목록 | 60행, 13행씩 5페이지, 마지막 8행 |

정적 광고 URL은 36개, 정상 URL은 16개이며 쿼리 9개는 모두 광고 포함 URL입니다. 같은 글에 추가한 광고 9요소는 URL을 늘리지 않습니다. 복합 요소는 기법별로 1건입니다. 쿼리 9개는 `programs/view.html` 한 파일을 공유하므로 실제 콘텐츠 HTML은 53개입니다. 구조·메뉴·프레임·검증실은 61개 시나리오에 합산하지 않습니다. 기준은 `src/fixtures.mjs`이며 빌드가 `reference/counts.json`을 산출합니다.

## 전시 도해와 프로그램

홈은 어두운 인디고·시안·별빛 금색의 합성 별자리 도해와 관측 프로그램 목록으로 시작합니다. 전시구역은 관측돔·별빛전시실·우주배움실의 설명과 HTML 범례 링크로 이어집니다. 낮·초저녁·밤은 자료 분류이며 실제 운영시각이 아닙니다.

프로그램 쿼리는 `zone=dome/exhibit/workshop` × `session=day/evening/night`의 9개 조건입니다. 제목·설명·기법 구성이 다릅니다. Q02 dome/evening은 1단계, Q09 workshop/night는 3단계 iframe입니다. 조건별 `widgets/program-<zone>-<session>-<depth>.html`을 사용하고 manifest는 쿼리가 있는 부모 URL과 바깥부터의 정확한 frames를 기록합니다. 공개 런타임에는 조건 키와 완성된 HTML만 직렬화하며 ID·정답 기법 enum은 넣지 않습니다.

관측노트 목록은 제목 검색·전시구역 필터·결합 검색·초기화·빈 결과·페이지네이션을 제공합니다. 개별 노트는 구역·자료 분류 메타데이터와 본문, 관찰표·인용·dl 메모·독자 의견으로 구성합니다.

## SVG와 template의 실제 DOM

T07·T08·N10은 HTML body 안의 inline SVG `text` 노드입니다. 이미지 OCR 시험이 아닙니다. 원문·CSS 선택자·네임스페이스·computed style·조상·bounds를 실제 DOM에서 수집해야 합니다.

- T07: 전각 원문과 조상 `g`의 `opacity:0`. SVG fill을 유지한 채 실제 paint를 숨깁니다.
- T08: 자모 원문과 `text` 자체의 `font-size:0px`.
- N10: 정상 도해 안내. 보이는 fill과 양의 bounds를 가지며 광고 정답에 포함하지 않습니다.

SVG 내부에는 a 링크를 넣지 않습니다. 이동은 SVG 밖의 실제 HTML a[href] 범례로 제공합니다. SVGAnimatedString.href 처리를 위해 공통 크롤러를 바꾸지 않습니다.

T30은 2100ms 후 `template.content.cloneNode(true)`를 실제 문서에 삽입합니다. 초기 document 선택자는 일치하지 않지만 template의 분리된 content에는 원문이 있습니다. 삽입 후 실제 연결된 노드가 유일하게 일치하고 원본 fragment는 보존됩니다.

## 깊은 수첩과 고정 지연

T34의 `observations/2026/autumn/north/notebook/read.html`은 index → observations → 2026 → autumn → north → notebook → read로 링크 6개를 따라 발견합니다. 마지막 링크는 notebook/index.html에서 850ms 후 생성됩니다. 이 글은 홈·목록·검색 데이터·공통 nav의 직접 링크에서 제외합니다.

- T27 600ms, T28 1300ms, T30 template 2100ms, T29 2800ms.
- 정상 N12는 900ms 후 접근성 상태를 삽입합니다.
- T33은 iframe 500ms + 마지막 프레임 leaf 1200ms = nominal 1700ms입니다. 문서 로딩 시간이 추가될 수 있습니다.
- 일반 프레임 T31 2단계, T32 3단계, T33 2단계, 정상 N08 2단계입니다.
- 최대 nominal 삽입 지연은 2800ms입니다. 페이지마다 3.5초 이상 기다린 뒤 새 링크·동적 노드·하위 프레임을 다시 확인합니다.

## 검증실과 기본 검사

공통 검증실의 스키마·UI 명칭·알고리즘을 유지하며 밝은 테마로 제공합니다. 필터·검색·주소 복사·정답표/예상 결과 다운로드·DOM 자체 검사·BFS·result.json 비교를 사용합니다. 업로드 파일은 브라우저 안에서 처리합니다. 다른 CSS도 같은 실제 유일 요소면 인정하며 중복·모호한 위치·필드/JSON/BOM 오류·쿼리·프레임을 구분합니다. 원문은 필수 필드이며 원문 차이만으로 위치·기법 정답을 오답 처리하지 않습니다. 예상 결과의 0초는 합성 예시입니다.

기본 검사는 정의/manifest에서 수량·기법·검색어·목록 행·프레임·지연·깊이를 유도합니다. DOM70, BFS61/깊이6, query9, SVG2양성+정상1, template 초기 부재/복제, 일반·정상·지연·쿼리 프레임, 검색·필터·초기화·빈 결과·페이지·프로그램 링크와 clipboard·다운로드를 확인하도록 작성했습니다.

비교 입력은 완전 정답·누락·정상 FP·중복·다른 CSS·모호한 위치·필수 필드·기법 enum·타입·JSON·BOM·시간·빈 findings·쿼리·iframe을 포함합니다. 잘못된 query iframe 조건, 다른 조건의 실제 노드, 한 단계 누락의 기대값은 제출 URL의 실제 DOM을 해석하고 해당 manifest 노드·기법과 비교하여 산출합니다. helper에는 배포 base·cases·total을 명시적으로 전달합니다.

1440×1000, 390/320×844에서 홈·전시 도해·프로그램 일정·관측노트·관찰표·메타데이터·프레임·lab을 캡처합니다. 단독 dist, 실제 두 자리 사이트10, 저장소 접두 경로/가상12 매핑, 대상 lab404, 기존 사이트1~9 완전 정답 회귀와 구형1의 텍스트 score fallback을 포함합니다. 가상12는 로컬 브라우저 경로 시험이며 사이트12 제작이나 원격 배포가 아닙니다.

`src/`는 정의·화면·lab, `scripts/`는 생성기·서버·기본 검사, `reference/`는 정답·수량, `dist/`는 생성 결과, `artifacts/`는 실제 실행 증거입니다. `test-site-10/`에는 대상만 배포하고 lab·정답·소스 링크를 노출하지 않습니다. 독립 dist 호스팅에서 정답 비공개가 필요하면 lab을 제외합니다. 파일 분리는 접근 제어가 아닙니다. pure static·상대 링크·고정 지연을 사용하며 외부 runtime/API·실제 거래 기능·release·ZIP은 없습니다.
