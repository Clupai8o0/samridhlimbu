'use client'

import Link from 'next/link'
import { useState } from 'react'
import type { Post } from '@/lib/writing'
import { ALL_TAGS } from '@/lib/writing'

const MONO = '"JetBrains Mono", var(--font-mono), monospace'
const SANS = 'Inter, var(--font-inter), sans-serif'
const DISPLAY = 'Manrope, var(--font-manrope), sans-serif'

export function WritingClient({ posts }: { posts: Post[] }) {
  const [active, setActive] = useState('all')

  const filtered = active === 'all' ? posts : posts.filter(p => p.tags.includes(active))
  const featured = filtered.filter(p => p.featured)
  const rest = filtered.filter(p => !p.featured)

  return (
    <div>
      {/* Tag filter */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 32 }}>
        <button
          onClick={() => setActive('all')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 5,
            fontFamily: MONO,
            fontSize: 10.5,
            padding: '4px 10px',
            border: '1px solid',
            borderColor: active === 'all' ? 'var(--accent)' : 'var(--border)',
            borderRadius: 2,
            background: active === 'all' ? 'var(--accent)' : 'transparent',
            color: active === 'all' ? '#fff' : 'var(--muted)',
            cursor: 'pointer',
            transition: 'all .12s',
          }}
        >
          {active === 'all' && <span style={{ fontSize: 9 }}>✓</span>}
          all
        </button>
        {ALL_TAGS.map(tag => (
          <button
            key={tag}
            onClick={() => setActive(tag)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              fontFamily: MONO,
              fontSize: 10.5,
              padding: '4px 10px',
              border: '1px solid',
              borderColor: active === tag ? 'var(--accent)' : 'var(--border)',
              borderRadius: 2,
              background: active === tag ? 'var(--accent-soft)' : 'transparent',
              color: active === tag ? 'var(--accent)' : 'var(--muted)',
              cursor: 'pointer',
              transition: 'all .12s',
            }}
          >
            # {tag}
          </button>
        ))}
      </div>

      {/* Featured section */}
      {featured.length > 0 && (
        <div>
          <div className="section-label" style={{ fontFamily: MONO }}>Featured</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
            {featured.map(post => <PostCard key={post.slug} post={post} />)}
          </div>
        </div>
      )}

      {/* Remaining posts */}
      {rest.length > 0 && (
        <div>
          {featured.length > 0 && (
            <div className="section-label" style={{ fontFamily: MONO, marginTop: 4 }}>All</div>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {rest.map(post => <PostCard key={post.slug} post={post} />)}
          </div>
        </div>
      )}

      {filtered.length === 0 && (
        <div style={{ fontFamily: MONO, fontSize: 11, color: 'var(--muted-2)', padding: '32px 0' }}>
          no posts tagged #{active}
        </div>
      )}
    </div>
  )
}

function PostCard({ post }: { post: Post }) {
  return (
    <Link href={`/writing/${post.slug}`} style={{ textDecoration: 'none', display: 'block' }}>
      <div
        style={{
          border: '1px solid var(--border)',
          padding: '16px 20px',
          borderRadius: 2,
          transition: 'border-color .12s, background .12s',
          cursor: 'pointer',
        }}
        className="row-hover"
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8, gap: 16 }}>
          <span style={{ fontFamily: DISPLAY, fontSize: 15, fontWeight: 600, color: 'var(--fg)', letterSpacing: -0.01 }}>
            {post.title}
          </span>
          <span style={{ fontFamily: MONO, fontSize: 10, color: 'var(--muted-2)', flexShrink: 0 }}>
            {post.date}
          </span>
        </div>
        <p style={{ fontFamily: SANS, fontSize: 12.5, color: 'var(--fg-dim)', lineHeight: 1.6, margin: '0 0 10px' }}>
          {post.excerpt}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: MONO, fontSize: 10, color: 'var(--muted-2)', flexWrap: 'wrap' }}>
          <span>{post.readMin} min</span>
          <span>·</span>
          {post.tags.map(tag => (
            <span key={tag} style={{ color: 'var(--accent)' }}>#{tag}</span>
          ))}
        </div>
      </div>
    </Link>
  )
}
