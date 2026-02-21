"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Coffee } from 'lucide-react';
import { clsx } from 'clsx';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Fitur', href: '#features' },
        { name: 'Harga', href: '#pricing' },
        { name: 'Tentang', href: '#about' },
    ];

    return (
        <nav
            className={clsx(
                'fixed top-0 left-0 w-full z-50 transition-all duration-300',
                isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-5'
            )}
        >
            <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="bg-coffee-dark p-2 rounded-xl transition-transform group-hover:rotate-12">
                        <Coffee size={24} className="text-white" />
                    </div>
                    <span className="text-xl font-bold text-coffee-dark tracking-tight">KasRapi</span>
                </Link>

                {/* Desktop Links */}
                <div className="hidden md:flex items-center gap-10">
                    <div className="flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="text-sm font-semibold text-gray-500 hover:text-coffee-dark transition-colors"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>
                    <Link
                        href="/register"
                        className="bg-coffee-dark text-white px-8 py-3 rounded-full text-sm font-bold hover:bg-[#2d1e18] transition-all shadow-lg shadow-coffee-dark/20 active:scale-95"
                    >
                        Buka Toko Sekarang
                    </Link>
                </div>

                {/* Mobile Toggle */}
                <button
                    className="md:hidden text-coffee-dark p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden absolute top-full left-0 w-full bg-white border-t p-6 space-y-6 shadow-2xl animate-in fade-in slide-in-from-top-4">
                    <div className="flex flex-col gap-4">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="text-lg font-semibold text-gray-700 hover:text-coffee-dark border-b pb-2 border-gray-50"
                                onClick={() => setIsOpen(false)}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>
                    <Link
                        href="/register"
                        className="block text-center bg-coffee-dark text-white py-4 rounded-2xl font-bold text-lg shadow-lg"
                        onClick={() => setIsOpen(false)}
                    >
                        Buka Toko Sekarang
                    </Link>
                </div>
            )}
        </nav>
    );
}
