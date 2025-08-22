import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {ProductCard} from "@/app/(dashboard)/_components/ProductCard";
import React from "react";

export const NewArrivals = () => {
    const newArrivals = [
        { id: 1, name: "Vehicle Charger", price: 15.00, isNew: true, isSale: false },
        { id: 2, name: "Vehicle Charger", price: 15.00, isNew: false, isSale: true },
        { id: 3, name: "Vehicle Charger", price: 16.00, isNew: false, isSale: true },
        { id: 4, name: "Vehicle Charger", price: 15.00, isNew: false, isSale: true }
    ];
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>New Arrivals</CardTitle>
                <Button variant="link" className="text-red-500 text-sm p-0">See all</Button>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {newArrivals.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}