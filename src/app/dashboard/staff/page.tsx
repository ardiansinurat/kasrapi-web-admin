"use client";

import { useState } from "react";
import useSWR from "swr";
import { useAuth } from "@/hooks/useAuth";
import apiClient from "@/lib/api";
import { toast } from "sonner";
import {
    Users,
    UserPlus,
    Search,
    MoreHorizontal,
    Mail,
    Shield,
    Trash2,
    Loader2,
    X,
    Check
} from "lucide-react";
import { clsx } from "clsx";
import EmptyState from "@/components/ui/EmptyState";

interface StaffMember {
    id: string;
    userId: string;
    role: "OWNER" | "MANAGER" | "KASIR";
    isActive: boolean;
    user: {
        username: string;
        email: string;
    };
}

export default function StaffPage() {
    const { store } = useAuth();
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    // Fetch staff members
    const { data: staff, mutate } = useSWR<StaffMember[]>(
        store ? `/stores/${store.id}/members` : null,
        (url: string) => apiClient.get(url).then(res => res.data)
    );

    const filteredStaff = staff?.filter(s =>
        s.user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleAddStaff = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!store) return;

        const formData = new FormData(e.currentTarget);
        const fullName = formData.get("fullName") as string;
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;
        const role = formData.get("role") as string;

        setIsSubmitting(true);
        try {
            await apiClient.post("/auth/register", {
                fullName,
                email,
                password,
                storeId: store.id,
                role: role
            });

            toast.success(`Staf "${fullName}" berhasil ditambahkan!`);
            setIsAddModalOpen(false);
            mutate(); // Refresh list
        } catch (error: any) {
            toast.error(error.response?.data?.error || "Gagal menambahkan staf.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleRemoveStaff = async (staffId: string, memberName: string) => {
        if (!confirm(`Apakah Anda yakin ingin menghapus "${memberName}" dari tim?`)) return;

        try {
            await apiClient.delete(`/store-users/${staffId}`);
            toast.success("Staf berhasil dihapus.");
            mutate();
        } catch (error: any) {
            toast.error("Gagal menghapus staf.");
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-coffee-dark tracking-tighter italic">Manajemen Staf</h1>
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mt-2">Kelola tim dan hak akses kafe Anda</p>
                </div>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center gap-2 bg-coffee-dark text-white px-6 py-4 rounded-2xl font-black text-sm hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-coffee-dark/10"
                >
                    <UserPlus size={18} />
                    Tambah Staf Baru
                </button>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-[2rem] border border-gray-100 flex items-center gap-4 shadow-sm">
                    <div className="p-3 bg-brand-bg text-coffee-dark rounded-2xl">
                        <Users size={24} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Tim</p>
                        <h4 className="text-2xl font-black text-coffee-dark tracking-tight">{staff?.length || 0} Orang</h4>
                    </div>
                </div>
            </div>

            {/* List Table Area */}
            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <h3 className="text-xl font-black text-coffee-dark tracking-tight">Daftar Anggota Tim</h3>
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Cari nama atau email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 rounded-xl bg-brand-bg border border-transparent focus:border-coffee-dark/20 focus:bg-white outline-none transition-all font-bold text-sm"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50">
                                <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Nama & Email</th>
                                <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Role Aktif</th>
                                <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Status</th>
                                <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredStaff?.map((member) => (
                                <tr key={member.id} className="hover:bg-gray-50/30 transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-brand-bg flex items-center justify-center font-black text-coffee-dark italic">
                                                {member.user.username.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-bold text-coffee-dark">{member.user.username}</p>
                                                <p className="text-xs text-gray-400 font-medium">{member.user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className={clsx(
                                            "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter",
                                            member.role === 'OWNER' ? "bg-orange-100 text-orange-700" :
                                                member.role === 'MANAGER' ? "bg-blue-100 text-blue-700" : "bg-brand-bg text-coffee-dark"
                                        )}>
                                            <Shield size={12} />
                                            {member.role}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2 text-xs font-bold text-green-600">
                                            <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                            Aktif
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        {member.role !== 'OWNER' && (
                                            <button
                                                onClick={() => handleRemoveStaff(member.id, member.user.username)}
                                                className="p-2 text-gray-300 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {filteredStaff?.length === 0 && (
                                <tr>
                                    <td colSpan={4}>
                                        <EmptyState
                                            icon={Users}
                                            title="Belum Ada Staf"
                                            description="Kafe Anda terlihat sepi. Daftarkan tim hebat Anda untuk membantu operasional harian!"
                                            action={
                                                <button
                                                    onClick={() => setIsAddModalOpen(true)}
                                                    className="flex items-center gap-2 px-6 py-3 bg-coffee-dark text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-coffee-dark/20 hover:scale-105 active:scale-95 transition-all"
                                                >
                                                    <UserPlus size={16} />
                                                    Daftarkan Staf
                                                </button>
                                            }
                                        />
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Staff Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-coffee-dark/20 backdrop-blur-sm" onClick={() => setIsAddModalOpen(false)} />
                    <div className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-8 border-b border-gray-50 flex justify-between items-center">
                            <h3 className="text-2xl font-black text-coffee-dark tracking-tight italic">Tambah Staf</h3>
                            <button onClick={() => setIsAddModalOpen(false)} className="p-2 hover:bg-gray-50 rounded-full text-gray-400 transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleAddStaff} className="p-8 space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Nama Lengkap Staf</label>
                                <input
                                    name="fullName"
                                    required
                                    className="w-full h-14 px-6 rounded-2xl bg-brand-bg border border-transparent focus:border-coffee-dark/20 focus:bg-white outline-none transition-all font-bold text-coffee-dark"
                                    placeholder="Contoh: Siti Aminah"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Email Staf</label>
                                <input
                                    name="email"
                                    type="email"
                                    required
                                    className="w-full h-14 px-6 rounded-2xl bg-brand-bg border border-transparent focus:border-coffee-dark/20 focus:bg-white outline-none transition-all font-bold text-coffee-dark"
                                    placeholder="siti@example.com"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Password Awal</label>
                                    <input
                                        name="password"
                                        type="password"
                                        required
                                        className="w-full h-14 px-6 rounded-2xl bg-brand-bg border border-transparent focus:border-coffee-dark/20 focus:bg-white outline-none transition-all font-bold text-coffee-dark"
                                        placeholder="••••••••"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Hak Akses (Role)</label>
                                    <select
                                        name="role"
                                        className="w-full h-14 px-6 rounded-2xl bg-brand-bg border border-transparent focus:border-coffee-dark/20 focus:bg-white outline-none transition-all font-bold text-coffee-dark appearance-none"
                                    >
                                        <option value="KASIR">KASIR</option>
                                        <option value="MANAGER">MANAGER</option>
                                    </select>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full flex items-center justify-center gap-2 bg-coffee-dark text-white h-16 rounded-2xl font-black text-sm hover:translate-y-[-2px] active:translate-y-[0] transition-all shadow-xl shadow-coffee-dark/20 disabled:opacity-50"
                            >
                                {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <Check size={20} />}
                                Konfirmasi & Daftarkan Staf
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
