import { useState, useEffect, useCallback } from 'react';
import supabase from '@/lib/Supabase';
import { Product, Category, ProductFilters } from '@/types/ecomerce';

interface UseProductsReturn {
  // Productos
  products: Product[];
  loading: boolean;
  error: string | null;
  
  // Categorías
  categories: Category[];
  categoriesLoading: boolean;
  categoriesError: string | null;
  
  // Funciones CRUD para productos
  createProduct: (product: Omit<Product, 'SKU'>) => Promise<Product | null>;
  updateProduct: (sku: string, updates: Partial<Product>) => Promise<Product | null>;
  deleteProduct: (sku: string) => Promise<boolean>;
  getProduct: (sku: string) => Promise<Product | null>;
  
  // Funciones para categorías
  createCategory: (category: Omit<Category, 'Codigo'>) => Promise<Category | null>;
  updateCategory: (codigo: string, updates: Partial<Category>) => Promise<Category | null>;
  deleteCategory: (codigo: string) => Promise<boolean>;
  
  // Funciones de filtrado y búsqueda
  filterProducts: (filters: ProductFilters) => void;
  searchProducts: (searchTerm: string) => void;
  getProductsByCategory: (categoria: string) => void;
  clearFilters: () => void;
  
  // Estado de filtros
  currentFilters: ProductFilters;
  filteredProducts: Product[];
}

