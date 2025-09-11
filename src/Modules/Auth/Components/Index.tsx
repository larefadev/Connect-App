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
    <div className='min-h-screen flex flex-col lg:flex-row justify-center items-center p-4 sm:p-6 lg:p-8'>
      {/* Steppers - Solo visible en desktop */}
      <div className="hidden lg:block lg:flex-1 lg:max-w-md lg:mr-8">
        <Steppers />
      </div>
      
      {/* Formulario de registro */}
      <div className="w-full max-w-md mx-auto lg:mx-0">
        <div className="w-full bg-white-100 px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10 rounded-lg shadow-sm">
          <div className="flex flex-col items-center mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 text-center">
              Crear cuenta
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1 text-center px-2">
              Completa el formulario para registrarte
            </p>
          </div>
          
          <Register />
          
          <div className="text-center mt-4 sm:mt-6 text-xs sm:text-sm text-gray-600 px-2">
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