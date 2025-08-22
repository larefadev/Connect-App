import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {AlertTriangle, Eye} from "lucide-react";
import React from "react";

export const DashboardInformation = () =>{
    const walletBalance = 5184.54;
    const orderData = {
        total: 5980,
        success: 3980,
        pending: 1020,
        cancelled: 80
    };

    return(
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
                <CardHeader>
                    <CardTitle>Order Information</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-center mb-4">
                        <div className="relative w-48 h-48">
                            <svg className="transform -rotate-90 w-48 h-48">
                                <circle cx="96" cy="96" r="80" stroke="#e5e7eb" strokeWidth="12" fill="transparent" />
                                <circle cx="96" cy="96" r="80" stroke="#10b981" strokeWidth="12" fill="transparent"
                                        strokeDasharray={`${(orderData.success / orderData.total) * 502} 502`} strokeLinecap="round" />
                                <circle cx="96" cy="96" r="80" stroke="#f59e0b" strokeWidth="12" fill="transparent"
                                        strokeDasharray={`${(orderData.pending / orderData.total) * 502} 502`}
                                        strokeDashoffset={`-${(orderData.success / orderData.total) * 502}`} strokeLinecap="round" />
                                <circle cx="96" cy="96" r="80" stroke="#ef4444" strokeWidth="12" fill="transparent"
                                        strokeDasharray={`${(orderData.cancelled / orderData.total) * 502} 502`}
                                        strokeDashoffset={`-${((orderData.success + orderData.pending) / orderData.total) * 502}`} strokeLinecap="round" />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center flex-col">
                                <span className="text-3xl font-bold">{orderData.total.toLocaleString()}</span>
                                <span className="text-gray-500">Total Order</span>
                                <span className="text-gray-500">on this week</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-center space-x-6">
                        <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <span className="text-sm">Success</span>
                            <span className="text-sm font-semibold">{orderData.success.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                            <span className="text-sm">Pending</span>
                            <span className="text-sm font-semibold">{orderData.pending.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                            <span className="text-sm">Cancelled</span>
                            <span className="text-sm font-semibold">{orderData.cancelled}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="space-y-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Wallet Balance</CardTitle>
                        <Button variant="link" className="text-red-500 text-sm p-0">Top Up</Button>
                    </CardHeader>
                    <CardContent>
                        <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white p-4 rounded-lg">
                            <p className="text-sm mb-1">Your Current Balance</p>
                            <p className="text-2xl font-bold mb-2">${walletBalance.toLocaleString()}</p>
                            <Button variant="link" className="text-white p-0 text-sm">
                                Tap to view details
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>After Sales Support</CardTitle>
                        <Button variant="link" className="text-red-500 text-sm p-0">See all</Button>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-center py-8">
                            <div className="text-center">
                                <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                                <div className="space-y-2">
                                    <p className="text-sm font-medium">Tickets</p>
                                    <p className="text-xs text-gray-500">Active Issues: 3</p>
                                    <Button className="bg-red-500 hover:bg-red-600 text-white">
                                        <Eye className="w-4 h-4 mr-2" />
                                        View Tickets
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}