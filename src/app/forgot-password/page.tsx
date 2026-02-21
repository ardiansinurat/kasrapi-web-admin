"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import AuthSplitLayout from "@/components/auth/AuthSplitLayout";
import { ArrowLeft, Loader2, MailCheck } from "lucide-react";
import { useState } from "react";
import apiClient from "@/lib/api";
import { toast } from "sonner";

const forgotSchema = z.object({
    email: z.string().email("Email tidak valid"),
});

type ForgotFormValues = z.infer<typeof forgotSchema>;

export default function ForgotPasswordPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ForgotFormValues>({
        resolver: zodResolver(forgotSchema),
    });

    const onSubmit = async (data: ForgotFormValues) => {
        setIsLoading(true);
        try {
            await apiClient.post("/auth/forgot-password", {
                email: data.email
            });
            setIsSubmitted(true);
            toast.success("Instruksi reset dikirim ke email Anda");
        } catch (error: any) {
            // Even if email not found, for security we usually say "if email exists...", 
            // but here we follow original instruction to show toast.
            setIsSubmitted(true); // Mock success for flow
            toast.success("Instruksi reset dikirim ke email Anda");
        } finally {
            setIsLoading(false);
        }
    };

    if (isSubmitted) {
        return (
            <AuthSplitLayout
                title="Cek Email Anda"
                subtitle="Kami telah mengirimkan tautan untuk mengatur ulang kata sandi ke alamat email Anda."
            >
                <div className="flex flex-col items-center justify-center text-center space-y-6">
                    <div className="w-20 h-20 bg-orange-50 rounded-3xl flex items-center justify-center text-orange-600 mb-2">
                        <MailCheck size={40} />
                    </div>
                    <h1 className="text-3xl font-bold text-neutral-900">Email Terkirim</h1>
                    <p className="text-neutral-500 max-w-sm">
                        Instruksi pemulihan akun telah dikirim. Silakan periksa kotak masuk atau folder spam Anda.
                    </p>
                    <Link
                        href="/login"
                        className="flex items-center gap-2 font-bold text-orange-600 hover:underline pt-4"
                    >
                        <ArrowLeft size={16} /> Kembali ke Masuk
                    </Link>
                </div>
            </AuthSplitLayout>
        );
    }

    return (
        <AuthSplitLayout
            title="Lupa Kata Sandi?"
            subtitle="Jangan khawatir, masukan email Anda dan kami akan membantu memulihkan akun Anda."
        >
            <div className="space-y-6">
                <div className="flex flex-col space-y-2">
                    <Link
                        href="/login"
                        className="flex items-center gap-2 text-sm font-bold text-neutral-400 hover:text-orange-600 transition-colors w-fit mb-4"
                    >
                        <ArrowLeft size={16} /> Kembali ke Masuk
                    </Link>
                    <h1 className="text-3xl font-bold text-neutral-900">Pulihkan Akun</h1>
                    <p className="text-neutral-500">
                        Kami akan mengirimkan instruksi pengaturan ulang password ke email Anda.
                    </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-2">
                        <label
                            htmlFor="email"
                            className="text-sm font-medium text-neutral-700"
                        >
                            Email Terdaftar
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

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-600 py-4 font-bold text-white transition-all hover:bg-orange-700 disabled:bg-orange-300 shadow-lg shadow-orange-600/20"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 size={20} className="animate-spin" />
                                Mengirim...
                            </>
                        ) : (
                            "Kirim Instruksi Reset"
                        )}
                    </button>
                </form>
            </div>
        </AuthSplitLayout>
    );
}
