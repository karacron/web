"use client";

import { Modal } from "@molecule/modal/modal";
import type {
  ModalContextValue,
  OpenModalOptions,
  ResolvedModalOptions,
} from "@molecule/modal/modal.types";
import {
  createContext,
  useCallback,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";

const defaults: Pick<
  ResolvedModalOptions,
  "size" | "closeOnOverlay" | "closeOnEsc" | "showCloseButton" | "closeLabel"
> = {
  size: "md",
  closeOnOverlay: true,
  closeOnEsc: true,
  showCloseButton: true,
  closeLabel: "Close modal",
};

export const ModalContext = createContext<ModalContextValue | null>(null);

export function ModalProvider({ children }: PropsWithChildren) {
  const [options, setOptions] = useState<ResolvedModalOptions | null>(null);

  const closeModal = useCallback(() => {
    setOptions(null);
  }, []);

  const openModal = useCallback((nextOptions: OpenModalOptions) => {
    setOptions({
      title: nextOptions.title,
      content: nextOptions.content,
      size: nextOptions.size ?? defaults.size,
      className: nextOptions.className,
      overlayClassName: nextOptions.overlayClassName,
      closeOnOverlay: nextOptions.closeOnOverlay ?? defaults.closeOnOverlay,
      closeOnEsc: nextOptions.closeOnEsc ?? defaults.closeOnEsc,
      showCloseButton: nextOptions.showCloseButton ?? defaults.showCloseButton,
      closeLabel: nextOptions.closeLabel ?? defaults.closeLabel,
    });
  }, []);

  const value = useMemo<ModalContextValue>(
    () => ({
      isOpen: options !== null,
      openModal,
      closeModal,
    }),
    [closeModal, openModal, options],
  );

  return (
    <ModalContext.Provider value={value}>
      {children}
      <Modal isOpen={options !== null} options={options} onClose={closeModal} />
    </ModalContext.Provider>
  );
}
