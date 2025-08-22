"use client";
import Image from "next/image";
import { useLogin } from "@/hooks/Auth/useLogin";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuthStore } from "@/stores/authStore";

type Props = {
  setChange: (val: boolean) => void;
}

export const Login = (props: Props) => {
  const { setChange } = props
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



  return (
    <div className="w-full bg-white-100 max-w-md px-8 py-10">
      <div className="flex flex-col items-center">
       {/* <Image src="/images/logo.svg" alt="Logo" width={250} height={160} /> */}
        <h2 className="text-xl font-semibold text-gray-900 mt-6">Iniciar sesión</h2>
        <p className="text-sm text-gray-500 mt-1 mb-6">
         Bienvenido de nuevo! Inicia sesión para continuar.
        </p>
      </div>
      
      <form className="space-y-4" onSubmit={onSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        
        <div className="text-right text-sm">
          <span className="text-red-500 hover:underline cursor-pointer">
            Olvidaste tu contraseña?
          </span>
        </div>
        
        <button
          type="submit"
          className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 rounded-lg mt-2 disabled:opacity-50"
          disabled={isLoading}
        >
          {isLoading ? 'Iniciando...' : 'iniciar sesión'}
        </button>
      </form>
      
      <div className="text-center mt-6 text-sm text-gray-600">
        ¿No tienes una cuenta?{" "}
        <span 
          className="text-red-500 hover:underline cursor-pointer"
          onClick={() => setChange(true)}
        >
          Regístrate aquí
        </span>
      </div>
    </div>
  );
};