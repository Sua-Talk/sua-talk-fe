"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import apiAuth from "@/lib/apiAuth";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  getUserId: () => string | null;
  getUserInfo: () => UserInfo | null;
  refreshToken: () => Promise<boolean>;
  isLoading: boolean;
}

interface UserInfo {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  profilePicture?: string;
  isEmailVerified: boolean;
  isActive: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("auth_token");
        if (!token) {
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }

        // Check if token is expired
        const expirationTime = localStorage.getItem("token_expiration");
        const currentTime = new Date().getTime();

        if (expirationTime && currentTime >= parseInt(expirationTime)) {
          // Token is expired, try to refresh
          const refreshSuccess = await refreshToken();
          console.log("refreshSuccess", refreshSuccess);
          if (!refreshSuccess) {
            // If refresh fails, clear everything and redirect to login
            localStorage.removeItem("auth_token");
            localStorage.removeItem("refresh_token");
            localStorage.removeItem("user_id");
            localStorage.removeItem("user_info");
            localStorage.removeItem("token_expiration");
            setIsAuthenticated(false);
            router.push("/auth/login");
            return;
          }
        }

        setIsAuthenticated(true);
      } catch (error) {
        console.error("Auth check failed:", error);
        setIsAuthenticated(false);
        router.push("/auth/login");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const refreshToken = async (): Promise<boolean> => {
    try {
      const refreshToken = localStorage.getItem("refresh_token");
      if (!refreshToken) {
        return false;
      }
      const response = (await apiAuth.refreshToken(refreshToken)) as {
        success: boolean;
        data?: { tokens?: { accessToken: string; refreshToken: string } };
      };

      if (response.success && response.data?.tokens) {
        localStorage.setItem("auth_token", response.data.tokens.accessToken);
        localStorage.setItem(
          "refresh_token",
          response.data.tokens.refreshToken
        );
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      // Clear any existing tokens before login
      localStorage.removeItem("auth_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user_id");
      localStorage.removeItem("user_info");
      localStorage.removeItem("token_expiration");
      const response = (await apiAuth.login(email, password)) as {
        success: boolean;
        data?: {
          tokens?: { accessToken: string; refreshToken: string };
          user?: { id: string; [key: string]: unknown };
        };
      };

      if (response.success && response.data?.tokens && response.data?.user) {
        // Store tokens
        localStorage.setItem("auth_token", response.data.tokens.accessToken);
        localStorage.setItem(
          "refresh_token",
          response.data.tokens.refreshToken
        );
        // Store token expiration (assuming 1 hour expiration)
        const expirationTime = new Date().getTime() + 60 * 60 * 1000;
        localStorage.setItem("token_expiration", expirationTime.toString());
        // Store user info
        localStorage.setItem("user_id", response.data.user.id);
        localStorage.setItem("user_info", JSON.stringify(response.data.user));
        setIsAuthenticated(true);
        router.push("/home");
      } else {
        throw new Error("Login failed: Invalid response format");
      }
    } catch (error) {
      throw error;
    }
  };
  const logout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user_id");
    localStorage.removeItem("user_info");
    localStorage.removeItem("token_expiration");
    setIsAuthenticated(false);
    router.push('/');
  };

  const register = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) => {
    try {
      const response = (await apiAuth.completeRegistration({
        email,
        password,
        firstName,
        lastName,
      })) as {
        success: boolean;
        data?: {
          tokens?: { accessToken: string; refreshToken: string };
          user?: { id: string; [key: string]: unknown };
        };
      };
      if (response.success && response.data?.tokens && response.data?.user) {
        localStorage.setItem("auth_token", response.data.tokens.accessToken);
        localStorage.setItem(
          "refresh_token",
          response.data.tokens.refreshToken
        );
        localStorage.setItem("user_id", response.data.user.id);
        localStorage.setItem("user_info", JSON.stringify(response.data.user));
        setIsAuthenticated(true);
        router.push("/babies");
      } else {
        throw new Error("Registration failed: Invalid response format");
      }
    } catch (error) {
      throw error;
    }
  };

  const getUserId = () => {
    return localStorage.getItem("user_id");
  };

  const getUserInfo = (): UserInfo | null => {
    const userInfo = localStorage.getItem("user_info");
    return userInfo ? JSON.parse(userInfo) : null;
  };

  const forgotPassword = async (email: string) => {
    try {
      await apiAuth.forgotPassword(email);
    } catch (error) {
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        login,
        logout,
        register,
        forgotPassword,
        getUserId,
        getUserInfo,
        refreshToken,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
