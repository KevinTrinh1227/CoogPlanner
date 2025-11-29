"use client";

import React from "react";
import type { Course } from "@/lib/courses";
import InstructorMetricBadgesRow from "@/components/course/InstructorMetricBadgesRow";

type InstructorSummary = Course["instructors"][number];

interface CourseInstructorsSectionProps {
  displayCode: string;
  instructorPages: InstructorSummary[][];
  totalInstructors: number;
  totalSections: number;
  /**
   * Optional callback when an instructor card is clicked.
   * You can hook this up later to navigate to `/instructors/[id]`, etc.
   */
  onInstructorClick?: (instructor: InstructorSummary) => void;
}

// Format "First Last" -> "Last, First" when possible.
// If there's already a comma, or only one word, leave it as-is.
function formatInstructorName(rawName: string): string {
  if (!rawName) return rawName;
  const name = rawName.trim();
  if (!name) return rawName;

  // Already in "Last, First" or similar
  if (name.includes(",")) return name;

  const parts = name.split(/\s+/);
  if (parts.length < 2) return name; // e.g. "Unknown"

  const last = parts[parts.length - 1];
  const first = parts.slice(0, parts.length - 1).join(" ");
  return `${last}, ${first}`;
}

// Extract a last-name-like key for sorting
function getLastNameForSort(rawName: string): string {
  if (!rawName) return "";
  const name = rawName.trim();
  if (!name) return "";

  // "Last, First"
  if (name.includes(",")) {
    return name.split(",")[0]?.trim().toLowerCase() ?? "";
  }

  // "First Middle Last"
  const parts = name.split(/\s+/);
  return (parts[parts.length - 1] || "").toLowerCase();
}

export default function CourseInstructorsSection({
  displayCode,
  instructorPages,
  totalInstructors,
  totalSections,
  onInstructorClick,
}: CourseInstructorsSectionProps) {
  // Flatten the paged data into a single list
  const rawInstructors: InstructorSummary[] = instructorPages.flat();
  const count = rawInstructors.length;

  // Sort instructors alphabetically by last name
  const instructors = [...rawInstructors].sort((a, b) => {
    const la = getLastNameForSort(a.name);
    const lb = getLastNameForSort(b.name);
    if (la && lb) {
      const cmp = la.localeCompare(lb, undefined, { sensitivity: "base" });
      if (cmp !== 0) return cmp;
    }
    // Fallback: compare full names
    return a.name.localeCompare(b.name, undefined, { sensitivity: "base" });
  });

  return (
    <section
      id="instructors"
      className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 md:p-6"
    >
      {/* Header */}
      <div className="mb-3 flex flex-col gap-1 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-base font-semibold tracking-tight text-slate-50 md:text-lg">
            Instructors For {displayCode}
          </h2>
        </div>

        <p className="text-[11px] text-slate-400 md:text-xs md:text-right md:max-w-xs">
          A total of {totalInstructors.toLocaleString()} instructor(s) taught{" "}
          {totalSections.toLocaleString()} sections for this course.
        </p>
      </div>

      {count === 0 ? (
        <p className="text-xs text-slate-500">
          No instructors found for this course yet.
        </p>
      ) : (
        <div className="mt-2 max-h-80 overflow-y-auto pr-1 custom-scrollbar">
          <div className="grid gap-3 md:grid-cols-2">
            {instructors.map((inst, idx) => {
              const key =
                (inst as any).id ?? (inst as any).slug ?? `${inst.name}-${idx}`;

              const courseCount = inst.courseCount ?? 1;
              const sectionCount = inst.sectionCount ?? null;
              const totalStudents = inst.totalStudents ?? null;

              const courseCountDisplay = courseCount.toLocaleString();
              const sectionCountDisplay =
                sectionCount != null ? sectionCount.toLocaleString() : "–";
              const totalStudentsDisplay =
                totalStudents != null ? totalStudents.toLocaleString() : "–";

              return (
                <button
                  key={key}
                  type="button"
                  onClick={
                    onInstructorClick
                      ? () => onInstructorClick(inst)
                      : undefined
                  }
                  className="group flex w-full flex-col rounded-xl border border-slate-800 bg-slate-900/70 px-4 py-3 text-left transition-transform transition-colors hover:-translate-y-0.5 hover:border-slate-500 hover:bg-slate-900/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/70"
                >
                  {/* Instructor name */}
                  <p className="text-[13px] font-semibold text-slate-50 md:text-sm">
                    {formatInstructorName(inst.name)}
                  </p>

                  {/* Department */}
                  {inst.department && (
                    <p className="mt-0.5 text-[11px] font-medium text-slate-300">
                      {inst.department}
                    </p>
                  )}

                  {/* Courses / Sections / Students line */}
                  <p className="mt-0.5 text-[11px] text-slate-400">
                    {courseCountDisplay} Courses · {sectionCountDisplay}{" "}
                    Sections
                    {" · "}
                    {totalStudentsDisplay} Students Enrolled
                  </p>

                  {/* Badges below counts */}
                  <div className="mt-1.5">
                    <InstructorMetricBadgesRow instructor={inst} />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
