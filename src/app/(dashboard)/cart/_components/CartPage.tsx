"use client";

import { useState, useCallback, useMemo, useEffect } from 'react';
import { useB2BOrders } from '@/hooks/B2BOrders/useB2BOrders';
import { useStoreProfile } from '@/hooks/StoreProfile/useStoreProfile';
import { useProducts } from '@/hooks/Products/useProducts';
import { useToastContext } from '@/components/providers/ToastProvider';
import { useAuthStore } from '@/stores/authStore';
import { B2BOrder } from '@/types/b2b-order';
import { CartHeader } from './CartHeader';
import { CartTabs } from './CartTabs';
import { OrderForm } from './OrderForm';
import { OrderHistory } from './OrderHistory';
import { AddProductToCartModal } from './AddProductToCartModal';
import { OrderDetailsModal } from './OrderDetailsModal';
import { B2BCheckoutModal } from './B2BCheckoutModal';
import { RefreshCw } from 'lucide-react';

export const CartPage = () => {
    const [activeTab, setActiveTab] = useState('cart');
    const [selectedOrder, setSelectedOrder] = useState<B2BOrder | null>(null);
    const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
    const [isOrderDetailsModalOpen, setIsOrderDetailsModalOpen] = useState(false);
    const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { storeProfile, loading: storeProfileLoading } = useStoreProfile();
    const { user } = useAuthStore();
    const storeId = storeProfile?.id ? Number(storeProfile.id) : undefined;
    const ownerEmail = storeProfile?.email ? String(storeProfile.email) : 'dev@larefa.com'; // Email por defecto
    const userEmail = user?.email; // Email del usuario autenticado
    
    const { success: showSuccess, error: showError } = useToastContext();
    const { products, categories, loading: productsLoading } = useProducts();

    const {
        orders,
        cart,
        loading,
        error,
        createOrder,
        updateOrderStatus,
        deleteOrder,
        searchOrders,
        addToCart,
        updateCartItemQuantity,
        removeFromCart,
        clearCart,
        cartTotals,
        clearError
    } = useB2BOrders(storeId, ownerEmail, storeProfile, userEmail);

    // Manejar búsqueda de pedidos
    const handleSearch = useCallback((term: string) => {
        setSearchTerm(term);
        if (term.trim()) {
            searchOrders(term);
        }
    }, [searchOrders]);

    // Manejar agregar productos al carrito
    const handleAddToCart = useCallback((item: any) => {
        addToCart(item);
        showSuccess('Producto agregado al carrito');
    }, [addToCart, showSuccess]);

    // Manejar actualización de cantidad
    const handleUpdateQuantity = useCallback((productSku: string, quantity: number) => {
        updateCartItemQuantity(productSku, quantity);
    }, [updateCartItemQuantity]);

    // Manejar eliminación de producto del carrito
    const handleRemoveItem = useCallback((productSku: string) => {
        removeFromCart(productSku);
        showSuccess('Producto removido del carrito');
    }, [removeFromCart, showSuccess]);

    // Manejar limpiar carrito
    const handleClearCart = useCallback(() => {
        if (confirm('¿Está seguro de que desea limpiar el carrito?')) {
            clearCart();
            showSuccess('Carrito limpiado');
        }
    }, [clearCart, showSuccess]);

    // Manejar envío del pedido
    const handleSubmitOrder = useCallback(async (orderData: any) => {
        if (!storeId) {
            showError('No se pudo identificar la tienda');
            return;
        }

        setIsSubmitting(true);
        try {
            const newOrder = await createOrder({
                ...orderData,
                store_id: storeId,
                // Información del cliente desde el perfil de la tienda
                customer_name: storeProfile?.name || 'Tienda B2B',
                customer_email: storeProfile?.email ? String(storeProfile.email) : ownerEmail,
                customer_phone: storeProfile?.phone || '',
                customer_document: '' // No hay RUC en StoreProfile
            });

            if (newOrder) {
                showSuccess('Pedido creado exitosamente');
                setActiveTab('history');
            } else {
                showError('Error al crear el pedido');
            }
        } catch (error) {
            console.error('Error creating order:', error);
            showError('Error al crear el pedido');
        } finally {
            setIsSubmitting(false);
        }
    }, [storeId, storeProfile, ownerEmail, createOrder, showSuccess, showError]);

    // Manejar ver detalles del pedido
    const handleViewOrder = useCallback((order: B2BOrder) => {
        setSelectedOrder(order);
        setIsOrderDetailsModalOpen(true);
    }, []);

    // Manejar actualización de estado del pedido
    const handleUpdateOrderStatus = useCallback(async (orderId: string, status: B2BOrder['order_status']) => {
        const success = await updateOrderStatus(orderId, status);
        if (success) {
            showSuccess('Estado del pedido actualizado');
        } else {
            showError('Error al actualizar el estado del pedido');
        }
    }, [updateOrderStatus, showSuccess, showError]);

    // Manejar eliminación del pedido
    const handleDeleteOrder = useCallback(async (orderId: string) => {
        const success = await deleteOrder(orderId);
        if (success) {
            showSuccess('Pedido eliminado exitosamente');
        } else {
            showError('Error al eliminar el pedido');
        }
    }, [deleteOrder, showSuccess, showError]);

    // Manejar cierre del modal de detalles
    const handleCloseOrderDetails = useCallback(() => {
        setIsOrderDetailsModalOpen(false);
        setSelectedOrder(null);
    }, []);

    // Manejar apertura del checkout
    const handleOpenCheckout = useCallback(() => {
        setIsCheckoutModalOpen(true);
        setIsAddProductModalOpen(false);
    }, []);

    // Manejar cierre del checkout
    const handleCloseCheckout = useCallback(() => {
        setIsCheckoutModalOpen(false);
    }, []);

    // Contenido de la pestaña activa
    const activeTabContent = useMemo(() => {
        if (activeTab === 'cart') {
            return (
                <OrderForm
                    cart={cart}
                    onUpdateQuantity={handleUpdateQuantity}
                    onRemoveItem={handleRemoveItem}
                    onClearCart={handleClearCart}
                    onOpenCheckout={handleOpenCheckout}
                />
            );
        }
        
        return (
            <OrderHistory
                orders={orders}
                loading={loading}
                error={error}
                searchTerm={searchTerm}
                onSearch={handleSearch}
                onViewOrder={handleViewOrder}
                onDeleteOrder={handleDeleteOrder}
                onClearError={clearError}
            />
        );
    }, [
        activeTab,
        cart,
        handleUpdateQuantity,
        handleRemoveItem,
        handleClearCart,
        handleOpenCheckout,
        orders,
        loading,
        error,
        searchTerm,
        handleSearch,
        handleViewOrder,
        handleDeleteOrder,
        clearError
    ]);

    if (storeProfileLoading) {
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

    return (
        <div className="min-h-screen bg-gray-50">
            <CartHeader onAddProducts={() => setIsAddProductModalOpen(true)} />
            
            <CartTabs 
                activeTab={activeTab}
                onTabChange={setActiveTab}
                ordersCount={orders.length}
            />

            <div className="py-6">
                {activeTabContent}
            </div>

            {/* Modal para agregar productos */}
            <AddProductToCartModal
                isOpen={isAddProductModalOpen}
                onClose={() => setIsAddProductModalOpen(false)}
                products={products}
                categories={categories}
                productsLoading={productsLoading}
                onAddToCart={handleAddToCart}
                onOpenCheckout={handleOpenCheckout}
            />

            {/* Modal para ver detalles del pedido */}
            <OrderDetailsModal
                order={selectedOrder}
                isOpen={isOrderDetailsModalOpen}
                onClose={handleCloseOrderDetails}
                onUpdateStatus={handleUpdateOrderStatus}
                onDelete={handleDeleteOrder}
            />

            {/* Modal de Checkout B2B */}
            <B2BCheckoutModal
                isOpen={isCheckoutModalOpen}
                onClose={handleCloseCheckout}
                cart={cart}
                onSubmitOrder={handleSubmitOrder}
                onUpdateQuantity={handleUpdateQuantity}
                onRemoveItem={handleRemoveItem}
                onClearCart={handleClearCart}
                isSubmitting={isSubmitting}
            />
        </div>
    );
};

