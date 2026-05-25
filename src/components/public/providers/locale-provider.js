"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useTransition,
} from "react";
import { PageLoader } from "@/components/public/ui/page-loader";
import {
  defaultLocale,
  defaultSiteCopy,
  isSupportedLocale,
  languageOptions,
  loadSiteCopy,
} from "@/lib/site-data";

const STORAGE_KEY = "mirfoundation-locale";
const MINIMUM_LOADER_DURATION = 220;

const LocaleContext = createContext(null);

function pause(duration) {
  return new Promise((resolve) => {
    setTimeout(resolve, duration);
  });
}

export function LocaleProvider({ children }) {
  const [locale, setLocaleState] = useState(defaultLocale);
  const [copy, setCopy] = useState(defaultSiteCopy);
  const [isSwitching, setIsSwitching] = useState(false);
  const [isPending, startTransition] = useTransition();
  const requestIdRef = useRef(0);

  useEffect(() => {
    document.documentElement.lang = copy.htmlLang;
    document.documentElement.dir = "ltr";
    document.documentElement.dataset.locale = locale.toLowerCase();
  }, [copy.htmlLang, locale]);

  useEffect(() => {
    const savedLocale = window.localStorage.getItem(STORAGE_KEY);

    if (
      savedLocale &&
      isSupportedLocale(savedLocale) &&
      savedLocale !== defaultLocale
    ) {
      void applyLocale(savedLocale, { persist: false });
    }
  }, []);

  async function applyLocale(nextLocale, options = {}) {
    const { persist = true } = options;
    const normalizedLocale = nextLocale?.toUpperCase();

    if (!isSupportedLocale(normalizedLocale) || normalizedLocale === locale) {
      return;
    }

    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;
    setIsSwitching(true);

    const startedAt = Date.now();
    const nextCopy = await loadSiteCopy(normalizedLocale);
    const elapsed = Date.now() - startedAt;

    if (elapsed < MINIMUM_LOADER_DURATION) {
      await pause(MINIMUM_LOADER_DURATION - elapsed);
    }

    if (requestIdRef.current !== requestId) {
      return;
    }

    startTransition(() => {
      setLocaleState(normalizedLocale);
      setCopy(nextCopy);
    });

    if (persist) {
      window.localStorage.setItem(STORAGE_KEY, normalizedLocale);
    }

    setIsSwitching(false);
  }

  const value = {
    locale,
    copy,
    isLoading: isSwitching || isPending,
    languageOptions,
    setLocale(nextLocale) {
      void applyLocale(nextLocale);
    },
  };

  return (
    <LocaleContext.Provider value={value}>
      {children}
      {value.isLoading ? (
        <PageLoader label={copy.loader.switching} overlay />
      ) : null}
    </LocaleContext.Provider>
  );
}

export function useSiteLocale() {
  const context = useContext(LocaleContext);

  if (!context) {
    throw new Error("useSiteLocale must be used within LocaleProvider.");
  }

  return context;
}
