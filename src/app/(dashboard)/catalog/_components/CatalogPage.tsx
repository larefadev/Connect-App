"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { Slider } from "@/components/ui/slider";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Filter, Search, X, Loader2} from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { useProducts } from "@/hooks/Products/useProducts";
import { useCatalogFilters } from "@/hooks/Products/useCatalogFilters";
import { useB2BOrders } from "@/hooks/B2BOrders/useB2BOrders";
import { useStoreProfile } from "@/hooks/StoreProfile/useStoreProfile";
import { useAuthStore } from "@/stores/authStore";
import { useToastContext } from "@/components/providers/ToastProvider";
import { Product, Category, ProductFilters } from "@/types/ecomerce";
import { CartItem } from "@/types/b2b-order";
import { ProductDetailPage } from './ProductDetailPage';
import { ProductCard } from "./ProductCard";

export const CatalogPage = () => {
    const {
        products,
        filteredProducts,
        loading,
        error,
        filterProducts,
        searchProducts,
        clearFilters,
    } = useProducts();

    const {
        years,
        assemblyPlants,
        carModels,
        motorizations,
        currentFilters: catalogFilters,
        setYear,
        setAssemblyPlant,
        setModel,
        setMotorization,
        setPriceRange: setCatalogPriceRange,
        clearFilters: clearCatalogFilters,
        getModelsByAssemblyPlant
    } = useCatalogFilters();

    // Hooks para el carrito B2B
    const { storeProfile } = useStoreProfile();
    const { user } = useAuthStore();
    const { success: showSuccess, error: showError } = useToastContext();
    const storeId = storeProfile?.id ? Number(storeProfile.id) : undefined;
    const ownerEmail = storeProfile?.email ? String(storeProfile.email) : 'dev@larefa.com';
    const userEmail = user?.email;

    const { addToCart, cart } = useB2BOrders(storeId, ownerEmail, storeProfile, userEmail);

    const [searchTerm, setSearchTerm] = useState("");
    const [priceRange, setPriceRange] = useState([0, 1000]);
    const [selectedBrands, setSelectedBrands] = useState<string[]>([]);

    // Función para transformar Product a CartItem
    const transformProductToCartItem = (product: Product): CartItem => {
        const unitPrice = product.Precio || 0;
        const ganancia = product.Ganancia || 0;
        const precioConGanancia = ganancia > 0 ? unitPrice : unitPrice;

        return {
            product_sku: product.SKU,
            product_name: product.Nombre || 'Sin nombre',
            product_description: product.Descricpion || '',
            product_image: product.Imagen || '',
            product_brand: product.Marca || '',
            unit_price: precioConGanancia,
            retail_price: unitPrice,
            quantity: 1,
            total_price: precioConGanancia,
            discount_percentage: 0,
            discount_amount: 0,
            tax_rate: 16, // IVA del 16%
            tax_amount: precioConGanancia * 0.16,
            item_notes: ''
        };
    };

    // Función para manejar agregar al carrito
    const handleAddToCart = (product: Product) => {
        if (!storeId) {
            showError('No se pudo identificar la tienda');
            return;
        }

        const cartItem = transformProductToCartItem(product);
        addToCart(cartItem);
        showSuccess(`${product.Nombre || 'Producto'} agregado al carrito`);
    };

    // Estados de paginación
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage] = useState(12);

    // Estado para página de producto
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    useEffect(() => {
        const filters: ProductFilters = {};

        if (searchTerm) filters.search = searchTerm;
        if (priceRange[0] > 0) filters.precioMin = priceRange[0];
        if (priceRange[1] < 1000) filters.precioMax = priceRange[1];
        if (selectedBrands.length > 0) filters.marca = selectedBrands.join(",");
        if (catalogFilters.year) filters.year = catalogFilters.year;
        if (catalogFilters.assemblyPlant) filters.assemblyPlant = catalogFilters.assemblyPlant;
        if (catalogFilters.model) filters.model = catalogFilters.model;
        if (catalogFilters.motorization) filters.motorization = catalogFilters.motorization;

        filterProducts(filters);
    }, [searchTerm, priceRange, selectedBrands, catalogFilters, filterProducts]);

    // Manejar búsqueda
    const handleSearch = (term: string) => {
        setSearchTerm(term);
        searchProducts(term);
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
        setCatalogPriceRange(range[0], range[1]);
    };

    // Limpiar todos los filtros
    const handleClearFilters = () => {
        setSearchTerm("");
        setPriceRange([0, 1000]);
        setSelectedBrands([]);
        clearCatalogFilters();
        clearFilters();
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
    }, [searchTerm, selectedBrands, priceRange]);

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
        <div className="w-full space-y-4 lg:space-y-6">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center space-y-4 lg:space-y-0">
                <div className="space-y-2">
                    <div className="flex flex-col sm:flex-row sm:gap-4 text-sm text-gray-600 space-y-1 sm:space-y-0">
                        <span>Total: {products.length} productos</span>
                        <span className="hidden sm:inline">•</span>
                        <span>Con ganancia: {products.filter(p => p.Ganancia && p.Ganancia > 0).length} productos</span>
                        <span className="hidden sm:inline">•</span>
                        <span>Ganancia promedio: {products.length > 0 ? (products.reduce((acc, p) => acc + (p.Ganancia || 0), 0) / products.length).toFixed(1) : 0}%</span>
                    </div>
                </div>

                {/* <div className="flex gap-3">
                <Button 
                    variant="outline" 
                    className="border-gray-300 hover:bg-gray-50"
                    onClick={() => {
                        if (confirm("¿Aplicar ganancia por defecto del 25% a todos los productos sin ganancia?")) {
                            
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
            </div>*/}
            </div>

            {/* Search Bar */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
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
                {/* Modal de filtros comentado temporalmente */}
                {/* <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="outline" className="w-full sm:w-auto">
                            <Filter className="w-4 h-4 mr-2" />
                            <span className="hidden sm:inline">Filtros</span>
                            <span className="sm:hidden">Filtrar</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="w-full sm:w-96">
                        <SheetHeader>
                            <SheetTitle>Filtros</SheetTitle>
                        </SheetHeader>
                        <FilterSidebar
                            uniqueBrands={uniqueBrands}
                            selectedBrands={selectedBrands}
                            onBrandFilter={handleBrandFilter}
                            priceRange={priceRange}
                            onPriceFilter={handlePriceFilter}
                            onClearFilters={handleClearFilters}
                            // Nuevos filtros de catálogo
                            years={years}
                            assemblyPlants={assemblyPlants}
                            carModels={carModels}
                            motorizations={motorizations}
                            catalogFilters={catalogFilters}
                            onYearChange={setYear}
                            onAssemblyPlantChange={setAssemblyPlant}
                            onModelChange={setModel}
                            onMotorizationChange={setMotorization}
                            getModelsByAssemblyPlant={getModelsByAssemblyPlant}
                        />
                    </SheetContent>
                </Sheet> */}
            </div>

            {/* Filtros debajo de la barra de búsqueda */}
            <div className="bg-gray-50 p-4 rounded-lg">
                <FilterSidebar
                    uniqueBrands={uniqueBrands}
                    selectedBrands={selectedBrands}
                    onBrandFilter={handleBrandFilter}
                    priceRange={priceRange}
                    onPriceFilter={handlePriceFilter}
                    onClearFilters={handleClearFilters}
                    // Nuevos filtros de catálogo
                    years={years}
                    assemblyPlants={assemblyPlants}
                    carModels={carModels}
                    motorizations={motorizations}
                    catalogFilters={catalogFilters}
                    onYearChange={setYear}
                    onAssemblyPlantChange={setAssemblyPlant}
                    onModelChange={setModel}
                    onMotorizationChange={setMotorization}
                    getModelsByAssemblyPlant={getModelsByAssemblyPlant}
                />
            </div>

            {/* Filtros activos */}
            {(searchTerm || selectedBrands.length > 0 || (priceRange[0] > 0 || priceRange[1] < 1000) || catalogFilters.year || catalogFilters.assemblyPlant || catalogFilters.model || catalogFilters.motorization) && (
                <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 items-start sm:items-center">
                    <span className="text-sm text-gray-600 whitespace-nowrap">Filtros activos:</span>
                    <div className="flex flex-wrap gap-2">
                        {searchTerm && (
                            <Badge variant="secondary" className="flex items-center gap-1">
                                <span className="hidden sm:inline">Búsqueda: </span>
                                <span className="truncate max-w-[100px] sm:max-w-none">{searchTerm}</span>
                                <X className="w-3 h-3 cursor-pointer flex-shrink-0" onClick={() => setSearchTerm("")} />
                            </Badge>
                        )}
                        {selectedBrands.map(brand => (
                            <Badge key={brand} variant="secondary" className="flex items-center gap-1">
                                <span className="hidden sm:inline">Marca: </span>
                                <span className="truncate max-w-[80px] sm:max-w-none">{brand}</span>
                                <X className="w-3 h-3 cursor-pointer flex-shrink-0" onClick={() => handleBrandFilter(brand)} />
                            </Badge>
                        ))}
                        {(priceRange[0] > 0 || priceRange[1] < 1000) && (
                            <Badge variant="secondary" className="flex items-center gap-1">
                                <span className="hidden sm:inline">Precio: </span>
                                <span>${priceRange[0]} - ${priceRange[1]}</span>
                                <X className="w-3 h-3 cursor-pointer flex-shrink-0" onClick={() => {
                                    setPriceRange([0, 1000]);
                                    setCatalogPriceRange(0, 1000);
                                }} />
                            </Badge>
                        )}
                        {catalogFilters.year && (
                            <Badge variant="secondary" className="flex items-center gap-1">
                                <span className="hidden sm:inline">Año: </span>
                                <span>{catalogFilters.year}</span>
                                <X className="w-3 h-3 cursor-pointer flex-shrink-0" onClick={() => setYear("")} />
                            </Badge>
                        )}
                        {catalogFilters.assemblyPlant && (
                            <Badge variant="secondary" className="flex items-center gap-1">
                                <span className="hidden sm:inline">Ensambladora: </span>
                                <span className="truncate max-w-[80px] sm:max-w-none">{catalogFilters.assemblyPlant}</span>
                                <X className="w-3 h-3 cursor-pointer flex-shrink-0" onClick={() => setAssemblyPlant("")} />
                            </Badge>
                        )}
                        {catalogFilters.model && (
                            <Badge variant="secondary" className="flex items-center gap-1">
                                <span className="hidden sm:inline">Modelo: </span>
                                <span className="truncate max-w-[80px] sm:max-w-none">{catalogFilters.model}</span>
                                <X className="w-3 h-3 cursor-pointer flex-shrink-0" onClick={() => setModel("")} />
                            </Badge>
                        )}
                        {catalogFilters.motorization && (
                            <Badge variant="secondary" className="flex items-center gap-1">
                                <span className="hidden sm:inline">Motorización: </span>
                                <span className="truncate max-w-[80px] sm:max-w-none">{catalogFilters.motorization}</span>
                                <X className="w-3 h-3 cursor-pointer flex-shrink-0" onClick={() => setMotorization("")} />
                            </Badge>
                        )}
                        <Button variant="outline" size="sm" onClick={handleClearFilters} className="whitespace-nowrap">
                            Limpiar Todo
                        </Button>
                    </div>
                </div>
            )}

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
                {currentProducts.length === 0 ? (
                    <div className="col-span-full text-center py-12 text-gray-500">
                        {searchTerm || selectedBrands.length > 0
                            ? "No se encontraron productos con los filtros aplicados"
                            : "No hay productos disponibles"
                        }
                    </div>
                ) : (
                    currentProducts.map((product) => (
                        <ProductCard
                            key={product.SKU}
                            product={product}
                            onView={handleViewProduct}
                            onAddToCart={handleAddToCart}
                        />
                    ))
                )}
            </div>

            {/* Paginación */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center py-6 lg:py-8">
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

        </div>
    );
};



