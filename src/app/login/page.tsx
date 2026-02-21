"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import AuthSplitLayout from "@/components/auth/AuthSplitLayout";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";
import apiClient from "@/lib/api";
import { toast } from "sonner";

const loginSchema = z.object({
    email: z.string().email("Email tidak valid"),
    password: z.string().min(1, "Password wajib diisi"),
    rememberMe: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const setAuth = useAuthStore((state) => state.setAuth);
    const setStore = useAuthStore((state) => state.setStore);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            rememberMe: false,
        },
    });

    const onSubmit = async (data: LoginFormValues) => {
        setIsLoading(true);
        try {
            const response = await apiClient.post("/auth/login", {
                identifier: data.email,
                password: data.password
            });

            const { token, user, businesses } = response.data;

            // 1. Set User & Token
            setAuth(token, user);

            // 2. Set Store if exists
            if (businesses && businesses.length > 0) {
                const b = businesses[0];
                setStore({
                    id: b.id,
                    name: b.name,
                    currency: "IDR", // Default until settings fetched
                    useTables: true,
                    taxPercentage: 0,
                    isOnboarded: !!user.onboardingCompletedAt
                });
            }

            toast.success("Berhasil masuk!");
            router.push("/dashboard");
        } catch (error: any) {
            toast.error(error.response?.data?.error || "Gagal masuk. Silakan periksa email dan password Anda.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthSplitLayout
            title="Selamat Datang Kembali"
            subtitle="Kelola kafemu dan lihat laporan penjualan harianmu dengan mudah."
        >
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-neutral-900">Masuk</h1>
                    <p className="mt-2 text-neutral-500">
                        Masukkan kredensial Anda untuk melanjutkan.
                    </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                        <div className="flex items-center justify-between">
                            <label
                                htmlFor="password"
                                className="text-sm font-medium text-neutral-700"
                            >
                                Password
                            </label>
                            <Link
                                href="/forgot-password"
                                className="text-xs font-semibold text-orange-600 hover:underline"
                            >
                                Lupa Password?
                            </Link>
                        </div>
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

                    <div className="flex items-center gap-2">
                        <input
                            {...register("rememberMe")}
                            id="rememberMe"
                            type="checkbox"
                            className="h-4 w-4 rounded border-neutral-300 text-orange-600 focus:ring-orange-500"
                        />
                        <label
                            htmlFor="rememberMe"
                            className="text-sm font-medium text-neutral-600 transition-colors hover:text-neutral-900"
                        >
                            Ingat saya di perangkat ini
                        </label>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-600 py-4 font-bold text-white transition-all hover:bg-orange-700 disabled:bg-orange-300"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 size={20} className="animate-spin" />
                                Masuk...
                            </>
                        ) : (
                            "Masuk Sekarang"
                        )}
                    </button>
                </form>

                <p className="text-center text-sm text-neutral-500">
                    Belum punya akun?{" "}
                    <Link
                        href="/register"
                        className="font-bold text-orange-600 hover:underline"
                    >
                        Daftar di sini
                    </Link>
                </p>
            </div>
        </AuthSplitLayout>
    );
}
