// app/courses/[code]/page.tsx
import { notFound } from "next/navigation";
import React, { Suspense } from "react";

import { PageBreadcrumb } from "@/components/PageBreadcrumb";
import CourseAnalysisCard from "@/components/course/CourseAnalysisCard";
import CourseSnapshotStatsCard from "@/components/course/CourseSnapshotStatsCard";
import CourseGradeDistributionCard from "@/components/course/CourseGradeDistributionCard";
import CourseInstructorsSection from "@/components/course/CourseInstructorsSection";
import CourseInstructorAnalysisCard from "@/components/course/CourseInstructorAnalysisCard";
import CoursePastSectionsCard from "@/components/course/CoursePastSectionsCard";

import {
  getCourseByCodeFromDb,
  getCourseHeaderByCodeFromDb,
} from "@/lib/courseLoader";
import { getCourseDisplayCode, type Course } from "@/lib/courses";

import CourseHeroShell from "./CourseHeroShell";

type CoursePageProps = {
  params: Promise<{ code: string }>;
};

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

function buildAnalysisText(course: Course): string {
  const code = getCourseDisplayCode(course);
  const avgGpa = course.badges.gpa ?? course.snapshot.avgGpa ?? null;
  const drop = course.badges.dropRate ?? course.snapshot.dropRate ?? null;

  const rawLabel = course.badges.difficultyLabel;
  const score = course.badges.difficultyScore;

  let difficultyPhrase: string;
  if (typeof rawLabel === "string" && rawLabel.trim().length > 0) {
    difficultyPhrase = rawLabel.trim().toLowerCase();
  } else if (typeof score === "number") {
    if (score <= 2.1) difficultyPhrase = "very easy";
    else if (score <= 2.7) difficultyPhrase = "easy";
    else if (score <= 3.3) difficultyPhrase = "moderate";
    else if (score <= 3.9) difficultyPhrase = "hard";
    else difficultyPhrase = "very hard";
  } else {
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

  return `${code} – ${course.name} typically yields ${gpaPart}. Expect ${difficultyPhrase} difficulty with a ${trend} GPA trend over recent terms. ${dropPart}`;
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

function BodySkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-28 rounded-2xl border border-slate-800 bg-slate-900/40" />
      <div className="h-56 rounded-2xl border border-slate-800 bg-slate-900/40" />
      <div className="h-64 rounded-2xl border border-slate-800 bg-slate-900/40" />
    </div>
  );
}

async function CourseBody({
  coursePromise,
}: {
  coursePromise: Promise<Course>;
}) {
  const course = await coursePromise;

  const displayCode = getCourseDisplayCode(course);
  const analysisText = buildAnalysisText(course);
  const snapshot = course.snapshot;
  const termRange = getTermRange(course.pastSections);

  const totalInstructors = course.instructors.length;
  const totalSections = course.pastSections.length;

  const pageSize = 10;
  const instructorPages: Course["instructors"][number][][] = [];
  for (let i = 0; i < totalInstructors; i += pageSize) {
    instructorPages.push(course.instructors.slice(i, i + pageSize));
  }

  return (
    <>
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

      <SectionDivider />

      <CourseInstructorAnalysisCard course={course} />

      <CourseInstructorsSection
        displayCode={displayCode}
        instructorPages={instructorPages}
        totalInstructors={totalInstructors}
        totalSections={totalSections}
      />

      <SectionDivider />

      <CoursePastSectionsCard
        displayCode={displayCode}
        pastSections={course.pastSections}
        totalSections={totalSections}
        termRange={termRange}
      />
    </>
  );
}

export default async function CourseDetailPage({ params }: CoursePageProps) {
  const resolvedParams = await params;
  const rawCode = resolvedParams.code;

  if (!rawCode) notFound();

  // ✅ fast header info (not lazy)
  const header = await getCourseHeaderByCodeFromDb(rawCode);
  if (!header) notFound();

  // ✅ full fetch streams, but the promise is guaranteed to resolve to Course (or 404)
  const coursePromise: Promise<Course> = getCourseByCodeFromDb(rawCode).then(
    (c) => {
      if (!c) notFound();
      return c;
    }
  );

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-10 lg:py-14">
      <PageBreadcrumb
        crumbs={[
          { label: "Courses", href: "/courses" },
          { label: header.displayCode },
        ]}
        showStarAndCart
        className="mb-3"
      />

      <CourseHeroShell
        name={header.name}
        displayCode={header.displayCode}
        badges={header.badges}
        coursePromise={coursePromise}
        catalogCount={1}
        hasCatalogLink={true}
      />

      <Suspense fallback={<BodySkeleton />}>
        <CourseBody coursePromise={coursePromise} />
      </Suspense>
    </div>
  );
}
