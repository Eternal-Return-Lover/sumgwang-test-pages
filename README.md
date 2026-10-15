# 불법광고 탐지 테스트 사이트

공모전 모집요강 기반의 가상 공공 웹사이트 모음입니다.

| 사이트 | 소스 | 검증실 |
| --- | --- | --- |
| [test-site-1](test-site-1/) | [source](source/test-site-1/) | [lab](source/test-site-1/dist/lab/) |
| [test-site-2](test-site-2/) | [source](source/test-site-2/) | [lab](source/test-site-2/dist/lab/) |
| [test-site-3](test-site-3/) | [source](source/test-site-3/) | [lab](source/test-site-3/dist/lab/) |
| [test-site-4](test-site-4/) | [source](source/test-site-4/) | [lab](source/test-site-4/dist/lab/) |
| [test-site-5](test-site-5/) | [source](source/test-site-5/) | [lab](source/test-site-5/dist/lab/) |
| [test-site-6](test-site-6/) | [source](source/test-site-6/) | [lab](source/test-site-6/dist/lab/) |
| [test-site-7](test-site-7/) | [source](source/test-site-7/) | [lab](source/test-site-7/dist/lab/) |
| [test-site-8](test-site-8/) | [source](source/test-site-8/) | [lab](source/test-site-8/dist/lab/) |
| [test-site-9](test-site-9/) | [source](source/test-site-9/) | [lab](source/test-site-9/dist/lab/) |
| [test-site-10](test-site-10/) | [source](source/test-site-10/) | [lab](source/test-site-10/dist/lab/) |

- `test-site-N/`: 탐지 대상 배포본
- `source/test-site-N/`: 소스·정답표·문서·검증실

저장소 루트에서 실행합니다. `N`은 사이트 번호입니다.

```sh
node source/manage.mjs list
node source/manage.mjs build N
node source/manage.mjs check
node --test source/site-tools.test.mjs
```

로컬 실행: `npm --prefix source/test-site-N start`

브라우저 검사 전 `npm --prefix source/test-site-N install`로 개발 의존성을 설치합니다. 실제 DOM·비교 검사는 `npm --prefix source/test-site-N run verify`로 실행합니다(2번부터, Playwright 개발 의존성 필요). 정답은 각 소스의 `reference/ground-truth.json`, 자세한 명세·검증 기록은 `REQUIREMENTS.md`·`VERIFICATION.md`를 확인하세요.
