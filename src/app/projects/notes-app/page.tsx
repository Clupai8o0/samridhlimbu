import type { Metadata } from 'next'
import Link from 'next/link'
import { PageShell } from '@/components/page-shell'
import { PageHeader } from '@/components/page-header'
import { Icon } from '@/components/icons'
import { Shot } from '@/components/case-study/shot'
import { ArticleChart } from '@/components/article-chart'
import { CodePre } from '@/components/code-pre'
import type { ChartBlock } from '@/lib/writing'

const DESCRIPTION =
  'A small Next.js, Express and MongoDB notes app built to carry a 10-stage Jenkins pipeline: tests, versioned Docker images, SonarCloud and Snyk, a release tag, a manual approval, an SSH deploy to AWS EC2, smoke and Prometheus checks, and a rollback. Built in May 2025; re-run locally in October 2026.'

export const metadata: Metadata = {
  title: 'notes-app · CI/CD pipeline',
  description: DESCRIPTION,
  alternates: { canonical: '/projects/notes-app' },
  openGraph: {
    type: 'article',
    locale: 'en_AU',
    siteName: 'Samridh Limbu',
    url: '/projects/notes-app',
    title: 'notes-app · CI/CD pipeline · Samridh Limbu',
    description: DESCRIPTION,
    images: [{ url: '/projects/notes-app/notes.webp', width: 2880, height: 1340, alt: 'The notes-app dashboard with six notes in a three-column grid' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'notes-app · CI/CD pipeline · Samridh Limbu',
    description: DESCRIPTION,
    images: ['/projects/notes-app/notes.webp'],
  },
}

const MONO = '"JetBrains Mono", var(--font-mono), monospace'
const SANS = 'Inter, var(--font-inter), sans-serif'
const DISPLAY = 'Manrope, var(--font-manrope), sans-serif'
const GREEN = 'var(--term-green)'

const PROSE = { fontFamily: SANS, fontSize: 15, color: 'var(--fg-dim)', lineHeight: 1.65, maxWidth: 640 }

const METRICS = [
  { k: 'pipeline stages', v: '10' },
  { k: 'server tests', v: '132' },
  { k: 'client tests', v: '87' },
  { k: 'release tags', v: '6' },
]

// Verbatim lines from the local stage runs (trimmed by selection only).
// Full logs: .claude/tmp/notes-app-shots/logs/
const LOG_BACKEND = `FAIL src/__tests__/index.test.ts
  Server Endpoints
    GET /server/ping
      ✕ should return ping message (5 ms)

  ● Server Endpoints › GET /server/ping › should return ping message
    Expected: 200
    Received: 404

Test Suites: 1 failed, 8 passed, 9 total
Tests:       1 failed, 131 passed, 132 total`

const LOG_BACKEND_PREV = `commit fd9ac4a (parent of 3dddb70)
Test Suites: 9 passed, 9 total
Tests:       132 passed, 132 total`

const LOG_FRONTEND = `Test Suites: 4 passed, 4 total
Tests:       87 passed, 87 total`

const LOG_SMOKE = `✅ Smoke test passed! http://localhost:3443/server/ping is reachable.
# HELP http_request_duration_seconds Duration of HTTP requests in seconds
# TYPE http_request_duration_seconds histogram
http_request_duration_seconds_bucket{le="0.05",route="/server/ping",method="GET",status="2XX"} 542
✅ /metrics endpoint OK
✅ Prometheus target 'notes-app' is ACTIVE
[exit 0]`

const LOG_DELETE_BEFORE = `$ curl -s -X DELETE localhost:3444/api/notes/6ae0d9caeb80b1c285442015 -H 'Cookie: token=<local token>' -w ' HTTP %{http_code}'
{"message":"Not authorized to access this route - No token found"} HTTP 401`

const LOG_DELETE_AFTER = `$ curl -s -X DELETE localhost:3444/api/notes/6ae0d9caeb80b1c285442015 -H 'Cookie: token=<local token>' -w ' HTTP %{http_code}'
{"message":"Note deleted successfully"} HTTP 200`

const DIFF_DELETE = `--- a/client/app/api/notes/[id]/route.ts
+++ b/client/app/api/notes/[id]/route.ts
@@ -113,6 +113,7 @@ export async function DELETE(
 			method: "DELETE",
 			headers: {
 				Cookie: \`token=\${token}\`,
+				Authorization: \`Bearer \${token}\`,
 			},
 		});`

const DECISIONS = [
  ['versioned images', 'one latest tag', 'Each build pushes both images as v1.0.<build number>. That is what makes the rollback work: the failure step looks up the last successful build and redeploys its tag.'],
  ['a person approves the deploy', 'deploy on every push', 'The deploy stage opens with an input step, "Deploy to Production?". Everything before it runs on its own; nothing reaches the server until someone clicks.'],
  ['scan before release', 'scan after deploy', 'SonarCloud and Snyk run on both apps before the release tag and the deploy. If Snyk finds a known vulnerability, the build stops before anything is tagged or the new images are deployed. SonarCloud only reports: the pipeline does not wait for its quality gate. The images are already on Docker Hub by then.'],
  ['check after deploy', 'trust a green deploy', 'Two stages run against the server after the deploy: /server/ping must return 200, then /server/metrics must answer and Prometheus must list the notes-app target as active.'],
]

const TIMELINE = [
  { date: 'May 2025', title: 'App and pipeline', body: 'First commit of the app on 30 May, then a day of Jenkinsfile fixes: escaping dollar signs in Groovy, dropping build parameters, adding the scans, smoke test and monitoring stages.' },
  { date: 'May 2025', title: 'Releases and a planned failure', body: 'Six release tags by 31 May, up to v1.0.22. The last pipeline commit, "failed jenkins pipeline with rollback", breaks a test and the production port mappings on purpose, so the failure path can be shown.' },
  { date: 'Dec 2025', title: 'README', body: 'A final README for the repo. No code changes.' },
  { date: 'Oct 2026', title: 'Local re-run for this page', body: 'Ran the test, build, smoke and monitoring stages from a fresh clone, sent traffic through it, and found the DELETE bug below. Nothing was deployed.', current: true },
]

const STACK: [string, string][] = [
  ['Client', 'Next.js 15 · React 19 · Tailwind 4 · Radix UI'],
  ['Server', 'Express 5 · Mongoose 8 · MongoDB · JWT · bcryptjs'],
  ['Tests', 'Jest · Supertest · mongodb-memory-server · Testing Library'],
  ['Pipeline', 'Jenkins · Docker · Docker Hub · SonarCloud · Snyk · AWS EC2 · docker-compose'],
  ['Monitoring', 'express-prometheus-middleware · Prometheus · Grafana · Node Exporter · Alertmanager'],
]

const STAGE_CHART: ChartBlock = {
  type: 'chart',
  kind: 'hbar',
  title: 'Seconds per stage command',
  subtitle: 'One run each, on a MacBook, 27 Oct 2026.',
  caption: 'Backend tests: 1 of 132 tests fails, on purpose. Image builds used --no-cache. Building the client image takes longest.',
  unit: 's',
  categories: ['backend lint', 'backend tests', 'frontend lint', 'frontend tests', 'server image build', 'client image build'],
  series: [{ name: 'wall time', values: [1.9, 22.1, 1.6, 2.7, 20.6, 89.2] }],
}

function LogBlock({ label, text, lang }: { label: string; text: string; lang?: string })
{
  return (
    <figure style={{ margin: '0 0 12px' }}>
      <figcaption style={{ fontFamily: MONO, fontSize: 'var(--text-xs)', color: 'var(--muted)', marginBottom: 8, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{label}</figcaption>
      <CodePre style={{ margin: 0, padding: '12px 14px', background: 'var(--bg-2)', borderRadius: 2, fontFamily: MONO, fontSize: 12, lineHeight: 1.6, color: 'var(--fg-dim)', whiteSpace: 'pre', overflowX: 'auto' }} code={text} lang={lang} />
    </figure>
  )
}

export default function NotesAppPage() {
  return (
    <PageShell>
      <div data-stagger style={{ maxWidth: 720, margin: '0 auto', padding: '36px 20px' }}>

        <PageHeader />

        {/* breadcrumb */}
        <div data-stagger-item style={{ fontFamily: MONO, fontSize: 'var(--text-xs)', color: 'var(--muted)', marginBottom: 16 }}>
          <span style={{ color: 'var(--accent)' }}>❯</span>{' '}
          cd <Link href="/projects" style={{ color: 'var(--fg)', textDecoration: 'none' }}>projects</Link>/notes-app
        </div>

        {/* Banner */}
        <div data-stagger-item style={{ padding: '24px 0', marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', columnGap: 12, rowGap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
            <h1 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 'var(--text-2xl)', lineHeight: 1.1, margin: 0, letterSpacing: '-0.025em', color: 'var(--fg)' }}>notes-app</h1>
            <span className="pill" style={{ fontFamily: MONO }}>ci/cd pipeline · may 2025</span>
          </div>
          <p style={{ ...PROSE, fontSize: 'var(--text-base)', margin: 0 }}>
            A small notes app, built to run through a CI/CD pipeline. Each Jenkins build runs ten stages: tests, Docker images, two scans, a release tag, a manual approval, a deploy to an AWS EC2 server, then a smoke test and a monitoring check. If any stage fails, Jenkins redeploys the last good build. The EC2 server is gone now, so nothing here is live.
          </p>
        </div>

        {/* Hero */}
        <div data-stagger-item style={{ marginBottom: 24 }}>
          <Shot
            src="/projects/notes-app/notes.webp"
            alt="The notes-app dashboard titled My Notes, with a Create Note button and six note cards in a three-column grid, each with an edit and a delete icon"
            width={2880}
            height={1340}
            caption="The notes dashboard. All screens on this page come from a local run in October 2026, with a demo account and seeded notes."
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
          <p style={{ ...PROSE, margin: 0 }}>
            I kept the app simple on purpose. You sign up, sign in and keep notes. A Next.js client handles the pages and passes API calls to an Express server, which stores users and notes in MongoDB. The work went into the pipeline, which I wrote over two days in May 2025. The release tags show Jenkins got to build 22.
          </p>
        </div>

        {/* Pipeline */}
        <div className="section-label" style={{ fontFamily: MONO }}>The pipeline</div>
        <p style={{ ...PROSE, margin: '0 0 20px' }}>
          These are the stage names from the Jenkinsfile, in order. The first seven run on their own. The deploy waits for someone to approve it, then logs in to the EC2 server over SSH, pulls the two images for this build and restarts the stack with docker-compose. A failure at any point runs the rollback, which deploys the last successful build&apos;s images.
        </p>
        <div data-reveal style={{ margin: '0 auto 40px' }}>
          <Shot
            src="/projects/notes-app/pipeline.svg"
            alt="Pipeline diagram: 01 Checkout Code, 02 Lint and Test Backend, 03 Lint and Test Frontend, 04 Build and Push Docker Images, 05 Code Quality Analysis, 06 Snyk Security Scan, 07 Release Tagging, then an input step 'Deploy to Production?', 08 Deploy to Production, 09 Smoke Test on EC2, 10 Monitoring and Alerts. Dotted lines labelled 'any stage fails' lead to 'post failure: roll back', which redeploys the last good build."
            width={480}
            height={1002}
            wide={{ src: '/projects/notes-app/pipeline-wide.svg', width: 890, height: 532 }}
            caption="The ten stages and the rollback, drawn from the Jenkinsfile."
          />
        </div>

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

        {/* Stage runs */}
        <div className="section-label" style={{ fontFamily: MONO }}>Running the stages again</div>
        <p style={{ ...PROSE, margin: '0 0 20px' }}>
          The Jenkins server and its build logs are gone, so in October 2026 I ran the stages that need no accounts from a fresh clone on my MacBook. The pushes, scans, tagging and deploy need Docker Hub, SonarCloud, Snyk, GitHub and SSH credentials, so they were not run. The logs below are from that local run.
        </p>
        <div data-reveal style={{ marginBottom: 24 }}>
          <ArticleChart block={STAGE_CHART} />
        </div>
        <p style={{ ...PROSE, margin: '0 0 16px' }}>
          The backend stage fails at the latest commit, as intended. The last pipeline commit changed the ping test to request <code>/server/pin</code>, so it gets a 404. The commit before it passes all 132 tests.
        </p>
        <div data-reveal style={{ marginBottom: 28 }}>
          <LogBlock label="Lint and Test Backend · at 954b945" text={LOG_BACKEND} />
          <LogBlock label="Lint and Test Backend · before the planned failure" text={LOG_BACKEND_PREV} />
          <LogBlock label="Lint and Test Frontend" text={LOG_FRONTEND} />
        </div>
        <p style={{ ...PROSE, margin: '0 0 16px' }}>
          The last two stages are plain shell checks. I ran the same commands with the EC2 address swapped for the local server and Prometheus.
        </p>
        <div data-reveal style={{ marginBottom: 40 }}>
          <LogBlock label="Smoke Test + Monitoring and Alerts · local" text={LOG_SMOKE} />
        </div>

        {/* Monitoring */}
        <div className="section-label" style={{ fontFamily: MONO }}>What gets watched</div>
        <p style={{ ...PROSE, margin: '0 0 20px' }}>
          The server records how long every request takes, by route and status, and serves the numbers at <code>/server/metrics</code>. Prometheus collects them and Grafana graphs them. The repo&apos;s production compose file runs Prometheus, Grafana, Node Exporter and Alertmanager next to the app, but ships no dashboards, so I built one for this page.
        </p>
        <div data-reveal style={{ margin: '0 auto 32px' }}>
          <Shot
            src="/projects/notes-app/request-path.svg"
            alt="Request path diagram: the browser sends GET /api/notes with its token cookie to the Next.js 15 client on port 3000, which passes a Bearer token to the Express 5 server on port 5000, which queries MongoDB. The server exposes /server/metrics, Prometheus pulls the metrics and Grafana shows dashboards."
            width={480}
            height={466}
            wide={{ src: '/projects/notes-app/request-path-wide.svg', width: 880, height: 358 }}
            caption="One request, and what watches it. Drawn from the code."
          />
        </div>
        <div data-reveal style={{ marginBottom: 40 }}>
          <Shot
            src="/projects/notes-app/grafana.webp"
            alt="Grafana dashboard for 03:58:30 to 04:04:30 on 28 Oct 2026: 4752 requests counted, 1114 4XX responses, 95.6% answered in under 50 ms, Prometheus target up 1; charts of requests per second by status, 4XX per second by route (DELETE notes, GET notes, POST login), server memory and event loop lag"
            width={2880}
            height={1640}
            caption="About four and a half minutes of scripted traffic against the local app, as Prometheus saw it. The orange DELETE line in the 4XX chart led to the bug below."
          />
        </div>

        {/* Bug */}
        <div className="section-label" style={{ fontFamily: MONO }}>A bug the tests missed</div>
        <p style={{ ...PROSE, margin: '0 0 14px' }}>
          The traffic script made some 4XX errors on purpose: 368 requests with no token and 205 logins with a wrong password. That accounts for 573 of the 1114. The other 541 were not planned: every delete sent through the client got a 401. Deleting a note from the app has never worked: the route is unchanged since the first commit.
        </p>
        <p style={{ ...PROSE, margin: '0 0 20px' }}>
          The client&apos;s API routes read the token cookie and pass it on to the server. The GET and PUT routes send it as a Bearer header. The DELETE route only forwards the cookie, and the Express server never parses cookies, so it finds no token. The server tests send the token as a Bearer header, and the client tests mock fetch and never reach the API routes, so none of the 219 tests catch it. The server suite&apos;s own notes say a cookie-auth test section was dropped because it needed complex middleware setup.
        </p>
        <div data-reveal style={{ marginBottom: 16 }}>
          <LogBlock label="The fix · one line" text={DIFF_DELETE} />
          <LogBlock label="Before · client at 954b945" text={LOG_DELETE_BEFORE} />
          <LogBlock label="After · fix applied, client rebuilt" text={LOG_DELETE_AFTER} />
        </div>
        <p style={{ ...PROSE, color: 'var(--muted)', margin: '0 0 40px' }}>
          The fix exists only in my local copy, used to check it. The repo on GitHub still has the bug. The note screenshots were taken before the fix.
        </p>

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
        <p style={{ ...PROSE, color: 'var(--muted)', margin: '0 0 40px' }}>
          Test the app the way a user reaches it, through the client, not only the server on its own. One end-to-end test of create, edit and delete would have caught the 401. In the pipeline, I would only roll back when the deploy stage has run, since a failed test still triggers a redeploy when nothing new was shipped. I would also pass credentials to shell steps in single-quoted strings, so Groovy does not paste them into the command.
        </p>

        {/* Stack */}
        <div className="section-label" style={{ fontFamily: MONO }}>Stack</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 40 }}>
          {STACK.map(([label, items]) => (
            <div key={label} style={{ display: 'flex', gap: 12, alignItems: 'baseline' }}>
              <span style={{ fontFamily: MONO, fontSize: 'var(--text-xs)', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em', width: 80, flexShrink: 0 }}>{label}</span>
              <span style={{ fontFamily: MONO, fontSize: 'var(--text-xs)', color: 'var(--fg-dim)', lineHeight: 1.6 }}>{items}</span>
            </div>
          ))}
        </div>

        {/* Footer actions */}
        <div style={{ display: 'flex', gap: 8, paddingTop: 20, flexWrap: 'wrap' }}>
          <a href="https://github.com/clupai8o0/notes-app" target="_blank" rel="noopener noreferrer" className="btn" style={{ fontFamily: MONO }}><Icon name="github" size={12} /> source</a>
          <Link href="/projects" className="btn btn-ghost" style={{ fontFamily: MONO }}>← back to projects</Link>
        </div>

      </div>
    </PageShell>
  )
}
