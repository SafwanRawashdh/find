"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

// Icons as inline SVGs for simplicity
const SearchIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
    />
  </svg>
);

const HeartIcon = ({ filled = false }: { filled?: boolean }) => (
  <svg
    className="w-5 h-5"
    fill={filled ? "currentColor" : "none"}
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
    />
  </svg>
);

const CartIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
    />
  </svg>
);

const BellIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
    />
  </svg>
);

const UserIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    />
  </svg>
);

interface NavLinkProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  badge?: number;
  isActive?: boolean;
}

const NavLink: React.FC<NavLinkProps> = ({
  href,
  icon,
  label,
  badge,
  isActive,
}) => (
  <Link
    href={href}
    className={`relative flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all ${isActive
      ? "bg-accent-purple/20 text-accent-purple"
      : "text-gray-400 hover:text-white hover:bg-dark-600"
      }`}
  >
    {icon}
    <span className="hidden sm:inline">{label}</span>
    {badge !== undefined && badge > 0 && (
      <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent-pink rounded-full flex items-center justify-center text-xs font-bold text-white">
        {badge > 9 ? "9+" : badge}
      </span>
    )}
  </Link>
);

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const { user, isAuthenticated, logout } = useAuth();

  // Mock counts for demo
  const cartCount = 3;
  const favoritesCount = user?.favorites?.length || 0;
  const alertsCount = 2;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="glass sticky top-0 z-40 border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-accent-purple to-accent-pink rounded-xl blur opacity-40 group-hover:opacity-60 transition-opacity" />
              <div className="relative w-10 h-10 bg-dark-700 rounded-xl flex items-center justify-center border border-white/10">
                <SearchIcon />
              </div>
            </div>
            <span className="text-2xl font-bold tracking-tight">
              <span className="gradient-text">FIND</span>
            </span>
          </Link>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex-1 max-w-xl">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-accent-purple/20 to-accent-pink/20 rounded-xl opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 blur transition duration-300" />
              <div className="relative flex items-center bg-dark-700/80 rounded-xl border border-white/5 group-hover:border-white/10 transition-colors">
                <div className="pl-4 text-gray-500">
                  <SearchIcon />
                </div>
                <input
                  type="text"
                  className="flex-1 bg-transparent border-none outline-none text-white placeholder-gray-500 py-2.5 px-3 text-sm"
                  placeholder="Search for products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="p-2 text-gray-500 hover:text-white transition-colors"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </form>

          {/* Navigation */}
          <nav className="flex items-center gap-1">
            {isAuthenticated && (
              <>
                <NavLink
                  href="/favorites"
                  icon={<HeartIcon filled={pathname === "/favorites"} />}
                  label="Favorites"
                  badge={favoritesCount}
                  isActive={pathname === "/favorites"}
                />
                <NavLink
                  href="/cart"
                  icon={<CartIcon />}
                  label="Cart"
                  badge={cartCount}
                  isActive={pathname === "/cart"}
                />
                <NavLink
                  href="/alerts"
                  icon={<BellIcon />}
                  label="Alerts"
                  badge={alertsCount}
                  isActive={pathname === "/alerts"}
                />

                {/* Divider */}
                <div className="h-6 w-px bg-dark-500 mx-2 hidden sm:block" />
              </>
            )}

            {/* User Menu */}
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="relative group flex items-center gap-2"
                >
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-accent-purple to-accent-pink rounded-full opacity-0 group-hover:opacity-50 blur transition-opacity" />
                  <div className="relative h-10 w-10 bg-gradient-to-br from-accent-purple to-accent-pink rounded-full flex items-center justify-center font-bold text-white text-sm border-2 border-dark-900">
                    {(user.displayName || user.email || "U").charAt(0).toUpperCase()}
                  </div>
                </button>

                {/* Dropdown Menu */}
                {isUserMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setIsUserMenuOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-56 glass rounded-xl shadow-lg py-2 z-20 animate-fade-in">
                      <div className="px-4 py-3 border-b border-white/5">
                        <p className="text-sm font-medium text-white">
                          {user.displayName}
                        </p>
                        <p className="text-xs text-gray-400">{user.email}</p>
                      </div>
                      <Link
                        href="/account"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-dark-600 transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <UserIcon />
                        Account Settings
                      </Link>
                      <Link
                        href="/alerts"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-dark-600 transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <BellIcon />
                        Price Alerts
                      </Link>
                      <div className="border-t border-white/5 mt-2 pt-2">
                        <button
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-dark-600 transition-colors"
                          onClick={() => {
                            logout();
                            setIsUserMenuOpen(false);
                          }}
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                            />
                          </svg>
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/auth/login"
                  className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
                >
                  Log In
                </Link>
                <Link href="/auth/register" className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-accent-purple to-accent-pink rounded-lg blur opacity-60 group-hover:opacity-100 transition-opacity" />
                  <span className="relative block px-4 py-2 bg-dark-800 rounded-lg text-sm font-medium text-white">
                    Sign Up Free
                  </span>
                </Link>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
