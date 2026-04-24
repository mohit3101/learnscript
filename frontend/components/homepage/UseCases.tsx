"use client";

const useCases = [
  {
    audience: "Students",
    emoji: "🎓",
    headline: "Stop rewatching. Start revising.",
    points: [
      "Turn 1-hour lectures into 5-minute notes",
      "Pre-made cheat sheets before every exam",
      "No more scrambling for notes the night before",
    ],
  },
  {
    audience: "Developers",
    emoji: "💻",
    headline: "Learn a new framework in your lunch break.",
    points: [
      "Extract runnable code from tutorials instantly",
      "Reference cheat sheets while you build",
      "Never lose track of what you watched and learned",
    ],
  },
  {
    audience: "Interview Prep",
    emoji: "🏆",
    headline: "DSA, ML, and system design — all organized.",
    points: [
      "Code examples from every NeetCode / AlgoExpert video",
      "Concept tables for quick revision before interviews",
      "Visual mind maps to see the big picture",
    ],
  },
];

export default function UseCases() {
  return (
    <section className="section" style={{ background: "var(--bg-subtle)" }}>
      <div className="section-inner">
        <div style={{ marginBottom: "3rem" }}>
          <p style={{
            fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase",
            letterSpacing: "0.08em", color: "var(--brand)", marginBottom: "0.75rem",
          }}>
            Who it&apos;s for
          </p>
          <h2 style={{ color: "var(--fg)" }}>Built for every kind of learner</h2>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "1rem",
        }}>
          {useCases.map((uc) => (
            <div key={uc.audience} className="card" style={{ padding: "1.75rem" }}>
              <div style={{ fontSize: "1.75rem", marginBottom: "1rem" }}>{uc.emoji}</div>
              <div style={{
                fontSize: "0.7rem", fontWeight: 600,
                textTransform: "uppercase", letterSpacing: "0.06em",
                color: "var(--brand)", marginBottom: "0.5rem",
              }}>
                {uc.audience}
              </div>
              <h3 style={{ fontSize: "1rem", marginBottom: "1rem", color: "var(--fg)", lineHeight: 1.4 }}>
                {uc.headline}
              </h3>
              <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "0.625rem" }}>
                {uc.points.map((pt) => (
                  <li key={pt} style={{ display: "flex", gap: "0.5rem", alignItems: "flex-start" }}>
                    <svg
                      width="14" height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{ color: "var(--success)", flexShrink: 0, marginTop: 2 }}
                    >
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    <span style={{ fontSize: "0.85rem", color: "var(--fg-muted)", lineHeight: 1.5 }}>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
