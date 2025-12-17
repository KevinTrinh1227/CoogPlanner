// components/navbar/MobileNavbar.tsx
"use client";

import Link from "next/link";
import { DROPDOWN_ITEMS, NAV_LINKS } from "./navConfig";

export default function MobileNavbar(props: {
  mobileOpen: boolean;
  closeAll: () => void;
}) {
  const { mobileOpen, closeAll } = props;

  if (!mobileOpen) return null;

  const mobileMainLinks = NAV_LINKS.filter(
    (l) => l.showOnMobile && l.id !== "resources"
  );

  const mobileResourcesLinks = DROPDOWN_ITEMS.resources;

  return (
    <div className="fixed inset-0 z-30 md:hidden">
      {/* Click-away backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={closeAll} />

      {/* Panel slides down under the sticky navbar */}
      <div className="absolute inset-x-0 top-[3.25rem] max-h-[calc(100vh-3.25rem)] overflow-y-auto bg-slate-950/95 transition-transform duration-150 ease-out">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-4">
          {/* Auth row - side by side buttons */}
          <div className="mt-3 flex items-center justify-center">
            <div className="flex w-full max-w-xs gap-2">
              <Link
                href="/login"
                className="flex-1 flex items-center justify-center rounded-md border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm font-semibold text-slate-100 shadow-sm transition-colors hover:border-slate-500 hover:bg-slate-900"
                onClick={closeAll}
              >
                Sign in
              </Link>
              <Link
                href="/signup"
                className="flex-1 flex items-center justify-center rounded-md bg-red-400 px-4 py-2.5 text-sm font-semibold text-slate-950 shadow-sm transition-colors hover:bg-red-300"
                onClick={closeAll}
              >
                Sign up
              </Link>
            </div>
          </div>

          {/* Coog Planner section */}
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Coog Planner
            </p>
            <div className="flex flex-col gap-2 text-lg font-medium text-slate-50">
              {mobileMainLinks.map((link) => (
                <Link key={link.id} href={link.href ?? "#"} onClick={closeAll}>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Resources section */}
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Resources
            </p>
            <div className="flex flex-col gap-2 text-lg font-medium text-slate-50">
              {mobileResourcesLinks.map((r) => (
                <Link key={r.title} href={r.href} onClick={closeAll}>
                  {r.title}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Single subtle separator at very bottom of dropdown */}
        <div className="h-px w-full bg-slate-900/80" />
      </div>
    </div>
  );
}
