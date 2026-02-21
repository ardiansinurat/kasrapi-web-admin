"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Check, Loader2 } from "lucide-react";

const onboardingSchema = z.object({
    currency: z.string(),
    useTables: z.boolean(),
    taxPercentage: z.union([z.coerce.number().min(0).max(100), z.literal(""), z.undefined()]).transform(val => val === "" || val === undefined ? 0 : val),
});

type OnboardingFormValues = z.infer<typeof onboardingSchema>;

interface OnboardingFormProps {
    onSubmit: (data: any) => Promise<void>;
    isLoading: boolean;
}

const OnboardingForm: React.FC<OnboardingFormProps> = ({
    onSubmit,
    isLoading,
}) => {
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<any>({
        resolver: zodResolver(onboardingSchema),
        defaultValues: {
            currency: "IDR",
            useTables: true,
            taxPercentage: "",
        },
    });

    const useTables = watch("useTables");

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Currency Selection */}
            <div className="space-y-4">
                <label className="text-lg font-bold text-neutral-900">
                    Mata Uang Utama
                </label>
                <p className="text-sm text-neutral-500">
                    Pilih mata uang yang akan digunakan untuk semua transaksi di kafemu.
                </p>
                <div className="grid grid-cols-2 gap-4">
                    {["IDR", "USD"].map((curr) => (
                        <button
                            key={curr}
                            type="button"
                            onClick={() => setValue("currency", curr)}
                            className={`relative flex flex-col items-center justify-center rounded-2xl border-2 p-6 transition-all ${watch("currency") === curr
                                ? "border-orange-600 bg-orange-50 text-orange-600"
                                : "border-neutral-200 bg-white text-neutral-400 hover:border-neutral-300"
                                }`}
                        >
                            {watch("currency") === curr && (
                                <div className="absolute right-3 top-3 rounded-full bg-orange-600 p-1 text-white">
                                    <Check size={12} strokeWidth={3} />
                                </div>
                            )}
                            <span className="text-2xl font-bold">{curr}</span>
                            <span className="mt-1 text-xs font-medium uppercase tracking-wider">
                                {curr === "IDR" ? "Rupiah Indonesia" : "US Dollar"}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Tables Toggle */}
            <div className="space-y-4">
                <label className="text-lg font-bold text-neutral-900">
                    Sistem Meja
                </label>
                <div className="flex items-center justify-between rounded-2xl border border-neutral-200 bg-white p-6 transition-all hover:bg-neutral-50">
                    <div>
                        <p className="font-semibold text-neutral-900">Apakah kafemu memiliki meja?</p>
                        <p className="text-sm text-neutral-500">Gunakan ini jika kamu melayani pelanggan di tempat.</p>
                    </div>
                    <button
                        type="button"
                        onClick={() => setValue("useTables", !useTables)}
                        className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${useTables ? "bg-orange-600" : "bg-neutral-200"
                            }`}
                    >
                        <span
                            className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${useTables ? "translate-x-5" : "translate-x-0"
                                }`}
                        />
                    </button>
                    <input type="hidden" {...register("useTables")} />
                </div>
            </div>

            {/* Tax Percentage */}
            <div className="space-y-4">
                <label className="text-lg font-bold text-neutral-900">
                    Pajak Default (%)
                </label>
                <p className="text-sm text-neutral-500">
                    Tentukan persentase pajak yang akan otomatis ditambahkan ke setiap transaksi (opsional).
                </p>
                <div className="relative">
                    <input
                        {...register("taxPercentage", { valueAsNumber: true })}
                        type="number"
                        placeholder="0"
                        className={`w-full rounded-xl border px-4 py-4 text-xl font-bold outline-none transition-all focus:ring-2 ${errors.taxPercentage
                            ? "border-red-500 focus:ring-red-100"
                            : "border-neutral-200 focus:border-orange-600 focus:ring-orange-100"
                            }`}
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xl font-bold text-neutral-400">
                        %
                    </div>
                </div>
                {errors.taxPercentage && (
                    <p className="text-xs text-red-500">{errors.taxPercentage.message?.toString()}</p>
                )}
            </div>

            <button
                type="submit"
                disabled={isLoading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-600 py-4 text-lg font-bold text-white transition-all hover:bg-orange-700 disabled:bg-orange-300"
            >
                {isLoading ? (
                    <>
                        <Loader2 size={24} className="animate-spin" />
                        Menyimpan...
                    </>
                ) : (
                    "Selesai dan Ke Dashboard"
                )}
            </button>
        </form>
    );
};

export default OnboardingForm;
