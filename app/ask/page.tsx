// app/ask/page.tsx
import type { Metadata } from "next";
import AskChatClient from "@/components/ask/AskChatClient";

export const metadata: Metadata = {
  title: "Ask CoogPlanner | Coog Planner",
  description: "Ask CoogPlanner (MVP UI).",
};

export default function AskPage() {
  return (
    <div className="mx-auto flex max-w-5xl flex-col px-4 py-10 lg:py-14">
      <AskChatClient />
    </div>
  );
}
