import { PageShell } from '@/components/page-shell'
import { Prompt } from '@/components/prompt'
import { Icon } from '@/components/icons'

const MONO = '"JetBrains Mono", var(--font-mono), monospace'
const SANS = 'Inter, var(--font-inter), sans-serif'
const DISPLAY = 'Manrope, var(--font-manrope), sans-serif'

const SECTIONS = [
  {
    label: 'Experience',
    rows: [
      {
        head: 'President · DSEC · Deakin Software Engineering Club',
        meta: '2025–present',
        body: '190+ members. Sponsorship drive with Canva, Atlassian, local SaaS. Curated workshop series on production engineering.',
      },
      {
        head: 'Co-founder · TapCraft Studio',
        meta: '2025–present',
        body: 'Designed and implemented headless Shopify storefront (React Three Fiber). Maintained fulfillment pipeline for NFC products.',
      },
      {
        head: 'Freelance Software Engineer',
        meta: '2024–present',
        body: 'Developed and deployed Next.js + Postgres applications for Melbourne operators (King Double Glazing, Hoddle).',
      },
      {
        head: 'Technical Systems Assistant · Deakin Law School',
        meta: '2024–present',
        body: 'Systems diagnostics, AV, faculty technical support.',
      },
    ],
  },
  {
    label: 'Education',
    rows: [
      {
        head: 'Deakin University · B. Computer Science (IoT)',
        meta: '2023–2026 · WAM ~87',
        body: "Vice-Chancellor's International Scholarship. DSEC President.",
      },
    ],
  },
  {
    label: 'Selected projects',
    rows: [
      {
        head: 'Kairos · scheduling API',
        meta: 'Python/FastAPI · Postgres · Next.js',
        body: 'p95 38ms · 84% coverage · 99.96% uptime.',
      },
      {
        head: 'TapCraft Studio · commerce',
        meta: 'Remix · RTF · Shopify',
        body: '8.2k sessions/mo · 3.1% CVR · LCP 1.1s.',
      },
    ],
  },
]

export default function ResumePage() {
  return (
    <PageShell>
      <div style={{ maxWidth: 600, margin: '0 auto', padding: '36px 28px' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', paddingBottom: 16, borderBottom: '1px solid var(--accent)', marginBottom: 24 }}>
          <div>
            <h1 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 22, margin: '0 0 4px', letterSpacing: -0.02, color: 'var(--fg)' }}>Samridh Limbu</h1>
            <div style={{ fontFamily: SANS, fontSize: 12.5, color: 'var(--muted)' }}>Software Engineer · Melbourne</div>
            <div style={{ fontFamily: MONO, fontSize: 10, color: 'var(--muted-2)', marginTop: 4 }}>samridh@samridhlimbu.com · samridhlimbu.com</div>
          </div>
          <a href="/resume.pdf" className="btn btn-primary" style={{ fontFamily: MONO, fontSize: 10 }}>
            <Icon name="download" size={11} /> PDF
          </a>
        </div>

        {/* Summary */}
        <p style={{ fontFamily: SANS, fontSize: 13, color: 'var(--fg-dim)', lineHeight: 1.65, marginBottom: 24 }}>
          3rd-year CS (IoT) at Deakin. I design, develop, implement, test, deploy, document, and maintain full-stack applications in TypeScript, Python, and Go. Available Nov 2026 – Feb 2027 and mid-2027 graduate roles.
        </p>

        {/* Sections */}
        {SECTIONS.map(sec => (
          <div key={sec.label} style={{ marginBottom: 24 }}>
            <div className="section-label" style={{ fontFamily: MONO }}>{sec.label}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {sec.rows.map((r, i) => (
                <div key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12 }}>
                    <div style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 12.5, color: 'var(--fg)' }}>{r.head}</div>
                    <div style={{ fontFamily: MONO, fontSize: 9.5, color: 'var(--muted-2)', whiteSpace: 'nowrap' }}>{r.meta}</div>
                  </div>
                  <div style={{ fontFamily: SANS, fontSize: 11.5, color: 'var(--muted)', marginTop: 4, lineHeight: 1.55 }}>{r.body}</div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Footer hint */}
        <div style={{ marginTop: 20, fontSize: 10, color: 'var(--muted-2)', fontFamily: MONO }}>
          <span style={{ color: 'var(--accent)' }}>❯</span> end of file · press <kbd>q</kbd> to quit
        </div>

      </div>
    </PageShell>
  )
}
