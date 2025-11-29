// components/modals/modalRegistry.tsx
"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import ModalShell from "./ModalShell";

export type ModalSlug =
  | "course-more-info"
  | "course-syllabi-list"
  | "enrollment-help";

export interface BaseModalProps {
  onClose: () => void;
}

/**
 * Example modal: course "More Information" (single-column)
 */
function CourseMoreInfoModal({ onClose }: BaseModalProps) {
  const searchParams = useSearchParams();
  const code = searchParams.get("code") ?? "this course";

  return (
    <ModalShell onClose={onClose} ariaLabel="Course information">
      <h2 className="text-lg font-semibold tracking-tight text-slate-50 sm:text-xl">
        More about {code}
      </h2>
      <p className="mt-2 text-sm text-slate-200">
        This is a placeholder modal. You can customize this to show additional
        course details, catalog links, term history, or whatever you want.
      </p>
      <p className="mt-3 text-xs text-slate-400">
        Opened via <code>?modal=course-more-info&amp;code={code}</code>.
      </p>
    </ModalShell>
  );
}

/**
 * Helper to sort terms like "Spring 2026", "Fall 2025" by recency (newest first).
 */
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

/**
 * Classify a term as future / current / past relative to "now"
 */
type TermStatus = "future" | "current" | "past";

function getCurrentSeasonIdx(): number {
  const now = new Date();
  const month = now.getMonth(); // 0–11

  // Rough mapping of months to our seasons
  // Jan–Feb: Winter, Mar–May: Spring, Jun–Aug: Summer, Sep–Nov: Fall, Dec: Winter
  if (month === 11 || month <= 1) return seasonOrder["Winter"];
  if (month >= 2 && month <= 4) return seasonOrder["Spring"];
  if (month >= 5 && month <= 7) return seasonOrder["Summer"];
  return seasonOrder["Fall"];
}

function getTermStatus(term: string): TermStatus {
  const { year, seasonIdx } = parseTerm(term);
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentSeasonIdx = getCurrentSeasonIdx();

  if (year > currentYear) return "future";
  if (year < currentYear) return "past";

  // same year
  if (seasonIdx > currentSeasonIdx) return "future";
  if (seasonIdx < currentSeasonIdx) return "past";
  return "current";
}

function renderTermStatusBadge(status: TermStatus) {
  let label = "";
  let classes =
    "inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium";

  if (status === "current") {
    // CURRENT = green
    label = "Current Semester";
    classes += " border-emerald-500/40 bg-emerald-500/10 text-emerald-300";
  } else if (status === "future") {
    // FUTURE = blue-ish
    label = "Future Semester";
    classes += " border-sky-500/40 bg-sky-500/10 text-sky-300";
  } else {
    // PAST = gray
    label = "Past Semester";
    classes += " border-slate-600/60 bg-slate-800/80 text-slate-300";
  }

  return <span className={classes}>{label}</span>;
}

/**
 * Syllabi list modal (single-column layout, grouped by term)
 */
