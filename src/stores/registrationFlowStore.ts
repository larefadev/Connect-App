import {FlowStep, RegistrationState , FLOW_STEPS} from "@/types/auth";
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

            handleSignIn: async (email, _password) => {
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

                } catch (error) {
                    set({
                        error: 'Error al iniciar sesión',
                        isLoading: false
                    })
                }
            },

            handleRegister: async (userData) => {
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
                            auth_id : data.user?.id
                        })
                    }

                    if (signUpError) {
                        throw new Error(signUpError.message)
                    }

                   if(data.user){
                    set(state => ({
                        userData: { ...state.userData, ...userData },
                        verificationData: { email: userData.email },
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
                } catch (_error) {
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
                        currentStep: 'finish',
                        isLoading: false
                    }))
                    
                    const { userData } = get()
                    useAuthStore.getState().login({
                        id: Date.now().toString(),
                        email: userData.email || '',
                        username: userData.username || ''
                    })
                } catch (_error) {
                    set({
                        error: 'Error al configurar la tienda',
                        isLoading: false
                    })
                }
            },

            canProceedToNext: () => {
                const { currentStep, userData, verificationData, planData, storeData } = get()

                switch (currentStep) {
                    case 'sign-in':
                        return !!userData.email
                    case 'register':
                        return !!userData.email && !!userData.password
                    case 'verify-code':
                        return verificationData.isVerified === true
                    case 'account-active':
                        return true
                    case 'plan-selection':
                        return !!planData.planType
                    case 'store-setup':
                        return !!storeData.storeName && !!storeData.businessEmail
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
                userData: state.userData,
                verificationData: state.verificationData,
                planData: state.planData,
                storeData: state.storeData
            })
        }
    )
)