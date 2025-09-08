import { Badge, Button, Card, CardContent } from "@/components"
import { Order } from "@/stores"
import { Eye } from "lucide-react"

type OrderTableProps = {
    orders: Order[]
    openOrderModal: (order: Order) => void
    getBadgeVariant: (status: Order['order_status']) => React.ComponentProps<typeof Badge>['variant']
    getPaymentBadgeVariant: (status: Order['payment_status']) => React.ComponentProps<typeof Badge>['variant']
}


export const OrderTable = ({ orders, openOrderModal, getBadgeVariant, getPaymentBadgeVariant }: OrderTableProps) => {

    return (
        <Card>
            <CardContent className="p-0">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="text-left p-4 font-medium">Número de Pedido</th>
                                <th className="text-left p-4 font-medium">Cliente</th>
                                <th className="text-left p-4 font-medium">Fecha</th>
                                <th className="text-left p-4 font-medium">Total</th>
                                <th className="text-left p-4 font-medium">Estado</th>
                                <th className="text-left p-4 font-medium">Pago</th>
                                 <th className="text-left p-4 font-medium">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <tr key={order.id} className="border-b hover:bg-gray-50">
                                    <td className="p-4 font-medium">{order.order_number}</td>
                                    <td className="p-4">
                                        <div>
                                            <div className="font-medium">{order.customer_name}</div>
                                            <div className="text-sm text-gray-500">{order.customer_email}</div>
                                        </div>
                                    </td>
                                    <td className="p-4 text-gray-600">
                                        {order.created_at ? new Date(order.created_at).toLocaleDateString('es-ES') : 'N/A'}
                                    </td>
                                    <td className="p-4 font-semibold">${order.total_amount.toFixed(2)}</td>
                                    <td className="p-4">
                                        <Badge variant={getBadgeVariant(order.order_status)}>
                                            {order.order_status === 'pending' && 'Pendiente'}
                                            {order.order_status === 'confirmed' && 'Confirmado'}
                                            {order.order_status === 'preparing' && 'Preparando'}
                                            {order.order_status === 'shipped' && 'Enviado'}
                                            {order.order_status === 'delivered' && 'Entregado'}
                                            {order.order_status === 'cancelled' && 'Cancelado'}
                                        </Badge>
                                    </td>
                                    <td className="p-4">
                                        <Badge variant={getPaymentBadgeVariant(order.payment_status)}>
                                            {order.payment_status === 'pending' && 'Pendiente'}
                                            {order.payment_status === 'paid' && 'Pagado'}
                                            {order.payment_status === 'failed' && 'Fallido'}
                                            {order.payment_status === 'refunded' && 'Reembolsado'}
                                        </Badge>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex space-x-2">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => openOrderModal(order)}
                                            >
                                                <Eye className="w-4 h-4 mr-2" />
                                                Ver
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    )
}