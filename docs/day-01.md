# Day 01 · 라우팅과 페이지 이동

[학습 홈](../README.md) · [전체 목차](README.md) · [다음: Day 02](day-02.md)

## 기록 정보

- 학습일: **2026-10-30 (Asia/Tokyo)**
- 상태: **진행 중**
- 범위: 개발 환경 준비 내용을 정리하고, React 라우팅과 페이지 이동을 공부함
- 학습 방식: 직접 작성 → 질문 → 설명 확인 → 동작 확인

## 오늘의 목표

처음 정한 목표는 다음과 같습니다.

1. `react-router-dom`의 `BrowserRouter`를 사용한다.
2. URL별로 서로 다른 컴포넌트를 렌더링한다.
3. Home에서 `/profile`과 `/lobby`로 이동할 수 있게 한다.
4. 페이지 이동에 직접 작성한 `<a href>`를 사용하지 않는다.
5. `/game`에서는 버튼 클릭으로 `/lobby`로 돌아가게 만든다.

현재 프로젝트에는 **`react-router@8.5.1`**이 설치되어 있고 `react-router-dom`은 설치되어 있지 않습니다. 실제 코드는 `react-router`에서 import합니다. 8.x에서 `react-router-dom`이 제거된 점을 확인했습니다. 과제에서 패키지 이름까지 반드시 맞춰야 한다면 7.x 계열로 통일하는 별도 작업이 필요합니다. 버전 변경은 아직 하지 않았습니다.

