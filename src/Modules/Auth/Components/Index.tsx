"use client"
import React from 'react'
import { Register } from './Register/Register'
import { Steppers } from "@/Modules/Auth/Components/Onboarding/Steppers";
import { useRouter } from 'next/navigation';

export const Index = () => {
  const router = useRouter();
  
  const goToLogin = () => {
    router.push('/');
  };
  
  return (
    <div className='flex justify-center items-center h-screen'>
      <div>
        <Steppers />
      </div>
      <div>
        <div className="w-full bg-white-100 max-w-md px-8 py-10">
          <div className="flex flex-col items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Crear cuenta</h2>
            <p className="text-sm text-gray-500 mt-1">
              Completa el formulario para registrarte
            </p>
          </div>
          
          <Register />
          
          <div className="text-center mt-6 text-sm text-gray-600">
            ¿Ya tienes una cuenta?{" "}
            <span 
              className="text-red-500 hover:underline cursor-pointer"
              onClick={goToLogin}
            >
              Inicia sesión aquí
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}