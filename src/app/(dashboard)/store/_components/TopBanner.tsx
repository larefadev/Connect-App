import { StoreProfile } from "@/types/store"
import { Button } from "@/components/ui/button"
import Image from "next/image"

type TopBannerProps = {
    storeProfile: StoreProfile | null
}

export const TopBanner = ({ storeProfile }: TopBannerProps) => {
    return(
        <div className="relative bg-gray-800 text-white py-16 px-6 overflow-hidden">
        {storeProfile?.banner_image ? (
            <Image 
                src={storeProfile.banner_image} 
                alt="Banner de la tienda" 
                fill 
                className="object-cover opacity-30"
            />
        ) : (
            <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-gray-700 opacity-90"></div>
        )}
        <div className="relative z-10 max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex-1">
                <h1 className="text-4xl font-bold mb-4">Rápido, Asequible, Entregado a tu Puerta</h1>
                <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg">
                    Comprar ahora
                </Button>
            </div>
            <div className="hidden lg:block">
                <div className="w-32 h-32 bg-gray-600 rounded-full opacity-20"></div>
            </div>
        </div>
    </div>

    )
}