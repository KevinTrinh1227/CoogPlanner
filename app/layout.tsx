import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SearchBarWrapper from "@/components/SearchBarWrapper";

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
      <body className="bg-slate-950 text-slate-50 overflow-x-hidden">
        <div className="flex min-h-screen flex-col">
          <Navbar />
          <SearchBarWrapper />
          <main className="mx-auto flex-1 max-w-5xl px-4 py-8">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
