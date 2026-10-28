import type { Metadata } from 'next'
import Link from 'next/link'
import { PageShell } from '@/components/page-shell'
import { PageHeader } from '@/components/page-header'
import { Icon } from '@/components/icons'
import { Shot } from '@/components/case-study/shot'

const DESCRIPTION =
  'A concurrent HTTP load balancer in Go, written for SIT315 at Deakin in 2025: four balancing strategies plus sticky and canary routing, health checks, circuit breakers, retries, an AIMD concurrency limit and Prometheus metrics. Re-tested on my MacBook in October 2026, with real logs.'

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
    images: [{ url: '/projects/load-balancer/failover.webp', width: 960, height: 920, alt: 'Chart: requests served per second while one of three backends is killed and restarted' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'load-balancer · Samridh Limbu',
    description: DESCRIPTION,
    images: ['/projects/load-balancer/failover.webp'],
  },
}

const MONO = '"JetBrains Mono", var(--font-mono), monospace'
const SANS = 'Inter, var(--font-inter), sans-serif'
const DISPLAY = 'Manrope, var(--font-manrope), sans-serif'
const GREEN = 'var(--term-green)'

const PROSE = { fontFamily: SANS, fontSize: 15, color: 'var(--fg-dim)', lineHeight: 1.65, maxWidth: 640 }

const METRICS = [
  { k: 'mean latency, round-robin → P2C', v: '54 → 32 ms' },
  { k: 'failed of 19,995 with a backend killed', v: '1' },
  { k: 'served under overload, AIMD on vs off', v: '6,090 vs 2,527' },
  { k: 'lines of Go', v: '1,801' },
]

// Real excerpts from $S/runs/*/lb.log and /metrics, lines trimmed by selection only.
const FAILOVER_LOG = `2026/10/27 17:14:25 http://localhost:8430 [up]
2026/10/27 17:14:25 http://localhost:8431 [up]
2026/10/27 17:14:25 http://localhost:8432 [up]
2026/10/27 17:14:25 Go LB v21 (HD Edition) starting at :3430
…
2026/10/27 17:14:45 INFO access req_id=3c0744b3f40b508d5fcdbf3a7d2b3202 client=10.0.0.198 method=GET path=/ backend=http://localhost:8432 status=200 latency_ms=60.315583
2026/10/27 17:14:45 INFO access req_id=2321bd34b9b81e6679ca524d0920d61a client=10.0.0.1 method=GET path=/ backend=http://localhost:8432 status=200 latency_ms=48.675250000000005
2026/10/27 17:14:45 INFO access req_id=809004577bb75a7e360c8678be3b42de client=10.0.0.4 method=GET path=/ backend=http://localhost:8432 status=200 latency_ms=56.56
…
2026/10/27 17:14:55 health: http://localhost:8432 -> DOWN
…
2026/10/27 17:14:55 INFO access req_id=64315b73bf0bdd9a146195b72906b4bb client=10.0.0.6 method=GET path=/ backend=http://localhost:8432 status=502 latency_ms=29.057333
…
2026/10/27 17:15:05 INFO access req_id=f05d8cbe8fb83f595ef24519cc64f24d client=10.0.0.13 method=GET path=/ backend=http://localhost:8432 status=200 latency_ms=57.404790999999996
…
2026/10/27 17:15:15 INFO access req_id=c7572b35a3c655e792dbbdf7d7279739 client=10.0.0.19 method=GET path=/ backend=http://localhost:8432 status=200 latency_ms=16.756917
…
2026/10/27 17:15:21 health: http://localhost:8432 -> UP`

const FAILOVER_METRICS = `lb_backend_requests_total{backend="http://localhost:8430",code="200"} 8174
lb_backend_requests_total{backend="http://localhost:8431",code="200"} 8175
lb_backend_requests_total{backend="http://localhost:8432",code="200"} 3645
lb_backend_requests_total{backend="http://localhost:8432",code="502"} 1
lb_backend_up{backend="http://localhost:8430"} 1
lb_backend_up{backend="http://localhost:8431"} 1
lb_backend_up{backend="http://localhost:8432"} 1
lb_requests_total{code="200",method="GET"} 19994
lb_requests_total{code="502",method="GET"} 1`

