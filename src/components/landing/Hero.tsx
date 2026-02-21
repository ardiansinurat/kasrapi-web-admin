"use client";

import Link from 'next/link';
import { ChevronRight, ArrowRight, LayoutPanelTop, ShoppingBag } from 'lucide-react';

export default function Hero() {
    return (
        <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden bg-brand-bg">
            {/* Decorative Blur Elements */}
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[600px] h-[600px] bg-[#3C2A21]/5 rounded-full blur-[120px] -z-10" />
            <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-[400px] h-[400px] bg-[#3C2A21]/5 rounded-full blur-[100px] -z-10" />

            <div className="max-w-7xl mx-auto px-6 md:px-12 text-center relative z-10">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-100 shadow-sm mb-10 transition-transform hover:scale-105 duration-300">
                    <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Terpercaya di 50+ Kafe Lokal</span>
                </div>

                <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-coffee-dark leading-[1.05] mb-8 tracking-tight">
                    Kelola Kafe Jadi <br />
                    <span className="italic text-gray-300 decoration-coffee-dark/20 underline underline-offset-8">Lebih Kalem.</span>
                </h1>

                <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-500 leading-relaxed mb-12">
                    Sistem kasir minimalis dengan manajemen stok otomatis dan integrasi pembayaran instan.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
                    <Link
                        href="/register"
                        className="group w-full sm:w-auto bg-coffee-dark text-white px-10 py-5 rounded-full font-bold text-lg hover:bg-[#2d1e18] transition-all shadow-2xl shadow-coffee-dark/20 flex items-center justify-center gap-2 active:scale-95"
                    >
                        Mulai Sekarang
                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link
                        href="#features"
                        className="w-full sm:w-auto px-10 py-5 rounded-full font-bold text-lg text-gray-600 hover:bg-gray-100 transition-all flex items-center justify-center gap-2"
                    >
                        Lihat Fitur
                    </Link>
                </div>

                {/* Abstract UI Mockup */}
                <div className="mt-24 relative max-w-5xl mx-auto group">
                    <div className="aspect-[16/10] bg-white rounded-[2rem] shadow-[0_50px_100px_-20px_rgba(60,42,33,0.15)] border border-gray-100 overflow-hidden relative p-4 md:p-8">
                        {/* Simplified UI Layers */}
                        <div className="flex flex-col h-full bg-gray-50/50 rounded-2xl border border-gray-100/50">
                            <div className="h-14 border-b border-gray-100 px-6 flex items-center justify-between">
                                <div className="flex gap-2">
                                    <div className="w-3 h-3 rounded-full bg-gray-200" />
                                    <div className="w-3 h-3 rounded-full bg-gray-200" />
                                    <div className="w-3 h-3 rounded-full bg-gray-200" />
                                </div>
                                <div className="w-32 h-2 bg-gray-200 rounded-full" />
                            </div>
                            <div className="flex-1 grid grid-cols-12 gap-6 p-6">
                                <div className="col-span-8 space-y-6">
                                    <div className="h-40 bg-white rounded-3xl border border-gray-100 p-6 flex items-center justify-between">
                                        <div className="space-y-3">
                                            <div className="w-24 h-2 bg-gray-100 rounded-full" />
                                            <div className="w-48 h-6 bg-gray-100 rounded-lg" />
                                        </div>
                                        <div className="w-16 h-16 bg-brand-bg rounded-2xl" />
                                    </div>
                                    <div className="grid grid-cols-4 gap-4">
                                        {[1, 2, 3, 4].map(i => (
                                            <div key={i} className="h-32 bg-white rounded-2xl border border-gray-100" />
                                        ))}
                                    </div>
                                </div>
                                <div className="col-span-4 bg-white rounded-3xl border border-gray-100 overflow-hidden flex flex-col">
                                    <div className="p-4 border-b border-gray-50 space-y-2">
                                        <div className="w-full h-8 bg-gray-50 rounded-lg" />
                                        <div className="w-full h-8 bg-gray-50 rounded-lg" />
                                    </div>
                                    <div className="mt-auto p-4 flex gap-2">
                                        <div className="flex-1 h-12 bg-gray-50 rounded-xl" />
                                        <div className="flex-1 h-12 bg-coffee-dark rounded-xl" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Floating Micro-Card */}
                        <div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 p-6 bg-white/80 backdrop-blur-xl border border-white rounded-[2rem] shadow-2xl transition-transform group-hover:-translate-y-2/3 duration-700 hidden lg:block">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-coffee-dark rounded-2xl flex items-center justify-center text-white">
                                    <ShoppingBag size={24} />
                                </div>
                                <div>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Pesanan Baru</p>
                                    <p className="text-xl font-black text-coffee-dark italic">Espresso +2</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Soft Shadow Base */}
                    <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-coffee-dark/10 blur-[80px] -z-10" />
                </div>
            </div>
        </section>
    );
}
