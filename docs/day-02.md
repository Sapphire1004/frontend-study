# Day 02 · Zustand로 로그인 상태 관리하기

[학습 홈](../README.md) · [전체 목차](README.md) · [이전: Day 01](day-01.md) · [다음: Day 03](day-03.md)

## 기록 정보

- 실제 학습일: **2026-11-03 (Asia/Tokyo)**
- 상태: **핵심 로그인·로그아웃 실습 동작 확인**
- 학습 방식: 직접 작성 → 질문 → 설명 확인 → 브라우저 동작 확인
- 수업 자료: [사용자가 제공한 Day 2 원문](lessons/day-02-zustand.txt)
- 전체 저장소 검사에는 이전부터 남아 있던 Deckbuilder·Game의 반환 오류 2개가 있음

원래 예정해 둔 컴포넌트와 Props 대신, 실제 수행한 Zustand 로그인 실습으로 이 문서를 갱신했습니다. Day 03~07은 실제 과제가 정해지기 전까지 목표 제안으로 남겨 둡니다.

## 오늘의 목표

라우팅 구조에 전역 상태를 붙여 다음 흐름을 직접 작성합니다.

```text
Home의 Login 클릭
  ↓
Zustand에 { id: 1, nickname: 'Reliya' } 저장
  ↓
Profile에서 같은 사용자 정보 읽기
  ↓
Logout 클릭
  ↓
user = null, isLoggedIn = false
  ↓
navigate('/')로 Home 이동
```

- [x] Zustand를 설치하고 버전을 기록한다: **5.0.16**.
- [x] `User` 타입을 정의하고 스토어에서 `import type`으로 가져온다.
- [x] `user`, `login()`, `logout()`을 가진 스토어를 만든다.
- [x] Home에서 목 데이터로 로그인하고 콘솔 출력을 확인한다.
- [x] Profile에서 로그인 상태에 따라 사용자 정보 또는 Not logged in을 표시한다.
- [x] Logout으로 상태를 초기화하고 Home으로 이동한다.
- [x] `isLoggedIn`을 추가하고 로그인·로그아웃 때 함께 변경한다.
- [x] 새로고침하면 메모리의 사용자 정보가 초기화되는 것을 확인한다.

이번 구현은 목 데이터를 이용한 상태 관리 실습입니다. 수업 자료에 언급된 Header의 사용자 표시, Spring Boot API, JWT, HTTP-Only Cookie, `/api/auth/me`는 오늘 구현한 기능에 포함되지 않습니다. 이 저장소의 현재 백엔드는 Hono입니다.

## 수업 구성

아래 시간은 제공된 수업 자료의 안내 기준이며 실제 작업 시간을 측정한 결과는 아닙니다.

| 구간       | 실습                                                        |
| ---------- | ----------------------------------------------------------- |
| 0~10분     | 로그인 사용자 정보를 여러 페이지에서 공유하는 이유 이해하기 |
| 10~25분    | `User`, `AuthState`, `login`, `logout` 작성하기             |
| 25~35분    | Home에서 가짜 로그인 연결하기                               |
| 35~45분    | Profile에서 상태 읽고 조건부로 표시하기                     |
| 45~55분    | 로그아웃과 `navigate('/')` 연결하기                         |
| 마지막 5분 | `isLoggedIn` 추가와 중복 상태의 관계 생각하기               |

수업 자료의 설치 명령은 `npm install zustand`지만 이 프로젝트에서는 **`pnpm add zustand`**를 사용했습니다. 원문의 `react-router-dom` 예시와 달리 현재 설치된 라우터 8.x에서는 **`react-router`**에서 가져옵니다.

## 작성한 파일

