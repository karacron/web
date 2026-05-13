import { getTranslations } from "next-intl/server";
import Image from "next/image";

const WAITLIST_MAILTO = "mailto:sgonzalez@authuser.org?subject=Kara%20waitlist";

export async function MainNav() {
  const t = await getTranslations("nav");
  const navItems = [
    { label: t("features"), href: "#features" },
    { label: t("orchestration"), href: "#orchestration" },
    { label: t("integrations"), href: "#integrations" },
    { label: t("execution"), href: "#execution" },
  ];

  return (
    <nav className="fixed inset-x-0 top-0 z-50 hidden px-4 pt-4 sm:block sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl items-center justify-between rounded-full border border-white/10 bg-neutral-950/85 px-4 py-3 shadow-2xl shadow-black/30 backdrop-blur-xl sm:px-5">
        <a href="#top" className="flex items-center gap-2 sm:gap-3">
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
        </a>

        <div className="hidden items-center gap-1 p-1 md:flex">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-full px-4 py-2 text-sm text-white/65 transition hover:bg-white/8 hover:text-white"
            >
              {item.label}
            </a>
          ))}
        </div>

        <a
          href={WAITLIST_MAILTO}
          className="hidden items-center whitespace-nowrap rounded-xl bg-indigo-500 px-3 py-2 text-xs font-semibold text-white shadow-lg shadow-indigo-900/30 transition hover:bg-indigo-400 sm:inline-flex sm:px-4 sm:text-sm"
        >
          {t("cta")}
        </a>
      </div>
    </nav>
  );
}
