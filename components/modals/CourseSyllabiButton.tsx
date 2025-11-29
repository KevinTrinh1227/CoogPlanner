"use client";

import { useEffect, useState } from "react";
import { useModalRouter } from "@/components/modals/useModalRouter";

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
        setCount(syllabi.length);
        setIsLoading(false);
      } catch (err) {
        console.error("Error loading syllabi count", err);
        if (!cancelled) {
          setError("Unable to load syllabi.");
          setIsLoading(false);
          // you could setCount(0) here if you prefer to just hide the button
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [displayCode]);

  // While loading, you can either hide the button or show a subtle skeleton.
  if (isLoading || count === null) {
    return null; // or a skeleton if you want
  }

  // If no public syllabi → don't render the button at all
  if (!error && count === 0) {
    return null;
  }

  const label =
    !error && count !== null
      ? count === 1
        ? "View 1 syllabus"
        : `View ${count} syllabi`
      : "View syllabi"; // fallback if error

  return (
    <button
      type="button"
      onClick={() =>
        openModal("course-syllabi-list", {
          code: displayCode,
          title: courseTitle,
        })
      }
      className="inline-flex items-center gap-1.5 rounded-lg border border-rose-500/40 bg-rose-500/10 px-2.5 py-1 text-[11px] font-medium text-rose-100 shadow-sm transition hover:bg-rose-500/20"
    >
      <span aria-hidden>📄</span>
      <span>{label}</span>
    </button>
  );
}