const OVERLOAD_LOG = `2026/10/27 17:18:57 outlier: http://localhost:8430 ejected for latency (errRate=0.00, ewma=0.523s) until 2026-10-27T17:19:17Z
2026/10/27 17:18:57 outlier: http://localhost:8431 ejected for latency (errRate=0.00, ewma=0.535s) until 2026-10-27T17:19:17Z
2026/10/27 17:18:57 outlier: http://localhost:8432 ejected for latency (errRate=0.00, ewma=0.545s) until 2026-10-27T17:19:17Z
…
2026/10/27 17:19:27 outlier: http://localhost:8430 ejected for latency (errRate=0.00, ewma=0.501s) until 2026-10-27T17:19:47Z
2026/10/27 17:19:27 outlier: http://localhost:8431 ejected for latency (errRate=0.00, ewma=0.458s) until 2026-10-27T17:19:47Z
2026/10/27 17:19:27 outlier: http://localhost:8432 ejected for latency (errRate=0.00, ewma=0.647s) until 2026-10-27T17:19:47Z
…
lb_backend_outlier_ejections_total{backend="http://localhost:8430",reason="latency"} 2
lb_backend_outlier_ejections_total{backend="http://localhost:8431",reason="latency"} 2
lb_backend_outlier_ejections_total{backend="http://localhost:8432",reason="latency"} 2
lb_requests_total{code="200",method="GET"} 2527
lb_requests_total{code="503",method="GET"} 9472`

const STRATEGY_ROWS: [string, string, string, string, string][] = [
  ['round-robin', '33.3 %', '24.3', '125.0', '126.2'],
  ['weighted RR 3:3:1', '14.3 %', '22.1', '122.9', '126.0'],
  ['least-conn', '10.3 %', '22.7', '123.0', '127.6'],
  ['P2C-EWMA', '11.0 %', '21.6', '121.7', '125.6'],
]

const DECISIONS = [
  ['a breaker per backend', 'health checks alone', 'Three failures in a row open a backend\'s circuit breaker, and the picker skips it. In the kill test that happened inside the first second; the health check, which needs two failed probes 5 s ± 2 s apart, marked it down about 10 s later.'],
  ['retry GET, HEAD and OPTIONS only', 'retry everything', 'When the connection to a backend fails, the proxy waits 10 to 40 ms and sends the request to another backend, up to twice. A POST is never resent, because it might already have done its work.'],
  ['P2C on EWMA latency', 'checking every backend', 'Each request looks at two random backends and compares one number for each, so the work per request stays the same as the pool grows. The EWMA moves 20 % of the way to each new response time.'],
  ['a soft limit inside a hard one', 'one fixed connection cap', 'A semaphore of 64 is the hard ceiling. Below it, AIMD moves a soft limit between 4 and 64 every 2 s: down to 90 % when average latency is over 200 ms or more than 5 % of requests are turned away, otherwise up by one.'],
  ['switches at runtime', 'restarts', 'POST /admin/flip changes the strategy on a running balancer, and backends can be added, removed or drained without a restart. Each strategy run below started a fresh process and set its strategy with /admin/flip; round-robin is the default.'],
]

const FIXES = [
  ['Half-open ignores the health check.', 'After 10 s an open breaker lets requests through again, even when the health check has marked the backend down. In the kill test those trials hit the dead backend every 10 s. With retries on, one reached a client as a 502; with retries off, two did.'],
  ['AIMD can lock itself at the floor.', 'The reject rate counts the requests the limit itself turns away. While more traffic arrives than the backends can serve, some must be turned away, so rejects never drop under 5 % and the limit only goes down. It sat at 4 from 40 s on, and served traffic fell to 73 a second when the backends could take about 120.'],
  ['Outlier ejection has no cap.', 'With AIMD off, all three backends crossed the 400 ms line in the same 10 s window and were ejected together, so the balancer served nothing for 20 s, twice in one minute.'],
  ['The rate limit trusts X-Forwarded-For.', 'Any client can set that header and get a fresh token bucket. The load generator here used it on purpose, to act as 200 clients.'],
  ['The access log names the first pick.', 'A request that failed on a dead backend and was retried elsewhere is logged against the dead one, with status 200. The README calls the log JSON; it is key=value text.'],
]

