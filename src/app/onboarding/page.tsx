"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import OnboardingForm from "@/components/onboarding/OnboardingForm";
import { Coffee } from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import apiClient from "@/lib/api";
import { toast } from "sonner";

const OnboardingPage = () => {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const { store, user, setStore, setAuth } = useAuthStore();

    const handleOnboardingSubmit = async (data: any) => {
        if (!store || !user) {
            toast.error("Data sesi tidak ditemukan. Silakan login kembali.");
            return;
        }

        setIsLoading(true);
        try {
            // 1. Update Store Settings
            await apiClient.patch(`/stores/${store.id}/settings`, {
                taxPercent: data.taxPercentage,
                roundingRule: 'NONE',
            });

            // 2. Mark User as Onboarded
            const userResponse = await apiClient.patch(`/users/${user.id}`, {
                onboardingCompletedAt: new Date().toISOString()
            });

            // 3. Update Global State
            const updatedUser = userResponse.data;
            setStore({
                ...store,
                currency: data.currency,
                useTables: data.useTables,
                taxPercentage: data.taxPercentage,
                isOnboarded: true,
            });

            // Update user in authStore as well
            const token = useAuthStore.getState().token;
            if (token) setAuth(token, updatedUser);

            toast.success("Konfigurasi kafe berhasil disimpan!");
            router.push("/dashboard");
        } catch (error: any) {
            toast.error(error.response?.data?.error || "Gagal menyimpan konfigurasi. Silakan coba lagi.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-neutral-50 px-6 py-12 lg:py-20">
            <div className="mx-auto max-w-2xl">
                <div className="mb-12 text-center">
                    <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-600 text-white shadow-lg shadow-orange-100">
                        <Coffee size={32} strokeWidth={2.5} />
                    </div>
                    <h1 className="text-4xl font-bold tracking-tight text-neutral-900">
                        Satu langkah lagi, {user?.username || "Juragan"}!
                    </h1>
                    <p className="mt-4 text-lg text-neutral-500">
                        Mari atur dasar-dasar kafemu agar pengalaman KasRapi makin maksimal.
                    </p>
                </div>

                <div className="rounded-[2.5rem] border border-neutral-100 bg-white p-8 shadow-xl shadow-neutral-100 lg:p-12">
                    <OnboardingForm
                        onSubmit={handleOnboardingSubmit}
                        isLoading={isLoading}
                    />
                </div>

                <p className="mt-12 text-center text-sm text-neutral-400">
                    Anda bisa mengubah pengaturan ini kapan saja di menu Pengaturan Toko.
                </p>
            </div>
        </div>
    );
};

export default OnboardingPage;
