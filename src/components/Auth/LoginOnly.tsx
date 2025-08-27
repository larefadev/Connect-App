"use client"
import React from 'react'
import { Login } from '@/Modules/Auth/Components/Login/Login'
import { Steppers } from "@/Modules/Auth/Components/Onboarding/Steppers";

export const LoginOnly = () => {
  return (
    <div className='flex justify-center items-center h-screen'>
      <div>
        <Steppers />
      </div>
      <div>
        <Login />
      </div>
    </div>
  )
}
