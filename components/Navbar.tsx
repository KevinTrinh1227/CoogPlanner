"use client";

import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/config/site";
import { useRef, useState } from "react";

type MenuKey =
  | "academics"
  | "degree"
  | "rankings"
  | "extension"
  | "resources"
  | null;

interface DesktopItem {
  title: string;
  desc: string;
  href: string;
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<MenuKey>(null);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const navLinks = [
    {
      id: "academics" as const,
      label: "Browse Academics",
      href: "/search",
      showOnMobile: true,
    },
    {
      id: "degree" as const,
      label: "My Degree",
      href: "#analyze",
      showOnMobile: true,
    },
    {
      id: "rankings" as const,
      label: "Rankings",
      href: "#leaderboards",
      showOnMobile: true,
    },
    {
      id: "extension" as const,
      label: "Browser Extension",
      href: "#browser-extension",
      showOnMobile: true,
    },
    {
      id: "resources" as const,
      label: "Resources",
      href: undefined,
      showOnMobile: true,
    },
  ];

  // --- dropdown data ---

  const academicsItems: DesktopItem[] = [
    {
      title: "Courses",
      desc: "Search UH courses with historical trends and difficulty.",
      href: "#courses",
    },
    {
      title: "Instructors",
      desc: "View instructor histories, sections, and grade patterns.",
      href: "#instructors",
    },
    {
      title: "Programs / Degrees",
      desc: "Browse program plans and catalog-based requirements.",
      href: "#programs",
    },
    {
      title: "Academic calendar",
      desc: "Key dates for terms, add/drop, and exams.",
      href: "#academics",
    },
  ];

  const degreeItems: DesktopItem[] = [
    {
      title: "Get my degree analysis report",
      desc: "Completion breakdown, remaining requirements, and timeline.",
      href: "#analyze",
    },
    {
      title: "How to download transcript",
      desc: "View FAQ guide on how to get and download your free UH unofficial transcript.",
      href: "/faq",
    },
  ];

  // rankings has NO dropdown
  const rankingsItems: DesktopItem[] = [];

  const extensionItems: DesktopItem[] = [
    {
      title: "Download extension",
      desc: "Add the Coog Planner overlay to your browser.",
      href: "#browser-extension",
    },
    {
      title: "How it works",
      desc: "Learn how pages are parsed safely and efficiently.",
      href: "#browser-extension",
    },
  ];

  const resourcesItems: DesktopItem[] = [
    {
      title: "About Coog Planner",
      desc: "Background, mission, and who is building Coog Planner.",
      href: "#about",
    },
    {
      title: "FAQ",
      desc: "Answers to common questions about data and accuracy.",
      href: "/faq",
    },
    {
      title: "Updates",
      desc: "Changelogs and what shipped in each version.",
      href: "/updates",
    },
    {
      title: "Privacy & legal",
      desc: "How we handle data, privacy, and disclaimers.",
      href: "/privacy-legal",
    },
  ];

  const getMenuItems = (menu: MenuKey): DesktopItem[] => {
    switch (menu) {
      case "academics":
        return academicsItems;
      case "degree":
        return degreeItems;
      case "rankings":
        return rankingsItems; // empty -> no dropdown
      case "extension":
        return extensionItems;
      case "resources":
        return resourcesItems;
      default:
        return [];
    }
  };

  // --- open/close helpers for dropdown ---

