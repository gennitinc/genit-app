"use client";

import { useState, useCallback, useMemo } from "react";
import type { EnvVariable } from "./use-env-variables";

export function useEnvDialog(initialVariables: EnvVariable[] = []) {
  const [isOpen, setIsOpen] = useState(false);
  const [variables, setVariables] = useState<EnvVariable[]>(initialVariables);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Memoized validation
  const validation = useMemo(() => {
    const emptyVars = variables.filter((v) => !v.key.trim() || !v.value.trim());
    const keys = variables.map((v) => v.key.trim().toUpperCase());
    const duplicateKeys = keys.filter(
      (key, index) => keys.indexOf(key) !== index
    );

    return {
      hasEmptyVars: emptyVars.length > 0,
      hasDuplicates: duplicateKeys.length > 0,
      duplicateKeys,
      isValid: emptyVars.length === 0 && duplicateKeys.length === 0,
    };
  }, [variables]);

  // Callbacks
  const openDialog = useCallback((vars?: EnvVariable[]) => {
    if (vars) {
      setVariables(vars);
    }
    setIsOpen(true);
  }, []);

  const closeDialog = useCallback(() => {
    setIsOpen(false);
    setEditingId(null);
  }, []);

  const addVariable = useCallback(() => {
    const newVar: EnvVariable = {
      id: Date.now().toString(),
      key: "",
      value: "",
    };
    setVariables((prev) => [...prev, newVar]);
    setEditingId(newVar.id);
  }, []);

  const updateVariable = useCallback(
    (id: string, key: string, value: string) => {
      setVariables((prev) =>
        prev.map((v) =>
          v.id === id ? { ...v, key: key.trim(), value: value.trim() } : v
        )
      );
      setEditingId(null);
    },
    []
  );

  const removeVariable = useCallback((id: string) => {
    setVariables((prev) => prev.filter((v) => v.id !== id));
  }, []);

  const startEditing = useCallback((id: string) => {
    setEditingId(id);
  }, []);

  const stopEditing = useCallback(() => {
    setEditingId(null);
  }, []);

  const resetVariables = useCallback((vars: EnvVariable[]) => {
    setVariables(vars);
    setEditingId(null);
  }, []);

  return {
    // State
    isOpen,
    variables,
    editingId,
    validation,

    // Actions
    openDialog,
    closeDialog,
    addVariable,
    updateVariable,
    removeVariable,
    startEditing,
    stopEditing,
    resetVariables,
  };
}
