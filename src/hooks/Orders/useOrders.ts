import { useEffect, useCallback } from 'react';
import { useOrderStore } from '@/stores/orderStore';
import { useCartStore } from '@/stores/cartStore';
import { Order } from '@/stores/orderStore';
import { useOrderOperations } from './useOrderOperations';

export const useOrders = (storeId?: number) => {
  const {
    orders,
    currentOrder,
    setCurrentOrder,
    addOrder,
    setOrders,
    updateOrder,
    convertCartItemsToOrderItems,
  } = useOrderStore();

  const {
    loading,
    error,
    createOrder: createOrderInDB,
    getOrdersByStore: getOrdersByStoreFromDB,
    updateOrderStatus: updateOrderStatusInDB,
    updatePaymentStatus: updatePaymentStatusInDB,
    clearError,
  } = useOrderOperations();

  const {
    items: cartItems,
    customerInfo,
    getSubtotal,
    getTaxAmount,
    getShippingCost,
    getTotalAmount,
    clearCart,
  } = useCartStore();

  // Función memoizada para obtener pedidos
  const getOrdersByStore = useCallback(async (storeIdParam: number) => {
    try {
      const fetchedOrders = await getOrdersByStoreFromDB(storeIdParam);
      if (fetchedOrders) {
        setOrders(fetchedOrders);
      }
      return fetchedOrders;
    } catch (error) {
      console.error('Error al cargar pedidos:', error);
      throw error;
    }
  }, [getOrdersByStoreFromDB, setOrders]);

  // Cargar pedidos cuando cambie el storeId - SOLO UNA VEZ
  useEffect(() => {
    if (storeId) {
      console.log('useOrders useEffect - cargando pedidos para storeId:', storeId);
      getOrdersByStore(storeId);
    }
  }, [storeId]); // Removido getOrdersByStore de las dependencias

  // Crear un nuevo pedido desde el carrito
  const createOrderFromCart = useCallback(async (paymentMethod: string, notes?: string): Promise<Order> => {
    console.log('createOrderFromCart llamado con:', { paymentMethod, notes, storeId, cartItems: cartItems.length });
    
    if (!storeId) {
      console.error('ID de tienda no disponible');
      throw new Error('ID de tienda no disponible');
    }

    if (cartItems.length === 0) {
      console.error('El carrito está vacío');
      throw new Error('El carrito está vacío');
    }

    if (!customerInfo.name || !customerInfo.email || !customerInfo.phone) {
      console.error('Información del cliente incompleta:', customerInfo);
      throw new Error('Información del cliente incompleta');
    }

    console.log('Cart items antes de convertir:', cartItems);
    
    const orderData = {
      store_id: storeId,
      customer_name: customerInfo.name,
      customer_email: customerInfo.email,
      customer_phone: customerInfo.phone,
      customer_document: customerInfo.document,
      delivery_address: customerInfo.deliveryAddress,
      delivery_city: customerInfo.deliveryCity,
      delivery_state: customerInfo.deliveryState,
      delivery_postal_code: customerInfo.deliveryPostalCode,
      delivery_notes: customerInfo.deliveryNotes,
      order_status: 'pending' as const,
      payment_status: 'pending' as const,
      payment_method: paymentMethod,
      subtotal: getSubtotal(),
      tax_amount: getTaxAmount(),
      discount_amount: 0,
      shipping_cost: getShippingCost(),
      total_amount: getTotalAmount(),
      currency: 'USD',
      notes,
      items: cartItems,
    };
    
    console.log('Order data completo:', orderData);

    try {
      console.log('Llamando a createOrderInDB con datos:', orderData);
      const newOrder = await createOrderInDB(orderData);
      console.log('Pedido creado en DB:', newOrder);
      
      // Agregar el pedido al store local
      addOrder(newOrder);
      
      // Limpiar el carrito después de crear el pedido exitosamente
      clearCart();
      
      return newOrder;
    } catch (error) {
      console.error('Error en createOrderFromCart:', error);
      throw error;
    }
  }, [storeId, cartItems, customerInfo, getSubtotal, getTaxAmount, getShippingCost, getTotalAmount, createOrderInDB, addOrder, clearCart]);

  // Obtener pedidos por estado
  const getOrdersByStatus = useCallback((orders: Order[], status: Order['order_status']) => {
    return orders.filter(order => order.order_status === status);
  }, []);

  // Obtener pedidos por estado de pago
  const getOrdersByPaymentStatus = useCallback((orders: Order[], status: Order['payment_status']) => {
    return orders.filter(order => order.payment_status === status);
  }, []);

  // Obtener estadísticas de pedidos
  const getOrderStats = useCallback((orders: Order[]) => {
    const totalOrders = orders.length;
    const pendingOrders = getOrdersByStatus(orders, 'pending').length;
    const confirmedOrders = getOrdersByStatus(orders, 'confirmed').length;
    const shippedOrders = getOrdersByStatus(orders, 'shipped').length;
    const deliveredOrders = getOrdersByStatus(orders, 'delivered').length;
    const cancelledOrders = getOrdersByStatus(orders, 'cancelled').length;
    
    const totalRevenue = orders
      .filter(order => order.payment_status === 'paid')
      .reduce((sum, order) => sum + order.total_amount, 0);

    return {
      totalOrders,
      pendingOrders,
      confirmedOrders,
      shippedOrders,
      deliveredOrders,
      cancelledOrders,
      totalRevenue,
    };
  }, [getOrdersByStatus]);

  // Marcar pedido como confirmado
  const confirmOrder = useCallback(async (orderId: number) => {
    await updateOrderStatusInDB(orderId, 'confirmed');
    // Recargar pedidos después de actualizar
    if (storeId) {
      await getOrdersByStore(storeId);
    }
  }, [updateOrderStatusInDB, storeId, getOrdersByStore]);

  // Marcar pedido como enviado
  const shipOrder = useCallback(async (orderId: number) => {
    await updateOrderStatusInDB(orderId, 'shipped');
    // Recargar pedidos después de actualizar
    if (storeId) {
      await getOrdersByStore(storeId);
    }
  }, [updateOrderStatusInDB, storeId, getOrdersByStore]);

  // Marcar pedido como entregado
  const deliverOrder = useCallback(async (orderId: number) => {
    await updateOrderStatusInDB(orderId, 'delivered');
    // Recargar pedidos después de actualizar
    if (storeId) {
      await getOrdersByStore(storeId);
    }
  }, [updateOrderStatusInDB, storeId, getOrdersByStore]);

  // Cancelar pedido
  const cancelOrder = useCallback(async (orderId: number) => {
    await updateOrderStatusInDB(orderId, 'cancelled');
    // Recargar pedidos después de actualizar
    if (storeId) {
      await getOrdersByStore(storeId);
    }
  }, [updateOrderStatusInDB, storeId, getOrdersByStore]);

  // Marcar pedido como pagado
  const markOrderAsPaid = useCallback(async (orderId: number) => {
    await updatePaymentStatusInDB(orderId, 'paid');
    // Recargar pedidos después de actualizar
    if (storeId) {
      await getOrdersByStore(storeId);
    }
  }, [updatePaymentStatusInDB, storeId, getOrdersByStore]);

  return {
    // Estado
    orders,
    currentOrder,
    loading,
    error,
    
    // Acciones principales
    createOrderFromCart,
    getOrdersByStore,
    confirmOrder,
    shipOrder,
    deliverOrder,
    cancelOrder,
    markOrderAsPaid,
    setCurrentOrder,
    clearError,
    
    // Utilidades
    getOrdersByStatus,
    getOrdersByPaymentStatus,
    getOrderStats,
    
    // Carrito
    cartItems,
    customerInfo,
    getSubtotal,
    getTaxAmount,
    getShippingCost,
    getTotalAmount,
  };
};