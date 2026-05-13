import { BlogSectionPost, getSectionSlugParams } from "@lib/blog-pages";
import type { Metadata } from "next";

export const dynamicParams = false;

type PageProps = {
  params: Promise<{ section: string; slug: string }>;
};

export async function generateStaticParams() {
  return getSectionSlugParams();
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const { section, slug } = await props.params;
  return {
    title: `${slug} | ${section} | Kara Blog`,
    description: `Read ${slug} in ${section}.`,
  };
}

export default async function SectionSlugPage(props: PageProps) {
  const { section, slug } = await props.params;
  return <BlogSectionPost section={section} slug={slug} />;
}
