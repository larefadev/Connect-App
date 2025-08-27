"use client"
import ReactConfetti from "react-confetti"
import { useEffect, useState } from "react"
import {useRegistrationFlow} from "@/hooks/Auth/useRegistrationFlow";

export const ConfettiSuccess = () => {
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
    const {userData , setCurrentStep} = useRegistrationFlow()

    useEffect(() => {
        setDimensions({ width: window.innerWidth, height: window.innerHeight })
        const handleResize = () => {
            setDimensions({ width: window.innerWidth, height: window.innerHeight })
        }
        window.addEventListener("resize", handleResize)
        return () => window.removeEventListener("resize", handleResize)
    }, [])

    return (
        <div className="relative w-full h-screen flex flex-col justify-center items-center bg-white overflow-hidden rounded-xl">
            <ReactConfetti
                width={dimensions.width}
                height={dimensions.height}
                numberOfPieces={300}
                recycle={true}
            />

            <div className="relative z-10 bg-white rounded-xl p-6 shadow-lg max-w-md w-full text-center">
                <div className="flex justify-center mb-6">
                    <div className="relative">
                        <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-10 w-10 text-white"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={3}
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>

                    </div>
                </div>

                <h2 className="text-xl font-semibold text-gray-900">
                    ¡Tu cuenta está activa, {userData.username}! 🎉
                </h2>
                <p className="text-gray-500 text-sm mt-2">
                    Ahora estás listo para configurar tu tienda y comenzar a vender.
                </p>

                <button
                    className="mt-6 bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-lg font-medium"
                    onClick={() => {
                        setCurrentStep("store-setup");
                    }}
                >
                    Continuar
                </button>
            </div>
        </div>
    )
}
