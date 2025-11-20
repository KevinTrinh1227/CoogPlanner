// lib/github.ts
import { siteConfig } from "@/config/site";

const GITHUB_API_BASE = "https://api.github.com";
const GITHUB_DEFAULT_REVALIDATE = 3600; // 1 hour for most metadata
const GITHUB_FAST_REVALIDATE = 300; // 5 min for more dynamic lists (issues/PRs)

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
 * If GITHUB_TOKEN is set, we use it for higher rate limits.
 */
function getGithubHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
  };

  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  return headers;
}

/**
 * Lightweight wrapper around fetch for GitHub API.
 */
async function githubFetch<T>(
  path: string,
  options?: {
    revalidate?: number;
    // For future extension (query params, etc.)
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
      console.error(`GitHub API error (${path}):`, res.status, res.statusText);
      return null;
    }

    // We type-cast because we know what we expect from the endpoint.
    const json = (await res.json()) as T;
    return json;
  } catch (err) {
    console.error(`Error calling GitHub API (${path})`, err);
    return null;
  }
}

/**
 * Original helper, kept compatible: returns basic repo meta
 * (latest commit SHA/URL + latest tag name).
 */
export async function getRepoMeta(): Promise<RepoMeta | null> {
  const { owner, repo } = siteConfig.github;

  try {
    const [commitsRes, tagsRes] = await Promise.all([
      fetch(`${GITHUB_API_BASE}/repos/${owner}/${repo}/commits?per_page=1`, {
        headers: getGithubHeaders(),
        next: { revalidate: GITHUB_DEFAULT_REVALIDATE },
      }),
      fetch(`${GITHUB_API_BASE}/repos/${owner}/${repo}/tags?per_page=1`, {
        headers: getGithubHeaders(),
        next: { revalidate: GITHUB_DEFAULT_REVALIDATE },
      }),
    ]);

    if (!commitsRes.ok && !tagsRes.ok) {
      console.error(
        "GitHub repo meta: both commits and tags requests failed",
        commitsRes.status,
        tagsRes.status
      );
      return null;
    }

    let latestCommitSha: string | null = null;
    let latestCommitUrl: string | null = null;

    if (commitsRes.ok) {
      const commits = (await commitsRes.json()) as any[];
      const latest = commits[0];
      latestCommitSha = latest?.sha ?? null;
      latestCommitUrl = latest?.html_url ?? null;
    }

    let latestTag: string | null = null;

    if (tagsRes.ok) {
      const tags = (await tagsRes.json()) as any[];
      latestTag = tags[0]?.name ?? null;
    }

    return {
      latestCommitSha,
      latestCommitUrl,
      latestTag,
    };
  } catch (err) {
    console.error("Error fetching GitHub repo meta", err);
    return null;
  }
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
    const authorAvatarUrl: string | null = c.author?.avatar_url ?? null;
    const htmlUrl: string = c.html_url;
    const committedAt: string =
      c.commit?.author?.date ?? c.commit?.committer?.date ?? "";

    return {
      sha,
      shortSha,
      message,
      authorName,
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
 *
 * This is perfect for:
 *  - Showing "recently reported issues" on an internal dashboard
 *  - Surface a few "known issues" on the Updates page
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
 * Again, you can control state ("open" | "closed" | "all").
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
 * Optional helper if you want to get "everything" for the Updates page
 * in a single call from your server component and then distribute props.
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
