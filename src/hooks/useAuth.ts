import { useAuthStore } from '@/store/auth-store';
import { useEffect, useState } from 'react';

export function useAuth() {
    const { token, user, store, logout } = useAuthStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return {
        token: mounted ? token : null,
        user: mounted ? user : null,
        store: mounted ? store : null,
        logout,
        isAuthenticated: mounted && !!token,
    };
}
