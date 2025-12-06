"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

interface AuthRequiredModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    message?: string;
}

export function AuthRequiredModal({
    isOpen,
    onClose,
    title = "Authentication Required",
    message = "You need to log in or create an account to use this feature."
}: AuthRequiredModalProps) {
    const router = useRouter();
    const { login } = useAuth(); // We can use this for mock quick login

    if (!isOpen) return null;

    const handleLoginRedirect = () => {
        // For now, we'll try to use the mock quick login first as per instructions
        // But typically we would redirect: router.push("/auth/login");
        // The user said: "For this first version, it is enough if they just call login()/register() to simulate a successful auth."
        // But they also said "Navigate to /auth/login". 
        // I'll offer both options in the code comments but since we have a full login page, redirect is better UX.
        // However, the prompt says "For this first version, it is enough if they just call login() to simulate".
        // I will stick to the simpler simulation for the "quick" actions if desired, 
        // but the safer bet for a "web app" is the redirect. 
        // Let's implement the redirect as I already built the pages.
        router.push("/auth/login");
        onClose();
    };

    const handleRegisterRedirect = () => {
        router.push("/auth/register");
        onClose();
    };

    // Quick mock login for testing if preferred
    const handleMockLogin = async () => {
        await login({ email: "guest@example.com", password: "password" });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative bg-white dark:bg-dark-800 rounded-2xl shadow-xl max-w-md w-full p-6 text-center animate-in fade-in zoom-in-95 duration-200">
                <div className="mx-auto w-12 h-12 bg-accent-purple/10 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-accent-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                </div>

                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {title}
                </h3>

                <p className="text-gray-500 dark:text-gray-400 mb-6">
                    {message}
                </p>

                <div className="flex flex-col gap-3">
                    <button
                        onClick={handleLoginRedirect}
                        className="w-full py-2.5 px-4 bg-accent-purple hover:bg-accent-purple/90 text-white font-medium rounded-xl transition-colors"
                    >
                        Log In
                    </button>

                    <button
                        onClick={handleRegisterRedirect}
                        className="w-full py-2.5 px-4 bg-transparent border border-gray-200 dark:border-dark-600 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors"
                    >
                        Create Account
                    </button>

                    <button
                        onClick={onClose}
                        className="text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 mt-2"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}
