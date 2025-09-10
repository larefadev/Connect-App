import { useState, useEffect, useCallback } from 'react';
import supabase from '@/lib/Supabase';

interface UseProductYearsReturn {
  years: string[];
  loading: boolean;
  error: string | null;
  loadYears: () => Promise<void>;
}

export const useProductYears = (): UseProductYearsReturn => {
  const [years, setYears] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadYears = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error: supabaseError } = await supabase
        .from('products_test')
        .select('Año');

      if (supabaseError) throw supabaseError;
      
      console.log('Years data:', data);
      // Extraer años únicos y ordenarlos
      const uniqueYears = Array.from(
        new Set(data?.map(item => item.Año).filter(Boolean))
      ).sort((a, b) => b.localeCompare(a));
      
      console.log('Unique years:', uniqueYears);
      setYears(uniqueYears);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar años');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadYears();
  }, [loadYears]);

  return {
    years,
    loading,
    error,
    loadYears,
  };
};
