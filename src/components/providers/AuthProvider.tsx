'use client';

import { useAuthStore } from '@/stores/authStore';
import { useEffect } from 'react';
import supabase from '@/lib/Supabase';

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { login, logout } = useAuthStore();

  useEffect(() => {
    (async () => {
      try {
        const { data } = await supabase.auth.getSession();
        const session = data.session;
        if (session?.user) {
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
  }, [login]);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
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
  }, [login, logout]);

  return <>{children}</>;
}
