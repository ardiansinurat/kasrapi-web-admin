"use client";

import useSWR, { mutate } from 'swr';
import { fetcher } from '@/lib/swr-fetcher';
import { Clock, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { clsx } from 'clsx';
import { useState } from 'react';
import { toast } from 'sonner';
import apiClient from '@/lib/api';

// Type definition matches backend response structure
interface OrderItem {
    id: string;
    quantity: number;
    productName: string;
    note?: string;
    modifiers?: any;
}

interface Order {
    id: string;
    orderNumber: string;
    tableNumber: string; // Via relation or formatted
    status: string;
    createdAt: string;
    items: OrderItem[];
    note?: string; // Order level note
    customerName?: string; // If available
}

const ORDERS_API = '/admin/orders?status=PAID';

export default function KitchenDisplayPage() {
    // Poll every 5 seconds, but optimize for background/offline
    const { data: orders, error, isLoading } = useSWR<Order[]>(
        ORDERS_API,
        fetcher,
        {
            refreshInterval: 5000,
            refreshWhenHidden: false,
            refreshWhenOffline: false
        }
    );

    if (error) return <div className="p-4 text-red-500">Failed to load orders.</div>;
    if (isLoading) return <div className="p-4 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div></div>;

    // Filter is redundant if API filters, but good as backup
    const paidOrders = orders?.filter(o => o.status === 'PAID') || [];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <Clock className="h-6 w-6 text-indigo-600" />
                    Kitchen Display System
                </h1>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    Live: {paidOrders.length} Orders
                </span>
            </div>

            {paidOrders.length === 0 ? (
                <div className="text-center py-20 text-gray-500">
                    <CheckCircle2 className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                    <p className="text-xl">All orders caught up!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {paidOrders.map((order) => (
                        <OrderCard key={order.id} order={order} />
                    ))}
                </div>
            )}
        </div>
    );
}

function OrderCard({ order }: { order: Order }) {
    const elapsedMinutes = Math.floor((new Date().getTime() - new Date(order.createdAt).getTime()) / 60000);
    const isLate = elapsedMinutes > 15; // Highlight if older than 15 mins
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleMarkServed = async () => {
        if (isSubmitting) return;

        setIsSubmitting(true);
        try {
            // Optimistic update could be done here, but since it's critical logic, 
            // we wait for server confirmation.
            await apiClient.patch(`/admin/orders/${order.id}/status`, {
                status: 'SERVED'
            });

            toast.success(`Order #${order.orderNumber} served!`);

            // Re-fetch list immediately to remove the card
            mutate(ORDERS_API);

        } catch (error: any) {
            console.error('Failed to update status:', error);
            toast.error(error.response?.data?.error || 'Failed to mark as served');
            setIsSubmitting(false); // Only enable if failed
        }
    };

    return (
        <div className={clsx(
            "bg-white rounded-lg shadow-sm border overflow-hidden flex flex-col",
            isLate ? "border-red-300 ring-1 ring-red-300" : "border-gray-200"
        )}>
            {/* Header */}
            <div className={clsx(
                "px-4 py-3 flex justify-between items-center border-b",
                isLate ? "bg-red-50" : "bg-gray-50"
            )}>
                <div>
                    <span className="text-xs text-gray-500 font-mono">#{order.orderNumber}</span>
                    <h3 className="text-xl font-bold text-gray-900">Table {order.tableNumber}</h3>
                </div>
                <div className="text-right">
                    <span className={clsx(
                        "text-sm font-bold block",
                        isLate ? "text-red-600" : "text-gray-600"
                    )}>
                        {elapsedMinutes}m
                    </span>
                    <span className="text-xs text-gray-400">
                        {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                </div>
            </div>

            {/* Body */}
            <div className="p-4 flex-1 overflow-y-auto max-h-[300px]">
                {order.note && (
                    <div className="mb-3 p-2 bg-yellow-50 text-yellow-800 text-sm rounded border border-yellow-200 flex gap-2">
                        <AlertCircle size={16} className="shrink-0 mt-0.5" />
                        <span className="font-semibold">{order.note}</span>
                    </div>
                )}

                <ul className="space-y-3">
                    {order.items.map((item) => (
                        <li key={item.id} className="text-sm">
                            <div className="flex gap-2">
                                <span className="font-bold text-indigo-600 w-6 text-right shrink-0">
                                    {item.quantity}x
                                </span>
                                <span className="text-gray-900 font-medium">
                                    {item.productName}
                                </span>
                            </div>
                            {item.note && (
                                <p className="text-gray-500 text-xs ml-8 italic">
                                    Note: {item.note}
                                </p>
                            )}
                            {/* Render modifiers if needed */}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Footer / Actions */}
            <div className="p-3 bg-gray-50 border-t">
                <button
                    onClick={handleMarkServed}
                    disabled={isSubmitting}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold py-2 px-4 rounded transition-colors text-sm flex items-center justify-center gap-2"
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Serving...
                        </>
                    ) : (
                        'Mark Ready'
                    )}
                </button>
            </div>
        </div>
    );
}
