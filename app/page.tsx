import Link from "next/link";
import { siteConfig } from "@/config/site";
import EnrollmentCountdown from "@/components/EnrollmentCountdown";

export default function Home() {
  return (
    <div className="space-y-14 md:space-y-16">
      {/* Hero */}
      <section
        id="get-started"
        className="mt-4 md:mt-8 grid items-center gap-10 md:grid-cols-[1.3fr_minmax(0,1fr)]"
      >
        <div className="space-y-6">
          <EnrollmentCountdown />

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
              preferences - finding UH classes that satisfy degree requirements,
              keep work loads light when you need it, and finds/suggests easier
              options you might have missed.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/search"
              className="rounded-full bg-red-400 px-4 py-2 text-xs font-medium text-slate-950 shadow-sm hover:bg-red-300 md:px-5 md:text-sm"
            >
              🔎 Browse UH Academics
            </Link>
            <Link
              href="/my-degree"
              className="rounded-full border border-slate-700 bg-transparent px-4 py-2 text-xs font-medium text-slate-200 hover:border-slate-500 hover:bg-slate-900 md:px-5 md:text-sm"
            >
              📄 Analyze My Degree & Progress
            </Link>
          </div>
        </div>

        {/* Right side: personalized degree card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-lg shadow-black/30">
          <div className="mb-4 flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="text-xs font-medium text-slate-200">
                Kevin Trinh · B.S. Computer Science
              </p>
              <p className="text-[11px] text-slate-400">
                Tuned to your personal preferences
              </p>
            </div>
            <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-medium text-emerald-300">
              Target Grad: Fall '28
            </span>
          </div>

          <div className="space-y-3 text-[11px] text-slate-300">
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
              <p className="mb-1 text-[11px] font-semibold text-slate-100">
                Your preferences
              </p>
              <ul className="space-y-1">
                <li>• You work ~30 hours / week alongside classes</li>
                <li>• Super easy courses to boost my GPA</li>
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
                  Suggested Next Term:
                </p>
                <p className="text-[10px] text-slate-400">
                  12 hours · Light work load
                </p>
              </div>
              <ul className="mt-2 space-y-1">
                <li>
                  <span className="font-medium">COSC 2436</span> - Major
                  requirement · Difficulty 3.7 / 5 · Est. GPA 3.23
                </li>
                <li>
                  <span className="font-medium">COSC 3320</span> - Major
                  requirement · Difficulty 3.4 / 5 · Est. GPA 3.37
                </li>
                <li>
                  <span className="font-medium">PHIL 1301</span> - Lang,
                  Philosophy &amp; Culture · Easier option · Est. GPA 3.61
                </li>
                <li>
                  <span className="font-medium">MATH 2318</span> - Math
                  requirement · Difficuly: 4.2/5 · Est. GPA 3.18
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400">
            <p>
              Current GPA before plan:{" "}
              <span className="font-semibold text-slate-100">3.32</span> → after
              plan: <span className="font-semibold text-slate-100">3.42</span>{" "}
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
            <p>Students analyzed</p>
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
      {/* Features */}
      <section id="features" className="space-y-5">
        <div className="space-y-2">
          <h2 className="text-lg font-semibold tracking-tight text-slate-50">
            {siteConfig.features.title}
          </h2>
          <p className="text-xs text-slate-400">
            {siteConfig.features.description}
          </p>
        </div>

        <div className="grid items-stretch gap-4 md:grid-cols-3">
          {siteConfig.features.items.map((feature) => (
            <div
              key={feature.id}
              className="flex h-full flex-col rounded-xl border border-slate-800 bg-slate-900/70 p-4 text-left transition-all duration-150 hover:-translate-y-1 hover:border-slate-600 hover:bg-slate-900 hover:shadow-lg hover:shadow-black/40"
            >
              <p className="text-sm font-semibold text-slate-100">
                {feature.title}
              </p>
              <p className="mt-2 text-[11px] text-slate-400">{feature.body}</p>
            </div>
          ))}
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

      {/* Student journey from transcript to schedule */}
      <section id="student-story" className="space-y-5">
        <div className="space-y-2">
          <h2 className="text-lg font-semibold tracking-tight text-slate-50">
            From transcript to a schedule that fits your life
          </h2>
          <p className="text-xs text-slate-400">
            This student works a lot, has a long commute, and doesn&apos;t want
            to blindly follow UH&apos;s generic CS template. He wants something
            easier to manage, better for his situation, and still on track for
            graduation.
          </p>
        </div>

        {/* Step 0 – Student profile (outside timeline) */}
        <div className="space-y-3 rounded-2xl border border-slate-800 bg-slate-950/70 p-4 sm:p-5 text-[11px] text-slate-300">
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-900 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-slate-300">
              <span aria-hidden>👤</span>
              <span>Step 0 · Student profile</span>
            </span>
            <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-medium text-emerald-300">
              Target grad: Fall 2028
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950 text-xl">
              <span aria-hidden>🧑‍💻</span>
            </div>
            <div className="flex min-w-[12rem] flex-col">
              <p className="text-sm font-semibold text-slate-100">
                Kevin Trinh
              </p>
              <p className="text-[11px] text-slate-400">
                B.S. Computer Science · UH Main Campus
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {/* responsive: stacked on mobile, side-by-side on >= sm */}
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1 rounded-lg border border-slate-800 bg-slate-950/80 p-3">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                  Academic snapshot
                </p>
                <ul className="space-y-1">
                  <li>• ~55 completed credit hours</li>
                  <li>• Current GPA: 3.32 (aiming for 3.5+)</li>
                  <li>• On track for B.S. Computer Science</li>
                </ul>
              </div>

              <div className="space-y-1 rounded-lg border border-slate-800 bg-slate-950/80 p-3">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                  Life &amp; obligations
                </p>
                <ul className="space-y-1">
                  <li>• Works ~30 hours/week off-campus</li>
                  <li>• Long commute to UH</li>
                  <li>• Needs time for interview prep &amp; projects</li>
                </ul>
              </div>
            </div>

            <div className="space-y-1 rounded-lg border border-dashed border-emerald-500/40 bg-emerald-500/5 p-3">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-emerald-300">
                Core question
              </p>
              <p className="text-[11px] text-slate-100">
                &quot;How do I pick classes so I can work 30 hours, keep my GPA
                climbing, and still graduate around Fall 2028 — without just
                following a one-size-fits-all template?&quot;
              </p>
            </div>
          </div>
        </div>

        {/* Vertical timeline for the rest of the journey */}
        <div className="relative mt-2">
          {/* Center vertical line */}
          <div className="pointer-events-none absolute left-4 top-0 bottom-0 w-px bg-slate-800 md:left-1/2 md:-translate-x-1/2" />

          <div className="space-y-6">
            {/* Step 1 · Input */}
            <div className="relative pl-10 md:grid md:grid-cols-2 md:gap-6 md:pl-0">
              <div className="absolute left-4 top-4 h-3 w-3 rounded-full bg-red-400 ring-4 ring-slate-950 md:left-1/2 md:-translate-x-1/2" />
              <div className="mb-3 text-[10px] text-slate-400 md:order-2 md:mb-0">
                <span className="inline-flex items-center gap-1 rounded-full bg-slate-950 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-slate-300">
                  <span aria-hidden>①</span>
                  <span>Step 1 · Kevin&apos;s input</span>
                </span>
                <p className="mt-1">What Kevin tells Coog Planner.</p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-3 sm:p-4 text-[11px] text-slate-300 md:order-1">
                <p>
                  Kevin uploads his{" "}
                  <span className="font-semibold">
                    unofficial transcript (PDF)
                  </span>{" "}
                  and selects{" "}
                  <span className="font-semibold">B.S. Computer Science</span>{" "}
                  with a goal of about{" "}
                  <span className="font-semibold">4 more semesters</span> before
                  graduating.
                </p>
                <p className="mt-2 text-[10px] text-slate-500">
                  In the product, this matches the fields on the{" "}
                  <span className="font-semibold text-slate-300">
                    My Degree
                  </span>{" "}
                  page — upload → choose degree → choose rough timeline.
                </p>

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <Link
                    href="/my-degree"
                    className="inline-flex items-center gap-1 rounded-full border border-slate-700 bg-slate-950 px-3 py-1.5 text-[10px] font-medium text-slate-100 hover:border-slate-500 hover:bg-slate-900"
                  >
                    Open My Degree
                    <span aria-hidden>↗</span>
                  </Link>

                  <button
                    type="button"
                    className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-medium text-slate-400 hover:text-slate-200"
                  >
                    Learn more
                    <span aria-hidden>↗</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Step 2 · Understand */}
            <div className="relative pl-10 md:grid md:grid-cols-2 md:gap-6 md:pl-0">
              <div className="absolute left-4 top-4 h-3 w-3 rounded-full bg-slate-300 ring-4 ring-slate-950 md:left-1/2 md:-translate-x-1/2" />
              <div className="mb-3 text-[10px] text-slate-400 md:mb-0 md:text-right">
                <span className="inline-flex items-center gap-1 rounded-full bg-slate-950 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-slate-300">
                  <span aria-hidden>②</span>
                  <span>Step 2 · Coog Planner understands</span>
                </span>
                <p className="mt-1">How the system summarizes him.</p>
              </div>

              <div className="space-y-2 rounded-xl border border-slate-800 bg-slate-900/70 p-3 sm:p-4 text-[11px] text-slate-300">
                <p>
                  Coog Planner parses the transcript and builds a summary of
                  where Kevin is in his degree and what constraints matter.
                </p>
                <div className="mt-1 space-y-2 rounded-lg border border-slate-800 bg-slate-950/80 p-3">
                  <div className="flex flex-wrap gap-1.5">
                    <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] text-slate-200">
                      ✅ Completed CS + math foundation
                    </span>
                    <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] text-slate-200">
                      ⏳ Remaining: upper-level CS
                    </span>
                    <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] text-slate-200">
                      📚 Remaining: 2–3 core classes
                    </span>
                    <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] text-slate-200">
                      💼 30 hr/week work constraint
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500">
                    These chips are basically{" "}
                    <span className="font-semibold text-slate-300">
                      how the system describes you
                    </span>{" "}
                    after reading your transcript and preferences.
                  </p>
                </div>

                <button
                  type="button"
                  className="mt-3 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-medium text-slate-400 hover:text-slate-200"
                >
                  Learn more
                  <span aria-hidden>↗</span>
                </button>
              </div>
            </div>

            {/* Step 3 · Plan */}
            <div className="relative pl-10 md:grid md:grid-cols-2 md:gap-6 md:pl-0">
              <div className="absolute left-4 top-4 h-3 w-3 rounded-full bg-slate-300 ring-4 ring-slate-950 md:left-1/2 md:-translate-x-1/2" />
              <div className="mb-3 text-[10px] text-slate-400 md:order-2 md:mb-0">
                <span className="inline-flex items-center gap-1 rounded-full bg-slate-950 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-slate-300">
                  <span aria-hidden>③</span>
                  <span>Step 3 · Suggested term layout</span>
                </span>
                <p className="mt-1">What a first plan looks like.</p>
              </div>

              <div className="space-y-2 rounded-xl border border-slate-800 bg-slate-900/70 p-3 sm:p-4 text-[11px] text-slate-300 md:order-1">
                <p>
                  Based on Kevin&apos;s history, constraints, and target
                  timeline, Coog Planner suggests a next-semester mix.
                </p>
                <div className="mt-1 space-y-1 rounded-lg border border-slate-800 bg-slate-950/80 p-3">
                  <div className="flex items-center justify-between gap-2 text-[11px] text-slate-200">
                    <span>Example next term</span>
                    <span className="text-[10px] text-slate-400">
                      12–15 hrs · light/medium mix
                    </span>
                  </div>
                  <ul className="mt-1 space-y-1">
                    <li>
                      <span className="font-semibold">COSC 2436</span> · Major ·
                      &quot;medium&quot; difficulty
                    </li>
                    <li>
                      <span className="font-semibold">COSC 3320</span> · Major ·
                      taken with a lighter core
                    </li>
                    <li>
                      <span className="font-semibold">PHIL 1301</span> · Core ·
                      historically easier option to balance the term
                    </li>
                    <li>
                      <span className="font-semibold">MATH 2318</span> · Needed
                      for later CS courses
                    </li>
                  </ul>
                </div>
                <p className="text-[10px] text-slate-500">
                  In the real UI, each row shows tags like &quot;Major&quot; /
                  &quot;Core&quot; and a difficulty hint, so even if you
                  don&apos;t know the course yet, you know why it&apos;s
                  recommended.
                </p>

                <button
                  type="button"
                  className="mt-3 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-medium text-slate-400 hover:text-slate-200"
                >
                  Learn more
                  <span aria-hidden>↗</span>
                </button>
              </div>
            </div>

            {/* Step 4 · Outcome */}
            <div className="relative pb-2 pl-10 md:grid md:grid-cols-2 md:gap-6 md:pb-0 md:pl-0">
              <div className="absolute left-4 top-4 h-3 w-3 rounded-full bg-emerald-400 ring-4 ring-slate-950 md:left-1/2 md:-translate-x-1/2" />
              <div className="mb-3 text-[10px] text-slate-400 md:mb-0 md:text-right">
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-emerald-200">
                  <span aria-hidden>④</span>
                  <span>End · Outcome</span>
                </span>
                <p className="mt-1">What Kevin actually gets.</p>
              </div>

              <div className="space-y-2 rounded-xl border border-emerald-500/60 bg-emerald-500/5 p-3 sm:p-4 text-[11px] text-slate-200">
                <ul className="space-y-1">
                  <li>
                    • Mix of 1 hard CS, 2 medium, 1 lighter core — realistic
                    with a 30 hr/week job.
                  </li>
                  <li>
                    •{" "}
                    <span className="font-semibold">
                      Still on track for Spring 2028
                    </span>{" "}
                    graduation instead of silently slipping a term.
                  </li>
                  <li>
                    • Easier courses are chosen that{" "}
                    <span className="font-semibold">boost GPA</span> while still
                    fulfilling real degree requirements.
                  </li>
                  <li>
                    • Kevin can drag classes between terms to explore &quot;hard
                    now vs. hard later&quot; without constantly redoing
                    spreadsheets.
                  </li>
                </ul>

                <button
                  type="button"
                  className="mt-3 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-medium text-emerald-200 hover:text-emerald-100"
                >
                  Learn more
                  <span aria-hidden>↗</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
