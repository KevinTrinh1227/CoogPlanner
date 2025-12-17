// lib/github.ts
/**
 * GitHub API helpers for CoogPlanner.
 *
 * - Fetches repo metadata, commits, releases, issues, and PRs for the configured repo.
 * - Uses only public GitHub endpoints by default (no token required).
 * - Optionally reads GITHUB_TOKEN (server-side) for higher rate limits.
 * - Designed for use in Next.js server components / route handlers with `next.revalidate`.
 */

import { cache } from "react";
import { siteConfig } from "@/config/site";

const GITHUB_API_BASE = "https://api.github.com";
// Rarely-changing data (tags, releases, basic meta)
const GITHUB_DEFAULT_REVALIDATE = 60 * 60 * 6; // 6 hours

// Somewhat dynamic data (commits, issues, PRs)
const GITHUB_FAST_REVALIDATE = 60 * 60; // 1 hour

// Prevent spamming the console with the same meta error over and over
let hasLoggedRepoMetaError = false;
let hasLoggedRateLimitWarning = false;

export type RepoMeta = {
  latestCommitSha: string | null;
  latestCommitUrl: string | null;
  latestTag: string | null;
};

export type CommitSummary = {
  sha: string;
  shortSha: string;
  message: string;
  authorName: string | null;
  authorLogin: string | null;
  authorAvatarUrl: string | null;
  htmlUrl: string;
  committedAt: string; // ISO string
};

export type ReleaseSummary = {
  id: number;
  name: string | null;
  tagName: string;
  body: string | null;
  htmlUrl: string;
  draft: boolean;
  prerelease: boolean;
  publishedAt: string | null; // ISO
};

export type IssueSummary = {
  id: number;
  number: number;
  title: string;
  htmlUrl: string;
  state: "open" | "closed";
  labels: { name: string; color: string }[];
  authorLogin: string | null;
  createdAt: string; // ISO
  updatedAt: string; // ISO
  closedAt: string | null; // ISO
};

export type PullRequestSummary = {
  id: number;
  number: number;
  title: string;
  htmlUrl: string;
  state: "open" | "closed";
  draft: boolean;
  authorLogin: string | null;
  createdAt: string;
  updatedAt: string;
  mergedAt: string | null;
  baseBranch: string | null;
  headBranch: string | null;
};

/**
 * Build headers for GitHub API requests.
 * - Always sends Accept + User-Agent.
 * - Uses GITHUB_TOKEN if present, but it's completely optional.
 */
function getGithubHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    // GitHub recommends setting a User-Agent, especially from server/worker environments.
    // TODO: update URL to your actual repo.
    "User-Agent": "coog-planner (https://github.com/your-username/your-repo)",
  };

  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  return headers;
}

/**
 * Lightweight wrapper around fetch for GitHub API.
 * - Returns `null` on any error or non-2xx response.
 * - Uses Next.js `next.revalidate` hint for ISR.
 * - Logs rate-limit errors more clearly, but only once.
 */
async function githubFetch<T>(
  path: string,
  options?: {
    revalidate?: number;
  }
): Promise<T | null> {
  const { owner, repo } = siteConfig.github;
  const revalidate = options?.revalidate ?? GITHUB_DEFAULT_REVALIDATE;

  try {
    const res = await fetch(
      `${GITHUB_API_BASE}/repos/${owner}/${repo}${path}`,
      {
        headers: getGithubHeaders(),
        next: { revalidate },
      }
    );

    if (!res.ok) {
      if (res.status === 403) {
        const remaining = res.headers.get("X-RateLimit-Remaining");
        const reset = res.headers.get("X-RateLimit-Reset");

        if (!hasLoggedRateLimitWarning) {
          hasLoggedRateLimitWarning = true;

          let resetTime = "unknown";
          if (reset && !Number.isNaN(Number(reset))) {
            const resetDate = new Date(Number(reset) * 1000);
            resetTime = resetDate.toISOString();
          }

          console.warn(
            `GitHub API rate limit hit for ${path}. X-RateLimit-Remaining=${remaining}. ` +
              `Requests may fail until approximately ${resetTime}.`
          );
        }
      } else {
        console.warn(`GitHub API error (${path}):`, res.status, res.statusText);
      }
      return null;
    }

    const json = (await res.json()) as T;
    return json;
  } catch (err) {
    console.error(`Error calling GitHub API (${path})`, err);
    return null;
  }
}

