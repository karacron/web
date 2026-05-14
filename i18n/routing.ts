import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: [
    "en",
    "es",
    "zh",
    "nl",
    "fr",
    "ja",
    "de",
    "it",
    "hi",
    "ar",
    "ru",
    "tr",
  ],
  defaultLocale: "en",
  localePrefix: "never",
  localeCookie: {
    name: "NEXT_LOCALE",
    sameSite: "lax",
  },
});

export type Locale = (typeof routing.locales)[number];
