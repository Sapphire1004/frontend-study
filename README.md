# Study

Vite + React + Tailwind CSS 프런트엔드와 Hono 백엔드입니다. 타입 검사와 서버 컴파일은 **tsrs**, 린트는 **Oxlint**, 포맷은 **Oxfmt**를 사용합니다.

## 설치 버전

실제 설치된 패키지와 `package.json`의 고정 버전을 대조한 목록입니다. 직접 의존성은 정확한 버전으로 고정하고 하위 의존성은 `pnpm-lock.yaml`에서 관리합니다.

| 실행 환경 | 버전      |
| --------- | --------- |
| Node.js   | `24.15.0` |
| pnpm      | `11.17.0` |

| 패키지                       | 설치 버전             |
| ---------------------------- | --------------------- |
| `@hono/node-server`          | `2.1.5`               |
| `hono`                       | `4.13.14`             |
| `react`                      | `19.3.1`              |
| `react-dom`                  | `19.3.1`              |
| `react-router`               | `8.5.1`               |
| `@tailwindcss/vite`          | `4.3.3`               |
| `@types/node`                | `24.19.2`             |
| `@types/react`               | `19.3.0`              |
| `@types/react-dom`           | `19.3.0`              |
| `@vitejs/plugin-react`       | `6.1.2`               |
| `concurrently`               | `10.0.6`              |
| `oxfmt`                      | `0.75.0`              |
| `oxlint`                     | `1.90.0`              |
| `tailwindcss`                | `4.3.3`               |
| `tsrs`                       | `0.20.1-ts7.1.0-beta` |
| `tsx`                        | `4.23.15`             |
| `typescript-go → typescript` | `7.1.0-beta`          |
| `typescript-js → typescript` | `6.0.3`               |
| `vite`                       | `8.3.5`               |

## 시작하기

Node.js `24.15.0`, pnpm `11.17.0`을 기준으로 설정했습니다. 의존성과 명령은 루트의 `package.json`, `pnpm-lock.yaml`에서 함께 관리합니다.

```sh
pnpm install
pnpm dev
```

- 프런트엔드: http://127.0.0.1:5173
- Hono API: http://127.0.0.1:3000/api/health
- Vite가 `/api` 요청을 Hono로 전달합니다.
- React Fast Refresh, Hono 자동 재시작, tsrs 타입 검사 watch가 함께 실행됩니다.
- 종료: `Ctrl+C`

5173 포트가 사용 중이면 Vite가 다음 빈 포트를 선택합니다. 터미널의 `Local` 주소를 확인하세요.

API 포트를 바꾸려면 루트의 `.env.example`을 `.env`로 복사하고 `PORT`를 수정하세요. Vite 프록시에도 같은 값이 적용됩니다.

## 파일 구조

```text
frontend/
  src/
    App.tsx              React Router 경로 설정
    main.tsx             React 진입점
    style.css            Tailwind 진입점과 공통 폰트 테마
    pages/
      home/HomePage.tsx
      profile/ProfilePage.tsx
      deckbuilder/DeckbuilderPage.tsx
      update-deck/UpdateDeckPage.tsx
      lobby/LobbyPage.tsx
      game/GamePage.tsx
    lib/api.ts           Hono RPC 클라이언트 (백엔드 응답 타입 공유)
  index.html
  vite.config.ts         Vite 프로젝트 경로와 /api 프록시
  tsconfig.json          프런트엔드 타입 검사
backend/
  src/
    app.ts               Hono API 라우트와 공유 타입
    index.ts             Node.js 서버와 정적 파일 제공
  tsconfig.json          백엔드 NodeNext 타입 검사·컴파일
scripts/
  compilers.mjs          JS·Go·Rust 컴파일러 실행
  typecheck.mjs          컴파일러별 동일 프로젝트 검사
  benchmark-types.mjs    3종 컴파일러 반복 측정과 JSON 저장
dist/
  frontend/              Vite 빌드 결과
  backend/               tsrs가 생성한 서버 JavaScript
tsconfig.json            공통 strict 설정과 개발 watch 대상
.oxlintrc.json           Oxlint 설정
.oxfmtrc.json            Oxfmt 설정
```

