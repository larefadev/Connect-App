import { useState, useEffect, useCallback } from 'react';
import supabase from '@/lib/Supabase';
import { Product, Category } from '@/types/ecomerce';

interface UseProductFiltersReturn {
  // Estados
  products: Product[];
  categories: Category[];
  filteredProducts: Product[];
  loading: boolean;
  error: string | null;
  
  // Funciones de filtrado
  filterByCategory: (categoria: string) => void;
  filterByPrice: (minPrice: number, maxPrice: number) => void;
  filterByBrand: (marca: string) => void;
  searchProducts: (searchTerm: string) => void;
  clearFilters: () => void;
  
  // Estado de filtros
  currentCategory: string;
  currentPriceRange: { min: number; max: number };
  currentBrand: string;
  currentSearch: string;
}

export const useProductFilters = (): UseProductFiltersReturn => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Estados de filtros
  const [currentCategory, setCurrentCategory] = useState<string>('');
  const [currentPriceRange, setCurrentPriceRange] = useState<{ min: number; max: number }>({ min: 0, max: 0 });
  const [currentBrand, setCurrentBrand] = useState<string>('');
  const [currentSearch, setCurrentSearch] = useState<string>('');

  // Cargar productos
  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error: supabaseError } = await supabase
        .from('products_test')
        .select('*')
        .order('Nombre', { ascending: true });

      if (supabaseError) throw supabaseError;
      
      setProducts(data || []);
      setFilteredProducts(data || []);
      
      // Calcular rango de precios
      if (data && data.length > 0) {
        const prices = data.map(p => p.Precio || 0).filter(p => p > 0);
        if (prices.length > 0) {
          setCurrentPriceRange({
            min: Math.min(...prices),
            max: Math.max(...prices)
          });
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar productos');
    } finally {
      setLoading(false);
    }
  }, []);

  // Cargar categorías
  const loadCategories = useCallback(async () => {
    try {
      const { data, error: supabaseError } = await supabase
        .from('category_test')
        .select('*')
        .order('Nombre', { ascending: true });

      if (supabaseError) throw supabaseError;
      setCategories(data || []);
    } catch (err) {
      console.error('Error al cargar categorías:', err);
    }
  }, []);

  // Aplicar filtros
  const applyFilters = useCallback(() => {
    let filtered = [...products];

    // Filtro por categoría
    if (currentCategory) {
      filtered = filtered.filter(product => 
        product.Categoria === currentCategory
      );
    }

    // Filtro por precio
    if (currentPriceRange.min > 0 || currentPriceRange.max > 0) {
      filtered = filtered.filter(product => {
        if (!product.Precio) return false;
        if (currentPriceRange.min > 0 && product.Precio < currentPriceRange.min) return false;
        if (currentPriceRange.max > 0 && product.Precio > currentPriceRange.max) return false;
        return true;
      });
    }

    // Filtro por marca
    if (currentBrand) {
      filtered = filtered.filter(product => 
        product.Marca?.toLowerCase().includes(currentBrand.toLowerCase())
      );
    }

    // Filtro por búsqueda
    if (currentSearch) {
      const searchTerm = currentSearch.toLowerCase();
      filtered = filtered.filter(product => 
        product.Nombre?.toLowerCase().includes(searchTerm) ||
        product.Descricpion?.toLowerCase().includes(searchTerm) ||
        product.Marca?.toLowerCase().includes(searchTerm)
      );
    }

    setFilteredProducts(filtered);
  }, [products, currentCategory, currentPriceRange, currentBrand, currentSearch]);

  // Filtrar por categoría
  const filterByCategory = useCallback((categoria: string) => {
    setCurrentCategory(categoria);
  }, []);

  // Filtrar por precio
  const filterByPrice = useCallback((minPrice: number, maxPrice: number) => {
    setCurrentPriceRange({ min: minPrice, max: maxPrice });
  }, []);

  // Filtrar por marca
  const filterByBrand = useCallback((marca: string) => {
    setCurrentBrand(marca);
  }, []);

  // Búsqueda de productos
  const searchProducts = useCallback((searchTerm: string) => {
    setCurrentSearch(searchTerm);
  }, []);

  // Limpiar filtros
  const clearFilters = useCallback(() => {
    setCurrentCategory('');
    setCurrentPriceRange({ min: 0, max: 0 });
    setCurrentBrand('');
    setCurrentSearch('');
    setFilteredProducts(products);
  }, [products]);

  // Aplicar filtros cuando cambien
  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  // Cargar datos al inicializar
  useEffect(() => {
    loadProducts();
    loadCategories();
  }, [loadProducts, loadCategories]);

  return {
    // Estados
    products,
    categories,
    filteredProducts,
    loading,
    error,
    
    // Funciones de filtrado
    filterByCategory,
    filterByPrice,
    filterByBrand,
    searchProducts,
    clearFilters,
    
    // Estado de filtros
    currentCategory,
    currentPriceRange,
    currentBrand,
    currentSearch,
  };
};