/**
 * In-memory cache for RepoMeta so we don't hammer GitHub on every request.
 * This lives for the lifetime of the Node / worker process.
 */
let cachedRepoMeta: RepoMeta | null = null;
let cachedRepoMetaFetchedAt: number | null = null;
// Use the same window as our default revalidate (in seconds -> ms)
const REPO_META_TTL_MS = GITHUB_DEFAULT_REVALIDATE * 1000;

/**
 * Actual GitHub calls for repo meta (no in-memory cache).
 */
async function fetchRepoMetaFresh(): Promise<RepoMeta | null> {
  // Optional dev guard: if you're in dev and don't care about live meta,
  // you can short-circuit here to avoid rate limit:
  // if (process.env.NODE_ENV === "development" && !process.env.GITHUB_TOKEN) {
  //   if (!hasLoggedRepoMetaError) {
  //     console.warn(
  //       "Skipping GitHub meta fetch in development because GITHUB_TOKEN is not set."
  //     );
  //     hasLoggedRepoMetaError = true;
  //   }
  //   return null;
  // }

  const [commits, tags] = await Promise.all([
    githubFetch<any[]>(`/commits?per_page=1`, {
      revalidate: GITHUB_DEFAULT_REVALIDATE,
    }),
    githubFetch<any[]>(`/tags?per_page=1`, {
      revalidate: GITHUB_DEFAULT_REVALIDATE,
    }),
  ]);

  if (!commits && !tags) {
    if (!hasLoggedRepoMetaError) {
      console.error(
        "GitHub repo meta: both commits and tags requests failed (see earlier GitHub API warnings for details)"
      );
      hasLoggedRepoMetaError = true;
    }
    return null;
  }

  const latestCommit = commits?.[0];
  const latestTagObj = tags?.[0];

  const latestCommitSha: string | null = latestCommit?.sha ?? null;
  const latestCommitUrl: string | null = latestCommit?.html_url ?? null;
  const latestTag: string | null = latestTagObj?.name ?? null;

  return {
    latestCommitSha,
    latestCommitUrl,
    latestTag,
  };
}

/**
 * Basic repo meta:
 * - Latest commit SHA + URL
 * - Latest tag name
 *
 * Now with:
 * - In-memory TTL caching (so we don't hit GitHub every request)
 * - If GitHub fails but we have a cached value, we keep returning the cached value.
 */
export async function getRepoMeta(): Promise<RepoMeta | null> {
  const now = Date.now();

  if (
    cachedRepoMeta &&
    cachedRepoMetaFetchedAt &&
    now - cachedRepoMetaFetchedAt < REPO_META_TTL_MS
  ) {
    // Within TTL: just return what we already have.
    return cachedRepoMeta;
  }

  const fresh = await fetchRepoMetaFresh();

  if (fresh) {
    cachedRepoMeta = fresh;
    cachedRepoMetaFetchedAt = now;
    return fresh;
  }

  // If the new fetch failed but we have an older cached value, keep using it.
  if (cachedRepoMeta) {
    return cachedRepoMeta;
  }

  // No cached value and fetch failed: caller should handle null.
  return null;
}

/**
 * React-memoized version of getRepoMeta for server components.
 * - Within a single render tree, repeated calls to getRepoMetaCached()
 *   will reuse the same promise/value.
 */
export const getRepoMetaCached = cache(getRepoMeta);

/**
 * Recent commits, for changelog / "Latest activity" sections.
 * Default: last 10 commits.
 */
