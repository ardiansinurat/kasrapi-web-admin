"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import OnboardingForm from "@/components/onboarding/OnboardingForm";
import { Coffee } from "lucide-react";
import { useAuthStore } from "@/store/auth-store";

const OnboardingPage = () => {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const setStore = useAuthStore((state) => state.setStore);
    const user = useAuthStore((state) => state.user);

    const handleOnboardingSubmit = async (data: any) => {
        setIsLoading(true);
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // Update store state
        setStore({
            id: "store-1",
            name: "Kafeku", // Ideally this comes from the user profile or recent registration
            currency: data.currency,
            useTables: data.useTables,
            taxPercentage: data.taxPercentage,
            isOnboarded: true,
        });

        setIsLoading(false);
        // Finally, go to dashboard
        router.push("/dashboard");
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
