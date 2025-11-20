// app/about/page.tsx

import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import {
  getGithubOverview,
  type CommitSummary,
  type IssueSummary,
  type PullRequestSummary,
} from "@/lib/github";

export const metadata: Metadata = {
  title: "About | Coog Planner",
  description:
    "Learn more about Coog Planner, the people behind it, credits, and important disclaimers.",
};

type CollaboratorProfile = {
  login: string;
  avatarUrl: string | null;
  contributions: number;
};

function fallbackAvatarForLogin(login: string | null | undefined, size = 80) {
  if (!login) return null;
  return `https://github.com/${login}.png?size=${size}`;
}

function buildCollaborators(
  excludedLogins: string[],
  commits: CommitSummary[],
  issues: IssueSummary[],
  prs: PullRequestSummary[]
): CollaboratorProfile[] {
  const map = new Map<string, CollaboratorProfile>();
  const excluded = new Set(excludedLogins.map((l) => l.toLowerCase()));

  const bump = (login: string | null, avatarUrl?: string | null) => {
    if (!login) return;
    if (excluded.has(login.toLowerCase())) return;

    const existing = map.get(login);
    if (existing) {
      existing.contributions += 1;
      if (!existing.avatarUrl && avatarUrl) {
        existing.avatarUrl = avatarUrl;
      }
    } else {
      map.set(login, {
        login,
        avatarUrl: avatarUrl ?? fallbackAvatarForLogin(login, 80),
        contributions: 1,
      });
    }
  };

  // Commits
  for (const c of commits) {
    bump(c.authorLogin ?? null, c.authorAvatarUrl ?? null);
  }

  // Issues
  for (const issue of issues) {
    const login = (issue as any).authorLogin ?? issue.authorLogin ?? null;
    const avatar =
      (issue as any).authorAvatarUrl ??
      fallbackAvatarForLogin(login, 80) ??
      null;
    bump(login, avatar);
  }

  // PRs
  for (const pr of prs) {
    const login = (pr as any).authorLogin ?? pr.authorLogin ?? null;
    const avatar =
      (pr as any).authorAvatarUrl ?? fallbackAvatarForLogin(login, 80) ?? null;
    bump(login, avatar);
  }

  return Array.from(map.values())
    .sort((a, b) => b.contributions - a.contributions)
    .slice(0, 16);
}

