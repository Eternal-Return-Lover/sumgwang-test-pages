# 다온시립도서관 책마루 · test-site-2

공공 웹사이트 불법광고 탐지 도구 개발 공모전 **모집요강 기반 모의 테스트 환경**입니다. 가상의 도서관 시민 게시판이며 공식 평가 사이트·정답셋과 무관합니다. HTML/CSS/JavaScript만으로 동작하고 API·로그인·DB·거래 기능이 없습니다.

## 실행

Node.js 24 환경에서 확인했습니다. 일반 실행과 빌드는 npm 패키지 설치가 필요 없습니다.

```powershell
cd source/daon-library-ad-lab
node scripts/build.mjs
node scripts/check.mjs
node scripts/serve.mjs
```

- 시작 URL: `http://127.0.0.1:4174/index.html`
- 검증실 URL: `http://127.0.0.1:4174/lab/index.html`
- `START_LOCAL.cmd`를 실행해도 됩니다. 서버 종료는 해당 창에서 Ctrl+C입니다.
- `file://`로 열지 말고 HTTP 서버를 사용하세요.
- `PORT`로 포트, `STATIC_ROOT`로 제공할 폴더를 변경할 수 있습니다.

## 구성과 수량

| 항목 | 수량 |
| --- | ---: |
| 서로 다른 콘텐츠 시나리오·고유 대상 URL | 60 |
| 광고 포함 콘텐츠 / 정상 콘텐츠 | 44 / 16 |
| 정답 광고 요소 / 정상 대조 요소 | 48 / 16 |
| 기대 검출 건수 | 61 |
| HOMOGLYPH / JAMO / TRANSPARENT / OFFSCREEN | 12 / 15 / 18 / 16 |
| 콘텐츠 HTML 파일 | 57 (56개 고정 글 + 쿼리 분기 파일 1개) |
| iframe 보조 HTML / 메뉴·목록·안내 HTML | 12 / 14 |
| 대상 사이트 HTML / 검증실 포함 전체 HTML | 83 / 84 |
| 목록 항목 / 목록 페이지 | 페이지당 10개 / 6페이지 |

한 글에 광고 요소 두 개가 있거나, 한 요소에 기법 두세 개가 있으면 결과 건수가 늘어납니다. 수량은 `reference/counts.json`에 빌드 시 자동 산출됩니다.

## 시험 범위와 종료 조건

탐지기에 시작 URL 하나를 입력하고 해당 배포 경로 아래의 내부 `a[href]`와 동일 출처 iframe을 수집하세요. 최대 링크 깊이는 5단계이며 iframe은 최대 3단계입니다. 각 문서 로딩 후 **3.5초 이상** 대기하는 것을 권장합니다. 고정 지연은 650/950/1200/1600/2800ms이며, 지연 iframe 뒤의 1600ms 내부 삽입도 있습니다. 프레임별 로딩 지연은 별도 여유를 두세요. 정답표의 `delayMs`는 부모 문서 기준 명목 지연의 합입니다.

쿼리 값은 보존합니다. `id=1024`의 `edition=autumn`과 `edition=winter`는 다른 페이지입니다. 쿼리 순서·fragment·http/https·끝 슬래시는 비교 시 통합합니다. iframe 문서를 독립 페이지로 다시 집계하지 마세요. `findings.url`은 부모 콘텐츠 URL, `location`은 절대 iframe src와 ` >>> ` 선택자 경로입니다. 자식 프레임은 해당 프레임 로딩 완료 후 분석합니다.

외부 `.invalid` 주소, `lab/`, `source/`, 정답 JSON은 탐색 대상에서 제외합니다. 메뉴·목록·일반 안내도 정상 콘텐츠이므로 탐지 결과를 만들 때 문맥을 확인해야 합니다. 정규화·중복 제거한 방문 큐가 비고 모든 예약된 DOM·프레임 삽입을 기다리면 종료합니다. 사이트 자체 링크 검사는 안전 상한 250 URL을 둡니다. 30분은 공모전 실행 상한이며 대기 목표가 아닙니다.

## 검증실 사용

