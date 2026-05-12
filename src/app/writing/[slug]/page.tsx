import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { PageShell } from '@/components/page-shell'
import { PageHeader } from '@/components/page-header'
import { POSTS } from '@/lib/writing'
import type { ContentBlock } from '@/lib/writing'
import { highlight, HL_COLORS, extractYouTubeId } from '@/lib/highlight'
import { TableOfContents, type TocItem } from '@/components/table-of-contents'

const MONO = '"JetBrains Mono", var(--font-mono), monospace'
const SANS = 'Inter, var(--font-inter), sans-serif'
const DISPLAY = 'Manrope, var(--font-manrope), sans-serif'

export async function generateStaticParams() {
  return POSTS.map(p => ({ slug: p.slug }))
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = POSTS.find(p => p.slug === slug)
  if (!post) notFound()

  const tocItems: TocItem[] = (post.content ?? [])
    .filter((b): b is Extract<ContentBlock, { type: 'heading' }> => b.type === 'heading' && b.level === 2)
    .map(h => ({ id: slugify(h.text), text: h.text }))

  return (
    <PageShell>
      {tocItems.length > 0 && <TableOfContents items={tocItems} />}

      <div data-stagger style={{ maxWidth: 720, margin: '0 auto', padding: '36px 28px' }}>

        <PageHeader />

        {/* Breadcrumb */}
        <div data-stagger-item style={{ fontFamily: MONO, fontSize: 10, color: 'var(--muted-2)', marginBottom: 20, letterSpacing: 0.02 }}>
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
            position: 'relative',
            width: 30, height: 30,
            border: '1px solid var(--border-2)',
            borderRadius: 4,
            overflow: 'hidden',
            flexShrink: 0,
          }}>
            <Image
              src="/sam.jpeg"
              alt="Samridh Limbu"
              fill
              sizes="30px"
              style={{ objectFit: 'cover', objectPosition: 'center top' }}
            />
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
    const isH3 = block.level === 3
    const id = isH3 ? undefined : slugify(block.text)
    return isH3 ? (
      <h3
        key={key}
        style={{
          fontFamily: DISPLAY,
          fontSize: 15,
          fontWeight: 600,
          color: 'var(--fg)',
          letterSpacing: -0.015,
          margin: '28px 0 10px',
        }}
      >
        {block.text}
      </h3>
    ) : (
      <h2
        key={key}
        id={id}
        style={{
          fontFamily: DISPLAY,
          fontSize: 20,
          fontWeight: 700,
          color: 'var(--fg)',
          letterSpacing: -0.02,
          margin: '36px 0 14px',
          scrollMarginTop: 90,
        }}
      >
        {block.text}
      </h2>
    )
  }

  if (block.type === 'code') {
    const tokens = highlight(block.code, block.lang)
    return (
      <div key={key} style={{ margin: '18px 0 22px' }}>
        {block.label && (
          <div style={{
            fontFamily: MONO,
            fontSize: 10,
            color: 'var(--muted-2)',
            textTransform: 'uppercase',
            letterSpacing: 0.06,
            marginBottom: 6,
          }}>
            {block.label}
          </div>
        )}
        <pre style={{
          margin: 0,
          padding: '14px 16px',
          background: '#0d0d11',
          border: '1px solid var(--border)',
          borderRadius: 4,
          overflowX: 'auto',
          fontFamily: MONO,
          fontSize: 12.5,
          lineHeight: 1.6,
          color: '#e5e5e7',
        }}>
          <code style={{
            fontFamily: MONO,
            fontSize: 'inherit',
            background: 'transparent',
            border: 0,
            padding: 0,
            color: 'inherit',
          }}>
            {tokens.map((t, i) =>
              t.cls ? (
                <span key={i} style={{ color: HL_COLORS[t.cls] }}>{t.text}</span>
              ) : (
                <span key={i}>{t.text}</span>
              )
            )}
          </code>
        </pre>
      </div>
    )
  }

  if (block.type === 'image') {
    return (
      <figure key={key} style={{ margin: '24px 0', textAlign: 'center' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={block.src}
          alt={block.alt}
          style={{
            maxWidth: '100%',
            height: 'auto',
            border: '1px solid var(--border)',
            borderRadius: 4,
            background: '#e8e8ea',
            padding: 12,
            boxSizing: 'border-box',
          }}
        />
        {block.caption && (
          <figcaption style={{
            fontFamily: MONO,
            fontSize: 10.5,
            color: 'var(--muted-2)',
            marginTop: 8,
            letterSpacing: 0.02,
            lineHeight: 1.5,
          }}>
            {block.caption}
          </figcaption>
        )}
      </figure>
    )
  }

  if (block.type === 'video') {
    const id = extractYouTubeId(block.href)
    return (
      <figure key={key} style={{ margin: '22px 0' }}>
        {id ? (
          <div style={{
            position: 'relative',
            paddingBottom: '56.25%',
            height: 0,
            overflow: 'hidden',
            border: '1px solid var(--border)',
            borderRadius: 4,
            background: '#000',
          }}>
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${id}`}
              title={block.label}
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                border: 0,
              }}
            />
          </div>
        ) : (
          <a
            href={block.href}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '10px 14px',
              border: '1px solid var(--border)',
              borderRadius: 4,
              background: 'var(--bg-3)',
              textDecoration: 'none',
              fontFamily: MONO,
              fontSize: 11.5,
              color: 'var(--fg-dim)',
            }}
          >
            <span style={{ color: 'var(--accent)' }}>▶</span> {block.label}
          </a>
        )}
        <figcaption style={{
          fontFamily: MONO,
          fontSize: 10.5,
          color: 'var(--muted-2)',
          marginTop: 8,
          letterSpacing: 0.02,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}>
          <span style={{ color: 'var(--accent)' }}>▶</span>
          <span style={{ textTransform: 'uppercase', letterSpacing: 0.08, fontSize: 10 }}>video</span>
          <span>·</span>
          <span>{block.label}</span>
        </figcaption>
      </figure>
    )
  }

  if (block.type === 'list') {
    const Tag = block.ordered ? 'ol' : 'ul'
    return (
      <Tag
        key={key}
        style={{
          margin: '0 0 22px',
          paddingLeft: 22,
          fontFamily: SANS,
          fontSize: 14,
          color: 'var(--fg-dim)',
          lineHeight: 1.75,
        }}
      >
        {block.items.map((item, i) => (
          <li key={i} style={{ marginBottom: 8 }} dangerouslySetInnerHTML={{ __html: item }} />
        ))}
      </Tag>
    )
  }

  if (block.type === 'equation') {
    return (
      <figure key={key} style={{ margin: '20px 0 22px', textAlign: 'center' }}>
        <div
          style={{
            display: 'inline-block',
            padding: '12px 18px',
            background: 'rgba(99,102,241,0.04)',
            border: '1px solid var(--border)',
            borderRadius: 4,
            fontFamily: '"Latin Modern Math", "STIX Two Math", Georgia, serif',
            fontStyle: 'italic',
            fontSize: 15,
            color: 'var(--fg)',
            lineHeight: 1.7,
            letterSpacing: 0.02,
            maxWidth: '100%',
            overflowX: 'auto',
          }}
          dangerouslySetInnerHTML={{ __html: block.html }}
        />
        {block.caption && (
          <figcaption style={{
            fontFamily: MONO, fontSize: 10.5, color: 'var(--muted-2)',
            marginTop: 6, letterSpacing: 0.02,
          }}>{block.caption}</figcaption>
        )}
      </figure>
    )
  }

  if (block.type === 'table') {
    return (
      <div key={key} style={{ margin: '18px 0 26px', overflowX: 'auto' }}>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontFamily: SANS,
          fontSize: 13,
          color: 'var(--fg-dim)',
        }}>
          <thead>
            <tr>
              {block.headers.map((h, i) => (
                <th key={i} style={{
                  textAlign: 'left',
                  padding: '8px 12px',
                  borderBottom: '1px solid var(--border-2)',
                  fontFamily: MONO,
                  fontSize: 10,
                  textTransform: 'uppercase',
                  letterSpacing: 0.08,
                  color: 'var(--muted)',
                  fontWeight: 500,
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {block.rows.map((row, i) => (
              <tr key={i}>
                {row.map((cell, j) => (
                  <td key={j} style={{
                    padding: '10px 12px',
                    borderBottom: '1px solid var(--border)',
                    verticalAlign: 'top',
                  }}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  return null
}
