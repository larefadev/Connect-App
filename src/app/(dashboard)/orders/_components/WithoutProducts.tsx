import { Card, CardContent } from "@/components"

export const WithoutProducts = () => {

    return (
        <Card>
            <CardContent className="p-12">
                <div className="text-center">
                    <div className="text-gray-400 text-6xl mb-4">📦</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No hay pedidos aún</h3>
                    <p className="text-gray-500">
                        Cuando los clientes realicen compras desde tu tienda, aparecerán aquí.
                    </p>
                </div>
            </CardContent>
        </Card>
    )

}