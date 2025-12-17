// app/about/page.tsx

import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { PageBreadcrumb } from "@/components/PageBreadcrumb";
import {
  getGithubOverview,
  type CommitSummary,
  type IssueSummary,
  type PullRequestSummary,
} from "@/lib/github";

export const metadata: Metadata = {
  title: "About | Coog Planner",
  description:
    "Learn more about Coog Planner, the people behind it, inspirations, sources, and important disclaimers.",
};

type CollaboratorProfile = {
  login: string;
  avatarUrl: string | null;
  contributions: number;
};

type TeamProfile = {
  name: string;
  login: string;
  avatarUrl: string | null;
};

function fallbackAvatarForLogin(login: string | null | undefined, size = 80) {
  if (!login) return null;
  return `https://github.com/${login}.png?size=${size}`;
}

function buildCollaborators(
  excludedLogins: string[],
  commits: CommitSummary[],
  issues: CommitSummary[] | any[],
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
      if (!existing.avatarUrl && avatarUrl) existing.avatarUrl = avatarUrl;
    } else {
      map.set(login, {
        login,
        avatarUrl: avatarUrl ?? fallbackAvatarForLogin(login, 80),
        contributions: 1,
      });
    }
  };

  for (const c of commits)
    bump(c.authorLogin ?? null, c.authorAvatarUrl ?? null);

  for (const issue of issues as any[]) {
    const login = (issue as any).authorLogin ?? issue.authorLogin ?? null;
    const avatar =
      (issue as any).authorAvatarUrl ??
      fallbackAvatarForLogin(login, 80) ??
      null;
    bump(login, avatar);
  }

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

const buttonBase =
  "inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/70 px-4 py-2 font-medium text-slate-100 " +
  "transition-[color,background-color,border-color,box-shadow,filter] duration-150 " +
  "hover:bg-slate-900 hover:border-brand-light/80 hover:text-brand-light " +
  "hover:shadow-[0_0_0_3px_rgba(255,255,255,0.03),0_0_25px_rgba(99,102,241,0.18)] " +
  "focus-visible:outline-none focus-visible:ring focus-visible:ring-brand-light/55 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950";

const smallButtonBase =
  "inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-2 text-xs font-semibold text-slate-100 " +
  "transition-[color,background-color,border-color,box-shadow,filter] duration-150 " +
  "hover:bg-slate-900 hover:border-brand-light/80 hover:text-brand-light " +
  "hover:shadow-[0_0_0_3px_rgba(255,255,255,0.03),0_0_22px_rgba(99,102,241,0.16)] " +
  "focus-visible:outline-none focus-visible:ring focus-visible:ring-brand-light/55 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950";

function EmojiButton({
  href,
  label,
  emoji,
  size = "md",
  newTab = false,
}: {
  href: string;
  label: string;
  emoji: string;
  size?: "md" | "sm";
  newTab?: boolean;
}) {
  const cls = size === "sm" ? smallButtonBase : buttonBase;
  return (
    <a
      href={href}
      target={newTab ? "_blank" : undefined}
      rel={newTab ? "noreferrer" : undefined}
      className={cls}
    >
      <span aria-hidden className="text-sm">
        {emoji}
      </span>
      <span>{label}</span>
    </a>
  );
}

function ProfileCard({
  name,
  login,
  avatarUrl,
}: {
  name: string;
  login: string;
  avatarUrl: string | null;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-slate-800 bg-slate-900/80 p-4">
      <div className="flex items-center gap-4">
        <div className="h-14 w-14 overflow-hidden rounded-xl border border-slate-700 bg-slate-800">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-lg">
              <span aria-hidden>👤</span>
            </div>
          )}
        </div>

        <div className="flex min-h-[56px] flex-col justify-center text-left">
          <p className="text-sm font-semibold text-slate-100">{name}</p>
          <p className="text-[0.75rem] text-slate-500">@{login}</p>
        </div>
      </div>

      <EmojiButton
        href={`https://github.com/${login}`}
        label="GitHub"
        emoji="💻"
        size="sm"
        newTab
      />
    </div>
  );
}

function SourceRow({
  title,
  description,
  authorHandle,
  authorProfileUrl,
  href,
  buttonLabel,
  buttonEmoji,
}: {
  title: string;
  description: string;
  authorHandle: string;
  authorProfileUrl: string;
  href: string;
  buttonLabel: string;
  buttonEmoji: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-slate-50">{title}</p>

        <a
          href={authorProfileUrl}
          target="_blank"
          rel="noreferrer"
          className="truncate text-xs text-red-400 hover:text-red-300"
        >
          {authorHandle}
        </a>

        <p className="mt-1 text-xs leading-relaxed text-slate-400">
          {description}
        </p>
      </div>

      <EmojiButton
        href={href}
        label={buttonLabel}
        emoji={buttonEmoji}
        size="sm"
        newTab
      />
    </div>
  );
}

