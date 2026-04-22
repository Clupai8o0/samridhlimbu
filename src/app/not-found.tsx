import Link from 'next/link'
import { PageShell } from '@/components/page-shell'

const MONO = '"JetBrains Mono", var(--font-mono), monospace'

export default function NotFound() {
  return (
    <PageShell>
      <div style={{ maxWidth: 740, margin: '0 auto', padding: '48px 32px' }}>
        <div style={{ height: 2, background: 'var(--accent)', marginBottom: 24 }} />
        <p style={{ fontFamily: MONO, fontSize: 10, color: 'var(--muted-2)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 28 }}>
          bash: command not found
        </p>
        <h1 style={{ fontFamily: MONO, fontSize: 52, fontWeight: 700, margin: '0 0 14px', color: 'var(--fg)' }}>
          404<span style={{ color: 'var(--accent)' }}>.</span>
        </h1>
        <p style={{ fontFamily: MONO, fontSize: 13, color: 'var(--fg-dim)', margin: '0 0 32px', lineHeight: 1.7 }}>
          The page you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link href="/" className="btn" style={{ fontFamily: MONO, fontSize: 11 }}>
          ← cd ~/home
        </Link>
      </div>
    </PageShell>
  )
}
