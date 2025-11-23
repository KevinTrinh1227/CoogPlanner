import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

// TODO: replace these placeholder URLs with your real links
const CHROME_WEB_STORE_URL =
  "https://chromewebstore.google.com/detail/coog-planner-extension";
const GITHUB_REPO_URL =
  "https://github.com/your-username/coog-planner-extension";

export const metadata: Metadata = {
  title: `Browser Extension – ${siteConfig.name}`,
  description:
    "Learn how the Coog Planner browser extension works, how to install it, and how to use it with UH systems.",
};

export default function BrowserExtensionPage() {
  return (
    <section
      id="browser-extension"
      className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8"
    >
      {/* Header */}
      <header className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Browser Extension
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-50 sm:text-4xl">
          Coog Planner browser extension 💻
        </h1>
        <p className="max-w-2xl text-sm text-slate-400">
          The Coog Planner browser extension adds an overlay on top of UH
          registration pages so you can see historical data, difficulty, and
          planning insights while you build your schedule.
        </p>

        {/* Primary CTAs */}
        <div className="flex flex-wrap items-center gap-3 pt-1">
          <a
            href={CHROME_WEB_STORE_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center rounded-full bg-red-400 px-4 py-1.5 text-sm font-semibold text-slate-950 shadow-sm hover:bg-red-300"
          >
            Install extension 🚀
          </a>
          <a
            href={GITHUB_REPO_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center rounded-full border border-slate-700 bg-slate-950 px-4 py-1.5 text-sm font-medium text-slate-100 hover:border-slate-500 hover:bg-slate-900"
          >
            View source on GitHub
          </a>
        </div>
      </header>

      {/* What it does – with collapsible feature cards */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-slate-50">What it does 🔍</h2>
        <p className="text-sm text-slate-300">
          At a high level, the extension stays out of your way but gives you way
          more context while you&apos;re registering for classes.
        </p>

        <div className="space-y-2">
          <details className="group rounded-xl border border-slate-800 bg-slate-950/60 p-3">
            <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-medium text-slate-100">
              <span>Overlay on UH registration and class search pages</span>
              <span className="text-xs text-slate-500 transition-transform group-open:rotate-90">
                ▶
              </span>
            </summary>
            <p className="mt-2 text-xs text-slate-400">
              When you open supported UH pages (class search, enrollment,
              schedule views), Coog Planner detects the page structure and
              renders a lightweight overlay. It does not break or replace the UH
              UI – it just augments it with extra context.
            </p>
          </details>

          <details className="group rounded-xl border border-slate-800 bg-slate-950/60 p-3">
            <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-medium text-slate-100">
              <span>Course &amp; instructor insights in place</span>
              <span className="text-xs text-slate-500 transition-transform group-open:rotate-90">
                ▶
              </span>
            </summary>
            <div className="mt-2 space-y-1 text-xs text-slate-400">
              <p>
                The overlay shows information tied to the course or section
                you&apos;re currently viewing, such as:
              </p>
              <ul className="list-disc space-y-1 pl-5">
                <li>Course history and patterns (when available)</li>
                <li>Instructor history and trends</li>
                <li>
                  Quick indicators to help you compare sections more
                  intelligently
                </li>
              </ul>
            </div>
          </details>

          <details className="group rounded-xl border border-slate-800 bg-slate-950/60 p-3">
            <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-medium text-slate-100">
              <span>Connects with your main Coog Planner dashboard</span>
              <span className="text-xs text-slate-500 transition-transform group-open:rotate-90">
                ▶
              </span>
            </summary>
            <p className="mt-2 text-xs text-slate-400">
              The extension uses the same data and rules as the main{" "}
              <span className="font-semibold text-slate-50">
                {siteConfig.domain}
              </span>{" "}
              site. You can jump back to your dashboard to fine-tune your degree
              plan, then return to UH pages and use the overlay while you
              actually enroll.
            </p>
          </details>

          <details className="group rounded-xl border border-slate-800 bg-slate-950/60 p-3">
            <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-medium text-slate-100">
              <span>Non-destructive, read-only helper</span>
              <span className="text-xs text-slate-500 transition-transform group-open:rotate-90">
                ▶
              </span>
            </summary>
            <p className="mt-2 text-xs text-slate-400">
              The extension reads the page to understand the courses and
              sections displayed, then overlays extra information. It does not
              submit forms, change your schedule, or perform actions in your UH
              account automatically – you stay in control.
            </p>
          </details>
        </div>
      </section>

      {/* Installation */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-slate-50">How to install</h2>
        <p className="text-sm text-slate-300">
          Installation steps will be finalized once the extension is live in the
          store. For now, here&apos;s the MVP flow:
        </p>
        <ol className="list-decimal space-y-2 pl-5 text-sm text-slate-300">
          <li>
            <span className="font-semibold">Chrome Web Store (planned):</span>{" "}
            Open the{" "}
            <a
              href={CHROME_WEB_STORE_URL}
              target="_blank"
              rel="noreferrer"
              className="font-medium text-red-400 hover:text-red-300"
            >
              Coog Planner extension listing
            </a>{" "}
            and click <span className="font-semibold">Add to Chrome</span>.
          </li>
          <li>
            <span className="font-semibold">Developer / local build:</span>{" "}
            Download the extension ZIP from{" "}
            <a
              href={GITHUB_REPO_URL}
              target="_blank"
              rel="noreferrer"
              className="font-medium text-red-400 hover:text-red-300"
            >
              the GitHub repo
            </a>
            , extract it, then:
            <ul className="mt-1 list-disc space-y-1 pl-5 text-xs text-slate-400">
              <li>
                Open{" "}
                <span className="font-mono text-slate-100">
                  chrome://extensions
                </span>
              </li>
              <li>
                Enable{" "}
                <span className="font-mono text-slate-100">Developer mode</span>
              </li>
              <li>
                Click{" "}
                <span className="font-mono text-slate-100">Load unpacked</span>{" "}
                and select the extension folder
              </li>
            </ul>
          </li>
        </ol>

        <div className="flex flex-wrap gap-3 pt-2">
          <a
            href={CHROME_WEB_STORE_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center rounded-full bg-slate-100 px-4 py-1.5 text-xs font-semibold text-slate-950 shadow-sm hover:bg-slate-200"
          >
            View on Chrome Web Store
          </a>
        </div>

        <p className="text-xs text-slate-500">
          Once the extension is published, this section will be updated with the
          exact install steps for each supported browser.
        </p>
      </section>

      {/* How to use */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-slate-50">How to use it</h2>
        <ol className="list-decimal space-y-2 pl-5 text-sm text-slate-300">
          <li>
            Sign in to your normal UH systems in your browser (myUH / PeopleSoft
            or other supported pages).
          </li>
          <li>
            Navigate to the class search or enrollment page you usually use to
            plan or add courses.
          </li>
          <li>
            When a supported page is detected, the Coog Planner overlay will
            appear near the edge of the screen with:
            <ul className="mt-1 list-disc space-y-1 pl-5 text-xs text-slate-400">
              <li>
                Course details and historical grade patterns (when available)
              </li>
              <li>Instructor information and trends</li>
              <li>
                Quick shortcuts back to your main{" "}
                <span className="font-mono text-slate-100">
                  {siteConfig.domain}
                </span>{" "}
                dashboard
              </li>
            </ul>
          </li>
          <li>
            Use the overlay to compare sections, check patterns, and then enroll
            in your chosen course directly in the UH interface.
          </li>
          <li>
            If the overlay ever looks off, you can temporarily hide it using the
            built-in toggle in the extension popup.
          </li>
        </ol>
      </section>

      {/* Browser compatibility */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-slate-50">
          Browser compatibility 🌐
        </h2>
        <p className="text-sm text-slate-300">
          The Coog Planner extension is built for Chromium-based browsers. It
          should work on any device/OS where these browsers support extensions
          (Windows, macOS, Linux, and ChromeOS).
        </p>

        <div className="grid gap-3 rounded-2xl border border-slate-800 bg-slate-950/60 p-4 text-sm text-slate-300 md:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Targeted &amp; expected to work
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Google Chrome</li>
              <li>Microsoft Edge</li>
              <li>Brave</li>
              <li>Opera</li>
              <li>Opera GX</li>
              <li>Vivaldi</li>
              <li>Chromium</li>
              <li>Arc (Chromium-based)</li>
              <li>Yandex Browser</li>
              <li>Other Chromium-based browsers</li>
            </ul>
            <p className="mt-2 text-xs text-slate-500">
              And more – if the browser supports installing Chrome-compatible
              extensions, Coog Planner should work there too.
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Not officially supported (yet)
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Mozilla Firefox</li>
              <li>Safari</li>
              <li>Non-extension mobile browsers</li>
            </ul>
            <p className="mt-2 text-xs text-slate-500">
              These browsers have different extension ecosystems. Future ports
              are possible but not guaranteed in the MVP.
            </p>
          </div>
        </div>
      </section>

      {/* Notes / safety */}
      <section className="space-y-3 rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
        <h2 className="text-sm font-semibold text-slate-50">
          Data, safety, and limitations ⚠️
        </h2>
        <ul className="list-disc space-y-2 pl-5 text-xs text-slate-400">
          <li>
            The extension only reads the parts of the page it needs to render
            its overlay (course codes, titles, sections, etc.).
          </li>
          <li>
            It does not attempt to modify UH systems or submit any actions on
            your behalf – you stay in control at all times.
          </li>
          <li>
            Actual policies, disclaimers, and privacy details will be finalized
            on the{" "}
            <a
              href="/privacy-legal"
              className="font-medium text-red-400 hover:text-red-300"
            >
              Privacy &amp; legal
            </a>{" "}
            page.
          </li>
        </ul>
      </section>

      {/* CTA */}
      <section className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-800 pt-6 text-sm">
        <div className="text-xs text-slate-500">
          This page is an MVP placeholder for the Coog Planner browser
          extension. Copy and screenshots can be tightened once the store
          listing and final UX are locked in.
        </div>
        <a
          href="#signup"
          className="inline-flex items-center rounded-full bg-red-400 px-4 py-1.5 text-xs font-semibold text-slate-950 shadow-sm hover:bg-red-300"
        >
          Get notified when it&apos;s ready
        </a>
      </section>
    </section>
  );
}
