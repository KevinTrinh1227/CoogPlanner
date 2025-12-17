"use client";

import React from "react";
import { useModalRouter } from "@/components/modals/useModalRouter";

interface CourseMoreInfoButtonProps {
  displayCode: string;
}

export default function CourseMoreInfoButton({
  displayCode,
}: CourseMoreInfoButtonProps) {
  const { openModal } = useModalRouter();

  const handleClick = () => {
    // You can pass extra info into the URL if you want
    openModal("course-more-info", { code: displayCode });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900/80 px-3.5 py-1.5 text-xs font-medium text-slate-100 transition-colors hover:bg-slate-800 hover:text-slate-50 md:text-sm"
    >
      <span aria-hidden>📚</span>
      <span>More Information</span>
    </button>
  );
}
