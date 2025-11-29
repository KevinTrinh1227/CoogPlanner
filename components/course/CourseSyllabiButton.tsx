// components/course/CourseSyllabiButton.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useModalRouter } from "@/components/modals/useModalRouter";

interface CourseSyllabiButtonProps {
  displayCode: string; // e.g. "AAS 2320"
  courseTitle: string;
}

export default function CourseSyllabiButton({
  displayCode,
  courseTitle,
}: CourseSyllabiButtonProps) {
  const { openModal } = useModalRouter();

  const [label, setLabel] = useState<string>("Syllabi");
  /**
   * null   = still checking
   * false  = checked and found 0 (hide button)
   * true   = checked and found >= 1 (show button)
   */
  const [hasSyllabi, setHasSyllabi] = useState<boolean | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function checkCachedCount() {
      try {
        const res = await fetch(
          `/api/simple-syllabus?courseCode=${encodeURIComponent(displayCode)}`
        );

        if (!res.ok) {
          // On error, just hide the button (no surprise broken UI)
          if (!cancelled) {
            setHasSyllabi(false);
          }
          return;
        }

        const data = await res.json();
        if (cancelled) return;

        const syllabi = (data.syllabi ?? []) as unknown[];
        const count = Array.isArray(syllabi) ? syllabi.length : 0;

        if (count > 0) {
          setHasSyllabi(true);
          setLabel(count === 1 ? "1 Syllabus Found" : `${count} Syllabi Found`);
        } else {
          // No syllabi → no button
          setHasSyllabi(false);
        }
      } catch (err) {
        console.error("Error checking cached syllabi count", err);
        if (!cancelled) {
          // On error, also hide button
          setHasSyllabi(false);
        }
      }
    }

    checkCachedCount();

    return () => {
      cancelled = true;
    };
  }, [displayCode]);

  const handleClick = () => {
    openModal("course-syllabi-list", {
      code: displayCode,
      title: courseTitle,
    });
  };

  // 🔒 If we either:
  // - haven't finished checking (hasSyllabi === null), or
  // - know there are none (hasSyllabi === false)
  // → don't render *anything*
  if (hasSyllabi !== true) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900/80 px-3.5 py-1.5 text-xs font-medium text-slate-100 transition-colors hover:bg-slate-800 hover:text-slate-50 md:text-sm"
    >
      <span aria-hidden>📄</span>
      <span>{label}</span>
    </button>
  );
}
