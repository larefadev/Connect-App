import supabase from "@/lib/Supabase";
import { useState } from "react";
import { useAuthStore } from "@/stores/authStore";

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
            const { data, error: signInError } = await supabase.auth.signInWithPassword({
                email,
                password
            })
            if (signInError) {
                setError(signInError.message)
                return false
            }
            const user = data.user
            if (user) {
                login({
                    id: user.id,
                    email: user.email ?? undefined,
                    username: user.user_metadata?.username ?? user.email?.split("@")[0]
                })
            }
            return true
        } catch (e: any) {
            setError(e?.message ?? "Error inesperado al iniciar sesión")
            return false
        } finally {
            setIsLoading(false)
        }
    }

    const handleLogout = async () => {
        setIsLoading(true)
        try {
            await supabase.auth.signOut()
            logoutStore()
        } finally {
            setIsLoading(false)
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