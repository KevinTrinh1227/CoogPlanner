// components/modals/CourseMoreInfoModal.tsx
"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import ModalShell from "./ModalShell";
import type { BaseModalProps } from "./modalTypes";

export default function CourseMoreInfoModal({ onClose }: BaseModalProps) {
  const searchParams = useSearchParams();
  const code = searchParams.get("code") ?? "this course";

  return (
    <ModalShell onClose={onClose} ariaLabel="Course information">
      <h2 className="text-lg font-semibold tracking-tight text-slate-50 sm:text-xl">
        More about {code}
      </h2>
      <p className="mt-2 text-sm text-slate-200">
        This is a placeholder modal. You can customize this to show additional
        course details, catalog links, term history, or whatever you want.
      </p>
      <p className="mt-3 text-xs text-slate-400">
        Opened via <code>?modal=course-more-info&amp;code={code}</code>.
      </p>
    </ModalShell>
  );
}
