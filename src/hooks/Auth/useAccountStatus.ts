import { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import supabase from '@/lib/Supabase';
import { useRouter } from 'next/navigation';
import { useToastContext } from '@/components/providers/ToastProvider';

export const useAccountStatus = () => {
  const [isValidating, setIsValidating] = useState(false);
  const { isAuthenticated, user, logout } = useAuthStore();
  const router = useRouter();
  const { error: showError } = useToastContext();
  // Función para validar el status de la cuenta
  const validateAccountStatus = async (email: string) => {
    try {
      const { data: personData, error: personError } = await supabase
        .from('person')
        .select('status')
        .eq('email', email)
        .single();

      if (personError || !personData) {
        showError('Error al validar status de cuenta');
        return false;
      }

      return personData.status;
    } catch (error) {
      showError('Error al validar status de cuenta');
      return false;
    }
  };

  // Función para expulsar usuario con cuenta inactiva
  const forceLogout = async () => {
    await supabase.auth.signOut();
    logout();
    router.push('/');
  };

  // Validar status de la cuenta cuando cambie la autenticación
  useEffect(() => {
    if (isAuthenticated && user?.email) {
      setIsValidating(true);
      
      const checkStatus = async () => {
        const isActive = await validateAccountStatus(user.email!);
        
        if (!isActive) {
          
          await forceLogout();
        }
        
        setIsValidating(false);
      };

      checkStatus();
    }
  }, [isAuthenticated, user?.email]);

  // Validar status periódicamente (cada 5 minutos)
  useEffect(() => {
    if (!isAuthenticated || !user?.email) return;

    const interval = setInterval(async () => {
      const isActive = await validateAccountStatus(user.email!);
      
      if (!isActive) {
        showError('Cuenta inactiva detectada en validación periódica, expulsando usuario...');
        await forceLogout();
      }
    }, 5 * 60 * 1000); // 5 minutos

    return () => clearInterval(interval);
  }, [isAuthenticated, user?.email]);

  return {
    isValidating,
    validateAccountStatus,
    forceLogout
  };
};
