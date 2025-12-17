"use client";

import React, { useEffect, useRef, useState } from "react";

type Role = "user" | "assistant";
type ChatMessage = {
  id: string;
  role: Role;
  content: string;
  ts: number;
};

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

const STORAGE_KEY = "coogplanner.ask.mvp.chat.v1";

const popularCard =
  "w-full rounded-2xl border border-slate-800 bg-slate-900/45 px-4 py-3 text-left " +
  "transition-[color,background-color,border-color,box-shadow] duration-150 " +
  "hover:bg-slate-900/70 hover:border-brand-light/80 hover:text-brand-light " +
  "hover:shadow-[0_0_0_3px_rgba(255,255,255,0.03),0_0_26px_rgba(99,102,241,0.22)] " +
  "focus-visible:outline-none focus-visible:ring focus-visible:ring-brand-light/55 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950";

const sendCircleButton =
  "inline-flex h-12 w-12 items-center justify-center rounded-full bg-red-400 text-base font-black text-slate-950 " +
  "transition-[background-color,box-shadow,filter] duration-150 " +
  "hover:bg-red-300 hover:shadow-[0_0_0_3px_rgba(255,255,255,0.03),0_0_24px_rgba(248,113,113,0.28)] " +
  "focus-visible:outline-none focus-visible:ring focus-visible:ring-red-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950";

function uid() {
  return Math.random().toString(16).slice(2) + Date.now().toString(16);
}

const POPULAR_ASKS: Array<{ emoji: string; text: string }> = [
  { emoji: "🧾", text: "Do I meet prerequisites for COSC 2436?" },
  { emoji: "📚", text: "What classes should I take next semester for COSC?" },
  { emoji: "🗓️", text: "Help me plan a path to graduate by Spring 2027." },
  { emoji: "🧠", text: "What does this requirement mean in plain English?" },
  {
    emoji: "🔎",
    text: "Compare catalog year requirements (2023 vs 2024) for my major.",
  },
  {
    emoji: "⚖️",
    text: "Build me a 4-class semester plan with lighter workload.",
  },
];

export default function AskChatClient() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);

  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as ChatMessage[];
      if (Array.isArray(parsed)) setMessages(parsed);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {
      // ignore
    }
  }, [messages]);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages, thinking]);

  const isNewChat = messages.length === 0;

  function pushMessage(role: Role, content: string) {
    setMessages((prev) => [
      ...prev,
      { id: uid(), role, content: content.trim(), ts: Date.now() },
    ]);
  }

  async function send(text?: string) {
    const value = (text ?? input).trim();
    if (!value || thinking) return;

    pushMessage("user", value);
    setInput("");
    setThinking(true);

    // MVP simulated response — swap later with API call
    window.setTimeout(() => {
      const reply =
        "✅ Got it. This is the Ask CoogPlanner MVP UI.\n\n" +
        "When the backend is wired, responses will render here in the same format.";
      pushMessage("assistant", reply);
      setThinking(false);
    }, 450);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  function insertPrompt(p: string) {
    setInput(p);
    inputRef.current?.focus();
  }

  function Composer({
    centered,
    singleLine,
  }: {
    centered?: boolean;
    singleLine?: boolean;
  }) {
    const disabled = !input.trim() || thinking;

    return (
      <div className={cn(centered ? "w-full max-w-2xl" : "w-full")}>
        <div className="flex items-stretch gap-2">
          <div className="flex-1">
            <label htmlFor="ask-input" className="sr-only">
              Message
            </label>

            <textarea
              id="ask-input"
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              rows={singleLine ? 1 : 2}
              placeholder="Ask CoogPlanner AI"
              className={cn(
                "w-full resize-none rounded-2xl border border-slate-800 bg-slate-900/40 px-4 text-sm text-slate-100",
                "outline-none transition-[border-color,box-shadow] duration-150",
                "focus:border-brand-light/80 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.20)]",
                "placeholder:text-slate-500",
                singleLine ? "h-12 py-3 leading-[1.25rem]" : "py-3"
              )}
            />
          </div>

          <button
            type="button"
            className={cn(
              sendCircleButton,
              disabled && "opacity-60 hover:bg-red-400 hover:shadow-none"
            )}
            onClick={() => send()}
            disabled={disabled}
            aria-label="Send message"
            title="Send"
          >
            <span aria-hidden className="leading-none">
              →
            </span>
          </button>
        </div>
      </div>
    );
  }

  // NEW CHAT LANDING
  if (isNewChat) {
    return (
      <section className="flex flex-col items-center gap-4 pt-6 sm:pt-10">
        <div className="w-full max-w-2xl space-y-2 text-center">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Ask CoogPlanner AI
          </p>
          <h1 className="text-balance text-2xl font-semibold tracking-tight text-slate-50 sm:text-3xl">
            What can I help you plan?
          </h1>
          <p className="text-sm leading-relaxed text-slate-300">
            Ask about prerequisites, requirements, or building a semester plan.
          </p>
        </div>

        <Composer centered singleLine />

        <div className="w-full max-w-2xl pt-2">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
            Popular asks
          </p>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {POPULAR_ASKS.map((item) => (
              <button
                key={item.text}
                type="button"
                onClick={() => insertPrompt(item.text)}
                className={popularCard}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-slate-800 bg-slate-950/40 text-sm">
                    <span aria-hidden>{item.emoji}</span>
                  </div>
                  <p className="text-xs font-semibold leading-snug text-slate-200">
                    {item.text}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // CHAT VIEW
  return (
    <section className="flex flex-col gap-4">
      <div className="rounded-2xl border border-slate-800 bg-slate-950/60">
        <div
          ref={scrollerRef}
          className="h-[62vh] min-h-[420px] overflow-y-auto px-4 py-4"
          role="log"
          aria-live="polite"
          aria-relevant="additions"
        >
          <div className="flex flex-col gap-3">
            {messages.map((m) => (
              <div
                key={m.id}
                className={cn(
                  "flex w-full",
                  m.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "max-w-[92%] rounded-2xl border px-4 py-3 text-sm leading-relaxed sm:max-w-[78%]",
                    m.role === "user"
                      ? "border-brand-light/40 bg-slate-900/70 text-slate-100"
                      : "border-slate-800 bg-slate-950/50 text-slate-200"
                  )}
                >
                  <div className="whitespace-pre-wrap break-words">
                    {m.content}
                  </div>
                </div>
              </div>
            ))}

            {thinking && (
              <div className="flex justify-start">
                <div className="max-w-[92%] rounded-2xl border border-slate-800 bg-slate-950/50 px-4 py-3 text-sm text-slate-300 sm:max-w-[78%]">
                  <span className="mr-2" aria-hidden>
                    ⏳
                  </span>
                  Thinking…
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-slate-800 px-4 py-3">
          <Composer />
        </div>
      </div>
    </section>
  );
}
