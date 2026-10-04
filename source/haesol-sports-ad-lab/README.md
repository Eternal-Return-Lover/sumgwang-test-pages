# 해솔시 생활체육센터 · test-site-3

공공 웹사이트 불법광고 탐지 도구를 위한 **모집요강 기반 모의 테스트 환경**입니다. 기관·인물·게시글·광고는 합성 자료이며 실제 공공기관이나 공식 심사 사이트와 무관합니다. 예약·결제·연락·로그인·DB·외부 API 없이 순수 HTML/CSS/JavaScript로 동작합니다.

## 실행

Node.js 24에서 확인했습니다. 일반 빌드·정적 검사·실행에는 npm 패키지 설치가 필요 없습니다.

```powershell
# 저장소 루트에서
node source/manage.mjs build 3
node source/manage.mjs check 3

# 원본 프로젝트에서 로컬 서버 실행
cd source/haesol-sports-ad-lab
node scripts/serve.mjs
```

- 시작 URL: `http://127.0.0.1:4175/index.html`
- 검증실 URL: `http://127.0.0.1:4175/lab/index.html`
- `START_LOCAL.cmd` 또는 `npm start`로도 실행할 수 있습니다. 종료는 Ctrl+C입니다.
- `PORT`로 포트, `STATIC_ROOT`로 서버가 제공할 폴더를 변경합니다.
- `file://` 대신 HTTP 서버를 사용하세요.

사이트 번호·기본 포트·배포 위치는 저장소의 `source/sites.json`에서 관리합니다. 소스의 빌드·검사·서버는 `source/site-tools.mjs`와 함께 사용합니다. 브라우저에서 실행되는 정적 배포본에는 Node.js가 필요 없습니다.

## 구성과 수량

| 항목 | 수량 |
| --- | ---: |
| 콘텐츠 시나리오·고유 대상 URL | 64 |
| 광고 포함 콘텐츠 / 정상 콘텐츠 | 48 / 16 |
| 정답 광고 요소 / 정상 대조 요소 | 52 / 16 |
| 기대 검출 건수 | 68 |
| HOMOGLYPH / JAMO / TRANSPARENT / OFFSCREEN | 14 / 15 / 20 / 19 |
| 콘텐츠 HTML | 61 (고정 문서 60 + 쿼리 분기 문서 1) |
| iframe 보조 HTML / 메뉴·안내·목록 HTML | 15 / 17 |
| 대상 HTML / 검증실 포함 전체 HTML | 93 / 94 |
| 대상 배포 파일 | 99 |
| 목록 항목 / 페이지 | 페이지당 8개 / 8페이지, 마지막 6개 |

목록에는 깊은 활동 기록 2개를 제외한 62개 콘텐츠가 있습니다. 깊은 기록은 메인의 활동 기록 메뉴에서 도달합니다. 한 글의 복수 광고와 복합 기법 때문에 콘텐츠 수·광고 요소 수·findings 수가 다릅니다. 수량은 빌드 시 `reference/counts.json`에 자동 산출합니다.

## 탐지 시험 조건

- 입력은 시작 URL 하나로 지정하고 해당 사이트 경로 아래의 내부 `a[href]`와 동일 출처 iframe을 탐색합니다.
- 기준 viewport는 1440×1000입니다. 고정 지연은 650/950/1200/1600/2800ms이며 페이지별로 3.5초 이상 대기하는 초기 설정을 권장합니다.
- 지연 부모 프레임 뒤의 내부 1600ms 삽입도 포함합니다. 프레임의 로딩 완료와 내부 타이머를 함께 기다리세요. 정답표의 `delayMs`는 부모 기준 명목 지연의 합입니다.
- 시작 페이지에서 대상 콘텐츠까지 최대 링크 깊이는 6, iframe 깊이는 최대 3입니다. 권장 초기 탐색 한도는 150 URL·depth 8·전체 1800초입니다. 이는 자체 시험 설정입니다.
- `community/view.html?id=901&venue=pool`과 `venue=gym`은 서로 다른 콘텐츠입니다. 쿼리 값을 보존하고 순서·fragment 차이는 중복으로 처리합니다.
- `findings.url`은 부모 콘텐츠 URL, `location`은 절대 iframe src와 ` >>> `로 연결한 요소 선택자입니다. iframe을 독립 페이지로 다시 집계하지 않습니다.
- 외부 `.invalid` 링크와 `source/`, 검증실·정답 JSON은 수집 대상에서 제외합니다. 큐가 비고 예정된 DOM·프레임 삽입을 기다리면 종료합니다.

