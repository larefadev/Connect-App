import { Button } from "@/components/ui/button"
import { Copy, Eye } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

type StoreLinkProps = {
    getPublicStoreUrl: () => string
}


export const StoreLink = ({ getPublicStoreUrl }: StoreLinkProps) => {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-6 sm:mb-8">
            <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                        <div className="flex-1">
                            <h4 className="text-base sm:text-lg font-semibold text-blue-900 mb-2">Tu Tienda Pública</h4>
                            <p className="text-sm sm:text-base text-blue-700 mb-3">
                                Comparte este enlace con tus clientes para que puedan ver tu catálogo público sin acceso al dashboard.
                            </p>
                            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                                <input
                                    type="text"
                                    value={getPublicStoreUrl()}
                                    readOnly
                                    className="px-3 py-2 border border-blue-300 rounded-md bg-white text-blue-900 text-sm flex-1 min-w-0"
                                />
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => navigator.clipboard.writeText(getPublicStoreUrl())}
                                    className="w-full sm:w-auto"
                                >
                                    <Copy className="w-4 h-4 mr-2" />
                                    Copiar
                                </Button>
                            </div>
                        </div>
                        <div className="flex justify-center lg:justify-end">
                            <Link href={getPublicStoreUrl()} target="_blank">
                                <Button className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto">
                                    <Eye className="w-4 h-4 mr-2" />
                                    Ver Tienda Pública
                                </Button>
                            </Link>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}