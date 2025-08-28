import { useState, useCallback } from 'react';
import supabase from '@/lib/Supabase';
import { Order, OrderItem } from '@/stores/orderStore';
import { CartItem } from '@/stores/cartStore';

export interface CreateOrderData {
  store_id: number;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_document: string;
  delivery_address: string;
  delivery_city: string;
  delivery_state: string;
  delivery_postal_code: string;
  delivery_notes: string;
  order_status: 'pending' | 'confirmed' | 'preparing' | 'shipped' | 'delivered' | 'cancelled';
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  payment_method: string;
  subtotal: number;
  tax_amount: number;
  discount_amount: number;
  shipping_cost: number;
  total_amount: number;
  currency: string;
  notes?: string;
  items: CartItem[];
}

export const useOrderOperations = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Generar número de pedido único
  const generateOrderNumber = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    
    return `ORD-${year}-${month}${day}-${random}`;
  };

  // Crear pedido en la base de datos
  const createOrder = async (orderData: CreateOrderData): Promise<Order> => {
    setLoading(true);
    setError(null);

    try {
      const orderNumber = generateOrderNumber();
      const now = new Date().toISOString();

      // 1. Crear el pedido principal
      const { data: orderResult, error: orderError } = await supabase
        .from('orders_test')
        .insert({
          order_number: orderNumber,
          store_id: orderData.store_id,
          customer_name: orderData.customer_name,
          customer_email: orderData.customer_email,
          customer_phone: orderData.customer_phone,
          customer_document: orderData.customer_document,
          delivery_address: orderData.delivery_address,
          delivery_city: orderData.delivery_city,
          delivery_state: orderData.delivery_state,
          delivery_postal_code: orderData.delivery_postal_code,
          delivery_notes: orderData.delivery_notes,
          order_status: orderData.order_status,
          payment_status: orderData.payment_status,
          payment_method: orderData.payment_method,
          subtotal: orderData.subtotal,
          tax_amount: orderData.tax_amount,
          discount_amount: orderData.discount_amount,
          shipping_cost: orderData.shipping_cost,
          total_amount: orderData.total_amount,
          currency: orderData.currency,
          notes: orderData.notes,
          created_at: now,
          updated_at: now,
        })
        .select()
        .single();

      if (orderError) {
        throw new Error(`Error al crear el pedido: ${orderError.message}`);
      }

      if (!orderResult) {
        throw new Error('No se pudo crear el pedido');
      }

      // 2. Crear los items del pedido
      
      const orderItems = orderData.items.map(item => {
        const orderItem = {
          order_id: orderResult.id,
          product_sku: item.SKU,
          product_name: item.Nombre,
          product_description: item.Categoria,
          product_image: item.Imagen,
          unit_price: item.Precio,
          quantity: item.quantity,
          total_price: item.totalPrice,
        };
        return orderItem;
      });
      
      const { error: itemsError } = await supabase
        .from('order_items_test')
        .insert(orderItems);

      if (itemsError) {
        // Si falla la creación de items, eliminar el pedido creado
        await supabase
          .from('orders_test')
          .delete()
          .eq('id', orderResult.id);
        
        throw new Error(`Error al crear los items del pedido: ${itemsError.message}`);
      }

      // 3. Construir el objeto Order completo
      const createdOrder: Order = {
        id: orderResult.id,
        order_number: orderResult.order_number,
        store_id: orderResult.store_id,
        customer_name: orderResult.customer_name,
        customer_email: orderResult.customer_email,
        customer_phone: orderResult.customer_phone,
        customer_document: orderResult.customer_document,
        delivery_address: orderResult.delivery_address,
        delivery_city: orderResult.delivery_city,
        delivery_state: orderResult.delivery_state,
        delivery_postal_code: orderResult.delivery_postal_code,
        delivery_notes: orderResult.delivery_notes,
        order_status: orderResult.order_status,
        payment_status: orderResult.payment_status,
        payment_method: orderResult.payment_method,
        subtotal: orderResult.subtotal,
        tax_amount: orderResult.tax_amount,
        discount_amount: orderResult.discount_amount,
        shipping_cost: orderResult.shipping_cost,
        total_amount: orderResult.total_amount,
        currency: orderResult.currency,
        notes: orderResult.notes,
        created_at: orderResult.created_at,
        updated_at: orderResult.updated_at,
        items: orderItems.map(item => ({
          product_sku: item.product_sku,
          product_name: item.product_name,
          product_description: item.product_description,
          product_image: item.product_image,
          unit_price: item.unit_price,
          quantity: item.quantity,
          total_price: item.total_price,
        })),
      };

      setLoading(false);
      return createdOrder;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido al crear el pedido';
      setError(errorMessage);
      setLoading(false);
      throw new Error(errorMessage);
    }
  };

  // Obtener pedidos por tienda
  const getOrdersByStore = useCallback(async (storeId: number): Promise<Order[]> => {
    setLoading(true);
    setError(null);

    try {
      const { data: orders, error: ordersError } = await supabase
        .from('orders_test')
        .select(`
          *,
          order_items_test (
            product_sku,
            product_name,
            product_description,
            product_image,
            unit_price,
            quantity,
            total_price
          )
        `)
        .eq('store_id', storeId)
        .order('created_at', { ascending: false });

      if (ordersError) {
        throw new Error(`Error al obtener los pedidos: ${ordersError.message}`);
      }

      // Transformar los datos al formato esperado
      const transformedOrders: Order[] = (orders || []).map(order => ({
        id: order.id,
        order_number: order.order_number,
        store_id: order.store_id,
        customer_name: order.customer_name,
        customer_email: order.customer_email,
        customer_phone: order.customer_phone,
        customer_document: order.customer_document,
        delivery_address: order.delivery_address,
        delivery_city: order.delivery_city,
        delivery_state: order.delivery_state,
        delivery_postal_code: order.delivery_postal_code,
        delivery_notes: order.delivery_notes,
        order_status: order.order_status,
        payment_status: order.payment_status,
        payment_method: order.payment_method,
        subtotal: order.subtotal,
        tax_amount: order.tax_amount,
        discount_amount: order.discount_amount,
        shipping_cost: order.shipping_cost,
        total_amount: order.total_amount,
        currency: order.currency,
        notes: order.notes,
        created_at: order.created_at,
        updated_at: order.updated_at,
        confirmed_at: order.confirmed_at,
        shipped_at: order.shipped_at,
        delivered_at: order.delivered_at,
        items: (order.order_items_test || []).map((item: any) => ({
          product_sku: item.product_sku,
          product_name: item.product_name,
          product_description: item.product_description,
          product_image: item.product_image,
          unit_price: item.unit_price,
          quantity: item.quantity,
          total_price: item.total_price,
        })),
      }));

      setLoading(false);
      return transformedOrders;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido al obtener los pedidos';
      setError(errorMessage);
      setLoading(false);
      throw new Error(errorMessage);
    }
  }, []);

  // Actualizar estado del pedido
  const updateOrderStatus = async (orderId: number, status: Order['order_status']): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const updateData: {
        order_status: Order['order_status'];
        updated_at: string;
        confirmed_at?: string;
        shipped_at?: string;
        delivered_at?: string;
      } = {
        order_status: status,
        updated_at: new Date().toISOString(),
      };

      // Agregar timestamp específico según el estado
      if (status === 'confirmed') {
        updateData.confirmed_at = new Date().toISOString();
      } else if (status === 'shipped') {
        updateData.shipped_at = new Date().toISOString();
      } else if (status === 'delivered') {
        updateData.delivered_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('orders_test')
        .update(updateData)
        .eq('id', orderId);

      if (error) {
        throw new Error(`Error al actualizar el estado del pedido: ${error.message}`);
      }

      setLoading(false);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido al actualizar el estado';
      setError(errorMessage);
      setLoading(false);
      throw new Error(errorMessage);
    }
  };

  // Actualizar estado de pago
  const updatePaymentStatus = async (orderId: number, status: Order['payment_status']): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase
        .from('orders_test')
        .update({
          payment_status: status,
          updated_at: new Date().toISOString(),
        })
        .eq('id', orderId);

      if (error) {
        throw new Error(`Error al actualizar el estado de pago: ${error.message}`);
      }

      setLoading(false);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido al actualizar el estado de pago';
      setError(errorMessage);
      setLoading(false);
      throw new Error(errorMessage);
    }
  };

  // Limpiar error
  const clearError = () => {
    setError(null);
  };

  return {
    loading,
    error,
    createOrder,
    getOrdersByStore,
    updateOrderStatus,
    updatePaymentStatus,
    clearError,
  };
};
