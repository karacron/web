import type { Locale } from "@i18n/routing";

type AsideQuickLink = {
  label: string;
  href: string;
};

type AsideCopy = {
  title: string;
  description: string;
  quickLinks: AsideQuickLink[];
};

type AsideMenuConfig = Partial<Record<Locale, AsideCopy>> & {
  en: AsideCopy;
};

const DEFAULT_CONFIG: AsideMenuConfig = {
  en: {
    title: "Blog menu",
    description: "Navigate this section and jump to related topics.",
    quickLinks: [],
  },
  es: {
    title: "Menu del blog",
    description: "Navega esta seccion y salta a temas relacionados.",
    quickLinks: [],
  },
};

const CONTENT_ASIDE_CONFIG: Record<string, AsideMenuConfig> = {
  models: {
    en: {
      title: "Models",
      description:
        "Model families, capabilities and practical orchestration patterns.",
      quickLinks: [{ label: "All models", href: "/models" }],
    },
    es: {
      title: "Modelos",
      description:
        "Familias de modelos, capacidades y patrones de orquestacion.",
      quickLinks: [{ label: "Todos los modelos", href: "/models" }],
    },
  },
  channels: {
    en: {
      title: "Channels",
      description: "Connectors, channel operations and deployment checklists.",
      quickLinks: [{ label: "All channels", href: "/channels" }],
    },
    es: {
      title: "Canales",
      description:
        "Conectores, operaciones por canal y checklists de despliegue.",
      quickLinks: [{ label: "Todos los canales", href: "/channels" }],
    },
  },
};

export function getAsideMenuConfig(content: string, locale: Locale): AsideCopy {
  const config = CONTENT_ASIDE_CONFIG[content] ?? DEFAULT_CONFIG;
  return config[locale] ?? config.en;
}
