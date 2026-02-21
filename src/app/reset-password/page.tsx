"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import AuthSplitLayout from "@/components/auth/AuthSplitLayout";
import { Eye, EyeOff, Loader2, KeyRound } from "lucide-react";
import { useState, Suspense } from "react";
import apiClient from "@/lib/api";
import { toast } from "sonner";

const resetSchema = z.object({
    password: z.string().min(8, "Password minimal 8 karakter"),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Password tidak cocok",
    path: ["confirmPassword"],
});

type ResetFormValues = z.infer<typeof resetSchema>;

function ResetPasswordForm() {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get("token");

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ResetFormValues>({
        resolver: zodResolver(resetSchema),
    });

    const onSubmit = async (data: ResetFormValues) => {
        if (!token) {
            toast.error("Token tidak valid atau sudah kadaluarsa.");
            return;
        }

        setIsLoading(true);
        try {
            await apiClient.post("/auth/reset-password", {
                token,
                password: data.password
            });

            toast.success("Password berhasil diubah! Silakan masuk kembali.");
            router.push("/login");
        } catch (error: any) {
            toast.error(error.response?.data?.error || "Gagal mengatur ulang password.");
        } finally {
            setIsLoading(false);
        }
    };

    if (!token) {
        return (
            <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto">
                    <KeyRound size={32} />
                </div>
                <h1 className="text-2xl font-bold text-neutral-900">Token Tidak Valid</h1>
                <p className="text-neutral-500">Tautan reset password sudah tidak berlaku atau salah.</p>
                <div className="pt-4">
                    <button
                        onClick={() => router.push("/forgot-password")}
                        className="text-orange-600 font-bold hover:underline"
                    >
                        Minta Tautan Baru
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-neutral-900">Pasang Password Baru</h1>
                <p className="mt-2 text-neutral-500">
                    Gunakan password yang kuat dan mudah diingat untuk akun Anda.
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                    <label
                        htmlFor="password"
                        className="text-sm font-medium text-neutral-700"
                    >
                        Password Baru
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

                <div className="space-y-2">
                    <label
                        htmlFor="confirmPassword"
                        className="text-sm font-medium text-neutral-700"
                    >
                        Ulangi Password Baru
                    </label>
                    <input
                        {...register("confirmPassword")}
                        id="confirmPassword"
                        type="password"
                        placeholder="••••••••"
                        className={`w-full rounded-xl border px-4 py-3 outline-none transition-all focus:ring-2 ${errors.confirmPassword
                            ? "border-red-500 focus:ring-red-100"
                            : "border-neutral-200 focus:border-orange-600 focus:ring-orange-100"
                            }`}
                    />
                    {errors.confirmPassword && (
                        <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-600 py-4 font-bold text-white transition-all hover:bg-orange-700 disabled:bg-orange-300 shadow-lg shadow-orange-600/20"
                >
                    {isLoading ? (
                        <>
                            <Loader2 size={20} className="animate-spin" />
                            Menyimpan...
                        </>
                    ) : (
                        "Simpan Password Baru"
                    )}
                </button>
            </form>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <AuthSplitLayout
            title="Keamanan Utama"
            subtitle="Kami memastikan akun Anda terlindungi dengan standar enkripsi terbaru."
        >
            <Suspense fallback={<div className="flex justify-center p-12"><Loader2 className="animate-spin text-orange-600" size={32} /></div>}>
                <ResetPasswordForm />
            </Suspense>
        </AuthSplitLayout>
    );
}
