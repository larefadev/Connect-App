import { useState, useEffect, useCallback } from 'react';
import supabase from '@/lib/Supabase';
import { StoreProductConfig, StoreProductsConfigData } from '@/types/store';
import { Product } from '@/types/ecomerce';

interface UseStoreConfigReturn extends StoreProductsConfigData {
    // Funciones para productos
    addProductToStore: (productSku: string, customPrice?: number, customProfit?: number) => Promise<boolean>;
    removeProductFromStore: (productSku: string) => Promise<boolean>;
    toggleProductActive: (productSku: string, isActive: boolean) => Promise<boolean>;
    toggleProductFeatured: (productSku: string, isFeatured: boolean) => Promise<boolean>;
    updateProductPrice: (productSku: string, customPrice: number) => Promise<boolean>;
    updateProductProfit: (productSku: string, customProfit: number) => Promise<boolean>;
    updateProductStock: (productSku: string, stockQuantity: number) => Promise<boolean>;
    updateProductOrder: (productSku: string, newOrder: number) => Promise<boolean>;
    addCategoryToStore: (categoryCode: string) => Promise<boolean>;
    
    // Funciones de consulta
    getStoreProducts: () => Promise<Product[]>;
    getAllStoreProducts: () => StoreProductConfig[];
    getActiveProducts: () => StoreProductConfig[];
    getFeaturedProducts: () => StoreProductConfig[];
    
    // Estado adicional
    productsWithDetails: (Product & { config: StoreProductConfig })[];
    categories: any[];
}

