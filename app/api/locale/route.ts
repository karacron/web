import { routing } from "@i18n/routing";
import { NextResponse } from "next/server";

function isLocale(locale: string): locale is (typeof routing.locales)[number] {
  return routing.locales.includes(locale as (typeof routing.locales)[number]);
}

export async function POST(request: Request) {
  const body = (await request.json()) as { locale?: string };
  const locale = body.locale;

  if (!locale || !isLocale(locale)) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set("NEXT_LOCALE", locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });

  return response;
}
