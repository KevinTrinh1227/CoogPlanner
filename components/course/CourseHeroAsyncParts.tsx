// components/course/CourseHeroAsyncParts.tsx
import React from "react";
import type { Course } from "@/lib/courses";
import CourseMetricBadgesRow from "@/components/course/CourseMetricBadgesRow";
import CourseSyllabiButton from "@/components/course/CourseSyllabiButton";

function normalizeCatalogText(text?: string | null): string {
  if (!text) return "";
  return text
    .trim()
    .replace(/\s+([.,;:!?])/g, "$1")
    .replace(/\s+/g, " ");
}

// ---------- skeletons ----------

export function SkeletonLine(props: { className?: string }) {
  return (
    <div
      className={`h-5 rounded-lg border border-slate-800 bg-slate-900/40 ${
        props.className ?? ""
      }`}
      aria-hidden="true"
    />
  );
}

export function SkeletonPill(props: { className?: string }) {
  return (
    <div
      className={`h-9 rounded-lg border border-slate-800 bg-slate-900/40 ${
        props.className ?? ""
      }`}
      aria-hidden="true"
    />
  );
}

export function SkeletonBadgesRow() {
  return (
    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
      <SkeletonPill />
      <SkeletonPill />
      <SkeletonPill />
      <SkeletonPill />
    </div>
  );
}

// ---------- async slots ----------

export async function CreditLineSlot({
  coursePromise,
}: {
  coursePromise: Promise<Course>;
}) {
  const course = await coursePromise;
  const c = course.catalog;

  const creditHours = c.creditHours != null ? c.creditHours : "N/A";
  const lectureHours = c.lectureHours != null ? c.lectureHours : "N/A";
  const labHours = c.labHours != null ? c.labHours : "N/A";

  const creditLine = `Credit Hours: ${creditHours} (Lecture Hours: ${lectureHours} · Lab Hours: ${labHours})`;

  // ✅ not full width anymore
  return (
    <p className="inline-block w-fit break-words text-xs font-medium text-slate-200 md:text-sm">
      {creditLine}
    </p>
  );
}

export async function BadgesRowSlot({
  coursePromise,
}: {
  coursePromise: Promise<Course>;
}) {
  const course = await coursePromise;
  // ✅ badge appearance handled by your existing component
  return <CourseMetricBadgesRow badges={course.badges} />;
}

export async function PrereqTextSlot({
  coursePromise,
  singleLine = false,
}: {
  coursePromise: Promise<Course>;
  singleLine?: boolean;
}) {
  const course = await coursePromise;
  const text = normalizeCatalogText(course.catalog.prerequisites);

  if (!text) return <p className="mt-1 text-sm text-slate-500">N/A</p>;

  return singleLine ? (
    <p className="mt-1 max-w-full truncate text-sm leading-relaxed text-slate-200 md:text-[15px]">
      {text}
    </p>
  ) : (
    <p className="mt-1 break-words text-sm leading-relaxed text-slate-200 md:text-[15px]">
      {text}
    </p>
  );
}

export async function DescriptionTextSlot({
  coursePromise,
}: {
  coursePromise: Promise<Course>;
}) {
  const course = await coursePromise;
  const text = normalizeCatalogText(course.catalog.description);

  if (!text) return <p className="mt-1 text-sm text-slate-500">N/A</p>;

  return (
    <p className="mt-1 break-words text-sm leading-relaxed text-slate-200 md:text-[15px]">
      {text}
    </p>
  );
}

export async function MetaLineSlot({
  coursePromise,
}: {
  coursePromise: Promise<Course>;
}) {
  const course = await coursePromise;
  const catalog = course.catalog;

  return (
    <div className="break-words text-xs text-slate-300 md:text-sm">
      <span className="font-semibold text-slate-400">Repeatability:</span>{" "}
      <span>{catalog.repeatability ?? "N/A"}</span>
      <span className="mx-2 text-slate-600">•</span>
      <span className="font-semibold text-slate-400">
        TCCNS Equivalent:
      </span>{" "}
      <span>{catalog.tccnsEquivalent ?? "N/A"}</span>
      <span className="mx-2 text-slate-600">•</span>
      <span className="font-semibold text-slate-400">Additional Fee:</span>{" "}
      <span>{catalog.additionalFee ?? "N/A"}</span>
    </div>
  );
}

export async function PastSectionsButtonSlot({
  coursePromise,
}: {
  coursePromise: Promise<Course>;
}) {
  const course = await coursePromise;
  const pastSectionCount = course.pastSections?.length ?? 0;
  if (pastSectionCount <= 0) return null;

  return (
    <button
      type="button"
      className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900/80 px-3.5 py-1.5 text-xs font-medium text-slate-100 transition-colors hover:bg-slate-800 hover:text-slate-50 md:text-sm"
    >
      <span aria-hidden>🗓️</span>
      <span>{pastSectionCount} Past Section Times</span>
    </button>
  );
}

export async function SyllabiButtonSlot({
  coursePromise,
}: {
  coursePromise: Promise<Course>;
}) {
  const course = await coursePromise;
  return (
    <CourseSyllabiButton displayCode={course.code} courseTitle={course.name} />
  );
}

export async function CatalogSourcesButtonSlot({
  coursePromise,
  catalogCount = 0,
  hasCatalogLink = false,
}: {
  coursePromise: Promise<Course>;
  catalogCount?: number;
  hasCatalogLink?: boolean;
}) {
  // await to allow this to stream consistently with others
  await coursePromise;

  if (!hasCatalogLink || catalogCount <= 0) return null;

  return (
    <button
      type="button"
      className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900/80 px-3.5 py-1.5 text-xs font-medium text-slate-100 transition-colors hover:bg-slate-800 hover:text-slate-50 md:text-sm"
    >
      <span aria-hidden>🔗</span>
      <span>{catalogCount} Catalog Sources</span>
    </button>
  );
}
