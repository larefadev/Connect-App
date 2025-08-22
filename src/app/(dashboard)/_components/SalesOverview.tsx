import {Card, CardContent} from "@/components/ui/card";
import {DollarSign, ShoppingBag, TrendingUp, Users} from "lucide-react";
import React from "react";

export const SalesOverview = () => {
    const salesData = {
        totalRevenue: 0,
        averageOrder: 0,
        totalCustomers: 0,
        productsSold: 0
    };

    return(
        <div>
            <h2 className="text-lg font-semibold mb-4">Resumen de ventas</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Total de ventas</p>
                                <p className="text-2xl font-bold">${salesData.totalRevenue.toLocaleString()}</p>
                            </div>
                            <div className="p-2 bg-purple-100 rounded-full">
                                <DollarSign className="w-5 h-5 text-purple-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Promedio de ordenes</p>
                                <p className="text-2xl font-bold">{salesData.averageOrder.toLocaleString()}</p>
                            </div>
                            <div className="p-2 bg-pink-100 rounded-full">
                                <TrendingUp className="w-5 h-5 text-pink-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Total de clientes</p>
                                <p className="text-2xl font-bold">{salesData.totalCustomers}</p>
                            </div>
                            <div className="p-2 bg-blue-100 rounded-full">
                                <Users className="w-5 h-5 text-blue-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Productos vendidos</p>
                                <p className="text-2xl font-bold">{salesData.productsSold}</p>
                            </div>
                            <div className="p-2 bg-green-100 rounded-full">
                                <ShoppingBag className="w-5 h-5 text-green-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}