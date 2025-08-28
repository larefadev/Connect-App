"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download, Eye, RefreshCw, X, MapPin, Phone, Mail, Calendar, Package, CreditCard, FileText } from "lucide-react";
import { useOrders } from "@/hooks/Orders/useOrders";
import { useEffect, useState } from "react";
import { Order } from "@/stores/orderStore";

const getBadgeVariant = (status: Order['order_status']): React.ComponentProps<typeof Badge>['variant'] => {
    switch (status) {
        case "delivered":
            return "default";
        case "preparing":
        case "shipped":
        case "pending":
            return "secondary";
        case "cancelled":
            return "destructive";
        case "confirmed":
            return "default";
        default:
            return "secondary";
    }
};

const getPaymentBadgeVariant = (status: Order['payment_status']): React.ComponentProps<typeof Badge>['variant'] => {
    switch (status) {
        case "paid":
            return "default";
        case "pending":
            return "secondary";
        case "failed":
        case "refunded":
            return "destructive";
        default:
            return "secondary";
    }
};

export const OrdersPage = () => {
    const [storeId, setStoreId] = useState<number | null>(null);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const { 
        orders, 
        loading, 
        error, 
        getOrdersByStore
    } = useOrders(storeId || undefined);


    // Por ahora usamos un storeId falso para demostración
    useEffect(() => {
        setStoreId(1);
    }, []);


    const handleRefresh = () => {
        if (storeId) {
            getOrdersByStore(storeId);
        }
    };

    const openOrderModal = (order: Order) => {
        setSelectedOrder(order);
        setIsModalOpen(true);
    };

    const closeOrderModal = () => {
        setIsModalOpen(false);
        setSelectedOrder(null);
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="flex justify-center items-center py-12">
                    <div className="text-center">
                        <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-gray-500" />
                        <p className="text-gray-600">Cargando pedidos...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="space-y-6">
                <div className="flex justify-center items-center py-12">
                    <div className="text-center">
                        <div className="text-red-500 text-6xl mb-4">⚠️</div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Error al cargar los pedidos</h3>
                        <p className="text-gray-600 mb-4">{error}</p>
                        <Button onClick={handleRefresh}>
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Reintentar
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return(
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Lista de Pedidos</h2>
                <div className="flex gap-2">
                    <Button 
                        variant="outline" 
                        onClick={handleRefresh}
                        disabled={loading}
                    >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Actualizar
                    </Button>
                    <Button variant="outline">
                        <Download className="w-4 h-4 mr-2" />
                        Exportar
                    </Button>
                </div>
            </div>

            {/* Debug Info - Puedes remover esto en producción */}
            {orders.length === 0 ? (
                <Card>
                    <CardContent className="p-12">
                        <div className="text-center">
                            <div className="text-gray-400 text-6xl mb-4">📦</div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay pedidos aún</h3>
                            <p className="text-gray-500">
                                Cuando los clientes realicen compras desde tu tienda, aparecerán aquí.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <Card>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="text-left p-4 font-medium">Número de Pedido</th>
                                    <th className="text-left p-4 font-medium">Cliente</th>
                                    <th className="text-left p-4 font-medium">Fecha</th>
                                    <th className="text-left p-4 font-medium">Total</th>
                                    <th className="text-left p-4 font-medium">Estado</th>
                                    <th className="text-left p-4 font-medium">Pago</th>
                                    <th className="text-left p-4 font-medium">Acciones</th>
                                </tr>
                                </thead>
                                <tbody>
                                {orders.map((order) => (
                                    <tr key={order.id} className="border-b hover:bg-gray-50">
                                        <td className="p-4 font-medium">{order.order_number}</td>
                                        <td className="p-4">
                                            <div>
                                                <div className="font-medium">{order.customer_name}</div>
                                                <div className="text-sm text-gray-500">{order.customer_email}</div>
                                            </div>
                                        </td>
                                        <td className="p-4 text-gray-600">
                                            {order.created_at ? new Date(order.created_at).toLocaleDateString('es-ES') : 'N/A'}
                                        </td>
                                        <td className="p-4 font-semibold">${order.total_amount.toFixed(2)}</td>
                                        <td className="p-4">
                                            <Badge variant={getBadgeVariant(order.order_status)}>
                                                {order.order_status === 'pending' && 'Pendiente'}
                                                {order.order_status === 'confirmed' && 'Confirmado'}
                                                {order.order_status === 'preparing' && 'Preparando'}
                                                {order.order_status === 'shipped' && 'Enviado'}
                                                {order.order_status === 'delivered' && 'Entregado'}
                                                {order.order_status === 'cancelled' && 'Cancelado'}
                                            </Badge>
                                        </td>
                                        <td className="p-4">
                                            <Badge variant={getPaymentBadgeVariant(order.payment_status)}>
                                                {order.payment_status === 'pending' && 'Pendiente'}
                                                {order.payment_status === 'paid' && 'Pagado'}
                                                {order.payment_status === 'failed' && 'Fallido'}
                                                {order.payment_status === 'refunded' && 'Reembolsado'}
                                            </Badge>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex space-x-2">
                                                <Button 
                                                    variant="ghost" 
                                                    size="sm"
                                                    onClick={() => openOrderModal(order)}
                                                >
                                                    <Eye className="w-4 h-4 mr-2" />
                                                    Ver
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Modal de Detalles del Pedido */}
            {isModalOpen && selectedOrder && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        {/* Header del Modal */}
                        <div className="flex justify-between items-center p-6 border-b">
                            <div>
                                <h3 className="text-xl font-semibold">Pedido #{selectedOrder.order_number}</h3>
                                <p className="text-gray-600">Creado el {selectedOrder.created_at ? new Date(selectedOrder.created_at).toLocaleDateString('es-ES') : 'N/A'}</p>
                            </div>
                            <Button variant="ghost" size="sm" onClick={closeOrderModal}>
                                <X className="w-4 h-4" />
                            </Button>
                        </div>

                        {/* Contenido del Modal */}
                        <div className="p-6 space-y-6">
                            {/* Información del Cliente */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Card>
                                    <CardContent className="p-4">
                                        <h4 className="font-semibold mb-3 flex items-center">
                                            <FileText className="w-4 h-4 mr-2" />
                                            Información del Cliente
                                        </h4>
                                        <div className="space-y-2">
                                            <div className="flex items-center">
                                                <span className="font-medium w-24">Nombre:</span>
                                                <span>{selectedOrder.customer_name}</span>
                                            </div>
                                            <div className="flex items-center">
                                                <Mail className="w-4 h-4 mr-2 text-gray-500" />
                                                <span>{selectedOrder.customer_email}</span>
                                            </div>
                                            <div className="flex items-center">
                                                <Phone className="w-4 h-4 mr-2 text-gray-500" />
                                                <span>{selectedOrder.customer_phone}</span>
                                            </div>
                                            {selectedOrder.customer_document && (
                                                <div className="flex items-center">
                                                    <span className="font-medium w-24">Documento:</span>
                                                    <span>{selectedOrder.customer_document}</span>
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardContent className="p-4">
                                        <h4 className="font-semibold mb-3 flex items-center">
                                            <MapPin className="w-4 h-4 mr-2" />
                                            Dirección de Entrega
                                        </h4>
                                        <div className="space-y-2">
                                            <div className="flex items-start">
                                                <span className="font-medium w-24">Dirección:</span>
                                                <span>{selectedOrder.delivery_address}</span>
                                            </div>
                                            <div className="flex items-center">
                                                <span className="font-medium w-24">Ciudad:</span>
                                                <span>{selectedOrder.delivery_city}</span>
                                            </div>
                                            <div className="flex items-center">
                                                <span className="font-medium w-24">Estado:</span>
                                                <span>{selectedOrder.delivery_state}</span>
                                            </div>
                                            <div className="flex items-center">
                                                <span className="font-medium w-24">CP:</span>
                                                <span>{selectedOrder.delivery_postal_code}</span>
                                            </div>
                                            {selectedOrder.delivery_notes && (
                                                <div className="flex items-start">
                                                    <span className="font-medium w-24">Notas:</span>
                                                    <span>{selectedOrder.delivery_notes}</span>
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Productos del Pedido */}
                            <Card>
                                <CardContent className="p-4">
                                    <h4 className="font-semibold mb-3 flex items-center">
                                        <Package className="w-4 h-4 mr-2" />
                                        Productos del Pedido
                                    </h4>
                                    <div className="space-y-3">
                                        {selectedOrder.items && selectedOrder.items.length > 0 ? (
                                            selectedOrder.items.map((item, index) => (
                                                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                    <div className="flex items-center space-x-3">
                                                        {item.product_image && (
                                                            <img 
                                                                src={item.product_image} 
                                                                alt={item.product_name}
                                                                className="w-12 h-12 object-cover rounded"
                                                            />
                                                        )}
                                                        <div>
                                                            <div className="font-medium">{item.product_name}</div>
                                                            <div className="text-sm text-gray-600">SKU: {item.product_sku}</div>
                                                            {item.product_description && (
                                                                <div className="text-sm text-gray-500">{item.product_description}</div>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="font-medium">${item.unit_price.toFixed(2)}</div>
                                                        <div className="text-sm text-gray-600">Cantidad: {item.quantity}</div>
                                                        <div className="font-semibold text-blue-600">${item.total_price.toFixed(2)}</div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-gray-500 text-center py-4">No hay productos en este pedido</p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Resumen del Pedido */}
                            <Card>
                                <CardContent className="p-4">
                                    <h4 className="font-semibold mb-3 flex items-center">
                                        <CreditCard className="w-4 h-4 mr-2" />
                                        Resumen del Pedido
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <span>Subtotal:</span>
                                                <span>${selectedOrder.subtotal.toFixed(2)}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Impuestos:</span>
                                                <span>${selectedOrder.tax_amount.toFixed(2)}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Envío:</span>
                                                <span>${selectedOrder.shipping_cost.toFixed(2)}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Descuentos:</span>
                                                <span>${selectedOrder.discount_amount.toFixed(2)}</span>
                                            </div>
                                            <div className="flex justify-between font-semibold text-lg border-t pt-2">
                                                <span>Total:</span>
                                                <span className="text-blue-600">${selectedOrder.total_amount.toFixed(2)}</span>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <span>Estado del Pedido:</span>
                                                <Badge variant={getBadgeVariant(selectedOrder.order_status)}>
                                                    {selectedOrder.order_status === 'pending' && 'Pendiente'}
                                                    {selectedOrder.order_status === 'confirmed' && 'Confirmado'}
                                                    {selectedOrder.order_status === 'preparing' && 'Preparando'}
                                                    {selectedOrder.order_status === 'shipped' && 'Enviado'}
                                                    {selectedOrder.order_status === 'delivered' && 'Entregado'}
                                                    {selectedOrder.order_status === 'cancelled' && 'Cancelado'}
                                                </Badge>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Estado del Pago:</span>
                                                <Badge variant={getPaymentBadgeVariant(selectedOrder.payment_status)}>
                                                    {selectedOrder.payment_status === 'pending' && 'Pendiente'}
                                                    {selectedOrder.payment_status === 'paid' && 'Pagado'}
                                                    {selectedOrder.payment_status === 'failed' && 'Fallido'}
                                                    {selectedOrder.payment_status === 'refunded' && 'Reembolsado'}
                                                </Badge>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Método de Pago:</span>
                                                <span className="capitalize">{selectedOrder.payment_method}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Moneda:</span>
                                                <span>{selectedOrder.currency}</span>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Notas del Pedido */}
                            {selectedOrder.notes && (
                                <Card>
                                    <CardContent className="p-4">
                                        <h4 className="font-semibold mb-3">Notas del Pedido</h4>
                                        <p className="text-gray-700">{selectedOrder.notes}</p>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Fechas Importantes */}
                            <Card>
                                <CardContent className="p-4">
                                    <h4 className="font-semibold mb-3 flex items-center">
                                        <Calendar className="w-4 h-4 mr-2" />
                                        Fechas Importantes
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="flex justify-between">
                                            <span>Creado:</span>
                                            <span>{selectedOrder.created_at ? new Date(selectedOrder.created_at).toLocaleDateString('es-ES') : 'N/A'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Actualizado:</span>
                                            <span>{selectedOrder.updated_at ? new Date(selectedOrder.updated_at).toLocaleDateString('es-ES') : 'N/A'}</span>
                                        </div>
                                        {selectedOrder.confirmed_at && (
                                            <div className="flex justify-between">
                                                <span>Confirmado:</span>
                                                <span>{new Date(selectedOrder.confirmed_at).toLocaleDateString('es-ES')}</span>
                                            </div>
                                        )}
                                        {selectedOrder.shipped_at && (
                                            <div className="flex justify-between">
                                                <span>Enviado:</span>
                                                <span>{new Date(selectedOrder.shipped_at).toLocaleDateString('es-ES')}</span>
                                            </div>
                                        )}
                                        {selectedOrder.delivered_at && (
                                            <div className="flex justify-between">
                                                <span>Entregado:</span>
                                                <span>{new Date(selectedOrder.delivered_at).toLocaleDateString('es-ES')}</span>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Footer del Modal */}
                        <div className="flex justify-end gap-2 p-6 border-t bg-gray-50">
                            <Button variant="outline" onClick={closeOrderModal}>
                                Cerrar
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}