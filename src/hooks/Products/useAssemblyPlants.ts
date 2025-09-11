import { useState, useEffect, useCallback } from 'react';
import supabase from '@/lib/Supabase';

interface AssemblyPlant {
  assembly_plant: string;
  code: string;
}

interface UseAssemblyPlantsReturn {
  assemblyPlants: AssemblyPlant[];
  loading: boolean;
  error: string | null;
  loadAssemblyPlants: () => Promise<void>;
}

export const useAssemblyPlants = (): UseAssemblyPlantsReturn => {
  const [assemblyPlants, setAssemblyPlants] = useState<AssemblyPlant[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadAssemblyPlants = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error: supabaseError } = await supabase
        .from('assembly_plant_test')
        .select('*');

      if (supabaseError) throw supabaseError;
      
      setAssemblyPlants(data || []);
    } catch (err) {
      console.error('Error loading assembly plants:', err);
      setError(err instanceof Error ? err.message : 'Error al cargar ensambladoras');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAssemblyPlants();
  }, [loadAssemblyPlants]);

  return {
    assemblyPlants,
    loading,
    error,
    loadAssemblyPlants,
  };
};
