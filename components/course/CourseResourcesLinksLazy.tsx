// components/course/CourseResourcesLinksLazy.tsx
"use client";

import dynamic from "next/dynamic";

const Inner = dynamic(() => import("./CourseResourcesLinksInner"), {
  ssr: false,
  loading: () => (
    <div className="flex flex-wrap gap-2">
      <div className="h-8 w-40 rounded-lg bg-slate-800/60" />
      <div className="h-8 w-28 rounded-lg bg-slate-800/60" />
      <div className="h-8 w-36 rounded-lg bg-slate-800/60" />
    </div>
  ),
});

export default function CourseResourcesLinksLazy(props: {
  displayCode: string;
  courseTitle: string;
  pastSectionCount: number;
  showPastSectionsButton: boolean;
  catalogCount: number;
  showCatalogButton: boolean;
}) {
  return <Inner {...props} />;
}
