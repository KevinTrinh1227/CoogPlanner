"use client";

import Link from "next/link";
import {
  DROPDOWN_FOOTER,
  DROPDOWN_ITEMS,
  NAV_LINKS,
  type MenuId,
  type MenuKey,
} from "./navConfig";

export default function DesktopNavbar(props: {
  activeMenu: MenuKey;
  openMenu: (key: MenuKey) => void;
  scheduleCloseMenu: () => void;
  closeAll: () => void;
}) {
  const { activeMenu, openMenu, scheduleCloseMenu, closeAll } = props;

  const desktopItems = activeMenu ? DROPDOWN_ITEMS[activeMenu as MenuId] : [];
  const footer = activeMenu ? DROPDOWN_FOOTER[activeMenu as MenuId] : undefined;

  return (
    <div className="hidden flex-1 items-center justify-center md:flex">
      <div className="relative" onMouseLeave={scheduleCloseMenu}>
        <div className="rounded-full border border-slate-800 bg-slate-950/50 px-2 py-1">
          <nav className="flex items-center gap-1 text-sm font-medium text-slate-300">
            {NAV_LINKS.map((item) => {
              const isActive = activeMenu === item.id;

              const baseClasses =
                "cursor-pointer rounded-md px-3 py-1.5 transition-colors";
              const stateClasses = isActive
                ? "bg-slate-900 text-slate-50"
                : "text-slate-300 hover:bg-slate-900 hover:text-slate-50";

              // Dropdown-only item (e.g. Resources)
              if (item.dropdownOnly) {
                return (
                  <button
                    key={item.id}
                    type="button"
                    className={`${baseClasses} ${stateClasses}`}
                    onMouseEnter={() => openMenu(item.id)}
                    onClick={() =>
                      openMenu(activeMenu === item.id ? null : item.id)
                    }
                  >
                    {item.label}
                  </button>
                );
              }

              const handleMouseEnter = () => {
                if (item.hasDropdown) openMenu(item.id);
                else openMenu(null);
              };

              return (
                <Link
                  key={item.id}
                  href={item.href ?? "#"}
                  prefetch={false}
                  className={`${baseClasses} ${stateClasses}`}
                  onMouseEnter={handleMouseEnter}
                  onClick={closeAll}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Dropdown panel */}
        <div
          onMouseEnter={() => {
            if (activeMenu) openMenu(activeMenu);
          }}
          className={`absolute left-1/2 top-full mt-2 w-[min(48rem,81vw)] -translate-x-1/2 rounded-2xl border border-slate-800 bg-slate-950/95 p-4 text-sm shadow-2xl shadow-black/50 transition-all duration-150 ease-out ${
            activeMenu
              ? "pointer-events-auto translate-y-0 opacity-100"
              : "pointer-events-none -translate-y-1 opacity-0"
          }`}
        >
          {desktopItems.length > 0 && (
            <>
              <div className="grid auto-rows-fr gap-4 md:grid-cols-3">
                {desktopItems.map((item) => {
                  const isExternal = item.href.startsWith("http");
                  const icon = item.icon ?? "✨";

                  return (
                    <Link
                      key={item.title}
                      href={item.href}
                      prefetch={false}
                      className="group h-full rounded-xl px-3 py-2 hover:bg-slate-900"
                      onClick={closeAll}
                      target={isExternal ? "_blank" : undefined}
                      rel={isExternal ? "noopener noreferrer" : undefined}
                    >
                      <div className="flex h-full items-center gap-3">
                        <div
                          className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg border border-slate-800 bg-slate-800"
                          aria-hidden="true"
                        >
                          <span className="text-lg leading-none transition-transform duration-150 ease-out group-hover:scale-110">
                            {icon}
                          </span>
                        </div>

                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-slate-50">
                            {item.title}
                          </p>
                          <p className="mt-1 text-xs text-slate-400">
                            {item.desc}
                          </p>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>

              {footer && (
                <div className="mt-4 flex items-center justify-between border-t border-slate-800 pt-3 text-xs">
                  <span className="font-semibold text-slate-50">
                    {footer.leftText}
                  </span>

                  <Link
                    href={footer.rightHref}
                    prefetch={false}
                    className="ml-4 text-xs font-semibold text-red-400 hover:text-red-300"
                    onClick={closeAll}
                    target={footer.rightExternal ? "_blank" : undefined}
                    rel={
                      footer.rightExternal ? "noopener noreferrer" : undefined
                    }
                  >
                    {footer.rightLabel}
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
