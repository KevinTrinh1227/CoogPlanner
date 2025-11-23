// app/privacy-legal/page.tsx

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy & Legal | Coog Planner",
  description:
    "Learn how Coog Planner handles your data and the legal terms for using this unofficial UH degree and semester planning tool.",
};

export default function PrivacyLegalPage() {
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-10 lg:py-14">
      {/* Hero / Intro */}
      <section>
        <div className="flex items-center gap-3">
          <span className="text-2xl" aria-hidden>
            🔒
          </span>
          <h1 className="text-balance text-2xl font-semibold tracking-tight text-slate-50 sm:text-3xl">
            Privacy &amp; Legal
          </h1>
        </div>

        <p className="mt-1 text-xs text-slate-400">
          Last updated:{" "}
          <span className="font-medium text-slate-200">November 2025</span>
        </p>

        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-300">
          This page explains how Coog Planner collects and uses information, and
          the legal terms that apply when you use the site. We also clarify that
          Coog Planner is an{" "}
          <span className="font-semibold text-slate-50">
            unofficial planning tool
          </span>{" "}
          and <span className="font-semibold text-slate-50">not</span> an
          official University of Houston service or degree audit.
        </p>

        {/* Quick nav */}
        <div className="mt-5 flex flex-wrap gap-3">
          <a
            href="#privacy-policy"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/70 px-4 py-2 text-xs font-medium text-slate-100 transition-all duration-150 hover:-translate-y-0.5 hover:border-brand-light/80 hover:bg-slate-900/90 hover:text-brand-light"
          >
            <span aria-hidden>🔒</span>
            <span>Jump to Privacy Policy</span>
          </a>
          <a
            href="#legal-terms"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/70 px-4 py-2 text-xs font-medium text-slate-100 transition-all duration-150 hover:-translate-y-0.5 hover:border-brand-light/80 hover:bg-slate-900/90 hover:text-brand-light"
          >
            <span aria-hidden>⚖️</span>
            <span>Jump to Legal &amp; Terms</span>
          </a>
        </div>
      </section>

      {/* Privacy Policy */}
      <section id="privacy-policy" className="space-y-6 pt-6">
        <div className="flex items-start gap-3">
          <div className="mt-1 rounded-xl bg-slate-900/80 p-2 text-lg">
            <span aria-hidden>🔒</span>
          </div>
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-slate-50 sm:text-xl">
              Privacy Policy
            </h2>
            <p className="mt-1 text-sm text-slate-300">
              How we collect, use, and protect your information when you use
              Coog Planner.
            </p>
          </div>
        </div>

        {/* TL;DR summary */}
        <div className="flex gap-3 rounded-xl border border-slate-700/80 bg-slate-900/80 p-4">
          <div className="mt-0.5 text-lg" aria-hidden>
            ℹ️
          </div>
          <div className="space-y-1 text-sm text-slate-200">
            <p className="font-semibold text-slate-50">TL;DR (short version)</p>
            <ul className="list-disc space-y-1 pl-4 text-slate-300">
              <li>
                We store the info you give us (like your email and degree plans)
                so we can power your planning experience.
              </li>
              <li>
                We don&apos;t sell your data. Limited, privacy-friendly
                analytics may be used to understand how the app is used.
              </li>
              <li>
                Coog Planner is an{" "}
                <span className="font-semibold text-slate-50">
                  unofficial planning tool, not an official UH record
                </span>
                .
              </li>
              <li>
                You&apos;re responsible for confirming requirements with
                official UH resources and an academic advisor.
              </li>
            </ul>
          </div>
        </div>

        {/* Body */}
        <div className="space-y-6 text-sm leading-relaxed text-slate-300">
          {/* Intro & scope */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
              1. Introduction &amp; scope
            </h3>
            <p>
              Coog Planner is an independent degree and semester planning tool
              built for University of Houston students. This Privacy Policy
              explains what information we collect, how we use it, and the
              choices you have. By using Coog Planner, you agree to the
              collection and use of information in accordance with this policy.
            </p>
          </div>

          {/* Who we are */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
              2. Who we are (and who we aren&apos;t)
            </h3>
            <p>
              Coog Planner is an independent project and is{" "}
              <span className="font-semibold text-slate-50">
                not owned, operated, or endorsed by the University of Houston or
                the UH System
              </span>
              . Course, catalog, and degree information shown in Coog Planner is
              based on publicly available information or data that may be
              obtained through public information requests, and it can change at
              any time.
            </p>
          </div>

          {/* Information we collect */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
              3. Information we collect
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Information you provide
                </p>
                <ul className="space-y-1.5 text-xs sm:text-sm">
                  <li>
                    Account details (such as your email and password) if you
                    create an account.
                  </li>
                  <li>
                    Degree and course planning data you enter (intended major,
                    minors, planned semesters, notes).
                  </li>
                  <li>
                    Any academic planning info you manually add (for example,
                    courses you&apos;ve taken, grades, or unofficial transcript
                    details).
                  </li>
                  <li>Feedback, bug reports, or support messages you send.</li>
                </ul>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Information collected automatically
                </p>
                <ul className="space-y-1.5 text-xs sm:text-sm">
                  <li>
                    Basic usage data (pages visited, common actions, error
                    states) to improve performance and reliability.
                  </li>
                  <li>
                    Log data (IP address, browser type, timestamps) for security
                    and debugging.
                  </li>
                  <li>
                    Cookies or similar technologies to keep you signed in and
                    remember your session preferences.
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Analytics */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
              4. Analytics
            </h3>
            <p>
              Coog Planner may use privacy-friendly analytics tools to
              understand how the app is used (for example, which pages are most
              visited and where students get stuck). These tools focus on
              aggregate trends and are not used to sell your data or track you
              across unrelated sites.
            </p>
          </div>

          {/* How we use info */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
              5. How we use your information
            </h3>
            <ul className="list-disc space-y-1.5 pl-4">
              <li>
                To provide core Coog Planner features (degree planning,
                schedules, progress views).
              </li>
              <li>
                To save and personalize your experience so you don&apos;t lose
                your plans.
              </li>
              <li>
                To maintain, secure, and improve the site and fix bugs or
                performance issues.
              </li>
              <li>
                To communicate important updates, changes, or support responses
                related to your account.
              </li>
            </ul>
            <p className="mt-2">
              We{" "}
              <span className="font-semibold text-slate-50">
                do not sell or rent your personal information
              </span>{" "}
              to third-party advertisers.
            </p>
          </div>

          {/* Sharing */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
              6. When we share information
            </h3>
            <p>We may share information only in limited situations, such as:</p>
            <ul className="list-disc space-y-1.5 pl-4">
              <li>
                With service providers who help run Coog Planner (hosting,
                databases, monitoring) and only so they can provide those
                services.
              </li>
              <li>
                When required by law or to respond to valid legal requests.
              </li>
              <li>
                When necessary to protect our rights, safety, or the safety of
                others.
              </li>
            </ul>
            <p className="mt-2">
              We do <span className="font-semibold text-slate-50">not</span>{" "}
              sell your personal data to advertisers.
            </p>
          </div>

          {/* Security */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
              7. Security
            </h3>
            <p>
              We use reasonable technical and organizational measures to protect
              your data, including encrypted connections (HTTPS) and secure
              password storage. No online service can guarantee 100% security,
              but we work to keep Coog Planner as secure and reliable as we
              reasonably can.
            </p>
            <p className="mt-1 font-medium text-slate-100">
              Coog Planner will never ask you for your official UH login
              password, and you should not enter those credentials on this site.
            </p>
          </div>

          {/* Retention */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
              8. How long we keep your data
            </h3>
            <p>
              We keep your account and planning data for as long as your account
              is active. If you delete your account, we aim to remove or
              anonymize your personal data within a reasonable timeframe, except
              where we need to retain limited information for legal, security,
              or operational reasons (such as server logs).
            </p>
          </div>

          {/* Choices */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
              9. Your choices &amp; rights
            </h3>
            <ul className="list-disc space-y-1.5 pl-4">
              <li>
                View and update many parts of your planning data directly inside
                the app.
              </li>
              <li>
                Delete specific plans, notes, or your entire account if that
                feature is available.
              </li>
              <li>
                Contact us if you have questions about your data or want to
                request additional deletion.
              </li>
            </ul>
            <p className="mt-1">
              You can reach us at{" "}
              <span className="font-mono text-slate-100">
                support@coogplanner.com
              </span>{" "}
              (example address – update to your real one).
            </p>
          </div>

          {/* Unofficial tool disclaimer */}
          <div className="space-y-2 rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 text-amber-50">
            <div className="flex items-start gap-2">
              <div className="mt-0.5 text-lg" aria-hidden>
                ⚠️
              </div>
              <div>
                <p className="text-sm font-semibold">
                  10. Unofficial planning tool (not your official record)
                </p>
                <p className="mt-1 text-xs sm:text-sm">
                  Coog Planner is an{" "}
                  <span className="font-semibold">
                    unofficial planning tool
                  </span>
                  . It does not modify or replace your official student record,
                  does not act as an official degree audit, and does not
                  guarantee graduation or eligibility. Always confirm your
                  requirements with official University of Houston resources and
                  your academic advisor.
                </p>
              </div>
            </div>
          </div>

          {/* Changes */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
              11. Changes to this Privacy Policy
            </h3>
            <p>
              We may update this Privacy Policy from time to time. When we do,
              we&apos;ll update the &quot;Last updated&quot; date at the top of
              this page and may provide additional notice in the app if changes
              are significant.
            </p>
          </div>
        </div>
      </section>

      {/* Legal & Terms */}
      <section id="legal-terms" className="space-y-6 pt-6">
        <div className="flex items-start gap-3">
          <div className="mt-1 rounded-xl bg-slate-900/80 p-2 text-lg">
            <span aria-hidden>⚖️</span>
          </div>
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-slate-50 sm:text-xl">
              Legal Notices &amp; Terms
            </h2>
            <p className="mt-1 text-sm text-slate-300">
              Key legal disclaimers, acceptable use, and limitations of
              liability for using Coog Planner.
            </p>
          </div>
        </div>

        {/* TL;DR summary */}
        <div className="flex gap-3 rounded-xl border border-slate-700/80 bg-slate-900/80 p-4">
          <div className="mt-0.5 text-lg" aria-hidden>
            ℹ️
          </div>
          <div className="space-y-1 text-sm text-slate-200">
            <p className="font-semibold text-slate-50">TL;DR (short version)</p>
            <ul className="list-disc space-y-1 pl-4 text-slate-300">
              <li>Coog Planner is unofficial and not affiliated with UH.</li>
              <li>We do not guarantee accuracy of degree/curriculum info.</li>
              <li>
                It&apos;s not an official degree audit or graduation guarantee.
                Always verify with an advisor.
              </li>
              <li>
                You use the site at your own risk, and our liability is limited
                to the maximum allowed by law.
              </li>
            </ul>
          </div>
        </div>

        <div className="space-y-6 text-sm leading-relaxed text-slate-300">
          {/* Non-affiliation */}
          <div className="space-y-2 rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 text-amber-50">
            <div className="flex items-start gap-2">
              <div className="mt-0.5 text-lg" aria-hidden>
                ⚠️
              </div>
              <div>
                <h3 className="text-sm font-semibold">
                  1. Not affiliated with the University of Houston
                </h3>
                <p className="mt-1 text-xs sm:text-sm">
                  Coog Planner is an independent project and is{" "}
                  <span className="font-semibold">
                    not affiliated with, endorsed by, or sponsored by
                  </span>{" "}
                  the University of Houston, the UH System, or any of its
                  colleges or departments. Any references to &quot;UH,&quot;
                  &quot;Cougar,&quot; &quot;Coog,&quot; course names, or degree
                  programs are for identification and informational purposes
                  only.
                </p>
              </div>
            </div>
          </div>

          {/* Accuracy */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
              2. No guarantee of accuracy
            </h3>
            <p>
              Coog Planner may use data from public catalogs, official
              documents, and/or legally obtained records, but requirements can
              change, courses can be added or removed, and mistakes can occur.
              We do not guarantee that the information shown is complete,
              current, or error-free. Always verify critical information with
              official University of Houston sources and your academic advisor.
            </p>
          </div>

          {/* Not official degree audit */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
              3. Not an official degree audit or promise of graduation
            </h3>
            <p>
              Coog Planner provides estimates, visualizations, and planning
              tools only. It is{" "}
              <span className="font-semibold text-slate-50">
                not an official degree audit, academic record, or graduation
                guarantee
              </span>
              . You are responsible for confirming that you meet all academic
              and graduation requirements with the University of Houston.
            </p>
          </div>

          {/* Acceptable use */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
              4. Acceptable use
            </h3>
            <p>By using Coog Planner, you agree that you will not:</p>
            <ul className="list-disc space-y-1.5 pl-4">
              <li>Use the site for any unlawful or prohibited purpose.</li>
              <li>
                Attempt to disrupt, attack, or reverse-engineer the service or
                its underlying systems.
              </li>
              <li>
                Scrape, bulk-download, or otherwise misuse data in a way that
                harms performance or violates third-party terms of use.
              </li>
            </ul>
          </div>

          {/* IP */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
              5. Intellectual property
            </h3>
            <p>
              The Coog Planner name, logo, and site design are owned by the
              project&apos;s creator(s). You may not copy, reuse, or
              redistribute significant portions of the site&apos;s code, design,
              or branding without permission.
            </p>
            <p className="mt-1">
              University of Houston names and marks are the property of the
              University of Houston. Coog Planner does not claim ownership of UH
              marks and uses them only to identify courses and programs.
            </p>
          </div>

          {/* Limitation of liability */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
              6. Limitation of liability
            </h3>
            <p>
              To the maximum extent permitted by law, Coog Planner and its
              creators will not be liable for any indirect, incidental, special,
              consequential, or punitive damages, or for any loss of data,
              grades, scholarships, or opportunities arising out of or related
              to your use of (or inability to use) the site.
            </p>
            <p className="mt-1">
              Your use of Coog Planner is{" "}
              <span className="font-semibold text-slate-50">
                at your own risk
              </span>
              .
            </p>
          </div>

          {/* Third-party services */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
              7. Third-party services
            </h3>
            <p>
              Coog Planner may rely on third-party services such as hosting
              providers, databases, analytics tools, and error trackers. We are
              not responsible for the content, policies, or practices of those
              third parties. Your use of Coog Planner may also be subject to the
              terms and policies of those services.
            </p>
          </div>

          {/* Governing law */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
              8. Governing law
            </h3>
            <p>
              These terms are governed by the laws of the State of Texas,
              without regard to its conflict of law principles.
            </p>
          </div>

          {/* Not legal advice */}
          <div className="space-y-2 rounded-xl border border-slate-700/80 bg-slate-900/80 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              9. Not legal advice
            </p>
            <p className="mt-1 text-xs sm:text-sm">
              The information on this page is provided for general informational
              purposes only and does not constitute legal advice. If you have
              specific legal questions, you should consult with a qualified
              attorney.
            </p>
          </div>
        </div>
      </section>

      {/* Contact / footer note */}
      <section className="pt-4 text-sm text-slate-300">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
          Questions about this page?
        </h3>
        <p className="mt-2">
          If you have questions about how Coog Planner handles your data or
          about these terms, you can reach out at{" "}
          <span className="font-mono text-slate-100">
            support@coogplanner.com
          </span>{" "}
          (replace with your real contact). We&apos;re happy to clarify how
          things work.
        </p>
      </section>
    </div>
  );
}
