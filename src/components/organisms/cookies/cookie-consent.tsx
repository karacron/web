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

      const isRtlDocument = document.documentElement.dir === "rtl";

      await CookieConsent.run({
        guiOptions: {
          consentModal: {
            layout: "box",
            position: isRtlDocument ? "bottom left" : "bottom right",
          },
          preferencesModal: {
            layout: "box",
            position: isRtlDocument ? "left" : "right",
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
            zh: {
              consentModal: {
                title: "我们使用 Cookie",
                description:
                  "我们使用必要 Cookie 来保证网站运行，并使用可选分析 Cookie 来改进你的体验。",
                acceptAllBtn: "全部接受",
                acceptNecessaryBtn: "仅必要",
                showPreferencesBtn: "管理偏好",
              },
              preferencesModal: {
                title: "Cookie 偏好",
                acceptAllBtn: "全部接受",
                acceptNecessaryBtn: "仅必要",
                savePreferencesBtn: "保存偏好",
                closeIconLabel: "关闭",
                sections: [
                  {
                    title: "Cookie 使用",
                    description:
                      "选择你想允许的 Cookie。必要 Cookie 始终启用。",
                  },
                  {
                    title: "严格必要 Cookie",
                    description: "这些 Cookie 对核心功能是必需的，无法禁用。",
                    linkedCategory: "necessary",
                  },
                  {
                    title: "分析 Cookie",
                    description: "这些 Cookie 帮助我们了解访客如何使用网站。",
                    linkedCategory: "analytics",
                  },
                ],
              },
            },
            nl: {
              consentModal: {
                title: "Wij gebruiken cookies",
                description:
                  "We gebruiken essentiële cookies voor de werking van de site en optionele analytische cookies om je ervaring te verbeteren.",
                acceptAllBtn: "Alles accepteren",
                acceptNecessaryBtn: "Alleen noodzakelijk",
                showPreferencesBtn: "Voorkeuren beheren",
              },
              preferencesModal: {
                title: "Cookievoorkeuren",
                acceptAllBtn: "Alles accepteren",
                acceptNecessaryBtn: "Alleen noodzakelijk",
                savePreferencesBtn: "Voorkeuren opslaan",
                closeIconLabel: "Sluiten",
                sections: [
                  {
                    title: "Cookiegebruik",
                    description:
                      "Kies welke cookies je wilt toestaan. Noodzakelijke cookies zijn altijd actief.",
                  },
                  {
                    title: "Strikt noodzakelijke cookies",
                    description:
                      "Deze cookies zijn vereist voor kernfunctionaliteit en kunnen niet worden uitgeschakeld.",
                    linkedCategory: "necessary",
                  },
                  {
                    title: "Analytische cookies",
                    description:
                      "Deze cookies helpen ons te begrijpen hoe bezoekers de website gebruiken.",
                    linkedCategory: "analytics",
                  },
                ],
              },
            },
            fr: {
              consentModal: {
                title: "Nous utilisons des cookies",
                description:
                  "Nous utilisons des cookies essentiels pour le fonctionnement du site et des cookies d'analyse facultatifs pour améliorer votre expérience.",
                acceptAllBtn: "Tout accepter",
                acceptNecessaryBtn: "Uniquement nécessaires",
                showPreferencesBtn: "Gérer les préférences",
              },
              preferencesModal: {
                title: "Préférences des cookies",
                acceptAllBtn: "Tout accepter",
                acceptNecessaryBtn: "Uniquement nécessaires",
                savePreferencesBtn: "Enregistrer les préférences",
                closeIconLabel: "Fermer",
                sections: [
                  {
                    title: "Utilisation des cookies",
                    description:
                      "Choisissez les cookies que vous souhaitez autoriser. Les cookies nécessaires sont toujours actifs.",
                  },
                  {
                    title: "Cookies strictement nécessaires",
                    description:
                      "Ces cookies sont requis pour les fonctionnalités principales et ne peuvent pas être désactivés.",
                    linkedCategory: "necessary",
                  },
                  {
                    title: "Cookies d'analyse",
                    description:
                      "Ces cookies nous aident à comprendre comment les visiteurs utilisent le site.",
                    linkedCategory: "analytics",
                  },
                ],
              },
            },
            ja: {
              consentModal: {
                title: "Cookie を使用しています",
                description:
                  "サイト運用のために必須 Cookie を使用し、体験向上のために任意の分析 Cookie を使用します。",
                acceptAllBtn: "すべて許可",
                acceptNecessaryBtn: "必須のみ",
                showPreferencesBtn: "設定を管理",
              },
              preferencesModal: {
                title: "Cookie 設定",
                acceptAllBtn: "すべて許可",
                acceptNecessaryBtn: "必須のみ",
                savePreferencesBtn: "設定を保存",
                closeIconLabel: "閉じる",
                sections: [
                  {
                    title: "Cookie の利用",
                    description:
                      "許可する Cookie を選択してください。必須 Cookie は常に有効です。",
                  },
                  {
                    title: "必須 Cookie",
                    description:
                      "これらの Cookie は主要機能に必要であり、無効にできません。",
                    linkedCategory: "necessary",
                  },
                  {
                    title: "分析 Cookie",
                    description:
                      "これらの Cookie は訪問者のサイト利用状況の把握に役立ちます。",
                    linkedCategory: "analytics",
                  },
                ],
              },
            },
            de: {
              consentModal: {
                title: "Wir verwenden Cookies",
                description:
                  "Wir verwenden notwendige Cookies für den Betrieb der Website und optionale Analyse-Cookies, um Ihre Erfahrung zu verbessern.",
                acceptAllBtn: "Alle akzeptieren",
                acceptNecessaryBtn: "Nur notwendige",
                showPreferencesBtn: "Einstellungen verwalten",
              },
              preferencesModal: {
                title: "Cookie-Einstellungen",
                acceptAllBtn: "Alle akzeptieren",
                acceptNecessaryBtn: "Nur notwendige",
                savePreferencesBtn: "Einstellungen speichern",
                closeIconLabel: "Schließen",
                sections: [
                  {
                    title: "Cookie-Nutzung",
                    description:
                      "Wählen Sie aus, welche Cookies Sie zulassen möchten. Notwendige Cookies sind immer aktiv.",
                  },
                  {
                    title: "Unbedingt erforderliche Cookies",
                    description:
                      "Diese Cookies sind für Kernfunktionen erforderlich und können nicht deaktiviert werden.",
                    linkedCategory: "necessary",
                  },
                  {
                    title: "Analyse-Cookies",
                    description:
                      "Diese Cookies helfen uns zu verstehen, wie Besucher die Website nutzen.",
                    linkedCategory: "analytics",
                  },
                ],
              },
            },
            it: {
              consentModal: {
                title: "Usiamo i cookie",
                description:
                  "Usiamo cookie essenziali per il funzionamento del sito e cookie analitici facoltativi per migliorare la tua esperienza.",
                acceptAllBtn: "Accetta tutto",
                acceptNecessaryBtn: "Solo necessari",
                showPreferencesBtn: "Gestisci preferenze",
              },
              preferencesModal: {
                title: "Preferenze cookie",
                acceptAllBtn: "Accetta tutto",
                acceptNecessaryBtn: "Solo necessari",
                savePreferencesBtn: "Salva preferenze",
                closeIconLabel: "Chiudi",
                sections: [
                  {
                    title: "Uso dei cookie",
                    description:
                      "Scegli quali cookie vuoi consentire. I cookie necessari sono sempre attivi.",
                  },
                  {
                    title: "Cookie strettamente necessari",
                    description:
                      "Questi cookie sono necessari per le funzionalità principali e non possono essere disattivati.",
                    linkedCategory: "necessary",
                  },
                  {
                    title: "Cookie analitici",
                    description:
                      "Questi cookie ci aiutano a capire come i visitatori usano il sito web.",
                    linkedCategory: "analytics",
                  },
                ],
              },
            },
            hi: {
              consentModal: {
                title: "हम कुकीज़ का उपयोग करते हैं",
                description:
                  "साइट चलाने के लिए हम आवश्यक कुकीज़ और अनुभव बेहतर करने के लिए वैकल्पिक एनालिटिक्स कुकीज़ का उपयोग करते हैं।",
                acceptAllBtn: "सभी स्वीकार करें",
                acceptNecessaryBtn: "केवल आवश्यक",
                showPreferencesBtn: "प्राथमिकताएं प्रबंधित करें",
              },
              preferencesModal: {
                title: "कुकी प्राथमिकताएं",
                acceptAllBtn: "सभी स्वीकार करें",
                acceptNecessaryBtn: "केवल आवश्यक",
                savePreferencesBtn: "प्राथमिकताएं सहेजें",
                closeIconLabel: "बंद करें",
                sections: [
                  {
                    title: "कुकी उपयोग",
                    description:
                      "चुनें कि आप कौन-सी कुकीज़ की अनुमति देना चाहते हैं। आवश्यक कुकीज़ हमेशा सक्रिय रहती हैं।",
                  },
                  {
                    title: "सख्ती से आवश्यक कुकीज़",
                    description:
                      "ये कुकीज़ मुख्य कार्यक्षमता के लिए आवश्यक हैं और इन्हें बंद नहीं किया जा सकता।",
                    linkedCategory: "necessary",
                  },
                  {
                    title: "एनालिटिक्स कुकीज़",
                    description:
                      "ये कुकीज़ हमें समझने में मदद करती हैं कि विज़िटर वेबसाइट का उपयोग कैसे करते हैं।",
                    linkedCategory: "analytics",
                  },
                ],
              },
            },
            ar: {
              consentModal: {
                title: "نستخدم ملفات تعريف الارتباط",
                description:
                  "نستخدم ملفات تعريف الارتباط الضرورية لتشغيل الموقع وملفات تحليلية اختيارية لتحسين تجربتك.",
                acceptAllBtn: "قبول الكل",
                acceptNecessaryBtn: "الضرورية فقط",
                showPreferencesBtn: "إدارة التفضيلات",
              },
              preferencesModal: {
                title: "تفضيلات ملفات تعريف الارتباط",
                acceptAllBtn: "قبول الكل",
                acceptNecessaryBtn: "الضرورية فقط",
                savePreferencesBtn: "حفظ التفضيلات",
                closeIconLabel: "إغلاق",
                sections: [
                  {
                    title: "استخدام ملفات تعريف الارتباط",
                    description:
                      "اختر ملفات تعريف الارتباط التي تريد السماح بها. الملفات الضرورية تكون مفعلة دائمًا.",
                  },
                  {
                    title: "ملفات تعريف الارتباط الضرورية للغاية",
                    description:
                      "هذه الملفات مطلوبة للوظائف الأساسية ولا يمكن تعطيلها.",
                    linkedCategory: "necessary",
                  },
                  {
                    title: "ملفات تعريف الارتباط التحليلية",
                    description:
                      "تساعدنا هذه الملفات على فهم كيفية استخدام الزوار للموقع.",
                    linkedCategory: "analytics",
                  },
                ],
              },
            },
            ru: {
              consentModal: {
                title: "Мы используем cookie",
                description:
                  "Мы используем обязательные cookie для работы сайта и необязательные аналитические cookie для улучшения вашего опыта.",
                acceptAllBtn: "Принять все",
                acceptNecessaryBtn: "Только необходимые",
                showPreferencesBtn: "Управлять настройками",
              },
              preferencesModal: {
                title: "Настройки cookie",
                acceptAllBtn: "Принять все",
                acceptNecessaryBtn: "Только необходимые",
                savePreferencesBtn: "Сохранить настройки",
                closeIconLabel: "Закрыть",
                sections: [
                  {
                    title: "Использование cookie",
                    description:
                      "Выберите, какие cookie вы хотите разрешить. Необходимые cookie всегда активны.",
                  },
                  {
                    title: "Строго необходимые cookie",
                    description:
                      "Эти cookie требуются для основной функциональности и не могут быть отключены.",
                    linkedCategory: "necessary",
                  },
                  {
                    title: "Аналитические cookie",
                    description:
                      "Эти cookie помогают нам понять, как посетители используют сайт.",
                    linkedCategory: "analytics",
                  },
                ],
              },
            },
            tr: {
              consentModal: {
                title: "Çerez kullanıyoruz",
                description:
                  "Site çalışması için gerekli çerezleri ve deneyiminizi iyileştirmek için isteğe bağlı analiz çerezlerini kullanıyoruz.",
                acceptAllBtn: "Tümünü kabul et",
                acceptNecessaryBtn: "Yalnızca gerekli",
                showPreferencesBtn: "Tercihleri yönet",
              },
              preferencesModal: {
                title: "Çerez tercihleri",
                acceptAllBtn: "Tümünü kabul et",
                acceptNecessaryBtn: "Yalnızca gerekli",
                savePreferencesBtn: "Tercihleri kaydet",
                closeIconLabel: "Kapat",
                sections: [
                  {
                    title: "Çerez kullanımı",
                    description:
                      "Hangi çerezlere izin vermek istediğinizi seçin. Gerekli çerezler her zaman etkindir.",
                  },
                  {
                    title: "Kesinlikle gerekli çerezler",
                    description:
                      "Bu çerezler temel işlevler için gereklidir ve devre dışı bırakılamaz.",
                    linkedCategory: "necessary",
                  },
                  {
                    title: "Analiz çerezleri",
                    description:
                      "Bu çerezler ziyaretçilerin web sitesini nasıl kullandığını anlamamıza yardımcı olur.",
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
