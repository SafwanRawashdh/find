import React from "react";

export default function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Public layout - no special wrapper needed, just pass through
    return <>{children}</>;
}
