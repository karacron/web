"use client";

import { useModal } from "@molecule/modal/use-modal";
import { Languages, X } from "lucide-react";
import { useMemo, useState } from "react";
import ReactCountryFlag from "react-country-flag";

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
  modalI18n: LanguageModalI18n;
};

export type LanguageModalI18n = {
  heading: string;
  description: string;
  searchPlaceholder: string;
  clearSearchLabel: string;
  activeLabel: string;
  updatingLabel: string;
  noResultsTitle: string;
  noResultsHint: string;
};

type LanguageModalContentProps = {
  currentLocale: "en" | "es";
  options: LocaleOption[];
  closeModal: () => void;
  i18n: LanguageModalI18n;
};

function getCountryCode(localeCode: string): string {
  const normalized = localeCode.toLowerCase();

  if (normalized === "en") {
    return "US";
  }

  if (normalized === "es") {
    return "ES";
  }

  const [, region] = normalized.split("-");
  if (region && region.length === 2) {
    return region.toUpperCase();
  }

  return normalized.slice(0, 2).toUpperCase();
}

function LanguageModalContent({
  currentLocale,
  options,
  closeModal,
  i18n,
}: LanguageModalContentProps) {
  const [pendingLocale, setPendingLocale] = useState<"en" | "es" | null>(null);
  const [query, setQuery] = useState("");

  const normalizedQuery = query.trim().toLowerCase();

  const filteredOptions = useMemo(() => {
    const sorted = [...options].sort((a, b) => {
      if (a.code === currentLocale) return -1;
      if (b.code === currentLocale) return 1;
      return a.label.localeCompare(b.label);
    });

    if (!normalizedQuery) {
      return sorted;
    }

    return sorted.filter(
      (option) =>
        option.label.toLowerCase().includes(normalizedQuery) ||
        option.code.toLowerCase().includes(normalizedQuery),
    );
  }, [currentLocale, normalizedQuery, options]);

  async function selectLocale(nextLocale: "en" | "es") {
    if (nextLocale === currentLocale) {
      closeModal();
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
    <div className="w-full space-y-3">
      <label className="group relative block">
        <input
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={i18n.searchPlaceholder}
          className="h-10 w-full rounded-lg border border-white/12 bg-white/4 pl-4 pr-10 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-indigo-400/70 focus:bg-indigo-500/7"
        />
        {query ? (
          <button
            type="button"
            onClick={() => setQuery("")}
            aria-label={i18n.clearSearchLabel}
            className="absolute top-1/2 right-2 inline-flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-md text-white/45 transition hover:bg-white/10 hover:text-white"
          >
            <X size={14} strokeWidth={2} />
          </button>
        ) : null}
      </label>

      <div className="max-h-[52vh] space-y-1.5 overflow-y-auto rounded-lg border border-white/8 bg-black/15 p-1.5">
        {filteredOptions.map((option) => {
          const isCurrent = option.code === currentLocale;
          const isPending = pendingLocale === option.code;
          const countryCode = getCountryCode(option.code);

          return (
            <button
              key={option.code}
              type="button"
              disabled={pendingLocale !== null}
              onClick={() => void selectLocale(option.code)}
              className="flex w-full items-center justify-between rounded-md border border-transparent px-3 py-2.5 text-left text-white transition hover:border-indigo-400/40 hover:bg-indigo-500/12 disabled:cursor-not-allowed disabled:opacity-70"
            >
              <div className="flex min-w-0 items-center gap-2.5">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-white/8">
                  <ReactCountryFlag
                    countryCode={countryCode}
                    aria-label={option.label}
                    title={option.label}
                    style={{ fontSize: "0.9rem", lineHeight: 1 }}
                  />
                </span>
                <span className="font-medium tracking-tight">
                  {option.label}
                </span>
                <span className="rounded-full border border-white/12 bg-white/5 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white/50">
                  {option.code}
                </span>
              </div>
              <div className="flex items-center">
                {isCurrent ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-400/20 px-2.5 py-1 text-[11px] leading-none font-semibold text-emerald-200">
                    <span>{i18n.activeLabel}</span>
                  </span>
                ) : isPending ? (
                  <span className="text-[11px] text-white/60">
                    {i18n.updatingLabel}
                  </span>
                ) : null}
              </div>
            </button>
          );
        })}

        {filteredOptions.length === 0 ? (
          <div className="rounded-md border border-dashed border-white/15 bg-white/3 px-4 py-6 text-center">
            <p className="text-sm text-white/75">{i18n.noResultsTitle}</p>
            <p className="mt-1 text-xs text-white/45">{i18n.noResultsHint}</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export function FooterLanguageSwitcher({
  currentLocale,
  buttonLabel,
  modalTitle,
  closeLabel,
  options,
  modalI18n,
}: FooterLanguageSwitcherProps) {
  const { openModal } = useModal();

  function openLanguageModal() {
    openModal({
      title: modalTitle,
      size: "md",
      closeLabel,
      className: "max-h-[82vh]",
      content: ({ closeModal: closeFromHost }) => (
        <LanguageModalContent
          currentLocale={currentLocale}
          options={options}
          closeModal={closeFromHost}
          i18n={modalI18n}
        />
      ),
    });
  }

  return (
    <>
      <button
        type="button"
        onClick={openLanguageModal}
        aria-label={buttonLabel}
        title={buttonLabel}
        className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/70 transition hover:border-white/20 hover:bg-white/10 hover:text-white"
      >
        <Languages size={18} strokeWidth={1.8} />
      </button>
    </>
  );
}
