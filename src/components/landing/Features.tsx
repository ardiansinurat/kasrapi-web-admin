"use client";

import { CreditCard, BarChart3, Package, Sparkles } from 'lucide-react';

const features = [
    {
        title: 'Point of Sale Pintar',
        description: 'Proses pesanan secepat barista Anda membuat latte. Antarmuka yang intuitif mengurangi waktu antrian.',
        icon: CreditCard,
    },
    {
        title: 'Stok Terkendali',
        description: 'Pantau persediaan biji kopi dan bahan baku secara real-time. Notifikasi otomatis saat stok menipis.',
        icon: Package,
    },
    {
        title: 'Laporan Finansial',
        description: 'Analisa performa kafe Anda dengan laporan harian, mingguan, hingga bulanan yang detail dan akurat.',
        icon: BarChart3,
    },
];

export default function Features() {
    return (
        <section id="features" className="py-24 bg-white relative">
            <div className="max-w-7xl mx-auto px-6 md:px-12">
                <div className="text-center mb-20 space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-bg text-coffee-dark text-xs font-bold uppercase tracking-widest italic border border-coffee-dark/5">
                        <Sparkles size={14} />
                        Kenapa KasRapi?
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-coffee-dark tracking-tight">
                        Didesain untuk Efisiensi Kedai Anda.
                    </h2>
                    <p className="text-gray-500 max-w-2xl mx-auto text-lg leading-relaxed">
                        Fokuslah meracik kopi terbaik, biarkan KasRapi mengurus administrasi dan operasional harian Anda.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {features.map((feature, idx) => (
                        <div
                            key={idx}
                            className="group p-10 bg-brand-bg rounded-[2.5rem] border border-gray-100 hover:border-coffee-dark/10 transition-all hover:shadow-[0_40px_80px_-20px_rgba(60,42,33,0.08)] hover:-translate-y-2 duration-500"
                        >
                            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-coffee-dark shadow-sm mb-8 transition-transform group-hover:scale-110 group-hover:rotate-3 duration-500">
                                <feature.icon size={32} />
                            </div>
                            <h3 className="text-2xl font-bold text-coffee-dark mb-4 tracking-tight">{feature.title}</h3>
                            <p className="text-gray-500 leading-relaxed font-medium opacity-80">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
