export type ContentBlock =
  | { type: 'paragraph'; html: string; dropCap?: boolean }
  | { type: 'blockquote'; html: string }
  | { type: 'heading'; text: string; level: 2 | 3 }

export type Post = {
  slug: string
  title: string
  date: string
  readMin: number
  tags: string[]
  excerpt: string
  featured?: boolean
  content?: ContentBlock[]
}

export const POSTS: Post[] = []

export const ALL_TAGS: string[] = []
