import supabase from "@/lib/Supabase";
import { useState } from "react";
import { useAuthStore } from "@/stores/authStore";
import { PersonStatus } from "@/types/person";

export const useLogin = () => {
    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const login = useAuthStore((s) => s.login)
    const logoutStore = useAuthStore((s) => s.logout)

    const handleLogin = async () => {
        setIsLoading(true)
        setError(null)
        try {
            // 1. Primero validar que la cuenta esté activa en la tabla person usando el email
            const { data: personData, error: personError } = await supabase
                .from('person')
                .select('id, status, username, name, last_name, email')
                .eq('email', email)
                .single();

            if (personError) {
                setError("Cuenta no encontrada. Verifica tu email.");
                return false;
            }

            // 2. Validar que el status sea TRUE
            if (!personData.status) {
                setError("Tu cuenta está inactiva. Contacta al administrador para activarla.");
                return false;
            }

            // 3. Si el status es TRUE, proceder con la autenticación
            const { data, error: signInError } = await supabase.auth.signInWithPassword({
                email,
                password
            });

            if (signInError) {
                setError(signInError.message);
                return false;
            }

            const user = data.user;
            if (user) {
                login({
                    id: user.id,
                    email: user.email ?? undefined,
                    username: personData.username || user.user_metadata?.username || user.email?.split("@")[0]
                });
            }
            
            return true;
        } catch (e: unknown) {
            const errorMessage = e instanceof Error ? e.message : "Error inesperado al iniciar sesión";
            setError(errorMessage);
            return false;
        } finally {
            setIsLoading(false);
        }
    }

    const handleLogout = async () => {
        setIsLoading(true);
        try {
            await supabase.auth.signOut();
            logoutStore();
        } finally {
            setIsLoading(false);
        }
    }

    return {
        email,
        setEmail,
        password,
        setPassword,
        error,
        setError,
        isLoading,
        handleLogin,
        handleLogout,
    }
}