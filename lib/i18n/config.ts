export const locales = ["sv", "en"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "sv";

export const localeLabels: Record<Locale, string> = {
  sv: "Svenska",
  en: "English",
};
