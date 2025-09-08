"use client";

import { ShoppingCart, History } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CartTabsProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
    ordersCount: number;
}

export const CartTabs = ({ activeTab, onTabChange, ordersCount }: CartTabsProps) => {
    const tabs = [
        {
            id: 'cart',
            label: 'Carrito',
            icon: ShoppingCart,
            count: null
        },
        {
            id: 'history',
            label: 'Historial',
            icon: History,
            count: ordersCount
        }
    ];

    return (
        <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    
                    return (
                        <Button
                            key={tab.id}
                            variant="ghost"
                            onClick={() => onTabChange(tab.id)}
                            className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm ${
                                isActive
                                    ? 'border-red-500 text-red-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            <Icon className="w-4 h-4" />
                            {tab.label}
                            {tab.count !== null && (
                                <span className={`ml-2 py-0.5 px-2 rounded-full text-xs ${
                                    isActive
                                        ? 'bg-red-100 text-red-600'
                                        : 'bg-gray-100 text-gray-600'
                                }`}>
                                    {tab.count}
                                </span>
                            )}
                        </Button>
                    );
                })}
            </nav>
        </div>
    );
};
