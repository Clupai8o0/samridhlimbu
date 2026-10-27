import type { Metadata } from 'next'
import Link from 'next/link'
import { PageShell } from '@/components/page-shell'
import { PageHeader } from '@/components/page-header'
import { Icon } from '@/components/icons'
import { Shot } from '@/components/case-study/shot'

const DESCRIPTION =
  'AllArkive is an offline research assistant: Kiwix serves Wikipedia, repair guides and Stack Exchange from your own disk, and a local model answers from them, told to cite the articles it used. Built with Sham for BSides Melbourne 2026.'

export const metadata: Metadata = {
  title: 'AllArkive · offline research assistant',
  description: DESCRIPTION,
  alternates: { canonical: '/projects/allarkive' },
  openGraph: {
    type: 'article',
    url: '/projects/allarkive',
    title: 'AllArkive · offline research assistant · Samridh Limbu',
    description: DESCRIPTION,
    images: [{ url: '/projects/allarkive/answer.webp', width: 1760, height: 1930, alt: 'An AllArkive answer about keeping a house cool without air conditioning, with numbered citations linking to Stack Exchange answers stored on the same machine' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AllArkive · offline research assistant · Samridh Limbu',
    description: DESCRIPTION,
    images: ['/projects/allarkive/answer.webp'],
  },
}

const MONO = '"JetBrains Mono", var(--font-mono), monospace'
const SANS = 'Inter, var(--font-inter), sans-serif'
const DISPLAY = 'Manrope, var(--font-manrope), sans-serif'
const GREEN = 'var(--term-green)'

const PROSE = { fontFamily: SANS, fontSize: 15, color: 'var(--fg-dim)', lineHeight: 1.65, maxWidth: 640 }

const METRICS = [
  { k: 'default bundle', v: '24 GB' },
  { k: 'containers, localhost only', v: '5' },
  { k: 'passages per answer', v: '5' },
]

const STEPS: [string, string][] = [
  ['embed', 'the question becomes a vector, using nomic-embed-text in Ollama'],
  ['search', 'sqlite-vec finds the five closest passages across every archive'],
  ['read', 'each passage is read back out of the archive file itself'],
  ['answer', 'the local model answers from those passages, told to cite them as [1] to [5]'],
  ['link', 'each [N] becomes a link to the article in Kiwix, on the same machine'],
]

const DECISIONS = [
  ['an index that stores places, not text', 'a copy of every article', 'Each passage is saved as an article, a start position and a length. The text is read back out of the archive when a question needs it, so the index holds the vectors and little else. The whole index is one SQLite file you can copy to another machine.'],
  ['sqlite-vec', 'a vector database server', 'No extra service to run, update or secure. The target is a laptop or a Raspberry Pi, not a server room.'],
  ['an OpenAI-shaped API', 'a custom one', 'The RAG service answers on /v1/chat/completions, so Open WebUI lists it as a model called allarkive-rag. Any other client that speaks the same API works with no extra code.'],
  ['localhost only', 'open on the network', 'Every container port is bound to 127.0.0.1. Nothing on the local network can reach the archive or the model unless you change it on purpose.'],
  ['AGPL-3.0', 'MIT', 'A company can host a GPL program as a web service without sharing its changes. AGPL closes that gap.'],
]

const STACK: [string, string[]][] = [
  ['Archive', ['Kiwix', 'ZIM files (Wikipedia, WikiMed, iFixit, Stack Exchange)']],
  ['Search', ['FastAPI', 'sqlite-vec', 'nomic-embed-text']],
  ['Model', ['Ollama', 'qwen2.5 (7b on a laptop, 1.5b on a Pi)', 'Open WebUI']],
  ['Setup', ['Docker Compose', 'bootstrap.sh', 'nginx landing page']],
]

export default function AllArkivePage() {
  return (
    <PageShell>
      <div data-stagger style={{ maxWidth: 720, margin: '0 auto', padding: '36px 20px' }}>

        <PageHeader />

        {/* breadcrumb */}
        <div data-stagger-item style={{ fontFamily: MONO, fontSize: 'var(--text-xs)', color: 'var(--muted)', marginBottom: 16 }}>
          <span style={{ color: 'var(--accent)' }}>❯</span>{' '}
          cd <Link href="/projects" style={{ color: 'var(--fg)', textDecoration: 'none' }}>projects</Link>/allarkive
        </div>

        {/* Banner */}
        <div data-stagger-item style={{ padding: '24px 0', marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', columnGap: 12, rowGap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
            <h1 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 'var(--text-2xl)', lineHeight: 1.1, margin: 0, letterSpacing: '-0.025em', color: 'var(--fg)' }}>AllArkive</h1>
            <span className="pill" style={{ fontFamily: MONO }}>open source · bsides melbourne 2026</span>
          </div>
          <p style={{ ...PROSE, fontSize: 'var(--text-base)', margin: 0 }}>
            A research assistant that keeps working when the internet doesn&apos;t. Kiwix serves offline copies of Wikipedia, repair guides and Stack Exchange from your own disk. A local model answers questions from them and is told to cite its sources, which the app turns into links to the articles.
          </p>
        </div>

        {/* Hero video */}
        <div data-stagger-item style={{ marginBottom: 24 }}>
          <div style={{ overflow: 'hidden', background: 'var(--bg-2)', borderRadius: 2 }}>
            <video
              src="/projects/allarkive/demo.mp4"
              poster="/projects/allarkive/demo-poster.webp"
              autoPlay
              muted
              loop
              playsInline
              aria-label="Screen recording: AllArkive's setup script on a Mac, then a question answered with citations, then a cited article opened offline in Kiwix"
              style={{ width: '100%', display: 'block' }}
            />
          </div>
          <p style={{ fontFamily: MONO, fontSize: 'var(--text-xs)', color: 'var(--muted)', lineHeight: 1.6, margin: '10px 0 0' }}>
            Recorded in May 2026 on a Mac with the default model and two archives, iFixit and WikiMed: setup, a cited answer, then the source opened offline.
          </p>
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

        {/* Context */}
        <div style={{ marginBottom: 40 }}>
          <div className="section-label" style={{ fontFamily: MONO }}>Context</div>
          <p style={{ ...PROSE, margin: 0 }}>
            Sham and I built AllArkive for our talk at BSides Melbourne on 16–17 May 2026. The idea: outages, censorship and services that shut down all take the same thing away, so keep a library on your own disk. The library has to work on its own, with search and plain articles. The model is a bonus on top. One script picks a bundle of archives, pulls a model sized for the machine, and starts everything.
          </p>
        </div>

        {/* How an answer is made */}
        <div className="section-label" style={{ fontFamily: MONO }}>How an answer is made</div>
        <div style={{ fontFamily: MONO, fontSize: 'var(--text-xs)', background: 'var(--bg-2)', borderRadius: 2, padding: '14px 16px', marginBottom: 24, lineHeight: 1.8 }}>
          {STEPS.map(([part, desc]) => (
            <div key={part} style={{ display: 'flex', flexWrap: 'wrap', columnGap: 16 }}>
              <span style={{ color: 'var(--accent)', width: 72, flexShrink: 0 }}>{part}</span>
              <span style={{ color: 'var(--muted)', flex: '1 1 200px' }}>{desc}</span>
            </div>
          ))}
        </div>

        {/* Answer shots */}
        <div data-reveal style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'flex-start', justifyContent: 'center', marginBottom: 12 }}>
          <div style={{ flex: '1 1 360px', minWidth: 0 }}>
            <Shot
              src="/projects/allarkive/answer.webp"
              alt="An AllArkive answer about keeping a house cool without air conditioning: five bolded tips marked (Q2), (Q3) and so on, then five reference links to the same Stack Exchange question"
              width={1760}
              height={1930}
              caption="A question the archive covers. The model marked its sources as (Q2) rather than [2], so only the reference list at the end became links."
            />
          </div>
          <div style={{ flex: '0 1 220px', minWidth: 0 }}>
            <Shot
              src="/projects/allarkive/refuse-mobile.webp"
              alt="AllArkive on a phone answering 'no sources found for this question' to a question about the 1998 FIFA World Cup final"
              width={1170}
              height={1560}
              caption="A question it doesn't cover: no answer from memory."
              variant="mobile"
            />
          </div>
        </div>
        <p style={{ fontFamily: MONO, fontSize: 'var(--text-xs)', color: 'var(--muted)', lineHeight: 1.6, margin: '0 0 40px' }}>
          Both run locally in October 2026 with qwen2.5:7b and one small archive, the Sustainable Living Stack Exchange (26 MB, 11,695 passages).
        </p>

        {/* Key decisions */}
        <div className="section-label" style={{ fontFamily: MONO }}>Key technical decisions</div>
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

        {/* What testing showed */}
        <div className="section-label" style={{ fontFamily: MONO }}>What re-testing it found</div>
        <p style={{ ...PROSE, margin: '0 0 40px' }}>
          The &ldquo;no sources&rdquo; check rarely fires. It skips the model only when no passage is within a distance of 1.0, and on the test archive even off-topic questions and keyboard mash came in at 0.88 to 0.95, against 0.54 for a real question. So the refusing is done by the prompt, and only a capable model follows it: qwen2.5:7b refused the World Cup question, while the 1.5b model meant for a Raspberry Pi answered it from memory, and got it wrong. Citations also depend on the model: the app links [2], but the 7b model often writes (Q2) or [2, 4], which stay plain text. And the default int8 index setting stores vectors in a form the pinned sqlite-vec version rejects, so a default install indexes nothing; these shots used float32.
        </p>

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
          <a href="https://github.com/Clupai8o0/allarkive" target="_blank" rel="noopener noreferrer" className="btn" style={{ fontFamily: MONO }}><Icon name="github" size={12} /> Clupai8o0/allarkive</a>
          <a href="https://allarkive.vercel.app" target="_blank" rel="noopener noreferrer" className="btn btn-ghost" style={{ fontFamily: MONO }}>docs →</a>
          <Link href="/projects" className="btn btn-ghost" style={{ fontFamily: MONO }}>← back to projects</Link>
        </div>

      </div>
    </PageShell>
  )
}
