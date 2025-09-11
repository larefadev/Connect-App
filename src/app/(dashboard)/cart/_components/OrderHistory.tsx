"use client";

import { useState, useCallback, useMemo } from 'react';
import { Search, Eye, Trash2, Package, Calendar, MapPin, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { B2BOrder } from '@/types/b2b-order';

interface OrderHistoryProps {
    orders: B2BOrder[];
    loading: boolean;
    error: string | null;
    searchTerm: string;
    onSearch: (term: string) => void;
    onViewOrder: (order: B2BOrder) => void;
    onDeleteOrder: (orderId: string) => Promise<void>;
    onClearError: () => void;
}

export const OrderHistory = ({
    orders,
    loading,
    error,
    searchTerm,
    onSearch,
    onViewOrder,
    onDeleteOrder,
    onClearError
}: OrderHistoryProps) => {
    const [deletingOrderId, setDeletingOrderId] = useState<string | null>(null);

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

    const handleDelete = useCallback(async (orderId: string) => {
        if (confirm('¿Está seguro de que desea eliminar este pedido?')) {
            setDeletingOrderId(orderId);
            try {
                await onDeleteOrder(orderId);
            } catch (error) {
                console.error('Error deleting order:', error);
            } finally {
                setDeletingOrderId(null);
            }
        }
    }, [onDeleteOrder]);

    const filteredOrders = useMemo(() => {
        if (!searchTerm.trim()) return orders;
        
        return orders.filter(order => 
            order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.delivery_contact_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.purchase_order_number?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [orders, searchTerm]);

    if (error) {
        return (
            <Card>
                <CardContent className="pt-6">
                    <div className="text-center">
                        <p className="text-red-600 mb-4">{error}</p>
                        <Button onClick={onClearError} variant="outline">
                            Reintentar
                        </Button>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-4 lg:space-y-6">
            {/* Header con búsqueda */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base lg:text-lg">Historial de Pedidos</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-3 lg:gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <Input
                                    placeholder="Buscar por número de pedido, contacto o PO..."
                                    value={searchTerm}
                                    onChange={(e) => onSearch(e.target.value)}
                                    className="pl-10 text-sm lg:text-base"
                                />
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Lista de pedidos */}
            {loading ? (
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
                            <p className="text-gray-600">Cargando pedidos...</p>
                        </div>
                    </CardContent>
                </Card>
            ) : filteredOrders.length === 0 ? (
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-center">
                            <Package className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
                                {searchTerm ? 'No se encontraron pedidos' : 'No hay pedidos'}
                            </h3>
                            <p className="text-sm sm:text-base text-gray-500">
                                {searchTerm ? 'Intenta ajustar los términos de búsqueda' : 'Los pedidos aparecerán aquí cuando se creen'}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-3 lg:space-y-4">
                    {filteredOrders.map((order) => (
                        <Card key={order.id} className="hover:shadow-md transition-shadow">
                            <CardContent className="p-4 lg:p-6">
                                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-3">
                                            <h3 className="text-base lg:text-lg font-semibold">#{order.order_number}</h3>
                                            <div className="flex flex-wrap gap-2">
                                                <Badge className={`${getStatusColor(order.order_status)} text-xs`}>
                                                    {order.order_status.toUpperCase()}
                                                </Badge>
                                                <Badge className={`${getPaymentStatusColor(order.payment_status)} text-xs`}>
                                                    {order.payment_status.toUpperCase()}
                                                </Badge>
                                                <Badge className={`${getPriorityColor(order.priority_level)} text-xs`}>
                                                    {getPriorityText(order.priority_level)}
                                                </Badge>
                                            </div>
                                        </div>
                                        
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4 mb-4">
                                            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                                                <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                                                <span>{new Date(order.created_at!).toLocaleDateString()}</span>
                                            </div>
                                            
                                            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                                                <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                                                <span className="truncate">{order.delivery_city}, {order.delivery_state}</span>
                                            </div>
                                            
                                            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                                                <CreditCard className="w-3 h-3 sm:w-4 sm:h-4" />
                                                <span>${order.total_amount.toFixed(2)} {order.currency}</span>
                                            </div>
                                        </div>

                                        <div className="text-xs sm:text-sm text-gray-600 space-y-1">
                                            <p><strong>Contacto:</strong> {order.delivery_contact_name || 'No especificado'}</p>
                                            {order.purchase_order_number && (
                                                <p><strong>PO:</strong> {order.purchase_order_number}</p>
                                            )}
                                            <p><strong>Productos:</strong> {order.items?.length || 0} artículo(s)</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex gap-2 lg:ml-4">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => onViewOrder(order)}
                                            className="flex-1 sm:flex-none"
                                        >
                                            <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                                            <span className="text-xs sm:text-sm">Ver</span>
                                        </Button>
                                       {/** <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleDelete(order.id!)}
                                            disabled={deletingOrderId === order.id}
                                            className="text-red-600 hover:text-red-700"
                                        >
                                            <Trash2 className="w-4 h-4 mr-2" />
                                            {deletingOrderId === order.id ? 'Eliminando...' : 'Eliminar'}
                                        </Button>*/}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};