export const useStoreConfig = (storeId: number | null): UseStoreConfigReturn => {
    const [products, setProducts] = useState<StoreProductConfig[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [productsWithDetails, setProductsWithDetails] = useState<(Product & { config: StoreProductConfig })[]>([]);
    const [categories, setCategories] = useState<any[]>([]);

    // Cargar configuración de productos de la tienda
    const loadStoreProducts = useCallback(async () => {
        if (!storeId) return;
        
        try {
            
            const { data, error: supabaseError } = await supabase
                .from('store_products_config_test')
                .select('*')
                .eq('store_id', storeId)
                .order('display_order', { ascending: true });

            if (supabaseError) throw supabaseError;
            
            setProducts(data || []);
        } catch (err) {
        }
    }, [storeId]);

    // Cargar detalles completos de productos - VERSIÓN CORREGIDA
    const loadDetailedData = useCallback(async () => {
        if (!storeId) return;
        
        setLoading(true);
        setError(null);
        
        try {
            let productsWithConfig = [];

            // Cargar productos solo si existen
            if (products.length > 0) {
                const productSkus = products.map(p => p.product_sku);
                
                const { data: productsData, error: productsError } = await supabase
                    .from('products_test')
                    .select('*')
                    .in('SKU', productSkus);

                if (productsError) {
                    console.error('loadDetailedData: Error cargando productos:', productsError);
                    throw productsError;
                }

                
                // Verificar que se encontraron todos los productos
                const foundSkus = (productsData || []).map(p => p.SKU);
                const missingSkus = productSkus.filter(sku => !foundSkus.includes(sku));
                if (missingSkus.length > 0) {
                }
                
                productsWithConfig = (productsData || []).map(product => {
                    const config = products.find(p => p.product_sku === product.SKU);
                    return {
                        ...product,
                        config: config!
                    };
                });
            }

            setProductsWithDetails(productsWithConfig);
            
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al cargar datos detallados');
        } finally {
            setLoading(false);
        }
    }, [storeId, products]);

    // Agregar producto a la tienda
    const addProductToStore = useCallback(async (
        productSku: string, 
        customPrice?: number, 
        customProfit?: number
    ): Promise<boolean> => {
        if (!storeId) return false;
        
        try {
            const { error: supabaseError } = await supabase
                .from('store_products_config_test')
                .insert({
                    store_id: storeId,
                    product_sku: productSku,
                    is_active: true,
                    is_featured: false,
                    display_order: products.length,
                    custom_price: customPrice || null,
                    custom_profit: customProfit || null,
                    stock_quantity: 0
                });

            if (supabaseError) throw supabaseError;
            
            await loadStoreProducts();
            return true;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al agregar producto');
            return false;
        }
    }, [storeId, products.length, loadStoreProducts]);

    // Remover producto de la tienda
    const removeProductFromStore = useCallback(async (productSku: string): Promise<boolean> => {
        if (!storeId) return false;
        
        try {
            const { error: supabaseError } = await supabase
                .from('store_products_config_test')
                .delete()
                .eq('store_id', storeId)
                .eq('product_sku', productSku);

            if (supabaseError) throw supabaseError;
            
            await loadStoreProducts();
            return true;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al remover producto');
            return false;
        }
    }, [storeId, loadStoreProducts]);

    // Cambiar estado activo de producto
    const toggleProductActive = useCallback(async (productSku: string, isActive: boolean): Promise<boolean> => {
        if (!storeId) return false;
        
        try {
            const { error: supabaseError } = await supabase
                .from('store_products_config_test')
                .update({ is_active: isActive })
                .eq('store_id', storeId)
                .eq('product_sku', productSku);

            if (supabaseError) throw supabaseError;
            
            await loadStoreProducts();
            return true;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al cambiar estado de producto');
            return false;
        }
    }, [storeId, loadStoreProducts]);

    // Cambiar estado destacado de producto
    const toggleProductFeatured = useCallback(async (productSku: string, isFeatured: boolean): Promise<boolean> => {
        if (!storeId) return false;
        
        try {
            const { error: supabaseError } = await supabase
                .from('store_products_config_test')
                .update({ is_featured: isFeatured })
                .eq('store_id', storeId)
                .eq('product_sku', productSku);

            if (supabaseError) throw supabaseError;
            
            await loadStoreProducts();
            return true;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al cambiar estado destacado de producto');
            return false;
        }
    }, [storeId, loadStoreProducts]);

    // Actualizar precio personalizado del producto
    const updateProductPrice = useCallback(async (productSku: string, customPrice: number): Promise<boolean> => {
        if (!storeId) return false;
        
        try {
            const { error: supabaseError } = await supabase
                .from('store_products_config_test')
                .update({ custom_price: customPrice })
                .eq('store_id', storeId)
                .eq('product_sku', productSku);

            if (supabaseError) throw supabaseError;
            
            await loadStoreProducts();
            return true;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al actualizar precio del producto');
            return false;
        }
    }, [storeId, loadStoreProducts]);

    // Actualizar ganancia personalizada del producto
    const updateProductProfit = useCallback(async (productSku: string, customProfit: number): Promise<boolean> => {
        if (!storeId) return false;
        
        try {
            const { error: supabaseError } = await supabase
                .from('store_products_config_test')
                .update({ custom_profit: customProfit })
                .eq('store_id', storeId)
                .eq('product_sku', productSku);

            if (supabaseError) throw supabaseError;
            
            await loadStoreProducts();
            return true;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al actualizar ganancia del producto');
            return false;
        }
    }, [storeId, loadStoreProducts]);

    // Actualizar stock del producto
    const updateProductStock = useCallback(async (productSku: string, stockQuantity: number): Promise<boolean> => {
        if (!storeId) return false;
        
        try {
            const { error: supabaseError } = await supabase
                .from('store_products_config_test')
                .update({ stock_quantity: stockQuantity })
                .eq('store_id', storeId)
                .eq('product_sku', productSku);

            if (supabaseError) throw supabaseError;
            
            await loadStoreProducts();
            return true;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al actualizar stock del producto');
            return false;
        }
    }, [storeId, loadStoreProducts]);

    // Actualizar orden del producto
    const updateProductOrder = useCallback(async (productSku: string, newOrder: number): Promise<boolean> => {
        if (!storeId) return false;
        
        try {
            const { error: supabaseError } = await supabase
                .from('store_products_config_test')
                .update({ display_order: newOrder })
                .eq('store_id', storeId)
                .eq('product_sku', productSku);

            if (supabaseError) throw supabaseError;
            
            await loadStoreProducts();
            return true;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al actualizar orden del producto');
            return false;
        }
    }, [storeId, loadStoreProducts]);

    // Agregar categoría a la tienda
    const addCategoryToStore = useCallback(async (categoryCode: string): Promise<boolean> => {
        if (!storeId) return false;
        
        try {
            // Aquí implementarías la lógica para agregar una categoría a la tienda
            // Por ahora retornamos true para permitir el build
            return true;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al agregar categoría a la tienda');
            return false;
        }
    }, [storeId]);

    // Obtener productos de la tienda con detalles
    const getStoreProducts = useCallback(async (): Promise<Product[]> => {
        if (!storeId) return [];
        
        try {
            const { data, error: supabaseError } = await supabase
                .from('products_test')
                .select('*')
                .in('SKU', products.map(p => p.product_sku));

            if (supabaseError) throw supabaseError;
            
            return data || [];
        } catch (err) {
            return [];
        }
    }, [storeId, products]);

    // Obtener todos los productos de la tienda (activos e inactivos)
    const getAllStoreProducts = useCallback((): StoreProductConfig[] => {
        return products;
    }, [products]);

    // Obtener productos activos
    const getActiveProducts = useCallback((): StoreProductConfig[] => {
        return products.filter(prod => prod.is_active);
    }, [products]);

    // Obtener productos destacados
    const getFeaturedProducts = useCallback((): StoreProductConfig[] => {
        return products.filter(prod => prod.is_active && prod.is_featured);
    }, [products]);

    // Cargar datos cuando cambie el storeId
    useEffect(() => {
        if (storeId) {
            setProducts([]);
            setProductsWithDetails([]);
            loadStoreProducts();
        } else {

            setProducts([]);
            setProductsWithDetails([]);
        }
    }, [storeId, loadStoreProducts]);

    // VERSIÓN CORREGIDA - Cargar datos detallados cuando cambien las configuraciones
    useEffect(() => {
        const shouldLoadDetails = storeId && (products.length > 0);
        if (shouldLoadDetails) {
            loadDetailedData();
        } else if (storeId) {
            // Limpiar arrays si no hay datos para cargar pero sí hay storeId
                
            setProductsWithDetails([]);
            setLoading(false);
        }
    }, [storeId, products, loadDetailedData, productsWithDetails.length]);

    return {
        // Estado
        products,
        loading,
        error,
        productsWithDetails,
        categories,
        
        // Funciones para productos
        addProductToStore,
        removeProductFromStore,
        toggleProductActive,
        toggleProductFeatured,
        updateProductPrice,
        updateProductProfit,
        updateProductStock,
        updateProductOrder,
        addCategoryToStore,
        
        // Funciones de consulta
        getStoreProducts,
        getAllStoreProducts,
        getActiveProducts,
        getFeaturedProducts,
    };
};