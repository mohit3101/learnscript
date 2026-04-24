"use client";

export default function Footer() {
  return (
    <footer
      style={{
        borderTop: "1px solid var(--border)",
        padding: "2rem 1.25rem",
        background: "var(--bg-subtle)",
      }}
    >
      <div
        className="section-inner"
        style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "1rem",
        }}
      >
        {/* Brand */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
          <div style={{
            width: 28, height: 28,
            background: "var(--brand)",
            borderRadius: "var(--r-md)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
            </svg>
          </div>
          <span style={{ fontWeight: 600, fontSize: "0.9rem", color: "var(--fg)" }}>LearnScript</span>
        </div>

        {/* Center text */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", fontSize: "0.825rem", color: "var(--fg-faint)" }}>
          Built with
          <svg width="13" height="13" viewBox="0 0 24 24" fill="#ef4444" stroke="none">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
          by
          <a
            href="https://www.linkedin.com/in/mohit-jhalani-3a282856/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontWeight: 600, color: "var(--brand)" }}
          >
            MojoJojo
          </a>
        </div>

        {/* Links */}
        <div style={{ display: "flex", gap: "1.25rem", alignItems: "center" }}>
          <a
            href="https://github.com/mohit3101/learnscript"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "var(--fg-faint)", transition: "color 0.15s", display: "flex", alignItems: "center", gap: 6, fontSize: "0.8rem" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--fg)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--fg-faint)")}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
            </svg>
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/mohit-jhalani-3a282856/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "var(--fg-faint)", transition: "color 0.15s", display: "flex", alignItems: "center", gap: 6, fontSize: "0.8rem" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--fg)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--fg-faint)")}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  );
}
