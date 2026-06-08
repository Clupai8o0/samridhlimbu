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

const ASSESSORS = [
  ['Impedance / firmware delta', 'Flags changes in machine impedance and firmware against the lodged baseline.'],
  ['Clause evidence matrix', 'Maps each NER S5.2 clause to the documents that actually evidence it.'],
  ['Mandatory-artefact checks', 'Verifies the required artefacts (GPS baseline, FAT report, OEM metadata) are present and valid.'],
  ['Firmware DMAT comparison', 'Compares declared firmware against the DMAT record — a mismatch is a 45-point, lodgement-blocking finding.'],
  ['NSP staleness', 'Detects baselines and access standards that have gone stale relative to the network service provider.'],
  ['EMT / RMS model adequacy', 'Checks PSCAD/EMT and RMS models are adequate for the connection size and type.'],
]

const SCORE_LINES = [
  `<span style="color:#71717a"># severity weights — plain subtraction, no sigmoid, no fabricated percentiles</span>`,
  `WEIGHTS = { low: <span style="color:#fcd34d">4</span>, medium: <span style="color:#fcd34d">12</span>, high: <span style="color:#fcd34d">25</span>, dmat: <span style="color:#fcd34d">45</span> }`,
  ``,
  `<span style="color:#71717a"># capped at 95 — the last 5 points are reserved for chartered-engineer review</span>`,
  `readiness = <span style="color:#60a5fa">clamp</span>(<span style="color:#fcd34d">0</span>, <span style="color:#fcd34d">95</span>, <span style="color:#fcd34d">95</span> - <span style="color:#60a5fa">sum</span>(f.weight <span style="color:#c084fc">for</span> f <span style="color:#c084fc">in</span> findings))`,
  ``,
  `<span style="color:#71717a"># every finding traces back to a PSMG v3.0 section + the source document</span>`,
  `<span style="color:#c084fc">return</span> { readiness, findings, predicted_rfis, rfi_risk_band, coverage }`,
]

const DECISIONS = [
  [
    'deterministic subtraction',
    'LLM-scored confidence',
    'The readiness index is plain arithmetic: 95 minus the sum of severity weights, clamped to 0–95. No sigmoid, no confidence intervals, no fabricated percentiles. The same package always yields the same score — auditable, repeatable, defensible to a regulator.',
  ],
  [
    'capped at 95',
    'a perfect 100',
    'The index can never read 100. The last five points are deliberately reserved for chartered-engineer review — the tool gets you submission-ready, it doesn\'t pretend to replace the signature that AEMO actually requires.',
  ],
  [
    'six anchored assessors',
    'one general-purpose prompt',
    'Each assessor is scoped to a regulatory concern and anchored to a specific PSMG v3.0 section, so every finding cites where the rule lives — not a conversational opinion from a general model. The LLM extracts; the rules decide.',
  ],
  [
    'no database',
    'persisted submission store',
    'Everything runs from the uploaded package in-request. Zod-validated extraction, pdf-parse for documents, no persistence layer — Vercel-ready with nothing to provision and no submitter data sitting at rest.',
  ],
]

