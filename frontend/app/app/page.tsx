"use client";

import { useState, useEffect, useCallback } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { NotesRenderer, MindmapRenderer } from "@/components/MarkdownRenderer";
import { createClient } from "@/lib/supabase";

/* ─── Types ──────────────────────────────────────────────────────────── */
interface GeneratedContent {
  notes: string;
  cheatsheet: string;
  code: string;
  mindmap: string;
}
interface GenerateResult {
  success: boolean;
  video_id: string;
  duration: number;
  content: GeneratedContent;
}

type Tab = "notes" | "cheatsheet" | "code" | "mindmap";

const API_URL = "https://learnscript-production.up.railway.app";

/* ─── Helpers ─────────────────────────────────────────────────────────── */
function isYouTubeUrl(url: string) {
  return /^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\/.+/.test(url.trim());
}
function formatDuration(secs: number) {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

/* ─── Loading Skeleton ───────────────────────────────────────────────── */
function LoadingSkeleton() {
  return (
    <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "0.875rem" }}>
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          style={{
            height: i === 1 ? 20 : 14,
            width: i === 4 ? "60%" : i === 3 ? "80%" : "100%",
            background: "var(--bg-input)",
            borderRadius: "var(--r-sm)",
            animation: "pulse 1.6s ease-in-out infinite",
          }}
        />
      ))}
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}`}</style>
    </div>
  );
}

/* ─── Empty State ─────────────────────────────────────────────────────── */
function EmptyState({ onDemo }: { onDemo: () => void }) {
  return (
    <div style={{
      padding: "3.5rem 1.5rem",
      textAlign: "center",
      borderRadius: "var(--r-lg)",
      border: "1px dashed var(--border)",
      background: "var(--bg-subtle)",
    }}>
      <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>📚</div>
      <h3 style={{ fontSize: "1rem", marginBottom: "0.5rem", color: "var(--fg)" }}>
        Your notes will appear here
      </h3>
      <p style={{ fontSize: "0.875rem", color: "var(--fg-muted)", marginBottom: "1.25rem" }}>
        Paste a YouTube lecture URL above and click Generate.
      </p>
      <button className="btn-ghost" onClick={onDemo} style={{ fontSize: "0.8rem" }}>
        Try a demo lecture
      </button>
    </div>
  );
}

/* ─── Copy button ─────────────────────────────────────────────────────── */
function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };
  return (
    <button
      className="btn-ghost"
      onClick={handleCopy}
      style={{ padding: "0.35rem 0.75rem", fontSize: "0.775rem", gap: "0.375rem" }}
    >
      {copied ? (
        <>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--success)" }}><polyline points="20 6 9 17 4 12"/></svg>
          Copied
        </>
      ) : (
        <>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
          Copy
        </>
      )}
    </button>
  );
}

/* ─── Main Page ──────────────────────────────────────────────────────── */
export default function AppPage() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<GenerateResult | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("notes");
  const [user, setUser] = useState<{ id: string; email?: string } | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const supabase = createClient();

  /* Auth state */
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  /* Pick up pending URL from homepage */
  useEffect(() => {
    const pending = sessionStorage.getItem("pendingUrl");
    if (pending) {
      sessionStorage.removeItem("pendingUrl");
      setUrl(pending);
    }
  }, []);

  /* ─ Generate ─ */
  const handleGenerate = useCallback(async (targetUrl?: string) => {
    const finalUrl = (targetUrl || url).trim();
    if (!finalUrl) { setError("Please paste a YouTube URL."); return; }
    if (!isYouTubeUrl(finalUrl)) { setError("That doesn't look like a YouTube URL."); return; }

    setError(null);
    setResult(null);
    setSaved(false);
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: finalUrl }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || `Error ${res.status}`);
      }
      const data: GenerateResult = await res.json();
      setResult(data);
      setActiveTab("notes");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [url]);

  /* ─ Save to Supabase ─ */
  const handleSave = useCallback(async () => {
    if (!result || !user) return;
    setSaving(true);
    try {
      await supabase.from("notes").insert({
        user_id: user.id,
        video_id: result.video_id,
        video_url: url,
        duration: result.duration,
        notes: result.content.notes,
        cheatsheet: result.content.cheatsheet,
        code: result.content.code,
        mindmap: result.content.mindmap,
      });
      setSaved(true);
    } catch {
      /* silent */
    } finally {
      setSaving(false);
    }
  }, [result, user, url, supabase]);

  /* ─ Export Markdown ─ */
  const handleExportMarkdown = () => {
    if (!result) return;
    const c = result.content;
    const md = `# LearnScript Notes\n\n## Notes\n${c.notes}\n\n## Cheat Sheet\n${c.cheatsheet}\n\n## Code Examples\n${c.code}\n\n## Mind Map\n${c.mindmap}`;
    const blob = new Blob([md], { type: "text/markdown" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `learnscript-${result.video_id}.md`;
    a.click();
  };

  /* ─ Auth ─ */
  const handleSignIn = () => supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo: `${window.location.origin}/app` } });
  const handleSignOut = () => supabase.auth.signOut();

  const activeContent = result ? result.content[activeTab] : null;

  const tabs: { key: Tab; label: string }[] = [
    { key: "notes", label: "Notes" },
    { key: "cheatsheet", label: "Cheat Sheet" },
    { key: "code", label: "Code" },
    { key: "mindmap", label: "Mind Map" },
  ];

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--bg)" }}>

      {/* ─── Navbar ─────────────────────────────────────────────────── */}
      <nav className="navbar" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 1.25rem" }}>

        {/* Left: logo + links */}
        <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
          <a href="/" style={{ display: "flex", alignItems: "center", gap: "0.5rem", textDecoration: "none", color: "var(--fg)" }}>
            <div style={{
              width: 28, height: 28, borderRadius: "var(--r-md)", background: "var(--brand)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
              </svg>
            </div>
            <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>LearnScript</span>
          </a>
          <a href="/history" style={{ fontSize: "0.825rem", color: "var(--fg-muted)", display: "none" }}
            id="history-link">
            History
          </a>
        </div>

        {/* Right: theme + auth */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <ThemeToggle />
          {user ? (
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <a href="/history">
                <button className="btn-ghost" style={{ padding: "0.35rem 0.75rem", fontSize: "0.8rem" }}>
                  History
                </button>
              </a>
              <button className="btn-ghost" onClick={handleSignOut} style={{ padding: "0.35rem 0.75rem", fontSize: "0.8rem" }}>
                Sign out
              </button>
            </div>
          ) : (
            <button className="btn-primary" onClick={handleSignIn} style={{ padding: "0.4rem 0.875rem", fontSize: "0.8rem" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ opacity: 0.9 }}>
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Sign in with Google
            </button>
          )}
        </div>
      </nav>

      {/* ─── Main Content ──────────────────────────────────────────── */}
      <main style={{ flex: 1, padding: "2rem 1.25rem", maxWidth: "54rem", width: "100%", margin: "0 auto" }}>

        {/* Input panel */}
        <div style={{ marginBottom: "2rem" }}>
          <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--fg-muted)", marginBottom: "0.5rem", letterSpacing: "0.04em", textTransform: "uppercase" }}>
            YouTube URL
          </label>
          <div style={{
            display: "flex",
            gap: "0.5rem",
            flexWrap: "wrap",
          }}>
            <input
              className="input-base"
              type="url"
              placeholder="https://youtube.com/watch?v=..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !loading && handleGenerate()}
              style={{ flex: "1 1 280px", minWidth: 0 }}
            />
            <button
              className="btn-primary"
              onClick={() => handleGenerate()}
              disabled={loading}
              style={{ flexShrink: 0 }}
            >
              {loading ? (
                <>
                  <span className="loading-dots" aria-hidden>
                    <span/><span/><span/>
                  </span>
                  Processing…
                </>
              ) : (
                <>
                  Generate
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </>
              )}
            </button>
          </div>

          {/* Error */}
          {error && (
            <div style={{
              marginTop: "0.75rem",
              padding: "0.625rem 0.875rem",
              background: "color-mix(in srgb, var(--danger) 10%, transparent)",
              border: "1px solid color-mix(in srgb, var(--danger) 25%, transparent)",
              borderRadius: "var(--r-md)",
              color: "var(--danger)",
              fontSize: "0.85rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              {error}
            </div>
          )}
        </div>

        {/* Result area */}
        {!result && !loading && (
          <EmptyState onDemo={() => { setUrl("https://www.youtube.com/watch?v=E0Hmnixke2g"); handleGenerate("https://www.youtube.com/watch?v=E0Hmnixke2g"); }} />
        )}

        {(loading || result) && (
          <div className="card animate-fade-in">

            {/* Card header */}
            {result && (
              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0.875rem 1.25rem",
                borderBottom: "1px solid var(--border)",
                flexWrap: "wrap",
                gap: "0.5rem",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
                  <span style={{
                    fontFamily: "var(--font-mono)", fontSize: "0.75rem",
                    color: "var(--fg-faint)", background: "var(--bg-input)",
                    padding: "0.2rem 0.5rem", borderRadius: "var(--r-sm)",
                  }}>
                    {result.video_id}
                  </span>
                  <span style={{ fontSize: "0.8rem", color: "var(--fg-muted)" }}>
                    {formatDuration(result.duration)} lecture
                  </span>
                  <span style={{
                    fontSize: "0.7rem", fontWeight: 600, color: "var(--success)",
                    background: "color-mix(in srgb, var(--success) 12%, transparent)",
                    padding: "0.15rem 0.5rem", borderRadius: "99px",
                    border: "1px solid color-mix(in srgb, var(--success) 25%, transparent)",
                  }}>
                    Ready
                  </span>
                </div>
                <div style={{ display: "flex", gap: "0.375rem", flexWrap: "wrap" }}>
                  <CopyButton text={activeContent || ""} />
                  <button className="btn-ghost" onClick={handleExportMarkdown} style={{ padding: "0.35rem 0.75rem", fontSize: "0.775rem" }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                    Markdown
                  </button>
                  {user && !saved && (
                    <button
                      className="btn-primary"
                      onClick={handleSave}
                      disabled={saving}
                      style={{ padding: "0.35rem 0.875rem", fontSize: "0.775rem" }}
                    >
                      {saving ? "Saving…" : "Save notes"}
                    </button>
                  )}
                  {saved && (
                    <span style={{ fontSize: "0.775rem", color: "var(--success)", alignSelf: "center", display: "flex", alignItems: "center", gap: 4 }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                      Saved
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Tabs */}
            {result && (
              <div style={{ padding: "0.75rem 1.25rem", borderBottom: "1px solid var(--border)" }}>
                <div className="result-tabs">
                  {tabs.map((t) => (
                    <button
                      key={t.key}
                      className={`result-tab${activeTab === t.key ? " active" : ""}`}
                      onClick={() => setActiveTab(t.key)}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Content */}
            <div style={{ padding: "1.5rem 1.25rem", minHeight: "24rem" }}>
              {loading ? (
                <LoadingSkeleton />
              ) : result && activeContent ? (
                <div className="animate-fade-in">
                  {activeTab === "mindmap" ? (
                    <MindmapRenderer content={activeContent} />
                  ) : (
                    <NotesRenderer content={activeContent} />
                  )}
                </div>
              ) : null}
            </div>
          </div>
        )}
      </main>

      {/* ─── Minimal footer in app view ─────────────────────────────── */}
      <div style={{
        padding: "1rem 1.25rem",
        borderTop: "1px solid var(--border)",
        textAlign: "center",
        fontSize: "0.75rem",
        color: "var(--fg-faint)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "0.375rem",
      }}>
        Built with
        <svg width="11" height="11" viewBox="0 0 24 24" fill="#ef4444"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
        by{" "}
        <a href="https://www.linkedin.com/in/mohit-jhalani-3a282856/" target="_blank" rel="noopener noreferrer" style={{ color: "var(--brand)", fontWeight: 600 }}>
          MojoJojo
        </a>
        · <a href="/" style={{ color: "var(--fg-faint)" }}>LearnScript</a>
      </div>
    </div>
  );
}
