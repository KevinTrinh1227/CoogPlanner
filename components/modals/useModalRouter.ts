// components/modals/useModalRouter.ts
"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import type { ModalSlug } from "./modalRegistry";

export function useModalRouter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const openModal = useCallback(
    (
      slug: ModalSlug,
      extraParams?: Record<string, string | number | boolean>
    ) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("modal", slug);

      if (extraParams) {
        for (const [key, value] of Object.entries(extraParams)) {
          params.set(key, String(value));
        }
      }

      const queryString = params.toString();
      router.push(`${pathname}${queryString ? `?${queryString}` : ""}`, {
        scroll: false,
      });
    },
    [pathname, router, searchParams]
  );

  const closeModal = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("modal");
    const queryString = params.toString();
    router.push(`${pathname}${queryString ? `?${queryString}` : ""}`, {
      scroll: false,
    });
  }, [pathname, router, searchParams]);

  return { openModal, closeModal };
}
