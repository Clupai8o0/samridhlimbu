import Image from 'next/image'

export function MonoPortrait({ size = 52 }: { size?: number }) {
  return (
    <div
      style={{
        width: size, height: size, flexShrink: 0,
        border: '1px solid var(--border-2)',
        position: 'relative', overflow: 'hidden',
        borderRadius: 2,
      }}
    >
      <Image
        src="/sam.jpeg"
        alt="Samridh Limbu"
        fill
        style={{ objectFit: 'cover', objectPosition: 'center top' }}
        priority
        sizes={`${size}px`}
      />
    </div>
  )
}
