# 불법광고 탐지 테스트 페이지

공공 웹사이트 불법광고 탐지 도구의 크롤링·DOM 수집·탐지 결과 생성을 점검하기 위한 팀 내부 테스트 사이트 모음입니다. 각 테스트 사이트는 하나의 시작 URL에서 내부 게시글, 댓글, 페이지네이션, iframe을 따라 탐색할 수 있는 정적 웹사이트로 구성합니다.

현재 포함된 사이트는 가상의 지자체 커뮤니티인 **한빛시 시민소통광장**입니다. 실제 기관이나 실제 광고·거래 기능과 무관한 합성 환경입니다.

## 시작 주소

GitHub Pages를 활성화한 뒤에는 아래 주소를 탐지 프로그램의 입력값으로 사용합니다.

```text
https://eternal-return-lover.github.io/sumgwang-test-pages/test-site-1/
```

로컬에서 실행할 때는 `test-site-1/`을 정적 HTTP 서버로 제공한 뒤, 해당 폴더의 `index.html` 주소를 입력합니다. HTML 파일을 직접 더블클릭해 여는 `file://` 방식은 iframe·모듈 동작을 보장하지 않으므로 사용하지 않습니다.

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
└─ source/
   └─ hanbit-civic-ad-lab/            # 사이트 수정·재생성·검증용 원본
      ├─ src/                         # 테스트 사례 정의
      ├─ scripts/                     # 생성·로컬 실행·검사 스크립트
      ├─ reference/                   # 내부 성능 측정용 정답표
      └─ dist/lab/                    # 내부 결과 비교용 검증실
```

`test-site-1/`은 배포 결과물입니다. 탐지 프로그램은 이 폴더의 시작 URL만 입력받아야 합니다. `source/`는 팀이 사이트를 수정하고 결과를 검증하기 위한 개발 자료이며, 테스트 대상 페이지에서 이 폴더로 연결되는 링크는 없습니다.

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

1. `test-site-1/`의 시작 URL 하나를 탐지 프로그램에 입력합니다.
2. 내부 링크·게시글·댓글·iframe을 따라 탐색합니다.
3. DOM 텍스트, 속성, computed style, bounds, viewport, selector, iframe 경로를 수집합니다.
4. 필수 기법을 탐지하고 `result.json`을 생성합니다.
5. 내부 성능 측정 시 `source/hanbit-civic-ad-lab/dist/lab/`의 검증실에서 결과 파일을 비교합니다.

권장 초기 설정은 최대 150 URL, 최대 depth 8, 전체 제한 시간 1,800초입니다. 이는 이 테스트 사이트를 위한 초기 권장값이며 공식 평가 환경의 조건을 의미하지 않습니다.

## 사이트 수정 방법

수정은 `test-site-1/`의 생성 파일을 직접 고치기보다 원본 프로젝트에서 진행합니다.

```powershell
cd source\hanbit-civic-ad-lab
npm run build
npm run check
```

빌드가 끝나면 `source/hanbit-civic-ad-lab/dist/`의 내용 중 `lab/`을 제외한 결과물을 `test-site-1/`에 반영합니다. 이후 원본 변경과 배포 결과물을 함께 커밋합니다.

```text
source 수정
    ↓
npm run build
    ↓
dist 결과 확인
    ↓
test-site-1/ 반영
    ↓
npm run check 및 브라우저 확인
    ↓
커밋·푸시
```

## 내부 검증실과 정답표

`source/hanbit-civic-ad-lab/reference/ground-truth.json`에는 각 사례의 원문·위치·기대 기법이 있습니다. `source/hanbit-civic-ad-lab/dist/lab/`의 검증실은 팀 프로그램이 생성한 `result.json`을 비교해 정탐, 미탐, 오탐, 중복, 필수 필드 오류를 확인합니다.

이 자료들은 팀 내부 성능 측정에 사용합니다. 테스트 프로그램의 입력 URL은 반드시 `test-site-1/`으로 지정하고, `source/` 또는 검증실을 탐색 범위에 포함하지 마세요.

## GitHub Pages 배포

저장소 설정에서 **Settings → Pages**로 이동해 아래처럼 설정합니다.

```text
Source: Deploy from a branch
Branch: main
Folder: /(root)
```

배포 후 저장소 루트는 테스트 사이트 목록을 제공하며, 한빛시 사이트는 `/test-site-1/` 경로에서 열립니다. 새 테스트 사이트를 추가할 때는 `test-site-2/`, `test-site-3/`처럼 독립 폴더를 만들고 루트 `index.html`에 진입 링크를 추가합니다.

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
