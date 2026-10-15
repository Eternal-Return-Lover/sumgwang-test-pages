# 불법광고 탐지 테스트 사이트

공모전 모집요강 기반 가상 공공 웹사이트입니다.

| 사이트 | 소스 | 검증실 |
| --- | --- | --- |
| [test-site-1](test-site-1/) | [source](source/test-site-1/) | [lab](source/test-site-1/lab/) |
| [test-site-2](test-site-2/) | [source](source/test-site-2/) | [lab](source/test-site-2/lab/) |
| [test-site-3](test-site-3/) | [source](source/test-site-3/) | [lab](source/test-site-3/lab/) |
| [test-site-4](test-site-4/) | [source](source/test-site-4/) | [lab](source/test-site-4/lab/) |
| [test-site-5](test-site-5/) | [source](source/test-site-5/) | [lab](source/test-site-5/lab/) |
| [test-site-6](test-site-6/) | [source](source/test-site-6/) | [lab](source/test-site-6/lab/) |
| [test-site-7](test-site-7/) | [source](source/test-site-7/) | [lab](source/test-site-7/lab/) |
| [test-site-8](test-site-8/) | [source](source/test-site-8/) | [lab](source/test-site-8/lab/) |
| [test-site-9](test-site-9/) | [source](source/test-site-9/) | [lab](source/test-site-9/lab/) |
| [test-site-10](test-site-10/) | [source](source/test-site-10/) | [lab](source/test-site-10/lab/) |

```sh
npm ci
npm run build
npm run check
npm test
npm start
```

서버: http://127.0.0.1:4173/ · 모든 사이트와 검증실을 한 번에 제공합니다.

- `test-site-N/`: 탐지 대상 배포본
- `source/test-site-N/`: 사례·고유 생성기·검증실·정답·문서
- `source/shared/`: 공통 검증 엔진·스타일
- `tmp/build/test-site-N/`: 단독 실행용 생성물 · `tmp/verification/`: 검사 출력 (Git 제외)

번호별 빌드·검사: `npm run build -- N`, `npm run check -- N`. 브라우저 검사: `npm run verify -- N` (설치된 Chrome 또는 `CHROME_PATH`). 전체 배포 경로 검사: `node source/verify-deployment.mjs all`. 검사는 자동으로 빌드하지 않습니다.

정답 3종은 각 `reference/`의 `ground-truth.json`·`counts.json`·`expected-result.json`입니다. 예상 결과는 `package.json`의 `config.publicBaseUrl`과 고정 합성 시각으로 생성하며, 검증실 다운로드는 현재 접속 주소를 반영합니다.

비교는 같은 출처의 실제 DOM·iframe을 사용합니다. 탐지기에는 개별 `test-site-N/` 주소를 입력하며, 대상 안에는 검증실·정답 링크가 없습니다. 런타임 의존성은 없고 Playwright는 공통 개발 의존성입니다. 상세 명세·최신 검사 요약은 각 사이트 문서를 참조하세요.