export default async function AboutPage() {
  const { github, name } = siteConfig;
  const description =
    "Coog Planner is a student-built tool designed to help University of Houston students explore courses, understand requirements, and plan their degree paths more clearly. It focuses on giving you a clean, fast, and transparent view of the information you need to make better registration decisions.";

  const owner = github.owner;
  const repo = github.repo;
  const repoUrl = `https://github.com/${owner}/${repo}`;

  const legalUrl = "/legal";
  const faqUrl = "/faq";

  // Maintainers – static list
  const maintainers = [
    {
      name: "Kevin Trinh",
      role: "Developer / Maintainer",
      login: owner,
      avatarUrl: fallbackAvatarForLogin(owner, 96),
    },
    // Add more maintainers here if needed
  ];

  let collaborators: CollaboratorProfile[] = [];
  try {
    const { commits, issues, pullRequests } = await getGithubOverview();
    const excludedLogins = maintainers.map((m) => m.login);
    collaborators = buildCollaborators(
      excludedLogins,
      commits,
      issues,
      pullRequests
    );
  } catch {
    collaborators = [];
  }

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-10 lg:py-14">
      {/* About */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-lg sm:p-8">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-700/70 bg-slate-900/80 px-3 py-1 text-xs font-medium uppercase tracking-wide text-slate-300">
            <span aria-hidden className="text-sm">
              ℹ️
            </span>
            <span>About</span>
          </div>
        </div>

        <h1 className="text-balance text-2xl font-semibold tracking-tight text-slate-50 sm:text-3xl">
          About {name ?? "Coog Planner"}
        </h1>

        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-slate-300">
          {description}
        </p>

        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-300">
          The goal is simple: make it easier to see what&apos;s ahead — what
          classes satisfy which requirements, how your plan fits into your
          catalog year, and what options you have along the way — all without
          replacing any official UH systems.
        </p>
      </section>

      {/* Quick link resources */}
      <section className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5 sm:p-6">
        <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-slate-300">
          <span aria-hidden>🔗</span>
          Quick links
        </h2>
        <p className="mt-2 text-xs text-slate-400 sm:text-sm">
          Jump straight to the most important resources related to Coog Planner.
        </p>

        <div className="mt-4 flex flex-wrap gap-3 text-xs sm:text-sm">
          <a
            href={repoUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/80 px-4 py-2 font-medium text-slate-100 transition-all duration-150 hover:-translate-y-0.5 hover:border-brand-light/80 hover:text-brand-light hover:shadow-md focus-visible:outline-none focus-visible:ring focus-visible:ring-brand-light/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
          >
            <span aria-hidden>💻</span>
            <span>View source code</span>
          </a>

          <a
            href={legalUrl}
            className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/80 px-4 py-2 font-medium text-slate-100 transition-all duration-150 hover:-translate-y-0.5 hover:border-brand-light/80 hover:text-brand-light hover:shadow-md focus-visible:outline-none focus-visible:ring focus-visible:ring-brand-light/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
          >
            <span aria-hidden>⚖️</span>
            <span>Legal &amp; privacy</span>
          </a>

          <a
            href={faqUrl}
            className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/80 px-4 py-2 font-medium text-slate-100 transition-all duration-150 hover:-translate-y-0.5 hover:border-brand-light/80 hover:text-brand-light hover:shadow-md focus-visible:outline-none focus-visible:ring focus-visible:ring-brand-light/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
          >
            <span aria-hidden>❓</span>
            <span>FAQ</span>
          </a>
        </div>
      </section>

      {/* Developers / Maintainers */}
      <section className="space-y-4 rounded-2xl border border-slate-800 bg-slate-950/70 p-6 sm:p-8">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900/80 text-lg">
            <span aria-hidden>👨‍💻</span>
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold tracking-tight text-slate-50 sm:text-xl">
              Developers &amp; maintainers
            </h2>
            <p className="mt-1 text-sm text-slate-300">
              The core team responsible for designing, building, and maintaining
              Coog Planner.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {maintainers.map((m) => (
            <a
              key={m.login}
              href={`https://github.com/${m.login}`}
              target="_blank"
              rel="noreferrer"
              className="group flex flex-col items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/80 p-4 text-center text-xs text-slate-200 transition-all duration-150 hover:-translate-y-1 hover:border-brand-light/70 hover:text-brand-light hover:shadow-lg focus-visible:outline-none focus-visible:ring focus-visible:ring-brand-light/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
            >
              <div className="h-14 w-14 overflow-hidden rounded-2xl border border-slate-700 bg-slate-800">
                {m.avatarUrl ? (
                  <img
                    src={m.avatarUrl}
                    alt={m.name}
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
                  {m.name}
                </p>
                <p className="text-[0.7rem] text-slate-400">{m.role}</p>
                <p className="text-[0.7rem] text-slate-500">@{m.login}</p>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Collaborators (only if any) */}
      {collaborators.length > 0 && (
        <section className="space-y-4 rounded-2xl border border-slate-800 bg-slate-950/70 p-6 sm:p-8">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900/80 text-lg">
              <span aria-hidden>🤝</span>
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold tracking-tight text-slate-50 sm:text-xl">
                Collaborators
              </h2>
              <p className="mt-1 text-sm text-slate-300">
                Community members who have helped improve Coog Planner through
                commits, issues, and pull requests.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {collaborators.map((c) => (
              <a
                key={c.login}
                href={`https://github.com/${c.login}`}
                target="_blank"
                rel="noreferrer"
                className="group flex flex-col items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/80 p-4 text-center text-xs text-slate-200 transition-all duration-150 hover:-translate-y-1 hover:border-brand-light/70 hover:text-brand-light hover:shadow-lg focus-visible:outline-none focus-visible:ring focus-visible:ring-brand-light/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
              >
                <div className="h-14 w-14 overflow-hidden rounded-2xl border border-slate-700 bg-slate-800">
                  {c.avatarUrl ? (
                    <img
                      src={c.avatarUrl}
                      alt={c.login}
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
                    @{c.login}
                  </p>
                  <p className="text-[0.7rem] text-slate-400">
                    {c.contributions} contributions
                  </p>
                </div>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* Credits & sources */}
      <section className="space-y-3 rounded-2xl border border-slate-800 bg-slate-950/70 p-6 sm:p-8">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900/80 text-lg">
            <span aria-hidden>📚</span>
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold tracking-tight text-slate-50 sm:text-xl">
              Credits &amp; sources
            </h2>
            <p className="mt-1 text-sm text-slate-300">
              Coog Planner takes inspiration from other student-built tools and
              publicly available information around the University of Houston.
            </p>
          </div>
        </div>

        <div className="space-y-2 text-sm text-slate-300">
          <p>
            🐾 <span className="font-semibold">CougarGrades</span> – This
            project is conceptually inspired by{" "}
            <span className="font-semibold">CougarGrades</span>, an independent
            student-created tool that visualizes UH grade distributions. Coog
            Planner is separate software with its own codebase and goals but
            shares the same spirit of making academic information more
            transparent for students.
          </p>
          <p>
            🧾{" "}
            <span className="font-semibold">
              UH catalog &amp; official docs
            </span>{" "}
            – Degree requirements, course descriptions, and policies are based
            on publicly available information such as the UH undergraduate
            catalog, departmental websites, and official advising materials.
            Always refer back to official UH sources to confirm anything before
            making decisions.
          </p>
        </div>
      </section>

      {/* Important notice & disclaimer */}
      <section className="space-y-3 rounded-2xl border border-slate-800 bg-slate-950/80 p-6 sm:p-8">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900/80 text-lg">
            <span aria-hidden>⚠️</span>
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold tracking-tight text-slate-50 sm:text-xl">
              Important notice &amp; disclaimer
            </h2>
          </div>
        </div>

        <div className="space-y-2 text-sm text-slate-300">
          <p>
            Coog Planner is an{" "}
            <span className="font-semibold">
              independent, student-built tool
            </span>
            . It is <span className="font-semibold">not</span> an official
            product of the University of Houston, the UH System, or any UH
            college, department, or office.
          </p>
          <p>
            This project is{" "}
            <span className="font-semibold">
              not affiliated with, endorsed by, authorized by, sponsored by, or
              associated with
            </span>{" "}
            the University of Houston in any way. UH, its trademarks, and any
            related names or logos remain the property of their respective
            owners.
          </p>
          <p>
            All information shown in Coog Planner is provided for{" "}
            <span className="font-semibold">
              informational and planning purposes only
            </span>
            . Course offerings, prerequisites, degree requirements, and policies
            can change and may vary by catalog year. Always verify details
            directly in official UH systems (myUH/PeopleSoft, the UH catalog)
            and with your academic advisor before making academic or enrollment
            decisions.
          </p>
        </div>

        <div className="mt-4 flex flex-wrap gap-3 text-xs sm:text-sm">
          <a
            href={legalUrl}
            className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/80 px-4 py-2 font-medium text-slate-100 transition-all duration-150 hover:-translate-y-0.5 hover:border-brand-light/80 hover:text-brand-light hover:shadow-md focus-visible:outline-none focus-visible:ring focus-visible:ring-brand-light/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
          >
            <span aria-hidden>⚖️</span>
            <span>View full legal &amp; privacy details</span>
          </a>
        </div>
      </section>
    </div>
  );
}
