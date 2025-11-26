// components/course/GradeBar.tsx
import React from "react";
import type { GradeBucket } from "@/lib/courses";

const gradeColors: Record<string, string> = {
  A: "bg-emerald-400",
  B: "bg-emerald-500",
  C: "bg-yellow-400",
  D: "bg-orange-400",
  F: "bg-red-500",
  W: "bg-purple-500",
  Other: "bg-slate-500",
};

interface GradeBarProps {
  distribution: GradeBucket[];
  totalEnrolled: number | null;
}

export default function GradeBar({
  distribution,
  totalEnrolled,
}: GradeBarProps) {
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
