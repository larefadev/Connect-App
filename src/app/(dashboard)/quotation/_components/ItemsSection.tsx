'use client';
import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Product } from '@/types/ecomerce';
import ItemRow from './ItemRow';

type ItemsSectionProps = {
  items: Array<{
    productSku: string;
    productName?: string;
    quantity: number;
    unitPrice: number;
    itemDiscount: number;
    itemNotes: string;
  }>;
  products: Product[];
  onItemChange: (index: number, field: string, value: string | number) => void;
  onRemoveItem: (index: number) => void;
  onOpenAddProductModal: () => void;
};

const ItemsSection: React.FC<ItemsSectionProps> = ({
  items,
  products,
  onItemChange,
  onRemoveItem,
  onOpenAddProductModal
}) => {
  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Artículos</h3>
      <div className="space-y-3">
        {/* Header */}
        <div className="grid grid-cols-12 gap-2 text-sm font-medium text-gray-600">
          <div className="col-span-4">Producto</div>
          <div className="col-span-2 text-center">Cantidad</div>
          <div className="col-span-2 text-right">Precio Unit.</div>
          <div className="col-span-2 text-right">Descuento</div>
          <div className="col-span-1 text-right">Subtotal</div>
          <div className="col-span-1"></div>
        </div>

        {/* Items */}
        {items.length > 0 ? (
          items.map((item, index) => (
            <ItemRow
              key={`item-row-${index}`}
              item={item}
              index={index}
              products={products}
              onItemChange={onItemChange}
              onRemoveItem={onRemoveItem}
            />
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No hay productos en la cotización</p>
            <p className="text-sm">Usa el botón "Agregar Productos" para comenzar</p>
          </div>
        )}

        {/* Add Product Button */}
        <div className="flex justify-center">
          <Button
            onClick={onOpenAddProductModal}
            variant="outline"
            className="w-full p-3 border border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-red-500 hover:text-red-500 transition-colors flex items-center justify-center gap-2"
          >
            <Plus size={16} />
            Agregar Productos
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ItemsSection;
