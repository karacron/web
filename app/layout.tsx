import { ModalProvider } from "@molecule/modal/modal-provider";
import { PageViewTracker } from "@organism/analytics/page-view-tracker";
import { CookieConsentBanner } from "@organism/cookies/cookie-consent";
import SmoothScrollProvider from "@provider/SmoothScrollProvider";
import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
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
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID;
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  return (
    <html
      lang={locale}
      className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}
    >
      <body className="min-h-full bg-background text-foreground">
        {gtmId || gaId ? (
          <>
            <Script id="gtm-consent-default" strategy="beforeInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                window.gtag = window.gtag || function(){window.dataLayer.push(arguments);};
                window.__karaAnalyticsConsentGranted = false;
                window.gtag('consent', 'default', {
                  analytics_storage: 'denied',
                  ad_storage: 'denied',
                  ad_user_data: 'denied',
                  ad_personalization: 'denied',
                  wait_for_update: 500
                });
              `}
            </Script>
            {gtmId ? (
              <Script id="gtm-base" strategy="beforeInteractive">
                {`
                  (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                  new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                  'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                  })(window,document,'script','dataLayer','${gtmId}');
                `}
              </Script>
            ) : null}
            {gaId ? (
              <>
                <Script
                  id="ga4-lib"
                  src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
                  strategy="beforeInteractive"
                />
                <Script id="ga4-config" strategy="beforeInteractive">
                  {`
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', '${gaId}', { send_page_view: false });
                  `}
                </Script>
              </>
            ) : null}
          </>
        ) : null}
        <NextIntlClientProvider messages={messages}>
          <SmoothScrollProvider>
            <ModalProvider>{children}</ModalProvider>
          </SmoothScrollProvider>
          <PageViewTracker />
          <CookieConsentBanner />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
