// components/course/CourseAnalysisCard.tsx
import React from "react";

interface CourseAnalysisCardProps {
  analysisText: string;
}

export default function CourseAnalysisCard({
  analysisText,
}: CourseAnalysisCardProps) {
  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 md:p-6">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-300">
        Course Analysis
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-slate-200 md:text-[15px]">
        {analysisText}
      </p>
    </section>
  );
}
