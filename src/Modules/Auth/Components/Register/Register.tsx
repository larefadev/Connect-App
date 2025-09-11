import Image from "next/image"
import {useRegistrationFlow} from "@/hooks/Auth/useRegistrationFlow";
import {useState} from "react";
import { useToastContext } from "@/components/providers/ToastProvider";

export const Register = () => {
  const { handleRegister, isLoading } = useRegistrationFlow();
  const { error: showError, success: showSuccess } = useToastContext();
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: ''
  })

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Validaciones del formulario
    if (!formData.email || !formData.username || !formData.password || !formData.confirmPassword) {
      showError('Por favor, completa todos los campos del formulario.', {
        title: 'Campos Requeridos',
        duration: 5000
      });
      return;
    }

    if (formData.password.length < 6) {
      showError('La contraseña debe tener al menos 6 caracteres.', {
        title: 'Contraseña Débil',
        duration: 5000
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      showError('Las contraseñas no coinciden. Por favor, verifica que ambas contraseñas sean iguales.', {
        title: 'Error de Validación',
        duration: 5000
      });
      return;
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      showError('Por favor, ingresa un email válido.', {
        title: 'Email Inválido',
        duration: 5000
      });
      return;
    }

    try {
      await handleRegister({
        email: formData.email,
        username: formData.username,
        password: formData.password,
      });
      
      showSuccess('Registro iniciado exitosamente. Revisa tu email para verificar tu cuenta.', {
        title: 'Registro Exitoso',
        duration: 7000
      });
    } catch (error) {
      showError('Error al registrar la cuenta. Por favor, intenta nuevamente.', {
        title: 'Error de Registro',
        duration: 5000
      });
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }
  
  return (
    <div className="w-full max-w-md mx-auto">
      <form className="space-y-3 sm:space-y-4" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nombre de usuario"
          value={formData.username}
          onChange={(e=> handleInputChange('username', e.target.value))}
          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
          disabled={isLoading}
        />
        <input
          type="email"
          value={formData.email}
          onChange={(e=> handleInputChange('email', e.target.value))}
          placeholder="Correo electrónico"
          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
          disabled={isLoading}
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={formData.password}
          onChange={(e=> handleInputChange('password', e.target.value))}
          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
          disabled={isLoading}
        />
        <input
          type="password"
          placeholder="Confirmar contraseña"
          value={formData.confirmPassword}
          onChange={ (e) => handleInputChange('confirmPassword', e.target.value)}
          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
          disabled={isLoading}
        />
        
        <div className="flex items-start text-xs sm:text-sm mt-2 space-x-2">
          <input type="checkbox" id="terms" className="mt-1 flex-shrink-0" required />
          <label htmlFor="terms" className="leading-relaxed">
            Acepto los <span className="text-red-500 underline">Términos y Condiciones</span>
          </label>
        </div>
        
        <button
          type="submit"
          className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2.5 sm:py-3 rounded-lg mt-3 sm:mt-4 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm sm:text-base"
          disabled={isLoading}
        >
          {isLoading ? 'Registrando...' : 'Registrarme'}
        </button>
        
      </form>
      
     {/* <div className="mt-6 flex justify-center space-x-4">
        <button className="border rounded-full p-2">
          <Image src="https://simpleicons.org/icons/google.svg" alt="Google" width={24} height={24} />
        </button>
        <button className="border rounded-full p-2">
          <Image src="https://simpleicons.org/icons/apple.svg" alt="Apple" width={24} height={24} />
        </button>
        <button className="border rounded-full p-2">
          <Image src="https://simpleicons.org/icons/facebook.svg" alt="Facebook" width={24} height={24} />
        </button>
      </div>*/}
    </div>
  )
}