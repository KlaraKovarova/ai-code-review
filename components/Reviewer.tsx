"use client";

import { useState, useCallback } from "react";
import UpgradeModal from "./UpgradeModal";
import { DEMO_CODE, DEMO_LANGUAGE, DEMO_REVIEW } from "@/lib/demo";

const DAILY_KEY = "code_review_daily";
const FREE_LIMIT = 5;

const LANGUAGES = [
  "Auto-detect",
  "JavaScript",
  "TypeScript",
  "Python",
  "Go",
  "Rust",
  "Java",
  "C",
  "C++",
  "C#",
  "Ruby",
  "PHP",
  "Swift",
  "Kotlin",
  "SQL",
  "Bash",
  "Other",
];

const FOCUS_OPTIONS = [
  { id: "bugs", label: "Bugs & Logic Errors" },
  { id: "security", label: "Security" },
  { id: "performance", label: "Performance" },
  { id: "style", label: "Style & Readability" },
];

function getUsage(): number {
  if (typeof window === "undefined") return 0;
  try {
    const today = new Date().toISOString().split("T")[0];
    const stored = JSON.parse(localStorage.getItem(DAILY_KEY) ?? "null") as { count: number; date: string } | null;
    return stored?.date === today ? stored.count : 0;
  } catch {
    return 0;
  }
}

function incrementUsage(): number {
  const today = new Date().toISOString().split("T")[0];
  const count = getUsage() + 1;
  localStorage.setItem(DAILY_KEY, JSON.stringify({ count, date: today }));
  return count;
}

function copyText(text: string) {
  navigator.clipboard.writeText(text).catch(() => {});
}

