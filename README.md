# 불법광고 탐지 테스트 페이지

공공 웹사이트 불법광고 탐지 도구의 크롤링·DOM 수집·탐지 결과 생성을 점검하기 위한 팀 내부 테스트 사이트 모음입니다. 각 테스트 사이트는 하나의 시작 URL에서 내부 게시글, 댓글, 페이지네이션, iframe을 따라 탐색할 수 있는 정적 웹사이트로 구성합니다.

현재 포함된 사이트는 가상의 지자체 커뮤니티인 **한빛시 시민소통광장**과 도서관 커뮤니티인 **다온시립도서관 책마루**입니다. 실제 기관이나 실제 광고·거래 기능과 무관한 합성 환경입니다.

## 테스트 사이트 2 — 다온시립도서관 책마루

`test-site-2/`에 정적 배포본, `source/daon-library-ad-lab/`에 전체 소스·검증실·정답표·분석과 검증 문서를 제공합니다. 콘텐츠 시나리오 60개, 광고 요소 48개, 정상 대조 16개, 기대 검출 61건입니다. 3단계 iframe, 지연 DOM, 최대 5단계 링크, 쿼리 분기와 복합 기법을 포함합니다.

```powershell
cd source/daon-library-ad-lab
node scripts/serve.mjs
```

시작 주소는 `http://127.0.0.1:4174/index.html`, 검증실은 `http://127.0.0.1:4174/lab/index.html`입니다. 사이트 1과 동일하게 `test-site-2/`에는 탐지 대상만 두고 검증실은 `source/daon-library-ad-lab/dist/lab/`에 보관합니다. 온라인 배포·push는 수행하지 않았습니다. 사용 방법은 [사이트 2 README](source/daon-library-ad-lab/README.md), 분석은 [REQUIREMENTS.md](source/daon-library-ad-lab/REQUIREMENTS.md)를 참고하세요.

## 시작 주소

GitHub Pages를 활성화한 뒤에는 아래 주소를 탐지 프로그램의 입력값으로 사용합니다.

```text
https://eternal-return-lover.github.io/sumgwang-test-pages/test-site-1/
https://eternal-return-lover.github.io/sumgwang-test-pages/test-site-2/
```

로컬에서 실행할 때는 시험할 `test-site-N/`을 정적 HTTP 서버로 제공한 뒤, 해당 폴더의 `index.html` 주소를 입력합니다. 각 소스 프로젝트의 파일 서버를 사용하면 검증실도 함께 열 수 있습니다. HTML 파일을 직접 더블클릭해 여는 `file://` 방식은 iframe·모듈 동작을 보장하지 않으므로 사용하지 않습니다.

## 저장소 구조

```text
.
├─ index.html                         # 테스트 사이트 목록
├─ test-site-1/                       # 실제 크롤링·탐지 대상
│  ├─ index.html                      # 한빛시 시민소통광장 시작점
│  ├─ assets/                         # 브라우저에서 실행되는 CSS·JavaScript
│  ├─ board/                          # 목록·게시글·쿼리 분기
│  ├─ archive/                        # 깊은 링크 및 지연 발견 링크
│  ├─ culture/
│  ├─ guide/
│  └─ widgets/                        # 1·2단계 중첩 iframe
├─ test-site-2/                       # 다온시립도서관 책마루 탐지 대상
│  ├─ index.html
│  ├─ assets/
│  ├─ board/
│  ├─ about/
│  ├─ programs/
│  ├─ records/                        # 최대 5단계 링크 탐색
│  └─ widgets/                        # 1·2·3단계 중첩 iframe
└─ source/
   ├─ sites.json                     # 사이트 번호·원본 폴더·이름 등록
   ├─ manage.mjs                     # 공통 목록·빌드·검사 명령
   ├─ site-tools.mjs                 # 배포 동기화·정답표 공통 검사
   ├─ site-tools.test.mjs            # 두 자리 번호·배포 경로 회귀 검사
   ├─ hanbit-civic-ad-lab/            # 사이트 1 수정·재생성·검증용 원본
   │  ├─ src/
   │  ├─ scripts/
   │  ├─ reference/
   │  └─ dist/lab/
   └─ daon-library-ad-lab/            # 사이트 2 수정·재생성·검증용 원본
      ├─ src/                         # 테스트 사례 정의
      ├─ scripts/                     # 생성·로컬 실행·검사 스크립트
      ├─ reference/                   # 내부 성능 측정용 정답표
      └─ dist/lab/                    # 내부 결과 비교용 검증실
```

