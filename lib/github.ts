// lib/github.ts
/**
 * GitHub API helpers for CoogPlanner.
 *
 * - Fetches repo metadata, commits, releases, issues, and PRs for the configured repo.
 * - Uses only public GitHub endpoints by default (no token required).
 * - Optionally reads GITHUB_TOKEN (server-side) for higher rate limits.
 * - Designed for use in Next.js server components / route handlers with `next.revalidate`.
 */

import { siteConfig } from "@/config/site";

const GITHUB_API_BASE = "https://api.github.com";
const GITHUB_DEFAULT_REVALIDATE = 3600; // 1 hour for most metadata
const GITHUB_FAST_REVALIDATE = 300; // 5 min for more dynamic lists (issues/PRs)

// Prevent spamming the console with the same meta error over and over
let hasLoggedRepoMetaError = false;

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
    // Feel free to update the URL below to your actual repo URL.
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
      console.warn(`GitHub API error (${path}):`, res.status, res.statusText);
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
 * Basic repo meta:
 * - Latest commit SHA + URL
 * - Latest tag name
 */
export async function getRepoMeta(): Promise<RepoMeta | null> {
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
 * Recent commits, for changelog / "Latest activity" sections.
 * Default: last 10 commits.
 */
export async function getRecentCommits(limit = 10): Promise<CommitSummary[]> {
  const data = await githubFetch<any[]>(`/commits?per_page=${limit}`, {
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
  const data = await githubFetch<any[]>(`/releases?per_page=${limit}`, {
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

  const data = await githubFetch<any[]>(
    `/issues?state=${state}&per_page=${limit}`,
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

  const data = await githubFetch<any[]>(
    `/pulls?state=${state}&per_page=${limit}`,
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
