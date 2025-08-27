"use client"

import { useCities } from "@/hooks/Cities";
import { MapPin } from "lucide-react";

interface CitySelectorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

export const CitySelector = ({
  value,
  onChange,
  placeholder = "Selecciona una ciudad",
  label = "Ciudad",
  required = false,
  disabled = false,
  className = ""
}: CitySelectorProps) => {
  const { loading: citiesLoading, getCityOptions } = useCities();

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
          <MapPin className="w-4 h-4 text-red-500" />
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      {citiesLoading ? (
        <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-500">
          Cargando ciudades...
        </div>
      ) : (
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 ${
            disabled 
              ? 'bg-gray-100 text-gray-500 cursor-not-allowed' 
              : 'bg-white hover:border-gray-400 focus:border-red-500'
          }`}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {getCityOptions().map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      )}
    </div>
  );
};
