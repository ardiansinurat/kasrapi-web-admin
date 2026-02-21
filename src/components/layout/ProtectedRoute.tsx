"use client";

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { token, isAuthenticated } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!token && typeof window !== 'undefined') {
            const timer = setTimeout(() => {
                // Double check to avoid flicker if hydration lags
                if (!useAuthStore.getState().token) {
                    router.replace('/login');
                }
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [token, router]);

    // While checking or if not authenticated, show loading or null
    // We rely on the useEffect to redirect, but to prevent flash of content, we return null
    if (!isAuthenticated && !token) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    return <>{children}</>;
}

// Helper to access state directly without hook for the timeout check
import { useAuthStore } from '@/store/auth-store';
