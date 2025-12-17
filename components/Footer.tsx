// components/Footer.tsx
import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { getRepoMetaCached } from "@/lib/github";
import Tooltip from "@/components/Tooltip";

type RepoMeta = {
  latestTag?: string | null;
};

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const id = setTimeout(() => reject(new Error("timeout")), ms);
    promise
      .then((v) => {
        clearTimeout(id);
        resolve(v);
      })
      .catch((err) => {
        clearTimeout(id);
        reject(err);
      });
  });
}

export default async function Footer() {
  // ✅ Never let GitHub metadata block rendering (prevents CPU spikes)
  let repoMeta: RepoMeta | null = null;
  try {
    repoMeta = await withTimeout(getRepoMetaCached() as Promise<RepoMeta>, 800);
  } catch {
    repoMeta = null;
  }

  const version = repoMeta?.latestTag ?? "v0.0.0-dev";
  const year = new Date().getFullYear();

  const githubRepoUrl = `https://github.com/${siteConfig.github.owner}/${siteConfig.github.repo}`;
  const githubIssuesUrl = `${githubRepoUrl}/issues`;

  const latestUpdateNumber = 0;
  const recentlyUpdatedLabel = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date());

  return (
    <footer className="border-t border-slate-800 bg-slate-950/90">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-12 text-center text-[12px] text-slate-400 md:flex-row md:items-start md:justify-between md:text-left">
        {/* Left */}
        <div className="space-y-2 md:text-left">
          {/* Logo + domain */}
          <Link
            href="/"
            prefetch={false} // ✅ stop RSC prefetch storms
            className="inline-flex items-center justify-center gap-2 text-slate-50 transition-transform duration-150 ease-out will-change-transform hover:scale-95 active:scale-90 md:justify-start"
          >
            <Image
              src="/logo.png"
              alt={`${siteConfig.name} logo`}
              width={22}
              height={22}
              className="h-6 w-6 rounded-md"
            />
            <span className="text-base font-semibold tracking-tight">
              {siteConfig.name}.com
            </span>
          </Link>

          {/* Recently Updated */}
          <p>
            Recently Updated:{" "}
            <span className="font-semibold text-slate-100">
              {recentlyUpdatedLabel}
            </span>{" "}
            (
            <Link
              href="/updates"
              prefetch={false} // ✅
              className="font-semibold text-red-300 transition-colors hover:text-red-200"
            >
              #{latestUpdateNumber}
            </Link>
            )
          </p>

          <p>
            Current release:{" "}
            <span className="font-semibold text-slate-100">{version}</span>
          </p>

          {/* UH data + tooltip */}
          <div className="flex flex-wrap items-center justify-center gap-2 md:justify-start">
            <span>
              UH data updated:{" "}
              <span className="text-slate-100">
                {siteConfig.data.uhDataLastUpdated}
              </span>
            </span>

            <Tooltip
              variant="default"
              side="top"
              align="start"
              content={
                <div>
                  <p className="mb-1 text-[11px] font-semibold text-slate-50">
                    UH Data Freshness
                  </p>
                  <ul className="list-disc space-y-1 pl-4 text-[11px] text-slate-100">
                    <li>
                      Includes all recorded terms up through{" "}
                      <span className="font-semibold">Spring 2025</span>.
                    </li>
                    <li>
                      Updates happen when new UH grading data is published and
                      processed. Please visit the Resources / FAQ page for more
                      info.
                    </li>
                  </ul>
                </div>
              }
            >
              <span className="inline-flex h-4 w-4 cursor-help items-center justify-center rounded-full bg-slate-900 text-[10px] text-slate-300 ring-1 ring-slate-600">
                ?
              </span>
            </Tooltip>
          </div>

          {/* Source + Issues */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-1 md:justify-start">
            <Link
              href={githubRepoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1 rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-1.5 text-[11px] font-semibold text-slate-100 hover:border-slate-500 hover:bg-slate-800"
            >
              <span aria-hidden="true">💻</span>
              <span>Source Code</span>
            </Link>

            <Link
              href={githubIssuesUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1 rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-1.5 text-[11px] font-semibold text-slate-100 hover:border-slate-500 hover:bg-slate-800"
            >
              <span aria-hidden="true">🚩</span>
              <span>Report issues</span>
            </Link>
          </div>
        </div>

        {/* Right */}
        <div className="space-y-2 md:text-right">
          <div className="flex flex-wrap items-center justify-center gap-2 pt-1 md:justify-end">
            <button
              type="button"
              className="inline-flex items-center justify-center gap-1 rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-1.5 text-[11px] font-semibold text-slate-100 hover:border-slate-500 hover:bg-slate-800"
            >
              <span aria-hidden="true">📤</span>
              <span>Share</span>
            </button>

            <Link
              href="https://ko-fi.com/kevintrinh"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1 rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-1.5 text-[11px] font-semibold text-slate-100 hover:border-slate-500 hover:bg-slate-800"
            >
              <span aria-hidden="true">☕</span>
              <span>Support Us</span>
            </Link>

            <Link
              href="/privacy-legal"
              prefetch={false} // ✅
              className="inline-flex items-center justify-center gap-1 rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-1.5 text-[11px] font-semibold text-slate-100 hover:border-slate-500 hover:bg-slate-800"
            >
              <span aria-hidden="true">🛡️</span>
              <span>Privacy &amp; Legal</span>
            </Link>
          </div>

          <p className="text-[12px] text-slate-400">
            An unofficial UH student tool. Not affiliated with the University of
            Houston.
          </p>
          <p className="text-[12px] text-slate-400">
            Built by students, for students. Made by:{" "}
            <Link
              href="https://kevintrinh.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-red-300 transition-colors hover:text-red-200"
            >
              Kevin Huy Trinh
            </Link>
            .
          </p>

          <p className="text-[11px] text-slate-500">
            © {year}{" "}
            <Link
              href="https://github.com/coogplanner"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-white-300 transition-colors hover:text-red-200"
            >
              Coog Planner
            </Link>
            . All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
