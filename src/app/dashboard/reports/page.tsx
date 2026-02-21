"use client";

import React, { useState, useMemo } from 'react';
import useSWR from 'swr';
import {
    TrendingUp,
    TrendingDown,
    DollarSign,
    Users,
    ShoppingBag,
    ArrowRight,
    Calendar,
    Printer,
    Download,
    ChevronDown,
    Search,
    Filter
} from 'lucide-react';
import { clsx } from 'clsx';
import { useAuth } from '@/hooks/useAuth';
import EmptyState from "@/components/ui/EmptyState";
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip
} from 'recharts';

type TimeFilter = '7d' | '30d' | 'month';

interface ReportSummary {
    totalRevenue: number;
    totalProfit: number;
    transactionCount: number;
    averageTransaction: number;
}

interface TopProduct {
    productId: string;
    productName: string;
    totalQty: number;
    totalRevenue: number;
}

interface Transaction {
    id: string;
    date: string;
    amount: number;
    type: 'IN' | 'OUT';
    note?: string;
    product?: { name: string };
}

export default function ReportsPage() {
    const { store, user } = useAuth();
    const [timeFilter, setTimeFilter] = useState<TimeFilter>('month');

    // Fetch Summary
    const { data: summary, isLoading: isLoadingSummary } = useSWR<ReportSummary>(
        store?.id ? `/reports/summary?storeId=${store.id}&type=${timeFilter === '7d' ? 'weekly' : timeFilter === '30d' ? 'monthly' : 'monthly'}` : null
    );

    // Fetch Top Products
    const { data: topProducts, isLoading: isLoadingTop } = useSWR<TopProduct[]>(
        store?.id ? `/reports/top-products?storeId=${store.id}&window=${timeFilter === '7d' ? 'week' : 'month'}&limit=5` : null
    );

    // Fetch Chart Data
    const { data: chartData, isLoading: isLoadingChart } = useSWR<any[]>(
        store?.id ? `/reports/monthly-breakdown?storeId=${store.id}` : null
    );

    // Fetch Recent Transactions
    const { data: transactions, isLoading: isLoadingTx } = useSWR<Transaction[]>(
        (store?.id && user?.id) ? `/transactions/user/${user.id}?storeId=${store.id}&limit=10` : null
    );

    const performanceData = useMemo(() => {
        if (!chartData) return [];
        const today = new Date().getUTCDate();
        const daysToTake = timeFilter === '7d' ? 7 : timeFilter === '30d' ? 30 : today;
        const start = Math.max(0, today - daysToTake);
        return chartData.slice(start, today).map(item => ({
            name: new Date(item.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }),
            sales: item.totalIn
        }));
    }, [chartData, timeFilter]);

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="space-y-10 pb-20 animate-in fade-in duration-700 print:p-0">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 print:hidden">
                <div>
                    <h2 className="text-3xl font-black text-coffee-dark tracking-tighter">Reports & Analytics</h2>
                    <p className="text-gray-400 font-medium">Visualisasi performa bisnis Anda.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <select
                            value={timeFilter}
                            onChange={(e) => setTimeFilter(e.target.value as TimeFilter)}
                            className="appearance-none bg-white border border-gray-100 pl-10 pr-12 py-3 rounded-2xl text-sm font-bold text-coffee-dark shadow-sm hover:border-coffee-dark/20 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-coffee-dark/5"
                        >
                            <option value="7d">7 Hari Terakhir</option>
                            <option value="30d">30 Hari Terakhir</option>
                            <option value="month">Bulan Ini</option>
                        </select>
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                    </div>
                    <button
                        onClick={handlePrint}
                        className="flex items-center gap-2 px-6 py-3 bg-coffee-dark text-white rounded-2xl text-sm font-bold shadow-lg shadow-coffee-dark/20 hover:bg-[#2d1e18] transition-all active:scale-95"
                    >
                        <Printer size={18} />
                        Cetak Laporan
                    </button>
                </div>
            </div>

            {/* Section A: Financial Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <SummaryCard
                    title="Total Omzet"
                    value={summary ? `Rp ${summary.totalRevenue.toLocaleString()}` : "Rp 0"}
                    trend="+12.5%"
                    isPositive={true}
                    icon={<DollarSign size={20} />}
                    isLoading={isLoadingSummary}
                />
                <SummaryCard
                    title="Estimasi Keuntungan"
                    value={summary ? `Rp ${(summary.totalRevenue * 0.7).toLocaleString()}` : "Rp 0"} // Mock conversion for profit
                    trend="+8.2%"
                    isPositive={true}
                    icon={<TrendingUp size={20} />}
                    color="green"
                    isLoading={isLoadingSummary}
                />
                <SummaryCard
                    title="Rata-rata Transaksi"
                    value={summary ? `Rp ${summary.averageTransaction.toLocaleString()}` : "Rp 0"}
                    trend="-2.1%"
                    isPositive={false}
                    icon={<ShoppingBag size={20} />}
                    isLoading={isLoadingSummary}
                />
            </div>

            {/* Section B: Sales Trend & Top Products */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Main Chart */}
                <div className="lg:col-span-8 bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden">
                    <div className="flex items-center justify-between mb-10">
                        <h3 className="text-xl font-black text-coffee-dark tracking-tight">Tren Pendapatan</h3>
                        <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 bg-brand-bg px-3 py-1.5 rounded-full uppercase tracking-widest">
                            {timeFilter === '7d' ? 'Weekly' : 'Monthly'} View
                        </div>
                    </div>
                    <div className="h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={performanceData}>
                                <defs>
                                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3C2A21" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#3C2A21" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94A3B8', fontSize: 10, fontWeight: 700 }}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94A3B8', fontSize: 10, fontWeight: 700 }}
                                    tickFormatter={(val) => `Rp ${val >= 1000000 ? (val / 1000000).toFixed(1) + 'M' : val >= 1000 ? (val / 1000).toFixed(0) + 'k' : val}`}
                                />
                                <Tooltip
                                    contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}
                                    formatter={(val: any) => [`Rp ${val.toLocaleString()}`, 'Penjualan']}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="sales"
                                    stroke="#3C2A21"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorSales)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Best Sellers */}
                <div className="lg:col-span-4 bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm">
                    <h3 className="text-xl font-black text-coffee-dark tracking-tight mb-8 text-center md:text-left">Produk Terlaris</h3>
                    <div className="space-y-8">
                        {isLoadingTop ? (
                            Array(5).fill(0).map((_, i) => <div key={i} className="h-12 bg-brand-bg animate-pulse rounded-2xl" />)
                        ) : topProducts?.length === 0 ? (
                            <div className="py-10 text-center text-gray-400 font-bold italic uppercase tracking-widest text-xs">Belum ada data</div>
                        ) : (
                            topProducts?.map((product, idx) => (
                                <div key={product.productId} className="space-y-3 group">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-black text-coffee-dark">#{idx + 1} {product.productName}</span>
                                        <span className="text-xs font-bold text-gray-400">{product.totalQty} terjual</span>
                                    </div>
                                    <div className="h-2 w-full bg-brand-bg rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-coffee-dark group-hover:bg-[#1A4D2E] transition-all duration-1000"
                                            style={{ width: `${(product.totalQty / (topProducts[0]?.totalQty || 1)) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Section C: Transaction History Table */}
            <div className="bg-white rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-10 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h3 className="text-xl font-black text-coffee-dark tracking-tight">Riwayat Transaksi Terakhir</h3>
                        <p className="text-gray-400 text-sm font-medium">10 transaksi terbaru di toko ini.</p>
                    </div>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Cari transaksi..."
                            className="bg-brand-bg border-none pl-12 pr-6 py-3 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-coffee-dark/5 w-full md:w-64"
                        />
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-brand-bg/50">
                                <th className="px-10 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Waktu</th>
                                <th className="px-10 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Tipe</th>
                                <th className="px-10 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Keterangan</th>
                                <th className="px-10 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Nominal</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {isLoadingTx ? (
                                Array(5).fill(0).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={4} className="px-10 py-6"><div className="h-4 bg-brand-bg rounded-lg w-full" /></td>
                                    </tr>
                                ))
                            ) : transactions?.length === 0 ? (
                                <tr>
                                    <td colSpan={4}>
                                        <EmptyState
                                            icon={ShoppingBag}
                                            title="Belum Ada Transaksi"
                                            description="Data laporan akan muncul di sini setelah Anda mulai melayani pelanggan di POS."
                                            className="py-16"
                                        />
                                    </td>
                                </tr>
                            ) : (
                                transactions?.map((tx) => (
                                    <tr key={tx.id} className="hover:bg-brand-bg/30 transition-colors">
                                        <td className="px-10 py-6 text-sm font-bold text-gray-500">
                                            {new Date(tx.date).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                        </td>
                                        <td className="px-10 py-6">
                                            <span className={clsx(
                                                "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter",
                                                tx.type === 'IN' ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
                                            )}>
                                                {tx.type === 'IN' ? 'Penjualan' : 'Pengeluaran'}
                                            </span>
                                        </td>
                                        <td className="px-10 py-6 text-sm font-bold text-coffee-dark">
                                            {tx.product?.name || tx.note || 'Transaksi Kas'}
                                        </td>
                                        <td className={clsx(
                                            "px-10 py-6 text-sm font-black text-right",
                                            tx.type === 'IN' ? "text-coffee-dark" : "text-red-500"
                                        )}>
                                            {tx.type === 'IN' ? '+' : '-'} Rp {tx.amount.toLocaleString()}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Print Layout Footer (Hidden on screen) */}
            <div className="hidden print:block mt-20 pt-10 border-t border-gray-200 text-center">
                <p className="text-sm font-bold text-gray-400">KasRapi © 2024 - Laporan Otomatis</p>
                <p className="text-xs text-gray-300 mt-1">Dicetak pada {new Date().toLocaleString()}</p>
            </div>
        </div>
    );
}

function SummaryCard({ title, value, trend, isPositive, icon, color = 'default', isLoading }: {
    title: string;
    value: string;
    trend: string;
    isPositive: boolean;
    icon: React.ReactNode;
    color?: 'default' | 'green';
    isLoading?: boolean
}) {
    return (
        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm relative overflow-hidden group">
            <div className="flex items-center gap-4 mb-6">
                <div className={clsx(
                    "p-3 rounded-2xl transition-all duration-500",
                    color === 'green' ? "bg-green-50 text-[#1A4D2E]" : "bg-brand-bg text-coffee-dark"
                )}>
                    {icon}
                </div>
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{title}</h4>
            </div>
            {isLoading ? (
                <div className="space-y-2">
                    <div className="h-8 bg-brand-bg animate-pulse rounded-lg w-2/3" />
                    <div className="h-4 bg-brand-bg animate-pulse rounded-lg w-1/3" />
                </div>
            ) : (
                <>
                    <h3 className="text-3xl font-black text-coffee-dark tracking-tighter mb-4">{value}</h3>
                    <div className="flex items-center gap-2">
                        <div className={clsx(
                            "flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black",
                            isPositive ? "bg-green-50 text-[#1A4D2E]" : "bg-red-50 text-red-600"
                        )}>
                            {isPositive ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                            {trend}
                        </div>
                        <span className="text-[10px] font-bold text-gray-300 uppercase tracking-tighter">vs bulan lalu</span>
                    </div>
                </>
            )}
        </div>
    );
}
