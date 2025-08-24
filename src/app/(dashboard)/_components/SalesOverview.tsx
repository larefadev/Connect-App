import { Card, CardContent } from "@/components/ui/card";
import { DollarSign, ShoppingBag, TrendingUp, Users } from "lucide-react";
import React from "react";

export const SalesOverview = () => {
    const salesData = {
        totalRevenue: 0,
        averageOrder: 0,
        totalCustomers: 0,
        productsSold: 0
    };

    return (
        <div>
            <h2 className="text-xl font-semibold mb-6 text-gray-800">Resumen de Ventas</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Total de Ventas</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    ${salesData.totalRevenue.toLocaleString()}
                                </p>
                            </div>
                            <div className="p-3 bg-purple-100 rounded-full">
                                <DollarSign className="w-6 h-6 text-purple-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                
                <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Promedio de Órdenes</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    ${salesData.averageOrder.toLocaleString()}
                                </p>
                            </div>
                            <div className="p-3 bg-pink-100 rounded-full">
                                <TrendingUp className="w-6 h-6 text-pink-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                
                <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Total de Clientes</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {salesData.totalCustomers.toLocaleString()}
                                </p>
                            </div>
                            <div className="p-3 bg-blue-100 rounded-full">
                                <Users className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                
                <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Productos Vendidos</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {salesData.productsSold.toLocaleString()}
                                </p>
                            </div>
                            <div className="p-3 bg-green-100 rounded-full">
                                <ShoppingBag className="w-6 h-6 text-green-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};