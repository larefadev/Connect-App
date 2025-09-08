'use client';
import React from 'react';
import { Plus } from 'lucide-react';
import { Product } from '@/types/ecomerce';
import ItemRow from './ItemRow';

type ItemsSectionProps = {
  items: Array<{
    productSku: string;
    quantity: number;
    unitPrice: number;
    itemDiscount: number;
    itemNotes: string;
  }>;
  products: Product[];
  onItemChange: (index: number, field: string, value: string | number) => void;
  onAddItem: () => void;
  onRemoveItem: (index: number) => void;
};

const ItemsSection: React.FC<ItemsSectionProps> = ({
  items,
  products,
  onItemChange,
  onAddItem,
  onRemoveItem
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
        {items.map((item, index) => (
          <ItemRow
            key={`item-row-${index}`}
            item={item}
            index={index}
            products={products}
            onItemChange={onItemChange}
            onRemoveItem={onRemoveItem}
          />
        ))}

        {/* Add Product Button */}
        <button
          onClick={onAddItem}
          className="w-full p-3 border border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-red-500 hover:text-red-500 transition-colors flex items-center justify-center gap-2"
        >
          <Plus size={16} />
          Agregar Producto
        </button>
      </div>
    </div>
  );
};

export default ItemsSection;
