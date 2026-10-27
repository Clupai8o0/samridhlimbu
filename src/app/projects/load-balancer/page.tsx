import type { Metadata } from 'next'
import Link from 'next/link'
import { PageShell } from '@/components/page-shell'
import { PageHeader } from '@/components/page-header'
import { Icon } from '@/components/icons'
import { Shot } from '@/components/case-study/shot'

const DESCRIPTION =
  'A concurrent HTTP load balancer in Go, written for SIT315 at Deakin in 2025. Five ways to pick a backend, health checks, circuit breakers, retries, an AIMD concurrency limit and Prometheus metrics, measured on a MacBook in October 2026 with real logs.'

export const metadata: Metadata = {
  title: 'load-balancer · Go',
  description: DESCRIPTION,
  alternates: { canonical: '/projects/load-balancer' },
  openGraph: {
    type: 'article',
    locale: 'en_AU',
    siteName: 'Samridh Limbu',
    url: '/projects/load-balancer',
    title: 'load-balancer · Samridh Limbu',
    description: DESCRIPTION,
  },
  twitter: {
    card: 'summary',
    title: 'load-balancer · Samridh Limbu',
    description: DESCRIPTION,
  },
}

const MONO = '"JetBrains Mono", var(--font-mono), monospace'
const SANS = 'Inter, var(--font-inter), sans-serif'
const DISPLAY = 'Manrope, var(--font-manrope), sans-serif'
const GREEN = 'var(--term-green)'

const PROSE = { fontFamily: SANS, fontSize: 15, color: 'var(--fg-dim)', lineHeight: 1.65, maxWidth: 640 }

const METRICS = [
  { k: 'mean latency, RR → P2C', v: '__RR_MEAN__ → __P2C_MEAN__ ms' },
  { k: 'failed of __FO_N__ with a backend killed', v: '__FO_ERR__' },
  { k: 'lines of Go', v: '1,801' },
]

// Real excerpts from $S/runs/*/lb.log and /metrics, lines trimmed by selection only.
const FAILOVER_LOG = `__FAILOVER_LOG__`

const FAILOVER_METRICS = `__FAILOVER_METRICS__`

const OVERLOAD_LOG = `__OVERLOAD_LOG__`

const STRATEGY_ROWS: [string, string, string, string, string][] = __STRATEGY_ROWS__

const DECISIONS = [
  ['a breaker per backend', 'health checks alone', 'Three failures in a row open a backend\'s circuit breaker, and the picker skips it. In the kill test that happened inside the first second; the health check, which needs two failed probes 5 s ± 2 s apart, marked it down __FO_DOWN__ s later.'],
  ['retry GET, HEAD and OPTIONS only', 'retry everything', 'When the connection to a backend fails, the proxy waits 10 to 40 ms and sends the request to another backend, up to twice. A POST is never resent, because it might already have done its work.'],
  ['P2C on EWMA latency', 'checking every backend', 'Each request looks at two random backends and compares one number for each, so the work per request stays the same as the pool grows. The EWMA moves 20 % of the way to each new response time.'],
  ['a soft limit inside a hard one', 'one fixed connection cap', 'A semaphore of 64 is the hard ceiling. Below it, AIMD moves a soft limit between 4 and 64 every 2 s: down to 90 % when average latency is over 200 ms or more than 5 % of requests are turned away, otherwise up by one.'],
  ['switches at runtime', 'restarts', 'POST /admin/flip changes the strategy on a running balancer, and backends can be added, removed or drained without a restart. Every strategy test below used /admin/flip on a fresh process.'],
]

const FIXES = [
  ['Half-open ignores the health check.', 'After 10 s an open breaker lets requests through again, even when the backend is marked down. In the kill test that cost one 502 every 10 s until the backend came back.'],
  ['AIMD can lock itself at the floor.', 'The reject rate counts the requests the limit itself turns away. Once the limit is low, rejects stay above 5 %, so it never climbs back, and served traffic stayed at __AIMD_FLOOR_RPS__ a second when the backends could take about 120.'],
  ['Outlier ejection has no cap.', 'With AIMD off, all three backends crossed the 400 ms line in the same 10 s window and were ejected together, so the balancer served nothing for 20 s.'],
  ['The rate limit trusts X-Forwarded-For.', 'Any client can set that header and get a fresh token bucket. The load generator here used it on purpose, to act as 200 clients.'],
  ['The access log names the first pick.', 'A request that failed on a dead backend and was retried elsewhere is logged against the dead one, with status 200. The README calls the log JSON; it is key=value text.'],
]

