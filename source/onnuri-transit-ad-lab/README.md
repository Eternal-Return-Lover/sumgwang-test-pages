# 온누리시 교통정보센터 길마루

사이트6의 모집요강 기반 모의 테스트 환경입니다. 기관·작성자·노선·시각·광고는 합성 자료입니다. 실제 기관이나 공식 심사 사이트와 무관하며 예약·결제·연락·실시간 API 기능이 없습니다.

## 실행

저장소 루트에서 코디네이터가 빌드와 배포 동기화를 수행합니다.

```powershell
node source/manage.mjs build 6
node source/manage.mjs check
node --test source/site-tools.test.mjs
```

빌드 후 프로젝트 폴더에서 `npm start` 또는 `START_LOCAL.cmd`를 실행합니다. 기본 포트는 등록 정보의4178입니다.

- 로컬 시작: `http://127.0.0.1:4178/index.html`
- 로컬 검증실: `http://127.0.0.1:4178/lab/index.html`
- 저장소 시작 경로: `test-site-6/index.html`
- 저장소 검증실: `source/onnuri-transit-ad-lab/dist/lab/index.html`

사이트 런타임은 외부 의존성 없는 정적 HTML/CSS/JavaScript입니다. 개발 브라우저 검사는 Playwright1.63.0과 설치된Chrome을 사용하고 `CHROME_PATH`로 실행 파일을 지정할 수 있습니다.

```powershell
npm run check
npm run verify
```

검사는 빌드된 산출물을 읽으며 임시 정적 서버의 동적 포트를 사용합니다. 서버와 브라우저는 검사 종료 시 닫습니다. 실제 결과·비교 입력·스크린샷은 artifacts에 기록합니다. 독립 검증 상태는 VERIFICATION.md에서 확인합니다.

## 데이터와 파일 단위

| 구분 | 수량 |
| --- | ---: |
| 콘텐츠 시나리오·고유URL | 56 |
| 정적URL / 쿼리URL | 48 / 8 |
| 광고 포함URL / 정상URL | 42 / 14 |
| 광고 요소 / 정상 요소 | 48 / 14 |
| 기대 검출 | 64 |
| HOMOGLYPH / JAMO | 14 / 15 |
| TRANSPARENT / OFFSCREEN | 18 / 17 |
| 실제 콘텐츠HTML | 49 |
| 구조HTML | 12 |
| iframe 보조HTML | 9 |
| 검증실HTML | 1 |
| 전체HTML / 대상 공개HTML | 71 / 70 |
| 공개파일 | 76: HTML70 + 자산5 + robots1 |
| 목록 | 55행,12행씩5페이지,마지막7행 |

추가 광고6요소는 기존 글에 들어갑니다. 따라서 시나리오·요소·기법별 건수는 다릅니다.8쿼리는 service/view.html 한 파일을 공유합니다. 홈·목록·안내·자료철·프레임·lab은56시나리오에 합산하지 않습니다. 기준은 src/fixtures.mjs이며 빌드가 reference/counts.json을 산출합니다.

## 탐색과 대기

index.html에서 실제 a[href]와 iframe을 따라 탐색합니다. T34의 records/2026/october/read.html은 시작 깊이0에서4개의 링크를 따라야 발견됩니다. 직전10월 수첩에서 링크가1100ms 뒤 생성됩니다. 해당 기록은 목록·검색·홈 직접 링크에서 제외하여 우회 경로가 없습니다.

- T25 메모750ms, T26 메모2100ms, T27 메모2800ms, N12 정상 접근성 상태1100ms.
- T30 외부iframe750ms + 마지막프레임내메모650ms = nominal1400ms. 문서 로딩 시간이 추가될 수 있습니다.
- T28 iframe2단계, T29 3단계, T30/N08 2단계. 정상 프레임도 포함합니다.
- 최대 nominal 삽입 지연2800ms.1440×1000 권장,390×844와320×844 모바일 검사. 페이지별3.5초 이상 대기한 뒤 링크·프레임·동적DOM을 수집합니다.

route=10/20/30/40 × service=day/night을 함께 유지하여8본문을 구분합니다. 같은 노선도 주간·야간 제목·시각·본문이 다릅니다. 파라미터 순서와 fragment는 중복 처리하고 값은 보존합니다. widgets는 독립 콘텐츠로 재집계하지 않고 부모URL과 바깥부터 이어지는 frames로 기록합니다. 같은 원점·배포경로 HTML만 탐색하며 lab·widgets 독립URL·.invalid 외부 주소는 제외합니다. 새URL이 없으면 종료합니다. 무작위·무한페이지는 없습니다.

## 검증실과 배포

공통lab 스키마·알고리즘·UI 명칭을 유지합니다. 필터·검색·주소복사·다운로드·전수DOM 자체검사·BFS·result.json 비교를 제공합니다. 파일은 브라우저 안에서 처리됩니다. 다른CSS라도 같은 실제 유일 요소면 인정하고, 중복·모호한 선택자·필드/JSON/BOM 오류·쿼리·프레임을 구분합니다. 원문은 필수 필드지만 문자열 차이만으로 위치·기법 정답을 오답 처리하지 않습니다. 예상결과0초는 합성 예시이며 실측시간이나 공식 점수가 아닙니다.

검사 기대값은 정의와manifest에서 산출합니다.62요소DOM/56URL BFS/깊이4/지연과2·3단계프레임/8쿼리/검색·초기화·빈결과·페이지네이션/공통 비교입력/단독dist·접두경로·두자리번호/lab404를 검사합니다.390/320px 내부 시각표·환승·이용정보·정류장dd·노선·목록도 스크린샷과 가로넘침을 확인합니다. 기존site1~5 완전정답 회귀를 검사하며 site1의 실제 텍스트score fallback을 보존합니다. 로컬 접두경로 매핑은 원격 배포와 구분합니다.

src는정의·화면·lab, scripts는생성기/서버/검사, dist는정적결과, reference는정답/수량, artifacts는실제증거입니다. test-site-6에는 대상파일만 배포하고 lab·정답·소스 링크를 노출하지 않습니다. 독립dist 호스팅에서 정답 비공개가 필요하면 lab을 제외합니다. 분리는 접근제어가 아닙니다. 기존형식을 유지하고 release·ZIP을 추가하지 않습니다.
