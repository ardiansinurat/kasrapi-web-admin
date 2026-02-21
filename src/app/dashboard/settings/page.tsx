"use client";

import { useState } from 'react';
import useSWR from 'swr';
import { useAuth } from '@/hooks/useAuth';
import apiClient from '@/lib/api';
import { toast } from 'sonner';
import { Loader2, CreditCard, ShieldCheck, Globe, Lock, AlertCircle } from 'lucide-react';

interface Store {
    id: string;
    name: string;
    plan: string;
}

export default function SettingsPage() {
    const { user, store } = useAuth();
    const [isSaving, setIsSaving] = useState(false);

    // Fetch stores to get the storeId
    const { data: stores, isLoading: isLoadingStores } = useSWR<Store[]>(user?.id ? `/stores/owner/${user.id}` : null);
    const activeStore = stores?.[0] || store;

    const [formData, setFormData] = useState({
        serverKey: '',
        clientKey: '',
        environment: 'sandbox'
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!activeStore) {
            toast.error('Gagal mengidentifikasi toko Anda.');
            return;
        }

        setIsSaving(true);
        try {
            await apiClient.post(`/stores/${activeStore.id}/payment-integration`, {
                serverKey: formData.serverKey,
                clientKey: formData.clientKey || null,
                environment: formData.environment
            });

            toast.success('Pengaturan disimpan secara aman.');
            setFormData({ ...formData, serverKey: '', clientKey: '' });
        } catch (error: any) {
            const msg = error.response?.data?.error || 'Gagal menyimpan pengaturan';
            toast.error(msg);
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoadingStores) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                <Loader2 className="animate-spin mb-4 text-coffee-dark" />
                <p className="text-sm font-bold uppercase tracking-widest italic leading-none">Menyelaraskan Data...</p>
            </div>
        );
    }

    return (
        <div className="max-w-2xl space-y-12 pb-24 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header Area */}
            <div className="space-y-2">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-brand-bg rounded-xl text-coffee-dark">
                        <CreditCard size={24} />
                    </div>
                    <h1 className="text-3xl font-black text-coffee-dark tracking-tighter">Pembayaran</h1>
                </div>
                <p className="text-gray-400 font-medium text-sm">Konfigurasi Midtrans Payment Gateway untuk toko Anda.</p>
            </div>

            {/* Main Form Area */}
            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/50 overflow-hidden">
                <div className="px-10 py-8 border-b border-gray-50 flex items-center justify-between bg-brand-bg/30">
                    <div className="flex items-center gap-3">
                        <Lock size={18} className="text-coffee-dark" />
                        <h2 className="text-lg font-black text-coffee-dark tracking-tight">API Keys</h2>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-10 space-y-10">
                    {/* Server Key Section - Two Column Layout */}
                    <div className="flex flex-col lg:flex-row lg:items-start gap-4 lg:gap-10">
                        <div className="lg:w-1/3">
                            <label className="text-sm font-black text-coffee-dark uppercase tracking-widest flex items-center gap-2 mb-1">
                                Server Key
                                <span className="text-red-500">*</span>
                            </label>
                            <p className="text-[10px] font-medium text-gray-400 leading-relaxed italic">
                                Dapatkan kunci ini di Dashboard Midtrans Anda.
                            </p>
                        </div>
                        <div className="lg:flex-1 space-y-3">
                            <div className="relative group">
                                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-coffee-dark transition-colors" />
                                <input
                                    type="password"
                                    required
                                    placeholder="••••••••••••••••••••••••"
                                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-brand-bg border border-gray-100 focus:bg-white focus:ring-4 focus:ring-coffee-dark/5 focus:border-coffee-dark outline-none transition-all text-sm font-bold text-coffee-dark placeholder:text-gray-200"
                                    value={formData.serverKey}
                                    onChange={(e) => setFormData({ ...formData, serverKey: e.target.value })}
                                />
                            </div>
                            <div className="flex items-center gap-2 text-[10px] font-black text-green-600 bg-green-50 px-3 py-1.5 rounded-full w-fit uppercase tracking-tighter shadow-sm border border-green-100">
                                <ShieldCheck size={12} />
                                Dienkripsi aman dengan AES-256-GCM
                            </div>
                        </div>
                    </div>

                    {/* Client Key Section */}
                    <div className="flex flex-col lg:flex-row lg:items-start gap-4 lg:gap-10">
                        <div className="lg:w-1/3">
                            <label className="text-sm font-black text-coffee-dark uppercase tracking-widest mb-1">
                                Client Key
                            </label>
                            <p className="text-[10px] font-medium text-gray-400 leading-relaxed italic">
                                Digunakan untuk integrasi frontend Snap.
                            </p>
                        </div>
                        <div className="lg:flex-1">
                            <input
                                type="text"
                                placeholder="Misal: SB-Mid-client-..."
                                className="w-full px-5 py-4 rounded-2xl bg-brand-bg border border-gray-100 focus:bg-white focus:ring-4 focus:ring-coffee-dark/5 focus:border-coffee-dark outline-none transition-all text-sm font-bold text-coffee-dark placeholder:text-gray-200"
                                value={formData.clientKey}
                                onChange={(e) => setFormData({ ...formData, clientKey: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Environment Toggle */}
                    <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-10 pt-4">
                        <div className="lg:w-1/3">
                            <label className="text-sm font-black text-coffee-dark uppercase tracking-widest flex items-center gap-2">
                                <Globe size={18} className="text-gray-400" />
                                Environment
                            </label>
                        </div>
                        <div className="lg:flex-1">
                            <div className="flex gap-2 p-1.5 bg-brand-bg rounded-2xl w-fit border border-gray-50 shadow-inner">
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, environment: 'sandbox' })}
                                    className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${formData.environment === 'sandbox' ? 'bg-white shadow-lg text-coffee-dark' : 'text-gray-400 hover:text-gray-600'}`}
                                >
                                    Sandbox
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, environment: 'production' })}
                                    className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${formData.environment === 'production' ? 'bg-red-600 shadow-lg text-white' : 'text-gray-400 hover:text-gray-600'}`}
                                >
                                    Production
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Submit Bar */}
                    <div className="flex justify-end pt-10 border-t border-gray-50 mt-10">
                        <button
                            type="submit"
                            disabled={isSaving || !activeStore || !formData.serverKey}
                            className="group flex items-center gap-3 px-10 py-5 bg-coffee-dark text-white rounded-full font-black text-sm uppercase tracking-widest hover:bg-[#2d1e18] transition-all shadow-2xl shadow-coffee-dark/20 disabled:opacity-50 disabled:shadow-none active:scale-95"
                        >
                            {isSaving ? (
                                <Loader2 size={18} className="animate-spin" />
                            ) : (
                                <ShieldCheck size={18} className="group-hover:rotate-12 transition-transform" />
                            )}
                            {isSaving ? 'Menyimpan...' : 'Simpan Konfigurasi'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Help/Notice Card */}
            <div className="flex gap-4 p-8 bg-brand-bg rounded-[2rem] border border-gray-100 italic">
                <AlertCircle size={20} className="text-coffee-dark shrink-0" />
                <p className="text-[11px] font-bold text-gray-400 leading-relaxed uppercase tracking-tighter">
                    Pastikan Anda telah mengaktifkan metode pembayaran yang diinginkan (Snap, QRIS, atau E-wallet) di Dashboard Midtrans sebelum melakukan transaksi.
                </p>
            </div>
        </div>
    );
}
