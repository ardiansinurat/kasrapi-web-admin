"use client";

import useSWR from 'swr';
import {
    DollarSign,
    Receipt,
    ShoppingBag,
    Plus,
    BarChart3,
    AlertCircle,
    ExternalLink,
    Store
} from 'lucide-react';
import Link from 'next/link';
import { clsx } from 'clsx';
import { useAuth } from '@/hooks/useAuth';
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip
} from 'recharts';
import React from 'react'; // Added React import for useMemo

// Types
interface DashboardStats {
    totalSalesToday: number;
    activeOrders: number;
    itemsSoldToday: number;
    lowStockItems: Array<{ id: string; name: string; stock: number; unit: string }>;
}

export default function DashboardPage() {
    // Mocking data for now as per "Placeholder data" requirement
    const { data: stats } = useSWR<DashboardStats>('/admin/dashboard/summary', {
        fallbackData: {
            totalSalesToday: 0,
            activeOrders: 0,
            itemsSoldToday: 0,
            lowStockItems: []
        },
        refreshInterval: 10000
    });

    const { store } = useAuth();

    const { data: chartData, isLoading: isLoadingChart } = useSWR<any[]>(
        store?.id ? `/reports/monthly-breakdown?storeId=${store.id}` : null
    );

    // Process last 7 days for the Area Chart
    const performanceData = React.useMemo(() => {
        if (!chartData) return [];
        // Get today's day number (1-indexed matching the breakdown indices)
        const today = new Date().getUTCDate();
        // Take 7 days including today
        const start = Math.max(0, today - 7);
        return chartData.slice(start, today).map(item => ({
            name: new Date(item.date).toLocaleDateString('id-ID', { weekday: 'short' }),
            sales: item.totalIn
        }));
    }, [chartData]);

    return (
        <div className="space-y-12 pb-12 animate-in fade-in duration-700">
            {/* Quick Actions */}
            <section>
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.3em] mb-6">Quick Actions</h3>
                <div className="flex flex-wrap gap-4">
                    <QuickActionButton
                        href="/dashboard/pos"
                        label="Open POS"
                        icon={<ShoppingBag size={18} />}
                        primary
                    />
                    <QuickActionButton
                        href="/dashboard/menu"
                        label="Add Product"
                        icon={<Plus size={18} />}
                    />
                    <QuickActionButton
                        href="/dashboard/reports"
                        label="View Reports"
                        icon={<BarChart3 size={18} />}
                    />
                </div>
            </section>

            {/* Metrics Grid */}
            <section>
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.3em]">Today's Performance</h3>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-green-500 bg-green-50 px-3 py-1 rounded-full uppercase tracking-tighter">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                        Live Updates
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <MetricCard
                        title="Total Sales Today"
                        value={stats ? `Rp ${stats.totalSalesToday.toLocaleString()}` : 'Rp 0'}
                        icon={<DollarSign className="text-coffee-dark" size={24} />}
                        description="+0% dari kemaren"
                    />
                    <MetricCard
                        title="Active Orders"
                        value={stats ? stats.activeOrders.toString() : '0'}
                        icon={<Receipt className="text-coffee-dark" size={24} />}
                        description="Orders in progress"
                    />
                    <MetricCard
                        title="Items Sold"
                        value={stats ? stats.itemsSoldToday.toString() : '0'}
                        icon={<ShoppingBag className="text-coffee-dark" size={24} />}
                        description="Product units sold"
                    />
                </div>
            </section>

            {/* Sales Trend Chart */}
            <section className="animate-in slide-in-from-bottom-6 duration-1000 delay-300">
                <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-xl shadow-gray-200/50">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                        <div>
                            <h3 className="text-2xl font-black text-coffee-dark tracking-tighter">Sales Performance</h3>
                            <p className="text-gray-400 text-sm font-medium">Tren pendapatan dalam 7 hari terakhir.</p>
                        </div>
                        <div className="flex bg-brand-bg p-1.5 rounded-2xl border border-gray-100">
                            <span className="px-5 py-2 bg-white rounded-xl shadow-sm text-xs font-black text-coffee-dark uppercase tracking-widest">7 Hari</span>
                        </div>
                    </div>

                    <div className="h-[350px] w-full">
                        {isLoadingChart ? (
                            <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 gap-4">
                                <BarChart3 className="animate-bounce" size={32} />
                                <p className="text-xs font-black uppercase tracking-widest italic">Menghitung data...</p>
                            </div>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={performanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3C2A21" stopOpacity={0.15} />
                                            <stop offset="95%" stopColor="#3C2A21" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                                    <XAxis
                                        dataKey="name"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#94A3B8', fontSize: 10, fontWeight: 700 }}
                                        dy={10}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#94A3B8', fontSize: 10, fontWeight: 700 }}
                                        tickFormatter={(value) => `Rp ${value >= 1000 ? (value / 1000) + 'k' : value}`}
                                    />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '1.2rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '12px' }}
                                        itemStyle={{ color: '#3C2A21', fontWeight: 900, fontSize: '12px' }}
                                        labelStyle={{ color: '#94A3B8', fontWeight: 700, fontSize: '10px', marginBottom: '4px', textTransform: 'uppercase' }}
                                        formatter={(value: any) => [`Rp ${value.toLocaleString()}`, 'Penjualan']}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="sales"
                                        stroke="#3C2A21"
                                        strokeWidth={4}
                                        fillOpacity={1}
                                        fill="url(#colorSales)"
                                        animationDuration={2000}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>
            </section>

            {/* Secondary Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Low Stock Alerts */}
                <section className="lg:col-span-12">
                    <div className="bg-white rounded-[2rem] border border-gray-100 p-8 shadow-sm">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-red-50 text-red-600 rounded-xl">
                                    <AlertCircle size={20} />
                                </div>
                                <h3 className="text-xl font-black text-coffee-dark tracking-tight">Stock Alerts</h3>
                            </div>
                            <Link href="/dashboard/menu" className="text-sm font-bold text-gray-400 hover:text-coffee-dark transition-colors flex items-center gap-2">
                                Manage Stock <ExternalLink size={14} />
                            </Link>
                        </div>

                        {!stats || stats.lowStockItems.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 bg-brand-bg rounded-[1.5rem] border border-dashed border-gray-200">
                                <Store className="text-gray-200 mb-4" size={48} />
                                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest italic">All stock is healthy</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {stats.lowStockItems.map((item) => (
                                    <div key={item.id} className="flex items-center justify-between p-5 bg-brand-bg rounded-2xl border border-gray-100 transition-all hover:bg-white hover:shadow-lg">
                                        <span className="font-bold text-coffee-dark">{item.name}</span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-black text-red-500 bg-red-50 px-3 py-1 rounded-full uppercase tracking-tighter">
                                                {item.stock} {item.unit} Left
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
}

function MetricCard({ title, value, icon, description }: { title: string; value: string; icon: React.ReactNode; description: string }) {
    return (
        <div className="group bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1 duration-500">
            <div className="flex justify-between items-start mb-6">
                <div className="p-3 bg-brand-bg rounded-2xl text-coffee-dark group-hover:bg-coffee-dark group-hover:text-white transition-all duration-500 shadow-inner">
                    {icon}
                </div>
            </div>
            <div>
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">{title}</p>
                <h3 className="text-3xl font-black text-coffee-dark tracking-tighter">{value}</h3>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-50 flex items-center gap-2">
                <p className="text-[10px] font-bold text-gray-300 uppercase tracking-tight">{description}</p>
            </div>
        </div>
    );
}

function QuickActionButton({ href, label, icon, primary = false }: { href: string; label: string; icon: React.ReactNode; primary?: boolean }) {
    return (
        <Link
            href={href}
            className={clsx(
                "flex items-center gap-3 px-6 py-4 rounded-2xl text-sm font-bold tracking-tight transition-all active:scale-95 shadow-lg",
                primary
                    ? "bg-coffee-dark text-white hover:bg-[#2d1e18] shadow-coffee-dark/10"
                    : "bg-white text-coffee-dark border border-gray-100 hover:bg-gray-50 shadow-gray-400/5"
            )}
        >
            {icon}
            {label}
        </Link>
    );
}
