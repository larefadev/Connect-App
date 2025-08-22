'use client';

import { useAuthStore } from '@/stores/authStore';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

interface RouteGuardProps {
  children: React.ReactNode;
}

export function RouteGuard({ children }: RouteGuardProps) {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [isHydrated, setIsHydrated] = useState(false);

  // Usar un timeout muy corto para la hidratación
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsHydrated(true);
    }, 50);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isHydrated) return; // No ejecutar hasta que se hidrate



    // Rutas del dashboard que requieren autenticación
    const dashboardRoutes = [
      '/dashboard',
      '/orders',
      '/catalog',
      '/cart',
      '/invoice',
      '/quotation',
      '/wallet',
      '/profile',
      '/settings',
      '/integration',
      '/after-sales'
    ];

    // Rutas de la tienda que requieren autenticación (excluyendo /store/public/*)
    const storeRoutes = ['/store'];

    // Verificar si la ruta actual requiere autenticación
    const requiresAuth = dashboardRoutes.some(route => pathname.startsWith(route)) ||
                       (storeRoutes.some(route => pathname.startsWith(route)) && !pathname.startsWith('/store/public'));

    // Si la ruta requiere autenticación y no está autenticado, redirigir al login
    if (requiresAuth && !isAuthenticated) {
      router.push('/');
      return;
    }
  }, [isHydrated, isAuthenticated, pathname, router]);



  // Mostrar un loading mientras se hidrata
  if (!isHydrated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando acceso...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
