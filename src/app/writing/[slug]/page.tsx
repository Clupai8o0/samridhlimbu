import { notFound } from 'next/navigation'
import Link from 'next/link'
import { PageShell } from '@/components/page-shell'
import { POSTS } from '@/lib/writing'
import type { ContentBlock } from '@/lib/writing'

const MONO = '"JetBrains Mono", var(--font-mono), monospace'
const SANS = 'Inter, var(--font-inter), sans-serif'
const DISPLAY = 'Manrope, var(--font-manrope), sans-serif'

export async function generateStaticParams() {
  return POSTS.map(p => ({ slug: p.slug }))
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = POSTS.find(p => p.slug === slug)
  if (!post) notFound()

  return (
    <PageShell>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '36px 28px' }}>

        {/* Breadcrumb */}
        <div style={{ fontFamily: MONO, fontSize: 10, color: 'var(--muted-2)', marginBottom: 20, letterSpacing: 0.02 }}>
          <span style={{ color: 'var(--accent)' }}>❯</span>{' '}
          cd ~/writing/
          <span style={{ color: 'var(--fg)', fontWeight: 500 }}>{post.slug}</span>
          <span>.md</span>
        </div>

        {/* Date + meta row */}
        <div style={{ fontFamily: MONO, fontSize: 10.5, color: 'var(--muted-2)', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, flexWrap: 'wrap', letterSpacing: 0.04 }}>
          <span>{post.date}</span>
          <span>·</span>
          <span style={{ textTransform: 'uppercase' }}>{post.readMin} MIN</span>
          <span>·</span>
          {post.tags.map(tag => (
            <span key={tag} style={{ color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: 0.06 }}>
              #{tag}
            </span>
          ))}
        </div>

        {/* Title */}
        <h1 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 42, margin: '0 0 14px', letterSpacing: -0.025, color: 'var(--fg)', lineHeight: 1.1 }}>
          {post.title}
        </h1>

        {/* Excerpt */}
        <p style={{ fontFamily: SANS, fontSize: 14.5, color: 'var(--fg-dim)', lineHeight: 1.55, margin: '0 0 22px' }}>
          {post.excerpt}
        </p>

        {/* Author */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 22 }}>
          <div style={{
            width: 30, height: 30,
            background: 'linear-gradient(135deg, #1e1e24 0%, #0f0f13 100%)',
            border: '1px solid var(--border-2)',
            borderRadius: 4,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: MONO, fontSize: 9.5, fontWeight: 600, color: 'var(--fg)',
            letterSpacing: -0.01, flexShrink: 0,
          }}>
            SL
          </div>
          <span style={{ fontFamily: SANS, fontSize: 12.5, color: 'var(--muted)' }}>
            Samridh Limbu{' '}
            <span style={{ color: 'var(--muted-2)' }}>·</span>{' '}
            Melbourne, AU
          </span>
        </div>

        {/* Separator */}
        <div style={{ height: 1, background: 'var(--border)', marginBottom: 32 }} />

        {/* Article body */}
        {post.content ? (
          <article className="prose-article" style={{ fontFamily: SANS, fontSize: 14, color: 'var(--fg-dim)', lineHeight: 1.8 }}>
            {post.content.map((block, i) => renderBlock(block, i))}
          </article>
        ) : (
          <p style={{ fontFamily: SANS, fontSize: 13, color: 'var(--muted)', lineHeight: 1.7 }}>
            This piece is still in progress.
          </p>
        )}

        {/* Footer */}
        <div style={{ paddingTop: 28, marginTop: 28, borderTop: '1px solid var(--border)' }}>
          <Link href="/writing" className="btn btn-ghost" style={{ fontFamily: MONO, fontSize: 10 }}>
            ← back to writing
          </Link>
        </div>

      </div>
    </PageShell>
  )
}

function renderBlock(block: ContentBlock, key: number) {
  if (block.type === 'paragraph') {
    if (block.dropCap) {
      const first = block.html[0]
      const rest = block.html.slice(1)
      return (
        <p key={key} style={{ marginBottom: 20 }}>
          <span style={{
            float: 'left',
            fontFamily: DISPLAY,
            fontSize: '4em',
            fontWeight: 700,
            lineHeight: 0.82,
            paddingRight: 8,
            paddingTop: 3,
            color: 'var(--fg)',
          }}>
            {first}
          </span>
          <span dangerouslySetInnerHTML={{ __html: rest }} />
        </p>
      )
    }
    return (
      <p key={key} style={{ marginBottom: 20 }} dangerouslySetInnerHTML={{ __html: block.html }} />
    )
  }

  if (block.type === 'blockquote') {
    return (
      <blockquote
        key={key}
        style={{
          margin: '24px 0',
          padding: '14px 20px',
          borderLeft: '3px solid var(--accent)',
          background: 'rgba(99,102,241,0.04)',
          fontStyle: 'italic',
          color: 'var(--fg)',
          fontSize: 14.5,
          lineHeight: 1.7,
          fontFamily: SANS,
        }}
        dangerouslySetInnerHTML={{ __html: block.html }}
      />
    )
  }

  if (block.type === 'heading') {
    return (
      <h2
        key={key}
        style={{
          fontFamily: DISPLAY,
          fontSize: block.level === 2 ? 20 : 16,
          fontWeight: 700,
          color: 'var(--fg)',
          letterSpacing: -0.02,
          margin: '36px 0 14px',
        }}
      >
        {block.text}
      </h2>
    )
  }

  return null
}
