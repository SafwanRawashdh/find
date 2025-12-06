"use client";

import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { FullScreenLoader } from "@/components/loading";
import { useAuth } from "@/context/AuthContext";

interface SiteShellProps {
  children: React.ReactNode;
}

// Inner component that uses auth context
function SiteShellInner({ children }: SiteShellProps) {
  const { status } = useAuth();

  // Show full-screen loader while checking auth
  if (status === "checking") {
    return <FullScreenLoader message="Initializing..." />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Skip link for accessibility */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <Header />

      <main id="main-content" role="main" className="flex-1">
        {children}
      </main>

      <Footer />
    </div>
  );
}

// Outer component that provides context
export default function SiteShell({ children }: SiteShellProps) {
  return (
    <AuthProvider>
      <CartProvider>
        <SiteShellInner>{children}</SiteShellInner>
      </CartProvider>
    </AuthProvider>
  );
}
