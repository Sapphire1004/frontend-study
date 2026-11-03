// 로그인 상태를 관리할 Zustand 스토어를 작성하는 파일입니다.
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
