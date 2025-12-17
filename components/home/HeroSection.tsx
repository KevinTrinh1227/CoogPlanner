// components/home/HeroSection.tsx
import Link from "next/link";
import EnrollmentCountdown from "@/components/EnrollmentCountdown";

export default function HeroSection() {
  return (
    <section
      id="get-started"
      className="mt-4 md:mt-0 grid items-center gap-10 md:grid-cols-[1.3fr_minmax(0,1fr)]"
    >
      {/* Left side */}
      <div className="space-y-6">
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

        {/* Buttons + countdown (wrapper left-aligned; countdown centers within wrapper width) */}
        <div className="inline-flex flex-col items-start gap-1.5">
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/progress"
              prefetch={false} // ✅ prevent RSC prefetch storms (Workers CPU)
              className="rounded-lg bg-red-400 px-4 py-2 text-xs font-medium text-slate-950 shadow-sm hover:bg-red-300 md:px-5 md:text-sm"
            >
              🚀 My Academic Progress
            </Link>

            <Link
              href="/search"
              prefetch={false} // ✅ prevent RSC prefetch storms (Workers CPU)
              className="rounded-lg border border-slate-700 bg-transparent px-4 py-2 text-xs font-medium text-slate-200 hover:border-slate-500 hover:bg-slate-900 md:px-5 md:text-sm"
            >
              🔎 Browse UH Academics
            </Link>
          </div>

          {/* This line centers relative to the width of the buttons row */}
          <EnrollmentCountdown variant="line" className="mt-0 w-full" />
        </div>
      </div>

      {/* Right side: demo video */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-1 shadow-lg shadow-black/30">
        <video
          className="h-full w-full rounded-xl"
          src="/videos/hero-demo.mp4"
          poster="/videos/hero-demo-poster.png"
          controls
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        />
      </div>
    </section>
  );
}
