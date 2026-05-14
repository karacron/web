import { listSlugsByContent } from "@lib/blog-content";
import type { MetadataRoute } from "next";

const SITE_URL = "https://karacron.com";

function toAbsolute(path: string) {
  return new URL(path, SITE_URL).toString();
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [channelSlugs, modelSlugs] = await Promise.all([
    listSlugsByContent("channels"),
    listSlugsByContent("models"),
  ]);

  const staticPaths = ["/", "/roadmap", "/channels", "/models"];
  const channelPaths = channelSlugs.map((slug) => `/channels/${slug}`);
  const modelPaths = modelSlugs.map((slug) => `/models/${slug}`);

  const uniquePaths = Array.from(
    new Set([...staticPaths, ...channelPaths, ...modelPaths]),
  );

  const now = new Date();

  return uniquePaths.map((path) => ({
    url: toAbsolute(path),
    lastModified: now,
    changeFrequency: "weekly",
    priority: path === "/" ? 1 : 0.7,
  }));
}
