import { listSlugsByContent } from "@lib/blog-content";
import { BlogSectionPost } from "@lib/blog-pages";
import type { Metadata } from "next";

export const dynamicParams = false;

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const slugs = await listSlugsByContent("channels");
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const { slug } = await props.params;
  return {
    title: `${slug} | Channels | Kara Blog`,
    description: `Read ${slug} in channels.`,
  };
}

export default async function ChannelDetailPage(props: PageProps) {
  const { slug } = await props.params;
  return <BlogSectionPost section="channels" slug={slug} />;
}
