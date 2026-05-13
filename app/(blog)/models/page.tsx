import { BlogSectionIndex } from "@lib/blog-pages";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Models | Kara Blog",
  description: "Browse models posts.",
};

export default async function ModelsPage() {
  return <BlogSectionIndex section="models" />;
}