export const useProducts = (): UseProductsReturn => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);
  const [currentFilters, setCurrentFilters] = useState<ProductFilters>({});

  // Cargar todos los productos
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
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar productos');
    } finally {
      setLoading(false);
    }
  }, []);

  // Cargar todas las categorías
  const loadCategories = useCallback(async () => {
    setCategoriesLoading(true);
    setCategoriesError(null);
    
    try {
      const { data, error: supabaseError } = await supabase
        .from('category_test')
        .select('*')
        .order('Nombre', { ascending: true });

      if (supabaseError) throw supabaseError;
      
      setCategories(data || []);
    } catch (err) {
      setCategoriesError(err instanceof Error ? err.message : 'Error al cargar categorías');
    } finally {
      setCategoriesLoading(false);
    }
  }, []);

  // Crear producto
  const createProduct = useCallback(async (product: Omit<Product, 'SKU'>): Promise<Product | null> => {
    try {
      // Generar SKU único basado en timestamp y nombre
      const timestamp = Date.now();
      const sku = `${product.Nombre?.substring(0, 3).toUpperCase() || 'PROD'}_${timestamp}`;
      
      const newProduct: Product = {
        ...product,
        SKU: sku
      };

      const { data, error: supabaseError } = await supabase
        .from('products_test')
        .insert(newProduct)
        .select()
        .single();

      if (supabaseError) throw supabaseError;
      
      // Recargar productos
      await loadProducts();
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear producto');
      return null;
    }
  }, [loadProducts]);

  // Actualizar producto
  const updateProduct = useCallback(async (sku: string, updates: Partial<Product>): Promise<Product | null> => {
    try {
      const { data, error: supabaseError } = await supabase
        .from('products_test')
        .update(updates)
        .eq('SKU', sku)
        .select()
        .single();

      if (supabaseError) throw supabaseError;
      
      // Recargar productos
      await loadProducts();
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar producto');
      return null;
    }
  }, [loadProducts]);

  // Eliminar producto
  const deleteProduct = useCallback(async (sku: string): Promise<boolean> => {
    try {
      const { error: supabaseError } = await supabase
        .from('products_test')
        .delete()
        .eq('SKU', sku);

      if (supabaseError) throw supabaseError;
      
      // Recargar productos
      await loadProducts();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar producto');
      return false;
    }
  }, [loadProducts]);

  // Obtener producto por SKU
  const getProduct = useCallback(async (sku: string): Promise<Product | null> => {
    try {
      const { data, error: supabaseError } = await supabase
        .from('products_test')
        .select('*')
        .eq('SKU', sku)
        .single();

      if (supabaseError) throw supabaseError;
      
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al obtener producto');
      return null;
    }
  }, []);

  // Crear categoría
  const createCategory = useCallback(async (category: Omit<Category, 'Codigo'>): Promise<Category | null> => {
    try {
      // Generar código único
      const timestamp = Date.now();
      const codigo = `${category.Nombre?.substring(0, 3).toUpperCase() || 'CAT'}_${timestamp}`;
      
      const newCategory: Category = {
        ...category,
        Codigo: codigo
      };

      const { data, error: supabaseError } = await supabase
        .from('category_test')
        .insert(newCategory)
        .select()
        .single();

      if (supabaseError) throw supabaseError;
      
      // Recargar categorías
      await loadCategories();
      return data;
    } catch (err) {
      setCategoriesError(err instanceof Error ? err.message : 'Error al crear categoría');
      return null;
    }
  }, [loadCategories]);

  // Actualizar categoría
  const updateCategory = useCallback(async (codigo: string, updates: Partial<Category>): Promise<Category | null> => {
    try {
      const { data, error: supabaseError } = await supabase
        .from('category_test')
        .update(updates)
        .eq('Codigo', codigo)
        .select()
        .single();

      if (supabaseError) throw supabaseError;
      
      // Recargar categorías
      await loadCategories();
      return data;
    } catch (err) {
      setCategoriesError(err instanceof Error ? err.message : 'Error al actualizar categoría');
      return null;
    }
  }, [loadCategories]);

  // Eliminar categoría
  const deleteCategory = useCallback(async (codigo: string): Promise<boolean> => {
    try {
      const { error: supabaseError } = await supabase
        .from('category_test')
        .delete()
        .eq('Codigo', codigo);

      if (supabaseError) throw supabaseError;
      
      // Recargar categorías
      await loadCategories();
      return true;
    } catch (err) {
      setCategoriesError(err instanceof Error ? err.message : 'Error al eliminar categoría');
      return false;
    }
  }, [loadCategories]);

  // Filtrar productos
  const filterProducts = useCallback((filters: ProductFilters) => {
    setCurrentFilters(filters);
    
    let filtered = [...products];

    // Filtro por categoría
    if (filters.categoria) {
      filtered = filtered.filter(product => 
        product.Categoria === filters.categoria
      );
    }

    // Filtro por marca
    if (filters.marca) {
      filtered = filtered.filter(product => 
        product.Marca?.toLowerCase().includes(filters.marca!.toLowerCase())
      );
    }

    // Filtro por precio mínimo
    if (filters.precioMin !== undefined) {
      filtered = filtered.filter(product => 
        product.Precio && product.Precio >= filters.precioMin!
      );
    }

    // Filtro por precio máximo
    if (filters.precioMax !== undefined) {
      filtered = filtered.filter(product => 
        product.Precio && product.Precio <= filters.precioMax!
      );
    }

    // Filtro por búsqueda de texto
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(product => 
        product.Nombre?.toLowerCase().includes(searchTerm) ||
        product.Descricpion?.toLowerCase().includes(searchTerm) ||
        product.Marca?.toLowerCase().includes(searchTerm)
      );
    }

    setFilteredProducts(filtered);
  }, [products]);

  // Búsqueda de productos
  const searchProducts = useCallback((searchTerm: string) => {
    filterProducts({ ...currentFilters, search: searchTerm });
  }, [currentFilters, filterProducts]);

  // Obtener productos por categoría
  const getProductsByCategory = useCallback((categoria: string) => {
    filterProducts({ ...currentFilters, categoria });
  }, [currentFilters, filterProducts]);

  // Limpiar filtros
  const clearFilters = useCallback(() => {
    setCurrentFilters({});
    setFilteredProducts(products);
  }, [products]);

  // Cargar datos al inicializar
  useEffect(() => {
    loadProducts();
    loadCategories();
  }, [loadProducts, loadCategories]);

  return {
    // Productos
    products,
    loading,
    error,
    
    // Categorías
    categories,
    categoriesLoading,
    categoriesError,
    
    // Funciones CRUD para productos
    createProduct,
    updateProduct,
    deleteProduct,
    getProduct,
    
    // Funciones para categorías
    createCategory,
    updateCategory,
    deleteCategory,
    
    // Funciones de filtrado y búsqueda
    filterProducts,
    searchProducts,
    getProductsByCategory,
    clearFilters,
    
    // Estado de filtros
    currentFilters,
    filteredProducts,
  };
};
