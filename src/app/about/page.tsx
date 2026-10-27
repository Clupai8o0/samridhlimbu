import type { Metadata } from 'next'
import Link from 'next/link'
import { MonoPortrait } from '@/components/mono-portrait'
import { PageShell } from '@/components/page-shell'
import { PageHeader } from '@/components/page-header'

const DESCRIPTION =
  'About Samridh Limbu, software engineer in Melbourne. Final-year CS at Deakin, contract software engineer, CTO at Hoddle Melbourne and president of DSEC. From Nepal.'

export const metadata: Metadata = {
  title: 'About',
  description: DESCRIPTION,
  alternates: { canonical: 'https://samridhlimbu.com/about' },
  // openGraph replaces the layout's object, so it carries every field.
  openGraph: {
    type: 'profile',
    locale: 'en_AU',
    siteName: 'Samridh Limbu',
    url: 'https://samridhlimbu.com/about',
    title: 'About · Samridh Limbu',
    description: DESCRIPTION,
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'Samridh Limbu · Software Engineer' }],
  },
}

const MONO = '"JetBrains Mono", var(--font-mono), monospace'
const SANS = 'Inter, var(--font-inter), sans-serif'
const DISPLAY = 'Manrope, var(--font-manrope), sans-serif'

const AVAILABILITY =
  'Final-year CS at Deakin, graduating June 2027. Open to summer 2026\u2060–\u206027 software engineering internships and graduate roles from mid-2027, in Melbourne.'

const VISA =
  'Based in Melbourne on a subclass 500 student visa with work rights; eligible for subclass 485 post-study from mid-2027.'

// From the Skills section of src/app/resume/page.tsx.
const STACK = [
  { k: 'languages/', v: 'TypeScript · Python · Go · SQL · C# · C/C++ (embedded)' },
  { k: 'frameworks/', v: 'Next.js · React · Vite · FastAPI · SQLAlchemy/Alembic · Drizzle ORM · Tailwind CSS · React Three Fiber · TanStack Query' },
  { k: 'data+infra/', v: 'PostgreSQL (pgvector) · Redis · Supabase · Neon · Firebase/Firestore · GCP (Cloud Run, Cloud SQL) · Vercel · Cloudflare · Docker · Linux/systemd · Prometheus · Grafana · Jenkins' },
  { k: 'ai+apis/', v: 'MCP servers (OAuth) · Claude/OpenAI/Gemini APIs · Vercel AI SDK · RAG (ChromaDB) · Playwright · MQTT · Shopify Storefront API (GraphQL) · Google Calendar API · Resend' },
]

const P: React.CSSProperties = { margin: 0, textWrap: 'pretty' }

