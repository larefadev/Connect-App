'use client';
import { useRegistrationFlow } from "@/hooks/Auth/useRegistrationFlow";
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Index } from "@/Modules/Auth/Components/Index";
import SetUp from "@/Modules/SetUp/Components/SetUp";
import { ConfettiSuccess } from "@/Modules/Congrats/Components/Confetti";
import { VerifyCode } from "@/Modules/Confirm/Components/VerifyCode";
import { ConfigProfile } from "@/Modules/ConfigProfile/Components/ConfigProfile";
import { AccountPendingSuccess } from "./AccountPendingSuccess";

export const RegistrationFlow = () => {
    const { currentStep, isHydrated, isLoading, clearRegistrationData } = useRegistrationFlow();

    // Solo redirigir al dashboard cuando el usuario explícitamente complete todo el flujo
    useEffect(() => {
        if (isHydrated && currentStep === 'finish') {
            // En lugar de redirigir automáticamente, mostrar un mensaje de éxito
            // y permitir que el usuario navegue manualmente
            console.log('Registro completado exitosamente');
        }
    }, [currentStep, isHydrated]);

    // Renderizar inmediatamente sin esperar hidratación
    const renderCurrentStep = () => {
        switch (currentStep) {
            case 'sign-in':
                return <Index />;
            case 'verify-code':
                return <VerifyCode />;
            case 'account-active':
                return <ConfettiSuccess />;
            case 'store-setup':
                return <SetUp />;
            case 'store-preview':
                return <ConfigProfile />;

            case 'finish':
                return (
                    <AccountPendingSuccess 
                        isLoading={isLoading}
                        onClearData={clearRegistrationData}
                    />
                );
            default:
                return <Index />; // Fallback al componente principal
        }
    };

    return <>{renderCurrentStep()}</>;
};