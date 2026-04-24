import Link from 'next/link'
import { PageShell } from '@/components/page-shell'
import { Icon } from '@/components/icons'
import { CodeBlock } from '@/components/code-block'
import { PROJECTS } from '@/lib/data'

const MONO = '"JetBrains Mono", var(--font-mono), monospace'
const SANS = 'Inter, var(--font-inter), sans-serif'
const DISPLAY = 'Manrope, var(--font-manrope), sans-serif'
const GREEN = '#4ade80'

const TIMELINE = [
  { date: 'Mar 2026', title: 'Engagement starts', body: 'Client came in expecting a WordPress site. Ran a proper evaluation — WordPress wins on familiarity, loses on everything else for this brief.' },
  { date: 'Mar 2026', title: 'Stack decision: Next.js from scratch', body: 'Next.js 15 + Tailwind v4 + Neon + Drizzle + Resend. Full control over the Instant Estimate Tool UX, programmatic suburb pages, and performance that WordPress themes can\'t match.' },
  { date: 'Mar 2026', title: 'Instant Estimate Tool', body: 'The core UX bet: show the price range before asking for contact details. Reverses the standard lead-gen pattern — qualify first, capture second.' },
  { date: 'Apr 2026', title: 'SEO strategy + suburb pages', body: 'Five keyword verticals. Programmatic suburb page template covering Melbourne suburbs for local search. LLM/GEO schema on every page for AI-powered search visibility.', current: true },
]

const DECISIONS = [
  ['next.js 15', 'wordpress', 'WordPress themes can\'t do the Instant Estimate Tool without heavy plugin stacks, and programmatic suburb pages at scale need static generation — not a CMS. Next.js wins on both counts.'],
  ['price-first estimate tool', 'contact-first quote form', 'Standard quote forms promise a callback. Showing the price range first removes the friction point — users know what they\'re looking at before giving up their contact details. Better conversion, better-qualified leads.'],
  ['programmatic suburb pages', 'single city landing page', 'Local SEO in Melbourne is suburb-level. One page for "double glazing Melbourne" competes with every local trade. One page per suburb (/double-glazing-fitzroy, /double-glazing-richmond) targets the specific search intent.'],
  ['llm/geo schema', 'standard json-ld only', 'AI-powered search (ChatGPT, Perplexity, Google AI Overviews) pulls from structured, machine-readable content. Schema optimised for LLM extraction means the business shows up in AI-generated answers, not just blue links.'],
  ['resend', 'smtp / contact form plugin', 'Resend gives deliverability, logs, and a clean API. Estimate submissions and contact requests both route through a single Resend integration — no plugin dependency, no shared sending reputation.'],
]

const SUBURB_LINES = [
  `<span style="color:#71717a">// generateStaticParams — one page per suburb</span>`,
  `<span style="color:#c084fc">export async function</span> <span style="color:#60a5fa">generateStaticParams</span>() {`,
  `  <span style="color:#c084fc">const</span> suburbs = <span style="color:#c084fc">await</span> db`,
  `    .<span style="color:#60a5fa">select</span>()`,
  `    .<span style="color:#60a5fa">from</span>(suburbsTable)`,
  `  <span style="color:#c084fc">return</span> suburbs.<span style="color:#60a5fa">map</span>(s => ({ slug: s.slug }))`,
  `}`,
]

