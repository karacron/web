import { Footer } from "@organism/footer/footer";
import { MainNav } from "@organism/nav/main";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kara — Automate your work. Orchestrate everything.",
  description:
    "Kara is a local-first AI assistant for orchestrating agents and automating complex workflows.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <MainNav />
      <main>{children}</main>
      <Footer />
    </>
  );
}
