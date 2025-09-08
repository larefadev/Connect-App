"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Edit, Package, Save, Loader2 } from "lucide-react";
import { useState } from "react";
import { Product, Category } from "@/types/ecomerce";
import { StoreProductConfig } from "@/types/store";

interface EditProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    product: (Product & { config: StoreProductConfig }) | null;
    categories: Category[];
    onSave: (productSku: string, updates: Partial<Product>) => Promise<boolean>;
}

export const EditProductModal = ({ 
    isOpen, 
    onClose, 
    product, 
    categories, 
    onSave 
}: EditProductModalProps) => {
    const [editForm, setEditForm] = useState<Partial<Product>>({});
    const [isEditing, setIsEditing] = useState(false);

    // Inicializar el formulario cuando se abre el modal
    useState(() => {
        if (product && isOpen) {
            // Usar custom_profit de la configuración de la tienda si existe, sino usar Ganancia del producto
            const currentProfit = product.config?.custom_profit || product.Ganancia || 0;
            setEditForm({
                Ganancia: currentProfit
            });
        }
    });

    // Resetear el formulario cuando se cierra el modal
    useState(() => {
        if (!isOpen) {
            setEditForm({});
            setIsEditing(false);
        }
    });

    // Guardar cambios del producto
    const handleSaveProduct = async () => {
        if (!product) return;

        // Validar que la ganancia no sea negativa
        if (editForm.Ganancia && editForm.Ganancia < 0) {
            alert("La ganancia no puede ser negativa");
            return;
        }

        setIsEditing(true);
        try {
            // Solo actualizar la ganancia
            const updatesToSave = {
                Ganancia: editForm.Ganancia
            };

            const result = await onSave(product.SKU, updatesToSave);
            if (result) {
                onClose();
            }
        } catch (error) {
            console.error("Error al actualizar producto:", error);
        } finally {
            setIsEditing(false);
        }
    };

    if (!product) return null;

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent side="right" className="w-[500px] max-h-screen overflow-y-auto">
                <SheetHeader className="pb-4 border-b border-gray-200">
                    <SheetTitle className="text-xl font-bold">Configurar Ganancia del Producto</SheetTitle>
                    <p className="text-sm text-gray-600 mt-1">
                        Solo se puede modificar el porcentaje de ganancia. Los demás datos son de solo lectura.
                    </p>
                </SheetHeader>
                
                <div className="space-y-6 mt-6">
                    {/* Mensaje informativo */}
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-start">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-blue-800">
                                    Información del Producto
                                </h3>
                                <div className="mt-2 text-sm text-blue-700">
                                    <p>Los datos del producto son de solo lectura. Solo puedes modificar el porcentaje de ganancia para calcular el precio de venta.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Imagen del producto */}
                    <div className="space-y-3">
                        <Label className="text-sm font-medium text-gray-700">Fotografía del Producto</Label>
                        <div className="relative">
                            {product.Imagen ? (
                                <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                                    <img 
                                        src={product.Imagen} 
                                        alt={product.Nombre || "Producto"} 
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            ) : (
                                <div className="aspect-video bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                                    <Package className="w-16 h-16 text-gray-400" />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Campos editables */}
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-gray-700">Nombre del producto</Label>
                            <Input 
                                placeholder="Nombre del producto"
                                value={editForm.Nombre || ""}
                                onChange={(e) => setEditForm({...editForm, Nombre: e.target.value})}
                                className="border-gray-200 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                            />
                        </div>
                        
                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-gray-700">Categoría</Label>
                            <Select 
                                value={editForm.Categoria || ""} 
                                onValueChange={(value) => setEditForm({...editForm, Categoria: value})}
                            >
                                <SelectTrigger className="border-gray-200 focus:ring-2 focus:ring-red-500 focus:border-red-500">
                                    <SelectValue placeholder="Seleccionar Categoría" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((cat) => (
                                        <SelectItem key={cat.Codigo} value={cat.Categoria || ""}>
                                            {cat.Nombre}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        
                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-gray-700">Precio del Producto (Solo Lectura)</Label>
                            <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                                <span className="text-lg font-semibold text-gray-700">
                                    ${product.Precio?.toFixed(2) || "0.00"}
                                </span>
                                <p className="text-xs text-gray-500 mt-1">
                                    Este es el precio actual del producto en la base de datos
                                </p>
                            </div>
                        </div>
                        
                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-gray-700">Ganancia (%)</Label>
                            <Input 
                                type="number"
                                step="0.1"
                                placeholder="0.0"
                                value={editForm.Ganancia || ""}
                                onChange={(e) => {
                                    const ganancia = parseFloat(e.target.value) || 0;
                                    setEditForm({...editForm, Ganancia: ganancia});
                                }}
                                className="border-gray-200 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                            />
                            <p className="text-xs text-gray-500">
                                Porcentaje de ganancia que se aplicará al precio del producto
                            </p>
                        </div>
                        
                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-gray-700">Precio con Ganancia Aplicada</Label>
                            <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                                <span className="text-lg font-semibold text-red-600">
                                    ${(() => {
                                        const basePrice = product.Precio || 0;
                                        const newProfit = editForm.Ganancia || 0;
                                        return (basePrice * (1 + newProfit / 100)).toFixed(2);
                                    })()}
                                </span>
                                <p className="text-xs text-gray-500 mt-1">
                                    Precio base (${product.Precio?.toFixed(2) || "0.00"}) + {editForm.Ganancia || 0}% de ganancia
                                </p>
                                <p className="text-xs text-blue-600 mt-1">
                                    Ganancia actual: {product.config?.custom_profit || product.Ganancia || 0}%
                                </p>
                                <p className="text-xs text-green-600 mt-1 font-medium">
                                    Nueva ganancia: {editForm.Ganancia || 0}%
                                </p>
                            </div>
                        </div>
                        
                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-gray-700">Marca</Label>
                            <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                                <span className="text-gray-700">
                                    {product.Marca || "Sin marca"}
                                </span>
                            </div>
                        </div>
                        
                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-gray-700">URL de imagen</Label>
                            <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                                <span className="text-gray-700 break-all">
                                    {product.Imagen || "Sin imagen"}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Descripción HTML (solo lectura) */}
                    <div className="space-y-3 pt-4 border-t border-gray-200">
                        <Label className="text-sm font-medium text-gray-700">Descripción del Producto</Label>
                        <div className="bg-white rounded-lg p-6 border border-gray-200 max-h-96 overflow-y-auto shadow-sm">
                            {product.Descricpion ? (
                                <div 
                                    className="prose prose-sm max-w-none text-gray-800 [&>h1]:text-2xl [&>h1]:font-bold [&>h1]:text-gray-900 [&>h1]:mb-3 [&>h1]:mt-6 [&>h1]:first:mt-0 [&>h2]:text-xl [&>h2]:font-bold [&>h2]:text-red-600 [&>h2]:mb-3 [&>h2]:mt-6 [&>h3]:text-lg [&>h3]:font-bold [&>h3]:text-blue-600 [&>h3]:mb-2 [&>h3]:mt-4 [&>p]:mb-4 [&>p]:text-gray-700 [&>p]:leading-relaxed [&>ul]:mb-4 [&>ul]:pl-6 [&>li]:mb-2 [&>li]:text-gray-700 [&>li]:list-disc [&>strong]:font-semibold [&>strong]:text-gray-900 [&>em]:italic [&>em]:text-gray-600 [&>section]:mb-6 [&>section]:p-4 [&>section]:bg-gray-50 [&>section]:rounded-lg [&>section]:border [&>section]:border-gray-200"
                                    dangerouslySetInnerHTML={{ 
                                        __html: product.Descricpion 
                                    }}
                                />
                            ) : (
                                <p className="text-gray-500 italic">Sin descripción disponible</p>
                            )}
                        </div>
                        <p className="text-xs text-gray-500">
                            La descripción no se puede editar directamente. Contiene información HTML del producto.
                        </p>
                    </div>

                    {/* Botones de acción */}
                    <div className="flex gap-3 pt-6 border-t border-gray-200">
                        <Button 
                            className="flex-1 bg-red-500 hover:bg-red-600"
                            onClick={handleSaveProduct}
                            disabled={isEditing}
                        >
                            {isEditing ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Guardando Ganancia...
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4 mr-2" />
                                    Guardar Ganancia
                                </>
                            )}
                        </Button>
                        <Button 
                            variant="outline" 
                            onClick={onClose}
                            disabled={isEditing}
                            className="border-gray-200 hover:bg-gray-50"
                        >
                            Cancelar
                        </Button>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
};
