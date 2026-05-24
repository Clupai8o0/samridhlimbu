import Link from 'next/link'
import { PageShell } from '@/components/page-shell'
import { PageHeader } from '@/components/page-header'
import { Icon } from '@/components/icons'
import { PROJECTS } from '@/lib/data'

const MONO = '"JetBrains Mono", var(--font-mono), monospace'
const SANS = 'Inter, var(--font-inter), sans-serif'
const DISPLAY = 'Manrope, var(--font-manrope), sans-serif'
const GREEN = '#4ade80'

const TIMELINE = [
  {
    date: 'Apr 2026',
    title: 'v0.1.0 — first version',
    body: 'Built with Tauri (Rust + web tech). Cross-platform, ran on Windows. The core mechanic was already there: a blocking window that would not close until you read your rules, ticked the box, and named one action.',
  },
  {
    date: 'May 2026',
    title: 'Decision: full native rewrite',
    body: 'Switched to macOS full-time. Tauri felt wrong on Mac — not enough to be unusable, enough to be noticeable every morning. Started the Swift 6 rewrite.',
    highlight: true,
  },
  {
    date: 'May 2026',
    title: 'v0.2.0 — native Swift',
    body: 'Full rewrite in Swift 6 + SwiftUI. LaunchAgent for configurable cadence (every login, hourly, daily, weekly). Single-instance lock. install.sh that builds a release binary, packages it into an .app, and installs to ~/Applications. No Xcode needed by the user.',
  },
  {
    date: 'May 2026',
    title: 'v0.3.0 — cloud sync · current',
    body: 'Next.js web editor live at force.clupai.com. Edit contract, quotes, daily goals, and reflection from any device — changes sync to your Mac on next launch. Supabase-backed with RLS and light/dark mode. Opt-in: still runs fully local with no account. Hosted option or bring-your-own Supabase.',
    current: true,
  },
]

const DECISIONS = [
  [
    'swift 6 + swiftui',
    'tauri',
    'Native feel matters when the app is the first thing you see every morning. Tauri is great cross-platform but adds friction on Mac. SwiftUI renders exactly like the OS expects. The binary is also ~3 MB vs ~30 MB.',
  ],
  [
    'launchagent',
    'login item',
    'Login items only fire on login. A LaunchAgent can re-lock on any cadence — every hour, every 12 hours, once a day. One plist, full control, no proprietary daemon.',
  ],
  [
    'opt-in sync · supabase',
    'always-on cloud',
    'Your personal rules are not data that should be stored on a server by default. Sync is opt-in: run fully local with no account, or sign in to force.clupai.com to sync contract, quotes, goals, and reflection. Acknowledgements and history always stay on-device. Last-edit-wins — no conflict resolution needed.',
  ],
  [
    'ad-hoc signed',
    'notarized',
    'Notarization requires an Apple Developer account. Ad-hoc signing works for local builds and keeps the install path simple: clone, run install.sh, done. Building from source on the target machine avoids Gatekeeper warnings.',
  ],
]

