import React from 'react';
import { Package } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export type Product = {
    name: string;
    price: number;
    isNew?: boolean;
    isSale?: boolean;
    isHot?: boolean;
    isTrending?: boolean;
};

interface ProductCardProps {
    product: Product;
    showBadges?: boolean;
}

const badgeConfig = [
    { key: 'isNew', label: 'NEW', className: 'bg-orange-500' },
    { key: 'isSale', label: 'SALE', className: 'bg-orange-500' },
    { key: 'isHot', label: 'HOT', className: 'bg-red-500' },
    { key: 'isTrending', label: 'TRENDING', className: 'bg-orange-500' },
] as const;

export const ProductCard: React.FC<ProductCardProps> = ({ product, showBadges = true }) => {
    return (
        <div className="bg-white rounded-lg p-3 shadow-sm border relative">
            {showBadges && (
                <div className="absolute top-2 left-2 z-10 flex flex-wrap gap-1">
                    {badgeConfig.map(badgeInfo =>
                        product[badgeInfo.key] && (
                            <Badge
                                key={badgeInfo.key}
                                className={`${badgeInfo.className} text-white text-xs px-2 py-1 hover:${badgeInfo.className}`}
                            >
                                {badgeInfo.label}
                            </Badge>
                        )
                    )}
                </div>
            )}
            <div className="w-full h-20 bg-gray-100 rounded-md mb-2 flex items-center justify-center">
                <Package className="w-8 h-8 text-gray-400" />
            </div>
            <h4 className="text-sm font-medium text-gray-800 mb-1 truncate">{product.name}</h4>
            <p className="text-sm font-semibold text-gray-900 mb-2">${product.price.toFixed(2)}</p>
            <Button variant="outline" size="sm" className="w-full text-xs bg-red-500 text-white border-red-500 hover:bg-red-600">
                Tap to See Details
            </Button>
        </div>
    );
};