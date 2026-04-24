import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { PageShell } from '@/components/page-shell'
import { Icon } from '@/components/icons'
import { ContactForm } from '@/components/contact-form'
import { PROJECTS } from '@/lib/data'

export const metadata: Metadata = {
  alternates: { canonical: 'https://samridhlimbu.com' },
  openGraph: { url: 'https://samridhlimbu.com' },
}

const PERSON_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Samridh Limbu',
  url: 'https://samridhlimbu.com',
  jobTitle: 'Software Engineer',
  description: 'Full-stack software engineer in Melbourne. Next.js, TypeScript, PostgreSQL.',
  email: 'samridh@samridhlimbu.com',
  sameAs: [
    'https://github.com/clupai8o0',
    'https://linkedin.com/in/samridh-limbu',
  ],
  worksFor: [
    { '@type': 'Organization', name: 'Hoddle Melbourne', url: 'https://hoddle.org' },
  ],
  alumniOf: { '@type': 'EducationalOrganization', name: 'Deakin University' },
  address: { '@type': 'PostalAddress', addressLocality: 'Melbourne', addressCountry: 'AU' },
}

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
  { icon: 'github',   text: 'github.com/clupai8o0',     href: 'https://github.com/clupai8o0' },
  { icon: 'linkedin', text: 'in/samridh-limbu',          href: 'https://linkedin.com/in/samridh-limbu' },
  { icon: 'file',     text: 'resume.pdf',                href: '/resume' },
]

export default function HomePage() {
  const featured = PROJECTS.filter(p => p.featured)

  return (
    <PageShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(PERSON_SCHEMA) }}
      />
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

        {/* Hero: photo + name */}
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 24, marginBottom: 14 }}>
          <div style={{ position: 'relative', width: 96, height: 96, flexShrink: 0, border: '1px solid var(--border-2)', borderRadius: 2, overflow: 'hidden' }}>
            <Image src="/sam.jpeg" alt="Samridh Limbu" fill style={{ objectFit: 'cover', objectPosition: 'center top' }} priority sizes="96px" />
          </div>
          <h1 style={{ fontFamily: MONO, fontSize: 52, fontWeight: 700, margin: 0, letterSpacing: '-0.02em', lineHeight: 1 }}>
            <span style={{ color: 'var(--fg)' }}>samridh </span>
            <span style={{ color: 'var(--accent)' }}>limbu</span>
          </h1>
        </div>

        {/* Tagline */}
        <p style={{ fontFamily: MONO, fontSize: 14, color: 'var(--fg-dim)', margin: '0 0 36px', lineHeight: 1.65 }}>
          full-stack <span style={{ color: 'var(--accent)' }}>software engineer</span> in melbourne. next.js · python · postgres.
        </p>

        <div style={{ height: 1, background: 'var(--border)', marginBottom: 36 }} />

        {/* whoami */}
        <div style={{ marginBottom: 36 }}>
          <SectionHeader>whoami</SectionHeader>
          <p style={{ fontFamily: MONO, fontSize: 13, color: 'var(--fg-dim)', margin: '0 0 12px', lineHeight: 1.75 }}>
            3rd-year BCS (IoT) at Deakin, graduating June 2027. CTO at Hoddle Melbourne (sole developer), solo founder of Kairos, co-founder at TapCraft Studio, and president of DSEC — 190+ members.
          </p>
          <p style={{ fontFamily: MONO, fontSize: 13, color: 'var(--fg-dim)', margin: '0 0 20px', lineHeight: 1.75 }}>
            Seeking SWE internships for <span style={{ color: 'var(--fg)' }}>Nov 2026–Feb 2027</span> — Australia&apos;s summer semester break, when my Subclass 500 student visa permits unlimited work hours. Graduate roles open from <span style={{ color: 'var(--fg)' }}>June 2027</span>. No sponsorship required; Subclass 500 converts to Subclass 485 post-study automatically.
          </p>
          <div style={{
            border: '1px dashed var(--border-2)', borderRadius: 4,
            padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            fontFamily: MONO, fontSize: 11, color: 'var(--muted)',
          }}>
            <span>
              <span style={{ color: 'var(--term-green)' }}>●</span>
              {' '}internship: nov 2026–feb 2027 · grad: from jun 2027
            </span>
            <span style={{ color: 'var(--muted-2)' }}>last_updated: 2026-04-23</span>
          </div>
        </div>

        <div style={{ height: 1, background: 'var(--border)', marginBottom: 36 }} />

        {/* contact */}
        <div style={{ marginBottom: 36 }}>
          <SectionHeader>contact --list</SectionHeader>
          <div
            className="t2-contact-grid"
            style={{ display: 'grid', border: '1px solid var(--border)', borderRadius: 4, overflow: 'hidden' }}
          >
            {CONTACTS.map((c) => (
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
        <div style={{ marginBottom: 36 }}>
          <SectionHeader>projects --featured</SectionHeader>
          {featured.slice(0, 3).map((p, i) => (
            <Link
              key={p.slug}
              href={`/projects/${p.slug}`}
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
          <Link
            href="/projects"
            className="row-hover"
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '13px 0', textDecoration: 'none',
              fontFamily: MONO, fontSize: 10.5, color: 'var(--muted-2)',
            }}
          >
            <span>view all projects</span>
            <Icon name="arrow-up-right" size={11} />
          </Link>
        </div>

        <div style={{ height: 1, background: 'var(--border)', marginBottom: 36 }} />

        {/* get in touch */}
        <div style={{ marginBottom: 16 }}>
          <SectionHeader>get_in_touch()</SectionHeader>
          <ContactForm />
        </div>

      </div>
    </PageShell>
  )
}
