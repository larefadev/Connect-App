"use client";

import { useState, useCallback } from 'react';
import { X, ArrowLeft, ArrowRight, CheckCircle, MapPin, CreditCard, User, Phone, Mail, Package, Truck, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { CartItem } from '@/types/b2b-order';
import { ProductImage } from '@/components/ui/product-image';

interface B2BCheckoutModalProps {
    isOpen: boolean;
    onClose: () => void;
    cart: CartItem[];
    onSubmitOrder: (orderData: any) => Promise<void>;
    onUpdateQuantity: (productSku: string, quantity: number) => void;
    onRemoveItem: (productSku: string) => void;
    onClearCart: () => void;
    isSubmitting: boolean;
}

export const B2BCheckoutModal = ({
    isOpen,
    onClose,
    cart,
    onSubmitOrder,
    onUpdateQuantity,
    onRemoveItem,
    onClearCart,
    isSubmitting
}: B2BCheckoutModalProps) => {
    const [step, setStep] = useState<'delivery-info' | 'payment-info' | 'confirmation'>('delivery-info');
    const [formData, setFormData] = useState({
        // Información de entrega
        delivery_address: '',
        delivery_city: '',
        delivery_state: '',
        delivery_postal_code: '',
        delivery_contact_name: '',
        delivery_contact_phone: '',
        delivery_notes: '',
        
        // Información de pago B2B
        payment_method: '',
        payment_terms: 'immediate',
        priority_level: 1 as 1 | 2 | 3,
        
        // Notas adicionales
        internal_notes: '',
        store_notes: ''
    });

    const handleInputChange = useCallback((field: string, value: string | number) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    }, []);

    // Generar número de orden de compra automáticamente
    const generatePurchaseOrderNumber = useCallback(() => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        
        // Formato: PO-YYYYMMDD-HHMMSS
        return `PO-${year}${month}${day}-${hours}${minutes}${seconds}`;
    }, []);

    const handleNextStep = useCallback(() => {
        if (step === 'delivery-info') {
            if (!formData.delivery_address || !formData.delivery_city) {
                alert('Por favor completa la información de entrega requerida');
                return;
            }
            setStep('payment-info');
        } else if (step === 'payment-info') {
            if (!formData.payment_method) {
                alert('Por favor selecciona un método de pago');
                return;
            }
            setStep('confirmation');
        }
    }, [step, formData]);

    const handlePreviousStep = useCallback(() => {
        if (step === 'payment-info') {
            setStep('delivery-info');
        } else if (step === 'confirmation') {
            setStep('payment-info');
        }
    }, [step]);

    const handleSubmitOrder = useCallback(async () => {
        if (cart.length === 0) {
            alert('El carrito está vacío');
            return;
        }

        const orderData = {
            // Mapear campos del formulario a la estructura esperada
            delivery_address: formData.delivery_address,
            delivery_city: formData.delivery_city,
            delivery_state: formData.delivery_state,
            delivery_postal_code: formData.delivery_postal_code,
            delivery_contact_name: formData.delivery_contact_name,
            delivery_contact_phone: formData.delivery_contact_phone,
            delivery_notes: formData.delivery_notes,
            payment_method: formData.payment_method,
            payment_terms: formData.payment_terms,
            purchase_order_number: generatePurchaseOrderNumber(),
            priority_level: formData.priority_level,
            internal_notes: formData.internal_notes,
            store_notes: formData.store_notes,
            items: cart.map(item => ({
                product_sku: item.product_sku,
                product_name: item.product_name,
                product_description: item.product_description,
                product_image: item.product_image,
                product_brand: item.product_brand,
                unit_price: item.unit_price,
                retail_price: item.retail_price,
                quantity: item.quantity,
                total_price: item.total_price,
                discount_percentage: item.discount_percentage,
                discount_amount: item.discount_amount,
                tax_rate: item.tax_rate,
                tax_amount: item.tax_amount,
                item_notes: item.item_notes
            }))
        };

        try {
            await onSubmitOrder(orderData);
            // Si el pedido se envía exitosamente, avanzar a confirmación
            setStep('confirmation');
        } catch (error) {
            // Si hay error, mantener en el paso actual
            console.error('Error al enviar el pedido:', error);
        }
    }, [cart, formData, onSubmitOrder]);

    // Limpiar formulario
    const clearForm = useCallback(() => {
        setFormData({
            // Información de entrega
            delivery_address: '',
            delivery_city: '',
            delivery_state: '',
            delivery_postal_code: '',
            delivery_contact_name: '',
            delivery_contact_phone: '',
            delivery_notes: '',
            
            // Información de pago B2B
            payment_method: '',
            payment_terms: 'immediate',
            priority_level: 1 as 1 | 2 | 3,
            
            // Notas adicionales
            internal_notes: '',
            store_notes: ''
        });
        setStep('delivery-info');
    }, []);

    const handleClose = useCallback(() => {
        if (step === 'confirmation') {
            onClose();
            clearForm();
            onClearCart(); // Limpiar el carrito también
        } else {
            onClose();
        }
    }, [step, onClose, clearForm, onClearCart]);

    // Calcular totales del carrito
    const cartTotals = useCallback(() => {
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

    const totals = cartTotals();

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <Building2 className="w-6 h-6 text-red-600" />
                        <div>
                            <h3 className="text-lg font-semibold">Checkout B2B</h3>
                            <p className="text-sm text-gray-600">Información de entrega y pago</p>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleClose}
                        className="p-1"
                    >
                        <X className="w-5 h-5" />
                    </Button>
                </div>

                {/* Progress Steps */}
                <div className="flex items-center justify-between px-4 py-3 border-b bg-gray-50 flex-shrink-0">
                    {['delivery-info', 'payment-info'].map((stepName, index) => (
                        <div key={stepName} className="flex items-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                                step === stepName 
                                    ? 'bg-red-600 text-white' 
                                    : step === 'confirmation' || ['delivery-info', 'payment-info'].indexOf(step) > index
                                    ? 'bg-green-500 text-white'
                                    : 'bg-gray-200 text-gray-600'
                            }`}>
                                {index + 1}
                            </div>
                            {index < 1 && (
                                <div className={`w-16 h-1 mx-2 ${
                                    ['delivery-info', 'payment-info'].indexOf(step) > index
                                        ? 'bg-green-500'
                                        : 'bg-gray-200'
                                }`} />
                            )}
                        </div>
                    ))}
                </div>

                {/* Contenido con scroll mejorado */}
                <div 
                    className="flex-1 overflow-y-auto p-4 custom-scrollbar" 
                    style={{
                        scrollbarWidth: 'thin',
                        scrollbarColor: '#cbd5e1 #f1f5f9'
                    }}
                >
                    {step === 'delivery-info' && (
                        <div className="space-y-6">
                            <div>
                                <h4 className="text-lg font-medium mb-4">Información de Entrega</h4>
                                
                                <div className="space-y-4">
                                    <div>
                                        <Label htmlFor="delivery_address">Dirección de Entrega *</Label>
                                        <Textarea
                                            id="delivery_address"
                                            value={formData.delivery_address}
                                            onChange={(e) => handleInputChange('delivery_address', e.target.value)}
                                            placeholder="Dirección completa"
                                            rows={3}
                                            required
                                        />
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <Label htmlFor="delivery_city">Ciudad *</Label>
                                            <Input
                                                id="delivery_city"
                                                value={formData.delivery_city}
                                                onChange={(e) => handleInputChange('delivery_city', e.target.value)}
                                                placeholder="Quito"
                                                required
                                            />
                                        </div>
                                        
                                        <div>
                                            <Label htmlFor="delivery_state">Provincia/Estado</Label>
                                            <Input
                                                id="delivery_state"
                                                value={formData.delivery_state}
                                                onChange={(e) => handleInputChange('delivery_state', e.target.value)}
                                                placeholder="Pichincha"
                                            />
                                        </div>
                                        
                                        <div>
                                            <Label htmlFor="delivery_postal_code">Código Postal</Label>
                                            <Input
                                                id="delivery_postal_code"
                                                value={formData.delivery_postal_code}
                                                onChange={(e) => handleInputChange('delivery_postal_code', e.target.value)}
                                                placeholder="170101"
                                            />
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="delivery_contact_name">Contacto de Entrega</Label>
                                            <Input
                                                id="delivery_contact_name"
                                                value={formData.delivery_contact_name}
                                                onChange={(e) => handleInputChange('delivery_contact_name', e.target.value)}
                                                placeholder="Nombre del contacto"
                                            />
                                        </div>
                                        
                                        <div>
                                            <Label htmlFor="delivery_contact_phone">Teléfono de Contacto</Label>
                                            <Input
                                                id="delivery_contact_phone"
                                                value={formData.delivery_contact_phone}
                                                onChange={(e) => handleInputChange('delivery_contact_phone', e.target.value)}
                                                placeholder="+593 99 123 4567"
                                            />
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <Label htmlFor="delivery_notes">Notas de Entrega</Label>
                                        <Textarea
                                            id="delivery_notes"
                                            value={formData.delivery_notes}
                                            onChange={(e) => handleInputChange('delivery_notes', e.target.value)}
                                            placeholder="Instrucciones especiales para la entrega"
                                            rows={2}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 'payment-info' && (
                        <div className="space-y-6">
                            <div>
                                <h4 className="text-lg font-medium mb-4">Resumen del Pedido</h4>
                                
                                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                                    <div className="flex justify-between items-center pb-2 border-b">
                                        <span className="text-sm font-medium text-gray-600">Número de Orden:</span>
                                        <span className="text-sm font-mono font-semibold text-red-600">
                                            {generatePurchaseOrderNumber()}
                                        </span>
                                    </div>
                                    {cart.map((item) => (
                                        <div key={item.product_sku} className="flex justify-between items-center">
                                            <div className="flex items-center space-x-3">
                                                <span className="text-sm text-gray-600">{item.quantity}x</span>
                                                <span className="text-sm font-medium">{item.product_name}</span>
                                            </div>
                                            <span className="text-sm font-medium">${item.total_price.toFixed(2)}</span>
                                        </div>
                                    ))}
                                    
                                    <div className="border-t pt-3 space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span>Subtotal:</span>
                                            <span>${totals.subtotal.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span>IVA (16%):</span>
                                            <span>${totals.taxAmount.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span>Envío:</span>
                                            <span>{totals.shippingCost === 0 ? 'Gratis' : `$${totals.shippingCost.toFixed(2)}`}</span>
                                        </div>
                                        <div className="border-t pt-2">
                                            <div className="flex justify-between font-semibold text-lg">
                                                <span>Total:</span>
                                                <span>${totals.total.toFixed(2)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h4 className="text-lg font-medium mb-4">Método de Pago B2B</h4>
                                
                                <div className="space-y-4">
                                    <div>
                                        <Label htmlFor="payment_method">Método de Pago *</Label>
                                        <Select
                                            value={formData.payment_method}
                                            onValueChange={(value) => handleInputChange('payment_method', value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecciona un método de pago" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="transfer">Transferencia Bancaria</SelectItem>
                                                <SelectItem value="check">Cheque</SelectItem>
                                                <SelectItem value="credit">Crédito</SelectItem>
                                                <SelectItem value="cash">Efectivo</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="payment_terms">Términos de Pago</Label>
                                            <Select
                                                value={formData.payment_terms}
                                                onValueChange={(value) => handleInputChange('payment_terms', value)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Seleccionar términos" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="immediate">Inmediato</SelectItem>
                                                    <SelectItem value="net15">Net 15</SelectItem>
                                                    <SelectItem value="net30">Net 30</SelectItem>
                                                    <SelectItem value="net60">Net 60</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        
                                        <div>
                                            <Label htmlFor="priority_level">Prioridad</Label>
                                            <Select
                                                value={formData.priority_level.toString()}
                                                onValueChange={(value) => handleInputChange('priority_level', parseInt(value))}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Seleccionar prioridad" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="1">Normal</SelectItem>
                                                    <SelectItem value="2">Alta</SelectItem>
                                                    <SelectItem value="3">Urgente</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <Label htmlFor="purchase_order_number">Número de Orden de Compra (PO)</Label>
                                        <div className="flex items-center space-x-2">
                                            <Input
                                                id="purchase_order_number"
                                                value={generatePurchaseOrderNumber()}
                                                readOnly
                                                className="bg-gray-50 text-gray-700 font-mono"
                                            />
                                            <span className="text-xs text-gray-500">Generado automáticamente</span>
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="internal_notes">Notas Internas</Label>
                                            <Textarea
                                                id="internal_notes"
                                                value={formData.internal_notes}
                                                onChange={(e) => handleInputChange('internal_notes', e.target.value)}
                                                placeholder="Notas internas para el procesamiento..."
                                                rows={2}
                                            />
                                        </div>
                                        
                                        <div>
                                            <Label htmlFor="store_notes">Notas de la Tienda</Label>
                                            <Textarea
                                                id="store_notes"
                                                value={formData.store_notes}
                                                onChange={(e) => handleInputChange('store_notes', e.target.value)}
                                                placeholder="Notas adicionales del pedido..."
                                                rows={2}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 'confirmation' && (
                        <div className="text-center py-8">
                            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                            <h4 className="text-xl font-semibold text-gray-900 mb-2">¡Pedido B2B Confirmado!</h4>
                            <p className="text-gray-600 mb-4">
                                Tu pedido ha sido procesado exitosamente. Recibirás un email de confirmación con los detalles.
                            </p>
                            <p className="text-sm text-gray-500 mb-4">
                                Te contactaremos pronto para coordinar la entrega.
                            </p>
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                <p className="text-sm text-blue-800">
                                    <strong>Número de Orden:</strong> {generatePurchaseOrderNumber()}
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer fijo */}
                <div className="border-t p-4 flex-shrink-0 bg-white">
                    <div className="flex justify-between items-center">
                        {step === 'delivery-info' && (
                            <Button onClick={handleNextStep} className="w-full">
                                Continuar al Pago
                            </Button>
                        )}
                        
                        {step === 'payment-info' && (
                            <div className="flex space-x-3 w-full">
                                <Button variant="outline" onClick={handlePreviousStep} className="flex-1">
                                    Atrás
                                </Button>
                                <Button 
                                    onClick={handleSubmitOrder} 
                                    disabled={isSubmitting || !formData.payment_method}
                                    className="flex-1"
                                >
                                    {isSubmitting ? 'Procesando...' : 'Confirmar Pedido'}
                                </Button>
                            </div>
                        )}
                        
                        {step === 'confirmation' && (
                            <Button onClick={handleClose} className="w-full bg-green-600 hover:bg-green-700">
                                Finalizar y Cerrar
                            </Button>
                        )}
                    </div>
                </div>
            </div>
            
            {/* Estilos CSS para el scrollbar personalizado */}
            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: #f1f5f9;
                    border-radius: 3px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #cbd5e1;
                    border-radius: 3px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #94a3b8;
                }
            `}</style>
        </div>
    );
};
