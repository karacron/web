import { BlogSectionIndex } from "@lib/blog-pages";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Channels | Kara Blog",
  description: "Browse channels posts.",
};

export default async function ChannelsPage() {
  return <BlogSectionIndex section="channels" />;
}
