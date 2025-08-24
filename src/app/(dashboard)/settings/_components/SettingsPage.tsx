import { Button } from "@/components/ui/button";
import {Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {Globe, Package, Settings , History} from "lucide-react";

export const SettingsPage = () => (
    <div className="space-y-6">
        <h2 className="text-2xl font-bold">Ajustes</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>Ajustes Generales</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Idioma</label>
                        <select className="w-full p-2 border rounded-lg">
                            <option>Inglés</option>
                            <option>Español</option>
                            <option>Francés</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Moneda</label>
                        <select className="w-full p-2 border rounded-lg">
                            <option>USD ($)</option>
                            <option>EUR (€)</option>
                            <option>COP ($)</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Zona Horaria</label>
                        <select className="w-full p-2 border rounded-lg">
                            <option>America/Bogota</option>
                            <option>America/New_York</option>
                            <option>Europe/London</option>
                        </select>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Seguridad</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Button variant="outline" className="w-full justify-start">
                        <Settings className="w-4 h-4 mr-2" />
                        Cambiar Contraseña
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                        <Settings className="w-4 h-4 mr-2" />
                        Autenticación de Dos Factores
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                        <History className="w-4 h-4 mr-2" />
                        Historial de Inicio de Sesión
                    </Button>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Ajustes de la Tienda</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Nombre de la Tienda</label>
                        <input type="text" className="w-full p-2 border rounded-lg" defaultValue="LA REFA - Repuestos Automotrices" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Horario de Atención</label>
                        <div className="grid grid-cols-2 gap-2">
                            <input type="time" className="p-2 border rounded-lg" defaultValue="09:00" />
                            <input type="time" className="p-2 border rounded-lg" defaultValue="18:00" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Tasa de Impuesto (%)</label>
                        <input type="number" className="w-full p-2 border rounded-lg" defaultValue="10" />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Integraciones</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-3">
                            <Globe className="w-8 h-8 text-blue-500" />
                            <div>
                                <h3 className="font-medium">WhatsApp Business</h3>
                                <p className="text-sm text-gray-500">Conectar con clientes</p>
                            </div>
                        </div>
                        <Button variant="outline" size="sm">Conectar</Button>
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-3">
                            <Package className="w-8 h-8 text-green-500" />
                            <div>
                                <h3 className="font-medium">Gestión de Inventario</h3>
                                <p className="text-sm text-gray-500">Sincronizar con sistemas externos</p>
                            </div>
                        </div>
                        <Button variant="outline" size="sm">Conectar</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    </div>
);