| 파일                                                             | 역할                                       |
| ---------------------------------------------------------------- | ------------------------------------------ |
| [types/auth.ts](../frontend/src/types/auth.ts)                   | 공유할 `User` 타입                         |
| [store/authStore.ts](../frontend/src/store/authStore.ts)         | 사용자와 로그인 여부, 로그인·로그아웃 액션 |
| [HomePage.tsx](../frontend/src/pages/home/HomePage.tsx)          | Login 클릭과 사용자 콘솔 출력              |
| [ProfilePage.tsx](../frontend/src/pages/profile/ProfilePage.tsx) | 조건부 사용자 표시, Logout과 Home 이동     |

페이지 파일은 기존 `pages/home/`, `pages/profile/`처럼 페이지별 하위 폴더에 있습니다. 수업 자료의 평평한 폴더 예시는 실제 프로젝트 구조에 맞춰 읽습니다.

### 타입과 스토어

```ts
export type User = {
  id: number;
  nickname: string;
};
```

`User`는 값의 형태를 검사하는 타입입니다. `id`와 `nickname`의 실제 값은 Home에서 `login()`에 전달한 객체에서 옵니다.

```ts
import { create } from 'zustand';

import type { User } from '@/types/auth';

type AuthState = {
  user: User | null;
  isLoggedIn: boolean;
  login: (user: User) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoggedIn: false,
  login: (user) => set({ user, isLoggedIn: true }),
  logout: () => set({ user: null, isLoggedIn: false }),
}));
```

`set()`으로 상태를 갱신하고, 컴포넌트는 필요한 값만 선택해 읽습니다. `user.nickname`을 직접 바꾸는 대신 스토어의 액션으로 갱신합니다.

### Home의 가짜 로그인

```ts
const login = useAuthStore((state) => state.login);

const handleLogin = () => {
  login({ id: 1, nickname: 'Reliya' });
  console.log('user =', useAuthStore.getState().user);
};
```

화면 표시에는 Hook으로 구독한 값을 사용합니다. 여기서 `getState()`는 클릭 직후 저장된 값을 콘솔에서 확인하는 데 사용했습니다.

### Profile의 상태 읽기와 로그아웃

```ts
const user = useAuthStore((state) => state.user);
const logout = useAuthStore((state) => state.logout);
const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

const handleLogout = () => {
  logout();
  navigate('/');
};
```

Home과 Profile이 같은 스토어를 사용하므로 페이지마다 `user`를 props로 전달하지 않아도 같은 사용자 정보를 읽을 수 있습니다.

## 오늘 질문하고 확인한 내용

### 목 데이터를 만들라는 뜻인가?

`{ id: 1, nickname: 'Reliya' }`는 목 데이터입니다. 객체를 준비하는 것과 함께 버튼 이벤트 → 스토어 저장 → 다른 페이지에서 읽기까지 연결하는 실습입니다. 실제 자격 증명을 검사하는 로그인 API는 연결하지 않았습니다.

### 공통 스타일을 중복하지 않고 로그인 상태를 표시하려면?

공통 제목·버튼·레이아웃은 한 번 작성하고, 사용자 정보 영역만 JSX 안에서 조건부로 표시합니다. 컴포넌트 분리는 이번 과제의 선행 조건으로 두지 않았습니다.

```tsx
{
  !isLoggedIn || user === null ? (
    <h1>Not logged in</h1>
  ) : (
    <>
      <p>ID: {user.id}</p>
      <p>Nickname: {user.nickname}</p>
    </>
  );
}
```

위 코드는 조건부 영역의 예시입니다. 실제 Profile에는 공통 제목과 로그인된 영역의 제목이 각각 남아 있어, 로그인하면 Profile 제목이 두 번 표시됩니다. 제목 정리는 남은 화면 수정 항목입니다.

`div` 중첩과 props drilling은 다릅니다. props drilling은 데이터를 여러 단계의 컴포넌트에 props로 전달하는 일입니다. 현재는 같은 페이지 안에서 조건부 렌더링하므로 컴포넌트를 더 나눌 필요 없이 연습할 수 있습니다.

