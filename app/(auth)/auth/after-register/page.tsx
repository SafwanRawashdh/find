"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    Sparkles,
    Filter,
    Bell,
    Heart,
    BarChart3,
    ArrowRight,
    CheckCircle2,
} from "lucide-react";
import { Button, Card } from "@/components/ui";
import { useAuth } from "@/context/AuthContext";

const features = [
    {
        icon: Filter,
        title: "Advanced Filters",
        description:
            "Access marketplace-specific filters, condition selectors, and advanced sorting options.",
    },
    {
        icon: Bell,
        title: "Price Alerts",
        description:
            "Set up notifications when products drop to your target price across any marketplace.",
    },
    {
        icon: Heart,
        title: "Favorites List",
        description:
            "Save products you love and track them all in one convenient place.",
    },
    {
        icon: BarChart3,
        title: "Price History",
        description:
            "View 7-day price trends to make informed purchasing decisions.",
    },
];

export default function AfterRegisterPage() {
    const router = useRouter();
    const { user, status } = useAuth();

    // Redirect if not authenticated
    React.useEffect(() => {
        if (status === "guest") {
            router.replace("/auth/login");
        }
    }, [status, router]);

    if (status === "checking") {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-accent-purple/30 border-t-accent-purple rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-12">
            {/* Background decoration */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-purple/10 rounded-full blur-[150px]" />
            <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-accent-pink/10 rounded-full blur-[120px]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent-lime/5 rounded-full blur-[200px]" />

            <div className="relative w-full max-w-2xl">
                {/* Success Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-accent-lime/10 border border-accent-lime/20 mb-6">
                        <CheckCircle2 className="w-10 h-10 text-accent-lime" />
                    </div>

                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
                        Welcome to{" "}
                        <span className="gradient-text">FIND</span>
                        {user?.displayName && (
                            <span className="text-dark-300">, {user.displayName}!</span>
                        )}
                    </h1>

                    <p className="text-dark-400 text-lg max-w-md mx-auto">
                        Your account has been created successfully. Here&apos;s what you can
                        do now:
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid sm:grid-cols-2 gap-4 mb-8">
                    {features.map((feature, index) => (
                        <Card
                            key={index}
                            className="p-5 hover:border-accent-purple/30 transition-colors group"
                        >
                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-accent-purple/20 to-accent-pink/20 flex items-center justify-center group-hover:from-accent-purple/30 group-hover:to-accent-pink/30 transition-colors">
                                    <feature.icon className="w-5 h-5 text-accent-purple" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-white mb-1">
                                        {feature.title}
                                    </h3>
                                    <p className="text-sm text-dark-400">{feature.description}</p>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>

                {/* Sparkles Banner */}
                <Card className="p-6 mb-8 bg-gradient-to-r from-accent-purple/10 via-accent-pink/10 to-accent-lime/10 border-accent-purple/20">
                    <div className="flex items-center gap-4">
                        <Sparkles className="w-8 h-8 text-accent-purple flex-shrink-0" />
                        <div>
                            <h3 className="font-semibold text-white mb-1">
                                Premium Features Unlocked
                            </h3>
                            <p className="text-sm text-dark-300">
                                As a registered user, you now have access to all advanced
                                filters and features that help you find the best deals across
                                marketplaces.
                            </p>
                        </div>
                    </div>
                </Card>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                        variant="primary"
                        size="lg"
                        onClick={() => router.push("/dashboard")}
                        className="min-w-[200px]"
                    >
                        Go to Dashboard
                        <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>

                    <Link href="/">
                        <Button variant="ghost" size="lg" className="w-full sm:w-auto">
                            Explore as Guest First
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
