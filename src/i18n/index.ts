import { moment } from "obsidian";
import en from "./en.json";
import { SUPPORTED_TRANSLATIONS, type SupportedTranslation } from "./supported-translations";

type Dictionary = Record<string, string>;

const dictionaries: Record<SupportedTranslation, Dictionary> = { en };
const supportedTranslationSet = new Set<string>(SUPPORTED_TRANSLATIONS);

const DEFAULT_LOCALE: SupportedTranslation = "en";
let activeLocale: SupportedTranslation = DEFAULT_LOCALE;

export function initI18n(): void {
  activeLocale = resolveLocale(moment.locale());
}

export function t(key: string, localeOverride?: string): string {
  const locale = localeOverride ? resolveLocale(localeOverride) : activeLocale;
  return dictionaries[locale][key] ?? dictionaries[DEFAULT_LOCALE][key] ?? key;
}

export function setLocale(locale?: string | null): void {
  activeLocale = resolveLocale(locale ?? moment.locale());
}

export function getActiveLocale(): SupportedTranslation {
  return activeLocale;
}

function resolveLocale(input: string): SupportedTranslation {
  const normalized = (input || "").trim().toLowerCase().replace(/_/g, "-") || DEFAULT_LOCALE;

  if (supportedTranslationSet.has(normalized)) return normalized as SupportedTranslation;

  const base = normalized.split("-")[0];
  if (base && supportedTranslationSet.has(base)) return base as SupportedTranslation;

  return DEFAULT_LOCALE;
}
