// components/dashboard/DegreeProgressCard.tsx

import React from "react";

interface DegreeBucket {
  label: string;
  completed: number;
  total: number;
}

interface DegreeProgressCardProps {
  degreeName: string;
  classification: string;
  completedCredits: number;
  totalCredits: number;
  currentGpa: number;
  buckets: DegreeBucket[];
}

function percentage(completed: number, total: number) {
  if (total === 0) return 0;
  const raw = (completed / total) * 100;
  // Optional clamp to keep weird data from breaking the UI
  return Math.round(Math.min(100, Math.max(0, raw)));
}

export default function DegreeProgressCard(props: DegreeProgressCardProps) {
  const {
    degreeName: _degreeName, // reserved for future if you want it here
    classification: _classification, // also reserved
    completedCredits,
    totalCredits,
    currentGpa: _currentGpa, // not displayed in this card anymore
    buckets,
  } = props;

  const globalProgressPercent = percentage(completedCredits, totalCredits);

  return (
    <section className="rounded-xl border border-slate-800 bg-slate-900/70 p-5 shadow-sm">
      <header className="mb-4 flex items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-semibold text-slate-50">
            Degree Progress
          </h2>
          {/* Subline with degree/classification removed to avoid duplication
              with the ProfileOverviewCard */}
          <p className="mt-1 text-xs text-slate-400">
            Based on your completed and in-progress coursework.
          </p>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-1 rounded-full border border-slate-700 bg-slate-950/80 px-3 py-1.5 text-xs font-medium text-slate-100 hover:border-slate-500 hover:bg-slate-900"
        >
          <span aria-hidden>📘</span>
          <span>View Degree Info</span>
        </button>
      </header>

      <div className="space-y-4">
        {/* Overall progress */}
        <div>
          <div className="mb-1 flex items-center justify-between text-xs text-slate-300">
            <span>
              Credits completed:{" "}
              <span className="font-medium">
                {completedCredits} / {totalCredits}
              </span>
            </span>
            <span>{globalProgressPercent}% to degree</span>
          </div>
          <div className="h-2 rounded-full bg-slate-800">
            <div
              className="h-2 rounded-full bg-emerald-500"
              style={{ width: `${globalProgressPercent}%` }}
            />
          </div>
          {/* GPA line removed – GPA lives in ProfileOverviewCard instead */}
        </div>

        {/* Buckets */}
        <div className="grid gap-4 md:grid-cols-3">
          {buckets.map((bucket) => {
            const pct = percentage(bucket.completed, bucket.total);
            return (
              <div
                key={bucket.label}
                className="rounded-lg border border-slate-800 bg-slate-950/40 p-3"
              >
                <p className="text-xs font-medium text-slate-200">
                  {bucket.label}
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  {bucket.completed} / {bucket.total} credits
                </p>
                <div className="mt-2 h-1.5 rounded-full bg-slate-800">
                  <div
                    className="h-1.5 rounded-full bg-sky-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <p className="mt-1 text-[11px] text-slate-500">
                  {pct}% complete
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
