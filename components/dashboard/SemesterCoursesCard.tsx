"use client";

import React, { useState, useMemo } from "react";

type CurrentCourse = {
  code: string;
  title: string;
  credits: number;
  location: string;
  instructor: string;
};

type CompletedCourse = {
  term: string;
  code: string;
  title: string;
  credits: number;
  grade: string;
  instructor: string;
};

interface SemesterCoursesCardProps {
  currentTerm: string;
  currentCourses: CurrentCourse[];
  completedCourses: CompletedCourse[];
}

type ViewMode = "current" | "completed";

const PAGE_SIZE = 6;

export default function SemesterCoursesCard({
  currentTerm,
  currentCourses,
  completedCourses,
}: SemesterCoursesCardProps) {
  const [view, setView] = useState<ViewMode>("current");
  const [page, setPage] = useState(1);

  const isCurrent = view === "current";

  // Derived stats for summaries
  const totalCurrentCredits = useMemo(
    () => currentCourses.reduce((sum, c) => sum + c.credits, 0),
    [currentCourses]
  );
  const isFullTime = totalCurrentCredits >= 12;

  const completedTermCount = useMemo(
    () => new Set(completedCourses.map((c) => c.term)).size,
    [completedCourses]
  );

  // Header title + summary depending on view
  const headerTitle = isCurrent
    ? "Current Semester Courses"
    : "Completed Courses";

  const headerSummary = isCurrent
    ? `Current Semester: ${currentTerm} · ${currentCourses.length} course${
        currentCourses.length !== 1 ? "s" : ""
      } · ${totalCurrentCredits} credit hours · Term Status: ${
        isFullTime ? "Full-time" : "Part-time"
      }`
    : `${completedCourses.length} completed course${
        completedCourses.length !== 1 ? "s" : ""
      } across ${completedTermCount} term${
        completedTermCount !== 1 ? "s" : ""
      }`;

  // Reset page when switching views
  const handleSwitchView = (next: ViewMode) => {
    if (next === view) return;
    setView(next);
    setPage(1);
  };

  return (
    <section className="w-full rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-sm md:p-5">
      {/* Header row: title + summary + view toggle */}
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-base font-semibold text-slate-50 md:text-lg">
            {headerTitle}
          </h2>
          <p className="text-xs text-slate-400 md:text-[13px]">
            {headerSummary}
          </p>
        </div>

        {/* View toggle – segmented control style */}
        <div className="flex items-start justify-end text-xs md:text-sm">
          <div className="inline-flex items-center rounded-full border border-slate-700 bg-slate-950/70 p-1">
            <button
              type="button"
              onClick={() => handleSwitchView("current")}
              className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-150 md:text-sm ${
                isCurrent
                  ? "bg-slate-100 text-slate-900 shadow-sm"
                  : "text-slate-300 hover:bg-slate-900"
              }`}
            >
              <span aria-hidden>🌟</span>
              <span>Current Semester</span>
            </button>

            <button
              type="button"
              onClick={() => handleSwitchView("completed")}
              className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-150 md:text-sm ${
                !isCurrent
                  ? "bg-slate-100 text-slate-900 shadow-sm"
                  : "text-slate-300 hover:bg-slate-900"
              }`}
            >
              <span aria-hidden>✅</span>
              <span>Completed Courses</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content with shared wrapper to keep transitions smoother */}
      <div className="transition-all duration-200 ease-out">
        {isCurrent ? (
          <CurrentCoursesView
            term={currentTerm}
            courses={currentCourses}
            page={page}
            onPageChange={setPage}
          />
        ) : (
          <CompletedCoursesView
            courses={completedCourses}
            page={page}
            onPageChange={setPage}
          />
        )}
      </div>
    </section>
  );
}

/* ------------------ helpers ------------------ */

function paginate<T>(items: T[], page: number, pageSize: number) {
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const safePage = Math.min(Math.max(page, 1), totalPages);
  const start = (safePage - 1) * pageSize;
  const end = start + pageSize;
  return {
    items: items.slice(start, end),
    page: safePage,
    totalPages,
  };
}

function termBadge(term: string) {
  const lower = term.toLowerCase();
  let emoji = "📅";

  if (lower.startsWith("spring")) emoji = "🌱";
  else if (lower.startsWith("summer")) emoji = "☀️";
  else if (lower.startsWith("fall") || lower.startsWith("autumn")) emoji = "🍂";
  else if (lower.startsWith("winter")) emoji = "❄️";

  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-slate-800/80 px-2 py-0.5 text-[10px] font-medium text-slate-200">
      <span aria-hidden>{emoji}</span>
      <span>{term}</span>
    </span>
  );
}

/* ------------------ current semester view ------------------ */

