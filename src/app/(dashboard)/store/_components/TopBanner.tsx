import { StoreProfile } from "@/types/store"
import { Button } from "@/components/ui/button"
import Image from "next/image"

type TopBannerProps = {
    storeProfile: StoreProfile | null
}

export const TopBanner = ({ storeProfile }: TopBannerProps) => {
    return(
        <div className="relative bg-gray-800 text-white py-8 sm:py-12 lg:py-16 px-4 sm:px-6 overflow-hidden">
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
        <div className="relative z-10 max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center">
                <div className="flex-1 text-center lg:text-left">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 leading-tight">
                        Rápido, Asequible, Entregado a tu Puerta
                    </h1>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                        <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white px-6 sm:px-8 py-3 rounded-lg w-full sm:w-auto">
                            Comprar ahora
                        </Button>
                        <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-gray-800 px-6 sm:px-8 py-3 rounded-lg w-full sm:w-auto">
                            Ver catálogo
                        </Button>
                    </div>
                </div>
                <div className="hidden lg:block mt-8 lg:mt-0">
                    <div className="w-24 h-24 xl:w-32 xl:h-32 bg-gray-600 rounded-full opacity-20"></div>
                </div>
            </div>
        </div>
    </div>

    )
}