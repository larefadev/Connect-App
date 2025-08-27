import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  SKU: string;
  Nombre: string;
  Precio: number;
  Imagen?: string;
  Categoria?: string;
  Marca?: string;
  quantity: number;
  totalPrice: number;
}

export interface CartStore {
  items: CartItem[];
  storeId: number | null;
  customerInfo: {
    name: string;
    email: string;
    phone: string;
    document: string;
    deliveryAddress: string;
    deliveryCity: string;
    deliveryState: string;
    deliveryPostalCode: string;
    deliveryNotes: string;
  };
  
  // Acciones del carrito
  addItem: (product: Omit<CartItem, 'quantity' | 'totalPrice'>) => void;
  removeItem: (sku: string) => void;
  updateQuantity: (sku: string, quantity: number) => void;
  clearCart: () => void;
  setStoreId: (storeId: number) => void;
  
  // Acciones de información del cliente
  updateCustomerInfo: (info: Partial<CartStore['customerInfo']>) => void;
  
  // Cálculos
  getTotalItems: () => number;
  getSubtotal: () => number;
  getTaxAmount: () => number;
  getShippingCost: () => number;
  getTotalAmount: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      storeId: null,
      customerInfo: {
        name: '',
        email: '',
        phone: '',
        document: '',
        deliveryAddress: '',
        deliveryCity: '',
        deliveryState: '',
        deliveryPostalCode: '',
        deliveryNotes: '',
      },

      addItem: (product) => {
        set((state) => {
          const existingItem = state.items.find(item => item.SKU === product.SKU);
          
          if (existingItem) {
            // Si el item ya existe, incrementar cantidad
            const updatedItems = state.items.map(item =>
              item.SKU === product.SKU
                ? {
                    ...item,
                    quantity: item.quantity + 1,
                    totalPrice: (item.quantity + 1) * item.Precio
                  }
                : item
            );
            return { items: updatedItems };
          } else {
            // Si es un nuevo item, agregarlo
            const newItem: CartItem = {
              ...product,
              quantity: 1,
              totalPrice: product.Precio
            };
            return { items: [...state.items, newItem] };
          }
        });
      },

      removeItem: (sku) => {
        set((state) => ({
          items: state.items.filter(item => item.SKU !== sku)
        }));
      },

      updateQuantity: (sku, quantity) => {
        if (quantity <= 0) {
          get().removeItem(sku);
          return;
        }

        set((state) => ({
          items: state.items.map(item =>
            item.SKU === sku
              ? {
                  ...item,
                  quantity,
                  totalPrice: quantity * item.Precio
                }
              : item
          )
        }));
      },

      clearCart: () => {
        set({ items: [] });
      },

      setStoreId: (storeId) => {
        set({ storeId });
      },

      updateCustomerInfo: (info) => {
        set((state) => ({
          customerInfo: { ...state.customerInfo, ...info }
        }));
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getSubtotal: () => {
        return get().items.reduce((total, item) => total + item.totalPrice, 0);
      },

      getTaxAmount: () => {
        // 12% de IVA (ajustar según el país)
        return get().getSubtotal() * 0.12;
      },

      getShippingCost: () => {
        // Envío gratuito para pedidos mayores a $50
        const subtotal = get().getSubtotal();
        return subtotal >= 50 ? 0 : 5.99;
      },

      getTotalAmount: () => {
        const subtotal = get().getSubtotal();
        const tax = get().getTaxAmount();
        const shipping = get().getShippingCost();
        return subtotal + tax + shipping;
      },
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({
        items: state.items,
        storeId: state.storeId,
        customerInfo: state.customerInfo,
      }),
    }
  )
);
