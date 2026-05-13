import type { ReactNode } from "react";

export type ModalSize = "sm" | "md" | "lg" | "xl" | "full";

export type ModalRenderApi = {
  closeModal: () => void;
};

export type ModalContent =
  | ReactNode
  | ((controls: ModalRenderApi) => ReactNode);

export type OpenModalOptions = {
  title?: ReactNode;
  content: ModalContent;
  size?: ModalSize;
  className?: string;
  overlayClassName?: string;
  closeOnOverlay?: boolean;
  closeOnEsc?: boolean;
  showCloseButton?: boolean;
  closeLabel?: string;
};

export type ResolvedModalOptions = {
  title?: ReactNode;
  content: ModalContent;
  size: ModalSize;
  className?: string;
  overlayClassName?: string;
  closeOnOverlay: boolean;
  closeOnEsc: boolean;
  showCloseButton: boolean;
  closeLabel: string;
};

export type ModalContextValue = {
  isOpen: boolean;
  openModal: (options: OpenModalOptions) => void;
  closeModal: () => void;
};
