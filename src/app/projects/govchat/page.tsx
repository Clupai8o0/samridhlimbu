import Link from 'next/link'
import { PageShell } from '@/components/page-shell'
import { Icon } from '@/components/icons'
import { CodeBlock } from '@/components/code-block'

const MONO = '"JetBrains Mono", var(--font-mono), monospace'
const SANS = 'Inter, var(--font-inter), sans-serif'
const DISPLAY = 'Manrope, var(--font-manrope), sans-serif'
const GREEN = '#4ade80'

const TIMELINE = [
  { date: '2025', title: 'Problem framing', body: 'Government information is fragmented across PDF documents, static pages, and department portals. Finding a specific ruling, policy, or eligibility condition means navigating bureaucratic structure instead of asking a question.' },
  { date: '2025', title: 'RAG pipeline', body: 'Ingest pipeline: scrape and parse government documents → chunk → embed → store in vector DB. Query pipeline: embed question → retrieve top-k chunks → pass to LLM with context → return grounded answer.' },
  { date: '2025', title: 'Grounding and citation', body: 'Answers cite the source document and section. If the retrieved chunks don\'t contain an answer, the model says so — no hallucination of policy details.', current: true },
]

const DECISIONS = [
  ['rag over fine-tuning', 'fine-tuned llm', 'Government policy changes. A fine-tuned model is a snapshot; a RAG system with a re-indexed document store stays current. Retrieval also gives you source citations — essential for policy queries.'],
  ['chunk-level citations', 'document-level citations', 'Citing the document is not enough — government documents are long and dense. Chunk-level retrieval lets the answer point to the specific section, so users can verify without reading hundreds of pages.'],
  ['explicit "i don\'t know"', 'best-effort answer', 'For government policy, a confident wrong answer is worse than no answer. The retrieval threshold filters low-confidence chunks; if nothing clears the bar, the model declines to answer.'],
]

const RAG_LINES = [
  `<span style="color:#71717a"># query pipeline</span>`,
  `query_embedding = embedder.<span style="color:#60a5fa">encode</span>(user_question)`,
  `chunks = vector_db.<span style="color:#60a5fa">similarity_search</span>(`,
  `    query_embedding, k=<span style="color:#fcd34d">5</span>, threshold=<span style="color:#fcd34d">0.75</span>`,
  `)`,
  `<span style="color:#c084fc">if not</span> chunks:`,
  `    <span style="color:#c084fc">return</span> <span style="color:#86efac">"I don't have a reliable source for that."</span>`,
  `answer = llm.<span style="color:#60a5fa">generate</span>(context=chunks, question=user_question)`,
]

export default function GovchatPage() {
  return (
    <PageShell>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '36px 28px' }}>

        {/* breadcrumb */}
        <div style={{ fontFamily: MONO, fontSize: 10, color: 'var(--muted-2)', marginBottom: 14 }}>
          <span style={{ color: 'var(--accent)' }}>❯</span>{' '}
          cd <Link href="/projects" style={{ color: 'var(--fg)', textDecoration: 'none' }}>projects</Link>/govchat
        </div>

        {/* Banner */}
        <div style={{ padding: '22px 0', borderTop: '1px solid var(--accent)', borderBottom: '1px solid var(--border)', marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 8, flexWrap: 'wrap' }}>
            <h1 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 36, margin: 0, letterSpacing: -0.025, color: 'var(--fg)' }}>GovChat</h1>
            <span className="pill" style={{ color: '#60a5fa', borderColor: 'rgba(96,165,250,0.3)', fontFamily: MONO }}>● RAG · 2025</span>
          </div>
          <p style={{ fontFamily: SANS, fontSize: 14, color: 'var(--fg-dim)', lineHeight: 1.55, maxWidth: 580, margin: '0 0 16px' }}>
            Retrieval-Augmented Generation platform for natural-language querying of government information. Ask a policy question, get a grounded answer with source citations — no hallucination, explicit fallback when the answer isn&apos;t in the corpus.
          </p>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            <a href="https://github.com/Clupai8o0/govchat" target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ fontFamily: MONO, fontSize: 10 }}><Icon name="github" size={11} /> frontend</a>
            <a href="https://github.com/Clupai8o0/govchat-api" target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ fontFamily: MONO, fontSize: 10 }}><Icon name="github" size={11} /> api</a>
          </div>
        </div>

        {/* Metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', marginBottom: 28 }}>
          {[
            { k: 'retrieval strategy', v: 'RAG' },
            { k: 'hallucination guard', v: 'threshold' },
            { k: 'citations', v: 'chunk-level' },
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
            Built in 2025. The problem: government information is accurate but structurally inaccessible — spread across PDF documents, department portals, and static pages with no search layer that understands intent. GovChat ingests the documents, indexes them into a vector store, and answers questions with grounded, cited responses. The retrieval threshold means the model declines to answer rather than guessing when confidence is low — critical for policy queries where a wrong answer has real consequences.
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

        {/* Query pipeline */}
        <div className="section-label" style={{ fontFamily: MONO }}>Query pipeline</div>
        <div style={{ marginBottom: 12 }}>
          <CodeBlock lines={RAG_LINES} />
        </div>
        <p style={{ fontFamily: SANS, fontSize: 12.5, color: 'var(--muted)', lineHeight: 1.65, marginBottom: 28 }}>
          The similarity threshold is the critical gate. If retrieved chunks don&apos;t clear 0.75 cosine similarity, the model returns a decline rather than attempting an answer from low-confidence context. For government policy, that&apos;s the right trade-off — a non-answer is less harmful than a confident wrong one.
        </p>

        {/* Stack */}
        <div className="section-label" style={{ fontFamily: MONO }}>Stack</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 28 }}>
          {[
            { label: 'Language', items: 'Python' },
            { label: 'RAG', items: 'embedding model · vector database · LLM' },
            { label: 'Ingestion', items: 'document parser · chunking pipeline' },
          ].map(({ label, items }) => (
            <div key={label} style={{ display: 'flex', gap: 12, alignItems: 'baseline' }}>
              <span style={{ fontFamily: MONO, fontSize: 9, color: 'var(--muted-2)', textTransform: 'uppercase', letterSpacing: 0.08, width: 72, flexShrink: 0 }}>{label}</span>
              <span style={{ fontFamily: MONO, fontSize: 11, color: 'var(--muted)' }}>{items}</span>
            </div>
          ))}
        </div>

        {/* Footer actions */}
        <div style={{ display: 'flex', gap: 8, paddingTop: 18, borderTop: '1px solid var(--border)', flexWrap: 'wrap' }}>
          <a href="https://github.com/Clupai8o0/govchat" target="_blank" rel="noopener noreferrer" className="btn" style={{ fontFamily: MONO, fontSize: 10 }}><Icon name="github" size={11} /> frontend</a>
          <a href="https://github.com/Clupai8o0/govchat-api" target="_blank" rel="noopener noreferrer" className="btn" style={{ fontFamily: MONO, fontSize: 10 }}><Icon name="github" size={11} /> api</a>
          <Link href="/projects" className="btn btn-ghost" style={{ fontFamily: MONO, fontSize: 10 }}>← back to projects</Link>
        </div>

      </div>
    </PageShell>
  )
}
