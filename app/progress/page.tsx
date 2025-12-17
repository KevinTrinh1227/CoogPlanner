import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { PageBreadcrumb } from "@/components/PageBreadcrumb";
import MyDegreeClient from "./MyProgressClient";

export const metadata: Metadata = {
  title: "Progress | Coog Planner",
  description:
    "Upload your unofficial UH transcript, clean up your courses, choose a degree, and get planning suggestions.",
};

export default function MyDegreePage() {
  const { name } = siteConfig;

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-10 lg:py-14">
      {/* Breadcrumb */}
      <PageBreadcrumb
        crumbs={[{ label: "Progress" }]}
        showStarAndCart={false}
        className="mb-3"
      />

      {/* Hero / intro */}
      <section className="space-y-4">
        <h1 className="text-balance text-2xl font-semibold tracking-tight text-slate-50 sm:text-3xl">
          🧑‍🎓 My Academic Progress
        </h1>

        <p className="text-sm leading-relaxed text-slate-300">
          Progress Planner turns your unofficial UH transcript into a clean,
          editable list of your courses. Upload the PDF once, review what shows
          up, then fix anything that is missing or incorrect. After that, choose
          your degree and a rough graduation target so {name ?? "Coog Planner"}{" "}
          can line your course history up with degree requirements and help you
          figure out what to take next.
        </p>

        {/* Transcript download dropdown */}
        <details className="group mt-2 w-full rounded-2xl border border-slate-800 bg-slate-950/60 p-4 text-sm text-slate-300">
          <summary className="flex cursor-pointer list-none items-center justify-between text-xs font-semibold text-slate-200">
            <span className="font-semibold">
              How to get your unofficial transcript easily
            </span>
            <span className="text-[0.7rem] text-slate-500 transition-transform group-open:rotate-90">
              ▶
            </span>
          </summary>

          <div className="mt-2 space-y-2">
            <p className="text-xs leading-relaxed text-slate-400">
              Your unofficial transcript lets CoogPlanner read which courses you
              have completed or are in progress so it can analyze your degree
              and suggest next steps.
            </p>

            <p className="text-xs leading-relaxed text-slate-400">
              Here is a typical flow using UH systems:
            </p>

            <ol className="list-decimal space-y-1 pl-5 text-xs leading-relaxed text-slate-400">
              <li>
                Go to{" "}
                <a
                  href="https://accessuh.uh.edu/login.php"
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold text-red-300 transition-colors hover:text-red-200"
                >
                  AccessUH
                </a>{" "}
                and sign in with your CougarNet credentials.
              </li>
              <li>Open myUH Self Service from the dashboard.</li>
              <li>In the menu, go to Academic Records → Transcripts.</li>
              <li>
                Choose View Unofficial Transcript and make sure the report type
                is “Unofficial Transcript.”
              </li>
              <li>
                Submit the request, then open the generated PDF (sometimes under
                “View All Requested Reports”).
              </li>
              <li>
                Download that PDF to your device and upload it into CoogPlanner
                when prompted.
              </li>
            </ol>

            <p className="text-xs leading-relaxed text-slate-400">
              The PDF you upload is used to parse course history and build your
              analysis. Always review the parsed results and fix anything that
              looks off before relying on them for planning.
            </p>
          </div>
        </details>
      </section>

      <MyDegreeClient />
    </div>
  );
}
