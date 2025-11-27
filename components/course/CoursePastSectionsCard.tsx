// components/course/CoursePastSectionsCard.tsx
"use client";

import React, { useMemo, useState } from "react";
import type { Course, PastSection } from "@/lib/courses";

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

// Season ordering for term parsing
const seasonOrder: Record<string, number> = {
  Winter: 0,
  Spring: 1,
  Summer: 2,
  Fall: 3,
};

function parseTerm(term: string) {
  const [season, yearStr] = term.split(" ");
  const year = parseInt(yearStr ?? "0", 10) || 0;
  const seasonIdx = seasonOrder[season] ?? 4;
  return { year, seasonIdx };
}

// Sort: most recent term first (Fall 2025 → ... → Spring 2020)
function sortSectionsByTermDesc(a: PastSection, b: PastSection) {
  const pa = parseTerm(a.term);
  const pb = parseTerm(b.term);

  if (pa.year !== pb.year) return pb.year - pa.year;
  if (pa.seasonIdx !== pb.seasonIdx) return pb.seasonIdx - pa.seasonIdx;

  return (a.section ?? "").localeCompare(b.section ?? "");
}

type PageSizeOption = number | "ALL";

export default function CoursePastSectionsCard({
  displayCode,
  pastSections,
  totalSections,
  termRange,
}: CoursePastSectionsCardProps) {
  const sortedSections = useMemo(
    () => [...pastSections].sort(sortSectionsByTermDesc),
    [pastSections]
  );

  const totalRows = sortedSections.length;

  // Build available page size options based on how many rows we actually have
  const numericSizes = [25, 50, 100].filter((n) => totalRows >= n);
  const hasAll = totalRows > 0;

  const pageSizeOptions: PageSizeOption[] = [
    ...numericSizes,
    ...(hasAll ? (["ALL"] as PageSizeOption[]) : []),
  ];

  // Default page size: smallest available numeric size, or ALL if tiny list
  const defaultSize: PageSizeOption =
    (numericSizes[0] as PageSizeOption) || "ALL";

  const [pageSize, setPageSize] = useState<PageSizeOption>(defaultSize);

  const visibleCount =
    pageSize === "ALL" ? totalRows : Math.min(totalRows, pageSize);

  const visibleSections = sortedSections.slice(0, visibleCount);

  const formatNumber = (value: number | null | undefined) =>
    value == null ? "-" : value.toLocaleString();

  const safeLetters = (value: number | null | undefined) =>
    value == null ? 0 : value;

  const handlePageSizeChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ): void => {
    const value = e.target.value;
    if (value === "ALL") {
      setPageSize("ALL");
    } else {
      const num = Number(value);
      setPageSize(Number.isNaN(num) ? defaultSize : (num as PageSizeOption));
    }
  };

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 md:p-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-base font-semibold tracking-tight text-slate-50 md:text-lg">
          Past Sections &amp; Letter Outcomes
        </h2>
        <p className="text-xs text-slate-400 md:text-sm">
          {totalSections.toLocaleString()} past section
          {totalSections === 1 ? "" : "s"} for {displayCode}
          {termRange && (
            <>
              {" "}
              from {termRange.earliest} to {termRange.latest}
            </>
          )}
          .
        </p>
      </div>

      {sortedSections.length === 0 ? (
        <p className="mt-3 text-xs text-slate-400 md:text-sm">
          We don&apos;t have any historical sections for this course yet. As
          more grade history is imported, you&apos;ll see section-by-section
          outcomes here.
        </p>
      ) : (
        <>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full whitespace-nowrap text-xs text-slate-200 md:text-sm">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/70 text-xs uppercase tracking-wide text-slate-400 md:text-sm">
                  <th className="px-2 py-2 text-left">Term</th>
                  <th className="px-2 py-2 text-left">Instructor</th>
                  <th className="px-2 py-2 text-left">Section</th>
                  <th className="px-2 py-2 text-right">Enrolled</th>
                  <th className="px-2 py-2 text-right">A</th>
                  <th className="px-2 py-2 text-right">B</th>
                  <th className="px-2 py-2 text-right">C</th>
                  <th className="px-2 py-2 text-right">D</th>
                  <th className="px-2 py-2 text-right">F</th>
                  <th className="px-2 py-2 text-right">W</th>
                  <th className="px-2 py-2 text-right">S</th>
                  <th className="px-2 py-2 text-right">NR</th>
                  <th className="px-2 py-2 text-right">GPA</th>
                </tr>
              </thead>
              <tbody>
                {visibleSections.map((sec, idx) => {
                  // Keep TS happy: letters can be undefined, but we handle that in safeLetters
                  const letters = sec.letters as
                    | import("@/lib/courses").SectionLetterBreakdown
                    | undefined;

                  return (
                    <tr
                      key={`${sec.term}-${sec.instructor}-${sec.section}-${idx}`}
                      className="border-b border-slate-900/80 last:border-0 hover:bg-slate-900/40"
                    >
                      <td className="px-2 py-2 text-left">{sec.term}</td>
                      <td className="px-2 py-2 text-left">
                        {sec.instructor || "Unknown"}
                      </td>
                      <td className="px-2 py-2 text-left">
                        {sec.section || "-"}
                      </td>
                      <td className="px-2 py-2 text-right">
                        {formatNumber(sec.enrolled)}
                      </td>
                      <td className="px-2 py-2 text-right">
                        {safeLetters(letters?.A)}
                      </td>
                      <td className="px-2 py-2 text-right">
                        {safeLetters(letters?.B)}
                      </td>
                      <td className="px-2 py-2 text-right">
                        {safeLetters(letters?.C)}
                      </td>
                      <td className="px-2 py-2 text-right">
                        {safeLetters(letters?.D)}
                      </td>
                      <td className="px-2 py-2 text-right">
                        {safeLetters(letters?.F)}
                      </td>
                      <td className="px-2 py-2 text-right">
                        {safeLetters(letters?.W)}
                      </td>
                      <td className="px-2 py-2 text-right">
                        {safeLetters((letters as any)?.S)}
                      </td>
                      <td className="px-2 py-2 text-right">
                        {safeLetters((letters as any)?.NR)}
                      </td>
                      <td className="px-2 py-2 text-right">
                        {sec.gpa == null ? "-" : sec.gpa.toFixed(2)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Footer controls: summary + page size dropdown */}
          {totalRows > 0 && (
            <div className="mt-4 flex flex-col items-center gap-3 text-xs text-slate-300 md:flex-row md:justify-between md:text-sm">
              <p className="text-center md:text-left">
                Showing{" "}
                <span className="font-semibold text-slate-100">
                  {visibleSections.length}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-slate-100">
                  {totalRows}
                </span>{" "}
                past sections
              </p>

              {pageSizeOptions.length > 1 && (
                <div className="flex w-full flex-col items-stretch gap-1 sm:w-auto sm:flex-row sm:items-center sm:gap-2">
                  <span className="text-xs text-slate-300 md:text-sm">
                    Sections per view:
                  </span>
                  <select
                    value={pageSize === "ALL" ? "ALL" : String(pageSize)}
                    onChange={handlePageSizeChange}
                    className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs font-medium text-slate-100 shadow-sm outline-none ring-0 transition-colors hover:border-slate-500 focus:border-rose-400 md:text-sm sm:w-auto"
                  >
                    {pageSizeOptions.map((opt) =>
                      opt === "ALL" ? (
                        <option key="ALL" value="ALL">
                          All ({totalRows})
                        </option>
                      ) : (
                        <option key={opt} value={opt}>
                          {opt} sections
                        </option>
                      )
                    )}
                  </select>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </section>
  );
}
