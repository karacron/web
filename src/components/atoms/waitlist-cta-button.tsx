"use client";

import { WaitlistForm } from "@molecule/forms/waitlist-form";
import { useModal } from "@molecule/modal/use-modal";

interface WaitlistCtaButtonProps {
  label: string;
  variant?: "primary" | "secondary";
}

export function WaitlistCtaButton({
  label,
  variant = "primary",
}: WaitlistCtaButtonProps) {
  const { openModal, closeModal } = useModal();

  const handleOpenWaitlistModal = () => {
    openModal({
      title: "Únete a la lista de espera",
      content: <WaitlistForm closeModal={closeModal} />,
    });
  };

  if (variant === "secondary") {
    return (
      <button
        onClick={handleOpenWaitlistModal}
        className="text-sm/6 font-semibold text-white hover:text-gray-100"
      >
        {label}
        <span aria-hidden="true">→</span>
      </button>
    );
  }

  return (
    <button
      onClick={handleOpenWaitlistModal}
      className="rounded-md bg-indigo-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
    >
      {label}
    </button>
  );
}
