"use client";

import { useState, useCallback } from 'react';
import { X, Package, MapPin, Phone, Mail, Calendar, CreditCard, Truck, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { B2BOrder } from '@/types/b2b-order';
import { ProductImage } from '@/components/ui/product-image';

interface OrderDetailsModalProps {
    order: B2BOrder | null;
    isOpen: boolean;
    onClose: () => void;
    onUpdateStatus?: (orderId: string, status: B2BOrder['order_status']) => Promise<void>;
    onDelete?: (orderId: string) => Promise<void>;
}

export const OrderDetailsModal = ({ 
    order, 
    isOpen, 
    onClose, 
    onUpdateStatus,
    onDelete 
}: OrderDetailsModalProps) => {
    const [isUpdating, setIsUpdating] = useState(false);

    const getStatusColor = (status: B2BOrder['order_status']) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'confirmed':
                return 'bg-blue-100 text-blue-800';
            case 'processing':
                return 'bg-purple-100 text-purple-800';
            case 'shipped':
                return 'bg-indigo-100 text-indigo-800';
            case 'delivered':
                return 'bg-green-100 text-green-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusIcon = (status: B2BOrder['order_status']) => {
        switch (status) {
            case 'pending':
                return <Clock className="w-4 h-4" />;
            case 'confirmed':
                return <CheckCircle className="w-4 h-4" />;
            case 'processing':
                return <Package className="w-4 h-4" />;
            case 'shipped':
                return <Truck className="w-4 h-4" />;
            case 'delivered':
                return <CheckCircle className="w-4 h-4" />;
            case 'cancelled':
                return <AlertCircle className="w-4 h-4" />;
            default:
                return <Clock className="w-4 h-4" />;
        }
    };

    const getPaymentStatusColor = (status: B2BOrder['payment_status']) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'paid':
                return 'bg-green-100 text-green-800';
            case 'partial':
                return 'bg-blue-100 text-blue-800';
            case 'refunded':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getPriorityColor = (priority: number) => {
        switch (priority) {
            case 1:
                return 'bg-green-100 text-green-800';
            case 2:
                return 'bg-yellow-100 text-yellow-800';
            case 3:
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getPriorityText = (priority: number) => {
        switch (priority) {
            case 1:
                return 'Normal';
            case 2:
                return 'Alta';
            case 3:
                return 'Urgente';
            default:
                return 'Normal';
        }
    };

    const handleStatusUpdate = useCallback(async (newStatus: B2BOrder['order_status']) => {
        if (!order || !onUpdateStatus) return;
        
        setIsUpdating(true);
        try {
            await onUpdateStatus(order.id!, newStatus);
        } catch (error) {
            console.error('Error updating status:', error);
        } finally {
            setIsUpdating(false);
        }
    }, [order, onUpdateStatus]);

    const handleDelete = useCallback(async () => {
        if (!order || !onDelete) return;
        
        if (confirm('¿Está seguro de que desea eliminar este pedido?')) {
            setIsUpdating(true);
            try {
                await onDelete(order.id!);
                onClose();
            } catch (error) {
                console.error('Error deleting order:', error);
            } finally {
                setIsUpdating(false);
            }
        }
    }, [order, onDelete, onClose]);

    if (!isOpen || !order) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b">
                    <div>
                        <h2 className="text-2xl font-bold">Detalles del Pedido</h2>
                        <p className="text-gray-600">#{order.order_number}</p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={onClose}>
                        <X className="w-5 h-5" />
                    </Button>
                </div>

                <div className="p-6 overflow-y-auto max-h-[80vh]">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Información Principal */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Estado del Pedido */}

                            {/* Información de Entrega */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <MapPin className="w-5 h-5" />
                                        Información de Entrega
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <p><strong>Dirección:</strong> {order.delivery_address}</p>
                                    <p><strong>Ciudad:</strong> {order.delivery_city}</p>
                                    <p><strong>Estado:</strong> {order.delivery_state}</p>
                                    {order.delivery_postal_code && (
                                        <p><strong>Código Postal:</strong> {order.delivery_postal_code}</p>
                                    )}
                                    {order.delivery_contact_name && (
                                        <p><strong>Contacto:</strong> {order.delivery_contact_name}</p>
                                    )}
                                    {order.delivery_contact_phone && (
                                        <p><strong>Teléfono:</strong> {order.delivery_contact_phone}</p>
                                    )}
                                    {order.delivery_notes && (
                                        <p><strong>Notas:</strong> {order.delivery_notes}</p>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Productos */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Package className="w-5 h-5" />
                                        Productos ({order.items?.length || 0})
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {order.items?.map((item, index) => (
                                            <div key={index} className="flex items-center space-x-4 p-4 border rounded-lg">
                                                <ProductImage
                                                    src={item.product_image}
                                                    alt={item.product_name}
                                                    className="w-16 h-16 object-cover rounded-lg"
                                                />
                                                <div className="flex-1">
                                                    <h4 className="font-medium">{item.product_name}</h4>
                                                    <p className="text-sm text-gray-600">SKU: {item.product_sku}</p>
                                                    {item.product_brand && (
                                                        <p className="text-sm text-gray-600">Marca: {item.product_brand}</p>
                                                    )}
                                                    <p className="text-sm text-gray-600">Cantidad: {item.quantity}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-medium">${item.unit_price.toFixed(2)} c/u</p>
                                                    <p className="font-semibold">${item.total_price.toFixed(2)}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Información Lateral */}
                        <div className="space-y-6">
                            {/* Resumen de Pago */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <CreditCard className="w-5 h-5" />
                                        Resumen de Pago
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <div className="flex justify-between">
                                        <span>Subtotal:</span>
                                        <span>${order.subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Descuento:</span>
                                        <span>-${order.discount_amount.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Impuestos:</span>
                                        <span>${order.tax_amount.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Envío:</span>
                                        <span>${order.shipping_cost.toFixed(2)}</span>
                                    </div>
                                    <hr />
                                    <div className="flex justify-between font-bold text-lg">
                                        <span>Total:</span>
                                        <span>${order.total_amount.toFixed(2)} {order.currency}</span>
                                    </div>
                                    
                                    {order.payment_method && (
                                        <p><strong>Método:</strong> {order.payment_method}</p>
                                    )}
                                    {order.payment_terms && (
                                        <p><strong>Términos:</strong> {order.payment_terms}</p>
                                    )}
                                    {order.purchase_order_number && (
                                        <p><strong>PO:</strong> {order.purchase_order_number}</p>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Fechas */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Calendar className="w-5 h-5" />
                                        Fechas
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <p><strong>Creado:</strong> {new Date(order.created_at!).toLocaleDateString()}</p>
                                    {order.confirmed_at && (
                                        <p><strong>Confirmado:</strong> {new Date(order.confirmed_at).toLocaleDateString()}</p>
                                    )}
                                    {order.shipped_at && (
                                        <p><strong>Enviado:</strong> {new Date(order.shipped_at).toLocaleDateString()}</p>
                                    )}
                                    {order.delivered_at && (
                                        <p><strong>Entregado:</strong> {new Date(order.delivered_at).toLocaleDateString()}</p>
                                    )}
                                    {order.cancelled_at && (
                                        <p><strong>Cancelado:</strong> {new Date(order.cancelled_at).toLocaleDateString()}</p>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Notas */}
                            {(order.internal_notes || order.store_notes) && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Notas</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                        {order.internal_notes && (
                                            <div>
                                                <p className="font-medium text-sm text-gray-600">Internas:</p>
                                                <p className="text-sm">{order.internal_notes}</p>
                                            </div>
                                        )}
                                        {order.store_notes && (
                                            <div>
                                                <p className="font-medium text-sm text-gray-600">Tienda:</p>
                                                <p className="text-sm">{order.store_notes}</p>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            )}

                            {/* Acciones */}
                            {/**onDelete && (
                                <Card>
                                    <CardContent className="pt-6">
                                        <Button
                                            variant="destructive"
                                            onClick={handleDelete}
                                            disabled={isUpdating}
                                            className="w-full"
                                        >
                                            Eliminar Pedido
                                        </Button>
                                    </CardContent>
                                </Card>
                            */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