  const clearCloseTimeout = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  };

  const openMenu = (key: MenuKey) => {
    clearCloseTimeout();
    setActiveMenu(key);
  };

  const scheduleCloseMenu = () => {
    clearCloseTimeout();
    closeTimeoutRef.current = setTimeout(() => {
      setActiveMenu(null);
    }, 120); // small delay so you can move from tab to panel
  };

  const closeAll = () => {
    clearCloseTimeout();
    setActiveMenu(null);
    setMobileOpen(false);
  };

  const desktopItems = getMenuItems(activeMenu);

  // --- JSX ---

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/70 backdrop-blur">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-3">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2" onClick={closeAll}>
            <Image
              src="/logo.png"
              alt={`${siteConfig.name} logo`}
              width={32}
              height={32}
              className="h-8 w-8 rounded-md"
              priority
            />
            <span className="text-base font-semibold tracking-tight text-slate-50">
              {siteConfig.domain}
            </span>
          </Link>

          {/* Center nav + dropdown (desktop) */}
          <div className="hidden flex-1 items-center justify-center md:flex">
            <div className="relative" onMouseLeave={scheduleCloseMenu}>
              <nav className="flex items-center gap-5 text-sm font-medium text-slate-300">
                {navLinks.map((item) => {
                  const isActive = activeMenu === item.id;
                  const baseClasses =
                    "px-2 py-1.5 rounded-full transition-colors cursor-pointer";
                  const stateClasses = isActive
                    ? "bg-slate-900 text-slate-50"
                    : "text-slate-300 hover:bg-slate-900 hover:text-slate-50";

                  if (item.id === "resources") {
                    // dropdown only
                    return (
                      <button
                        key={item.id}
                        type="button"
                        className={`${baseClasses} ${stateClasses}`}
                        onMouseEnter={() => openMenu("resources")}
                        onClick={() =>
                          openMenu(
                            activeMenu === "resources" ? null : "resources"
                          )
                        }
                      >
                        {item.label}
                      </button>
                    );
                  }

                  if (item.id === "rankings") {
                    // rankings has NO dropdown; hovering should close any open dropdown
                    return (
                      <Link
                        key={item.id}
                        href={item.href ?? "#"}
                        className={`${baseClasses} ${stateClasses}`}
                        onMouseEnter={() => openMenu(null)}
                      >
                        {item.label}
                      </Link>
                    );
                  }

                  // academics, degree, extension -> have dropdowns
                  return (
                    <Link
                      key={item.id}
                      href={item.href ?? "#"}
                      className={`${baseClasses} ${stateClasses}`}
                      onMouseEnter={() => openMenu(item.id)}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </nav>

              {/* Dropdown panel */}
              <div
                onMouseEnter={() => {
                  if (activeMenu) openMenu(activeMenu);
                }}
                className={`absolute left-1/2 top-full mt-2 w-[min(40rem,95vw)] -translate-x-1/2 rounded-2xl border border-slate-800 bg-slate-950/95 p-4 text-sm shadow-2xl shadow-black/50 transition-all duration-150 ease-out ${
                  activeMenu
                    ? "pointer-events-auto opacity-100 translate-y-0"
                    : "pointer-events-none opacity-0 -translate-y-1"
                }`}
              >
                {desktopItems.length > 0 && (
                  <>
                    <div className="grid gap-4 md:grid-cols-2">
                      {desktopItems.map((item) => (
                        <Link
                          key={item.title}
                          href={item.href}
                          className="group rounded-xl px-3 py-2 hover:bg-slate-900"
                          onClick={closeAll}
                        >
                          <p className="text-sm font-semibold text-slate-50 group-hover:text-slate-50">
                            {item.title}
                          </p>
                          <p className="mt-1 text-xs text-slate-400">
                            {item.desc}
                          </p>
                        </Link>
                      ))}
                    </div>

                    {/* Academics footer message */}
                    {activeMenu === "academics" && (
                      <div className="mt-4 flex items-center justify-between border-t border-slate-800 pt-3 text-xs">
                        <span className="text-slate-400">
                          New (beta): Degree planning recommendations.
                        </span>
                        <Link
                          href="/updates"
                          className="ml-4 text-xs font-semibold text-red-400 hover:text-red-300"
                          onClick={closeAll}
                        >
                          More info
                        </Link>
                      </div>
                    )}

                    {/* Resources footer message */}
                    {activeMenu === "resources" && (
                      <div className="mt-4 flex items-center justify-between border-t border-slate-800 pt-3 text-xs">
                        <span className="text-slate-400">
                          Sponsor / donate to support CoogPlanner.
                        </span>
                        <Link
                          href="#about"
                          className="ml-4 text-xs font-semibold text-red-400 hover:text-red-300"
                          onClick={closeAll}
                        >
                          Sponsor / donate
                        </Link>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Auth buttons (desktop) */}
          <div className="hidden items-center gap-3 md:flex">
            <Link
              href="#signin"
              className="text-sm font-medium text-slate-300 hover:text-slate-50"
            >
              Sign in
            </Link>
            <Link
              href="#signup"
              className="rounded-lg bg-red-400 px-4 py-1.5 text-sm font-semibold text-slate-950 shadow-sm hover:bg-red-300"
            >
              Sign up
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            className="inline-flex items-center justify-center p-1.5 text-slate-200 md:hidden"
            onClick={() => {
              clearCloseTimeout();
              setActiveMenu(null);
              setMobileOpen((prev) => !prev);
            }}
            aria-label="Toggle navigation"
          >
            <span className="text-2xl">{mobileOpen ? "✕" : "☰"}</span>
          </button>
        </div>
      </header>

      {/* Click-away overlay for mobile menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-30 md:hidden" onClick={closeAll} />
      )}

      {/* Mobile nav panel */}
      <div
        className={`bg-slate-950/95 md:hidden transform transition-all duration-150 ease-out overflow-hidden ${
          mobileOpen
            ? "max-h-[1000px] opacity-100 border-t border-slate-800"
            : "max-h-0 opacity-0 pointer-events-none border-t-0"
        }`}
      >
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-4">
          {/* Auth row - centered identical buttons */}
          <div className="flex flex-col items-center gap-2">
            <div className="flex gap-2">
              <Link
                href="#signin"
                className="rounded-full border border-slate-700 bg-slate-900 px-4 py-1.5 text-sm font-medium text-slate-100 shadow-sm hover:border-slate-500 hover:bg-slate-800 transition-colors"
                onClick={closeAll}
              >
                Sign in
              </Link>
              <Link
                href="#signup"
                className="rounded-full border border-slate-700 bg-slate-900 px-4 py-1.5 text-sm font-medium text-slate-100 shadow-sm hover:border-slate-500 hover:bg-slate-800 transition-colors"
                onClick={closeAll}
              >
                Sign up
              </Link>
            </div>
            <div className="mt-3 h-px w-full max-w-xs bg-slate-800" />
          </div>

          {/* Coog Planner section */}
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Coog Planner
            </p>
            <div className="flex flex-col gap-2 text-lg font-medium text-slate-50">
              {navLinks
                .filter((link) => link.showOnMobile && link.id !== "resources")
                .map((link) => (
                  <Link
                    key={link.id}
                    href={link.href ?? "#"}
                    onClick={closeAll}
                  >
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
              <Link href="#about" onClick={closeAll}>
                About Coog Planner
              </Link>
              <Link href="/faq" onClick={closeAll}>
                FAQ
              </Link>
              <Link href="/updates" onClick={closeAll}>
                Updates
              </Link>
              <Link href="/privacy-legal" onClick={closeAll}>
                Privacy &amp; legal
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
