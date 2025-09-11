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
            <nav className="-mb-px flex space-x-1 sm:space-x-4 lg:space-x-8 px-4 lg:px-6 overflow-x-auto">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    
                    return (
                        <Button
                            key={tab.id}
                            variant="ghost"
                            onClick={() => onTabChange(tab.id)}
                            className={`flex items-center gap-1 sm:gap-2 py-3 sm:py-4 px-2 sm:px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap transition-colors min-w-0 ${
                                isActive
                                    ? 'border-red-500 text-red-600 bg-red-50'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                            }`}
                        >
                            <Icon className="w-4 h-4 flex-shrink-0" />
                            <span className="truncate">{tab.label}</span>
                            {tab.count !== null && (
                                <span className={`ml-1 sm:ml-2 py-0.5 px-1.5 sm:px-2 rounded-full text-xs font-medium flex-shrink-0 ${
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
