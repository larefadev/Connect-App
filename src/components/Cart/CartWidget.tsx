"use client";

import { useEffect, useState } from 'react';
import { ShoppingCart, X, Plus, Minus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCartStore } from '@/stores/cartStore';
import { CartItem } from '@/stores/cartStore';
import { ProductImage } from '@/components/ui/product-image';
import { CheckoutModal } from './CheckoutModal';

interface CartWidgetProps {
  storeId: number;
}

export const CartWidget = ({ storeId }: CartWidgetProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const {
    items,
    getTotalItems,
    getSubtotal,
    getTaxAmount,
    getShippingCost,
    getTotalAmount,
    updateQuantity,
    removeItem,
    clearCart,
    setStoreId,
  } = useCartStore();

  // Establecer el ID de la tienda cuando se monte el componente
  useEffect(() => {
    setStoreId(storeId);
  }, [storeId, setStoreId]);

  const handleQuantityChange = (sku: string, newQuantity: number, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    updateQuantity(sku, newQuantity);
  };

  const handleRemoveItem = (sku: string, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    removeItem(sku);
  };

  const handleClearCart = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    clearCart();
  };

  const totalItems = getTotalItems();

  return (
    <>
      {/* Botón del carrito */}
      <div className="relative">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsOpen(true)}
          className="relative p-2"
        >
          <ShoppingCart className="w-5 h-5" />
          {totalItems > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
              {totalItems}
            </Badge>
          )}
        </Button>
      </div>

      {/* Modal del carrito */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[80vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">Carrito de Compras</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="p-1"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Contenido del carrito */}
            <div className="flex-1 overflow-y-auto p-4">
              {items.length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Tu carrito está vacío</p>
                  <p className="text-sm text-gray-400">Agrega productos para comenzar</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Lista de items */}
                  {items.map((item) => (
                    <div key={item.SKU} className="flex items-center space-x-3 p-3 border rounded-lg">
                      <div className="flex-shrink-0">
                        <ProductImage
                          src={item.Imagen}
                          alt={item.Nombre}
                          className="w-16 h-16 object-cover rounded-md"
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 truncate">
                          {item.Nombre}
                        </h4>
                        <p className="text-sm text-gray-500">
                          ${item.Precio.toFixed(2)} x {item.quantity}
                        </p>
                        <p className="text-sm font-semibold text-gray-900">
                          ${item.totalPrice.toFixed(2)}
                        </p>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => handleQuantityChange(item.SKU, item.quantity - 1, e)}
                          className="w-8 h-8 p-0"
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        
                        <span className="w-8 text-center text-sm font-medium">
                          {item.quantity}
                        </span>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => handleQuantityChange(item.SKU, item.quantity + 1, e)}
                          className="w-8 h-8 p-0"
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => handleRemoveItem(item.SKU, e)}
                          className="w-8 h-8 p-0 text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer con totales */}
            {items.length > 0 && (
              <div className="border-t p-4 space-y-3">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>${getSubtotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>IVA (12%):</span>
                    <span>${getTaxAmount().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Envío:</span>
                    <span>{getShippingCost() === 0 ? 'Gratis' : `$${getShippingCost().toFixed(2)}`}</span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total:</span>
                      <span>${getTotalAmount().toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    onClick={handleClearCart}
                    className="flex-1"
                  >
                    Vaciar Carrito
                  </Button>
                  <Button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setIsOpen(false);
                    }}
                    className="flex-1"
                  >
                    Continuar Comprando
                  </Button>
                </div>
                
                {/* Botón de Checkout */}
                <Button
                  onClick={() => {
                    setIsOpen(false);
                    setIsCheckoutOpen(true);
                  }}
                  className="w-full mt-2"
                >
                  Proceder al Checkout
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal de Checkout */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        storeId={storeId}
      />
    </>
  );
};
