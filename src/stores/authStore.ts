import { create } from 'zustand';
import type { User } from '@/types';
import { getUser, setUser as saveUser, clearAuth } from '@/utils/auth';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User) => void;
  logout: () => void;
  initialize: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,

  setUser: (user: User) => {
    saveUser(user);
    set({ user, isAuthenticated: true });
  },

  logout: () => {
    clearAuth();
    set({ user: null, isAuthenticated: false });
  },

  initialize: () => {
    const user = getUser();
    if (user) {
      set({ user, isAuthenticated: true });
    }
  },
}));