const STACK: [string, string][] = [
  ['Language', 'Go (go.mod says 1.23; built for these tests with 1.27.3)'],
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
            A reverse proxy in Go that spreads HTTP requests across a pool of backends. I wrote it for SIT315 (Concurrent and Distributed Systems) at Deakin in 2025. In October 2026 I ran it again on my MacBook against fake backends, to see which of its features help under load. The charts and logs on this page come from those runs.
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
            The unit asked for a concurrent load balancer. I kept adding to it until the code reached v21: a semaphore, health checks, circuit breakers, four balancing strategies, rate limits, retries, an adaptive concurrency limit, outlier ejection, warm-up and Prometheus metrics, with strategies and backends switchable while it runs. This page puts them under load together: what each strategy does with one slow backend, what happens when a backend dies, and what happens when more traffic arrives than the backends can take.
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
          Everything ran on my MacBook on 27 Oct 2026, built from the repo as it is on GitHub. Three dummy backends in Go sleep for a set time per request, give or take 5 ms, and can be limited to a few requests at once. An open-loop load generator, also in Go, sends a fixed number of requests a second whatever the response time. It spreads them over 200 fake clients so the per-client rate limit stays out of the way, records every response and scrapes /metrics once a second. A Python script starts everything, kills and restarts backends on cue and keeps the logs. The repo has a single commit, so there is no older version to compare against. For the before-and-after tests I built two copies with one change each: retries off, and the AIMD controller off.
        </p>

        {/* Strategies */}
        <div className="section-label" style={{ fontFamily: MONO }}>Four strategies, one slow backend</div>
        <p style={{ ...PROSE, margin: '0 0 20px' }}>
          Two backends answer in about 20 ms and the third in about 120 ms. Each strategy got 200 requests a second for 60 s on a fresh process, three times. Round-robin sends the slow backend a third of the traffic, and weighted round-robin at 3:3:1 a seventh. Least-connections and P2C both send it about a tenth and cut the mean from 54 ms to 32 or 33. Those two tie: the gap between them is smaller than the gap between runs of the same strategy. The p95 and p99 hardly move, because the slow backend still takes more than 5 % of requests and they are the slowest ones.
        </p>
        <div data-reveal style={{ maxWidth: 480, margin: '0 auto 24px' }}>
          <Shot
            src="/projects/load-balancer/strategies.webp"
            alt="Two bar charts. Share of requests sent to the slow backend: round-robin 33 %, weighted RR 14 %, least-conn 10 %, P2C-EWMA 11 %. Mean latency: 54, 36, 33 and 32 ms."
            width={960}
            height={1000}
            caption="Measured on my MacBook, 27 Oct 2026. Median of three 60 s runs per strategy (two for P2C), about 12,000 requests per run."
          />
        </div>
        <div data-reveal style={{ overflowX: 'auto', marginBottom: 24 }}>
          <table style={{ borderCollapse: 'collapse', fontFamily: MONO, fontSize: 'var(--text-xs)', color: 'var(--fg-dim)', minWidth: 420 }}>
            <thead>
              <tr style={{ color: 'var(--muted)', textAlign: 'right' }}>
                {['strategy', 'to slow', 'p50 ms', 'p95 ms', 'p99 ms'].map((h, i) => (
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
        <p style={{ ...PROSE, fontSize: 'var(--text-sm)', color: 'var(--muted)', margin: '0 0 24px' }}>
          One P2C run is left out. Its balancer process got a stop signal 15 s in, from outside the test scripts, and the load generator&apos;s remaining 8,901 requests failed. The P2C row is the median of the two full runs.
        </p>
        <div data-reveal style={{ maxWidth: 400, margin: '0 auto 40px' }}>
          <Shot
            src="/projects/load-balancer/p2c-ewma.svg"
            alt="Diagram: a request samples two of three backends at random, sends the request to the one with the lower EWMA (21 ms over 122 ms), and the EWMA update rule, 0.2 times the latest plus 0.8 times the old value."
            width={400}
            height={400}
            caption="Diagram. The two EWMA values are the ones /metrics reported at the end of the second P2C run."
          />
        </div>

        {/* Failover */}
        <div className="section-label" style={{ fontFamily: MONO }}>Killing a backend mid-run</div>
        <p style={{ ...PROSE, margin: '0 0 20px' }}>
          Three equal backends at about 20 ms, 200 requests a second for 100 s. At 20 s the test script killed the :8432 process, and at 50 s it started it again.
        </p>
        <div data-reveal style={{ maxWidth: 480, margin: '0 auto 24px' }}>
          <Shot
            src="/projects/load-balancer/failover.webp"
            alt="Line chart of requests served per second. Before 20 s each backend serves about 67. When :8432 dies at 20 s its line drops to zero and the other two each rise to 100. One 502 at 30 s. The health check marks it down at about 30 s and up at about 56 s, then its share climbs back over about 30 s of warm-up."
            width={960}
            height={920}
            caption="Measured on my MacBook, 27 Oct 2026: 19,995 requests over 100 s, one failed. Shaded: the :8432 process is not running. lb.log stamps whole seconds, so the health-check times are to the nearest second."
          />
        </div>
        <LogBlock label="lb.log, the same run (UTC)" text={FAILOVER_LOG} />
        <p style={{ ...PROSE, fontSize: 'var(--text-sm)', color: 'var(--muted)', margin: '0 0 24px' }}>
          The three 17:14:45 lines name :8432 with status 200, but :8432 had just died. Those requests failed there and were retried on another backend, which is why they took 49 to 60 ms instead of about 20. The 17:14:55 and 17:15:05 lines are breaker trials, 10 s apart, that hit the dead backend: the first reached the client as the run&apos;s only 502, the second was retried. The 17:15:15 line, at 17 ms, is the restarted :8432 passing its trial.
        </p>
        <LogBlock label="GET /metrics at the end of the run" text={FAILOVER_METRICS} />
        <p style={{ ...PROSE, margin: '12px 0 40px' }}>
          /metrics agrees with the client&apos;s count: 19,994 OK and one 502. It also credits :8432 with 3,645 successful requests, seven more than it served, because it counts by first pick too. With retries switched off in a copy, the same test failed 4 of 19,994 requests: two caught in flight when the process died, and the breaker trials at 30 s and 40 s. So retries mostly save the requests that are mid-flight when a backend dies.
        </p>

        {/* Overload */}
        <div className="section-label" style={{ fontFamily: MONO }}>Overload, with AIMD on and off</div>
        <p style={{ ...PROSE, margin: '0 0 20px' }}>
          Here each backend works on two requests at a time and takes about 50 ms, so the three together can serve about 120 a second. The load generator sent 200 a second for 60 s, once with the AIMD controller running and once in a copy with it switched off, where the soft limit stays at 64.
        </p>
        <div data-reveal style={{ maxWidth: 480, margin: '0 auto 24px' }}>
          <Shot
            src="/projects/load-balancer/aimd.webp"
            alt="Three panels over 60 s. Top: the soft limit steps down from 64 to 4 by 40 s. Middle: requests served per second; with AIMD on, about 116 until 36 s, then 73; with it off, about 118, but zero from 10 to 28 s and from 40 to 58 s. Bottom: median latency; with AIMD on it falls from about 500 ms to 51 ms; with it off it stays around 530 ms whenever anything is served."
            width={960}
            height={1520}
            caption="Measured on my MacBook, 27 Oct 2026: two 60 s runs of 11,999 requests each. The limit comes from /metrics, scraped once a second."
          />
        </div>
        <LogBlock label="lb.log and /metrics, AIMD off" text={OVERLOAD_LOG} />
        <p style={{ ...PROSE, margin: '12px 0 40px' }}>
          With AIMD on, the limit hit its floor of 4 at 40 s. Nothing was ejected, latency settled at about 51 ms, and 6,090 requests were served against 2,527 with it off. With it off, latency sat around 530 ms, the outlier check ejected all three backends at once, twice, and the balancer served nothing for two 20 s stretches. AIMD helped, but at its floor it served 73 a second when the backends could take about 120. The second fix below explains why.
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
