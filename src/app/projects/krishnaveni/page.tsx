import Image from 'next/image'
import Link from 'next/link'
import { PageShell } from '@/components/page-shell'
import { PageHeader } from '@/components/page-header'
import { Icon } from '@/components/icons'
import { PROJECTS } from '@/lib/data'

const MONO = '"JetBrains Mono", var(--font-mono), monospace'
const SANS = 'Inter, var(--font-inter), sans-serif'
const DISPLAY = 'Manrope, var(--font-manrope), sans-serif'
const GREEN = '#4ade80'

const TIMELINE = [
  { date: '2025', title: 'Client brief', body: "School was running on a static HTML site. Any content change — a new post, updated gallery, announcement — required emailing a developer. The brief: give non-technical staff full content control." },
  { date: '2026', title: 'Architecture decision', body: 'Chose Sanity v5 for structured content with typed GROQ queries. Designed a polymorphic section architecture — 13 section types rendered by SectionRenderer — so any page layout can be assembled in Studio without code changes.' },
  { date: '2026', title: 'Content pipeline', body: 'Built a custom data pipeline: fetch-sanity.mjs pulls a CMS snapshot, generate-data.mjs converts it into a static TypeScript file. The site runs without a live CMS connection at runtime — content is baked into the bundle.' },
  { date: '2026', title: 'Live at krishnavenischool.co.in', body: 'Deployed and handed over with a full handover doc. Staff independently manage all pages, posts, and facilities through Sanity Studio with no developer involvement.', current: true },
]

const DECISIONS = [
  ['sanity v5', 'wordpress', 'Schema-first CMS with typed GROQ queries. The Studio UI is clean and opinionated — staff adopted it without training docs. Schema-first model validates all content before it reaches the frontend.'],
  ['section-driven architecture', 'hardcoded page layouts', 'Page body is an array of typed section objects. SectionRenderer maps each _type to its component. Adding a new page section requires a data definition and a component — no routing changes, no rebuild required.'],
  ['static data pipeline', 'live sanity connection at runtime', 'fetch-sanity.mjs → generate-data.mjs → lib/data/index.ts bakes CMS data into the bundle. Site has zero runtime CMS dependency. Trade-off: requires a script re-run and redeploy to pick up content changes.'],
  ['next.js 15 + tailwind v4', 'cms theme', 'Full control over layout, typography, and performance. GSAP for scroll animations, Radix UI for accessible accordion FAQs and video lightbox dialogs. No theme constraints after handoff.'],
]

