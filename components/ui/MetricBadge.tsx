// components/ui/MetricBadge.tsx
import React, { type ReactNode } from "react";

export type BadgeTone = "good" | "warning" | "bad" | "info" | "neutral";

interface MetricBadgeProps {
  icon?: ReactNode;
  label: string;
  value: string;
  /**
   * Optional custom ReactNode for the value.
   * If provided, this is rendered instead of the plain value string.
   */
  valueNode?: ReactNode;
  /**
   * Semantic tone used to color the value.
   * - "good"    → green
   * - "warning" → amber
   * - "bad"     → red
   * - "info"    → sky/blue
   * - "neutral" → default text
   */
  tone?: BadgeTone;
  className?: string;
}

export default function MetricBadge({
  icon,
  label,
  value,
  valueNode,
  tone = "neutral",
  className,
}: MetricBadgeProps) {
  const baseClasses =
    "inline-flex items-center gap-1 rounded-md border border-slate-800 bg-slate-900 px-1.5 py-0.5 text-[10px] md:text-[11px] transition-colors transition-transform hover:border-slate-600 hover:bg-slate-900/90 hover:scale-[1.01]";

  const toneClass =
    tone === "good"
      ? "text-emerald-300"
      : tone === "warning"
      ? "text-amber-300"
      : tone === "bad"
      ? "text-red-300"
      : tone === "info"
      ? "text-sky-300"
      : "text-slate-200";

  return (
    <div className={`${baseClasses} ${className ?? ""}`}>
      {icon && <span aria-hidden>{icon}</span>}
      <span className="font-semibold text-slate-200">{label}:</span>
      <span
        className={`inline-flex items-center gap-0.5 font-semibold ${toneClass}`}
      >
        {valueNode ?? value}
      </span>
    </div>
  );
}
