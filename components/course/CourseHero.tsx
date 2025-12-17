// components/course/CourseHero.tsx
import React from "react";
import type { Course } from "@/lib/courses";
import { getCourseDisplayCode } from "@/lib/courses";

import CourseMetricBadgesRow from "@/components/course/CourseMetricBadgesRow";
import CourseSyllabiButton from "@/components/course/CourseSyllabiButton";

interface CourseHeroProps {
  course: Course;

  /**
   * Optional manual override for the credit line.
   * If not provided, we derive it from course.catalog:
   * "Credit Hours: X (Lecture Hours: Y · Lab Hours: Z)".
   */
  creditLineOverride?: string;

  // Actions metadata
  catalogCount?: number; // number of catalog entries we have for this course
  hasCatalogLink?: boolean; // true if we have COID + CATOID
}

/**
 * Normalize catalog text:
 * - trim leading/trailing whitespace
 * - remove spaces before punctuation (e.g. "ENGL 1301 ." → "ENGL 1301.")
 * - collapse multiple spaces into a single space
 */
function normalizeCatalogText(text?: string | null): string {
  if (!text) return "";
  return text
    .trim()
    .replace(/\s+([.,;:!?])/g, "$1")
    .replace(/\s+/g, " ");
}

export default function CourseHero({
  course,
  creditLineOverride,
  catalogCount = 0,
  hasCatalogLink = false,
}: CourseHeroProps) {
  const { badges, catalog } = course;
  const displayCode = getCourseDisplayCode(course);

  // Derived credit line from catalog info
  const creditHours = catalog.creditHours;
  const lectureHours = catalog.lectureHours;
  const labHours = catalog.labHours;

  const creditLine =
    creditLineOverride ??
    `Credit Hours: ${
      creditHours != null ? creditHours : "N/A"
    } (Lecture Hours: ${
      lectureHours != null ? lectureHours : "N/A"
    } · Lab Hours: ${labHours != null ? labHours : "N/A"})`;

  // Normalized catalog fields
  const prereqText = normalizeCatalogText(catalog.prerequisites);
  const descriptionText = normalizeCatalogText(catalog.description);

  const fulfills = (catalog.fulfills ?? [])
    .map((req) => normalizeCatalogText(req))
    .filter((req) => req.length > 0);

  const pastSectionCount = course.pastSections?.length ?? 0;
  const showPastSectionsButton = pastSectionCount > 0;
  const showCatalogButton = hasCatalogLink && catalogCount > 0;

  return (
    <section className="pb-0">
      <div className="space-y-3">
        {/* Title + code (render once, no duplication) */}
        <div className="space-y-1">
          <h1 className="text-balance text-xl font-semibold tracking-tight text-slate-50 sm:text-2xl md:text-3xl">
            {course.name}
          </h1>
          <p className="text-balance text-3xl font-semibold tracking-tight text-rose-300 sm:text-4xl md:text-5xl">
            {displayCode}
          </p>
        </div>

        {/* Credit line (not full width) */}
        {creditLine && (
          <p className="inline-block w-fit break-words text-xs font-medium text-slate-200 md:text-sm">
            {creditLine}
          </p>
        )}

        {/* GPA / Drop Rate / Difficulty / GPA Trend */}
        <CourseMetricBadgesRow badges={badges} />
      </div>

      {/* Description & metadata */}
      <div className="mt-5 space-y-3">
        {/* Pre & Co-requisites */}
        <div className="mt-1">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            Pre &amp; Co-requisites
          </p>
          <p className="mt-1 break-words text-sm leading-relaxed text-slate-200 md:text-[15px]">
            {prereqText || "N/A"}
          </p>
        </div>

        {/* Description */}
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            Description
          </p>
          <p className="mt-1 break-words text-sm leading-relaxed text-slate-200 md:text-[15px]">
            {descriptionText || "N/A"}
          </p>
        </div>

        {/* Repeatability / TCCNS / Fee */}
        <div className="break-words text-xs text-slate-300 md:text-sm">
          <span className="font-semibold text-slate-400">Repeatability:</span>{" "}
          <span>{catalog.repeatability ?? "N/A"}</span>
          <span className="mx-2 text-slate-600">•</span>
          <span className="font-semibold text-slate-400">
            TCCNS Equivalent:
          </span>{" "}
          <span>{catalog.tccnsEquivalent ?? "N/A"}</span>
          <span className="mx-2 text-slate-600">•</span>
          <span className="font-semibold text-slate-400">
            Additional Fee:
          </span>{" "}
          <span>{catalog.additionalFee ?? "N/A"}</span>
        </div>

        {/* Requirements chips */}
        {fulfills.length > 0 && (
          <div className="space-y-1">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
              Requirements This Course Fulfills &amp; Groups
            </p>
            <div className="flex flex-wrap gap-2">
              {fulfills.map((req) => (
                <button
                  key={req}
                  type="button"
                  className="inline-flex max-w-full items-center break-words rounded-full border border-slate-700 bg-slate-900/80 px-3 py-1 text-xs font-medium text-slate-50 transition-transform transition-colors hover:border-slate-500 hover:bg-slate-800 hover:text-slate-50 hover:scale-[1.02]"
                >
                  {req}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Course Resources & Links */}
        <div className="space-y-1 pt-2">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            Course Resources &amp; Links
          </p>

          <div className="flex flex-wrap gap-2">
            {showPastSectionsButton && (
              <button
                type="button"
                className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900/80 px-3.5 py-1.5 text-xs font-medium text-slate-100 transition-colors hover:bg-slate-800 hover:text-slate-50 md:text-sm"
              >
                <span aria-hidden>🗓️</span>
                <span>{pastSectionCount} Past Section Times</span>
              </button>
            )}

            <CourseSyllabiButton
              displayCode={getCourseDisplayCode({ code: course.code } as any)}
              courseTitle={course.name}
            />

            {showCatalogButton && (
              <button
                type="button"
                className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900/80 px-3.5 py-1.5 text-xs font-medium text-slate-100 transition-colors hover:bg-slate-800 hover:text-slate-50 md:text-sm"
              >
                <span aria-hidden>🔗</span>
                <span>{catalogCount} Catalog Sources</span>
              </button>
            )}

            <button
              type="button"
              className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900/80 px-3.5 py-1.5 text-xs font-medium text-slate-100 transition-colors hover:bg-slate-800 hover:text-slate-50 md:text-sm"
            >
              <span aria-hidden>📚</span>
              <span>More Information</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
