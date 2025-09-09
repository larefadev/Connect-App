"use client"

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { CheckCircle, Mail, Clock, Shield } from 'lucide-react';
import ReactConfetti from "react-confetti";

interface AccountPendingSuccessProps {
    isLoading?: boolean;
    onClearData: () => void;
}

export const AccountPendingSuccess = ({ isLoading, onClearData }: AccountPendingSuccessProps) => {
    const router = useRouter();
    const [showConfetti, setShowConfetti] = useState(false);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    useEffect(() => {
        // Configurar dimensiones para el confetti
        setDimensions({ width: window.innerWidth, height: window.innerHeight });
        
        const handleResize = () => {
            setDimensions({ width: window.innerWidth, height: window.innerHeight });
        };
        
        window.addEventListener("resize", handleResize);
        
        // Mostrar confetti después de un pequeño delay
        const timer = setTimeout(() => {
            setShowConfetti(true);
        }, 300);

        return () => {
            clearTimeout(timer);
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    const handleBackToLogin = () => {
        // Limpiar todos los datos del flujo de registro antes de ir al login
        onClearData();
        router.push('/');
    };

    return (
        <div className="min-h-screen flex items-center justify-center py-8 px-4 bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
            {/* Confetti Animation */}
            {showConfetti && (
                <ReactConfetti
                    width={dimensions.width}
                    height={dimensions.height}
                    numberOfPieces={300}
                    recycle={true}
                />
            )}

            <div className="w-full max-w-2xl p-8 bg-white rounded-2xl shadow-xl border border-gray-100 text-center relative z-10">
                {/* Icono de éxito */}
                <div className="mb-8">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-12 h-12 text-green-600" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-3">
                        ¡Gracias por registrarte!
                    </h1>
                    <p className="text-lg text-gray-600 mb-6">
                        Tu cuenta ha sido creada exitosamente. Te contactaremos pronto para activar tu perfil.
                    </p>
                </div>

                {/* Información importante */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
                    <div className="flex items-center justify-center mb-4">
                        <Shield className="w-8 h-8 text-blue-600 mr-3" />
                        <h3 className="text-lg font-semibold text-blue-900">
                            Próximos pasos
                        </h3>
                    </div>
                    
                    <div className="space-y-3 text-left">
                        <div className="flex items-start">
                            <Clock className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="font-medium text-blue-900">Contacto del equipo</p>
                                <p className="text-sm text-blue-700">
                                    En 1-3 días hábiles alguien de nuestro equipo se pondrá en contacto para contarte más sobre Connect y sus beneficios.
                                </p>
                            </div>
                        </div>
                        
                        <div className="flex items-start">
                            <Mail className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="font-medium text-blue-900">Activación inmediata</p>
                                <p className="text-sm text-blue-700">
                                    Nuestros vendedores de campo pueden activar cuentas de forma inmediata en visita a taller o refaccionaria.
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
                        <a href="contacto@refacciones.com" className="text-red-600 hover:text-red-700 underline">
                            contacto@refacciones.com
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};
