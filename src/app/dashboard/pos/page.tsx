"use client";

import { useState } from 'react';
import useSWR from 'swr';
import {
    Search,
    ShoppingCart,
    Trash2,
    Plus,
    Minus,
    CreditCard,
    ChevronRight,
    Loader2,
    Coffee,
    Tag,
    AlertCircle
} from 'lucide-react';
import { usePOSStore } from '@/store/pos-store';
import { useAuth } from '@/hooks/useAuth';
import apiClient from '@/lib/api';
import { toast } from 'sonner';
import { clsx } from 'clsx';
import { generateId } from '@/lib/utils';
import Image from 'next/image';

// --- Types ---
interface Product {
    id: string;
    name: string;
    defaultPrice: number;
    categoryId: string | null;
    image?: string;
    inventory: { quantity: number }[];
    category?: { name: string; color?: string };
}

interface Category {
    id: string;
    name: string;
    color?: string;
}

interface Table {
    id: string;
    tableNumber: string;
}

export default function POSPage() {
    const { store } = useAuth();
    const storeId = store?.id;

    // --- State & Stores ---
    const {
        cart,
        addToCart,
        removeFromCart,
        updateQty,
        clearCart,
        searchTerm,
        setSearchTerm,
        selectedCategoryId,
        setSelectedCategory,
        selectedTableId,
        setSelectedTable
    } = usePOSStore();

    const [isCheckingOut, setIsCheckingOut] = useState(false);

    // --- Data Fetching ---
    const { data: products, isLoading: isLoadingProducts } = useSWR<Product[]>(
        storeId ? `/products/store/${storeId}/all` : null
    );
    const { data: categories, isLoading: isLoadingCategories } = useSWR<Category[]>(
        storeId ? `/categories/store/${storeId}` : null
    );
    const { data: tables } = useSWR<Table[]>(
        storeId ? `/stores/${storeId}/tables` : null
    );

    // --- Filtering ---
    const filteredProducts = products?.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategoryId ? p.categoryId === selectedCategoryId : true;
        return matchesSearch && matchesCategory;
    });

    // --- Calculations ---
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const tax = Math.round(subtotal * 0.1); // Assuming 10% tax for display
    const total = subtotal + tax;

    // --- Handlers ---
    const handleCheckout = async () => {
        if (cart.length === 0) return;

        setIsCheckingOut(true);
        const idempotencyKey = generateId();

        try {
            // 1. Create Order and Get Snap Token
            const response = await apiClient.post('/orders', {
                storeId: storeId,
                items: cart.map(item => ({
                    productId: item.productId,
                    qty: item.qty
                })),
                tableId: selectedTableId,
                idempotencyKey
            });

            const { snapToken } = response.data;

            // 2. Trigger Midtrans Snap
            if (window.snap) {
                window.snap.pay(snapToken, {
                    onSuccess: (result: any) => {
                        toast.success('Pembayaran Berhasil!');
                        clearCart();
                        setIsCheckingOut(false);
                    },
                    onPending: (result: any) => {
                        toast.info('Menunggu Pembayaran...');
                        clearCart();
                        setIsCheckingOut(false);
                    },
                    onError: (result: any) => {
                        toast.error('Pembayaran Gagal!');
                        setIsCheckingOut(false);
                    },
                    onClose: () => {
                        toast.warning('Pembayaran Dibatalkan');
                        setIsCheckingOut(false);
                    }
                });
            } else {
                toast.error('Gagal memuat sistem pembayaran. Silakan segarkan halaman.');
                setIsCheckingOut(false);
            }
        } catch (error: any) {
            console.error('Checkout error:', error);
            if (error.response?.data?.error === 'Stock Insufficient') {
                toast.error(`Maaf, stok ${error.response.data.product} baru saja habis dipesan pelanggan lain!`, {
                    duration: 5000
                });
            } else {
                toast.error(error.response?.data?.error || 'Terjadi kesalahan saat checkout');
            }
            setIsCheckingOut(false);
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-140px)] gap-6">
            {/* Header: Filters & Search */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Cari menu favorit..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 rounded-3xl bg-white border-none shadow-sm focus:ring-4 focus:ring-coffee-dark/5 outline-none font-bold text-coffee-dark text-sm transition-all"
                    />
                </div>

                <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto custom-scrollbar">
                    <button
                        onClick={() => setSelectedCategory(null)}
                        className={clsx(
                            "px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all shrink-0",
                            selectedCategoryId === null
                                ? "bg-coffee-dark text-white shadow-lg shadow-coffee-dark/20"
                                : "bg-white text-gray-400 hover:text-coffee-dark"
                        )}
                    >
                        Semua
                    </button>
                    {categories?.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setSelectedCategory(cat.id)}
                            className={clsx(
                                "px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all shrink-0",
                                selectedCategoryId === cat.id
                                    ? "bg-coffee-dark text-white shadow-lg shadow-coffee-dark/20"
                                    : "bg-white text-gray-400 hover:text-coffee-dark"
                            )}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Content: Catalog & Cart */}
            <div className="flex-1 flex flex-col lg:flex-row gap-6 overflow-hidden">

                {/* Catalog (Left) */}
                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                    {isLoadingProducts ? (
                        <div className="flex items-center justify-center h-64">
                            <Loader2 className="animate-spin text-coffee-dark" size={32} />
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                            {filteredProducts?.map((product) => {
                                const stock = product.inventory?.[0]?.quantity ?? 0;
                                const isOutOfStock = stock <= 0;

                                return (
                                    <button
                                        key={product.id}
                                        onClick={() => addToCart(product)}
                                        disabled={isOutOfStock}
                                        className={clsx(
                                            "group relative bg-white p-4 rounded-[2.5rem] text-left transition-all hover:shadow-2xl hover:-translate-y-1 active:scale-95",
                                            isOutOfStock && "opacity-50 grayscale cursor-not-allowed"
                                        )}
                                    >
                                        <div className="relative aspect-square rounded-3xl overflow-hidden mb-4 bg-brand-bg flex items-center justify-center">
                                            {product.image ? (
                                                <Image
                                                    src={product.image}
                                                    alt={product.name}
                                                    fill
                                                    className="object-cover transition-transform group-hover:scale-110"
                                                />
                                            ) : (
                                                <Coffee size={40} className="text-coffee-dark/20" />
                                            )}

                                            {/* Stock Badge */}
                                            <div className={clsx(
                                                "absolute top-3 right-3 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter shadow-sm",
                                                isOutOfStock ? "bg-red-500 text-white" : "bg-white text-coffee-dark"
                                            )}>
                                                {isOutOfStock ? 'Habis' : `${stock} Stok`}
                                            </div>
                                        </div>

                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 truncate">
                                            {product.category?.name || 'General'}
                                        </p>
                                        <h3 className="text-sm font-black text-coffee-dark leading-tight mb-2 line-clamp-2 min-h-[2.5rem]">
                                            {product.name}
                                        </h3>
                                        <p className="text-base font-black text-coffee-dark">
                                            Rp {product.defaultPrice.toLocaleString()}
                                        </p>

                                        <div className="absolute bottom-4 right-4 p-2 bg-coffee-dark text-white rounded-xl shadow-lg opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all">
                                            <Plus size={16} />
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Cart (Right) */}
                <div className="w-full lg:w-[400px] shrink-0 flex flex-col gap-6">
                    <div className="flex-1 bg-white rounded-[3rem] shadow-xl flex flex-col overflow-hidden border border-gray-50">
                        {/* Cart Header */}
                        <div className="px-8 py-6 border-b border-gray-50 flex items-center justify-between bg-brand-bg/20">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-coffee-dark text-white rounded-xl">
                                    <ShoppingCart size={18} />
                                </div>
                                <h2 className="text-lg font-black text-coffee-dark tracking-tighter">Keranjang</h2>
                            </div>
                            <button
                                onClick={clearCart}
                                className="text-[10px] font-black text-red-500 uppercase tracking-widest hover:bg-red-50 px-3 py-1.5 rounded-full transition-all"
                            >
                                Kosongkan
                            </button>
                        </div>

                        {/* Cart Items */}
                        <div className="flex-1 overflow-y-auto px-6 py-4 custom-scrollbar">
                            {cart.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center p-8">
                                    <div className="w-20 h-20 bg-brand-bg rounded-full flex items-center justify-center mb-4">
                                        <Coffee size={32} className="text-coffee-dark/20" />
                                    </div>
                                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Keranjang Kosong</p>
                                    <p className="text-[10px] text-gray-300 mt-2">Pilih menu di sebelah kiri untuk memulai transaksi.</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {cart.map((item) => (
                                        <div
                                            key={item.productId}
                                            className="flex items-center gap-4 bg-brand-bg/30 p-4 rounded-[2rem] animate-in slide-in-from-right-2 duration-300"
                                        >
                                            <div className="relative w-14 h-14 rounded-2xl overflow-hidden bg-white shrink-0">
                                                {item.image ? (
                                                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                                                ) : (
                                                    <Coffee size={24} className="m-auto absolute inset-0 text-coffee-dark/10" />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-xs font-black text-coffee-dark truncate">{item.name}</h4>
                                                <p className="text-[10px] font-bold text-gray-400 mt-1">Rp {item.price.toLocaleString()}</p>
                                            </div>
                                            <div className="flex items-center gap-3 bg-white px-2 py-1.5 rounded-2xl shadow-sm">
                                                <button
                                                    onClick={() => updateQty(item.productId, -1)}
                                                    className="p-1 hover:bg-brand-bg rounded-lg text-gray-400 transition-all"
                                                >
                                                    <Minus size={14} />
                                                </button>
                                                <span className="text-xs font-black text-coffee-dark w-4 text-center">{item.qty}</span>
                                                <button
                                                    onClick={() => updateQty(item.productId, 1)}
                                                    className="p-1 hover:bg-brand-bg rounded-lg text-coffee-dark transition-all"
                                                >
                                                    <Plus size={14} />
                                                </button>
                                            </div>
                                            <button
                                                onClick={() => removeFromCart(item.productId)}
                                                className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Order Options (Table Selector) */}
                        <div className="px-8 py-6 bg-brand-bg/40 border-t border-gray-50">
                            <label className="text-[10px] font-black text-coffee-dark uppercase tracking-[0.2em] mb-3 block">Pilihan Layanan</label>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setSelectedTable(null)}
                                    className={clsx(
                                        "flex-1 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all",
                                        selectedTableId === null ? "bg-coffee-dark text-white shadow-lg" : "bg-white text-gray-400"
                                    )}
                                >
                                    Takeaway
                                </button>
                                <div className="relative flex-[2]">
                                    <select
                                        value={selectedTableId || ''}
                                        onChange={(e) => setSelectedTable(e.target.value || null)}
                                        className={clsx(
                                            "w-full py-3 px-4 rounded-2xl text-[10px] font-black uppercase tracking-widest outline-none appearance-none transition-all",
                                            selectedTableId ? "bg-coffee-dark text-white shadow-lg" : "bg-white text-gray-400"
                                        )}
                                    >
                                        <option value="">Pilih Meja...</option>
                                        {tables?.map(t => (
                                            <option key={t.id} value={t.id}>Meja #{t.tableNumber}</option>
                                        ))}
                                    </select>
                                    <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none rotate-90" size={14} />
                                </div>
                            </div>
                        </div>

                        {/* Totals */}
                        <div className="p-8 space-y-4">
                            <div className="flex justify-between text-xs font-bold text-gray-400">
                                <span>Subtotal</span>
                                <span>Rp {subtotal.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-xs font-bold text-gray-400 border-b border-dashed border-gray-100 pb-4">
                                <span className="flex items-center gap-2">
                                    Pajak (10%)
                                    <AlertCircle size={12} className="text-gray-300" />
                                </span>
                                <span>Rp {tax.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-end pt-2">
                                <span className="text-[10px] font-black text-coffee-dark uppercase tracking-[0.2em]">Total Tagihan</span>
                                <span className="text-2xl font-black text-coffee-dark">Rp {total.toLocaleString()}</span>
                            </div>

                            <button
                                onClick={handleCheckout}
                                disabled={cart.length === 0 || isCheckingOut}
                                className="w-full flex items-center justify-center gap-3 py-5 bg-coffee-dark text-white rounded-3xl font-black text-xs uppercase tracking-[0.25em] shadow-xl shadow-coffee-dark/20 hover:bg-[#2d1e18] hover:-translate-y-1 active:scale-95 transition-all disabled:opacity-50 disabled:translate-y-0"
                            >
                                {isCheckingOut ? (
                                    <Loader2 className="animate-spin" size={20} />
                                ) : (
                                    <CreditCard size={20} />
                                )}
                                {isCheckingOut ? 'Memproses...' : 'Proses Pembayaran'}
                            </button>
                        </div>
                    </div>

                    {/* Quick Stats / Info (Optional aesthetic touch) */}
                    <div className="px-8 py-6 bg-[#FDFCFB] rounded-[2.5rem] border border-gray-50 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-coffee-dark/5 flex items-center justify-center text-coffee-dark">
                                <Tag size={18} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Order Mode</p>
                                <p className="text-xs font-black text-coffee-dark">{selectedTableId ? 'Dine In' : 'Takeaway'}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Items</p>
                            <p className="text-xs font-black text-coffee-dark">{cart.reduce((s, i) => s + i.qty, 0)} Pcs</p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

// Extend global window type for Midtrans Snap
declare global {
    interface Window {
        snap: any;
    }
}
