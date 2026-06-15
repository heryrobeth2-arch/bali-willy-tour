"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { Language, translations } from "./translations";

type TranslationsType = typeof translations;

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: TranslationsType[Language];
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

function getInitialLanguage(): Language {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("bwt-lang") as Language | null;
    if (saved && translations[saved]) {
      return saved;
    }
  }
  return "id";
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(getInitialLanguage);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("bwt-lang", lang);
    document.documentElement.lang = lang;
  }, []);

  const t = translations[language];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
