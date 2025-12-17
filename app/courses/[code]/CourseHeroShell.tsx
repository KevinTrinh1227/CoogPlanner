// app/courses/[code]/CourseHeroShell.tsx
import React, { Suspense } from "react";
import type { Course } from "@/lib/courses";

import CourseMetricBadgesRow from "@/components/course/CourseMetricBadgesRow";
import CourseSyllabiButton from "@/components/course/CourseSyllabiButton";

type Props = {
  name: string;
  displayCode: string;

  /** ✅ Pass badges in from the header loader so badges are NOT lazy-loaded here */
  badges: Course["badges"];

  /** Still used for streaming the rest of the hero details */
  coursePromise: Promise<Course>;

  catalogCount?: number;
  hasCatalogLink?: boolean;
};

// ---------------- helpers ----------------

function normalizeCatalogText(text?: string | null): string {
  if (!text) return "";
  return text
    .trim()
    .replace(/\s+([.,;:!?])/g, "$1")
    .replace(/\s+/g, " ");
}

function SkeletonLine(props: { className?: string }) {
  return (
    <div
      className={`h-5 rounded-lg border border-slate-800 bg-slate-900/40 ${
        props.className ?? ""
      }`}
      aria-hidden="true"
    />
  );
}

function SkeletonPill(props: { className?: string }) {
  return (
    <div
      className={`h-9 rounded-lg border border-slate-800 bg-slate-900/40 ${
        props.className ?? ""
      }`}
      aria-hidden="true"
    />
  );
}

// ---------------- async “slots” ----------------

async function CreditLineSlot({
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

  return (
    <p className="inline-block w-fit break-words text-xs font-medium text-slate-200 md:text-sm">
      {creditLine}
    </p>
  );
}

async function PrereqTextSlot({
  coursePromise,
}: {
  coursePromise: Promise<Course>;
}) {
  const c = await coursePromise;
  const text = normalizeCatalogText(c.catalog.prerequisites);

  if (!text) return <p className="mt-1 text-sm text-slate-500">N/A</p>;

  // single-line only
  return (
    <p className="mt-1 max-w-full truncate text-sm leading-relaxed text-slate-200 md:text-[15px]">
      {text}
    </p>
  );
}

async function DescriptionTextSlot({
  coursePromise,
}: {
  coursePromise: Promise<Course>;
}) {
  const c = await coursePromise;
  const text = normalizeCatalogText(c.catalog.description);

  if (!text) return <p className="mt-1 text-sm text-slate-500">N/A</p>;

  return (
    <p className="mt-1 break-words text-sm leading-relaxed text-slate-200 md:text-[15px]">
      {text}
    </p>
  );
}

async function MetaLineSlot({
  coursePromise,
}: {
  coursePromise: Promise<Course>;
}) {
  const c = await coursePromise;
  const catalog = c.catalog;

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

async function PastSectionsButtonSlot({
  coursePromise,
}: {
  coursePromise: Promise<Course>;
}) {
  const c = await coursePromise;
  const count = c.pastSections?.length ?? 0;
  if (count <= 0) return null;

  return (
    <button
      type="button"
      className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900/80 px-3.5 py-1.5 text-xs font-medium text-slate-100 transition-colors hover:bg-slate-800 hover:text-slate-50 md:text-sm"
    >
      <span aria-hidden>🗓️</span>
      <span>{count} Past Section Times</span>
    </button>
  );
}

async function CatalogSourcesButtonSlot({
  coursePromise,
  catalogCount = 0,
  hasCatalogLink = false,
}: {
  coursePromise: Promise<Course>;
  catalogCount?: number;
  hasCatalogLink?: boolean;
}) {
  // keep it streaming like the others
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

async function SyllabiButtonSlot({
  coursePromise,
}: {
  coursePromise: Promise<Course>;
}) {
  const c = await coursePromise;
  return <CourseSyllabiButton displayCode={c.code} courseTitle={c.name} />;
}

// ---------------- main shell ----------------

export default function CourseHeroShell({
  name,
  displayCode,
  badges,
  coursePromise,
  catalogCount = 0,
  hasCatalogLink = false,
}: Props) {
  return (
    <section className="pb-0">
      <div className="space-y-3">
        {/* ✅ NOT lazy: title + code */}
        <div className="space-y-1">
          <h1 className="text-balance text-xl font-semibold tracking-tight text-slate-50 sm:text-2xl md:text-3xl">
            {name}
          </h1>
          <p className="text-balance text-3xl font-semibold tracking-tight text-rose-300 sm:text-4xl md:text-5xl">
            {displayCode}
          </p>
        </div>

        {/* ✅ NOT lazy: badges row (no formatting logic in this file) */}
        <CourseMetricBadgesRow badges={badges} />

        {/* ✅ Lazy: ONE credit line */}
        <Suspense fallback={<SkeletonLine className="w-80" />}>
          <CreditLineSlot coursePromise={coursePromise} />
        </Suspense>
      </div>

      {/* Description & metadata */}
      <div className="mt-5 space-y-3">
        {/* header NOT lazy; body lazy (single line) */}
        <div className="mt-1">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            Pre &amp; Co-requisites
          </p>
          <Suspense
            fallback={<SkeletonLine className="mt-1 w-[min(36rem,100%)]" />}
          >
            <PrereqTextSlot coursePromise={coursePromise} />
          </Suspense>
        </div>

        {/* header NOT lazy; body lazy */}
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            Description
          </p>
          <Suspense
            fallback={<SkeletonLine className="mt-2 w-[min(44rem,100%)]" />}
          >
            <DescriptionTextSlot coursePromise={coursePromise} />
          </Suspense>
        </div>

        {/* meta line lazy */}
        <Suspense fallback={<SkeletonLine className="w-[min(42rem,100%)]" />}>
          <MetaLineSlot coursePromise={coursePromise} />
        </Suspense>

        {/* header NOT lazy; buttons lazy individually */}
        <div className="space-y-1 pt-2">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            Course Resources &amp; Links
          </p>

          <div className="flex flex-wrap gap-2">
            <Suspense fallback={<SkeletonPill className="w-48" />}>
              <PastSectionsButtonSlot coursePromise={coursePromise} />
            </Suspense>

            <Suspense fallback={<SkeletonPill className="w-36" />}>
              <SyllabiButtonSlot coursePromise={coursePromise} />
            </Suspense>

            <Suspense fallback={<SkeletonPill className="w-44" />}>
              <CatalogSourcesButtonSlot
                coursePromise={coursePromise}
                catalogCount={catalogCount}
                hasCatalogLink={hasCatalogLink}
              />
            </Suspense>

            {/* Static button (instant) */}
            <button
              type="button"
              className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900/80 px-3.5 py-1.5 text-xs font-medium text-slate-100 transition-colors hover:bg-slate-800 hover:text-slate-50 md:text-sm"
            >
              <span aria-hidden>📚</span>
              <span>More Information</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
