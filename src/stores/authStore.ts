// stores/authStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import * as authService from '../services/authService';
import { RegisterPayload } from '../types';

export type UserRole = 'admin' | 'user' | null;

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  mobile?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: RegisterPayload) => Promise<boolean>;
  logout: () => void;
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,

      login: async (email, password) => {
        try {
          const data = await authService.login({ username: email, password });
          set({ user: data.result, isAuthenticated: true });
          return true;
        } catch (err) {
          console.error('Login failed', err); // <-- you see this log
          return false;
        }
      },


      register: async (formData) => {
        try {
          await authService.register(formData);
          return true;
        } catch (err) {
          console.error('Registration failed', err);
          return false;
        }
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },

      setUser: (user: User) => {
        set({ user, isAuthenticated: true });
      },
    }),
    { name: 'auth-storage' }
  )
);