export default function AcknowledgementForcePage() {
  const project = PROJECTS.find(p => p.slug === 'acknowledgement-force')!

  return (
    <PageShell>
      <div data-stagger style={{ maxWidth: 720, margin: '0 auto', padding: '36px 28px' }}>

        <PageHeader />

        {/* breadcrumb */}
        <div data-stagger-item style={{ fontFamily: MONO, fontSize: 10, color: 'var(--muted-2)', marginBottom: 14 }}>
          <span style={{ color: 'var(--accent)' }}>❯</span>{' '}
          cd <Link href="/projects" style={{ color: 'var(--fg)', textDecoration: 'none' }}>projects</Link>/acknowledgement-force
        </div>

        {/* Banner */}
        <div data-stagger-item style={{ padding: '22px 0', borderTop: '1px solid var(--accent)', borderBottom: '1px solid var(--border)', marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 8, flexWrap: 'wrap' }}>
            <h1 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 36, margin: 0, letterSpacing: -0.025, color: 'var(--fg)' }}>Acknowledgement Force</h1>
            <span className="pill" style={{ color: 'var(--accent)', borderColor: 'rgba(77,163,255,0.3)', fontFamily: MONO }}>● open source · v0.3.0</span>
          </div>
          <p style={{ fontFamily: SANS, fontSize: 14, color: 'var(--fg-dim)', lineHeight: 1.55, maxWidth: 580, margin: '0 0 16px' }}>
            A macOS app that blocks your screen until you read your personal rules, tick the box, and name your single highest-leverage action for the day. Most goal failures are identity failures — not laziness. The rule you set last week vanishes in moments of stress. This makes forgetting structurally impossible.
          </p>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            <a href="https://github.com/clupai8o0/force" target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ fontFamily: MONO, fontSize: 10 }}><Icon name="github" size={11} /> clupai8o0/force</a>
            <a href="https://force.clupai.com" target="_blank" rel="noopener noreferrer" className="btn btn-ghost" style={{ fontFamily: MONO, fontSize: 10 }}>force.clupai.com →</a>
          </div>
        </div>

        {/* Hero video */}
        <div data-stagger-item style={{ marginBottom: 28, border: '1px solid var(--border)', overflow: 'hidden', background: 'var(--bg-2)' }}>
          <video
            src="/projects/acknowledgement-force/demo.mp4"
            autoPlay
            muted
            loop
            playsInline
            style={{ width: '100%', display: 'block' }}
          />
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
            Built solo, 2026. The premise: you know what you should do. You built the habit, set the rule, wrote the intention. Then a stressful week hits and the rule is nowhere near the surface. Acknowledgement Force is not a productivity app — it is an identity reinforcement tool. It physically blocks your computer at the start of each day until you re-commit to who you decided to be. The mechanism is simple: repetition moves rules from working memory to identity. You cannot skip the ritual.
          </p>
        </div>

        {/* Timeline */}
        <div className="section-label" style={{ fontFamily: MONO }}>Timeline</div>
        <div style={{ position: 'relative', paddingLeft: 22, marginBottom: 28 }}>
          <div style={{ position: 'absolute', left: 5, top: 6, bottom: 6, width: 1, background: 'var(--border)' }} />
          {TIMELINE.map((e, i) => (
            <div key={i} style={{ position: 'relative', paddingBottom: 18 }}>
              <div style={{ position: 'absolute', left: -22, top: 4, width: 11, height: 11, borderRadius: 6, background: e.current ? 'var(--accent)' : 'var(--bg)', border: `1.5px solid ${e.highlight ? 'var(--accent)' : e.current ? 'var(--accent)' : 'var(--muted-2)'}` }} />
              <div style={{ fontFamily: MONO, fontSize: 9.5, color: e.highlight ? 'var(--accent)' : 'var(--muted-2)', marginBottom: 2, textTransform: 'uppercase', letterSpacing: 0.1 }}>{e.date}</div>
              <div style={{ fontFamily: MONO, fontSize: 12.5, color: 'var(--fg)', marginBottom: 3 }}>{e.title}</div>
              <div style={{ fontFamily: SANS, fontSize: 11.5, color: 'var(--muted)', lineHeight: 1.55, maxWidth: 460 }}>{e.body}</div>
            </div>
          ))}
        </div>

        {/* Key decisions */}
        <div className="section-label" style={{ fontFamily: MONO }}>Key decisions</div>
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
            { label: 'Language', items: 'Swift 6' },
            { label: 'UI', items: 'SwiftUI' },
            { label: 'Packaging', items: 'native .app bundle · ad-hoc signed · install.sh' },
            { label: 'Auto-launch', items: 'user LaunchAgent (~/Library/LaunchAgents/)' },
            { label: 'Storage', items: '~/Library/Application Support/Force/acknowledgements.log' },
            { label: 'Platform', items: 'macOS 14 Sonoma+ · Apple Silicon + Intel' },
            { label: 'Web editor', items: 'Next.js · force.clupai.com' },
            { label: 'Sync', items: 'Supabase · RLS · opt-in · self-hostable' },
          ].map(({ label, items }) => (
            <div key={label} style={{ display: 'flex', gap: 12, alignItems: 'baseline' }}>
              <span style={{ fontFamily: MONO, fontSize: 9, color: 'var(--muted-2)', textTransform: 'uppercase', letterSpacing: 0.08, width: 80, flexShrink: 0 }}>{label}</span>
              <span style={{ fontFamily: MONO, fontSize: 11, color: 'var(--muted)' }}>{items}</span>
            </div>
          ))}
        </div>

        {/* Footer actions */}
        <div style={{ display: 'flex', gap: 8, paddingTop: 18, borderTop: '1px solid var(--border)', flexWrap: 'wrap' }}>
          <a href="https://github.com/clupai8o0/force" target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ fontFamily: MONO, fontSize: 10 }}><Icon name="github" size={11} /> source</a>
          <a href="https://force.clupai.com" target="_blank" rel="noopener noreferrer" className="btn btn-ghost" style={{ fontFamily: MONO, fontSize: 10 }}>force.clupai.com →</a>
          <Link href="/projects" className="btn btn-ghost" style={{ fontFamily: MONO, fontSize: 10 }}>← back to projects</Link>
        </div>

      </div>
    </PageShell>
  )
}
