"use client";

import React, { useId, useState } from "react";

type TooltipVariant = "default" | "info" | "danger" | "success" | "muted";
type TooltipSide = "top" | "bottom";
type TooltipAlign = "center" | "start" | "end";

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  variant?: TooltipVariant;
  side?: TooltipSide;
  align?: TooltipAlign;
  className?: string;
}

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export default function Tooltip({
  content,
  children,
  variant = "default",
  side = "top",
  align = "center",
  className,
}: TooltipProps) {
  const [open, setOpen] = useState(false);
  const id = useId();

  const baseColors: Record<TooltipVariant, string> = {
    default: "bg-slate-900/95 text-slate-50 border-slate-700 shadow-black/40",
    info: "bg-sky-900/95 text-sky-50 border-sky-700 shadow-black/40",
    danger: "bg-red-900/90 text-red-50 border-red-400 shadow-black/40",
    success:
      "bg-emerald-900/95 text-emerald-50 border-emerald-700 shadow-black/40",
    muted: "bg-slate-800/95 text-slate-100 border-slate-700 shadow-black/40",
  };

  const sideClasses = side === "top" ? "bottom-full mb-2" : "top-full mt-2";

  const alignClasses =
    align === "center"
      ? "left-1/2 -translate-x-1/2"
      : align === "start"
      ? "left-0"
      : "right-0";

  const arrowSideClasses =
    side === "top" ? "top-full mt-px" : "bottom-full mb-px";

  return (
    <span
      className={cn("relative inline-flex max-w-full", className)}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
      aria-describedby={id}
    >
      {children}

      {open && (
        <span
          id={id}
          role="tooltip"
          className={cn(
            "absolute z-40 min-w-[180px] max-w-xs rounded-md border px-2.5 py-1.5 text-[10px] leading-snug shadow-lg text-left",
            "whitespace-normal break-words",
            baseColors[variant],
            sideClasses,
            alignClasses
          )}
        >
          {content}
          <span
            className={cn(
              "pointer-events-none absolute h-2 w-2 rotate-45 border",
              baseColors[variant],
              arrowSideClasses,
              align === "center"
                ? "left-1/2 -translate-x-1/2"
                : align === "start"
                ? "left-3"
                : "right-3"
            )}
            aria-hidden="true"
          />
        </span>
      )}
    </span>
  );
}