근거: [React Router 변경 내역](https://reactrouter.com/changelog#removed-react-router-dom)

## 준비한 환경

- 프런트엔드: React + Vite + Tailwind CSS
- 백엔드: Hono
- 타입 검사와 백엔드 컴파일: Rust 기반 tsrs
- 린트: Oxlint
- 포맷: Oxfmt
- 비교용 컴파일러: JS TypeScript 6.0.3, Go TypeScript 7.1 beta
- GitHub: [Public 학습 저장소](https://github.com/Sapphire1004/frontend-study)

전체 설치 버전과 명령은 [개발 환경 문서](setup.md)에 보관합니다.

### 실행 명령

```sh
pnpm dev
```

프런트엔드·백엔드·실시간 타입 검사를 함께 실행합니다. `package.json`의 scripts에 등록된 명령입니다.

```sh
pnpm check
pnpm build
pnpm bench:types
```

## 폴더와 URL

페이지 컴포넌트는 `frontend/src/pages/` 아래에 둡니다. Vite에서 폴더를 만드는 작업과 URL을 연결하는 라우터 설정은 각각 필요합니다.

| URL            | 페이지 파일                                                                  |
| -------------- | ---------------------------------------------------------------------------- |
| `/`            | [HomePage.tsx](../frontend/src/pages/home/HomePage.tsx)                      |
| `/profile`     | [ProfilePage.tsx](../frontend/src/pages/profile/ProfilePage.tsx)             |
| `/deckbuilder` | [DeckbuilderPage.tsx](../frontend/src/pages/deckbuilder/DeckbuilderPage.tsx) |
| `/update-deck` | [UpdateDeckPage.tsx](../frontend/src/pages/update-deck/UpdateDeckPage.tsx)   |
| `/lobby`       | [LobbyPage.tsx](../frontend/src/pages/lobby/LobbyPage.tsx)                   |
| `/game`        | [GamePage.tsx](../frontend/src/pages/game/GamePage.tsx)                      |

라우팅의 틀은 환경 준비 단계에 포함되어 있었습니다. 복습할 때는 준비된 코드를 읽고 각 줄의 역할을 설명하거나, 필요한 부분을 비운 뒤 직접 다시 작성해 봅니다.

## 오늘 질문한 내용

### BrowserRouter는 무엇을 하는가?

브라우저의 주소·방문 기록과 React Router의 라우팅 상태를 연결합니다. 현재는 [main.tsx](../frontend/src/main.tsx)에서 App을 감싸고 있습니다.

```tsx
<BrowserRouter>
  <App />
</BrowserRouter>
```

### Routes 안에는 무엇을 작성하는가?

`Routes`는 현재 주소에 맞는 경로를 고르는 역할을 하고, `Route`에는 경로와 표시할 컴포넌트의 연결을 적습니다. 현재 연결은 [App.tsx](../frontend/src/App.tsx)에서 확인합니다.

복습 질문: 주소가 `/profile`일 때 어떤 설정을 통해 ProfilePage가 선택되는지 설명할 수 있는가?

공식 문서: [경로 설정](https://reactrouter.com/start/declarative/routing)

### Link와 navigate는 JavaScript 실행 여부가 다른가?

**둘 다 JavaScript로 동작합니다.**

| 도구       | 이동을 시작하는 방식                       | 예시                            |
| ---------- | ------------------------------------------ | ------------------------------- |
| Link       | JSX에 이동용 링크를 배치하고 사용자가 클릭 | 프로필 메뉴                     |
| navigate() | useNavigate로 얻은 함수를 코드에서 호출    | 버튼 이벤트나 처리 완료 후 이동 |

Link에도 onClick을 붙여 추가 JavaScript를 실행할 수 있습니다. 구분할 것은 JavaScript의 실행 여부보다 링크로 이동을 선언하는 방식과 코드에서 함수를 호출하는 방식입니다.

공식 문서: [페이지 이동](https://reactrouter.com/start/declarative/navigating)

### SPA는 무엇인가?

SPA는 하나의 HTML 문서를 유지하면서 JavaScript로 화면 내용을 바꾸는 앱 구성 방식입니다. 이 프로젝트의 라우팅에서는 주소와 렌더링할 페이지 컴포넌트가 바뀝니다. 필요한 데이터는 서버에 별도로 요청할 수 있습니다.

JavaScript는 프로그래밍 언어이고 SPA는 앱 구성 방식입니다.

참고: [MDN의 SPA 설명](https://developer.mozilla.org/en-US/docs/Glossary/SPA)

### Link도 실제로는 a 태그인가?

Link는 실제 DOM에서 a 요소를 만듭니다. 앱 내부로 이동하는 일반 클릭을 React Router가 처리하여 문서 전체를 새로 불러오지 않고 이동할 수 있게 합니다. 과제에서 금지한 것은 소스에 직접 `<a href>`로 페이지 이동을 작성하는 방식입니다.

공식 문서: [Link](https://reactrouter.com/api/components/Link)

### react-router-dom에서 Link를 가져올 수 없었던 이유는?

확인 당시 설치된 패키지는 `react-router@8.5.1`이었습니다. `react-router-dom`이 설치되어 있지 않아 해당 경로의 import가 실패했습니다. 현재 코드에 맞는 경로는 다음과 같습니다.

```tsx
import { Link } from 'react-router';
```

BrowserRouter, Routes, Route, useNavigate도 현재 같은 패키지에서 가져옵니다.

### return 다음 줄에 JSX를 적으면 어떻게 되는가?

다음 입력은 JSX를 반환하는 코드가 아닙니다.

```text
return
<>
  <h1>Deckbuilder</h1>
</>
```

JavaScript의 자동 세미콜론 삽입 규칙에 의해 `return;`으로 해석되어 함수가 먼저 끝납니다. 아래 JSX는 도달할 수 없는 코드가 됩니다.

여러 줄의 JSX를 반환할 때는 여는 괄호를 return과 같은 줄에 둡니다.

```tsx
function Example() {
  return (
    <>
      <h1>Example</h1>
    </>
  );
}
```

참고: [MDN의 return과 자동 세미콜론 삽입](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/return#automatic_semicolon_insertion)

### Oxfmt가 return 다음 줄을 ;<>로 정리하는가?

Oxfmt 0.75.0에서 실제 재현해 확인했습니다. 당시 `semi: false` 설정에서 return 뒤에 줄바꿈이 있고 별도의 JSX 표현식이 이어지면 다음과 같은 모양으로 출력됐습니다.

```text
return
;<>
  <h1>Deckbuilder</h1>
</>
```

앞에 세미콜론이 보이는 포맷과, 의도한 JSX를 반환하는지는 구분해서 봅니다. 현재 설정은 문장 끝에 세미콜론을 출력하는 **`semi: true`**입니다. 이 설정을 바꾸어도 return 뒤의 줄바꿈으로 생긴 동작 문제까지 해결되지는 않습니다.

설정 파일: [.oxfmtrc.json](../.oxfmtrc.json)

## Day 01 당시 코드에서 확인한 상태

후속 기록: [Day 02](day-02.md)에서 Profile의 반환 구조와 Home의 Lobby 링크 문구를 수정하고 로그인·로그아웃 동작을 확인했습니다. 현재 남은 반환 오류는 Deckbuilder·Game 2개입니다. 아래 표와 체크리스트는 Day 01 기록 당시의 상태를 보관합니다.

| 목표                         | 현재 상태                                                                              |
| ---------------------------- | -------------------------------------------------------------------------------------- |
| BrowserRouter로 App 감싸기   | 코드에 있음. 설치된 8.x의 import 경로를 사용함                                         |
| URL별 페이지 연결            | 여섯 경로의 틀이 준비되어 있음. 직접 다시 작성하며 복습할 대상                         |
| Home → Profile / Lobby       | Link 코드가 있음. Lobby 링크의 표시 문구를 확인할 필요가 있음                          |
| 직접 작성한 a href 없이 이동 | 현재 페이지 이동은 Link와 navigate로 작성됨                                            |
| Game 버튼 → Lobby            | 이동 함수와 버튼 코드는 있음. return 뒤의 코드가 실행되지 않는 문제를 먼저 확인해야 함 |

Day 01 당시 `pnpm check`는 린트 단계에서 아래 세 파일의 `no-unreachable` 오류로 중단됐습니다.

- [DeckbuilderPage.tsx](../frontend/src/pages/deckbuilder/DeckbuilderPage.tsx)
- [GamePage.tsx](../frontend/src/pages/game/GamePage.tsx)
- [ProfilePage.tsx](../frontend/src/pages/profile/ProfilePage.tsx)

이는 학습 도중의 상태이며, 해당 페이지들의 완료 확인은 아직 남아 있습니다.

## 남은 실습

- [ ] BrowserRouter가 App을 감싸는 이유를 자신의 말로 설명한다.
- [ ] Routes와 Route의 역할을 설명하고, 원하는 경로 하나를 직접 연결해 본다.
- [ ] 위 세 파일에서 JSX가 실제 반환되는지 확인하고 직접 수정한다.
- [ ] Home의 두 링크가 각각 Profile과 Lobby로 이동하는지 확인한다.
- [ ] Lobby 링크의 표시 문구와 실제 이동 경로가 서로 맞는지 확인한다.
- [ ] Game의 Exit Game 버튼으로 Lobby에 돌아가는지 확인한다.
- [ ] Profile의 두 버튼이 각각 Deckbuilder와 Home으로 이동하는지 확인한다.
- [ ] `pnpm check`를 다시 실행하고 결과를 아래에 기록한다.

## 환경 구성 중 진행한 컴파일러 비교

2026-10-30 00:03경(JST), 학습용 코드를 수정하기 전 환경 구성 상태에서 측정한 기록입니다. 현재 코드에 대해 다시 측정한 결과는 아닙니다.

| 구현 | 버전                     | 7회 중앙값 | 당시 JS 대비 |
| ---- | ------------------------ | ---------- | ------------ |
| JS   | TypeScript 6.0.3         | 655.6ms    | 1.00배       |
| Go   | TypeScript 7.1.0-beta    | 130.9ms    | 5.01배       |
| Rust | tsrs 0.20.1-ts7.1.0-beta | 83.1ms     | 7.89배       |

프런트엔드·백엔드 타입 검사 합계를 워밍업 2회 후 7회 측정했습니다. 새 CLI 프로세스와 시작 시간이 포함되고 증분 캐시는 껐습니다. 작은 프로젝트의 결과이며, JS와 Go·Rust는 TypeScript 버전과 기본 타입 라이브러리도 다릅니다.

로컬 원시 결과는 `.bench/typecheck-results.json`에 있으며 Git에는 포함되지 않습니다. 측정 방법과 재실행 명령은 [개발 환경 문서](setup.md#typescript-3종-속도-비교)를 참고합니다.

## GitHub에 기록 남기기

- 저장소는 Public으로 만들었습니다.
- `.env`, node_modules, dist, 설치 캐시와 로컬 벤치마크 결과는 업로드에서 제외했습니다.
- 처음 올린 커밋은 학습 중인 코드의 스냅샷입니다.
- 문서와 코드의 완료 여부는 실제 확인한 결과에 맞춰 갱신합니다.

## 복습 질문

1. BrowserRouter, Routes, Route는 각각 무슨 일을 하는가?
2. Link와 navigate는 JavaScript 실행 여부가 다른가?
3. JSX가 화면에 있는데도 함수가 아무것도 반환하지 않을 수 있는 이유는?
4. Oxfmt의 semi 설정을 바꾸면 return 줄바꿈 문제도 해결되는가?
5. 현재 프로젝트에서 react-router-dom을 import하면 왜 문제가 생기는가?

## 직접 작성할 기록

- 오늘 내용을 한 문장으로 설명하기:
- 스스로 수정한 파일과 이유:
- 브라우저에서 직접 확인한 경로:
- 질문에 대한 나의 설명:
- 수정 후 `pnpm check` 결과:
- 아직 남은 질문:
- 다음 학습 전에 할 일:
- 학습 변경 커밋:

---

[학습 홈](../README.md) · [전체 목차](README.md) · [다음: Day 02](day-02.md)
