"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import AuthSplitLayout from "@/components/auth/AuthSplitLayout";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import apiClient from "@/lib/api";
import { toast } from "sonner";
import { useAuthStore } from "@/store/auth-store";

const registerSchema = z.object({
    fullName: z.string().min(3, "Nama lengkap minimal 3 karakter"),
    email: z.string().email("Email tidak valid"),
    password: z.string().min(8, "Password minimal 8 karakter"),
    cafeName: z.string().min(3, "Nama kafe minimal 3 karakter"),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = async (data: RegisterFormValues) => {
        setIsLoading(true);
        try {
            const response = await apiClient.post("/auth/register", {
                fullName: data.fullName,
                email: data.email,
                password: data.password,
                cafeName: data.cafeName
            });

            toast.success(response.data.message || "Pendaftaran berhasil! Silakan cek email Anda.");
            router.push("/login?registered=true");
        } catch (error: any) {
            toast.error(error.response?.data?.error || "Gagal melakukan pendaftaran. Silakan coba lagi.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthSplitLayout
            title="Mulai Perjalanan Bisnismu"
            subtitle="Daftar sekarang dan kelola kafemu dengan KasRapi dalam hitungan menit."
        >
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-neutral-900">Buat Akun</h1>
                    <p className="mt-2 text-neutral-500">
                        Daftarkan diri Anda dan kafe Anda.
                    </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <label
                            htmlFor="fullName"
                            className="text-sm font-medium text-neutral-700"
                        >
                            Nama Lengkap
                        </label>
                        <input
                            {...register("fullName")}
                            id="fullName"
                            type="text"
                            placeholder="Masukkan nama lengkap"
                            className={`w-full rounded-xl border px-4 py-3 outline-none transition-all focus:ring-2 ${errors.fullName
                                ? "border-red-500 focus:ring-red-100"
                                : "border-neutral-200 focus:border-orange-600 focus:ring-orange-100"
                                }`}
                        />
                        {errors.fullName && (
                            <p className="text-xs text-red-500">{errors.fullName.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label
                            htmlFor="email"
                            className="text-sm font-medium text-neutral-700"
                        >
                            Email
                        </label>
                        <input
                            {...register("email")}
                            id="email"
                            type="email"
                            placeholder="nama@email.com"
                            className={`w-full rounded-xl border px-4 py-3 outline-none transition-all focus:ring-2 ${errors.email
                                ? "border-red-500 focus:ring-red-100"
                                : "border-neutral-200 focus:border-orange-600 focus:ring-orange-100"
                                }`}
                        />
                        {errors.email && (
                            <p className="text-xs text-red-500">{errors.email.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label
                            htmlFor="cafeName"
                            className="text-sm font-medium text-neutral-700"
                        >
                            Nama Kafe Anda
                        </label>
                        <input
                            {...register("cafeName")}
                            id="cafeName"
                            type="text"
                            placeholder="Contoh: Kopi Kenangan Kasih"
                            className={`w-full rounded-xl border px-4 py-3 outline-none transition-all focus:ring-2 ${errors.cafeName
                                ? "border-red-500 focus:ring-red-100"
                                : "border-neutral-200 focus:border-orange-600 focus:ring-orange-100"
                                }`}
                        />
                        {errors.cafeName && (
                            <p className="text-xs text-red-500">{errors.cafeName.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label
                            htmlFor="password"
                            className="text-sm font-medium text-neutral-700"
                        >
                            Password
                        </label>
                        <div className="relative">
                            <input
                                {...register("password")}
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                className={`w-full rounded-xl border px-4 py-3 outline-none transition-all focus:ring-2 ${errors.password
                                    ? "border-red-500 focus:ring-red-100"
                                    : "border-neutral-200 focus:border-orange-600 focus:ring-orange-100"
                                    }`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                        {errors.password && (
                            <p className="text-xs text-red-500">{errors.password.message}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-600 py-4 font-bold text-white transition-all hover:bg-orange-700 disabled:bg-orange-300"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 size={20} className="animate-spin" />
                                Memproses...
                            </>
                        ) : (
                            "Daftar Sekarang"
                        )}
                    </button>
                </form>

                <p className="text-center text-sm text-neutral-500">
                    Sudah punya akun?{" "}
                    <Link
                        href="/login"
                        className="font-bold text-orange-600 hover:underline"
                    >
                        Masuk di sini
                    </Link>
                </p>
            </div>
        </AuthSplitLayout>
    );
}
