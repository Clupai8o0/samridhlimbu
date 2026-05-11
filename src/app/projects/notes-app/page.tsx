import Link from 'next/link'
import { PageShell } from '@/components/page-shell'
import { Icon } from '@/components/icons'
import { CodeBlock } from '@/components/code-block'

const MONO = '"JetBrains Mono", var(--font-mono), monospace'
const SANS = 'Inter, var(--font-inter), sans-serif'
const DISPLAY = 'Manrope, var(--font-manrope), sans-serif'
const GREEN = '#4ade80'

const TIMELINE = [
  { date: '2025', title: 'App scaffold', body: 'Next.js 15 (App Router, React 19, Tailwind 4, Radix UI) on the client; Express 5 + Mongoose on the server. JWT cookies with bcrypt, Next.js middleware guards routes, API routes proxy to the Express server at /server/api/*.' },
  { date: '2025', title: 'Containerisation', body: 'Per-app Dockerfiles (node:22-slim) and three Compose files — base, dev override, and prod. Prod stack adds Prometheus, Grafana, Node Exporter, and Alertmanager on a shared bridge network.' },
  { date: '2025', title: 'Jenkins pipeline', body: '10-stage declarative pipeline: lint+test (server, then client) → build+push versioned Docker images → SonarCloud → Snyk → auto release tagging (npm version + git tag) → manual approval → SSH deploy via docker-compose → smoke test → Prometheus target check. Auto-rollback to last good build on failure.' },
  { date: '2025', title: 'Observability stack', body: 'express-prometheus-middleware exposes /server/metrics; Prometheus scrapes app + Node Exporter; Grafana dashboards; Alertmanager for thresholds. The post-deploy stage validates the notes-app target is up before the pipeline reports success.', current: true },
]

const DECISIONS = [
  ['client + server split', 'monolith', 'Next.js renders pages and exposes API routes that proxy to a separate Express server. Independently testable, independently deployable, and the split maps cleanly to how Jenkins stages each side.'],
  ['jenkins declarative pipeline', 'github actions', 'SIT assessment context: Jenkins makes CI/CD internals visible. Each stage is explicit in Blue Ocean; each failure is isolated with its own log; manual approval before prod deploy is a first-class gate.'],
  ['sonarcloud + snyk in-pipeline', 'post-deploy scanning', 'Quality and security gates run before deploy. Snyk scans dependencies on both apps; SonarCloud runs a full quality scan. A failed gate blocks the pipeline — not a post-incident cleanup task.'],
  ['smoke test + target check', 'deploy-and-pray', 'After SSH deploy, the pipeline hits /server/ping and verifies the notes-app Prometheus target is active. If either fails — or any earlier stage does — the post block rolls back to the last successful build automatically.'],
  ['prometheus + grafana', 'logs-only observability', 'Metrics are queryable; logs are not. You can correlate request rate with CPU within the same time window — impossible with grep alone.'],
]

const PIPELINE_LINES = [
  `<span style="color:#c084fc">pipeline</span> {`,
  `  <span style="color:#60a5fa">stages</span> {`,
  `    <span style="color:#60a5fa">stage</span>(<span style="color:#86efac">'Lint & Test (server, client)'</span>) { ... }`,
  `    <span style="color:#60a5fa">stage</span>(<span style="color:#86efac">'Build & Push Docker Images'</span>)  { ... }`,
  `    <span style="color:#60a5fa">stage</span>(<span style="color:#86efac">'Quality: SonarCloud'</span>)         { ... }`,
  `    <span style="color:#60a5fa">stage</span>(<span style="color:#86efac">'Security: Snyk'</span>)             { ... }`,
  `    <span style="color:#60a5fa">stage</span>(<span style="color:#86efac">'Release Tagging'</span>)            { ... }`,
  `    <span style="color:#60a5fa">stage</span>(<span style="color:#86efac">'Deploy to Production (SSH → EC2)'</span>) {`,
  `      <span style="color:#60a5fa">input</span> <span style="color:#86efac">'Deploy to Production?'</span>`,
  `    }`,
  `    <span style="color:#60a5fa">stage</span>(<span style="color:#86efac">'Smoke Test (/server/ping)'</span>)   { ... }`,
  `    <span style="color:#60a5fa">stage</span>(<span style="color:#86efac">'Monitoring & Alerts'</span>)        { ... }`,
  `  }`,
  `  <span style="color:#60a5fa">post</span> { <span style="color:#60a5fa">failure</span> { <span style="color:#94a3b8">/* rollback to last good build */</span> } }`,
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
            Full-stack notes app — Next.js client, Express + MongoDB server — wrapped in a 10-stage Jenkins pipeline that runs lint, tests, SonarCloud, Snyk, release tagging, manual-approval SSH deploy to AWS EC2, smoke test, and Prometheus target check, with auto-rollback on failure. The pipeline is the product.
          </p>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            <a href="https://github.com/clupai8o0/notes-app" target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ fontFamily: MONO, fontSize: 10 }}><Icon name="github" size={11} /> github</a>
          </div>
        </div>

        {/* Metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', marginBottom: 28 }}>
          {[
            { k: 'pipeline stages', v: '10' },
            { k: 'quality gates', v: '2' },
            { k: 'auto-rollback', v: 'on' },
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
            Built to demonstrate end-to-end DevOps practice. The app itself is deliberately simple — register/login with JWT cookies, notes CRUD in MongoDB, Next.js middleware guarding routes — because the point is the pipeline. Every commit moves through lint, tests, versioned Docker builds, SonarCloud, Snyk, automated release tagging, a manual approval gate, SSH deploy via docker-compose to AWS EC2, a /server/ping smoke test, and a post-deploy Prometheus target check. If any stage fails, the post block rolls back to the last successful build.
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
          Jenkins Declarative Pipeline. SonarCloud runs static analysis on both apps; Snyk scans dependencies on both apps. Release tagging bumps package.json versions and pushes a git tag automatically. Deploy waits on a manual approval input, then ssh-pulls the versioned images and runs docker-compose on EC2.
        </p>

        {/* Stack */}
        <div className="section-label" style={{ fontFamily: MONO }}>Stack</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 28 }}>
          {[
            { label: 'Frontend', items: 'Next.js 15 · React 19 · Tailwind 4 · Radix UI · Lucide' },
            { label: 'Backend', items: 'Express 5 · MongoDB · Mongoose · JWT · bcrypt · express-prometheus-middleware' },
            { label: 'Testing', items: 'Jest + jsdom (client) · ts-jest + MongoMemoryServer (server)' },
            { label: 'CI/CD', items: 'Jenkins · Docker · DockerHub · AWS EC2 · docker-compose' },
            { label: 'Quality', items: 'SonarCloud · Snyk · ESLint' },
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
