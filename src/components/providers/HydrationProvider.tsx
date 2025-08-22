'use client';

import { useEffect, useState } from 'react';

interface HydrationProviderProps {
  children: React.ReactNode;
}

export function HydrationProvider({ children }: HydrationProviderProps) {
  useEffect(() => {
    // Permitir que los stores se hidraten
    const timer = setTimeout(() => {
      // La hidratación se maneja en cada componente individual
    }, 50);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  // Mostrar children inmediatamente para no bloquear
  return <>{children}</>;
}
