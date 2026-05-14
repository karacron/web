"use client";

import { useEffect } from "react";

type CookieConsentCategoryCookie = {
  categories?: string[];
};

type GoogleAnalyticsWindow = Window & {
  gtag?: (...args: unknown[]) => void;
  __karaAnalyticsConsentGranted?: boolean;
};

function hasAnalyticsConsent(cookie: CookieConsentCategoryCookie | undefined) {
  return cookie?.categories?.includes("analytics") ?? false;
}

function updateGoogleAnalyticsConsent(allowed: boolean) {
  const globalWindow = window as GoogleAnalyticsWindow;
  globalWindow.__karaAnalyticsConsentGranted = allowed;

  if (typeof globalWindow.gtag !== "function") {
    return;
  }

  globalWindow.gtag("consent", "update", {
    analytics_storage: allowed ? "granted" : "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });
}

export function CookieConsentBanner() {
  useEffect(() => {
    let isMounted = true;

    const setupCookieConsent = async () => {
      const cookieConsentModule = await import("vanilla-cookieconsent");
      const CookieConsent = (cookieConsentModule.default ??
        cookieConsentModule) as {
        run?: (config: unknown) => Promise<void>;
      };

      if (!isMounted || typeof CookieConsent.run !== "function") {
        return;
      }

      const syncGoogleAnalytics = (cookie: CookieConsentCategoryCookie) => {
        const analyticsEnabled = hasAnalyticsConsent(cookie);
        updateGoogleAnalyticsConsent(analyticsEnabled);
      };

      await CookieConsent.run({
        guiOptions: {
          consentModal: {
            layout: "box",
            position: "bottom right",
          },
          preferencesModal: {
            layout: "box",
            position: "right",
          },
        },
        categories: {
          necessary: {
            enabled: true,
            readOnly: true,
          },
          analytics: {},
        },
        language: {
          default: "en",
          autoDetect: "document",
          translations: {
            en: {
              consentModal: {
                title: "We use cookies",
                description:
                  "We use essential cookies for site operation and optional analytics cookies to improve your experience.",
                acceptAllBtn: "Accept all",
                acceptNecessaryBtn: "Only necessary",
                showPreferencesBtn: "Manage preferences",
              },
              preferencesModal: {
                title: "Cookie preferences",
                acceptAllBtn: "Accept all",
                acceptNecessaryBtn: "Only necessary",
                savePreferencesBtn: "Save preferences",
                closeIconLabel: "Close",
                sections: [
                  {
                    title: "Cookie usage",
                    description:
                      "Choose which cookies you want to allow. Necessary cookies are always active.",
                  },
                  {
                    title: "Strictly necessary cookies",
                    description:
                      "These cookies are required for core functionality and cannot be disabled.",
                    linkedCategory: "necessary",
                  },
                  {
                    title: "Analytics cookies",
                    description:
                      "These cookies help us understand how visitors use the website.",
                    linkedCategory: "analytics",
                  },
                ],
              },
            },
            es: {
              consentModal: {
                title: "Usamos cookies",
                description:
                  "Usamos cookies esenciales para que el sitio funcione y cookies de analitica opcionales para mejorar tu experiencia.",
                acceptAllBtn: "Aceptar todo",
                acceptNecessaryBtn: "Solo necesarias",
                showPreferencesBtn: "Gestionar preferencias",
              },
              preferencesModal: {
                title: "Preferencias de cookies",
                acceptAllBtn: "Aceptar todo",
                acceptNecessaryBtn: "Solo necesarias",
                savePreferencesBtn: "Guardar preferencias",
                closeIconLabel: "Cerrar",
                sections: [
                  {
                    title: "Uso de cookies",
                    description:
                      "Elige que cookies quieres permitir. Las cookies necesarias siempre estan activas.",
                  },
                  {
                    title: "Cookies estrictamente necesarias",
                    description:
                      "Estas cookies son necesarias para el funcionamiento basico y no se pueden desactivar.",
                    linkedCategory: "necessary",
                  },
                  {
                    title: "Cookies de analitica",
                    description:
                      "Estas cookies nos ayudan a entender como se usa el sitio web.",
                    linkedCategory: "analytics",
                  },
                ],
              },
            },
          },
        },
        onConsent: ({ cookie }: { cookie: CookieConsentCategoryCookie }) => {
          syncGoogleAnalytics(cookie);
        },
        onChange: ({ cookie }: { cookie: CookieConsentCategoryCookie }) => {
          syncGoogleAnalytics(cookie);
        },
      });
    };

    void setupCookieConsent().catch(() => {
      // Avoid unhandled promise rejections in case consent setup fails.
    });

    return () => {
      isMounted = false;
    };
  }, []);

  return null;
}
