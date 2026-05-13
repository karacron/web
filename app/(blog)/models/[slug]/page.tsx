import { listSlugsByContent } from "@lib/blog-content";
import { BlogSectionPost } from "@lib/blog-pages";
import type { Metadata } from "next";

export const dynamicParams = false;

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const slugs = await listSlugsByContent("models");
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const { slug } = await props.params;
  return {
    title: `${slug} | Models | Kara Blog`,
    description: `Read ${slug} in models.`,
  };
}

export default async function ModelDetailPage(props: PageProps) {
  const { slug } = await props.params;
  return <BlogSectionPost section="models" slug={slug} />;
}
