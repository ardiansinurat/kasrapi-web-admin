"use client";

import Sidebar from '@/components/layout/Sidebar';
import ProtectedRoute from '@/components/layout/ProtectedRoute';
import { useAuth } from '@/hooks/useAuth';
import { LogOut, User, Bell, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import Script from 'next/script';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { store, user, logout } = useAuth();
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    return (
        <ProtectedRoute>
            <Script
                src="https://app.sandbox.midtrans.com/snap/snap.js"
                data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
                strategy="beforeInteractive"
            />
            <div className="flex h-screen bg-brand-bg overflow-hidden font-sans">
                {/* Desktop Sidebar (Sticky) */}
                <div className="hidden lg:block">
                    <Sidebar />
                </div>

                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Top Header */}
                    <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 shrink-0 z-10">
                        <div>
                            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest italic">Dashboard</h2>
                            <p className="text-lg font-black text-coffee-dark tracking-tight">{store?.name || 'My Store'}</p>
                        </div>

                        <div className="flex items-center gap-6">
                            <button className="p-2 text-gray-400 hover:text-coffee-dark transition-colors">
                                <Bell size={20} />
                            </button>

                            {/* Profile Dropdown */}
                            <div className="relative">
                                <button
                                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                                    className="flex items-center gap-3 p-1.5 rounded-full hover:bg-gray-50 transition-all border border-transparent hover:border-gray-100"
                                >
                                    <div className="w-10 h-10 rounded-full bg-brand-bg flex items-center justify-center text-coffee-dark font-black border border-gray-100">
                                        {user?.username?.charAt(0).toUpperCase() || 'J'}
                                    </div>
                                    <div className="hidden md:block text-left">
                                        <p className="text-sm font-bold text-coffee-dark leading-none">{user?.username || 'Juragan'}</p>
                                        <p className="text-[10px] font-medium text-gray-400 mt-1 uppercase tracking-tighter">Owner</p>
                                    </div>
                                    <ChevronDown size={16} className={clsx("text-gray-400 transition-transform", isProfileOpen && "rotate-180")} />
                                </button>

                                {isProfileOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                                        <div className="px-4 py-3 border-b border-gray-50">
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Signed in as</p>
                                            <p className="text-sm font-black text-coffee-dark truncate">{user?.email}</p>
                                        </div>
                                        <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-coffee-dark hover:bg-gray-50 transition-colors">
                                            <User size={18} className="text-gray-400" />
                                            Profile Settings
                                        </button>
                                        <button
                                            onClick={() => logout()}
                                            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-600 hover:bg-red-50 transition-colors"
                                        >
                                            <LogOut size={18} />
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </header>

                    {/* Content Area */}
                    <main className="flex-1 overflow-y-auto p-8 lg:p-12">
                        {children}
                    </main>
                </div>

                {/* Mobile Sidebar Trigger (handled by Sidebar component itself but layout should be aware) */}
                <div className="lg:hidden">
                    <Sidebar />
                </div>
            </div>
        </ProtectedRoute>
    );
}

import { clsx } from 'clsx';
