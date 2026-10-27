'use client'

import Link from 'next/link'
import { useState } from 'react'
import type { FocusEvent, UIEvent } from 'react'
import type { Post } from '@/lib/writing'
import { ALL_TAGS } from '@/lib/writing'
import styles from './writing-client.module.css'

const MONO = '"JetBrains Mono", var(--font-mono), monospace'
const SANS = 'Inter, var(--font-inter), sans-serif'
const DISPLAY = 'Manrope, var(--font-manrope), sans-serif'

// Only phones scroll the chip row sideways; elsewhere this would scroll the page.
function revealChip(e: FocusEvent<HTMLButtonElement>) {
  if (!window.matchMedia('(max-width: 640px)').matches) return
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  e.currentTarget.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: reduce ? 'auto' : 'smooth' })
}

export function WritingClient({ posts }: { posts: Post[] }) {
  const [active, setActive] = useState('all')
  const [atEnd, setAtEnd] = useState(false)

  const onFilterScroll = (e: UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 2)
  }

  // Newest first, within Featured and within All.
  const sorted = [...posts].sort((a, b) => b.date.localeCompare(a.date))
  const filtered = active === 'all' ? sorted : sorted.filter(p => p.tags.includes(active))
  const featured = filtered.filter(p => p.featured)
  const rest = filtered.filter(p => !p.featured)

  return (
    <div>
      {/* Tag filter — hidden when no tags exist */}
      {ALL_TAGS.length > 0 && <div className={styles.filters} data-end={atEnd || undefined} onScroll={onFilterScroll}>
        <button
          className={styles.chip}
          onClick={() => setActive('all')}
          onFocus={revealChip}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 5,
            fontFamily: MONO,
            fontSize: 'var(--text-xs)',
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
          {active === 'all' && <span style={{ fontSize: 'var(--text-xs)' }}>✓</span>}
          all
        </button>
        {ALL_TAGS.map(tag => (
          <button
            key={tag}
            className={styles.chip}
            onClick={() => setActive(tag)}
            onFocus={revealChip}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              fontFamily: MONO,
              fontSize: 'var(--text-xs)',
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
      </div>}

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
        <div style={{ fontFamily: MONO, fontSize: 'var(--text-xs)', color: 'var(--muted-2)', padding: '32px 0' }}>
          {active === 'all' ? 'nothing here yet.' : `no posts tagged #${active}`}
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
          <span style={{ fontFamily: DISPLAY, fontSize: 15, fontWeight: 600, color: 'var(--fg)', letterSpacing: '-0.01em' }}>
            {post.title}
          </span>
          <span className={styles.date} style={{ fontFamily: MONO, fontSize: 'var(--text-xs)', color: 'var(--muted-2)', flexShrink: 0 }}>
            {post.date}
          </span>
        </div>
        <p style={{ fontFamily: SANS, fontSize: 12.5, color: 'var(--fg-dim)', lineHeight: 1.6, margin: '0 0 10px' }}>
          {post.excerpt}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: MONO, fontSize: 'var(--text-xs)', color: 'var(--muted-2)', flexWrap: 'wrap' }}>
          <span className={styles.metaDate}>{post.date}</span>
          <span className={styles.metaDate}>·</span>
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