function CourseSyllabiListModal({ onClose }: BaseModalProps) {
  const searchParams = useSearchParams();
  const code = searchParams.get("code") ?? "this course";

  // Title is expected to come from query param when you open the modal:
  // e.g. openModal("course-syllabi-list", { code: displayCode, title: course.name })
  const titleParam = searchParams.get("title");
  const courseTitle =
    titleParam && titleParam.trim().length > 0 ? titleParam.trim() : null;

  const simpleSyllabusCourseUrl = `https://uh.simplesyllabus.com/en-US/syllabus-library?search=${encodeURIComponent(
    code
  )}`;

  // Placeholder syllabi – swap this with real data later.
  const placeholderSyllabi = [
    {
      term: "Spring 2026",
      courseCode: "ELED 3320",
      sectionNumber: "12410",
      instructor: "Celeste Alba",
      syllabusUrl: "#", // TODO: replace with real syllabus URL
    },
    {
      term: "Fall 2025",
      courseCode: "ELED 3320",
      sectionNumber: "22015",
      instructor: "Alex Smith",
      syllabusUrl: "#",
    },
    {
      term: "Spring 2025",
      courseCode: "ELED 3320",
      sectionNumber: "19876",
      instructor: "Jordan Lee",
      syllabusUrl: "#",
    },
  ];

  // Group syllabi by term
  const syllabiByTerm = placeholderSyllabi.reduce<
    Record<string, typeof placeholderSyllabi>
  >((acc, syllabus) => {
    if (!acc[syllabus.term]) {
      acc[syllabus.term] = [];
    }
    acc[syllabus.term].push(syllabus);
    return acc;
  }, {});

  // Sort terms by recency (newest term first)
  const sortedTerms = Object.keys(syllabiByTerm).sort((a, b) => {
    const pa = parseTerm(a);
    const pb = parseTerm(b);
    if (pa.year !== pb.year) return pb.year - pa.year;
    if (pa.seasonIdx !== pb.seasonIdx) return pb.seasonIdx - pa.seasonIdx;
    return 0;
  });

  return (
    <ModalShell onClose={onClose} ariaLabel="Course syllabi">
      {/* Header */}
      <h2 className="text-lg font-semibold tracking-tight text-slate-50 sm:text-xl">
        Syllabi Found For {code}
      </h2>

      <p className="mt-2 text-xs sm:text-sm text-slate-300">
        These syllabi are provided by{" "}
        <a
          href="https://uh.simplesyllabus.com/en-US/syllabus-library"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-rose-300 underline-offset-2 hover:underline"
        >
          Simple Syllabus
        </a>
        , the official University of Houston course syllabus provider.
      </p>

      <p className="mt-1 text-[11px] sm:text-xs text-slate-400">
        All live data from this 3rd party service may be outdated (≤ 14 days)
        due to caching. Use the button below to view the latest options.
      </p>

      {/* Button to view up-to-date syllabi */}
      <div className="mt-3">
        <a
          href={simpleSyllabusCourseUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-rose-500/90 px-3.5 py-1.5 text-xs font-semibold text-slate-50 shadow-sm transition-transform transition-shadow hover:-translate-y-[1px] hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400"
        >
          <span aria-hidden>🔗</span>
          <span>View latest syllabi for {code}</span>
        </a>
      </div>

      {/* Grouped syllabi by term */}
      <div className="mt-4 space-y-4">
        {sortedTerms.map((term) => {
          const group = syllabiByTerm[term];
          const status = getTermStatus(term);

          return (
            <section key={term} className="space-y-2">
              {/* Term heading + status badge */}
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-slate-100">{term}</h3>
                {renderTermStatusBadge(status)}
              </div>

              {/* Cards for this term */}
              <div className="space-y-2">
                {group.map((syllabus, idx) => (
                  <a
                    key={`${syllabus.term}-${syllabus.courseCode}-${syllabus.sectionNumber}-${idx}`}
                    href={syllabus.syllabusUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block rounded-xl border border-slate-800 bg-slate-900/80 p-3 sm:p-3.5 transition-transform transition-shadow hover:-translate-y-[1px] hover:bg-slate-900 hover:shadow-md"
                  >
                    <div className="flex items-stretch gap-3">
                      {/* Emoji icon in a rounded-corner square, matching row height */}
                      <div className="shrink-0 self-stretch">
                        <div className="flex h-full min-h-[2.25rem] w-9 sm:w-10 items-center justify-center rounded-lg bg-slate-800/70">
                          <span aria-hidden className="text-base">
                            📄
                          </span>
                        </div>
                      </div>

                      {/* Text content */}
                      <div className="min-w-0 flex-1 flex flex-col justify-center">
                        <p className="text-xs sm:text-sm text-slate-200 truncate">
                          {syllabus.courseCode} {syllabus.sectionNumber} -{" "}
                          {courseTitle ?? "Course title"}
                        </p>
                        <p className="mt-0.5 text-xs sm:text-sm text-slate-300 truncate">
                          {syllabus.instructor}
                        </p>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </section>
          );
        })}
      </div>

      {/* Legal / attribution footer */}
      <div className="mt-4 border-t border-slate-800 pt-3 text-[10px] sm:text-[11px] text-slate-500">
        <p>
          © 2025 Simple Higher Ed. Simple Syllabus is a product of Simple Higher
          Ed.
        </p>
        <p className="mt-1">
          CoogPlanner is an independent, unofficial tool and is not affiliated
          with or endorsed by Simple Higher Ed or the University of Houston. All
          syllabus content and imagery remain the property of their respective
          owners.
        </p>
      </div>
    </ModalShell>
  );
}

/**
 * Example modal: enrollment help (single-column)
 */
function EnrollmentHelpModal({ onClose }: BaseModalProps) {
  return (
    <ModalShell onClose={onClose} ariaLabel="Enrollment help">
      <h2 className="text-lg font-semibold tracking-tight text-slate-50 sm:text-xl">
        Enrollment Help
      </h2>
      <p className="mt-2 text-sm text-slate-200">
        Explain how to use CoogPlanner for enrollment, key dates, and tips for
        building the best schedule.
      </p>
      <p className="mt-3 text-xs text-slate-400">
        Opened via <code>?modal=enrollment-help</code>.
      </p>
    </ModalShell>
  );
}

export const modalRegistry: Record<
  ModalSlug,
  React.ComponentType<BaseModalProps>
> = {
  "course-more-info": CourseMoreInfoModal,
  "course-syllabi-list": CourseSyllabiListModal,
  "enrollment-help": EnrollmentHelpModal,
};
