import { BlogSectionIndex, getSectionParams } from "@lib/blog-pages";
import type { Metadata } from "next";

export const dynamicParams = false;

type PageProps = {
  params: Promise<{ section: string }>;
};

export async function generateStaticParams() {
  return getSectionParams();
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const { section } = await props.params;
  return {
    title: `${section} | Kara Blog`,
    description: `Browse ${section} posts.`,
  };
}

export default async function SectionPage(props: PageProps) {
  const { section } = await props.params;
  return <BlogSectionIndex section={section} />;
}
