"use client";

import { X } from "lucide-react";
import type { ReactNode } from "react";

type FullscreenDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  closeLabel: string;
  children: ReactNode;
};

export function FullscreenDialog({
  open,
  onOpenChange,
  title,
  closeLabel,
  children,
}: FullscreenDialogProps) {
  if (!open) {
    return null;
  }

  return (
    <div role="dialog" aria-modal="true" aria-label={title}>
      <button
        type="button"
        aria-label={closeLabel}
        onClick={() => onOpenChange(false)}
        className="fixed inset-0 z-90 bg-neutral-950/50"
      />
      <div className="fixed top-1/2 left-1/2 z-[91] w-full max-w-sm -translate-x-1/2 -translate-y-1/2 px-4">
        <div className="w-full rounded-2xl border border-white/10 bg-gray-900 p-6 text-white shadow-2xl shadow-black/50">
          <div className="mb-5 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">{title}</h3>
            <button
              type="button"
              aria-label={closeLabel}
              onClick={() => onOpenChange(false)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/70 transition hover:border-white/20 hover:bg-white/10 hover:text-white"
            >
              <X size={18} strokeWidth={1.8} />
            </button>
          </div>
          <div>{children}</div>
        </div>
      </div>
    </div>
  );
}