### User 타입을 페이지에서도 다시 지정해야 하는가?

`AuthState.user`가 `User | null`이고 `create<AuthState>`로 스토어를 만들었기 때문에, `useAuthStore((state) => state.user)`의 결과도 같은 타입으로 추론됩니다. 페이지에서 `User`를 다시 import하거나 `user.id`의 타입을 따로 지정할 필요는 없습니다.

### return 뒤의 JSX와 null 오류

Profile에 `return;`이 남아 있어 함수가 JSX를 반환하지 않는 문제가 있었습니다. 이 뒤의 도달할 수 없는 JSX에서는 조건에 따른 `user`의 타입 좁히기도 적용되지 않아 `user.id`, `user.nickname`에 TS18047 오류가 표시됐습니다.

```tsx
return <>{/* 표시할 JSX */}</>;
```

여는 괄호를 `return`과 같은 줄에 두고 JSX 전체를 반환하도록 고쳤습니다. 별도 복사본으로 JS·Rust 검사에서 원인을 확인한 뒤 실제 Profile 파일을 수정했습니다.

### isLoggedIn이 true인데도 user가 null일 수 있다고 나오는 이유

현재 타입은 `isLoggedIn: boolean`과 `user: User | null`을 독립적인 값으로 정의합니다. 로그인 액션에서 두 값을 함께 바꾸더라도 TypeScript는 `isLoggedIn`이 true일 때 `user`가 반드시 존재한다는 관계까지 보장하지 않습니다. `{ isLoggedIn: true, user: null }`도 현재 타입상 가능한 조합입니다.

오늘은 사용자 정보를 읽는 분기에 `user`의 null 검사를 함께 넣었습니다. 이 수정 후 Profile의 TS18047 오류는 사라졌습니다.

### AND와 OR는 어떻게 다른가?

```ts
isLoggedIn && user !== null; // 로그인됨 AND 사용자 있음
!isLoggedIn || user === null; // 로그인 안 됨 OR 사용자 없음
```

두 조건은 서로 반대입니다. 로그인된 화면을 먼저 고르면 첫 번째 조건을 쓰고, Not logged in을 먼저 고르면 두 번째 조건을 씁니다. 참·거짓 분기에 배치하는 화면도 서로 바꿉니다.

다른 설계로 `isLoggedIn`을 별도 저장하지 않고 `user !== null`로 계산하거나, 두 상태의 관계를 판별 유니온으로 표현하는 방법도 이야기했습니다. 오늘 코드는 직접 null을 확인하는 방식을 사용합니다.

### 새로고침하면 로그아웃되는 이유

현재 스토어는 메모리에 있습니다. 페이지 사이를 Link나 navigate로 이동하면 상태가 유지되지만 브라우저를 새로고침하면 스토어가 초기화됩니다. 로그인 후 Profile에서 새로고침해 Not logged in으로 바뀌는 동작을 확인했습니다.

현재 저장소에는 영속화나 인증 복구 API가 구현되어 있지 않습니다. 수업 자료의 쿠키·JWT·Spring Boot 구조는 앞으로 다룰 수 있는 내용이며, 구현이 끝난 것으로 기록하지 않습니다.

## 함께 정리한 개발 환경

- Zustand **5.0.16**을 설치하고 `package.json`, `pnpm-lock.yaml`에 버전을 고정했습니다.
- 프런트엔드의 `@/`는 `frontend/src/`를 가리킵니다. Vite alias와 TypeScript paths를 함께 설정하고 내부 import를 통일했습니다.
- 백엔드는 현재 상대 경로를 사용합니다. Node.js 실행에 프런트 별칭이 자동 적용되는 것은 아닙니다.
- VS Code 자동 import는 별칭 우선으로 설정했습니다.
- `.vscode/settings.json`에서 이 프로젝트의 인라인 코드 제안과 Copilot 자동완성·다음 수정 제안을 껐습니다.
- 버튼·링크에 간단한 Tailwind 색상, 테두리, 간격, hover 스타일을 붙였습니다.
- `pnpm dev`로 Vite·Hono·tsrs watch를 함께 실행하고 프런트 → API 프록시 → Hono의 HTTP 응답을 확인했습니다.