export default function Reviewer() {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("Auto-detect");
  const [focus, setFocus] = useState<string[]>(["bugs", "security", "performance", "style"]);
  const [apiKey, setApiKey] = useState("");
  const [showByok, setShowByok] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [review, setReview] = useState("");
  const [isDemo, setIsDemo] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [usage, setUsage] = useState<number | null>(null);

  const toggleFocus = (id: string) =>
    setFocus((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );

  const runReview = useCallback(
    async (overrideCode?: string, overrideLang?: string) => {
      const targetCode = overrideCode ?? code;
      if (!targetCode.trim()) return;

      const currentUsage = getUsage();
      if (currentUsage >= FREE_LIMIT && !apiKey.trim()) {
        setShowUpgrade(true);
        return;
      }

      setLoading(true);
      setError("");
      setReview("");
      setIsDemo(false);

      try {
        const lang = overrideLang ?? (language === "Auto-detect" ? "" : language);
        const body: Record<string, unknown> = {
          code: targetCode,
          language: lang,
          focus,
        };
        if (apiKey.trim()) body.apiKey = apiKey.trim();

        const res = await fetch("/api/review", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        const data = (await res.json()) as {
          review?: string;
          error?: string;
          demo?: boolean;
        };
        if (!res.ok) throw new Error(data.error ?? "Review failed");
        setReview(data.review ?? "");
        setIsDemo(data.demo ?? false);
        const newUsage = incrementUsage();
        setUsage(newUsage);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    },
    [code, language, focus, apiKey]
  );

  function tryDemo() {
    setCode(DEMO_CODE);
    setLanguage(DEMO_LANGUAGE);
    setReview(DEMO_REVIEW);
    setIsDemo(true);
  }

  function handleCopy() {
    copyText(review);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const usageCount = usage ?? getUsage();
  const remaining = Math.max(0, FREE_LIMIT - usageCount);

  return (
    <>
      {showUpgrade && <UpgradeModal onClose={() => setShowUpgrade(false)} />}

      {/* Before/after demo showcase */}
      <div className="mb-12">
        <div className="text-center mb-4">
          <span className="text-xs font-semibold uppercase tracking-widest text-violet-400">
            See it in action
          </span>
          <h2 className="text-xl font-semibold text-white mt-1">
            Paste code → structured review in seconds
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            AI spots bugs, security holes, and performance issues — with fix suggestions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 rounded-2xl overflow-hidden border border-gray-800">
          {/* Left: code */}
          <div className="bg-gray-900 p-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
              <span className="text-xs text-gray-500 ml-2 font-mono">fetchUserData.js</span>
            </div>
            <pre className="text-xs text-gray-400 font-mono leading-relaxed overflow-auto max-h-72 whitespace-pre">
              {DEMO_CODE}
            </pre>
          </div>

          {/* Right: review snippet */}
          <div className="bg-gray-900 border-l border-gray-800 p-5 flex flex-col">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-mono text-gray-500">review.md</span>
              <span className="ml-auto text-xs bg-violet-900/60 text-violet-300 px-2 py-0.5 rounded-full">
                AI review
              </span>
            </div>
            <pre className="text-xs text-gray-300 font-mono leading-relaxed overflow-auto max-h-64 whitespace-pre-wrap flex-1">
              {DEMO_REVIEW.slice(0, 600)}…
            </pre>
            <button
              onClick={tryDemo}
              className="mt-4 w-full bg-violet-600 hover:bg-violet-500 text-white py-2.5 rounded-xl font-semibold text-sm transition-colors"
            >
              See full demo review →
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-5">
        {/* Input card */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4">
          {/* Language + focus row */}
          <div className="flex flex-wrap items-start gap-4">
            <div className="flex-1 min-w-[160px]">
              <label className="block text-xs text-gray-500 mb-1.5">Language</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-gray-200 text-sm focus:outline-none focus:border-violet-600 transition-colors"
              >
                {LANGUAGES.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-[3] min-w-[240px]">
              <label className="block text-xs text-gray-500 mb-1.5">Focus areas</label>
              <div className="flex flex-wrap gap-2">
                {FOCUS_OPTIONS.map(({ id, label }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => toggleFocus(id)}
                    className={`text-xs px-3 py-1.5 rounded-lg border transition-colors font-medium ${
                      focus.includes(id)
                        ? "bg-violet-600/20 border-violet-500 text-violet-300"
                        : "bg-gray-800 border-gray-700 text-gray-500 hover:border-gray-500"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Code textarea */}
          <div>
            <label className="block text-sm text-gray-400 mb-2" htmlFor="code-input">
              Code to review
            </label>
            <textarea
              id="code-input"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Paste your code here…"
              rows={14}
              spellCheck={false}
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-gray-100 placeholder-gray-600 focus:outline-none focus:border-violet-600 transition-colors text-sm font-mono leading-relaxed resize-y"
            />
            <p className="text-xs text-gray-600 mt-1 text-right">
              {code.length.toLocaleString()} / 20 000 chars
            </p>
          </div>

          {/* Submit + usage */}
          <div className="flex items-center justify-between gap-4">
            <p className="text-xs text-gray-600">
              {remaining > 0 ? (
                `${remaining} free review${remaining !== 1 ? "s" : ""} remaining today`
              ) : (
                <>
                  Daily limit reached —{" "}
                  <button
                    onClick={() => setShowUpgrade(true)}
                    className="text-violet-400 hover:text-violet-300 underline underline-offset-2"
                  >
                    upgrade for $5/mo
                  </button>
                </>
              )}
            </p>
            <button
              onClick={() => runReview()}
              disabled={loading || !code.trim()}
              className="bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-7 py-3 rounded-xl font-semibold text-sm transition-colors whitespace-nowrap flex items-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Reviewing…
                </>
              ) : (
                "Review Code"
              )}
            </button>
          </div>

          {/* BYOK toggle */}
          <div className="border-t border-gray-800 pt-4">
            <button
              type="button"
              onClick={() => setShowByok((v) => !v)}
              className="text-xs text-gray-500 hover:text-gray-300 flex items-center gap-1.5 transition-colors"
            >
              <span className={`transition-transform ${showByok ? "rotate-90" : ""}`}>▶</span>
              Use your own Anthropic API key (bypass limit)
            </button>

            {showByok && (
              <div className="mt-3 space-y-2">
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="sk-ant-…"
                  autoComplete="off"
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-gray-100 placeholder-gray-600 focus:outline-none focus:border-violet-600 transition-colors text-sm font-mono"
                />
                <p className="text-xs text-gray-600 leading-relaxed">
                  Your key is used only for this request — never logged, stored, or shared. Using your
                  own key bypasses the daily limit.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-950 border border-red-800 rounded-xl px-4 py-3 text-red-300 text-sm">
            {error}
          </div>
        )}

        {/* Review output */}
        {review && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-300">Code Review</span>
                {isDemo && (
                  <span className="text-xs bg-amber-900/60 text-amber-300 border border-amber-700/50 px-2 py-0.5 rounded-full">
                    Demo — add your API key to review your own code
                  </span>
                )}
              </div>
              <button
                onClick={handleCopy}
                className="text-sm bg-gray-800 hover:bg-gray-700 text-gray-300 px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
              >
                {copied ? "✓ Copied" : "Copy"}
              </button>
            </div>
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              className="w-full bg-transparent text-gray-300 font-mono text-xs leading-relaxed p-6 min-h-[500px] resize-y focus:outline-none"
              spellCheck={false}
            />
          </div>
        )}

        {/* Cross-promote other tools */}
        <div className="border border-gray-800 rounded-2xl p-6 bg-gray-900/50">
          <p className="text-xs text-gray-500 mb-3 font-medium uppercase tracking-wider">
            More AI developer tools
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="https://readme-gen.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-indigo-400 hover:text-indigo-300 bg-indigo-950/50 border border-indigo-800/50 px-3 py-1.5 rounded-lg transition-colors"
            >
              ReadmeGen — AI README generator
            </a>
            <a
              href="https://testgen-ai.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-emerald-400 hover:text-emerald-300 bg-emerald-950/50 border border-emerald-800/50 px-3 py-1.5 rounded-lg transition-colors"
            >
              TestGen·AI — unit test generator
            </a>
            <a
              href="https://commitcraft-ai.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-amber-400 hover:text-amber-300 bg-amber-950/50 border border-amber-800/50 px-3 py-1.5 rounded-lg transition-colors"
            >
              CommitCraft·AI — commit message generator
            </a>
            <a
              href="https://envgen-ai.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-cyan-400 hover:text-cyan-300 bg-cyan-950/50 border border-cyan-800/50 px-3 py-1.5 rounded-lg transition-colors"
            >
              EnvGen·AI — .env file generator
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
