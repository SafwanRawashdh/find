"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  Bell,
  Shield,
  CreditCard,
  LogOut,
  ChevronRight,
  Save,
  Camera,
} from "lucide-react";
import { Button, Card, Input } from "@/components/ui";
import { cn } from "@/lib/utils";

// Mock user data
const mockUser = {
  id: "1",
  email: "demo@example.com",
  displayName: "Demo User",
  avatarUrl: null,
  createdAt: "2024-01-15",
};

type Tab = "profile" | "notifications" | "security" | "billing";

export default function AccountPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const [displayName, setDisplayName] = useState(mockUser.displayName);
  const [email, setEmail] = useState(mockUser.email);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleLogout = () => {
    router.push("/");
  };

  const tabs = [
    { id: "profile" as Tab, label: "Profile", icon: User },
    { id: "notifications" as Tab, label: "Notifications", icon: Bell },
    { id: "security" as Tab, label: "Security", icon: Shield },
    { id: "billing" as Tab, label: "Billing", icon: CreditCard },
  ];

  return (
    <div className="relative min-h-screen">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent-purple/5 rounded-full blur-[150px]" />
      <div className="absolute top-40 right-1/4 w-72 h-72 bg-accent-cyan/5 rounded-full blur-[120px]" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <User className="w-8 h-8 text-accent-purple" />
            Account Settings
          </h1>
          <p className="text-dark-400 mt-1">
            Manage your account preferences and settings
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64 shrink-0">
            <Card className="p-2">
              <nav className="space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={cn(
                        "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left",
                        activeTab === tab.id
                          ? "bg-accent-purple/20 text-white"
                          : "text-dark-300 hover:bg-dark-700/50 hover:text-white"
                      )}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{tab.label}</span>
                      <ChevronRight className={cn(
                        "w-4 h-4 ml-auto transition-transform",
                        activeTab === tab.id && "rotate-90"
                      )} />
                    </button>
                  );
                })}
                <hr className="border-dark-700 my-2" />
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Sign Out</span>
                </button>
              </nav>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeTab === "profile" && (
              <Card className="p-6">
                <h2 className="text-xl font-semibold text-white mb-6">Profile Information</h2>
                
                {/* Avatar */}
                <div className="flex items-center gap-6 mb-8">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-accent-purple to-accent-pink flex items-center justify-center text-white text-3xl font-bold">
                      {displayName.charAt(0).toUpperCase()}
                    </div>
                    <button className="absolute bottom-0 right-0 p-2 rounded-full bg-dark-700 border border-dark-600 text-dark-300 hover:text-white transition-colors">
                      <Camera className="w-4 h-4" />
                    </button>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-white">{displayName}</h3>
                    <p className="text-dark-400 text-sm">Member since {new Date(mockUser.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-dark-300 mb-2">
                      Display Name
                    </label>
                    <Input
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="Your name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-dark-300 mb-2">
                      Email Address
                    </label>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                    />
                  </div>

                  <div className="flex items-center gap-3 pt-4">
                    <Button onClick={handleSave} disabled={isSaving}>
                      {isSaving ? (
                        "Saving..."
                      ) : saved ? (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          Saved!
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            {activeTab === "notifications" && (
              <Card className="p-6">
                <h2 className="text-xl font-semibold text-white mb-6">Notification Preferences</h2>
                
                <div className="space-y-6">
                  {[
                    { label: "Price drop alerts", description: "Get notified when prices drop on tracked items", enabled: true },
                    { label: "Deal recommendations", description: "Personalized deal suggestions based on your interests", enabled: true },
                    { label: "Weekly digest", description: "Summary of best deals and price changes", enabled: false },
                    { label: "Marketing emails", description: "Tips, updates, and promotional content", enabled: false },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-white">{item.label}</h3>
                        <p className="text-sm text-dark-400">{item.description}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked={item.enabled} className="sr-only peer" />
                        <div className="w-11 h-6 bg-dark-600 peer-focus:ring-2 peer-focus:ring-accent-purple/50 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-purple"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {activeTab === "security" && (
              <Card className="p-6">
                <h2 className="text-xl font-semibold text-white mb-6">Security Settings</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium text-white mb-4">Change Password</h3>
                    <div className="space-y-4 max-w-md">
                      <Input type="password" placeholder="Current password" />
                      <Input type="password" placeholder="New password" />
                      <Input type="password" placeholder="Confirm new password" />
                      <Button variant="secondary">Update Password</Button>
                    </div>
                  </div>

                  <hr className="border-dark-700" />

                  <div>
                    <h3 className="font-medium text-white mb-2">Two-Factor Authentication</h3>
                    <p className="text-sm text-dark-400 mb-4">Add an extra layer of security to your account</p>
                    <Button variant="secondary">Enable 2FA</Button>
                  </div>

                  <hr className="border-dark-700" />

                  <div>
                    <h3 className="font-medium text-red-400 mb-2">Delete Account</h3>
                    <p className="text-sm text-dark-400 mb-4">Permanently delete your account and all associated data</p>
                    <Button variant="ghost" className="text-red-400 hover:bg-red-500/10">
                      Delete Account
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            {activeTab === "billing" && (
              <Card className="p-6">
                <h2 className="text-xl font-semibold text-white mb-6">Billing & Subscription</h2>
                
                <div className="p-4 rounded-xl bg-gradient-to-r from-accent-purple/20 to-accent-pink/20 border border-accent-purple/30 mb-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm text-accent-purple font-medium">Current Plan</span>
                      <h3 className="text-xl font-bold text-white">Free</h3>
                    </div>
                    <Button variant="primary">Upgrade to Pro</Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium text-white">Pro Features</h3>
                  <ul className="space-y-2 text-dark-300">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent-lime" />
                      Unlimited price alerts
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent-lime" />
                      Advanced price history analytics
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent-lime" />
                      Priority deal notifications
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent-lime" />
                      No ads
                    </li>
                  </ul>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
