"use client";

import { Store, Globe, Phone, ShoppingCart, Heart, Star, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useStoreProfile } from "@/hooks/StoreProfile/useStoreProfile";
import { useEffect } from "react";
import Image from "next/image";

export default function PublicStorePage({ params }: { params: Promise<{ storeName: string }> }) {
    const resolvedParams = useParams();
    const storeName = resolvedParams.storeName as string;
    const { getStoreProfileByStoreName, storeProfilePublic, loading, error } = useStoreProfile();

    useEffect(() => {
        console.log("useEffect ejecutado con storeName:", storeName);
        if (storeName) {
            getStoreProfileByStoreName(storeName);
        }
    }, [storeName, getStoreProfileByStoreName]);

    useEffect(() => {
        console.log("storeProfilePublic actualizado:", storeProfilePublic);
    }, [storeProfilePublic]);

    const categories = [
        "All", "Oil Filters", "Break Pads", "Break Shoes", "Spark Plugs", "Engine Oil", "Suspension", "Lighting"
    ];

    const getBackgroundImage = () => {
        if (storeProfilePublic?.banner_image) {
            return `bg-cover bg-center bg-no-repeat py-16`;
        }
        return "bg-gradient-to-r from-gray-900 to-gray-700 text-white py-16";
    };

    const getBackgroundStyle = () => {
        console.log("getBackgroundStyle: storeProfilePublic.banner_url:", storeProfilePublic?.banner_image);
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

    const products = [
        {
            id: 1,
            name: "Bosch Premium Ceramic Brake Pads",
            brand: "Bosch",
            price: 45.00,
            originalPrice: 55.00,
            rating: 4.8,
            reviews: 127,
            image: "/images/brake-pads.jpg",
            isNew: false,
            discount: 18
        },
        {
            id: 2,
            name: "Castrol EDGE Engine Oil 5W-30",
            brand: "Castrol",
            price: 38.00,
            originalPrice: 45.00,
            rating: 4.6,
            reviews: 89,
            image: "/images/engine-oil.jpg",
            isNew: false,
            discount: 16
        },
        {
            id: 3,
            name: "Performance Suspension Spring Set",
            brand: "Performance",
            price: 120.00,
            originalPrice: 150.00,
            rating: 4.9,
            reviews: 45,
            image: "/images/suspension-spring.jpg",
            isNew: true,
            discount: 20
        },
        {
            id: 4,
            name: "H4 LED Headlight Bulbs",
            brand: "LED Pro",
            price: 25.00,
            originalPrice: 35.00,
            rating: 4.7,
            reviews: 203,
            image: "/images/headlight-bulbs.jpg",
            isNew: false,
            discount: 29
        },
        {
            id: 5,
            name: "NGK Spark Plugs Set",
            brand: "NGK",
            price: 35.00,
            originalPrice: 42.00,
            rating: 4.8,
            reviews: 156,
            image: "/images/spark-plugs.jpg",
            isNew: false,
            discount: 17
        },
        {
            id: 6,
            name: "Premium Oil Filter",
            brand: "Premium",
            price: 18.00,
            originalPrice: 22.00,
            rating: 4.5,
            reviews: 78,
            image: "/images/oil-filter.jpg",
            isNew: false,
            discount: 18
        }
    ];

    // Mostrar loading mientras se carga
    if (loading) {
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
                        Error: {error || 'Ninguno'}
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
                                placeholder="Search for auto parts..." 
                                className="pl-10 pr-4 py-3"
                            />
                        </div>
                        <Button variant="outline" className="flex items-center space-x-2">
                            <Filter className="w-4 h-4" />
                            <span>Filters</span>
                        </Button>
                    </div>
                </div>
            </div>

            {/* Categories */}
            <div className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex space-x-2 overflow-x-auto">
                        {categories.map((category, index) => (
                            <Button 
                                key={index} 
                                variant={index === 0 ? "default" : "outline"}
                                className="whitespace-nowrap rounded-full"
                            >
                                {category}
                            </Button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Products Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <Link key={product.id} href={`/store/public/${storeName}/product/${product.id}`}>
                            <Card className="bg-white shadow-md hover:shadow-lg transition-shadow cursor-pointer">
                                <CardContent className="p-4">
                                    <div className="relative mb-4">
                                        <div className="w-full h-48 bg-gray-200 rounded-lg mb-3"></div>
                                        {product.isNew && (
                                            <Badge className="absolute top-2 left-2 bg-orange-500 text-white text-xs">
                                                New
                                            </Badge>
                                        )}
                                        {product.discount > 0 && (
                                            <Badge className="absolute top-2 right-2 bg-red-500 text-white text-xs">
                                                -{product.discount}%
                                            </Badge>
                                        )}
                                        <div className="absolute bottom-2 right-2 flex space-x-1">
                                            <Button variant="ghost" size="sm" className="p-1 h-auto bg-white/80 hover:bg-white">
                                                <Heart className="w-4 h-4 text-gray-600" />
                                            </Button>
                                            <Button variant="ghost" size="sm" className="p-1 h-auto bg-white/80 hover:bg-white">
                                                <ShoppingCart className="w-4 h-4 text-gray-600" />
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="font-medium text-gray-900 line-clamp-2">{product.name}</h3>
                                        <p className="text-sm text-gray-600">Brand: {product.brand}</p>
                                        <div className="flex items-center space-x-2 mb-2">
                                            <div className="flex items-center space-x-1">
                                                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                                <span className="text-sm font-medium">{product.rating}</span>
                                            </div>
                                            <span className="text-sm text-gray-500">({product.reviews})</span>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <span className="text-lg font-bold text-gray-900">${product.price.toFixed(2)}</span>
                                            {product.originalPrice > product.price && (
                                                <span className="text-sm text-gray-500 line-through">${product.originalPrice.toFixed(2)}</span>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
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
                            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
                            <ul className="space-y-2 text-gray-400">
                                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Shipping Info</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Returns</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-lg font-semibold mb-4">Customer Service</h4>
                            <ul className="space-y-2 text-gray-400">
                                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Track Order</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Warranty</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
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
