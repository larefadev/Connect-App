"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Edit, Filter, Package, Plus, Search, Trash2, X, Save, Loader2, Eye } from "lucide-react";
import { useState, useEffect } from "react";
import { useProducts } from "@/hooks/Products/useProducts";
import { Product, Category, ProductFilters } from "@/types/ecomerce";
import { ProductDetailPage } from './ProductDetailPage';

export const CatalogPage = () => {
    const {
        products,
        categories,
        filteredProducts,
        loading,
        error,
        createProduct,
        updateProduct,
        deleteProduct,
        filterProducts,
        searchProducts,
        clearFilters,
        currentFilters
    } = useProducts();

    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [priceRange, setPriceRange] = useState([0, 1000]);
    const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState<Partial<Product>>({});
    const [precioBase, setPrecioBase] = useState<number>(0);
    
    // Estados de paginación
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage] = useState(12);
    
    // Estado para página de producto
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    // Aplicar filtros cuando cambien los estados
    useEffect(() => {
        const filters: ProductFilters = {};
        
        if (selectedCategory) filters.categoria = selectedCategory;
        if (searchTerm) filters.search = searchTerm;
        if (priceRange[0] > 0) filters.precioMin = priceRange[0];
        if (priceRange[1] < 1000) filters.precioMax = priceRange[1];
        if (selectedBrands.length > 0) filters.marca = selectedBrands.join(",");

        filterProducts(filters);
    }, [selectedCategory, searchTerm, priceRange, selectedBrands, filterProducts]);

    // Manejar búsqueda
    const handleSearch = (term: string) => {
        setSearchTerm(term);
        searchProducts(term);
    };

    // Manejar filtro por categoría
    const handleCategoryFilter = (categoria: string) => {
        setSelectedCategory(categoria === selectedCategory ? "" : categoria);
    };

    // Manejar filtro por marca
    const handleBrandFilter = (brand: string) => {
        setSelectedBrands(prev => 
            prev.includes(brand) 
                ? prev.filter(b => b !== brand)
                : [...prev, brand]
        );
    };

    // Manejar filtro por precio
    const handlePriceFilter = (range: number[]) => {
        setPriceRange(range);
    };

    // Limpiar todos los filtros
    const handleClearFilters = () => {
        setSearchTerm("");
        setSelectedCategory("");
        setPriceRange([0, 1000]);
        setSelectedBrands([]);
        clearFilters();
    };

    // Iniciar edición de producto
    const handleEditProduct = (product: Product) => {
        setEditingProduct(product);
        setEditForm({
            Ganancia: product.Ganancia || 0
        });
        setIsEditing(false); // Reset del estado de carga
    };

    // Calcular precio final con ganancia
    const calculateFinalPrice = (basePrice: number, ganancia: number) => {
        return basePrice * (1 + ganancia / 100);
    };

    // Calcular precio base desde precio final y ganancia
    const calculateBasePrice = (finalPrice: number, ganancia: number) => {
        return finalPrice / (1 + ganancia / 100);
    };

    // Guardar cambios del producto
    const handleSaveProduct = async () => {
        if (!editingProduct) return;

        // Validar que la ganancia no sea negativa
        if (editForm.Ganancia && editForm.Ganancia < 0) {
            alert("La ganancia no puede ser negativa");
            return;
        }

        setIsEditing(true); // Iniciar estado de carga
        try {
            // Solo actualizar la ganancia
            const updatesToSave = {
                Ganancia: editForm.Ganancia
            };

            const result = await updateProduct(editingProduct.SKU, updatesToSave);
            if (result) {
                setEditingProduct(null);
                setEditForm({});
                setIsEditing(false); // Finalizar estado de carga
            } else {
                setIsEditing(false); // Finalizar estado de carga si falla
            }
        } catch (error) {
            console.error("Error al actualizar producto:", error);
            setIsEditing(false); // Finalizar estado de carga en caso de error
        }
    };

    // Eliminar producto
    const handleDeleteProduct = async (sku: string) => {
        if (confirm("¿Estás seguro de que quieres eliminar este producto?")) {
            await deleteProduct(sku);
        }
    };

    // Ver detalles del producto
    const handleViewProduct = (product: Product) => {
        setSelectedProduct(product);
    };

    // Volver al catálogo
    const handleBackToCatalog = () => {
        setSelectedProduct(null);
    };

    // Obtener marcas únicas de productos
    const uniqueBrands = Array.from(new Set(products.map(p => p.Marca).filter((brand): brand is string => Boolean(brand))));

    // Lógica de paginación
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const currentProducts = filteredProducts.slice(startIndex, endIndex);

    // Cambiar página
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Resetear página cuando cambien los filtros
    useEffect(() => {
        setCurrentPage(1);
    }, [selectedCategory, searchTerm, selectedBrands, priceRange]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin" />
                <span className="ml-2">Cargando productos...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center text-red-500 p-8">
                <p>Error al cargar productos: {error}</p>
            </div>
        );
    }

    // Si hay un producto seleccionado, mostrar la página de detalles
    if (selectedProduct) {
        return (
            <ProductDetailPage 
                product={selectedProduct} 
                onBack={handleBackToCatalog} 
            />
        );
    }

    return (
    <div className="w-full space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
            <div className="space-y-2">
                <h1 className="text-2xl font-bold text-gray-900">Catálogo de Productos</h1>
                <div className="flex gap-4 text-sm text-gray-600">
                    <span>Total: {products.length} productos</span>
                    <span>•</span>
                    <span>Con ganancia: {products.filter(p => p.Ganancia && p.Ganancia > 0).length} productos</span>
                    <span>•</span>
                    <span>Ganancia promedio: {products.length > 0 ? (products.reduce((acc, p) => acc + (p.Ganancia || 0), 0) / products.length).toFixed(1) : 0}%</span>
                </div>
            </div>
                
            <div className="flex gap-3">
                <Button 
                    variant="outline" 
                    className="border-gray-300 hover:bg-gray-50"
                    onClick={() => {
                        if (confirm("¿Aplicar ganancia por defecto del 25% a todos los productos sin ganancia?")) {
                            // Aquí se podría implementar la lógica para aplicar ganancia por defecto
                            alert("Función en desarrollo - Se aplicará ganancia por defecto a productos sin ganancia");
                        }
                    }}
                >
                    Aplicar Ganancia por Defecto
                </Button>
                <Button className="bg-red-500 hover:bg-red-600 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Agregar Producto
                </Button>
            </div>
        </div>

        {/* Search Bar with Filter Button */}
        <div className="flex gap-4">
            <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                    type="text"
                        placeholder="Buscar productos..."
                        value={searchTerm}
                        onChange={(e) => handleSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
            </div>
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="outline">
                        <Filter className="w-4 h-4 mr-2" />
                        Filtros
                    </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-96">
                    <SheetHeader>
                        <SheetTitle>Filtros</SheetTitle>
                    </SheetHeader>
                        <FilterSidebar
                            categories={categories}
                            selectedCategory={selectedCategory}
                            onCategoryFilter={handleCategoryFilter}
                            uniqueBrands={uniqueBrands}
                            selectedBrands={selectedBrands}
                            onBrandFilter={handleBrandFilter}
                            priceRange={priceRange}
                            onPriceFilter={handlePriceFilter}
                            onClearFilters={handleClearFilters}
                        />
                </SheetContent>
            </Sheet>
        </div>

            {/* Filtros activos */}
            {(selectedCategory || searchTerm || selectedBrands.length > 0 || (priceRange[0] > 0 || priceRange[1] < 1000)) && (
                <div className="flex flex-wrap gap-2 items-center">
                    <span className="text-sm text-gray-600">Filtros activos:</span>
                    {selectedCategory && (
                        <Badge variant="secondary" className="flex items-center gap-1">
                            Categoría: {selectedCategory}
                            <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedCategory("")} />
                        </Badge>
                    )}
                    {searchTerm && (
                        <Badge variant="secondary" className="flex items-center gap-1">
                            Búsqueda: {searchTerm}
                            <X className="w-3 h-3 cursor-pointer" onClick={() => setSearchTerm("")} />
                        </Badge>
                    )}
                    {selectedBrands.map(brand => (
                        <Badge key={brand} variant="secondary" className="flex items-center gap-1">
                            Marca: {brand}
                            <X className="w-3 h-3 cursor-pointer" onClick={() => handleBrandFilter(brand)} />
                        </Badge>
                    ))}
                    {(priceRange[0] > 0 || priceRange[1] < 1000) && (
                        <Badge variant="secondary" className="flex items-center gap-1">
                            Precio: ${priceRange[0]} - ${priceRange[1]}
                            <X className="w-3 h-3 cursor-pointer" onClick={() => setPriceRange([0, 1000])} />
                        </Badge>
                    )}
                    <Button variant="outline" size="sm" onClick={handleClearFilters}>
                        Limpiar Todo
                    </Button>
                </div>
            )}

                {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {currentProducts.length === 0 ? (
                <div className="col-span-full text-center py-12 text-gray-500">
                    {searchTerm || selectedCategory || selectedBrands.length > 0 
                        ? "No se encontraron productos con los filtros aplicados"
                        : "No hay productos disponibles"
                    }
                </div>
            ) : (
                currentProducts.map((product) => (
                    <ProductCard 
                        key={product.SKU} 
                        product={product} 
                        onEdit={handleEditProduct}
                        onView={handleViewProduct}
                    />
                ))
            )}
        </div>

            {/* Paginación */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center space-x-2 py-8">
                    <Pagination 
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                        totalProducts={filteredProducts.length}
                        productsPerPage={productsPerPage}
                        startIndex={startIndex}
                        endIndex={endIndex}
                    />
    </div>
            )}

            {/* Modal de edición */}
            {editingProduct && (
                <Sheet open={!!editingProduct} onOpenChange={() => setEditingProduct(null)}>
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
                                    {editingProduct.Imagen ? (
                                        <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                                            <img 
                                                src={editingProduct.Imagen} 
                                                alt={editingProduct.Nombre || "Producto"} 
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
                                            ${editingProduct.Precio?.toFixed(2) || "0.00"}
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
                                            ${((editingProduct.Precio || 0) * (1 + (editForm.Ganancia || 0) / 100)).toFixed(2)}
                                        </span>
                                        <p className="text-xs text-gray-500 mt-1">
                                            Precio actual (${editingProduct.Precio?.toFixed(2) || "0.00"}) + {editForm.Ganancia || 0}% de ganancia
                                        </p>
                                    </div>
                                </div>
                                
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-gray-700">Marca</Label>
                                    <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                                        <span className="text-gray-700">
                                            {editingProduct.Marca || "Sin marca"}
                                        </span>
                                    </div>
                                </div>
                                
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-gray-700">URL de imagen</Label>
                                    <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                                        <span className="text-gray-700 break-all">
                                            {editingProduct.Imagen || "Sin imagen"}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Descripción HTML (solo lectura) */}
                            <div className="space-y-3 pt-4 border-t border-gray-200">
                                <Label className="text-sm font-medium text-gray-700">Descripción del Producto</Label>
                                <div className="bg-white rounded-lg p-6 border border-gray-200 max-h-96 overflow-y-auto shadow-sm">
                                    {editingProduct.Descricpion ? (
                                        <div 
                                            className="prose prose-sm max-w-none text-gray-800 [&>h1]:text-2xl [&>h1]:font-bold [&>h1]:text-gray-900 [&>h1]:mb-3 [&>h1]:mt-6 [&>h1]:first:mt-0 [&>h2]:text-xl [&>h2]:font-bold [&>h2]:text-red-600 [&>h2]:mb-3 [&>h2]:mt-6 [&>h3]:text-lg [&>h3]:font-bold [&>h3]:text-blue-600 [&>h3]:mb-2 [&>h3]:mt-4 [&>p]:mb-4 [&>p]:text-gray-700 [&>p]:leading-relaxed [&>ul]:mb-4 [&>ul]:pl-6 [&>li]:mb-2 [&>li]:text-gray-700 [&>li]:list-disc [&>strong]:font-semibold [&>strong]:text-gray-900 [&>em]:italic [&>em]:text-gray-600 [&>section]:mb-6 [&>section]:p-4 [&>section]:bg-gray-50 [&>section]:rounded-lg [&>section]:border [&>section]:border-gray-200"
                                            dangerouslySetInnerHTML={{ 
                                                __html: editingProduct.Descricpion 
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
                                    onClick={() => setEditingProduct(null)}
                                    disabled={isEditing}
                                    className="border-gray-200 hover:bg-gray-50"
                                >
                                    Cancelar
                                </Button>
                            </div>
                        </div>
                    </SheetContent>
                </Sheet>
            )}
        </div>
    );
};

const ProductCard = ({ 
    product, 
    onEdit, 
    onView,
    //onDelete 
}: { 
    product: Product; 
    onEdit: (product: Product) => void;
    onView: (product: Product) => void;
    //onDelete: (sku: string) => void;
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
                        className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
                        onClick={() => onEdit(product)}
                        title="Configurar ganancia"
                    >
                        <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                        size="sm" 
                        variant="outline" 
                        className="h-8 w-8 p-0 bg-white/90 hover:bg-white text-blue-500 hover:text-blue-600"
                        onClick={() => onView(product)}
                    >
                        <Eye className="w-4 h-4" />
                    </Button>
                  {/*  <Button 
                        size="sm" 
                        variant="outline" 
                        className="h-8 w-8 p-0 bg-white/90 hover:bg-white text-red-500 hover:text-red-600"
                        onClick={() => onDelete(product.SKU)}
                    >
                        <Trash2 className="w-4 h-4" />
                    </Button>*/}
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
                {/*product.Descricpion && (
                    <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                        {product.Descricpion}
                    </p>
                */}
            </div>
        </CardContent>
    </Card>
);

const FilterSidebar = ({
    categories,
    selectedCategory,
    onCategoryFilter,
    uniqueBrands,
    selectedBrands,
    onBrandFilter,
    priceRange,
    onPriceFilter,
    onClearFilters
}: {
    categories: Category[];
    selectedCategory: string;
    onCategoryFilter: (categoria: string) => void;
    uniqueBrands: string[];
    selectedBrands: string[];
    onBrandFilter: (brand: string) => void;
    priceRange: number[];
    onPriceFilter: (range: number[]) => void;
    onClearFilters: () => void;
}) => (
    <div className="space-y-8">
        {/* Categorías */}
        <div>
            <h4 className="font-semibold text-gray-900 mb-4 text-sm uppercase tracking-wide">Categoría</h4>
            <Select 
                value={selectedCategory || "all"} 
                onValueChange={(value) => onCategoryFilter(value === "all" ? "" : value)}
            >
                <SelectTrigger className="bg-gray-50 border-gray-200 focus:ring-2 focus:ring-red-500 focus:border-red-500">
                    <SelectValue placeholder="Seleccionar Categoría" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Todas las categorías</SelectItem>
                    {categories.map((cat) => (
                        <SelectItem key={cat.Codigo} value={cat.Categoria || ""}>
                            {cat.Nombre || cat.Categoria}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>

        {/* Marcas */}
        <div>
            <h4 className="font-semibold text-gray-900 mb-4 text-sm uppercase tracking-wide">Marca</h4>
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input 
                    placeholder="Buscar Marca" 
                    className="pl-10 pr-10 bg-gray-50 border-gray-200 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <span className="text-gray-400 text-sm">↕</span>
                </div>
            </div>
        </div>

        {/* Proveedor */}
        <div>
            <h4 className="font-semibold text-gray-900 mb-4 text-sm uppercase tracking-wide">Proveedor</h4>
            <Select>
                <SelectTrigger className="bg-gray-50 border-gray-200 focus:ring-2 focus:ring-red-500 focus:border-red-500">
                    <SelectValue placeholder="Seleccionar Proveedor" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="supplier1">Proveedor 1</SelectItem>
                    <SelectItem value="supplier2">Proveedor 2</SelectItem>
                    <SelectItem value="supplier3">Proveedor 3</SelectItem>
                </SelectContent>
            </Select>
        </div>

        {/* Tipo de Repuesto */}
        <div>
            <h4 className="font-semibold text-gray-900 mb-4 text-sm uppercase tracking-wide">Tipo de Repuesto</h4>
            <div className="grid grid-cols-2 gap-3">
                {[
                    "Zapatas de freno",
                    "Pastillas de freno", 
                    "Discos de freno",
                    "Líquido de frenos",
                    "Caliper de frenos",
                    "Líneas de freno"
                ].map((part) => (
                    <div key={part} className="flex items-center space-x-3">
                        <Checkbox 
                            id={part}
                            className="data-[state=checked]:bg-black data-[state=checked]:border-black"
                        />
                        <Label htmlFor={part} className="text-sm text-gray-700 cursor-pointer font-medium">
                            {part}
                        </Label>
                    </div>
                ))}
            </div>
        </div>

        {/* Modelo */}
        <div>
            <h4 className="font-semibold text-gray-900 mb-4 text-sm uppercase tracking-wide">Modelo</h4>
            <Select>
                <SelectTrigger className="bg-gray-50 border-gray-200 focus:ring-2 focus:ring-red-500 focus:border-red-500">
                    <SelectValue placeholder="Seleccionar Modelo" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="corolla">Toyota Corolla</SelectItem>
                    <SelectItem value="civic">Honda Civic</SelectItem>
                    <SelectItem value="focus">Ford Focus</SelectItem>
                    <SelectItem value="golf">Volkswagen Golf</SelectItem>
                </SelectContent>
            </Select>
        </div>

        {/* Año */}
        <div>
            <h4 className="font-semibold text-gray-900 mb-4 text-sm uppercase tracking-wide">Año</h4>
            <div className="grid grid-cols-2 gap-3">
                <Select>
                    <SelectTrigger className="bg-gray-50 border-gray-200 focus:ring-2 focus:ring-red-500 focus:border-red-500">
                        <SelectValue placeholder="Desde" />
                    </SelectTrigger>
                    <SelectContent>
                        {Array.from({length: 10}, (_, i) => 2015 + i).map(year => (
                            <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Select>
                    <SelectTrigger className="bg-gray-50 border-gray-200 focus:ring-2 focus:ring-red-500 focus:border-red-500">
                        <SelectValue placeholder="Hasta" />
                    </SelectTrigger>
                    <SelectContent>
                        {Array.from({length: 10}, (_, i) => 2015 + i).map(year => (
                            <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>

        {/* Rango de Precio */}
        <div>
            <h4 className="font-semibold text-gray-900 mb-4 text-sm uppercase tracking-wide">Rango de Precio</h4>
            <div className="space-y-4">
                <Slider
                    value={priceRange}
                    onValueChange={onPriceFilter}
                    max={1000}
                    step={10}
                    className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-600 font-medium">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                </div>
            </div>
        </div>

        {/* Rango de Ganancia */}
        <div>
            <h4 className="font-semibold text-gray-900 mb-4 text-sm uppercase tracking-wide">Rango de Ganancia</h4>
            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <Label className="text-xs text-gray-600">Mínimo (%)</Label>
                        <Input 
                            type="number"
                            placeholder="0"
                            className="text-sm bg-gray-50 border-gray-200 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        />
                    </div>
                    <div>
                        <Label className="text-xs text-gray-600">Máximo (%)</Label>
                        <Input 
                            type="number"
                            placeholder="100"
                            className="text-sm bg-gray-50 border-gray-200 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        />
                    </div>
                </div>
            </div>
        </div>

        {/* En Stock */}
        <div>
            <h4 className="font-semibold text-gray-900 mb-4 text-sm uppercase tracking-wide">En Stock</h4>
            <div className="flex items-center space-x-3">
                <Switch 
                    id="in-stock" 
                    className="data-[state=checked]:bg-red-500"
                />
                <Label htmlFor="in-stock" className="text-sm text-gray-700 font-medium">
                    Solo productos disponibles
                </Label>
            </div>
        </div>

        {/* Botones de Acción */}
        <div className="flex justify-between items-center pt-4 border-t border-gray-200">
            <button
                onClick={onClearFilters}
                className="text-red-500 hover:text-red-600 font-medium text-sm transition-colors duration-200"
            >
                Reset
            </button>
            <Button 
                onClick={onClearFilters}
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-medium"
            >
                Aplicar Filtros
            </Button>
        </div>
    </div>
);

// Componente de paginación
const Pagination = ({
    currentPage,
    totalPages,
    onPageChange,
    totalProducts,
    productsPerPage,
    startIndex,
    endIndex
}: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    totalProducts: number;
    productsPerPage: number;
    startIndex: number;
    endIndex: number;
}) => {
    const getPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;
        
        if (totalPages <= maxVisiblePages) {
            // Mostrar todas las páginas si hay pocas
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Mostrar páginas con elipsis
            if (currentPage <= 3) {
                // Páginas iniciales
                for (let i = 1; i <= 4; i++) {
                    pages.push(i);
                }
                pages.push('...');
                pages.push(totalPages);
            } else if (currentPage >= totalPages - 2) {
                // Páginas finales
                pages.push(1);
                pages.push('...');
                for (let i = totalPages - 3; i <= totalPages; i++) {
                    pages.push(i);
                }
            } else {
                // Páginas intermedias
                pages.push(1);
                pages.push('...');
                for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                    pages.push(i);
                }
                pages.push('...');
                pages.push(totalPages);
            }
        }
        
        return pages;
    };

    return (
        <div className="flex flex-col items-center space-y-4">
            {/* Información de productos mostrados */}
            <div className="text-sm text-gray-600">
                Mostrando {startIndex + 1}-{Math.min(endIndex, totalProducts)} de {totalProducts} productos
            </div>
            
            {/* Controles de paginación */}
            <div className="flex items-center space-x-2">
                {/* Botón Anterior */}
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-2"
                >
                    Anterior
                </Button>

                {/* Números de página */}
                <div className="flex items-center space-x-1">
                    {getPageNumbers().map((page, index) => (
                        <div key={index}>
                            {page === '...' ? (
                                <span className="px-3 py-2 text-gray-500">...</span>
                            ) : (
                                <Button
                                    variant={currentPage === page ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => onPageChange(page as number)}
                                    className={`px-3 py-2 min-w-[40px] ${
                                        currentPage === page 
                                            ? "bg-red-500 hover:bg-red-600 text-white" 
                                            : ""
                                    }`}
                                >
                                    {page}
                                </Button>
                            )}
                        </div>
                    ))}
                </div>

                {/* Botón Siguiente */}
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2"
                >
                    Siguiente
                </Button>
            </div>

            {/* Selector de productos por página */}
            <div className="flex items-center space-x-2 text-sm text-gray-600">
                <span>Productos por página:</span>
                <span className="font-medium">{productsPerPage}</span>
            </div>
        </div>
    );
};