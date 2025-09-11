'use client';
import React from 'react';
import { X } from 'lucide-react';
import { Product } from '@/types/ecomerce';

type ItemRowProps = {
  item: {
    productSku: string;
    productName?: string;
    quantity: number;
    unitPrice: number;
    itemDiscount: number;
    itemNotes: string;
  };
  index: number;
  products: Product[];
  onItemChange: (index: number, field: string, value: string | number) => void;
  onRemoveItem: (index: number) => void;
};

const ItemRow: React.FC<ItemRowProps> = ({ 
  item, 
  index, 
  products, 
  onItemChange, 
  onRemoveItem 
}) => {
  const subtotal = (item.quantity * item.unitPrice) - (item.itemDiscount || 0);
  
  // Obtener el nombre del producto desde la lista de productos o usar el nombre almacenado
  const productName = item.productName || products.find(p => p.SKU === item.productSku)?.Nombre || 'Producto no encontrado';

  return (
    <div key={`item-row-${index}`} className="grid grid-cols-12 gap-2 items-center">
      <div className="col-span-4">
        <div className="p-2 border border-gray-300 rounded bg-gray-50 min-h-[40px] flex flex-col justify-center">
          <div className="text-sm font-medium text-gray-900">
            {productName}
          </div>
          <div className="text-xs text-gray-500">
            SKU: {item.productSku}
          </div>
        </div>
        <input
          type="text"
          value={item.itemNotes}
          onChange={(e) => onItemChange(index, 'itemNotes', e.target.value)}
          className="w-full p-1 mt-1 text-xs border border-gray-200 rounded bg-gray-50 focus:outline-none focus:ring-1 focus:ring-red-500 h-auto"
          placeholder="Notas adicionales"
        />
      </div>
      <div className="col-span-2">
        <input
          type="number"
          value={item.quantity}
          onChange={(e) => onItemChange(index, 'quantity', parseInt(e.target.value) || 1)}
          className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-center focus:outline-none focus:ring-1 focus:ring-red-500 h-auto"
          min={1}
        />
      </div>
      <div className="col-span-2">
        <input
          type="number"
          value={item.unitPrice}
          onChange={(e) => onItemChange(index, 'unitPrice', parseFloat(e.target.value) || 0)}
          className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-right focus:outline-none focus:ring-1 focus:ring-red-500 h-auto"
          step="0.01"
          min={0}
          readOnly
        />
      </div>
      <div className="col-span-2">
        <input
          type="number"
          value={item.itemDiscount}
          onChange={(e) => onItemChange(index, 'itemDiscount', parseFloat(e.target.value) || 0)}
          className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-right focus:outline-none focus:ring-1 focus:ring-red-500 h-auto"
          min={0}
        />
      </div>
      <div className="col-span-1 text-right text-sm font-medium">
        ${subtotal.toFixed(2)}
      </div>
      <div className="col-span-1">
        <button 
          onClick={() => onRemoveItem(index)} 
          className="text-red-500 hover:text-red-700 p-1"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

export default ItemRow;
