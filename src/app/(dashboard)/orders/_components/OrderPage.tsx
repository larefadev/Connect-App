"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download, Eye, RefreshCw, X, MapPin, Phone, Mail, Calendar, Package, CreditCard, FileText } from "lucide-react";
import { useOrders } from "@/hooks/Orders/useOrders";
import { useEffect, useState, useMemo, useCallback } from "react";
import { Order } from "@/stores/orderStore";
import { WithoutProducts } from "./WithoutProducts";
import { OrderTable } from "./OrderTable";
import { OrderModal } from "./OrderModal";
import { useStoreProfile } from "@/hooks/StoreProfile/useStoreProfile";

// Funciones memoizadas para evitar recreación en cada render
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
    const [storeId, setStoreId] = useState<number | null | undefined>(null);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { storeProfile } = useStoreProfile();
    const { 
        orders, 
        loading, 
        error, 
        getOrdersByStore
    } = useOrders(storeId || undefined);
    // Por ahora usamos un storeId falso para demostración  
    useEffect(() => {
        setStoreId(storeProfile?.id ? Number(storeProfile.id) : null);
    }, [storeProfile?.id]);

    // Memoizar las funciones de callback para evitar recreaciones innecesarias
    const handleRefresh = useCallback(() => {
        if (storeId) {
            getOrdersByStore(storeId);
        }
    }, [storeId, getOrdersByStore]);

    const openOrderModal = useCallback((order: Order) => {
        setSelectedOrder(order);
        setIsModalOpen(true);
    }, []);

    const closeOrderModal = useCallback(() => {
        setIsModalOpen(false);
        setSelectedOrder(null);
    }, []);

    // Memoizar el estado de si hay órdenes para evitar recálculos
    const hasOrders = useMemo(() => orders.length > 0, [orders.length]);

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="flex justify-center items-center py-12">
                    <div className="text-center">
                        <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-gray-500" />
                        <p className="text-gray-600">Cargando...</p>
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

            {!hasOrders ? (
                <WithoutProducts />
            ) : (
                <OrderTable 
                    orders={orders} 
                    openOrderModal={openOrderModal} 
                    getBadgeVariant={getBadgeVariant} 
                    getPaymentBadgeVariant={getPaymentBadgeVariant} 
                />
            )}

            {/* Modal de Detalles del Pedido */}
            {isModalOpen && selectedOrder && (
                <OrderModal
                    selectedOrder={selectedOrder}
                    closeOrderModal={closeOrderModal}
                    getBadgeVariant={getBadgeVariant}
                    getPaymentBadgeVariant={getPaymentBadgeVariant}
                />
            )}
        </div>
    );
}