"use client";

import React, { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeHighlight from "rehype-highlight";
import "katex/dist/katex.min.css";
import "highlight.js/styles/atom-one-dark.css";

/* ─────────────────────────────────────────────────────────────────────
   NotesRenderer  (Notes / Cheatsheet / Code tabs — no Mermaid)
───────────────────────────────────────────────────────────────────── */
export function NotesRenderer({ content }: { content: string }) {
  return (
    <div className="notes-content">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[
          [rehypeKatex, { throwOnError: false, strict: false }],
          rehypeHighlight,
        ]}
        components={{
          table: ({ node, ...props }) => (
            <div className="table-wrapper">
              <table {...props} />
            </div>
          ),
          thead: ({ node, ...props }) => <thead {...props} />,
          tbody: ({ node, ...props }) => <tbody {...props} />,
          tr:    ({ node, ...props }) => <tr {...props} />,
          th:    ({ node, ...props }) => <th {...props} />,
          td:    ({ node, ...props }) => <td {...props} />,

          code: ({ node, className, children, ...props }) => {
            const isBlock = className?.startsWith("language-");
            if (isBlock) {
              return (
                <div className="code-block-wrapper">
                  <span className="code-lang-label">
                    {className?.replace("language-", "") || "code"}
                  </span>
                  <pre>
                    <code className={className} {...props}>{children}</code>
                  </pre>
                </div>
              );
            }
            return <code className="inline-code" {...props}>{children}</code>;
          },

          blockquote: ({ node, children, ...props }) => (
            <div className="callout-box" role="note">
              <span className="callout-icon" aria-hidden="true">💡</span>
              <div className="callout-content">{children}</div>
            </div>
          ),

          h1: ({ node, children, ...props }) => <h1 className="notes-h1" {...props}>{children}</h1>,
          h2: ({ node, children, ...props }) => <h2 className="notes-h2" {...props}>{children}</h2>,
          h3: ({ node, children, ...props }) => <h3 className="notes-h3" {...props}>{children}</h3>,
          h4: ({ node, children, ...props }) => <h4 className="notes-h4" {...props}>{children}</h4>,
          p:  ({ node, children, ...props }) => <p  className="notes-p"  {...props}>{children}</p>,
          ul: ({ node, children, ...props }) => <ul className="notes-ul" {...props}>{children}</ul>,
          ol: ({ node, children, ...props }) => <ol className="notes-ol" {...props}>{children}</ol>,
          li: ({ node, children, ...props }) => <li className="notes-li" {...props}>{children}</li>,
          hr: () => <div className="notes-divider" aria-hidden="true" />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────
   MindmapRenderer  (Mindmap tab only)
   
   Fixes applied:
   1. sanitizeMermaid() strips emoji and markdown syntax that Mermaid 11 rejects
   2. mermaid.parse() validates BEFORE attempting render — catches errors early
   3. On any error → shows styled fallback (never crashes UI)
   4. Left-aligned (not centered) for readability
   5. Horizontally scrollable when diagram is wide
───────────────────────────────────────────────────────────────────── */

function sanitizeMermaid(raw: string): string {
  return (
    raw
      // Remove emoji (causes Mermaid parse errors)
      .replace(/[\u{1F300}-\u{1FFFF}]/gu, "")
      .replace(/[\u2600-\u27BF]/g, "")
      // Strip bold/italic markdown inside labels
      .replace(/\*\*([^*\n]+)\*\*/g, "$1")
      .replace(/\*([^*\n]+)\*/g, "$1")
      // Strip backtick code spans
      .replace(/`([^`]+)`/g, "$1")
      // Remove any line that looks like a markdown heading (starts with #)
      // but only if it's NOT the first line (mindmap keyword must stay)
      .split("\n")
      .map((line, i) => (i > 0 && /^\s*#{1,6}\s/.test(line) ? "" : line))
      .join("\n")
      // Collapse 3+ blank lines
      .replace(/\n{3,}/g, "\n\n")
      // Trim trailing spaces
      .split("\n")
      .map((l) => l.trimEnd())
      .join("\n")
      .trim()
  );
}

function isLikelyValidMindmap(text: string): boolean {
  const t = text.trim();
  return t.startsWith("mindmap") && t.includes("root(");
}

export function MindmapRenderer({ content }: { content: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const renderAll = async () => {
      let mermaid: typeof import("mermaid")["default"];

      try {
        mermaid = (await import("mermaid")).default;
        mermaid.initialize({
          startOnLoad: false,
          theme: document.documentElement.classList.contains("dark") ? "dark" : "neutral",
          mindmap: { padding: 20, useMaxWidth: true },
          fontFamily: "Inter, -apple-system, sans-serif",
          fontSize: 14,
          securityLevel: "loose",
        });
      } catch {
        console.warn("Mermaid failed to load");
        return;
      }

      if (!containerRef.current) return;
      const slots = containerRef.current.querySelectorAll<HTMLElement>("[data-mermaid-slot]");

      for (const slot of slots) {
        const rawContent = slot.getAttribute("data-mermaid-content") || "";
        const sanitized = sanitizeMermaid(rawContent);
        const id = `mm-${Math.random().toString(36).slice(2, 9)}`;

        try {
          // Parse first — throws on bad syntax, preventing blank output
          await mermaid.parse(sanitized);

          const { svg } = await mermaid.render(id, sanitized);
          const wrapper = document.createElement("div");
          wrapper.className = "mindmap-diagram-output";
          wrapper.innerHTML = svg;
          const svgEl = wrapper.querySelector("svg");
          if (svgEl) {
            svgEl.style.cssText = "max-width:100%;height:auto;display:block;";
          }
          slot.replaceWith(wrapper);
        } catch {
          // Graceful fallback — never crashes, never shows blank space
          const fallback = document.createElement("div");
          fallback.className = "mindmap-fallback";
          fallback.innerHTML = `
            <div class="mindmap-fallback-header">
              <span class="mindmap-fallback-icon">⚠</span>
              <span>Could not render diagram — showing as text</span>
            </div>
            <pre class="mindmap-fallback-pre">${sanitized.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</pre>
          `;
          slot.replaceWith(fallback);
        }
      }
    };

    renderAll();
  }, [content]);

  // Split content: fenced mermaid blocks vs regular markdown
  const nodes: React.ReactNode[] = [];
  const fenceRegex = /```mermaid\n([\s\S]*?)```/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = fenceRegex.exec(content)) !== null) {
    const before = content.slice(lastIndex, match.index).trim();
    if (before) {
      nodes.push(
        <div key={`txt-${key}`} className="notes-content" style={{ marginBottom: "1rem" }}>
          <ReactMarkdown
            remarkPlugins={[remarkGfm, remarkMath]}
            rehypePlugins={[[rehypeKatex, { throwOnError: false }]]}
          >
            {before}
          </ReactMarkdown>
        </div>
      );
    }

    nodes.push(
      <div key={`mm-${key}`} className="mindmap-wrapper">
        <div
          data-mermaid-slot="true"
          data-mermaid-content={match[1].trim()}
          className="mindmap-slot-placeholder"
        >
          <span className="mindmap-loading-text">Rendering diagram…</span>
        </div>
      </div>
    );

    lastIndex = match.index + match[0].length;
    key++;
  }

  const tail = content.slice(lastIndex).trim();

  if (nodes.length === 0) {
    // No fenced blocks — try raw content
    const raw = content.trim();
    if (isLikelyValidMindmap(raw)) {
      nodes.push(
        <div key="raw" className="mindmap-wrapper">
          <div
            data-mermaid-slot="true"
            data-mermaid-content={raw}
            className="mindmap-slot-placeholder"
          >
            <span className="mindmap-loading-text">Rendering diagram…</span>
          </div>
        </div>
      );
    } else {
      nodes.push(
        <div key="md" className="notes-content">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{raw}</ReactMarkdown>
        </div>
      );
    }
  } else if (tail) {
    nodes.push(
      <div key="tail" className="notes-content">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{tail}</ReactMarkdown>
      </div>
    );
  }

  return <div ref={containerRef}>{nodes}</div>;
}
