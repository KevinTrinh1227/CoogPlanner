"use client";

import React, {
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";

type TooltipVariant = "default" | "info" | "danger" | "success" | "muted";
type TooltipSide = "top" | "bottom";
type TooltipAlign = "center" | "start" | "end";

interface TooltipProps {
  /** Optional header shown above content (bold + larger) */
  title?: React.ReactNode;

  /** Main body */
  content: React.ReactNode;

  /** Trigger */
  children: React.ReactNode;

  variant?: TooltipVariant;
  side?: TooltipSide;
  align?: TooltipAlign;
  className?: string;

  disabled?: boolean;
  delayMs?: number; // desktop hover open delay
  offsetPx?: number; // gap from trigger
}

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

type Pos = { top: number; left: number; side: TooltipSide };

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function isCoarsePointer() {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia?.("(pointer: coarse)").matches ||
    window.matchMedia?.("(hover: none)").matches
  );
}

export default function Tooltip({
  title,
  content,
  children,
  variant = "default",
  side = "top",
  align = "center",
  className,
  disabled = false,
  delayMs = 250,
  offsetPx = 10,
}: TooltipProps) {
  const id = useId();

  const triggerRef = useRef<HTMLSpanElement | null>(null);
  const tipRef = useRef<HTMLSpanElement | null>(null);

  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<Pos | null>(null);

  const [overTrigger, setOverTrigger] = useState(false);
  const [overTip, setOverTip] = useState(false);

  const coarse = useMemo(() => isCoarsePointer(), []);
  const openTimer = useRef<number | null>(null);
  const closeTimer = useRef<number | null>(null);

  useEffect(() => setMounted(true), []);

  const styles = useMemo(() => {
    const map: Record<
      TooltipVariant,
      { panel: string; arrow: string; shadow: string; divider: string }
    > = {
      default: {
        panel: "bg-slate-900/95 text-slate-50 border-slate-700",
        arrow: "bg-slate-900/95 border-slate-700",
        shadow: "shadow-black/40",
        divider: "border-slate-700/70",
      },
      info: {
        panel: "bg-sky-900/95 text-sky-50 border-sky-700",
        arrow: "bg-sky-900/95 border-sky-700",
        shadow: "shadow-black/40",
        divider: "border-sky-700/60",
      },
      danger: {
        panel: "bg-red-900/90 text-red-50 border-red-400",
        arrow: "bg-red-900/90 border-red-400",
        shadow: "shadow-black/40",
        divider: "border-red-400/60",
      },
      success: {
        panel: "bg-emerald-900/95 text-emerald-50 border-emerald-700",
        arrow: "bg-emerald-900/95 border-emerald-700",
        shadow: "shadow-black/40",
        divider: "border-emerald-700/60",
      },
      muted: {
        panel: "bg-slate-800/95 text-slate-100 border-slate-700",
        arrow: "bg-slate-800/95 border-slate-700",
        shadow: "shadow-black/40",
        divider: "border-slate-700/70",
      },
    };
    return map[variant];
  }, [variant]);

  function clearTimers() {
    if (openTimer.current) window.clearTimeout(openTimer.current);
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    openTimer.current = null;
    closeTimer.current = null;
  }

  function openWithDelay() {
    clearTimers();
    openTimer.current = window.setTimeout(() => setOpen(true), delayMs);
  }

  function closeSoon() {
    clearTimers();
    closeTimer.current = window.setTimeout(() => setOpen(false), 60);
  }

  function closeNow() {
    clearTimers();
    setOpen(false);
  }

  function computePosition(preferredSide: TooltipSide) {
    const trigger = triggerRef.current;
    const tip = tipRef.current;
    if (!trigger || !tip) return;

    const t = trigger.getBoundingClientRect();

    const tipRect = tip.getBoundingClientRect();
    const tipW = tipRect.width;
    const tipH = tipRect.height;

    const vw = window.innerWidth;
    const vh = window.innerHeight;

    const pad = 8;
    const gap = offsetPx;

    let left =
      align === "start"
        ? t.left
        : align === "end"
        ? t.right - tipW
        : t.left + t.width / 2 - tipW / 2;

    left = clamp(left, pad, vw - pad - tipW);

    const topForSide = (s: TooltipSide) =>
      s === "top" ? t.top - gap - tipH : t.bottom + gap;

    let chosenSide: TooltipSide = preferredSide;
    let top = topForSide(chosenSide);

    const clipTop = top < pad;
    const clipBottom = top + tipH > vh - pad;

    if (chosenSide === "top" && clipTop && !clipBottom) {
      chosenSide = "bottom";
      top = topForSide(chosenSide);
    } else if (chosenSide === "bottom" && clipBottom && !clipTop) {
      chosenSide = "top";
      top = topForSide(chosenSide);
    }

    top = clamp(top, pad, vh - pad - tipH);

    setPos({ top, left, side: chosenSide });
  }

  useLayoutEffect(() => {
    if (!open || disabled) return;

    computePosition(side);

    const onReflow = () => computePosition(side);
    window.addEventListener("resize", onReflow);
    window.addEventListener("scroll", onReflow, true);

    return () => {
      window.removeEventListener("resize", onReflow);
      window.removeEventListener("scroll", onReflow, true);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, side, align, offsetPx, disabled]);

  // Close: outside click always, Escape always, mobile scroll closes
  useEffect(() => {
    if (!open || disabled) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeNow();
    };

    const onPointerDown = (e: PointerEvent) => {
      const trigger = triggerRef.current;
      const tip = tipRef.current;
      const target = e.target as Node | null;
      if (!target) return;

      if (
        trigger &&
        !trigger.contains(target) &&
        tip &&
        !tip.contains(target)
      ) {
        closeNow();
      }
    };

    const onScrollCloseMobile = () => {
      if (coarse) closeNow();
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("scroll", onScrollCloseMobile, true);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("scroll", onScrollCloseMobile, true);
    };
  }, [open, disabled, coarse]);

  // Desktop hover-only logic that stays open over tooltip
  useEffect(() => {
    if (disabled || coarse) return;

    if (overTrigger || overTip) openWithDelay();
    else closeSoon();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [overTrigger, overTip, disabled, coarse]);

  const triggerHandlers = disabled
    ? {}
    : coarse
    ? {
        // Mobile: tap toggles only
        onPointerDown: (e: React.PointerEvent) => {
          if (e.pointerType === "touch" || e.pointerType === "pen") {
            setOpen((v) => !v);
          }
        },
      }
    : {
        // Desktop: hover only
        onMouseEnter: () => setOverTrigger(true),
        onMouseLeave: () => setOverTrigger(false),
      };

  const tooltipNode =
    open && mounted && !disabled
      ? createPortal(
          <span
            id={id}
            ref={tipRef}
            role="tooltip"
            style={{
              position: "fixed",
              top: pos?.top ?? -9999,
              left: pos?.left ?? -9999,
              zIndex: 60,
            }}
            className={cn(
              // Smaller desktop width; still clamps on mobile
              "min-w-[190px] max-w-[min(92vw,16rem)]",
              "rounded-md border px-3 py-2",
              "shadow-lg",
              "whitespace-normal break-words text-left",
              "pointer-events-auto",
              styles.panel,
              styles.shadow
            )}
            onMouseEnter={coarse ? undefined : () => setOverTip(true)}
            onMouseLeave={coarse ? undefined : () => setOverTip(false)}
          >
            {title ? (
              <div className="mb-2">
                <div className="text-[12.5px] font-semibold leading-snug">
                  {title}
                </div>
                <div className={cn("mt-2 border-t", styles.divider)} />
              </div>
            ) : null}

            <div className="text-[11px] leading-snug">{content}</div>

            {/* Arrow: desktop only (remove on mobile) */}
            {!coarse && (
              <span
                aria-hidden="true"
                className={cn(
                  "absolute h-2.5 w-2.5 rotate-45 border",
                  styles.arrow,
                  pos?.side === "top" ? "bottom-[-6px]" : "top-[-6px]",
                  align === "center"
                    ? "left-1/2 -translate-x-1/2"
                    : align === "start"
                    ? "left-4"
                    : "right-4"
                )}
              />
            )}
          </span>,
          document.body
        )
      : null;

  return (
    <span
      ref={triggerRef}
      className={cn("inline-flex max-w-full", className)}
      aria-describedby={open && !disabled ? id : undefined}
      {...triggerHandlers}
    >
      {children}
      {tooltipNode}
    </span>
  );
}
