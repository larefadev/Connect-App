"use client";

import { useState, useEffect, useMemo, useCallback } from 'react';
import { X, Search, Plus, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Product, Category } from '@/types/ecomerce';
import { ProductImage } from '@/components/ui/product-image';
import { StoreProductConfig } from '@/types/store';

interface AddProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    storeId: number;
    products: Product[];
    categories: Category[];
    productsLoading: boolean;
    addProductToStore: (productSku: string, customPrice?: number, customProfit?: number) => Promise<boolean>;
    getAllStoreProducts: () => StoreProductConfig[];
    showSuccess: (message: string) => void;
    showError: (message: string) => void;
    showInfo: (message: string, ...args: any[]) => void;
}

export const AddProductModal = ({ 
    isOpen, 
    onClose, 
    storeId,
    products,
    categories,
    productsLoading,
    addProductToStore,
    getAllStoreProducts,
    showSuccess,
    showError,
    showInfo
}: AddProductModalProps) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage, setProductsPerPage] = useState(20);
    const [isChangingPage, setIsChangingPage] = useState(false);
    const [isInitialLoad, setIsInitialLoad] = useState(true);
    
    // Manejar la carga inicial para evitar destellos
    useEffect(() => {
        if (isOpen && !productsLoading && products.length > 0) {
            // Pequeño delay para evitar destello en la carga inicial
            const timer = setTimeout(() => {
                setIsInitialLoad(false);
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [isOpen, productsLoading, products.length]);

    // Filtrar productos que no están ya en la tienda con useMemo
    const storeProducts = useMemo(() => getAllStoreProducts(), [getAllStoreProducts]);
    const availableProducts = useMemo(() => 
        products.filter(product => 
            !storeProducts.some(sp => sp.product_sku === product.SKU)
        ), [products, storeProducts]
    );

    // Filtrar productos según búsqueda y categoría con useMemo
    const filteredProducts = useMemo(() => 
        availableProducts.filter(product => {
            const matchesSearch = searchTerm === '' || 
                product.Nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.Marca?.toLowerCase().includes(searchTerm.toLowerCase());
            
            const matchesCategory = selectedCategory === '' || 
                product.Categoria === selectedCategory;

            return matchesSearch && matchesCategory;
        }), [availableProducts, searchTerm, selectedCategory]
    );

    // Lógica de paginación optimizada con useMemo
    const paginationData = useMemo(() => {
        const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
        
        // Asegurar que currentPage no exceda el total de páginas
        const validCurrentPage = Math.min(currentPage, Math.max(1, totalPages));
        const startIndex = (validCurrentPage - 1) * productsPerPage;
        const endIndex = startIndex + productsPerPage;
        const currentProducts = filteredProducts.slice(startIndex, endIndex);
        
        return { 
            totalPages, 
            startIndex, 
            endIndex, 
            currentProducts,
            validCurrentPage 
        };
    }, [filteredProducts, productsPerPage, currentPage]);

    const { totalPages, startIndex, endIndex, currentProducts, validCurrentPage } = paginationData;

    // Resetear página cuando cambien los filtros, pero solo si es necesario
    useEffect(() => {
        if (currentPage > totalPages && totalPages > 0) {
            setCurrentPage(1);
        }
    }, [totalPages, currentPage]);

    // Función para cambiar página optimizada con useCallback
    const handlePageChange = useCallback(async (page: number) => {
        if (page === currentPage || page < 1 || page > totalPages) return;
        
        setIsChangingPage(true);
        
        // Scroll al inicio del modal antes del cambio
        const modalContent = document.querySelector('.modal-content');
        if (modalContent) {
            modalContent.scrollTop = 0;
        }
        
        // Cambiar página con un pequeño delay para suavizar la transición
        setTimeout(() => {
            setCurrentPage(page);
            setIsChangingPage(false);
        }, 50);
    }, [currentPage, totalPages]);

    // Agregar producto a la tienda optimizada con useCallback
    const handleAddProduct = useCallback(async (productSku: string) => {
        try {
            const success = await addProductToStore(productSku);
            if (success) {
                setSelectedProducts(prev => {
                    const newSet = new Set(prev);
                    newSet.add(productSku);
                    return newSet;
                });
                showSuccess('Producto agregado exitosamente');
            } else {
                showError('Error al agregar producto');
            }
        } catch (error) {
            console.error('Error en handleAddProduct:', error);
        }
    }, [addProductToStore, showSuccess, showError]);

    const handleAddSelectedProducts = useCallback(async () => {
        for (const productSku of selectedProducts) {
            await addProductToStore(productSku);
        }
        onClose();
    }, [selectedProducts, addProductToStore, onClose]);

    const handleClearSelection = useCallback(() => {
        setSelectedProducts(new Set());
    }, []);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b">
                    <h2 className="text-2xl font-bold">Agregar Productos a la Tienda</h2>
                    <Button variant="ghost" size="sm" onClick={onClose}>
                        <X className="w-5 h-5" />
                    </Button>
                </div>

                {/* Search and Filters */}
                <div className="p-6 border-b bg-gray-50">
                    <div className="flex gap-4 mb-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <Input
                                    placeholder="Buscar productos..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                        >
                            <option value="">Todas las categorías</option>
                            {categories.map((category) => (
                                <option key={category.Codigo} value={category.Codigo}>
                                    {category.Nombre || category.Categoria}
                                </option>
                            ))}
                        </select>
                        <select
                            value={productsPerPage}
                            onChange={(e) => {
                                setProductsPerPage(Number(e.target.value));
                                setCurrentPage(1);
                            }}
                            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                        >
                            <option value={10}>10 por página</option>
                            <option value={20}>20 por página</option>
                            <option value={50}>50 por página</option>
                            <option value={100}>100 por página</option>
                        </select>
                    </div>

                    {selectedProducts.size > 0 && (
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">
                                {selectedProducts.size} producto(s) seleccionado(s)
                            </span>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" onClick={handleClearSelection}>
                                    Limpiar Selección
                                </Button>
                                <Button 
                                    size="sm" 
                                    onClick={handleAddSelectedProducts}
                                    className="bg-red-600 hover:bg-red-700"
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Agregar Seleccionados
                                </Button>
                            </div>
                        </div>
                    )}

                    {filteredProducts.length > productsPerPage && (
                        <div className="px-6 py-4 border-t bg-gray-50">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className="px-3 py-1"
                                    >
                                        Anterior
                                    </Button>
                                    
                                    {/* Números de página */}
                                    <div className="flex items-center space-x-1">
                                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                            let pageNum;
                                            if (totalPages <= 5) {
                                                pageNum = i + 1;
                                            } else if (currentPage <= 3) {
                                                pageNum = i + 1;
                                            } else if (currentPage >= totalPages - 2) {
                                                pageNum = totalPages - 4 + i;
                                            } else {
                                                pageNum = currentPage - 2 + i;
                                            }
                                            
                                            return (
                                                <Button
                                                    key={pageNum}
                                                    variant={currentPage === pageNum ? "default" : "outline"}
                                                    size="sm"
                                                    onClick={() => handlePageChange(pageNum)}
                                                    className="px-3 py-1 min-w-[40px]"
                                                >
                                                    {pageNum}
                                                </Button>
                                            );
                                        })}
                                    </div>
                                    
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className="px-3 py-1"
                                    >
                                        Siguiente
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Products Grid */}
                <div className="p-6 overflow-y-auto max-h-[60vh] modal-content">
                    {productsLoading ? (
                        <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
                            <p className="text-gray-600">Cargando productos...</p>
                        </div>
                    ) : filteredProducts.length === 0 ? (
                        <div className="text-center py-8">
                            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron productos</h3>
                            <p className="text-gray-500">Intenta ajustar los filtros de búsqueda</p>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {currentProducts.map((product) => (
                                <Card 
                                    key={product.SKU} 
                                    className={`cursor-pointer transition-all ${
                                        selectedProducts.has(product.SKU) 
                                            ? 'ring-2 ring-red-500 bg-red-50' 
                                            : 'hover:shadow-md'
                                    }`}
                                    onClick={() => {
                                        if (selectedProducts.has(product.SKU)) {
                                            setSelectedProducts(prev => {
                                                const newSet = new Set(prev);
                                                newSet.delete(product.SKU);
                                                return newSet;
                                            });
                                        } else {
                                            setSelectedProducts(prev => new Set(prev).add(product.SKU));
                                        }
                                    }}
                                >
                                    <CardContent className="p-4">
                                        <div className="flex items-start justify-between mb-3">
                                            <ProductImage
                                                src={product.Imagen}
                                                alt={product.Nombre || 'Producto'}
                                                className="w-16 h-16 object-cover rounded-lg"
                                            />
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleAddProduct(product.SKU);
                                                }}
                                                className="p-1 h-auto"
                                            >
                                                <Plus className="w-4 h-4 text-red-500" />
                                            </Button>
                                        </div>
                                        <div className="space-y-2">
                                            <h4 className="font-medium text-sm">{product.Nombre}</h4>
                                            <p className="text-xs text-gray-600">Marca: {product.Marca}</p>
                                            <p className="text-xs text-gray-600">
                                                Categoría: {product.Categoria}
                                            </p>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-medium">
                                                    ${product.Precio?.toFixed(2) || '0.00'}
                                                </span>
                                                <Badge variant="outline" className="text-xs">
                                                    {product.SKU}
                                                </Badge>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                            </div>
                        </>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t bg-gray-50 flex justify-end gap-3">
                    <Button variant="outline" onClick={onClose}>
                        Cancelar
                    </Button>
                    {selectedProducts.size > 0 && (
                        <Button 
                            onClick={handleAddSelectedProducts}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Agregar {selectedProducts.size} Producto(s)
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};
