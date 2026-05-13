"use client";

import { Menu, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

type NavItem = {
  label: string;
  href: string;
};

type MobileDrawerProps = {
  navItems: NavItem[];
  ctaLabel: string;
  ctaHref: string;
};

export function MobileDrawer({
  navItems,
  ctaLabel,
  ctaHref,
}: MobileDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);

  function closeDrawer() {
    setIsOpen(false);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="rounded-lg border border-white/10 bg-white/5 p-2 text-white/80 transition hover:border-white/20 hover:bg-white/10 hover:text-white md:hidden"
        aria-label="Open menu"
      >
        <Menu size={18} strokeWidth={1.9} />
      </button>

      <div
        className={`fixed inset-0 z-[80] md:hidden ${
          isOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        <button
          type="button"
          onClick={closeDrawer}
          aria-label="Close menu overlay"
          className={`absolute inset-0 bg-black/60 transition-opacity duration-300 ${
            isOpen ? "opacity-100" : "opacity-0"
          }`}
        />

        <aside
          className={`absolute inset-y-0 left-0 flex w-full flex-col bg-neutral-950 p-6 transition-transform duration-300 ease-out ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
        >
          <div className="flex items-center justify-between">
            <a
              href="#top"
              onClick={closeDrawer}
              className="flex items-center gap-3"
            >
              <Image
                src="/logo.png"
                alt="Kara Logo"
                width={40}
                height={40}
                className="h-10 w-auto"
              />
              <span className="text-sm font-semibold tracking-[0.18em] text-white">
                KARA
              </span>
            </a>

            <button
              type="button"
              onClick={closeDrawer}
              className="rounded-lg border border-white/10 bg-white/5 p-2 text-white/80 transition hover:border-white/20 hover:bg-white/10 hover:text-white"
              aria-label="Close menu"
            >
              <X size={18} strokeWidth={1.9} />
            </button>
          </div>

          <nav className="mt-10 flex flex-1 flex-col gap-2">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={closeDrawer}
                className="rounded-xl px-3 py-3 text-base font-medium text-white/85 transition hover:bg-white/10 hover:text-white"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <a
            href={ctaHref}
            onClick={closeDrawer}
            className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-indigo-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-400"
          >
            {ctaLabel}
          </a>
        </aside>
      </div>
    </>
  );
}
