import { getTranslations } from "next-intl/server";
import Image from "next/image";
import Link from "next/link";
import { FaGithub } from "react-icons/fa";
import { NavWaitlistButton } from "./nav-waitlist-button";

export async function MainNav() {
  const t = await getTranslations("nav");
  const navItems = [
    { label: t("orchestration"), href: "/#orchestration" },
    { label: t("features"), href: "/#features" },
    /* { label: t('featureContent'), href: '#feature-content' }, */
    { label: t("integrations"), href: "/#integrations" },
    { label: t("functions"), href: "/#functions" },
    { label: t("roadmap"), href: "/roadmap" },
  ];

  return (
    <nav className="fixed inset-x-0 top-0 z-50 hidden px-4 pt-4 sm:block sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl items-center justify-between rounded-full border border-white/10 bg-neutral-950/85 px-4 py-3 shadow-2xl shadow-black/30 backdrop-blur-xl sm:px-5">
        <Link href="/" className="flex items-center gap-2 sm:gap-3">
          <Image
            src="/logo.png"
            alt="Kara Logo"
            width={40}
            height={40}
            className="h-8 w-auto sm:h-10"
          />
          <span className="hidden text-sm font-semibold tracking-[0.18em] text-white sm:inline">
            KARA
          </span>
        </Link>

        <div className="hidden items-center gap-1 p-1 md:flex">
          {navItems.map((item) =>
            item.href.startsWith("/") ? (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full px-4 py-2 text-sm text-white/65 transition hover:bg-white/8 hover:text-white"
              >
                {item.label}
              </Link>
            ) : (
              <a
                key={item.href}
                href={item.href}
                className="rounded-full px-4 py-2 text-sm text-white/65 transition hover:bg-white/8 hover:text-white"
              >
                {item.label}
              </a>
            ),
          )}
        </div>

        <div className="hidden items-center gap-2 sm:flex">
          <a
            href="https://github.com/karacron/app"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/75 transition hover:border-white/20 hover:bg-white/10 hover:text-white"
          >
            <FaGithub size={16} />
          </a>
          <NavWaitlistButton label={t("cta")} />
        </div>
      </div>
    </nav>
  );
}
