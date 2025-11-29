// app/courses/[code]/page.tsx
import { notFound } from "next/navigation";
import { getCourseDisplayCode, type Course } from "@/lib/courses";
import { getCourseByCodeFromDb } from "@/lib/courseLoader";
import { PageBreadcrumb } from "@/components/PageBreadcrumb";
import CourseHero from "@/components/course/CourseHero";
import CourseAnalysisCard from "@/components/course/CourseAnalysisCard";
import CourseSnapshotStatsCard from "@/components/course/CourseSnapshotStatsCard";
import CourseGradeDistributionCard from "@/components/course/CourseGradeDistributionCard";
import CourseInstructorsSection from "@/components/course/CourseInstructorsSection";
import CourseInstructorAnalysisCard from "@/components/course/CourseInstructorAnalysisCard";
import CoursePastSectionsCard from "@/components/course/CoursePastSectionsCard";

type CoursePageProps = {
  // params is a Promise in async server components
  params: Promise<{ code: string }>;
};

// One instructor summary object
type InstructorSummary = Course["instructors"][number];

// Simple horizontal divider to match the Hero's bottom border vibe
function SectionDivider() {
  return (
    <div className="my-4 border-b border-slate-800/80" aria-hidden="true" />
  );
}

function formatGpa(value: number | null): string {
  if (value == null) return "-";
  return value.toFixed(2);
}

function formatPercent(value: number | null): string {
  if (value == null) return "-";
  return `${value.toFixed(2)}%`;
}

function formatNumber(value: number | null): string {
  if (value == null) return "-";
  return value.toLocaleString();
}

/**
 * Build a human-readable analysis sentence for the course.
 * - Uses difficulty_label from DB when present (e.g. "Very Easy", "Hard").
 * - Falls back to a phrase derived from difficulty_score.
 * - Defaults to "moderate" if nothing is available.
 */
function buildAnalysisText(course: Course): string {
  const code = getCourseDisplayCode(course);
  const avgGpa = course.badges.gpa ?? course.snapshot.avgGpa ?? null;
  const drop = course.badges.dropRate ?? course.snapshot.dropRate ?? null;

  const rawLabel = course.badges.difficultyLabel;
  const score = course.badges.difficultyScore;

  let difficultyPhrase: string;

  // 1) Prefer label from DB/cache (“Very Easy”, “Hard”, etc.)
  if (typeof rawLabel === "string" && rawLabel.trim().length > 0) {
    difficultyPhrase = rawLabel.trim().toLowerCase();
  } else if (typeof score === "number") {
    // 2) Fallback to score-based phrase if label missing
    if (score <= 2.1) difficultyPhrase = "very easy";
    else if (score <= 2.7) difficultyPhrase = "easy";
    else if (score <= 3.3) difficultyPhrase = "moderate";
    else if (score <= 3.9) difficultyPhrase = "hard";
    else difficultyPhrase = "very hard";
  } else {
    // 3) Last-resort default
    difficultyPhrase = "moderate";
  }

  const trendRaw = course.badges.trend;
  const trend = trendRaw ? trendRaw.toLowerCase() : "stable";

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

  return `${code} – ${course.name} typically yields ${gpaPart}. Expect ${difficultyPhrase} difficulty with a ${trend} GPA trend over recent terms. ${dropPart} This course is usually taken after intro programming and is a key part of the algorithms / data structures core for CS majors.`;
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
  const resolvedParams = await params;
  const rawCode = resolvedParams.code; // e.g. "COSC-3320"

  if (!rawCode) {
    notFound();
  }

  // DB-backed loader
  const course = await getCourseByCodeFromDb(rawCode);

  if (!course) {
    notFound();
  }

  const displayCode = getCourseDisplayCode(course);
  const analysisText = buildAnalysisText(course);
  const snapshot = course.snapshot;
  const termRange = getTermRange(course.pastSections);

  const totalInstructors = course.instructors.length;
  const totalSections = course.pastSections.length;

  const pageSize = 10;
  const instructorPages: InstructorSummary[][] = [];
  for (let i = 0; i < totalInstructors; i += pageSize) {
    instructorPages.push(course.instructors.slice(i, i + pageSize));
  }

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-10 lg:py-14">
      <PageBreadcrumb
        crumbs={[
          { label: "Courses", href: "/courses" },
          { label: displayCode },
        ]}
        showStarAndCart
        className="mb-3"
      />

      {/* Course header / hero */}
      <CourseHero
        course={course}
        // For now, just keep catalog info as you had it
        catalogCount={1}
        hasCatalogLink={true}
      />

      {/* separator after CourseHero */}
      <SectionDivider />

      <CourseAnalysisCard analysisText={analysisText} />

      <CourseSnapshotStatsCard
        snapshot={snapshot}
        formatGpa={formatGpa}
        formatPercent={formatPercent}
        formatNumber={formatNumber}
        difficultyScore={course.badges.difficultyScore}
      />

      <CourseGradeDistributionCard
        distribution={course.gradeDistribution}
        totalEnrolled={snapshot.totalEnrolled}
        termRange={termRange}
        formatNumber={formatNumber}
      />

      {/* separator after grade distribution */}
      <SectionDivider />

      <CourseInstructorAnalysisCard course={course} />

      <CourseInstructorsSection
        displayCode={displayCode}
        instructorPages={instructorPages}
        totalInstructors={totalInstructors}
        totalSections={totalSections}
      />

      {/* separator after instructor analysis */}
      <SectionDivider />

      <CoursePastSectionsCard
        displayCode={displayCode}
        pastSections={course.pastSections}
        totalSections={totalSections}
        termRange={termRange}
      />
    </div>
  );
}
