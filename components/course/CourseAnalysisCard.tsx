// components/course/CourseAnalysisCard.tsx
import React, { Suspense } from "react";

type CourseAnalysisCardProps = {
  /**
   * Use this if you already have the text (non-lazy).
   */
  analysisText?: string;

  /**
   * Use this to lazy-load ONLY the paragraph text.
   * Example: analysisTextPromise={coursePromise.then(buildAnalysisText)}
   */
  analysisTextPromise?: Promise<string>;
};

function AnalysisSkeleton() {
  return (
    <div className="mt-3 space-y-2">
      <div className="h-4 w-[95%] rounded-md bg-slate-800/40" />
      <div className="h-4 w-[88%] rounded-md bg-slate-800/40" />
      <div className="h-4 w-[70%] rounded-md bg-slate-800/40" />
    </div>
  );
}

async function AnalysisText({
  analysisText,
  analysisTextPromise,
}: {
  analysisText?: string;
  analysisTextPromise?: Promise<string>;
}) {
  const text = analysisTextPromise
    ? await analysisTextPromise
    : analysisText ?? "";
  return (
    <p className="mt-3 text-sm leading-relaxed text-slate-200 md:text-[15px]">
      {text}
    </p>
  );
}

export default function CourseAnalysisCard({
  analysisText,
  analysisTextPromise,
}: CourseAnalysisCardProps) {
  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 md:p-6">
      {/* ✅ NOT lazy */}
      <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-300">
        Course Analysis
      </h2>

      {/* ✅ ONLY this text can lazy-load */}
      {analysisTextPromise ? (
        <Suspense fallback={<AnalysisSkeleton />}>
          <AnalysisText analysisTextPromise={analysisTextPromise} />
        </Suspense>
      ) : (
        <AnalysisText analysisText={analysisText ?? ""} />
      )}
    </section>
  );
}
