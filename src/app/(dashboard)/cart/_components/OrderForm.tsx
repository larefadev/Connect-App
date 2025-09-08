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
                        <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Carrito Vacío</h3>
                        <p className="text-gray-500">Agrega productos al carrito para crear un pedido</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <ShoppingCart className="w-5 h-5" />
                        Carrito ({cart.length} productos)
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {cart.map((item) => (
                        <div key={item.product_sku} className="flex items-center space-x-4 p-4 border rounded-lg">
                            <ProductImage
                                src={item.product_image}
                                alt={item.product_name}
                                className="w-16 h-16 object-cover rounded-lg"
                            />
                            <div className="flex-1">
                                <h3 className="font-medium">{item.product_name}</h3>
                                <p className="text-sm text-gray-600">SKU: {item.product_sku}</p>
                                {item.product_brand && (
                                    <p className="text-sm text-gray-600">Marca: {item.product_brand}</p>
                                )}
                                <p className="text-sm text-gray-600">
                                    ${item.unit_price.toFixed(2)} c/u
                                </p>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => onUpdateQuantity(item.product_sku, item.quantity - 1)}
                                >
                                    -
                                </Button>
                                <span className="w-8 text-center">{item.quantity}</span>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => onUpdateQuantity(item.product_sku, item.quantity + 1)}
                                >
                                    +
                                </Button>
                            </div>
                            <div className="text-right">
                                <p className="font-semibold">${item.total_price.toFixed(2)}</p>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onRemoveItem(item.product_sku)}
                                className="text-red-600 hover:text-red-700"
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                    ))}
                    
                    <div className="flex justify-between items-center pt-4 border-t">
                        <Button
                            variant="outline"
                            onClick={onClearCart}
                            className="text-red-600 hover:text-red-700"
                        >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Limpiar Carrito
                        </Button>
                        
                        <div className="text-right">
                            <div className="text-sm text-gray-600">
                                Total: <span className="font-bold text-lg">${cartTotals.total.toFixed(2)} MXN</span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-center">
                <Button
                    onClick={onOpenCheckout}
                    className="bg-red-600 hover:bg-red-700 px-8 py-3 text-lg"
                >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Proceder al Checkout
                </Button>
            </div>
        </div>
    );
};
