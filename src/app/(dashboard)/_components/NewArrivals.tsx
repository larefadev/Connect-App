"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/app/(dashboard)/_components/ProductCard";
import { useProducts } from "@/hooks/Products/useProducts";
import React, { useMemo } from "react";
import { useRouter } from "next/navigation";
export const NewArrivals = () => {
    const { products, loading } = useProducts();
    const router = useRouter();
    // Seleccionar productos aleatorios para mostrar
    const randomProducts = useMemo(() => {
        if (!products || products.length === 0) return [];
        
        // Mezclar productos y tomar los primeros 4
        const shuffled = [...products].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, 4);
    }, [products]);

    if (loading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Nuevos Lanzamientos</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="bg-gray-100 rounded-lg p-3 h-32 animate-pulse" />
                        ))}
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Nuevos Lanzamientos</CardTitle>
                <Button variant="link" className="text-red-500 text-sm p-0" onClick={() => router.push("/catalog")}>
                    Ver todos
                </Button>
            </CardHeader>
            <CardContent>
                {randomProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {randomProducts.map((product) => (
                            <ProductCard key={product.SKU} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 text-gray-500">
                        No hay productos disponibles
                    </div>
                )}
            </CardContent>
        </Card>
    );
};