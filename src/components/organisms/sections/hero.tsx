import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { HeroAnimated } from "./hero-animated";

export async function HeroSection() {
  const t = await getTranslations("hero");

  return (
    <div
      id="top"
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-neutral-950"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -top-28 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-indigo-500/30 blur-3xl" />
        <div className="absolute top-1/3 -left-24 h-80 w-80 rounded-full bg-indigo-400/20 blur-3xl" />
        <div className="absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-indigo-600/25 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:44px_44px]" />
        <div className="absolute inset-0 bg-neutral-950/55" />
      </div>

      <div className="z-10 mx-auto max-w-2xl px-6">
        {/* Logo solo en mobile */}
        <div className="sm:hidden flex justify-center mb-8">
          <Image src="/logo.png" alt="Kara Logo" width={100} height={10} />
        </div>

        <HeroAnimated
          badge={t("badge")}
          title={t("title")}
          subtitle={t("subtitle")}
          primaryLabel={t("primary")}
          availableLabel="Disponible en"
        />
      </div>
    </div>
  );
}
