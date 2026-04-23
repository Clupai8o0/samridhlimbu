import Link from 'next/link'
import { PageShell } from '@/components/page-shell'
import { Icon } from '@/components/icons'
import { CodeBlock } from '@/components/code-block'

const MONO = '"JetBrains Mono", var(--font-mono), monospace'
const SANS = 'Inter, var(--font-inter), sans-serif'
const DISPLAY = 'Manrope, var(--font-manrope), sans-serif'
const GREEN = '#4ade80'

const TIMELINE = [
  { date: '2025', title: 'App scaffold', body: 'Next.js 15 frontend + Express 5 API server. JWT auth with bcrypt, MongoDB for storage. Deliberately simple CRUD — the app is the scaffold, not the point.' },
  { date: '2025', title: 'Containerisation', body: 'Docker Compose for local orchestration. App, API server, MongoDB, and monitoring stack all isolated in named containers with a shared network.' },
  { date: '2025', title: 'Jenkins pipeline', body: 'Declarative pipeline: lint → test → Docker build → push to DockerHub → Snyk security scan → SonarCloud quality gate → SSH deploy to EC2. A failed gate blocks deploy.' },
  { date: '2025', title: 'Observability stack', body: 'Prometheus scrapes app metrics and Node Exporter system metrics. Grafana dashboards for CPU, memory, request rate, and error rate. Alertmanager for threshold notifications.', current: true },
]

const DECISIONS = [
  ['express 5 + next.js 15 split', 'monolith', 'Separate API and frontend processes — independently deployable, independently testable. The split maps cleanly to how Jenkins stages the pipeline.'],
  ['jenkins declarative pipeline', 'github actions', 'SIT assessment context: Jenkins makes CI/CD internals visible. Each stage is explicit in Blue Ocean UI; each failure is isolated with its own log.'],
  ['snyk + sonarcloud in-pipeline', 'post-deploy scanning', 'Security and quality gates run before the SSH deploy stage. A failed scan stops the pipeline — not a post-incident cleanup task.'],
  ['prometheus + grafana', 'logs-only observability', 'Metrics are queryable; logs are not. You can correlate request rate with CPU within the same time window — impossible with grep alone.'],
]

const PIPELINE_LINES = [
  `<span style="color:#c084fc">pipeline</span> {`,
  `  <span style="color:#60a5fa">stages</span> {`,
  `    <span style="color:#60a5fa">stage</span>(<span style="color:#86efac">'Lint & Test'</span>)       { ... }`,
  `    <span style="color:#60a5fa">stage</span>(<span style="color:#86efac">'Docker Build & Push'</span>) { ... }`,
  `    <span style="color:#60a5fa">stage</span>(<span style="color:#86efac">'Security: Snyk'</span>)      { ... }`,
  `    <span style="color:#60a5fa">stage</span>(<span style="color:#86efac">'Quality: SonarCloud'</span>)  { ... }`,
  `    <span style="color:#60a5fa">stage</span>(<span style="color:#86efac">'Deploy via SSH → EC2'</span>) { ... }`,
  `  }`,
  `}`,
]

export default function NotesAppPage() {
  return (
    <PageShell>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '36px 28px' }}>

        {/* breadcrumb */}
        <div style={{ fontFamily: MONO, fontSize: 10, color: 'var(--muted-2)', marginBottom: 14 }}>
          <span style={{ color: 'var(--accent)' }}>❯</span>{' '}
          cd <Link href="/projects" style={{ color: 'var(--fg)', textDecoration: 'none' }}>projects</Link>/notes-app
        </div>

        {/* Banner */}
        <div style={{ padding: '22px 0', borderTop: '1px solid var(--accent)', borderBottom: '1px solid var(--border)', marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 8, flexWrap: 'wrap' }}>
            <h1 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 36, margin: 0, letterSpacing: -0.025, color: 'var(--fg)' }}>notes-app</h1>
            <span className="pill" style={{ color: '#60a5fa', borderColor: 'rgba(96,165,250,0.3)', fontFamily: MONO }}>● CI/CD showcase</span>
          </div>
          <p style={{ fontFamily: SANS, fontSize: 14, color: 'var(--fg-dim)', lineHeight: 1.55, maxWidth: 580, margin: '0 0 16px' }}>
            Production-grade full-stack app with a complete CI/CD pipeline from commit to AWS EC2 — Docker, Jenkins, Snyk, SonarCloud, Prometheus, and Grafana. The pipeline is the product.
          </p>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            <a href="https://github.com/clupai8o0/notes-app" target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ fontFamily: MONO, fontSize: 10 }}><Icon name="github" size={11} /> github</a>
          </div>
        </div>

        {/* Metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', marginBottom: 28 }}>
          {[
            { k: 'pipeline stages', v: '5' },
            { k: 'security gates', v: '2' },
            { k: 'observability', v: 'full' },
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
            Built to demonstrate end-to-end DevOps practice. The app itself is deliberately simple — notes CRUD with JWT auth and MongoDB — because the point is the pipeline, not the product. Jenkins stages every commit through lint, test, build, security scanning, and quality gating before SSH-deploying to AWS EC2. Prometheus and Grafana provide post-deploy observability.
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

        {/* The pipeline */}
        <div className="section-label" style={{ fontFamily: MONO }}>The pipeline</div>
        <div style={{ marginBottom: 12 }}>
          <CodeBlock lines={PIPELINE_LINES} />
        </div>
        <p style={{ fontFamily: SANS, fontSize: 12.5, color: 'var(--muted)', lineHeight: 1.65, marginBottom: 28 }}>
          Jenkins Declarative Pipeline. Snyk scans the built Docker image; SonarCloud runs on source. Both gates can block deploy — quality is not optional in the pipeline.
        </p>

        {/* Stack */}
        <div className="section-label" style={{ fontFamily: MONO }}>Stack</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 28 }}>
          {[
            { label: 'Frontend', items: 'Next.js 15 · React 18' },
            { label: 'Backend', items: 'Express 5 · MongoDB · Mongoose · JWT · bcrypt' },
            { label: 'CI/CD', items: 'Jenkins · Docker · DockerHub · AWS EC2' },
            { label: 'Quality', items: 'Snyk · SonarCloud' },
            { label: 'Observability', items: 'Prometheus · Grafana · Node Exporter · Alertmanager' },
          ].map(({ label, items }) => (
            <div key={label} style={{ display: 'flex', gap: 12, alignItems: 'baseline' }}>
              <span style={{ fontFamily: MONO, fontSize: 9, color: 'var(--muted-2)', textTransform: 'uppercase', letterSpacing: 0.08, width: 80, flexShrink: 0 }}>{label}</span>
              <span style={{ fontFamily: MONO, fontSize: 11, color: 'var(--muted)' }}>{items}</span>
            </div>
          ))}
        </div>

        {/* Footer actions */}
        <div style={{ display: 'flex', gap: 8, paddingTop: 18, borderTop: '1px solid var(--border)', flexWrap: 'wrap' }}>
          <a href="https://github.com/clupai8o0/notes-app" target="_blank" rel="noopener noreferrer" className="btn" style={{ fontFamily: MONO, fontSize: 10 }}><Icon name="github" size={11} /> source</a>
          <Link href="/projects" className="btn btn-ghost" style={{ fontFamily: MONO, fontSize: 10 }}>← back to projects</Link>
        </div>

      </div>
    </PageShell>
  )
}
