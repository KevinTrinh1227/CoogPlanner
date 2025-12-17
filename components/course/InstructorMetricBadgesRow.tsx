import React from "react";
import type { InstructorSummary } from "@/lib/courses";
import MetricBadge, { type BadgeTone } from "@/components/ui/MetricBadge";

interface InstructorMetricBadgesRowProps {
  instructor: InstructorSummary;
}

export default function InstructorMetricBadgesRow({
  instructor,
}: InstructorMetricBadgesRowProps) {
  const gpaBadge = getGpaBadge(instructor);
  const dropBadge = getDropBadge(instructor);

  // Our own internal rating as a percentage (0–100). 100% = everyone loves them.
  const ratingPctNumeric = instructor.rating ?? null;

  const ratingValue =
    ratingPctNumeric == null ? "N/A" : `${formatPercent(ratingPctNumeric)}%`;

  const ratingTone: BadgeTone =
    ratingPctNumeric == null
      ? "info"
      : ratingPctNumeric >= 80
      ? "good"
      : ratingPctNumeric >= 60
      ? "warning"
      : "bad";

  // If absolutely nothing meaningful, don't render extra space
  // (Difficulty is still placeholder below, so this checks real stats only.)
  if (!gpaBadge && !dropBadge && ratingPctNumeric == null) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-1.5 text-[10px] md:text-[11px]">
      {gpaBadge && (
        <MetricBadge label="GPA" value={gpaBadge.value} tone={gpaBadge.tone} />
      )}

      {dropBadge && (
        <MetricBadge
          label="Drop Rate"
          value={dropBadge.value}
          tone={dropBadge.tone}
        />
      )}

      <MetricBadge label="Rating" value={ratingValue} tone={ratingTone} />

      {/* Placeholder Difficulty badge – logic later */}
      <MetricBadge label="Difficulty" value="Moderate" tone="warning" />
    </div>
  );
}

/* ---------- Helpers ---------- */

function formatPercent(raw: number) {
  // Clamp to [0, 100] so UI can't show weird values
  const clamped = Math.max(0, Math.min(100, raw));
  // If it's basically an integer, show no decimals; otherwise show 1 decimal
  return Number.isInteger(clamped) ? clamped.toFixed(0) : clamped.toFixed(1);
}

function getGpaBadge(
  inst: InstructorSummary
): { value: string; tone: BadgeTone } | null {
  const gpa = inst.avgGpaNumeric;
  if (gpa == null) return null;

  const value = gpa.toFixed(2);
  const tone: BadgeTone = gpa >= 3 ? "good" : gpa >= 2.75 ? "warning" : "bad";

  return { value, tone };
}

function getDropBadge(
  inst: InstructorSummary
): { value: string; tone: BadgeTone } | null {
  const drop = inst.dropRateNumeric;
  if (drop == null) return null;

  const value = `${drop.toFixed(2)}%`;
  const tone: BadgeTone = drop <= 10 ? "good" : drop <= 20 ? "warning" : "bad";

  return { value, tone };
}
