import { userRegisterStore } from '@/stores/registrationFlowStore';
import { useAuthStore } from '@/stores/authStore';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export const useRegistrationFlow = () => {
    const [isHydrated, setIsHydrated] = useState(false);
    const router = useRouter();
    
    const {
        currentStep,
        isLoading,
        error,
        userData,
        verificationData,
        planData,
        storeData,
        setCurrentStep,
        nextStep,
        previousStep,
        setLoading,
        setError,
        setUserData,
        setVerificationData,
        setPlanData,
        setStoreData,
        handleSignIn,
        handleRegister,
        handleVerifyCode,
        handleResendCode,
        handlePlanSelection,
        handleStoreSetup,
        handleFinishSetup,
        clearRegistrationData,
        canProceedToNext,
        getProgressPercentage,
        resetFlow
    } = userRegisterStore();

    const { login } = useAuthStore();

    // Usar un timeout muy corto para la hidratación
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsHydrated(true);
        }, 25); // Solo 25ms para no bloquear

        return () => clearTimeout(timer);
    }, []);

    // Función para completar el registro y hacer login
    const completeRegistration = async () => {
        try {
            setLoading(true);
            
            // Aquí podrías hacer llamadas adicionales a la API si es necesario
            // Por ejemplo, crear la tienda en la base de datos
            
            // Hacer login con los datos del usuario
            if (userData.email) {
                login({
                    id: Date.now().toString(), // Esto debería ser el ID real del usuario
                    email: userData.email,
                    username: userData.username || userData.email.split('@')[0]
                });
                
                // Redirigir al dashboard
                router.push('/dashboard');
            }
        } catch (error) {
            setError('Error al completar el registro');
        } finally {
            setLoading(false);
        }
    };

    return {
        isHydrated,
        currentStep,
        isLoading,
        error,
        userData,
        verificationData,
        planData,
        storeData,
        setCurrentStep,
        nextStep,
        previousStep,
        setLoading,
        setError,
        setUserData,
        setVerificationData,
        setPlanData,
        setStoreData,
        handleSignIn,
        handleRegister,
        handleVerifyCode,
        handleResendCode,
        handlePlanSelection,
        handleStoreSetup,
        handleFinishSetup,
        clearRegistrationData,
        canProceedToNext,
        getProgressPercentage,
        resetFlow,
        completeRegistration
    };
};
