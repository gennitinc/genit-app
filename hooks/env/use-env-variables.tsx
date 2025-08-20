"use client";

import { useState, useCallback, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface EnvVariable {
  id: string;
  key: string;
  value: string;
  createdAt?: string;
  updatedAt?: string;
}

interface UseEnvVariablesOptions {
  onSuccess?: (variables: EnvVariable[]) => void;
  onError?: (error: Error) => void;
}

// Mock API functions
const envVariablesApi = {
  getAll: async (): Promise<EnvVariable[]> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return [
      {
        id: "1",
        key: "MONGODB_URI",
        value: "mongodb://localhost:27017/myapp",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
  },

  save: async (variables: EnvVariable[]): Promise<EnvVariable[]> => {
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Simulate validation errors
    const keys = variables.map((v) => v.key.trim().toUpperCase());
    const duplicates = keys.filter((key, index) => keys.indexOf(key) !== index);

    if (duplicates.length > 0) {
      throw new Error(
        `Duplicate environment variable keys found: ${duplicates.join(", ")}`
      );
    }

    const emptyVars = variables.filter((v) => !v.key.trim() || !v.value.trim());
    if (emptyVars.length > 0) {
      throw new Error(
        "All environment variables must have both a key and value"
      );
    }

    // Simulate random failure
    if (Math.random() < 0.1) {
      throw new Error(
        "Failed to save environment variables. Please try again."
      );
    }

    return variables.map((v) => ({
      ...v,
      updatedAt: new Date().toISOString(),
    }));
  },

  delete: async (id: string): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
  },
};

export function useEnvVariables(options: UseEnvVariablesOptions = {}) {
  const queryClient = useQueryClient();
  const [recentlyAdded, setRecentlyAdded] = useState<string[]>([]);

  // Query for fetching environment variables
  const {
    data: envVars = [],
    isLoading: isLoadingVars,
    error: loadError,
    refetch,
  } = useQuery({
    queryKey: ["env-variables"],
    queryFn: envVariablesApi.getAll,
    onSuccess: options.onSuccess,
    onError: options.onError,
  });

  // Mutation for saving environment variables
  const saveMutation = useMutation({
    mutationFn: envVariablesApi.save,
    onSuccess: (savedVars) => {
      queryClient.setQueryData(["env-variables"], savedVars);

      // Track recently added variables
      const newKeys = savedVars
        .filter((v) => !recentlyAdded.includes(v.key))
        .map((v) => v.key);

      if (newKeys.length > 0) {
        setRecentlyAdded((prev) => [...prev, ...newKeys]);

        // Remove from recently added after 5 seconds
        setTimeout(() => {
          setRecentlyAdded((prev) =>
            prev.filter((key) => !newKeys.includes(key))
          );
        }, 5000);
      }
    },
  });

  // Mutation for deleting environment variables
  const deleteMutation = useMutation({
    mutationFn: envVariablesApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries(["env-variables"]);
    },
  });

  // Memoized computed values
  const computedValues = useMemo(
    () => ({
      hasVariables: envVars.length > 0,
      variableCount: envVars.length,
      displayText:
        envVars.length > 0
          ? `${envVars
              .slice(0, 2)
              .map((env) => env.key)
              .join(", ")}${
              envVars.length > 2 ? ` +${envVars.length - 2} more` : ""
            }`
          : "No variables configured",
      isLoading:
        isLoadingVars || saveMutation.isLoading || deleteMutation.isLoading,
      error: loadError || saveMutation.error || deleteMutation.error,
    }),
    [
      envVars,
      isLoadingVars,
      saveMutation.isLoading,
      saveMutation.error,
      deleteMutation.isLoading,
      deleteMutation.error,
      loadError,
    ]
  );

  // Callbacks
  const saveVariables = useCallback(
    (variables: EnvVariable[]) => {
      return saveMutation.mutateAsync(variables);
    },
    [saveMutation]
  );

  const deleteVariable = useCallback(
    (id: string) => {
      return deleteMutation.mutateAsync(id);
    },
    [deleteMutation]
  );

  const clearRecentlyAdded = useCallback(() => {
    setRecentlyAdded([]);
  }, []);

  return {
    // Data
    envVars,
    recentlyAdded,

    // Computed values
    ...computedValues,

    // Actions
    saveVariables,
    deleteVariable,
    refetch,
    clearRecentlyAdded,

    // States
    isSaving: saveMutation.isLoading,
    isDeleting: deleteMutation.isLoading,
    saveError: saveMutation.error as Error | null,
  };
}
