import Link from 'next/link'
import { PageShell } from '@/components/page-shell'
import { Icon } from '@/components/icons'
import { PROJECTS } from '@/lib/data'

const MONO = '"JetBrains Mono", var(--font-mono), monospace'

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ fontFamily: MONO, fontSize: 12, color: 'var(--fg-dim)', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ color: 'var(--accent)' }}>›</span>
        {children}
      </div>
      <div style={{ height: 1, background: 'var(--accent)', opacity: 0.35 }} />
    </div>
  )
}

const CONTACTS = [
  { icon: 'mail',     text: 'samridh@samridhlimbu.com', href: 'mailto:samridh@samridhlimbu.com' },
  { icon: 'github',   text: 'github.com/samridhlimbu',  href: 'https://github.com/samridhlimbu' },
  { icon: 'linkedin', text: 'in/samridhlimbu',           href: 'https://linkedin.com/in/samridhlimbu' },
  { icon: 'file',     text: 'resume.pdf',                href: '/resume' },
]

export default function HomePage() {
  const featured = PROJECTS.filter(p => p.featured).slice(0, 3)

  return (
    <PageShell>
      <div style={{ maxWidth: 740, margin: '0 auto', padding: '48px 32px' }}>

        {/* Top accent rule */}
        <div style={{ height: 2, background: 'var(--accent)', marginBottom: 24 }} />

        {/* Breadcrumb */}
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          fontFamily: MONO, fontSize: 10, color: 'var(--muted-2)',
          letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 28,
        }}>
          <span>/home/sl</span>
          <span>samridhlimbu.com · v0.1</span>
        </div>

        {/* Name */}
        <h1 style={{ fontFamily: MONO, fontSize: 52, fontWeight: 700, margin: '0 0 14px', letterSpacing: '-0.02em', lineHeight: 1 }}>
          <span style={{ color: 'var(--fg)' }}>samridh </span>
          <span style={{ color: 'var(--accent)' }}>limbu</span>
        </h1>

        {/* Tagline */}
        <p style={{ fontFamily: MONO, fontSize: 14, color: 'var(--fg-dim)', margin: '0 0 36px', lineHeight: 1.65 }}>
          frontend-focused <span style={{ color: 'var(--accent)' }}>software engineer</span> in melbourne, building production backends.
        </p>

        <div style={{ height: 1, background: 'var(--border)', marginBottom: 36 }} />

        {/* whoami */}
        <div style={{ marginBottom: 36 }}>
          <SectionHeader>whoami</SectionHeader>
          <p style={{ fontFamily: MONO, fontSize: 13, color: 'var(--fg-dim)', margin: '0 0 20px', lineHeight: 1.75 }}>
            3rd-year CS at Deakin. Available for 2026–27 software engineering internships and graduate roles in Melbourne.
          </p>
          <div style={{
            border: '1px dashed var(--border-2)', borderRadius: 4,
            padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            fontFamily: MONO, fontSize: 11, color: 'var(--muted)',
          }}>
            <span>
              <span style={{ color: 'var(--term-green)' }}>●</span>
              {' '}status: available · nov 2026 – feb 2027
            </span>
            <span style={{ color: 'var(--muted-2)' }}>last_updated: 2026-04-21</span>
          </div>
        </div>

        <div style={{ height: 1, background: 'var(--border)', marginBottom: 36 }} />

        {/* contact */}
        <div style={{ marginBottom: 36 }}>
          <SectionHeader>contact --list</SectionHeader>
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr',
            border: '1px solid var(--border)', borderRadius: 4, overflow: 'hidden',
          }}>
            {CONTACTS.map((c, i) => (
              <a
                key={c.icon}
                href={c.href}
                target={c.href.startsWith('http') ? '_blank' : undefined}
                rel={c.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="contact-item"
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '15px 18px',
                  fontFamily: MONO, fontSize: 11, color: 'var(--fg-dim)', textDecoration: 'none',
                  borderRight: i % 2 === 0 ? '1px solid var(--border)' : undefined,
                  borderBottom: i < 2 ? '1px solid var(--border)' : undefined,
                }}
              >
                <span style={{ color: 'var(--accent)', flexShrink: 0, display: 'flex' }}>
                  <Icon name={c.icon} size={13} />
                </span>
                {c.text}
              </a>
            ))}
          </div>
        </div>

        <div style={{ height: 1, background: 'var(--border)', marginBottom: 36 }} />

        {/* projects */}
        <div>
          <SectionHeader>projects --featured --limit=3</SectionHeader>
          {featured.map((p, i) => (
            <Link
              key={p.slug}
              href={p.slug === 'kairos' ? '/projects/kairos' : '/projects'}
              className="row-hover"
              style={{
                display: 'grid', gridTemplateColumns: '40px 1fr 20px', gap: 16,
                padding: '16px 0', borderBottom: '1px solid var(--border)',
                alignItems: 'center', textDecoration: 'none', color: 'inherit',
              }}
            >
              <span style={{ fontFamily: MONO, fontSize: 10, color: 'var(--accent)' }}>0{i + 1}</span>
              <div>
                <div style={{ fontFamily: MONO, fontSize: 13, color: 'var(--fg)', marginBottom: 3 }}>
                  {p.name.toLowerCase()}
                </div>
                <div style={{ fontFamily: MONO, fontSize: 11, color: 'var(--muted)' }}>{p.pitchShort}</div>
              </div>
              <span style={{ color: 'var(--muted-2)', display: 'flex', justifyContent: 'flex-end' }}>
                <Icon name="arrow-up-right" size={12} />
              </span>
            </Link>
          ))}
        </div>

      </div>
    </PageShell>
  )
}
