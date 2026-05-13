import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { cookies, headers } from "next/headers";
import { routing } from "./routing";

const LOCALE_COOKIE = "NEXT_LOCALE";

function normalizeLocale(value: string | null): string | undefined {
  if (!value) {
    return undefined;
  }

  const short = value.split("-")[0]?.toLowerCase();
  if (short && hasLocale(routing.locales, short)) {
    return short;
  }

  return hasLocale(routing.locales, value) ? value : undefined;
}

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const headerStore = await headers();

  const fromCookie = normalizeLocale(
    cookieStore.get(LOCALE_COOKIE)?.value ?? null,
  );
  const fromHeader = normalizeLocale(
    headerStore.get("accept-language")?.split(",")[0]?.trim() ?? null,
  );

  const locale = fromCookie ?? fromHeader ?? routing.defaultLocale;

  return {
    locale,
    messages: (await import(`../i18n/content/${locale}.json`)).default,
  };
});
