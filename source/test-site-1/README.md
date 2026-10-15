# test-site-1

[대상](../../test-site-1/) · [검증실](dist/lab/) · [정답표](reference/ground-truth.json)

저장소 루트에서 실행합니다.

```sh
node source/manage.mjs build 1
node source/manage.mjs check 1
npm --prefix source/test-site-1 start
```

브라우저 검사는 검증실에서 실행합니다.

[명세](REQUIREMENTS.md) · [검증 기록](VERIFICATION.md)
