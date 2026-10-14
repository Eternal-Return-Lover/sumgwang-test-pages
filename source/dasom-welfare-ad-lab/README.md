# 다솜시 통합복지센터 서로마루

사이트 7의 모집요강 기반 모의 테스트 환경입니다. 기관·사업·작성자·광고는 합성 자료입니다. 실제 기관이나 공식 심사 사이트와 무관하며 실제 신청·상담 접수·연락·개인정보 수집·거래 기능이 없습니다.

## 실행

저장소 루트에서 코디네이터가 빌드와 배포 동기화를 수행합니다.

```powershell
node source/manage.mjs build 7
node source/manage.mjs check
node --test source/site-tools.test.mjs
```

빌드 후 프로젝트 폴더에서 `npm start` 또는 `START_LOCAL.cmd`를 실행합니다. 기본 포트는 등록 정보에 따른 4179입니다.

- 로컬 시작: `http://127.0.0.1:4179/index.html`
- 로컬 검증실: `http://127.0.0.1:4179/lab/index.html`
- 저장소 시작 경로: `test-site-7/index.html`
- 저장소 검증실: `source/dasom-welfare-ad-lab/dist/lab/index.html`

사이트 런타임은 외부 의존성 없는 정적 HTML/CSS/JavaScript입니다. 개발 브라우저 검사는 Playwright 1.63.0과 설치된 Chrome을 사용하며 `CHROME_PATH`로 실행 파일을 지정할 수 있습니다.

```powershell
npm run check
npm run verify
```

검사는 빌드된 파일을 읽고 동적 포트의 임시 정적 서버를 시작·종료합니다. 실제 결과, 비교 입력, 스크린샷은 `artifacts/`에 기록합니다. 독립 검증 상태는 `VERIFICATION.md`에서 확인합니다.

## 규모와 파일 단위

| 구분 | 수량 |
| --- | ---: |
| 콘텐츠 시나리오·고유 URL | 60 |
| 정적 URL / 쿼리 URL | 54 / 6 |
| 광고 포함 URL / 정상 URL | 44 / 16 |
| 광고 요소 / 정상 요소 | 52 / 16 |
| 기대 검출 건수 | 71 |
| HOMOGLYPH / JAMO | 15 / 17 |
| TRANSPARENT / OFFSCREEN | 20 / 19 |
| 실제 콘텐츠 HTML | 55 |
| 구조 HTML / iframe 보조 HTML / 검증실 HTML | 15 / 9 / 1 |
| 전체 HTML / 대상 공개 HTML | 80 / 79 |
| 대상 공개 파일 | 84: HTML 79 + 자산 4 + robots 1 |
| 자료 목록 | 59행, 10행씩 6페이지, 마지막 9행 |

추가 광고 8요소는 기존 글에 들어갑니다. 이 중 E07은 T28의 둘째 형제 iframe에 있습니다. 시나리오·요소·기법별 검출 수는 다릅니다. 쿼리 6개는 `materials/view.html` 한 파일을 공유합니다. 홈·목록·안내·자료철·프레임·검증실은 60개 시나리오에 합산하지 않습니다. 수량 기준은 `src/fixtures.mjs`이며 빌드가 `reference/counts.json`을 산출합니다.

## 탐색 범위와 대기

`index.html`에서 실제 a[href]와 iframe을 따라 탐색합니다. T34의 `resources/2026/community/autumn/notes/read.html`은 시작 깊이 0부터 6개의 링크가 필요합니다. 직전 메모 자료철에서 링크가 1200ms 뒤 생성됩니다. 해당 글은 목록·검색·홈의 직접 링크에서 제외하여 우회 경로가 없습니다.

- T25 의견 800ms, T38 의견 1200ms, T26 의견 2200ms, T27 의견 2800ms.
- N12 정상 접근성 상태 1600ms.
- T30 외부 iframe 1200ms + 마지막 프레임 안 의견 800ms = nominal 2000ms. 문서 로딩 시간이 추가될 수 있습니다.
- T28은 1단계, T29/T30/N08은 2단계입니다. E07의 둘째 형제 프레임은 2단계입니다.
- 최대 nominal 삽입 지연은 2800ms입니다. 권장 viewport 1440×1000, 모바일 검사 390×844와 320×844. 페이지별 3.5초 이상 대기한 뒤 링크·프레임·동적 DOM을 수집합니다.

쿼리는 `program=care/learning/access` × `audience=adult/senior`입니다. 서비스와 대상을 함께 유지해야 6개 본문을 구분합니다. 파라미터 순서와 fragment는 중복 처리하고 쿼리 값은 보존합니다.

프레임 보조 문서는 독립 시나리오로 재집계하지 않고 부모 URL과 바깥부터 이어지는 frames로 기록합니다. T28의 첫 프레임은 `iframe.service-widget`, 둘째는 `iframe.related-widget → iframe.detail-widget`입니다. 서로 다른 src 파일과 유일한 선택자를 사용합니다. 자료함과 iframe은 보이는 상태이며 숨김 기법은 내부 leaf에 명시합니다.

같은 원점·배포 경로의 HTML만 순회하며 `lab/`, `widgets/`의 독립 URL, `.invalid` 외부 주소는 제외합니다. 새 URL이 없으면 종료합니다. 무작위·무한 페이지는 없습니다.

## 검증실과 배포

공통 lab 스키마·알고리즘·UI 명칭을 유지합니다. 필터·검색·주소 복사·다운로드·전수 DOM 자체 검사·BFS·결과 비교를 제공합니다. 파일은 브라우저 안에서 처리합니다. 다른 CSS도 같은 실제 유일 요소면 인정하며 중복·모호한 선택자·필드/JSON/BOM 오류·쿼리·프레임을 구분합니다. 원문은 필수 필드지만 문자열 차이만으로 위치·기법 정답을 오답 처리하지 않습니다. 예상 결과의 0초는 합성 예시이며 실측 시간이나 공식 점수가 아닙니다.

검사 기대값은 정의와 manifest에서 산출합니다. 68요소 DOM, BFS 60URL, 깊이 6, 모든 고정 지연, 형제·중첩 프레임, 쿼리, 검색·초기화·빈 결과·페이지네이션, 공통 비교 입력, 형제 프레임의 올바른/다른 경로, 단독 dist·접두 경로·두 자리 번호·lab404를 검사합니다. 내부 대상 자료·지원 절차·상담 dd·서비스 목차·목록·형제 프레임을 390/320px에서 확인하며 기존 사이트 1~6의 완전 정답 회귀와 사이트 1의 텍스트 score fallback을 보존합니다. 로컬 접두 경로 매핑과 실제 원격 배포는 구분합니다.

`src/`는 정의·화면·lab, `scripts/`는 생성기·서버·검사, `dist/`는 정적 결과, `reference/`는 정답·수량, `artifacts/`는 실제 증거입니다. `test-site-7/`에는 대상 파일만 배포하고 검증실·정답·소스 링크를 노출하지 않습니다. 독립 dist 호스팅에서 정답 비공개가 필요하면 lab을 제외합니다. 분리는 접근 제어가 아닙니다. 기존 형식을 유지하며 release·ZIP을 추가하지 않습니다.
