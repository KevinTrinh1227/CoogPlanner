"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { courseSearchIndex } from "@/lib/courseSearchIndex";

// ---- types (from your courseSearchIndex schema) --------------------

export type CourseSearchEntry = (typeof courseSearchIndex)[number];

type RecentCourse = Pick<
  CourseSearchEntry,
  "slug" | "courseCode" | "courseTitle"
>;

const MAX_RESULTS = 30; // doubled from 15
const MAX_RECENT = 8;
const RECENT_STORAGE_KEY = "coogplanner_recent_course_searches";

// ---- ranking helpers ----------------------------------------------

function normalize(str: string): string {
  return str.normalize("NFKC").toLowerCase();
}

function scoreCourse(entry: CourseSearchEntry, rawQuery: string): number {
  const q = normalize(rawQuery.trim());
  if (!q) return 0;

  const code = normalize(entry.courseCode);
  const codeCompact = code.replace(/\s+/g, "");
  const title = normalize(entry.courseTitle);
  const context = normalize(entry.courseContext ?? "");

  const titleWords = title.split(/\s+/);

  let score = 0;

  // 1) Exact / near-exact code match (e.g., "cosc 3320" or "cosc3320")
  if (code === q || codeCompact === q.replace(/\s+/g, "")) {
    score += 220;
  }

  // 2) Title starts with query
  if (title.startsWith(q)) {
    score += 180;
  }

  // 3) Any word in title starts with query
  if (titleWords.some((w) => w.startsWith(q))) {
    score += 150;
  }

  // 4) Code starts with query
  if (code.startsWith(q) || codeCompact.startsWith(q)) {
    score += 130;
  }

  // 5) Code contains query
  if (code.includes(q) || codeCompact.includes(q)) {
    score += 100;
  }

  // 6) Title contains query
  if (title.includes(q)) {
    score += 90;
  }

  // 7) Context contains query (weaker)
  if (context.includes(q)) {
    score += 40;
  }

  // Small boost for more specific queries
  score += Math.min(q.length, 10);

  return score;
}

/**
 * Returns *at most* MAX_RESULTS course matches.
 * - If query is empty: default list (sorted by courseCode).
 * - If query present: ranked list based on scoreCourse.
 */
function getCourseMatches(query: string): CourseSearchEntry[] {
  const trimmed = query.trim();

  // Empty query → default suggestions
  if (!trimmed) {
    return [...courseSearchIndex]
      .sort((a: CourseSearchEntry, b: CourseSearchEntry) =>
        a.courseCode.localeCompare(b.courseCode)
      )
      .slice(0, MAX_RESULTS);
  }

  const qNorm = normalize(trimmed);

  const scored = courseSearchIndex
    .map((entry: CourseSearchEntry) => ({
      entry,
      score: scoreCourse(entry, qNorm),
    }))
    .filter((item) => item.score > 0);

  scored.sort(
    (
      a: { entry: CourseSearchEntry; score: number },
      b: { entry: CourseSearchEntry; score: number }
    ) => {
      if (b.score !== a.score) return b.score - a.score;
      const codeCmp = a.entry.courseCode.localeCompare(b.entry.courseCode);
      if (codeCmp !== 0) return codeCmp;
      return a.entry.courseTitle.localeCompare(b.entry.courseTitle);
    }
  );

  return scored.slice(0, MAX_RESULTS).map((s) => s.entry);
}

// -------------------------------------------------------------------

