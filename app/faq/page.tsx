// app/faq/page.tsx
"use client";

import { useMemo, useState } from "react";
import type React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { faqItems } from "@/config/faq";

// Simple slugify based on question text
const slugify = (input: string) =>
  input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export default function FaqPage() {
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

  // Initial open state comes from URL, but we never scroll.
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
      // closing current → clear URL
      closeAll();
    } else {
      // open this one, close others
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

  // If you want a “last updated” for the whole FAQ header, you can pull
  // it from the most recent item. For now we just use the first item.
  const faqLastUpdated = faqItems[0]?.lastUpdated ?? "2025";

  return (
    <div className="space-y-6 py-8 md:py-10">
      {/* Header card – styled like privacy/legal & updates pages */}
      <section className="rounded-3xl border border-slate-800 bg-slate-950/80 px-5 py-6 shadow-sm md:px-7 md:py-7">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/70 px-3 py-1 text-[11px] font-medium tracking-wide text-slate-200">
              <span className="h-1.5 w-1.5 rounded-full bg-rose-400" />
              FAQ & Help
            </div>
            <div className="space-y-1.5">
              <h1 className="text-2xl font-semibold tracking-tight text-slate-50 md:text-3xl">
                Frequently Asked Questions
              </h1>
              <p className="text-xs text-slate-400 md:text-sm">
                Everything about data freshness, accuracy, security,
                contributing, and more. Click a question below to expand its
                answer.
              </p>
            </div>
          </div>

          <div className="flex items-start justify-end text-xs text-slate-500 md:text-right">
            <p>
              Last updated:{" "}
              <span className="font-medium text-slate-200">
                {faqLastUpdated}
              </span>
            </p>
          </div>
        </div>
      </section>

      {/* Question list – same card style as other pages */}
      <section className="space-y-4">
        {faqsWithSlugs.map((faq) => {
          const isOpen = activeSlug === faq.slug;

          // Split answer into paragraphs on blank lines
          const paragraphs = faq.answer.trim().split(/\n{2,}/);

          return (
            <section
              key={faq.slug}
              id={`faq-${faq.slug}`}
              className="w-full rounded-3xl border border-slate-800 bg-slate-950/80 px-5 py-4 shadow-sm md:px-7 md:py-5"
            >
              {/* Entire header row is clickable */}
              <div
                role="button"
                tabIndex={0}
                onClick={() => handleToggle(faq.slug)}
                onKeyDown={handleKeyDown(faq.slug)}
                className="flex w-full cursor-pointer items-start justify-between gap-4 text-left"
                aria-expanded={isOpen}
                aria-controls={`faq-panel-${faq.slug}`}
              >
                <div className="flex flex-1 flex-col gap-1">
                  {/* Question title */}
                  <span className="text-lg font-semibold tracking-tight text-slate-50 md:text-xl">
                    {faq.question}
                  </span>
                  <span className="text-xs text-slate-500">
                    Last updated: {faq.lastUpdated}
                  </span>
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
                  <p key={idx} className="mb-2 whitespace-pre-line last:mb-0">
                    {para}
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
