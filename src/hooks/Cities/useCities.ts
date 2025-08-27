import { useState, useEffect, useCallback } from 'react';
import supabase from '@/lib/Supabase';

export interface City {
  id: bigint;
  created_at: string;
  name: string;
}

interface UseCitiesReturn {
  cities: City[];
  loading: boolean;
  error: string | null;
  
  // Funciones CRUD
  createCity: (city: Omit<City, 'id' | 'created_at'>) => Promise<City | null>;
  updateCity: (id: bigint, updates: Partial<City>) => Promise<City | null>;
  deleteCity: (id: bigint) => Promise<boolean>;
  getCity: (id: bigint) => Promise<City | null>;
  
  // Función para obtener opciones del select
  getCityOptions: () => { value: string; label: string }[];
}

export const useCities = (): UseCitiesReturn => {
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar todas las ciudades
  const loadCities = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error: supabaseError } = await supabase
        .from('city')
        .select('*')
        .order('name', { ascending: true });

      if (supabaseError) throw supabaseError;
      
      setCities(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar ciudades');
    } finally {
      setLoading(false);
    }
  }, []);

  // Crear ciudad
  const createCity = useCallback(async (city: Omit<City, 'id' | 'created_at'>): Promise<City | null> => {
    try {
      const { data, error: supabaseError } = await supabase
        .from('city')
        .insert(city)
        .select()
        .single();

      if (supabaseError) throw supabaseError;
      
      // Recargar ciudades
      await loadCities();
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear ciudad');
      return null;
    }
  }, [loadCities]);

  // Actualizar ciudad
  const updateCity = useCallback(async (id: bigint, updates: Partial<City>): Promise<City | null> => {
    try {
      const { data, error: supabaseError } = await supabase
        .from('city')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (supabaseError) throw supabaseError;
      
      // Recargar ciudades
      await loadCities();
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar ciudad');
      return null;
    }
  }, [loadCities]);

  // Eliminar ciudad
  const deleteCity = useCallback(async (id: bigint): Promise<boolean> => {
    try {
      const { error: supabaseError } = await supabase
        .from('city')
        .delete()
        .eq('id', id);

      if (supabaseError) throw supabaseError;
      
      // Recargar ciudades
      await loadCities();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar ciudad');
      return false;
    }
  }, [loadCities]);

  // Obtener ciudad por ID
  const getCity = useCallback(async (id: bigint): Promise<City | null> => {
    try {
      const { data, error: supabaseError } = await supabase
        .from('city')
        .select('*')
        .eq('id', id)
        .single();

      if (supabaseError) throw supabaseError;
      
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al obtener ciudad');
      return null;
    }
  }, []);

  // Obtener opciones para el select
  const getCityOptions = useCallback(() => {
    return cities.map(city => ({
      value: city.id.toString(),
      label: city.name
    }));
  }, [cities]);

  // Cargar ciudades al inicializar
  useEffect(() => {
    loadCities();
  }, [loadCities]);

  return {
    cities,
    loading,
    error,
    createCity,
    updateCity,
    deleteCity,
    getCity,
    getCityOptions,
  };
};
