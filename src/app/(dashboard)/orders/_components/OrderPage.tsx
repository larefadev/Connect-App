import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download, Eye } from "lucide-react";

type OrderStatus = "Completed" | "Pending" | "Processing" | "Cancelled";

type Order = {
    id: string;
    customer: string;
    date: string;
    total: number;
    status: OrderStatus;
};

const getBadgeVariant = (status: OrderStatus): React.ComponentProps<typeof Badge>['variant'] => {
    switch (status) {
        case "Completed":
            return "default";
        case "Processing":
        case "Pending":
            return "secondary";
        case "Cancelled":
            return "destructive";
    }
};

export const OrdersPage = () => {
    const orders: Order[] = [
        { id: "#12345", customer: "Juan Pérez", date: "2024-08-01", total: 125.50, status: "Completed" },
        { id: "#12346", customer: "María García", date: "2024-08-01", total: 89.99, status: "Pending" },
        { id: "#12347", customer: "Carlos López", date: "2024-07-31", total: 234.75, status: "Processing" },
        { id: "#12348", customer: "Ana Martínez", date: "2024-07-31", total: 67.25, status: "Cancelled" }
    ];

    return(
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Order List</h2>
                <div className="flex gap-2">
                    <Button variant="outline">
                        <Download className="w-4 h-4 mr-2" />
                        Export
                    </Button>
                </div>
            </div>

            <Card>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="text-left p-4 font-medium">Order ID</th>
                                <th className="text-left p-4 font-medium">Customer</th>
                                <th className="text-left p-4 font-medium">Date</th>
                                <th className="text-left p-4 font-medium">Total</th>
                                <th className="text-left p-4 font-medium">Status</th>
                                <th className="text-left p-4 font-medium">Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {orders.map((order) => (
                                <tr key={order.id} className="border-b hover:bg-gray-50">
                                    <td className="p-4 font-medium">{order.id}</td>
                                    <td className="p-4">{order.customer}</td>
                                    <td className="p-4 text-gray-600">{order.date}</td>
                                    <td className="p-4 font-semibold">${order.total.toFixed(2)}</td>
                                    <td className="p-4">
                                        <Badge variant={getBadgeVariant(order.status)}>
                                            {order.status}
                                        </Badge>
                                    </td>
                                    <td className="p-4">
                                        <Button variant="ghost" size="sm">
                                            <Eye className="w-4 h-4 mr-2" />
                                            View
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
