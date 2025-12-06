import type { Metadata } from "next";
import "./globals.css";
import SiteShell from "@/components/layout/SiteShell";

export const metadata: Metadata = {
  title: "FIND - Fast Integrated Network of Deals",
  description:
    "Compare prices across Amazon, eBay, and more. Track price history, set alerts, and never miss a deal.",
  keywords: [
    "price comparison",
    "deals",
    "amazon",
    "ebay",
    "shopping",
    "price tracker",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
