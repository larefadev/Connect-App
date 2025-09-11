"use client";

import { useCallback, useMemo } from 'react';
import { Trash2, Package, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CartItem } from '@/types/b2b-order';
import { ProductImage } from '@/components/ui/product-image';

interface OrderFormProps {
    cart: CartItem[];
    onUpdateQuantity: (productSku: string, quantity: number) => void;
    onRemoveItem: (productSku: string) => void;
    onClearCart: () => void;
    onOpenCheckout: () => void;
}

export const OrderForm = ({
    cart,
    onUpdateQuantity,
    onRemoveItem,
    onClearCart,
    onOpenCheckout
}: OrderFormProps) => {

    const cartTotals = useMemo(() => {
        const subtotal = cart.reduce((sum, item) => sum + item.total_price, 0);
        const taxAmount = cart.reduce((sum, item) => sum + (item.tax_amount || 0), 0);
        const discountAmount = cart.reduce((sum, item) => sum + (item.discount_amount || 0), 0);
        const shippingCost = 0; // Por defecto
        const total = subtotal + taxAmount + shippingCost - discountAmount;

        return {
            subtotal,
            taxAmount,
            discountAmount,
            shippingCost,
            total
        };
    }, [cart]);


    if (cart.length === 0) {
        return (
            <Card>
                <CardContent className="pt-6">
                    <div className="text-center">
                        <Package className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">Carrito Vacío</h3>
                        <p className="text-sm sm:text-base text-gray-500">Agrega productos al carrito para crear un pedido</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-4 lg:space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base lg:text-lg">
                        <ShoppingCart className="w-4 h-4 lg:w-5 lg:h-5" />
                        Carrito ({cart.length} productos)
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 lg:space-y-4">
                    {cart.map((item) => (
                        <div key={item.product_sku} className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 p-3 lg:p-4 border rounded-lg">
                            <div className="flex items-center space-x-3 sm:space-x-4">
                                <ProductImage
                                    src={item.product_image}
                                    alt={item.product_name}
                                    className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-lg flex-shrink-0"
                                />
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-medium text-sm sm:text-base truncate">{item.product_name}</h3>
                                    <p className="text-xs sm:text-sm text-gray-600">SKU: {item.product_sku}</p>
                                    {item.product_brand && (
                                        <p className="text-xs sm:text-sm text-gray-600">Marca: {item.product_brand}</p>
                                    )}
                                    <p className="text-xs sm:text-sm text-gray-600">
                                        ${item.unit_price.toFixed(2)} c/u
                                    </p>
                                </div>
                            </div>
                            
                            <div className="flex items-center justify-between sm:justify-end space-x-4">
                                <div className="flex items-center space-x-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => onUpdateQuantity(item.product_sku, item.quantity - 1)}
                                        className="w-8 h-8 p-0"
                                    >
                                        -
                                    </Button>
                                    <span className="w-8 text-center text-sm">{item.quantity}</span>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => onUpdateQuantity(item.product_sku, item.quantity + 1)}
                                        className="w-8 h-8 p-0"
                                    >
                                        +
                                    </Button>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold text-sm sm:text-base">${item.total_price.toFixed(2)}</p>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => onRemoveItem(item.product_sku)}
                                    className="text-red-600 hover:text-red-700 p-2"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    ))}
                    
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 pt-4 border-t">
                        <Button
                            variant="outline"
                            onClick={onClearCart}
                            className="text-red-600 hover:text-red-700 w-full sm:w-auto"
                        >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Limpiar Carrito
                        </Button>
                        
                        <div className="text-center sm:text-right">
                            <div className="text-sm sm:text-base text-gray-600">
                                Total: <span className="font-bold text-lg">${cartTotals.total.toFixed(2)} MXN</span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-center">
                <Button
                    onClick={onOpenCheckout}
                    className="bg-red-600 hover:bg-red-700 px-6 lg:px-8 py-3 text-base lg:text-lg w-full sm:w-auto"
                >
                    <ShoppingCart className="w-4 h-4 lg:w-5 lg:h-5 mr-2" />
                    Proceder al Checkout
                </Button>
            </div>
        </div>
    );
};
