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
}

// A screenshot figure for case-study pages: hairline frame, 2px radius,
// optional mono caption. The mobile variant is narrow and centred so a
// phone shot never stretches to the full column width.
export function Shot({ src, alt, width, height, caption, variant = 'desktop', priority = false }: ShotProps) {
  const mobile = variant === 'mobile'
  return (
    <figure
      style={{
        margin: 0,
        width: '100%',
        maxWidth: mobile ? 280 : undefined,
        marginLeft: mobile ? 'auto' : undefined,
        marginRight: mobile ? 'auto' : undefined,
      }}
    >
      <div
        style={{
          border: '1px solid var(--border)',
          borderRadius: 2,
          overflow: 'hidden',
          background: 'var(--bg-2)',
        }}
      >
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          preload={priority}
          sizes={mobile ? '280px' : '(max-width: 776px) 100vw, 720px'}
          style={{ width: '100%', height: 'auto', display: 'block' }}
        />
      </div>
      {caption ? (
        <figcaption
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
