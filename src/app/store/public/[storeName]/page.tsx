"use client";

import { Store, Globe, Phone, ShoppingCart, Heart, Star, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useStoreProfile } from "@/hooks/StoreProfile/useStoreProfile";
import { useStoreConfig } from "@/hooks/StoreProfile/useStoreConfig";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ProductImage } from "@/components/ui/product-image";
import { CartWidget } from "@/components/Cart/CartWidget";
import { AddToCartButton } from "@/components/Cart/AddToCartButton";

export default function PublicStorePage({ params }: { params: Promise<{ storeName: string }> }) {
    const resolvedParams = useParams();
    const storeName = resolvedParams.storeName as string;
    const { getStoreProfileByStoreName, storeProfilePublic, loading, error } = useStoreProfile();
    const [storeId, setStoreId] = useState<number | null>(null);
    const isInitialized = useRef(false);

    // Obtener configuración de la tienda
    const { 
        productsWithDetails, 
        loading: configLoading 
    } = useStoreConfig(storeId);

    useEffect(() => {
        if (storeName && !isInitialized.current) {
            isInitialized.current = true;
            storeName.split('-')
            getStoreProfileByStoreName(storeName.split('-').join(' '));
        }
    }, [storeName, getStoreProfileByStoreName]);

    // Obtener el ID de la tienda cuando se cargue el perfil
    useEffect(() => {
        if (storeProfilePublic?.id) {
            setStoreId(Number(storeProfilePublic.id));
        }
    }, [storeProfilePublic?.id]);


    // Obtener productos activos
    const getActiveProducts = () => {
        return productsWithDetails.filter(p => p.config.is_active);
    };

    // Obtener categorías únicas directamente de los productos activos
    const getActiveCategories = () => {
        const activeProducts = getActiveProducts();
        const categoryCodes = [...new Set(activeProducts.map(p => p.Categoria).filter(Boolean))];
        
        return categoryCodes.map(code => ({
            code,
            name: code
        }));
    };

    // Filtrar productos por categoría
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [searchTerm, setSearchTerm] = useState('');

    const getFilteredProducts = () => {
        let filtered = getActiveProducts();

        // Filtro por categoría
        if (selectedCategory !== 'all') {
            filtered = filtered.filter(p => p.Categoria === selectedCategory);
        }

        // Filtro por búsqueda
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(p => 
                p.Nombre?.toLowerCase().includes(term) ||
                p.Marca?.toLowerCase().includes(term) ||
                p.Categoria?.toLowerCase().includes(term)
            );
        }

        return filtered;
    };

    const filteredProducts = getFilteredProducts();

    const getBackgroundImage = () => {
        if (storeProfilePublic?.banner_image) {
            return `bg-cover bg-center bg-no-repeat py-16`;
        }
        return "bg-gradient-to-r from-gray-900 to-gray-700 text-white py-16";
    };

    const getBackgroundStyle = () => {
        if (storeProfilePublic?.banner_image) {
            return {
                backgroundImage: `url(${storeProfilePublic.banner_image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
            };
        }
        return {};
    };

    const getTextColor = () => {
        if (storeProfilePublic?.banner_image) {
            return "text-white";
        }
        return "text-white";
    };

    const getOverlay = () => {
        if (storeProfilePublic?.banner_image) {
            return "bg-black bg-opacity-50"; 
        }
        return "";
    };

    // Mostrar loading mientras se carga
    if (loading || configLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto mb-4"></div>
                    <p className="text-lg text-gray-600">Cargando perfil de tienda...</p>
                </div>
            </div>
        );
    }

    // Mostrar error si algo salió mal
    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-red-500 text-6xl mb-4">⚠️</div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Error al cargar la tienda</h1>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <p className="text-sm text-gray-500">Store Name: {storeName}</p>
                    <p className="text-sm text-gray-500">storeProfilePublic: {JSON.stringify(storeProfilePublic)}</p>
                </div>
            </div>
            );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b">
                {/* Debug Panel - Temporal */}
                {process.env.NODE_ENV === 'development' && (
                    <div className="bg-yellow-100 border-b border-yellow-300 p-2 text-xs">
                        <strong>DEBUG:</strong> storeName: {storeName} | 
                        storeProfilePublic: {storeProfilePublic ? 'Cargado' : 'Null'} | 
                        Loading: {loading ? 'Sí' : 'No'} | 
                        Error: {error || 'Ninguno'} |
                        Productos: {productsWithDetails.length} |
                        Categorías: {getActiveCategories().length}
                    </div>
                )}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center space-x-4">
                            <div className="w-50 h-30 flex items-center justify-center">
                               {/* <Store className="w-6 h-6 text-white" /> */}
                               {storeProfilePublic?.logo_image ? (
                                   <Image src={storeProfilePublic.logo_image} alt="Logo" width={100} height={100} />
                               ) : (
                                   <Store className="w-6 h-6 text-white rounded-full bg-black" />
                               )}
                            </div>
                            <div>
                                <h1 className="text-xl font-bold">{storeProfilePublic?.name || storeName || "Auto Parts"}</h1>
                                <p className="text-sm text-gray-500">{storeProfilePublic?.description || "Fast, Affordable, Delivered to You"}</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2 text-gray-600">
                                <Globe className="w-4 h-4" />
                                <span className="text-sm">{storeProfilePublic?.name ? `${storeProfilePublic.name.toLowerCase().replace(/\s+/g, '')}.larefa.com` : `${storeName || "autoparts"}.larefa.com`}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-gray-600">
                                <Phone className="w-4 h-4" />
                                <span className="text-sm">{storeProfilePublic?.phone || "1 888 235 9826"}</span>
                            </div>
                            {/* Carrito de Compras */}
                            {storeId && <CartWidget storeId={storeId} />}
                        </div>
                    </div>
                </div>
            </header>

            
            {/* Hero Section */}
            <div className={`relative ${getBackgroundImage()}`} style={getBackgroundStyle()}>
                <div className={`absolute inset-0 ${getOverlay()}`}></div>
                
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className={`text-4xl font-bold mb-4 ${getTextColor()} uppercase`}>
                        {storeProfilePublic?.name || "Auto Parts"}
                    </h2>
                    <p className={`text-xl mb-8 ${storeProfilePublic?.banner_image ? 'text-white' : 'text-gray-300'}`}>
                        {storeProfilePublic?.description || "Find the best parts at competitive prices with fast delivery"}
                    </p>
                    <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg">
                       Explorar
                    </Button>
                </div>
            </div>

            <div className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <Input 
                                placeholder="Buscar repuestos automotrices..." 
                                className="pl-10 pr-4 py-3"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <Button variant="outline" className="flex items-center space-x-2">
                            <Filter className="w-4 h-4" />
                            <span>Filtros</span>
                        </Button>
                    </div>
                </div>
            </div>

            {/* Categories */}
            <div className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex space-x-2 overflow-x-auto">
                        <Button 
                            variant={selectedCategory === 'all' ? "default" : "outline"}
                            className="whitespace-nowrap rounded-full"
                            onClick={() => setSelectedCategory('all')}
                        >
                            Todas ({getActiveProducts().length})
                        </Button>
                        {getActiveCategories().map((category) => (
                            <Button 
                                key={category.code} 
                                variant={selectedCategory === category.code ? "default" : "outline"}
                                className="whitespace-nowrap rounded-full"
                                onClick={() => setSelectedCategory(category.code || '')}
                            >
                                {category.name}
                            </Button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Products Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {filteredProducts.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="text-gray-400 text-6xl mb-4">🔍</div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron productos</h3>
                        <p className="text-gray-500">
                            {searchTerm || selectedCategory !== 'all' 
                                ? 'Intenta ajustar los filtros de búsqueda' 
                                : 'Esta tienda aún no tiene productos configurados'
                            }
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredProducts.map((product) => (
                            <div key={product.SKU} className="relative">
                                <Link href={`/store/public/${storeName}/product/${product.SKU}`}>
                                    <Card className="bg-white shadow-md hover:shadow-lg transition-shadow cursor-pointer">
                                        <CardContent className="p-4">
                                            <div className="relative mb-4">
                                                <ProductImage
                                                    src={product.Imagen}
                                                    alt={product.Nombre || 'Producto'}
                                                    className="w-full h-48 object-cover rounded-lg mb-3"
                                                />
                                                {product.config.is_featured && (
                                                    <Badge className="absolute top-2 left-2 bg-orange-500 text-white text-xs">
                                                        Destacado
                                                    </Badge>
                                                )}
                                                <div className="absolute bottom-2 right-2 flex space-x-1">
                                                    <Button variant="ghost" size="sm" className="p-1 h-auto bg-white/80 hover:bg-white">
                                                        <Heart className="w-4 h-4 text-gray-600" />
                                                    </Button>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <h3 className="font-medium text-gray-900 line-clamp-2">{product.Nombre}</h3>
                                                <p className="text-sm text-gray-600">Marca: {product.Marca}</p>
                                                <p className="text-sm text-gray-600">Categoría: {product.Categoria}</p>
                                                <div className="flex items-center space-x-3">
                                                    <span className="text-lg font-bold text-gray-900">
                                                        ${(() => {
                                                            // Si hay precio personalizado, usarlo; sino calcular con ganancia
                                                            if (product.config.custom_price) {
                                                                return product.config.custom_price.toFixed(2);
                                                            }
                                                            // Calcular precio con ganancia aplicada
                                                            const basePrice = product.Precio || 0;
                                                            const profit = product.config.custom_profit || 0;
                                                            const finalPrice = basePrice * (1 + profit / 100);
                                                            return finalPrice.toFixed(2);
                                                        })()}
                                                    </span>
                                                </div>
                                                {product.config.stock_quantity > 0 && (
                                                    <p className="text-sm text-green-600">
                                                        Stock: {product.config.stock_quantity} unidades
                                                    </p>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                                
                                {/* Botón de Agregar al Carrito - FUERA del Link */}
                                {storeId && (
                                    <div className="mt-3 px-4 pb-4">
                                        <AddToCartButton 
                                            product={{
                                                ...product,
                                                Precio: (() => {
                                                    // Si hay precio personalizado, usarlo; sino calcular con ganancia
                                                    if (product.config.custom_price) {
                                                        return product.config.custom_price;
                                                    }
                                                    // Calcular precio con ganancia aplicada
                                                    const basePrice = product.Precio || 0;
                                                    const profit = product.config.custom_profit || 0;
                                                    return basePrice * (1 + profit / 100);
                                                })()
                                            }}
                                            storeId={storeId}
                                            className="w-full"
                                        />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div>
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                                    <Store className="w-6 h-6 text-black" />
                                </div>
                                <h3 className="text-xl font-bold">{storeProfilePublic?.name || storeName || "Auto Parts"}</h3>
                            </div>
                            <p className="text-gray-400 mb-4">
                                {storeProfilePublic?.description || "Your trusted source for quality automotive parts and accessories."}
                            </p>
                            <div className="space-y-2 text-sm text-gray-400">
                                <div className="flex items-center space-x-2">
                                    <Globe className="w-4 h-4" />
                                    <span>{storeProfilePublic?.name ? `${storeProfilePublic.name.toLowerCase().replace(/\s+/g, '')}.larefa.com` : `${storeName || "autoparts"}.larefa.com`}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Phone className="w-4 h-4" />
                                    <span>{"1 888 235 9826"}</span>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h4 className="text-lg font-semibold mb-4">Enlaces Rápidos</h4>
                            <ul className="space-y-2 text-gray-400">
                                <li><a href="#" className="hover:text-white transition-colors">Sobre Nosotros</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Contacto</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Información de Envío</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Devoluciones</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-lg font-semibold mb-4">Servicio al Cliente</h4>
                            <ul className="space-y-2 text-gray-400">
                                <li><a href="#" className="hover:text-white transition-colors">Centro de Ayuda</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Rastrear Pedido</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Garantía</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Soporte</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
                        <p>&copy; 2024 {storeProfilePublic?.name || storeName || "Auto Parts"}. All rights reserved. Powered by LaRefa Connect.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
