# LearnScript

> **Turn YouTube lectures into premium AI-powered study notes in 20 seconds.**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-learnscript.vercel.app-6366f1?style=flat-square&logo=vercel)](https://learnscript.vercel.app)
[![Backend](https://img.shields.io/badge/Backend-Railway-0B0D0E?style=flat-square&logo=railway)](https://railway.app)
[![License](https://img.shields.io/badge/License-Proprietary-red?style=flat-square)]()

---

## 🎯 What It Does

LearnScript extracts the transcript from any YouTube lecture, processes it through a parallel AI pipeline, and returns four structured learning outputs simultaneously:

| Output | Description |
|--------|-------------|
| 📖 **Notes** | Hierarchical study notes with headings, tables, and LaTeX formulas |
| ⚡ **Cheat Sheet** | Quick-reference comparison tables for revision |
| 💻 **Code** | Clean, commented Python examples extracted from the lecture |
| 🗺️ **Mind Map** | Mermaid-rendered visual concept tree |

---

## 🚀 Live Product

**[https://learnscript.vercel.app](https://learnscript.vercel.app)**

Try it with any Python or ML lecture — results in ~20 seconds.

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    User's Browser                        │
│              Next.js 14 · TypeScript · Tailwind          │
│   react-markdown · rehype-katex · Mermaid.js            │
└──────────────────────┬──────────────────────────────────┘
                       │ HTTPS (CORS-restricted)
                       ▼
┌─────────────────────────────────────────────────────────┐
│               FastAPI Backend  (Railway)                  │
│                                                           │
│  POST /api/generate                                       │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────────┐  │
│  │  Transcript  │  │   Chunker    │  │  Rate Limiter  │  │
│  │  Extractor   │  │  (proprietary│  │  5 req / hr    │  │
│  │  (Supadata)  │  │   strategy)  │  │  per IP        │  │
│  └──────┬───────┘  └──────┬───────┘  └────────────────┘  │
│         │                 │                               │
└─────────┼─────────────────┼───────────────────────────────┘
          │                 │
          ▼                 ▼
  ┌───────────────┐  ┌──────────────────────────────────┐
  │ Supadata API  │  │       OpenAI GPT-4o-mini          │
  │ (transcripts) │  │  asyncio.gather() — 4 parallel   │
  └───────────────┘  │  ┌────────┐  ┌──────────────┐    │
                     │  │ Notes  │  │  Cheat Sheet │    │
                     │  └────────┘  └──────────────┘    │
                     │  ┌────────┐  ┌──────────────┐    │
                     │  │  Code  │  │   Mind Map   │    │
                     │  └────────┘  └──────────────┘    │
                     └──────────────────────────────────┘
                                    │
                                    ▼
                     ┌──────────────────────────┐
                     │      Supabase            │
                     │  PostgreSQL + Auth        │
                     │  Row Level Security (RLS) │
                     └──────────────────────────┘
```

---

## 🛠️ Tech Stack

### Frontend — Vercel
| Technology | Purpose |
|-----------|---------|
| Next.js 14 + TypeScript | App framework |
| Tailwind CSS | Styling |
| `next-themes` | Dark/light mode |
| `react-markdown` | Markdown rendering |
| `remark-math` + `rehype-katex` | LaTeX formula rendering |
| `rehype-highlight` | Code syntax highlighting |
| `mermaid` v11 | Mind map diagrams |
| Supabase JS Client | Auth + data |

### Backend — Railway
| Technology | Purpose |
|-----------|---------|
| FastAPI + Python 3.12 | API server |
| `uvicorn` | ASGI runtime |
| OpenAI SDK (async) | GPT-4o-mini calls |
| `asyncio.gather()` | Parallel 4-output generation |
| `tiktoken` | Token counting for chunking |
| Supadata API | YouTube transcript extraction |
| `httpx` | Async HTTP client |

### Infrastructure
| Service | Role |
|---------|------|
| Vercel | Frontend hosting (edge CDN) |
| Railway | Backend hosting (always-on) |
| Supabase | PostgreSQL + Google OAuth |
| GitHub | CI/CD via auto-deploy |

---

## 📁 Repository Structure

```
learnscript/
├── frontend/                          # Next.js application
│   ├── app/
│   │   ├── app/page.tsx               # Main generator UI
│   │   ├── history/page.tsx           # Saved notes dashboard
│   │   ├── layout.tsx                 # Root layout + theme
│   │   └── globals.css                # Design token system
│   ├── components/
│   │   ├── MarkdownRenderer.tsx       # Notes + Mermaid rendering
│   │   ├── ThemeProvider.tsx          # next-themes wrapper
│   │   ├── ThemeToggle.tsx            # Sun/moon toggle
│   │   └── homepage/                  # Landing page sections
│   └── lib/
│       ├── supabase.ts                # Supabase client
│       └── types.ts                   # TypeScript interfaces
│
├── backend/                           # FastAPI application
│   ├── main.py                        # Routes + CORS
│   ├── services/
│   │   ├── youtube.py                 # Transcript extraction
│   │   ├── rate_limiter.py            # IP-based rate limiting
│   │   ├── ai.py                      # AI orchestration (see note)
│   │   ├── chunker.py                 # Chunking engine (see note)
│   │   └── prompts.py                 # Prompt templates (see note)
│   ├── requirements.txt
│   └── Procfile
│
└── README.md
```

> **Note:** Core AI orchestration (`ai.py`), chunking strategy (`chunker.py`), and prompt engineering (`prompts.py`) have been partially redacted in this public repository. See [Proprietary Notice](#proprietary-notice) below.

---

## 🔌 API Reference

### `POST /api/generate`

```json
// Request
{
  "url": "https://www.youtube.com/watch?v=<video_id>"
}

// Response (200 OK)
{
  "success": true,
  "video_id": "E0Hmnixke2g",
  "duration": 978,
  "content": {
    "notes":      "## Key Concepts\n...",
    "cheatsheet": "| Concept | Formula |...",
    "code":       "```python\n...",
    "mindmap":    "```mermaid\nmindmap\n..."
  }
}

// Error (4xx/5xx)
{
  "detail": "No transcript found for this video."
}
```

### `GET /health`
```json
{ "status": "ok" }
```

**Constraints:**
- Max video duration: 30 minutes
- Rate limit: 5 requests / IP / hour
- Supported: Any YouTube video with captions enabled

---

## ⚙️ Setup (Local Development)

### Backend

```bash
cd backend
python -m venv .venv && source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env        # Fill in your own API keys
uvicorn main:app --port 8000
```

### Frontend

```bash
cd frontend
cp .env.local.example .env.local    # Fill in Supabase keys
npm install
npm run dev
```

Open `http://localhost:3000`

---

## 🔐 Environment Variables

All secrets are managed via environment variables. See `backend/.env.example` for the full list.

**Never commit `.env` files.** The `.gitignore` blocks all `.env*` files except `.env.example`.

---

## 🛡️ Proprietary Notice

This repository demonstrates product architecture, engineering capability, and full-stack deployment.

**The following have been intentionally excluded from this public repository:**

- Core AI orchestration pipeline (parallel generation strategy, output merging)
- Transcript chunking and context-window management logic
- Prompt engineering templates (loaded from environment variables in production)
- Internal optimization workflows

These components represent significant R&D investment and are the proprietary intellectual property of the author.

For collaboration enquiries: [LinkedIn](https://www.linkedin.com/in/mohit-jhalani-3a282856/)

---

## 📸 Screenshots

> *(Add screenshots of your app here)*
> 
> Suggested: Hero input, Notes tab, Cheat Sheet with tables, Mind Map rendered

---

## 👤 Author

**moji8** — Full-stack developer, AI product builder

- 🔗 [LinkedIn](https://www.linkedin.com/in/mohit-jhalani-3a282856/)
- 🌐 [Live Product](https://learnscript.vercel.app)
- 💻 [GitHub](https://github.com/mohit3101)

---

*Built with ❤️ for students, developers, and lifelong learners.*