const FilterSidebar = ({
    uniqueBrands,
    selectedBrands,
    onBrandFilter,
    priceRange,
    onPriceFilter,
    onClearFilters,
    // Nuevos filtros de catálogo
    years,
    assemblyPlants,
    carModels,
    motorizations,
    catalogFilters,
    onYearChange,
    onAssemblyPlantChange,
    onModelChange,
    onMotorizationChange,
    getModelsByAssemblyPlant
}: {
    uniqueBrands: string[];
    selectedBrands: string[];
    onBrandFilter: (brand: string) => void;
    priceRange: number[];
    onPriceFilter: (range: number[]) => void;
    onClearFilters: () => void;
    // Nuevos filtros de catálogo
    years: string[];
    assemblyPlants: any[];
    carModels: any[];
    motorizations: any[];
    catalogFilters: any;
    onYearChange: (year: string) => void;
    onAssemblyPlantChange: (assemblyPlant: string) => void;
    onModelChange: (model: string) => void;
    onMotorizationChange: (motorization: string) => void;
    getModelsByAssemblyPlant: (assemblyPlantCode: string) => any[];
}) => {
    // Filtrar modelos por ensambladora seleccionada usando la nueva columna code_assembly_plant
    const filteredModels = useMemo(() => {
        if (catalogFilters.assemblyPlant && catalogFilters.assemblyPlant !== "all") {
            // Buscar el código de la ensambladora seleccionada
            const selectedAssemblyPlant = assemblyPlants.find(plant =>
                plant.assembly_plant === catalogFilters.assemblyPlant
            );

            if (selectedAssemblyPlant) {
                // Filtrar modelos que coincidan con el código de la ensambladora usando la nueva columna
                return carModels.filter(model => model.code_assembly_plant === selectedAssemblyPlant.code);
            }
        }
        return carModels;
    }, [catalogFilters.assemblyPlant, assemblyPlants, carModels]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Año */}
            <div>
                <h4 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wide">Año</h4>
                <Select
                    value={catalogFilters.year || "all"}
                    onValueChange={(value) => onYearChange(value === "all" ? "" : value)}
                >
                    <SelectTrigger className="bg-white border-gray-200 focus:ring-2 focus:ring-red-500 focus:border-red-500">
                        <SelectValue placeholder="Seleccionar Año" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Todos los años</SelectItem>
                        {years.map((year) => (
                            <SelectItem key={year} value={year}>
                                {year}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Ensambladora */}
            <div>
                <h4 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wide">Ensambladora</h4>
                <SearchableSelect
                    value={catalogFilters.assemblyPlant || "all"}
                    onValueChange={(value) => onAssemblyPlantChange(value === "all" ? "" : value)}
                    placeholder="Buscar ensambladora..."
                    options={assemblyPlants.map(plant => ({
                        value: plant.assembly_plant || '',
                        label: plant.assembly_plant || 'Sin nombre'
                    }))}
                    allOption={{ value: "all", label: "Todas las ensambladoras" }}
                />
            </div>

            {/* Modelo */}
            <div>
                <h4 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wide">Modelo</h4>
                <SearchableSelect
                    value={catalogFilters.model || "all"}
                    onValueChange={(value) => onModelChange(value === "all" ? "" : value)}
                    placeholder="Buscar modelo..."
                    options={filteredModels.map(model => ({
                        value: model.model_car || '',
                        label: model.model_car || 'Sin nombre'
                    }))}
                    allOption={{ value: "all", label: "Todos los modelos" }}
                />
                {/* Indicador de modelos disponibles */}
                {catalogFilters.assemblyPlant && catalogFilters.assemblyPlant !== "all" && (
                    <div className="text-xs text-gray-500 mt-1">
                        {filteredModels.length === 0 ? (
                            <span className="text-orange-600">
                                No hay modelos disponibles para esta ensambladora
                            </span>
                        ) : (
                            `${filteredModels.length} modelo${filteredModels.length !== 1 ? 's' : ''} disponible${filteredModels.length !== 1 ? 's' : ''}`
                        )}
                    </div>
                )}
            </div>

            {/* Motorización */}
            <div>
                <h4 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wide">Motorización</h4>
                <SearchableSelect
                    value={catalogFilters.motorization || "all"}
                    onValueChange={(value) => onMotorizationChange(value === "all" ? "" : value)}
                    placeholder="Buscar motorización..."
                    options={motorizations.map(motorization => ({
                        value: motorization.motorization || '',
                        label: motorization.motorization || 'Sin nombre'
                    }))}
                    allOption={{ value: "all", label: "Todas las motorizaciones" }}
                />
            </div>

            {/* Rango de Precio - Ocupa toda la fila */}
            <div className="md:col-span-2 lg:col-span-4">
                <h4 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wide">Rango de Precio</h4>
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

            {/* Botones de Acción - Ocupa toda la fila */}
            <div className="md:col-span-2 lg:col-span-4 flex justify-between items-center pt-4 border-t border-gray-200">
                <button
                    onClick={onClearFilters}
                    className="text-red-500 hover:text-red-600 font-medium text-sm transition-colors duration-200"
                >
                    Limpiar Filtros
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
};

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
            <div className="text-sm text-gray-600 text-center">
                Mostrando {startIndex + 1}-{Math.min(endIndex, totalProducts)} de {totalProducts} productos
            </div>

            {/* Controles de paginación */}
            <div className="flex items-center space-x-1 sm:space-x-2">
                {/* Botón Anterior */}
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-2 sm:px-3 py-2 text-xs sm:text-sm"
                >
                    <span className="hidden sm:inline">Anterior</span>
                    <span className="sm:hidden">‹</span>
                </Button>

                {/* Números de página */}
                <div className="flex items-center space-x-1">
                    {getPageNumbers().map((page, index) => (
                        <div key={index}>
                            {page === '...' ? (
                                <span className="px-2 sm:px-3 py-2 text-gray-500 text-xs sm:text-sm">...</span>
                            ) : (
                                <Button
                                    variant={currentPage === page ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => onPageChange(page as number)}
                                    className={`px-2 sm:px-3 py-2 min-w-[32px] sm:min-w-[40px] text-xs sm:text-sm ${currentPage === page
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
                    className="px-2 sm:px-3 py-2 text-xs sm:text-sm"
                >
                    <span className="hidden sm:inline">Siguiente</span>
                    <span className="sm:hidden">›</span>
                </Button>
            </div>

            {/* Selector de productos por página */}
            <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-600">
                <span>Productos por página:</span>
                <span className="font-medium">{productsPerPage}</span>
            </div>
        </div>
    );
};