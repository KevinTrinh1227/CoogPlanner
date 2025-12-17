// app/rankings/page.tsx
"use client";

import { useMemo, useState } from "react";
import { PageBreadcrumb } from "@/components/PageBreadcrumb";

type SortKey = "gpa" | "enrollment" | "difficulty" | "name";

interface LeaderItem {
  id: number;
  name: string;
  code: string;
  type: "course" | "professor";
  gpa: number; // 0–4 scale
  enrollment: number;
  difficulty: number; // 1–5, lower = easier
}

interface Preset {
  id: string;
  label: string;
  description: string;
  examples: string[];
}

const mockLeaders: LeaderItem[] = [
  {
    id: 1,
    name: "Intro to Psychology",
    code: "PSYC 2301",
    type: "course",
    gpa: 3.8,
    enrollment: 820,
    difficulty: 2.1,
  },
  {
    id: 2,
    name: "MATH for Business & Life",
    code: "MATH 1313",
    type: "course",
    gpa: 3.7,
    enrollment: 640,
    difficulty: 2.3,
  },
  {
    id: 3,
    name: "Dr. Rivera",
    code: "COSC • Algorithms",
    type: "professor",
    gpa: 3.4,
    enrollment: 310,
    difficulty: 3.1,
  },
  {
    id: 4,
    name: "US History Since 1877",
    code: "HIST 1378",
    type: "course",
    gpa: 3.5,
    enrollment: 720,
    difficulty: 2.6,
  },
  {
    id: 5,
    name: "Dr. Chen",
    code: "MATH • Calculus II",
    type: "professor",
    gpa: 2.9,
    enrollment: 260,
    difficulty: 4.2,
  },
  {
    id: 6,
    name: "Fundamentals of Public Speaking",
    code: "COMM 1332",
    type: "course",
    gpa: 3.6,
    enrollment: 590,
    difficulty: 2.4,
  },
];

const presets: Preset[] = [
  {
    id: "gpa-boosters",
    label: "GPA Booster Classes",
    description:
      "Courses with historically higher average GPAs and lighter grade penalties. Great when you need a safer GPA boost, but still verify how they fit your degree plan.",
    examples: [
      "Upper-level electives with strong grade history",
      "Lab or project courses known for generous curves",
      "Core classes with consistently high term GPAs",
    ],
  },
  {
    id: "easiest-core",
    label: "Easiest Core Courses",
    description:
      "Core-curriculum options with lower reported difficulty and higher pass rates. Useful when choosing between multiple ways to satisfy the same requirement.",
    examples: [
      "History vs. Political Science for Core Govt/History",
      "Different Life & Physical Science options",
      "Communication core classes with lighter workloads",
    ],
  },
  {
    id: "popular-professors",
    label: "Most Popular Professors",
    description:
      "Instructors with consistently high enrollment and strong grade trends, based on recent terms. Popular doesn’t always mean easy-check the details.",
    examples: [
      "Professors whose sections fill first at registration",
      "Highly rated instructors in STEM gateway courses",
      "Professors repeatedly recommended by peers",
    ],
  },
  {
    id: "most-enrolled",
    label: "Most Enrolled Courses",
    description:
      "High-traffic courses that fill quickly every term. Watch these if you care about registration timing and backup options.",
    examples: [
      "Large intro courses required for multiple majors",
      "Core requirements taken by most first/second-years",
      "Popular electives with limited section counts",
    ],
  },
];

