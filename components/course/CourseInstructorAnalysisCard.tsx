// components/course/CourseInstructorAnalysisCard.tsx
import React from "react";

interface CourseInstructorAnalysisCardProps {
  displayCode: string;
}

export default function CourseInstructorAnalysisCard({
  displayCode,
}: CourseInstructorAnalysisCardProps) {
  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 md:p-6">
      <h2 className="text-base font-semibold tracking-tight text-slate-50 md:text-lg">
        Analysis over {displayCode} instructors
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-slate-200 md:text-[15px]">
        In a future version, this section can summarize which instructors tend
        to have higher GPAs, lower drop rates, and more balanced outcomes for{" "}
        {displayCode}. For now, use the instructor list above to explore past
        teaching history and outcomes.
      </p>
    </section>
  );
}
