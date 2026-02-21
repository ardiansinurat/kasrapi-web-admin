"use client";

import { Check, Zap, Rocket, Star } from 'lucide-react';
import Link from 'next/link';

const tiers = [
    {
        name: 'Small Tier',
        price: '99',
        description: 'Cocok untuk booth kopi atau kafe kecil.',
        features: [
            '1 Toko Aktif',
            'Inventory Dasar',
            'Laporan Harian',
            'Pembayaran Cash',
        ],
        icon: Star,
        isPopular: false,
    },
    {
        name: 'Medium Tier',
        price: '249',
        description: 'Untuk kafe yang sedang berkembang pesat.',
        features: [
            'Hingga 3 Toko',
            'Inventory Lanjutan',
            'Integrasi QRIS/Midtrans',
            'Laporan Mingguan PDF',
            'Manajemen Karyawan',
        ],
        icon: Zap,
        isPopular: true,
    },
    {
        name: 'Large Tier',
        price: '499',
        description: 'Solusi lengkap untuk franchise kafe besar.',
        features: [
            'Toko Tak Terbatas',
            'Multi-Warehouse',
            'Analytics & Forecast AI',
            'Support Prioritas 24/7',
            'API Access',
        ],
        icon: Rocket,
        isPopular: false,
    },
];

export default function Pricing() {
    return (
        <section id="pricing" className="py-24 bg-brand-bg">
            <div className="max-w-7xl mx-auto px-6 md:px-12">
                <div className="text-center mb-16 space-y-4">
                    <h2 className="text-4xl md:text-5xl font-bold text-coffee-dark tracking-tight">Investasi untuk Ketenangan.</h2>
                    <p className="text-gray-500 max-w-xl mx-auto text-lg leading-relaxed">
                        Pilih paket yang sesuai dengan skala bisnis Anda saat ini. Bisa upgrade kapan saja.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {tiers.map((tier, idx) => (
                        <div
                            key={idx}
                            className={`relative p-10 rounded-[3rem] border transition-all duration-500 ${tier.isPopular
                                    ? 'bg-coffee-dark text-white ring-8 ring-coffee-dark/5 shadow-2xl -translate-y-4 scale-105 z-10'
                                    : 'bg-white border-gray-100 hover:border-coffee-dark/20 shadow-sm hover:shadow-xl'
                                }`}
                        >
                            {tier.isPopular && (
                                <div className="absolute top-0 right-10 -translate-y-1/2 bg-amber-400 text-coffee-dark text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full shadow-lg">
                                    Paling Populer
                                </div>
                            )}

                            <div className="mb-8">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${tier.isPopular ? 'bg-white/10 text-white' : 'bg-brand-bg text-coffee-dark'}`}>
                                    <tier.icon size={28} />
                                </div>
                                <h3 className="text-xl font-bold mb-2">{tier.name}</h3>
                                <p className={`text-sm font-medium ${tier.isPopular ? 'text-gray-300' : 'text-gray-400'}`}>{tier.description}</p>
                            </div>

                            <div className="mb-8 flex items-baseline gap-1">
                                <span className="text-sm font-bold opacity-60 uppercase">Rp</span>
                                <span className="text-4xl font-black tracking-tight">{tier.price}rb</span>
                                <span className={`text-sm font-medium ${tier.isPopular ? 'text-gray-300' : 'text-gray-400'}`}>/bulan</span>
                            </div>

                            <ul className="space-y-4 mb-10">
                                {tier.features.map((feature, fIdx) => (
                                    <li key={fIdx} className="flex items-center gap-3 text-sm font-medium">
                                        <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${tier.isPopular ? 'bg-white/20' : 'bg-green-50'}`}>
                                            <Check size={12} className={tier.isPopular ? 'text-white' : 'text-green-600'} />
                                        </div>
                                        <span className={tier.isPopular ? 'text-gray-100' : 'text-gray-600'}>{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <Link
                                href="/register"
                                className={`block text-center py-4 rounded-2xl font-bold transition-all active:scale-95 shadow-lg ${tier.isPopular
                                        ? 'bg-white text-coffee-dark hover:bg-gray-100 shadow-white/10'
                                        : 'bg-coffee-dark text-white hover:bg-[#2d1e18] shadow-coffee-dark/20'
                                    }`}
                            >
                                Pilih {tier.name}
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
