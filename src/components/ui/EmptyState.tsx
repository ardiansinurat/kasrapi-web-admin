"use client";

import React from 'react';
import { LucideIcon, HelpCircle } from 'lucide-react';
import { clsx } from 'clsx';

interface EmptyStateProps {
    icon?: LucideIcon;
    title: string;
    description: string;
    action?: React.ReactNode;
    className?: string;
}

export default function EmptyState({
    icon: Icon = HelpCircle,
    title,
    description,
    action,
    className
}: EmptyStateProps) {
    return (
        <div className={clsx(
            "flex flex-col items-center justify-center p-12 text-center animate-in fade-in zoom-in-95 duration-500",
            className
        )}>
            <div className="w-24 h-24 bg-brand-bg rounded-[2.5rem] flex items-center justify-center text-coffee-dark/20 mb-8 border border-gray-50 group-hover:scale-110 transition-transform duration-700">
                <Icon size={48} strokeWidth={1} />
            </div>

            <h3 className="text-xl font-black text-coffee-dark tracking-tight mb-3">
                {title}
            </h3>
            <p className="text-sm font-medium text-gray-400 max-w-xs mx-auto leading-relaxed mb-8">
                {description}
            </p>

            {action && (
                <div className="animate-in slide-in-from-bottom-2 duration-700 delay-200">
                    {action}
                </div>
            )}
        </div>
    );
}