export async function getRecentCommits(limit = 10): Promise<CommitSummary[]> {
  const safeLimit = Math.max(1, Math.min(limit, 100)); // GitHub max per_page=100

  const data = await githubFetch<any[]>(`/commits?per_page=${safeLimit}`, {
    revalidate: GITHUB_FAST_REVALIDATE,
  });

  if (!data) return [];

  return data.map((c) => {
    const sha: string = c.sha;
    const shortSha = sha ? sha.slice(0, 7) : "";
    const message: string = c.commit?.message ?? "";
    const authorName: string | null =
      c.commit?.author?.name ?? c.author?.login ?? null;
    const authorLogin: string | null = c.author?.login ?? null;
    const authorAvatarUrl: string | null = c.author?.avatar_url ?? null;
    const htmlUrl: string = c.html_url;
    const committedAt: string =
      c.commit?.author?.date ?? c.commit?.committer?.date ?? "";

    return {
      sha,
      shortSha,
      message,
      authorName,
      authorLogin,
      authorAvatarUrl,
      htmlUrl,
      committedAt,
    };
  });
}

/**
 * Releases (tagged versions), useful for your Updates page.
 * Default: last 10 releases.
 */
export async function getReleases(limit = 10): Promise<ReleaseSummary[]> {
  const safeLimit = Math.max(1, Math.min(limit, 100));

  const data = await githubFetch<any[]>(`/releases?per_page=${safeLimit}`, {
    revalidate: GITHUB_DEFAULT_REVALIDATE,
  });

  if (!data) return [];

  return data.map((r) => ({
    id: r.id,
    name: r.name ?? null,
    tagName: r.tag_name,
    body: r.body ?? null,
    htmlUrl: r.html_url,
    draft: Boolean(r.draft),
    prerelease: Boolean(r.prerelease),
    publishedAt: r.published_at ?? null,
  }));
}

/**
 * Recent issues (NOT including pull requests).
 * You can control state ("open" | "closed" | "all").
 */
export async function getRecentIssues(options?: {
  limit?: number;
  state?: "open" | "closed" | "all";
}): Promise<IssueSummary[]> {
  const limit = options?.limit ?? 10;
  const state = options?.state ?? "open";
  const safeLimit = Math.max(1, Math.min(limit, 100));

  const data = await githubFetch<any[]>(
    `/issues?state=${state}&per_page=${safeLimit}`,
    { revalidate: GITHUB_FAST_REVALIDATE }
  );

  if (!data) return [];

  // GitHub "issues" endpoint includes PRs; filter those out
  const issuesOnly = data.filter((item) => !item.pull_request);

  return issuesOnly.map((i) => ({
    id: i.id,
    number: i.number,
    title: i.title,
    htmlUrl: i.html_url,
    state: i.state,
    labels: Array.isArray(i.labels)
      ? i.labels.map((label: any) => ({
          name: label.name,
          color: label.color,
        }))
      : [],
    authorLogin: i.user?.login ?? null,
    createdAt: i.created_at,
    updatedAt: i.updated_at,
    closedAt: i.closed_at ?? null,
  }));
}

/**
 * Recent pull requests (PRs).
 * You can control state ("open" | "closed" | "all").
 */
export async function getRecentPullRequests(options?: {
  limit?: number;
  state?: "open" | "closed" | "all";
}): Promise<PullRequestSummary[]> {
  const limit = options?.limit ?? 10;
  const state = options?.state ?? "open";
  const safeLimit = Math.max(1, Math.min(limit, 100));

  const data = await githubFetch<any[]>(
    `/pulls?state=${state}&per_page=${safeLimit}`,
    { revalidate: GITHUB_FAST_REVALIDATE }
  );

  if (!data) return [];

  return data.map((pr) => ({
    id: pr.id,
    number: pr.number,
    title: pr.title,
    htmlUrl: pr.html_url,
    state: pr.state,
    draft: Boolean(pr.draft),
    authorLogin: pr.user?.login ?? null,
    createdAt: pr.created_at,
    updatedAt: pr.updated_at,
    mergedAt: pr.merged_at ?? null,
    baseBranch: pr.base?.ref ?? null,
    headBranch: pr.head?.ref ?? null,
  }));
}

/**
 * Convenience helper for pages that need multiple GitHub bits at once.
 */
export async function getGithubOverview() {
  const [meta, commits, releases, issues, pullRequests] = await Promise.all([
    getRepoMeta(),
    getRecentCommits(10),
    getReleases(10),
    getRecentIssues({ limit: 10, state: "all" }),
    getRecentPullRequests({ limit: 10, state: "all" }),
  ]);

  return {
    meta,
    commits,
    releases,
    issues,
    pullRequests,
  };
}