export default function AboutPage() {
  return (
    <PageShell>
      <div data-stagger style={{ maxWidth: 680, margin: '0 auto', padding: '40px 24px 80px' }}>

        <PageHeader />

        {/* Breadcrumb */}
        <div data-stagger-item style={{ fontFamily: MONO, fontSize: 'var(--text-xs)', color: 'var(--muted-2)', marginBottom: 28 }}>
          <span aria-hidden="true" style={{ color: 'var(--accent)' }}>❯</span>{' '}
          cat ~/about.md<span className="t2-cursor thin" aria-hidden="true" />
        </div>

        {/* Header */}
        <div data-stagger-item style={{ display: 'flex', gap: 20, alignItems: 'center', marginBottom: 32 }}>
          <MonoPortrait size={80} />
          <div style={{ minWidth: 0 }}>
            <h1 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 'clamp(30px, 6vw, 36px)', lineHeight: 1.1, margin: '0 0 8px', letterSpacing: '-0.03em', color: 'var(--fg)' }}>
              Samridh Limbu
            </h1>
            <div style={{ fontFamily: MONO, fontSize: 'var(--text-sm)', color: 'var(--muted)' }}>
              software engineer · melbourne · he/him
            </div>
          </div>
        </div>

        {/* Bio */}
        <div data-stagger-item style={{ fontFamily: SANS, fontSize: 'var(--text-base)', color: 'var(--fg-dim)', lineHeight: 1.65, display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 40 }}>
          <p style={P}>
            I&apos;m a software engineer in my final year of computer science at Deakin, on a Vice-Chancellor&apos;s International Scholarship. Since July 2026 I&apos;ve worked as a contract software engineer for a US health-tech startup (under NDA). I&apos;m also CTO and the only developer at{' '}
            <Link href="/projects/hoddle" className="t2-link">Hoddle Melbourne</Link>, a mentorship platform for international students, and I lead{' '}
            <Link href="/projects/dsec" className="t2-link">DSEC</Link>. When barely anyone was showing up to our events and people were burning out, we stopped guessing and asked members what they&apos;d come to. We went from two events a week to one public event a month.
          </p>
          <p style={P}>
            I write mostly TypeScript and Python: Next.js and React on the front, FastAPI and Postgres behind. A lot of my time goes into making systems hold up. A search I took from seconds to under 200 ms. A{' '}
            <Link href="/projects/kairos" className="t2-link">scheduler</Link> written as pure functions, so all of its logic is unit-testable. A{' '}
            <Link href="/projects/lock-in" className="t2-link">desk sensor rig</Link> where any part can fail without taking down the rest. At BSides Melbourne 2026, Sham and I gave a talk on{' '}
            <Link href="/projects/allarkive" className="t2-link">AllArkive</Link>, an offline knowledge archive.
          </p>
          <p style={P}>
            I&apos;m from Nepal. Before code I did art, music, writing and photography, and I still think of myself as a generalist. My first hackathon team fell apart because I chased the tech and forgot to lead, so now I sort out roles and check-ins first. Outside all that I lift, and I keep an Obsidian vault of 600+ notes that Claude reads far more than I do.
          </p>
        </div>

        {/* Availability + visa */}
        <div data-reveal style={{ border: '1px solid var(--border-2)', borderRadius: 2, marginBottom: 40 }}>
          {[{ k: 'status', v: AVAILABILITY, dot: true }, { k: 'visa', v: VISA, dot: false }].map(row => (
            <div
              key={row.k}
              style={{
                display: 'grid', gridTemplateColumns: '64px minmax(0, 1fr)', gap: 12,
                padding: '14px 16px',
              }}
            >
              <span style={{ fontFamily: MONO, fontSize: 'var(--text-xs)', lineHeight: '22px', color: 'var(--muted-2)' }}>
                {row.dot && <span aria-hidden="true" style={{ color: 'var(--term-green)', marginRight: 6 }}>●</span>}
                {row.k}
              </span>
              <span style={{ fontFamily: SANS, fontSize: 15, lineHeight: 1.5, color: 'var(--fg-dim)' }}>{row.v}</span>
            </div>
          ))}
        </div>

        {/* Stack */}
        <div data-reveal>
          <div style={{ fontFamily: MONO, fontSize: 'var(--text-xs)', color: 'var(--muted-2)' }}>
            <span aria-hidden="true" style={{ color: 'var(--accent)' }}>❯</span> ls stack/
          </div>
          <dl style={{ margin: '16px 0 0', display: 'flex', flexDirection: 'column', gap: 14 }}>
            {STACK.map(s => (
              <div key={s.k} style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: 2 }}>
                <dt style={{ color: 'var(--accent)', fontFamily: MONO, fontSize: 'var(--text-xs)', lineHeight: 1.7 }}>{s.k}</dt>
                <dd style={{ margin: 0, color: 'var(--fg-dim)', fontFamily: SANS, fontSize: 15, lineHeight: 1.6 }}>{s.v}</dd>
              </div>
            ))}
          </dl>
        </div>

      </div>
    </PageShell>
  )
}
