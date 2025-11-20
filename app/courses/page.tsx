// app/courses/page.tsx
import Link from "next/link";

const placeholderCourses = [
  {
    code: "COSC-1320",
    title: "Introduction to Programming",
    shortDesc: "First-time programming course using basic problem solving.",
  },
  {
    code: "COSC-2436",
    title: "Programming & Data Structures",
    shortDesc: "Core CS class covering lists, trees, and algorithm basics.",
  },
  {
    code: "COSC-3320",
    title: "Computer Architecture",
    shortDesc: "How computers actually work under the hood: CPU, memory, I/O.",
  },
  {
    code: "MATH-2414",
    title: "Calculus II",
    shortDesc: "Sequences, series, and more integrals. Heavy but important.",
  },
];

export default function CoursesPage() {
  return (
    <div className="space-y-8 py-8 md:py-10">
      {/* Header card */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-lg md:p-8">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-700/70 bg-slate-900/80 px-3 py-1 text-[11px] font-medium uppercase tracking-wide text-slate-200">
            <span aria-hidden className="text-sm">
              📚
            </span>
            <span>Browse Courses</span>
          </div>
          <p className="text-xs text-slate-400">
            Showing placeholder UH courses — search & filters coming soon.
          </p>
        </div>

        <h1 className="text-balance text-2xl font-semibold tracking-tight text-slate-50 md:text-3xl">
          Explore UH courses
        </h1>

        <p className="mt-4 max-w-3xl text-xs leading-relaxed text-slate-300 md:text-sm">
          This page will eventually list all UH courses with filters, tags, and
          difficulty stats. For now, here’s a small sample of courses you can
          click into to see a course detail layout.
        </p>
      </section>

      {/* Course cards */}
      <section className="grid gap-4 md:grid-cols-2">
        {placeholderCourses.map((course) => (
          <Link
            key={course.code}
            href={`/courses/${course.code}`}
            className="group flex flex-col rounded-2xl border border-slate-800 bg-slate-950/80 p-5 shadow-sm transition-all duration-150 hover:-translate-y-0.5 hover:border-red-400/70 hover:shadow-md md:p-6"
          >
            <div className="flex items-baseline justify-between gap-3">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                {course.code}
              </p>
              <span className="text-[11px] text-slate-500 group-hover:text-slate-300">
                View details →
              </span>
            </div>
            <h2 className="mt-1 text-sm font-semibold tracking-tight text-slate-50 md:text-base">
              {course.title}
            </h2>
            <p className="mt-2 text-xs leading-relaxed text-slate-300 md:text-sm">
              {course.shortDesc}
            </p>
          </Link>
        ))}
      </section>
    </div>
  );
}
