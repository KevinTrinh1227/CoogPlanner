// components/Navbar.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/config/site";
import { useEffect, useRef, useState } from "react";

import DesktopNavbar from "@/components/navbar/DesktopNavbar";
import MobileNavbar from "@/components/navbar/MobileNavbar";
import type { MenuKey } from "@/components/navbar/navConfig";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<MenuKey>(null);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
    }, 120);
  };

  const closeAll = () => {
    clearCloseTimeout();
    setActiveMenu(null);
    setMobileOpen(false);
  };

  // Close dropdowns (desktop + mobile) when scrolling
  useEffect(() => {
    const handleScroll = () => {
      setActiveMenu(null);
      setMobileOpen(false);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/70 backdrop-blur">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-3">
          {/* Logo */}
          <Link
            href="/"
            className="group flex items-center gap-2"
            onClick={closeAll}
          >
            <Image
              src="/logo.png"
              alt={`${siteConfig.name} logo`}
              width={32}
              height={32}
              className="h-8 w-8 rounded-md transition-transform duration-150 ease-out will-change-transform group-hover:scale-95 group-active:scale-90"
              priority
            />
            <span className="origin-left text-base font-semibold tracking-tight text-slate-50 transition-transform duration-150 ease-out will-change-transform group-hover:scale-95 group-active:scale-90">
              {siteConfig.name}
            </span>
          </Link>

          {/* Desktop center nav + dropdown */}
          <DesktopNavbar
            activeMenu={activeMenu}
            openMenu={openMenu}
            scheduleCloseMenu={scheduleCloseMenu}
            closeAll={closeAll}
          />

          {/* Auth buttons (desktop) */}
          <div className="hidden items-center gap-3 md:flex">
            <Link
              href="/login"
              className="text-sm font-medium text-slate-300 hover:text-slate-50"
            >
              Sign in
            </Link>
            <Link
              href="/signup"
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

      {/* Mobile overlay + nav panel */}
      <MobileNavbar mobileOpen={mobileOpen} closeAll={closeAll} />
    </>
  );
}
