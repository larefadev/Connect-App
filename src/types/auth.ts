export interface AuthState {
    isAuthenticated: boolean;
    user: Auth | null;
}

export type AuthStatus = "authenticated" | "unauthenticated";

export interface Auth {
    id?: string;
    email?: string;
    password?: string;
    username?: string;
}

export interface VerificationData {
    email: string
    code: string
    isVerified: boolean
}

export interface RegistrationState {
    // Estado del flujo
    currentStep: FlowStep
    isLoading: boolean
    error: string | null

    // Datos del usuario
    userData: Partial<Auth>
    verificationData: Partial<VerificationData>
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
    handleRegister: (userData: Auth) => Promise<void>
    handleVerifyCode: (code: string) => Promise<void>
    handleResendCode: () => Promise<void>
    handlePlanSelection: (plan: PlanData) => Promise<void>
    handleStoreSetup: (storeData: StoreData) => Promise<void>

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
    businessEmail: string
    whatsappUrl: string
    storeType: 'physical' | 'local'
    physicalAddress: string
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


