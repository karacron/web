"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect } from "react";
import { createPortal } from "react-dom";

type EmployeeRangeSheetProps = {
  open: boolean;
  value: string;
  title: string;
  closeLabel: string;
  optionLabel: string;
  onSelect: (value: string) => void;
  onClose: () => void;
};

const OPTIONS = [
  {
    value: "1-10",
    title: "1-10",
    description: "Equipo pequeño o fase inicial.",
  },
  {
    value: "11-50",
    title: "11-50",
    description: "Crecimiento activo y primeros procesos.",
  },
  {
    value: "51-200",
    title: "51-200",
    description: "Operación en expansión con varios equipos.",
  },
  {
    value: "201-500",
    title: "201-500",
    description: "Estructura consolidada con más coordinación.",
  },
  {
    value: "500+",
    title: "500+",
    description: "Organización grande con necesidades enterprise.",
  },
] as const;

export function EmployeeRangeSheet({
  open,
  value,
  title,
  closeLabel,
  optionLabel,
  onSelect,
  onClose,
}: EmployeeRangeSheetProps) {
  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  if (typeof document === "undefined") {
    return null;
  }

  return createPortal(
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-140 sm:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
        >
          <motion.button
            type="button"
            aria-label={closeLabel}
            onClick={onClose}
            className="absolute inset-0 bg-neutral-950/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
          />

          <motion.section
            role="dialog"
            aria-modal="true"
            aria-label={title}
            className="absolute inset-x-0 bottom-0 max-h-[85dvh] overflow-hidden rounded-t-[28px] border-t border-white/10 bg-gray-900 text-white shadow-2xl shadow-black/60"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-center pt-3">
              <span className="h-1.5 w-12 rounded-full bg-white/20" />
            </div>

            <div className="flex items-center justify-between gap-4 px-4 pb-4 pt-3">
              <div>
                <p className="text-base font-semibold text-white">{title}</p>
                <p className="mt-1 text-sm text-white/60">{optionLabel}</p>
              </div>
              <button
                type="button"
                aria-label={closeLabel}
                onClick={onClose}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/75 transition hover:border-white/20 hover:bg-white/10 hover:text-white"
              >
                <X size={18} strokeWidth={1.8} />
              </button>
            </div>

            <div className="max-h-[calc(85dvh-5.75rem)] overflow-y-auto px-4 pb-4">
              <div className="space-y-2">
                {OPTIONS.map((option) => {
                  const isSelected = option.value === value;

                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => onSelect(option.value)}
                      className={`flex w-full items-start justify-between rounded-2xl border px-4 py-4 text-left transition active:scale-[0.99] ${
                        isSelected
                          ? "border-indigo-400/60 bg-indigo-500/15"
                          : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/8"
                      }`}
                    >
                      <span className="min-w-0 pr-4">
                        <span className="block text-base font-semibold text-white">
                          {option.title}
                        </span>
                        <span className="mt-1 block text-sm leading-6 text-white/60">
                          {option.description}
                        </span>
                      </span>
                      <span
                        className={`mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[11px] font-semibold ${
                          isSelected
                            ? "border-indigo-400 bg-indigo-400 text-gray-950"
                            : "border-white/20 bg-transparent text-white/50"
                        }`}
                        aria-hidden="true"
                      >
                        {isSelected ? "✓" : ""}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.section>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