설치 버전과 자세한 실행 방법은 [개발 환경 문서](setup.md)에 있습니다.

## 검증 결과

2026-11-03에 실제로 확인한 결과입니다.

| 확인 항목                      | 결과                                                                       |
| ------------------------------ | -------------------------------------------------------------------------- |
| 비로그인 상태에서 Profile 열기 | Not logged in 표시                                                         |
| Home → Login → Profile         | ID: 1, Nickname: Reliya 표시                                               |
| Login 클릭 직후 콘솔           | 저장된 사용자 객체 출력                                                    |
| Profile → Logout               | Home(`/`)으로 이동                                                         |
| Logout 후 다시 Profile 열기    | Not logged in 표시                                                         |
| 로그인한 Profile에서 새로고침  | Not logged in으로 초기화                                                   |
| `pnpm build:frontend`          | 통과                                                                       |
| `pnpm format:check`            | 전체 프로젝트 포맷 검사 통과                                               |
| `pnpm typecheck`               | Profile의 null 오류는 없음. 기존 Deckbuilder·Game의 TS2786 오류 2개로 실패 |
| `pnpm check`                   | 기존 Deckbuilder·Game의 `no-unreachable` 오류 2개로 린트 단계에서 중단     |

`pnpm check`가 린트에서 중단되면 그 명령 안의 포맷 검사와 타입 검사는 실행되지 않습니다. 타입 검사는 위와 같이 별도 실행한 결과를 기록했습니다. 전체 검사 통과로 표시하지 않습니다.

## 남은 실습

- [ ] [DeckbuilderPage](../frontend/src/pages/deckbuilder/DeckbuilderPage.tsx)의 `return;` 뒤 JSX가 실제로 반환되도록 고친다.
- [ ] [GamePage](../frontend/src/pages/game/GamePage.tsx)의 반환 구조를 고치고 Exit Game → Lobby 이동을 확인한다.
- [ ] Profile에 두 번 표시되는 제목을 정리한다.
- [ ] 수정 후 `pnpm check`, `pnpm build`가 모두 통과하는지 확인한다.
- [ ] 코드 없이 Home과 Profile이 같은 사용자 정보를 읽는 이유를 자신의 말로 설명한다.

## 복습 질문

1. `user`를 props로 전달하지 않아도 Profile에서 읽을 수 있는 이유는?
2. `login(user)`와 `set({ user })`는 각각 무슨 역할을 하는가?
3. `isLoggedIn`을 true로 검사하는 것과 `user`의 null 검사가 별개인 이유는?
4. `!isLoggedIn || user === null`을 로그인된 경우를 검사하는 조건으로 바꾸면?
5. Link 이동에서는 유지되던 상태가 새로고침하면 초기화되는 이유는?
6. 수업 자료의 실제 로그인 API와 오늘 만든 목 로그인은 어떤 점이 다른가?

## 직접 작성할 회고

- 오늘 배운 내용을 내 말로 설명하기:
- 혼자 다시 작성해 보고 싶은 부분:
- 다음에 질문할 내용:

## 참고 문서

- [Zustand: 스토어 만들기와 컴포넌트에서 읽기](https://github.com/pmndrs/zustand#first-create-a-store)
- [React: 조건부 렌더링](https://react.dev/learn/conditional-rendering)
- [TypeScript: 타입 좁히기](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)
- [MDN: return과 자동 세미콜론 삽입](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/return#automatic_semicolon_insertion)

---

[학습 홈](../README.md) · [전체 목차](README.md) · [이전: Day 01](day-01.md) · [다음: Day 03](day-03.md)
