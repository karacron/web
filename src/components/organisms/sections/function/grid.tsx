import { Bot, MessagesSquare, MicVocal, Sparkles } from "lucide-react";
import { getTranslations } from "next-intl/server";

const functionIcons = {
  voice: MicVocal,
  channels: MessagesSquare,
  media: Sparkles,
  assistant: Bot,
} as const;

export async function FunctionGrid() {
  const t = await getTranslations("functions");
  const items = ["voice", "channels", "media", "assistant"] as const;

  return (
    <div id="functions" className="bg-gray-900 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base/7 font-semibold text-indigo-400">
            {t("eyebrow")}
          </h2>
          <p className="mt-2 text-4xl font-semibold tracking-tight text-pretty text-white sm:text-5xl lg:text-balance">
            {t("title")}
          </p>
          <p className="mt-6 text-lg/8 text-gray-300">{t("subtitle")}</p>
        </div>
        <div className="mx-auto mt-12 max-w-2xl sm:mt-14 lg:mt-16 lg:max-w-4xl">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
            {items.map((item) => {
              const Icon = functionIcons[item];

              return (
                <div key={item} className="relative pl-16">
                  <dt className="text-base/7 font-semibold text-white">
                    <div className="absolute top-0 left-0 flex size-10 items-center justify-center rounded-lg bg-indigo-500">
                      <Icon aria-hidden="true" className="size-5 text-white" />
                    </div>
                    {t(`items.${item}.title`)}
                  </dt>
                  <dd className="mt-2 text-base/7 text-gray-400">
                    {t(`items.${item}.description`)}
                  </dd>
                </div>
              );
            })}
          </dl>
        </div>
      </div>
    </div>
  );
}
