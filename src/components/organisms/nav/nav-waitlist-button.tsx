"use client";

import { WaitlistForm } from "@molecule/forms/waitlist-form";
import { useModal } from "@molecule/modal/use-modal";

interface NavWaitlistButtonProps {
  label: string;
}

export function NavWaitlistButton({ label }: NavWaitlistButtonProps) {
  const { openModal, closeModal } = useModal();

  const handleOpenWaitlistModal = () => {
    openModal({
      title: "Únete a la lista de espera",
      content: <WaitlistForm closeModal={closeModal} />,
    });
  };

  return (
    <button
      onClick={handleOpenWaitlistModal}
      className="hidden items-center whitespace-nowrap rounded-xl bg-indigo-500 px-3 py-2 text-xs font-semibold text-white shadow-lg shadow-indigo-900/30 transition hover:bg-indigo-400 sm:inline-flex sm:px-4 sm:text-sm"
    >
      {label}
    </button>
  );
}