`test-site-1/`과 `test-site-2/`는 배포 결과물입니다. 탐지 프로그램에는 시험할 사이트 폴더의 시작 URL 하나를 입력합니다. `source/`는 팀이 사이트를 수정하고 결과를 검증하기 위한 개발 자료이며, 테스트 대상 페이지에서 이 폴더로 연결되는 링크는 없습니다.

## 한빛시 테스트 사이트

한빛시 시민소통광장은 아래 조건을 포함합니다.

| 항목 | 구성 |
| --- | --- |
| 테스트 시나리오 | 47개 |
| 광고 요소 | 35개 |
| 기대 검출 건수 | 40건 |
| 정상 대조 사례 | 12개 |
| 필수 기법 | HOMOGLYPH, JAMO, TRANSPARENT, OFFSCREEN |
| 동적 요소 | 650ms, 1,200ms, 1,600ms, 2,800ms 지연 삽입 |
| 탐색 구조 | 내부 링크, 페이지네이션, 쿼리 분기, 중첩 iframe, 깊은 아카이브 경로 |

같은 요소에 여러 기법이 적용된 경우 기법별로 별도 결과를 생성해야 합니다. 쿼리 값이 다른 URL은 서로 다른 페이지로 취급하며, 쿼리 파라미터 순서와 fragment만 다른 URL은 중복으로 처리합니다.

## 탐지 프로그램 시험 방법

1. 시험할 `test-site-N/`의 시작 URL 하나를 탐지 프로그램에 입력합니다.
2. 내부 링크·게시글·댓글·iframe을 따라 탐색합니다.
3. DOM 텍스트, 속성, computed style, bounds, viewport, selector, iframe 경로를 수집합니다.
4. 필수 기법을 탐지하고 `result.json`을 생성합니다.
5. 내부 성능 측정 시 해당 소스 프로젝트의 `dist/lab/` 검증실에서 결과 파일을 비교합니다. 로컬 검증실에서 만든 결과는 같은 로컬 주소로, GitHub Pages 결과는 같은 배포 주소의 검증실로 비교합니다.

권장 초기 설정은 최대 150 URL, 최대 depth 8, 전체 제한 시간 1,800초입니다. 이는 이 테스트 사이트를 위한 초기 권장값이며 공식 평가 환경의 조건을 의미하지 않습니다.

## 사이트 수정 방법

수정은 `test-site-N/`의 생성 파일을 직접 고치기보다 원본 프로젝트에서 진행합니다. 저장소 루트에서 다음 명령을 실행합니다. 빌드·정적 검사에는 npm 설치가 필요 없습니다.

```powershell
node source/manage.mjs list       # 등록된 사이트를 번호순으로 확인
node source/manage.mjs build      # 전체 사이트 재생성
node source/manage.mjs check      # 전체 정적 검사·배포 파일·목록 확인
node --test source/site-tools.test.mjs

node source/manage.mjs build 2    # 사이트 2만 재생성
node source/manage.mjs check 2    # 사이트 2 검사
```

각 프로젝트 폴더의 기존 `npm run build`, `npm run check`도 유지합니다. 두 사이트 모두 빌드 후 `dist/`에서 `lab/`을 제외한 파일을 등록된 `test-site-N/`에 자동 반영하고 루트 목록을 갱신합니다. 해당 대상 폴더는 생성 결과로 교체되므로 수동 수정은 원본에 반영하세요. 원본 변경과 배포 결과물을 함께 커밋합니다.

```text
source 수정
    ↓
npm run build
    ↓
dist 결과 확인
    ↓
test-site-N/ 자동 반영 및 루트 목록 갱신
    ↓
npm run check 및 브라우저 확인
    ↓
커밋·푸시
```

## 새 사이트 추가

