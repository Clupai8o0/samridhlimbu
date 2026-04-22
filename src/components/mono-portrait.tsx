export function MonoPortrait({ size = 52 }: { size?: number }) {
  return (
    <div
      style={{
        width: size, height: size, flexShrink: 0,
        border: '1px solid var(--border-2)',
        background: 'linear-gradient(180deg, #141418 0%, #0a0a0c 100%)',
        position: 'relative', overflow: 'hidden',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
    >
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(45deg, #0c0c0e 0 6px, #101014 6px 12px)', opacity: 0.75 }} />
      <svg width={size * 0.56} height={size * 0.56} viewBox="0 0 60 60" style={{ position: 'relative', opacity: 0.25 }}>
        <circle cx="30" cy="22" r="10" fill="#71717a" />
        <path d="M8 60 Q8 38 30 38 Q52 38 52 60 Z" fill="#71717a" />
      </svg>
    </div>
  )
}