export default function RankingsPage() {
  const [activePresetId, setActivePresetId] = useState<string | null>(null);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortKey, setSortKey] = useState<SortKey>("gpa");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const activePreset = presets.find((p) => p.id === activePresetId) ?? null;

  const sortedLeaders = useMemo(() => {
    const data = [...mockLeaders];

    data.sort((a, b) => {
      let valA: number | string = "";
      let valB: number | string = "";

      switch (sortKey) {
        case "gpa":
          valA = a.gpa;
          valB = b.gpa;
          break;
        case "enrollment":
          valA = a.enrollment;
          valB = b.enrollment;
          break;
        case "difficulty":
          valA = a.difficulty;
          valB = b.difficulty;
          break;
        case "name":
        default:
          valA = a.name.toLowerCase();
          valB = b.name.toLowerCase();
          break;
      }

      if (typeof valA === "string" && typeof valB === "string") {
        const cmp = valA.localeCompare(valB);
        return sortDir === "asc" ? cmp : -cmp;
      }

      const numA = valA as number;
      const numB = valB as number;
      if (numA === numB) return 0;
      return sortDir === "asc" ? numA - numB : numB - numA;
    });

    return data.slice(0, rowsPerPage);
  }, [rowsPerPage, sortDir, sortKey]);

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-10 lg:py-14">
      {/* Breadcrumb */}
      <PageBreadcrumb
        crumbs={[{ label: "Rankings & leaderboards" }]}
        showStarAndCart={false}
        className="mb-3"
      />

      {/* Page header */}
      <section>
        <div className="flex items-center gap-3">
          <h1 className="text-balance text-2xl font-semibold tracking-tight text-slate-50 md:text-3xl">
            🏆 Rankings &amp; Leaderboards
          </h1>
        </div>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-300">
          Explore GPA trends, popular professors, and high-enrollment classes.
          These rankings are based on historical data and are meant to guide
          planning, not replace official advising or degree audits.
        </p>
      </section>

      {/* Top overview stats */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 transition-all duration-150 hover:-translate-y-0.5 hover:border-brand-light/70 hover:bg-slate-950/90 hover:shadow-lg hover:shadow-black/50">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Top GPA professor
          </p>
          <p className="mt-2 text-sm font-semibold text-slate-50">Dr. Rivera</p>
          <p className="text-xs text-slate-400">COSC • Algorithms</p>
          <p className="mt-3 text-xs text-emerald-300">
            Avg GPA: <span className="font-semibold">3.4</span>
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 transition-all duration-150 hover:-translate-y-0.5 hover:border-brand-light/70 hover:bg-slate-950/90 hover:shadow-lg hover:shadow-black/50">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Top GPA course
          </p>
          <p className="mt-2 text-sm font-semibold text-slate-50">
            Intro to Psychology
          </p>
          <p className="text-xs text-slate-400">PSYC 2301</p>
          <p className="mt-3 text-xs text-emerald-300">
            Avg GPA: <span className="font-semibold">3.8</span>
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 transition-all duration-150 hover:-translate-y-0.5 hover:border-brand-light/70 hover:bg-slate-950/90 hover:shadow-lg hover:shadow-black/50">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Most enrolled course
          </p>
          <p className="mt-2 text-sm font-semibold text-slate-50">
            US History Since 1877
          </p>
          <p className="text-xs text-slate-400">HIST 1378</p>
          <p className="mt-3 text-xs text-sky-300">
            Recent term: <span className="font-semibold">720+</span> seats
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 transition-all duration-150 hover:-translate-y-0.5 hover:border-brand-light/70 hover:bg-slate-950/90 hover:shadow-lg hover:shadow-black/50">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Easiest difficulty (sample)
          </p>
          <p className="mt-2 text-sm font-semibold text-slate-50">COMM 1332</p>
          <p className="text-xs text-slate-400">
            Fundamentals of Public Speaking
          </p>
          <p className="mt-3 text-xs text-emerald-300">
            Difficulty index: <span className="font-semibold">2.4 / 5</span>
          </p>
        </div>
      </section>

      {/* Preset ranking chips */}
      <section className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Most common rankings students look for
        </p>
        <div className="flex flex-wrap gap-2">
          {presets.map((preset) => {
            const isActive = activePresetId === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => setActivePresetId(isActive ? null : preset.id)}
                className={`inline-flex items-center gap-2 rounded-xl border px-3 py-1.5 text-xs font-medium transition-all duration-150 ${
                  isActive
                    ? "border-brand-light/90 bg-brand-light/20 text-brand-light shadow-lg shadow-black/40"
                    : "border-slate-700 bg-slate-900/70 text-slate-200 hover:-translate-y-0.5 hover:border-brand-light/60 hover:bg-slate-900/90 hover:text-brand-light"
                }`}
              >
                <span className="text-sm" aria-hidden>
                  {preset.id === "gpa-boosters"
                    ? "📈"
                    : preset.id === "easiest-core"
                    ? "🧩"
                    : preset.id === "popular-professors"
                    ? "👩‍🏫"
                    : "📊"}
                </span>
                <span>{preset.label}</span>
              </button>
            );
          })}
        </div>

        {/* Preset description dropdown */}
        <div
          className={`overflow-hidden text-sm text-slate-300 transition-all duration-200 ease-out ${
            activePreset
              ? "max-h-[260px] pt-2 opacity-100"
              : "max-h-0 pt-0 opacity-0"
          }`}
          aria-hidden={!activePreset}
        >
          {activePreset && (
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 text-xs leading-relaxed md:text-sm">
              <p className="font-semibold text-slate-50">
                {activePreset.label}
              </p>
              <p className="mt-1 text-slate-300">{activePreset.description}</p>
              <ol className="mt-2 list-decimal space-y-1 pl-5 text-slate-300">
                {activePreset.examples.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ol>
              <p className="mt-2 text-[11px] text-slate-500">
                These shortcuts will later plug into real filters (GPA,
                difficulty, enrollment, cores, etc.) so you can jump straight to
                the rankings that matter for your plan.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Leaderboard */}
      <section id="leaderboards" className="space-y-4 pt-4">
        {/* Title + placeholder text as full-width lines */}
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-slate-50">
            Leaderboard
          </h2>
          <p className="mt-1 text-xs text-slate-400">
            Placeholder data for now - this will be wired up to real Coog
            Planner stats (courses, professors, terms, filters).
          </p>
        </div>

        {/* Filters row below title */}
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Display count:</span>
            <select
              value={rowsPerPage}
              onChange={(e) => setRowsPerPage(Number(e.target.value))}
              className="rounded-xl border border-slate-700 bg-slate-950/80 px-3 py-2 text-xs text-slate-100 outline-none transition-all duration-150 hover:border-brand-light/70 focus:border-brand-light/80"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400">Sort by:</span>
            <select
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value as SortKey)}
              className="rounded-xl border border-slate-700 bg-slate-950/80 px-3 py-2 text-xs text-slate-100 outline-none transition-all duration-150 hover:border-brand-light/70 focus:border-brand-light/80"
            >
              <option value="gpa">GPA (highest)</option>
              <option value="enrollment">Enrollment</option>
              <option value="difficulty">Difficulty</option>
              <option value="name">Name (A–Z)</option>
            </select>
          </div>

          <button
            type="button"
            onClick={() =>
              setSortDir((prev) => (prev === "asc" ? "desc" : "asc"))
            }
            className="inline-flex items-center gap-1 rounded-xl border border-slate-700 bg-slate-950/80 px-3 py-2 text-[11px] font-medium text-slate-100 transition-all duration-150 hover:-translate-y-0.5 hover:border-brand-light/70 hover:bg-slate-900/90 hover:text-brand-light"
          >
            <span>{sortDir === "asc" ? "Ascending" : "Descending"}</span>
            <span aria-hidden>{sortDir === "asc" ? "↑" : "↓"}</span>
          </button>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/80">
          <div className="max-h-[480px] overflow-x-auto">
            <table className="min-w-full text-left text-xs text-slate-300 md:text-sm">
              <thead className="border-b border-slate-800 bg-slate-950/90">
                <tr>
                  <th className="px-4 py-3 font-medium text-slate-400">#</th>
                  <th className="px-4 py-3 font-medium text-slate-400">Name</th>
                </tr>
              </thead>
              <tbody>
                {sortedLeaders.map((item, index) => (
                  <tr
                    key={item.id}
                    className="border-t border-slate-800/80 hover:bg-slate-900/70"
                  >
                    <td className="px-4 py-3 align-middle text-[11px] text-slate-500">
                      {index + 1}
                    </td>
                    <td className="px-4 py-3 align-middle">
                      <span className="text-xs font-semibold text-slate-50 md:text-sm">
                        {item.name}
                      </span>
                    </td>
                  </tr>
                ))}

                {sortedLeaders.length === 0 && (
                  <tr>
                    <td
                      colSpan={2}
                      className="px-4 py-6 text-center text-xs text-slate-500"
                    >
                      No rankings available yet. Once data is loaded,
                      you&apos;ll see courses and professors here.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <p className="text-[11px] text-slate-500">
          Note: Rankings are based on placeholder data today. In the live app,
          these stats will be scoped by term, campus, level (undergrad/grad),
          and your selected filters.
        </p>
      </section>
    </div>
  );
}
