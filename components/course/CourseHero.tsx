// components/course/CourseHero.tsx
import React from "react";
import type { Course } from "@/lib/courses";
import { getCourseDisplayCode } from "@/lib/courses";

interface CourseHeroProps {
  course: Course;

  /**
   * Optional manual override for the credit line.
   * If not provided, we derive it from course.catalog:
   * "Credit Hours: X (Lecture Hours: Y · Lab Hours: Z)".
   */
  creditLineOverride?: string;

  // Actions metadata
  syllabusCount?: number; // number of syllabi found for this course
  catalogCount?: number; // number of catalog entries we have for this course
  hasCatalogLink?: boolean; // true if we have COID + CATOID
}

export default function CourseHero({
  course,
  creditLineOverride,
  syllabusCount = 0,
  catalogCount = 0,
  hasCatalogLink = false,
}: CourseHeroProps) {
  const { badges, catalog } = course;
  const displayCode = getCourseDisplayCode(course);

  // --- Derived credit line from catalog info ---
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

  // Use difficulty label from DB/cache; only use score for fallback coloring.
  const difficultyLabel = String(badges.difficultyLabel || "").trim();
  let difficultyColor = "";

  if (difficultyLabel === "Very Easy" || difficultyLabel === "Easy") {
    difficultyColor = "text-emerald-300";
  } else if (difficultyLabel === "Moderate") {
    difficultyColor = "text-amber-300";
  } else if (difficultyLabel === "Hard" || difficultyLabel === "Very Hard") {
    difficultyColor = "text-red-300";
  } else if (badges.difficultyScore != null) {
    // Fallback: infer color from numeric score if label is unexpected
    difficultyColor =
      badges.difficultyScore <= 2.5
        ? "text-emerald-300"
        : badges.difficultyScore <= 3.5
        ? "text-amber-300"
        : "text-red-300";
  }

  const gpaTrendColor =
    badges.trend === "Improving"
      ? "text-emerald-300"
      : badges.trend === "Stable"
      ? "text-sky-300"
      : "text-red-300";

  const pastSectionCount = course.pastSections?.length ?? 0;
  const showPastSectionsButton = pastSectionCount > 0;
  const showSyllabiButton = syllabusCount > 0;
  const showCatalogButton = hasCatalogLink && catalogCount > 0;

  return (
    <section className="pb-0">
      <div className="space-y-3">
        <div className="space-y-1">
          <h1 className="text-balance text-xl font-semibold tracking-tight text-slate-50 sm:text-2xl md:text-3xl">
            {course.name}
          </h1>
          <p className="text-balance text-3xl font-semibold tracking-tight text-rose-300 sm:text-4xl md:text-5xl">
            {displayCode}
          </p>
        </div>

        {creditLine && (
          <p className="break-words text-xs font-medium text-slate-200 md:text-sm">
            {creditLine}
          </p>
        )}

        {/* GPA / Drop Rate / Difficulty / GPA Trend badges */}
        <div className="mt-2 flex w-full flex-wrap justify-start gap-1.5 text-[10px] md:gap-2 md:text-[11px]">
          {/* GPA */}
          {badges.gpa != null && (
            <div className="inline-flex items-center gap-1.5 rounded-md border border-slate-800 bg-slate-900 px-2 py-1 transition-colors transition-transform hover:border-slate-600 hover:bg-slate-900/90 hover:scale-[1.02]">
              <span aria-hidden>📊</span>
              <span className="font-semibold text-slate-200">GPA:</span>
              <span
                className={`font-semibold ${
                  badges.gpa >= 3
                    ? "text-emerald-300"
                    : badges.gpa >= 2.75
                    ? "text-amber-300"
                    : "text-red-300"
                }`}
              >
                {badges.gpa.toFixed(2)}
              </span>
            </div>
          )}

          {/* Drop Rate */}
          {badges.dropRate != null && (
            <div className="inline-flex items-center gap-1.5 rounded-md border border-slate-800 bg-slate-900 px-2 py-1 transition-colors transition-transform hover:border-slate-600 hover:bg-slate-900/90 hover:scale-[1.02]">
              <span aria-hidden>📉</span>
              <span className="font-semibold text-slate-200">Drop Rate:</span>
              <span
                className={`font-semibold ${
                  badges.dropRate <= 10
                    ? "text-emerald-300"
                    : badges.dropRate <= 20
                    ? "text-amber-300"
                    : "text-red-300"
                }`}
              >
                {badges.dropRate.toFixed(2)}%
              </span>
            </div>
          )}

          {/* Difficulty */}
          {badges.difficultyScore != null && (
            <div className="inline-flex items-center gap-1.5 rounded-md border border-slate-800 bg-slate-900 px-2 py-1 transition-colors transition-transform hover:border-slate-600 hover:bg-slate-900/90 hover:scale-[1.02]">
              <span aria-hidden>🧠</span>
              <span className="font-semibold text-slate-200">Difficulty:</span>
              <span className={`font-semibold ${difficultyColor}`}>
                {badges.difficultyScore.toFixed(2)} (
                {difficultyLabel || "Unknown"})
              </span>
            </div>
          )}

          {/* GPA Trend */}
          {badges.trend && (
            <div className="inline-flex items-center gap-1.5 rounded-md border border-slate-800 bg-slate-900 px-2 py-1 transition-colors transition-transform hover:border-slate-600 hover:bg-slate-900/90 hover:scale-[1.02]">
              <span aria-hidden>📈</span>
              <span className="font-semibold text-slate-200">GPA Trend:</span>
              <span className={`font-semibold ${gpaTrendColor}`}>
                {badges.trend}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Description & metadata */}
      <div className="mt-5 space-y-3">
        {/* Pre & Co-requisites */}
        {catalog.prerequisites && (
          <div className="mt-1">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
              Pre &amp; Co-requisites
            </p>
            <p className="mt-1 break-words text-sm leading-relaxed text-slate-200 md:text-[15px]">
              {catalog.prerequisites}
            </p>
          </div>
        )}

        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            Description
          </p>
          <p className="mt-1 break-words text-sm leading-relaxed text-slate-200 md:text-[15px]">
            {catalog.description}
          </p>
        </div>

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

        {/* Requirements & groups */}
        {catalog.fulfills.length > 0 && (
          <div className="space-y-1">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
              Requirements This Course Fulfills &amp; Groups
            </p>
            <div className="flex flex-wrap gap-2">
              {catalog.fulfills.map((req) => (
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
            {/* Past Section Times */}
            {showPastSectionsButton && (
              <button
                type="button"
                className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900/80 px-3.5 py-1.5 text-xs font-medium text-slate-100 transition-colors hover:bg-slate-800 hover:text-slate-50 md:text-sm"
              >
                <span aria-hidden>🗓️</span>
                <span>{pastSectionCount} Past Section Times</span>
              </button>
            )}

            {/* Course Syllabi */}
            {showSyllabiButton && (
              <button
                type="button"
                className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900/80 px-3.5 py-1.5 text-xs font-medium text-slate-100 transition-colors hover:bg-slate-800 hover:text-slate-50 md:text-sm"
              >
                <span aria-hidden>📘</span>
                <span>{syllabusCount} Syllabi Found</span>
              </button>
            )}

            {/* Catalog Sources */}
            {showCatalogButton && (
              <button
                type="button"
                className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900/80 px-3.5 py-1.5 text-xs font-medium text-slate-100 transition-colors hover:bg-slate-800 hover:text-slate-50 md:text-sm"
              >
                <span aria-hidden>🔗</span>
                <span>{catalogCount} Catalog Sources</span>
              </button>
            )}

            {/* More Information / popup trigger (dead for now) */}
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
