"use client";

import { Store, Globe, Phone, Copy, MoreVertical, ShoppingBag, CheckCircle, XCircle, Package, Plus, Eye, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { useStoreProfile } from "@/hooks/StoreProfile/useStoreProfile";
import { useStoreConfig } from "@/hooks/StoreProfile/useStoreConfig";
import { useProducts } from "@/hooks/Products/useProducts";
import { useEffect, useState } from "react";
import { AddProductModal } from "./AddProductModal";
import { ProductImage } from "@/components/ui/product-image";
import { useToastContext } from "@/components/providers/ToastProvider";

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
        toggleProductFeatured
    } = useStoreConfig(storeId);
    
    const { products: allProducts } = useProducts();
    const [baseUrl, setBaseUrl] = useState<string>("");
    const [selectedTab, setSelectedTab] = useState<'all' | 'available' | 'unavailable'>('all');
    const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
    


    // Obtener la URL base de manera segura en el cliente
    useEffect(() => {
        setBaseUrl(window.location.origin);
    }, []);

    // Calcular estadísticas reales
    const totalProducts = productsWithDetails.length;
    const availableProducts = productsWithDetails.filter(p => p.config.is_active).length;
    const unavailableProducts = totalProducts - availableProducts;
    const featuredProducts = productsWithDetails.filter(p => p.config.is_active && p.config.is_featured).length;


    const stats = [
        { icon: ShoppingBag, label: "Total de Productos de la Tienda", value: totalProducts.toString(), color: "text-purple-600" },
        { icon: CheckCircle, label: "Productos Disponibles", value: availableProducts.toString(), color: "text-pink-600" },
        { icon: XCircle, label: "Productos No Disponibles", value: unavailableProducts.toString(), color: "text-blue-400" },
        { icon: Package, label: "Productos Destacados", value: featuredProducts.toString(), color: "text-blue-400" }
    ];

    // Filtrar productos según la pestaña seleccionada
    const getFilteredProducts = () => {
        switch (selectedTab) {
            case 'available':
                return productsWithDetails.filter(p => p.config.is_active);
            case 'unavailable':
                return productsWithDetails.filter(p => !p.config.is_active);
            default:
                return productsWithDetails;
        }
    };

    const filteredProducts = getFilteredProducts();

    // Función para agregar producto a la tienda
    const handleAddProduct = async (productSku: string) => {
        const success = await addProductToStore(productSku);
        if (success) {
            showSuccess('Producto agregado exitosamente');
        }
    };

    // Función para remover producto de la tienda
    const handleRemoveProduct = async (productSku: string) => {
        const success = await removeProductFromStore(productSku);
        if (success) {
            showSuccess('Producto removido exitosamente');
        }
    };

    // Función para cambiar estado activo del producto
    const handleToggleProductActive = async (productSku: string, isActive: boolean) => {
        const success = await toggleProductActive(productSku, isActive);
        if (success) {
            showSuccess('Estado del producto cambiado exitosamente');
        }
    };

    // Función para cambiar estado destacado del producto
    const handleToggleProductFeatured = async (productSku: string, isFeatured: boolean) => {
        const success = await toggleProductFeatured(productSku, isFeatured);
        if (success) {
            showSuccess('Estado destacado del producto cambiado exitosamente');
        }
    };

    const getPublicStoreUrl = () => {
        if (storeProfile?.name && baseUrl) {
            const storeSlug = storeProfile.name
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-+|-+$/g, '');
            return `${baseUrl}/store/public/${storeSlug}`;
        }

        return baseUrl ? `${baseUrl}/store/public/default` : "/store/public/default";
    };

    const getProductUrl = (productSku: string) => {
        if (storeProfile?.name && baseUrl) {
            const storeSlug = storeProfile.name
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-+|-+$/g, '');
            return `${baseUrl}/store/public/${storeSlug}/product/${productSku}`;
        }
        return baseUrl ? `${baseUrl}/store/public/default/product/${productSku}` : `/store/public/default/product/${productSku}`;
    };

    if (loading || !baseUrl) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto mb-4"></div>
                    <p className="text-gray-600">Cargando información de la tienda...</p>
                </div>
            </div>
        );
    }

    // Mostrar loading solo si no hay storeId o si está cargando la configuración
    if (!storeId || configLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto mb-4"></div>
                    <p className="text-gray-600">
                        {!storeId ? 'Cargando perfil de tienda...' : 'Cargando configuración de productos...'}
                    </p>
                    <div className="text-sm text-gray-500 mt-2">
                        <p>Store ID: {storeId || 'No establecido'}</p>
                        <p>Config Loading: {configLoading ? 'Sí' : 'No'}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Top Banner */}
            <div className="relative bg-gray-800 text-white py-16 px-6 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-gray-700 opacity-90"></div>
                <div className="relative z-10 max-w-7xl mx-auto flex justify-between items-center">
                    <div className="flex-1">
                        <h1 className="text-4xl font-bold mb-4">Rápido, Asequible, Entregado a tu Puerta</h1>
                        <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg">
                            Comprar ahora
                        </Button>
                    </div>
                    <div className="hidden lg:block">
                        <div className="w-32 h-32 bg-gray-600 rounded-full opacity-20"></div>
                    </div>
                </div>
            </div>

            {/* Store Profile Section */}
            <div className="max-w-7xl mx-auto px-6 -mt-8 relative z-20">
                <Card className="shadow-lg">
                    <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center">
                                    <Store className="w-10 h-10 text-white" />
                                </div>
                                <div>
                                    <div className="flex items-center space-x-3 mb-2">
                                        <h2 className="text-3xl font-bold">{storeProfile?.name || "Repuestos Automotrices"}</h2>
                                        <Badge className="bg-red-500 text-white">gratis</Badge>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center space-x-2 text-gray-600">
                                            <Globe className="w-4 h-4" />
                                            <span>{storeProfile?.name ? `${storeProfile.name.toLowerCase().replace(/\s+/g, '')}.larefa.com` : "autoparts.larefa.com"}</span>
                                            <Button variant="ghost" size="sm" className="p-1 h-auto">
                                                <Copy className="w-3 h-3" />
                                            </Button>
                                        </div>
                                        <div className="flex items-center space-x-2 text-gray-600">
                                            <Phone className="w-4 h-4" />
                                            <span>{"1 888 235 9826"}</span>
                                            <Button variant="ghost" size="sm" className="p-1 h-auto">
                                                <Copy className="w-3 h-3" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <Button variant="ghost" size="sm">
                                <MoreVertical className="w-5 h-5" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Overview */}
            <div className="max-w-7xl mx-auto px-6 mt-8">
                <h3 className="text-2xl font-bold mb-6">Vista Rápida</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, index) => (
                        <Card key={index} className="bg-white shadow-md">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <stat.icon className={`w-8 h-8 ${stat.color}`} />
                                    <Button variant="ghost" size="sm">
                                        <MoreVertical className="w-4 h-4" />
                                    </Button>
                                </div>
                                <p className="text-gray-600 text-sm mb-2">{stat.label}</p>
                                <p className="text-3xl font-bold">{stat.value}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Products */}
            <div className="max-w-7xl mx-auto px-6 mt-12 mb-12">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold">Mis Productos</h3>
                    <Link href="/store/products" className="text-red-500 hover:text-red-600 font-medium">
                        Ver todos
                    </Link>
                </div>
                
                {/* Tabs */}
                <div className="flex space-x-1 mb-6">
                    <Button 
                        variant={selectedTab === 'all' ? 'default' : 'outline'} 
                        className="rounded-full"
                        onClick={() => setSelectedTab('all')}
                    >
                        Todos ({productsWithDetails.length})
                    </Button>
                    <Button 
                        variant={selectedTab === 'available' ? 'default' : 'outline'} 
                        className="rounded-full"
                        onClick={() => setSelectedTab('available')}
                    >
                        Disponibles ({availableProducts})
                    </Button>
                    <Button 
                        variant={selectedTab === 'unavailable' ? 'default' : 'outline'} 
                        className="rounded-full"
                        onClick={() => setSelectedTab('unavailable')}
                    >
                        No Disponibles ({unavailableProducts})
                    </Button>
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {filteredProducts.length > 0 ? (
                        filteredProducts.map((product) => (
                            <div key={product.SKU} className="relative">
                                <Card className="bg-white shadow-md hover:shadow-lg transition-shadow">
                                    <CardContent className="p-4">
                                        <div className="relative mb-3">
                                            <ProductImage
                                                src={product.Imagen}
                                                alt={product.Nombre || 'Producto'}
                                                className="w-full h-32 object-cover rounded-lg"
                                            />
                                            {product.config.is_featured && (
                                                <Badge className="absolute top-2 left-2 bg-orange-500 text-white text-xs">
                                                    Destacado
                                                </Badge>
                                            )}
                                            <div className="absolute top-2 right-2 flex space-x-1">
                                                <Button 
                                                    variant="ghost" 
                                                    size="sm" 
                                                    className="p-1 h-auto bg-white/80 hover:bg-white"
                                                    onClick={() => handleToggleProductFeatured(product.SKU, !product.config.is_featured)}
                                                >
                                                    <ShoppingCart className="w-4 h-4 text-pink-500" />
                                                </Button>
                                                <Button 
                                                    variant="ghost" 
                                                    size="sm" 
                                                    className="p-1 h-auto bg-white/80 hover:bg-white"
                                                    onClick={() => handleRemoveProduct(product.SKU)}
                                                >
                                                    <XCircle className="w-4 h-4 text-red-500" />
                                                </Button>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <h4 className="font-medium">{product.Nombre}</h4>
                                            <p className="text-sm text-gray-600">Marca: {product.Marca}</p>
                                            <div className="space-y-1">
                                                <p className="text-sm text-gray-500">
                                                    Precio Base ${product.Precio?.toFixed(2) || '0.00'}
                                                </p>
                                                <p className="text-sm font-medium">
                                                    Tu Precio ${product.config.custom_price?.toFixed(2) || product.Precio?.toFixed(2) || '0.00'}
                                                </p>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <Badge 
                                                    variant={product.config.is_active ? 'default' : 'secondary'}
                                                    className={product.config.is_active ? 'bg-green-500' : 'bg-gray-500'}
                                                >
                                                    {product.config.is_active ? 'Disponible' : 'No Disponible'}
                                                </Badge>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleToggleProductActive(product.SKU, !product.config.is_active)}
                                                >
                                                    {product.config.is_active ? 'Desactivar' : 'Activar'}
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-12">
                            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay productos en esta categoría</h3>
                            <p className="text-gray-500 mb-4">Agrega productos desde el catálogo para comenzar a vender</p>
                            <Button 
                                onClick={() => setIsAddProductModalOpen(true)}
                                className="bg-red-600 hover:bg-red-700"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Agregar Productos
                            </Button>
                        </div>
                    )}
                </div>

                {/* Add Products Section */}
                {/* This section is now handled by the conditional rendering above */}
            </div>

            {/* Public Store Link */}
            <div className="max-w-7xl mx-auto px-6 mb-8">
                <Card className="bg-blue-50 border-blue-200">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h4 className="text-lg font-semibold text-blue-900 mb-2">Tu Tienda Pública</h4>
                                <p className="text-blue-700 mb-3">
                                    Comparte este enlace con tus clientes para que puedan ver tu catálogo público sin acceso al dashboard.
                                </p>
                                <div className="flex items-center space-x-2">
                                    <input 
                                        type="text" 
                                        value={getPublicStoreUrl()}
                                        readOnly 
                                        className="px-3 py-2 border border-blue-300 rounded-md bg-white text-blue-900 flex-1"
                                    />
                                    <Button 
                                        variant="outline" 
                                        size="sm"
                                        onClick={() => navigator.clipboard.writeText(getPublicStoreUrl())}
                                    >
                                        <Copy className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                            <Link href={getPublicStoreUrl()} target="_blank">
                                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                                    <Eye className="w-4 h-4 mr-2" />
                                    Ver Tienda Pública
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Add Product Modal */}
            <AddProductModal
                isOpen={isAddProductModalOpen}
                onClose={() => setIsAddProductModalOpen(false)}
                storeId={storeProfile?.id ? Number(storeProfile.id) : 0}
            />
        </div>
    );
};