"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useAuthStore } from "@/store/auth-store";
import apiClient from "@/lib/api";
import { toast } from "sonner";
import {
    User,
    Mail,
    Lock,
    Camera,
    Loader2,
    Save,
    Shield
} from "lucide-react";

export default function ProfilePage() {
    const { user, setAuth } = useAuthStore();
    const [isLoading, setIsLoading] = useState(false);

    // Separate states for profile and password to keep it clean
    const [fullName, setFullName] = useState(user?.username || "");
    const [email] = useState(user?.email || ""); // Email usually fixed or needs complex verification

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setIsLoading(true);
        try {
            const response = await apiClient.patch(`/users/${user.id}`, {
                username: fullName
            });

            const token = useAuthStore.getState().token;
            if (token) {
                setAuth(token, response.data);
            }

            toast.success("Profil berhasil diperbarui!");
        } catch (error: any) {
            toast.error(error.response?.data?.error || "Gagal memperbarui profil.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            toast.error("Password baru dan konfirmasi tidak cocok.");
            return;
        }

        setIsLoading(true);
        try {
            await apiClient.post("/auth/change-password", {
                currentPassword,
                newPassword
            });

            toast.success("Password berhasil diubah!");
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (error: any) {
            toast.error(error.response?.data?.error || "Gagal mengubah password.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="mb-10">
                <h1 className="text-4xl font-black text-coffee-dark tracking-tighter italic">Pengaturan Profil</h1>
                <p className="text-gray-400 font-bold uppercase tracking-widest text-xs mt-2">Kelola informasi pribadi dan keamanan akun Anda</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Avatar & Basic Info */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm text-center">
                        <div className="relative mx-auto w-32 h-32 mb-6">
                            <div className="w-full h-full rounded-full bg-brand-bg border-4 border-white shadow-xl flex items-center justify-center text-5xl font-black text-coffee-dark italic">
                                {fullName.charAt(0).toUpperCase()}
                            </div>
                            <button className="absolute bottom-0 right-0 p-2 bg-coffee-dark text-white rounded-full shadow-lg hover:scale-110 transition-transform">
                                <Camera size={20} />
                            </button>
                        </div>
                        <h3 className="text-xl font-black text-coffee-dark tracking-tight">{fullName}</h3>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">{user?.role || 'Owner'}</p>

                        <div className="mt-8 pt-8 border-t border-gray-50 flex flex-col gap-3">
                            <div className="flex items-center gap-3 text-sm font-bold text-gray-400 px-4 py-2 bg-gray-50 rounded-xl">
                                <Mail size={16} />
                                <span className="truncate">{email}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm font-bold text-gray-400 px-4 py-2 bg-gray-50 rounded-xl">
                                <Shield size={16} />
                                <span>Verified Account</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Forms */}
                <div className="lg:col-span-2 space-y-8">
                    {/* General Information */}
                    <section className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-2 bg-brand-bg text-coffee-dark rounded-xl">
                                <User size={20} />
                            </div>
                            <h3 className="text-xl font-black text-coffee-dark tracking-tight">Informasi Dasar</h3>
                        </div>

                        <form onSubmit={handleUpdateProfile} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Nama Lengkap</label>
                                <input
                                    type="text"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    className="w-full h-14 px-6 rounded-2xl bg-brand-bg border border-gray-100 focus:border-coffee-dark focus:ring-4 focus:ring-coffee-dark/5 outline-none transition-all font-bold text-coffee-dark"
                                    placeholder="Masukkan nama lengkap"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1 opacity-50">Alamat Email (Tidak dapat diubah)</label>
                                <input
                                    type="email"
                                    value={email}
                                    readOnly
                                    className="w-full h-14 px-6 rounded-2xl bg-gray-50 border border-gray-100 text-gray-400 font-bold outline-none cursor-not-allowed"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="flex items-center justify-center gap-2 bg-coffee-dark text-white px-8 py-4 rounded-2xl font-black text-sm hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                            >
                                {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                                Simpan Perubahan
                            </button>
                        </form>
                    </section>

                    {/* Change Password */}
                    <section className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-2 bg-red-50 text-red-600 rounded-xl">
                                <Lock size={20} />
                            </div>
                            <h3 className="text-xl font-black text-coffee-dark tracking-tight">Keamanan & Password</h3>
                        </div>

                        <form onSubmit={handleChangePassword} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Password Saat Ini</label>
                                <input
                                    type="password"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    className="w-full h-14 px-6 rounded-2xl bg-brand-bg border border-gray-100 focus:border-red-600 focus:ring-4 focus:ring-red-600/5 outline-none transition-all font-bold text-coffee-dark"
                                    placeholder="••••••••"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Password Baru</label>
                                    <input
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="w-full h-14 px-6 rounded-2xl bg-brand-bg border border-gray-100 focus:border-coffee-dark focus:ring-4 focus:ring-coffee-dark/5 outline-none transition-all font-bold text-coffee-dark"
                                        placeholder="Min 8 karakter"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Konfirmasi Password Baru</label>
                                    <input
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full h-14 px-6 rounded-2xl bg-brand-bg border border-gray-100 focus:border-coffee-dark focus:ring-4 focus:ring-coffee-dark/5 outline-none transition-all font-bold text-coffee-dark"
                                        placeholder="Masukkan ulang"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="flex items-center justify-center gap-2 bg-neutral-900 text-white px-8 py-4 rounded-2xl font-black text-sm hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                            >
                                {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Lock size={18} />}
                                Perbarui Password
                            </button>
                        </form>
                    </section>
                </div>
            </div>
        </div>
    );
}
