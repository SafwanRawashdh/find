import React from "react";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Auth pages layout - minimal layout without header/footer clutter
    return <>{children}</>;
}
