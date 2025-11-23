// app/courses/[code]/page.tsx
import { notFound } from "next/navigation";
import { getCourseByCode, type Course, type GradeBucket } from "@/lib/courses";
import { PageBreadcrumb } from "@/components/PageBreadcrumb";

type CoursePageProps = {
  // ⚠️ params is now a Promise in async server components
  params: Promise<{ code: string }>;
};

// Map grade labels to bar colors
const gradeColors: Record<string, string> = {
  A: "bg-emerald-400", // lighter green
  B: "bg-emerald-500", // slightly darker green
  C: "bg-yellow-400",
  D: "bg-orange-400",
  F: "bg-red-500",
  W: "bg-purple-500",
  Other: "bg-slate-500",
};

function formatPercent(value: number | null): string {
  if (value == null) return "-";
  return `${value.toFixed(0)}%`;
}

function formatNumber(value: number | null): string {
  if (value == null) return "-";
  return value.toLocaleString();
}

function formatGpa(value: number | null): string {
  if (value == null) return "-";
  return value.toFixed(2);
}

function buildAnalysisText(course: Course): string {
  const code = course.code.replace("-", " ");
  const avgGpa = course.badges.gpa ?? course.snapshot.avgGpa ?? null;
  const drop = course.badges.dropRate ?? course.snapshot.dropRate ?? null;
  const difficulty = course.badges.difficultyLabel.toLowerCase();
  const trend = course.badges.trend.toLowerCase();

  const gpaPart =
    avgGpa != null
      ? `around a B-range average GPA of ${avgGpa.toFixed(2)}`
      : "a solid GPA profile";
  const dropPart =
    drop != null
      ? `About ${drop.toFixed(
          0
        )}% of students withdraw, so most who start the class finish it.`
      : "Most students who start the class finish it.";

  return `${code} – ${course.name} typically yields ${gpaPart}. Expect ${difficulty} difficulty with a ${trend} GPA trend over recent terms. ${dropPart} This course is usually taken after intro programming and is a key part of the algorithms / data structures core for CS majors.`;
}

