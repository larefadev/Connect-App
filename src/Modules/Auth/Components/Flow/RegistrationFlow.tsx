'use client';
import { useRegistrationFlow } from "@/hooks/Auth/useRegistrationFlow";
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Index } from "@/Modules/Auth/Components/Index";
import SetUp from "@/Modules/SetUp/Components/SetUp";
import { ConfettiSuccess } from "@/Modules/Congrats/Components/Confetti";
import { VerifyCode } from "@/Modules/Confirm/Components/VerifyCode";
import { ConfigProfile } from "@/Modules/ConfigProfile/Components/ConfigProfile";

export const RegistrationFlow = () => {
    const { currentStep, isHydrated } = useRegistrationFlow();
    const router = useRouter();

    useEffect(() => {
        if (isHydrated && currentStep === 'finish') {
            const timer = setTimeout(() => {
                router.push('/dashboard');
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [currentStep, router, isHydrated]);

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
                    <div className="flex items-center justify-center min-h-screen">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
                            <p className="text-gray-600">Redirigiendo al dashboard...</p>
                        </div>
                    </div>
                );
            default:
                return <Index />; // Fallback al componente principal
        }
    };

    if (currentStep === 'finish') {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Redirigiendo al dashboard...</p>
                </div>
            </div>
        );
    }

    return <>{renderCurrentStep()}</>;
};