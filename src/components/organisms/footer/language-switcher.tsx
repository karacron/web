"use client";

import { Check, Languages, X } from "lucide-react";
import { useState } from "react";

type LocaleOption = {
  code: "en" | "es";
  label: string;
};

type FooterLanguageSwitcherProps = {
  currentLocale: "en" | "es";
  buttonLabel: string;
  modalTitle: string;
  closeLabel: string;
  options: LocaleOption[];
};

export function FooterLanguageSwitcher({
  currentLocale,
  buttonLabel,
  modalTitle,
  closeLabel,
  options,
}: FooterLanguageSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [pendingLocale, setPendingLocale] = useState<"en" | "es" | null>(null);

  async function selectLocale(nextLocale: "en" | "es") {
    if (nextLocale === currentLocale) {
      setIsOpen(false);
      return;
    }

    setPendingLocale(nextLocale);

    try {
      const response = await fetch("/api/locale", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ locale: nextLocale }),
      });

      if (!response.ok) {
        throw new Error("Failed to change locale");
      }

      window.location.reload();
    } catch {
      setPendingLocale(null);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/80 transition hover:border-white/20 hover:bg-white/10 hover:text-white"
      >
        <Languages size={16} strokeWidth={1.8} />
        <span>{buttonLabel}</span>
      </button>

      {isOpen ? (
        <div
          className="fixed inset-0 z-[90] flex items-center justify-center bg-black/55 px-4"
          role="dialog"
          aria-modal="true"
          aria-label={modalTitle}
        >
          <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-gray-900 p-6 shadow-2xl shadow-black/50">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">{modalTitle}</h3>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label={closeLabel}
                className="rounded-md p-2 text-white/70 transition hover:bg-white/10 hover:text-white"
              >
                <X size={18} strokeWidth={1.8} />
              </button>
            </div>

            <div className="space-y-2">
              {options.map((option) => {
                const isCurrent = option.code === currentLocale;
                const isPending = pendingLocale === option.code;

                return (
                  <button
                    key={option.code}
                    type="button"
                    disabled={pendingLocale !== null}
                    onClick={() => void selectLocale(option.code)}
                    className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-left text-white transition hover:border-indigo-400/60 hover:bg-indigo-500/10 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    <span className="font-medium">{option.label}</span>
                    {isCurrent ? (
                      <Check
                        size={18}
                        strokeWidth={2}
                        className="text-indigo-300"
                      />
                    ) : isPending ? (
                      <span className="text-xs text-white/60">...</span>
                    ) : null}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
