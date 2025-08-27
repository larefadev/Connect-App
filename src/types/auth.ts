export interface AuthState {
    isAuthenticated: boolean;
    user: Auth | null;
}

export type AuthStatus = "authenticated" | "unauthenticated";

export interface Auth {
    id?: string;
    email?: string;
    username?: string;
}

// Tipo seguro para datos de registro (sin contraseña)
export interface SafeUserData {
    id?: string;
    email?: string;
    username?: string;
}

// Tipo para datos de entrada de registro (incluye contraseña temporalmente)
export interface RegisterInputData {
    email: string;
    password: string;
    username: string;
}

export interface VerificationData {
    email: string
    isVerified: boolean
}

// Tipo seguro para verificación (sin código)
export interface SafeVerificationData {
    email: string
    isVerified: boolean
}

export interface RegistrationState {
    // Estado del flujo
    currentStep: FlowStep
    isLoading: boolean
    error: string | null

    // Datos del usuario (SEGUROS - sin información sensible)
    userData: Partial<SafeUserData>
    verificationData: Partial<SafeVerificationData>
    planData: Partial<PlanData>
    storeData: Partial<StoreData>

    // Acciones del flujo
    setCurrentStep: (step: FlowStep) => void
    nextStep: () => void
    previousStep: () => void
    setLoading: (loading: boolean) => void
    setError: (error: string | null) => void

    // Acciones de datos
    setUserData: (data: Partial<Auth>) => void
    setVerificationData: (data: Partial<VerificationData>) => void
    setPlanData: (data: Partial<PlanData>) => void
    setStoreData: (data: Partial<StoreData>) => void

    // Acciones específicas del flujo
    handleSignIn: (email: string, password: string) => Promise<void>
    handleRegister: (userData: RegisterInputData) => Promise<void>
    handleVerifyCode: (code: string) => Promise<void>
    handleResendCode: () => Promise<void>
    handlePlanSelection: (plan: PlanData) => Promise<void>
    handleStoreSetup: (storeData: StoreData) => Promise<void>
    handleFinishSetup: () => Promise<void>
    clearRegistrationData: () => void

    // Utilidades
    canProceedToNext: () => boolean
    resetFlow: () => void
    getProgressPercentage: () => number
}

export type FlowStep =
    | 'sign-in'
    | 'register'
    | 'verify-code'
    | 'account-active'
    | 'plan-selection'
    | 'store-setup'
    | 'store-preview'
    | 'finish'


export const FLOW_STEPS: FlowStep[] = [
    'sign-in',
    'register',
    'verify-code',
    'account-active',
    'plan-selection',
    'store-setup',
    'store-preview'
]


export interface StoreData {
    storeName: string
    storeUrl: string
    phone: string
    corporateEmail: string // Solo email corporativo
    whatsappUrl: string
    storeType: 'physical' | 'local'
    // Campos de dirección
    street: string
    cityId: string
    zone: string
    rfcType: 'refa' | 'own'
    rfcNumber: string
    logo?: File | string
    banner?: File | string
}

export interface PlanData {
    planType: 'free' | 'pro'
    features: string[]
    price: number
}


