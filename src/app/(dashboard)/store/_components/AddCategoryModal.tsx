"use client";

import { useState } from 'react';
import { X, Search, Plus, FolderOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useProducts } from '@/hooks/Products/useProducts';
import { useStoreConfig } from '@/hooks/StoreProfile/useStoreConfig';

interface AddCategoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    storeId: number;
}

export const AddCategoryModal = ({ isOpen, onClose, storeId }: AddCategoryModalProps) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set());
    const { categories, loading } = useProducts();
    const { addCategoryToStore, categories: storeCategories } = useStoreConfig(storeId);

    // Filtrar categorías que no están ya en la tienda
    const availableCategories = categories.filter(category => 
        !storeCategories.some(sc => sc.category_code === category.Codigo)
    );

    // Filtrar categorías según búsqueda
    const filteredCategories = availableCategories.filter(category => {
        return searchTerm === '' || 
            category.Nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            category.Categoria?.toLowerCase().includes(searchTerm.toLowerCase());
    });

    // Agregar categoría a la tienda
    const handleAddCategory = async (categoryCode: string) => {
        const success = await addCategoryToStore(categoryCode);
        if (success) {
            setSelectedCategories(prev => {
                const newSet = new Set(prev);
                newSet.add(categoryCode);
                return newSet;
            });
        }
    };

    // Agregar múltiples categorías seleccionadas
    const handleAddSelectedCategories = async () => {
        for (const categoryCode of selectedCategories) {
            await addCategoryToStore(categoryCode);
        }
        onClose();
    };

    // Limpiar selección
    const handleClearSelection = () => {
        setSelectedCategories(new Set());
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b">
                    <h2 className="text-2xl font-bold">Agregar Categorías a la Tienda</h2>
                    <Button variant="ghost" size="sm" onClick={onClose}>
                        <X className="w-5 h-5" />
                    </Button>
                </div>

                {/* Search */}
                <div className="p-6 border-b bg-gray-50">
                    <div className="relative mb-4">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                            placeholder="Buscar categorías..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>

                    {selectedCategories.size > 0 && (
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">
                                {selectedCategories.size} categoría(s) seleccionada(s)
                            </span>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" onClick={handleClearSelection}>
                                    Limpiar Selección
                                </Button>
                                <Button 
                                    size="sm" 
                                    onClick={handleAddSelectedCategories}
                                    className="bg-red-600 hover:bg-red-700"
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Agregar Seleccionadas
                                </Button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Categories Grid */}
                <div className="p-6 overflow-y-auto max-h-[60vh]">
                    {loading ? (
                        <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
                            <p className="text-gray-600">Cargando categorías...</p>
                        </div>
                    ) : filteredCategories.length === 0 ? (
                        <div className="text-center py-8">
                            <FolderOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron categorías</h3>
                            <p className="text-gray-500">Intenta ajustar los filtros de búsqueda</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {filteredCategories.map((category) => (
                                <Card 
                                    key={category.Codigo} 
                                    className={`cursor-pointer transition-all ${
                                        selectedCategories.has(category.Codigo) 
                                            ? 'ring-2 ring-red-500 bg-red-50' 
                                            : 'hover:shadow-md'
                                    }`}
                                    onClick={() => {
                                        if (selectedCategories.has(category.Codigo)) {
                                            setSelectedCategories(prev => {
                                                const newSet = new Set(prev);
                                                newSet.delete(category.Codigo);
                                                return newSet;
                                            });
                                        } else {
                                            setSelectedCategories(prev => new Set(prev).add(category.Codigo));
                                        }
                                    }}
                                >
                                    <CardContent className="p-4">
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                                                <FolderOpen className="w-8 h-8 text-gray-400" />
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleAddCategory(category.Codigo);
                                                }}
                                                className="p-1 h-auto"
                                            >
                                                <Plus className="w-4 h-4 text-red-500" />
                                            </Button>
                                        </div>
                                        <div className="space-y-2">
                                            <h4 className="font-medium text-sm">
                                                {category.Nombre || category.Categoria}
                                            </h4>
                                            {category.Descripcion && (
                                                <p className="text-xs text-gray-600">
                                                    {category.Descripcion}
                                                </p>
                                            )}
                                            <div className="flex items-center justify-between">
                                                <Badge variant="outline" className="text-xs">
                                                    {category.Codigo}
                                                </Badge>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t bg-gray-50 flex justify-end gap-3">
                    <Button variant="outline" onClick={onClose}>
                        Cancelar
                    </Button>
                    {selectedCategories.size > 0 && (
                        <Button 
                            onClick={handleAddSelectedCategories}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Agregar {selectedCategories.size} Categoría(s)
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};
