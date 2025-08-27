export interface Product {
    id: string | number;
    name: string;
    brand: string;
    sku?: string;
    basePrice: number;
    yourPrice: number;
    originalPrice?: number;
    price?: number;
    description?: string;
    image: string;
    images?: string[];
    isNew: boolean;
    discount?: number;
    rating?: number;
    reviews?: number;
    inStock?: boolean;
    buyingPrice?: number;
    profit?: number;
    benefits?: string[];
    options?: {
        color?: string[];
        diameter?: string[];
        width?: string[];
    };
    compatibleWith?: string;
    warranty?: string;
    deliveryTime?: string;
}

export interface Category {
    name: string;
    image: string;
    isAdd?: boolean;
}

export interface StoreStats {
    icon: React.ComponentType<{ className?: string }> | string;
    label: string;
    value: string;
    color: string;
}

// Nuevas interfaces para Store y StoreProfile
export interface Store {
    id: string;
    lord_id: string;
    profile_id: string;
    created_at?: string;
    updated_at?: string;
}

export interface StoreProfile {
    id: string;
    name: string;
    description?: string;
    phone?: string;
    banner_image?: string;
    logo_image?: string;
    web_url?: string;
    whatsapp_url?: string;
    type_store?: bigint;
    address?: bigint;
    email?: bigint;
    created_at?: string;
    updated_at?: string;
}

export interface StoreType {
    id: bigint;
    name: string;
    description?: string;
    created_at?: Date;
    updated_at?: Date;
}

export interface StoreCategoryConfig {
    id: number;
    store_id: number;
    category_code: string;
    is_active: boolean;
    display_order: number;
    created_at: string;
    updated_at: string;
}

export interface StoreProductConfig {
    id: number;
    store_id: number;
    product_sku: string;
    is_active: boolean;
    is_featured: boolean;
    display_order: number;
    custom_price: number | null;
    stock_quantity: number;
    custom_profit: number | null;
    created_at: string;
    updated_at: string;
}

export interface StoreConfigData {
    categories: StoreCategoryConfig[];
    products: StoreProductConfig[];
    loading: boolean;
    error: string | null;
}

// Nuevo tipo solo para productos
export interface StoreProductsConfigData {
    products: StoreProductConfig[];
    loading: boolean;
    error: string | null;
}
