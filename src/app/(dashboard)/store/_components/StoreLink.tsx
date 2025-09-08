import { Button } from "@/components/ui/button"
import { Copy, Eye } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

type StoreLinkProps = {
    getPublicStoreUrl: () => string
}


export const StoreLink = ({ getPublicStoreUrl }: StoreLinkProps) => {
    return (
        <div className="max-w-7xl mx-auto px-6 mb-8">
            <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h4 className="text-lg font-semibold text-blue-900 mb-2">Tu Tienda Pública</h4>
                            <p className="text-blue-700 mb-3">
                                Comparte este enlace con tus clientes para que puedan ver tu catálogo público sin acceso al dashboard.
                            </p>
                            <div className="flex items-center space-x-2">
                                <input
                                    type="text"
                                    value={getPublicStoreUrl()}
                                        readOnly
                                        className="px-3 py-2 border border-blue-300 rounded-md bg-white text-blue-900 flex-1"
                                />
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => navigator.clipboard.writeText(getPublicStoreUrl())}
                                >
                                    <Copy className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                        <Link href={getPublicStoreUrl()} target="_blank">
                            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                                <Eye className="w-4 h-4 mr-2" />
                                Ver Tienda Pública
                            </Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}