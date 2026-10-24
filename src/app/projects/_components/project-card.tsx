import Image from 'next/image'
import Link from 'next/link'
import type { CSSProperties } from 'react'
import type { Project } from '@/lib/data'

const MONO = '"JetBrains Mono", var(--font-mono), monospace'
const SANS = 'Inter, var(--font-inter), sans-serif'
const DISPLAY = 'Manrope, var(--font-manrope), sans-serif'

// Two columns of about 325px inside the 720px page wrapper; one full-width
// column (viewport minus the 28px side padding) once the grid collapses.
const COVER_SIZES = '(max-width: 640px) calc(100vw - 56px), 340px'

// Hover and keyboard focus share one effect: the hairline brightens.
// The global :focus-visible rule adds the accent outline on top.
const CARD_CLASS = [
  'border',
  'border-[color:var(--border)]',
  'hover:border-[color:var(--border-2)]',
  'focus-visible:border-[color:var(--border-2)]',
  'transition-[border-color]',
  'duration-150',
  'ease-out',
  'motion-reduce:transition-none',
].join(' ')

interface Props {
  project: Project
  hasDetailPage: boolean
  /** Preload the cover. Use only for the first card above the fold. */
  preload?: boolean
}

// Only live projects get the green dot. Ended and archived ones keep their
// status as plain muted text so they never read as current.
function isLive(status: string): boolean {
  return /^live\b/i.test(status)
}

export function ProjectCard({ project: p, hasDetailPage, preload = false }: Props) {
  const live = isLive(p.status)

  const body = (
    <>
      <div
        style={{
          position: 'relative',
          aspectRatio: '16 / 10',
          overflow: 'hidden',
          borderBottom: '1px solid var(--border)',
          background: 'var(--bg-2)',
        }}
      >
        {p.cover
          ? (
            <Image
              src={p.cover}
              alt={p.coverAlt ?? `${p.name} screenshot`}
              fill
              sizes={COVER_SIZES}
              preload={preload}
              style={{ objectFit: 'cover', objectPosition: 'left top' }}
            />
          ) : (
            <div className="placeholder" style={{ position: 'absolute', inset: 0, border: 'none' }}>
              [ {p.slug} · cover ]
            </div>
          )
        }
      </div>

      <div style={{ padding: '14px 16px 16px', display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12 }}>
          <h2 style={{
            fontFamily: DISPLAY,
            fontWeight: 600,
            fontSize: 'var(--text-base)',
            lineHeight: 1.3,
            letterSpacing: '-0.01em',
            color: 'var(--fg)',
            margin: 0,
          }}>
            {p.name}
          </h2>
          <span style={{
            fontFamily: MONO,
            fontSize: 'var(--text-xs)',
            color: 'var(--muted-2)',
            whiteSpace: 'nowrap',
            fontVariantNumeric: 'tabular-nums',
          }}>
            {p.year}
          </span>
        </div>

        <p style={{
          fontFamily: SANS,
          fontSize: 'var(--text-sm)',
          color: 'var(--muted)',
          lineHeight: 1.55,
          margin: 0,
        }}>
          {p.pitchShort}
        </p>

        <div style={{
          marginTop: 'auto',
          paddingTop: 4,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          fontFamily: MONO,
          fontSize: 'var(--text-xs)',
          lineHeight: 1.4,
          color: 'var(--muted-2)',
          minWidth: 0,
        }}>
          {live && (
            <span
              aria-hidden="true"
              style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--term-green)', flexShrink: 0 }}
            />
          )}
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {p.status.toLowerCase()}
          </span>
          {p.updating && (
            <span style={{
              border: '1px dashed var(--border-2)',
              padding: '0 4px',
              borderRadius: 2,
              flexShrink: 0,
            }}>
              updating
            </span>
          )}
        </div>
      </div>
    </>
  )

  const frame: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    borderRadius: 2,
    overflow: 'hidden',
    background: 'var(--bg)',
    color: 'inherit',
    textDecoration: 'none',
  }

  if (!hasDetailPage) {
    return <article className={CARD_CLASS} style={frame}>{body}</article>
  }

  return (
    <Link
      href={`/projects/${p.slug}`}
      className={CARD_CLASS}
      style={frame}
    >
      {body}
    </Link>
  )
}
