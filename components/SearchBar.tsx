"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function SearchBar() {
  const router = useRouter();
  const [filtersOpen, setFiltersOpen] = useState(false);

  const [filters, setFilters] = useState({
    courses: true,
    instructors: true,
    programs: true,
  });

  const [query, setQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const containerRef = useRef<HTMLDivElement | null>(null);

  const toggleFilter = (key: keyof typeof filters) => {
    setFilters((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Example data (placeholder)
  const courseExamples = [
    {
      code: "COSC 3320",
      title: "Algorithms and Data Structures",
    },
    {
      code: "COSC 3380",
      title: "Design File and Database Systems",
    },
  ];

  const instructorExamples = [
    {
      name: "Shishir Shah",
      subtitle: "Professor · Computer Science",
    },
    {
      name: "Carlos Alberto Rincon Castro",
      subtitle: "Associate Professor · Computer Science",
    },
  ];

  const programExamples = [
    {
      name: "Computer Science B.S.",
      subtitle: "College of Natural Sciences & Mathematics",
    },
    {
      name: "Psychology B.A.",
      subtitle: "College of Liberal Arts & Social Sciences",
    },
  ];

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
                placeholder="Search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setShowSuggestions(true)}
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
              className="mr-1 inline-flex items-center gap-1 rounded-xl px-3 py-1 text-[11px] font-medium text-slate-200 hover:bg-slate-900"
            >
              <span className="inline-flex h-4 w-4 items-center justify-center">
                <svg
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                  className="h-4 w-4 text-slate-300"
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
              <span>Filters</span>
            </button>
          </div>

          {/* Filters dropdown */}
          <div
            className={`absolute right-0 z-30 mt-2 w-52 rounded-xl border border-slate-800 bg-slate-950/95 p-3 text-xs text-slate-200 shadow-xl shadow-black/40 transition-all duration-150 ease-out ${
              filtersOpen
                ? "pointer-events-auto opacity-100 translate-y-0"
                : "pointer-events-none opacity-0 -translate-y-1"
            }`}
          >
            <p className="mb-2 text-[11px] font-semibold text-slate-400">
              Show in results
            </p>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={filters.courses}
                  onChange={() => toggleFilter("courses")}
                  className="h-3 w-3 rounded border-slate-700 bg-slate-900 text-red-400 focus:ring-red-400"
                />
                <span>Courses</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={filters.instructors}
                  onChange={() => toggleFilter("instructors")}
                  className="h-3 w-3 rounded border-slate-700 bg-slate-900 text-red-400 focus:ring-red-400"
                />
                <span>Instructors</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={filters.programs}
                  onChange={() => toggleFilter("programs")}
                  className="h-3 w-3 rounded border-slate-700 bg-slate-900 text-red-400 focus:ring-red-400"
                />
                <span>Programs / Degrees</span>
              </label>
            </div>
          </div>

          {/* Suggestions dropdown */}
          <div
            className={`absolute left-0 right-0 z-20 mt-2 rounded-2xl border border-slate-800 bg-slate-950/98 p-4 text-xs text-slate-200 shadow-2xl shadow-black/50 transition-all duration-150 ease-out ${
              showSuggestions
                ? "pointer-events-auto opacity-100 translate-y-0"
                : "pointer-events-none opacity-0 -translate-y-1"
            }`}
          >
            {/* Courses */}
            <div>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                Courses
              </p>
              <div className="space-y-2">
                {courseExamples.map((course) => (
                  <button
                    key={course.code}
                    type="button"
                    className="w-full rounded-lg px-1 py-1.5 text-left hover:bg-slate-900"
                    onClick={() => {
                      setShowSuggestions(false);

                      const label = `${course.code}: ${course.title}`;
                      setQuery(label);

                      if (course.code === "COSC 3320") {
                        // Build slug: "COSC 3320" -> "COSC-3320" (keeps uppercase)
                        const slug = course.code.replace(/\s+/g, "-");
                        router.push(`/courses/${slug}`);
                      }
                    }}
                  >
                    <p className="text-sm font-semibold text-slate-50">
                      {course.code}
                    </p>
                    <p className="text-[11px] text-slate-300">{course.title}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="my-3 h-px w-full bg-slate-800" />

            {/* Instructors */}
            <div>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                Instructors
              </p>
              <div className="space-y-2">
                {instructorExamples.map((inst) => (
                  <button
                    key={inst.name}
                    type="button"
                    className="w-full rounded-lg px-1 py-1.5 text-left hover:bg-slate-900"
                    onClick={() => {
                      setQuery(inst.name);
                      setShowSuggestions(false);
                    }}
                  >
                    <p className="text-sm font-semibold text-slate-50">
                      {inst.name}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      {inst.subtitle}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="my-3 h-px w-full bg-slate-800" />

            {/* Programs / Degrees */}
            <div>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                Programs / Degrees
              </p>
              <div className="space-y-2">
                {programExamples.map((prog) => (
                  <button
                    key={prog.name}
                    type="button"
                    className="w-full rounded-lg px-1 py-1.5 text-left hover:bg-slate-900"
                    onClick={() => {
                      setQuery(prog.name);
                      setShowSuggestions(false);
                    }}
                  >
                    <p className="text-sm font-semibold text-slate-50">
                      {prog.name}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      {prog.subtitle}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Helper text */}
        <p className="mt-2 text-center text-[11px] text-slate-400">
          Please enter a{" "}
          <span className="font-semibold text-slate-200">course</span>,{" "}
          <span className="font-semibold text-slate-200">instructor</span> or{" "}
          <span className="font-semibold text-slate-200">degree plan</span> to
          begin. (e.g., COSC 1336, Rincon Castro, Computer Science B.S.)
        </p>
      </div>
    </div>
  );
}
