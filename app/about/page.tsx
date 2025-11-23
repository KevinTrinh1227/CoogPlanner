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
    <div className="mx-auto flex max-w-5xl flex-col gap-16 px-4 py-10 lg:py-14">
      {/* About */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900/80 text-lg">
            <span aria-hidden>📍</span>
          </div>
          <h1 className="text-balance text-2xl font-semibold tracking-tight text-slate-50 sm:text-3xl">
            About {name ?? "Coog Planner"}
          </h1>
        </div>

        <p className="text-sm leading-relaxed text-slate-300">{description}</p>

        <p className="text-sm leading-relaxed text-slate-300">
          Coog Planner is built primarily for{" "}
          <span className="font-semibold">University of Houston</span> students
          who want more visibility into how their classes, catalog year, and
          long–term goals fit together. Instead of juggling multiple tabs, PDFs,
          and unofficial notes, the aim is to give you a single, fast interface
          that talks the same language as your advisor and your degree audit.
        </p>

        <p className="text-sm leading-relaxed text-slate-300">
          Over time, the project is evolving into a small ecosystem: a degree
          planner, course explorer, and browser extension that overlays context
          directly on top of UH systems. Everything is designed to be{" "}
          <span className="font-semibold">transparent, explainable,</span> and
          easy to update as requirements change.
        </p>

        <details className="group mt-2 w-full rounded-xl border border-slate-800 bg-slate-950/60 p-3 text-sm text-slate-300">
          <summary className="flex cursor-pointer list-none items-center justify-between text-xs font-medium text-slate-200">
            <span>Why does Coog Planner exist?</span>
            <span className="text-[0.7rem] text-slate-500 transition-transform group-open:rotate-90">
              ▶
            </span>
          </summary>
          <p className="mt-2 text-xs leading-relaxed text-slate-400">
            Coog Planner started as a personal project by a UH student who loved
            the impact of <span className="font-semibold">CougarGrades</span>,
            created by <span className="font-semibold">Austin Jackson</span>.
            CougarGrades made grade distributions transparent; Coog Planner
            tries to extend that spirit by focusing on{" "}
            <span className="font-semibold">
              degree planning, requirements, and registration decisions
            </span>
            . The idea is to build a tool that feels like a modern companion to
            your degree audit and catalog, while honoring the legacy of the
            tools that inspired it.
          </p>
        </details>
      </section>

      {/* Quick link resources */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <span aria-hidden className="text-sm">
            🔗
          </span>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-300">
            Quick links
          </h2>
        </div>
        <p className="text-xs text-slate-400 sm:text-sm">
          Jump straight to the most important resources related to Coog Planner.
        </p>

        <div className="mt-2 flex flex-wrap gap-3 text-xs sm:text-sm">
          <a
            href={repoUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/80 px-4 py-2 font-medium text-slate-100 transition-all duration-150 hover:-translate-y-0.5 hover:border-brand-light/80 hover:text-brand-light hover:shadow-md focus-visible:outline-none focus-visible:ring focus-visible:ring-brand-light/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
          >
            <span aria-hidden>💻</span>
            <span>Source Code</span>
          </a>

          <a
            href={legalUrl}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/80 px-4 py-2 font-medium text-slate-100 transition-all duration-150 hover:-translate-y-0.5 hover:border-brand-light/80 hover:text-brand-light hover:shadow-md focus-visible:outline-none focus-visible:ring focus-visible:ring-brand-light/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
          >
            <span aria-hidden>⚖️</span>
            <span>Legal &amp; privacy</span>
          </a>

          <a
            href={faqUrl}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/80 px-4 py-2 font-medium text-slate-100 transition-all duration-150 hover:-translate-y-0.5 hover:border-brand-light/80 hover:text-brand-light hover:shadow-md focus-visible:outline-none focus-visible:ring focus-visible:ring-brand-light/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
          >
            <span aria-hidden>❓</span>
            <span>FAQ</span>
          </a>
        </div>
      </section>

      {/* Developers / Maintainers */}
      <section className="space-y-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900/80 text-lg">
              <span aria-hidden>👨‍💻</span>
            </div>
            <h2 className="text-lg font-semibold tracking-tight text-slate-50 sm:text-xl">
              Developers, Collaborators, and Maintainers
            </h2>
          </div>
          <p className="text-sm text-slate-300">
            The core team responsible for designing, building, and maintaining
            Coog Planner.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
          {maintainers.map((m) => (
            <a
              key={m.login}
              href={`https://github.com/${m.login}`}
              target="_blank"
              rel="noreferrer"
              className="group flex w-full flex-col items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/80 p-4 text-center text-xs text-slate-200 transition-all duration-150 hover:-translate-y-1 hover:border-brand-light/70 hover:text-brand-light hover:shadow-lg focus-visible:outline-none focus-visible:ring focus-visible:ring-brand-light/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
            >
              <div className="h-16 w-16 overflow-hidden rounded-2xl border border-slate-700 bg-slate-800">
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
        <section className="space-y-4">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900/80 text-lg">
                <span aria-hidden>🤝</span>
              </div>
              <h2 className="text-lg font-semibold tracking-tight text-slate-50 sm:text-xl">
                Collaborators
              </h2>
            </div>
            <p className="text-sm text-slate-300">
              Community members who have helped improve Coog Planner through
              commits, issues, and pull requests.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
            {collaborators.map((c) => (
              <a
                key={c.login}
                href={`https://github.com/${c.login}`}
                target="_blank"
                rel="noreferrer"
                className="group flex w-full flex-col items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/80 p-4 text-center text-xs text-slate-200 transition-all duration-150 hover:-translate-y-1 hover:border-brand-light/70 hover:text-brand-light hover:shadow-lg focus-visible:outline-none focus-visible:ring focus-visible:ring-brand-light/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
              >
                <div className="h-16 w-16 overflow-hidden rounded-2xl border border-slate-700 bg-slate-800">
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
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900/80 text-lg">
            <span aria-hidden>📚</span>
          </div>
          <h2 className="text-lg font-semibold tracking-tight text-slate-50 sm:text-xl">
            Credits &amp; Sources
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
          {/* CougarGrades */}
          <article className="flex h-full flex-col rounded-2xl border border-slate-800 bg-slate-950/70 p-4 text-sm text-slate-200 transition-all duration-150 hover:-translate-y-1 hover:border-brand-light/70 hover:shadow-lg">
            <div className="mb-2">
              <div className="flex items-center gap-2">
                <span aria-hidden>🐾</span>
                <h3 className="text-sm font-semibold text-slate-50">
                  CougarGrades
                </h3>
              </div>
              <p className="text-[0.7rem] text-slate-400">
                Author: Austin Jackson
              </p>
            </div>
            <p className="flex-1 text-xs text-slate-300">
              An independent student-created tool that visualizes UH grade
              distributions. Coog Planner is separate software, but it&apos;s
              heavily inspired by the transparency and student-first mindset
              that CougarGrades brought to UH.
            </p>
            <div className="mt-3">
              <a
                href="https://www.cougargrades.io"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-1.5 text-xs font-medium text-slate-100 transition-all duration-150 hover:-translate-y-0.5 hover:border-brand-light/80 hover:text-brand-light"
              >
                <span aria-hidden>🌐</span>
                <span>Visit CougarGrades</span>
              </a>
            </div>
          </article>

          {/* UH catalog & official docs */}
          <article className="flex h-full flex-col rounded-2xl border border-slate-800 bg-slate-950/70 p-4 text-sm text-slate-200 transition-all duration-150 hover:-translate-y-1 hover:border-brand-light/70 hover:shadow-lg">
            <div className="mb-2">
              <div className="flex items-center gap-2">
                <span aria-hidden>🧾</span>
                <h3 className="text-sm font-semibold text-slate-50">
                  UH catalog &amp; official docs
                </h3>
              </div>
              <p className="text-[0.7rem] text-slate-400">
                Author: University of Houston
              </p>
            </div>
            <p className="flex-1 text-xs text-slate-300">
              Degree requirements, course descriptions, and policies are based
              on publicly available information such as the UH undergraduate
              catalog, departmental websites, and official advising materials.
              Coog Planner is meant to help you interpret these - not replace
              them.
            </p>
            <div className="mt-3">
              <a
                href="https://uh.edu/catalog-undergraduate"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-1.5 text-xs font-medium text-slate-100 transition-all duration-150 hover:-translate-y-0.5 hover:border-brand-light/80 hover:text-brand-light"
              >
                <span aria-hidden>📖</span>
                <span>Open UH catalog</span>
              </a>
            </div>
          </article>

          {/* RMP API repo */}
          <article className="flex h-full flex-col rounded-2xl border border-slate-800 bg-slate-950/70 p-4 text-sm text-slate-200 transition-all duration-150 hover:-translate-y-1 hover:border-brand-light/70 hover:shadow-lg">
            <div className="mb-2">
              <div className="flex items-center gap-2">
                <span aria-hidden>⭐</span>
                <h3 className="text-sm font-semibold text-slate-50">
                  RMP API (community repo)
                </h3>
              </div>
              <p className="text-[0.7rem] text-slate-400">
                Author: snow4060 &amp; contributors
              </p>
            </div>
            <p className="flex-1 text-xs text-slate-300">
              Coog Planner may integrate with third-party, community-driven
              tools like the{" "}
              <span className="font-semibold">snow4060/rmp-api</span> project
              for working with RateMyProfessors data. This is a separate,
              independent open-source repository with its own maintainers and
              license.
            </p>
            <div className="mt-3">
              <a
                href="https://github.com/snow4060/rmp-api"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-1.5 text-xs font-medium text-slate-100 transition-all duration-150 hover:-translate-y-0.5 hover:border-brand-light/80 hover:text-brand-light"
              >
                <span aria-hidden>💾</span>
                <span>View GitHub repo</span>
              </a>
            </div>
          </article>
        </div>
      </section>

      {/* Important notice & disclaimer */}
      <section className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900/80 text-lg">
            <span aria-hidden>⚠️</span>
          </div>
          <h2 className="text-lg font-semibold tracking-tight text-slate-50 sm:text-xl">
            Important Notice &amp; Disclaimer
          </h2>
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
            className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/80 px-4 py-2 font-medium text-slate-100 transition-all duration-150 hover:-translate-y-0.5 hover:border-brand-light/80 hover:text-brand-light hover:shadow-md focus-visible:outline-none focus-visible:ring focus-visible:ring-brand-light/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
          >
            <span aria-hidden>⚖️</span>
            <span>Legal &amp; privacy</span>
          </a>
        </div>
      </section>

      {/* Contact section */}
      <section className="space-y-4 rounded-2xl border border-slate-800 bg-slate-950/70 p-6 sm:p-8">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900/80 text-lg">
            <span aria-hidden>✉️</span>
          </div>
          <h2 className="text-lg font-semibold tracking-tight text-slate-50 sm:text-xl">
            Contact Us
          </h2>
        </div>

        <p className="text-sm text-slate-300">
          Have feedback, found a bug, or want to suggest a feature? Send a quick
          message below. This form doesn&apos;t send anywhere yet - webhooks and
          email notifications will be added later.
        </p>

        <form className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label
                htmlFor="contact-name"
                className="text-xs font-medium uppercase tracking-wide text-slate-400"
              >
                Name
              </label>
              <input
                id="contact-name"
                name="name"
                type="text"
                autoComplete="name"
                className="w-full rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 outline-none ring-0 transition-colors focus:border-brand-light/80 focus:ring-1 focus:ring-brand-light/60"
                placeholder="Your name"
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="contact-email"
                className="text-xs font-medium uppercase tracking-wide text-slate-400"
              >
                Email
              </label>
              <input
                id="contact-email"
                name="email"
                type="email"
                autoComplete="email"
                className="w-full rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 outline-none ring-0 transition-colors focus:border-brand-light/80 focus:ring-1 focus:ring-brand-light/60"
                placeholder="you@uh.edu"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="contact-topic"
              className="text-xs font-medium uppercase tracking-wide text-slate-400"
            >
              Topic
            </label>
            <select
              id="contact-topic"
              name="topic"
              className="w-full rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 outline-none ring-0 transition-colors focus:border-brand-light/80 focus:ring-1 focus:ring-brand-light/60"
              defaultValue="feedback"
            >
              <option value="feedback">General feedback</option>
              <option value="bug">Bug report</option>
              <option value="feature">Feature request</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="contact-message"
              className="text-xs font-medium uppercase tracking-wide text-slate-400"
            >
              Message
            </label>
            <textarea
              id="contact-message"
              name="message"
              rows={4}
              className="w-full rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 outline-none ring-0 transition-colors focus:border-brand-light/80 focus:ring-1 focus:ring-brand-light/60"
              placeholder="Share as much detail as you’d like. Screenshots, course codes, catalog years, etc. can all help."
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-slate-500">
              This button is a visual placeholder for now. Submission handling
              will be wired up later.
            </p>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-xl bg-red-400 px-4 py-1.5 text-xs font-semibold text-slate-950 shadow-sm transition-all duration-150 hover:-translate-y-0.5 hover:bg-red-300 hover:shadow-md focus-visible:outline-none focus-visible:ring focus-visible:ring-red-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
            >
              <span aria-hidden>📨</span>
              <span>Send message</span>
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
