// app/(auth)/login/page.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;

    // 🔒 Placeholder: integrate Supabase / auth here later.
    setIsSubmitting(true);

    // Simulated async no-op
    window.setTimeout(() => {
      setIsSubmitting(false);
    }, 600);
  };

  const handleGoogleLogin = () => {
    // 🔒 Placeholder for Supabase Google OAuth
    // e.g. supabase.auth.signInWithOAuth({ provider: "google" })
  };

  return (
    <div className="min-h-screen text-slate-50 flex items-start justify-center px-4 pt-10 pb-6 sm:pt-16 sm:pb-8">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950/70 shadow-xl shadow-black/40 backdrop-blur-sm">
          <div className="px-5 py-6 sm:px-6 sm:py-7">
            {/* Header inside card */}
            <div className="mb-5 text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                CoogPlanner
              </p>
              <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-50">
                Welcome back
              </h1>
              <p className="mt-1 text-sm text-slate-400">
                Sign in to view your degree progress and personalized plans.
              </p>
            </div>

            {/* Google login */}
            <div className="space-y-3">
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-700 bg-slate-900/80 px-4 py-2.5 text-sm font-medium text-slate-100 shadow-sm hover:border-slate-500 hover:bg-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400"
              >
                <span className="flex h-5 w-5 items-center justify-center rounded-[4px] bg-white text-[11px] font-bold text-slate-900">
                  G
                </span>
                <span>Continue with Google</span>
              </button>

              {/* Divider */}
              <div className="flex items-center gap-2 text-[10px] text-slate-500">
                <div className="h-px flex-1 bg-slate-800" />
                <span>or continue with email</span>
                <div className="h-px flex-1 bg-slate-800" />
              </div>
            </div>

            {/* Email/password form */}
            <form onSubmit={handleSubmit} className="mt-4 space-y-4" noValidate>
              {/* Email */}
              <div className="space-y-1.5">
                <label
                  htmlFor="email"
                  className="block text-xs font-medium uppercase tracking-wide text-slate-300"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="block w-full rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-slate-50 outline-none ring-0 placeholder:text-slate-500 focus:border-rose-400 focus:ring-2 focus:ring-rose-500/40"
                  placeholder="you@uh.edu"
                />
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <label
                    htmlFor="password"
                    className="block text-xs font-medium uppercase tracking-wide text-slate-300"
                  >
                    Password
                  </label>
                  <button
                    type="button"
                    className="text-[11px] font-medium text-rose-300 hover:text-rose-200 hover:underline underline-offset-2"
                  >
                    Forgot?
                  </button>
                </div>
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="block w-full rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-slate-50 outline-none ring-0 placeholder:text-slate-500 focus:border-rose-400 focus:ring-2 focus:ring-rose-500/40"
                  placeholder="••••••••"
                />
              </div>

              {/* Remember me */}
              <div className="flex items-center justify-between gap-3 pt-1">
                <label className="inline-flex items-center gap-2 text-[11px] text-slate-400">
                  <input
                    type="checkbox"
                    className="h-3.5 w-3.5 rounded border-slate-600 bg-slate-900 text-rose-500 accent-rose-500 focus:ring-rose-500/60 focus:ring-offset-0"
                  />
                  <span>Remember me on this device</span>
                </label>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-2 inline-flex w-full items-center justify-center rounded-lg bg-rose-500 px-4 py-2.5 text-sm font-semibold text-slate-50 shadow-sm shadow-rose-900/40 transition-transform transition-shadow hover:-translate-y-[1px] hover:bg-rose-400 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? "Signing in…" : "Sign in"}
              </button>

              {/* Divider */}
              <div className="pt-3 text-center text-[11px] text-slate-500">
                <span>Don&apos;t have an account? </span>
                <Link
                  href="/signup"
                  className="font-medium text-rose-300 hover:text-rose-200 hover:underline underline-offset-2"
                >
                  Create one
                </Link>
              </div>
            </form>
          </div>
        </div>

        {/* Tiny footer text */}
        <p className="mt-4 text-center text-[10px] text-slate-500">
          By signing in, you agree to the CoogPlanner terms and privacy policy.
        </p>
      </div>
    </div>
  );
}
