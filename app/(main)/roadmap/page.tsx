import {
  ArrowUpRight,
  Bot,
  Boxes,
  Cloud,
  Languages,
  Rocket,
  ShieldCheck,
  Workflow,
} from "lucide-react";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

const timelineKeys = [
  "may",
  "jun",
  "jul",
  "aug",
  "sep",
  "oct",
  "nov",
  "dec",
] as const;

const mvpIncludedKeys = [
  "desktop",
  "ui",
  "updates",
  "i18n",
  "docs",
  "localModels",
  "channels",
  "tools",
] as const;

const mvpExcludedKeys = ["fullCloud", "enterprise"] as const;

const phaseIcons = {
  platform: Boxes,
  experience: Workflow,
  trust: ShieldCheck,
  ai: Bot,
  cloud: Cloud,
  launch: Rocket,
  language: Languages,
} as const;

const phaseKeys = [
  "platform",
  "experience",
  "trust",
  "language",
  "ai",
  "cloud",
  "launch",
] as const;

export default async function RoadMapPage() {
  const t = await getTranslations("roadmap");

  return (
    <>
      <section className="relative isolate overflow-hidden bg-neutral-950 pb-18 pt-28 sm:pb-22 sm:pt-34">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
        >
          <div className="absolute -top-20 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-indigo-500/30 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl" />
          <div className="absolute right-0 top-20 h-64 w-64 rounded-full bg-violet-500/20 blur-3xl" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:48px_48px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center rounded-full border border-indigo-400/30 bg-indigo-500/10 px-4 py-1 text-xs font-semibold tracking-[0.14em] text-indigo-300 uppercase">
              {t("hero.badge")}
            </span>
            <h1 className="mt-6 text-balance text-4xl font-semibold tracking-tight text-white sm:text-6xl">
              {t("hero.title")}
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg/8 text-gray-300">
              {t("hero.subtitle")}
            </p>
          </div>

          <div className="mx-auto mt-10 grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs font-semibold tracking-widest text-indigo-300 uppercase">
                {t("hero.cards.timeline.label")}
              </p>
              <p className="mt-2 text-sm/6 text-gray-200">
                {t("hero.cards.timeline.value")}
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs font-semibold tracking-widest text-indigo-300 uppercase">
                {t("hero.cards.mvp.label")}
              </p>
              <p className="mt-2 text-sm/6 text-gray-200">
                {t("hero.cards.mvp.value")}
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs font-semibold tracking-widest text-indigo-300 uppercase">
                {t("hero.cards.goal.label")}
              </p>
              <p className="mt-2 text-sm/6 text-gray-200">
                {t("hero.cards.goal.value")}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gray-900 py-16 sm:py-20" id="timeline">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base/7 font-semibold text-indigo-400">
              {t("timeline.eyebrow")}
            </h2>
            <p className="mt-2 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              {t("timeline.title")}
            </p>
            <p className="mt-6 text-lg/8 text-gray-300">
              {t("timeline.subtitle")}
            </p>
          </div>

          <div className="mx-auto mt-12 max-w-5xl">
            <ol className="relative border-l border-white/10 pl-6 sm:pl-8">
              {timelineKeys.map((key) => (
                <li key={key} className="group relative mb-10 last:mb-0">
                  <span className="absolute -left-[33px] top-1.5 h-3.5 w-3.5 rounded-full border border-indigo-300/60 bg-indigo-500/60 shadow-[0_0_0_6px_rgba(79,70,229,0.12)] sm:-left-[41px]" />
                  <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/6 to-white/2 p-5 transition duration-300 group-hover:border-indigo-300/40 group-hover:bg-white/8 sm:p-6">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <h3 className="text-xl font-semibold text-white">
                        {t(`timeline.items.${key}.month`)}
                      </h3>
                      <span className="rounded-full border border-indigo-300/35 bg-indigo-500/12 px-3 py-1 text-xs font-medium tracking-wide text-indigo-200">
                        {t(`timeline.items.${key}.status`)}
                      </span>
                    </div>
                    <p className="mt-3 text-sm/7 text-gray-300">
                      {t(`timeline.items.${key}.goal`)}
                    </p>
                    <p className="mt-3 text-sm/7 text-gray-400">
                      {t(`timeline.items.${key}.deliverable`)}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="bg-neutral-950 py-16 sm:py-20" id="mvp">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base/7 font-semibold text-indigo-400">
              {t("mvp.eyebrow")}
            </h2>
            <p className="mt-2 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              {t("mvp.title")}
            </p>
            <p className="mt-6 text-lg/8 text-gray-300">{t("mvp.subtitle")}</p>
          </div>

          <div className="mx-auto mt-12 grid max-w-6xl grid-cols-1 gap-6 lg:grid-cols-2">
            <article className="rounded-3xl border border-emerald-400/30 bg-emerald-500/10 p-6">
              <h3 className="text-lg font-semibold text-emerald-200">
                {t("mvp.includedTitle")}
              </h3>
              <ul className="mt-4 space-y-3 text-sm/7 text-emerald-50/90">
                {mvpIncludedKeys.map((key) => (
                  <li key={key} className="flex items-start gap-2">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-emerald-300" />
                    <span>{t(`mvp.included.${key}`)}</span>
                  </li>
                ))}
              </ul>
            </article>

            <article className="rounded-3xl border border-amber-400/30 bg-amber-500/10 p-6">
              <h3 className="text-lg font-semibold text-amber-100">
                {t("mvp.excludedTitle")}
              </h3>
              <ul className="mt-4 space-y-3 text-sm/7 text-amber-50/90">
                {mvpExcludedKeys.map((key) => (
                  <li key={key} className="flex items-start gap-2">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-amber-200" />
                    <span>{t(`mvp.excluded.${key}`)}</span>
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </div>
      </section>

      <section className="bg-gray-900 py-16 sm:py-20" id="phases">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base/7 font-semibold text-indigo-400">
              {t("phases.eyebrow")}
            </h2>
            <p className="mt-2 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              {t("phases.title")}
            </p>
            <p className="mt-6 text-lg/8 text-gray-300">
              {t("phases.subtitle")}
            </p>
          </div>

          <div className="mx-auto mt-12 grid max-w-6xl grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {phaseKeys.map((key) => {
              const Icon = phaseIcons[key];

              return (
                <article
                  key={key}
                  className="rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:border-indigo-300/35 hover:bg-white/8"
                >
                  <div className="inline-flex rounded-lg bg-indigo-500/20 p-2 text-indigo-200">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-white">
                    {t(`phases.items.${key}.title`)}
                  </h3>
                  <p className="mt-2 text-sm/7 text-gray-300">
                    {t(`phases.items.${key}.description`)}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-neutral-950 py-16 sm:py-20" id="next">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="rounded-3xl border border-white/10 bg-gradient-to-r from-indigo-500/16 via-violet-500/12 to-cyan-500/16 p-8 sm:p-10">
            <p className="text-sm font-semibold tracking-[0.18em] text-indigo-200 uppercase">
              {t("cta.eyebrow")}
            </p>
            <h2 className="mt-3 max-w-3xl text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              {t("cta.title")}
            </h2>
            <p className="mt-4 max-w-2xl text-sm/7 text-gray-200 sm:text-base/8">
              {t("cta.subtitle")}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/#integrations"
                className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-neutral-900 transition hover:bg-white/90"
              >
                {t("cta.primary")}
                <ArrowUpRight className="h-4 w-4" />
              </Link>
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-full border border-white/25 px-5 py-2.5 text-sm font-semibold text-white transition hover:border-white/45 hover:bg-white/10"
              >
                {t("cta.secondary")}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
