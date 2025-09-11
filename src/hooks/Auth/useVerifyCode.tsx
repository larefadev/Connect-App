import React, {useEffect, useRef, useState} from "react";
import {useRegistrationFlow} from "@/hooks/Auth/useRegistrationFlow";

export const useVerifyCode = () => {
    const [otp, setOtp] = useState(["", "", "", "", "", ""])
    const [localError, setLocalError] = useState(false)
    const [timer, setTimer] = useState(30)
    const [isResending, setIsResending] = useState(false)
    const inputRefs = useRef<HTMLInputElement[]>([])

    const {
        handleVerifyCode,
        handleResendCode: storeHandleResendCode,
        verificationData,
        userData,
        isLoading,
        error,
        setError,
        currentStep

    } = useRegistrationFlow()


    useEffect(() => {
        if (timer > 0) {
            const interval = setInterval(() => setTimer(t => t - 1), 1000)
            return () => clearInterval(interval)
        }
    }, [timer])

    useEffect(() => {
        inputRefs.current[0]?.focus()
    }, [])

    useEffect(() => {
        if (otp.some(digit => digit !== "")) {
            setLocalError(false)
            setError(null)
        }
    }, [otp, setError])

    const handleChange = (value: string, index: number) => {
        if (/^\d?$/.test(value)) {
            const newOtp = [...otp]
            newOtp[index] = value
            setOtp(newOtp)

            if (value && index < 5) {
                inputRefs.current[index + 1]?.focus()
            }
            if (value && newOtp.every(digit => digit !== "")) {
                setTimeout(() => handleVerify(newOtp.join("")), 100)
            }
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus()
        }
        if (e.key === "v" && (e.ctrlKey || e.metaKey)) {
            e.preventDefault()
            handlePaste()
        }
    }

    const handlePaste = () => {
        navigator.clipboard.readText().then(text => {
            const digits = text.replace(/\D/g, "").slice(0, 6).split("")
            if (digits.length === 6) {
                setOtp(digits)
                setTimeout(() => handleVerify(digits.join("")), 100)
            }
        }).catch((e) => {
            // Error al leer el portapapeles
        })
    }

    const handleVerify = async (code?: string) => {
        const verificationCode = code || otp.join("")

        if (verificationCode.length !== 6) {
            setLocalError(true)
            return
        }

        try {
            await handleVerifyCode(verificationCode)
            setLocalError(false)
        } catch (err) {
            setLocalError(true)
            inputRefs.current.forEach(input => {
                if (input) {
                    input.classList.add('animate-shake')
                    setTimeout(() => input.classList.remove('animate-shake'), 500)
                }
            })
        }
    }

    const handleResendCode = async () => {
        if (timer > 0) return

        setIsResending(true)
        try {
            await storeHandleResendCode()
            setOtp(["", "", "", "", "", ""])
            setTimer(30)
            setLocalError(false)
            setError(null)
            inputRefs.current[0]?.focus()
        } catch (err) {
            setError("Failed to resend code. Please try again.")
        } finally {
            setIsResending(false)
        }
    }

    const isCodeComplete = otp.every(digit => digit !== "")
    const hasError = localError || !!error
    const canResend = timer === 0 && !isResending

    return{
        otp,
        handleChange,
        handleKeyDown,
        handlePaste,
        handleVerify,
        handleResendCode,
        isCodeComplete,
        hasError,
        canResend,
        isLoading,
        userData,
        verificationData,
        currentStep,
        timer,
        inputRefs,
        isResending,
        error
    }
}