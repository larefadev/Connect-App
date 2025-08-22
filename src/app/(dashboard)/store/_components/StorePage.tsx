"use client";

import { Store, Globe, Phone, Copy, MoreVertical, ShoppingBag, CheckCircle, XCircle, Package, Plus, Eye, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { useStoreProfile } from "@/hooks/StoreProfile/useStoreProfile";
import { useEffect, useState } from "react";

export const StorePage = () => {
    const { storeProfile, store, loading } = useStoreProfile();
    const [baseUrl, setBaseUrl] = useState<string>("");
    
    console.log(storeProfile);

    // Obtener la URL base de manera segura en el cliente
    useEffect(() => {
        setBaseUrl(window.location.origin);
    }, []);

    const stats = [
        { icon: ShoppingBag, label: "Store Total Products", value: "1,500", color: "text-purple-600" },
        { icon: CheckCircle, label: "Available Products", value: "1,200", color: "text-pink-600" },
        { icon: XCircle, label: "Unavailable Products", value: "300", color: "text-blue-400" },
        { icon: Package, label: "Total Product Sold", value: "10,000", color: "text-blue-400" }
    ];

    const categories = [
        { name: "Oil Filters", image: "/images/oil-filter.jpg" },
        { name: "Break Pads", image: "/images/brake-pads.jpg" },
        { name: "Break Shoes", image: "/images/brake-shoes.jpg" },
        { name: "Add Category", isAdd: true }
    ];

    const products = [
        {
            id: 1,
            name: "Brake Pads",
            brand: "Bosch",
            basePrice: 35.00,
            yourPrice: 45.00,
            image: "/images/spark-plugs.jpg",
            isNew: false
        },
        {
            id: 2,
            name: "Brake Pads",
            brand: "Bosch",
            basePrice: 35.00,
            yourPrice: 45.00,
            image: "/images/engine-oil.jpg",
            isNew: false
        },
        {
            id: 3,
            name: "Brake Pads",
            brand: "Bosch",
            basePrice: 35.00,
            yourPrice: 45.00,
            image: "/images/suspension-spring.jpg",
            isNew: true
        },
        {
            id: 4,
            name: "Brake Pads",
            brand: "Bosch",
            basePrice: 35.00,
            yourPrice: 45.00,
            image: "/images/headlight-bulbs.jpg",
            isNew: false
        }
    ];

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

    const getProductUrl = (productId: number) => {
        if (storeProfile?.name && baseUrl) {
            const storeSlug = storeProfile.name
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-+|-+$/g, '');
            return `${baseUrl}/store/public/${storeSlug}/product/${productId}`;
        }
        return baseUrl ? `${baseUrl}/store/public/default/product/${productId}` : `/store/public/default/product/${productId}`;
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

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Top Banner */}
            <div className="relative bg-gray-800 text-white py-16 px-6 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-gray-700 opacity-90"></div>
                <div className="relative z-10 max-w-7xl mx-auto flex justify-between items-center">
                    <div className="flex-1">
                        <h1 className="text-4xl font-bold mb-4">Fast, Affordable, Delivered to You</h1>
                        <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg">
                            Shop now
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
                                        <h2 className="text-3xl font-bold">{storeProfile?.name || "Auto Parts"}</h2>
                                        <Badge className="bg-red-500 text-white">free</Badge>
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
                <h3 className="text-2xl font-bold mb-6">Quick Overview</h3>
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

            {/* Categories */}
            <div className="max-w-7xl mx-auto px-6 mt-12">
                <h3 className="text-2xl font-bold mb-6">My Category</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {categories.map((category, index) => (
                        <div key={index} className="text-center">
                            {category.isAdd ? (
                                <Card className="bg-red-500 text-white cursor-pointer hover:bg-red-600 transition-colors">
                                    <CardContent className="p-6 flex flex-col items-center justify-center h-32">
                                        <Plus className="w-12 h-12 mb-2" />
                                        <span className="font-medium">Add Category</span>
                                    </CardContent>
                                </Card>
                            ) : (
                                <Card className="bg-white shadow-md cursor-pointer hover:shadow-lg transition-shadow">
                                    <CardContent className="p-4">
                                        <div className="w-20 h-20 bg-gray-200 rounded-lg mx-auto mb-3"></div>
                                        <span className="font-medium">{category.name}</span>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Products */}
            <div className="max-w-7xl mx-auto px-6 mt-12 mb-12">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold">My Products</h3>
                    <Link href="/store/products" className="text-red-500 hover:text-red-600 font-medium">
                        See all
                    </Link>
                </div>
                
                {/* Tabs */}
                <div className="flex space-x-1 mb-6">
                    <Button variant="default" className="rounded-full">All</Button>
                    <Button variant="outline" className="rounded-full">Available</Button>
                    <Button variant="outline" className="rounded-full">Unavailable</Button>
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <Link key={product.id} href={getProductUrl(product.id)} target="_blank">
                            <Card className="bg-white shadow-md hover:shadow-lg transition-shadow">
                                <CardContent className="p-4">
                                    <div className="relative mb-3">
                                        <div className="w-full h-32 bg-gray-200 rounded-lg"></div>
                                        {product.isNew && (
                                            <Badge className="absolute top-2 left-2 bg-orange-500 text-white text-xs">
                                                New
                                            </Badge>
                                        )}
                                        <Button 
                                            variant="ghost" 
                                            size="sm" 
                                            className="absolute top-2 right-2 p-1 h-auto bg-white/80 hover:bg-white"
                                        >
                                            <ShoppingCart className="w-4 h-4 text-pink-500" />
                                        </Button>
                                    </div>
                                    <div className="space-y-2">
                                        <h4 className="font-medium">{product.name}</h4>
                                        <p className="text-sm text-gray-600">Brand: {product.brand}</p>
                                        <div className="space-y-1">
                                            <p className="text-sm text-gray-500">Base Price ${product.basePrice.toFixed(2)}</p>
                                            <p className="text-sm font-medium">Your Price ${product.yourPrice.toFixed(2)}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
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
        </div>
    );
};