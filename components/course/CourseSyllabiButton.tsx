// components/course/CourseSyllabiButton.tsx
"use client";

import { useEffect, useState } from "react";
import { useModalRouter } from "@/components/modals/useModalRouter";
import { setSyllabiForCourse } from "@/components/course/syllabusClientCache";

interface CourseSyllabiButtonProps {
  displayCode: string; // e.g. "MANA 3335"
  courseTitle: string; // course.name
}

export default function CourseSyllabiButton({
  displayCode,
  courseTitle,
}: CourseSyllabiButtonProps) {
  const { openModal } = useModalRouter();

  const [count, setCount] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setIsLoading(true);
      setError(null);

      try {
        const res = await fetch(
          `/api/simple-syllabus?courseCode=${encodeURIComponent(displayCode)}`
        );

        if (!res.ok) {
          throw new Error(`Failed to load syllabi (${res.status})`);
        }

        const data = await res.json();
        if (cancelled) return;

        const syllabi = (data.syllabi ?? []) as unknown[];

        // stash full list in client cache for this course
        setSyllabiForCourse(displayCode, syllabi);

        setCount(syllabi.length);
        setIsLoading(false);
      } catch (err) {
        console.error("Error loading syllabi count", err);
        if (!cancelled) {
          setError("Unable to load syllabi.");
          setIsLoading(false);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [displayCode]);

  // While loading or before we know the count → no button
  if (isLoading || count === null) return null;

  // If no public syllabi and no error → don't show the button at all
  if (!error && count === 0) return null;

  // Label: "{#} Syllabi Found" (or singular)
  let label: string;
  if (!error && count > 0) {
    label = count === 1 ? "1 Syllabus Found" : `${count} Syllabi Found`;
  } else {
    // fallback if something went weird but we still choose to show a button
    label = "Syllabi";
  }

  return (
    <button
      type="button"
      onClick={() =>
        openModal("course-syllabi-list", {
          code: displayCode,
          title: courseTitle,
        })
      }
      className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900/80 px-3.5 py-1.5 text-xs font-medium text-slate-100 transition-colors hover:bg-slate-800 hover:text-slate-50 md:text-sm"
    >
      <span aria-hidden>📄</span>
      <span>{label}</span>
    </button>
  );
}