export default function KrishnaveniPage() {
  const krishnaveni = PROJECTS.find(p => p.slug === 'krishnaveni')!

  return (
    <PageShell>
      <div data-stagger style={{ maxWidth: 720, margin: '0 auto', padding: '36px 28px' }}>

        <PageHeader />

        {/* breadcrumb */}
        <div data-stagger-item style={{ fontFamily: MONO, fontSize: 10, color: 'var(--muted-2)', marginBottom: 14 }}>
          <span style={{ color: 'var(--accent)' }}>❯</span>{' '}
          cd <Link href="/projects" style={{ color: 'var(--fg)', textDecoration: 'none' }}>projects</Link>/krishnaveni
        </div>

        {/* Banner */}
        <div data-stagger-item style={{ padding: '22px 0', borderTop: '1px solid var(--accent)', borderBottom: '1px solid var(--border)', marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 8, flexWrap: 'wrap' }}>
            <h1 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 36, margin: 0, letterSpacing: -0.025, color: 'var(--fg)' }}>Krishnaveni</h1>
            <span className="pill" style={{ color: GREEN, borderColor: 'rgba(74,222,128,0.3)', fontFamily: MONO }}>● live · freelance</span>
          </div>
          <p style={{ fontFamily: SANS, fontSize: 14, color: 'var(--fg-dim)', lineHeight: 1.55, maxWidth: 580, margin: '0 0 16px' }}>
            Full school marketing website for Krishnaveni School, India — 13 section types, Sanity v5 CMS, and a section-driven architecture so staff manage all content without developer involvement. Delivered with a full handover doc.
          </p>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            <a href="https://krishnavenischool.co.in" target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ fontFamily: MONO, fontSize: 10 }}><Icon name="external" size={11} /> krishnavenischool.co.in</a>
            <a href="https://github.com/clupai8o0/krishnaveni-sanity" target="_blank" rel="noopener noreferrer" className="btn" style={{ fontFamily: MONO, fontSize: 10 }}><Icon name="github" size={11} /> code</a>
          </div>
        </div>

        {/* Metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', marginBottom: 28 }}>
          {[
            { k: 'SEO score', v: '92' },
            { k: 'Best Practices', v: '100' },
            { k: 'CLS', v: '0' },
          ].map((m, i) => (
            <div key={m.k} style={{ padding: '14px 16px', borderLeft: i === 0 ? 'none' : '1px solid var(--border)' }}>
              <div style={{ fontFamily: DISPLAY, fontSize: 20, color: 'var(--accent)', fontWeight: 700, letterSpacing: -0.02 }}>{m.v}</div>
              <div style={{ fontFamily: MONO, fontSize: 9, color: 'var(--muted-2)', marginTop: 3, textTransform: 'uppercase', letterSpacing: 0.08 }}>{m.k}</div>
            </div>
          ))}
        </div>

        {/* Screenshot */}
        <div style={{ marginBottom: 28 }}>
          <a href="https://krishnavenischool.co.in" target="_blank" rel="noopener noreferrer" style={{ display: 'block', position: 'relative', borderRadius: 6, overflow: 'hidden', border: '1px solid var(--border)' }}>
            <Image
              src="/projects/krishnaveni/homepage.webp"
              alt="Krishnaveni School homepage"
              width={1456}
              height={816}
              style={{ width: '100%', height: 'auto', display: 'block' }}
              priority
            />
            <div style={{ position: 'absolute', inset: 0, background: 'transparent', transition: 'background 0.15s' }} />
          </a>
          <div style={{ fontFamily: MONO, fontSize: 9.5, color: 'var(--muted-2)', marginTop: 6, textAlign: 'center', letterSpacing: 0.06 }}>krishnavenischool.co.in — homepage</div>
        </div>

        {/* Context */}
        <div style={{ marginBottom: 28 }}>
          <div className="section-label" style={{ fontFamily: MONO }}>Context</div>
          <p style={{ fontFamily: SANS, fontSize: 13, color: 'var(--fg-dim)', lineHeight: 1.7, margin: 0 }}>
            Freelance. The school was running on a static HTML site — any content change required a developer. Delivered a Next.js 15 monorepo with 13 section types, a Sanity v5 CMS, and a custom content pipeline that bakes CMS data into the bundle at build time. Staff manage pages, announcements, gallery posts, and facilities entirely through Studio. Handed over with a full handover doc.
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

        {/* What I'd do differently */}
        <div style={{ marginBottom: 28 }}>
          <div className="section-label" style={{ fontFamily: MONO }}>What I&apos;d do differently</div>
          <p style={{ fontFamily: SANS, fontSize: 12.5, color: 'var(--muted)', lineHeight: 1.7, margin: 0 }}>
            Performance sits at 72 desktop / 69 mobile — the bottleneck is TBT from GSAP and LCP from Sanity CDN image delivery. I&apos;d add <code style={{ fontFamily: MONO, fontSize: 11 }}>priority</code> hints on above-the-fold images, lazy-load GSAP until after first paint, and set up a Vercel revalidation webhook so content changes don&apos;t require a manual script re-run. CLS is 0 and SEO is 92, which are the signals that matter most for a school marketing site — but the performance gap is the honest thing to flag.
          </p>
        </div>

        {/* Testimonial */}
        <div style={{ marginBottom: 28 }}>
          <div className="section-label" style={{ fontFamily: MONO }}>In their words</div>
          <div style={{ borderLeft: '2px solid var(--accent)', paddingLeft: 16 }}>
            <p style={{ fontFamily: SANS, fontSize: 13.5, color: 'var(--fg)', lineHeight: 1.7, margin: '0 0 10px', fontStyle: 'italic' }}>
              &ldquo;We&rsquo;re not a technical team — we gave Samridh the brief and he handled everything else. What we asked for, he delivered. Then he delivered more.&rdquo;
            </p>
            <div style={{ fontFamily: MONO, fontSize: 10, color: 'var(--muted-2)', letterSpacing: 0.06 }}>
              Krishnaveni School · India
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div style={{ display: 'flex', gap: 8, paddingTop: 18, borderTop: '1px solid var(--border)', flexWrap: 'wrap' }}>
          <a href="https://krishnavenischool.co.in" target="_blank" rel="noopener noreferrer" className="btn" style={{ fontFamily: MONO, fontSize: 10 }}><Icon name="external" size={11} /> krishnavenischool.co.in</a>
          <a href="https://github.com/clupai8o0/krishnaveni-sanity" target="_blank" rel="noopener noreferrer" className="btn" style={{ fontFamily: MONO, fontSize: 10 }}><Icon name="github" size={11} /> source</a>
          <Link href="/projects" className="btn btn-ghost" style={{ fontFamily: MONO, fontSize: 10 }}>← back to projects</Link>
        </div>

      </div>
    </PageShell>
  )
}