export default async function AboutPage() {
  const { github, name } = siteConfig;

  const description =
    "Coog Planner is a student-built tool designed to help University of Houston students explore courses, understand requirements, and plan degree paths more clearly with a clean, fast, and transparent interface.";

  const owner = github.owner;
  const repo = github.repo;
  const repoUrl = `https://github.com/${owner}/${repo}`;

  // Update these if your routes differ
  const legalUrl = "/legal";
  const privacyUrl = "/privacy";
  const termsUrl = "/terms";
  const faqUrl = "/faq";

  // Community links (swap to your real URLs)
  const community = {
    instagram: "https://instagram.com/",
    github: repoUrl,
    discord: "https://discord.com/invite/",
    email: "mailto:hello@coogplanner.com",
  };

  // SOURCES: set these to the exact pages you want
  const sources = [
    {
      title: "CougarGrades",
      authorHandle: "@CougarGrades",
      authorProfileUrl: "https://github.com/CougarGrades",
      href: "https://github.com/CougarGrades", // change to the exact repo if you want
      buttonLabel: "View Source",
      buttonEmoji: "💻",
      description:
        "A UH student-built tool that made grade distribution transparency accessible. Coog Planner is heavily inspired by this student-first mindset.",
    },
    {
      title: "CougarGrades Public Data",
      authorHandle: "@CougarGrades",
      authorProfileUrl: "https://github.com/CougarGrades",
      href: "https://github.com/CougarGrades", // change to the exact public-data repo
      buttonLabel: "View Repo",
      buttonEmoji: "🗂️",
      description:
        "Public datasets and resources connected to CougarGrades. Used as a reference for how student tools can publish information responsibly.",
    },
    {
      title: "UH Catalog & Official Docs",
      authorHandle: "@UniversityOfHouston",
      authorProfileUrl: "https://github.com/uh-edu", // change if you prefer
      href: "https://uh.edu/catalog-undergraduate",
      buttonLabel: "View Catalog",
      buttonEmoji: "📖",
      description:
        "Official degree requirements, course descriptions, and academic policies. Coog Planner helps interpret official sources, not replace them.",
    },
  ] as const;

  const author: TeamProfile = {
    name: "Kevin Trinh",
    login: owner,
    avatarUrl: fallbackAvatarForLogin(owner, 96),
  };

  // Put additional maintainers here (if any). Author is separate.
  const maintainers: TeamProfile[] = [
    // Example:
    // {
    //   name: "Jane Doe",
    //   login: "janedoe",
    //   avatarUrl: fallbackAvatarForLogin("janedoe", 96),
    // },
  ];

  let collaborators: CollaboratorProfile[] = [];
  try {
    const { commits, issues, pullRequests } = await getGithubOverview();

    // Exclude the author + maintainers from the Collaborators list
    const excludedLogins = [author.login, ...maintainers.map((m) => m.login)];

    collaborators = buildCollaborators(
      excludedLogins,
      commits,
      issues as any[],
      pullRequests
    );
  } catch {
    collaborators = [];
  }

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-10 lg:py-14">
      <PageBreadcrumb
        crumbs={[{ label: "About" }]}
        showStarAndCart={false}
        className="mb-3"
      />

      {/* About */}
      <section className="space-y-4">
        <div>
          <h1 className="text-balance text-2xl font-semibold tracking-tight text-slate-50 sm:text-3xl">
            📌 About
          </h1>
        </div>

        <p className="text-sm leading-relaxed text-slate-300">{description}</p>

        <p className="text-sm leading-relaxed text-slate-300">
          {name ?? "Coog Planner"} is built primarily for{" "}
          <span className="font-semibold">University of Houston</span> students
          who want more visibility into how their classes, catalog year, and
          long term goals fit together without juggling multiple tabs, PDFs, and
          unofficial notes.
        </p>

        <p className="text-sm leading-relaxed text-slate-300">
          Over time, the project is evolving into a small ecosystem with a
          degree planner, course explorer, and browser extension that overlays
          helpful context on UH systems. Everything is designed to be{" "}
          <span className="font-semibold">transparent and explainable</span>.
        </p>

        <details className="group mt-2 w-full rounded-xl border border-slate-800 bg-slate-950/60 p-3 text-sm text-slate-300">
          <summary className="flex cursor-pointer list-none items-center justify-between text-xs font-medium text-slate-200">
            <span className="font-semibold">Why does Coog Planner exist?</span>
            <span className="text-[0.7rem] text-slate-500 transition-transform duration-200 group-open:rotate-90">
              ▶
            </span>
          </summary>

          <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-300 ease-out group-open:grid-rows-[1fr]">
            <div className="overflow-hidden">
              <div className="mt-2 space-y-2 text-xs leading-relaxed text-slate-400">
                <p>
                  Coog Planner exists because degree planning at UH often turns
                  into a confusing, multi-step process. Students bounce between
                  the catalog, departmental PDFs, myUH screens, degree audits,
                  and group chats trying to answer the same questions.
                </p>
                <p>
                  The goal is to provide a clean interface that helps you
                  understand what counts, what is missing, and what a realistic
                  plan looks like. It focuses on clarity and explainability so
                  the app can tell you not only what the result is, but why.
                </p>
                <p>
                  This project is heavily inspired by{" "}
                  <span className="font-semibold">CougarGrades</span>, created
                  by <span className="font-semibold">Austin Jackson</span>.
                  CougarGrades proved that student-built tools can have real
                  impact at UH by making information more accessible. Coog
                  Planner owes credit and acknowledgement to CougarGrades for
                  the inspiration and for setting the standard for student-first
                  transparency.
                </p>
                <p>
                  Coog Planner is separate software and is not officially
                  affiliated with UH. It is meant to help interpret official
                  sources, not replace advising or official university systems.
                </p>
              </div>
            </div>
          </div>
        </details>
      </section>

      {/* Quick links */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-300">
          Quick links
        </h2>

        <div className="mt-2 flex flex-wrap gap-3 text-xs sm:text-sm">
          <EmojiButton href={repoUrl} label="Source Code" emoji="💻" newTab />
          <EmojiButton
            href={legalUrl}
            label="Legal, Privacy & TOS"
            emoji="⚖️"
          />
          <EmojiButton href={faqUrl} label="FAQ" emoji="🤔" />
        </div>
      </section>

      {/* Author */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold tracking-tight text-slate-50 sm:text-xl">
          Author
        </h2>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <ProfileCard
            name={author.name}
            login={author.login}
            avatarUrl={author.avatarUrl}
          />
        </div>
      </section>

      {/* Maintainers */}
      {maintainers.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-lg font-semibold tracking-tight text-slate-50 sm:text-xl">
            Maintainers
          </h2>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {maintainers.map((m) => (
              <ProfileCard
                key={m.login}
                name={m.name}
                login={m.login}
                avatarUrl={m.avatarUrl}
              />
            ))}
          </div>
        </section>
      )}

      {/* Collaborators */}
      {collaborators.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-lg font-semibold tracking-tight text-slate-50 sm:text-xl">
            Collaborators
          </h2>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {collaborators.map((c) => (
              <ProfileCard
                key={c.login}
                name={c.login}
                login={c.login}
                avatarUrl={c.avatarUrl}
              />
            ))}
          </div>
        </section>
      )}

      {/* Inspiration & sources */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold tracking-tight text-slate-50 sm:text-xl">
          Inspiration &amp; Sources
        </h2>

        <div className="space-y-3">
          {sources.map((s) => (
            <SourceRow
              key={s.title}
              title={s.title}
              description={s.description}
              authorHandle={s.authorHandle}
              authorProfileUrl={s.authorProfileUrl}
              href={s.href}
              buttonLabel={s.buttonLabel}
              buttonEmoji={s.buttonEmoji}
            />
          ))}
        </div>
      </section>

      {/* Important notice & disclaimer */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold tracking-tight text-slate-50 sm:text-xl">
          Important Notice &amp; Disclaimer
        </h2>

        <div className="space-y-2 text-sm text-slate-300">
          <p>
            Coog Planner is an{" "}
            <span className="font-semibold">independent, student-built</span>{" "}
            project and is <span className="font-semibold">not</span> an
            official product of the University of Houston.
          </p>
          <p>
            It is{" "}
            <span className="font-semibold">
              not affiliated with or endorsed by
            </span>{" "}
            UH, UH System, or any UH college, department, or office. UH names
            and trademarks belong to their owners.
          </p>
          <p>
            Information shown is for{" "}
            <span className="font-semibold">planning purposes only</span>.
            Requirements and offerings can change by catalog year. Always
            confirm details in official UH systems and with your advisor.
          </p>
        </div>

        <div className="mt-4 flex flex-wrap gap-3 text-xs sm:text-sm">
          <EmojiButton href={legalUrl} label="Legal" emoji="⚖️" />
          <EmojiButton href={privacyUrl} label="Privacy Policy" emoji="🔒" />
          <EmojiButton href={termsUrl} label="Terms of Service" emoji="🧾" />
        </div>
      </section>

      {/* Contact */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold tracking-tight text-slate-50 sm:text-xl">
          Contact
        </h2>

        <p className="text-sm text-slate-300">
          Want to get involved, report an issue, or reach out directly? Use the
          links below.
        </p>

        <div className="mt-2 flex flex-wrap gap-3 text-xs sm:text-sm">
          <EmojiButton
            href={community.instagram}
            label="Instagram"
            emoji="📸"
            newTab
          />
          <EmojiButton
            href={community.github}
            label="GitHub"
            emoji="💻"
            newTab
          />
          <EmojiButton
            href={community.discord}
            label="Discord Server"
            emoji="💬"
            newTab
          />
          <EmojiButton href={community.email} label="Email" emoji="✉️" />
        </div>
      </section>
    </div>
  );
}
