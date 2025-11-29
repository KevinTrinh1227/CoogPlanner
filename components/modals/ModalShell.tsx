// components/modals/ModalShell.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";

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
  const closeTimeoutRef = useRef<number | null>(null);

  const scrollYRef = useRef<number>(0);
  const scrollLockedRef = useRef<boolean>(false);

  // Store original body styles so we can restore them
  const originalOverflowRef = useRef<string>("");
  const originalPositionRef = useRef<string>("");
  const originalTopRef = useRef<string>("");
  const originalWidthRef = useRef<string>("");

  // Controls enter/exit animation
  const [isVisible, setIsVisible] = useState(false);

  const unlockScrollIfNeeded = () => {
    if (!scrollLockedRef.current) return;

    document.body.style.overflow = originalOverflowRef.current;
    document.body.style.position = originalPositionRef.current;
    document.body.style.top = originalTopRef.current;
    document.body.style.width = originalWidthRef.current;

    // Restore scroll position
    window.scrollTo(0, scrollYRef.current);

    scrollLockedRef.current = false;
  };

  // Mount: dim/blur + show modal, but *don't* lock scroll yet
  useEffect(() => {
    previousActiveElementRef.current = document.activeElement;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        beginClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    // Capture original body styles once
    originalOverflowRef.current = document.body.style.overflow;
    originalPositionRef.current = document.body.style.position;
    originalTopRef.current = document.body.style.top;
    originalWidthRef.current = document.body.style.width;

    // Capture current scroll position
    scrollYRef.current = window.scrollY;

    // Kick off enter animation (backdrop + modal)
    setIsVisible(true);

    // Focus the dialog on mount
    if (dialogRef.current) {
      dialogRef.current.focus();
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);

      if (closeTimeoutRef.current != null) {
        window.clearTimeout(closeTimeoutRef.current);
      }

      // Safety: ensure scroll is unlocked if something bypassed beginClose
      unlockScrollIfNeeded();

      // Restore focus
      if (
        previousActiveElementRef.current &&
        previousActiveElementRef.current instanceof HTMLElement
      ) {
        previousActiveElementRef.current.focus();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // When visible → then lock scroll (after dim/blur is already in motion)
  useEffect(() => {
    if (!isVisible || scrollLockedRef.current) return;

    scrollYRef.current = window.scrollY;

    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollYRef.current}px`;
    document.body.style.width = "100%";

    scrollLockedRef.current = true;
  }, [isVisible]);

  const beginClose = () => {
    // 1) Immediately unlock scroll & restore position
    unlockScrollIfNeeded();

    // 2) Trigger exit animation (modal + backdrop fade out)
    setIsVisible(false);

    // 3) Clear any existing timeout
    if (closeTimeoutRef.current != null) {
      window.clearTimeout(closeTimeoutRef.current);
    }

    // 4) After animation, actually close/unmount via onClose
    closeTimeoutRef.current = window.setTimeout(() => {
      onClose();
    }, 100); // keep in sync with transition duration
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Only close if they clicked the backdrop, not inside the panel
    if (e.target === e.currentTarget) {
      beginClose();
    }
  };

  const contentLayoutClasses =
    layout === "two-column"
      ? // 1 column on mobile, 2 columns on md+; left a bit wider than right
        "grid grid-cols-1 gap-4 md:grid-cols-[minmax(0,2fr)_minmax(0,1.4fr)]"
      : "";

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 transition-all duration-100 ${
        isVisible
          ? "bg-black/55 backdrop-blur-[2px] opacity-100"
          : "bg-black/0 backdrop-blur-none opacity-0"
      }`}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel}
    >
      <div
        ref={dialogRef}
        tabIndex={-1}
        className={`relative max-h-[90vh] w-full max-w-4xl transform rounded-2xl border border-slate-800 bg-slate-950/95 shadow-2xl outline-none ring-0 transition-all duration-100 focus-visible:ring-2 focus-visible:ring-rose-400 ${
          isVisible
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 -translate-y-1 scale-95"
        }`}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={beginClose}
          className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-700 bg-slate-900 text-xs font-semibold text-slate-200 shadow hover:border-slate-500 hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400"
          aria-label="Close dialog"
        >
          ✕
        </button>

        {/* Scrollable content inside the modal */}
        <div
          className={`max-h-[90vh] overflow-y-auto custom-scrollbar px-4 pb-4 pt-5 sm:px-5 sm:pb-5 sm:pt-6 ${contentLayoutClasses}`}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
