// app/layout.tsx
import type { Metadata } from "next";
import React, { Suspense } from "react";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SearchBarWrapper from "@/components/SearchBarWrapper";
import GlobalModalRoot from "@/components/modals/GlobalModalRoot";

export const metadata: Metadata = {
  title: "Coog Planner",
  description: "UH degree & semester planning",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-50 overflow-x-hidden overflow-y-scroll">
        <div className="flex min-h-screen flex-col">
          <Navbar />
          <SearchBarWrapper />

          {/* MAIN: full width, no mx-auto / max-w / px here */}
          <main className="flex-1">{children}</main>

          {/* URL-driven global modals (needs Suspense because it uses useSearchParams) */}
          <Suspense fallback={null}>
            <GlobalModalRoot />
          </Suspense>

          <Footer />
        </div>
      </body>
    </html>
  );
}
