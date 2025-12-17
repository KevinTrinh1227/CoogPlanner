// components/course/CourseResourcesLinksInner.tsx
"use client";

import CourseSyllabiButton from "@/components/course/CourseSyllabiButton";

export default function CourseResourcesLinksInner(props: {
  displayCode: string;
  courseTitle: string;
  pastSectionCount: number;
  showPastSectionsButton: boolean;
  catalogCount: number;
  showCatalogButton: boolean;
}) {
  const {
    displayCode,
    courseTitle,
    pastSectionCount,
    showPastSectionsButton,
    catalogCount,
    showCatalogButton,
  } = props;

  return (
    <div className="flex flex-wrap gap-2">
      {/* Past Section Times */}
      {showPastSectionsButton && (
        <button
          type="button"
          className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900/80 px-3.5 py-1.5 text-xs font-medium text-slate-100 transition-colors hover:bg-slate-800 hover:text-slate-50 md:text-sm"
        >
          <span aria-hidden>🗓️</span>
          <span>{pastSectionCount} Past Section Times</span>
        </button>
      )}

      {/* Course Syllabi – opens modal, fetch happens in the modal */}
      <CourseSyllabiButton
        displayCode={displayCode}
        courseTitle={courseTitle}
      />

      {/* Catalog Sources */}
      {showCatalogButton && (
        <button
          type="button"
          className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900/80 px-3.5 py-1.5 text-xs font-medium text-slate-100 transition-colors hover:bg-slate-800 hover:text-slate-50 md:text-sm"
        >
          <span aria-hidden>🔗</span>
          <span>{catalogCount} Catalog Sources</span>
        </button>
      )}

      {/* More Information / popup trigger (dead for now) */}
      <button
        type="button"
        className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900/80 px-3.5 py-1.5 text-xs font-medium text-slate-100 transition-colors hover:bg-slate-800 hover:text-slate-50 md:text-sm"
      >
        <span aria-hidden>📚</span>
        <span>More Information</span>
      </button>
    </div>
  );
}
