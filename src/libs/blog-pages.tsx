import type { Locale } from "@i18n/routing";
import { getAsideMenuConfig } from "@lib/blog-aside";
import {
  getPostWithFallback,
  getPostsIndex,
  listAllContentSections,
  listSlugsByContent,
} from "@lib/blog-content";
import { getLocale } from "next-intl/server";
import Link from "next/link";
import { notFound } from "next/navigation";

type Dict = {
  indexLabel: string;
  sectionFallbackNotice: string;
  emptyTitle: string;
  emptyDescription: string;
  backToSection: string;
  contentFallbackNotice: string;
};

const COPY: Record<string, Dict> = {
  en: {
    indexLabel: "Posts",
    sectionFallbackNotice: "Showing localized section copy fallback.",
    emptyTitle: "No posts yet",
    emptyDescription:
      "Add MDX files under i18n/content/blog for this section and locale.",
    backToSection: "Back to section",
    contentFallbackNotice:
      "This post is shown in fallback language because a translation is not available yet.",
  },
  es: {
    indexLabel: "Publicaciones",
    sectionFallbackNotice:
      "Mostrando contenido de seccion en idioma de respaldo.",
    emptyTitle: "Aun no hay publicaciones",
    emptyDescription:
      "Agrega archivos MDX en i18n/content/blog para esta seccion e idioma.",
    backToSection: "Volver a la seccion",
    contentFallbackNotice:
      "Esta publicacion se muestra en idioma de respaldo porque aun no existe traduccion.",
  },
};

function getCopy(locale: string): Dict {
  return COPY[locale] ?? COPY.en;
}

async function ensureSectionExists(section: string): Promise<void> {
  const sections = await listAllContentSections();

  if (!sections.includes(section)) {
    notFound();
  }
}

export async function getSectionParams(): Promise<{ section: string }[]> {
  const sections = await listAllContentSections();
  return sections.map((section) => ({ section }));
}

export async function getSectionSlugParams(): Promise<
  { section: string; slug: string }[]
> {
  const sections = await listAllContentSections();
  const slugsBySection = await Promise.all(
    sections.map(async (section) => {
      const slugs = await listSlugsByContent(section);
      return slugs.map((slug) => ({ section, slug }));
    }),
  );

  return slugsBySection.flat();
}

export async function BlogSectionIndex(props: { section: string }) {
  await ensureSectionExists(props.section);

  const locale = (await getLocale()) as Locale;
  const posts = await getPostsIndex({ locale, content: props.section });
  const aside = getAsideMenuConfig(props.section, locale);
  const copy = getCopy(locale);

  return (
    <section className="mx-auto max-w-5xl px-6 py-12">
      <header className="mb-8 space-y-3 border-b border-white/10 pb-6">
        <h1 className="text-3xl font-semibold tracking-tight">{aside.title}</h1>
        <p className="max-w-2xl text-white/70">{aside.description}</p>
      </header>

      <div className="grid gap-8 md:grid-cols-[1fr_280px]">
        <div className="space-y-4">
          {posts.length === 0 ? (
            <article className="rounded-xl border border-white/10 bg-white/5 p-6">
              <h2 className="text-xl font-medium">{copy.emptyTitle}</h2>
              <p className="mt-2 text-white/70">{copy.emptyDescription}</p>
            </article>
          ) : (
            posts.map((post) => (
              <article
                key={`${post.content}-${post.slug}`}
                className="rounded-xl border border-white/10 bg-white/5 p-6"
              >
                <p className="text-xs uppercase tracking-[0.2em] text-white/50">
                  {copy.indexLabel}
                </p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight">
                  <Link
                    href={`/${props.section}/${post.slug}`}
                    className="hover:underline"
                  >
                    {post.frontmatter.title}
                  </Link>
                </h2>
                <p className="mt-2 text-sm text-white/50">
                  {post.frontmatter.date}
                </p>
                <p className="mt-3 text-white/75">
                  {post.frontmatter.description}
                </p>
                {post.usedFallback ? (
                  <p className="mt-4 text-xs text-amber-300">
                    {copy.sectionFallbackNotice}
                  </p>
                ) : null}
              </article>
            ))
          )}
        </div>

        <aside className="h-fit rounded-xl border border-white/10 bg-white/5 p-5">
          <h3 className="text-sm uppercase tracking-[0.2em] text-white/50">
            Quick links
          </h3>
          {aside.quickLinks.length === 0 ? (
            <p className="mt-3 text-sm text-white/60">-</p>
          ) : (
            <ul className="mt-3 space-y-2 text-sm text-white/80">
              {aside.quickLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="hover:text-white hover:underline"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </aside>
      </div>
    </section>
  );
}

export async function BlogSectionPost(props: {
  section: string;
  slug: string;
}) {
  await ensureSectionExists(props.section);

  const locale = (await getLocale()) as Locale;
  const post = await getPostWithFallback({
    locale,
    content: props.section,
    slug: props.slug,
  });
  const copy = getCopy(locale);

  if (!post) {
    notFound();
  }

  return (
    <article className="mx-auto max-w-3xl px-6 py-12">
      <p className="text-sm text-white/60">
        <Link href={`/${props.section}`} className="hover:underline">
          {copy.backToSection}
        </Link>
      </p>

      <header className="mt-4 border-b border-white/10 pb-6">
        <h1 className="text-3xl font-semibold tracking-tight">
          {post.frontmatter.title}
        </h1>
        <p className="mt-3 text-white/70">{post.frontmatter.description}</p>
        <p className="mt-3 text-sm text-white/50">{post.frontmatter.date}</p>
        {post.usedFallback ? (
          <p className="mt-4 text-sm text-amber-300">
            {copy.contentFallbackNotice}
          </p>
        ) : null}
      </header>

      <div className="prose prose-invert mt-8 max-w-none">{post.body}</div>
    </article>
  );
}
