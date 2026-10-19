# 불법광고 탐지 테스트 사이트

공모전 모집요강 기반 가상 공공 웹사이트입니다.

**[테스트 사이트 목록](https://eternal-return-lover.github.io/sumgwang-test-pages/)** · **[검증 대시보드](https://eternal-return-lover.github.io/sumgwang-test-pages/validator/)**

목록의 **사이트 열기**로 탐지 대상을 열고 **검증하기**로 해당 사이트의 대시보드에 접속합니다. 사이트를 선택하거나 `result.json`을 올린 뒤 **결과 비교하기**를 누르세요. 시작 URL로 사이트를 자동 선택하며, 직접 선택한 사이트와 주소가 다르면 안내합니다. 파일은 브라우저 안에서 처리합니다.

| 사이트 | 소스 | 결과 검증 |
| --- | --- | --- |
| [test-site-1](test-site-1/) | [source](source/test-site-1/) | [dashboard](validator/?site=1) |
| [test-site-2](test-site-2/) | [source](source/test-site-2/) | [dashboard](validator/?site=2) |
| [test-site-3](test-site-3/) | [source](source/test-site-3/) | [dashboard](validator/?site=3) |
| [test-site-4](test-site-4/) | [source](source/test-site-4/) | [dashboard](validator/?site=4) |
| [test-site-5](test-site-5/) | [source](source/test-site-5/) | [dashboard](validator/?site=5) |
| [test-site-6](test-site-6/) | [source](source/test-site-6/) | [dashboard](validator/?site=6) |
| [test-site-7](test-site-7/) | [source](source/test-site-7/) | [dashboard](validator/?site=7) |
| [test-site-8](test-site-8/) | [source](source/test-site-8/) | [dashboard](validator/?site=8) |
| [test-site-9](test-site-9/) | [source](source/test-site-9/) | [dashboard](validator/?site=9) |
| [test-site-10](test-site-10/) | [source](source/test-site-10/) | [dashboard](validator/?site=10) |
| [test-site-11](test-site-11/) | [source](source/test-site-11/) | [dashboard](validator/?site=11) |
| [test-site-12](test-site-12/) | [source](source/test-site-12/) | [dashboard](validator/?site=12) |

대시보드는 정탐 TP·미탐 FN·오탐 FP·필드 오류·중복을 구분하고, 기대값·제출값·실패 이유와 검색·필터를 제공합니다. 재현율은 `TP/기대 건수`, 정밀도는 `TP/(TP+FP)`, 필드 오류 반영 비율은 `TP/(TP+FP+필드 오류)`입니다. 분모가 0이면 계산 불가이며 공식 점수가 아닙니다.

11·12번은 11개 광고 주제와 정상 대조군을 제공합니다. 정답 주제별 TP/FN·기법별 누락과 상세 주제 필터를 지원하며 필터는 전체 지표를 바꾸지 않습니다. 기존 사이트는 카테고리 미지정으로 표시하고, 제출 JSON에 예측 주제가 없으므로 카테고리 분류 정확도는 평가하지 않습니다.

비교 완료 후 **채점 결과 JSON 다운로드**로 필터와 화면 표시 제한에 관계없이 전체 보고서를 저장할 수 있습니다. 원본 제출·정답 스냅샷과 SHA-256을 포함하며 기존 제출 JSON과 별도 형식입니다. [보고서 스키마·분석 범위](validator/README.md)를 참고하세요.

12번은 48개 논리 페이지·최단 깊이 8·최대 4.2초 동적 갱신을 포함한 유한 스트레스 시험입니다. 수량과 지원 범위는 [제작 명세](source/test-site-12/REQUIREMENTS.md)를 참고하세요.

같은 출처의 실제 DOM·iframe을 비교합니다. 탐지기에는 `test-site-N/` 주소를 입력하세요. 검증실·정답 링크는 대상 내부에 없습니다. 사이트별 기존 검증실은 `source/test-site-N/lab/`에서 정답 사례·DOM 검사를 계속 제공하며 사이트 2 이상은 링크 검사도 지원합니다.

```sh
npm ci
npm run build
npm run check
npm test
npm start
npm run verify:dashboard
```

로컬 미리보기: [사이트 목록](http://127.0.0.1:4173/) · [대시보드](http://127.0.0.1:4173/validator/). 운영 배포는 GitHub Pages의 **main / 루트** 기준이며, 기능 PR 병합 후 Pages 빌드 완료와 실제 주소를 확인합니다. 로컬·접두 경로 모의 검사는 운영 배포 검사가 아닙니다.

- `source/sites.json`: 사이트 등록과 선택적인 카드 설명(`description`). 목록·대시보드가 함께 사용하며, 목록은 빌드 또는 `node source/manage.mjs index`로 갱신합니다.
- `validator/`: 공통 대시보드. `source/shared/`: 기존 엔진·구조화 진단 API.
- `source/test-site-N/reference/`: `ground-truth.json`·`counts.json`·`expected-result.json`.
- `tmp/build/test-site-N/`: 단독 생성물. `tmp/verification/`: 검사 출력. 모두 Git 제외.

번호별 명령: `npm run build -- N`, `npm run check -- N`, `npm run verify -- N`. 기존 검증실 전 경로 검사: `node source/verify-deployment.mjs all`. 대시보드 상세 검사는 `node source/verify-dashboard.mjs all`이며 검사에 자동 빌드는 없습니다.

정답 예시는 공용 배포 주소·고정 합성 시각을 쓰고, 대시보드 다운로드는 현재 접속 주소를 반영합니다. 런타임 의존성은 없고 Playwright만 공통 개발 의존성입니다. 상세 명세·최신 검사 범위는 각 사이트 문서를 참조하세요.
