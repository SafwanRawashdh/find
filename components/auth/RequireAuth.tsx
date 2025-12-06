"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { FullScreenLoader } from "@/components/loading";

interface RequireAuthProps {
    children: React.ReactNode;
    fallbackUrl?: string;
}

/**
 * Wrapper component that protects routes from unauthenticated access.
 * - Shows loading spinner while checking auth status
 * - Redirects to login if user is not authenticated
 * - Renders children if user is authenticated
 */
export function RequireAuth({
    children,
    fallbackUrl = "/auth/login",
}: RequireAuthProps) {
    const router = useRouter();
    const { status } = useAuth();

    React.useEffect(() => {
        if (status === "guest") {
            // Store the intended destination for redirect after login
            if (typeof window !== "undefined") {
                const currentPath = window.location.pathname;
                if (currentPath !== fallbackUrl) {
                    sessionStorage.setItem("auth_redirect", currentPath);
                }
            }
            router.replace(fallbackUrl);
        }
    }, [status, router, fallbackUrl]);

    // Show loading while checking auth
    if (status === "checking") {
        return <FullScreenLoader message="Checking authentication..." />;
    }

    // Don't render anything while redirecting
    if (status === "guest") {
        return <FullScreenLoader message="Redirecting to login..." />;
    }

    // User is authenticated
    return <>{children}</>;
}

export default RequireAuth;
