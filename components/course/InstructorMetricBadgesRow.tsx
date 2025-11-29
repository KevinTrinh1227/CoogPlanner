import React from "react";
import type { InstructorSummary } from "@/lib/courses";
import MetricBadge, { type BadgeTone } from "@/components/ui/MetricBadge";

const StarFilled: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 20 20"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.955a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.449a1 1 0 00-.364 1.118l1.287 3.955c.3.921-.755 1.688-1.54 1.118l-3.37-2.449a1 1 0 00-1.175 0l-3.37 2.449c-.785.57-1.84-.197-1.54-1.118l1.287-3.955a1 1 0 00-.364-1.118L2.06 9.382c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.955z" />
  </svg>
);

interface InstructorMetricBadgesRowProps {
  instructor: InstructorSummary;
}

export default function InstructorMetricBadgesRow({
  instructor,
}: InstructorMetricBadgesRowProps) {
  const gpaBadge = getGpaBadge(instructor);
  const dropBadge = getDropBadge(instructor);

  const rmpNumeric = instructor.rating ?? 4.95; // placeholder
  const rmpValue = rmpNumeric.toFixed(2);

  // If absolutely nothing, don't render extra space
  if (!gpaBadge && !dropBadge && !rmpValue && !instructor) {
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

      {/* Placeholder RMP badge – logic later */}
      <MetricBadge
        label="RMP"
        value={rmpValue}
        valueNode={
          <>
            {rmpValue}
            <StarFilled className="h-3 w-3" />
          </>
        }
        tone="info"
      />

      {/* Placeholder Difficulty badge – logic later */}
      <MetricBadge label="Difficulty" value="Moderate" tone="warning" />
    </div>
  );
}

/* ---------- Helpers ---------- */

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