1. 기존 형식으로 `source/<새 프로젝트>/`에 원본을 준비합니다. 기존 생성기를 복사할 경우 `scripts/build.mjs`, `check.mjs`, `serve.mjs`의 공통 관리 연동을 유지합니다. 사이트 1은 홈 화면을 템플릿으로 사용하므로 `dist/`도 필요하고, 사이트 2는 `src/templates/`에서 페이지를 생성합니다.
2. `source/sites.json` 배열에 다음과 같은 항목을 추가합니다. `number`, `project`, `siteId`는 각각 고유해야 합니다.

   ```json
   {"number": 10, "project": "new-public-ad-lab", "siteId": "new-public", "title": "새 공공 테스트 사이트"}
   ```

3. `node source/manage.mjs build 10`과 `node source/manage.mjs check`를 실행하고 해당 사이트를 브라우저에서 확인합니다.

`test-site-10/`과 루트 진입 링크는 빌드가 생성합니다. 번호는 1, 2, 10, 11처럼 숫자로 정렬합니다. 검증실은 정답표의 배포 메타데이터에서 대상 경로를 읽으므로 번호별 주소를 코드에 추가할 필요가 없습니다. 저장소 하위 경로의 GitHub Pages와 단독 `dist/` 실행을 지원합니다.

기본 로컬 포트는 `4172 + number`입니다(사이트 10은 4182). 필요하면 등록 항목에 `"port": 8000`을 지정하거나 실행 시 `PORT`로 변경합니다. 등록된 포트의 중복과 범위를 검사합니다. `test-site-N/`과 `source/<프로젝트>/dist/lab/` 형식은 유지합니다.

## 내부 검증실과 정답표

각 소스 프로젝트의 `reference/ground-truth.json`에는 사례별 원문·위치·기대 기법이 있습니다. `dist/lab/`의 검증실은 팀 프로그램이 생성한 `result.json`을 비교해 정탐, 미탐, 오탐, 중복, 필수 필드 오류를 확인합니다.

이 자료들은 팀 내부 성능 측정에 사용합니다. 테스트 프로그램의 입력 URL은 반드시 시험할 `test-site-N/`으로 지정하고, `source/` 또는 검증실을 탐색 범위에 포함하지 마세요. 공개 저장소를 루트에서 배포하면 `source/`의 정답 자료도 공개될 수 있으므로, 정답을 읽지 않는 탐색 범위로 시험합니다.

## GitHub Pages 배포

저장소 설정에서 **Settings → Pages**로 이동해 아래처럼 설정합니다.

```text
Source: Deploy from a branch
Branch: main
Folder: /(root)
```

배포 후 저장소 루트는 등록된 테스트 사이트 목록을 제공하며, 각 사이트는 `/test-site-N/` 경로에서 열립니다. 목록만 다시 생성할 때는 `node source/manage.mjs index`를 실행합니다.

## 협업 규칙 제안

- 실제 탐지 대상은 `test-site-N/`으로 분리합니다.
- 원본 수정과 생성 결과 변경은 같은 커밋에 포함합니다.
- 새 사례를 추가하면 정상 사례·기대 결과·동적 대기 조건도 함께 검토합니다.
- 성능 테스트에서 시작 URL은 저장소 루트가 아닌 대상 사이트의 `test-site-N/` URL로 고정합니다.
- 기능 브랜치에서 작업하고, 검토가 필요할 때 `main`을 대상으로 Pull Request를 엽니다.

## 관련 문서

- [`source/hanbit-civic-ad-lab/README.md`](source/hanbit-civic-ad-lab/README.md): 한빛시 사이트 상세 실행·수정 안내
- [`source/hanbit-civic-ad-lab/REQUIREMENTS.md`](source/hanbit-civic-ad-lab/REQUIREMENTS.md): 모집요강 분석 및 구현 근거
- [`source/hanbit-civic-ad-lab/VERIFICATION.md`](source/hanbit-civic-ad-lab/VERIFICATION.md): 제작 시점 검증 기록
- [`source/daon-library-ad-lab/README.md`](source/daon-library-ad-lab/README.md): 책마루 사이트 상세 실행·수정 안내
- [`source/daon-library-ad-lab/REQUIREMENTS.md`](source/daon-library-ad-lab/REQUIREMENTS.md): 사이트 2 분석·제작 명세
- [`source/daon-library-ad-lab/VERIFICATION.md`](source/daon-library-ad-lab/VERIFICATION.md): 사이트 2 검증 기록
