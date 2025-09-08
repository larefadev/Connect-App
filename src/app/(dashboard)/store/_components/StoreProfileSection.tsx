import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Globe, Phone, Copy, Store, MoreVertical } from "lucide-react"
import { StoreProfile } from "@/types/store"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"

export const StoreProfileSection = ({ storeProfile }: { storeProfile: StoreProfile }) => {
    return (
        <div className="max-w-7xl mx-auto px-6 -mt-8 relative z-20">
            <Card className="shadow-lg">
                <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center overflow-hidden">
                                {storeProfile?.logo_image ? (
                                    <Image
                                        src={storeProfile.logo_image}
                                        alt="Logo de la tienda"
                                        width={80}
                                        height={80}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <Store className="w-10 h-10 text-white" />
                                )}
                            </div>
                            <div>
                                <div className="flex items-center space-x-3 mb-2">
                                    <h2 className="text-3xl font-bold">{storeProfile?.name || "Repuestos Automotrices"}</h2>
                                    <Badge className="bg-red-500 text-white">gratis</Badge>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center space-x-2 text-gray-600">
                                        <Globe className="w-4 h-4" />
                                        <span>{storeProfile?.name ? `${storeProfile.name.toLowerCase().replace(/\s+/g, '')}.larefa.com` : "autoparts.larefa.com"}</span>
                                        <Button variant="ghost" size="sm" className="p-1 h-auto">
                                            <Copy className="w-3 h-3" />
                                        </Button>
                                    </div>
                                    <div className="flex items-center space-x-2 text-gray-600">
                                        <Phone className="w-4 h-4" />
                                        <span>{storeProfile?.phone || "1 888 235 9826"}</span>
                                        <Button variant="ghost" size="sm" className="p-1 h-auto">
                                            <Copy className="w-3 h-3" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <Button variant="ghost" size="sm">
                            <MoreVertical className="w-5 h-5" />
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}