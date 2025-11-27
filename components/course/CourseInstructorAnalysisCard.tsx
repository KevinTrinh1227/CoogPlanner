// components/course/CourseInstructorAnalysisCard.tsx

import type { Course } from "@/lib/courses";

interface CourseInstructorAnalysisCardProps {
  course: Course | null;
}

export default function CourseInstructorAnalysisCard({
  course,
}: CourseInstructorAnalysisCardProps) {
  // If somehow no course got passed in, show a safe fallback
  if (!course) {
    return (
      <section className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 md:p-6">
        <h2 className="text-base font-semibold tracking-tight text-slate-50 md:text-lg">
          Instructor overview
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-200 md:text-[15px]">
          We don&apos;t have instructor details available for this course yet.
          As more historical data is added, this section will highlight the
          professors who commonly teach the course and how their sections tend
          to perform.
        </p>
      </section>
    );
  }

  const hasNarrative = Boolean(course.instructorNarrative?.trim());

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 md:p-6">
      <h2 className="text-base font-semibold tracking-tight text-slate-50 md:text-lg">
        Analysis Over {course.code} Instructors
      </h2>

      <p className="mt-2 text-sm leading-relaxed text-slate-200 md:text-[15px]">
        {hasNarrative ? (
          course.instructorNarrative
        ) : (
          <>
            This course has been taught by several instructors over recent
            terms. Each professor emphasizes different aspects of the material —
            some lean more theoretical, while others focus on hands-on problem
            solving and implementation. Use the instructor list and past
            sections above to explore who has taught this course, how their
            sections have performed, and which teaching style best fits how you
            like to learn.
          </>
        )}
      </p>
    </section>
  );
}
