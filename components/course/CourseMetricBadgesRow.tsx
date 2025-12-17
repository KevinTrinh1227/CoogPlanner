// components/course/CourseMetricBadgesRow.tsx
import React from "react";
import type { Course } from "@/lib/courses";
import MetricBadge, { type BadgeTone } from "@/components/ui/MetricBadge";

interface CourseMetricBadgesRowProps {
  badges: Course["badges"];
}

export default function CourseMetricBadgesRow({
  badges,
}: CourseMetricBadgesRowProps) {
  const gpaBadge = getGpaBadge(badges);
  const dropRateBadge = getDropRateBadge(badges);
  const difficultyBadge = getDifficultyBadge(badges);
  const trendBadge = getTrendBadge(badges);

  // If none exist, render nothing
  if (!gpaBadge && !dropRateBadge && !difficultyBadge && !trendBadge) {
    return null;
  }

  return (
    <div className="mt-2 flex w-full flex-wrap justify-start gap-1.5 text-[10px] md:gap-2 md:text-[11px]">
      {gpaBadge && (
        <MetricBadge
          icon="📊"
          label="GPA"
          value={gpaBadge.value}
          tone={gpaBadge.tone}
        />
      )}

      {dropRateBadge && (
        <MetricBadge
          icon="📉"
          label="Drop Rate"
          value={dropRateBadge.value}
          tone={dropRateBadge.tone}
        />
      )}

      {difficultyBadge && (
        <MetricBadge
          icon="🧠"
          label="Difficulty"
          value={difficultyBadge.value}
          tone={difficultyBadge.tone}
        />
      )}

      {trendBadge && (
        <MetricBadge
          icon="📈"
          label="GPA Trend"
          value={trendBadge.value}
          tone={trendBadge.tone}
        />
      )}
    </div>
  );
}

/* ---------- Helpers ---------- */

function getGpaBadge(
  badges: Course["badges"]
): { value: string; tone: BadgeTone } | null {
  if (badges.gpa == null) return null;

  const gpa = badges.gpa;
  const value = gpa.toFixed(2);

  const tone: BadgeTone = gpa >= 3 ? "good" : gpa >= 2.75 ? "warning" : "bad";

  return { value, tone };
}

function getDropRateBadge(
  badges: Course["badges"]
): { value: string; tone: BadgeTone } | null {
  if (badges.dropRate == null) return null;

  const dropRate = badges.dropRate;
  const value = `${dropRate.toFixed(2)}%`;

  const tone: BadgeTone =
    dropRate <= 10 ? "good" : dropRate <= 20 ? "warning" : "bad";

  return { value, tone };
}

function getDifficultyBadge(
  badges: Course["badges"]
): { value: string; tone: BadgeTone } | null {
  if (badges.difficultyScore == null) {
    // You only show difficulty badge when numeric score exists
    return null;
  }

  const score = badges.difficultyScore;
  const rawLabel = String(badges.difficultyLabel ?? "").trim();
  const label = rawLabel || "Unknown";

  let tone: BadgeTone = "neutral";

  if (rawLabel === "Very Easy" || rawLabel === "Easy") {
    tone = "good";
  } else if (rawLabel === "Moderate") {
    tone = "warning";
  } else if (rawLabel === "Hard" || rawLabel === "Very Hard") {
    tone = "bad";
  } else {
    // Fallback: infer tone from numeric score
    tone = score <= 2.5 ? "good" : score <= 3.5 ? "warning" : "bad";
  }

  const value = `${score.toFixed(2)} (${label})`;

  return { value, tone };
}

function getTrendBadge(
  badges: Course["badges"]
): { value: string; tone: BadgeTone } | null {
  if (!badges.trend) return null;

  const trend = badges.trend;
  const value = trend;

  const tone: BadgeTone =
    trend === "Improving"
      ? "good"
      : trend === "Stable"
      ? "info" // sky/blue, like your original
      : "bad";

  return { value, tone };
}
