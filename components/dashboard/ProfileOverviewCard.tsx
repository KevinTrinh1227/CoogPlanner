// components/dashboard/ProfileOverviewCard.tsx

import React from "react";

interface ProfileOverviewCardProps {
  studentName: string; // reserved for future
  degreeName: string;
  classification: string; // e.g. "Junior"
  classificationYearLabel: string; // reserved for future, not displayed
  catalogYear: string;
  onTrackTerm: string;
  completedCredits: number;
  totalCredits: number;
  currentGpa: number;
  currentTerm: string;
  currentCredits: number;
  requirementsRemaining: number;
  totalRequirements: number;
  onEditProfileClick?: () => void;
  onDegreeSettingsClick?: () => void;
}

export default function ProfileOverviewCard({
  // studentName,
  degreeName,
  classification,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  classificationYearLabel,
  catalogYear,
  onTrackTerm,
  completedCredits,
  totalCredits,
  currentGpa,
  currentTerm,
  currentCredits,
  requirementsRemaining,
  totalRequirements,
  onEditProfileClick,
  onDegreeSettingsClick,
}: ProfileOverviewCardProps) {
  const gpaDisplay = Number.isFinite(currentGpa) ? currentGpa.toFixed(2) : "—";

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-sm">
      <header className="mb-3 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-50">
            Academic Overview
          </h2>
          <p className="mt-1 text-xs text-slate-400">
            {degreeName} • Catalog {catalogYear}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onEditProfileClick}
            className="inline-flex items-center gap-1 rounded-full border border-slate-700 bg-slate-950/80 px-3 py-1.5 text-xs font-medium text-slate-100 hover:border-slate-500 hover:bg-slate-900"
          >
            <span aria-hidden>✏️</span>
            <span>Edit Profile</span>
          </button>
          <button
            type="button"
            onClick={onDegreeSettingsClick}
            className="inline-flex items-center gap-1 rounded-full border border-slate-700 bg-slate-950/80 px-3 py-1.5 text-xs font-medium text-slate-100 hover:border-slate-500 hover:bg-slate-900"
          >
            <span aria-hidden>🎓</span>
            <span>Degree Settings</span>
          </button>
        </div>
      </header>

      <div className="rounded-2xl border border-slate-800 bg-slate-950/60 px-4 py-2">
        <div className="grid gap-4 text-center sm:grid-cols-2 lg:grid-cols-6">
          {/* Credits completed */}
          <div className="flex flex-col items-center justify-center">
            <p className="text-lg font-semibold text-slate-50">
              {completedCredits}
              <span className="text-sm text-slate-400"> / {totalCredits}</span>
            </p>
            <p className="mt-1 text-[11px] text-slate-400">Credits Completed</p>
          </div>

          {/* Current GPA */}
          <div className="flex flex-col items-center justify-center">
            <p className="text-lg font-semibold text-slate-50">{gpaDisplay}</p>
            <p className="mt-1 text-[11px] text-slate-400">Current GPA</p>
          </div>

          {/* Current term */}
          <div className="flex flex-col items-center justify-center">
            <p className="text-lg font-semibold text-slate-50">{currentTerm}</p>
            <p className="mt-1 text-[11px] text-slate-400">
              {currentCredits} Credits In Progress
            </p>
          </div>

          {/* Target graduation */}
          <div className="flex flex-col items-center justify-center">
            <p className="text-lg font-semibold text-slate-50">{onTrackTerm}</p>
            <p className="mt-1 text-[11px] text-slate-400">
              Target Graduation Term
            </p>
          </div>

          {/* Requirements remaining */}
          <div className="flex flex-col items-center justify-center">
            <p className="text-lg font-semibold text-slate-50">
              {requirementsRemaining}
              <span className="text-sm text-slate-400">
                {" "}
                / {totalRequirements}
              </span>
            </p>
            <p className="mt-1 text-[11px] text-slate-400">
              Requirements Remaining
            </p>
          </div>

          {/* Classification */}
          <div className="flex flex-col items-center justify-center">
            <p className="text-lg font-semibold text-slate-50">
              {classification}
            </p>
            <p className="mt-1 text-[11px] text-slate-400">Classification</p>
          </div>
        </div>
      </div>
    </section>
  );
}
