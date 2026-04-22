export default function Loading() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: '"JetBrains Mono", monospace',
      fontSize: 11,
      color: 'var(--muted-2)',
      letterSpacing: '0.1em',
    }}>
      <span>loading<span className="t2-cursor" /></span>
    </div>
  )
}
