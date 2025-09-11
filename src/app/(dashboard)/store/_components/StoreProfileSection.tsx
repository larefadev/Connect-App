import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Globe, Phone, Copy, Store, MoreVertical } from "lucide-react"
import { StoreProfile } from "@/types/store"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"

export const StoreProfileSection = ({ storeProfile }: { storeProfile: StoreProfile }) => {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 -mt-6 sm:-mt-8 relative z-20">
            <Card className="shadow-lg">
                <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-black rounded-full flex items-center justify-center overflow-hidden mx-auto sm:mx-0">
                                {storeProfile?.logo_image ? (
                                    <Image
                                        src={storeProfile.logo_image}
                                        alt="Logo de la tienda"
                                        width={80}
                                        height={80}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <Store className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                                )}
                            </div>
                            <div className="text-center sm:text-left">
                                <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 mb-3 sm:mb-2">
                                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold">{storeProfile?.name || "Repuestos Automotrices"}</h2>
                                    <Badge className="bg-red-500 text-white w-fit mx-auto sm:mx-0">gratis</Badge>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2 text-gray-600">
                                        <div className="flex items-center justify-center sm:justify-start space-x-2">
                                            <Globe className="w-4 h-4 flex-shrink-0" />
                                            <span className="text-sm sm:text-base truncate">{storeProfile?.name ? `${storeProfile.name.toLowerCase().replace(/\s+/g, '')}.larefa.com` : "autoparts.larefa.com"}</span>
                                        </div>
                                        <Button variant="ghost" size="sm" className="p-1 h-auto mx-auto sm:mx-0">
                                            <Copy className="w-3 h-3" />
                                        </Button>
                                    </div>
                                    <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2 text-gray-600">
                                        <div className="flex items-center justify-center sm:justify-start space-x-2">
                                            <Phone className="w-4 h-4 flex-shrink-0" />
                                            <span className="text-sm sm:text-base">{storeProfile?.phone || "1 888 235 9826"}</span>
                                        </div>
                                        <Button variant="ghost" size="sm" className="p-1 h-auto mx-auto sm:mx-0">
                                            <Copy className="w-3 h-3" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-center sm:justify-end mt-4 sm:mt-0">
                            <Button variant="ghost" size="sm">
                                <MoreVertical className="w-5 h-5" />
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}