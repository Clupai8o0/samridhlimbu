import type { Metadata } from 'next'
import Link from 'next/link'
import { PageShell } from '@/components/page-shell'
import { PageHeader } from '@/components/page-header'
import { Icon } from '@/components/icons'
import { Shot } from '@/components/case-study/shot'

const DESCRIPTION =
  'A backend for 2,000 simulated driverless taxis, built for SIT314 at Deakin in T2 2026. MQTT and Node-RED ingest, queue-fed dispatch workers, and a slice on AWS Fargate that scaled itself from 1 to 6 tasks on queue depth. Load-tested on a laptop and on AWS; the AWS part was torn down on 26 Aug 2026.'

export const metadata: Metadata = {
  title: 'Fleet platform · SIT314',
  description: DESCRIPTION,
  alternates: { canonical: '/projects/fleet-platform' },
  openGraph: {
    type: 'article',
    url: '/projects/fleet-platform',
    title: 'Fleet platform · SIT314 · Samridh Limbu',
    description: DESCRIPTION,
    images: [{ url: '/projects/fleet-platform/ramp.webp', width: 1120, height: 1335, alt: 'Chart: matches per second level off near 950 while offered requests rise to 3,000 a second' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fleet platform · SIT314 · Samridh Limbu',
    description: DESCRIPTION,
    images: ['/projects/fleet-platform/ramp.webp'],
  },
}

const MONO = '"JetBrains Mono", var(--font-mono), monospace'
const SANS = 'Inter, var(--font-inter), sans-serif'
const DISPLAY = 'Manrope, var(--font-manrope), sans-serif'
const GREEN = 'var(--term-green)'

const PROSE = { fontFamily: SANS, fontSize: 15, color: 'var(--fg-dim)', lineHeight: 1.65, maxWidth: 640 }

const LOG = {
  fontFamily: MONO,
  fontSize: 'var(--text-xs)',
  lineHeight: 1.7,
  color: 'var(--fg-dim)',
  background: 'var(--bg-2)',
  border: '1px solid var(--border)',
  borderRadius: 2,
  padding: '14px 16px',
  margin: 0,
  overflowX: 'auto' as const,
  whiteSpace: 'pre' as const,
}

const LOG_CAPTION = { fontFamily: MONO, fontSize: 'var(--text-xs)', color: 'var(--muted)', lineHeight: 1.5, marginTop: 8 }

// Every log below is copied from the run captures as they were written.
// Lines are only ever cut, never changed; "[...]" marks a cut.
const INGEST_LOG = `22 Aug 21:01:47 - [info] [debug:ingest stats]
{
  in: 58000,
  out: 54650,
  dropped: 3350,
  badRange: 1250,
  dupTs: 1028,
  unchanged: 1072,
  dropPct: 5.8,
[...]
--- state service, the subscriber side ---
{"vehicles":2000,"idle":2000,"zones":{"z1-0":255,"z2-1":246,"z0-2":223,"z0-0":218,"z2-0":225,"z2-2":204,"z0-1":202,"z1-2":214,"z1-1":213},"counters":{"events":758685,"claims":281214,"claimConflicts":19602,"noCandidate":0}}
--- state service before the run, for the delta ---
{"vehicles":2000,"idle":932,"zones":{"z1-0":248,"z2-1":255,"z0-2":222,"z0-0":218,"z2-0":225,"z2-2":199,"z0-1":207,"z1-2":214,"z1-1":212},"counters":{"events":704035,"claims":281214,"claimConflicts":19602,"noCandidate":0}}`

const MATCH_LOG = `stage  asked   actual  sent   matched  unmatched  p50    p95    p99    max    matched/s  mean m  p95 m
1      200/s   198.1   4000   4000     0          19     32     35     40     198.1      238     497
2      800/s   792.7   16000  14643    1357       25     43     48     53     725.4      1205    6519
3      1600/s  1584.2  32000  18531    13469      27     46     52     58     917.4      939     4091
4      3000/s  2969.9  90000  29017    60983      27     45     50     55     957.5      1048    5046
5      800/s   787.7   16000  14024    1976       24     40     48     65     690.4      1032    4797

sent 158000  matched 80215  unmatched 77785  never answered 0  arrived after their stage 560`

const WRITE_LOG = `--- trip service counters, one line every 5 s ---
trips written=0  dropped=0  buffered=0
[...]
trips written=45980  dropped=0  buffered=29695
trips written=48480  dropped=0  buffered=30783
trips written=50980  dropped=0  buffered=29003
trips written=53480  dropped=0  buffered=26503
[...]
trips written=78480  dropped=0  buffered=1503
trips written=79983  dropped=0  buffered=0

--- rows actually in postgres ---
79983`

const AWS_LOAD_LOG = `stage  asked   actual  sent   matched  unmatched  mean m  p95 m
1      25/s    29.6    2700   2700     0          262     563
2      200/s   198     48000  28027    19973      3764    11118
3      25/s    29.6    7200   6171     1029       535     1655

sent 57900  matched 36898  unmatched 21002  never answered 0  arrived after their stage 15360`

const AWS_SCALE_LOG = `[...]
    {
        "start": "2026-08-26T02:31:42.015000+10:00",
        "cause": "monitor alarm sit314-backlog-high in state ALARM triggered policy sit314-out",
        "status": "Successfully set desired count to 6. Change successfully fulfilled by ecs."
    },
    {
        "start": "2026-08-26T02:29:42.043000+10:00",
        "cause": "monitor alarm sit314-backlog-high in state ALARM triggered policy sit314-out",
        "status": "Successfully set desired count to 4. Change successfully fulfilled by ecs."
    },
[...]`

const SECURITY_LOG = `$ aws logs filter-log-events --log-group-name AWSIotLogsV2 --start-time <this run>
  Publish-In   AUTHORIZATION_FAILURE  clientId=v0000    fleet/vehicle/v0001/telemetry  x4

2026-08-25T20:56:22 SEC_PROBE GET /stats with no bearer header -> HTTP 401 {"ok":false,"error":"unauthorized"}
2026-08-25T20:56:22 SEC_PROBE GET /stats with the bearer header -> HTTP 200 {"vehicles":2000, [...]`

const METRICS = [
  { k: 'simulated taxis', v: '2,000' },
  { k: 'matches a second, local peak', v: '958' },
  { k: 'Fargate tasks on AWS', v: '1 → 6' },
  { k: 'trips matched and stored', v: '79,983' },
]

const TIMELINE = [
  { date: '3 Aug 2026', title: 'First commit', body: 'The ingest flow, state service, dispatch worker, autoscaler and load harness, all running on my laptop.' },
  { date: '22 Aug 2026', title: 'The run set', body: 'Ingest, matching under load with one worker and autoscaled, and monitoring, from one script. The batching comparison ran straight after.' },
  { date: '24 Aug 2026', title: 'Write path', body: 'One more ramp to watch the trip writer, then the final commit with the experiments and batched matching.' },
  { date: '25–26 Aug 2026', title: 'AWS slice', body: 'SQS, two Fargate services, Cloud Map, Secrets Manager and three IoT Core vehicles. Built, measured and torn down in one session.' },
  { date: '27 Aug 2026', title: 'Batching write-up', body: 'The comparison of nearest-car-first against a batched rule, written up as a post.' },
  { date: '27 Oct 2026', title: 'Re-run for this page', body: 'The local experiments again, from a copy of the repo. Same ceiling.', current: true },
]

const DECISIONS = [
  ['step scaling', 'target tracking', 'Target tracking creates its own scale-in alarm over fifteen datapoints, so on a run this short the count would still have been at six at the end. Step scaling is still Application Auto Scaling and shows both directions. I did not run it both ways, so treat this as my reason for the choice rather than something I measured.'],
  ['one image for both services', 'an image per service', 'Dispatch and state run from the same image with two entry points. There is one artefact to build and scan, and the two cannot drift apart. ECR tags are immutable, so a tag always means the same image.'],
  ['Cloud Map private DNS', 'public task addresses', 'There is no NAT gateway, because one costs more a month than this whole project did. So each task has a public address to pull its image. If dispatch called state on that address, the traffic would go out through the internet gateway and the security group rule that only admits the dispatch group would stop matching. state.sit314.local keeps it inside the VPC.'],
  ['a queue in front of dispatch', 'riders calling workers', 'Riders put requests on a queue and workers pull them. A slow worker means a longer queue, not a dropped request, and the queue depth is the signal the scaling alarm reads. Locally the queue hides a received message for 20 s, so a request held by a worker that dies comes back.'],
  ['moving only the matching path', 'moving everything', 'Node-RED\'s dedupe keeps live state per vehicle, so moving it would change what the ingest test measures. The write limit is a constant in my code, so RDS would not change that result either. The queue and the workers are what the project is about, so they moved.'],
]

const STACK: [string, string[]][] = [
  ['Platform', ['Node.js', 'MQTT', 'Mosquitto 2.1.2', 'Node-RED 5.0.4', 'PostgreSQL 16']],
  ['AWS', ['SQS', 'ECS Fargate (ARM64)', 'Application Auto Scaling', 'CloudWatch', 'Cloud Map', 'Secrets Manager', 'IoT Core', 'ECR']],
  ['Tooling', ['Docker', 'AWS CLI', 'bash', 'matplotlib']],
]

export default function FleetPlatformPage() {
  return (
    <PageShell>
      <div data-stagger style={{ maxWidth: 720, margin: '0 auto', padding: '36px 20px' }}>

        <PageHeader />

        {/* breadcrumb */}
        <div data-stagger-item style={{ fontFamily: MONO, fontSize: 'var(--text-xs)', color: 'var(--muted)', marginBottom: 16 }}>
          <span style={{ color: 'var(--accent)' }}>❯</span>{' '}
          cd <Link href="/projects" style={{ color: 'var(--fg)', textDecoration: 'none' }}>projects</Link>/fleet-platform
        </div>

        {/* Banner */}
        <div data-stagger-item style={{ padding: '24px 0', marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', columnGap: 12, rowGap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
            <h1 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 'var(--text-2xl)', lineHeight: 1.1, margin: 0, letterSpacing: '-0.025em', color: 'var(--fg)' }}>Fleet platform</h1>
            <span className="pill" style={{ fontFamily: MONO }}>uni project · SIT314 · T2 2026</span>
          </div>
          <p style={{ ...PROSE, fontSize: 'var(--text-base)', margin: 0 }}>
            The backend for a fleet of driverless taxis. 2,000 simulated taxis report where they are every two seconds, and a rider who asks for a car gets the nearest free one. I load-tested it on my laptop, then moved the matching path to AWS and watched it scale itself up and back down.
          </p>
        </div>

        {/* Hero: the architecture */}
        <div data-stagger-item style={{ maxWidth: 440, margin: '0 auto 24px' }}>
          <Shot
            src="/projects/fleet-platform/architecture.svg"
            alt="Diagram in two columns. Telemetry: 2,000 taxis publish every 2 s to Mosquitto, Node-RED filters, dedupes and tags one of nine zones, and clean events reach the state service and the monitor. Rides: riders send requests to the rides queue, the autoscaler scales dispatch workers on the backlog, dispatch claims the nearest free car from the state service, and trips go through the trip service to Postgres 16 at up to 500 rows a second."
            width={440}
            height={900}
            caption="Diagram of the platform as it ran on my laptop, with the service names from the code."
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

        {/* Context */}
        <div style={{ marginBottom: 40 }}>
          <div className="section-label" style={{ fontFamily: MONO }}>Context</div>
          <p style={{ ...PROSE, margin: '0 0 14px' }}>
            The final project for SIT314, Software Architecture and Scalability for the Internet of Things, at Deakin in Trimester 2 2026. It is a solo project. The brief was a cloud backend for a driverless-taxi fleet that keeps working as the load grows.
          </p>
          <p style={{ ...PROSE, margin: 0 }}>
            Nothing here is live. I built the AWS part on my own account, measured it and tore it down on 26 Aug 2026, and the repo is private. Every number on this page comes from a run log.
          </p>
        </div>

        {/* Ingest */}
        <div className="section-label" style={{ fontFamily: MONO }}>Cleaning the telemetry</div>
        <p style={{ ...PROSE, margin: '0 0 14px' }}>
          Each taxi publishes its position, battery and status over MQTT. A Node-RED flow drops readings outside the service area, readings with a repeated timestamp and readings where nothing moved. It then tags each one with one of nine zones. The simulator corrupts 6% of its output on purpose, so the filter has real work to do.
        </p>
        <div data-reveal style={{ marginBottom: 20 }}>
          <pre style={LOG}>{INGEST_LOG}</pre>
          <div style={LOG_CAPTION}>Node-RED&apos;s counters and the state service&apos;s, from the 22 Aug 2026 run. Lines copied as captured, trimmed.</div>
        </div>
        <p style={{ ...PROSE, margin: '0 0 20px' }}>
          58,000 readings went in and 54,650 came out. The state service counted 758,685 minus 704,035 events, which is the same 54,650. The code was fine; the first attempts disagreed because of how I measured. Node-RED only reports every ten seconds, so the run now restarts it first and waits 25 seconds after the last reading before it reads either side.
        </p>
        <div data-reveal style={{ maxWidth: 560, margin: '0 auto 40px' }}>
          <Shot
            src="/projects/fleet-platform/fleet-map.webp"
            alt="Map of 2,000 grey dots over a three by three grid. The zones hold 224, 204 and 208 cars along the top row, 204, 213 and 251 across the middle, where the CBD is marked, and 224, 245 and 227 along the bottom."
            width={1120}
            height={1206}
            caption="Car positions from the 2,000-car snapshot the AWS state service was seeded with, over the nine zones. Each number is the cars in that zone."
          />
        </div>

        {/* Matching under load */}
        <div className="section-label" style={{ fontFamily: MONO }}>Matching under load</div>
        <p style={{ ...PROSE, margin: '0 0 14px' }}>
          A load harness sends ride requests in five stages, from 200 a second up to 3,000 and back down to 800. Each request goes on a queue. A dispatch worker takes eight at a time, asks the state service for idle cars nearby and claims one. A claim can lose to another worker, and then it tries the next car on its list. Over the whole run set that happened on about one claim in fourteen: 47,031 conflicts in 602,554 claims.
        </p>
        <p style={{ ...PROSE, margin: '0 0 20px' }}>
          I ran the ramp twice, once with a single worker and once with an autoscaler free to run up to six.
        </p>
        <div data-reveal style={{ maxWidth: 560, margin: '0 auto 24px' }}>
          <Shot
            src="/projects/fleet-platform/ramp.webp"
            alt="Chart: offered requests rise through 200, 800, 1,600 and 3,000 a second, then drop to 800. Matches per second for one worker and for the autoscaled run follow each other and flatten near 950, with 958 a second at the 3,000 stage. Below, p95 match latency stays between about 30 and 50 ms for both."
            width={1120}
            height={1335}
            caption="Matches per second against requests offered, one worker and autoscaled, measured on my laptop on 22 Aug 2026. The bars are the offered rate."
          />
        </div>
        <div data-reveal style={{ marginBottom: 20 }}>
          <pre style={LOG}>{MATCH_LOG}</pre>
          <div style={LOG_CAPTION}>The load harness, one-worker run, 22 Aug 2026. Latency columns in ms, distances in metres. Trimmed to the stage table.</div>
        </div>
        <p style={{ ...PROSE, margin: '0 0 14px' }}>
          Both runs flatten near 950 matches a second, and both leave about 61,000 requests without a car at the 3,000 stage. Latency held at 45 ms there and no request went unanswered, so the worker kept up with everything it was given. What ran out was free cars. Each match holds a car for 300 ms, and the simulator keeps it busy for about half a second more. So the limit was the fleet, which is the opposite of what I planned for: I spent the project scaling the matching service. The autoscaler never went past three workers.
        </p>
        <p style={{ ...PROSE, color: 'var(--muted)', margin: '0 0 40px' }}>
          I ran the same script again on 27 Oct 2026, from a copy of the repo, without Postgres, on a laptop busy with other work. Ingest came out identical, because the simulator is seeded. Matching peaked at 968.6 a second with one worker and 971.2 autoscaled. Same ceiling.
        </p>

        {/* Write path */}
        <div className="section-label" style={{ fontFamily: MONO }}>Writing trips to Postgres</div>
        <p style={{ ...PROSE, margin: '0 0 20px' }}>
          Each match also sends a trip to a trip service, which writes to Postgres 16 in batches: once a second, at most 500 rows. The matcher was producing about 960 a second. On 24 Aug I ran the ramp once more and watched the writer instead.
        </p>
        <div data-reveal style={{ marginBottom: 20 }}>
          <pre style={LOG}>{WRITE_LOG}</pre>
          <div style={LOG_CAPTION}>Trip service counters and a row count, 24 Aug 2026. Trimmed to the start, the peak and the drain.</div>
        </div>
        <p style={{ ...PROSE, margin: '0 0 40px' }}>
          The buffer peaked at 30,783 rows and took about a minute to clear after the load stopped. The worker matched 79,983 rides, the trip service wrote 79,983 rows, and the table held 79,983. The rows arrived late, but they all arrived. Postgres was nowhere near its limit. The 500 is a constant in my own flush loop.
        </p>

        {/* AWS */}
        <div className="section-label" style={{ fontFamily: MONO }}>Moving the matching path to AWS</div>
        <p style={{ ...PROSE, margin: '0 0 20px' }}>
          I moved the part the project is about. The ride queue became SQS, and the dispatch worker and state service became Fargate tasks on ARM64 at a quarter of a vCPU. The state service was seeded from a snapshot of the fleet. Ingest, the broker, the monitor and Postgres stayed on my laptop.
        </p>
        <div data-reveal style={{ maxWidth: 440, margin: '0 auto 40px' }}>
          <Shot
            src="/projects/fleet-platform/aws-slice.svg"
            alt="Diagram: the load harness on my laptop sends requests to SQS rides and reads answers from SQS matches, inside a VPC with public subnets and no NAT. Dispatch on Fargate, 1 to 6 ARM64 tasks with its own task role, receives from rides and sends to matches, and calls state on Fargate at state.sit314.local with a bearer token. Cloud Map gives private DNS and Secrets Manager holds the token. IoT Core holds 3 things with one certificate each."
            width={440}
            height={900}
            caption="Diagram of what ran on AWS in ap-southeast-2, 25–26 Aug 2026."
          />
        </div>

        {/* Scaling */}
        <div className="section-label" style={{ fontFamily: MONO }}>Scaling on queue depth</div>
        <p style={{ ...PROSE, margin: '0 0 20px' }}>
          Two CloudWatch alarms watch the number of rides waiting. Above 200 for a minute, a step policy adds dispatch tasks, more of them the further over it is. Below 50 for two minutes, another removes two. The count stays between one and six.
        </p>
        <div data-reveal style={{ maxWidth: 440, margin: '0 auto 24px' }}>
          <Shot
            src="/projects/fleet-platform/scaling-loop.svg"
            alt="Diagram: the rides queue backlog, a one-minute average, feeds two alarms. backlog-high, average over 200 for 1 minute, triggers sit314-out, plus 1 to plus 3 tasks with a 60 s cooldown. backlog-low, average under 50 for 2 minutes, triggers sit314-in, minus 2 tasks with a 120 s cooldown. Both set the ECS desired count for sit314-dispatch, 1 to 6."
            width={440}
            height={700}
            caption="Diagram of the scaling policy, with the thresholds from the deploy script."
          />
        </div>
        <p style={{ ...PROSE, margin: '0 0 20px' }}>
          The run asked for 25 requests a second for 90 s, then 200 for 240 s, then 25 for 240 s. That is far below the 3,000 a second on the laptop, on purpose. It is there to show the policy working, not to measure speed, so I never put its numbers beside the local ones.
        </p>
        <div data-reveal style={{ maxWidth: 560, margin: '0 auto 24px' }}>
          <Shot
            src="/projects/fleet-platform/aws-scaling.webp"
            alt="Chart: rides waiting on the queue climb from zero to a peak of 19,187 about five minutes in, then fall back to zero. Below, desired and running dispatch tasks step from 1 to 4 to 6, hold, then step down to 4, 2 and 1 by about 18 minutes."
            width={1120}
            height={1335}
            caption="Rides waiting on the SQS queue and the dispatch task count, polled every 10 s on AWS, 26 Aug 2026."
          />
        </div>
        <div data-reveal style={{ marginBottom: 24 }}>
          <pre style={LOG}>{AWS_SCALE_LOG}</pre>
          <div style={LOG_CAPTION}>Application Auto Scaling&apos;s own record, newest first. Trimmed to the two scale-outs.</div>
        </div>
        <div data-reveal style={{ marginBottom: 24 }}>
          <Shot
            src="/projects/fleet-platform/aws-ecs-events.webp"
            alt="The ECS console event list for sit314-dispatch on 26 August 2026: at 02:42 desired count set to 1 by the sit314-backlog-low alarm and policy sit314-in, one task stopped; at 02:39 two tasks stopped."
            width={1095}
            height={555}
            caption="The ECS console's event list for the dispatch service after the run, cropped to the events. Times are AEST."
          />
        </div>
        <div data-reveal style={{ marginBottom: 20 }}>
          <pre style={LOG}>{AWS_LOAD_LOG}</pre>
          <div style={LOG_CAPTION}>The load harness on the SQS path, 26 Aug 2026. Distances in metres. It reports no latency, because the answers come back through a queue it polls.</div>
        </div>
        <p style={{ ...PROSE, margin: '0 0 40px' }}>
          The task count went 1, 4, 6, then back to 4, 2 and 1, and AWS records the alarm and policy behind every step. 36,898 of 57,900 requests were matched. Almost all of the 21,002 misses are in the 200-a-second stage, and fleet size explains them on its own: a match holds a car for 20 s here, so 198 a second needs about 3,960 cars, and there were 2,000. That is the same finding as on the laptop. My poller saw a peak of 19,187 waiting, while CloudWatch&apos;s highest one-minute average was 15,071. The alarm reads the average, which is part of why scaling out lags.
        </p>

        {/* Security */}
        <div className="section-label" style={{ fontFamily: MONO }}>Proving the controls refuse things</div>
        <p style={{ ...PROSE, margin: '0 0 20px' }}>
          Each of three demo vehicles has its own X.509 certificate, under one IoT policy scoped by thing name. To test it, I pointed v0000&apos;s certificate at v0001&apos;s topic. IoT Core does not send back an error, it just drops the connection, so the proof is in AWS&apos;s own log. The state service has no task role, accepts traffic only from the dispatch security group, and wants a bearer token that reaches the container as a Secrets Manager ARN.
        </p>
        <div data-reveal style={{ marginBottom: 20 }}>
          <pre style={LOG}>{SECURITY_LOG}</pre>
          <div style={LOG_CAPTION}>AWS IoT&apos;s log and the state service probe, 25 Aug 2026 (UTC). The last line is cut short.</div>
        </div>
        <p style={{ ...PROSE, margin: '0 0 40px' }}>
          Three certificates and not 2,000 is a real gap. The simulator drives the whole fleet over one connection at about 1,000 messages a second, and IoT Core allows roughly 100 per connection, so a real fleet needs a connection and a certificate per car. Mosquitto, which stayed local, has no TLS and no device identity at all.
        </p>

        {/* Batching */}
        <div className="section-label" style={{ fontFamily: MONO }}>A better matching rule</div>
        <p style={{ ...PROSE, margin: '0 0 20px' }}>
          The worker takes eight requests at once, then lets each one race for its own nearest car. As an extension I tried a batched hill climb adapted from a 2017 DiDi paper. It collects requests for 250 ms and assigns cars to the whole batch together.
        </p>
        <div data-reveal style={{ maxWidth: 560, margin: '0 auto 24px' }}>
          <Shot
            src="/projects/fleet-platform/batching.webp"
            alt="Chart: mean pickup distance by stage. Nearest car first runs about 970 to 1,190 m under load, 1,044 m at 3,000 a second; batched with a 250 ms window runs about 780 to 860 m, 796 m at 3,000. Both are the same at 200 a second. Below, p95 match latency is about 30 to 100 ms for nearest car first and about 111 ms for batched, 283 ms at the first stage."
            width={1120}
            height={1335}
            caption="Mean pickup distance and p95 match latency, nearest car first against batched with a 250 ms window. Local runs on 22 Aug 2026; the nearest-car figures are the mean of two runs."
          />
        </div>
        <p style={{ ...PROSE, margin: '0 0 40px' }}>
          Across the loaded stages, mean pickup distance fell from 1,068 m to 814 m, about a quarter. The cost was latency: p95 went from 51 ms to 112 ms. The full comparison is in the post <Link href="/writing/sit314-batched-assignment" style={{ color: 'var(--accent)' }}>Batched assignment in a driverless-taxi fleet</Link>.
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

        {/* Timeline */}
        <div className="section-label" style={{ fontFamily: MONO }}>Timeline</div>
        <div style={{ marginBottom: 40 }}>
          {TIMELINE.map((e, i) => (
            <div key={i} style={{ position: 'relative', marginLeft: 5, paddingLeft: 22, paddingBottom: i === TIMELINE.length - 1 ? 0 : 20 }}>
              <div data-timeline-dot style={{ position: 'absolute', left: -6, top: 4, width: 11, height: 11, borderRadius: 6, background: e.current ? 'var(--accent)' : 'var(--bg)', border: `1.5px solid ${e.current ? 'var(--accent)' : 'var(--muted-2)'}` }} />
              <div style={{ fontFamily: MONO, fontSize: 'var(--text-xs)', color: 'var(--muted)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{e.date}</div>
              <div style={{ fontFamily: SANS, fontSize: 15, fontWeight: 600, color: 'var(--fg)', marginBottom: 4 }}>{e.title}</div>
              <div style={{ fontFamily: SANS, fontSize: 'var(--text-sm)', color: 'var(--muted)', lineHeight: 1.6, maxWidth: 560 }}>{e.body}</div>
            </div>
          ))}
        </div>

        {/* What I'd do differently */}
        <div className="section-label" style={{ fontFamily: MONO }}>What I&apos;d do differently</div>
        <p style={{ ...PROSE, color: 'var(--muted)', margin: '0 0 14px' }}>
          Move to AWS early. I left it until the end, so the experiments ran on two shapes of infrastructure instead of one. I also scaled the wrong thing: the matcher never became the bottleneck, and the fleet did.
        </p>
        <p style={{ ...PROSE, color: 'var(--muted)', margin: '0 0 40px' }}>
          Two limits are my own doing. The trip writer&apos;s fixed 500 rows a second is the kind of hard-coded constant the unit warned about. And the scaling policy reads raw queue depth, so at six tasks the backlog can drop under 50 while the load is still high, and it scales in anyway. It should divide the depth by the number of tasks.
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
          <Link href="/writing/sit314-batched-assignment" className="btn" style={{ fontFamily: MONO }}><Icon name="file" size={12} /> read the batching post</Link>
          <Link href="/projects" className="btn btn-ghost" style={{ fontFamily: MONO }}>← back to projects</Link>
        </div>

      </div>
    </PageShell>
  )
}
