"use client";
import { ShoppingBag, CheckCircle, XCircle, Package, RefreshCw } from "lucide-react";
import { useStoreProfile } from "@/hooks/StoreProfile/useStoreProfile";
import { useStoreConfig } from "@/hooks/StoreProfile/useStoreConfig";
import { useProducts } from "@/hooks/Products/useProducts";
import { useEffect, useState, useMemo, useCallback } from "react";
import { AddProductModal } from "./AddProductModal";
import { EditProductModal } from "./EditProductModal";
import { useToastContext } from "@/components/providers/ToastProvider";
import { TopBanner } from "./TopBanner";
import { StoreProfileSection } from "./StoreProfileSection";
import { QuickOverview } from "./QuickOverview";
import { StoreLink } from "./StoreLink";
import { ProductGrid } from "./ProductGrid";

export const StorePage = () => {
    const { storeProfile, store, loading } = useStoreProfile();
    const storeId = storeProfile?.id ? Number(storeProfile.id) : null;
    const { success: showSuccess, error: showError, info: showInfo } = useToastContext();
    const { 
        productsWithDetails, 
        loading: configLoading,
        addProductToStore,
        removeProductFromStore,
        toggleProductActive,
        toggleProductFeatured,
        updateProductProfit,
        getAllStoreProducts
    } = useStoreConfig(storeId);
    
    // Hook para productos del catálogo
    const { products, categories, loading: productsLoading } = useProducts();
    
    const [baseUrl, setBaseUrl] = useState<string>("");
    const [selectedTab, setSelectedTab] = useState<'all' | 'available' | 'unavailable'>('all');
    const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
    const [isEditProductModalOpen, setIsEditProductModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<any>(null);
    


    // Obtener la URL base de manera segura en el cliente
    useEffect(() => {
        setBaseUrl(window.location.origin);
    }, []);

    // Calcular estadísticas reales con useMemo para optimización
    const stats = useMemo(() => {
        const totalProducts = productsWithDetails.length;
        const availableProducts = productsWithDetails.filter(p => p.config.is_active).length;
        const unavailableProducts = totalProducts - availableProducts;
        const featuredProducts = productsWithDetails.filter(p => p.config.is_active && p.config.is_featured).length;

        return [
            { icon: ShoppingBag, label: "Total de Productos de la Tienda", value: totalProducts.toString(), color: "text-purple-600" },
            { icon: CheckCircle, label: "Productos Disponibles", value: availableProducts.toString(), color: "text-pink-600" },
            { icon: XCircle, label: "Productos No Disponibles", value: unavailableProducts.toString(), color: "text-blue-400" },
            { icon: Package, label: "Productos Destacados", value: featuredProducts.toString(), color: "text-blue-400" }
        ];
    }, [productsWithDetails]);

    // Calcular estadísticas individuales para ProductGrid
    const availableProducts = useMemo(() => 
        productsWithDetails.filter(p => p.config.is_active).length, 
        [productsWithDetails]
    );
    
    const unavailableProducts = useMemo(() => 
        productsWithDetails.length - availableProducts, 
        [productsWithDetails.length, availableProducts]
    );

    // Filtrar productos según la pestaña seleccionada con useMemo
    const filteredProducts = useMemo(() => {
        switch (selectedTab) {
            case 'available':
                return productsWithDetails.filter(p => p.config.is_active);
            case 'unavailable':
                return productsWithDetails.filter(p => !p.config.is_active);
            default:
                return productsWithDetails;
        }
    }, [productsWithDetails, selectedTab]);

    const handleRemoveProduct = useCallback(async (productSku: string) => {
        const success = await removeProductFromStore(productSku);
        if (success) {
            showSuccess('Producto removido exitosamente');
        }
    }, [removeProductFromStore, showSuccess]);

    const handleToggleProductActive = useCallback(async (productSku: string, isActive: boolean) => {
        const success = await toggleProductActive(productSku, isActive);
        if (success) {
            showSuccess('Estado del producto cambiado exitosamente');
        }
    }, [toggleProductActive, showSuccess]);

    const handleToggleProductFeatured = useCallback(async (productSku: string, isFeatured: boolean) => {
        const success = await toggleProductFeatured(productSku, isFeatured);
        if (success) {
            showSuccess('Estado destacado del producto cambiado exitosamente');
        }
    }, [toggleProductFeatured, showSuccess]);

    const getPublicStoreUrl = useCallback(() => {
        if (storeProfile?.name && baseUrl) {
            const storeSlug = storeProfile.name
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-+|-+$/g, '');
            return `${baseUrl}/store/public/${storeSlug}`;
        }

        return baseUrl ? `${baseUrl}/store/public/default` : "/store/public/default";
    }, [storeProfile?.name, baseUrl]);

    // Manejar edición de producto
    const handleEditProduct = useCallback((product: any) => {
        setEditingProduct(product);
        setIsEditProductModalOpen(true);
    }, []);

    // Manejar guardado de producto editado
    const handleSaveProduct = useCallback(async (productSku: string, updates: any) => {
        try {
            // Actualizar la ganancia en la configuración de la tienda
            const result = await updateProductProfit(productSku, updates.Ganancia || 0);
            if (result) {
                showSuccess('Ganancia actualizada exitosamente');
                // Forzar actualización de la lista de productos
                await getAllStoreProducts();
                return true;
            }
            return false;
        } catch (error) {
            console.error("Error al actualizar producto:", error);
            showError('Error al actualizar la ganancia del producto');
            return false;
        }
    }, [updateProductProfit, showSuccess, showError, getAllStoreProducts]);

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

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Top Banner */}
            {storeProfile && <TopBanner storeProfile={storeProfile} />}
            
            {/* Store Profile Section */}
            {storeProfile && <StoreProfileSection storeProfile={storeProfile} />}

            {/* Quick Overview */}
            {storeProfile && <QuickOverview stats={stats} />}

            {/* Products */}
            <ProductGrid
                productsWithDetails={productsWithDetails}
                filteredProducts={filteredProducts}
                selectedTab={selectedTab}
                setSelectedTab={setSelectedTab}
                availableProducts={availableProducts}
                unavailableProducts={unavailableProducts}
                handleToggleProductFeatured={handleToggleProductFeatured}
                handleRemoveProduct={handleRemoveProduct}
                handleToggleProductActive={handleToggleProductActive}
                handleEditProduct={handleEditProduct}
                setIsAddProductModalOpen={setIsAddProductModalOpen}
            />

            {/* Public Store Link */}
            {storeProfile && <StoreLink getPublicStoreUrl={getPublicStoreUrl} />}
            
            {/* Add Product Modal */}
            <AddProductModal
                isOpen={isAddProductModalOpen}
                onClose={() => setIsAddProductModalOpen(false)}
                storeId={storeProfile?.id ? Number(storeProfile.id) : 0}
                // Hooks heredados del componente padre
                products={products}
                categories={categories}
                productsLoading={productsLoading}
                addProductToStore={addProductToStore}
                getAllStoreProducts={getAllStoreProducts}
                showSuccess={showSuccess}
                showError={showError}
                showInfo={showInfo}
            />

            {/* Edit Product Modal */}
            <EditProductModal
                isOpen={isEditProductModalOpen}
                onClose={() => {
                    setIsEditProductModalOpen(false);
                    setEditingProduct(null);
                }}
                product={editingProduct}
                categories={categories}
                onSave={handleSaveProduct}
            />
        </div>
    );
};