export default function SearchBar() {
  const router = useRouter();
  const pathname = usePathname();
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState({
    courses: true,
    instructors: true, // future
    programs: true, // future
  });

  const [query, setQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [recentCourses, setRecentCourses] = useState<RecentCourse[]>([]);

  const toggleFilter = (key: keyof typeof filters) => {
    setFilters((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Load recent searches from localStorage (client-side only)
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(RECENT_STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return;

      const sanitized: RecentCourse[] = parsed
        .filter(
          (item: any) =>
            item &&
            typeof item.slug === "string" &&
            typeof item.courseCode === "string" &&
            typeof item.courseTitle === "string"
        )
        .slice(0, MAX_RECENT);

      setRecentCourses(sanitized);
    } catch {
      // ignore bad JSON
    }
  }, []);

  const saveRecentCourse = (course: CourseSearchEntry) => {
    const entry: RecentCourse = {
      slug: course.slug,
      courseCode: course.courseCode,
      courseTitle: course.courseTitle,
    };

    setRecentCourses((prev) => {
      const withoutDup = prev.filter((c) => c.slug !== entry.slug);
      const next = [entry, ...withoutDup].slice(0, MAX_RECENT);
      if (typeof window !== "undefined") {
        try {
          window.localStorage.setItem(RECENT_STORAGE_KEY, JSON.stringify(next));
        } catch {
          // ignore storage errors
        }
      }
      return next;
    });
  };

  // On any route change, clear the search bar so it doesn't persist across pages.
  useEffect(() => {
    setQuery("");
  }, [pathname]);

  // Close filters & suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
        setFiltersOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Derived matches (for now: only courses are wired)
  const matchedCourses = filters.courses ? getCourseMatches(query) : [];
  const hasAnyResults = matchedCourses.length > 0; // instructors/programs later
  const isQueryEmpty = query.trim().length === 0;

  const handleNavigateToCourse = (course: CourseSearchEntry | RecentCourse) => {
    setShowSuggestions(false);
    setQuery(""); // clear after "search"
    // If this came from full CourseSearchEntry, save as recent
    if ("courseTitle" in course && "courseCode" in course && "slug" in course) {
      // course can be RecentCourse or CourseSearchEntry, both match this check
      saveRecentCourse(course as CourseSearchEntry);
    }
    router.push(`/courses/${course.slug}`);
  };

  return (
    <div className="mx-auto w-full max-w-5xl px-4 pt-3" ref={containerRef}>
      <div className="mx-auto w-full max-w-3xl">
        {/* Search + filters (single pill) */}
        <div className="relative">
          <div className="flex h-11 w-full items-center rounded-2xl border border-slate-800 bg-slate-950/80">
            {/* Input + icon */}
            <div className="relative flex-1 h-full">
              <input
                type="text"
                placeholder="Search UH Academics"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    // On Enter, navigate to the top match (if any)
                    if (matchedCourses.length > 0) {
                      const top = matchedCourses[0];
                      handleNavigateToCourse(top);
                    }
                  }
                }}
                className="h-full w-full bg-transparent pl-9 pr-2 text-[16px] md:text-sm text-slate-50 placeholder:text-slate-500 focus:outline-none"
              />

              {/* Search icon on the left */}
              <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                <svg
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                  className="h-4 w-4 text-slate-400"
                >
                  <path
                    d="M9 3.5a5.5 5.5 0 1 1-3.89 9.39l-2.6 2.6a.75.75 0 1 1-1.06-1.06l2.6-2.6A5.5 5.5 0 0 1 9 3.5Zm0 1.5a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z"
                    fill="currentColor"
                  />
                </svg>
              </div>
            </div>

            {/* Vertical separator */}
            <div className="mx-1 h-6 w-px bg-slate-800" />

            {/* Filters button as part of bar */}
            <button
              type="button"
              onClick={() => setFiltersOpen((prev) => !prev)}
              className="mr-1 inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-[16px] text-slate-300 transition-colors hover:bg-slate-900/60 hover:text-slate-50 md:text-sm"
            >
              <span className="inline-flex h-4 w-4 items-center justify-center md:h-4 md:w-4">
                <svg
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                  className="h-4 w-4 text-current"
                >
                  <path
                    d="M4 5h12M4 10h12M4 15h12M8 5a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm6 5a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm-6 5a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                </svg>
              </span>
              <span className="font-medium">Filters</span>
            </button>
          </div>

          {/* Filters dropdown */}
          <div
            className={`absolute right-0 z-30 mt-2 w-60 rounded-2xl border border-slate-800 bg-slate-950/98 p-3.5 text-xs text-slate-200 shadow-xl shadow-black/40 transition-all duration-150 ease-out ${
              filtersOpen
                ? "pointer-events-auto opacity-100 translate-y-0"
                : "pointer-events-none opacity-0 -translate-y-1"
            }`}
          >
            <div className="mb-2">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                Search Filters
              </p>
            </div>

            <div className="space-y-2">
              {/* Courses */}
              <button
                type="button"
                onClick={() => toggleFilter("courses")}
                className={`flex w-full items-center justify-between rounded-xl px-2.5 py-2 text-[11px] transition-colors ${
                  filters.courses
                    ? "bg-slate-900 text-slate-50 border border-emerald-500/70"
                    : "bg-transparent text-slate-300 border border-slate-800 hover:border-slate-600"
                }`}
              >
                <span className="flex items-center gap-2">
                  <span
                    className={`inline-flex h-3 w-3 rounded-full ${
                      filters.courses ? "bg-emerald-400" : "bg-slate-600"
                    }`}
                  />
                  <span>Courses</span>
                </span>
                <span
                  className={`text-[10px] ${
                    filters.courses ? "text-emerald-300" : "text-slate-500"
                  }`}
                >
                  {filters.courses ? "Showing" : "Not Showing"}
                </span>
              </button>

              {/* Instructors */}
              <button
                type="button"
                onClick={() => toggleFilter("instructors")}
                className={`flex w-full items-center justify-between rounded-xl px-2.5 py-2 text-[11px] transition-colors ${
                  filters.instructors
                    ? "bg-slate-900 text-slate-50 border border-emerald-500/40"
                    : "bg-transparent text-slate-300 border border-slate-800 hover:border-slate-600"
                }`}
              >
                <span className="flex items-center gap-2">
                  <span
                    className={`inline-flex h-3 w-3 rounded-full ${
                      filters.instructors ? "bg-emerald-400" : "bg-slate-600"
                    }`}
                  />
                  <span>Instructors</span>
                </span>
                <span
                  className={`text-[10px] ${
                    filters.instructors ? "text-emerald-300" : "text-slate-500"
                  }`}
                >
                  {filters.instructors ? "Showing" : "Not Showing"}
                </span>
              </button>

              {/* Programs / Degrees */}
              <button
                type="button"
                onClick={() => toggleFilter("programs")}
                className={`flex w-full items-center justify-between rounded-xl px-2.5 py-2 text-[11px] transition-colors ${
                  filters.programs
                    ? "bg-slate-900 text-slate-50 border border-emerald-500/40"
                    : "bg-transparent text-slate-300 border border-slate-800 hover:border-slate-600"
                }`}
              >
                <span className="flex items-center gap-2">
                  <span
                    className={`inline-flex h-3 w-3 rounded-full ${
                      filters.programs ? "bg-emerald-400" : "bg-slate-600"
                    }`}
                  />
                  <span>Programs / Degrees</span>
                </span>
                <span
                  className={`text-[10px] ${
                    filters.programs ? "text-emerald-300" : "text-slate-500"
                  }`}
                >
                  {filters.programs ? "Showing" : "Not Showing"}
                </span>
              </button>
            </div>
          </div>

          {/* Suggestions dropdown */}
          <div
            className={`absolute left-0 right-0 z-20 mt-2 rounded-2xl border border-slate-800 bg-slate-950/98 p-3 text-xs text-slate-200 shadow-2xl shadow-black/50 transition-all duration-150 ease-out ${
              showSuggestions && (hasAnyResults || query.trim().length >= 0)
                ? "pointer-events-auto opacity-100 translate-y-0"
                : "pointer-events-none opacity-0 -translate-y-1"
            }`}
          >
            <div className="max-h-80 space-y-4 overflow-y-auto custom-scrollbar">
              {/* Recent searches section (only when query empty) */}
              {isQueryEmpty && recentCourses.length > 0 && (
                <div>
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                    🕙 Recent Searches
                  </p>
                  <div className="space-y-1.5">
                    {recentCourses.map((course) => (
                      <button
                        key={`recent-${course.slug}`}
                        type="button"
                        className="w-full rounded-lg px-1.5 py-1.5 text-left hover:bg-slate-900"
                        onClick={() => handleNavigateToCourse(course)}
                      >
                        <p className="text-sm font-semibold text-slate-50">
                          {course.courseCode}
                        </p>
                        <p className="text-[11px] text-slate-300">
                          {course.courseTitle}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Courses section (only if there are matches) */}
              {matchedCourses.length > 0 && (
                <div>
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                    📚 Courses
                  </p>
                  <div className="space-y-1.5">
                    {matchedCourses.map((course: CourseSearchEntry) => (
                      <button
                        key={course.slug}
                        type="button"
                        className="w-full rounded-lg px-1.5 py-1.5 text-left hover:bg-slate-900"
                        onClick={() => handleNavigateToCourse(course)}
                      >
                        <p className="text-sm font-semibold text-slate-50">
                          {course.courseCode}
                        </p>
                        <p className="text-[11px] text-slate-300">
                          {course.courseTitle}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Empty state when there's a query and no matches */}
              {matchedCourses.length === 0 && query.trim().length > 0 && (
                <p className="px-1 py-1.5 text-[11px] text-slate-400">
                  No results yet. Try a course code (e.g.,{" "}
                  <span className="font-semibold text-slate-200">
                    COSC 3320
                  </span>
                  ) or a keyword like{" "}
                  <span className="font-semibold text-slate-200">
                    algorithms
                  </span>
                  .
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Helper text */}
        <p className="mt-2 text-center text-[11px] text-slate-400">
          Please enter a{" "}
          <span className="font-semibold text-slate-200">course</span>,{" "}
          <span className="font-semibold text-slate-200">instructor</span> or{" "}
          <span className="font-semibold text-slate-200">degree plan</span> to
          begin. (e.g., COSC 3380, Uma Ramamurthy, Computer Science B.S.)
        </p>
      </div>
    </div>
  );
}
