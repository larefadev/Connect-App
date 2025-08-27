'use client';

import { useAccountStatus } from '@/hooks/Auth/useAccountStatus';
import { useAuthStore } from '@/stores/authStore';
import { useEffect } from 'react';

interface AccountStatusGuardProps {
  children: React.ReactNode;
}

export function AccountStatusGuard({ children }: AccountStatusGuardProps) {
  const { isAuthenticated } = useAuthStore();
  const { isValidating } = useAccountStatus();

  // Mostrar loading mientras se valida el status
  if (isAuthenticated && isValidating) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Validando estado de cuenta...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
