"use client"
import {useVerifyCode} from "@/hooks/Auth/useVerifyCode";

export const VerifyCode = () => {

    const {
        otp,
        handleChange,
        handleKeyDown,
        isResending,
        handleVerify,
        handleResendCode,
        isCodeComplete,
        hasError,
        inputRefs,
        isLoading,
        userData,
        verificationData,
        timer,
        error
    } = useVerifyCode();

    return (
        <div className="flex justify-center items-center h-screen bg-gray-50">
            <div className="rounded-xl p-8 shadow-lg w-full max-w-md bg-white text-center space-y-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Verify Code</h2>
                    <p className="text-sm text-gray-500">
                        Please enter the code we just sent to:<br />
                        <span className="font-semibold text-gray-900 text-base">
                            {userData.email || verificationData.email}
                        </span>
                    </p>
                </div>

                
                <div className="flex justify-center space-x-2">
                    {otp.map((digit, idx) => (
                        <input
                            key={idx}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleChange(e.target.value, idx)}
                            onKeyDown={(e) => handleKeyDown(e, idx)}
                            ref={(el) => {
                                if (el) inputRefs.current[idx] = el
                            }}
                            disabled={isLoading}
                            className={`w-12 h-12 text-center text-lg font-bold rounded-lg border-2 transition-all duration-200 ${
                                hasError
                                    ? "border-red-400 text-red-500 bg-red-50"
                                    : digit
                                        ? "border-green-400 text-green-600 bg-green-50"
                                        : "border-gray-300 focus:border-red-500"
                            } focus:outline-none focus:ring-2 focus:ring-red-200 disabled:bg-gray-100`}
                            autoComplete="one-time-code"
                        />
                    ))}
                </div>

                {/* Error/Timer/Resend */}
                <div className="min-h-[20px]">
                    {hasError ? (
                        <p className="text-red-500 text-sm font-medium">
                            {error || "The code you've entered is invalid"}
                        </p>
                    ) : timer > 0 ? (
                        <p className="text-gray-400 text-sm">
                            Resend code in <span className="font-medium">{timer}s</span>
                        </p>
                    ) : (
                        <button
                            onClick={handleResendCode}
                            disabled={isResending}
                            className="text-red-600 hover:text-red-700 font-medium text-sm underline disabled:opacity-50"
                        >
                            {isResending ? "Sending..." : "Send again code?"}
                        </button>
                    )}
                </div>

                <button
                    onClick={() => handleVerify()}
                    disabled={!isCodeComplete || isLoading}
                    className={`w-full font-semibold py-3 rounded-lg transition-all duration-200 ${
                        isCodeComplete && !isLoading
                            ? "bg-red-600 hover:bg-red-700 text-white shadow-md hover:shadow-lg"
                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                >
                    {isLoading ? (
                        <div className="flex items-center justify-center space-x-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            <span>Verifying...</span>
                        </div>
                    ) : (
                        "Verify"
                    )}
                </button>

                {/* Help Text */}
                <p className="text-xs text-gray-400 mt-4">
                    Having trouble? Check your spam folder or contact support
                </p>
            </div>
        </div>
    )
}
