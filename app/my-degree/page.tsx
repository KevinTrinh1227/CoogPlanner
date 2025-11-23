// app/my-degree/page.tsx

import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import MyDegreeClient from "./MyDegreeClient";

export const metadata: Metadata = {
  title: "My Degree | Coog Planner",
  description:
    "Upload your unofficial UH transcript, clean up your courses, choose a degree, and get planning suggestions.",
};

export default function MyDegreePage() {
  const { name } = siteConfig;

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-16 px-4 py-10 lg:py-14">
      {/* Hero / intro */}
      <section className="space-y-4">
        <h1 className="text-balance text-2xl font-semibold tracking-tight text-slate-50 sm:text-3xl">
          My Degree Planner
        </h1>

        <p className="text-sm leading-relaxed text-slate-300">
          My Degree Planner helps you turn your unofficial UH transcript into a
          clean, editable snapshot of your academic history. Upload once, fix
          any mistakes, and use it as the base for planning future semesters.
        </p>

        <p className="text-sm leading-relaxed text-slate-300">
          The goal is to make it easy to see what you&apos;ve already taken,
          what you&apos;re in the middle of, and how it all lines up with your
          degree requirements - so future semester planning feels less chaotic
          and more intentional.
        </p>

        {/* Transcript handling / privacy dropdown */}
        <details className="group mt-2 w-full rounded-2xl border border-slate-800 bg-slate-950/60 p-4 text-sm text-slate-300">
          <summary className="flex cursor-pointer list-none items-center justify-between text-xs font-medium text-slate-200">
            <span>How does Coog Planner handle my transcript?</span>
            <span className="text-[0.7rem] text-slate-500 transition-transform group-open:rotate-90">
              ▶
            </span>
          </summary>
          <p className="mt-2 text-xs leading-relaxed text-slate-400">
            In this version of My Degree Planner, selecting a file stays in your
            browser only - it&apos;s not uploaded, stored, or sent to any
            server. When we later add real parsing and storage, those changes
            will be clearly documented in the privacy / legal pages and will
            require explicit consent before anything leaves your device.
          </p>
        </details>

        <div className="flex flex-wrap gap-2 text-xs sm:text-sm">
          <a
            href="/faq#unofficial-transcript"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-1.5 font-medium text-slate-100 transition-all duration-150 hover:-translate-y-0.5 hover:border-brand-light/80 hover:text-brand-light hover:shadow-md focus-visible:outline-none focus-visible:ring focus-visible:ring-brand-light/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
          >
            <span aria-hidden>❓</span>
            <span>How to download unofficial transcript</span>
          </a>

          <a
            href="https://accessuh.uh.edu/login.php"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-1.5 font-medium text-slate-100 transition-all duration-150 hover:-translate-y-0.5 hover:border-brand-light/80 hover:text-brand-light hover:shadow-md focus-visible:outline-none focus-visible:ring focus-visible:ring-brand-light/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
          >
            <span aria-hidden>🔑</span>
            <span>Open AccessUH</span>
          </a>
        </div>
      </section>

      <MyDegreeClient />
    </div>
  );
}
