"use client";

import { Store, Globe, Phone, ShoppingCart, Heart, Star, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default function PublicStorePage() {
    const categories = [
        "Todos", "Filtros de Aceite", "Pastillas de Freno", "Zapatas de Freno", "Bujías", "Aceite de Motor", "Suspensión", "Iluminación"
    ];

    const products = [
        {
            id: 1,
            name: "Pastillas de Freno Premium Cerámicas Bosch",
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
            name: "Aceite de Motor Castrol EDGE 5W-30",
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
            name: "Juego de Resortes de Suspensión Performance",
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
            name: "Bombillas LED H4 para Faros",
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
            name: "Juego de Bujías NGK",
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
            name: "Filtro de Aceite Premium",
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

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
                                <Store className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-gray-900">Repuestos Automotrices</h1>
                                <p className="text-sm text-gray-600">Tu tienda de confianza para repuestos de calidad</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="hidden md:flex items-center space-x-6 text-sm text-gray-600">
                                <div className="flex items-center space-x-2">
                                    <Globe className="w-4 h-4" />
                                    <span>www.larefa.com</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Phone className="w-4 h-4" />
                                    <span>+1 888 235 8926</span>
                                </div>
                            </div>
                            <Button className="bg-red-600 hover:bg-red-700">
                                <ShoppingCart className="w-4 h-4 mr-2" />
                                Carrito (0)
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <div className="bg-gradient-to-r from-red-600 to-red-800 text-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-4xl font-bold mb-4">
                        Encuentra los Mejores Repuestos para tu Vehículo
                    </h2>
                    <p className="text-xl mb-8 text-red-100">
                        Más de 250,000 repuestos de calidad con envío rápido y garantía
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button size="lg" className="bg-white text-red-600 hover:bg-gray-100">
                            Explorar Catálogo
                        </Button>
                        <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-red-600">
                            Contactar Vendedor
                        </Button>
                    </div>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <Input 
                                placeholder="Buscar repuestos automotrices..." 
                                className="pl-10 pr-4 py-3"
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
                        <Link key={product.id} href={`/store/public/product/${product.id}`}>
                            <Card className="bg-white shadow-md hover:shadow-lg transition-shadow cursor-pointer">
                                <CardContent className="p-4">
                                    <div className="relative mb-4">
                                        <div className="w-full h-48 bg-gray-200 rounded-lg mb-3"></div>
                                        {product.isNew && (
                                            <Badge className="absolute top-2 left-2 bg-orange-500 text-white text-xs">
                                                Nuevo
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
                                        <p className="text-sm text-gray-600">Marca: {product.brand}</p>
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
                                <h3 className="text-xl font-bold">Repuestos Automotrices</h3>
                            </div>
                            <p className="text-gray-400 mb-4">
                                Tu proveedor confiable de repuestos automotrices de alta calidad con más de 20 años de experiencia en el mercado.
                            </p>
                            <div className="flex space-x-4">
                                <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                                    <Globe className="w-4 h-4 mr-2" />
                                    Sitio Web
                                </Button>
                                <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                                    <Phone className="w-4 h-4 mr-2" />
                                    Contactar
                                </Button>
                            </div>
                        </div>
                        <div>
                            <h4 className="text-lg font-semibold mb-4">Enlaces Rápidos</h4>
                            <ul className="space-y-2 text-gray-400">
                                <li><a href="#" className="hover:text-white transition-colors">Catálogo de Productos</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Ofertas Especiales</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Garantías</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Política de Devoluciones</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Términos y Condiciones</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-lg font-semibold mb-4">Información de Contacto</h4>
                            <div className="space-y-3 text-gray-400">
                                <div className="flex items-center space-x-3">
                                    <Globe className="w-5 h-5 text-gray-500" />
                                    <span>www.larefa.com</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <Phone className="w-5 h-5 text-gray-500" />
                                    <span>+1 888 235 8926</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <Store className="w-5 h-5 text-gray-500" />
                                    <span>Av. Insurgentes Sur 1234, Ciudad de México</span>
                                </div>
                            </div>
                            <div className="mt-6">
                                <h5 className="font-medium mb-2">Horarios de Atención</h5>
                                <p className="text-sm text-gray-400">
                                    Lunes a Viernes: 8:00 AM - 6:00 PM<br />
                                    Sábados: 9:00 AM - 2:00 PM<br />
                                    Domingos: Cerrado
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
                        <p>&copy; 2025 Repuestos Automotrices. Todos los derechos reservados.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
