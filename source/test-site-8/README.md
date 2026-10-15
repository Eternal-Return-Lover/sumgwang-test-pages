# test-site-8

[대상](../../test-site-8/) · [검증실](dist/lab/) · [정답표](reference/ground-truth.json)

저장소 루트에서 실행합니다.

```sh
node source/manage.mjs build 8
node source/manage.mjs check 8
npm --prefix source/test-site-8 start
```

브라우저 검사: `npm --prefix source/test-site-8 run verify` (Playwright 개발 의존성 필요).

[명세](REQUIREMENTS.md) · [검증 기록](VERIFICATION.md)
