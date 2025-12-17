"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { siteConfig } from "@/config/site";

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

type Variant = "pill" | "line";

const targetDate = new Date(siteConfig.enrollment.nextEnrollmentStart);

function computeTimeLeft(): TimeLeft | null {
  const now = Date.now();
  const diff = targetDate.getTime() - now;

  if (diff <= 0) return null;

  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / (60 * 60 * 24));
  const hours = Math.floor((totalSeconds % (60 * 60 * 24)) / (60 * 60));
  const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
  const seconds = totalSeconds % 60;

  return { days, hours, minutes, seconds };
}

export default function EnrollmentCountdown(props: {
  variant?: Variant;
  className?: string;

  /** Only used for variant="line" */
  ctaHref?: string;
  ctaLabel?: string;
}) {
  const {
    variant = "pill",
    className,
    ctaHref = "/schedule",
    ctaLabel = "Build your next schedule ➜",
  } = props;

  const [timeLeft, setTimeLeft] = useState<TimeLeft | "past" | null>(null);

  useEffect(() => {
    const initial = computeTimeLeft();
    setTimeLeft(initial ?? "past");

    const interval = setInterval(() => {
      const next = computeTimeLeft();
      setTimeLeft(next ?? "past");
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // ---------------- LINE VARIANT ----------------
  if (variant === "line") {
    if (timeLeft === null) {
      return (
        <p
          className={`w-full text-center text-[11px] text-slate-400 ${
            className ?? ""
          }`}
        >
          Loading registration countdown…
        </p>
      );
    }

    if (timeLeft === "past") {
      return (
        <p
          className={`w-full text-center text-[11px] text-slate-400 ${
            className ?? ""
          }`}
        >
          {siteConfig.enrollment.nextTermLabel} registration is open.{" "}
          <Link
            href={ctaHref}
            prefetch={false}
            className="font-semibold text-slate-400 underline underline-offset-2 transition-all duration-150 ease-out hover:text-slate-300 hover:underline-offset-4"
          >
            {ctaLabel}
          </Link>
        </p>
      );
    }

    const { days, hours, minutes, seconds } = timeLeft;

    return (
      <p
        className={`w-full text-center text-[11px] text-slate-400 ${
          className ?? ""
        }`}
      >
        {siteConfig.enrollment.nextTermLabel} Registration:{" "}
        <span className="tabular-nums">
          {days}d {hours}h {minutes}m {seconds}s
        </span>
        .{" "}
        <Link
          href={ctaHref}
          prefetch={false}
          className="font-semibold text-slate-400 underline underline-offset-2 transition-all duration-150 ease-out hover:text-slate-300 hover:underline-offset-4"
        >
          {ctaLabel}
        </Link>
      </p>
    );
  }

  // ---------------- PILL VARIANT ----------------
  if (timeLeft === "past") {
    return (
      <div
        className={`inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-950/80 px-3 py-1 text-[11px] text-slate-300 ${
          className ?? ""
        }`}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
        <span className="font-medium text-slate-100">
          {siteConfig.enrollment.nextTermLabel} enrollment is now open.
        </span>
      </div>
    );
  }

  if (timeLeft === null) {
    return (
      <div
        className={`inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-950/80 px-3 py-1 text-[11px] text-slate-300 ${
          className ?? ""
        }`}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-slate-500" />
        <span>Loading enrollment countdown…</span>
      </div>
    );
  }

  const { days, hours, minutes, seconds } = timeLeft;

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-950/80 px-3 py-1 text-[11px] text-slate-300 ${
        className ?? ""
      }`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
      <span className="font-medium text-slate-100">
        UH · {siteConfig.enrollment.nextTermLabel} Registration opens in:
      </span>
      <span className="tabular-nums text-slate-200">
        {days}d {hours}h {minutes}m {seconds}s
      </span>
    </div>
  );
}
