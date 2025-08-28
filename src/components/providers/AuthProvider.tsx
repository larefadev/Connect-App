'use client';

import { useAuthStore } from '@/stores/authStore';
import { useEffect } from 'react';
import supabase from '@/lib/Supabase';
import { useRouter, usePathname } from 'next/navigation';
import { useToast } from '@/hooks';

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { login, logout } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const { error: showError } = useToast();
  // Función para validar el status de la cuenta
  const validateAccountStatus = async (userId: string, email: string) => {
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

  useEffect(() => {
    (async () => {
      try {
        const { data } = await supabase.auth.getSession();
        const session = data.session;
        if (session?.user) {
          // Solo validar status si NO estamos en el flujo de registro
          if (!pathname.includes('/register')) {
            const isActive = await validateAccountStatus(session.user.id, session.user.email!);
            
            if (!isActive) {
              showError('Cuenta inactiva detectada, expulsando usuario...');
              await forceLogout();
              return;
            }
          }

          login({
            id: session.user.id,
            email: session.user.email ?? undefined,
            username: session.user.user_metadata?.username ?? session.user.email?.split('@')[0],
          });
        }
      } catch (error) {
        showError('Error al verificar sesión');
      }
    })();
  }, [login, pathname]);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        // Solo validar status si NO estamos en el flujo de registro
        if (!pathname.includes('/register')) {
          const isActive = await validateAccountStatus(session.user.id, session.user.email!);
          
          if (!isActive) {
            showError('Cuenta inactiva detectada, expulsando usuario...');
            await forceLogout();
            return;
          }
        }

        login({
          id: session.user.id,
          email: session.user.email ?? undefined,
          username: session.user.user_metadata?.username ?? session.user.email?.split('@')[0],
        });
      } else {
        logout();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [login, logout, pathname]);

  return <>{children}</>;
}
