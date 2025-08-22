"use client";

import { ArrowLeft, MoreVertical, CheckCircle, Shield, Truck, Star, ShoppingCart, Heart, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function ProductDetailPage({ params }: { params: Promise<{ storeName: string; id: string }> }) {
    const resolvedParams = useParams();
    const storeName = resolvedParams.storeName as string;
    const id = resolvedParams.id as string;

    const product = {
        id: id,
        name: "Brake Pads",
        sku: "BRK-45872",
        buyingPrice: 25.00,
        brand: "Bosch",
        sellingPrice: 35.00,
        profit: 10.00,
        inStock: true,
        description: "Bosch Premium Ceramic Brake Pads are engineered for superior braking performance and long-lasting durability. Designed to reduce noise, vibration, and brake dust, these pads ensure a smoother, quieter ride while protecting your rotors.",
        images: [
            "/images/brake-rotor.jpg",
            "/images/brake-pads.jpg",
            "/images/brake-caliper.jpg"
        ],
        benefits: [
            "Reduced brake noise and dust",
            "Extended pad and rotor life",
            "Smooth, consistent braking feel",
            "Easy installation with precise fitment",
            "Backed by a 6-month warranty"
        ],
        options: {
            color: ["Red", "Black", "Blue"],
            diameter: ["40mm", "50mm", "60mm", "70mm", "80mm"],
            width: ["8\"", "9\"", "10\"", "11\"", "12\""]
        },
        compatibleWith: "Toyota Corolla 2017-2022 (Front)",
        warranty: "Backed by a 6-month warranty",
        deliveryTime: "1-2 Hours (local)/24-48 hrs(national)"
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <Link href={`/store/public/${storeName}`} className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
                            <ArrowLeft className="w-5 h-5" />
                            <span>Back to {storeName}</span>
                        </Link>
                        <Button variant="ghost" size="sm">
                            <MoreVertical className="w-5 h-5" />
                        </Button>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Left Column - Images */}
                    <div>
                        {/* Image Carousel */}
                        <div className="relative mb-6">
                            <div className="w-full h-96 bg-gray-200 rounded-lg mb-4"></div>
                            {/* Carousel Dots */}
                            <div className="flex justify-center space-x-2">
                                <div className="w-3 h-3 bg-gray-800 rounded-full"></div>
                                <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                                <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Product Info */}
                    <div className="space-y-6">
                        {/* Product Title and Basic Info */}
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
                            <p className="text-gray-600 mb-2">SKU: {product.sku}</p>
                            <p className="text-gray-600 mb-2">Buying Price: ${product.buyingPrice.toFixed(2)}</p>
                            <p className="text-gray-600 mb-4">
                                Brand: <span className="text-orange-500 font-medium">{product.brand}</span>
                            </p>
                        </div>

                        {/* Pricing and Stock */}
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="text-sm text-gray-600">Selling Price: <span className="text-red-600 font-medium">${product.sellingPrice.toFixed(2)}</span></p>
                                <p className="text-sm text-green-600 font-medium">Profit: ${product.profit.toFixed(2)}</p>
                            </div>
                            <div className="text-right">
                                <Badge className="bg-orange-500 text-white mb-2">In Stock</Badge>
                                <p className="text-sm text-gray-600">Selling Price: <span className="text-red-600 font-medium">${product.sellingPrice.toFixed(2)}</span></p>
                                <p className="text-sm text-green-600 font-medium">Profit: ${product.profit.toFixed(2)}</p>
                            </div>
                        </div>

                        {/* Product Description */}
                        <div>
                            <p className="text-gray-700 leading-relaxed">{product.description}</p>
                        </div>

                        {/* Key Benefits */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">Key Benefits</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {product.benefits.map((benefit, index) => (
                                    <div key={index} className="flex items-start space-x-2">
                                        <CheckCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                                        <span className="text-sm text-gray-700">{benefit}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Product Options */}
                        <div className="space-y-4">
                            {/* Color */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                                <Input 
                                    placeholder="Color" 
                                    className="w-full"
                                    readOnly
                                />
                            </div>

                            {/* Diameter */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Diameter</label>
                                <div className="flex flex-wrap gap-2">
                                    {product.options.diameter.map((diameter, index) => (
                                        <Button 
                                            key={index}
                                            variant={index === 0 ? "default" : "outline"}
                                            size="sm"
                                            className="rounded-full"
                                        >
                                            {diameter}
                                        </Button>
                                    ))}
                                </div>
                            </div>

                            {/* Width */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Width</label>
                                <div className="flex flex-wrap gap-2">
                                    {product.options.width.map((width, index) => (
                                        <Button 
                                            key={index}
                                            variant={index === 0 ? "default" : "outline"}
                                            size="sm"
                                            className="rounded-full"
                                        >
                                            {width}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Product Info Cards */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">Product Info</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <Card className="bg-white">
                                    <CardContent className="p-4 text-center">
                                        <CheckCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
                                        <p className="text-sm font-medium text-gray-700 mb-1">Compatible With</p>
                                        <p className="text-xs text-gray-600">{product.compatibleWith}</p>
                                    </CardContent>
                                </Card>
                                <Card className="bg-white">
                                    <CardContent className="p-4 text-center">
                                        <Shield className="w-8 h-8 text-red-500 mx-auto mb-2" />
                                        <p className="text-sm font-medium text-gray-700 mb-1">Warranty</p>
                                        <p className="text-xs text-gray-600">{product.warranty}</p>
                                    </CardContent>
                                </Card>
                                <Card className="bg-white">
                                    <CardContent className="p-4 text-center">
                                        <Truck className="w-8 h-8 text-red-500 mx-auto mb-2" />
                                        <p className="text-sm font-medium text-gray-700 mb-1">Delivery Time</p>
                                        <p className="text-xs text-gray-600">{product.deliveryTime}</p>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex space-x-4 pt-4">
                            <Button variant="outline" className="flex-1 border-red-500 text-red-500 hover:bg-red-50">
                                <Share2 className="w-4 h-4 mr-2" />
                                Share via Whatsapp
                            </Button>
                            <Button className="flex-1 bg-red-600 hover:bg-red-700 text-white">
                                <ShoppingCart className="w-4 h-4 mr-2" />
                                Create Quotation
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
