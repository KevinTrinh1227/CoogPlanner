// components/course/CourseHero.tsx
import React from "react";
import type { Course } from "@/lib/courses";

interface CourseHeroProps {
  course: Course;
  displayCode: string;
  creditLine: string;
}

export default function CourseHero({
  course,
  displayCode,
  creditLine,
}: CourseHeroProps) {
  return (
    <section className="border-b border-slate-800 pb-6">
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
          {course.badges.gpa != null && (
            <div className="inline-flex items-center gap-1.5 rounded-md border border-slate-800 bg-slate-900 px-2 py-1">
              <span aria-hidden>📊</span>
              <span className="font-semibold text-slate-200">GPA:</span>
              <span
                className={`font-semibold ${
                  course.badges.gpa >= 3
                    ? "text-emerald-300"
                    : course.badges.gpa >= 2.75
                    ? "text-amber-300"
                    : "text-red-300"
                }`}
              >
                {course.badges.gpa.toFixed(2)}
              </span>
            </div>
          )}

          {/* Drop Rate */}
          {course.badges.dropRate != null && (
            <div className="inline-flex items-center gap-1.5 rounded-md border border-slate-800 bg-slate-900 px-2 py-1">
              <span aria-hidden>📉</span>
              <span className="font-semibold text-slate-200">Drop Rate:</span>
              <span
                className={`font-semibold ${
                  course.badges.dropRate <= 10
                    ? "text-emerald-300"
                    : course.badges.dropRate <= 20
                    ? "text-amber-300"
                    : "text-red-300"
                }`}
              >
                {course.badges.dropRate.toFixed(0)}%
              </span>
            </div>
          )}

          {/* Difficulty */}
          {course.badges.difficultyScore != null && (
            <div className="inline-flex items-center gap-1.5 rounded-md border border-slate-800 bg-slate-900 px-2 py-1">
              <span aria-hidden>🧠</span>
              <span className="font-semibold text-slate-200">Difficulty:</span>
              {(() => {
                const difficultyColor =
                  course.badges.difficultyScore <= 2.5
                    ? "text-emerald-300"
                    : course.badges.difficultyScore <= 3.5
                    ? "text-amber-300"
                    : "text-red-300";

                return (
                  <span className={`font-semibold ${difficultyColor}`}>
                    {course.badges.difficultyScore.toFixed(1)} / 5 (
                    {course.badges.difficultyLabel})
                  </span>
                );
              })()}
            </div>
          )}

          {/* GPA Trend */}
          <div className="inline-flex items-center gap-1.5 rounded-md border border-slate-800 bg-slate-900 px-2 py-1">
            <span aria-hidden>📈</span>
            <span className="font-semibold text-slate-200">GPA Trend:</span>
            <span
              className={`font-semibold ${
                course.badges.trend === "Improving"
                  ? "text-emerald-300"
                  : course.badges.trend === "Stable"
                  ? "text-slate-200"
                  : "text-red-300"
              }`}
            >
              {course.badges.trend}
            </span>
          </div>
        </div>
      </div>

      {/* Description & metadata */}
      <div className="mt-5 space-y-3">
        {/* Prerequisites */}
        {course.catalog.prerequisites && (
          <div className="mt-1">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
              Prerequisites
            </p>
            <p className="mt-1 break-words text-sm leading-relaxed text-slate-200 md:text-[15px]">
              {course.catalog.prerequisites}
            </p>
          </div>
        )}

        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            Description
          </p>
          <p className="mt-1 break-words text-sm leading-relaxed text-slate-200 md:text-[15px]">
            {course.catalog.description}
          </p>
        </div>

        <div className="break-words text-xs text-slate-300 md:text-sm">
          <span className="font-semibold text-slate-400">Repeatability:</span>{" "}
          <span>{course.catalog.repeatability ?? "Unknown"}</span>
          <span className="mx-2 text-slate-600">•</span>
          <span className="font-semibold text-slate-400">
            TCCNS Equivalent:
          </span>{" "}
          <span>{course.catalog.tccnsEquivalent ?? "None listed"}</span>
          <span className="mx-2 text-slate-600">•</span>
          <span className="font-semibold text-slate-400">
            Additional Fee:
          </span>{" "}
          <span>{course.catalog.additionalFee ?? "Unknown"}</span>
        </div>

        {course.catalog.fulfills.length > 0 && (
          <div className="space-y-1">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
              Fulfills these requirements
            </p>
            <div className="flex flex-wrap gap-2">
              {course.catalog.fulfills.map((req) => (
                <span
                  key={req}
                  className="inline-flex max-w-full items-center break-words rounded-full border border-slate-700 bg-slate-900/80 px-3 py-1 text-xs font-medium text-slate-50"
                >
                  {req}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
