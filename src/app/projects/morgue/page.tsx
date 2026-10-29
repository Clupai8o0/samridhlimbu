import type { Metadata } from 'next'
import Link from 'next/link'
import { PageShell } from '@/components/page-shell'
import { pageJsonLd } from '@/lib/seo'
import { PageHeader } from '@/components/page-header'
import { Icon } from '@/components/icons'
import { Shot } from '@/components/case-study/shot'

const DESCRIPTION =
  'morgue records repeatable video previews of UI animations, tags them with a fixed vocabulary, keeps the code and exports bundles that coding agents like Claude Code, Cursor and Codex can build from. SaaS in development, waitlist open at morgue.clupai.com.'

export const metadata: Metadata = {
  title: 'morgue · UI animation vault for coding agents',
  description: DESCRIPTION,
  alternates: { canonical: '/projects/morgue' },
  openGraph: {
    type: 'article',
    url: '/projects/morgue',
    title: 'morgue · Samridh Limbu',
    description: DESCRIPTION,
    images: [{ url: '/projects/morgue/desktop.webp', width: 2400, height: 1500, alt: 'The morgue landing page at morgue.clupai.com: "Give your AI taste."' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'morgue · Samridh Limbu',
    description: DESCRIPTION,
    images: ['/projects/morgue/desktop.webp'],
  },
}

const MONO = '"JetBrains Mono", var(--font-mono), monospace'
const SANS = 'Inter, var(--font-inter), sans-serif'
const DISPLAY = 'Manrope, var(--font-manrope), sans-serif'
const GREEN = 'var(--term-green)'

const PROSE = { fontFamily: SANS, fontSize: 15, color: 'var(--fg-dim)', lineHeight: 1.65, maxWidth: 640 }

const METRICS = [
  { k: 'WebGL contexts that survive of 40', v: '16' },
  { k: 'frames identical across two runs', v: '1113/1113' },
  { k: 'started', v: 'Aug 2026' },
]

const SHAPE: [string, string][] = [
  ['capture', 'Playwright drives Chrome on a faked clock; ffmpeg encodes'],
  ['meta.json', 'a fixed vocabulary for effect, technique and trigger'],
  ['export', 'a markdown bundle an agent can build from'],
  ['web/', 'Next.js 16: the landing page and the private vault'],
  ['accounts', 'Auth.js, Drizzle and Neon Postgres'],
  ['media', 'Cloudflare R2, public and private buckets'],
]

const DECISIONS = [
  ['a grid of videos', 'a grid of live demos', 'In Chrome, creating 40 WebGL contexts leaves exactly 16 alive, and removing a canvas does not free its context. A grid of live Three.js scenes would silently blank previews. So the grid shows a poster and plays video on hover, and only the detail page runs one item live.'],
  ['a faked clock', 'screen recording', 'Before any page script runs, the harness replaces the page clock and requestAnimationFrame, then steps one frame at a time. GSAP, Three.js, Lenis and motion all advance in lockstep, so two runs of the test fixtures produced 1113 of 1113 identical frames.'],
  ['a fixed vocabulary', 'free-text tags', 'Free-text tags rot into scroll, scrolling and scroll-anim within a month, and then search stops working. Every item is filed under a set list of effects, techniques and triggers.'],
  ['private media in its own bucket', 'gating the app only', 'The private R2 bucket has no public access and serves signed URLs only. Gating the app is worthless if the video behind it can be fetched by anyone holding a CDN link.'],
]

const STACK: [string, string[]][] = [
  ['Frontend', ['Next.js 16', 'React 19', 'TypeScript']],
  ['Backend', ['Node', 'Playwright', 'ffmpeg', 'Auth.js', 'Drizzle', 'Neon Postgres']],
  ['Infra', ['Cloudflare R2', 'Vercel', 'pnpm workspaces']],
]

export default function MorguePage() {
  return (
    <PageShell jsonLd={pageJsonLd(metadata)}>
      <div data-stagger style={{ maxWidth: 720, margin: '0 auto', padding: '36px 20px' }}>

        <PageHeader />

        {/* breadcrumb */}
        <div data-stagger-item style={{ fontFamily: MONO, fontSize: 'var(--text-xs)', color: 'var(--muted)', marginBottom: 16 }}>
          <span style={{ color: 'var(--accent)' }}>❯</span>{' '}
          cd <Link href="/projects" style={{ color: 'var(--fg)', textDecoration: 'none' }}>projects</Link>/morgue
        </div>

        {/* Banner */}
        <div data-stagger-item style={{ padding: '24px 0', marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', columnGap: 12, rowGap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
            <h1 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 'var(--text-2xl)', lineHeight: 1.1, margin: 0, letterSpacing: '-0.025em', color: 'var(--fg)' }}>morgue</h1>
            <span className="pill" style={{ fontFamily: MONO }}>in development · waitlist open</span>
          </div>
          <p style={{ ...PROSE, fontSize: 'var(--text-base)', margin: '0 0 18px' }}>
            A vault for UI animations that coding agents can use. morgue records a repeatable video preview of each effect, files it under a fixed vocabulary, keeps the code beside it, and exports a bundle that Claude Code, Cursor or Codex can build from. I founded it in August 2026; the waitlist is open and multi-user accounts are deployed ahead of launch.
          </p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <a href="https://morgue.clupai.com" target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ fontFamily: MONO }}><Icon name="external" size={12} /> morgue.clupai.com</a>
          </div>
        </div>

        {/* Hero shot */}
        <div data-stagger-item style={{ marginBottom: 24 }}>
          <Shot
            src="/projects/morgue/desktop.webp"
            alt="The morgue landing page: 'Give your AI taste.' beside a ghost holding a promo video, with a row of saved effect videos below"
            width={2400}
            height={1500}
            caption="morgue.clupai.com. The landing page and waitlist."
            priority
          />
        </div>

        {/* Metrics */}
        <div data-reveal className="cs-metrics" style={{ marginBottom: 40 }}>
          {METRICS.map((m) => (
            <div key={m.k} style={{ padding: '14px 16px 14px 0' }}>
              <div data-count style={{ fontFamily: DISPLAY, fontSize: 'var(--text-lg)', color: 'var(--accent)', fontWeight: 700, letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums' }}>{m.v}</div>
              <div style={{ fontFamily: MONO, fontSize: 'var(--text-xs)', color: 'var(--muted)', marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.06em', lineHeight: 1.4 }}>{m.k}</div>
            </div>
          ))}
        </div>

        {/* Problem */}
        <div style={{ marginBottom: 40 }}>
          <div className="section-label" style={{ fontFamily: MONO }}>The problem</div>
          <p style={{ ...PROSE, margin: 0 }}>
            Coding agents build UI from words and, at best, one screenshot. Motion does not survive that: a screenshot cannot show how a pinned scroll or a magnetic hover moves. And when I found an effect I liked, I had no good place to keep it where I could find it again, with the code and a note on how it works.
          </p>
        </div>

        {/* Solution */}
        <div style={{ marginBottom: 40 }}>
          <div className="section-label" style={{ fontFamily: MONO }}>The fix</div>
          <p style={{ ...PROSE, margin: 0 }}>
            morgue is that place. Hand it a component and it records a deterministic video preview, tags it, and keeps the source and a note beside it. Later you search for the one where the panels pin and scroll sideways and get the clip, the code and the note. The export bundle carries the source, its dependencies, its licence and a list of demo scaffolding the agent should not copy.
          </p>
        </div>

        {/* System shape */}
        <div className="section-label" style={{ fontFamily: MONO }}>System shape</div>
        <div style={{ fontFamily: MONO, fontSize: 'var(--text-xs)', background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 2, padding: '14px 16px', marginBottom: 14, lineHeight: 1.8 }}>
          {SHAPE.map(([part, desc]) => (
            <div key={part} style={{ display: 'flex', flexWrap: 'wrap', columnGap: 16 }}>
              <span style={{ color: 'var(--accent)', width: 120, flexShrink: 0 }}>{part}</span>
              <span style={{ color: 'var(--muted)', flex: '1 1 200px' }}>{desc}</span>
            </div>
          ))}
        </div>
        <p style={{ ...PROSE, color: 'var(--muted)', margin: '0 0 40px' }}>
          The rule that holds it together: the browse grid never runs code. Grid items are a poster and a short video; the real thing runs one item at a time.
        </p>

        {/* Key decisions */}
        <div className="section-label" style={{ fontFamily: MONO }}>Engineering details</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 40 }}>
          {DECISIONS.map(([a, b, note]) => (
            <div key={a}>
              <div style={{ fontFamily: MONO, fontSize: 'var(--text-xs)', marginBottom: 6, lineHeight: 1.5 }}>
                <span style={{ color: GREEN }}>{a}</span>
                <span style={{ color: 'var(--muted)' }}> over </span>
                <span style={{ color: 'var(--muted)', textDecoration: 'line-through' }}>{b}</span>
              </div>
              <div style={{ ...PROSE }}>{note}</div>
            </div>
          ))}
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
        <div style={{ display: 'flex', gap: 8, paddingTop: 20, flexWrap: 'wrap' }}>
          <a href="https://morgue.clupai.com" target="_blank" rel="noopener noreferrer" className="btn" style={{ fontFamily: MONO }}><Icon name="external" size={12} /> morgue.clupai.com</a>
          <Link href="/projects" className="btn btn-ghost" style={{ fontFamily: MONO }}>← back to projects</Link>
        </div>

      </div>
    </PageShell>
  )
}
