"use client";

import { useUserContext } from "@/context/AuthenticatedContext";
import { Language, isLanguage, translations } from "@/lib/i18n";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const STORAGE_KEY = "genit-language";

type LanguageContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (text: string) => string;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const { user, updateUserPreferences } = useUserContext();
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (isLanguage(stored)) setLanguageState(stored);
  }, []);

  useEffect(() => {
    const preferred = user?.preferences?.language;
    if (isLanguage(preferred)) setLanguageState(preferred);
  }, [user?.preferences?.language]);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, language);
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = useCallback(
    (nextLanguage: Language) => {
      setLanguageState(nextLanguage);
      if (user) {
        void updateUserPreferences({ language: nextLanguage }).catch(() => {
          // Local persistence keeps the preference usable while offline.
        });
      }
    },
    [updateUserPreferences, user]
  );

  const value = useMemo<LanguageContextValue>(
    () => ({
      language,
      setLanguage,
      t: (text) =>
        language === "en" ? text : (translations[language][text] ?? text),
    }),
    [language, setLanguage]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context)
    throw new Error("useLanguage must be used within LanguageProvider");
  return context;
}
