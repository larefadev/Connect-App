import { useState, useEffect, useCallback } from 'react';
import supabase from '@/lib/Supabase';

interface Motorization {
  motorization: string;
  code: string;
}

interface UseMotorizationsReturn {
  motorizations: Motorization[];
  loading: boolean;
  error: string | null;
  loadMotorizations: () => Promise<void>;
}

export const useMotorizations = (): UseMotorizationsReturn => {
  const [motorizations, setMotorizations] = useState<Motorization[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadMotorizations = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error: supabaseError } = await supabase
        .from('motorization_car_test')
        .select('*');

      if (supabaseError) throw supabaseError;
      
      console.log('Motorizations data:', data);
      setMotorizations(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar motorizaciones');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMotorizations();
  }, [loadMotorizations]);

  return {
    motorizations,
    loading,
    error,
    loadMotorizations,
  };
};
