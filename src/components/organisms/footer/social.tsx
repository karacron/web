import { Cookie, Mail } from "lucide-react";
import { FaGithub, FaLinkedinIn } from "react-icons/fa";
import {
  FooterLanguageSwitcher,
  type LanguageModalI18n,
} from "./language-switcher";

const SOCIAL_LINKS = [
  {
    label: "GitHub",
    href: "https://github.com/karacron/app",
    target: "_blank",
    Icon: FaGithub,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/sergio-gonzalez-full-stack/",
    target: "_blank",
    Icon: FaLinkedinIn,
  },
  {
    label: "Mail",
    href: "mailto:sgonzalez@authuser.org",
    Icon: Mail,
  },
];

type FooterSocialProps = {
  rights: string;
  language: string;
  cookies: string;
  languageTitle: string;
  languageClose: string;
  languageModalI18n: LanguageModalI18n;
  currentLocale: "en" | "es";
  languageOptions: Array<{
    code: "en" | "es";
    label: string;
  }>;
};

export function FooterSocial({
  rights,
  language,
  cookies,
  languageTitle,
  languageClose,
  languageModalI18n,
  currentLocale,
  languageOptions,
}: FooterSocialProps) {
  return (
    <div className="flex flex-col gap-4 pt-6 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
      <p className="text-sm text-white/55 text-balance">
        © 2026 Kara. {rights}
      </p>

      <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-end">
        <button
          type="button"
          data-cc="show-preferencesModal"
          aria-label={cookies}
          title={cookies}
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/70 transition hover:border-white/20 hover:bg-white/10 hover:text-white"
        >
          <Cookie size={18} strokeWidth={1.8} />
        </button>
        <FooterLanguageSwitcher
          buttonLabel={language}
          modalTitle={languageTitle}
          closeLabel={languageClose}
          modalI18n={languageModalI18n}
          currentLocale={currentLocale}
          options={languageOptions}
        />
        {SOCIAL_LINKS.map(({ label, href, Icon, target }) => (
          <a
            key={label}
            href={href}
            target={target}
            rel={target === "_blank" ? "noopener noreferrer" : undefined}
            aria-label={label}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/70 transition hover:border-white/20 hover:bg-white/10 hover:text-white"
          >
            <Icon size={18} strokeWidth={1.8} />
          </a>
        ))}
      </div>
    </div>
  );
}
