import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Auth, AuthState } from '@/types/auth';

interface AuthStore extends AuthState {
  login: (user: Auth) => void;
  logout: () => void;
  updateUser: (userData: Partial<Auth>) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      
      login: (user: Auth) => set({
        isAuthenticated: true,
        user
      }),
      
      logout: () => set({
        isAuthenticated: false,
        user: null
      }),
      
      updateUser: (userData: Partial<Auth>) => set((state) => ({
        user: state.user ? { ...state.user, ...userData } : null
      }))
    }),
    {
      name: 'auth-storage'
    }
  )
);
