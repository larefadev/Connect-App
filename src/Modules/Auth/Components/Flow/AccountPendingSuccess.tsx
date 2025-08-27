"use client"

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { CheckCircle, Mail, Clock, Shield } from 'lucide-react';

interface AccountPendingSuccessProps {
    isLoading?: boolean;
    onClearData: () => void;
}

export const AccountPendingSuccess = ({ isLoading, onClearData }: AccountPendingSuccessProps) => {
    const router = useRouter();
    const [showConfetti, setShowConfetti] = useState(false);

    useEffect(() => {
        // Mostrar confetti después de un pequeño delay
        const timer = setTimeout(() => {
            setShowConfetti(true);
        }, 300);

        return () => clearTimeout(timer);
    }, []);

    const handleBackToLogin = () => {
        // Limpiar todos los datos del flujo de registro antes de ir al login
        onClearData();
        router.push('/');
    };

    return (
        <div className="min-h-screen flex items-center justify-center py-8 px-4 bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
            {/* Confetti Background */}
            {showConfetti && (
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-10 left-1/4 w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                    <div className="absolute top-20 left-1/3 w-3 h-3 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="absolute top-15 left-1/2 w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    <div className="absolute top-25 left-2/3 w-3 h-3 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.6s' }}></div>
                    <div className="absolute top-30 left-3/4 w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.8s' }}></div>
                    <div className="absolute top-40 left-1/5 w-3 h-3 bg-red-400 rounded-full animate-bounce" style={{ animationDelay: '1s' }}></div>
                    <div className="absolute top-50 left-2/5 w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '1.2s' }}></div>
                    <div className="absolute top-60 left-3/5 w-3 h-3 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '1.4s' }}></div>
                </div>
            )}

            <div className="w-full max-w-2xl p-8 bg-white rounded-2xl shadow-xl border border-gray-100 text-center relative z-10">
                {/* Icono de éxito */}
                <div className="mb-8">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-12 h-12 text-green-600" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-3">
                        ¡Registro Completado!
                    </h1>
                    <p className="text-lg text-gray-600 mb-6">
                        Tu cuenta ha sido creada exitosamente y está pendiente de activación.
                    </p>
                </div>

                {/* Información importante */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
                    <div className="flex items-center justify-center mb-4">
                        <Shield className="w-8 h-8 text-blue-600 mr-3" />
                        <h3 className="text-lg font-semibold text-blue-900">
                            Estado de tu cuenta
                        </h3>
                    </div>
                    
                    <div className="space-y-3 text-left">
                        <div className="flex items-start">
                            <Clock className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="font-medium text-blue-900">Cuenta Inactiva</p>
                                <p className="text-sm text-blue-700">
                                    Tu cuenta estará inactiva hasta que la administración de Connect active tu perfil.
                                </p>
                            </div>
                        </div>
                        
                        <div className="flex items-start">
                            <Mail className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="font-medium text-blue-900">Notificación por Email</p>
                                <p className="text-sm text-blue-700">
                                    Recibirás un email cuando tu cuenta sea activada y puedas acceder a tu dashboard.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Botón de acción */}
                <div className="space-y-4">
                    <button
                        onClick={handleBackToLogin}
                        disabled={isLoading}
                        className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                        {isLoading ? (
                            <div className="flex items-center justify-center">
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                Regresando...
                            </div>
                        ) : (
                            'Volver al Login'
                        )}
                    </button>
                </div>

                {/* Información adicional */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                    <p className="text-sm text-gray-500">
                        ¿Tienes preguntas? Contacta a nuestro equipo de soporte en{' '}
                        <a href="mailto:soporte@connect.com" className="text-red-600 hover:text-red-700 underline">
                            soporte@connect.com
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};
