"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useProducts } from "@/hooks/Products/useProducts";
import { Package, Tag, TrendingUp, Users } from "lucide-react";
import { useMemo } from "react";

export const DashboardInformation = () => {
    const { products, categories, loading } = useProducts();

    // Calcular estadísticas básicas con useMemo para optimizar rendimiento
    const stats = useMemo(() => {
        return {
            totalProducts: products.length,
            totalCategories: categories.length,
            averagePrice: products.length > 0 
                ? products.reduce((sum, p) => sum + (p.Precio || 0), 0) / products.length 
                : 0,
            productsWithImages: products.filter(p => p.Imagen).length
        };
    }, [products, categories]);

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                    <Card key={i} className="animate-pulse">
                        <CardContent className="p-6">
                            <div className="h-20 bg-gray-200 rounded mb-4" />
                            <div className="h-4 bg-gray-200 rounded mb-2" />
                            <div className="h-8 bg-gray-200 rounded" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Información del Dashboard</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Total de Productos */}
                <Card className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-blue-500">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Total de Productos</p>
                                <p className="text-3xl font-bold text-blue-600">
                                    {stats.totalProducts.toLocaleString()}
                                </p>
                            </div>
                            <div className="p-3 bg-blue-100 rounded-full">
                                <Package className="w-8 h-8 text-blue-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Total de Categorías */}
                <Card className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-green-500">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Total de Categorías</p>
                                <p className="text-3xl font-bold text-green-600">
                                    {stats.totalCategories.toLocaleString()}
                                </p>
                            </div>
                            <div className="p-3 bg-green-100 rounded-full">
                                <Tag className="w-8 h-8 text-green-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Precio Promedio */}
                <Card className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-purple-500">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Precio Promedio</p>
                                <p className="text-3xl font-bold text-purple-600">
                                    ${stats.averagePrice.toFixed(2)}
                                </p>
                            </div>
                            <div className="p-3 bg-purple-100 rounded-full">
                                <TrendingUp className="w-8 h-8 text-purple-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Productos con Imágenes */}
                <Card className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-orange-500">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Con Imágenes</p>
                                <p className="text-3xl font-bold text-orange-600">
                                    {stats.productsWithImages.toLocaleString()}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {stats.totalProducts > 0 
                                        ? `${((stats.productsWithImages / stats.totalProducts) * 100).toFixed(1)}%`
                                        : '0%'
                                    } del total
                                </p>
                            </div>
                            <div className="p-3 bg-orange-100 rounded-full">
                                <Users className="w-8 h-8 text-orange-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};