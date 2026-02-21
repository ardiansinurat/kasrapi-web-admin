"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import {
    LayoutDashboard,
    Coffee,
    LogOut,
    Menu,
    X,
    Settings,
    ShoppingBag,
    BarChart3
} from 'lucide-react';
import { useState } from 'react';
import { clsx } from 'clsx';

const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Point of Sale', href: '/dashboard/pos', icon: ShoppingBag },
    { name: 'Menu Management', href: '/dashboard/menu', icon: Coffee },
    { name: 'Reports', href: '/dashboard/reports', icon: BarChart3 }, // Placeholder for reports
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export default function Sidebar() {
    const pathname = usePathname();
    const { logout } = useAuth();
    const router = useRouter();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleLogout = () => {
        logout();
        router.replace('/login');
    };

    return (
        <>
            {/* Mobile menu button */}
            <div className="lg:hidden fixed top-0 left-0 z-40 w-full bg-white border-b px-4 py-3 flex items-center justify-between">
                <span className="font-bold text-lg text-coffee-dark uppercase tracking-tight">KasRapi</span>
                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="p-2 rounded-md hover:bg-gray-100 text-coffee-dark"
                >
                    {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Sidebar Overlay (Mobile) */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-30 bg-black/50 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar Container */}
            <div className={clsx(
                "fixed inset-y-0 left-0 z-40 w-64 bg-brand-bg border-r transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-auto lg:flex lg:flex-col",
                sidebarOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                {/* Logo Area */}
                <div className="flex h-20 shrink-0 items-center px-8 border-b border-gray-100">
                    <h1 className="text-2xl font-black text-coffee-dark tracking-tighter italic">KasRapi</h1>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 overflow-y-auto pt-6 space-y-1">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={() => setSidebarOpen(false)}
                                className={clsx(
                                    'group relative flex gap-x-3 items-center px-8 py-4 text-sm font-bold transition-all',
                                    isActive
                                        ? 'text-coffee-dark bg-white'
                                        : 'text-gray-400 hover:text-coffee-dark hover:bg-gray-50/50'
                                )}
                            >
                                {/* Elegant Active Indicator */}
                                {isActive && (
                                    <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-coffee-dark" />
                                )}

                                <item.icon
                                    className={clsx(
                                        isActive ? 'text-coffee-dark' : 'text-gray-300 group-hover:text-coffee-dark',
                                        'h-6 w-6 shrink-0 transition-colors'
                                    )}
                                    aria-hidden="true"
                                />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                {/* Logout Section */}
                <div className="border-t border-gray-100 p-6">
                    <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-x-3 rounded-xl p-3 text-sm font-bold text-gray-400 hover:bg-red-50 hover:text-red-600 transition-all duration-300 group"
                    >
                        <LogOut className="h-6 w-6 shrink-0 text-gray-300 group-hover:text-red-600 transition-colors" />
                        Logout
                    </button>
                </div>
            </div>
        </>
    );
}
