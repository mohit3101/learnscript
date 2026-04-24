export interface Note {
  id: string
  user_id: string
  video_id: string
  video_url: string
  duration: number
  title: string | null
  notes: string
  cheatsheet: string
  code: string
  mindmap: string
  created_at: string
}

export interface Content {
  notes: string
  cheatsheet: string
  code: string
  mindmap: string
}

export interface GenerateResponse {
  success: boolean
  video_id: string
  duration: number
  content: Content
}
