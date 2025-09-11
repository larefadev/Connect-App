"use client";
import { useLogin } from "@/hooks/Auth/useLogin";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuthStore } from "@/stores/authStore";

export const Login = () => {
  const { email, setEmail, password, setPassword, handleLogin, isLoading, error } = useLogin()
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()

  // Redirigir al dashboard si ya está autenticado
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await handleLogin();
    if (result) {
      router.push('/dashboard');
    }
  };

  const goToRegister = () => {
    router.push('/register');
  };

  return (
    <div className="w-full bg-white-100 max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
      <div className="flex flex-col items-center">
       {/* <Image src="/images/logo.svg" alt="Logo" width={250} height={160} /> */}
        <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 mt-4 sm:mt-6 text-center">
          Iniciar sesión
        </h2>
        <p className="text-xs sm:text-sm text-gray-500 mt-1 mb-4 sm:mb-6 text-center px-2">
         Bienvenido de nuevo! Inicia sesión para continuar.
        </p>
      </div>
      
      <form className="space-y-3 sm:space-y-4" onSubmit={onSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
        />
        {error && <p className="text-xs sm:text-sm text-red-600 text-center">{error}</p>}
        
        <div className="text-right text-xs sm:text-sm">
          <span className="text-red-500 hover:underline cursor-pointer">
            Olvidaste tu contraseña?
          </span>
        </div>
        
        <button
          type="submit"
          className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2.5 sm:py-3 rounded-lg mt-2 disabled:opacity-50 transition-colors text-sm sm:text-base"
          disabled={isLoading}
        >
          {isLoading ? 'Iniciando...' : 'iniciar sesión'}
        </button>
      </form>
      
      <div className="text-center mt-4 sm:mt-6 text-xs sm:text-sm text-gray-600 px-2">
        ¿No tienes una cuenta?{" "}
        <span 
          className="text-red-500 hover:underline cursor-pointer"
          onClick={goToRegister}
        >
          Regístrate aquí
        </span>
      </div>
    </div>
  );
};