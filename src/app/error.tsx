'use client';

import { useEffect } from 'react';
import { AlertCircle, RefreshCcw, Home } from 'lucide-react';
import Link from 'next/link';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error);
    }, [error]);

    return (
        <div className="min-h-screen bg-brand-bg flex items-center justify-center p-6">
            <div className="max-w-md w-full bg-white rounded-[3rem] p-12 shadow-2xl shadow-coffee-dark/5 text-center border border-gray-100 animate-in zoom-in duration-500">
                <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center mx-auto mb-8 text-red-500">
                    <AlertCircle size={40} />
                </div>

                <h2 className="text-3xl font-black text-coffee-dark tracking-tighter mb-4">Ups! Terjadi Kesalahan</h2>
                <p className="text-gray-400 font-medium mb-10 leading-relaxed">
                    Terjadi kesalahan saat memuat data. Jangan khawatir, silakan coba lagi atau kembali ke beranda.
                </p>

                <div className="space-y-4">
                    <button
                        onClick={() => reset()}
                        className="w-full flex items-center justify-center gap-3 py-4 bg-coffee-dark text-white rounded-2xl font-bold shadow-lg shadow-coffee-dark/20 hover:bg-[#2d1e18] transition-all active:scale-95"
                    >
                        <RefreshCcw size={18} />
                        Coba Lagi
                    </button>

                    <Link
                        href="/dashboard"
                        className="w-full flex items-center justify-center gap-3 py-4 bg-white text-coffee-dark border border-gray-100 rounded-2xl font-bold hover:bg-gray-50 transition-all active:scale-95"
                    >
                        <Home size={18} />
                        Ke Beranda
                    </Link>
                </div>

                {process.env.NODE_ENV === 'development' && (
                    <div className="mt-8 pt-8 border-t border-dashed border-gray-100">
                        <p className="text-[10px] font-mono text-red-400 break-all">{error.message}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
