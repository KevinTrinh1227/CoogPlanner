// components/course/CourseGradeDistributionCard.tsx
import React from "react";
import type { GradeBucket } from "@/lib/courses";
import GradeBar from "./GradeBar";

interface TermRange {
  earliest: string;
  latest: string;
}

interface CourseGradeDistributionCardProps {
  distribution: GradeBucket[];
  totalEnrolled: number | null;
  termRange: TermRange | null;
  formatNumber: (value: number | null) => string;
}

export default function CourseGradeDistributionCard({
  distribution,
  totalEnrolled,
  termRange,
  formatNumber,
}: CourseGradeDistributionCardProps) {
  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 md:p-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-base font-semibold tracking-tight text-slate-50 md:text-lg">
          Grade Distribution
        </h2>
        <p className="text-xs text-slate-400 md:text-[13px]">
          {formatNumber(totalEnrolled)} students
          {termRange && (
            <>
              {" "}
              from {termRange.earliest} to {termRange.latest}
            </>
          )}
          .
        </p>
      </div>

      <GradeBar distribution={distribution} totalEnrolled={totalEnrolled} />
    </section>
  );
}
