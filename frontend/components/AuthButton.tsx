'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

export default function AuthButton() {
  const [user, setUser]       = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [open, setOpen]       = useState(false)

  useEffect(() => {
    // Get initial session
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    })
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setOpen(false)
  }

  if (loading) return (
    <div className="w-8 h-8 rounded-full bg-white/5 animate-pulse" />
  )

  if (!user) return (
    <button
      onClick={signIn}
      className="flex items-center gap-2 text-xs bg-[#e8c975]/10 hover:bg-[#e8c975]/18 border border-[#e8c975]/25 text-[#e8c975] px-3 py-1.5 rounded-lg transition-colors font-medium"
    >
      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>
      </svg>
      Sign in with Google
    </button>
  )

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 text-xs bg-white/5 hover:bg-white/8 border border-white/10 text-slate-300 px-3 py-1.5 rounded-lg transition-colors"
      >
        {user.user_metadata?.avatar_url && (
          <img
            src={user.user_metadata.avatar_url}
            alt="avatar"
            className="w-4 h-4 rounded-full"
          />
        )}
        {user.user_metadata?.full_name?.split(' ')[0] ?? user.email?.split('@')[0]}
        <span className="text-slate-500">▾</span>
      </button>

      {open && (
        <div className="absolute right-0 top-9 bg-[#0d1017] border border-white/10 rounded-xl shadow-xl p-1 min-w-[160px] z-50">
          <div className="px-3 py-2 border-b border-white/5 mb-1">
            <div className="text-xs text-slate-400 truncate">{user.email}</div>
          </div>
          <a
            href="/history"
            className="flex items-center gap-2 px-3 py-2 text-xs text-slate-300 hover:bg-white/5 rounded-lg transition-colors"
            onClick={() => setOpen(false)}
          >
            📋 My Notes
          </a>
          <button
            onClick={signOut}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
          >
            ↩ Sign Out
          </button>
        </div>
      )}
    </div>
  )
}