const STACK: [string, string][] = [
  ['Language', 'Go (go.mod says 1.23; built here with 1.27)'],
  ['Strategies', 'round-robin · weighted round-robin · least-connections · P2C-EWMA · IP-hash sticky · canary percentage'],
  ['Resilience', 'semaphore · AIMD soft limit · token bucket per client · circuit breaker · active health checks · outlier ejection · 30 s warm-up · retries'],
  ['Observability', 'Prometheus client_golang at /metrics · log/slog access log · /admin/metrics/json'],
  ['Test rig', 'three Go dummy backends with set delays · an open-loop Go load generator · Python for runs and charts'],
]

function LogBlock({ label, text }: { label: string; text: string })
{
  return (
    <figure data-reveal style={{ margin: '0 0 12px' }}>
      <figcaption style={{ fontFamily: MONO, fontSize: 'var(--text-xs)', color: 'var(--muted)', marginBottom: 8, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{label}</figcaption>
      <pre style={{ margin: 0, padding: '12px 14px', background: 'var(--bg-2)', borderRadius: 2, fontFamily: MONO, fontSize: 12, lineHeight: 1.6, color: 'var(--fg-dim)', whiteSpace: 'pre', overflowX: 'auto' }}>
        {text}
      </pre>
    </figure>
  )
}

export default function LoadBalancerPage() {
  return (
    <PageShell>
      <div data-stagger style={{ maxWidth: 720, margin: '0 auto', padding: '36px 20px' }}>

        <PageHeader />

        {/* breadcrumb */}
        <div data-stagger-item style={{ fontFamily: MONO, fontSize: 'var(--text-xs)', color: 'var(--muted)', marginBottom: 16 }}>
          <span style={{ color: 'var(--accent)' }}>❯</span>{' '}
          cd <Link href="/projects" style={{ color: 'var(--fg)', textDecoration: 'none' }}>projects</Link>/load-balancer
        </div>

        {/* Banner */}
        <div data-stagger-item style={{ padding: '24px 0', marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', columnGap: 12, rowGap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
            <h1 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 'var(--text-2xl)', lineHeight: 1.1, margin: 0, letterSpacing: '-0.025em', color: 'var(--fg)' }}>load-balancer</h1>
            <span className="pill" style={{ fontFamily: MONO }}>SIT315 · Go · 2025</span>
          </div>
          <p style={{ ...PROSE, fontSize: 'var(--text-base)', margin: 0 }}>
            __INTRO__
          </p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 16 }}>
            <a href="https://github.com/clupai8o0/load-balancer" target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ fontFamily: MONO }}><Icon name="github" size={12} /> github</a>
          </div>
        </div>

        {/* Metrics */}
        <div data-reveal className="cs-metrics" style={{ marginBottom: 40 }}>
          {METRICS.map((m) => (
            <div key={m.k} style={{ padding: '14px 16px 14px 0' }}>
              <div style={{ fontFamily: DISPLAY, fontSize: 'var(--text-lg)', color: 'var(--accent)', fontWeight: 700, letterSpacing: '-0.02em' }}>{m.v}</div>
              <div style={{ fontFamily: MONO, fontSize: 'var(--text-xs)', color: 'var(--muted)', marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.06em', lineHeight: 1.4 }}>{m.k}</div>
            </div>
          ))}
        </div>

        {/* Context */}
        <div style={{ marginBottom: 40 }}>
          <div className="section-label" style={{ fontFamily: MONO }}>Context</div>
          <p style={{ ...PROSE, margin: 0 }}>
            __CONTEXT__
          </p>
        </div>

        {/* Request path */}
        <div className="section-label" style={{ fontFamily: MONO }}>How a request moves</div>
        <div style={{ maxWidth: 400, margin: '0 auto 40px' }}>
          <Shot
            src="/projects/load-balancer/request-path.svg"
            alt="Diagram: a GET request passes the AIMD soft limit, a 64-slot semaphore and a per-client token bucket, then the picker chooses a backend and the reverse proxy forwards it, retrying another backend on a connection error. Below, the health check, outlier check and AIMD controller loops, and the /metrics and access log outputs."
            width={400}
            height={1010}
            caption="Diagram drawn from main.go and serverpool.go. Each step can turn a request away before it reaches a backend."
          />
        </div>

        {/* Test rig */}
        <div className="section-label" style={{ fontFamily: MONO }}>How I tested it</div>
        <p style={{ ...PROSE, margin: '0 0 40px' }}>
          __RIG__
        </p>

        {/* Strategies */}
        <div className="section-label" style={{ fontFamily: MONO }}>Four strategies, one slow backend</div>
        <p style={{ ...PROSE, margin: '0 0 20px' }}>
          __STRAT_PROSE__
        </p>
        <div data-reveal style={{ maxWidth: 480, margin: '0 auto 24px' }}>
          <Shot
            src="/projects/load-balancer/strategies.webp"
            alt="__STRAT_ALT__"
            width={960}
            height={1000}
            caption="__STRAT_CAPTION__"
          />
        </div>
        <div data-reveal style={{ overflowX: 'auto', marginBottom: 24 }}>
          <table style={{ borderCollapse: 'collapse', fontFamily: MONO, fontSize: 'var(--text-xs)', color: 'var(--fg-dim)', minWidth: 420 }}>
            <thead>
              <tr style={{ color: 'var(--muted)', textAlign: 'right' }}>
                {['strategy', 'slow share', 'p50', 'p95', 'p99'].map((h, i) => (
                  <th key={h} style={{ fontWeight: 400, padding: '0 0 8px', paddingLeft: i ? 16 : 0, textAlign: i ? 'right' : 'left' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {STRATEGY_ROWS.map((r) => (
                <tr key={r[0]}>
                  {r.map((c, i) => (
                    <td key={i} style={{ padding: '4px 0', paddingLeft: i ? 16 : 0, textAlign: i ? 'right' : 'left', color: i ? 'var(--fg-dim)' : 'var(--fg)', fontVariantNumeric: 'tabular-nums' }}>{c}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div data-reveal style={{ maxWidth: 400, margin: '0 auto 40px' }}>
          <Shot
            src="/projects/load-balancer/p2c-ewma.svg"
            alt="Diagram: a request samples two of three backends at random, sends the request to the one with the lower EWMA (21 ms over 122 ms), and the EWMA update rule, 0.2 times the latest plus 0.8 times the old value."
            width={400}
            height={400}
            caption="Diagram. The two EWMA values are the ones /metrics reported at the end of a P2C run."
          />
        </div>

        {/* Failover */}
        <div className="section-label" style={{ fontFamily: MONO }}>Killing a backend mid-run</div>
        <p style={{ ...PROSE, margin: '0 0 20px' }}>
          __FO_PROSE__
        </p>
        <div data-reveal style={{ maxWidth: 480, margin: '0 auto 24px' }}>
          <Shot
            src="/projects/load-balancer/failover.webp"
            alt="__FO_ALT__"
            width={960}
            height={920}
            caption="__FO_CAPTION__"
          />
        </div>
        <LogBlock label="lb.log, the same run" text={FAILOVER_LOG} />
        <p style={{ ...PROSE, fontSize: 'var(--text-sm)', color: 'var(--muted)', margin: '0 0 24px' }}>
          __FO_LOG_NOTE__
        </p>
        <LogBlock label="GET /metrics at the end of the run" text={FAILOVER_METRICS} />
        <p style={{ ...PROSE, margin: '12px 0 40px' }}>
          __RETRY_PROSE__
        </p>

        {/* Overload */}
        <div className="section-label" style={{ fontFamily: MONO }}>Overload, with AIMD on and off</div>
        <p style={{ ...PROSE, margin: '0 0 20px' }}>
          __AIMD_PROSE__
        </p>
        <div data-reveal style={{ maxWidth: 480, margin: '0 auto 24px' }}>
          <Shot
            src="/projects/load-balancer/aimd.webp"
            alt="__AIMD_ALT__"
            width={960}
            height={1520}
            caption="__AIMD_CAPTION__"
          />
        </div>
        <LogBlock label="lb.log and /metrics, AIMD off" text={OVERLOAD_LOG} />
        <p style={{ ...PROSE, margin: '12px 0 40px' }}>
          __AIMD_AFTER__
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

        {/* What the tests found */}
        <div className="section-label" style={{ fontFamily: MONO }}>What I would fix next</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 40 }}>
          {FIXES.map(([head, body]) => (
            <div key={head} style={{ ...PROSE }}>
              <span style={{ color: 'var(--fg)', fontWeight: 600 }}>{head}</span> {body}
            </div>
          ))}
        </div>

        {/* Stack */}
        <div className="section-label" style={{ fontFamily: MONO }}>Stack</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 40 }}>
          {STACK.map(([label, items]) => (
            <div key={label} style={{ display: 'flex', gap: 12, alignItems: 'baseline' }}>
              <span style={{ fontFamily: MONO, fontSize: 'var(--text-xs)', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em', width: 104, flexShrink: 0 }}>{label}</span>
              <span style={{ fontFamily: MONO, fontSize: 'var(--text-xs)', color: 'var(--fg-dim)', lineHeight: 1.6 }}>{items}</span>
            </div>
          ))}
        </div>

        {/* Footer actions */}
        <div style={{ display: 'flex', gap: 8, paddingTop: 8, flexWrap: 'wrap' }}>
          <a href="https://github.com/clupai8o0/load-balancer" target="_blank" rel="noopener noreferrer" className="btn" style={{ fontFamily: MONO }}><Icon name="github" size={12} /> source</a>
          <Link href="/projects" className="btn btn-ghost" style={{ fontFamily: MONO }}>← back to projects</Link>
        </div>

      </div>
    </PageShell>
  )
}
