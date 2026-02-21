"use client";

import Link from 'next/link';
import { Coffee, Instagram, Twitter, Facebook, ArrowUpRight } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-brand-bg pt-24 pb-12 border-t border-gray-100">
            <div className="max-w-7xl mx-auto px-6 md:px-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
                    <div className="col-span-1 md:col-span-2 space-y-8">
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="bg-coffee-dark p-2 rounded-xl transition-transform group-hover:rotate-12">
                                <Coffee size={24} className="text-white" />
                            </div>
                            <span className="text-2xl font-bold text-coffee-dark tracking-tight">KasRapi</span>
                        </Link>
                        <p className="text-gray-500 max-w-sm text-lg leading-relaxed font-medium opacity-80">
                            Solusi manajemen kafe digital yang membantu pemilik bisnis untuk fokus pada kualitas produk dan layanan pelanggan.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="w-12 h-12 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-coffee-dark hover:border-coffee-dark hover:shadow-xl transition-all duration-300"><Instagram size={20} /></a>
                            <a href="#" className="w-12 h-12 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-coffee-dark hover:border-coffee-dark hover:shadow-xl transition-all duration-300"><Twitter size={20} /></a>
                            <a href="#" className="w-12 h-12 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-coffee-dark hover:border-coffee-dark hover:shadow-xl transition-all duration-300"><Facebook size={20} /></a>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-bold text-coffee-dark mb-8 text-lg">Produk</h4>
                        <ul className="space-y-4">
                            <li><Link href="#features" className="text-gray-500 hover:text-coffee-dark font-medium transition-colors flex items-center gap-1">Fitur POS <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100" /></Link></li>
                            <li><Link href="#pricing" className="text-gray-500 hover:text-coffee-dark font-medium transition-colors">Harga Paket</Link></li>
                            <li><Link href="#" className="text-gray-500 hover:text-coffee-dark font-medium transition-colors">Demo Aplikasi</Link></li>
                            <li><Link href="#" className="text-gray-500 hover:text-coffee-dark font-medium transition-colors">Update Terbaru</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-coffee-dark mb-8 text-lg">Dukungan</h4>
                        <ul className="space-y-4">
                            <li><Link href="#" className="text-gray-500 hover:text-coffee-dark font-medium transition-colors">Pusat Bantuan</Link></li>
                            <li><Link href="#" className="text-gray-500 hover:text-coffee-dark font-medium transition-colors">Panduan Barista</Link></li>
                            <li><Link href="#" className="text-gray-500 hover:text-coffee-dark font-medium transition-colors">Komunitas Kafe</Link></li>
                            <li><Link href="#" className="text-gray-500 hover:text-coffee-dark font-medium transition-colors font-bold text-indigo-600">Hubungi Kami</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="pt-10 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                        <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">© 2026 KasRapi. All Rights Reserved.</p>
                    </div>
                    <div className="flex gap-8">
                        <Link href="#" className="text-xs font-bold text-gray-400 hover:text-coffee-dark uppercase tracking-widest">Kebijakan Privasi</Link>
                        <Link href="#" className="text-xs font-bold text-gray-400 hover:text-coffee-dark uppercase tracking-widest">Syarat & Ketentuan</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
