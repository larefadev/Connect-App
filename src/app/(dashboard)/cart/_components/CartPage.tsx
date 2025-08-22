import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {Package, Trash2} from "lucide-react";

export const CartPage = () => {
    const cartItems = [
        { id: 1, name: "Vehicle Charger", price: 15.00, quantity: 2, image: "/api/placeholder/50/50" },
        { id: 2, name: "Brake Pads", price: 45.00, quantity: 1, image: "/api/placeholder/50/50" },
        { id: 3, name: "Brake Pads", price: 50.00, quantity: 1, image: "/api/placeholder/50/50" }
    ];

    const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">My Cart</h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Cart Items ({cartItems.length})</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {cartItems.map((item) => (
                                <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                                        <Package className="w-8 h-8 text-gray-400" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-medium">{item.name}</h3>
                                        <p className="text-gray-600">${item.price.toFixed(2)} each</p>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Button variant="outline" size="sm">-</Button>
                                        <span className="w-8 text-center">{item.quantity}</span>
                                        <Button variant="outline" size="sm">+</Button>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                                    </div>
                                    <Button variant="ghost" size="sm">
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>

                <div>
                    <Card>
                        <CardHeader>
                            <CardTitle>Order Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span>${total.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Shipping</span>
                                <span>$5.00</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Tax</span>
                                <span>${(total * 0.1).toFixed(2)}</span>
                            </div>
                            <hr />
                            <div className="flex justify-between font-bold text-lg">
                                <span>Total</span>
                                <span>${(total + 5 + (total * 0.1)).toFixed(2)}</span>
                            </div>
                            <Button className="w-full bg-red-500 hover:bg-red-600 text-white">
                                Proceed to Checkout
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

