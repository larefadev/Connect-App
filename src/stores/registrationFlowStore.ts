import {FlowStep, RegistrationState , FLOW_STEPS, RegisterInputData} from "@/types/auth";
import { persist } from 'zustand/middleware'
import {create} from "zustand"
import { useAuthStore } from './authStore';
import supabase from "@/lib/Supabase";

export const userRegisterStore = create<RegistrationState>()(
    persist(
        (set , get)=>({
            currentStep: 'sign-in',
            isLoading: false,
            error: null,
            userData: {},
            verificationData: {},
            planData: {},
            storeData: {},
            setCurrentStep: (step: FlowStep) => set({currentStep: step}),

            nextStep: () => {
                const { currentStep} = get()
                const currentIndex = FLOW_STEPS.indexOf(currentStep)
                if (currentIndex < FLOW_STEPS.length - 1) {
                    set({ currentStep: FLOW_STEPS[currentIndex + 1] })
                }
            },

            previousStep: () => {
                const { currentStep} = get()
                const currentIndex = FLOW_STEPS.indexOf(currentStep)
                if (currentIndex > 0) {
                    set({ currentStep: FLOW_STEPS[currentIndex - 1] })
                }
            },


            setLoading: (loading : boolean) => set({ isLoading: loading }),
            setError: (error: string | null) => set({ error }),

            setUserData: (data) => set(state => ({
                userData: { ...state.userData, ...data }
            })),

            setVerificationData: (data) => set(state => ({
                verificationData: { ...state.verificationData, ...data }
            })),

            setPlanData: (data) => set(state => ({
                planData: { ...state.planData, ...data }
            })),

            setStoreData: (data) => set(state => ({
                storeData: { ...state.storeData, ...data }
            })),

            handleSignIn: async (email) => {
                set({ isLoading: true, error: null })
                try {
                    useAuthStore.getState().login({
                        id: Date.now().toString(),
                        email,
                        username: email.split('@')[0]
                    })
                    
                    set(state => ({
                        userData: { ...state.userData, email },
                        currentStep: 'finish',
                        isLoading: false
                    }))

                } catch {
                    set({
                        error: 'Error al iniciar sesión',
                        isLoading: false
                    })
                }
            },

            handleRegister: async (userData: RegisterInputData) => {
                set({ isLoading: true, error: null })
                try {

                    const { error: signUpError, data } = await supabase.auth.signUp({
                        email: userData.email!,
                        password: userData.password!
                    })

                    const code = await supabase.auth.signInWithOtp({
                        email: userData.email!
                    })

                    if(data && code){
                        await supabase.from('person').insert({
                            username : userData.username!,
                            name : null,
                            last_name : null,
                            email:userData.email!,
                            auth_id : data.user?.id
                        })
                    }

                    if (signUpError) {
                        throw new Error(signUpError.message)
                    }

                   if(data.user){
                    // Solo guardar datos SEGUROS (sin contraseña)
                    const safeUserData = {
                        email: userData.email,
                        username: userData.username
                    };
                    
                    set(state => ({
                        userData: { ...state.userData, ...safeUserData },
                        verificationData: { email: userData.email, isVerified: false },
                        currentStep: 'verify-code',
                        isLoading: false
                    }))
                   }

                } catch (error) {
                    set({
                        error: error instanceof Error ? error.message : 'Error al enviar código de verificación',
                        isLoading: false
                    })
                }
            },

            handleVerifyCode: async (code) => {
                set({ isLoading: true, error: null })
                try {
                    const { verificationData } = get()
                    
                    if (!verificationData.email) {
                        throw new Error('No se encontró el email para verificar')
                    }

                    const { data, error: verifyError } = await supabase.auth.verifyOtp({
                        email: verificationData.email,
                        token: code,
                        type: 'email'
                    })

                    if (verifyError) {
                        throw new Error(verifyError.message)
                    }

                    if (data.user) {
                        set({ currentStep: 'account-active' })
                    }
                    
                } catch (error) {
                    set({
                        error: error instanceof Error ? error.message : 'Código de verificación inválido',
                        isLoading: false
                    })
                }
            },

            handleResendCode: async () => {
                set({ isLoading: true, error: null })
                try {
                    const { verificationData } = get()
                    
                    if (!verificationData.email) {
                        throw new Error('No se encontró el email para reenviar el código')
                    }

                    const { error } = await supabase.auth.signInWithOtp({
                        email: verificationData.email,
                    })

                    if (error) {
                        throw new Error(error.message)
                    }

                    set({ isLoading: false })
                } catch (error) {
                    set({
                        error: error instanceof Error ? error.message : 'Error al reenviar el código',
                        isLoading: false
                    })
                }
            },

            handlePlanSelection: async (plan) => {
                set({ isLoading: true, error: null })
                try {

                    await new Promise(resolve => setTimeout(resolve, 500))

                    set(state => ({
                        planData: { ...state.planData, ...plan },
                        currentStep: 'store-setup',
                        isLoading: false
                    }))
                } catch {
                    set({
                        error: 'Error al seleccionar plan',
                        isLoading: false
                    })
                }
            },

            handleStoreSetup: async (storeData) => {
                set({ isLoading: true, error: null })
                try {
                    await new Promise(resolve => setTimeout(resolve, 1000))
                    
                    set(state => ({
                        storeData: { ...state.storeData, ...storeData },
                        currentStep: 'store-preview',
                        isLoading: false
                    }))
                    
                    console.log('Configuración de tienda completada, yendo a preview');
                } catch {
                    set({
                        error: 'Error al configurar la tienda',
                        isLoading: false
                    })
                }
            },

            handleFinishSetup: async () => {
                set({ isLoading: true, error: null })
                try {
                    await new Promise(resolve => setTimeout(resolve, 500))
                    
                    set(() => ({
                        currentStep: 'finish',
                        isLoading: false
                    }))
                    
                    console.log('Setup finalizado, yendo a pantalla de éxito');
                } catch {
                    set({
                        error: 'Error al finalizar setup',
                        isLoading: false
                    })
                }
            },

            // Función para limpiar todos los datos del flujo de registro
            clearRegistrationData: () => {
                set({
                    userData: {},
                    verificationData: {},
                    planData: {},
                    storeData: {},
                    error: null,
                    isLoading: false
                });
                console.log('Datos del flujo de registro limpiados exitosamente');
            },

            canProceedToNext: () => {
                const { currentStep, userData, verificationData, planData, storeData } = get()

                switch (currentStep) {
                    case 'sign-in':
                        return !!userData.email
                    case 'register':
                        return !!userData.email && !!userData.username
                    case 'verify-code':
                        return verificationData.isVerified === true
                    case 'account-active':
                        return true
                    case 'plan-selection':
                        return !!planData.planType
                    case 'store-setup':
                        return !!storeData.storeName && !!storeData.corporateEmail
                    case 'store-preview':
                        return true
                    default:
                        return false
                }
            },

            getProgressPercentage: () => {
                const { currentStep } = get()
                const currentIndex = FLOW_STEPS.indexOf(currentStep)
                return Math.round(((currentIndex + 1) / FLOW_STEPS.length) * 100)
            },
            resetFlow: () => set({
                currentStep: 'sign-in',
                isLoading: false,
                error: null,
                userData: {},
                verificationData: {},
                planData: {},
                storeData: {}
            })
        }),
        {
            name: 'registration-flow-storage',
            partialize: (state) => ({
                currentStep: state.currentStep,
                // Solo persistir datos SEGUROS
                userData: {
                    email: state.userData.email,
                    username: state.userData.username
                },
                verificationData: {
                    email: state.verificationData.email,
                    isVerified: state.verificationData.isVerified
                },
                planData: state.planData,
                storeData: state.storeData
            })
        }
    )
)