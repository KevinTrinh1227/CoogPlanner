// components/modals/ModalShell.tsx
"use client";

import React, { useEffect, useRef } from "react";

interface ModalShellProps {
  onClose: () => void;
  children: React.ReactNode;
  ariaLabel?: string;
  /**
   * Layout mode:
   * - "single" (default): one-column stacked content
   * - "two-column": responsive 2-column layout on md+ (1 column on mobile)
   */
  layout?: "single" | "two-column";
}

export default function ModalShell({
  onClose,
  children,
  ariaLabel = "Dialog",
  layout = "single",
}: ModalShellProps) {
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const previousActiveElementRef = useRef<Element | null>(null);

  // ESC to close + basic focus management + lock scroll
  useEffect(() => {
    previousActiveElementRef.current = document.activeElement;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    // Lock background scroll
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Focus the dialog on mount
    if (dialogRef.current) {
      dialogRef.current.focus();
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
      if (
        previousActiveElementRef.current &&
        previousActiveElementRef.current instanceof HTMLElement
      ) {
        previousActiveElementRef.current.focus();
      }
    };
  }, [onClose]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Only close if they clicked the backdrop, not inside the panel
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const contentLayoutClasses =
    layout === "two-column"
      ? // 1 column on mobile, 2 columns on md+; left a bit wider than right
        "grid grid-cols-1 gap-4 md:grid-cols-[minmax(0,2fr)_minmax(0,1.4fr)]"
      : "";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-3 sm:p-4"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel}
    >
      <div
        ref={dialogRef}
        tabIndex={-1}
        className="relative max-h-[90vh] w-full max-w-4xl rounded-2xl border border-slate-800 bg-slate-950/95 shadow-2xl outline-none ring-0 focus-visible:ring-2 focus-visible:ring-rose-400"
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-700 bg-slate-900 text-slate-200 text-xs font-semibold shadow hover:border-slate-500 hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400"
          aria-label="Close dialog"
        >
          ✕
        </button>

        {/* Scrollable content */}
        <div
          className={`max-h-[90vh] overflow-y-auto px-4 pb-4 pt-5 sm:px-5 sm:pb-5 sm:pt-6 ${contentLayoutClasses}`}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
