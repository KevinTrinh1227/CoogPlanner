// components/course/CourseSnapshotStatsCard.tsx
import React from "react";
import type { Course } from "@/lib/courses";

interface CourseSnapshotStatsCardProps {
  snapshot: Course["snapshot"];
  formatGpa: (value: number | null) => string;
  formatPercent: (value: number | null) => string;
  formatNumber: (value: number | null) => string;
  // 👇 new: pass difficulty score separately (from badges)
  difficultyScore: number | null;
}

export default function CourseSnapshotStatsCard({
  snapshot,
  formatGpa,
  formatPercent,
  formatNumber,
  difficultyScore,
}: CourseSnapshotStatsCardProps) {
  const difficultyDisplay =
    difficultyScore != null ? difficultyScore.toFixed(2) : "-";

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 md:p-6">
      <div className="grid gap-4 text-center text-xs grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6">
        {/* 1. Avg GPA */}
        <div className="space-y-1">
          <p className="text-base font-semibold text-rose-300 md:text-lg">
            {formatGpa(snapshot.avgGpa)}
          </p>
          <p className="text-[11px] uppercase tracking-wide text-slate-300">
            Avg GPA
          </p>
        </div>

        {/* 2. Drop rate */}
        <div className="space-y-1">
          <p className="text-base font-semibold text-rose-300 md:text-lg">
            {formatPercent(snapshot.dropRate)}
          </p>
          <p className="text-[11px] uppercase tracking-wide text-slate-300">
            Drop Rate
          </p>
        </div>

        {/* 3. Difficulty Score (moved here, replaces Std Dev) */}
        <div className="space-y-1">
          <p className="text-base font-semibold text-rose-300 md:text-lg">
            {difficultyDisplay}
          </p>
          <p className="text-[11px] uppercase tracking-wide text-slate-300">
            Difficulty Score
          </p>
        </div>

        {/* 4. Total enrolled */}
        <div className="space-y-1">
          <p className="text-base font-semibold text-rose-300 md:text-lg">
            {formatNumber(snapshot.totalEnrolled)}
          </p>
          <p className="text-[11px] uppercase tracking-wide text-slate-300">
            Total Enrolled
          </p>
        </div>

        {/* 5. Instructors */}
        <div className="space-y-1">
          <p className="text-base font-semibold text-rose-300 md:text-lg">
            {formatNumber(snapshot.totalInstructors)}
          </p>
          <p className="text-[11px] uppercase tracking-wide text-slate-300">
            Instructors
          </p>
        </div>

        {/* 6. Sections */}
        <div className="space-y-1">
          <p className="text-base font-semibold text-rose-300 md:text-lg">
            {formatNumber(snapshot.totalSections)}
          </p>
          <p className="text-[11px] uppercase tracking-wide text-slate-300">
            Sections
          </p>
        </div>
      </div>
    </section>
  );
}
