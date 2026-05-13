import type { Locale } from "@i18n/routing";
import { getLocale, getTranslations } from "next-intl/server";
import Image from "next/image";
import { FooterSocial } from "./social";

const COMPANY_LINKS = {
  about: "#top",
  roadmap: "#integrations",
  privacy: "#execution",
  contact: "mailto:sgonzalez@authuser.org",
} as const;

export async function Footer() {
  const t = await getTranslations("footer");
  const locale = (await getLocale()) as Locale;
  const productLinks = [
    { key: "features", href: "#features" },
    { key: "orchestration", href: "#orchestration" },
    { key: "integrations", href: "#integrations" },
    { key: "execution", href: "#execution" },
  ] as const;
  const companyLinks = ["about", "roadmap", "contact"] as const;

  return (
    <div className="bg-gray-900 pb-20 sm:pb-24">
      <footer className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="rounded-3xl p-6 backdrop-blur-sm sm:p-8 lg:p-10">
          <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-[1.4fr_1fr_1fr]">
            <div className="text-center sm:col-span-2 sm:text-left md:col-span-1">
              <div className="flex items-center justify-center gap-3 sm:justify-start">
                <Image
                  src="/logo.png"
                  alt="Kara"
                  width={40}
                  height={40}
                  className="h-10 w-auto"
                />
                <span className="text-sm font-semibold tracking-[0.18em] text-white">
                  KARA
                </span>
              </div>
              <h3 className="mt-4 text-2xl font-semibold tracking-tight text-white sm:text-3xl text-balance">
                {t("title")}
              </h3>
              <p className="mt-4 max-w-md text-sm/7 text-gray-300 sm:max-w-none md:max-w-md text-balance">
                {t("subtitle")}
              </p>
            </div>

            <div className="hidden sm:block sm:text-left">
              <p className="text-sm font-semibold text-white">
                {t("sections.product")}
              </p>
              <ul className="mt-4 space-y-3 text-sm text-gray-300">
                {productLinks.map((link) => (
                  <li key={link.key}>
                    <a href={link.href} className="transition hover:text-white">
                      {t(`links.${link.key}`)}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="hidden sm:block sm:text-left">
              <p className="text-sm font-semibold text-white">
                {t("sections.company")}
              </p>
              <ul className="mt-4 space-y-3 text-sm text-gray-300">
                {companyLinks.map((link) => (
                  <li key={link}>
                    <a
                      href={COMPANY_LINKS[link]}
                      className="transition hover:text-white"
                    >
                      {t(`links.${link}`)}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <hr className="mt-10 border-white/10" />
          <FooterSocial
            rights={t("rights")}
            language={t("language.button")}
            cookies={t("cookies")}
            languageTitle={t("language.modalTitle")}
            languageClose={t("language.close")}
            languageModalI18n={{
              heading: t("language.modal.heading"),
              description: t("language.modal.description"),
              searchPlaceholder: t("language.modal.searchPlaceholder"),
              clearSearchLabel: t("language.modal.clearSearchLabel"),
              activeLabel: t("language.modal.activeLabel"),
              updatingLabel: t("language.modal.updatingLabel"),
              noResultsTitle: t("language.modal.noResultsTitle"),
              noResultsHint: t("language.modal.noResultsHint"),
            }}
            currentLocale={locale}
            languageOptions={[
              { code: "en", label: t("language.options.en") },
              { code: "es", label: t("language.options.es") },
            ]}
          />
        </div>
      </footer>
    </div>
  );
}
