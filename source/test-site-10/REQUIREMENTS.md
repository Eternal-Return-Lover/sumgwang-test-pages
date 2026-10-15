> 현재 실행·공통 구조는 [루트 README](../../README.md)를 따릅니다. 아래 사이트별 콘텐츠·시험 명세는 유지하며, 공통 실행 코드는 source/에 모으고 생성물·보고서는 tmp/에 둡니다.

# 사이트 10 요구사항과 구현 결정

공유 `AGENTS.md`, `source/test-site-request.md`, `site_builder` 역할을 따릅니다. 소유 범위는 `source/test-site-10/`입니다. 공유 파일·Git·의존성 설치·빌드·배포는 코디네이터가 담당합니다. 이번 배치의 두 번째이자 마지막 사이트이며 사이트 11은 기획하거나 시작하지 않습니다.

## 기관·정보 구조·디자인

한울시 천문과학관 별숲, siteId `hanul-astronomy`입니다. 짙은 인디고 #111b32, 시안 #6bcddd, 별빛 금색 #e9cf8c를 사용합니다. 홈은 별자리 모양의 합성 inline SVG 도해, HTML 범례, 관측 프로그램 일정, 관측노트 목록으로 구성합니다. 전시구역은 관측돔·별빛전시실·우주배움실로 나눕니다.

개별 노트는 구역·자료 분류의 사이드 메타데이터와 본문, 도해·관찰표·인용·dl 메모·독자 의견으로 작성합니다. 사이트9의 계절 달력 행렬과 질문/답변 상자를 복제하지 않습니다. lab은 기존 알고리즘·스키마·UI 명칭·레이아웃을 유지하고 밝은 인디고/시안 팔레트를 사용합니다.

기관·인물·관측노트·프로그램·광고는 합성입니다. 실제 천문 사실을 전제로 설명하지 않으며 도해는 실제 하늘·별자리와 무관하다고 표시합니다. 낮·초저녁·밤은 자료 분류이고 실제 관측시각이 아닙니다. 날씨/천문 API·예약·결제·개인정보 수집·연락 기능이 없습니다. 외부 시험은 .invalid를 사용합니다. 대상 title·class·id에는 정답 ID·기법 enum·사례 라벨을 넣지 않습니다.

## 수량 단위

61개 콘텐츠 URL = 정적 52개 + 쿼리 9개입니다. 정적 광고 36개 + 쿼리 광고 9개 = 광고 포함 45URL, 정상 16URL입니다. 기존 글에 추가 광고 9요소를 넣어 광고 54요소 + 정상 16요소 = 총 70DOM입니다. 기대 78건 = HOMOGLYPH 18 + JAMO 20 + TRANSPARENT 19 + OFFSCREEN 21이며 정의에서 산출합니다.

정적 콘텐츠 HTML 52개와 공용 query HTML 1개를 합쳐 콘텐츠 HTML 53개입니다. 구조 14개 + 프레임 보조 13개 + lab 1개을 포함한 전체는 81HTML입니다. 공개 HTML 80개 + 자산 4개 + robots 1개 = 대상 85파일입니다. 깊은 노트 1개를 제외한 60행을 13행씩 5쪽에 표시하며 마지막은 8행입니다. 구조·프레임·lab을 시나리오 수에 합산하지 않습니다.

| 범위 | 구현 |
| --- | --- |
| HOMOGLYPH | 전각·키릴·숫자 치환·혼합 |
| JAMO | 호환/조합 자모·NFD·일부 음절 분해 |
| TRANSPARENT | 투명 color·opacity 0·동일 배경색·부모 영향·SVG g opacity 0 |
| OFFSCREEN | 음수 좌표·font 0/1px·display none·부모 영향·SVG text font 0 |
| 복합 | 전각+투명·자모+숨김·전각+숨김·자모+투명·전각+자모·4종 중첩 |
| 정상 16 | 접근성·숨은 메뉴·전각 전시 코드·자모/NFD 교육·예방·다국어·정상 프레임·보이는 SVG·아래 본문·정상 메타데이터 |
| 위치 | 본문 p·반복 메모·td·dl/dd·blockquote·클래스 없는 p·독자 의견·프레임 leaf·SVG text |

## SVG와 template

