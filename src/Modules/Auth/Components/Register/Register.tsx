import Image from "next/image"
import {useRegistrationFlow} from "@/hooks/Auth/useRegistrationFlow";
import {useState} from "react";

type Props = {
  setChange: (val: boolean) => void;
}

export const Register = (props: Props) => {
  const { setChange } = props
  const { handleRegister} = useRegistrationFlow();
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: ''
  })

  const handleSubmit = async (e: any ) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      alert('Las contraseñas no coinciden')
      return
    }
    await handleRegister({
      email: formData.email,
      username: formData.username,
      password: formData.password,
    })

    
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }
  
  return (
    <div className="w-full max-w-md px-8 py-10">
      <div className="flex flex-col items-center">
        <Image src="/images/logo.png" alt="Logo" width={250} height={160} />
        <h2 className="text-xl font-semibold text-gray-900 mt-6">Sign up</h2>
        <p className="text-sm text-gray-500 mt-1 mb-6">
          Sign up now to create your new account.
        </p>
      </div>
      
      <form className="space-y-4" >
        <input
          type="text"
          placeholder="Username"
          onChange={(e=> handleInputChange('username', e.target.value))}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
        />
        <input
          type="email"
          onChange={(e=> handleInputChange('email', e.target.value))}
          placeholder="Email"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
        />
        <input
          type="password"
          placeholder="Password"
          onChange={(e=> handleInputChange('password', e.target.value))}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
        />
        <input
          type="password"
          placeholder="Confirm Password"
          onChange={ (e) => handleInputChange('confirmPassword', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
        />
        
        <div className="flex items-center text-sm mt-2">
          <input type="checkbox" id="terms" className="mr-2" />
          <label htmlFor="terms">
            Agree with <span className="text-red-500 underline">Terms & Conditions</span>
          </label>
        </div>
        
        <button
          type="submit"
          className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 rounded-lg mt-4"
          onClick={async (e) => {
            e.preventDefault();
            await handleSubmit(e)
          }}
        >
          Registrarme
        </button>
      </form>
      
      <div className="text-center mt-6 text-sm text-gray-600">
        Already have an account?{" "}
        <span 
          className="text-red-500 hover:underline cursor-pointer"
          onClick={() => setChange(false)}
        >
          Iniciar sesión
        </span>
      </div>
      
      <div className="mt-6 flex justify-center space-x-4">
        <button className="border rounded-full p-2">
          <Image src="https://simpleicons.org/icons/google.svg" alt="Google" width={24} height={24} />
        </button>
        <button className="border rounded-full p-2">
          <Image src="https://simpleicons.org/icons/apple.svg" alt="Apple" width={24} height={24} />
        </button>
        <button className="border rounded-full p-2">
          <Image src="https://simpleicons.org/icons/facebook.svg" alt="Facebook" width={24} height={24} />
        </button>
      </div>
    </div>
  )
}