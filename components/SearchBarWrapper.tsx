// components/SearchBarWrapper.tsx
"use client";

import { usePathname } from "next/navigation";
import SearchBar from "@/components/SearchBar";

export default function SearchBarWrapper() {
  const pathname = usePathname();

  // Hide search bar on specific top-level pages
  const hiddenPrefixes = [
    "/faq",
    "/updates",
    "/privacy-legal",
    "/about",
    "/browser-extension",
  ];

  if (hiddenPrefixes.some((prefix) => pathname.startsWith(prefix))) {
    return null;
  }

  return <SearchBar />;
}