export default function KingGlazingPage() {
  const kg = PROJECTS.find(p => p.slug === 'king-glazing')!

  return (
    <PageShell>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '36px 28px' }}>

        {/* breadcrumb */}
        <div style={{ fontFamily: MONO, fontSize: 10, color: 'var(--muted-2)', marginBottom: 14 }}>
          <span style={{ color: 'var(--accent)' }}>❯</span>{' '}
          cd <Link href="/projects" style={{ color: 'var(--fg)', textDecoration: 'none' }}>projects</Link>/king-glazing
        </div>

        {/* Banner */}
        <div style={{ padding: '22px 0', borderTop: '1px solid var(--accent)', borderBottom: '1px solid var(--border)', marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 8, flexWrap: 'wrap' }}>
            <h1 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 36, margin: 0, letterSpacing: -0.025, color: 'var(--fg)' }}>King Double Glazing</h1>
            <span className="pill" style={{ color: GREEN, borderColor: 'rgba(74,222,128,0.3)', fontFamily: MONO }}>● live · freelance</span>
            <span style={{ fontFamily: MONO, fontSize: 9.5, color: 'var(--muted-2)', border: '1px dashed var(--border)', padding: '2px 6px', letterSpacing: 0.04 }}>updating</span>
          </div>
          <p style={{ fontFamily: SANS, fontSize: 14, color: 'var(--fg-dim)', lineHeight: 1.55, maxWidth: 580, margin: '0 0 16px' }}>
            Next.js 15 rebuild for a Melbourne double glazing business — Instant Estimate Tool that surfaces price before asking for contact details, programmatic suburb pages for local SEO, and LLM/GEO schema optimisation for AI-powered search visibility.
          </p>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            <a href="https://kingdoubleglazing.com.au" target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ fontFamily: MONO, fontSize: 10 }}><Icon name="external" size={11} /> live site</a>
          </div>
        </div>

        {/* Metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', marginBottom: 28 }}>
          {[
            { k: 'keyword verticals', v: '5' },
            { k: 'wordpress used', v: '0' },
            { k: 'estimate: price first', v: '✓' },
          ].map((m, i) => (
            <div key={m.k} style={{ padding: '14px 16px', borderLeft: i === 0 ? 'none' : '1px solid var(--border)' }}>
              <div style={{ fontFamily: DISPLAY, fontSize: 20, color: 'var(--accent)', fontWeight: 700, letterSpacing: -0.02 }}>{m.v}</div>
              <div style={{ fontFamily: MONO, fontSize: 9, color: 'var(--muted-2)', marginTop: 3, textTransform: 'uppercase', letterSpacing: 0.08 }}>{m.k}</div>
            </div>
          ))}
        </div>

        {/* Context */}
        <div style={{ marginBottom: 28 }}>
          <div className="section-label" style={{ fontFamily: MONO }}>Context</div>
          <p style={{ fontFamily: SANS, fontSize: 13, color: 'var(--fg-dim)', lineHeight: 1.7, margin: 0 }}>
            Freelance technical lead and SEO consultant, Mar 2026–present. King Double Glazing is a Melbourne trades business — double glazing retrofits for homes and apartments. The brief was a new website. The actual deliverable is an organic search acquisition channel: programmatic suburb pages, keyword-targeted content, and schema that surfaces in AI-generated answers as well as traditional search.
          </p>
        </div>

        {/* Timeline */}
        <div className="section-label" style={{ fontFamily: MONO }}>Timeline</div>
        <div style={{ position: 'relative', paddingLeft: 22, marginBottom: 28 }}>
          <div style={{ position: 'absolute', left: 5, top: 6, bottom: 6, width: 1, background: 'var(--border)' }} />
          {TIMELINE.map((e, i) => (
            <div key={i} style={{ position: 'relative', paddingBottom: 18 }}>
              <div style={{ position: 'absolute', left: -22, top: 4, width: 11, height: 11, borderRadius: 6, background: e.current ? 'var(--accent)' : 'var(--bg)', border: `1.5px solid ${e.current ? 'var(--accent)' : 'var(--muted-2)'}` }} />
              <div style={{ fontFamily: MONO, fontSize: 9.5, color: 'var(--muted-2)', marginBottom: 2, textTransform: 'uppercase', letterSpacing: 0.1 }}>{e.date}</div>
              <div style={{ fontFamily: MONO, fontSize: 12.5, color: 'var(--fg)', marginBottom: 3 }}>{e.title}</div>
              <div style={{ fontFamily: SANS, fontSize: 11.5, color: 'var(--muted)', lineHeight: 1.55, maxWidth: 460 }}>{e.body}</div>
            </div>
          ))}
        </div>

        {/* Key decisions */}
        <div className="section-label" style={{ fontFamily: MONO }}>Key technical decisions</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 28 }}>
          {DECISIONS.map(([a, b, note], i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '24px 1fr', gap: 12 }}>
              <span style={{ fontFamily: MONO, fontSize: 10, color: 'var(--accent)', paddingTop: 2 }}>0{i + 1}</span>
              <div>
                <div style={{ fontFamily: MONO, fontSize: 11, marginBottom: 4 }}>
                  <span style={{ color: GREEN }}>{a}</span>
                  <span style={{ color: 'var(--muted-2)' }}> › </span>
                  <span style={{ color: 'var(--muted)', textDecoration: 'line-through' }}>{b}</span>
                </div>
                <div style={{ fontFamily: SANS, fontSize: 12.5, color: 'var(--fg-dim)', lineHeight: 1.6 }}>{note}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Suburb pages */}
        <div className="section-label" style={{ fontFamily: MONO }}>Programmatic suburb pages</div>
        <div style={{ marginBottom: 12 }}>
          <CodeBlock lines={SUBURB_LINES} />
        </div>
        <p style={{ fontFamily: SANS, fontSize: 12.5, color: 'var(--muted)', lineHeight: 1.65, marginBottom: 28 }}>
          Every Melbourne suburb gets a statically generated page from a shared template. Suburb name, postcode, and local copy slots in at build time — Google indexes each as a distinct, geo-relevant page. A single "double glazing Melbourne" page can&apos;t compete with suburb-level intent; fifty suburb pages can.
        </p>

        {/* Stack */}
        <div className="section-label" style={{ fontFamily: MONO }}>Stack</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 28 }}>
          {Object.entries(kg.stack).map(([label, items]) => (
            <div key={label} style={{ display: 'flex', gap: 12, alignItems: 'baseline' }}>
              <span style={{ fontFamily: MONO, fontSize: 9, color: 'var(--muted-2)', textTransform: 'uppercase', letterSpacing: 0.08, width: 72, flexShrink: 0 }}>{label}</span>
              <span style={{ fontFamily: MONO, fontSize: 11, color: 'var(--muted)' }}>{items.join(' · ')}</span>
            </div>
          ))}
        </div>

        {/* Footer actions */}
        <div style={{ display: 'flex', gap: 8, paddingTop: 18, borderTop: '1px solid var(--border)', flexWrap: 'wrap' }}>
          <a href="https://kingdoubleglazing.com.au" target="_blank" rel="noopener noreferrer" className="btn" style={{ fontFamily: MONO, fontSize: 10 }}><Icon name="external" size={11} /> live site</a>
          <Link href="/projects" className="btn btn-ghost" style={{ fontFamily: MONO, fontSize: 10 }}>← back to projects</Link>
        </div>

      </div>
    </PageShell>
  )
}
