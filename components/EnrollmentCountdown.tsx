// components/EnrollmentCountdown.tsx
"use client";

import { useEffect, useState } from "react";
import { siteConfig } from "@/config/site";

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

const targetDate = new Date(siteConfig.enrollment.nextEnrollmentStart);

function computeTimeLeft(): TimeLeft | null {
  const now = Date.now();
  const diff = targetDate.getTime() - now;

  if (diff <= 0) {
    return null;
  }

  const seconds = Math.floor(diff / 1000);
  const days = Math.floor(seconds / (60 * 60 * 24));
  const hours = Math.floor((seconds % (60 * 60 * 24)) / (60 * 60));
  const minutes = Math.floor((seconds % (60 * 60)) / 60);
  const secs = seconds % 60;

  return { days, hours, minutes, seconds: secs };
}

export default function EnrollmentCountdown() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null | "past">(null);

  useEffect(() => {
    // Only compute on client to avoid hydration mismatch
    const initial = computeTimeLeft();
    setTimeLeft(initial ?? "past");

    const interval = setInterval(() => {
      const next = computeTimeLeft();
      setTimeLeft(next ?? "past");
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (timeLeft === "past") {
    return (
      <div className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-950/80 px-3 py-1 text-[11px] text-slate-300">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
        <span className="font-medium text-slate-100">
          {siteConfig.enrollment.nextTermLabel} enrollment is now open.
        </span>
      </div>
    );
  }

  if (!timeLeft) {
    // brief placeholder while the client hydrates
    return (
      <div className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-950/80 px-3 py-1 text-[11px] text-slate-300">
        <span className="h-1.5 w-1.5 rounded-full bg-slate-500" />
        <span>Loading enrollment countdown…</span>
      </div>
    );
  }

  const { days, hours, minutes, seconds } = timeLeft;

  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-950/80 px-3 py-1 text-[11px] text-slate-300">
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
