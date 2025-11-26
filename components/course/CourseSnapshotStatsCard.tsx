// components/course/CourseSnapshotStatsCard.tsx
import React from "react";
import type { Course } from "@/lib/courses";

interface CourseSnapshotStatsCardProps {
  snapshot: Course["snapshot"];
  formatGpa: (value: number | null) => string;
  formatPercent: (value: number | null) => string;
  formatNumber: (value: number | null) => string;
}

export default function CourseSnapshotStatsCard({
  snapshot,
  formatGpa,
  formatPercent,
  formatNumber,
}: CourseSnapshotStatsCardProps) {
  return (
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
  );
}
