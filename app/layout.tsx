import { ModalProvider } from "@molecule/modal/modal-provider";
import { CookieConsentBanner } from "@organism/cookies/cookie-consent";
import SmoothScrollProvider from "@provider/SmoothScrollProvider";
import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { Geist, Geist_Mono } from "next/font/google";
import "vanilla-cookieconsent/dist/cookieconsent.css";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kara — Work less. Enjoy more.",
  description:
    "Kara is a local-first AI desktop assistant for teams, SMBs and everyday people who want private automation with real control.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}
    >
      <body className="min-h-full bg-background text-foreground">
        <NextIntlClientProvider messages={messages}>
          <SmoothScrollProvider>
            <ModalProvider>{children}</ModalProvider>
          </SmoothScrollProvider>
          <CookieConsentBanner />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
