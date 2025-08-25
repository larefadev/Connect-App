import React from 'react';
import { Package } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Product as ProductType } from '@/types/ecomerce';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface ProductCardProps {
    product: ProductType;
    showBadges?: boolean;
}

const badgeConfig = [
    { key: 'isNew', label: 'NUEVO', className: 'bg-orange-500' },
    { key: 'isSale', label: 'OFERTA', className: 'bg-red-500' },
    { key: 'isHot', label: 'POPULAR', className: 'bg-pink-500' },
    { key: 'isTrending', label: 'TENDENCIA', className: 'bg-blue-500' },
] as const;

export const ProductCard: React.FC<ProductCardProps> = ({ product, showBadges = true }) => {
    const router = useRouter();
    
    // Generar badges aleatorios para mostrar variedad
    const randomBadges = {
        isNew: Math.random() > 0.7,
        isSale: Math.random() > 0.8,
        isHot: Math.random() > 0.85,
        isTrending: Math.random() > 0.9,
    };

    const handleViewDetails = () => {
        router.push(`/catalog/product/${product.SKU}`);
    };

    return (
        <div className="bg-white rounded-lg p-3 shadow-sm border relative hover:shadow-md transition-shadow">
            {showBadges && (
                <div className="absolute top-2 left-2 z-10 flex flex-wrap gap-1">
                    {badgeConfig.map(badgeInfo =>
                        randomBadges[badgeInfo.key] && (
                            <Badge
                                key={badgeInfo.key}
                                className={`${badgeInfo.className} text-white text-xs px-2 py-1`}
                            >
                                {badgeInfo.label}
                            </Badge>
                        )
                    )}
                </div>
            )}
            <div className="w-full h-20 bg-gray-100 rounded-md mb-2 flex items-center justify-center">
                {product.Imagen ? (
                    <Image 
                        src={product.Imagen} 
                        alt={product.Nombre || 'Producto'} 
                        width={80}
                        height={80}
                        className="w-full h-full object-cover rounded-md"
                    />
                ) : (
                    <Package className="w-8 h-8 text-gray-400" />
                )}
            </div>
            <h4 className="text-sm font-medium text-gray-800 mb-1 truncate">
                {product.Nombre || 'Sin nombre'}
            </h4>
            {product.Marca && (
                <p className="text-xs text-gray-500 mb-1">{product.Marca}</p>
            )}
            <p className="text-sm font-semibold text-gray-900 mb-2">
                ${product.Precio?.toFixed(2) || '0.00'}
            </p>
            <Button 
                variant="outline" 
                size="sm" 
                className="w-full text-xs bg-red-500 text-white border-red-500 hover:bg-red-600"
                onClick={handleViewDetails}
            >
                Ver Detalles
            </Button>
        </div>
    );
};