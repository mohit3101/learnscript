"use client";

const steps = [
  {
    n: "01",
    title: "Paste a YouTube URL",
    body: "Any Python, ML, or dev lecture — up to 30 minutes.",
  },
  {
    n: "02",
    title: "AI reads the lecture",
    body: "GPT-4o-mini processes the transcript in parallel across all output types.",
  },
  {
    n: "03",
    title: "Get structured material",
    body: "Notes, cheat sheet, runnable code, and a visual mind map — all at once.",
  },
];

export default function HowItWorks() {
  return (
    <section className="section" style={{ background: "var(--bg-subtle)" }}>
      <div className="section-inner">
        <div style={{ marginBottom: "3rem" }}>
          <p style={{
            fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase",
            letterSpacing: "0.08em", color: "var(--brand)", marginBottom: "0.75rem",
          }}>
            How it works
          </p>
          <h2 style={{ color: "var(--fg)", maxWidth: "28rem" }}>
            From lecture to notes in 20 seconds
          </h2>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "1.5rem",
        }}>
          {steps.map((step) => (
            <div
              key={step.n}
              className="card"
              style={{ padding: "1.5rem" }}
            >
              <div style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.75rem",
                color: "var(--brand)",
                marginBottom: "1rem",
                fontWeight: 600,
              }}>
                {step.n}
              </div>
              <h3 style={{ fontSize: "1rem", marginBottom: "0.5rem", color: "var(--fg)" }}>
                {step.title}
              </h3>
              <p style={{ fontSize: "0.875rem", color: "var(--fg-muted)", margin: 0 }}>
                {step.body}
              </p>
            </div>
          ))}
        </div>

        {/* Speed callout */}
        <div style={{
          marginTop: "2rem",
          padding: "1rem 1.25rem",
          background: "color-mix(in srgb, var(--brand) 8%, transparent)",
          border: "1px solid color-mix(in srgb, var(--brand) 20%, transparent)",
          borderRadius: "var(--r-lg)",
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
          flexWrap: "wrap",
        }}>
          <span style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--brand)" }}>⚡ 20 seconds</span>
          <span style={{ fontSize: "0.875rem", color: "var(--fg-muted)" }}>
            vs 2–3 hours of manual note-taking. That&apos;s not a bug, it&apos;s the feature.
          </span>
        </div>
      </div>
    </section>
  );
}
