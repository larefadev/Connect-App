"use client";

import { ShoppingBag, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CartHeaderProps {
    onAddProducts: () => void;
}

export const CartHeader = ({ onAddProducts }: CartHeaderProps) => {
    return (
        <div className="bg-white border-b border-gray-200">
            <div className="px-4 lg:px-6 py-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <ShoppingBag className="w-6 h-6 sm:w-8 sm:h-8 text-red-600" />
                        <div>
                            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Pedidos B2B</h1>
                            <p className="text-sm sm:text-base text-gray-600">Gestiona tus pedidos a la plataforma</p>
                        </div>
                    </div>
                    <Button
                        onClick={onAddProducts}
                        className="bg-red-600 hover:bg-red-700 w-full sm:w-auto"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Agregar Productos
                    </Button>
                </div>
            </div>
        </div>
    );
};