function CurrentCoursesView({
  term,
  courses,
  page,
  onPageChange,
}: {
  term: string;
  courses: CurrentCourse[];
  page: number;
  onPageChange: (p: number) => void;
}) {
  if (!courses.length) {
    return (
      <p className="text-xs text-slate-400 md:text-sm">
        You don&apos;t have any courses added for {term} yet.
      </p>
    );
  }

  const {
    items,
    page: safePage,
    totalPages,
  } = paginate(courses, page, PAGE_SIZE);

  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((course) => (
          <article
            key={`${course.code}-${course.title}`}
            className="flex flex-col justify-between rounded-xl border border-slate-800 bg-slate-950/75 p-3 text-xs text-slate-200 shadow-sm transition-all duration-150 hover:-translate-y-0.5 hover:border-slate-600 hover:bg-slate-900 hover:shadow-md hover:shadow-black/30 md:p-3.5 md:text-[13px]"
          >
            {/* Top row: code+title + status pill on right */}
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-50 md:text-[15px]">
                  {course.code}
                </p>
                <p className="truncate text-[11px] text-slate-300 md:text-[13px]">
                  {course.title}
                </p>
              </div>
              <span className="mt-0.5 inline-flex shrink-0 items-center rounded-full border border-amber-500/40 bg-amber-500/20 px-2 py-0.5 text-[10px] font-medium text-amber-200">
                In Progress
              </span>
            </div>

            {/* Bottom: consistent 3 meta lines */}
            <div className="mt-3 space-y-1 text-[11px] text-slate-400 md:text-xs">
              <p className="flex items-center gap-2">
                <span className="font-medium text-slate-200">
                  {course.credits}
                </span>{" "}
                credit{course.credits !== 1 ? "s" : ""}
                <span className="h-3 w-px bg-slate-700" aria-hidden />
                {termBadge(term)}
              </p>
              <p className="line-clamp-1">
                <span className="font-medium text-slate-300">Instructor:</span>{" "}
                {course.instructor}
              </p>
              <p className="line-clamp-1">
                <span className="font-medium text-slate-300">
                  Time / Location:
                </span>{" "}
                {course.location}
              </p>
            </div>
          </article>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <PaginationControls
          page={safePage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
}

/* ------------------ completed courses view ------------------ */

function CompletedCoursesView({
  courses,
  page,
  onPageChange,
}: {
  courses: CompletedCourse[];
  page: number;
  onPageChange: (p: number) => void;
}) {
  if (!courses.length) {
    return (
      <p className="text-xs text-slate-400 md:text-sm">
        No completed courses on record yet.
      </p>
    );
  }

  const sorted = [...courses].sort((a, b) => a.term.localeCompare(b.term));
  const {
    items,
    page: safePage,
    totalPages,
  } = paginate(sorted, page, PAGE_SIZE);

  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((course) => (
          <article
            key={`${course.term}-${course.code}-${course.title}`}
            className="flex flex-col justify-between rounded-xl border border-slate-800 bg-slate-950/75 p-3 text-xs text-slate-200 shadow-sm transition-all duration-150 hover:-translate-y-0.5 hover:border-slate-600 hover:bg-slate-900 hover:shadow-md hover:shadow-black/30 md:p-3.5 md:text-[13px]"
          >
            {/* Top row: code+title + status pill */}
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-50 md:text-[15px]">
                  {course.code}
                </p>
                <p className="truncate text-[11px] text-slate-300 md:text-[13px]">
                  {course.title}
                </p>
              </div>
              <span className="mt-0.5 inline-flex shrink-0 items-center rounded-full border border-emerald-500/40 bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold text-emerald-200">
                Completed
              </span>
            </div>

            {/* Bottom: consistent 3 meta lines */}
            <div className="mt-3 space-y-1 text-[11px] text-slate-400 md:text-xs">
              <p className="flex items-center gap-2">
                <span className="font-medium text-slate-200">
                  {course.credits}
                </span>{" "}
                credit{course.credits !== 1 ? "s" : ""}
                <span className="h-3 w-px bg-slate-700" aria-hidden />
                {termBadge(course.term)}
              </p>
              <p className="line-clamp-1">
                <span className="font-medium text-slate-300">Instructor:</span>{" "}
                {course.instructor}
              </p>
              <p className="line-clamp-1">
                <span className="font-medium text-slate-300">
                  Status / Grade:
                </span>{" "}
                Completed · {course.grade}
              </p>
            </div>
          </article>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <PaginationControls
          page={safePage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
}

/* ------------------ pagination controls ------------------ */

function PaginationControls({
  page,
  totalPages,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  onPageChange: (p: number) => void;
}) {
  const canPrev = page > 1;
  const canNext = page < totalPages;

  const handlePrev = () => {
    if (canPrev) onPageChange(page - 1);
  };

  const handleNext = () => {
    if (canNext) onPageChange(page + 1);
  };

  return (
    <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 md:text-xs">
      <div>
        Page <span className="font-medium text-slate-200">{page}</span> of{" "}
        <span className="font-medium text-slate-200">{totalPages}</span>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handlePrev}
          disabled={!canPrev}
          className={`inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-[11px] font-medium transition-all duration-150 md:text-xs ${
            canPrev
              ? "border-slate-700 bg-slate-950/80 text-slate-100 hover:border-slate-500 hover:bg-slate-900"
              : "border-slate-800 bg-slate-950/40 text-slate-500 cursor-not-allowed"
          }`}
        >
          <span aria-hidden>←</span>
          <span>Previous</span>
        </button>
        <button
          type="button"
          onClick={handleNext}
          disabled={!canNext}
          className={`inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-[11px] font-medium transition-all duration-150 md:text-xs ${
            canNext
              ? "border-slate-700 bg-slate-950/80 text-slate-100 hover:border-slate-500 hover:bg-slate-900"
              : "border-slate-800 bg-slate-950/40 text-slate-500 cursor-not-allowed"
          }`}
        >
          <span>Next</span>
          <span aria-hidden>→</span>
        </button>
      </div>
    </div>
  );
}
