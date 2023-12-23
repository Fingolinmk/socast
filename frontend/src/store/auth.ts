import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthStore {
  token: string | null;
  user: string | null;

  setToken: (newToken: string) => void;
  clearToken: () => void;

  setUser: (newUser: string) => void;
  clearUser: () => void;

}

const useAuthStore = create<AuthStore>(
  persist(
    (set) => {
      const storedToken = typeof window !== 'undefined' && localStorage.getItem('token');
      const storedUser = typeof window !== 'undefined' && localStorage.getItem('user');

      return {
        token: storedToken || null,
        setToken: (newToken: string) => {
          typeof window !== 'undefined' && localStorage.setItem('token', newToken);
          set({ token: newToken });
        },
        clearToken: () => {
          typeof window !== 'undefined' && localStorage.removeItem('token');
          set({ token: null });
        },

        user: storedUser || '',
        setUser: (newUser: string) => {
          typeof window !== 'undefined' && localStorage.setItem('user', newUser);
          set({ user: newUser });
        },
        clearUser: () => {
          typeof window !== 'undefined' && localStorage.removeItem('user');
          set({ user: null });
        },
      };
    },
    { name: 'authStorage' }
  )
);

export default useAuthStore