import type { Metadata } from 'next'
import Link from 'next/link'
import { PageShell } from '@/components/page-shell'
import { PageHeader } from '@/components/page-header'
import { Icon } from '@/components/icons'
import { Shot } from '@/components/case-study/shot'

const DESCRIPTION =
  'The platform behind DSEC, the Deakin Software Engineering Club (190+ members): a public site, a committee hub and a member portal on one FastAPI backend with ~24 routers and an MCP server. Built and led by its president.'

export const metadata: Metadata = {
  title: 'DSEC · club platform',
  description: DESCRIPTION,
  alternates: { canonical: '/projects/dsec' },
  openGraph: {
    type: 'article',
    url: '/projects/dsec',
    title: 'DSEC club platform · Samridh Limbu',
    description: DESCRIPTION,
    images: [{ url: '/projects/dsec/desktop.webp', width: 2400, height: 1500, alt: 'The DSEC public site at dsec.club' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DSEC club platform · Samridh Limbu',
    description: DESCRIPTION,
    images: ['/projects/dsec/desktop.webp'],
  },
}

const MONO = '"JetBrains Mono", var(--font-mono), monospace'
const SANS = 'Inter, var(--font-inter), sans-serif'
const DISPLAY = 'Manrope, var(--font-manrope), sans-serif'
const GREEN = 'var(--term-green)'

const PROSE = { fontFamily: SANS, fontSize: 15, color: 'var(--fg-dim)', lineHeight: 1.65, maxWidth: 640 }

const METRICS = [
  { k: 'members', v: '190+' },
  { k: 'committees', v: '5' },
  { k: 'API routers', v: '~24' },
  { k: 'audit findings → tickets', v: '212→121' },
]

const SHAPE: [string, string][] = [
  ['dsec-website', 'public site on dsec.club'],
  ['dsec-hub', 'committee hub'],
  ['dsec-app', 'member portal'],
  ['dsec-api', 'FastAPI: ~24 routers and an MCP server'],
  ['Neon Postgres', 'one database; dsec-api owns the schema'],
]

const STACK: [string, string[]][] = [
  ['Frontend', ['Next.js 16', 'Auth.js v5', 'Drizzle']],
  ['Backend', ['FastAPI', 'MCP']],
  ['Database', ['Neon Postgres']],
]

const EVENTS = [
  'Coding Agents workshop',
  'Physical AI workshop',
  'Prompt-to-Build Sprint',
  'DSEC Day Hackathon',
  '"Our Internship Experience" panel',
]

export default function DsecPage() {
  return (
    <PageShell>
      <div data-stagger style={{ maxWidth: 720, margin: '0 auto', padding: '36px 20px' }}>

        <PageHeader />

        {/* breadcrumb */}
        <div data-stagger-item style={{ fontFamily: MONO, fontSize: 'var(--text-xs)', color: 'var(--muted)', marginBottom: 16 }}>
          <span style={{ color: 'var(--accent)' }}>❯</span>{' '}
          cd <Link href="/projects" style={{ color: 'var(--fg)', textDecoration: 'none' }}>projects</Link>/dsec
        </div>

        {/* Banner */}
        <div data-stagger-item style={{ padding: '24px 0', borderTop: '1px solid var(--accent)', borderBottom: '1px solid var(--border)', marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', columnGap: 12, rowGap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
            <h1 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 'var(--text-2xl)', lineHeight: 1.1, margin: 0, letterSpacing: '-0.025em', color: 'var(--fg)' }}>DSEC</h1>
            <span className="pill" style={{ color: GREEN, borderColor: 'rgba(74,222,128,0.3)', fontFamily: MONO }}>● live · president</span>
          </div>
          <p style={{ ...PROSE, fontSize: 'var(--text-base)', margin: '0 0 18px' }}>
            I lead the Deakin Software Engineering Club and the development of its platform: a public site, a committee hub and a member portal, all on one FastAPI backend with about 24 routers and an MCP server.
          </p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <a href="https://dsec.club" target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ fontFamily: MONO }}><Icon name="external" size={12} /> dsec.club</a>
          </div>
        </div>

        {/* Hero shot */}
        <div data-stagger-item style={{ marginBottom: 24 }}>
          <Shot
            src="/projects/dsec/desktop.webp"
            alt="The DSEC home page: pixel-art headline 'We build real software' above a row of pixel rubber-duck mascots"
            width={2400}
            height={1500}
            caption="dsec.club, the public site."
            priority
          />
        </div>

        {/* Metrics */}
        <div data-reveal className="cs-metrics" style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', marginBottom: 40 }}>
          {METRICS.map((m) => (
            <div key={m.k} style={{ padding: '14px 16px 14px 0' }}>
              <div data-count style={{ fontFamily: DISPLAY, fontSize: 'var(--text-lg)', color: 'var(--accent)', fontWeight: 700, letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums' }}>{m.v}</div>
              <div style={{ fontFamily: MONO, fontSize: 'var(--text-xs)', color: 'var(--muted)', marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.06em', lineHeight: 1.4 }}>{m.k}</div>
            </div>
          ))}
        </div>

        {/* Context */}
        <div style={{ marginBottom: 40 }}>
          <div className="section-label" style={{ fontFamily: MONO }}>Context</div>
          <p style={{ ...PROSE, margin: 0 }}>
            President since June 2025. DSEC is a project-led club at Deakin Burwood with 190+ members across five committees. The whole platform shares one Postgres database: the public site shows events and projects, the committee hub and the member portal sit beside it.
          </p>
        </div>

        {/* System shape */}
        <div className="section-label" style={{ fontFamily: MONO }}>System shape</div>
        <div style={{ fontFamily: MONO, fontSize: 'var(--text-xs)', background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 2, padding: '14px 16px', marginBottom: 40, lineHeight: 1.8 }}>
          {SHAPE.map(([part, desc]) => (
            <div key={part} style={{ display: 'flex', flexWrap: 'wrap', columnGap: 16 }}>
              <span style={{ color: 'var(--accent)', width: 120, flexShrink: 0 }}>{part}</span>
              <span style={{ color: 'var(--muted)', flex: '1 1 200px' }}>{desc}</span>
            </div>
          ))}
        </div>

        {/* Events shot */}
        <div data-reveal style={{ marginBottom: 40 }}>
          <Shot
            src="/projects/dsec/events.webp"
            alt="The DSEC public events page: pixel-art headline 'Events people actually turn up to' beside a duck holding a trophy"
            width={2400}
            height={1500}
            caption="The public events page."
          />
        </div>

        {/* Security audit */}
        <div className="section-label" style={{ fontFamily: MONO }}>The handover audit</div>
        <p style={{ ...PROSE, margin: '0 0 40px' }}>
          Ahead of the committee handover I triaged a 212-finding security audit into 121 tickets.
        </p>

        {/* Projects shot */}
        <div data-reveal style={{ marginBottom: 40 }}>
          <Shot
            src="/projects/dsec/projects.webp"
            alt="The DSEC public projects page: 'Things our members shipped' beside a pixel duck at a laptop, above project cards"
            width={2400}
            height={1500}
            caption="The public projects page, fed from the API."
          />
        </div>

        {/* Leadership */}
        <div className="section-label" style={{ fontFamily: MONO }}>Running the club</div>
        <div style={{ marginBottom: 40 }}>
          <p style={{ ...PROSE, margin: '0 0 16px' }}>
            We used to run two events a week. Barely anyone showed up and the committee was burning out. We stopped guessing, asked members what they would actually come to, and moved to one public event a month. Events I ran in T2 2026:
          </p>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
            {EVENTS.map((e) => (
              <li key={e} style={{ display: 'grid', gridTemplateColumns: '16px 1fr', gap: 8, alignItems: 'baseline' }}>
                <span style={{ fontFamily: MONO, fontSize: 'var(--text-xs)', color: 'var(--accent)' }}>›</span>
                <span style={{ fontFamily: SANS, fontSize: 15, color: 'var(--fg-dim)' }}>{e}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Mobile shot */}
        <div data-reveal style={{ marginBottom: 40 }}>
          <Shot
            src="/projects/dsec/mobile.webp"
            alt="The DSEC home page on a phone, with the pixel headline, join and sponsor buttons stacked"
            width={1170}
            height={2532}
            caption="dsec.club at 390px."
            variant="mobile"
          />
        </div>

        {/* Stack */}
        <div className="section-label" style={{ fontFamily: MONO }}>Stack</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 40 }}>
          {STACK.map(([label, items]) => (
            <div key={label} style={{ display: 'flex', gap: 12, alignItems: 'baseline' }}>
              <span style={{ fontFamily: MONO, fontSize: 'var(--text-xs)', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em', width: 80, flexShrink: 0 }}>{label}</span>
              <span style={{ fontFamily: MONO, fontSize: 'var(--text-xs)', color: 'var(--fg-dim)', lineHeight: 1.6 }}>{items.join(' · ')}</span>
            </div>
          ))}
        </div>

        {/* Footer actions */}
        <div style={{ display: 'flex', gap: 8, paddingTop: 20, borderTop: '1px solid var(--border)', flexWrap: 'wrap' }}>
          <a href="https://dsec.club" target="_blank" rel="noopener noreferrer" className="btn" style={{ fontFamily: MONO }}><Icon name="external" size={12} /> dsec.club</a>
          <Link href="/projects" className="btn btn-ghost" style={{ fontFamily: MONO }}>← back to projects</Link>
        </div>

      </div>
    </PageShell>
  )
}
