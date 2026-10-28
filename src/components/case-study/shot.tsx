import Image from 'next/image'

const MONO = 'var(--font-mono), "JetBrains Mono", monospace'

export interface ShotProps {
  src: string
  alt: string
  width: number
  height: number
  caption?: string
  variant?: 'desktop' | 'mobile'
  priority?: boolean
  // A landscape version shown from 640px up, for diagrams drawn tall for phones.
  wide?: { src: string; width: number; height: number }
}

// A screenshot figure for case-study pages: hairline frame, 2px radius,
// optional mono caption. The mobile variant is narrow and centred so a
// phone shot never stretches to the full column width. It wipes open on
// scroll (data-reveal="wipe"; the CSS lives in globals.css).
export function Shot({ src, alt, width, height, caption, variant = 'desktop', priority = false, wide }: ShotProps) {
  const mobile = variant === 'mobile'
  const image = (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      // With a wide version the browser may pick either file, so don't preload
      // one; load it eagerly and early instead.
      preload={priority && !wide}
      loading={priority && wide ? 'eager' : undefined}
      fetchPriority={priority && wide ? 'high' : undefined}
      sizes={mobile ? '280px' : '(max-width: 776px) 100vw, 720px'}
      style={{ width: '100%', height: 'auto', display: 'block' }}
    />
  )
  return (
    <figure
      data-reveal="wipe"
      className={wide ? 'shot shot-tall' : 'shot'}
      style={{
        margin: 0,
        width: '100%',
        maxWidth: mobile ? 280 : undefined,
        marginLeft: mobile || wide ? 'auto' : undefined,
        marginRight: mobile || wide ? 'auto' : undefined,
      }}
    >
      <div
        className="shot-frame"
        style={{
          border: '1px solid var(--border)',
          borderRadius: 2,
          overflow: 'hidden',
          background: 'var(--bg-2)',
        }}
      >
        {wide ? (
          <picture>
            <source media="(min-width: 640px)" srcSet={wide.src} width={wide.width} height={wide.height} />
            {image}
          </picture>
        ) : image}
      </div>
      {caption ? (
        <figcaption
          className="shot-caption"
          style={{
            fontFamily: MONO,
            fontSize: 'var(--text-xs, 12px)',
            color: 'var(--muted)',
            lineHeight: 1.5,
            marginTop: 8,
            textAlign: mobile ? 'center' : 'left',
          }}
        >
          {caption}
        </figcaption>
      ) : null}
    </figure>
  )
}
