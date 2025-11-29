// components/modals/CourseSyllabiListModal.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import ModalShell from "./ModalShell";
import type { BaseModalProps } from "./modalTypes";

// Match the server's response shape (subset of CachedSyllabus)
interface UiSyllabus {
  docCode: string;
  courseCode: string; // e.g. "MANA 3335"
  sectionNumber: string; // e.g. "25658"
  title: string;
  termName: string; // e.g. "Spring 2026"
  instructorFullName: string;
  instructorFirstName: string;
  instructorLastName: string;
  instructorEmail: string | null;
  createdAt: string | null;
  modifiedAt: string | null;
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
  // Jan–Feb: Winter, Mar–May: Spring, Jun–Aug: Summer, Sep–Nov: Fall
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

function formatDateShort(iso: string | null): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;

  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Syllabi list modal (single-column layout, grouped by term)
 */
export default function CourseSyllabiListModal({ onClose }: BaseModalProps) {
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

  const [syllabi, setSyllabi] = useState<UiSyllabus[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch from our own API (which is server-side cached for 14 days)
  useEffect(() => {
    let cancelled = false;

    async function load() {
      setIsLoading(true);
      setError(null);

      try {
        const res = await fetch(
          `/api/simple-syllabus?courseCode=${encodeURIComponent(code)}`
        );

        if (!res.ok) {
          throw new Error(`Failed to load syllabi (${res.status})`);
        }

        const data = await res.json();
        if (!cancelled) {
          setSyllabi((data.syllabi ?? []) as UiSyllabus[]);
          setIsLoading(false);
        }
      } catch (err) {
        console.error("Error loading syllabi", err);
        if (!cancelled) {
          setError("Unable to load syllabi right now.");
          setIsLoading(false);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [code]);

  const list = syllabi ?? [];

  // Group syllabi by termName
  const syllabiByTerm = list.reduce<Record<string, UiSyllabus[]>>(
    (acc, syllabus) => {
      const term = syllabus.termName || "Unknown Term";
      if (!acc[term]) acc[term] = [];
      acc[term].push(syllabus);
      return acc;
    },
    {}
  );

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
        CoogPlanner caches these results for up to 14 days. Use the button below
        to view the very latest options directly.
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

      {/* Status area */}
      <div className="mt-4 text-[11px] sm:text-xs text-slate-400">
        {isLoading && <p>Scanning Simple Syllabus for sections of {code}…</p>}
        {!isLoading && error && <p className="text-rose-300">{error}</p>}
        {!isLoading && !error && list.length === 0 && (
          <p>
            No public syllabi were found for this course. You can double-check
            using{" "}
            <a
              href={simpleSyllabusCourseUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-rose-300 underline-offset-2 hover:underline"
            >
              the official Simple Syllabus library
            </a>
            .
          </p>
        )}
      </div>

      {/* Grouped syllabi by term */}
      {!isLoading && !error && list.length > 0 && (
        <div className="mt-4 space-y-4">
          {sortedTerms.map((term) => {
            const group = syllabiByTerm[term];
            const status = getTermStatus(term);

            return (
              <section key={term} className="space-y-2">
                {/* Term heading + status badge */}
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-slate-100">
                    {term}
                  </h3>
                  {renderTermStatusBadge(status)}
                </div>

                {/* Cards for this term */}
                <div className="space-y-2">
                  {group.map((syllabus) => {
                    const createdShort = formatDateShort(syllabus.createdAt);
                    const updatedShort = formatDateShort(syllabus.modifiedAt);

                    // Build "Created / Modified" line
                    let dateLine: string | null = null;
                    if (createdShort && updatedShort) {
                      if (createdShort === updatedShort) {
                        dateLine = `Created: ${createdShort}`;
                      } else {
                        dateLine = `Created: ${createdShort} · Modified: ${updatedShort}`;
                      }
                    } else if (createdShort) {
                      dateLine = `Created: ${createdShort}`;
                    } else if (updatedShort) {
                      dateLine = `Modified: ${updatedShort}`;
                    }

                    // Build per-syllabus doc URL:
                    // https://uh.simplesyllabus.com/en-US/doc/{docCode}/Spring-2026-MANA-3335-25658-?mode=view
                    let syllabusUrl = simpleSyllabusCourseUrl;

                    if (
                      syllabus.docCode &&
                      syllabus.termName &&
                      syllabus.courseCode &&
                      syllabus.sectionNumber
                    ) {
                      const termSlug = syllabus.termName.replace(/\s+/g, "-"); // "Spring 2026" → "Spring-2026"
                      const courseSlug = syllabus.courseCode.replace(
                        /\s+/g,
                        "-"
                      ); // "MANA 3335" → "MANA-3335"
                      const pathSlug = `${termSlug}-${courseSlug}-${syllabus.sectionNumber}-`;

                      syllabusUrl = `https://uh.simplesyllabus.com/en-US/doc/${
                        syllabus.docCode
                      }/${encodeURIComponent(pathSlug)}?mode=view`;
                    }

                    return (
                      <a
                        key={syllabus.docCode}
                        href={syllabusUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block rounded-xl border border-slate-800 bg-slate-900/80 p-3 sm:p-3.5 transition-transform transition-shadow hover:-translate-y-[1px] hover:bg-slate-900 hover:shadow-md"
                      >
                        <div className="flex items-stretch gap-3">
                          {/* Emoji icon in a rounded-corner square */}
                          <div className="shrink-0 self-stretch">
                            <div className="flex h-full min-h-[2.25rem] w-9 sm:w-10 items-center justify-center rounded-lg bg-slate-800/70">
                              <span aria-hidden className="text-xl sm:text-2xl">
                                📄
                              </span>
                            </div>
                          </div>

                          {/* Text content */}
                          <div className="min-w-0 flex-1 flex flex-col justify-center">
                            <div className="flex flex-col gap-0.5 sm:flex-row sm:items-center sm:justify-between sm:gap-2">
                              {/* Left: course + instructor */}
                              <div className="min-w-0">
                                <p className="text-xs sm:text-sm text-slate-200 truncate">
                                  {syllabus.courseCode} {syllabus.sectionNumber}{" "}
                                  - {courseTitle ?? syllabus.title}
                                </p>
                                <p className="mt-0.5 text-xs sm:text-sm text-slate-300 truncate">
                                  {syllabus.instructorFullName ||
                                    "Instructor TBA"}
                                  {syllabus.instructorEmail && (
                                    <span className="text-[10px] sm:text-xs text-slate-400">
                                      {" "}
                                      · {syllabus.instructorEmail}
                                    </span>
                                  )}
                                </p>
                              </div>

                              {/* Right: created / modified, right-aligned */}
                              {dateLine && (
                                <div className="mt-1 sm:mt-0 flex-shrink-0 text-right text-[10px] text-slate-500">
                                  {dateLine}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </a>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      )}

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
