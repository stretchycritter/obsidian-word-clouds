export const SUPPORTED_TRANSLATIONS = ["en"] as const;

export type SupportedTranslation = (typeof SUPPORTED_TRANSLATIONS)[number];
