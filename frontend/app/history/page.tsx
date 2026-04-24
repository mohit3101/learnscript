'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { supabase } from '@/lib/supabase'
import { ThemeToggle } from '@/components/ThemeToggle'
import type { Note } from '@/lib/types'

const TABS = [
  { id: 'notes',      label: 'Notes'      },
  { id: 'cheatsheet', label: 'Cheat Sheet' },
  { id: 'code',       label: 'Code'        },
  { id: 'mindmap',    label: 'Mind Map'    },
] as const

type TabId = typeof TABS[number]['id']

function formatDuration(s: number) {
  const m = Math.floor(s / 60)
  return `${m}:${(s % 60).toString().padStart(2, '0')}`
}
function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

export default function HistoryPage() {
  const router = useRouter()
  const [notes, setNotes]         = useState<Note[]>([])
  const [loading, setLoading]     = useState(true)
  const [selected, setSelected]   = useState<Note | null>(null)
  const [activeTab, setActiveTab] = useState<TabId>('notes')
  const [deleting, setDeleting]   = useState<string | null>(null)
  const [copied, setCopied]       = useState(false)
  const [search, setSearch]       = useState('')

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) { router.push('/app'); return }
      loadNotes()
    })
  }, [])

  const loadNotes = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .order('created_at', { ascending: false })
    if (!error && data) setNotes(data)
    setLoading(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this note?')) return
    setDeleting(id)
    await supabase.from('notes').delete().eq('id', id)
    setNotes(prev => prev.filter(n => n.id !== id))
    if (selected?.id === id) setSelected(null)
    setDeleting(null)
  }

  const handleCopy = () => {
    if (!selected) return
    navigator.clipboard.writeText(selected[activeTab] ?? '')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleExport = () => {
    if (!selected) return
    const all = TABS.map(t => `# ${t.label}\n\n${selected[t.id]}`).join('\n\n---\n\n')
    const blob = new Blob([all], { type: 'text/markdown' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `learnscript-${selected.video_id}.md`
    a.click()
  }

  const filtered = notes.filter(n =>
    n.video_id.toLowerCase().includes(search.toLowerCase()) ||
    n.video_url.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg)' }}>

      {/* Navbar */}
      <nav className="navbar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', color: 'var(--fg)' }}>
            <div style={{ width: 28, height: 28, borderRadius: 'var(--r-md)', background: 'var(--brand)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
              </svg>
            </div>
            <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>LearnScript</span>
          </a>
          <span style={{ color: 'var(--border-strong)', fontSize: '1.2rem' }}>/</span>
          <span style={{ fontSize: '0.875rem', color: 'var(--fg-muted)', fontWeight: 500 }}>My Notes</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ThemeToggle />
          <a href="/app">
            <button className="btn-primary" style={{ padding: '0.4rem 0.875rem', fontSize: '0.8rem' }}>
              + New Note
            </button>
          </a>
        </div>
      </nav>

      {/* Layout */}
      <div style={{ flex: 1, display: 'flex', gap: 0, overflow: 'hidden', height: 'calc(100vh - 54px)' }}>

        {/* Sidebar */}
        <aside style={{
          width: 280, flexShrink: 0, borderRight: '1px solid var(--border)',
          display: 'flex', flexDirection: 'column', gap: '0.75rem',
          padding: '1rem', overflowY: 'auto', background: 'var(--bg-subtle)',
        }}>
          <input
            className="input-base"
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search notes..."
            style={{ fontSize: '0.85rem' }}
          />

          {loading && [1, 2, 3].map(i => (
            <div key={i} className="card" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {[100, 60, 40].map(w => (
                <div key={w} style={{ height: 12, width: `${w}%`, background: 'var(--bg-input)', borderRadius: 'var(--r-sm)', animation: 'pulse 1.4s ease infinite' }} />
              ))}
              <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}`}</style>
            </div>
          ))}

          {!loading && filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '2rem 0.5rem', color: 'var(--fg-muted)', fontSize: '0.875rem' }}>
              {search ? 'No matching notes.' : 'No saved notes yet.'}
              {!search && <><br /><a href="/app" style={{ color: 'var(--brand)', fontSize: '0.8rem' }}>Generate your first →</a></>}
            </div>
          )}

          {!loading && filtered.map(note => (
            <div
              key={note.id}
              onClick={() => { setSelected(note); setActiveTab('notes') }}
              style={{
                padding: '0.875rem',
                borderRadius: 'var(--r-md)',
                border: `1px solid ${selected?.id === note.id ? 'var(--brand)' : 'var(--border)'}`,
                background: selected?.id === note.id ? 'color-mix(in srgb, var(--brand) 8%, var(--bg-card))' : 'var(--bg-card)',
                cursor: 'pointer',
                transition: 'border-color 0.15s, background 0.15s',
                position: 'relative',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.375rem' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--brand)', background: 'color-mix(in srgb, var(--brand) 10%, transparent)', padding: '0.1rem 0.4rem', borderRadius: 'var(--r-sm)' }}>
                  {note.video_id}
                </span>
                <span style={{ fontSize: '0.7rem', color: 'var(--fg-faint)', marginLeft: 'auto' }}>
                  {formatDuration(note.duration)}
                </span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--fg-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: '0.25rem' }}>
                {note.video_url}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--fg-faint)' }}>{formatDate(note.created_at)}</div>
              <button
                onClick={e => { e.stopPropagation(); handleDelete(note.id) }}
                disabled={deleting === note.id}
                style={{
                  position: 'absolute', top: '0.5rem', right: '0.5rem',
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: 'var(--fg-faint)', fontSize: '0.75rem', padding: '0.2rem 0.35rem',
                  borderRadius: 'var(--r-sm)',
                  opacity: 0,
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = '1'; (e.currentTarget as HTMLElement).style.color = 'var(--danger)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = '0' }}
              >
                {deleting === note.id ? '…' : '✕'}
              </button>
            </div>
          ))}

          {!loading && notes.length > 0 && (
            <div style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--fg-faint)', paddingTop: '0.5rem' }}>
              {notes.length} note{notes.length !== 1 ? 's' : ''}
            </div>
          )}
        </aside>

        {/* Content panel */}
        <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {!selected ? (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '0.75rem', color: 'var(--fg-muted)' }}>
              <div style={{ fontSize: '3rem' }}>📖</div>
              <p style={{ fontSize: '0.875rem' }}>Select a note to view it</p>
            </div>
          ) : (
            <>
              {/* Meta bar */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1.25rem', borderBottom: '1px solid var(--border)', flexWrap: 'wrap', flexShrink: 0 }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--fg-faint)', background: 'var(--bg-input)', padding: '0.2rem 0.5rem', borderRadius: 'var(--r-sm)' }}>
                  {selected.video_id}
                </span>
                <span style={{ fontSize: '0.8rem', color: 'var(--fg-muted)' }}>{formatDuration(selected.duration)}</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--fg-muted)' }}>{formatDate(selected.created_at)}</span>
                <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
                  <a href={selected.video_url} target="_blank" rel="noopener noreferrer">
                    <button className="btn-ghost" style={{ padding: '0.35rem 0.75rem', fontSize: '0.775rem' }}>▶ Watch</button>
                  </a>
                  <button className="btn-ghost" onClick={handleCopy} style={{ padding: '0.35rem 0.75rem', fontSize: '0.775rem' }}>
                    {copied ? '✓ Copied' : '📋 Copy'}
                  </button>
                  <button className="btn-ghost" onClick={handleExport} style={{ padding: '0.35rem 0.75rem', fontSize: '0.775rem' }}>
                    ⬇ .md
                  </button>
                </div>
              </div>

              {/* Tabs */}
              <div style={{ padding: '0.75rem 1.25rem', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
                <div className="result-tabs">
                  {TABS.map(tab => (
                    <button
                      key={tab.id}
                      className={`result-tab${activeTab === tab.id ? ' active' : ''}`}
                      onClick={() => setActiveTab(tab.id)}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Content */}
              <div id="history-content" className="notes-content" style={{ flex: 1, overflowY: 'auto', padding: '1.5rem 1.25rem' }}>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {selected[activeTab] ?? ''}
                </ReactMarkdown>
              </div>
            </>
          )}
        </main>
      </div>

      {/* Footer */}
      <div style={{ padding: '0.875rem 1.25rem', borderTop: '1px solid var(--border)', textAlign: 'center', fontSize: '0.75rem', color: 'var(--fg-faint)' }}>
        Built with ♥ by <a href="https://www.linkedin.com/in/mohit-jhalani-3a282856/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--brand)', fontWeight: 600 }}>MojoJojo</a>
      </div>
    </div>
  )
}
