import { WaitlistCtaButton } from "@atom/waitlist-cta-button";
import { getTranslations } from "next-intl/server";
import Image from "next/image";

export async function CtaSection() {
  const t = await getTranslations("integrations");

  return (
    <div id="integrations" className="bg-gray-900">
      <div className="mx-auto max-w-7xl py-24 sm:px-6 sm:py-32 lg:px-8">
        <div className="relative isolate overflow-hidden bg-gray-800 px-6 pt-16 after:pointer-events-none after:absolute after:inset-0 after:inset-ring after:inset-ring-white/10 sm:rounded-3xl sm:px-16 after:sm:rounded-3xl md:pt-24 lg:flex lg:gap-x-20 lg:px-24 lg:pt-0">
          <div className="mx-auto max-w-md text-center lg:mx-0 lg:flex-auto lg:py-32 lg:text-left">
            <p className="text-sm font-semibold tracking-[0.18em] text-indigo-400">
              {t("eyebrow")}
            </p>
            <h2 className="text-3xl font-semibold tracking-tight text-balance text-white sm:text-4xl">
              {t("title")}
            </h2>
            <p className="mt-6 text-lg/8 text-pretty text-gray-300">
              {t("subtitle")}
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6 lg:justify-start">
              <WaitlistCtaButton label={t("primary")} variant="primary" />
            </div>
          </div>
          <div className="relative mt-16 h-72 sm:h-80 lg:mt-8">
            <Image
              width={1824}
              height={1080}
              src="/dashboard.png"
              loading="eager"
              alt={t("imageAlt")}
              className="mx-auto h-full w-full max-w-xl rounded-md bg-white/5 object-cover ring-1 ring-white/10 lg:absolute lg:top-0 lg:left-0 lg:h-auto lg:w-228 lg:max-w-none lg:object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
