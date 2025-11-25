// app/search/page.tsx

import Link from "next/link";

const exampleCourses = [
  { code: "COSC 1336", title: "Programming Fundamentals" },
  { code: "COSC 2436", title: "Programming & Data Structures" },
  { code: "COSC 3320", title: "Algorithms and Data Structures" },
  { code: "COSC 3360", title: "Operating Systems" },
  { code: "COSC 3380", title: "Design File and Database Systems" },
].sort((a, b) => a.code.localeCompare(b.code));

const exampleInstructors = [
  { name: "Carlos Alberto Rincon Castro", dept: "Computer Science" },
  { name: "Jaspal Subhlok", dept: "Computer Science" },
  { name: "Shishir Shah", dept: "Computer Science" },
].sort((a, b) => a.name.localeCompare(b.name));

const examplePrograms = [
  { name: "Computer Science B.S.", college: "NSM" },
  { name: "Mechanical Engineering B.S.", college: "Engineering" },
  { name: "Psychology B.A.", college: "CLASS" },
].sort((a, b) => a.name.localeCompare(b.name));

export default function SearchPage() {
  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-8">
      {/* Header */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-2">
            {/* Breadcrumb */}
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
              <Link href="/" className="hover:text-slate-300">
                Home
              </Link>
              <span className="text-slate-600">/</span>
              <span className="text-slate-400">Browse academics</span>
            </div>

            <div className="space-y-1">
              <h1 className="text-xl font-semibold tracking-tight text-slate-50 sm:text-2xl">
                Browse UH academics
              </h1>
              <p className="max-w-2xl text-xs text-slate-400 sm:text-[13px]">
                Use the global search bar to jump directly to any course,
                instructor, or degree plan. Or start from one of the hubs below
                to explore the catalog at your own pace.
              </p>
            </div>
          </div>

          {/* Share button (visual only) */}
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-full border border-slate-700 bg-slate-950/80 px-3 py-1.5 text-[11px] font-medium text-slate-200 shadow-sm transition-colors hover:border-slate-500 hover:bg-slate-900"
          >
            <span className="inline-flex h-3.5 w-3.5 items-center justify-center">
              <svg
                viewBox="0 0 20 20"
                aria-hidden="true"
                className="h-3.5 w-3.5 text-slate-300"
              >
                <path
                  d="M13.5 3.5a2 2 0 1 1 1.415 3.414l-7.03 3.514a2 2 0 0 1-1.87 2.772A2 2 0 1 1 6 10.5c.23 0 .45.04.654.116l7.03-3.515A2 2 0 0 1 13.5 3.5Z"
                  fill="currentColor"
                />
              </svg>
            </span>
            <span>Share</span>
          </button>
        </div>

        {/* Mode chips – visual only for now */}
        <div className="inline-flex flex-wrap gap-1 rounded-full border border-slate-800 bg-slate-950/80 p-1 text-[11px] text-slate-300">
          <button className="rounded-full bg-slate-900 px-3 py-1 font-medium text-slate-50">
            All
          </button>
          <button className="rounded-full px-3 py-1 hover:bg-slate-900 hover:text-slate-50">
            Courses
          </button>
          <button className="rounded-full px-3 py-1 hover:bg-slate-900 hover:text-slate-50">
            Instructors
          </button>
          <button className="rounded-full px-3 py-1 hover:bg-slate-900 hover:text-slate-50">
            Programs / Degrees
          </button>
        </div>
      </section>

      {/* Quick hubs */}
      <section className="space-y-3">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
          Jump into a hub
        </p>
        <div className="grid gap-3 md:grid-cols-2">
          {/* Courses hub */}
          <Link
            href="/courses"
            className="group flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-950/80 p-4 text-left transition-all duration-150 hover:-translate-y-0.5 hover:border-brand-light/70 hover:bg-slate-950 hover:shadow-lg hover:shadow-black/40"
          >
            <div className="flex items-center gap-2">
              <span
                aria-hidden
                className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-900 text-sm"
              >
                📚
              </span>
              <div>
                <p className="text-sm font-semibold text-slate-50">Courses</p>
                <p className="text-[11px] text-slate-400">
                  Browse UH courses with titles, codes, and future data like
                  difficulty and grade history.
                </p>
              </div>
            </div>
            <span className="mt-3 inline-flex items-center text-[11px] font-medium text-red-400 group-hover:text-red-300">
              Go to courses
              <span aria-hidden className="ml-1">
                ↗
              </span>
            </span>
          </Link>

          {/* Instructors hub */}
          <Link
            href="/instructors"
            className="group flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-950/80 p-4 text-left transition-all duration-150 hover:-translate-y-0.5 hover:border-brand-light/70 hover:bg-slate-950 hover:shadow-lg hover:shadow-black/40"
          >
            <div className="flex items-center gap-2">
              <span
                aria-hidden
                className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-900 text-sm"
              >
                👩‍🏫
              </span>
              <div>
                <p className="text-sm font-semibold text-slate-50">
                  Instructors
                </p>
                <p className="text-[11px] text-slate-400">
                  Explore instructors, see which courses they teach, and later
                  compare sections and trends.
                </p>
              </div>
            </div>
            <span className="mt-3 inline-flex items-center text-[11px] font-medium text-red-400 group-hover:text-red-300">
              Go to instructors
              <span aria-hidden className="ml-1">
                ↗
              </span>
            </span>
          </Link>

          {/* Programs / Degrees hub */}
          <Link
            href="/programs"
            className="group flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-950/80 p-4 text-left transition-all duration-150 hover:-translate-y-0.5 hover:border-brand-light/70 hover:bg-slate-950 hover:shadow-lg hover:shadow-black/40"
          >
            <div className="flex items-center gap-2">
              <span
                aria-hidden
                className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-900 text-sm"
              >
                🎓
              </span>
              <div>
                <p className="text-sm font-semibold text-slate-50">
                  Programs / Degrees
                </p>
                <p className="text-[11px] text-slate-400">
                  See how requirements are structured for each program and how
                  Coog Planner will map your transcript to them.
                </p>
              </div>
            </div>
            <span className="mt-3 inline-flex items-center text-[11px] font-medium text-red-400 group-hover:text-red-300">
              Go to programs
              <span aria-hidden className="ml-1">
                ↗
              </span>
            </span>
          </Link>

          {/* Academic calendar hub */}
          <a
            href="https://uh.edu/academics/courses-enrollment/academic-calendar/"
            target="_blank"
            rel="noreferrer"
            className="group flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-950/80 p-4 text-left transition-all duration-150 hover:-translate-y-0.5 hover:border-brand-light/70 hover:bg-slate-950 hover:shadow-lg hover:shadow-black/40"
          >
            <div className="flex items-center gap-2">
              <span
                aria-hidden
                className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-900 text-sm"
              >
                🗓️
              </span>
              <div>
                <p className="text-sm font-semibold text-slate-50">
                  Academic calendar
                </p>
                <p className="text-[11px] text-slate-400">
                  Check key dates for registration, add/drop, and finals. Coog
                  Planner will later overlay these on your plans.
                </p>
              </div>
            </div>
            <span className="mt-3 inline-flex items-center text-[11px] font-medium text-red-400 group-hover:text-red-300">
              Open UH academic calendar
              <span aria-hidden className="ml-1">
                ↗
              </span>
            </span>
          </a>
        </div>
      </section>

      {/* Sample catalog slices */}
      <section className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            Sample catalog slices
          </p>
          <p className="text-[11px] text-slate-500">
            These are just examples — use the search bar above for full data.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Courses column */}
          <div className="flex h-full flex-col rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-[12px] font-semibold uppercase tracking-wide text-slate-400">
                  Courses
                </p>
                <p className="text-[11px] text-slate-500">Sample A–Z</p>
              </div>
            </div>

            <ul className="mt-3 space-y-2 text-[11px] text-slate-200">
              {exampleCourses.map((c) => {
                const slug = c.code.replace(/\s+/g, "-");
                return (
                  <li key={c.code}>
                    <Link
                      href={`/courses/${slug}`}
                      className="block rounded-lg px-2 py-1.5 hover:bg-slate-900"
                    >
                      <p className="text-[12px] font-semibold text-slate-50">
                        {c.code}
                      </p>
                      <p className="text-[11px] text-slate-300">{c.title}</p>
                    </Link>
                  </li>
                );
              })}
            </ul>

            <p className="mt-3 text-[10px] text-slate-500">
              Later: full pagination + filters by college, level, and term.
            </p>
          </div>

          {/* Instructors column */}
          <div className="flex h-full flex-col rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-[12px] font-semibold uppercase tracking-wide text-slate-400">
                  Instructors
                </p>
                <p className="text-[11px] text-slate-500">Sample A–Z</p>
              </div>
            </div>

            <ul className="mt-3 space-y-2 text-[11px] text-slate-200">
              {exampleInstructors.map((i) => (
                <li
                  key={i.name}
                  className="rounded-lg px-2 py-1.5 hover:bg-slate-900"
                >
                  <p className="text-[12px] font-semibold text-slate-50">
                    {i.name}
                  </p>
                  <p className="text-[11px] text-slate-300">{i.dept}</p>
                </li>
              ))}
            </ul>

            <p className="mt-3 text-[10px] text-slate-500">
              Later: connect instructors to courses, sections, and historical
              trends.
            </p>
          </div>

          {/* Programs / Degrees column */}
          <div className="flex h-full flex-col rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-[12px] font-semibold uppercase tracking-wide text-slate-400">
                  Programs / Degrees
                </p>
                <p className="text-[11px] text-slate-500">Sample A–Z</p>
              </div>
            </div>

            <ul className="mt-3 space-y-2 text-[11px] text-slate-200">
              {examplePrograms.map((p) => (
                <li
                  key={p.name}
                  className="rounded-lg px-2 py-1.5 hover:bg-slate-900"
                >
                  <p className="text-[12px] font-semibold text-slate-50">
                    {p.name}
                  </p>
                  <p className="text-[11px] text-slate-300">{p.college}</p>
                </li>
              ))}
            </ul>

            <p className="mt-3 text-[10px] text-slate-500">
              Later: show how each program lines up with your transcript and
              remaining requirements.
            </p>
          </div>
        </div>
      </section>

      {/* Footer hint */}
      <section className="text-[11px] text-slate-500">
        <p>
          As Coog Planner grows, this page will switch between dedicated views
          like <code className="text-slate-300">/search/courses</code>,{" "}
          <code className="text-slate-300">/search/instructors</code>, and{" "}
          <code className="text-slate-300">/search/programs</code> while still
          sharing the same global search bar at the top of every page.
        </p>
      </section>
    </main>
  );
}