## 페이지

페이지는 `/`, `/profile`, `/deckbuilder`, `/update-deck`, `/lobby`, `/game`에 연결되어 있습니다. 각 페이지는 이름이 들어 있는 `<h1>`만 렌더링합니다.

## 명령어

| 명령어                                       | 실행 내용                                                  |
| -------------------------------------------- | ---------------------------------------------------------- |
| `pnpm dev`                                   | 프런트엔드 + 백엔드 + tsrs watch                           |
| `pnpm dev:frontend`                          | Vite만 실행                                                |
| `pnpm dev:backend`                           | Hono만 실행                                                |
| `pnpm dev:types`                             | tsrs 타입 검사 watch                                       |
| `pnpm typecheck`                             | tsrs로 프런트엔드·백엔드 검사                              |
| `pnpm typecheck:fast`                        | tsrs의 선택적 `--fast` 모드로 검사                         |
| `pnpm typecheck:tsc`                         | 기존 JS 기반 TypeScript 6로 검사                           |
| `pnpm typecheck:tsgo`                        | Go 기반 TypeScript 7.1 beta로 검사                         |
| `pnpm bench:types`                           | JS·Go·Rust 3종 타입 검사 속도 비교                         |
| `pnpm bench:types:fast`                      | Rust에 `--fast`를 적용한 3종 비교                          |
| `pnpm lint` / `pnpm lint:fix`                | Oxlint 검사 / 자동 수정                                    |
| `pnpm format` / `pnpm format:check`          | Oxfmt 적용 / 포맷 검사                                     |
| `pnpm check`                                 | Oxlint + Oxfmt + tsrs 검사                                 |
| `pnpm build`                                 | tsrs 타입 검사 → Vite 프런트엔드 빌드 → tsrs 백엔드 컴파일 |
| `pnpm build:frontend` / `pnpm build:backend` | 각 빌드만 실행                                             |
| `pnpm start`                                 | 빌드된 서버에서 API와 React 정적 파일 제공                 |

빌드 후 http://127.0.0.1:3000 에서 앱과 API를 함께 사용할 수 있습니다. 명령은 프로젝트 루트에서 실행하세요.

## TypeScript 3종 속도 비교

| 구현          | 설치 패키지                    | 버전                  |
| ------------- | ------------------------------ | --------------------- |
| JS (`tsc`)    | `typescript-js` → `typescript` | `6.0.3`               |
| Go (`tsgo`)   | `typescript-go` → `typescript` | `7.1.0-beta`          |
| Rust (`tsrs`) | `tsrs`                         | `0.20.1-ts7.1.0-beta` |

TypeScript 7부터 공식 컴파일러가 Go 구현이므로 기존 JS 구현은 6.x로 고정했습니다. Go와 Rust는 TypeScript 7.1 beta를 기준으로 맞췄습니다. 스크립트가 각 패키지의 실행 파일을 직접 선택합니다.

```sh
# 각 컴파일러로 현재 코드 검사
pnpm typecheck:tsc
pnpm typecheck:tsgo
pnpm typecheck

# 프런트엔드 + 백엔드 타입 검사 속도 비교
pnpm bench:types

# 반복 횟수 조절
pnpm bench:types --runs 10 --warmup 2

# 백엔드만 비교 (다른 tsconfig 경로도 지정 가능)
pnpm bench:types --project backend/tsconfig.json

# Rust의 선택적 성능 모드 비교
pnpm bench:types:fast

# 옵션 확인
pnpm bench:types --help
```

측정 방법:

- 모든 컴파일러에 같은 프런트엔드·백엔드 tsconfig와 `--noEmit --incremental false --pretty false`를 적용합니다.
- 컴파일러마다 워밍업 2회 후 7회 측정하고, 실행 순서를 매 회전 바꿉니다. 컴파일러는 하나씩 실행합니다.
- 매번 새 CLI 프로세스를 실행합니다. 실행기와 컴파일러 시작 시간은 포함하고 pnpm 시작 시간은 제외합니다.
- 디스크 캐시는 워밍업된 상태입니다. 운영체제 캐시를 비우는 cold-disk 실험은 수행하지 않습니다.
- 프런트엔드·백엔드 검사 시간의 합계를 중앙값·평균·최소·최대로 출력하고 JS 중앙값 대비 배속을 계산합니다.
- 타입 검사 실패나 프로세스 오류가 있으면 즉시 중단합니다. 실패한 실행은 속도 순위에 넣지 않습니다.
- 벤치마크에서는 상속된 TSRS·Go·Rayon 튜닝 환경 변수를 제거합니다. 기본 비교의 Rust fast 모드는 꺼져 있습니다.

