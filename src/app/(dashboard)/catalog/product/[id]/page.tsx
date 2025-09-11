"use client";

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ProductDetailPage } from '../../_components/ProductDetailPage';
import { Product } from '@/types/ecomerce';
import { useProducts } from '@/hooks/Products/useProducts';
import { useCartStore } from '@/stores/cartStore';

export default function DashboardProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const { products } = useProducts();
    const { addItem } = useCartStore();
    useEffect(() => {
        const loadProduct = async () => {
            const resolvedParams = await params;
            const productId = resolvedParams.id;
            
            if (products && products.length > 0) {
                const foundProduct = products.find(p => p.SKU === productId);
                if (foundProduct) {
                    setProduct(foundProduct);
                } else {
                    router.push('/dashboard');
                }
            }
            setLoading(false);
        };

        loadProduct();
    }, [params, products, router]);

    const handleBack = () => {
        router.push('/dashboard');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Cargando producto...</p>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-600 mb-4">Producto no encontrado</p>
                    <button 
                        onClick={handleBack}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                    >
                        Volver al Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return <ProductDetailPage product={product} onBack={handleBack} />;
}
