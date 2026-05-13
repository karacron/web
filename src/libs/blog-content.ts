import { routing, type Locale } from "@i18n/routing";
import { compileMDX } from "next-mdx-remote/rsc";
import { access, readdir, readFile } from "node:fs/promises";
import path from "node:path";
import remarkGfm from "remark-gfm";

const BLOG_ROOT = path.join(process.cwd(), "i18n", "content", "blog");
const FALLBACK_LOCALE = routing.defaultLocale as Locale;

export type BlogFrontmatter = {
  title: string;
  description: string;
  date: string;
  tags?: string[];
  draft?: boolean;
};

export type BlogPost = {
  content: string;
  slug: string;
  requestedLocale: Locale;
  effectiveLocale: Locale;
  usedFallback: boolean;
  frontmatter: BlogFrontmatter;
  body: React.ReactNode;
};

function isSafeSegment(value: string): boolean {
  return /^[a-z0-9-]+$/i.test(value);
}

function toLocale(value: string): Locale {
  if (routing.locales.includes(value as Locale)) {
    return value as Locale;
  }

  return FALLBACK_LOCALE;
}

function getPostFilePath(
  locale: Locale,
  content: string,
  slug: string,
): string {
  return path.join(BLOG_ROOT, locale, content, `${slug}.mdx`);
}

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function parsePost(
  filePath: string,
): Promise<{ frontmatter: BlogFrontmatter; body: React.ReactNode }> {
  const source = await readFile(filePath, "utf8");

  const { frontmatter, content } = await compileMDX<BlogFrontmatter>({
    source,
    options: {
      parseFrontmatter: true,
      mdxOptions: {
        remarkPlugins: [remarkGfm],
      },
    },
  });

  return { frontmatter, body: content };
}

export async function listAllContentSections(): Promise<string[]> {
  const localeDirectories = await Promise.all(
    routing.locales.map(async (locale) => {
      const localePath = path.join(BLOG_ROOT, locale);

      try {
        const entries = await readdir(localePath, { withFileTypes: true });
        return entries
          .filter((entry) => entry.isDirectory())
          .map((entry) => entry.name)
          .filter((name) => isSafeSegment(name));
      } catch {
        return [];
      }
    }),
  );

  return Array.from(new Set(localeDirectories.flat())).sort();
}

async function listSlugsForLocale(
  locale: Locale,
  content: string,
): Promise<string[]> {
  const sectionPath = path.join(BLOG_ROOT, locale, content);

  try {
    const entries = await readdir(sectionPath, { withFileTypes: true });
    return entries
      .filter((entry) => entry.isFile() && entry.name.endsWith(".mdx"))
      .map((entry) => entry.name.replace(/\.mdx$/, ""))
      .filter((slug) => isSafeSegment(slug))
      .sort();
  } catch {
    return [];
  }
}

export async function listSlugsByContent(content: string): Promise<string[]> {
  if (!isSafeSegment(content)) {
    return [];
  }

  const slugGroups = await Promise.all(
    routing.locales.map((locale) => listSlugsForLocale(locale, content)),
  );

  return Array.from(new Set(slugGroups.flat())).sort();
}

export async function getPostWithFallback(params: {
  locale: string;
  content: string;
  slug: string;
}): Promise<BlogPost | null> {
  const requestedLocale = toLocale(params.locale);
  const content = params.content;
  const slug = params.slug;

  if (!isSafeSegment(content) || !isSafeSegment(slug)) {
    return null;
  }

  const candidates: Locale[] =
    requestedLocale === FALLBACK_LOCALE
      ? [FALLBACK_LOCALE]
      : [requestedLocale, FALLBACK_LOCALE];

  for (const locale of candidates) {
    const filePath = getPostFilePath(locale, content, slug);

    if (!(await fileExists(filePath))) {
      continue;
    }

    const { frontmatter, body } = await parsePost(filePath);

    return {
      content,
      slug,
      requestedLocale,
      effectiveLocale: locale,
      usedFallback: locale !== requestedLocale,
      frontmatter,
      body,
    };
  }

  return null;
}

export async function getPostsIndex(params: {
  locale: string;
  content: string;
}): Promise<BlogPost[]> {
  const requestedLocale = toLocale(params.locale);
  const content = params.content;

  if (!isSafeSegment(content)) {
    return [];
  }

  const slugs = await listSlugsByContent(content);

  const posts = await Promise.all(
    slugs.map((slug) =>
      getPostWithFallback({
        locale: requestedLocale,
        content,
        slug,
      }),
    ),
  );

  return posts
    .filter((post): post is BlogPost => Boolean(post))
    .filter((post) => !post.frontmatter.draft)
    .sort((a, b) => b.frontmatter.date.localeCompare(a.frontmatter.date));
}
