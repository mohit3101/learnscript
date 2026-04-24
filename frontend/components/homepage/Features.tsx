"use client";

const features = [
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
      </svg>
    ),
    title: "Structured Notes",
    desc: "Hierarchical headings, bullet points, tables, and highlighted key concepts.",
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>
    ),
    title: "Cheat Sheets",
    desc: "Quick-reference comparison tables and formulas for revision sessions.",
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
      </svg>
    ),
    title: "Code Examples",
    desc: "Clean, commented Python snippets extracted directly from the lecture.",
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
      </svg>
    ),
    title: "Visual Mind Maps",
    desc: "Mermaid-rendered concept trees showing topic relationships at a glance.",
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
      </svg>
    ),
    title: "PDF & Markdown Export",
    desc: "Download your notes in any format. Take them anywhere.",
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
      </svg>
    ),
    title: "Private by Default",
    desc: "Row-level security via Supabase. Your notes are only yours.",
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
    title: "Notes History",
    desc: "Every generation is saved to your account. Never lose your notes.",
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
    title: "30-Min Limit",
    desc: "Focused on dense technical lectures — not 3-hour documentary vlogs.",
  },
];

export default function Features() {
  return (
    <section className="section">
      <div className="section-inner">
        <div style={{ marginBottom: "3rem" }}>
          <p style={{
            fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase",
            letterSpacing: "0.08em", color: "var(--brand)", marginBottom: "0.75rem",
          }}>
            Features
          </p>
          <h2 style={{ color: "var(--fg)" }}>
            Everything you need to study smarter
          </h2>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
          gap: "1px",
          background: "var(--border)",
          border: "1px solid var(--border)",
          borderRadius: "var(--r-xl)",
          overflow: "hidden",
        }}>
          {features.map((f) => (
            <div
              key={f.title}
              style={{
                background: "var(--bg-card)",
                padding: "1.5rem",
                transition: "background 0.15s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = "var(--bg-subtle)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = "var(--bg-card)";
              }}
            >
              <div style={{
                width: 36, height: 36, borderRadius: "var(--r-md)",
                background: "var(--brand-muted)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "var(--brand)",
                marginBottom: "0.875rem",
              }}>
                {f.icon}
              </div>
              <h4 style={{ fontSize: "0.9rem", marginBottom: "0.375rem", color: "var(--fg)" }}>
                {f.title}
              </h4>
              <p style={{ fontSize: "0.8rem", color: "var(--fg-muted)", margin: 0, lineHeight: 1.6 }}>
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
