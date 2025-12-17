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
  const hasTotal = totalEnrolled != null && totalEnrolled > 0;

  // Always ensure S and NR exist in the distribution, even if 0%.
  const distributionWithSNR: GradeBucket[] = React.useMemo(() => {
    const labels = new Set(distribution.map((b) => b.label));
    const extended = [...distribution];

    if (!labels.has("S")) {
      extended.push({ label: "S", percentage: 0 });
    }
    if (!labels.has("NR")) {
      extended.push({ label: "NR", percentage: 0 });
    }

    return extended;
  }, [distribution]);

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 md:p-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-base font-semibold tracking-tight text-slate-50 md:text-lg">
          Grade Distribution
        </h2>
        <p className="text-xs text-slate-400 md:text-[13px]">
          {hasTotal ? (
            <>
              {formatNumber(totalEnrolled)} students
              {termRange && (
                <>
                  {" "}
                  from {termRange.earliest} to {termRange.latest}
                </>
              )}
              .
            </>
          ) : termRange ? (
            <>
              Historical grade distribution from {termRange.earliest} to{" "}
              {termRange.latest}.
            </>
          ) : (
            <>Historical grade distribution based on available data.</>
          )}
        </p>
      </div>

      <GradeBar
        distribution={distributionWithSNR}
        totalEnrolled={totalEnrolled}
      />
    </section>
  );
}
