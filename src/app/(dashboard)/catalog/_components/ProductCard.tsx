import { Badge, Button, Card, CardContent } from "@/components";
import { Product } from "@/types/ecomerce";
import { Eye, Package, ShoppingCart } from "lucide-react";

export const ProductCard = ({
    product,
    onView,
    onAddToCart
}: {
    product: Product;
    onView: (product: Product) => void;
    onAddToCart: (product: Product) => void;
}) => (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        <CardContent className="p-0">
            <div className="relative">
                <div className="aspect-square bg-gray-200 flex items-center justify-center">
                    {product.Imagen ? (
                        <img
                            src={product.Imagen}
                            alt={product.Nombre || "Producto"}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <Package className="w-16 h-16 text-gray-400" />
                    )}
                </div>
                <div className="absolute top-2 right-2 flex flex-col gap-1">
                    <Badge variant="default" className="bg-green-500">
                        En Stock
                    </Badge>
                    {product.Ganancia && product.Ganancia > 0 && (
                        <Badge variant="default" className="bg-blue-500 text-xs">
                            +{product.Ganancia}%
                        </Badge>
                    )}
                </div>
                <div className="absolute top-2 left-2 flex gap-2">
                    <Button
                        size="sm"
                        variant="outline"
                        className="h-8 w-8 p-0 bg-white/90 hover:bg-white text-blue-500 hover:text-blue-600"
                        onClick={() => onView(product)}
                        title="Ver detalles del producto"
                    >
                        <Eye className="w-4 h-4" />
                    </Button>
                </div>
            </div>
            <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                    <Badge variant="secondary" className="text-xs">Disponible</Badge>
                    <div className="text-right">
                        <span className="font-semibold text-red-500 block">
                            ${product.Precio?.toFixed(2) || "0.00"}
                        </span>
                        {product.Ganancia && product.Ganancia > 0 && (
                            <span className="text-xs text-green-600 font-medium">
                                +{product.Ganancia}% ganancia
                            </span>
                        )}
                    </div>
                </div>
                <h3 className="font-medium mb-1">{product.Nombre || "Sin nombre"}</h3>
                <p className="text-sm text-gray-600 mb-1">
                    Marca: {product.Marca || "Sin marca"}
                </p>
                <p className="text-sm text-gray-600">
                    Categoría: {product.Categoria || "Sin categoría"}
                </p>
                {product.Ganancia && product.Ganancia > 0 && (
                    <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex justify-between items-center text-xs">
                            <span className="text-green-700">Precio base:</span>
                            <span className="text-green-800 font-medium">
                                ${((product.Precio || 0) / (1 + product.Ganancia / 100)).toFixed(2)}
                            </span>
                        </div>
                        <div className="flex justify-between items-center text-xs mt-1">
                            <span className="text-green-700">Ganancia:</span>
                            <span className="text-green-800 font-medium">{product.Ganancia}%</span>
                        </div>
                    </div>
                )}
                <Button
                    size="sm"
                    variant="outline"
                    className="w-full bg-red-500 mt-2 text-white"
                    onClick={() => onAddToCart(product)}
                    title="Agregar al carrito"
                >
                    <ShoppingCart className="w-4 h-4" />
                    Agregar al Carrito
                </Button>
            </div>
        </CardContent>
    </Card>
);