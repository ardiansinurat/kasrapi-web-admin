import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
    id: string;
    username: string;
    email: string;
    role: string;
}

interface Store {
    id: string;
    name: string;
    currency: string;
    useTables: boolean;
    taxPercentage: number;
    isOnboarded: boolean;
}

interface AuthState {
    token: string | null;
    user: User | null;
    store: Store | null;
    setAuth: (token: string, user: User) => void;
    setStore: (store: Store) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            token: null,
            user: null,
            store: null,
            setAuth: (token, user) => set({ token, user }),
            setStore: (store) => set({ store }),
            logout: () => set({ token: null, user: null, store: null }),
        }),
        {
            name: 'auth-storage', // unique name for localStorage key
        }
    )
);