1. 진입 주소를 복사하고 정답표·예상 결과를 내려받습니다.
2. 기법·정상 필터와 검색을 사용하고 사례를 펼쳐 원문·선택자·프레임·지연을 확인합니다.
3. **정답 요소 검증**은 실제 DOM에서 요소 유일성, 원문, 조상 포함 은닉 스타일과 프레임을 검사합니다.
4. **링크 도달 검증**은 정답 URL 직접 검사와 별개로 시작 페이지부터 링크를 탐색합니다.
5. 팀 탐지기의 UTF-8 BOM 없는 `result.json`을 선택해 TP/FN/FP, 필드 오류, 중복, 자체 비율, 기록된 시간을 확인합니다. 파일은 브라우저 안에서만 처리됩니다.

`expected-result.json`의 0초 실행 시간은 합성 예시입니다. 공식 점수는 계산하지 않습니다. CSS 표기가 달라도 같은 단일 DOM 요소면 인정하며 `evidence_text`는 필수 확인만 하고 원문 문자열 차이로 오답 처리하지 않습니다. 중복 ID는 스키마 오류, 다른 ID로 제출한 동일 검출은 한 건으로 통합합니다.

## 수정과 배포

- `src/fixtures.mjs`: 합성 콘텐츠·기법·지연 정의. 정답 여부는 대상 사이트에 노출하지 않습니다.
- `scripts/build.mjs`: 전체 페이지·정답표 생성. 기존 dist를 템플릿으로 읽지 않는 재현 가능한 빌드입니다.
- `src/templates/`: 대상 CSS와 검증실 원본.
- `dist/`: 검증실을 포함한 로컬 시험용 완성본. 빌드하면 검증실을 제외한 탐지 대상만 저장소의 `test-site-2/`에 복사합니다.
- `reference/ground-truth.json`: 보관용 정답표.
- `artifacts/`: Chrome 검사 보고서와 데스크톱·모바일 스크린샷.

사이트 번호·이름·배포 경로·기본 포트는 저장소의 `source/sites.json`에서 관리합니다. 이 프로젝트는 `source/site-tools.mjs` 등 공통 관리 파일과 함께 사용합니다. 저장소 루트의 `node source/manage.mjs build 2`·`check 2`도 사용할 수 있습니다. 새 사이트 추가 절차는 [저장소 README](../../README.md#새-사이트-추가)를 참고하세요.

사이트 1과 동일하게 정적 서버에 `test-site-2/`를 올리세요. 이 폴더에는 탐지 대상만 있으며, 검증실은 `source/daon-library-ad-lab/dist/lab/`에 보관합니다. 로컬 시험은 `dist/`를 제공하는 파일 서버로 실행합니다. 모든 링크·자산·프레임은 상대경로로 구성되어 경로 재작성 없이 배포할 수 있습니다. 정답을 비공개로 시험하려면 `source/`를 공개하지 마세요. 검증실 분리는 접근 제어가 아닙니다.

저장소 전체를 GitHub Pages 또는 정적 서버에서 제공하면 `source/daon-library-ad-lab/dist/lab/` 검증실은 같은 저장소의 `test-site-2/`를 자동으로 검사 대상으로 삼습니다. 따라서 실제 배포 시작 URL로 만든 결과를 이 검증실에서 비교할 수 있습니다. `dist/`만 로컬에서 제공하면 기존처럼 로컬 `index.html`을 기준으로 검사합니다.

온라인 업로드·Git push는 수행하지 않았습니다. 저장소를 GitHub Pages에 배포한 후의 예상 시작 경로는 `/sumgwang-test-pages/test-site-2/`입니다.

## 브라우저 검사 재실행

개발 검증에만 Playwright 1.63.0과 설치된 Chrome이 필요합니다. 이 소스 폴더에서 `npm.cmd install` 후 실행하세요. Chrome 기본 경로가 다르면 `CHROME_PATH` 환경변수에 실행 파일 경로를 지정합니다. 검사는 운영체제가 할당한 빈 포트를 사용하고 등록된 사이트 목록을 읽습니다. 두 자리 번호와 GitHub Pages 하위 경로도 기존 콘텐츠를 브라우저에서 임시 매핑해 확인합니다. 런타임 사이트는 npm 설치가 필요 없습니다.

```powershell
node scripts/browser-check.mjs
```

검사 보고서와 한계는 [VERIFICATION.md](VERIFICATION.md), 자료 분석과 제작 명세는 [REQUIREMENTS.md](REQUIREMENTS.md)를 참고하세요.
