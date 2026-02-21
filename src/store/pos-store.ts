import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
    productId: string;
    name: string;
    price: number;
    qty: number;
    stock: number;
    image?: string;
}

interface POSState {
    cart: CartItem[];
    searchTerm: string;
    selectedCategoryId: string | null;
    selectedTableId: string | null; // null means Takeaway

    // Actions
    addToCart: (product: any) => void;
    removeFromCart: (productId: string) => void;
    updateQty: (productId: string, delta: number) => void;
    setSearchTerm: (term: string) => void;
    setSelectedCategory: (categoryId: string | null) => void;
    setSelectedTable: (tableId: string | null) => void;
    clearCart: () => void;
}

export const usePOSStore = create<POSState>()(
    persist(
        (set) => ({
            cart: [],
            searchTerm: '',
            selectedCategoryId: null,
            selectedTableId: null,

            addToCart: (product) => set((state) => {
                const existing = state.cart.find(item => item.productId === product.id);
                const stock = product.inventory?.[0]?.quantity ?? 0;

                if (existing) {
                    if (existing.qty >= stock) return state; // Stock limit
                    return {
                        cart: state.cart.map(item =>
                            item.productId === product.id
                                ? { ...item, qty: item.qty + 1 }
                                : item
                        )
                    };
                }

                if (stock <= 0) return state; // Out of stock

                return {
                    cart: [...state.cart, {
                        productId: product.id,
                        name: product.name,
                        price: product.defaultPrice,
                        qty: 1,
                        stock: stock,
                        image: product.image
                    }]
                };
            }),

            removeFromCart: (productId) => set((state) => ({
                cart: state.cart.filter(item => item.productId !== productId)
            })),

            updateQty: (productId, delta) => set((state) => ({
                cart: state.cart.map(item => {
                    if (item.productId === productId) {
                        const newQty = Math.max(1, Math.min(item.qty + delta, item.stock));
                        return { ...item, qty: newQty };
                    }
                    return item;
                })
            })),

            setSearchTerm: (searchTerm) => set({ searchTerm }),
            setSelectedCategory: (selectedCategoryId) => set({ selectedCategoryId }),
            setSelectedTable: (selectedTableId) => set({ selectedTableId }),
            clearCart: () => set({ cart: [], selectedTableId: null }),
        }),
        {
            name: 'kasrapi-pos-cart',
            partialize: (state) => ({
                cart: state.cart,
                selectedTableId: state.selectedTableId
            }),
        }
    )
);
