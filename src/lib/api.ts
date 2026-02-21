import axios from 'axios';
import { useAuthStore } from '../store/auth-store';
import { toast } from 'sonner';

/**
 * Centralized API Client
 */
const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// Request interceptor: add Authorization header
api.interceptors.request.use((config) => {
    const token = useAuthStore.getState().token;
    // P1.1: SECURE TOKEN INJECTION
    // Ensure we don't send "Bearer undefined" or "Bearer null"
    if (token && token !== 'undefined' && token !== 'null') {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Response interceptor: handle token expiration
api.interceptors.response.use((response) => {
    return response;
}, (error) => {
    if (error.response?.status === 401) {
        // P1.2: PREVENT BLIND REDIRECTS
        // Skip auth redirect for public auth pages (login & register)
        const isPublicAuthPage = typeof window !== 'undefined' &&
            (window.location.pathname.startsWith('/login') || window.location.pathname.startsWith('/register'));

        if (!isPublicAuthPage) {
            // Visual Alert: Themed Toast
            toast("Sesi Berakhir", {
                description: "Sesi berakhir demi keamanan, silakan masuk kembali.",
                style: {
                    background: '#FDFCFB',
                    color: '#3C2A21',
                    border: '1px solid #3C2A2120'
                }
            });

            // Clear auth state
            useAuthStore.getState().logout();

            // Redirect
            if (typeof window !== 'undefined') {
                window.location.href = '/login';
            }
        }
    }
    return Promise.reject(error);
});

export default api;
