import Link from "next/link";

export default function Home() {
  return (
    <div className="space-y-14 md:space-y-16">
      {/* Hero */}
      <section
        id="get-started"
        className="grid items-center gap-10 md:grid-cols-[1.3fr_minmax(0,1fr)]"
      >
        {/* Left side: copy */}
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/70 px-3 py-1 text-[11px] text-slate-300">
            <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
            Coog Planner · UH degree & semester planning
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl font-semibold tracking-tight text-slate-50 md:text-4xl">
              Build a UH schedule that{" "}
              <span className="text-red-400">
                respects your time and difficulty,
              </span>{" "}
              not just a catalog checklist.
            </h1>
            <p className="max-w-xl text-sm leading-relaxed text-slate-300 md:text-[15px]">
              Coog Planner suggests semesters around your work hours and
              preferences — finding UH classes that satisfy degree requirements,
              keep loads light when you need it, and surface easier options you
              might have missed.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="#courses"
              className="rounded-full bg-red-400 px-4 py-2 text-xs font-medium text-slate-950 shadow-sm hover:bg-red-300 md:px-5 md:text-sm"
            >
              Browse UH academics
            </Link>
            <button className="rounded-full border border-slate-700 bg-transparent px-4 py-2 text-xs font-medium text-slate-200 hover:border-slate-500 hover:bg-slate-900 md:px-5 md:text-sm">
              Get your transcript analysis (soon)
            </button>
          </div>
        </div>

        {/* Right side: personalized degree card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-lg shadow-black/30">
          <div className="mb-4 flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="text-xs font-medium text-slate-200">
                Kevin Huy Trinh · B.S. Computer Science
              </p>
              <p className="text-[11px] text-slate-400">
                Plan tuned to your personal life and preferences
              </p>
            </div>
            <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-medium text-emerald-300">
              Grad: Spring 2027
            </span>
          </div>

          <div className="space-y-3 text-[11px] text-slate-300">
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
              <p className="mb-1 text-[11px] font-semibold text-slate-100">
                Your preferences
              </p>
              <ul className="space-y-1">
                <li>• Work ~30 hours / week alongside classes</li>
                <li>• Prefer lighter, manageable technical loads</li>
                <li>• Electives on Mon / Wed / Fri only when possible</li>
                <li>
                  • Still must satisfy remaining core, major, and elective
                  requirements
                </li>
              </ul>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
              <div className="flex items-center justify-between">
                <p className="font-medium text-slate-100">
                  Recommended next semester
                </p>
                <p className="text-[10px] text-slate-400">
                  12–15 hours · light/medium load
                </p>
              </div>
              <ul className="mt-2 space-y-1">
                <li>
                  <span className="font-medium">COSC 2436</span> — Major
                  requirement · Difficulty 3.7 / 5 · Est. GPA 3.2
                </li>
                <li>
                  <span className="font-medium">COSC 3320</span> — Major
                  requirement · Difficulty 3.4 / 5 · Est. GPA 3.3
                </li>
                <li>
                  <span className="font-medium">PHIL 1301</span> — Fulfills:
                  Lang, Philosophy &amp; Culture · M/W/F · Easier option · Est.
                  GPA 3.6
                </li>
              </ul>
            </div>

            <div className="rounded-lg border border-dashed border-slate-800 bg-slate-950/60 p-2 text-[10px] text-slate-400">
              Mix of 2 technicals + 1 lighter core. Estimated okay for ~30 hours
              of work per week with study time, based on past student data.
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400">
            <p>
              Estimated GPA before plan:{" "}
              <span className="font-semibold text-slate-100">3.32</span> → after
              plan: <span className="font-semibold text-slate-100">3.45</span>{" "}
              (projected)
            </p>
          </div>
        </div>
      </section>

      {/* Stats / counters */}
      <section
        id="stats"
        className="rounded-2xl border border-slate-800 bg-slate-950/80 px-4 py-5 md:px-6"
      >
        <div className="grid gap-4 text-center text-[11px] text-slate-400 sm:grid-cols-3 lg:grid-cols-6">
          <div className="space-y-1">
            <p className="text-base font-semibold text-slate-50 md:text-lg">
              1,204+
            </p>
            <p>Student transcripts analyzed</p>
          </div>
          <div className="space-y-1">
            <p className="text-base font-semibold text-slate-50 md:text-lg">
              3,587+
            </p>
            <p>Total plans generated</p>
          </div>
          <div className="space-y-1">
            <p className="text-base font-semibold text-slate-50 md:text-lg">
              842+
            </p>
            <p>Custom schedules shared</p>
          </div>
          <div className="space-y-1">
            <p className="text-base font-semibold text-slate-50 md:text-lg">
              18,940+
            </p>
            <p>Total items searched</p>
          </div>
          <div className="space-y-1">
            <p className="text-base font-semibold text-slate-50 md:text-lg">
              2,119+
            </p>
            <p>Total favorited</p>
          </div>
          <div className="space-y-1">
            <p className="text-base font-semibold text-slate-50 md:text-lg">
              463+
            </p>
            <p>Total added to cart</p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="space-y-5">
        <div className="space-y-2">
          <h2 className="text-lg font-semibold tracking-tight text-slate-50">
            Built for Coogs, not generic students.
          </h2>
          <p className="text-xs text-slate-400">
            Coog Planner is opinionated around UH workflows: catalogs,
            prerequisites, and how students actually plan their semesters.
          </p>
        </div>

        <div className="grid items-stretch gap-4 md:grid-cols-3">
          {/* 1 */}
          <div className="flex h-full flex-col rounded-xl border border-slate-800 bg-slate-900/70 p-4 text-left transition-all duration-150 hover:-translate-y-1 hover:border-slate-600 hover:bg-slate-900 hover:shadow-lg hover:shadow-black/40">
            <p className="text-sm font-semibold text-slate-100">
              UH-specific structure
            </p>
            <p className="mt-2 text-[11px] text-slate-400">
              Degree plans based on UH catalogs, not generic four-year
              templates. Separate core, major, and elective blocks.
            </p>
          </div>
          {/* 2 */}
          <div className="flex h-full flex-col rounded-xl border border-slate-800 bg-slate-900/70 p-4 text-left transition-all duration-150 hover:-translate-y-1 hover:border-slate-600 hover:bg-slate-900 hover:shadow-lg hover:shadow-black/40">
            <p className="text-sm font-semibold text-slate-100">
              Prereq-aware planning
            </p>
            <p className="mt-2 text-[11px] text-slate-400">
              Know instantly if a planned semester violates prerequisites or
              recommended sequences before enrollment.
            </p>
          </div>
          {/* 3 */}
          <div className="flex h-full flex-col rounded-xl border border-slate-800 bg-slate-900/70 p-4 text-left transition-all duration-150 hover:-translate-y-1 hover:border-slate-600 hover:bg-slate-900 hover:shadow-lg hover:shadow-black/40">
            <p className="text-sm font-semibold text-slate-100">
              Graduation timeline
            </p>
            <p className="mt-2 text-[11px] text-slate-400">
              Visualize best-case and realistic graduation semesters based on
              your planned loads.
            </p>
          </div>
          {/* 4 */}
          <div className="flex h-full flex-col rounded-xl border border-slate-800 bg-slate-900/70 p-4 text-left transition-all duration-150 hover:-translate-y-1 hover:border-slate-600 hover:bg-slate-900 hover:shadow-lg hover:shadow-black/40">
            <p className="text-sm font-semibold text-slate-100">
              Smart semester loads
            </p>
            <p className="mt-2 text-[11px] text-slate-400">
              Get a feel for when a semester is too heavy or too light with
              quick load indicators based on credits and course type mix.
            </p>
          </div>
          {/* 5 */}
          <div className="flex h-full flex-col rounded-xl border border-slate-800 bg-slate-900/70 p-4 text-left transition-all duration-150 hover:-translate-y-1 hover:border-slate-600 hover:bg-slate-900 hover:shadow-lg hover:shadow-black/40">
            <p className="text-sm font-semibold text-slate-100">
              What-if degree changes
            </p>
            <p className="mt-2 text-[11px] text-slate-400">
              Experiment with switching majors or adding a minor while seeing
              which classes still count and how your grad date shifts.
            </p>
          </div>
          {/* 6 */}
          <div className="flex h-full flex-col rounded-xl border border-slate-800 bg-slate-900/70 p-4 text-left transition-all duration-150 hover:-translate-y-1 hover:border-slate-600 hover:bg-slate-900 hover:shadow-lg hover:shadow-black/40">
            <p className="text-sm font-semibold text-slate-100">
              Shareable plans
            </p>
            <p className="mt-2 text-[11px] text-slate-400">
              Share read-only plans with friends, mentors, or advisors so
              everyone is aligned on your semesters and graduation path.
            </p>
          </div>
        </div>
      </section>

      {/* What it helps you decide */}
      <section id="how-it-works" className="space-y-4">
        <h2 className="text-lg font-semibold tracking-tight text-slate-50">
          What Coog Planner helps you decide
        </h2>
        <ul className="space-y-2 text-[12px] text-slate-300">
          <li>
            • Which classes can satisfy each remaining requirement, ranked by
            difficulty, time of day, and how well they fit your schedule.
          </li>
          <li>
            • How to balance “hard” and “easy” courses each term so you can work
            your job, stay sane, and still move toward graduation.
          </li>
          <li>
            • The impact of each plan on your estimated GPA and graduation
            semester as you drag courses between terms.
          </li>
        </ul>
      </section>
    </div>
  );
}
