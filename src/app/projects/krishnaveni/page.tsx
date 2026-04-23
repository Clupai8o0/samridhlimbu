import Link from 'next/link'
import { PageShell } from '@/components/page-shell'
import { Icon } from '@/components/icons'
import { PROJECTS } from '@/lib/data'

const MONO = '"JetBrains Mono", var(--font-mono), monospace'
const SANS = 'Inter, var(--font-inter), sans-serif'
const DISPLAY = 'Manrope, var(--font-manrope), sans-serif'
const GREEN = '#4ade80'

const TIMELINE = [
  { date: '2025', title: 'Client brief', body: "School was running on a static HTML site. Non-technical staff had to email a developer to update anything. The brief: give staff full content control." },
  { date: '2025', title: 'CMS selection', body: 'Evaluated Contentful, Prismic, and Sanity. Sanity won on schema flexibility, the Vision plugin for live GROQ queries, and a clean enough Studio UI that staff can adopt it without training docs.' },
  { date: '2025', title: 'Multilingual requirement', body: 'School serves English, Hindi, and Telugu-speaking families. Built Accept-Language middleware to redirect to the correct locale on first visit, with a single URL structure — no subdomains.' },
  { date: '2025', title: 'Live at krishnaveniischool.co.in', body: 'Deployed. Staff independently update pages, announcements, and media through Sanity Studio.', current: true },
]

const DECISIONS = [
  ['sanity v3', 'wordpress', 'Schema-first CMS with typed GROQ queries. The Studio interface is clean and opinionated — fewer ways to accidentally break layout. Custom table plugin handles schedule data.'],
  ['accept-language middleware', 'subdomain per locale', 'Single URL structure, language redirect on first visit based on browser locale. Easier to share links, easier to maintain, no DNS complexity.'],
  ['next.js 15 + tailwind v4', 'cms theme', 'Full control over layout, typography, and performance. No theme limitations that would constrain the design after handoff.'],
  ['groq queries', 'rest api', 'GROQ lets you shape the exact data you need in a single query — no overfetching. next-sanity handles the client connection and revalidation.'],
]

export default function KrishnaveniPage() {
  const krishnaveni = PROJECTS.find(p => p.slug === 'krishnaveni')!

  return (
    <PageShell>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '36px 28px' }}>

        {/* breadcrumb */}
        <div style={{ fontFamily: MONO, fontSize: 10, color: 'var(--muted-2)', marginBottom: 14 }}>
          <span style={{ color: 'var(--accent)' }}>❯</span>{' '}
          cd <Link href="/projects" style={{ color: 'var(--fg)', textDecoration: 'none' }}>projects</Link>/krishnaveni
        </div>

        {/* Banner */}
        <div style={{ padding: '22px 0', borderTop: '1px solid var(--accent)', borderBottom: '1px solid var(--border)', marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 8, flexWrap: 'wrap' }}>
            <h1 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 36, margin: 0, letterSpacing: -0.025, color: 'var(--fg)' }}>Krishnaveni</h1>
            <span className="pill" style={{ color: GREEN, borderColor: 'rgba(74,222,128,0.3)', fontFamily: MONO }}>● live · freelance</span>
          </div>
          <p style={{ fontFamily: SANS, fontSize: 14, color: 'var(--fg-dim)', lineHeight: 1.55, maxWidth: 580, margin: '0 0 16px' }}>
            Headless CMS for a real school client — multilingual (EN/HI/TE) with Sanity v3 and Accept-Language middleware. Non-technical staff update pages, announcements, and media without developer involvement.
          </p>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            <a href="https://krishnaveni-sanity-client.vercel.app" target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ fontFamily: MONO, fontSize: 10 }}><Icon name="external" size={11} /> live preview</a>
            <a href="https://github.com/clupai8o0/krishnaveni-sanity" target="_blank" rel="noopener noreferrer" className="btn" style={{ fontFamily: MONO, fontSize: 10 }}><Icon name="github" size={11} /> code</a>
          </div>
        </div>

        {/* Metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', marginBottom: 28 }}>
          {[
            { k: 'languages', v: '3' },
            { k: 'client type', v: 'real' },
            { k: 'dev touch after deploy', v: '0' },
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
            Freelance. The school was running on a static HTML site that required a developer to update anything. The brief was clear: give non-technical staff full content control. Sanity Studio was the right call — structured content with typed GROQ queries, and a UI clean enough that staff adopted it without training docs.
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

        {/* Stack */}
        <div className="section-label" style={{ fontFamily: MONO }}>Stack</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 28 }}>
          {Object.entries(krishnaveni.stack).map(([label, items]) => (
            <div key={label} style={{ display: 'flex', gap: 12, alignItems: 'baseline' }}>
              <span style={{ fontFamily: MONO, fontSize: 9, color: 'var(--muted-2)', textTransform: 'uppercase', letterSpacing: 0.08, width: 72, flexShrink: 0 }}>{label}</span>
              <span style={{ fontFamily: MONO, fontSize: 11, color: 'var(--muted)' }}>{items.join(' · ')}</span>
            </div>
          ))}
        </div>

        {/* Footer actions */}
        <div style={{ display: 'flex', gap: 8, paddingTop: 18, borderTop: '1px solid var(--border)', flexWrap: 'wrap' }}>
          <a href="https://krishnaveni-sanity-client.vercel.app" target="_blank" rel="noopener noreferrer" className="btn" style={{ fontFamily: MONO, fontSize: 10 }}><Icon name="external" size={11} /> live preview</a>
          <a href="https://github.com/clupai8o0/krishnaveni-sanity" target="_blank" rel="noopener noreferrer" className="btn" style={{ fontFamily: MONO, fontSize: 10 }}><Icon name="github" size={11} /> source</a>
          <Link href="/projects" className="btn btn-ghost" style={{ fontFamily: MONO, fontSize: 10 }}>← back to projects</Link>
        </div>

      </div>
    </PageShell>
  )
}
