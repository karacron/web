import { getTranslations } from "next-intl/server";
import Image from "next/image";
import Marquee from "react-fast-marquee";

const integrations = [
  {
    key: "googleDrive",
    name: "Google Drive",
    logo: "https://cdn.simpleicons.org/googledrive/ffffff",
  },
  {
    key: "github",
    name: "GitHub",
    logo: "https://cdn.simpleicons.org/github/ffffff",
  },
  {
    key: "notion",
    name: "Notion",
    logo: "https://cdn.simpleicons.org/notion/ffffff",
  },
  {
    key: "discord",
    name: "Discord",
    logo: "https://cdn.simpleicons.org/discord/ffffff",
  },
  {
    key: "dropbox",
    name: "Dropbox",
    logo: "https://cdn.simpleicons.org/dropbox/ffffff",
  },
  {
    key: "linear",
    name: "Linear",
    logo: "https://cdn.simpleicons.org/linear/ffffff",
  },
  {
    key: "trello",
    name: "Trello",
    logo: "https://cdn.simpleicons.org/trello/ffffff",
  },
  {
    key: "slack",
    name: "Slack",
    logo: "https://cdn.simpleicons.org/slack/ffffff",
  },
  {
    key: "figma",
    name: "Figma",
    logo: "https://cdn.simpleicons.org/figma/ffffff",
  },
  {
    key: "jira",
    name: "Jira",
    logo: "https://cdn.simpleicons.org/jira/ffffff",
  },
  {
    key: "asana",
    name: "Asana",
    logo: "https://cdn.simpleicons.org/asana/ffffff",
  },
  {
    key: "hubspot",
    name: "HubSpot",
    logo: "https://cdn.simpleicons.org/hubspot/ffffff",
  },
  {
    key: "zendesk",
    name: "Zendesk",
    logo: "https://cdn.simpleicons.org/zendesk/ffffff",
  },
  {
    key: "stripe",
    name: "Stripe",
    logo: "https://cdn.simpleicons.org/stripe/ffffff",
  },
  {
    key: "shopify",
    name: "Shopify",
    logo: "https://cdn.simpleicons.org/shopify/ffffff",
  },
  {
    key: "airtable",
    name: "Airtable",
    logo: "https://cdn.simpleicons.org/airtable/ffffff",
  },
  {
    key: "clickup",
    name: "ClickUp",
    logo: "https://cdn.simpleicons.org/clickup/ffffff",
  },
] as const;

export async function IntegrationsSection() {
  const t = await getTranslations("integrations.marquee");

  return (
    <section className="bg-gray-900 py-5">
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-gray-900 to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-gray-900 to-transparent" />

        <Marquee speed={40} pauseOnHover autoFill gradient={false}>
          {integrations.map((integration) => (
            <div
              key={integration.name}
              className="mx-4 flex min-w-64 items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-black/20">
                <Image
                  src={integration.logo}
                  alt={integration.name}
                  width={24}
                  height={24}
                  className="h-6 w-6 object-contain"
                />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white">
                  {integration.name}
                </p>
                <p className="truncate text-xs text-gray-400">
                  {t(`${integration.key}.description`)}
                </p>
              </div>
            </div>
          ))}
        </Marquee>
      </div>
    </section>
  );
}
