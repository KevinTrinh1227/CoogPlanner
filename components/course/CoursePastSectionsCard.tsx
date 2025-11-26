// components/course/CoursePastSectionsCard.tsx
import React from "react";
import type { Course } from "@/lib/courses";

interface TermRange {
  earliest: string;
  latest: string;
}

interface CoursePastSectionsCardProps {
  displayCode: string;
  pastSections: Course["pastSections"];
  totalSections: number;
  termRange: TermRange | null;
}

export default function CoursePastSectionsCard({
  displayCode,
  pastSections,
  totalSections,
  termRange,
}: CoursePastSectionsCardProps) {
  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 md:p-6">
      <div className="mb-3 space-y-1">
        <h2 className="text-base font-semibold tracking-tight text-slate-50 md:text-lg">
          Past Sections
        </h2>
        <p className="text-[11px] text-slate-400 md:text-xs">
          Now displaying {totalSections.toLocaleString()} sections
          {termRange && (
            <>
              {" "}
              from {termRange.earliest} to {termRange.latest}
            </>
          )}
          .
        </p>
      </div>

      {/* Single responsive table: scrolls horizontally on mobile, no wrapping */}
      <div className="w-full overflow-x-auto">
        <table className="min-w-full border-separate border-spacing-y-1 whitespace-nowrap text-left text-[11px] text-slate-200 md:text-sm">
          <thead className="text-slate-400">
            <tr>
              <th className="py-2 px-2 md:px-3">Term</th>
              <th className="py-2 px-2 md:px-3">Instructor</th>
              <th className="py-2 px-2 md:px-3">Section</th>
              <th className="py-2 px-2 md:px-3">Enrolled</th>
              <th className="py-2 px-2 md:px-3">A</th>
              <th className="py-2 px-2 md:px-3">B</th>
              <th className="py-2 px-2 md:px-3">C</th>
              <th className="py-2 px-2 md:px-3">D</th>
              <th className="py-2 px-2 md:px-3">F</th>
              <th className="py-2 px-2 md:px-3">W</th>
              <th className="py-2 px-2 md:px-3">Avg GPA</th>
            </tr>
          </thead>
          <tbody>
            {pastSections.map((section, idx) => (
              <tr
                key={`${section.term}-${section.instructor}-${section.section}-${idx}`}
                className="rounded-xl bg-slate-900/70 hover:bg-slate-900/90"
              >
                <td className="rounded-l-xl py-2.5 px-2 md:px-3">
                  {section.term}
                </td>
                <td className="py-2.5 px-2 md:px-3">{section.instructor}</td>
                <td className="py-2.5 px-2 md:px-3">{section.section}</td>

                <td className="py-2.5 px-2 md:px-3">
                  {section.enrolled != null
                    ? section.enrolled.toLocaleString()
                    : "-"}
                </td>

                <td className="py-2.5 px-2 md:px-3">
                  {section.letters?.A ?? "-"}
                </td>
                <td className="py-2.5 px-2 md:px-3">
                  {section.letters?.B ?? "-"}
                </td>
                <td className="py-2.5 px-2 md:px-3">
                  {section.letters?.C ?? "-"}
                </td>
                <td className="py-2.5 px-2 md:px-3">
                  {section.letters?.D ?? "-"}
                </td>
                <td className="py-2.5 px-2 md:px-3">
                  {section.letters?.F ?? "-"}
                </td>
                <td className="py-2.5 px-2 md:px-3">
                  {section.letters?.W ?? "-"}
                </td>

                <td className="rounded-r-xl py-2.5 px-2 md:px-3">
                  {section.gpa != null ? section.gpa.toFixed(2) : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
