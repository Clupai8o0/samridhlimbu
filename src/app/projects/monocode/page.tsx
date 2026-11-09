import type { Metadata } from 'next'
import Link from 'next/link'
import { PageShell } from '@/components/page-shell'
import { pageJsonLd } from '@/lib/seo'
import { PageHeader } from '@/components/page-header'
import { Icon } from '@/components/icons'
import { Shot } from '@/components/case-study/shot'

const DESCRIPTION =
  'My fork of MonoCode, an open-source desktop GUI for coding agents by another developer. I added 50 features on top of it, from session clean-up to a games panel, and keep it merged with upstream through an updater that has an agent fix conflicts.'

export const metadata: Metadata = {
  title: 'MonoCode fork · features on top of a coding-agent GUI',
  description: DESCRIPTION,
  alternates: { canonical: '/projects/monocode' },
  openGraph: {
    type: 'article',
    url: '/projects/monocode',
    title: 'MonoCode fork · features on top of a coding-agent GUI · Samridh Limbu',
    description: DESCRIPTION,
    images: [{ url: '/projects/monocode/hero.webp', width: 2880, height: 1800, alt: 'The MonoCode workspace on sample data: Monos and 16 sample projects in the sidebar, a Codex session in the middle and three question pop-ups on the right' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MonoCode fork · features on top of a coding-agent GUI · Samridh Limbu',
    description: DESCRIPTION,
    images: [{ url: '/projects/monocode/hero.webp', alt: 'The MonoCode workspace on sample data: Monos and 16 sample projects in the sidebar, a Codex session in the middle and three question pop-ups on the right' }],
  },
}

const MONO = '"JetBrains Mono", var(--font-mono), monospace'
const SANS = 'Inter, var(--font-inter), sans-serif'
const DISPLAY = 'Manrope, var(--font-manrope), sans-serif'
const GREEN = 'var(--term-green)'

const PROSE = { fontFamily: SANS, fontSize: 15, color: 'var(--fg-dim)', lineHeight: 1.65, maxWidth: 640 }

const METRICS = [
  { k: 'my commits on my branch', v: '578' },
  { k: 'features in the fork README', v: '50' },
  { k: 'upstream merges on my branch', v: '26' },
  { k: 'test files under src/fork', v: '145' },
]

const MINE: [string, string][] = [
  ['Clean up sessions', 'one panel over every project: Safe to close, Handover, Idle 7+ days or Everything; archive with undo, or delete after a confirm'],
  ['Close badges', 'each session shows Safe, Handover or Not safe, read from the close line of its last reply'],
  ['Close to free memory', 'stops an idle session\'s agent CLI and drops it from memory; the next message resumes it'],
  ['Workspace windows', 'named workspaces, one OS window each, with their own saved layout'],
  ['Footer bundle', 'Messages, Machines (lab, stacks, memory), More (games, sounds) and Terminal, at fixed widths'],
  ['Games panel', 'a panel to play in while agents run; game code loads on demand and the score lives outside React'],
  ['File previews', 'HTML, PDF, CSV and Excel, SVG, notebooks, LaTeX and Office files open in the file pane'],
  ['fork/update.sh', 'merges upstream into my branch, has an agent fix conflicts or a broken build, tests, builds and stages the app'],
]

const DECISIONS = [
  ['fork code in its own folders', 'editing upstream files in place', 'Most of what I added lives in src/fork and src-tauri/src/fork_*.rs. Only I commit there, so upstream changes never conflict with those files. Upstream files still need hooks into the fork code, and big shared files such as App.tsx carry a lot of them.'],
  ['hide upstream features', 'delete them', 'I switched off Inbox, Notes, Automations and some providers with flags in one file. Deleting them would turn every later upstream change to those files into a conflict.'],
  ['off under vitest', 'rewriting upstream tests to match', 'Twelve fork features switch themselves off when Vitest runs, so upstream\'s tests see the app they were written for. Some upstream tests still needed edits for changes I made outside src/fork.'],
  ['an agent resolves the merge', 'merging by hand every time', 'Upstream moves fast: 651 commits in my first month. The updater lets a Claude agent fix conflicts in a private worktree, then runs the type check, tests and a full app build. If any step fails, my branch stays where it was.'],
  ['archive with undo', 'one delete button', 'The clean-up panel archives by default and keeps sessions under Archived in each project. Delete is permanent, so it asks first and names any rows that are open, unread or marked Not safe.'],
]

const TIMELINE = [
  { date: '7 Oct 2026', title: 'Fork', body: 'Forked hardbeat920/monocode and wrote fork/update.sh on the first day, so upstream changes would keep arriving.' },
  { date: '10–24 Oct 2026', title: 'Daily driver', body: 'Close badges, workspace windows, PDF, table and Office previews, and hiding the upstream features I do not use. The updater merged upstream batches of 67, 74 and 115 commits.' },
  { date: '26–29 Oct 2026', title: 'Largest merge', body: 'Notifications and closing idle sessions to free memory. On 29 October I merged 217 upstream commits at once, outside the updater, including upstream\'s work on a native GPUI version of the app.' },
  { date: '31 Oct–3 Nov 2026', title: 'Games and clean-up', body: 'The games panel and the session clean-up panel. On 3 November I finished a 63-commit upstream merge by hand (166 files) after the updater\'s agent had stopped on it three times.' },
  { date: 'Nov 2026', title: 'Now', body: 'Work goes on in the mine branch. The latest automatic merge, 11 commits on 9 November, failed its tests, so the updater kept the build I already had.', current: true },
]

const STACK: [string, string[]][] = [
  ['App', ['Tauri 2', 'Rust', 'React 19', 'TypeScript', 'Vite', 'Tailwind CSS']],
  ['Tests', ['Vitest', 'Playwright (Chromium and WebKit)']],
  ['Updater', ['bash', 'git worktrees', 'Claude Code headless']],
]

export default function MonocodePage() {
  return (
    <PageShell jsonLd={pageJsonLd(metadata)}>
      <div data-stagger style={{ maxWidth: 720, margin: '0 auto', padding: '36px 20px' }}>

        <PageHeader />

        {/* breadcrumb */}
        <div data-stagger-item style={{ fontFamily: MONO, fontSize: 'var(--text-xs)', color: 'var(--muted)', marginBottom: 16 }}>
          <span style={{ color: 'var(--accent)' }}>❯</span>{' '}
          cd <Link href="/projects" style={{ color: 'var(--fg)', textDecoration: 'none' }}>projects</Link>/monocode
        </div>

        {/* Banner */}
        <div data-stagger-item style={{ padding: '24px 0', marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', columnGap: 12, rowGap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
            <h1 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 'var(--text-2xl)', lineHeight: 1.1, margin: 0, letterSpacing: '-0.025em', color: 'var(--fg)' }}>MonoCode fork</h1>
            <span className="pill" style={{ fontFamily: MONO }}>personal build · open-source fork</span>
          </div>
          <p style={{ ...PROSE, fontSize: 'var(--text-base)', margin: '0 0 12px' }}>
            MonoCode is a desktop app for running coding agents like Claude Code and Codex side by side. It was written by another developer, who publishes it as hardbeat920/monocode under the MIT licence. I did not build MonoCode. I use it every day, and my fork adds the features I wanted on top.
          </p>
          <p style={{ ...PROSE, fontSize: 'var(--text-base)', margin: '0 0 18px' }}>
            None of my changes are in upstream: I have opened no pull requests there. They live in my public fork, on the mine branch, and run as my own build on my Mac.
          </p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <a href="https://github.com/Clupai8o0/monocode/tree/mine" target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ fontFamily: MONO }}><Icon name="github" size={12} /> my fork</a>
            <a href="https://github.com/hardbeat920/monocode" target="_blank" rel="noopener noreferrer" className="btn" style={{ fontFamily: MONO }}><Icon name="external" size={12} /> upstream MonoCode</a>
          </div>
        </div>

        {/* Hero shot */}
        <div data-stagger-item style={{ marginBottom: 24 }}>
          <Shot
            src="/projects/monocode/hero.webp"
            alt="The MonoCode workspace on sample data: Monos and 16 sample projects in the sidebar with running and waiting counts, a Codex session in the middle, three question pop-ups on the right, and the usage, Messages, Machines, More and Terminal footer"
            width={2880}
            height={1800}
            caption="The whole app running in a browser on the repo's own test fixture, with fake projects and sample usage. Every screen on this page comes from a local copy on made-up data, with no agent and no account connected. The sample-data bar at the top right belongs to the fixture."
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

        {/* Problem */}
        <div style={{ marginBottom: 40 }}>
          <div className="section-label" style={{ fontFamily: MONO }}>Why a fork</div>
          <p style={{ ...PROSE, margin: 0 }}>
            I keep many agent sessions open across several projects. MonoCode already gave me tabs, a composer and every agent in one window. What I still wanted was tied to my own setup: knowing which sessions were safe to close, freeing memory, seeing which session was editing which file, and a few things just for me. A fork let me add them without waiting on anyone, as long as I could keep taking upstream&apos;s changes.
          </p>
        </div>

        {/* What I added */}
        <div className="section-label" style={{ fontFamily: MONO }}>What I added</div>
        <div style={{ fontFamily: MONO, fontSize: 'var(--text-xs)', background: 'var(--bg-2)', borderRadius: 2, padding: '14px 16px', marginBottom: 12, lineHeight: 1.8 }}>
          {MINE.map(([part, desc]) => (
            <div key={part} style={{ display: 'flex', flexWrap: 'wrap', columnGap: 16 }}>
              <span style={{ color: 'var(--accent)', width: 170, flexShrink: 0 }}>{part}</span>
              <span style={{ color: 'var(--muted)', flex: '1 1 200px' }}>{desc}</span>
            </div>
          ))}
        </div>
        <p style={{ ...PROSE, color: 'var(--muted)', fontSize: 'var(--text-sm)', margin: '0 0 40px' }}>
          Eight of the 50 rows in the fork&apos;s README. Everything else in the app, including the workspace, the composer and most of the agent providers, is upstream&apos;s work.
        </p>

        {/* Clip */}
        <div data-reveal style={{ maxWidth: 560, margin: '0 auto 40px' }}>
          <div style={{ borderRadius: 2, overflow: 'hidden', background: 'var(--bg-2)' }}>
            <video
              src="/projects/monocode/demo.mp4"
              poster="/projects/monocode/demo-poster.webp"
              controls
              muted
              playsInline
              preload="metadata"
              aria-label="The Clean up sessions panel on sample data: switching between the Safe to close, Handover, Idle 7+ days and Everything filters, then archiving four sessions"
              style={{ width: '100%', height: 'auto', aspectRatio: '632 / 666', objectFit: 'contain', display: 'block' }}
            />
          </div>
          <div style={{ fontFamily: MONO, fontSize: 'var(--text-xs)', color: 'var(--muted)', marginTop: 8 }}>Clean up sessions: step through the filters, then archive the four ticked sessions. The session open in a tab stays unticked.</div>
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

        {/* Cleanup + games shots */}
        <div data-reveal style={{ maxWidth: 560, margin: '0 auto 32px' }}>
          <Shot
            src="/projects/monocode/cleanup.webp"
            alt="The Clean up sessions panel: filters Safe to close 5, Handover 2, Idle 7+ days 2 and Everything 10; sample sessions grouped by project with Safe badges and ages; Delete 4, Cancel and Archive 4 buttons"
            width={1150}
            height={1260}
            caption="The clean-up panel on its default filter. Sample sessions; the one marked Open is in a tab, so it starts unticked."
          />
        </div>
        <div data-reveal style={{ maxWidth: 560, margin: '0 auto 40px' }}>
          <Shot
            src="/projects/monocode/games.webp"
            alt="The games panel open on a falling-blocks game, with a difficulty picker, score and best, and pause, restart, side, expand and minimise buttons"
            width={1230}
            height={1110}
            caption="The games panel, opened from the footer, on the repo's browser fixture."
          />
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

        {/* Credit */}
        <div className="section-label" style={{ fontFamily: MONO }}>Credit</div>
        <p style={{ ...PROSE, color: 'var(--muted)', margin: '0 0 12px' }}>
          MonoCode is the work of its author, hardbeat920 on GitHub, and its contributors, under the MIT licence. Their copyright notice stays in my fork. Between 7 October and 9 November upstream had 480 commits from its author and 171 from 41 other contributors. My part is the fork work listed above and keeping it merged. Most of my commits were written with coding agents (mainly Claude, some Cursor) that I directed, and I checked and tested what they wrote.
        </p>
        <p style={{ ...PROSE, color: 'var(--muted)', margin: '0 0 40px' }}>
          I wrote up how the fork keeps up with upstream in <Link href="/writing/keeping-a-fork-in-step" style={{ color: 'var(--accent)' }}>a post</Link>.
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
          <a href="https://github.com/Clupai8o0/monocode/tree/mine" target="_blank" rel="noopener noreferrer" className="btn" style={{ fontFamily: MONO }}><Icon name="github" size={12} /> my fork</a>
          <a href="https://github.com/hardbeat920/monocode" target="_blank" rel="noopener noreferrer" className="btn" style={{ fontFamily: MONO }}><Icon name="external" size={12} /> upstream</a>
          <Link href="/projects" className="btn btn-ghost" style={{ fontFamily: MONO }}>← back to projects</Link>
        </div>

      </div>
    </PageShell>
  )
}
