"use client"
import React from 'react'
import { Login } from '@/Modules/Auth/Components/Login/Login'
import { Steppers } from "@/Modules/Auth/Components/Onboarding/Steppers";

export const LoginOnly = () => {
  return (
    <div className='min-h-screen flex flex-col lg:flex-row justify-center items-center p-4 sm:p-6 lg:p-8'>
      {/* Steppers - Solo visible en desktop */}
      <div className="hidden lg:block lg:flex-1 lg:max-w-md lg:mr-8">
        <Steppers />
      </div>
      
      {/* Formulario de login */}
      <div className="w-full max-w-md mx-auto lg:mx-0">
        <div className="bg-white-100 rounded-lg shadow-sm">
          <Login />
        </div>
      </div>
    </div>
  )
}
