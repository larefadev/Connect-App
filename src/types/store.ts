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
    icon: any;
    label: string;
    value: string;
    color: string;
}
