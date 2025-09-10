import { useState, useCallback } from 'react';
import { useProductYears } from './useProductYears';
import { useAssemblyPlants } from './useAssemblyPlants';
import { useCarModels } from './useCarModels';
import { useMotorizations } from './useMotorizations';

interface CatalogFilters {
  year?: string;
  assemblyPlant?: string;
  model?: string;
  motorization?: string;
  priceMin?: number;
  priceMax?: number;
}

interface UseCatalogFiltersReturn {
  // Datos de filtros
  years: string[];
  assemblyPlants: any[];
  carModels: any[];
  motorizations: any[];
  
  // Estados de carga
  yearsLoading: boolean;
  assemblyPlantsLoading: boolean;
  carModelsLoading: boolean;
  motorizationsLoading: boolean;
  
  // Errores
  yearsError: string | null;
  assemblyPlantsError: string | null;
  carModelsError: string | null;
  motorizationsError: string | null;
  
  // Filtros actuales
  currentFilters: CatalogFilters;
  
  // Funciones para actualizar filtros
  setYear: (year: string) => void;
  setAssemblyPlant: (assemblyPlant: string) => void;
  setModel: (model: string) => void;
  setMotorization: (motorization: string) => void;
  setPriceRange: (min: number, max: number) => void;
  clearFilters: () => void;
  
  // Funciones auxiliares
  getModelsByAssemblyPlant: (assemblyPlantCode: string) => any[];
}

export const useCatalogFilters = (): UseCatalogFiltersReturn => {
  // Hooks individuales
  const { years, loading: yearsLoading, error: yearsError } = useProductYears();
  const { assemblyPlants, loading: assemblyPlantsLoading, error: assemblyPlantsError } = useAssemblyPlants();
  const { carModels, loading: carModelsLoading, error: carModelsError, getModelsByAssemblyPlant } = useCarModels();
  const { motorizations, loading: motorizationsLoading, error: motorizationsError } = useMotorizations();

  // Estado de filtros actuales
  const [currentFilters, setCurrentFilters] = useState<CatalogFilters>({});

  // Funciones para actualizar filtros
  const setYear = useCallback((year: string) => {
    setCurrentFilters(prev => ({
      ...prev,
      year: year || undefined
    }));
  }, []);

  const setAssemblyPlant = useCallback((assemblyPlant: string) => {
    setCurrentFilters(prev => ({
      ...prev,
      assemblyPlant: assemblyPlant || undefined,
      model: undefined // Resetear modelo cuando cambie la ensambladora
    }));
  }, []);

  const setModel = useCallback((model: string) => {
    setCurrentFilters(prev => ({
      ...prev,
      model: model || undefined
    }));
  }, []);

  const setMotorization = useCallback((motorization: string) => {
    setCurrentFilters(prev => ({
      ...prev,
      motorization: motorization || undefined
    }));
  }, []);

  const setPriceRange = useCallback((min: number, max: number) => {
    setCurrentFilters(prev => ({
      ...prev,
      priceMin: min > 0 ? min : undefined,
      priceMax: max < 1000 ? max : undefined
    }));
  }, []);

  const clearFilters = useCallback(() => {
    setCurrentFilters({});
  }, []);

  return {
    // Datos de filtros
    years,
    assemblyPlants,
    carModels,
    motorizations,
    
    // Estados de carga
    yearsLoading,
    assemblyPlantsLoading,
    carModelsLoading,
    motorizationsLoading,
    
    // Errores
    yearsError,
    assemblyPlantsError,
    carModelsError,
    motorizationsError,
    
    // Filtros actuales
    currentFilters,
    
    // Funciones para actualizar filtros
    setYear,
    setAssemblyPlant,
    setModel,
    setMotorization,
    setPriceRange,
    clearFilters,
    
    // Funciones auxiliares
    getModelsByAssemblyPlant,
  };
};
