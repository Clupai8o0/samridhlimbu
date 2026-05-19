import Link from 'next/link'
import { PageShell } from '@/components/page-shell'
import { PageHeader } from '@/components/page-header'
import { CodeBlock } from '@/components/code-block'
import { Icon } from '@/components/icons'
import { PROJECTS } from '@/lib/data'

const MONO = '"JetBrains Mono", var(--font-mono), monospace'
const SANS = 'Inter, var(--font-inter), sans-serif'
const DISPLAY = 'Manrope, var(--font-manrope), sans-serif'
const GREEN = '#4ade80'
const AMBER = '#f59e0b'

const TIMELINE = [
  {
    date: 'Apr 2026',
    title: 'Problem framing',
    body: 'The premise: you already have the internet. AllArkive is useful when you do, and more useful when you don\'t. Censorship, ISP outages, cloud rug-pulls. The library should work without the AI — the AI is the bonus.',
  },
  {
    date: 'May 2026',
    title: 'Architecture locked',
    body: 'Three replaceable layers: nginx landing page, Kiwix serving ZIM files (Wikipedia / iFixit / WikiMed / Stack Exchange), and a FastAPI RAG service wired as an OpenAI-compatible endpoint. Every service bound to 127.0.0.1 by default. Open WebUI doesn\'t know AllArkive exists — it just sees a model called allarkive-rag in the picker.',
  },
  {
    date: 'May 2026',
    title: 'The refusal gate',
    body: 'Most "RAG with citations" projects enforce no-hallucination with a system prompt and hope. AllArkive short-circuits the LLM call at the FastAPI layer if KNN retrieval returns nothing past the L2 threshold. The model is never given the chance to fabricate. (server.py:300–301)',
    highlight: true,
  },
  {
    date: 'May 16–17 2026',
    title: 'v0.1 shipped · BSides Melbourne',
    body: 'Talk delivered. Five containers, three ZIM bundles (minimal ~5 GB, balanced ~24 GB, comprehensive ~200 GB), bootstrap.sh that wires everything in one command. Balanced default: Wikipedia mini + WikiMed + iFixit + SuperUser SE + Unix SE + Ask Ubuntu.',
  },
  {
    date: 'May 2026',
    title: 'v0.2 — indexer rewrite',
    body: 'Full rewrite of the indexer: batched async embeddings (10–30× faster on CPU), int8 vector quantisation (768 B vs 3,072 B per chunk), offset-only chunk storage — chunks stored as (char_offset, char_len) pointers into the ZIM, not full text. Index drops to ~25% of ZIM size. Hybrid BM25 mode for large-ZIM Pi deployments (reciprocal rank fusion). Schema v2.',
    current: true,
  },
]

const DECISIONS = [
  [
    'api-layer refusal',
    'prompt-layer refusal',
    'The LLM call is short-circuited at the FastAPI boundary if KNN retrieval returns no chunks past the L2 distance threshold. The system prompt also instructs the model to cite every claim and respond with "no sources found" if nothing is relevant — but that\'s belt-and-braces. The API is the real boundary. The model cannot fabricate because it is never invoked.',
  ],
  [
    'sqlite-vec',
    'pgvector / qdrant / chroma',
    'No daemon, no schema migration, no running service. The entire index is one file you can rsync. On the Pi profile the index is ~10–15% of ZIM size with int8 quantisation. The choice matches the deployment target: a laptop or a Pi, not a server room.',
  ],
  [
    'openai-compatible /v1/chat/completions',
    'custom api shape',
    'Open WebUI is wired via OPENAI_API_BASE_URLS=http://rag:8000/v1. AllArkive appears as a model in the picker — any future OpenAI-compatible client works for free with no integration code.',
  ],
  [
    'AGPL-3.0',
    'MIT / Apache',
    'Deliberate, not default. GPL leaves a SaaS loophole: you can run GPL software as a network service without releasing the source. AGPL closes it. A company cannot host AllArkive as a service without open-sourcing their modifications.',
  ],
]

