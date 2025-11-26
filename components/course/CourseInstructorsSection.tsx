// components/course/CourseInstructorsSection.tsx
import React from "react";
import type { Course } from "@/lib/courses";

type InstructorSummary = Course["instructors"][number];

interface CourseInstructorsSectionProps {
  displayCode: string;
  instructorPages: InstructorSummary[][];
  totalInstructors: number;
  totalSections: number;
}

export default function CourseInstructorsSection({
  displayCode,
  instructorPages,
  totalInstructors,
  totalSections,
}: CourseInstructorsSectionProps) {
  return (
    <section
      id="instructors"
      className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 md:p-6"
    >
      <div className="mb-3 space-y-1">
        <h2 className="text-base font-semibold tracking-tight text-slate-50 md:text-lg">
          Instructors who taught {displayCode}
        </h2>
        <p className="text-[11px] text-slate-400 md:text-xs">
          View all {totalInstructors.toLocaleString()} instructors who have
          taught {totalSections.toLocaleString()} sections for this course.
        </p>

        {instructorPages.length > 1 && (
          <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
            <span className="text-slate-500">Jump to page:</span>
            {instructorPages.map((_, idx) => (
              <a
                key={idx}
                href={`#instructors-page-${idx + 1}`}
                className="rounded-full border border-slate-700/70 bg-slate-900/80 px-2.5 py-0.5 font-medium text-slate-200 hover:border-slate-500 hover:bg-slate-800"
              >
                {idx + 1}
              </a>
            ))}
          </div>
        )}
      </div>

      {instructorPages.map((page, pageIndex) => (
        <div
          key={pageIndex}
          id={`instructors-page-${pageIndex + 1}`}
          className={pageIndex > 0 ? "mt-4 border-t border-slate-800 pt-4" : ""}
        >
          {instructorPages.length > 1 && (
            <p className="mb-2 text-[11px] font-medium uppercase tracking-wide text-slate-500">
              Page {pageIndex + 1} of {instructorPages.length}
            </p>
          )}

          <div className="grid gap-3 md:grid-cols-2">
            {page.map((inst) => (
              <div
                key={inst.name}
                className="flex items-center justify-between rounded-xl bg-slate-900/70 px-4 py-3"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-50">
                    {inst.name}
                  </p>
                  <p className="text-[11px] text-slate-400">{inst.summary}</p>
                </div>
                <button className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-[11px] font-medium text-slate-100 hover:border-slate-500 hover:bg-slate-800">
                  View
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
