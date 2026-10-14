# 보람시 역사박물관 기억마루

사이트 4의 모집요강 기반 모의 테스트 환경입니다. 기관·작성자·전시·광고는 합성 자료입니다. 실제 기관·공식 심사 사이트와 무관하며 신청·거래·연락 기능이 없습니다.

## 실행

Node.js로 저장소 루트에서 코디네이터가 빌드합니다.

```powershell
node source/manage.mjs build 4
node source/manage.mjs check
node --test source/site-tools.test.mjs
```

빌드 후 이 프로젝트에서 `npm start` 또는 `START_LOCAL.cmd`를 실행합니다. 기본 포트는 등록 정보에 따른 4176입니다.

- 로컬 시작: `http://127.0.0.1:4176/index.html`
- 로컬 검증실: `http://127.0.0.1:4176/lab/index.html`
- 저장소 시작: `test-site-4/index.html`
- 저장소 검증실: `source/boram-museum-ad-lab/dist/lab/index.html`

사이트 런타임은 순수 정적 HTML/CSS/JavaScript이며 의존성 설치가 필요 없습니다. 브라우저 검사에는 개발 의존성 Playwright 1.63.0과 설치된 Chrome을 사용합니다. `CHROME_PATH`로 실행 파일을 지정할 수 있습니다.

```powershell
npm run check
npm run verify
```

검사 스크립트는 임시 정적 서버를 시작·종료하고 `artifacts/browser-report.json`·스크린샷·비교 입력을 기록합니다. 빌드된 배포본과 정답표를 읽으므로 빌드 후 실행해야 합니다. 실제 검증 상태는 `VERIFICATION.md`에서 확인합니다.

## 수량

| 구분 | 정의에서 산출한 수량 |
| --- | ---: |
| 콘텐츠 시나리오·고유 URL | 48 |
| 광고 포함 콘텐츠 URL / 정상 콘텐츠 URL | 36 / 12 |
| 광고 요소 / 정상 요소 | 40 / 12 |
| 기대 검출 건수 | 50 |
| HOMOGLYPH / JAMO | 10 / 12 |
| TRANSPARENT / OFFSCREEN | 14 / 14 |
| 실제 콘텐츠 HTML 파일 | 45 |
| 쿼리별 URL / 공통 HTML 파일 | 4 / 1 |
| 카드 목록 | 6페이지, 9개씩, 마지막 2개 |

추가 광고 4요소는 기존 글에 들어갑니다. 시나리오·요소·기법별 검출 수는 서로 다릅니다. 홈·목록·안내·연표·iframe 보조 문서는 시나리오 수에서 제외합니다. 기준은 `src/fixtures.mjs`이며 빌드가 `reference/counts.json`을 산출합니다.

## 탐색 범위

`index.html`에서 실제 링크와 프레임을 따라 탐색합니다. 가장 깊은 기록 `collection/1900/market/photos/ledger/read.html`은 최소 6개의 링크가 필요하며, 직전 장부에서 링크가 1200ms 뒤 생성됩니다. 이 기록은 목록·검색 데이터에서 제외하여 우회 경로를 만들지 않습니다.

의견은 650·1600·2800ms, 지연 iframe은 1200ms에 생성됩니다. 페이지별 3.5초 이상 대기하고 생성된 링크·프레임·요소를 수집합니다. 권장 viewport 1440×1000, 모바일 검사 390×844입니다. 고정 시점과 본문을 사용하며 무작위 요소·무한 페이지는 없습니다.

쿼리 `collection=203/317`과 `period=modern/republic`을 함께 유지합니다. 값별 제목·본문은 다릅니다. 파라미터 순서와 fragment는 중복으로 처리하고 값은 보존합니다. `widgets/` 보조 문서는 독립 콘텐츠로 재집계하지 않고 부모 URL과 1·2단계 `frames`로 기록합니다. 같은 원점·배포 경로의 HTML만 순회하고 `.invalid` 외부 링크와 `lab/`을 제외합니다. 새 URL이 없으면 종료합니다.

## 검증실과 산출물

검증실은 공통 UI 명칭·알고리즘을 유지합니다. 필터·검색·주소 복사·다운로드·전수 DOM 자체 검사·링크 도달 검사·결과 비교를 제공합니다. 예상 결과 0초는 합성 예시이며 실측 시간·공식 점수가 아닙니다.

결과 파일은 브라우저 내부에서 처리됩니다. 다른 선택자라도 같은 실제 유일 요소면 인정하며 모호한 선택자·필드 오류·중복·쿼리 값·프레임을 구분합니다. 원문은 필수 필드이고 문자열 차이만으로 위치·기법 정답을 오답 처리하지 않습니다.

- `src/templates/`, `src/fixtures.mjs`: 화면·검증실과 사례 정의
- `scripts/`: 생성기·서버·정적 검사·브라우저 검사
- `dist/`: 빌드되는 정적 사이트와 검증실
- `reference/ground-truth.json`, `reference/counts.json`: 빌드되는 정답·수량
- `artifacts/`: 실제 실행 증거

`test-site-4/`에는 대상 파일만 배포되며 검증실·정답·소스 링크를 노출하지 않습니다. 독립 `dist/` 호스팅에서 정답 비공개가 필요하면 `lab/`을 제외합니다. 분리는 접근 제어가 아닙니다. 기존 형식을 유지하며 release·ZIP을 추가하지 않습니다. 저장소 접두 경로 시험은 로컬 브라우저 매핑이며 실제 원격 배포와 구분합니다.
