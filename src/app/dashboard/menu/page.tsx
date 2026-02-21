"use client";

import { useState, useEffect } from 'react';
import useSWR, { mutate } from 'swr';
import { useAuth } from '@/hooks/useAuth';
import apiClient from '@/lib/api';
import { toast } from 'sonner';
import {
    Plus,
    Edit,
    Trash2,
    Search,
    Loader2,
    Coffee,
    Package,
    Tag,
    MoreVertical,
    CheckCircle2,
    AlertCircle,
    X,
    ChevronRight,
    Filter,
    ArrowUpDown,
    ExternalLink
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { generateId, isValidImageUrl } from '@/lib/utils';
import { clsx } from 'clsx';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import EmptyState from "@/components/ui/EmptyState";

// --- Types ---
interface Category {
    id: string;
    name: string;
    color?: string;
    icon?: string;
    _count?: {
        products: number;
    };
}

interface Inventory {
    quantity: number;
    minAlert: number;
}

interface Product {
    id: string;
    name: string;
    description?: string;
    defaultPrice: number;
    categoryId: string;
    image?: string;
    isActive: boolean;
    category?: Category;
    inventory?: Inventory[]; // Backend returns array due to relation
}

// --- Schemas ---
const productSchema = z.object({
    name: z.string().min(1, 'Nama produk wajib diisi'),
    defaultPrice: z.number().min(0, 'Harga harus valid'),
    categoryId: z.string().min(1, 'Kategori wajib dipilih'),
    description: z.string().optional(),
    initialStock: z.number().min(0).optional(),
    image: z.string().optional().refine(val => !val || isValidImageUrl(val), {
        message: 'URL gambar tidak valid atau tidak didukung (.jpg, .png, .webp)'
    }),
    isActive: z.boolean(),
});

type ProductFormValues = z.infer<typeof productSchema>;

const categorySchema = z.object({
    name: z.string().min(1, 'Nama kategori wajib diisi'),
    color: z.string().optional(),
    icon: z.string().optional(),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

// --- Components ---

export default function MenuPage() {
    const { store } = useAuth();
    const [activeTab, setActiveTab] = useState<'products' | 'categories'>('products');
    const [searchTerm, setSearchTerm] = useState('');

    // Modals
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<any>(null);

    // Data Fetching
    const { data: products, isLoading: isLoadingProducts } = useSWR<Product[]>(
        store?.id ? `/products/store/${store.id}/all` : null
    );
    const { data: categories, isLoading: isLoadingCategories } = useSWR<Category[]>(
        store?.id ? `/categories/store/${store.id}` : null
    );

    const filteredProducts = products?.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleOpenProductModal = (product?: Product) => {
        setEditingItem(product || null);
        setIsProductModalOpen(true);
    };

    const handleOpenCategoryModal = (category?: Category) => {
        setEditingItem(category || null);
        setIsCategoryModalOpen(true);
    };

    return (
        <div className="space-y-10 pb-24 animate-in fade-in duration-700">
            {/* Header section with Tabs */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <h1 className="text-4xl font-black text-coffee-dark tracking-tighter">Kitchen</h1>
                    <p className="text-gray-400 font-medium text-sm">Kelola produk, menu, dan stok inventaris Anda.</p>
                </div>

                <div className="flex bg-brand-bg p-1.5 rounded-2xl border border-gray-100 shadow-inner">
                    <button
                        onClick={() => setActiveTab('products')}
                        className={clsx(
                            "px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                            activeTab === 'products' ? "bg-white shadow-lg text-coffee-dark" : "text-gray-400 hover:text-gray-600"
                        )}
                    >
                        Produk ({products?.length || 0})
                    </button>
                    <button
                        onClick={() => setActiveTab('categories')}
                        className={clsx(
                            "px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                            activeTab === 'categories' ? "bg-white shadow-lg text-coffee-dark" : "text-gray-400 hover:text-gray-600"
                        )}
                    >
                        Kategori ({categories?.length || 0})
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="space-y-8">
                {activeTab === 'products' ? (
                    <ProductList
                        products={filteredProducts || []}
                        isLoading={isLoadingProducts}
                        onAdd={() => handleOpenProductModal()}
                        onEdit={handleOpenProductModal}
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                    />
                ) : (
                    <CategoryList
                        categories={categories || []}
                        isLoading={isLoadingCategories}
                        onAdd={() => handleOpenCategoryModal()}
                        onEdit={handleOpenCategoryModal}
                    />
                )}
            </div>

            {/* Modals */}
            {isProductModalOpen && (
                <ProductModal
                    isOpen={isProductModalOpen}
                    onClose={() => setIsProductModalOpen(false)}
                    product={editingItem}
                    categories={categories || []}
                    storeId={store?.id}
                />
            )}

            {isCategoryModalOpen && (
                <CategoryModal
                    isOpen={isCategoryModalOpen}
                    onClose={() => setIsCategoryModalOpen(false)}
                    category={editingItem}
                    storeId={store?.id}
                />
            )}
        </div>
    );
}

// --- Product Sub-components ---

function ProductList({ products, isLoading, onAdd, onEdit, searchTerm, setSearchTerm }: any) {
    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                <Loader2 className="animate-spin mb-4 text-coffee-dark" />
                <p className="text-sm font-bold uppercase tracking-widest italic leading-none">Menyiapkan Bahan...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative group w-full md:max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-coffee-dark transition-colors" size={20} />
                    <input
                        type="text"
                        placeholder="Cari produk atau kategori..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white border border-gray-100 focus:ring-4 focus:ring-coffee-dark/5 focus:border-coffee-dark outline-none transition-all text-sm font-bold text-coffee-dark placeholder:text-gray-200 shadow-sm"
                    />
                </div>

                <div className="flex gap-2 w-full md:w-auto">
                    <button className="flex-1 md:flex-none flex items-center justify-center gap-2 p-4 bg-brand-bg border border-gray-100 rounded-2xl text-coffee-dark hover:bg-white transition-all shadow-sm">
                        <Filter size={18} />
                        <span className="text-xs font-black uppercase tracking-widest">Filter</span>
                    </button>
                    <button
                        onClick={onAdd}
                        className="flex-[2] md:flex-none flex items-center justify-center gap-3 px-8 py-4 bg-coffee-dark text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#2d1e18] transition-all shadow-xl shadow-coffee-dark/20 active:scale-95"
                    >
                        <Plus size={18} />
                        Tambah Produk
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/50 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-brand-bg/50 border-b border-gray-50">
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Produk</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Kategori</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Harga</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Stok</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {products.length === 0 ? (
                                <tr>
                                    <td colSpan={5}>
                                        <EmptyState
                                            icon={Coffee}
                                            title="Menu Masih Kosong"
                                            description="Kafe Anda belum memiliki produk. Mulai tambahkan menu spesial Anda sekarang!"
                                            action={
                                                <button
                                                    onClick={onAdd}
                                                    className="flex items-center gap-2 px-6 py-3 bg-coffee-dark text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-coffee-dark/20 hover:scale-105 active:scale-95 transition-all"
                                                >
                                                    <Plus size={16} />
                                                    Tambah Menu Pertama
                                                </button>
                                            }
                                        />
                                    </td>
                                </tr>
                            ) : (
                                products.map((product: Product) => {
                                    const stock = product.inventory?.[0]?.quantity ?? 0;
                                    const isLowStock = stock < 5;

                                    return (
                                        <tr key={product.id} className="group hover:bg-brand-bg/30 transition-colors">
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-4">
                                                    <div className="h-14 w-14 rounded-2xl bg-brand-bg border border-gray-100 flex items-center justify-center overflow-hidden shrink-0 group-hover:scale-105 transition-transform duration-500">
                                                        <AspectRatio ratio={1}>
                                                            {product.image ? (
                                                                <img
                                                                    src={product.image}
                                                                    alt={product.name}
                                                                    className="h-full w-full object-cover"
                                                                    onError={(e) => {
                                                                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1511920170033-f8396924c348?q=80&w=200&auto=format&fit=crop';
                                                                    }}
                                                                />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center bg-brand-bg text-coffee-dark/20">
                                                                    <Coffee size={24} strokeWidth={1.5} />
                                                                </div>
                                                            )}
                                                        </AspectRatio>
                                                    </div>
                                                    <div className="space-y-0.5">
                                                        <div className="font-black text-coffee-dark tracking-tight">{product.name}</div>
                                                        <div className="text-[10px] font-medium text-gray-400 uppercase tracking-tighter line-clamp-1 max-w-[200px]">
                                                            {product.description || 'Tidak ada deskripsi'}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-bg border border-gray-100 text-[10px] font-black text-coffee-dark uppercase tracking-tighter">
                                                    <Tag size={10} className="text-gray-300" />
                                                    {product.category?.name || 'Tanpa Kategori'}
                                                </span>
                                            </td>
                                            <td className="px-8 py-5">
                                                <div className="font-black text-coffee-dark">
                                                    Rp {product.defaultPrice.toLocaleString('id-ID')}
                                                </div>
                                            </td>
                                            <td className="px-8 py-5 text-sm">
                                                <div className={clsx(
                                                    "inline-flex items-center gap-2 px-4 py-2 rounded-xl border font-black text-xs uppercase tracking-widest",
                                                    isLowStock
                                                        ? "bg-red-50 border-red-100 text-red-600"
                                                        : "bg-green-50 border-green-100 text-green-600"
                                                )}>
                                                    <div className={clsx(
                                                        "w-2 h-2 rounded-full",
                                                        isLowStock ? "bg-red-500 animate-pulse" : "bg-green-500"
                                                    )} />
                                                    {stock} Unit
                                                </div>
                                            </td>
                                            <td className="px-8 py-5 text-right">
                                                <button
                                                    onClick={() => onEdit(product)}
                                                    className="p-3 text-gray-300 hover:text-coffee-dark hover:bg-white rounded-xl transition-all shadow-sm"
                                                >
                                                    <Edit size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

// --- Category Sub-components ---

function CategoryList({ categories, isLoading, onAdd, onEdit }: any) {
    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                <Loader2 className="animate-spin mb-4 text-coffee-dark" />
                <p className="text-sm font-bold uppercase tracking-widest italic leading-none">Menata Rak...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-end">
                <button
                    onClick={onAdd}
                    className="flex items-center gap-3 px-8 py-4 bg-coffee-dark text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#2d1e18] transition-all shadow-xl shadow-coffee-dark/20 active:scale-95"
                >
                    <Plus size={18} />
                    Buat Kategori Baru
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.length === 0 ? (
                    <div className="col-span-full bg-white rounded-[2.5rem] border border-gray-100 p-20 text-center">
                        <div className="flex flex-col items-center gap-4 text-gray-300">
                            <Tag size={48} strokeWidth={1} />
                            <p className="text-sm font-bold italic uppercase tracking-widest">Belum ada kategori</p>
                        </div>
                    </div>
                ) : (
                    categories.map((cat: Category) => (
                        <div key={cat.id} className="group bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/30 hover:shadow-gray-300/50 transition-all flex items-center justify-between">
                            <div className="flex items-center gap-5">
                                <div
                                    className="h-16 w-16 rounded-[1.5rem] flex items-center justify-center group-hover:rotate-6 transition-transform duration-500"
                                    style={{ backgroundColor: `${cat.color || '#FDFCFB'}15`, border: `1px solid ${cat.color || '#FDFCFB'}30` }}
                                >
                                    <Tag size={28} style={{ color: cat.color }} />
                                </div>
                                <div className="space-y-1">
                                    <h4 className="font-black text-coffee-dark text-lg tracking-tight">{cat.name}</h4>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                        {cat._count?.products || 0} Produk Terkait
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => onEdit(cat)}
                                className="p-4 text-gray-300 hover:text-coffee-dark hover:bg-brand-bg rounded-[1.2rem] transition-all"
                            >
                                <ChevronRight size={24} />
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

// --- Modals ---

function ProductModal({ isOpen, onClose, product, categories, storeId }: any) {
    const [idempotencyKey] = useState(generateId());
    const [isDeleting, setIsDeleting] = useState(false);

    const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<ProductFormValues>({
        resolver: zodResolver(productSchema),
        defaultValues: {
            name: product?.name || '',
            defaultPrice: product?.defaultPrice || 0,
            categoryId: product?.categoryId || '',
            description: product?.description || '',
            initialStock: product?.inventory?.[0]?.quantity || 0,
            image: product?.image || '',
            isActive: product?.isActive ?? true
        }
    });

    const imageUrl = watch('image');
    const isImageValid = imageUrl ? isValidImageUrl(imageUrl) : false;

    const onSubmit = async (data: ProductFormValues) => {
        try {
            if (product) {
                await apiClient.patch(`/products/store/${storeId}/product/${product.id}`, data);
                toast.success('Produk berhasil diperbarui');
            } else {
                // Send Idempotency Key in Global Header for this request
                await apiClient.post(`/products/store/${storeId}`, data, {
                    headers: { 'x-idempotency-key': idempotencyKey }
                });
                toast.success('Produk baru berhasil ditambahkan');
            }
            mutate(`/products/store/${storeId}/all`);
            onClose();
        } catch (error: any) {
            toast.error(error.response?.data?.error || 'Gagal menyimpan produk');
        }
    };

    const handleDelete = async () => {
        if (!confirm('Yakin ingin menghapus produk ini?')) return;
        setIsDeleting(true);
        try {
            await apiClient.delete(`/products/store/${storeId}/product/${product.id}`);
            toast.success('Produk dihapus');
            mutate(`/products/store/${storeId}/all`);
            onClose();
        } catch (err: any) {
            toast.error(err.response?.data?.error || 'Gagal menghapus');
        } finally {
            setIsDeleting(false);
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-coffee-dark/20 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-xl max-h-[90vh] overflow-hidden flex flex-col border border-white/50 animate-in zoom-in-95 duration-500">
                <div className="px-10 py-8 border-b border-gray-50 flex items-center justify-between bg-brand-bg/30">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-white rounded-2xl shadow-sm text-coffee-dark">
                            <Package size={22} />
                        </div>
                        <h2 className="text-2xl font-black text-coffee-dark tracking-tighter">
                            {product ? 'Edit Produk' : 'Produk Baru'}
                        </h2>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white rounded-xl transition-colors">
                        <X size={24} className="text-gray-300" />
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="p-10 space-y-8 overflow-y-auto custom-scrollbar">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Basic Info */}
                        <div className="space-y-6 col-span-full">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-coffee-dark uppercase tracking-widest ml-1">Nama Produk</label>
                                <input
                                    {...register('name')}
                                    placeholder="Kopi Susu Gula Aren"
                                    className="w-full px-6 py-4 rounded-2xl bg-brand-bg border border-gray-100 focus:bg-white focus:ring-4 focus:ring-coffee-dark/5 focus:border-coffee-dark outline-none transition-all text-sm font-bold text-coffee-dark"
                                />
                                {errors.name && <p className="text-red-500 text-[10px] font-black uppercase mt-1 ml-1">{errors.name.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black text-coffee-dark uppercase tracking-widest ml-1">Deskripsi & Catatan</label>
                                <textarea
                                    {...register('description')}
                                    rows={3}
                                    placeholder="Racikan kopi robusta premium..."
                                    className="w-full px-6 py-4 rounded-2xl bg-brand-bg border border-gray-100 focus:bg-white focus:ring-4 focus:ring-coffee-dark/5 focus:border-coffee-dark outline-none transition-all text-sm font-bold text-coffee-dark resize-none"
                                />
                            </div>
                        </div>

                        {/* Financials */}
                        <div className="space-y-2">
                            <label className="text-xs font-black text-coffee-dark uppercase tracking-widest ml-1">Harga Satuan</label>
                            <div className="relative">
                                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-xs font-black text-gray-300">Rp</span>
                                <input
                                    type="number"
                                    {...register('defaultPrice', { valueAsNumber: true })}
                                    className="w-full pl-14 pr-6 py-4 rounded-2xl bg-brand-bg border border-gray-100 focus:bg-white focus:ring-4 focus:ring-coffee-dark/5 focus:border-coffee-dark outline-none transition-all text-sm font-bold text-coffee-dark"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black text-coffee-dark uppercase tracking-widest ml-1">Kategori</label>
                            <select
                                {...register('categoryId')}
                                className="w-full px-6 py-4 rounded-2xl bg-brand-bg border border-gray-100 focus:bg-white focus:ring-4 focus:ring-coffee-dark/5 focus:border-coffee-dark outline-none transition-all text-sm font-bold text-coffee-dark appearance-none"
                            >
                                <option value="">Pilih Kategori...</option>
                                {categories.map((c: any) => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* Inventory */}
                        {!product && (
                            <div className="space-y-2 col-span-full">
                                <label className="text-xs font-black text-coffee-dark uppercase tracking-widest ml-1">Stok Awal</label>
                                <input
                                    type="number"
                                    {...register('initialStock', { valueAsNumber: true })}
                                    className="w-full px-6 py-4 rounded-2xl bg-brand-bg border border-gray-100 focus:bg-white focus:ring-4 focus:ring-coffee-dark/5 focus:border-coffee-dark outline-none transition-all text-sm font-bold text-coffee-dark"
                                />
                                <p className="text-[10px] text-gray-400 italic ml-1 mt-1">* Stok akan bertambah ke catatan inventaris secara otomatis.</p>
                            </div>
                        )}

                        <div className="space-y-3 col-span-full">
                            <div className="flex items-center justify-between ml-1">
                                <label className="text-xs font-black text-coffee-dark uppercase tracking-widest">URL Foto Produk (Opsional)</label>
                                <span className="text-[10px] font-bold text-gray-400 italic">Format WebP direkomendasikan</span>
                            </div>

                            <div className="flex flex-col md:flex-row gap-6 items-start">
                                <div className="flex-1 w-full space-y-2">
                                    <input
                                        {...register('image')}
                                        placeholder="https://image-url.com/produk.webp"
                                        className={clsx(
                                            "w-full px-6 py-4 rounded-2xl bg-brand-bg border outline-none transition-all text-sm font-bold text-coffee-dark",
                                            errors.image ? "border-red-300 focus:border-red-500" : "border-gray-100 focus:bg-white focus:ring-4 focus:ring-coffee-dark/5 focus:border-coffee-dark"
                                        )}
                                    />
                                    {errors.image && <p className="text-red-500 text-[10px] font-black uppercase ml-1 italic">{errors.image.message}</p>}
                                    <p className="text-[9px] text-gray-400 ml-1">Gunakan link langsung (Direct Link) dari hosting gambar tepercaya.</p>
                                </div>

                                {imageUrl && (
                                    <div className="w-24 h-24 rounded-[2rem] border-4 border-white shadow-xl overflow-hidden bg-brand-bg shrink-0 animate-in zoom-in-50 duration-300">
                                        <AspectRatio ratio={1}>
                                            {isImageValid ? (
                                                <img
                                                    src={imageUrl}
                                                    alt="Preview"
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1511920170033-f8396924c348?q=80&w=200&auto=format&fit=crop';
                                                    }}
                                                />
                                            ) : (
                                                <div className="w-full h-full flex flex-col items-center justify-center text-red-300 p-2 text-center">
                                                    <AlertCircle size={20} />
                                                    <span className="text-[8px] font-black leading-tight mt-1">INVALID URL</span>
                                                </div>
                                            )}
                                        </AspectRatio>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between pt-6">
                        {product ? (
                            <button
                                type="button"
                                onClick={handleDelete}
                                disabled={isDeleting}
                                className="p-4 text-red-500 hover:bg-red-50 rounded-2xl transition-all"
                            >
                                {isDeleting ? <Loader2 className="animate-spin" size={24} /> : <Trash2 size={24} />}
                            </button>
                        ) : <div />}

                        <div className="flex gap-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest text-gray-400 hover:text-gray-600 transition-all"
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="group flex items-center gap-3 px-10 py-4 bg-coffee-dark text-white rounded-full font-black text-xs uppercase tracking-widest hover:bg-[#2d1e18] transition-all shadow-xl shadow-coffee-dark/10 disabled:opacity-50 active:scale-95"
                            >
                                {isSubmitting ? (
                                    <Loader2 size={18} className="animate-spin" />
                                ) : (
                                    <CheckCircle2 size={18} className="group-hover:rotate-12 transition-transform" />
                                )}
                                {isSubmitting ? 'Menyimpan...' : (product ? 'Simpan Perubahan' : 'Terbitkan Produk')}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

function CategoryModal({ isOpen, onClose, category, storeId }: any) {
    const { register, handleSubmit, formState: { isSubmitting } } = useForm<CategoryFormValues>({
        resolver: zodResolver(categorySchema) as any,
        defaultValues: {
            name: category?.name || '',
            color: category?.color || '#3C2A21',
            icon: category?.icon || 'coffee'
        }
    });

    const onSubmit = async (data: CategoryFormValues) => {
        try {
            if (category) {
                await apiClient.patch(`/categories/store/${storeId}/category/${category.id}`, data);
                toast.success('Kategori diperbarui');
            } else {
                await apiClient.post(`/categories/store/${storeId}`, data);
                toast.success('Kategori baru dibuat');
            }
            mutate(`/categories/store/${storeId}`);
            onClose();
        } catch (error: any) {
            toast.error(error.response?.data?.error || 'Gagal menyimpan kategori');
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-coffee-dark/20 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-500">
                <div className="px-10 py-8 border-b border-gray-50 flex items-center justify-between bg-brand-bg/30">
                    <div className="flex items-center gap-3">
                        <Tag size={22} className="text-coffee-dark" />
                        <h2 className="text-2xl font-black text-coffee-dark tracking-tighter">
                            {category ? 'Edit Kategori' : 'Kategori Baru'}
                        </h2>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white rounded-xl transition-colors">
                        <X size={24} className="text-gray-300" />
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="p-10 space-y-8">
                    <div className="space-y-2">
                        <label className="text-xs font-black text-coffee-dark uppercase tracking-widest ml-1">Nama Kategori</label>
                        <input
                            {...register('name')}
                            placeholder="Minuman Panas"
                            className="w-full px-6 py-4 rounded-2xl bg-brand-bg border border-gray-100 focus:bg-white focus:ring-4 focus:ring-coffee-dark/5 focus:border-coffee-dark outline-none transition-all text-sm font-bold text-coffee-dark"
                        />
                    </div>

                    <div className="space-y-4">
                        <label className="text-xs font-black text-coffee-dark uppercase tracking-widest ml-1">Warna Label</label>
                        <div className="flex flex-wrap gap-4">
                            {['#3C2A21', '#6366F1', '#EC4899', '#F59E0B', '#10B981', '#3B82F6'].map(color => (
                                <label key={color} className="relative cursor-pointer group">
                                    <input
                                        type="radio"
                                        {...register('color')}
                                        value={color}
                                        className="sr-only peer"
                                    />
                                    <div
                                        className="h-10 w-10 rounded-full border-4 border-white shadow-sm ring-1 ring-gray-100 peer-checked:ring-offset-2 peer-checked:ring-2 peer-checked:ring-coffee-dark transition-all scale-100 peer-checked:scale-110 group-hover:scale-105"
                                        style={{ backgroundColor: color }}
                                    />
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end gap-4 pt-4">
                        <button type="button" onClick={onClose} className="px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest text-gray-400">Batal</button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex items-center gap-3 px-10 py-4 bg-coffee-dark text-white rounded-full font-black text-xs uppercase tracking-widest hover:bg-[#2d1e18] transition-all shadow-xl shadow-coffee-dark/10"
                        >
                            {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle2 size={18} />}
                            {isSubmitting ? 'Menyimpan...' : 'Simpan Kategori'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
