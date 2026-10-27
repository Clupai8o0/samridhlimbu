import type { Metadata } from 'next'
import Link from 'next/link'
import { PageShell } from '@/components/page-shell'
import { PageHeader } from '@/components/page-header'
import { Icon } from '@/components/icons'
import { CodeBlock } from '@/components/code-block'
import { Shot } from '@/components/case-study/shot'

const DESCRIPTION =
  'GovHack 2025 winner. Ask in plain English and GovChat finds matching Australian government datasets, with sources and a five-factor trust score on every answer.'

export const metadata: Metadata = {
  title: 'GovChat',
  description: DESCRIPTION,
  alternates: { canonical: '/projects/govchat' },
  openGraph: {
    type: 'article',
    locale: 'en_AU',
    siteName: 'Samridh Limbu',
    url: '/projects/govchat',
    title: 'GovChat · Samridh Limbu',
    description: DESCRIPTION,
    images: [{ url: '/projects/govchat/home.webp', width: 2400, height: 1500, alt: 'The GovChat search screen' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GovChat · Samridh Limbu',
    description: DESCRIPTION,
    images: ['/projects/govchat/home.webp'],
  },
}

const MONO = '"JetBrains Mono", var(--font-mono), monospace'
const SANS = 'Inter, var(--font-inter), sans-serif'
const DISPLAY = 'Manrope, var(--font-manrope), sans-serif'
const GREEN = '#4ade80'

const TIMELINE = [
  { date: 'Aug 2025', title: 'Problem framing', body: 'Australian government data is spread across the ABS and dozens of department sites. Finding a dataset means knowing which agency holds it and what it is called. GovChat lets you ask in plain English instead.' },
  { date: 'Aug 2025', title: 'Catalogue and embeddings', body: 'Two crawlers, both respecting robots.txt. One walks *.gov.au for CSV, XLS, PDF and ZIP links; the other pulls page text from seed sites, with optional Playwright for pages that need JavaScript. ABS dataflow metadata is flattened into one catalogue, embedded with OpenAI and loaded into ChromaDB.' },
  { date: 'Aug 2025', title: 'Trust layer', body: 'Each answer returns the top four datasets, a trust score from five factors and an audit id. The frontend shows the factors, the sources with similarity badges and an audit view; the API stores the full record under that id. A React Flow graph lets you browse related datasets.' },
  { date: 'Dec 2025', title: 'Won GovHack 2025', body: 'GovChat was named a GovHack 2025 winner.', current: true },
]

const DECISIONS = [
  ['metadata-only answers', 'answers from the raw data', 'The model sees only dataset titles and agencies, not the data itself, so any figure it writes would be made up. A grounding pass swaps figures like "4.2 million" for "[data available]", and the trust score drops to zero when a leftover figure is detected.'],
  ['geometric trust score', 'weighted average', 'The score multiplies each factor raised to its weight. If one factor is zero, such as an answer with an invented figure, the whole score is zero. A weighted average would still show 0.7 and look safe.'],
  ['an audit record per answer', 'a bare answer', 'Each response saves the query, the raw matches, the answer and the trust factors under an audit id, so anyone can see why a dataset came back.'],
]

const TRUST_LINES = [
  `<span style="color:#71717a"># trust score: weighted geometric blend of five factors</span>`,
  `weights = {<span style="color:#86efac">"grounding"</span>: <span style="color:#fcd34d">0.30</span>, <span style="color:#86efac">"provenance"</span>: <span style="color:#fcd34d">0.20</span>, <span style="color:#86efac">"retrieval"</span>: <span style="color:#fcd34d">0.20</span>,`,
  `           <span style="color:#86efac">"verification"</span>: <span style="color:#fcd34d">0.20</span>, <span style="color:#86efac">"recency"</span>: <span style="color:#fcd34d">0.10</span>}`,
  ``,
  `factors[<span style="color:#86efac">"grounding"</span>] = <span style="color:#fcd34d">0.0</span> <span style="color:#c084fc">if</span> <span style="color:#60a5fa">detect_numeric_claims</span>(answer) <span style="color:#c084fc">else</span> <span style="color:#fcd34d">1.0</span>`,
  `factors[<span style="color:#86efac">"retrieval"</span>] = <span style="color:#fcd34d">1.0</span> <span style="color:#c084fc">if</span> max_sim &gt;= <span style="color:#fcd34d">0.90</span> <span style="color:#c084fc">else</span> max_sim`,
  ``,
  `score = <span style="color:#fcd34d">1.0</span>`,
  `<span style="color:#c084fc">for</span> name, w <span style="color:#c084fc">in</span> weights.<span style="color:#60a5fa">items</span>():`,
  `    score *= factors[name] ** w`,
]

export default function GovchatPage() {
  return (
    <PageShell>
      <div data-stagger style={{ maxWidth: 720, margin: '0 auto', padding: '36px 28px' }}>

        <PageHeader />

        {/* breadcrumb */}
        <div data-stagger-item style={{ fontFamily: MONO, fontSize: 'var(--text-xs)', color: 'var(--muted-2)', marginBottom: 14 }}>
          <span style={{ color: 'var(--accent)' }}>❯</span>{' '}
          cd <Link href="/projects" style={{ color: 'var(--fg)', textDecoration: 'none' }}>projects</Link>/govchat
        </div>

        {/* Banner */}
        <div data-stagger-item style={{ padding: '22px 0', marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 8, flexWrap: 'wrap' }}>
            <h1 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 36, margin: 0, letterSpacing: '-0.025em', color: 'var(--fg)' }}>GovChat</h1>
            <span className="pill" style={{ color: GREEN, borderColor: 'rgba(74,222,128,0.3)', fontFamily: MONO }}>● winner · GovHack 2025</span>
          </div>
          <p style={{ fontFamily: SANS, fontSize: 'var(--text-base)', color: 'var(--fg-dim)', lineHeight: 1.55, maxWidth: 580, margin: '0 0 16px' }}>
            Search Australian government datasets in plain English. GovChat returns the closest datasets from the ABS and *.gov.au sites, a short answer checked for made-up figures, and a five-factor trust score backed by an audit record.
          </p>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            <a href="https://github.com/Clupai8o0/govchat" target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ fontFamily: MONO, fontSize: 'var(--text-xs)' }}><Icon name="github" size={11} /> frontend</a>
            <a href="https://github.com/Clupai8o0/govchat-api" target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ fontFamily: MONO, fontSize: 'var(--text-xs)' }}><Icon name="github" size={11} /> api</a>
          </div>
        </div>

        {/* Metrics */}
        <div className="cs-metrics" style={{ marginBottom: 28 }}>
          {[
            { k: 'GovHack 2025', v: 'winner' },
            { k: 'trust factors per answer', v: '5' },
            { k: 'datasets per query', v: 'top 4' },
          ].map(m => (
            <div key={m.k} style={{ padding: '14px 16px 14px 0' }}>
              <div data-count style={{ fontFamily: DISPLAY, fontSize: 20, color: 'var(--accent)', fontWeight: 700, letterSpacing: '-0.02em' }}>{m.v}</div>
              <div style={{ fontFamily: MONO, fontSize: 'var(--text-xs)', color: 'var(--muted-2)', marginTop: 3, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{m.k}</div>
            </div>
          ))}
        </div>

        {/* Screenshot */}
        <div style={{ marginBottom: 28 }}>
          <Shot
            src="/projects/govchat/home.webp"
            alt="The GovChat search screen: a question box on the left and a side panel with Trust, Datasets, Explore and Tree View tabs"
            width={2400}
            height={1500}
            caption="Ask on the left. Trust factors, sources and the dataset graph sit in the side panel."
            priority
          />
        </div>

        {/* Context */}
        <div style={{ marginBottom: 28 }}>
          <div className="section-label" style={{ fontFamily: MONO }}>Context</div>
          <p style={{ fontFamily: SANS, fontSize: 15, color: 'var(--fg-dim)', lineHeight: 1.7, margin: 0 }}>
            A team project for GovHack 2025; the frontend and most of the API commits are mine. Public data is only useful if people can find it, and a wrong answer about government data does real harm. So GovChat answers from dataset metadata only, cites every source, and shows a trust score you can check against the audit record.
          </p>
        </div>

        {/* Timeline */}
        <div className="section-label" style={{ fontFamily: MONO }}>Timeline</div>
        <div style={{ position: 'relative', paddingLeft: 22, marginBottom: 28 }}>
          {TIMELINE.map((e, i) => (
            <div key={i} style={{ position: 'relative', paddingBottom: 18 }}>
              <div data-timeline-dot style={{ position: 'absolute', left: -22, top: 4, width: 11, height: 11, borderRadius: 6, background: e.current ? 'var(--accent)' : 'var(--bg)', border: `1.5px solid ${e.current ? 'var(--accent)' : 'var(--muted-2)'}` }} />
              <div style={{ fontFamily: MONO, fontSize: 'var(--text-xs)', color: 'var(--muted-2)', marginBottom: 2, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{e.date}</div>
              <div style={{ fontFamily: MONO, fontSize: 12.5, color: 'var(--fg)', marginBottom: 3 }}>{e.title}</div>
              <div style={{ fontFamily: SANS, fontSize: 'var(--text-sm)', color: 'var(--muted)', lineHeight: 1.6, maxWidth: 460 }}>{e.body}</div>
            </div>
          ))}
        </div>

        {/* Key decisions */}
        <div className="section-label" style={{ fontFamily: MONO }}>Key technical decisions</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 28 }}>
          {DECISIONS.map(([a, b, note], i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '24px 1fr', gap: 12 }}>
              <span style={{ fontFamily: MONO, fontSize: 'var(--text-xs)', color: 'var(--accent)', paddingTop: 2 }}>0{i + 1}</span>
              <div>
                <div style={{ fontFamily: MONO, fontSize: 'var(--text-xs)', marginBottom: 4 }}>
                  <span style={{ color: GREEN }}>{a}</span>
                  <span style={{ color: 'var(--muted-2)' }}> › </span>
                  <span style={{ color: 'var(--muted)', textDecoration: 'line-through' }}>{b}</span>
                </div>
                <div style={{ fontFamily: SANS, fontSize: 15, color: 'var(--fg-dim)', lineHeight: 1.6 }}>{note}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust score */}
        <div className="section-label" style={{ fontFamily: MONO }}>Trust score</div>
        <div style={{ marginBottom: 12 }}>
          <CodeBlock lines={TRUST_LINES} filename="retrieval.py (simplified)" lang="py" />
        </div>
        <p style={{ fontFamily: SANS, fontSize: 15, color: 'var(--muted)', lineHeight: 1.65, marginBottom: 28 }}>
          Grounding carries the most weight because invented figures are the worst failure. Retrieval reaches 1.0 only when the best match clears 0.90 similarity. The figure check is a pattern match, so it catches forms like &ldquo;4.2 million&rdquo; or &ldquo;5 percent&rdquo;, not every number. Two factors are placeholders for now: recency and verification sit at 1.0 until freshness tracking and checks on figures are built.
        </p>

        {/* Stack */}
        <div className="section-label" style={{ fontFamily: MONO }}>Stack</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 28 }}>
          {[
            { label: 'Frontend', items: 'Next.js 15 · React 19 · TypeScript · Tailwind v4 · React Flow' },
            { label: 'API', items: 'Python · FastAPI · pandas' },
            { label: 'Retrieval', items: 'OpenAI embeddings · ChromaDB' },
            { label: 'Ingestion', items: 'Python crawlers · Playwright for JS pages · ABS dataflow metadata' },
          ].map(({ label, items }) => (
            <div key={label} style={{ display: 'flex', gap: 12, alignItems: 'baseline' }}>
              <span style={{ fontFamily: MONO, fontSize: 'var(--text-xs)', color: 'var(--muted-2)', textTransform: 'uppercase', letterSpacing: '0.08em', width: 84, flexShrink: 0 }}>{label}</span>
              <span style={{ fontFamily: MONO, fontSize: 'var(--text-xs)', color: 'var(--muted)' }}>{items}</span>
            </div>
          ))}
        </div>

        {/* Footer actions */}
        <div style={{ display: 'flex', gap: 8, paddingTop: 18, flexWrap: 'wrap' }}>
          <a href="https://github.com/Clupai8o0/govchat" target="_blank" rel="noopener noreferrer" className="btn" style={{ fontFamily: MONO, fontSize: 'var(--text-xs)' }}><Icon name="github" size={11} /> frontend</a>
          <a href="https://github.com/Clupai8o0/govchat-api" target="_blank" rel="noopener noreferrer" className="btn" style={{ fontFamily: MONO, fontSize: 'var(--text-xs)' }}><Icon name="github" size={11} /> api</a>
          <Link href="/projects" className="btn btn-ghost" style={{ fontFamily: MONO, fontSize: 'var(--text-xs)' }}>← back to projects</Link>
        </div>

      </div>
    </PageShell>
  )
}
