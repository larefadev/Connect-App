"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCartStore } from '@/stores/cartStore';
import { useOrders } from '@/hooks/Orders/useOrders';
import { Loader2, CheckCircle } from 'lucide-react';

interface CheckoutFormProps {
  storeId: number;
  onSuccess?: (orderId: number) => void;
}

export const CheckoutForm = ({ storeId, onSuccess }: CheckoutFormProps) => {
  const [step, setStep] = useState<'customer-info' | 'delivery-info' | 'payment-info' | 'confirmation'>('customer-info');
  const [loading, setLoading] = useState(false);
  const [orderCreated, setOrderCreated] = useState(false);
  const [orderId, setOrderId] = useState<number | null>(null);

  const {
    customerInfo,
    updateCustomerInfo,
    getSubtotal,
    getTaxAmount,
    getShippingCost,
    getTotalAmount,
    items,
  } = useCartStore();

  const { createOrderFromCart } = useOrders(storeId);

  const handleInputChange = (field: keyof typeof customerInfo, value: string) => {
    updateCustomerInfo({ [field]: value });
  };

  const handleNextStep = () => {
    if (step === 'customer-info') {
      if (customerInfo.name && customerInfo.email && customerInfo.phone) {
        setStep('delivery-info');
      }
    } else if (step === 'delivery-info') {
      if (customerInfo.deliveryAddress && customerInfo.deliveryCity) {
        setStep('payment-info');
      }
    }
  };

  const handlePreviousStep = () => {
    if (step === 'delivery-info') {
      setStep('customer-info');
    } else if (step === 'payment-info') {
      setStep('delivery-info');
    }
  };

  const handleSubmit = async (paymentMethod: string) => {
    setLoading(true);
    
    try {
      const order = await createOrderFromCart(paymentMethod, customerInfo.deliveryNotes);
      setOrderId(order.id || 0);
      setOrderCreated(true);
      setStep('confirmation');
      
      if (onSuccess && order.id) {
        onSuccess(order.id);
      }
    } catch (error) {
      console.error('Error al crear el pedido:', error);
      alert('Error al crear el pedido. Por favor, inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  if (orderCreated && step === 'confirmation') {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">¡Pedido Creado Exitosamente!</h2>
          <p className="text-gray-600 mb-4">
            Tu pedido ha sido procesado y está siendo preparado.
          </p>
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <p className="text-sm text-gray-600">Número de Pedido:</p>
            <p className="text-lg font-bold text-gray-900">#{orderId}</p>
          </div>
          <p className="text-sm text-gray-500">
            Recibirás un correo de confirmación con los detalles de tu pedido.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-8">
        {['customer-info', 'delivery-info', 'payment-info'].map((stepName, index) => (
          <div key={stepName} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step === stepName 
                ? 'bg-blue-600 text-white' 
                : step === 'confirmation' || ['customer-info', 'delivery-info', 'payment-info'].indexOf(step) > index
                ? 'bg-green-500 text-white'
                : 'bg-gray-200 text-gray-600'
            }`}>
              {index + 1}
            </div>
            {index < 2 && (
              <div className={`w-16 h-1 mx-2 ${
                ['customer-info', 'delivery-info', 'payment-info'].indexOf(step) > index
                  ? 'bg-green-500'
                  : 'bg-gray-200'
              }`} />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Customer Information */}
      {step === 'customer-info' && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Información Personal</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Nombre Completo *</Label>
              <Input
                id="name"
                value={customerInfo.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Tu nombre completo"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="email">Correo Electrónico *</Label>
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
              <Label htmlFor="document">Cédula/DNI</Label>
              <Input
                id="document"
                value={customerInfo.document}
                onChange={(e) => handleInputChange('document', e.target.value)}
                placeholder="1234567890"
              />
            </div>
          </div>
          
          <Button 
            onClick={handleNextStep}
            disabled={!customerInfo.name || !customerInfo.email || !customerInfo.phone}
            className="w-full"
          >
            Continuar
          </Button>
        </div>
      )}

      {/* Step 2: Delivery Information */}
      {step === 'delivery-info' && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Información de Entrega</h2>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="address">Dirección de Entrega *</Label>
              <Textarea
                id="address"
                value={customerInfo.deliveryAddress}
                onChange={(e) => handleInputChange('deliveryAddress', e.target.value)}
                placeholder="Dirección completa"
                rows={3}
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="city">Ciudad *</Label>
                <Input
                  id="city"
                  value={customerInfo.deliveryCity}
                  onChange={(e) => handleInputChange('deliveryCity', e.target.value)}
                  placeholder="Quito"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="state">Provincia/Estado</Label>
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
              <Label htmlFor="notes">Notas de Entrega</Label>
              <Textarea
                id="notes"
                value={customerInfo.deliveryNotes}
                onChange={(e) => handleInputChange('deliveryNotes', e.target.value)}
                placeholder="Instrucciones especiales para la entrega"
                rows={2}
              />
            </div>
          </div>
          
          <div className="flex space-x-3">
            <Button variant="outline" onClick={handlePreviousStep} className="flex-1">
              Atrás
            </Button>
            <Button 
              onClick={handleNextStep}
              disabled={!customerInfo.deliveryAddress || !customerInfo.deliveryCity}
              className="flex-1"
            >
              Continuar
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Payment Information */}
      {step === 'payment-info' && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Método de Pago</h2>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="paymentMethod">Seleccionar Método de Pago</Label>
              <Select onValueChange={(value) => handleSubmit(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un método de pago" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Efectivo</SelectItem>
                  <SelectItem value="card">Tarjeta de Crédito/Débito</SelectItem>
                  <SelectItem value="transfer">Transferencia Bancaria</SelectItem>
                  <SelectItem value="paypal">PayPal</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Order Summary */}
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <h3 className="font-semibold text-gray-900">Resumen del Pedido</h3>
              <div className="space-y-1 text-sm">
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
                  <div className="flex justify-between font-semibold">
                    <span>Total:</span>
                    <span>${getTotalAmount().toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <Button variant="outline" onClick={handlePreviousStep} className="flex-1">
              Atrás
            </Button>
            <Button 
              onClick={() => handleSubmit('cash')}
              disabled={loading}
              className="flex-1"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Procesando...
                </>
              ) : (
                'Completar Pedido'
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
