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
    if (token) {
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
        if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login')) {
            window.location.href = '/login';
        }
    }
    return Promise.reject(error);
});

export default api;