접근성 문구, 접힌 메뉴, 한글 자모·NFD 교육, 전각 행사 표기, 도박·대출·의약품 예방 안내와 성인 수영교실 모집 등 정상 사례를 포함합니다. 스타일 은닉이나 광고 관련 단어만으로 위반 여부를 판단하면 오탐이 발생하도록 구성했습니다.

## 검증실 사용

1. 진입 주소를 복사해 탐지기에 입력합니다.
2. 기법·정상 필터와 검색으로 사례를 확인합니다. 행을 열면 원문·선택자·프레임·지연 정보를 볼 수 있습니다.
3. 정답표와 예상 결과를 내려받습니다. 예상 결과는 UTF-8 BOM 없는 JSON이며 실행 시간 0초는 합성 예시입니다.
4. **정답 요소 검증**으로 실제 DOM의 선택자 유일성·원문·요소와 조상 스타일·프레임을 검사합니다.
5. **링크 도달 검증**으로 시작 URL에서 모든 콘텐츠에 도달하는지 확인합니다.
6. 팀 탐지기의 `result.json`을 업로드해 TP/FN/FP·필드 오류·중복과 자체 비율을 확인합니다. 파일은 브라우저 안에서만 처리합니다.

CSS 표기가 달라도 같은 단일 요소를 가리키면 인정합니다. 원문은 필수 필드이지만 문자열 차이만으로 오답 처리하지 않습니다. 같은 요소·같은 기법은 한 건이며, 복합 기법은 기법별 별도 findings입니다. 공식 점수는 산출하지 않습니다.

## 수정과 배포

- `src/fixtures.mjs`: 합성 사례와 콘텐츠 제목·작성자 정의
- `src/templates/`: 대상 CSS와 검증실 원본
- `scripts/build.mjs`: 모든 페이지·프레임·정답표·목록·자산 생성
- `scripts/check.mjs`: 문법·로컬 참조·소스와 정답표·배포본 일치 검사
- `dist/`: 검증실을 포함한 로컬 실행본
- `reference/`: 정답표와 자동 산출 수량
- `artifacts/`: 브라우저 보고서·예상 결과·스크린샷

수정 후 `npm run build`와 `npm run check`를 실행합니다. 빌드는 `dist/lab/`을 제외한 파일을 저장소의 `test-site-3/`으로 동기화하고 루트 사이트 목록을 갱신합니다. 생성 파일의 수동 변경은 덮어써지므로 원본을 수정하세요. 사이트 1과 같은 배포 형식을 유지하고 별도 release 디렉터리나 ZIP은 추가하지 않습니다.

저장소 전체를 제공하면 `source/haesol-sports-ad-lab/dist/lab/` 검증실은 `test-site-3/`을 대상으로 사용합니다. `dist/`만 제공하면 로컬 루트의 시작 페이지를 검사합니다. GitHub Pages 예상 시작 경로는 `/sumgwang-test-pages/test-site-3/`입니다. 상대경로를 사용하므로 SPA fallback이나 경로 재작성 규칙이 필요 없습니다.

검증실 분리는 접근 제어가 아닙니다. 정답 비공개 시험은 `test-site-3/`만 제공하고 소스·정답 자료를 공개하지 않는 방식으로 진행하세요.

## 브라우저 검사 재실행

개발 검사에만 Playwright 1.63.0과 설치된 Chrome이 필요합니다. 기본 실행 파일은 `C:/Program Files/Google/Chrome/Application/chrome.exe`이며 `CHROME_PATH`로 바꿀 수 있습니다. 검사 서버는 빈 포트를 자동으로 할당받습니다.

```powershell
cd source/haesol-sports-ad-lab
npm.cmd install
node scripts/browser-check.mjs
```

검사는 화면·검색·페이지네이션·쿼리 분기·지연 DOM·프레임·검증실·파일 비교·링크 도달과 단독 dist·GitHub Pages 하위 경로를 확인합니다. 보고서는 `artifacts/browser-report.json`에 저장합니다. 결과 파일의 localhost 주소는 검사 당시 포트이므로 다른 환경에서는 해당 검증실에서 다시 다운로드하세요.

분석과 자체 가정은 [REQUIREMENTS.md](REQUIREMENTS.md), 실제 확인 결과는 [VERIFICATION.md](VERIFICATION.md)를 참고하세요. 온라인 배포·커밋·push는 수행하지 않았습니다.
