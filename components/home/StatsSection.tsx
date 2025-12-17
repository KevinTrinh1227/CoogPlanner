// components/home/StatsSection.tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type StatItem = {
  label: string;
  value: number; // final value
  suffix?: string; // e.g. "+"
};

const DEFAULT_STATS: StatItem[] = [
  { label: "Students analyzed", value: 1204, suffix: "+" },
  { label: "Total plans generated", value: 3587, suffix: "+" },
  { label: "Custom schedules shared", value: 842, suffix: "+" },
  { label: "Total items searched", value: 18940, suffix: "+" },
  { label: "Total favorited", value: 2119, suffix: "+" },
  { label: "Total added to cart", value: 463, suffix: "+" },
];

export default function StatsSection({
  stats = DEFAULT_STATS,
}: {
  stats?: StatItem[];
}) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.disconnect(); // animate once
        }
      },
      { threshold: 0.2 }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef as any}
      id="stats"
      className="rounded-2xl border border-slate-800 bg-slate-950/80 px-4 py-5 md:px-6"
    >
      {/* Mobile: 2 per row */}
      <div className="grid grid-cols-2 gap-4 text-center text-[11px] text-slate-400 sm:grid-cols-3 lg:grid-cols-6">
        {stats.map((s) => (
          <div key={s.label} className="space-y-1">
            <p className="text-base font-semibold text-slate-50 md:text-lg tabular-nums">
              <CountUp
                value={s.value}
                suffix={s.suffix}
                start={inView}
                durationMs={1100}
              />
            </p>
            <p>{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* -------------------- CountUp -------------------- */

function CountUp({
  value,
  suffix = "",
  start,
  durationMs = 1200,
}: {
  value: number;
  suffix?: string;
  start: boolean;
  durationMs?: number;
}) {
  const [display, setDisplay] = useState(0);

  const formatter = useMemo(() => {
    return new Intl.NumberFormat("en-US");
  }, []);

  useEffect(() => {
    if (!start) return;

    // Respect reduced motion
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

    if (prefersReduced) {
      setDisplay(value);
      return;
    }

    let raf = 0;
    const startTs = performance.now();
    const from = 0;
    const to = value;

    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

    const tick = (now: number) => {
      const t = Math.min(1, (now - startTs) / durationMs);
      const eased = easeOutCubic(t);
      const next = Math.round(from + (to - from) * eased);

      setDisplay(next);

      if (t < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [start, value, durationMs]);

  return (
    <span>
      {formatter.format(display)}
      {suffix}
    </span>
  );
}
