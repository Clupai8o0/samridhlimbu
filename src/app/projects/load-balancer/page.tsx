import Link from 'next/link'
import { PageShell } from '@/components/page-shell'
import { PageHeader } from '@/components/page-header'
import { Icon } from '@/components/icons'
import { CodeBlock } from '@/components/code-block'

const MONO = '"JetBrains Mono", var(--font-mono), monospace'
const SANS = 'Inter, var(--font-inter), sans-serif'
const DISPLAY = 'Manrope, var(--font-manrope), sans-serif'
const GREEN = '#4ade80'

const TIMELINE = [
  { date: '2025 · v1–4', title: 'Round-robin baseline', body: 'SIT315 (Concurrent & Distributed Systems). Start simple: even distribution, no health awareness. Establish the request routing primitives in Go.' },
  { date: '2025 · v5–10', title: 'Health-aware routing', body: 'Added weighted round-robin and least-connections. Backends with higher measured latency receive proportionally fewer requests.' },
  { date: '2025 · v11–15', title: 'P2C-EWMA', body: 'Power-of-Two-Choices with Exponentially Weighted Moving Average. Pick two backends at random, route to the one with lower EWMA latency. Avoids hot-spots without explicit health scores.' },
  { date: '2025 · v16–20', title: 'AIMD + circuit breakers', body: 'AIMD concurrency control — additive increase on success, multiplicative decrease on timeout. Circuit breakers (closed/half-open/open) with outlier quarantine.' },
  { date: '2025 · v21', title: 'Observability + admin API', body: 'Prometheus /metrics, slog structured JSON logging, /admin/metrics/json. Dynamic backend add/remove without restart, live strategy switching, canary rollout controls. /admin/selftest and /debug/config for diagnostics.', current: true },
]

const DECISIONS = [
  ['p2c-ewma', 'pure round-robin', 'Round-robin ignores backend health. P2C-EWMA naturally avoids slow backends — latency is the signal, no explicit health scores needed. Two random picks, route to the better one.'],
  ['aimd concurrency', 'fixed connection limit', "The same algorithm TCP uses for congestion control. Grows aggressively when backends are healthy, halves on the first timeout. Adapts in real time without coordination between backends."],
  ['circuit breakers', 'timeout-only failure handling', 'A consistently failing backend should be quarantined, not just timed out. Warm-up ramp on recovery + half-open probing lets it return to rotation gradually without manual intervention.'],
  ['ip-hash sticky sessions', 'stateless round-robin', 'Stateful workloads need affinity. IP-Hash maps client IP → consistent backend so session state stays local — no external store needed.'],
  ['prometheus /metrics', 'log-only observability', 'Metrics are queryable over time; logs are forensic. Structured slog JSON logging pairs with Prometheus so you get both queryable time-series and machine-readable event context.'],
]

const AIMD_LINES = [
  `<span style="color:#71717a">// additive increase on success</span>`,
  `<span style="color:#c084fc">if</span> success {`,
  `    concurrency += <span style="color:#fcd34d">1</span>`,
  `}`,
  `<span style="color:#71717a">// multiplicative decrease on timeout</span>`,
  `<span style="color:#c084fc">if</span> timeout {`,
  `    concurrency = <span style="color:#fcd34d">int</span>(float64(concurrency) * <span style="color:#fcd34d">0.5</span>)`,
  `}`,
]

