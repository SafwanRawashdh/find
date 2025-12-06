import React from "react";
import Header from "./Header";
import Footer from "./Footer";

interface SiteShellProps {
  children: React.ReactNode;
}

export default function SiteShell({ children }: SiteShellProps) {
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
