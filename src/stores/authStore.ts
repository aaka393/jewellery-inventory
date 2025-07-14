import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { User, LoginCredentials, RegisterData, LoadingState } from '../types';
import { authService } from '../services/authService';

interface AuthStore extends LoadingState {
  // State
  user: User | null;
  isAuthenticated: boolean;
  
  // Actions
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  getCurrentUser: () => Promise<void>;
  updateProfile: (userData: Partial<User>) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthStore>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,

        // Actions
        login: async (credentials) => {
          set({ isLoading: true, error: null });
          try {
            const authResponse = await authService.login(credentials);
            set({
              user: authResponse.user,
              isAuthenticated: true,
              isLoading: false,
            });
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Login failed',
              isLoading: false,
            });
            throw error;
          }
        },

        register: async (userData) => {
          set({ isLoading: true, error: null });
          try {
            const authResponse = await authService.register(userData);
            set({
              user: authResponse.user,
              isAuthenticated: true,
              isLoading: false,
            });
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Registration failed',
              isLoading: false,
            });
            throw error;
          }
        },

        logout: async () => {
          set({ isLoading: true });
          try {
            await authService.logout();
          } catch (error) {
            console.error('Logout error:', error);
          } finally {
            set({
              user: null,
              isAuthenticated: false,
              isLoading: false,
              error: null,
            });
          }
        },

        getCurrentUser: async () => {
          if (!authService.isAuthenticated()) {
            return;
          }

          set({ isLoading: true, error: null });
          try {
            const user = await authService.getCurrentUser();
            set({
              user,
              isAuthenticated: true,
              isLoading: false,
            });
          } catch (error) {
            set({
              user: null,
              isAuthenticated: false,
              error: error instanceof Error ? error.message : 'Failed to get user',
              isLoading: false,
            });
          }
        },

        updateProfile: async (userData) => {
          set({ isLoading: true, error: null });
          try {
            const updatedUser = await authService.updateProfile(userData);
            set({
              user: updatedUser,
              isLoading: false,
            });
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Failed to update profile',
              isLoading: false,
            });
            throw error;
          }
        },

        changePassword: async (currentPassword, newPassword) => {
          set({ isLoading: true, error: null });
          try {
            await authService.changePassword(currentPassword, newPassword);
            set({ isLoading: false });
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Failed to change password',
              isLoading: false,
            });
            throw error;
          }
        },

        forgotPassword: async (email) => {
          set({ isLoading: true, error: null });
          try {
            await authService.forgotPassword(email);
            set({ isLoading: false });
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Failed to send reset email',
              isLoading: false,
            });
            throw error;
          }
        },

        resetPassword: async (token, newPassword) => {
          set({ isLoading: true, error: null });
          try {
            await authService.resetPassword(token, newPassword);
            set({ isLoading: false });
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Failed to reset password',
              isLoading: false,
            });
            throw error;
          }
        },

        clearError: () => set({ error: null }),
      }),
      {
        name: 'auth-store',
        partialize: (state) => ({
          user: state.user,
          isAuthenticated: state.isAuthenticated,
        }),
      }
    ),
    { name: 'auth-store' }
  )
);