import { useState, useEffect, useCallback } from 'react';
import supabase from '@/lib/Supabase';

interface CarModel {
  id: number;
  model_car: string;
  code_model: string;
  code_assembly_plant: string;
  created_at: string;
}

interface UseCarModelsReturn {
  carModels: CarModel[];
  loading: boolean;
  error: string | null;
  loadCarModels: (assemblyPlantCode?: string) => Promise<void>;
  getModelsByAssemblyPlant: (assemblyPlantCode: string) => CarModel[];
}

export const useCarModels = (): UseCarModelsReturn => {
  const [carModels, setCarModels] = useState<CarModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadCarModels = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error: supabaseError } = await supabase
        .from('model_car_test')
        .select('*');

      if (supabaseError) throw supabaseError;
      
      console.log('Car models data:', data);
      setCarModels(data || []);
    } catch (err) {
      console.error('Error loading car models:', err);
      setError(err instanceof Error ? err.message : 'Error al cargar modelos de vehículos');
    } finally {
      setLoading(false);
    }
  }, []);

  const getModelsByAssemblyPlant = useCallback((assemblyPlantCode: string) => {
    // Filtrar modelos que coincidan con el código de la ensambladora
    return carModels.filter(model => model.code_assembly_plant === assemblyPlantCode);
  }, [carModels]);

  useEffect(() => {
    loadCarModels();
  }, [loadCarModels]);

  return {
    carModels,
    loading,
    error,
    loadCarModels,
    getModelsByAssemblyPlant,
  };
};
