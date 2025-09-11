"use client";

import React, { useState } from 'react';
import { ArrowLeft, Check, Shield, Truck, Plus, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Product } from '@/types/ecomerce';
import { useRouter } from 'next/navigation';
import { useB2BOrders } from '@/hooks/B2BOrders/useB2BOrders';
import { useStoreProfile } from '@/hooks';
import { useAuthStore } from '@/stores/authStore';
import { useToastContext } from '@/components/providers/ToastProvider';
import { CartItem } from '@/types/b2b-order';


interface ProductDetailPageProps {
    product: Product;
    onBack?: () => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ product, onBack }) => {
    const router = useRouter();
    const [selectedColor, setSelectedColor] = useState<string>('');
    const [selectedDiameter, setSelectedDiameter] = useState<string>('40mm');
    const [selectedWidth, setSelectedWidth] = useState<string>('8"');
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const { storeProfile } = useStoreProfile();
    const { user } = useAuthStore();
    const { success: showSuccess, error: showError } = useToastContext();
    const storeId = storeProfile?.id ? Number(storeProfile.id) : undefined;
    const ownerEmail = storeProfile?.email ? String(storeProfile.email) : 'dev@larefa.com';
    const userEmail = user?.email;
    const { addToCart, cart } = useB2BOrders(storeId, ownerEmail, storeProfile, userEmail);


    const transformProductToCartItem = (product: Product): CartItem => {
        const unitPrice = product.Precio || 0;
        const ganancia = product.Ganancia || 0;
        const precioConGanancia = ganancia > 0 ? unitPrice : unitPrice;

        return {
            product_sku: product.SKU,
            product_name: product.Nombre || 'Sin nombre',
            product_description: product.Descricpion || '',
            product_image: product.Imagen || '',
            product_brand: product.Marca || '',
            unit_price: precioConGanancia,
            retail_price: unitPrice,
            quantity: 1,
            total_price: precioConGanancia,
            discount_percentage: 0,
            discount_amount: 0,
            tax_rate: 16, // IVA del 16%
            tax_amount: precioConGanancia * 0.16,
            item_notes: ''
        };
    };

    const handleAddToCart = (product: Product) => {
        if (!storeId) {
            showError('No se pudo identificar la tienda');
            return;
        }

        const cartItem = transformProductToCartItem(product);
        addToCart(cartItem);
        showSuccess(`${product.Nombre || 'Producto'} agregado al carrito`);
    };
    
    // Simular múltiples imágenes del producto
    const productImages = [
        product.Imagen || '/images/placeholder-product.jpg',
        '/images/placeholder-product-2.jpg',
        '/images/placeholder-product-3.jpg'
    ];

    // Opciones de color (ejemplo)
    const colorOptions = ['Red', 'Blue', 'Black', 'White', 'Silver'];

    // Opciones de diámetro
    const diameterOptions = ['40mm', '50mm', '60mm', '70mm', '80mm'];

    // Opciones de ancho
    const widthOptions = ['8"', '9"', '10"', '11"', '12"'];

    // Beneficios del producto
    const keyBenefits = [
        'Reduce el ruido y polvo de frenos',
        'Vida útil extendida de pastillas y rotores',
        'Sensación de frenado suave y consistente',
        'Fácil instalación con ajuste preciso',
        'Respaldado por garantía de 6 meses'
    ];

    const handleBack = () => {
        if (onBack) {
            onBack();
        } else {
            router.push('/dashboard');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-4 lg:px-6 py-4">
                <div className="flex items-center space-x-3">
                    <button
                        onClick={handleBack}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <h1 className="text-base lg:text-lg font-semibold text-gray-800">Detalles del Producto</h1>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 lg:px-6 py-4 lg:py-8">
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    {/* Product Image Carousel */}
                    <div className="relative bg-gray-100 p-4 lg:p-8">
                        <div className="aspect-square max-w-2xl mx-auto">
                            <img
                                src={productImages[currentImageIndex]}
                                alt={product.Nombre || "Producto"}
                                className="w-full h-full object-contain"
                            />
                        </div>
                        
                        {/* Image Pagination */}
                        <div className="flex justify-center space-x-2 mt-4 lg:mt-6">
                            {productImages.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentImageIndex(index)}
                                    className={`w-3 h-3 rounded-full transition-colors ${
                                        index === currentImageIndex
                                            ? 'bg-gray-800'
                                            : 'bg-gray-300'
                                    }`}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Product Details */}
                    <div className="p-4 lg:p-8 space-y-4 lg:space-y-6">
                        {/* Product Title and Basic Info */}
                        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start space-y-4 lg:space-y-0">
                            <div className="space-y-2">
                                <h2 className="text-xl lg:text-3xl font-bold text-gray-800">
                                    {product.Nombre || "Product Name"}
                                </h2>
                                <p className="text-sm lg:text-base text-gray-600">
                                    SKU: {product.SKU || "SKU-00000"}
                                </p>
                                <p className="text-sm lg:text-base text-gray-600">
                                    Marca: <span className="text-orange-500 font-semibold">
                                        {product.Marca || "Marca"}
                                    </span>
                                </p>
                            </div>
                            <div className="flex flex-col lg:items-end space-y-2">
                                <Badge className="bg-green-500 text-white px-3 py-1 w-fit">
                                    En Stock
                                </Badge>
                                <div className="text-xl lg:text-2xl font-bold text-red-500">
                                    ${product.Precio?.toFixed(2) || "0.00"}
                                </div>
                            </div>
                        </div>

                        {/* Key Benefits */}
                       {/*  <div>
                            <h3 className="text-xl font-bold text-gray-800 mb-4">Beneficios Clave</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {keyBenefits.map((benefit, index) => (
                                    <div key={index} className="flex items-center space-x-2">
                                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                        <span className="text-gray-700">
                                            {benefit}
                                            {benefit.includes('garantía') && (
                                                <span className="text-red-500 font-semibold"> de 6 meses</span>
                                            )}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>*/}

                        {/* Product Options */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Color Selection */}
                           {/*  <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Color
                                </label>
                               { <div className="relative">
                                    <select
                                        value={selectedColor}
                                        onChange={(e) => setSelectedColor(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg appearance-none bg-white focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                    >
                                        <option value="">Color</option>
                                        {colorOptions.map((color) => (
                                            <option key={color} value={color}>
                                                {color}
                                            </option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                </div>}
                            </div>*/}

                            {/* Diameter Selection */}
                           {/*  <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Diámetro
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {diameterOptions.map((diameter) => (
                                        <button
                                            key={diameter}
                                            onClick={() => setSelectedDiameter(diameter)}
                                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                                selectedDiameter === diameter
                                                    ? 'bg-gray-800 text-white'
                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                        >
                                            {diameter}
                                        </button>
                                    ))}
                                </div>
                            </div>*/}

                            {/* Width Selection */}
                           {/*  <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Ancho
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {widthOptions.map((width) => (
                                        <button
                                            key={width}
                                            onClick={() => setSelectedWidth(width)}
                                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                                selectedWidth === width
                                                    ? 'bg-gray-800 text-white'
                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                        >
                                            {width}
                                        </button>
                                    ))}
                                </div>
                            </div>*/}
                        </div>

                        {/* Product Info Card */}
                        <Card className="bg-gray-50 border-gray-200">
                            <CardContent className="p-4 lg:p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg lg:text-xl font-bold text-gray-800">Información del Producto</h3>
                                    <button className="p-1 hover:bg-gray-200 rounded">
                                        <span className="text-gray-600 text-xl">⋮</span>
                                    </button>
                                </div>
                                
                                <div className="space-y-4">
                                    {/* Compatibility */}
                                    {/*<div className="flex items-start space-x-3">
                                        <div className="w-6 h-6 bg-red-500 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <Check className="w-4 h-4 text-white" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-800">Compatible Con</p>
                                            <p className="text-gray-600 text-sm">
                                                Toyota Corolla 2017-2022 (Delantero)
                                            </p>
                                        </div>
                                    </div>*/}

                                    {/* Warranty */}
                                    <div className="flex items-start space-x-3">
                                        <div className="w-6 h-6 bg-red-500 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <Shield className="w-4 h-4 text-white" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-800">Garantía</p>
                                            <p className="text-gray-600 text-sm">
                                                Respaldado por garantía de 6 meses
                                            </p>
                                        </div>
                                    </div>

                                    {/* Delivery Time */}
                                    <div className="flex items-start space-x-3">
                                        <div className="w-6 h-6 bg-red-500 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <Truck className="w-4 h-4 text-white" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-800">Tiempo de Entrega</p>
                                            <p className="text-gray-600 text-sm">
                                                1-2 Horas (local) / 24-48 hrs (nacional)
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-4 lg:pt-6">
                            <Button
                                variant="outline"
                                className="flex-1 border-red-500 text-red-500 hover:bg-red-50 py-3"
                                onClick={() => handleAddToCart(product)}
                            >
                                <Plus className="w-5 h-5 mr-2" />
                                Agregar al Carrito
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
