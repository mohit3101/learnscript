"""
LearnScript — Prompt Engineering Layer
========================================
The proprietary prompt templates and engineering logic have been
intentionally excluded from this public repository.

Prompts are loaded from environment variables in production.
This prevents prompt injection attacks and protects IP.

Output types generated:
  - NOTES_PROMPT      → Structured study notes with headings, tables, formulas
  - CHEATSHEET_PROMPT → Quick-reference comparison tables
  - CODE_PROMPT       → Runnable Python code examples with comments
  - MINDMAP_PROMPT    → Mermaid mindmap diagrams

All prompts enforce:
  - LaTeX math formatting (remark-math + rehype-katex compatible)
  - Markdown table syntax (remark-gfm compatible)
  - Mermaid v11 mindmap syntax (no emoji, 2-space indent)

Contact: https://www.linkedin.com/in/mohit-jhalani-3a282856/
Live demo: https://learnscript.vercel.app
"""

import os

# ── Prompts loaded from environment variables ──────────────────────────────
# Set these in Railway dashboard (or .env locally).
# See .env.example for the full list of required variables.

NOTES_PROMPT = os.getenv(
    "NOTES_PROMPT",
    "You are an expert educator. Generate comprehensive structured study notes "
    "from the following transcript.\n\nTranscript:\n{transcript}"
)

CHEATSHEET_PROMPT = os.getenv(
    "CHEATSHEET_PROMPT",
    "You are an expert educator. Generate a concise cheat sheet "
    "from the following transcript.\n\nTranscript:\n{transcript}"
)

CODE_PROMPT = os.getenv(
    "CODE_PROMPT",
    "You are an expert Python developer. Extract and generate clean code examples "
    "from the following transcript.\n\nTranscript:\n{transcript}"
)

MINDMAP_PROMPT = os.getenv(
    "MINDMAP_PROMPT",
    "Generate a Mermaid mindmap diagram from the following transcript.\n\n"
    "Transcript:\n{transcript}"
)
