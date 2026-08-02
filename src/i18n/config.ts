export const locales = ["en", "zh"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "zh";
export const localeStorageKey = "hermescn.locale";
export const localeCookieName = "hermescn_locale";
export const localeChangeEvent = "hermescn:locale-change";

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && locales.includes(value as Locale);
}

export function resolveLocale(value: unknown): Locale {
  return isLocale(value) ? value : defaultLocale;
}

export function detectLocale(language?: string | null): Locale {
  if (!language) {
    return defaultLocale;
  }

  const preferredLocales = language
    .split(",")
    .map((option) => {
      const [tag = "", ...parameters] = option.trim().split(";");
      const quality = parameters
        .map((parameter) => parameter.trim())
        .find((parameter) => parameter.startsWith("q="));
      const weight = quality ? Number(quality.slice(2)) : 1;

      return {
        tag: tag.toLowerCase(),
        weight: Number.isFinite(weight) ? weight : 0,
      };
    })
    .filter(({ tag, weight }) => tag && weight > 0)
    .sort((left, right) => right.weight - left.weight);

  for (const { tag } of preferredLocales) {
    if (tag.startsWith("zh")) {
      return "zh";
    }

    if (tag.startsWith("en")) {
      return "en";
    }
  }

  return defaultLocale;
}

export function toIntlLocale(locale: Locale): string {
  return locale === "zh" ? "zh-CN" : "en-US";
}
