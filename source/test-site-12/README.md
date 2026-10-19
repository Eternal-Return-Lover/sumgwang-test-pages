# test-site-12 · 안전서가

누리온시 재난안전자료관을 콘셉트로 한 유한 크롤러 스트레스 시험입니다. 기관·문장·광고는 합성이며 실제 접수·판매·연락 기능은 없습니다.

- 탐지 시작: `test-site-12/index.html`
- 공통 비교: `validator/?site=12`
- 정답·DOM 검증실: `source/test-site-12/lab/`
- 정답: [ground-truth.json](reference/ground-truth.json) · [결과 예시](reference/expected-result.json) · [집계](reference/counts.json)
- [제작 명세](REQUIREMENTS.md) · [실제 검증 결과](VERIFICATION.md)

저장소 루트에서 `npm run build -- 12`, `npm run check -- 12`, `npm test`, `npm start`를 실행합니다. 고유 검사: `npm run verify -- 12`. 공통 검사: `node source/verify-dashboard.mjs 12 --prefix`, `node source/verify-deployment.mjs 12`.

48개 논리 페이지, 최대 최단 링크 깊이 8, 최대 4.2초 갱신, 양성 45·정상 대조 22요소와 기법별 기대 56건을 구성합니다. 수치는 내부 설계 기준이며 실제 측정·지원 한계는 검증 문서를 따릅니다. 기본 관찰 조건은 최소 3.5초·안정 300ms·최대 5초입니다.

일반적인 iframe[src] 하나로 구분할 수 없는 같은 src의 형제와 srcdoc은 유일한 CSS 프레임 선택자를 기존 ` >>> ` 문법으로 연결합니다. 여섯 finding 필드는 유지하며 기대 위치는 정답 예시를 참고하세요. 정답·구조 주석은 탐지기 입력이나 실제 방문 결과가 아닙니다.

업로드한 result.json은 브라우저에서 실제 DOM과 비교합니다. 완료 후 채점 결과 JSON을 내려받을 수 있으며 TP/FN은 caseId+technique 단위입니다. FP·후보·정상 대조를 자동 학습 라벨이나 TN으로 바꾸지 마세요.

GitHub Pages는 main/루트 배포를 따릅니다. 작업 브랜치·PR·로컬 검사만으로 운영 반영을 의미하지 않습니다. 병합 후 예정 시작 주소는 https://eternal-return-lover.github.io/sumgwang-test-pages/test-site-12/index.html 입니다.
