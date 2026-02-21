"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Coffee } from "lucide-react";

interface AuthSplitLayoutProps {
    children: React.ReactNode;
    imageSrc?: string;
    imageAlt?: string;
    title?: string;
    subtitle?: string;
}

const AuthSplitLayout: React.FC<AuthSplitLayoutProps> = ({
    children,
    imageSrc = "https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=1974&auto=format&fit=crop",
    imageAlt = "Coffee shop aesthetic",
    title = "Selamat Datang di KasRapi",
    subtitle = "Kelola bisnismu dengan lebih mudah dan efisien.",
}) => {
    return (
        <div className="flex min-h-screen bg-neutral-50">
            {/* Left Side: Image & Message */}
            <div className="relative hidden w-1/2 lg:block">
                <div className="absolute inset-0 z-10 bg-black/40" />
                <Image
                    src={imageSrc}
                    alt={imageAlt}
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-12 text-center text-white">
                    <div className="mb-6 flex items-center gap-2">
                        <div className="rounded-xl bg-white p-2 text-primary">
                            <Coffee size={32} strokeWidth={2.5} className="text-orange-600" />
                        </div>
                        <span className="text-3xl font-bold tracking-tight">KasRapi</span>
                    </div>
                    <h2 className="mb-4 text-4xl font-bold">{title}</h2>
                    <p className="max-w-md text-lg text-neutral-200">{subtitle}</p>
                </div>
            </div>

            {/* Right Side: Form */}
            <div className="flex w-full flex-col items-center justify-center p-6 lg:w-1/2 lg:p-12">
                <div className="mb-8 flex items-center gap-2 lg:hidden">
                    <div className="rounded-xl bg-orange-600 p-2 text-white">
                        <Coffee size={24} strokeWidth={2.5} />
                    </div>
                    <span className="text-2xl font-bold tracking-tight text-neutral-900">KasRapi</span>
                </div>
                <div className="w-full max-w-md">{children}</div>
            </div>
        </div>
    );
};

export default AuthSplitLayout;