원시 시간, 프로젝트별 시간, 버전, OS·CPU 정보는 `.bench/typecheck-results.json`에 저장합니다. 다음 실행에서 갱신되며 Git에는 포함되지 않습니다. 별도 기록은 `--output .bench/my-result.json`으로 저장하세요.

현재 프로젝트는 작으므로 시작 시간과 의존성 타입 파싱의 비중이 큽니다. 프로젝트가 커지면 결과가 달라집니다. JS 6과 Go·Rust 7.1은 언어 버전과 기본 타입 라이브러리도 달라서 이 결과에는 구현 언어 외의 차이도 포함됩니다.

## 스타일 (Tailwind CSS)

Tailwind CSS `4.3.3`과 공식 `@tailwindcss/vite` 플러그인을 사용합니다. `pnpm dev`와 `pnpm build`에 Tailwind 처리가 포함되어 있습니다.

- `frontend/src/style.css`: Tailwind import와 `@theme` 공통 폰트 설정
- `frontend/vite.config.ts`: Tailwind Vite 플러그인
- 스타일 적용: React의 `className` 또는 HTML의 `class`에 유틸리티 클래스 작성
- 클래스 검색 범위: `frontend/` (CSS의 `source('../')`)
- `pnpm format`: Oxfmt가 프로젝트의 Tailwind 테마를 읽고 클래스 순서까지 정렬

VS Code 추천 확장 **Tailwind CSS IntelliSense** (`bradlc.vscode-tailwindcss`)을 설치하면 클래스 자동완성을 사용할 수 있습니다.

- [Tailwind CSS Vite 연동 문서](https://tailwindcss.com/docs/installation/using-vite)

## 린트와 에디터

`.oxlintrc.json`에서 TypeScript·React·접근성 검사와 React Hooks 규칙을 설정했습니다. `.oxfmtrc.json`은 2칸 들여쓰기, 작은따옴표, 세미콜론 생략, import 정렬과 Tailwind 클래스 정렬을 사용합니다.

VS Code 추천 확장 **Oxc** (`oxc.oxc-vscode`)을 설치하면 저장 시 Oxfmt 포맷과 Oxlint 자동 수정을 실행합니다.

타입 검사에는 **TypeScript 7** (`TypeScriptTeam.native-preview`) 확장이 `node_modules/tsrs/tsdk`를 선택하도록 설정했습니다. 확장 설치 후 작업 영역 SDK 실행에 동의하고 `TypeScript 7: Restart Server` 또는 창 다시 로드를 실행하세요. CLI 검사와 빌드는 확장 설치 없이 tsrs를 사용합니다.

tsrs의 네이티브 바이너리는 npm 패키지에 포함되어 Rust 툴체인을 별도로 설치할 필요가 없습니다. `--fast`는 검사 결과가 달라질 수 있는 선택적 성능 모드이므로 별도 명령으로 제공합니다.

- [TypeScript Go 공식 안내](https://github.com/microsoft/typescript-go)
- [Cloudflare의 tsrs 발표](https://blog.cloudflare.com/typescript-rust-port/)
- [tsrs 사용법](https://github.com/oxc-project/tsrs/blob/main/docs/USAGE.md)
- [tsrs 호환성](https://github.com/oxc-project/tsrs/blob/main/docs/COMPATIBILITY.md)
- [tsrs 에디터 설정](https://github.com/oxc-project/tsrs/blob/main/docs/LSP.md#editor-setup)
- [Oxlint 문서](https://oxc.rs/docs/guide/usage/linter)
- [Oxfmt 문서](https://oxc.rs/docs/guide/usage/formatter)