const REFUSAL_LINES = [
  `<span style="color:#71717a"># embed query → KNN top-5 (max L2 distance 1.0, normalised)</span>`,
  `chunks = vec_db.<span style="color:#60a5fa">knn</span>(`,
  `    <span style="color:#60a5fa">embed</span>(question), k=<span style="color:#fcd34d">5</span>, max_distance=<span style="color:#fcd34d">1.0</span>`,
  `)`,
  ``,
  `<span style="color:#71717a"># server.py:300–301 — LLM is never called if retrieval is empty</span>`,
  `<span style="color:#c084fc">if not</span> chunks:`,
  `-    <span style="color:#71717a"># system prompt: "if no passage is relevant, say no sources found"</span>`,
  `+    <span style="color:#c084fc">return</span> NO_SOURCES_TEXT  <span style="color:#71717a"># model cannot hallucinate</span>`,
  ``,
  `answer = ollama.<span style="color:#60a5fa">chat</span>(<span style="color:#60a5fa">build_prompt</span>(chunks, question))`,
  `<span style="color:#c084fc">return</span> <span style="color:#60a5fa">rewrite_citations</span>(answer)  <span style="color:#71717a"># [N] → [[N: title]](kiwix link)</span>`,
]

export default function AllArkivePage() {
  const project = PROJECTS.find(p => p.slug === 'allarkive')!

  return (
    <PageShell>
      <div data-stagger style={{ maxWidth: 720, margin: '0 auto', padding: '36px 28px' }}>

        <PageHeader />

        {/* breadcrumb */}
        <div data-stagger-item style={{ fontFamily: MONO, fontSize: 10, color: 'var(--muted-2)', marginBottom: 14 }}>
          <span style={{ color: 'var(--accent)' }}>❯</span>{' '}
          cd <Link href="/projects" style={{ color: 'var(--fg)', textDecoration: 'none' }}>projects</Link>/allarkive
        </div>

        {/* Banner */}
        <div data-stagger-item style={{ padding: '22px 0', borderTop: '1px solid var(--accent)', borderBottom: '1px solid var(--border)', marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 8, flexWrap: 'wrap' }}>
            <h1 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 36, margin: 0, letterSpacing: -0.025, color: 'var(--fg)' }}>AllArkive</h1>
            <span className="pill" style={{ color: AMBER, borderColor: 'rgba(245,158,11,0.3)', fontFamily: MONO }}>● open source · BSides Melb 2026</span>
          </div>
          <p style={{ fontFamily: SANS, fontSize: 14, color: 'var(--fg-dim)', lineHeight: 1.55, maxWidth: 580, margin: '0 0 16px' }}>
            A private, offline research assistant that runs on your own hardware, with citations you can check. Useful when your internet is fine. More useful when it isn&apos;t. Wikipedia, repair manuals, medical wiki, and Stack Exchange — all served by Kiwix, all searchable via a local LLM that refuses to answer when it has no source material to cite from.
          </p>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            <a href="https://github.com/clupai8o0/allarkive" target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ fontFamily: MONO, fontSize: 10 }}><Icon name="github" size={11} /> clupai8o0/allarkive</a>
          </div>
        </div>

        {/* Hero video — drop demo.mp4 into public/projects/allarkive/ */}
        <div style={{ marginBottom: 28, border: '1px solid var(--border)', overflow: 'hidden', background: 'var(--bg-2)' }}>
          <video
            src="/projects/allarkive/demo.mp4"
            autoPlay
            muted
            loop
            playsInline
            style={{ width: '100%', display: 'block' }}
          />
        </div>

        {/* Metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', marginBottom: 28 }}>
          {project.metrics!.map((m, i) => (
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
            Built with Sham, 2026. Presented at BSides Melbourne, May 16–17, 2026. The core problem: most "RAG with citations" systems enforce grounding at the prompt layer — they instruct the model not to hallucinate and trust it to comply. AllArkive enforces it at the API boundary: if the KNN retrieval step returns nothing past the L2 distance threshold, the FastAPI layer returns a fixed fallback string and the LLM is never invoked. The model cannot hallucinate because it is never called. The system prompt is belt-and-braces, not the actual constraint.
          </p>
        </div>

        {/* Timeline */}
        <div className="section-label" style={{ fontFamily: MONO }}>Timeline</div>
        <div style={{ position: 'relative', paddingLeft: 22, marginBottom: 28 }}>
          <div style={{ position: 'absolute', left: 5, top: 6, bottom: 6, width: 1, background: 'var(--border)' }} />
          {TIMELINE.map((e, i) => (
            <div key={i} style={{ position: 'relative', paddingBottom: 18 }}>
              <div style={{ position: 'absolute', left: -22, top: 4, width: 11, height: 11, borderRadius: 6, background: e.current ? 'var(--accent)' : 'var(--bg)', border: `1.5px solid ${e.highlight ? AMBER : e.current ? 'var(--accent)' : 'var(--muted-2)'}` }} />
              <div style={{ fontFamily: MONO, fontSize: 9.5, color: e.highlight ? AMBER : 'var(--muted-2)', marginBottom: 2, textTransform: 'uppercase', letterSpacing: 0.1 }}>{e.date}</div>
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

        {/* The refusal gate */}
        <div className="section-label" style={{ fontFamily: MONO }}>The refusal gate</div>
        <div style={{ marginBottom: 12 }}>
          <CodeBlock lines={REFUSAL_LINES} />
        </div>
        <p style={{ fontFamily: SANS, fontSize: 12.5, color: 'var(--muted)', lineHeight: 1.65, marginBottom: 28 }}>
          The system prompt tells the model to cite every claim with [N], use only the provided passages, and respond with &ldquo;no sources found&rdquo; if nothing is relevant. That instruction matters, but the real enforcement is two lines above it: the LLM call never executes if retrieval returned nothing. Citations are then rewritten from [N] to clickable Kiwix deep-links — anchored to the exact article that supplied the passage.
        </p>

        {/* Stack */}
        <div className="section-label" style={{ fontFamily: MONO }}>Stack</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 28 }}>
          {[
            { label: 'Glue', items: 'nginx · Docker Compose · bootstrap.sh · FastAPI RAG service' },
            { label: 'Local AI', items: 'Ollama (qwen2.5:7b default) · Open WebUI · nomic-embed-text' },
            { label: 'Archive', items: 'Kiwix · ZIM files (Wikipedia mini, WikiMed, iFixit, Stack Exchange)' },
            { label: 'Vector DB', items: 'sqlite-vec (vec0 virtual table) · int8 quantised embeddings' },
            { label: 'Targets', items: 'macOS · Linux · Raspberry Pi 4/5 · WSL2' },
          ].map(({ label, items }) => (
            <div key={label} style={{ display: 'flex', gap: 12, alignItems: 'baseline' }}>
              <span style={{ fontFamily: MONO, fontSize: 9, color: 'var(--muted-2)', textTransform: 'uppercase', letterSpacing: 0.08, width: 72, flexShrink: 0 }}>{label}</span>
              <span style={{ fontFamily: MONO, fontSize: 11, color: 'var(--muted)' }}>{items}</span>
            </div>
          ))}
        </div>

        {/* Footer actions */}
        <div style={{ display: 'flex', gap: 8, paddingTop: 18, borderTop: '1px solid var(--border)', flexWrap: 'wrap' }}>
          <a href="https://github.com/clupai8o0/allarkive" target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ fontFamily: MONO, fontSize: 10 }}><Icon name="github" size={11} /> source</a>
          <Link href="/projects" className="btn btn-ghost" style={{ fontFamily: MONO, fontSize: 10 }}>← back to projects</Link>
        </div>

      </div>
    </PageShell>
  )
}
