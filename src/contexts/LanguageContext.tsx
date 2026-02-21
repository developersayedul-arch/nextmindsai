import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Language, Currency, Translations } from "@/i18n/types";
import { bn } from "@/i18n/bn";
import { en } from "@/i18n/en";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
  currency: Currency;
  setCurrency: (currency: Currency) => void;
}

const translations: Record<Language, Translations> = { bn, en };

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const detectBrowserLanguage = (): Language => {
  const browserLang = navigator.language || (navigator as any).userLanguage || "";
  // Check for Bengali
  if (browserLang.startsWith("bn") || browserLang.startsWith("ba")) {
    return "bn";
  }
  // Default to Bangla for BD region
  if (browserLang.includes("BD")) {
    return "bn";
  }
  return "en";
};

const detectCurrency = (lang: Language): Currency => {
  if (lang === "bn") return "BDT";
  return "USD";
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem("app-language");
    if (saved === "bn" || saved === "en") return saved;
    return detectBrowserLanguage();
  });

  const [currency, setCurrencyState] = useState<Currency>(() => {
    const saved = localStorage.getItem("app-currency");
    if (saved === "BDT" || saved === "USD" || saved === "EUR") return saved;
    return detectCurrency(language);
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("app-language", lang);
    // Auto-switch currency when language changes
    if (lang === "bn" && currency !== "BDT") {
      setCurrency("BDT");
    } else if (lang === "en" && currency === "BDT") {
      setCurrency("USD");
    }
  };

  const setCurrency = (cur: Currency) => {
    setCurrencyState(cur);
    localStorage.setItem("app-currency", cur);
  };

  const t = translations[language];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, currency, setCurrency }}>
      {children}
    </LanguageContext.Provider>
  );
};