T07·T08·N10은 실제 HTML body 안의 SVG text입니다. 네임스페이스는 http://www.w3.org/2000/svg이고 원문은 정규화 전 textContent로 확인합니다. 이미지 OCR이 아닌 DOM 수집 범위임을 manifest와 README에 명시합니다.

T07은 전각 원문과 조상 g opacity 0으로 실제 paint를 숨깁니다. SVG에 color:transparent만 주어 fill이 남는 방식은 사용하지 않습니다. T08은 자모 원문과 text 자체 font-size0입니다. 정상 N10은 보이는 fill·양의 bounds·실제 font 크기를 가지며 findings에 포함하지 않습니다. SVG 내부 a 링크는 사용하지 않고 HTML a[href] 범례로 이동하여 공통 크롤러를 변경하지 않습니다.

T30은 실제 template.content.cloneNode(true)를 2100ms 후 연결된 문서에 삽입합니다. 초기 document 선택자는 0개, 분리된 template content의 원문은 1개, 삽입 후 유일한 연결 노드는 1개이며 원본 fragment는 보존됩니다. 단순 innerHTML 지연과 별도로 기본 검사합니다.

## 탐색·조건·프레임·지연

- T34의 observations/2026/autumn/north/notebook/read.html은 시작부터 6개의 링크입니다. 마지막 notebook/index.html의 링크는 850ms 후 생깁니다. 홈·목록·검색 데이터·공통 nav에 직접 링크를 넣지 않습니다.
- T27 600ms, T28 1300ms, T30 2100ms, T29 2800ms, 정상 N12 900ms를 고정합니다.
- T33은 외부 iframe 500ms + 마지막 leaf 1200ms = nominal 1700ms입니다. 최대 nominal 총지연은 2800ms입니다.
- 일반 T31 2단계, T32 3단계, T33 2단계, 정상 N08 2단계를 제공합니다.
- zone 3개 값 dome/exhibit/workshop × session 3개 값 day/evening/night = 9개 쿼리입니다. 값별 제목·설명·일부 기법이 다릅니다.
- Q02 dome/evening은 1단계, Q09 workshop/night는 3단계입니다. 조건별 src를 사용하고 쿼리 부모 URL과 바깥부터 frames.selector/src를 기록합니다. 프레임을 독립 시나리오로 재집계하지 않습니다.
- 파라미터 순서·fragment는 중복, 값은 보존합니다. pure static·상대 링크/자산/프레임·실제 a[href]·고정 지연을 사용하며 rewrite·무작위·무한 경로가 없습니다.

## 기본 검사와 조판

기본 검사 스크립트는 정의/manifest에서 수량·기법·검색어·목록 행·query·프레임·지연·깊이를 유도합니다. DOM 70 / BFS 61URL / 깊이 6 / 쿼리 9, SVG 네임스페이스·원문·조상 opacity·text font 0·정상fill/bounds, template 초기 부재 / 2100ms 복제, 일반/정상/지연/query프레임을 확인하도록 작성합니다.

완전 정답·누락·정상 FP·중복·유일한 다른 CSS·모호한 위치·필드·JSON·BOM·시간·빈 findings·query/frame 비교와 검색·필터·결합 검색·초기화·빈 결과·페이지·프로그램 링크·clipboard·두 다운로드를 포함합니다. 잘못된 query frame 조건·다른 실제 노드·중간 단계 누락은 실제 제출 DOM을 해석하고 manifest의 노드/기법과 대조하여 기대값을 산출합니다. helper는 모듈 범위에서 배포 base/cases/total을 명시적으로 받습니다.

1440×1000, 390/320×844에서 내부 도해·프로그램·기록·표·메타데이터·프레임·lab을 캡처하고 가로 넘침을 확인합니다. 모바일 제목은 word-break:keep-all, 내용 열은 minmax(0,1fr), 프로그램 상태·구역과 목록 날짜는 별도 행에 둡니다. 단독 dist·실제 사이트 10·접두 경로/가상 12·대상 lab404·기존 1~9 완전 정답 회귀와 legacy 1 텍스트 score fallback을 유지합니다. 가상 12는 브라우저 매핑이며 새 사이트 제작이 아닙니다.

site_builder는 소스 문법·정의 수량만 확인하고 실제 브라우저는 독립 verifier가 수행합니다. 기본 검사는 공식 평가가 아니며 미실행 항목을 통과로 표시하지 않습니다. 기존 폴더 형식을 유지하고 release·ZIP은 추가하지 않습니다.