function GradeBar({
  distribution,
  totalEnrolled,
}: {
  distribution: GradeBucket[];
  totalEnrolled: number | null;
}) {
  const total =
    totalEnrolled != null && totalEnrolled > 0 ? totalEnrolled : null;

  return (
    <div className="mt-4">
      {/* Multi-color stacked bar */}
      <div className="flex h-3 w-full overflow-hidden rounded-full bg-slate-900">
        {distribution.map((bucket) => (
          <div
            key={bucket.label}
            className={`h-full ${gradeColors[bucket.label] ?? "bg-slate-500"}`}
            style={{ width: `${bucket.percentage}%` }}
          />
        ))}
      </div>

      {/* Legend with student counts + % */}
      <div className="mt-3 flex w-full flex-wrap items-center justify-center gap-3 text-[11px] text-slate-300 md:text-xs">
        {distribution.map((bucket) => {
          const count =
            total != null
              ? Math.round((bucket.percentage / 100) * total)
              : null;

          return (
            <div
              key={bucket.label}
              className="inline-flex items-center gap-1.5"
            >
              <span
                className={`h-2 w-4 rounded-full ${
                  gradeColors[bucket.label] ?? "bg-slate-500"
                }`}
              />
              <span className="font-medium">{bucket.label}</span>
              <span className="text-slate-400">
                {count != null
                  ? `${count.toLocaleString()} students · ${bucket.percentage.toFixed(
                      0
                    )}%`
                  : `${bucket.percentage.toFixed(0)}%`}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function getTermRange(pastSections: Course["pastSections"]) {
  if (!pastSections.length) return null;

  const seasonOrder: Record<string, number> = {
    Winter: 0,
    Spring: 1,
    Summer: 2,
    Fall: 3,
  };

  const parseTerm = (term: string) => {
    const [season, yearStr] = term.split(" ");
    const year = parseInt(yearStr ?? "0", 10) || 0;
    const seasonIdx = seasonOrder[season] ?? 4;
    return { year, seasonIdx };
  };

  const sortedTerms = [...pastSections]
    .map((s) => s.term)
    .sort((a, b) => {
      const pa = parseTerm(a);
      const pb = parseTerm(b);
      if (pa.year !== pb.year) return pa.year - pb.year;
      return pa.seasonIdx - pb.seasonIdx;
    });

  return {
    earliest: sortedTerms[0],
    latest: sortedTerms[sortedTerms.length - 1],
  };
}

export default async function CourseDetailPage({ params }: CoursePageProps) {
  // ✅ unwrap the Promise first
  const resolvedParams = await params;
  const rawCode = resolvedParams.code; // e.g. "COSC-3320"

  if (!rawCode) {
    notFound();
  }

  const { course } = await getCourseByCode(rawCode);

  if (!course) {
    notFound();
  }

  const displayCode = course.code.replace("-", " ");
  const analysisText = buildAnalysisText(course);

  const creditLine =
    course.catalog.creditHours != null ||
    course.catalog.lectureHours != null ||
    course.catalog.labHours != null
      ? `Credit Hours: ${course.catalog.creditHours ?? "-"} (Lecture Hours: ${
          course.catalog.lectureHours ?? "-"
        } · Lab Hours: ${course.catalog.labHours ?? "-"})`
      : "";

  const snapshot = course.snapshot;
  const termRange = getTermRange(course.pastSections);

  const totalInstructors = course.instructors.length;
  const totalSections = course.pastSections.length;

  const pageSize = 10;
  const instructorPages = [];
  for (let i = 0; i < totalInstructors; i += pageSize) {
    instructorPages.push(course.instructors.slice(i, i + pageSize));
  }

  return (
    <div className="space-y-6 py-8 md:py-10">
      <PageBreadcrumb
        crumbs={[
          { label: "Courses", href: "/courses" },
          { label: displayCode },
        ]}
        showStarAndCart
        className="mb-3"
      />

      {/* Top hero – no card wrapper */}
      <section className="border-b border-slate-800 pb-6">
        <div className="space-y-3">
          <div className="space-y-1">
            <h1 className="text-balance text-xl font-semibold tracking-tight text-slate-50 sm:text-2xl md:text-3xl">
              {course.name}
            </h1>
            <p className="text-balance text-3xl font-semibold tracking-tight text-rose-300 sm:text-4xl md:text-5xl">
              {displayCode}
            </p>
          </div>

          {creditLine && (
            <p className="break-words text-xs font-medium text-slate-200 md:text-sm">
              {creditLine}
            </p>
          )}

          {/* GPA / Drop Rate / Difficulty / GPA Trend badges */}
          <div className="mt-2 flex w-full flex-wrap justify-start gap-1.5 text-[10px] md:gap-2 md:text-[11px]">
            {/* GPA */}
            {course.badges.gpa != null && (
              <div className="inline-flex items-center gap-1.5 rounded-md border border-slate-800 bg-slate-900 px-2 py-1">
                <span aria-hidden>📊</span>
                <span className="font-semibold text-slate-200">GPA:</span>
                <span
                  className={`font-semibold ${
                    course.badges.gpa >= 3
                      ? "text-emerald-300"
                      : course.badges.gpa >= 2.75
                      ? "text-amber-300"
                      : "text-red-300"
                  }`}
                >
                  {course.badges.gpa.toFixed(2)}
                </span>
              </div>
            )}

            {/* Drop Rate */}
            {course.badges.dropRate != null && (
              <div className="inline-flex items-center gap-1.5 rounded-md border border-slate-800 bg-slate-900 px-2 py-1">
                <span aria-hidden>📉</span>
                <span className="font-semibold text-slate-200">Drop Rate:</span>
                <span
                  className={`font-semibold ${
                    course.badges.dropRate <= 10
                      ? "text-emerald-300"
                      : course.badges.dropRate <= 20
                      ? "text-amber-300"
                      : "text-red-300"
                  }`}
                >
                  {course.badges.dropRate.toFixed(0)}%
                </span>
              </div>
            )}

            {/* Difficulty */}
            {course.badges.difficultyScore != null && (
              <div className="inline-flex items-center gap-1.5 rounded-md border border-slate-800 bg-slate-900 px-2 py-1">
                <span aria-hidden>🧠</span>
                <span className="font-semibold text-slate-200">
                  Difficulty:
                </span>
                {(() => {
                  const difficultyColor =
                    course.badges.difficultyScore <= 2.5
                      ? "text-emerald-300" // easier
                      : course.badges.difficultyScore <= 3.5
                      ? "text-amber-300" // medium
                      : "text-red-300"; // hard

                  return (
                    <span className={`font-semibold ${difficultyColor}`}>
                      {course.badges.difficultyScore.toFixed(1)} / 5 (
                      {course.badges.difficultyLabel})
                    </span>
                  );
                })()}
              </div>
            )}

            {/* GPA Trend */}
            <div className="inline-flex items-center gap-1.5 rounded-md border border-slate-800 bg-slate-900 px-2 py-1">
              <span aria-hidden>📈</span>
              <span className="font-semibold text-slate-200">GPA Trend:</span>
              <span
                className={`font-semibold ${
                  course.badges.trend === "Improving"
                    ? "text-emerald-300"
                    : course.badges.trend === "Stable"
                    ? "text-slate-200"
                    : "text-red-300"
                }`}
              >
                {course.badges.trend}
              </span>
            </div>
          </div>
        </div>

        {/* Description & metadata */}
        <div className="mt-5 space-y-3">
          {/* Prerequisites */}
          {course.catalog.prerequisites && (
            <div className="mt-1">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                Prerequisites
              </p>
              <p className="mt-1 break-words text-sm leading-relaxed text-slate-200 md:text-[15px]">
                {course.catalog.prerequisites}
              </p>
            </div>
          )}

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
              Description
            </p>
            <p className="mt-1 break-words text-sm leading-relaxed text-slate-200 md:text-[15px]">
              {course.catalog.description}
            </p>
          </div>

          <div className="break-words text-xs text-slate-300 md:text-sm">
            <span className="font-semibold text-slate-400">Repeatability:</span>{" "}
            <span>{course.catalog.repeatability ?? "Unknown"}</span>
            <span className="mx-2 text-slate-600">•</span>
            <span className="font-semibold text-slate-400">
              TCCNS Equivalent:
            </span>{" "}
            <span>{course.catalog.tccnsEquivalent ?? "None listed"}</span>
            <span className="mx-2 text-slate-600">•</span>
            <span className="font-semibold text-slate-400">
              Additional Fee:
            </span>{" "}
            <span>{course.catalog.additionalFee ?? "Unknown"}</span>
          </div>

          {course.catalog.fulfills.length > 0 && (
            <div className="space-y-1">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                Fulfills these requirements
              </p>
              <div className="flex flex-wrap gap-2">
                {course.catalog.fulfills.map((req) => (
                  <span
                    key={req}
                    className="inline-flex max-w-full items-center break-words rounded-full border border-slate-700 bg-slate-900/80 px-3 py-1 text-xs font-medium text-slate-50"
                  >
                    {req}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
      {/* Course Analysis continues below */}

      {/* Course Analysis */}
      <section className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 md:p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-300">
          Course Analysis
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-slate-200 md:text-[15px]">
          {analysisText}
        </p>
      </section>

      {/* Snapshot stats */}
      <section className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 md:p-6">
        <div className="grid gap-4 text-center text-xs sm:grid-cols-3 md:grid-cols-5">
          <div className="space-y-1">
            <p className="text-base font-semibold text-rose-300 md:text-lg">
              {formatGpa(snapshot.avgGpa)}
            </p>
            <p className="text-[11px] uppercase tracking-wide text-slate-300">
              Avg GPA
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-base font-semibold text-rose-300 md:text-lg">
              {formatPercent(snapshot.dropRate)}
            </p>
            <p className="text-[11px] uppercase tracking-wide text-slate-300">
              Drop rate
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-base font-semibold text-rose-300 md:text-lg">
              {formatNumber(snapshot.totalEnrolled)}
            </p>
            <p className="text-[11px] uppercase tracking-wide text-slate-300">
              Total enrolled
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-base font-semibold text-rose-300 md:text-lg">
              {formatNumber(snapshot.totalInstructors)}
            </p>
            <p className="text-[11px] uppercase tracking-wide text-slate-300">
              Total instructors
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-base font-semibold text-rose-300 md:text-lg">
              {formatNumber(snapshot.totalSections)}
            </p>
            <p className="text-[11px] uppercase tracking-wide text-slate-300">
              Total sections
            </p>
          </div>
        </div>
      </section>

      {/* Grade distribution */}
      <section className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 md:p-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-base font-semibold tracking-tight text-slate-50 md:text-lg">
            Grade Distribution
          </h2>
          <p className="text-xs text-slate-400 md:text-[13px]">
            {formatNumber(snapshot.totalEnrolled)} students
            {termRange && (
              <>
                {" "}
                from {termRange.earliest} to {termRange.latest}
              </>
            )}
            .
          </p>
        </div>

        <GradeBar
          distribution={course.gradeDistribution}
          totalEnrolled={snapshot.totalEnrolled}
        />
      </section>

      {/* Instructors */}
      <section
        id="instructors"
        className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 md:p-6"
      >
        <div className="mb-3 space-y-1">
          <h2 className="text-base font-semibold tracking-tight text-slate-50 md:text-lg">
            Instructors who taught {displayCode}
          </h2>
          <p className="text-[11px] text-slate-400 md:text-xs">
            View all {totalInstructors.toLocaleString()} instructors who have
            taught {totalSections.toLocaleString()} sections for this course.
          </p>

          {instructorPages.length > 1 && (
            <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
              <span className="text-slate-500">Jump to page:</span>
              {instructorPages.map((_, idx) => (
                <a
                  key={idx}
                  href={`#instructors-page-${idx + 1}`}
                  className="rounded-full border border-slate-700/70 bg-slate-900/80 px-2.5 py-0.5 font-medium text-slate-200 hover:border-slate-500 hover:bg-slate-800"
                >
                  {idx + 1}
                </a>
              ))}
            </div>
          )}
        </div>

        {instructorPages.map((page, pageIndex) => (
          <div
            key={pageIndex}
            id={`instructors-page-${pageIndex + 1}`}
            className={
              pageIndex > 0 ? "mt-4 border-t border-slate-800 pt-4" : ""
            }
          >
            {instructorPages.length > 1 && (
              <p className="mb-2 text-[11px] font-medium uppercase tracking-wide text-slate-500">
                Page {pageIndex + 1} of {instructorPages.length}
              </p>
            )}

            <div className="grid gap-3 md:grid-cols-2">
              {page.map((inst) => (
                <div
                  key={inst.name}
                  className="flex items-center justify-between rounded-xl bg-slate-900/70 px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-semibold text-slate-50">
                      {inst.name}
                    </p>
                    <p className="text-[11px] text-slate-400">{inst.summary}</p>
                  </div>
                  <button className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-[11px] font-medium text-slate-100 hover:border-slate-500 hover:bg-slate-800">
                    View
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* Instructor analysis */}
      <section className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 md:p-6">
        <h2 className="text-base font-semibold tracking-tight text-slate-50 md:text-lg">
          Analysis over {displayCode} instructors
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-200 md:text-[15px]">
          In a future version, this section can summarize which instructors tend
          to have higher GPAs, lower drop rates, and more balanced outcomes for{" "}
          {displayCode}. For now, use the instructor list above to explore past
          teaching history and outcomes.
        </p>
      </section>
      {/* Past sections */}
      <section className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 md:p-6">
        <div className="mb-3 space-y-1">
          <h2 className="text-base font-semibold tracking-tight text-slate-50 md:text-lg">
            Past Sections
          </h2>
          <p className="text-[11px] text-slate-400 md:text-xs">
            Now displaying {totalSections.toLocaleString()} sections
            {termRange && (
              <>
                {" "}
                from {termRange.earliest} to {termRange.latest}
              </>
            )}
            .
          </p>
        </div>

        {/* Mobile layout: cards (no horizontal overflow) */}
        <div className="space-y-2 md:hidden">
          {course.pastSections.map((section, idx) => (
            <div
              key={`${section.term}-${section.instructor}-${section.section}-${idx}`}
              className="rounded-xl bg-slate-900/80 p-3"
            >
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="text-xs font-semibold text-slate-200">
                    {section.term} · Sec {section.section}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    {section.instructor}
                  </p>
                </div>
                <p className="text-xs font-semibold text-rose-300">
                  {section.gpa != null ? section.gpa.toFixed(2) : "-"} GPA
                </p>
              </div>

              <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-[11px] text-slate-300">
                <p>
                  <span className="text-slate-400">Enrolled:</span>{" "}
                  {section.enrolled != null
                    ? section.enrolled.toLocaleString()
                    : "-"}
                </p>
                <p>
                  <span className="text-slate-400">A:</span>{" "}
                  {section.letters?.A ?? "-"}
                </p>
                <p>
                  <span className="text-slate-400">B:</span>{" "}
                  {section.letters?.B ?? "-"}
                </p>
                <p>
                  <span className="text-slate-400">C:</span>{" "}
                  {section.letters?.C ?? "-"}
                </p>
                <p>
                  <span className="text-slate-400">D:</span>{" "}
                  {section.letters?.D ?? "-"}
                </p>
                <p>
                  <span className="text-slate-400">F:</span>{" "}
                  {section.letters?.F ?? "-"}
                </p>
                <p>
                  <span className="text-slate-400">W:</span>{" "}
                  {section.letters?.W ?? "-"}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop layout: table (inside its own scroll container) */}
        <div className="hidden md:block">
          <div className="w-full overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-y-1 text-left text-[11px] text-slate-200 md:text-sm">
              <thead className="text-slate-400">
                <tr>
                  <th className="py-2 px-2 md:px-3">Term</th>
                  <th className="py-2 px-2 md:px-3">Instructor</th>
                  <th className="py-2 px-2 md:px-3">Section</th>
                  <th className="py-2 px-2 md:px-3">Enrolled</th>
                  <th className="py-2 px-2 md:px-3">A</th>
                  <th className="py-2 px-2 md:px-3">B</th>
                  <th className="py-2 px-2 md:px-3">C</th>
                  <th className="py-2 px-2 md:px-3">D</th>
                  <th className="py-2 px-2 md:px-3">F</th>
                  <th className="py-2 px-2 md:px-3">W</th>
                  <th className="py-2 px-2 md:px-3">Avg GPA</th>
                </tr>
              </thead>
              <tbody>
                {course.pastSections.map((section, idx) => (
                  <tr
                    key={`${section.term}-${section.instructor}-${section.section}-${idx}`}
                    className="rounded-xl bg-slate-900/70 hover:bg-slate-900/90"
                  >
                    <td className="rounded-l-xl py-2.5 px-2 md:px-3">
                      {section.term}
                    </td>
                    <td className="py-2.5 px-2 md:px-3">
                      {section.instructor}
                    </td>
                    <td className="py-2.5 px-2 md:px-3">{section.section}</td>

                    <td className="py-2.5 px-2 md:px-3">
                      {section.enrolled != null
                        ? section.enrolled.toLocaleString()
                        : "-"}
                    </td>

                    <td className="py-2.5 px-2 md:px-3">
                      {section.letters?.A ?? "-"}
                    </td>
                    <td className="py-2.5 px-2 md:px-3">
                      {section.letters?.B ?? "-"}
                    </td>
                    <td className="py-2.5 px-2 md:px-3">
                      {section.letters?.C ?? "-"}
                    </td>
                    <td className="py-2.5 px-2 md:px-3">
                      {section.letters?.D ?? "-"}
                    </td>
                    <td className="py-2.5 px-2 md:px-3">
                      {section.letters?.F ?? "-"}
                    </td>
                    <td className="py-2.5 px-2 md:px-3">
                      {section.letters?.W ?? "-"}
                    </td>

                    <td className="rounded-r-xl py-2.5 px-2 md:px-3">
                      {section.gpa != null ? section.gpa.toFixed(2) : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
