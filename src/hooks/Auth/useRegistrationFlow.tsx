import { userRegisterStore } from '@/stores/registrationFlowStore';
import { useAuthStore } from '@/stores/authStore';
import { useEffect, useState } from 'react';

export const useRegistrationFlow = () => {
    const [isHydrated, setIsHydrated] = useState(false);
    
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
        canProceedToNext,
        getProgressPercentage,
        resetFlow
    } = userRegisterStore();

    const { isAuthenticated } = useAuthStore();

    // Usar un timeout muy corto para la hidratación
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsHydrated(true);
        }, 25); // Solo 25ms para no bloquear

        return () => clearTimeout(timer);
    }, []);

    // Si está autenticado y el flujo no está en 'finish', redirigir al dashboard
    useEffect(() => {
        if (isHydrated && isAuthenticated && currentStep !== 'finish') {
            // El usuario ya está autenticado, no necesita estar en el flujo de registro
            // Esto se maneja en el AuthProvider
        }
    }, [isHydrated, isAuthenticated, currentStep]);

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
        canProceedToNext,
        getProgressPercentage,
        resetFlow
    };
};
