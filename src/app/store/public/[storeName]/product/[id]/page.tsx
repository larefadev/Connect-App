"use client";

import { ArrowLeft, MoreVertical, CheckCircle, Shield, Truck, Star, ShoppingCart, Heart, Share2, Package, Clock, MapPin, Store, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useStoreProfile } from "@/hooks/StoreProfile/useStoreProfile";
import { useStoreConfig } from "@/hooks/StoreProfile/useStoreConfig";
import { useProducts } from "@/hooks/Products/useProducts";
import { useEffect, useState } from "react";
import { ProductImage } from "@/components/ui/product-image";
import { useToastContext } from "@/components/providers/ToastProvider";


export default function ProductDetailPage({ params }: { params: Promise<{ storeName: string; id: string }> }) {
    const resolvedParams = useParams();
    const storeName = resolvedParams.storeName as string;
    const productSku = resolvedParams.id as string;
    
    const [storeId, setStoreId] = useState<number | null>(null);
    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Obtener perfil de la tienda
    const { getStoreProfileByStoreName, storeProfilePublic, loading: profileLoading } = useStoreProfile();
    
    // Obtener configuración de la tienda
    const { productsWithDetails, loading: configLoading } = useStoreConfig(storeId);
    
    // Obtener todos los productos para buscar el producto específico
    const { products: allProducts, loading: productsLoading } = useProducts();



    // Cargar perfil de la tienda
    useEffect(() => {
        if (storeName) {
            getStoreProfileByStoreName(storeName);
        }
    }, [storeName, getStoreProfileByStoreName]);

    // Obtener el ID de la tienda cuando se cargue el perfil
    useEffect(() => {
        if (storeProfilePublic?.id) {
            setStoreId(Number(storeProfilePublic.id));
        } else {
            console.log('storeProfilePublic no tiene ID:', storeProfilePublic);
        }
    }, [storeProfilePublic?.id]);

    // Buscar el producto específico
    useEffect(() => {
        if (productSku && allProducts.length > 0) {            
            const foundProduct = allProducts.find(p => p.SKU === productSku);
            if (foundProduct) {
                
                // Buscar la configuración de la tienda para este producto
                const storeConfig = productsWithDetails.find(p => p.SKU === productSku);
                
                if (storeConfig) {
                    // Combinar información del producto con la configuración de la tienda
                    setProduct({
                        ...foundProduct,
                        config: storeConfig
                    });
                } else {
                    // Si no hay configuración de tienda, verificar si la tienda tiene productos configurados
                    if (productsWithDetails.length === 0) {
                        // La tienda aún no tiene productos configurados, mostrar el producto como disponible
                        setProduct({
                            ...foundProduct,
                            config: {
                                is_active: true,
                                is_featured: false,
                                custom_price: null,
                                stock_quantity: 999, // Stock por defecto alto
                                custom_profit: null
                            }
                        });
                    } else {
                        // La tienda tiene productos configurados pero este no está incluido
                        setProduct({
                            ...foundProduct,
                            config: {
                                is_active: false,
                                is_featured: false,
                                custom_price: null,
                                stock_quantity: 0,
                                custom_profit: null
                            }
                        });
                    }
                }
                setLoading(false);
            } else {
                setError('Producto no encontrado');
                setLoading(false);
            }
        }
    }, [productSku, allProducts, productsWithDetails]);

    // Mostrar loading mientras se carga
    if (loading || profileLoading || configLoading || productsLoading || !storeId) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto mb-4"></div>
                    <p className="text-lg text-gray-600">
                        {!storeId ? 'Cargando perfil de tienda...' : 'Cargando producto...'}
                    </p>
                    <div className="text-sm text-gray-500 mt-2">
                        <p>Perfil: {profileLoading ? 'Cargando...' : 'Listo'}</p>
                        <p>Configuración: {configLoading ? 'Cargando...' : 'Listo'}</p>
                        <p>Productos: {productsLoading ? 'Cargando...' : 'Listo'}</p>
                        <p>Store ID: {storeId || 'No establecido'}</p>
                        <p>Store Name: {storeName}</p>
                    </div>
                </div>
            </div>
        );
    }

    // Mostrar error si algo salió mal
    if (error || !product) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-red-500 text-6xl mb-4">⚠️</div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Producto no encontrado</h1>
                    <p className="text-gray-600 mb-4">{error || 'El producto solicitado no existe o no está disponible'}</p>
                    <div className="text-sm text-gray-500 mb-4">
                        <p>SKU buscado: {productSku}</p>
                        <p>Tienda: {storeName}</p>
                        <p>Productos cargados: {allProducts.length}</p>
                        <p>Configuración de tienda: {productsWithDetails.length}</p>
                    </div>
                    <Link href={`/store/public/${storeName}`}>
                        <Button className="bg-red-600 hover:bg-red-700">
                            Volver a la tienda
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    // Quitamos la validación de activo/inactivo - todos los productos se muestran
    // Solo verificamos si hay stock disponible para mostrar la interfaz apropiada
    const hasStock = product.config?.stock_quantity > 0;



    // Calcular precio final
    const basePrice = product.Precio || 0;
    const profit = product.config.custom_profit || 0;
    const customPrice = product.config.custom_price;
    
    // Si hay precio personalizado, usarlo; sino calcular con ganancia
    const finalPrice = customPrice || (basePrice * (1 + profit / 100));
    const hasCustomPrice = customPrice && customPrice !== basePrice;
    const hasProfit = profit > 0 && !customPrice;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <Link href={`/store/public/${storeName}`} className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
                            <ArrowLeft className="w-5 h-5" />
                            <span>Volver a {storeProfilePublic?.name || storeName}</span>
                        </Link>
                        <div className="flex items-center space-x-4">
                            <Button variant="ghost" size="sm">
                                <Heart className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                                <Share2 className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Left Column - Images */}
                    <div>
                        {/* Main Image */}
                        <div className="relative mb-6">
                            <ProductImage
                                src={product.Imagen}
                                alt={product.Nombre || 'Producto'}
                                className="w-full h-96 object-cover rounded-lg"
                            />
                            {product.config.is_featured && (
                                <Badge className="absolute top-4 left-4 bg-orange-500 text-white">
                                    Destacado
                                </Badge>
                            )}
                        </div>

                        {/* Product SKU */}
                        <div className="text-center">
                            <p className="text-sm text-gray-500">SKU: {product.SKU}</p>
                        </div>
                    </div>

                    {/* Right Column - Product Info */}
                    <div className="space-y-6">
                        {/* Product Title and Basic Info */}
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.Nombre}</h1>
                            {product.Marca && (
                                <p className="text-gray-600 mb-2">
                                    Marca: <span className="text-orange-500 font-medium">{product.Marca}</span>
                                </p>
                            )}
                            {product.Categoria && (
                                <p className="text-gray-600 mb-4">
                                    Categoría: <span className="text-blue-500 font-medium">{product.Categoria}</span>
                                </p>
                            )}
                        </div>

                        {/* Pricing and Stock */}
                        <div className="bg-white p-6 rounded-lg border">
                            {/* Advertencia de stock si no hay disponible */}
                            {!hasStock && (
                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div className="ml-3">
                                            <h3 className="text-sm font-medium text-yellow-800">
                                                Producto sin stock disponible
                                            </h3>
                                            <div className="mt-2 text-sm text-yellow-700">
                                                <p>Este producto está disponible para consulta pero no hay unidades en stock.</p>
                                                <p>Estado: {product.config?.is_active ? 'Activo' : 'Inactivo'} | Stock: {product.config?.stock_quantity || 0}</p>
                                                <p>Puedes contactar a la tienda para más información sobre disponibilidad.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="flex items-center justify-between mb-4">
                                <div className="space-y-2">
                                    <p className="text-2xl font-bold text-gray-900">
                                        ${finalPrice.toFixed(2)}
                                    </p>
                                </div>
                                <div className="text-right">
                                    {hasStock ? (
                                        <Badge className="bg-green-500 text-white mb-2">
                                            En Stock
                                        </Badge>
                                    ) : (
                                        <Badge className="bg-red-500 text-white mb-2">
                                            Sin Stock
                                        </Badge>
                                    )}
                                    {hasStock && (
                                        <p className="text-sm text-gray-600">
                                            {product.config.stock_quantity} unidades disponibles
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Profit Information */}
                            {(hasProfit || hasCustomPrice) && (
                                <div className="border-t pt-4">
                                    {hasProfit && (
                                        <p className="text-sm text-green-600 font-medium">
                                            Margen de ganancia: {profit}%
                                        </p>
                                    )}
                                    {hasCustomPrice && (
                                        <p className="text-sm text-blue-600 font-medium">
                                            Precio personalizado aplicado
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Product Description */}
                        {/*product.Descricpion && (
                            <div className="bg-white p-6 rounded-lg border">
                                <h3 className="text-lg font-semibold text-gray-900 mb-3">Descripción</h3>
                                <p className="text-gray-700 leading-relaxed">{product.Descricpion}</p>
                            </div>
                        )*/}

                        {/* Product Specifications */}
                        <div className="bg-white p-6 rounded-lg border">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Especificaciones</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-center space-x-3">
                                    <Package className="w-5 h-5 text-gray-400" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-700">SKU</p>
                                        <p className="text-sm text-gray-600">{product.SKU}</p>
                                    </div>
                                </div>
                                {product.Marca && (
                                    <div className="flex items-center space-x-3">
                                        <Star className="w-5 h-5 text-gray-400" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-700">Marca</p>
                                            <p className="text-sm text-gray-600">{product.Marca}</p>
                                        </div>
                                    </div>
                                )}
                                {product.Categoria && (
                                    <div className="flex items-center space-x-3">
                                        <MapPin className="w-5 h-5 text-gray-400" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-700">Categoría</p>
                                            <p className="text-sm text-gray-600">{product.Categoria}</p>
                                        </div>
                                    </div>
                                )}
                                {product.Ganancia && (
                                    <div className="flex items-center space-x-3">
                                        <CheckCircle className="w-5 h-5 text-gray-400" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-700">Ganancia Base</p>
                                            <p className="text-sm text-gray-600">{product.Ganancia}%</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Store Information */}
                        <div className="bg-white p-6 rounded-lg border">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Información de la Tienda</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="text-center">
                                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
                                        <Store className="w-6 h-6 text-red-600" />
                                    </div>
                                    <p className="text-sm font-medium text-gray-700 mb-1">Tienda</p>
                                    <p className="text-xs text-gray-600">{storeProfilePublic?.name || storeName}</p>
                                </div>
                                <div className="text-center">
                                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                                        <Clock className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <p className="text-sm font-medium text-gray-700 mb-1">Estado del Producto</p>
                                    <p className="text-xs text-gray-600">
                                        {product.config?.is_active ? 'Activo' : 'Inactivo'} | Stock: {product.config?.stock_quantity || 0}
                                    </p>
                                </div>
                            </div>
                        </div>
                
                        {/* Action Buttons */}
                        <div className="flex space-x-4 pt-4">
                            <Button variant="outline" className="flex-1 border-red-500 text-red-500 hover:bg-red-50">
                                <Share2 className="w-4 h-4 mr-2" />
                                Compartir
                            </Button>
                            {hasStock ? (
                                <Button className="flex-1 bg-red-600 hover:bg-red-700 text-white">
                                    <ShoppingCart className="w-4 h-4 mr-2" />
                                    Crear Cotización
                                </Button>
                            ) : (
                                <Button className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white">
                                    <Phone className="w-4 h-4 mr-2" />
                                    Contactar Tienda
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
