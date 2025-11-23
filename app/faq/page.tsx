// app/faq/page.tsx
"use client";

import { Suspense, useMemo, useState } from "react";
import type React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { faqItems } from "@/config/faq";
import { PageBreadcrumb } from "@/components/PageBreadcrumb";

// Simple slugify based on question text
const slugify = (input: string) =>
  input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

// Very small inline markdown renderer for **bold** only
const renderInlineMarkdown = (text: string): React.ReactNode[] => {
  // Split on segments that look like **...**
  const parts = text.split(/(\*\*[^*]+\*\*)/g);

  return parts.map((part, index) => {
    const match = part.match(/^\*\*([^*]+)\*\*$/);
    if (match) {
      return <strong key={index}>{match[1]}</strong>;
    }
    return <span key={index}>{part}</span>;
  });
};

// This component actually uses the hooks and is wrapped in <Suspense>
function FaqPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const faqsWithSlugs = useMemo(
    () =>
      faqItems.map((item) => ({
        ...item,
        slug: slugify(item.question),
      })),
    []
  );

  // Initial open state comes from URL
  const [activeSlug, setActiveSlug] = useState<string | undefined>(() => {
    return searchParams.get("q") || undefined;
  });

  const openSlug = (slug: string) => {
    setActiveSlug(slug);
    const params = new URLSearchParams(searchParams.toString());
    params.set("q", slug);
    router.replace(`/faq?${params.toString()}`, { scroll: false });
  };

  const closeAll = () => {
    setActiveSlug(undefined);
    router.replace("/faq", { scroll: false });
  };

  const handleToggle = (slug: string) => {
    if (activeSlug === slug) {
      closeAll();
    } else {
      openSlug(slug);
    }
  };

  const handleKeyDown =
    (slug: string) => (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        handleToggle(slug);
      }
    };

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-10 lg:py-14">
      {/* Breadcrumb – sits at the very top */}
      <PageBreadcrumb
        crumbs={[{ label: "FAQ" }]}
        showStarAndCart={false}
        className="mb-3"
      />

      {/* Page header */}
      <section>
        <h1 className="text-balance text-2xl font-semibold tracking-tight text-slate-50 md:text-3xl">
          Frequently Asked Questions
        </h1>

        <p className="mt-2 max-w-3xl text-xs leading-relaxed text-slate-300 md:text-sm">
          Answers to the most common questions about data freshness, accuracy,
          security, contributions, and more. Click a question below to expand
          its answer.
        </p>
      </section>

      {/* Question list */}
      <section className="space-y-4">
        {faqsWithSlugs.map((faq) => {
          const isOpen = activeSlug === faq.slug;

          // Split answer into paragraphs on blank lines
          const paragraphs = faq.answer.trim().split(/\n{2,}/);

          return (
            <section
              key={faq.slug}
              id={`faq-${faq.slug}`}
              className="w-full rounded-2xl border border-slate-800 bg-slate-950/80 p-5 shadow-sm transition-all duration-150 hover:-translate-y-0.5 hover:border-brand-light/70 hover:shadow-md md:p-7"
            >
              {/* Header row is clickable */}
              <div
                role="button"
                tabIndex={0}
                onClick={() => handleToggle(faq.slug)}
                onKeyDown={handleKeyDown(faq.slug)}
                className="flex w-full cursor-pointer items-start justify-between gap-4 text-left"
                aria-expanded={isOpen}
                aria-controls={`faq-panel-${faq.slug}`}
              >
                <div className="flex flex-1 items-start gap-3">
                  <div className="mt-1 hidden h-7 w-7 items-center justify-center rounded-xl bg-slate-900/80 text-base text-slate-200 sm:flex">
                    <span aria-hidden>🔹</span>
                  </div>
                  <div className="flex flex-1 flex-col gap-1">
                    {/* Question title */}
                    <span className="text-lg font-semibold tracking-tight text-slate-50 md:text-xl">
                      {faq.question}
                    </span>
                    <span className="text-[11px] uppercase tracking-wide text-slate-500">
                      Last updated:{" "}
                      <span className="font-medium text-slate-300">
                        {faq.lastUpdated}
                      </span>
                    </span>
                  </div>
                </div>

                {/* Chevron icon that rotates when open */}
                <div className="mt-1 flex items-center justify-center">
                  <svg
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                    className={`h-5 w-5 text-slate-300 transition-transform duration-150 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  >
                    <path
                      d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 10.94l3.71-3.71a.75.75 0 1 1 1.06 1.06l-4.24 4.24a.75.75 0 0 1-1.06 0L5.21 8.29a.75.75 0 0 1 .02-1.08Z"
                      fill="currentColor"
                    />
                  </svg>
                </div>
              </div>

              {/* Smooth open/close answer panel */}
              <div
                id={`faq-panel-${faq.slug}`}
                className={`overflow-hidden text-sm text-slate-300 transition-all duration-200 ease-out md:text-[15px] ${
                  isOpen
                    ? "mt-3 max-h-[600px] border-t border-slate-800 pt-3 opacity-100"
                    : "mt-0 max-h-0 border-t-0 pt-0 opacity-0"
                }`}
                aria-hidden={!isOpen}
              >
                {paragraphs.map((para, idx) => (
                  <p
                    key={idx}
                    className="mb-2 whitespace-pre-line text-xs leading-relaxed text-slate-200 last:mb-0 md:text-sm"
                  >
                    {renderInlineMarkdown(para)}
                  </p>
                ))}
              </div>
            </section>
          );
        })}
      </section>
    </div>
  );
}

// Wrap the hook-using component in Suspense to satisfy Next.js
export default function FaqPage() {
  return (
    <Suspense
      fallback={
        <div className="px-4 py-8 text-sm text-slate-400">Loading FAQ…</div>
      }
    >
      <FaqPageInner />
    </Suspense>
  );
}
