"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const SAMPLE_VIDEOS = [
  { label: "Python OOP", url: "https://www.youtube.com/watch?v=E0Hmnixke2g" },
  { label: "ML Basics", url: "https://www.youtube.com/watch?v=W0cy1_r-bPc" },
  { label: "Data Science", url: "https://www.youtube.com/watch?v=ua-CiDNNj30" },
];

export default function Hero() {
  const router = useRouter();
  const [url, setUrl] = useState("");

  const handleTry = (targetUrl?: string) => {
    const val = targetUrl || url;
    if (!val.trim()) return;
    if (typeof window !== "undefined") {
      sessionStorage.setItem("pendingUrl", val.trim());
    }
    router.push("/app");
  };

  return (
    <section
      className="section"
      style={{
        paddingTop: "5.5rem",
        paddingBottom: "5.5rem",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <div className="section-inner" style={{ maxWidth: "52rem", textAlign: "center" }}>

        {/* Badge */}
        <div className="animate-fade-up" style={{ marginBottom: "1.5rem" }}>
          <span className="badge">
            <span style={{
              width: 7, height: 7, borderRadius: "50%",
              background: "var(--success)", flexShrink: 0,
              boxShadow: "0 0 0 2px color-mix(in srgb, var(--success) 30%, transparent)",
            }} />
            Powered by GPT-4o-mini · Free to try
          </span>
        </div>

        {/* Headline */}
        <h1
          className="animate-fade-up-delay-1"
          style={{
            marginBottom: "1rem",
            background: "linear-gradient(135deg, var(--fg) 60%, var(--brand))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Turn YouTube Lectures Into Smart Study Notes
        </h1>

        {/* Subheadline */}
        <p
          className="animate-fade-up-delay-2"
          style={{ fontSize: "1.05rem", maxWidth: "38rem", margin: "0 auto 2.25rem", color: "var(--fg-muted)" }}
        >
          Generate notes, cheat sheets, code examples, and visual learning aids from technical lectures in seconds.
        </p>

        {/* Input + CTA */}
        <div
          className="animate-fade-up-delay-2"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.75rem",
            alignItems: "center",
            marginBottom: "2rem",
          }}
        >
          <div style={{
            display: "flex",
            width: "100%",
            maxWidth: "36rem",
            gap: "0.5rem",
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "var(--r-lg)",
            padding: "0.375rem",
          }}>
            <input
              className="input-base"
              type="url"
              placeholder="Paste any YouTube lecture URL…"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleTry()}
              style={{
                background: "transparent",
                border: "none",
                borderRadius: "var(--r-md)",
                flex: 1,
                fontSize: "0.875rem",
                boxShadow: "none",
              }}
            />
            <button
              className="btn-primary"
              onClick={() => handleTry()}
              style={{ flexShrink: 0 }}
            >
              Try LearnScript
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>
          </div>

          {/* Sample pills */}
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", justifyContent: "center" }}>
            <span style={{ fontSize: "0.775rem", color: "var(--fg-faint)", alignSelf: "center" }}>Try with:</span>
            {SAMPLE_VIDEOS.map((v) => (
              <button
                key={v.label}
                onClick={() => handleTry(v.url)}
                style={{
                  padding: "0.25rem 0.75rem",
                  fontSize: "0.775rem",
                  color: "var(--fg-muted)",
                  background: "var(--bg-subtle)",
                  border: "1px solid var(--border)",
                  borderRadius: "99px",
                  cursor: "pointer",
                  transition: "all 0.15s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.color = "var(--fg)";
                  (e.currentTarget as HTMLElement).style.borderColor = "var(--brand)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.color = "var(--fg-muted)";
                  (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
                }}
              >
                {v.label}
              </button>
            ))}
          </div>
        </div>

        {/* Trust signals */}
        <div
          className="animate-fade-up-delay-2"
          style={{
            display: "flex",
            gap: "1.5rem",
            justifyContent: "center",
            flexWrap: "wrap",
            fontSize: "0.8rem",
            color: "var(--fg-faint)",
          }}
        >
          {[
            { icon: "🎓", text: "Built for students" },
            { icon: "💻", text: "Built for developers" },
            { icon: "🏆", text: "Built for interview prep" },
          ].map(({ icon, text }) => (
            <span key={text} style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
              <span style={{ fontSize: "13px" }}>{icon}</span>
              {text}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
