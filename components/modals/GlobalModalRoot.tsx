// components/modals/GlobalModalRoot.tsx
"use client";

import React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { modalRegistry, type ModalSlug } from "./modalRegistry";

/**
 * URL-driven global modal root.
 *
 * It looks for ?modal=<slug> in the current URL. If the slug matches
 * one of the keys in `modalRegistry`, it renders that modal and passes
 * an `onClose` handler that cleans up the query string.
 *
 * Because this file uses hooks, it MUST be a client component.
 */
export default function GlobalModalRoot() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Read the `modal` query param, e.g. ?modal=course-syllabi-list
  const modalParam = searchParams.get("modal") ?? "";
  const modalSlug = modalParam as ModalSlug | "";

  const isValidModal = modalSlug && modalSlug in modalRegistry;
  const ActiveModal = isValidModal
    ? modalRegistry[modalSlug as ModalSlug]
    : null;

  // Not open → render nothing
  if (!ActiveModal) {
    return null;
  }

  const handleClose = () => {
    const params = new URLSearchParams(searchParams.toString());

    // Remove the modal slug and any modal-specific params if you want
    params.delete("modal");
    // optional: also clear code/title/etc when closing
    // params.delete("code");
    // params.delete("title");

    const queryString = params.toString();
    const nextUrl = queryString ? `${pathname}?${queryString}` : pathname;

    router.replace(nextUrl, { scroll: false });
  };

  return <ActiveModal onClose={handleClose} />;
}
