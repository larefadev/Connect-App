"use client";

import { useState } from 'react';
import { X, CreditCard, Truck, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCartStore } from '@/stores/cartStore';
import { useOrders } from '@/hooks/Orders/useOrders';
import { useToast } from '@/hooks/useToast';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  storeId: number;
}

export const CheckoutModal = ({ isOpen, onClose, storeId }: CheckoutModalProps) => {
  const [step, setStep] = useState<'customer-info' | 'payment' | 'confirmation'>('customer-info');
  const [paymentMethod, setPaymentMethod] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const {
    items,
    customerInfo,
    updateCustomerInfo,
    getSubtotal,
    getTaxAmount,
    getShippingCost,
    getTotalAmount,
  } = useCartStore();

  const { createOrderFromCart } = useOrders(storeId);
  const { showToast } = useToast();

  const handleInputChange = (field: keyof typeof customerInfo, value: string) => {
    updateCustomerInfo({ [field]: value });
  };

  const handleNextStep = () => {
    if (step === 'customer-info') {
      // Validar información del cliente
      if (!customerInfo.name || !customerInfo.email || !customerInfo.phone) {
        showToast(
          'Por favor completa todos los campos obligatorios',
          'error',
          { title: 'Información incompleta' }
        );
        return;
      }
      setStep('payment');
    }
  };

  const handlePreviousStep = () => {
    if (step === 'payment') {
      setStep('customer-info');
    }
  };

  const handlePlaceOrder = async () => {
    if (!paymentMethod) {
      showToast(
        'Por favor selecciona un método de pago',
        'error',
        { title: 'Método de pago requerido' }
      );
      return;
    }

    
    setIsProcessing(true);
    
    try {
      const order = await createOrderFromCart(paymentMethod, customerInfo.deliveryNotes);
      showToast(
        `Pedido #${order.order_number} creado exitosamente`,
        'success',
        { title: 'Pedido confirmado' }
      );
      
      setStep('confirmation');
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : 'Error al crear el pedido',
        'error',
        { title: 'Error en el pedido' }
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    if (step === 'confirmation') {
      onClose();
      setStep('customer-info');
    } else {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold">Checkout</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="p-1"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Contenido */}
        <div className="flex-1 overflow-y-auto p-4">
          {step === 'customer-info' && (
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-medium mb-4">Información del Cliente</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Nombre completo *</Label>
                    <Input
                      id="name"
                      value={customerInfo.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Tu nombre completo"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={customerInfo.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="tu@email.com"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="phone">Teléfono *</Label>
                    <Input
                      id="phone"
                      value={customerInfo.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="+593 99 123 4567"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="document">Cédula/Identificación</Label>
                    <Input
                      id="document"
                      value={customerInfo.document}
                      onChange={(e) => handleInputChange('document', e.target.value)}
                      placeholder="1234567890"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-medium mb-4">Dirección de Entrega</h4>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="address">Dirección</Label>
                    <Input
                      id="address"
                      value={customerInfo.deliveryAddress}
                      onChange={(e) => handleInputChange('deliveryAddress', e.target.value)}
                      placeholder="Av. Amazonas 123"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="city">Ciudad</Label>
                      <Input
                        id="city"
                        value={customerInfo.deliveryCity}
                        onChange={(e) => handleInputChange('deliveryCity', e.target.value)}
                        placeholder="Quito"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="state">Provincia</Label>
                      <Input
                        id="state"
                        value={customerInfo.deliveryState}
                        onChange={(e) => handleInputChange('deliveryState', e.target.value)}
                        placeholder="Pichincha"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="postalCode">Código Postal</Label>
                      <Input
                        id="postalCode"
                        value={customerInfo.deliveryPostalCode}
                        onChange={(e) => handleInputChange('deliveryPostalCode', e.target.value)}
                        placeholder="170101"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="notes">Notas de entrega</Label>
                    <Textarea
                      id="notes"
                      value={customerInfo.deliveryNotes}
                      onChange={(e) => handleInputChange('deliveryNotes', e.target.value)}
                      placeholder="Instrucciones especiales para la entrega"
                      rows={3}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 'payment' && (
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-medium mb-4">Resumen del Pedido</h4>
                
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  {items.map((item) => (
                    <div key={item.SKU} className="flex justify-between items-center">
                      <div className="flex items-center space-x-3">
                        <span className="text-sm text-gray-600">{item.quantity}x</span>
                        <span className="text-sm font-medium">{item.Nombre}</span>
                      </div>
                      <span className="text-sm font-medium">${item.totalPrice.toFixed(2)}</span>
                    </div>
                  ))}
                  
                  <div className="border-t pt-3 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal:</span>
                      <span>${getSubtotal().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>IVA (12%):</span>
                      <span>${getTaxAmount().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
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
                </div>
              </div>

              <div>
                <h4 className="text-lg font-medium mb-4">Método de Pago</h4>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                       onClick={() => setPaymentMethod('card')}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={paymentMethod === 'card'}
                      onChange={() => setPaymentMethod('card')}
                      className="mr-2"
                    />
                    <CreditCard className="w-5 h-5 text-blue-600" />
                    <span>Tarjeta de Crédito/Débito</span>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                       onClick={() => setPaymentMethod('transfer')}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="transfer"
                      checked={paymentMethod === 'transfer'}
                      onChange={() => setPaymentMethod('transfer')}
                      className="mr-2"
                    />
                    <CreditCard className="w-5 h-5 text-green-600" />
                    <span>Transferencia Bancaria</span>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                       onClick={() => setPaymentMethod('cash')}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cash"
                      checked={paymentMethod === 'cash'}
                      onChange={() => setPaymentMethod('cash')}
                      className="mr-2"
                    />
                    <Truck className="w-5 h-5 text-orange-600" />
                    <span>Pago contra entrega</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 'confirmation' && (
            <div className="text-center py-8">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h4 className="text-xl font-semibold text-gray-900 mb-2">¡Pedido Confirmado!</h4>
              <p className="text-gray-600 mb-4">
                Tu pedido ha sido procesado exitosamente. Recibirás un email de confirmación con los detalles.
              </p>
              <p className="text-sm text-gray-500">
                Te contactaremos pronto para coordinar la entrega.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t p-4">
          <div className="flex justify-between items-center">
            {step === 'customer-info' && (
              <Button onClick={handleNextStep} className="w-full">
                Continuar al Pago
              </Button>
            )}
            
            {step === 'payment' && (
              <div className="flex space-x-3 w-full">
                <Button variant="outline" onClick={handlePreviousStep} className="flex-1">
                  Atrás
                </Button>
                <Button 
                  onClick={handlePlaceOrder} 
                  disabled={isProcessing || !paymentMethod}
                  className="flex-1"
                >
                  {isProcessing ? 'Procesando...' : 'Confirmar Pedido'}
                </Button>
                {/* Debug info */}
                <div className="text-xs text-gray-500 mt-2">
                  Estado: {isProcessing ? 'Procesando' : 'Listo'} | 
                  Método: {paymentMethod || 'No seleccionado'}
                </div>
              </div>
            )}
            
            {step === 'confirmation' && (
              <Button onClick={handleClose} className="w-full">
                Cerrar
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
