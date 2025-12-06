"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import type { User, AuthStatus, RegisterData, LoginCredentials } from "@/types";

// ============================================
// Auth Context Types
// ============================================

interface AuthContextType {
  user: User | null;
  status: AuthStatus;
  /** @deprecated Use status === 'authenticated' instead */
  isLoggedIn: boolean;
  /** @deprecated Use status === 'checking' instead */
  isLoading: boolean;
  isMounted: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  toggleFavorite: (productId: string) => Promise<void>;
}

// Default context value for SSR safety
const defaultContextValue: AuthContextType = {
  user: null,
  status: "checking",
  isLoggedIn: false,
  isLoading: true,
  isMounted: false,
  login: async () => { },
  register: async () => { },
  logout: () => { },
  toggleFavorite: async () => { },
};

const AuthContext = createContext<AuthContextType>(defaultContextValue);

// ============================================
// Simulated API Functions (to be replaced with real API later)
// ============================================

const fakeAuthApi = {
  checkSession: async (): Promise<User | null> => {
    // Simulate checking for existing session
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Check localStorage for persisted session
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("find_user");
      if (stored) {
        try {
          return JSON.parse(stored) as User;
        } catch {
          return null;
        }
      }
    }
    return null;
  },

  login: async (credentials: LoginCredentials): Promise<User> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Demo validation - accept specific demo credentials or any valid-looking input
    if (
      credentials.email === "demo@example.com" &&
      credentials.password === "Demo123!"
    ) {
      const user: User = {
        id: "demo-user-123",
        email: credentials.email,
        displayName: "Demo User",
        favorites: [],
        createdAt: new Date().toISOString(),
      };
      return user;
    }

    // Accept any email/password for demo purposes
    if (credentials.email && credentials.password.length >= 6) {
      const user: User = {
        id: `user-${Date.now()}`,
        email: credentials.email,
        displayName: credentials.email.split("@")[0],
        favorites: [],
        createdAt: new Date().toISOString(),
      };
      return user;
    }

    throw new Error("Invalid email or password");
  },

  register: async (data: RegisterData): Promise<User> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1200));

    // Simple validation
    if (!data.email || !data.password) {
      throw new Error("Email and password are required");
    }

    if (data.password.length < 8) {
      throw new Error("Password must be at least 8 characters");
    }

    // Create new user
    const user: User = {
      id: `user-${Date.now()}`,
      email: data.email,
      displayName: data.name || data.email.split("@")[0],
      favorites: [],
      createdAt: new Date().toISOString(),
    };

    return user;
  },
};

// ============================================
// Auth Provider Component
// ============================================

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<AuthStatus>("checking");
  const [isMounted, setIsMounted] = useState(false);

  // Check for existing session on mount
  useEffect(() => {
    setIsMounted(true);

    const checkSession = async () => {
      try {
        const existingUser = await fakeAuthApi.checkSession();
        if (existingUser) {
          setUser(existingUser);
          setStatus("authenticated");
        } else {
          setStatus("guest");
        }
      } catch (error) {
        console.error("Session check failed:", error);
        setStatus("guest");
      }
    };

    checkSession();
  }, []);

  // Persist user to localStorage when it changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (user) {
        localStorage.setItem("find_user", JSON.stringify(user));
      } else {
        localStorage.removeItem("find_user");
      }
    }
  }, [user]);

  const login = useCallback(async (credentials: LoginCredentials) => {
    setStatus("checking");
    try {
      const loggedInUser = await fakeAuthApi.login(credentials);
      setUser(loggedInUser);
      setStatus("authenticated");
    } catch (error) {
      setStatus("guest");
      throw error;
    }
  }, []);

  const register = useCallback(async (data: RegisterData) => {
    setStatus("checking");
    try {
      const newUser = await fakeAuthApi.register(data);
      setUser(newUser);
      setStatus("authenticated");
    } catch (error) {
      setStatus("guest");
      throw error;
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setStatus("guest");
    if (typeof window !== "undefined") {
      localStorage.removeItem("find_user");
    }
  }, []);

  const toggleFavorite = useCallback(
    async (productId: string) => {
      if (!user) return;

      try {
        const isFavorite = user.favorites.includes(productId);
        const updatedFavorites = isFavorite
          ? user.favorites.filter((id) => id !== productId)
          : [...user.favorites, productId];

        setUser({ ...user, favorites: updatedFavorites });
      } catch (error) {
        console.error("Failed to toggle favorite:", error);
      }
    },
    [user]
  );

  // Derived values for backward compatibility
  const isLoggedIn = status === "authenticated";
  const isLoading = status === "checking";

  return (
    <AuthContext.Provider
      value={{
        user,
        status,
        isLoggedIn,
        isLoading,
        isMounted,
        login,
        register,
        logout,
        toggleFavorite,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ============================================
// Custom Hook
// ============================================

export const useAuth = () => {
  const context = useContext(AuthContext);
  return context;
};