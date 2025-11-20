// app/updates/page.tsx

import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import {
  getGithubOverview,
  type ReleaseSummary,
  type CommitSummary,
  type IssueSummary,
  type PullRequestSummary,
} from "@/lib/github";

export const metadata: Metadata = {
  title: "Updates & Changelog | Coog Planner",
  description:
    "See what's new in Coog Planner: feature updates, data refreshes, bug fixes, and recent GitHub activity.",
};

// Simple date formatter for human-readable dates
function formatDate(dateLike: string | null | undefined): string {
  if (!dateLike) return "Unknown date";
  const d = new Date(dateLike);
  if (Number.isNaN(d.getTime())) return "Unknown date";
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// Shorten commit message to first line
function formatCommitMessage(message: string): string {
  if (!message) return "";
  const firstLine = message.split("\n")[0].trim();
  return firstLine.length > 120 ? `${firstLine.slice(0, 117)}...` : firstLine;
}

// Truncate long text (for release body preview, etc.)
function truncate(text: string | null, length: number): string | null {
  if (!text) return null;
  if (text.length <= length) return text;
  return `${text.slice(0, length - 3)}...`;
}

// Build avatar URL from login if we don't have an explicit avatar
function fallbackAvatarForLogin(login: string | null | undefined, size = 64) {
  if (!login) return null;
  return `https://github.com/${login}.png?size=${size}`;
}

type Contributor = {
  login: string;
  displayName: string | null;
  avatarUrl: string | null;
  contributions: number;
  role: "Maintainer" | "Contributor";
};

// Build a contributor list from commits, issues, PRs
function buildContributors(
  ownerLogin: string,
  commits: CommitSummary[],
  issues: IssueSummary[],
  prs: PullRequestSummary[]
): Contributor[] {
  const map = new Map<string, Contributor>();

  const bump = (
    login: string | null,
    displayName: string | null,
    avatarUrl: string | null
  ) => {
    if (!login) return;
    const existing = map.get(login);
    if (existing) {
      existing.contributions += 1;
      if (!existing.avatarUrl && avatarUrl) existing.avatarUrl = avatarUrl;
      if (!existing.displayName && displayName)
        existing.displayName = displayName;
    } else {
      map.set(login, {
        login,
        displayName: displayName ?? login,
        avatarUrl: avatarUrl ?? fallbackAvatarForLogin(login, 80),
        contributions: 1,
        role: login === ownerLogin ? "Maintainer" : "Contributor",
      });
    }
  };

  // From commits
  for (const c of commits) {
    bump(
      c.authorLogin ?? null,
      c.authorName ?? null,
      c.authorAvatarUrl ?? null
    );
  }

  // From issues
  for (const issue of issues) {
    bump(
      (issue as any).authorLogin ?? null,
      (issue as any).authorLogin ?? null,
      (issue as any).authorAvatarUrl ??
        fallbackAvatarForLogin((issue as any).authorLogin, 80)
    );
  }

  // From PRs
  for (const pr of prs) {
    bump(
      (pr as any).authorLogin ?? null,
      (pr as any).authorLogin ?? null,
      (pr as any).authorAvatarUrl ??
        fallbackAvatarForLogin((pr as any).authorLogin, 80)
    );
  }

  // Ensure repo owner is present
  if (!map.has(ownerLogin)) {
    map.set(ownerLogin, {
      login: ownerLogin,
      displayName: ownerLogin,
      avatarUrl: fallbackAvatarForLogin(ownerLogin, 80),
      contributions: 0,
      role: "Maintainer",
    });
  }

  return Array.from(map.values())
    .sort((a, b) => b.contributions - a.contributions)
    .slice(0, 24); // keep top contributors
}

// Choose best ZIP download URL for a release
function getReleaseZipUrl(
  release: ReleaseSummary,
  owner: string,
  repo: string
): string {
  const anyAssets = (release as any).assets as
    | { name: string; browserDownloadUrl: string }[]
    | undefined;

  if (anyAssets && anyAssets.length > 0) {
    // Prefer a CoogPlanner-branded zip if present
    const preferred = anyAssets.find(
      (a) =>
        a.name.toLowerCase().includes("coogplanner") &&
        a.name.toLowerCase().endsWith(".zip")
    );

    const anyZip =
      preferred || anyAssets.find((a) => a.name.toLowerCase().endsWith(".zip"));

    if (anyZip) {
      return anyZip.browserDownloadUrl;
    }
  }

  // Fallback: default GitHub tag archive ZIP
  return `https://github.com/${owner}/${repo}/archive/refs/tags/${release.tagName}.zip`;
}

export default async function UpdatesPage() {
  const { github } = siteConfig;
  const owner = github.owner;
  const repo = github.repo;
  const repoUrl = `https://github.com/${owner}/${repo}`;

  const { meta, releases, commits, issues, pullRequests } =
    await getGithubOverview();

  const latestRelease: ReleaseSummary | undefined =
    releases && releases.length > 0 ? releases[0] : undefined;
  const latestCommit: CommitSummary | undefined =
    commits && commits.length > 0 ? commits[0] : undefined;

  const latestVersionTag =
    latestRelease?.tagName ?? meta?.latestTag ?? "Unversioned";
  const lastUpdated =
    latestCommit?.committedAt ?? latestRelease?.publishedAt ?? null;

  const contributors = buildContributors(owner, commits, issues, pullRequests);

  const latestReleaseDownloadUrl = latestRelease
    ? getReleaseZipUrl(latestRelease, owner, repo)
    : null;

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-10 lg:py-14">
      {/* Hero / Intro */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-lg sm:p-8">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-700/70 bg-slate-900/80 px-3 py-1 text-xs font-medium uppercase tracking-wide text-slate-300">
            <span className="text-sm" aria-hidden>
              📣
            </span>
            <span>Updates &amp; Changelog</span>
          </div>
          <p className="text-xs text-slate-400">
            Last updated:{" "}
            <span className="font-medium text-slate-200">
              {formatDate(lastUpdated)}
            </span>
          </p>
        </div>

        <h1 className="text-balance text-2xl font-semibold tracking-tight text-slate-50 sm:text-3xl">
          What&apos;s new in Coog Planner
        </h1>

        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-slate-300">
          This page shows a history of changes to Coog Planner, including new
          features, improvements, bug fixes, and data updates. It also pulls in
          live activity from the GitHub repository so you can see what&apos;s
          happening behind the scenes and who&apos;s contributing.
        </p>

        {/* Quick meta summary (3 consistent mini-cards) */}
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {/* Current version */}
          <div className="flex flex-col gap-1 rounded-xl border border-slate-800 bg-slate-950/60 p-3">
            <span className="inline-flex items-center gap-1 text-[0.7rem] font-semibold uppercase tracking-wide text-slate-400">
              <span aria-hidden>🏷️</span> Current version
            </span>
            <span className="font-mono text-sm text-slate-100">
              {latestVersionTag}
            </span>
            {latestRelease?.name && (
              <span className="text-[0.7rem] text-slate-400">
                {latestRelease.name}
              </span>
            )}
          </div>

          {/* Latest commit */}
          <div className="flex flex-col gap-1 rounded-xl border border-slate-800 bg-slate-950/60 p-3">
            <span className="inline-flex items-center gap-1 text-[0.7rem] font-semibold uppercase tracking-wide text-slate-400">
              <span aria-hidden>🧩</span> Latest commit
            </span>
            {latestCommit ? (
              <>
                <a
                  href={latestCommit.htmlUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="font-mono text-sm text-slate-100 underline underline-offset-2 transition-all duration-150 hover:-translate-y-0.5 hover:text-brand-light hover:shadow-sm focus-visible:outline-none focus-visible:ring focus-visible:ring-brand-light/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
                >
                  {latestCommit.shortSha}
                </a>
                <span className="text-[0.7rem] text-slate-400">
                  {formatCommitMessage(latestCommit.message)}
                </span>
              </>
            ) : (
              <span className="text-sm text-slate-400">Not available</span>
            )}
          </div>

          {/* Activity snapshot */}
          <div className="flex flex-col gap-1 rounded-xl border border-slate-800 bg-slate-950/60 p-3">
            <span className="inline-flex items-center gap-1 text-[0.7rem] font-semibold uppercase tracking-wide text-slate-400">
              <span aria-hidden>📂</span> GitHub activity
            </span>
            <span className="text-sm text-slate-200">
              {commits.length} recent commits
            </span>
            <span className="text-[0.75rem] text-slate-400">
              {releases.length} releases • {issues.length} issues •{" "}
              {pullRequests.length} PRs
            </span>
          </div>
        </div>
      </section>

      {/* Contributors / Collaborators */}
      <section className="space-y-4 rounded-2xl border border-slate-800 bg-slate-950/70 p-6 sm:p-8">
        <div className="flex items-start gap-3">
          <div className="mt-1 rounded-xl bg-slate-900/80 p-2 text-lg">
            <span aria-hidden>👥</span>
          </div>
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-slate-50 sm:text-xl">
              Developers &amp; collaborators
            </h2>
            <p className="mt-1 text-sm text-slate-300">
              Everyone who&apos;s contributed via commits, issues, and pull
              requests in the recent history of this repo. Make a PR or open an
              issue, and you&apos;ll show up here automatically.
            </p>
          </div>
        </div>

        {contributors.length === 0 ? (
          <p className="text-sm text-slate-400">
            No contributors found yet. Once someone opens issues, PRs, or pushes
            commits to this repo, they&apos;ll appear here.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {contributors.map((contributor) => (
              <a
                key={contributor.login}
                href={`https://github.com/${contributor.login}`}
                target="_blank"
                rel="noreferrer"
                className="group flex flex-col items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/80 p-4 text-center text-xs text-slate-200 transition-all duration-150 hover:-translate-y-1 hover:border-brand-light/70 hover:text-brand-light hover:shadow-lg focus-visible:outline-none focus-visible:ring focus-visible:ring-brand-light/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
              >
                <div className="relative h-16 w-16 overflow-hidden rounded-2xl border border-slate-700 bg-slate-800">
                  {contributor.avatarUrl ? (
                    <img
                      src={contributor.avatarUrl}
                      alt={contributor.displayName ?? contributor.login}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-lg">
                      <span aria-hidden>👤</span>
                    </div>
                  )}
                </div>
                <div className="space-y-0.5">
                  <p className="font-semibold text-slate-100 group-hover:text-brand-light">
                    @{contributor.login}
                  </p>
                  <p className="text-[0.7rem] text-slate-400">
                    {contributor.role}
                  </p>
                </div>
              </a>
            ))}
          </div>
        )}
      </section>

      {/* Latest release highlight (if any) */}
      {latestRelease && (
        <section className="space-y-4 rounded-2xl border border-slate-800 bg-slate-950/70 p-6 sm:p-8">
          <div className="flex items-start gap-3">
            <div className="mt-1 rounded-xl bg-slate-900/80 p-2 text-lg">
              <span aria-hidden>✨</span>
            </div>
            <div className="flex flex-1 flex-col gap-2">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold tracking-tight text-slate-50 sm:text-xl">
                    Latest release:{" "}
                    {latestRelease.name || latestRelease.tagName}
                  </h2>
                  <p className="mt-1 text-xs text-slate-400">
                    Tag:{" "}
                    <span className="font-mono text-slate-100">
                      {latestRelease.tagName}
                    </span>{" "}
                    • Published {formatDate(latestRelease.publishedAt)}
                  </p>
                </div>
                {(latestRelease as any).authorLogin && (
                  <a
                    href={`https://github.com/${
                      (latestRelease as any).authorLogin
                    }`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/80 px-3 py-1 text-xs font-medium text-slate-100 transition-all duration-150 hover:-translate-y-0.5 hover:border-brand-light/80 hover:text-brand-light hover:shadow-md focus-visible:outline-none focus-visible:ring focus-visible:ring-brand-light/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
                  >
                    <div className="h-9 w-9 overflow-hidden rounded-2xl border border-slate-700 bg-slate-800">
                      {(latestRelease as any).authorAvatarUrl ? (
                        <img
                          src={(latestRelease as any).authorAvatarUrl}
                          alt={(latestRelease as any).authorLogin}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-sm">
                          <span aria-hidden>👤</span>
                        </div>
                      )}
                    </div>
                    <span className="text-xs">
                      By @{(latestRelease as any).authorLogin}
                    </span>
                  </a>
                )}
              </div>
            </div>
          </div>

          {latestRelease.body && (
            <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 text-sm leading-relaxed text-slate-200">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                Release notes
              </p>
              <pre className="whitespace-pre-wrap text-xs sm:text-sm">
                {truncate(latestRelease.body, 1200)}
              </pre>
            </div>
          )}

          {/* Buttons: view releases, view this release, download ZIP */}
          <div className="flex flex-wrap gap-3 text-xs sm:text-sm">
            <a
              href={`${repoUrl}/releases`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/80 px-4 py-2 font-medium text-slate-100 transition-all duration-150 hover:-translate-y-0.5 hover:border-brand-light/80 hover:text-brand-light hover:shadow-md focus-visible:outline-none focus-visible:ring focus-visible:ring-brand-light/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
            >
              <span aria-hidden>👀</span>
              <span>View latest releases</span>
            </a>

            <a
              href={latestRelease.htmlUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/80 px-4 py-2 font-medium text-slate-100 transition-all duration-150 hover:-translate-y-0.5 hover:border-brand-light/80 hover:text-brand-light hover:shadow-md focus-visible:outline-none focus-visible:ring focus-visible:ring-brand-light/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
            >
              <span aria-hidden>🔗</span>
              <span>View release {latestRelease.tagName}</span>
            </a>

            {latestReleaseDownloadUrl && (
              <a
                href={latestReleaseDownloadUrl}
                download
                className="inline-flex items-center gap-2 rounded-full border border-emerald-500/60 bg-emerald-500/10 px-4 py-2 font-medium text-emerald-200 transition-all duration-150 hover:-translate-y-0.5 hover:border-emerald-400 hover:text-emerald-50 hover:shadow-md focus-visible:outline-none focus-visible:ring focus-visible:ring-emerald-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
              >
                <span aria-hidden>⬇️</span>
                <span>Download {latestRelease.tagName} ZIP</span>
              </a>
            )}
          </div>
        </section>
      )}

      {/* Releases timeline */}
      <section className="space-y-6 rounded-2xl border border-slate-800 bg-slate-950/60 p-6 sm:p-8">
        <div className="flex items-start gap-3">
          <div className="mt-1 rounded-xl bg-slate-900/80 p-2 text-lg">
            <span aria-hidden>📦</span>
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold tracking-tight text-slate-50 sm:text-xl">
              Releases
            </h2>
            <p className="mt-1 text-sm text-slate-300">
              Tagged versions of Coog Planner, pulled directly from GitHub
              releases.
            </p>
          </div>
          <a
            href={`${repoUrl}/releases`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 rounded-full border border-slate-700 bg-slate-900/80 px-3 py-1 text-[0.7rem] font-medium uppercase tracking-wide text-slate-100 transition-all duration-150 hover:-translate-y-0.5 hover:border-brand-light/80 hover:text-brand-light hover:shadow-md focus-visible:outline-none focus-visible:ring focus-visible:ring-brand-light/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
          >
            <span aria-hidden>👀</span>
            <span>View all on GitHub</span>
          </a>
        </div>

        {releases.length === 0 ? (
          <p className="text-sm text-slate-400">
            No releases found yet. Once the repository has tagged releases,
            they&apos;ll show up here.
          </p>
        ) : (
          <div className="max-h-[520px] space-y-4 overflow-y-auto pr-1">
            {releases.map((release) => (
              <article
                key={release.id}
                className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 text-sm text-slate-200"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {(release as any).authorLogin && (
                      <a
                        href={`https://github.com/${
                          (release as any).authorLogin
                        }`}
                        target="_blank"
                        rel="noreferrer"
                        className="h-10 w-10 overflow-hidden rounded-2xl border border-slate-700 bg-slate-800 transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md"
                      >
                        {(release as any).authorAvatarUrl ? (
                          <img
                            src={(release as any).authorAvatarUrl}
                            alt={(release as any).authorLogin}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-sm">
                            <span aria-hidden>👤</span>
                          </div>
                        )}
                      </a>
                    )}
                    <div>
                      <h3 className="text-sm font-semibold text-slate-50 sm:text-base">
                        {release.name || release.tagName}
                      </h3>
                      <p className="text-xs text-slate-400">
                        Tag:{" "}
                        <span className="font-mono text-slate-100">
                          {release.tagName}
                        </span>{" "}
                        • {formatDate(release.publishedAt)}
                      </p>
                      {(release as any).authorLogin && (
                        <p className="text-[0.7rem] text-slate-400">
                          By @{(release as any).authorLogin}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    {release.draft && (
                      <span className="rounded-full bg-slate-800 px-2 py-1 text-[0.7rem] font-medium uppercase tracking-wide text-slate-300">
                        Draft
                      </span>
                    )}
                    {release.prerelease && (
                      <span className="rounded-full bg-slate-800 px-2 py-1 text-[0.7rem] font-medium uppercase tracking-wide text-amber-300">
                        Pre-release
                      </span>
                    )}
                    <a
                      href={release.htmlUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 rounded-full border border-slate-700 bg-slate-950 px-3 py-1 text-[0.7rem] font-medium uppercase tracking-wide text-slate-100 transition-all duration-150 hover:-translate-y-0.5 hover:border-brand-light/80 hover:text-brand-light hover:shadow-md focus-visible:outline-none focus-visible:ring focus-visible:ring-brand-light/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
                    >
                      <span aria-hidden>🔗</span>
                      <span>Details</span>
                    </a>
                  </div>
                </div>

                {release.body && (
                  <p className="mt-3 text-xs leading-relaxed text-slate-300">
                    {truncate(release.body, 280)}
                  </p>
                )}
              </article>
            ))}
          </div>
        )}
      </section>

      {/* GitHub activity: commits, issues, PRs */}
      <section className="space-y-6 rounded-2xl border border-slate-800 bg-slate-950/60 p-6 sm:p-8">
        <div className="flex items-start gap-3">
          <div className="mt-1 rounded-xl bg-slate-900/80 p-2 text-lg">
            <span aria-hidden>🛠️</span>
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold tracking-tight text-slate-50 sm:text-xl">
              Recent GitHub activity
            </h2>
            <p className="mt-1 text-sm text-slate-300">
              A quick view of what&apos;s happening in the Coog Planner GitHub
              repo: commits, issues, and pull requests.
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {/* Commits */}
          <div className="flex flex-col gap-3 rounded-xl border border-slate-800 bg-slate-900/80 p-4">
            <div className="flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
                <span aria-hidden>🧩</span> Commits
              </span>
              <a
                href={`${repoUrl}/commits`}
                target="_blank"
                rel="noreferrer"
                className="text-[0.7rem] text-slate-400 underline underline-offset-2 transition-all duration-150 hover:-translate-y-0.5 hover:text-brand-light hover:shadow-sm"
              >
                View all
              </a>
            </div>
            {commits.length === 0 ? (
              <p className="text-xs text-slate-500">
                No commits found. Once the repository has commits, they&apos;ll
                appear here.
              </p>
            ) : (
              <ul className="max-h-80 space-y-2 overflow-y-auto pr-1 text-xs">
                {commits.map((commit) => (
                  <li
                    key={commit.sha}
                    className="space-y-0.5 rounded-lg border border-slate-800/70 bg-slate-950/60 p-2"
                  >
                    <div className="flex items-center gap-2">
                      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-slate-700 bg-slate-800">
                        {commit.authorAvatarUrl ? (
                          <img
                            src={commit.authorAvatarUrl}
                            alt={commit.authorName ?? "Commit author"}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span className="text-sm" aria-hidden>
                            👤
                          </span>
                        )}
                      </div>
                      <div className="flex-1 space-y-0.5">
                        <div className="flex items-center justify-between gap-2">
                          <a
                            href={commit.htmlUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="font-mono text-[0.7rem] text-brand-light underline underline-offset-2 transition-all duration-150 hover:-translate-y-0.5 hover:shadow-sm"
                          >
                            {commit.shortSha}
                          </a>
                          <span className="text-[0.65rem] text-slate-500">
                            {formatDate(commit.committedAt)}
                          </span>
                        </div>
                        <p className="text-[0.7rem] text-slate-200">
                          {formatCommitMessage(commit.message)}
                        </p>
                        <p className="text-[0.65rem] text-slate-500">
                          {commit.authorLogin
                            ? `@${commit.authorLogin}`
                            : commit.authorName || "Unknown author"}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Issues */}
          <div className="flex flex-col gap-3 rounded-xl border border-slate-800 bg-slate-900/80 p-4">
            <div className="flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
                <span aria-hidden>🐞</span> Issues
              </span>
              <a
                href={`${repoUrl}/issues`}
                target="_blank"
                rel="noreferrer"
                className="text-[0.7rem] text-slate-400 underline underline-offset-2 transition-all duration-150 hover:-translate-y-0.5 hover:text-brand-light hover:shadow-sm"
              >
                View all
              </a>
            </div>
            {issues.length === 0 ? (
              <p className="text-xs text-slate-500">
                No issues found yet. When bugs or feature requests are logged on
                GitHub, they&apos;ll show up here.
              </p>
            ) : (
              <ul className="max-h-80 space-y-2 overflow-y-auto pr-1 text-xs">
                {issues.map((issue: IssueSummary) => (
                  <li
                    key={issue.id}
                    className="space-y-0.5 rounded-lg border border-slate-800/70 bg-slate-950/60 p-2"
                  >
                    <div className="flex items-center gap-2">
                      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-slate-700 bg-slate-800">
                        {(issue as any).authorAvatarUrl || issue.authorLogin ? (
                          <img
                            src={
                              (issue as any).authorAvatarUrl ??
                              fallbackAvatarForLogin(issue.authorLogin, 64) ??
                              ""
                            }
                            alt={issue.authorLogin ?? "Issue author"}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span className="text-sm" aria-hidden>
                            👤
                          </span>
                        )}
                      </div>
                      <div className="flex-1 space-y-0.5">
                        <div className="flex items-center justify-between gap-2">
                          <a
                            href={issue.htmlUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[0.7rem] font-semibold text-slate-100 underline underline-offset-2 transition-all duration-150 hover:-translate-y-0.5 hover:text-brand-light hover:shadow-sm"
                          >
                            #{issue.number} {issue.title}
                          </a>
                          <span
                            className={`rounded-full px-2 py-0.5 text-[0.6rem] font-semibold uppercase tracking-wide ${
                              issue.state === "open"
                                ? "bg-emerald-500/10 text-emerald-300"
                                : "bg-slate-700 text-slate-200"
                            }`}
                          >
                            {issue.state}
                          </span>
                        </div>
                        <p className="text-[0.65rem] text-slate-500">
                          {issue.authorLogin
                            ? `@${issue.authorLogin}`
                            : "Unknown author"}{" "}
                          • {formatDate(issue.createdAt)}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Pull requests */}
          <div className="flex flex-col gap-3 rounded-xl border border-slate-800 bg-slate-900/80 p-4">
            <div className="flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
                <span aria-hidden>🔀</span> Pull requests
              </span>
              <a
                href={`${repoUrl}/pulls`}
                target="_blank"
                rel="noreferrer"
                className="text-[0.7rem] text-slate-400 underline underline-offset-2 transition-all duration-150 hover:-translate-y-0.5 hover:text-brand-light hover:shadow-sm"
              >
                View all
              </a>
            </div>
            {pullRequests.length === 0 ? (
              <p className="text-xs text-slate-500">
                No pull requests found. Once PRs are opened or merged,
                they&apos;ll appear here.
              </p>
            ) : (
              <ul className="max-h-80 space-y-2 overflow-y-auto pr-1 text-xs">
                {pullRequests.map((pr: PullRequestSummary) => (
                  <li
                    key={pr.id}
                    className="space-y-0.5 rounded-lg border border-slate-800/70 bg-slate-950/60 p-2"
                  >
                    <div className="flex items-center gap-2">
                      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-slate-700 bg-slate-800">
                        {(pr as any).authorAvatarUrl || pr.authorLogin ? (
                          <img
                            src={
                              (pr as any).authorAvatarUrl ??
                              fallbackAvatarForLogin(pr.authorLogin, 64) ??
                              ""
                            }
                            alt={pr.authorLogin ?? "PR author"}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span className="text-sm" aria-hidden>
                            👤
                          </span>
                        )}
                      </div>
                      <div className="flex-1 space-y-0.5">
                        <div className="flex items-center justify-between gap-2">
                          <a
                            href={pr.htmlUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[0.7rem] font-semibold text-slate-100 underline underline-offset-2 transition-all duration-150 hover:-translate-y-0.5 hover:text-brand-light hover:shadow-sm"
                          >
                            #{pr.number} {pr.title}
                          </a>
                          <div className="flex items-center gap-1">
                            {pr.draft && (
                              <span className="rounded-full bg-slate-700 px-2 py-0.5 text-[0.6rem] font-semibold uppercase tracking-wide text-slate-200">
                                Draft
                              </span>
                            )}
                            <span
                              className={`rounded-full px-2 py-0.5 text-[0.6rem] font-semibold uppercase tracking-wide ${
                                pr.mergedAt
                                  ? "bg-purple-500/15 text-purple-200"
                                  : pr.state === "open"
                                  ? "bg-emerald-500/10 text-emerald-300"
                                  : "bg-slate-700 text-slate-200"
                              }`}
                            >
                              {pr.mergedAt
                                ? "Merged"
                                : pr.state === "open"
                                ? "Open"
                                : "Closed"}
                            </span>
                          </div>
                        </div>
                        <p className="text-[0.65rem] text-slate-500">
                          {pr.authorLogin
                            ? `@${pr.authorLogin}`
                            : "Unknown author"}{" "}
                          • {formatDate(pr.createdAt)}
                        </p>
                        {pr.baseBranch && pr.headBranch && (
                          <p className="text-[0.65rem] text-slate-500">
                            base:{" "}
                            <span className="font-mono">{pr.baseBranch}</span> •
                            head:{" "}
                            <span className="font-mono">{pr.headBranch}</span>
                          </p>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>

      {/* Feedback / contribution note */}
      <section className="rounded-2xl border border-slate-800 bg-slate-950/80 p-5 text-sm text-slate-300 sm:p-6">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
          💬 Feedback, bugs &amp; contributions
        </h3>
        <p className="mt-2 text-sm text-slate-300">
          If you notice anything odd after a new update (missing course, weird
          requirement, buggy behavior, or a feature idea),{" "}
          <a
            href={`${repoUrl}/issues/new/choose`}
            target="_blank"
            rel="noreferrer"
            className="font-medium text-brand-light underline underline-offset-2 transition-all duration-150 hover:-translate-y-0.5 hover:text-brand-light hover:shadow-sm"
          >
            please open an issue on GitHub
          </a>{" "}
          or, if you already have a fix in mind,{" "}
          <a
            href={`${repoUrl}/compare`}
            target="_blank"
            rel="noreferrer"
            className="font-medium text-brand-light underline underline-offset-2 transition-all duration-150 hover:-translate-y-0.5 hover:text-brand-light hover:shadow-sm"
          >
            submit a pull request
          </a>
          .
        </p>
        <p className="mt-2 text-sm text-slate-300">
          I strongly encourage contributions — new features, bug fixes, or
          documentation improvements. When you open a PR or issue, your GitHub
          avatar and profile will show up in the collaborators section above and
          in the activity feed, so you&apos;ll be visible both on the repo and
          on this site.
        </p>

        {/* Buttons row */}
        <div className="mt-4 flex flex-wrap gap-3 text-xs sm:text-sm">
          <a
            href={repoUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/80 px-4 py-2 font-medium text-slate-100 transition-all duration-150 hover:-translate-y-0.5 hover:border-brand-light/80 hover:text-brand-light hover:shadow-md focus-visible:outline-none focus-visible:ring focus-visible:ring-brand-light/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
          >
            <span aria-hidden>📁</span>
            <span>Open repo</span>
          </a>
          <a
            href={`${repoUrl}/issues`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/80 px-4 py-2 font-medium text-slate-100 transition-all duration-150 hover:-translate-y-0.5 hover:border-brand-light/80 hover:text-brand-light hover:shadow-md focus-visible:outline-none focus-visible:ring focus-visible:ring-brand-light/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
          >
            <span aria-hidden>🐞</span>
            <span>View issues</span>
          </a>
          <a
            href={`${repoUrl}/issues/new/choose`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/80 px-4 py-2 font-medium text-slate-100 transition-all duration-150 hover:-translate-y-0.5 hover:border-brand-light/80 hover:text-brand-light hover:shadow-md focus-visible:outline-none focus-visible:ring focus-visible:ring-brand-light/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
          >
            <span aria-hidden>➕</span>
            <span>Open new issue</span>
          </a>
          <a
            href={`${repoUrl}/pulls`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/80 px-4 py-2 font-medium text-slate-100 transition-all duration-150 hover:-translate-y-0.5 hover:border-brand-light/80 hover:text-brand-light hover:shadow-md focus-visible:outline-none focus-visible:ring focus-visible:ring-brand-light/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
          >
            <span aria-hidden>🔀</span>
            <span>View pull requests</span>
          </a>
        </div>
      </section>
    </div>
  );
}
