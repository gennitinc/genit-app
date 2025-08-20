"use client";
import React, { useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import cookie from "js-cookie";
import { NetworkStatus } from "@/components/network/NetworkStatus";
import { useUser, type User } from "@/hooks/use-user";
import { useQueryClient } from "@tanstack/react-query";

const gennituToken = cookie.get("gennituToken");

enum Plan {
  Starter = "Starter",
  Premium = "Premium",
  Team = "Team",
  Enterprise = "Enterprise",
}

export interface Team {
  projectId: string;
  role: "Owner" | "Editor" | "Viewer";
}

interface TeamMember {
  user: string; // Reference to the user
  role: "Owner" | "Editor" | "Viewer";
  // List of possible roles
}

interface AuthenticatedContextInt {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  fetchCurrentUser: () => Promise<void>;
  isReload: boolean;
  setIsReload: React.Dispatch<React.SetStateAction<boolean>>;
}

const AuthenticatedContext = React.createContext<
  AuthenticatedContextInt | undefined
>(undefined);

export function AuthenticatedContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [isReload, setIsReload] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const queryClient = useQueryClient();

  // Use React Query for user fetching
  const { data: userData, isLoading, isError, error, refetch } = useUser();

  // Update local state when React Query data changes
  useEffect(() => {
    if (userData) {
      setUser(userData);
      setLoading(false);
    } else if (!gennituToken) {
      setLoading(false);
    }
  }, [userData]);

  // Handle loading state
  useEffect(() => {
    if (gennituToken) {
      setLoading(isLoading);
    } else {
      setLoading(false);
    }
  }, [isLoading]);

  // Handle reload trigger
  useEffect(() => {
    if (isReload && gennituToken) {
      refetch();
      setIsReload(false);
    }
  }, [isReload, refetch]);

  const fetchCurrentUser = async () => {
    if (gennituToken) {
      await refetch();
    }
  };

  return (
    <AuthenticatedContext.Provider
      value={{
        user,
        setUser,
        fetchCurrentUser,
        loading,
        setLoading,
        isReload,
        setIsReload,
      }}
    >
      {/* {!user && !gennituToken ? (
        children
      ) : isError || (!user && gennituToken) || !gennituToken ? (
        <NetworkStatus
          isError={isError}
          retryFetchUser={fetchCurrentUser}
          user={user}
          dataFetched={!!userData}
          isAuthenticated={!!gennituToken}
        />
      ) : ( */}
      {children}
      {/* )} */}
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
