"use client";

import type { ResolvedModalOptions } from "@molecule/modal/modal.types";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, useMemo } from "react";
import { createPortal } from "react-dom";

type ModalProps = {
  isOpen: boolean;
  options: ResolvedModalOptions | null;
  onClose: () => void;
};

const sizeClassMap: Record<ResolvedModalOptions["size"], string> = {
  sm: "sm:max-w-sm",
  md: "sm:max-w-xl",
  lg: "sm:max-w-2xl",
  xl: "sm:max-w-4xl",
  full: "sm:max-w-[min(96vw,1200px)]",
};

export function Modal({ isOpen, options, onClose }: ModalProps) {
  useEffect(() => {
    if (!isOpen || !options?.closeOnEsc) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose, options?.closeOnEsc]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  const content = useMemo(() => {
    if (!options) {
      return null;
    }

    return typeof options.content === "function"
      ? options.content({ closeModal: onClose })
      : options.content;
  }, [onClose, options]);

  if (typeof document === "undefined") {
    return null;
  }

  return createPortal(
    <AnimatePresence>
      {isOpen && options ? (
        <motion.div
          className="fixed inset-0 z-120 flex items-stretch justify-stretch p-0 sm:items-center sm:justify-center sm:p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
        >
          <motion.button
            type="button"
            aria-label={options.closeLabel}
            onClick={options.closeOnOverlay ? onClose : undefined}
            className={`absolute inset-0 bg-neutral-950/55 ${options.overlayClassName ?? ""}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={
              typeof options.title === "string" ? options.title : undefined
            }
            className={`relative z-10 h-dvh w-full max-w-none overflow-y-auto rounded-none border-0 bg-gray-900 p-4 text-white shadow-none sm:h-auto sm:max-h-[calc(100dvh-2rem)] sm:rounded-2xl sm:border sm:border-white/10 sm:p-6 sm:shadow-2xl sm:shadow-black/50 ${sizeClassMap[options.size]} ${options.className ?? ""}`}
            initial={{ opacity: 0, y: 18, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            onClick={(event) => event.stopPropagation()}
          >
            {(options.title || options.showCloseButton) && (
              <div className="mb-5 flex items-center justify-between gap-4">
                <div className="min-h-6 flex-1 text-lg font-semibold text-white">
                  {options.title}
                </div>
                {options.showCloseButton ? (
                  <button
                    type="button"
                    aria-label={options.closeLabel}
                    onClick={onClose}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/70 transition hover:border-white/20 hover:bg-white/10 hover:text-white"
                  >
                    <X size={18} strokeWidth={1.8} />
                  </button>
                ) : null}
              </div>
            )}
            <div>{content}</div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
