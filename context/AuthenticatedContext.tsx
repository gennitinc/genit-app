"use client";
import React, { ReactNode } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Profile } from "@/types/supabase";

interface AuthenticatedContextInt {
  user: Profile | null;
  loading: boolean;
  signUp: (
    email: string,
    password: string,
    username: string,
    userdp?: string
  ) => Promise<{ data: any; error: any }>;
  signIn: (
    email: string,
    password: string
  ) => Promise<{ data: any; error: any }>;
  signInWithProvider: (
    provider: "google" | "facebook"
  ) => Promise<{ data: any; error: any }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ data: any; error: any }>;
  updatePassword: (password: string) => Promise<{ data: any; error: any }>;
  updateProfile: (
    updates: Partial<Profile>
  ) => Promise<{ data: any; error: any }>;
  checkUsernameAvailability: (username: string) => Promise<boolean>;
}

const AuthenticatedContext = React.createContext<
  AuthenticatedContextInt | undefined
>(undefined);

export function AuthenticatedContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const auth = useAuth();

  return (
    <AuthenticatedContext.Provider
      value={{
        user: auth.profile, // Use auth.profile which has emailVerified property
        loading: auth.loading,
        signUp: auth.signUp,
        signIn: auth.signIn,
        signInWithProvider: auth.signInWithProvider,
        signOut: auth.signOut,
        resetPassword: auth.resetPassword,
        updatePassword: auth.updatePassword,
        updateProfile: auth.updateProfile,
        checkUsernameAvailability: auth.checkUsernameAvailability,
      }}
    >
      {children}
    </AuthenticatedContext.Provider>
  );
}

export function useUserContext() {
  const context = React.useContext(AuthenticatedContext);
  if (!context) {
    throw new Error(
      "useUserContext must be used within AuthenticatedContextProvider"
    );
  }
  return context;
}
