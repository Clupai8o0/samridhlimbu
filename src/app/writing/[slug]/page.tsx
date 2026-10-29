import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { PageShell } from '@/components/page-shell'
import { postJsonLd } from '@/lib/seo'
import { PageHeader } from '@/components/page-header'
import { POSTS } from '@/lib/writing'
import type { ContentBlock } from '@/lib/writing'
import { highlight, HL_COLORS, extractYouTubeId } from '@/lib/highlight'
import { TableOfContents, type TocItem } from '@/components/table-of-contents'
import { CopyButton } from '@/components/copy-button'
import { ArticleChart } from '@/components/article-chart'

const MONO = '"JetBrains Mono", var(--font-mono), monospace'
const SANS = 'Inter, var(--font-inter), sans-serif'
const DISPLAY = 'Manrope, var(--font-manrope), sans-serif'

export async function generateStaticParams() {
  return POSTS.map(p => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post = POSTS.find(p => p.slug === slug)
  if (!post) return {}

  const url = `/writing/${post.slug}`
  // openGraph replaces the layout's object, so it carries every field.
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      url,
      title: `${post.title} · Samridh Limbu`,
      description: post.excerpt,
      publishedTime: post.date,
      images: [{ url: '/og.png', width: 1200, height: 630, alt: 'Samridh Limbu · Software Engineer' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${post.title} · Samridh Limbu`,
      description: post.excerpt,
      images: ['/og.png'],
    },
  }
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
    <PageShell jsonLd={postJsonLd(post)}>
      {tocItems.length > 0 && <TableOfContents items={tocItems} />}

      <div data-stagger style={{ maxWidth: 720, margin: '0 auto', padding: '36px 28px' }}>

        <PageHeader />

        {/* Breadcrumb */}
        <div data-stagger-item style={{ fontFamily: MONO, fontSize: 'var(--text-xs)', color: 'var(--muted-2)', marginBottom: 20, letterSpacing: '0.02em' }}>
          <span style={{ color: 'var(--accent)' }}>❯</span>{' '}
          cd ~/writing/
          <span style={{ color: 'var(--fg)', fontWeight: 500 }}>{post.slug}</span>
          <span>.md</span>
        </div>

        {/* Date + meta row */}
        <div style={{ fontFamily: MONO, fontSize: 'var(--text-xs)', color: 'var(--muted-2)', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, flexWrap: 'wrap', letterSpacing: '0.04em' }}>
          <span>{post.date}</span>
          <span>·</span>
          <span style={{ textTransform: 'uppercase' }}>{post.readMin} MIN</span>
          <span>·</span>
          {post.tags.map(tag => (
            <span key={tag} style={{ color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              #{tag}
            </span>
          ))}
        </div>

        {/* Title */}
        <h1 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 42, margin: '0 0 14px', letterSpacing: '-0.025em', color: 'var(--fg)', lineHeight: 1.1 }}>
          {post.title}
        </h1>

        {/* Excerpt */}
        <p style={{ fontFamily: SANS, fontSize: 14.5, color: 'var(--fg-dim)', lineHeight: 1.55, margin: '0 0 22px' }}>
          {post.excerpt}
        </p>

        {/* Author(s) */}
        {post.authors && post.authors.length > 0 ? (
          <div className="prose-authors" style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 22, flexWrap: 'wrap' }}>
            {post.authors.map((author, i) => (
              <span key={i} style={{ fontFamily: SANS, fontSize: 12.5, color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
                {i > 0 && <span className="prose-authors-sep" style={{ color: 'var(--border-2)', margin: '0 10px' }}>·</span>}
                <strong style={{ color: 'var(--fg)', fontWeight: 500, whiteSpace: 'nowrap' }}>{author.name}</strong>
                {author.role && (
                  <>
                    <span style={{ color: 'var(--muted-2)' }}>·</span>
                    <span style={{ color: 'var(--muted-2)' }}>{author.role}</span>
                  </>
                )}
              </span>
            ))}
          </div>
        ) : (
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
        )}

        {/* Space before the article body */}
        <div aria-hidden="true" style={{ height: 36 }} />

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
        <div style={{ paddingTop: 28, marginTop: 36 }}>
          <Link href="/writing" className="btn btn-ghost" style={{ fontFamily: MONO, fontSize: 'var(--text-xs)' }}>
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
          padding: '16px 22px',
          background: 'var(--bg-2)',
          borderRadius: 4,
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
          letterSpacing: '-0.015em',
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
          letterSpacing: '-0.02em',
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
            fontSize: 'var(--text-xs)',
            color: 'var(--muted-2)',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            marginBottom: 6,
          }}>
            {block.label}
          </div>
        )}
        <div style={{ position: 'relative' }}>
        <CopyButton code={block.code} />
        <pre className="prose-code" style={{
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
      </div>
    )
  }

  if (block.type === 'image') {
    return (
      <figure key={key} style={{ margin: '24px 0', textAlign: 'center' }}>
        <picture>
          {block.mobileSrc && <source media="(max-width: 640px)" srcSet={block.mobileSrc} />}
          <img
            src={block.src}
            alt={block.alt}
            style={{
              maxWidth: '100%',
              height: 'auto',
              borderRadius: 4,
              ...(block.lightBg ? {
                background: '#e8e8ea',
                border: '1px solid var(--border)',
                padding: 12,
                boxSizing: 'border-box' as const,
              } : {}),
            }}
          />
        </picture>
        {block.caption && (
          <figcaption style={{
            fontFamily: MONO,
            fontSize: 'var(--text-xs)',
            color: 'var(--muted-2)',
            marginTop: 8,
            letterSpacing: '0.02em',
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
              fontSize: 'var(--text-xs)',
              color: 'var(--fg-dim)',
            }}
          >
            <span style={{ color: 'var(--accent)' }}>▶</span> {block.label}
          </a>
        )}
        <figcaption style={{
          fontFamily: MONO,
          fontSize: 'var(--text-xs)',
          color: 'var(--muted-2)',
          marginTop: 8,
          letterSpacing: '0.02em',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}>
          <span style={{ color: 'var(--accent)' }}>▶</span>
          <span style={{ textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: 'var(--text-xs)' }}>video</span>
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
          paddingLeft: 28,
          fontFamily: SANS,
          fontSize: 14,
          color: 'var(--fg-dim)',
          lineHeight: 1.75,
          listStyleType: block.ordered ? 'decimal' : 'disc',
          listStylePosition: 'outside',
        }}
      >
        {block.items.map((item, i) => (
          <li key={i} style={{ marginBottom: 8, display: 'list-item' }} dangerouslySetInnerHTML={{ __html: item }} />
        ))}
      </Tag>
    )
  }

  if (block.type === 'equation') {
    return (
      <figure key={key} style={{ margin: '20px 0 22px', textAlign: 'center' }}>
        <div
          className="prose-eq"
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
            letterSpacing: '0.02em',
            maxWidth: '100%',
            overflowX: 'auto',
          }}
          dangerouslySetInnerHTML={{ __html: block.html }}
        />
        {block.caption && (
          <figcaption style={{
            fontFamily: MONO, fontSize: 'var(--text-xs)', color: 'var(--muted-2)',
            marginTop: 6, letterSpacing: '0.02em',
          }}>{block.caption}</figcaption>
        )}
      </figure>
    )
  }

  if (block.type === 'chart') {
    return <ArticleChart key={key} block={block} />
  }

  if (block.type === 'table') {
    const stack = block.headers.length > 2
    return (
      <div key={key} style={{ margin: '18px 0 26px', overflowX: 'auto' }}>
        <table role="table" aria-describedby={block.caption ? `table-caption-${key}` : undefined} className={stack ? 'prose-table-stack' : undefined} style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontFamily: SANS,
          fontSize: 13,
          color: 'var(--fg-dim)',
        }}>
          <thead role="rowgroup">
            <tr role="row">
              {block.headers.map((h, i) => (
                <th key={i} role="columnheader" style={{
                  textAlign: 'left',
                  padding: '8px 12px 10px',
                  fontFamily: MONO,
                  fontSize: 'var(--text-xs)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: 'var(--muted)',
                  fontWeight: 500,
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody role="rowgroup">
            {block.rows.map((row, i) => (
              <tr key={i} role="row" style={{ background: i % 2 === 1 ? 'var(--bg-2)' : undefined }}>
                {row.map((cell, j) => (
                  <td key={j} role="cell" data-label={block.headers[j]} style={{
                    padding: '10px 12px',
                    verticalAlign: 'top',
                  }} dangerouslySetInnerHTML={{ __html: cell }} />
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        {block.caption && (
          <p id={`table-caption-${key}`} style={{
            fontFamily: MONO, fontSize: 'var(--text-xs)', color: 'var(--muted-2)',
            margin: '10px 0 0', letterSpacing: '0.02em', lineHeight: 1.5,
          }}>{block.caption}</p>
        )}
      </div>
    )
  }

  return null
}
