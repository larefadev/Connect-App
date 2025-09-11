"use client";

import { useState, useEffect, useMemo, useCallback } from 'react';
import { X, Search, Plus, Package, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Product, Category } from '@/types/ecomerce';
import { ProductImage } from '@/components/ui/product-image';
import { CartItem } from '@/types/b2b-order';

interface AddProductToCartModalProps {
    isOpen: boolean;
    onClose: () => void;
    products: Product[];
    categories: Category[];
    productsLoading: boolean;
    onAddToCart: (item: CartItem) => void;
    onOpenCheckout?: () => void;
}

export const AddProductToCartModal = ({ 
    isOpen, 
    onClose, 
    products,
    categories,
    productsLoading,
    onAddToCart,
    onOpenCheckout
}: AddProductToCartModalProps) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [selectedProducts, setSelectedProducts] = useState<Map<string, number>>(new Map());
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage, setProductsPerPage] = useState(20);
    const [isChangingPage, setIsChangingPage] = useState(false);
    const [isInitialLoad, setIsInitialLoad] = useState(true);
    
    // Manejar la carga inicial para evitar destellos
    useEffect(() => {
        if (isOpen && !productsLoading && products.length > 0) {
            const timer = setTimeout(() => {
                setIsInitialLoad(false);
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [isOpen, productsLoading, products.length]);

    // Filtrar productos según búsqueda y categoría con useMemo
    const filteredProducts = useMemo(() => 
        products.filter(product => {
            const matchesSearch = searchTerm === '' || 
                product.Nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.Marca?.toLowerCase().includes(searchTerm.toLowerCase());
            
            const matchesCategory = selectedCategory === '' || 
                product.Categoria === selectedCategory;

            return matchesSearch && matchesCategory;
        }), [products, searchTerm, selectedCategory]
    );

    // Lógica de paginación optimizada con useMemo
    const paginationData = useMemo(() => {
        const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
        
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

    // Resetear página cuando cambien los filtros
    useEffect(() => {
        if (currentPage > totalPages && totalPages > 0) {
            setCurrentPage(1);
        }
    }, [totalPages, currentPage]);

    // Función para cambiar página optimizada con useCallback
    const handlePageChange = useCallback(async (page: number) => {
        if (page === currentPage || page < 1 || page > totalPages) return;
        
        setIsChangingPage(true);
        
        const modalContent = document.querySelector('.modal-content');
        if (modalContent) {
            modalContent.scrollTop = 0;
        }
        
        setTimeout(() => {
            setCurrentPage(page);
            setIsChangingPage(false);
        }, 50);
    }, [currentPage, totalPages]);

    // Agregar producto al carrito optimizada con useCallback
    const handleAddToCart = useCallback((product: Product, quantity: number = 1) => {
        const cartItem: CartItem = {
            product_sku: product.SKU,
            product_name: product.Nombre || 'Producto',
            product_description: product.Descricpion || product.Nombre || 'Sin descripción',
            product_image: product.Imagen,
            product_brand: product.Marca,
            unit_price: product.Precio || 0,
            retail_price: product.Precio,
            quantity,
            total_price: (product.Precio || 0) * quantity,
            discount_percentage: 0,
            discount_amount: 0,
            tax_rate: 16, // 16% IVA por defecto
            tax_amount: ((product.Precio || 0) * quantity) * 0.16,
            item_notes: ''
        };

        onAddToCart(cartItem);
        
        // Actualizar selección local
        setSelectedProducts(prev => {
            const newMap = new Map(prev);
            newMap.set(product.SKU, quantity);
            return newMap;
        });
    }, [onAddToCart]);

    const handleQuantityChange = useCallback((productSku: string, quantity: number) => {
        if (quantity <= 0) {
            setSelectedProducts(prev => {
                const newMap = new Map(prev);
                newMap.delete(productSku);
                return newMap;
            });
        } else {
            setSelectedProducts(prev => {
                const newMap = new Map(prev);
                newMap.set(productSku, quantity);
                return newMap;
            });
        }
    }, []);

    const handleAddSelectedProducts = useCallback(() => {
        selectedProducts.forEach((quantity, productSku) => {
            const product = products.find(p => p.SKU === productSku);
            if (product) {
                const cartItem: CartItem = {
                    product_sku: product.SKU,
                    product_name: product.Nombre || 'Producto',
                    product_description: product.Descricpion || product.Nombre || 'Sin descripción',
                    product_image: product.Imagen,
                    product_brand: product.Marca,
                    unit_price: product.Precio || 0,
                    retail_price: product.Precio,
                    quantity,
                    total_price: (product.Precio || 0) * quantity,
                    discount_percentage: 0,
                    discount_amount: 0,
                    tax_rate: 16,
                    tax_amount: ((product.Precio || 0) * quantity) * 0.16,
                    item_notes: ''
                };
                onAddToCart(cartItem);
            }
        });
        onClose();
    }, [selectedProducts, products, onAddToCart, onClose]);

    const handleClearSelection = useCallback(() => {
        setSelectedProducts(new Map());
    }, []);

    const handleGoToCheckout = useCallback(() => {
        // Agregar productos seleccionados al carrito
        selectedProducts.forEach((quantity, productSku) => {
            const product = products.find(p => p.SKU === productSku);
            if (product) {
                const cartItem: CartItem = {
                    product_sku: product.SKU,
                    product_name: product.Nombre || 'Producto',
                    product_description: product.Descricpion || product.Nombre || 'Sin descripción',
                    product_image: product.Imagen,
                    product_brand: product.Marca,
                    unit_price: product.Precio || 0,
                    retail_price: product.Precio,
                    quantity,
                    total_price: (product.Precio || 0) * quantity,
                    discount_percentage: 0,
                    discount_amount: 0,
                    tax_rate: 16,
                    tax_amount: ((product.Precio || 0) * quantity) * 0.16,
                    item_notes: ''
                };
                onAddToCart(cartItem);
            }
        });
        
        // Cerrar modal y abrir checkout
        onClose();
        if (onOpenCheckout) {
            onOpenCheckout();
        }
    }, [selectedProducts, products, onAddToCart, onClose, onOpenCheckout]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-4 lg:p-6 border-b">
                    <h2 className="text-lg lg:text-2xl font-bold">Agregar Productos al Carrito</h2>
                    <Button variant="ghost" size="sm" onClick={onClose}>
                        <X className="w-4 h-4 lg:w-5 lg:h-5" />
                    </Button>
                </div>

                {/* Search and Filters */}
                <div className="p-4 lg:p-6 border-b bg-gray-50">
                    <div className="flex flex-col sm:flex-row gap-3 lg:gap-4 mb-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <Input
                                    placeholder="Buscar productos..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 text-sm lg:text-base"
                                />
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 lg:gap-4">
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-sm lg:text-base"
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
                                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-sm lg:text-base"
                            >
                                <option value={10}>10 por página</option>
                                <option value={20}>20 por página</option>
                                <option value={50}>50 por página</option>
                                <option value={100}>100 por página</option>
                            </select>
                        </div>
                    </div>

                    {selectedProducts.size > 0 && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 lg:p-4">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                                <span className="text-xs lg:text-sm font-medium text-blue-800">
                                    {selectedProducts.size} producto(s) seleccionado(s)
                                </span>
                                <Button variant="outline" size="sm" onClick={handleClearSelection} className="text-blue-600 border-blue-300 hover:bg-blue-100 w-full sm:w-auto">
                                    Limpiar Selección
                                </Button>
                            </div>
                            <div className="text-xs lg:text-sm text-blue-600">
                                Los productos seleccionados se agregarán al carrito. Puedes continuar seleccionando más productos o ir directamente al checkout.
                            </div>
                        </div>
                    )}

                    {filteredProducts.length > productsPerPage && (
                        <div className="px-4 lg:px-6 py-3 lg:py-4 border-t bg-gray-50">
                            <div className="flex items-center justify-center">
                                <div className="flex items-center space-x-1 lg:space-x-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className="px-2 lg:px-3 py-1 text-xs lg:text-sm"
                                    >
                                        <span className="hidden sm:inline">Anterior</span>
                                        <span className="sm:hidden">‹</span>
                                    </Button>
                                    
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
                                                    className="px-2 lg:px-3 py-1 min-w-[32px] lg:min-w-[40px] text-xs lg:text-sm"
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
                                        className="px-2 lg:px-3 py-1 text-xs lg:text-sm"
                                    >
                                        <span className="hidden sm:inline">Siguiente</span>
                                        <span className="sm:hidden">›</span>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Products Grid */}
                <div className="p-4 lg:p-6 overflow-y-auto max-h-[60vh] modal-content">
                    {productsLoading ? (
                        <div className="text-center py-6 lg:py-8">
                            <div className="animate-spin rounded-full h-6 w-6 lg:h-8 lg:w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
                            <p className="text-sm lg:text-base text-gray-600">Cargando productos...</p>
                        </div>
                    ) : filteredProducts.length === 0 ? (
                        <div className="text-center py-6 lg:py-8">
                            <Package className="w-12 h-12 lg:w-16 lg:h-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-base lg:text-lg font-medium text-gray-900 mb-2">No se encontraron productos</h3>
                            <p className="text-sm lg:text-base text-gray-500">Intenta ajustar los filtros de búsqueda</p>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
                                {currentProducts.map((product) => {
                                    const selectedQuantity = selectedProducts.get(product.SKU) || 0;
                                    
                                    return (
                                <Card 
                                    key={product.SKU} 
                                    className={`cursor-pointer transition-all hover:scale-105 ${
                                        selectedQuantity > 0 
                                            ? 'ring-2 ring-red-500 bg-red-50 shadow-lg' 
                                            : 'hover:shadow-md hover:ring-2 hover:ring-gray-300'
                                    }`}
                                    onClick={() => {
                                        if (selectedQuantity > 0) {
                                            // Si ya está seleccionado, incrementar cantidad
                                            handleQuantityChange(product.SKU, selectedQuantity + 1);
                                        } else {
                                            // Si no está seleccionado, agregar con cantidad 1
                                            handleAddToCart(product, 1);
                                        }
                                    }}
                                >
                                            <CardContent className="p-3 lg:p-4">
                                                <div className="flex items-start justify-between mb-3">
                                                    <ProductImage
                                                        src={product.Imagen}
                                                        alt={product.Nombre || 'Producto'}
                                                        className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-lg"
                                                    />
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            if (selectedQuantity > 0) {
                                                                handleQuantityChange(product.SKU, selectedQuantity + 1);
                                                            } else {
                                                                handleAddToCart(product, 1);
                                                            }
                                                        }}
                                                        className="p-1 h-auto"
                                                    >
                                                        <Plus className="w-3 h-3 sm:w-4 sm:h-4 text-red-500" />
                                                    </Button>
                                                </div>
                                                <div className="space-y-2">
                                                    <h4 className="font-medium text-xs sm:text-sm truncate">{product.Nombre}</h4>
                                                    <p className="text-xs text-gray-600">Marca: {product.Marca}</p>
                                                    <p className="text-xs text-gray-600">
                                                        Categoría: {product.Categoria}
                                                    </p>
                                                    {selectedQuantity === 0 && (
                                                        <p className="text-xs text-blue-600 font-medium">
                                                            Clic para seleccionar
                                                        </p>
                                                    )}
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-xs sm:text-sm font-medium">
                                                            ${product.Precio?.toFixed(2) || '0.00'}
                                                        </span>
                                                        <Badge variant="outline" className="text-xs">
                                                            {product.SKU}
                                                        </Badge>
                                                    </div>
                                                    
                                                    {selectedQuantity > 0 && (
                                                        <div 
                                                            className="flex items-center justify-between mt-2 pt-2 border-t"
                                                            onClick={(e) => e.stopPropagation()}
                                                        >
                                                            <span className="text-xs text-gray-600">Cantidad:</span>
                                                            <div className="flex items-center space-x-2">
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleQuantityChange(product.SKU, selectedQuantity - 1);
                                                                    }}
                                                                    className="w-6 h-6 p-0"
                                                                >
                                                                    -
                                                                </Button>
                                                                <span className="w-8 text-center text-sm font-medium">{selectedQuantity}</span>
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleQuantityChange(product.SKU, selectedQuantity + 1);
                                                                    }}
                                                                    className="w-6 h-6 p-0"
                                                                >
                                                                    +
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    );
                                })}
                            </div>
                        </>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 lg:p-6 border-t bg-gray-50 flex flex-col sm:flex-row sm:justify-between gap-3">
                    <div>
                        {selectedProducts.size > 0 && (
                            <Button 
                                variant="outline"
                                onClick={handleAddSelectedProducts}
                                className="w-full sm:w-auto"
                            >
                                <ShoppingCart className="w-4 h-4 mr-2" />
                                Agregar {selectedProducts.size} Producto(s)
                            </Button>
                        )}
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">
                            Cancelar
                        </Button>
                        {selectedProducts.size > 0 && (
                            <Button 
                                onClick={handleGoToCheckout}
                                className="bg-red-600 hover:bg-red-700 w-full sm:w-auto"
                            >
                                <ShoppingCart className="w-4 h-4 mr-2" />
                                Ir al Checkout
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
