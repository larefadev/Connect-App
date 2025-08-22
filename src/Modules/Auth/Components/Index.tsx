"use client"
import React, { useState } from 'react'
import { Register } from './Register/Register'
import { Login } from './Login/Login'
import {Steppers} from "@/Modules/Auth/Components/Onboarding/Steppers";

export const Index = () => {
  const [changeForm, setChangeForm] = useState<boolean>(false)
  
  return (
    <div className='flex justify-center items-center h-screen'>
      <div>
        <Steppers />
      </div>
      <div>
        {changeForm ? (
          <Register setChange={setChangeForm} />
        ) : (
          <Login setChange={setChangeForm} />
        )}
      </div>
    </div>
  )
}