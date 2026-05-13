"use client";

import { ModalContext } from "@molecule/modal/modal-provider";
import type { ModalContextValue } from "@molecule/modal/modal.types";
import { useContext } from "react";

export function useModal(): ModalContextValue {
  const context = useContext(ModalContext);

  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }

  return context;
}
