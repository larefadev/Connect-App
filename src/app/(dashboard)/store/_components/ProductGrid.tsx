import { Button, Card, CardContent, ProductImage, Badge } from "@/components"
import { Package, Plus, ShoppingCart, XCircle, Edit } from "lucide-react"
import { Product } from "@/types/ecomerce"
import { StoreProductConfig } from "@/types/store"
import Link from "next/link"

type ProductGridProps = {
    productsWithDetails: (Product & { config: StoreProductConfig })[]
    filteredProducts: (Product & { config: StoreProductConfig })[]
    selectedTab: 'all' | 'available' | 'unavailable'
    setSelectedTab: (tab: 'all' | 'available' | 'unavailable') => void
    availableProducts: number
    unavailableProducts: number
    handleToggleProductFeatured: (sku: string, isFeatured: boolean) => Promise<void>
    handleRemoveProduct: (sku: string) => Promise<void>
    handleToggleProductActive: (sku: string, isActive: boolean) => Promise<void>
    handleEditProduct: (product: Product) => void
    setIsAddProductModalOpen: (open: boolean) => void
}

export const ProductGrid = ({
    productsWithDetails,
    filteredProducts,
    selectedTab,
    setSelectedTab,
    availableProducts,
    unavailableProducts,
    handleToggleProductFeatured,
    handleRemoveProduct,
    handleToggleProductActive,
    handleEditProduct,
    setIsAddProductModalOpen
}: ProductGridProps) => {
    return (
        <div className="max-w-7xl mx-auto px-6 mt-12 mb-12">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold">Mis Productos</h3>
                <Link href="/store/products" className="text-red-500 hover:text-red-600 font-medium">
                    Ver todos
                </Link>
                <Button
                    onClick={() => setIsAddProductModalOpen(true)}
                    className="bg-red-600 hover:bg-red-700"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Agregar Productos
                </Button>
            </div>

            {/* Tabs */}
            <div className="flex space-x-1 mb-6">
                <Button
                    variant={selectedTab === 'all' ? 'default' : 'outline'}
                    className="rounded-full"
                    onClick={() => setSelectedTab('all')}
                >
                    Todos ({productsWithDetails.length})
                </Button>
                <Button
                    variant={selectedTab === 'available' ? 'default' : 'outline'}
                    className="rounded-full"
                    onClick={() => setSelectedTab('available')}
                >
                    Disponibles ({availableProducts})
                </Button>
                <Button
                    variant={selectedTab === 'unavailable' ? 'default' : 'outline'}
                    className="rounded-full"
                    onClick={() => setSelectedTab('unavailable')}
                >
                    No Disponibles ({unavailableProducts})
                </Button>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                        <div key={product.SKU} className="relative">
                            <Card className="bg-white shadow-md hover:shadow-lg transition-shadow">
                                <CardContent className="p-4">
                                    <div className="relative mb-3">
                                        <ProductImage
                                            src={product.Imagen}
                                            alt={product.Nombre || 'Producto'}
                                            className="w-full h-32 object-cover rounded-lg"
                                        />
                                        {product.config.is_featured && (
                                            <Badge className="absolute top-2 left-2 bg-orange-500 text-white text-xs">
                                                Destacado
                                            </Badge>
                                        )}
                                        <div className="absolute top-2 right-2 flex space-x-1">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="p-1 h-auto bg-white/80 hover:bg-white"
                                                onClick={() => handleEditProduct(product)}
                                                title="Configurar ganancia"
                                            >
                                                <Edit className="w-4 h-4 text-blue-500" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="p-1 h-auto bg-white/80 hover:bg-white"
                                                onClick={() => handleToggleProductFeatured(product.SKU, !product.config.is_featured)}
                                            >
                                                <ShoppingCart className="w-4 h-4 text-pink-500" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="p-1 h-auto bg-white/80 hover:bg-white"
                                                onClick={() => handleRemoveProduct(product.SKU)}
                                            >
                                                <XCircle className="w-4 h-4 text-red-500" />
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <h4 className="font-medium">{product.Nombre}</h4>
                                        <p className="text-sm text-gray-600">Marca: {product.Marca}</p>
                                        <div className="space-y-1">
                                            <p className="text-sm text-gray-500">
                                                Precio Base ${product.Precio?.toFixed(2) || '0.00'}
                                            </p>
                                            <p className="text-sm font-medium">
                                                Tu Precio ${(() => {
                                                    // Si hay precio personalizado, usarlo; sino calcular con ganancia
                                                    if (product.config.custom_price) {
                                                        return product.config.custom_price.toFixed(2);
                                                    }
                                                    // Calcular precio con ganancia aplicada
                                                    const basePrice = product.Precio || 0;
                                                    const profit = product.config.custom_profit || 0;
                                                    const finalPrice = basePrice * (1 + profit / 100);
                                                    return finalPrice.toFixed(2);
                                                })()}
                                            </p>
                                            {product.config.custom_profit && product.config.custom_profit > 0 && (
                                                <p className="text-xs text-green-600 font-medium">
                                                    Ganancia: {product.config.custom_profit}%
                                                </p>
                                            )}
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <Badge
                                                variant={product.config.is_active ? 'default' : 'secondary'}
                                                className={product.config.is_active ? 'bg-green-500' : 'bg-gray-500'}
                                            >
                                                {product.config.is_active ? 'Disponible' : 'No Disponible'}
                                            </Badge>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleToggleProductActive(product.SKU, !product.config.is_active)}
                                            >
                                                {product.config.is_active ? 'Desactivar' : 'Activar'}
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full text-center py-12">
                        <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No hay productos en esta categoría</h3>
                        <p className="text-gray-500 mb-4">Agrega productos desde el catálogo para comenzar a vender</p>
                    </div>
                )}
            </div>
        </div>
    )
}