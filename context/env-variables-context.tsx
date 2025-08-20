"use client";

import { createContext, useContext, type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEnvVariables, type EnvVariable } from "@/hooks/env";

interface EnvVariablesContextType {
  envVars: EnvVariable[] ;
  recentlyAdded: string[];
  hasVariables: boolean;
  variableCount: number;
  displayText: string;
  isLoading: boolean;
  isSaving: boolean;
  isDeleting: boolean;
  error: Error | null;
  saveError: Error | null;
  saveVariables: (variables: EnvVariable[]) => Promise<EnvVariable[]>;
  deleteVariable: (id: string) => Promise<void>;
  refetch: () => void;
  clearRecentlyAdded: () => void;
}

const EnvVariablesContext = createContext<EnvVariablesContextType | undefined>(
  undefined
);

// Create a query client instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
  
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

interface EnvVariablesProviderProps {
  children: ReactNode;
}

function EnvVariablesProviderInner({ children }: EnvVariablesProviderProps) {
  const envVariablesData = useEnvVariables();

  const contextValue: EnvVariablesContextType = {
    ...envVariablesData,
    envVars: envVariablesData.envVars as EnvVariable[],
  };

  return (
    <EnvVariablesContext.Provider value={contextValue}>
      {children}
    </EnvVariablesContext.Provider>
  );
}

export function EnvVariablesProvider({ children }: EnvVariablesProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <EnvVariablesProviderInner>{children}</EnvVariablesProviderInner>
    </QueryClientProvider>
  );
}

export function useEnvVariablesContext() {
  const context = useContext(EnvVariablesContext);
  if (context === undefined) {
    throw new Error(
      "useEnvVariablesContext must be used within an EnvVariablesProvider"
    );
  }
  return context;
}
