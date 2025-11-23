// components/PageBreadcrumb.tsx
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback } from "react";

type Crumb = {
  label: string;
  href?: string; // clickable if provided
};

interface PageBreadcrumbProps {
  /**
   * List of crumbs AFTER the "Home" root.
   * Example:
   *   [{ label: "Courses", href: "/courses" }, { label: "COSC 3320" }]
   */
  crumbs: Crumb[];
  /**
   * If true, show Star + Cart + Share.
   * If false, show only Share.
   */
  showStarAndCart?: boolean;
  /**
   * Placeholder auth flag – later you can wire this to your real auth.
   */
  isSignedIn?: boolean;
  /**
   * Optional extra classes for outer wrapper (margin, etc.).
   */
  className?: string;
}

export function PageBreadcrumb({
  crumbs,
  showStarAndCart = false,
  isSignedIn = false,
  className,
}: PageBreadcrumbProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleProtectedAction = useCallback(
    (kind: "favorite" | "cart") => {
      if (!isSignedIn) {
        router.push(`/signin?redirect=${encodeURIComponent(pathname ?? "/")}`);
        return;
      }

      if (kind === "favorite") {
        // placeholder for now
        alert("Placeholder: toggled favorite for this item.");
      } else {
        alert("Placeholder: added item to your plan/cart.");
      }
    },
    [isSignedIn, pathname, router]
  );

  const handleShare = useCallback(async () => {
    if (typeof window === "undefined") return;

    const url = window.location.href;
    const title = document.title || "Coog Planner";

    try {
      if (navigator.share) {
        await navigator.share({ url, title });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);
        alert("Link copied to clipboard.");
      } else {
        alert(url);
      }
    } catch {
      // user cancelled etc.
    }
  }, []);

  const clickableCrumbClasses =
    "inline-flex items-center truncate text-sm md:text-[15px] font-medium text-slate-300 transition-all duration-150 hover:-translate-y-0.5 hover:text-brand-light";
  const currentCrumbClasses =
    "inline-flex items-center truncate text-sm md:text-[15px] font-medium text-slate-100";

  return (
    <div
      className={`flex flex-col gap-2 text-sm text-slate-400 md:flex-row md:items-center md:justify-between md:text-[15px] ${
        className ?? ""
      }`}
    >
      {/* RIGHT on desktop / TOP on mobile: action buttons */}
      <div className="order-1 flex flex-wrap items-center gap-1.5 md:order-2 md:justify-end">
        {showStarAndCart && (
          <>
            <button
              type="button"
              onClick={() => handleProtectedAction("favorite")}
              className="inline-flex items-center gap-1 rounded-full border border-slate-700 bg-slate-950/80 px-2.5 py-1 text-xs md:text-sm font-medium text-slate-100 shadow-sm transition-all duration-150 hover:-translate-y-0.5 hover:border-brand-light/70 hover:bg-slate-900/90 hover:text-brand-light"
            >
              <span aria-hidden>⭐</span>
              {/* Only show text on >= sm */}
              <span className="hidden sm:inline">Favorite</span>
            </button>

            <button
              type="button"
              onClick={() => handleProtectedAction("cart")}
              className="inline-flex items-center gap-1 rounded-full border border-slate-700 bg-slate-950/80 px-2.5 py-1 text-xs md:text-sm font-medium text-slate-100 shadow-sm transition-all duration-150 hover:-translate-y-0.5 hover:border-brand-light/70 hover:bg-slate-900/90 hover:text-brand-light"
            >
              <span aria-hidden>🛒</span>
              <span className="hidden sm:inline">Add to cart</span>
            </button>
          </>
        )}

        <button
          type="button"
          onClick={handleShare}
          className="inline-flex items-center gap-1 rounded-full border border-slate-700 bg-slate-950/80 px-2.5 py-1 text-xs md:text-sm font-medium text-slate-100 shadow-sm transition-all duration-150 hover:-translate-y-0.5 hover:border-brand-light/70 hover:bg-slate-900/90 hover:text-brand-light"
        >
          <span aria-hidden>🔗</span>
          <span className="hidden sm:inline">Share</span>
        </button>
      </div>

      {/* LEFT on desktop / BOTTOM on mobile: breadcrumb trail */}
      <div className="order-2 flex min-w-0 items-center gap-1 overflow-x-auto whitespace-nowrap md:order-1">
        {/* Root: Home */}
        <Link href="/" className={clickableCrumbClasses} title="Go to Home">
          Home
        </Link>

        <span className="px-1 text-slate-600">/</span>

        {/* Dynamic crumbs */}
        {crumbs.map((crumb, index) => {
          const isLast = index === crumbs.length - 1;

          return (
            <div key={`${crumb.label}-${index}`} className="flex items-center">
              {crumb.href && !isLast ? (
                <Link href={crumb.href} className={clickableCrumbClasses}>
                  {crumb.label}
                </Link>
              ) : (
                <span
                  className={
                    isLast ? currentCrumbClasses : clickableCrumbClasses
                  }
                  aria-current={isLast ? "page" : undefined}
                >
                  {crumb.label}
                </span>
              )}

              {!isLast && (
                <span className="px-1 text-slate-600" aria-hidden>
                  /
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