export default function LoadBalancerPage() {
  return (
    <PageShell>
      <div data-stagger style={{ maxWidth: 720, margin: '0 auto', padding: '36px 28px' }}>

        <PageHeader />

        {/* breadcrumb */}
        <div data-stagger-item style={{ fontFamily: MONO, fontSize: 10, color: 'var(--muted-2)', marginBottom: 14 }}>
          <span style={{ color: 'var(--accent)' }}>❯</span>{' '}
          cd <Link href="/projects" style={{ color: 'var(--fg)', textDecoration: 'none' }}>projects</Link>/load-balancer
        </div>

        {/* Banner */}
        <div data-stagger-item style={{ padding: '22px 0', borderTop: '1px solid var(--accent)', borderBottom: '1px solid var(--border)', marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 8, flexWrap: 'wrap' }}>
            <h1 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 36, margin: 0, letterSpacing: -0.025, color: 'var(--fg)' }}>load-balancer</h1>
            <span className="pill" style={{ color: '#a78bfa', borderColor: 'rgba(167,139,250,0.3)', fontFamily: MONO }}>● systems · Go</span>
          </div>
          <p style={{ fontFamily: SANS, fontSize: 14, color: 'var(--fg-dim)', lineHeight: 1.55, maxWidth: 580, margin: '0 0 16px' }}>
            Adaptive concurrent HTTP load balancer in Go — 21 iterations from basic round-robin to P2C-EWMA, AIMD concurrency control, circuit breakers, and Prometheus observability. SIT315 HD submission.
          </p>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            <a href="https://github.com/clupai8o0/load-balancer" target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ fontFamily: MONO, fontSize: 10 }}><Icon name="github" size={11} /> github</a>
          </div>
        </div>

        {/* Metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', marginBottom: 28 }}>
          {[
            { k: 'iterations', v: '21' },
            { k: 'strategies', v: '5' },
            { k: 'grade', v: 'HD' },
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
            SIT315 Concurrent and Distributed Systems assessment at Deakin — written in Go 1.23. The exercise: start with the simplest working load balancer and iterate toward production-grade. 21 versions. Each adds one capability — health awareness, adaptive concurrency, failure isolation. The progression is the point.
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

        {/* AIMD */}
        <div className="section-label" style={{ fontFamily: MONO }}>AIMD in practice</div>
        <div style={{ marginBottom: 12 }}>
          <CodeBlock lines={AIMD_LINES} />
        </div>
        <p style={{ fontFamily: SANS, fontSize: 12.5, color: 'var(--muted)', lineHeight: 1.65, marginBottom: 28 }}>
          The same algorithm TCP uses for congestion control, applied to backend concurrency. Grows aggressively when backends are healthy, backs off hard on the first timeout. Works without coordination between backends.
        </p>

        {/* Stack */}
        <div className="section-label" style={{ fontFamily: MONO }}>Stack</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 28 }}>
          {[
            { label: 'Language', items: 'Go 1.23' },
            { label: 'Strategies', items: 'Round-Robin · Weighted RR · Least-Connections · P2C-EWMA · IP-Hash' },
            { label: 'Resilience', items: 'AIMD concurrency · token-bucket rate limiting · circuit breakers · outlier quarantine · warm-up ramp · global semaphore' },
            { label: 'Observability', items: 'Prometheus /metrics · slog JSON logging · /admin/metrics/json' },
            { label: 'Admin', items: 'dynamic backend add/remove · live strategy switching · canary rollout · /admin/selftest · /debug/config' },
          ].map(({ label, items }) => (
            <div key={label} style={{ display: 'flex', gap: 12, alignItems: 'baseline' }}>
              <span style={{ fontFamily: MONO, fontSize: 9, color: 'var(--muted-2)', textTransform: 'uppercase', letterSpacing: 0.08, width: 80, flexShrink: 0 }}>{label}</span>
              <span style={{ fontFamily: MONO, fontSize: 11, color: 'var(--muted)' }}>{items}</span>
            </div>
          ))}
        </div>

        {/* Footer actions */}
        <div style={{ display: 'flex', gap: 8, paddingTop: 18, borderTop: '1px solid var(--border)', flexWrap: 'wrap' }}>
          <a href="https://github.com/clupai8o0/load-balancer" target="_blank" rel="noopener noreferrer" className="btn" style={{ fontFamily: MONO, fontSize: 10 }}><Icon name="github" size={11} /> source</a>
          <Link href="/projects" className="btn btn-ghost" style={{ fontFamily: MONO, fontSize: 10 }}>← back to projects</Link>
        </div>

      </div>
    </PageShell>
  )
}
