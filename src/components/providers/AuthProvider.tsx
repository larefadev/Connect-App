'use client';

import { useAuthStore } from '@/stores/authStore';
import { useEffect } from 'react';
import supabase from '@/lib/Supabase';
import { useRouter, usePathname } from 'next/navigation';

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { login, logout } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  // Función para validar el status de la cuenta
  const validateAccountStatus = async (userId: string, email: string) => {
    try {
      const { data: personData, error: personError } = await supabase
        .from('person')
        .select('status')
        .eq('email', email)
        .single();

      if (personError || !personData) {
        console.error('Error al validar status de cuenta:', personError);
        return false;
      }

      return personData.status;
    } catch (error) {
      console.error('Error al validar status de cuenta:', error);
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
              console.log('Cuenta inactiva detectada, expulsando usuario...');
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
        console.error('Error al verificar sesión:', error);
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
            console.log('Cuenta inactiva detectada, expulsando usuario...');
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