export default function R1GptPage() {
  const project = PROJECTS.find(p => p.slug === 'r1gpt')!

  return (
    <PageShell>
      <div data-stagger style={{ maxWidth: 720, margin: '0 auto', padding: '36px 28px' }}>

        <PageHeader />

        {/* breadcrumb */}
        <div data-stagger-item style={{ fontFamily: MONO, fontSize: 10, color: 'var(--muted-2)', marginBottom: 14 }}>
          <span style={{ color: 'var(--accent)' }}>❯</span>{' '}
          cd <Link href="/projects" style={{ color: 'var(--fg)', textDecoration: 'none' }}>projects</Link>/r1gpt
        </div>

        {/* Banner */}
        <div data-stagger-item style={{ padding: '22px 0', borderTop: '1px solid var(--accent)', borderBottom: '1px solid var(--border)', marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 8, flexWrap: 'wrap' }}>
            <h1 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 36, margin: 0, letterSpacing: -0.025, color: 'var(--fg)' }}>R1GPT</h1>
            <span className="pill" style={{ color: AMBER, borderColor: 'rgba(245,158,11,0.3)', fontFamily: MONO }}>● open source · NEM</span>
          </div>
          <p style={{ fontFamily: SANS, fontSize: 14, color: 'var(--fg-dim)', lineHeight: 1.55, maxWidth: 580, margin: '0 0 16px' }}>
            An AI audit engine for R1 connection-approval submissions in Australia&apos;s National Electricity Market. Upload a submission package — GPS baseline, FAT report, OEM metadata, optional PSCAD/EMT studies — and get back a clause-by-clause audit against AEMO&apos;s Power System Model Guidelines, with a deterministic readiness score and findings traced to the rule that triggered them.
          </p>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            <a href="https://github.com/Aarav261/R1gpt" target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ fontFamily: MONO, fontSize: 10 }}><Icon name="github" size={11} /> Aarav261/R1gpt</a>
          </div>
        </div>

        {/* Hero image — drop overview.png into public/projects/r1gpt/ */}
        <div style={{ marginBottom: 28, border: '1px solid var(--border)', overflow: 'hidden', background: 'var(--bg-2)' }}>
          <img src="/projects/r1gpt/overview.png" alt="R1GPT project overview dashboard" style={{ width: '100%', display: 'block' }} />
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
            Built with Aarav. Getting a generator or battery connected to the NEM means clearing AEMO&apos;s R1 model-acceptance gate — a slow, expensive RFI cycle where a single missed clause or stale baseline costs weeks. A general LLM will happily give a confident, unverifiable opinion on a submission. R1GPT does the opposite: it runs six deterministic assessors against the AEMO Power System Model Guidelines v3.0 (effective 25 Sep 2025) and NER S5.2, and every finding points back to the exact section and source document that triggered it. The score is arithmetic, not vibes — so the same package always scores the same, and the result holds up to a regulator.
          </p>
        </div>

        {/* The six assessors */}
        <div className="section-label" style={{ fontFamily: MONO }}>Six deterministic assessors</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 28 }}>
          {ASSESSORS.map(([name, note], i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '24px 1fr', gap: 12 }}>
              <span style={{ fontFamily: MONO, fontSize: 10, color: 'var(--accent)', paddingTop: 2 }}>0{i + 1}</span>
              <div>
                <div style={{ fontFamily: MONO, fontSize: 11.5, color: GREEN, marginBottom: 4 }}>{name}</div>
                <div style={{ fontFamily: SANS, fontSize: 12.5, color: 'var(--fg-dim)', lineHeight: 1.6 }}>{note}</div>
              </div>
            </div>
          ))}
        </div>

        {/* The readiness index */}
        <div className="section-label" style={{ fontFamily: MONO }}>The readiness index</div>
        <div style={{ marginBottom: 12 }}>
          <CodeBlock lines={SCORE_LINES} />
        </div>
        <p style={{ fontFamily: SANS, fontSize: 12.5, color: 'var(--muted)', lineHeight: 1.65, marginBottom: 28 }}>
          Findings carry severity weights — low 4, medium 12, high 25, and a DMAT-triggering mismatch 45 — and the readiness index is just 95 minus their sum, clamped to 0–95. Alongside the number, R1GPT emits a qualitative RFI-cycle risk band (minimal → elevated → high → severe), an &ldquo;X of N checks passed&rdquo; coverage metric, predicted AEMO/NSP questions, and rectification plans with effort estimates. Stress-tested across 24/24 deterministic cases.
        </p>

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
          {[
            { label: 'App', items: 'Next.js 14 (App Router) · TypeScript (strict) · Tailwind CSS' },
            { label: 'Extraction', items: 'OpenAI gpt-4o · Zod schema validation · pdf-parse' },
            { label: 'Utils', items: 'nanoid · IBM Plex Mono (technical values) · Inter' },
            { label: 'Deploy', items: 'Vercel · no database' },
            { label: 'Demos', items: 'Ironbark Solar Farm (400 MW · failing) · Wattle Creek BESS (200 MW · passing)' },
          ].map(({ label, items }) => (
            <div key={label} style={{ display: 'flex', gap: 12, alignItems: 'baseline' }}>
              <span style={{ fontFamily: MONO, fontSize: 9, color: 'var(--muted-2)', textTransform: 'uppercase', letterSpacing: 0.08, width: 72, flexShrink: 0 }}>{label}</span>
              <span style={{ fontFamily: MONO, fontSize: 11, color: 'var(--muted)' }}>{items}</span>
            </div>
          ))}
        </div>

        {/* Footer actions */}
        <div style={{ display: 'flex', gap: 8, paddingTop: 18, borderTop: '1px solid var(--border)', flexWrap: 'wrap' }}>
          <a href="https://github.com/Aarav261/R1gpt" target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ fontFamily: MONO, fontSize: 10 }}><Icon name="github" size={11} /> source</a>
          <Link href="/projects" className="btn btn-ghost" style={{ fontFamily: MONO, fontSize: 10 }}>← back to projects</Link>
        </div>

      </div>
    </PageShell>
  )
}
