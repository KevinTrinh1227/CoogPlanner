// components/Footer.tsx
import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { getRepoMeta } from "@/lib/github";
import Tooltip from "@/components/Tooltip";

export default async function Footer() {
  const repoMeta = await getRepoMeta();

  const shortSha = repoMeta?.latestCommitSha?.slice(0, 7).toLowerCase() ?? "-";
  const version = repoMeta?.latestTag ?? "v0.0.0-dev";

  const githubRepoUrl = `https://github.com/${siteConfig.github.owner}/${siteConfig.github.repo}`;
  const githubIssuesUrl = `${githubRepoUrl}/issues`;

  return (
    <footer className="border-t border-slate-800 bg-slate-950/90">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-6 text-[12px] text-slate-400 text-center md:flex-row md:items-start md:justify-between md:text-left">
        {/* Left: logo + git info + UH data + source/report buttons */}
        <div className="space-y-2 md:text-left">
          {/* Logo + domain */}
          <Link
            href="/"
            className="flex items-center justify-center gap-2 text-slate-50 hover:text-slate-100 md:justify-start"
          >
            <Image
              src="/logo.png"
              alt={`${siteConfig.name} logo`}
              width={22}
              height={22}
              className="h-6 w-6 rounded-md"
            />
            <span className="text-base font-semibold tracking-tight">
              {siteConfig.domain}
            </span>
          </Link>

          <p>
            Latest Git commit:{" "}
            {repoMeta?.latestCommitUrl ? (
              <Link
                href={repoMeta.latestCommitUrl}
                target="_blank"
                className="font-semibold text-red-300 underline underline-offset-2 hover:text-red-200"
              >
                {shortSha}
              </Link>
            ) : (
              <span className="font-semibold text-red-300 underline underline-offset-2">
                {shortSha}
              </span>
            )}
          </p>

          <p>
            Latest version tag:{" "}
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

          {/* Web source + Report issues buttons */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-1 md:justify-start">
            <Link
              href={githubRepoUrl}
              target="_blank"
              className="inline-flex items-center justify-center gap-1 rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-1.5 text-[11px] font-semibold text-slate-100 hover:border-slate-500 hover:bg-slate-800"
            >
              {/* GitHub icon */}
              <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
                <path
                  d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.38 7.86 10.9.58.11.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.69-3.88-1.54-3.88-1.54-.53-1.34-1.3-1.7-1.3-1.7-1.06-.73.08-.72.08-.72 1.17.08 1.78 1.21 1.78 1.21 1.04 1.77 2.73 1.26 3.4.96.11-.76.41-1.26.75-1.55-2.55-.29-5.23-1.28-5.23-5.71 0-1.26.45-2.29 1.2-3.1-.12-.3-.52-1.52.11-3.18 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.66.23 2.88.11 3.18.75.81 1.2 1.84 1.2 3.1 0 4.44-2.68 5.41-5.24 5.69.42.36.8 1.08.8 2.18 0 1.57-.02 2.84-.02 3.22 0 .31.21.68.8.56A10.52 10.52 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z"
                  fill="currentColor"
                />
              </svg>
              <span>Web Source</span>
            </Link>

            <Link
              href={githubIssuesUrl}
              target="_blank"
              className="inline-flex items-center justify-center gap-1 rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-1.5 text-[11px] font-semibold text-slate-100 hover:border-slate-500 hover:bg-slate-800"
            >
              {/* Report icon (filled chat bubble with ! ) */}
              <svg viewBox="0 0 20 20" aria-hidden="true" className="h-4 w-4">
                <path
                  d="M4 3.5h12a1.5 1.5 0 0 1 1.5 1.5v7.25A1.75 1.75 0 0 1 15.75 14H11l-3.25 2.6A.75.75 0 0 1 6 16v-2H4A1.5 1.5 0 0 1 2.5 12.5v-7A2 2 0 0 1 4 3.5Zm6 3a.75.75 0 0 0-.75.75v2.5a.75.75 0 1 0 1.5 0v-2.5A.75.75 0 0 0 10 6.5Zm0 5a.9.9 0 1 0 0 1.8.9.9 0 0 0 0-1.8Z"
                  fill="currentColor"
                />
              </svg>
              <span>Report issues</span>
            </Link>
          </div>
        </div>

        {/* Right: share/legal buttons, messages, built by */}
        <div className="space-y-2 md:text-right">
          {/* Share + legal buttons */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-1 md:justify-end">
            <button
              type="button"
              className="inline-flex items-center justify-center gap-1 rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-1.5 text-[11px] font-semibold text-slate-100 hover:border-slate-500 hover:bg-slate-800"
            >
              {/* Share icon (filled) */}
              <svg viewBox="0 0 20 20" aria-hidden="true" className="h-4 w-4">
                <path
                  d="M14.5 3.5a2.5 2.5 0 0 0-2.47 2.12L7.9 7.9a2.5 2.5 0 1 0 0 4.2l4.13 2.28A2.5 2.5 0 1 0 13 12.5l-4.14-2.28a2.52 2.52 0 0 0 .02-.44c0-.16-.01-.3-.04-.44L13 7.06A2.5 2.5 0 1 0 14.5 3.5Z"
                  fill="currentColor"
                />
              </svg>
              <span>Share</span>
            </button>

            <button
              type="button"
              className="inline-flex items-center justify-center gap-1 rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-1.5 text-[11px] font-semibold text-slate-100 hover:border-slate-500 hover:bg-slate-800"
            >
              {/* Shield icon: outlined, left half white */}
              <svg viewBox="0 0 20 20" aria-hidden="true" className="h-4 w-4">
                <defs>
                  <clipPath id="shield-clip-coog">
                    <path d="M10 2.25 4 4.5v5.55c0 3.14 2.03 5.98 5 7.2 2.97-1.22 5-4.06 5-7.2V4.5L10 2.25Z" />
                  </clipPath>
                </defs>
                {/* Left half filled white */}
                <rect
                  x="3.5"
                  y="2.5"
                  width="7"
                  height="15"
                  fill="white"
                  clipPath="url(#shield-clip-coog)"
                />
                {/* Shield outline */}
                <path
                  d="M10 2.25 4 4.5v5.55c0 3.14 2.03 5.98 5 7.2 2.97-1.22 5-4.06 5-7.2V4.5L10 2.25Z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  strokeLinejoin="round"
                />
              </svg>
              <span>Notice &amp; Liability</span>
            </button>
          </div>

          {/* Messages */}
          <p className="text-[12px] text-slate-400">
            Unofficial tool built by UH students. Not affiliated with the
            University of Houston.
          </p>
          <p className="text-[12px] text-slate-400">
            Help share this with other UH students!
          </p>

          {/* Built by */}
          <p className="text-[13px] font-semibold text-slate-400">
            Built by{" "}
            <Link
              href="https://kevintrinh.dev"
              target="_blank"
              className="text-red-300 underline underline-offset-2 hover:text-red-200"
            >
              Kevin Huy Trinh
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
