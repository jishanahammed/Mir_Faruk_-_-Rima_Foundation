import defaultSiteCopy from "@/lib/locales/en";

export const defaultLocale = "EN";

export const supportedLocales = ["EN", "BN", "DK"];

export const languageOptions = [
  { code: "EN", label: "English" },
  { code: "BN", label: "বাংলা" },
  { code: "DK", label: "Danish" },
];

const siteCopyLoaders = {
  EN: () => import("@/lib/locales/en").then((module) => module.default),
  BN: () => import("@/lib/locales/bn").then((module) => module.default),
  DK: () => import("@/lib/locales/dk").then((module) => module.default),
};

export function normalizeLocale(locale) {
  return typeof locale === "string" ? locale.toUpperCase() : defaultLocale;
}

export function isSupportedLocale(locale) {
  return supportedLocales.includes(normalizeLocale(locale));
}

export async function loadSiteCopy(locale) {
  const normalizedLocale = normalizeLocale(locale);
  const loadCopy = siteCopyLoaders[normalizedLocale] ?? siteCopyLoaders[defaultLocale];

  return loadCopy();
}

export { defaultSiteCopy };
