interface CodeBlockProps {
  lines: string[]
  filename?: string
  lang?: string
}

export function CodeBlock({ lines, filename = 'kairos/scheduler.py', lang = 'py' }: CodeBlockProps) {
  return (
    <div style={{ border: '1px solid var(--border)', background: 'var(--bg-2)', fontFamily: 'var(--font-mono, "JetBrains Mono", monospace)', fontSize: 10.5, lineHeight: 1.6 }}>
      <div style={{ padding: '6px 12px', borderBottom: '1px solid var(--border)', fontSize: 9, color: 'var(--muted-2)', letterSpacing: 0.08, textTransform: 'uppercase', display: 'flex', justifyContent: 'space-between' }}>
        <span>{filename}</span>
        <span>{lang}</span>
      </div>
      <pre style={{ margin: 0, padding: '12px 14px', color: 'var(--fg-dim)', whiteSpace: 'pre', overflow: 'auto' }}>
        {lines.map((line, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '24px 1fr', gap: 10 }}>
            <span style={{ color: 'var(--muted-2)', textAlign: 'right', userSelect: 'none' }}>{i + 1}</span>
            <span dangerouslySetInnerHTML={{ __html: line }} />
          </div>
        ))}
      </pre>
    </div>
  )
}
