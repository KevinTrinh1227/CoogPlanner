// components/navbar/navConfig.ts

export type MenuKey =
  | "academics"
  | "degree"
  | "plannerai"
  | "rankings"
  | "extension"
  | "resources"
  | null;

export type MenuId = Exclude<MenuKey, null>;

export interface NavLinkItem {
  id: MenuId;
  label: string;
  href?: string;
  showOnMobile: boolean;

  /**
   * If true: hovering will open dropdown (desktop).
   * If false: hovering will close dropdown (desktop).
   */
  hasDropdown: boolean;

  /**
   * If true: item is dropdown-only (renders as <button> on desktop).
   * If false: item is a normal link (renders as <Link> on desktop).
   */
  dropdownOnly?: boolean;
}

export interface DesktopItem {
  title: string;
  desc: string;
  href: string;
  icon?: string; // ✅ NEW
}

export const BROWSER_EXTENSION_URL =
  "https://chromewebstore.google.com/detail/cougar/dglodedcccgiclbjaknemgcmmolpocmn";

/**
 * Top-level nav items (desktop + mobile).
 * Edit labels/hrefs/mobile visibility here.
 */
export const NAV_LINKS: NavLinkItem[] = [
  {
    id: "academics",
    label: "Browse Academics",
    href: "/search",
    showOnMobile: true,
    hasDropdown: true,
  },
  {
    id: "degree",
    label: "My Progress",
    href: "/progress",
    showOnMobile: true,
    hasDropdown: false,
  },
  {
    id: "plannerai",
    label: "Ask CoogPlanner",
    href: "/ask",
    showOnMobile: true,
    hasDropdown: false,
  },
  {
    id: "resources",
    label: "Resources",
    // dropdown only
    showOnMobile: true,
    hasDropdown: true,
    dropdownOnly: true,
  },
];

/**
 * Desktop dropdown content for each menu.
 * Edit titles/desc/hrefs/icons here.
 */
export const DROPDOWN_ITEMS: Record<MenuId, DesktopItem[]> = {
  academics: [
    {
      title: "Courses",
      desc: "7.2k+ UH Courses",
      href: "/courses",
      icon: "📚",
    },
    {
      title: "Instructors",
      desc: "13.4k+ UH Instructors",
      href: "#instructors",
      icon: "👨‍🏫",
    },
    {
      title: "Programs & Degrees",
      desc: "300+ Programs & Degrees",
      href: "#programs",
      icon: "🎓",
    },
    {
      title: "Leaderboards",
      desc: "Top Courses & Instructors",
      href: "/top",
      icon: "🏆",
    },
    {
      title: "Schedule Builder",
      desc: "Create & Share Schedules",
      href: "#academics",
      icon: "👥",
    },
    {
      title: "Academic Calendar",
      desc: "Calendar & Important Dates",
      href: "#academics",
      icon: "🗓️",
    },
  ],

  degree: [],
  plannerai: [],
  rankings: [],

  // Keeping key for type completeness (no longer a top-level nav item)
  extension: [],

  resources: [
    {
      title: "About",
      desc: "About us & our story",
      href: "/about",
      icon: "📌",
    },
    {
      title: "FAQ",
      desc: "Frequently Asked Questions",
      href: "/faq",
      icon: "🤔",
    },
    {
      title: "Updates",
      desc: "Changelog & new features",
      href: "/updates",
      icon: "⚙️",
    },
  ],
};

/**
 * Optional footer messages shown inside dropdown panels.
 * Edit copy/links here.
 */
export const DROPDOWN_FOOTER: Partial<
  Record<
    MenuId,
    {
      leftText: string;
      rightLabel: string;
      rightHref: string;
      rightExternal?: boolean;
    }
  >
> = {
  resources: {
    leftText: "Help support & run CoogPlanner!",
    rightLabel: "Sponsor / donate",
    rightHref: "https://ko-fi.com/kevintrinh",
    rightExternal: true,
  },
};
