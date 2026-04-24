import { createClient as _createClient } from '@supabase/supabase-js'

const supabaseUrl  = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const _supabase = _createClient(supabaseUrl, supabaseAnon)

export const supabase = _supabase
export const createClient = () => _supabase
