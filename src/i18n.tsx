import { ReactNode, createContext, useContext, useMemo } from "react";
import translationsData from "./assets/translations.json";
import { Locale } from "./types";
import { usePersistentState } from "./hooks/usePersistentState";

export type Translations = typeof translationsData.en;
type Dictionary = Translations;

type TranslationContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  translations: Dictionary;
  t: (path: string) => string;
};

const locales = Object.keys(translationsData) as Locale[];

const TranslationContext = createContext<TranslationContextValue | undefined>(
  undefined,
);

function lookup(path: string, dictionary: Dictionary): string {
  return path
    .split(".")
    .reduce<Record<string, unknown> | string>((acc, key) => {
      if (typeof acc === "string") {
        return acc;
      }

      if (acc && typeof acc === "object" && key in acc) {
        return (acc as Record<string, unknown>)[key] as
          | Record<string, unknown>
          | string;
      }

      return path;
    }, dictionary) as string;
}

export const TranslationProvider = ({ children }: { children: ReactNode }) => {
  const [locale, setLocale] = usePersistentState<Locale>("me-locale", "en");
  const translations = translationsData[locale];

  const value = useMemo<TranslationContextValue>(
    () => ({
      locale,
      setLocale,
      translations,
      t: (path: string) => lookup(path, translations),
    }),
    [locale, setLocale, translations],
  );

  return (
    <TranslationContext.Provider value={value}>
      {children}
    </TranslationContext.Provider>
  );
};

export function useTranslation() {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error("useTranslation must be used inside TranslationProvider");
  }

  return context;
}

export const supportedLocales = locales;
