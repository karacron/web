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
      <div className="relative min-h-full overflow-x-hidden">
        <nav>nav</nav>
        <main>{children}</main>
        <footer>footer</footer>
      </div>
    </>
  );
}
