// components/course/CourseSyllabiButton.tsx
"use client";

import React from "react";
import { useModalRouter } from "@/components/modals/useModalRouter";

interface CourseSyllabiButtonProps {
  displayCode: string;
  syllabusCount: number;
}

export default function CourseSyllabiButton({
  displayCode,
  syllabusCount,
}: CourseSyllabiButtonProps) {
  const { openModal } = useModalRouter();

  if (syllabusCount <= 0) return null;

  const handleClick = () => {
    openModal("course-syllabi-list", { code: displayCode });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900/80 px-3.5 py-1.5 text-xs font-medium text-slate-100 transition-colors hover:bg-slate-800 hover:text-slate-50 md:text-sm"
    >
      <span aria-hidden>📘</span>
      <span>{syllabusCount} Syllabi Found</span>
    </button>
  );
}
