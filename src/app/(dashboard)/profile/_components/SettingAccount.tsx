import { Card, CardContent, CardHeader, CardTitle } from "@/components"

export const SettingAccount = () => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Configuración de la Cuenta</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                        <h3 className="font-medium">Notificaciones por Email</h3>
                        <p className="text-sm text-gray-500">Recibe actualizaciones por email sobre tus pedidos</p>
                    </div>
                    <input type="checkbox" defaultChecked className="w-4 h-4" />
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                        <h3 className="font-medium">Notificaciones por SMS</h3>
                        <p className="text-sm text-gray-500">Recibe actualizaciones por SMS sobre tus pedidos</p>
                    </div>
                    <input type="checkbox" className="w-4 h-4" />
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                        <h3 className="font-medium">Comunicaciones de Marketing</h3>
                        <p className="text-sm text-gray-500">Recibe emails promocionales y ofertas</p>
                    </div>
                    <input type="checkbox" defaultChecked className="w-4 h-4" />
                </div>
            </CardContent>
        </Card>
    )
}