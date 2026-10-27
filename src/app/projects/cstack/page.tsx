import type { Metadata } from 'next'
import Link from 'next/link'
import { PageShell } from '@/components/page-shell'
import { PageHeader } from '@/components/page-header'
import { Icon } from '@/components/icons'

const DESCRIPTION =
  'cstack is one shared layer of rules, hooks and skills for six coding agents, from Claude Code and Codex to DeepSeek and Grok Build. A model-routing benchmark cut the cost per task 2.7x ($0.33 vs $0.90) with no meaningful loss in quality. Open source, MIT.'

export const metadata: Metadata = {
  title: 'cstack · shared layer for coding agents',
  description: DESCRIPTION,
  alternates: { canonical: '/projects/cstack' },
  openGraph: {
    type: 'article',
    url: '/projects/cstack',
    title: 'cstack · Samridh Limbu',
    description: DESCRIPTION,
    images: [{ url: '/projects/cstack/cover.webp', width: 2400, height: 1500, alt: 'cstack: one rules, hooks and skills layer for Claude Code, Codex, OpenCode, DeepSeek, Kimi and Grok Build' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'cstack · Samridh Limbu',
    description: DESCRIPTION,
    images: ['/projects/cstack/cover.webp'],
  },
}

const MONO = '"JetBrains Mono", var(--font-mono), monospace'
const SANS = 'Inter, var(--font-inter), sans-serif'
const DISPLAY = 'Manrope, var(--font-manrope), sans-serif'
const GREEN = 'var(--term-green)'

const PROSE = { fontFamily: SANS, fontSize: 15, color: 'var(--fg-dim)', lineHeight: 1.65, maxWidth: 640 }

const METRICS = [
  { k: 'coding agents, one layer', v: '6' },
  { k: 'cheaper per task than xhigh effort', v: '2.7×' },
  { k: 'licence', v: 'MIT' },
]

const SHAPE: [string, string][] = [
  ['rules/', 'one source rules file; each agent gets its copy from it'],
  ['hooks/', 'claims, queues, guardrails, memory recall, alerts'],
  ['skills/_core/', 'token economy, tool scoping, loaded on demand'],
  ['sync-agents.py', 'writes each agent its AGENTS.md, skills and hook config'],
  ['second_opinion.py', 'calls outside models, sandboxed and policy-checked'],
  ['bakeoff/', 'run the same model bake-off on your own repo'],
]

const DECISIONS = [
  ['measured routing', 'one model for everything', 'Subagents run Opus at low effort, always pinned. In the routing benchmark it cost $0.33 a task against $0.90 at extra-high effort, with no meaningful gain from the extra spend. Coding that a test can judge goes to cheaper models. The routing rules come from benchmark and bake-off runs; the README marks the few numbers that are estimates.'],
  ['reviews on the diff', 'a reviewer that explores the repo', 'Every code change gets an outside review before it counts as done. The script sends only the git diff with a findings-only brief, so the reviewer stops wandering the repo and almost no Claude usage is spent on it.'],
  ['file claims between sessions', 'hoping two sessions never collide', 'Several agent sessions often work on one repo at once. A hook claims each file a session edits and blocks a second session from editing it in the same worktree. Status notes and their history show what was already done or tried.'],
  ['hooks that fail open', 'hooks that can block work', 'A broken script never stops a session. The cost is that a fresh install has to be checked by hand, which the README says plainly.'],
]

const STACK: [string, string[]][] = [
  ['Agents', ['Claude Code', 'Codex', 'OpenCode', 'DeepSeek', 'Kimi', 'Grok Build']],
  ['Code', ['Python', 'Shell']],
  ['Infra', ['macOS launchd', 'sandbox-exec', 'kitty']],
]

export default function CstackPage() {
  return (
    <PageShell>
      <div data-stagger style={{ maxWidth: 720, margin: '0 auto', padding: '36px 20px' }}>

        <PageHeader />

        {/* breadcrumb */}
        <div data-stagger-item style={{ fontFamily: MONO, fontSize: 'var(--text-xs)', color: 'var(--muted)', marginBottom: 16 }}>
          <span style={{ color: 'var(--accent)' }}>❯</span>{' '}
          cd <Link href="/projects" style={{ color: 'var(--fg)', textDecoration: 'none' }}>projects</Link>/cstack
        </div>

        {/* Banner */}
        <div data-stagger-item style={{ padding: '24px 0', marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', columnGap: 12, rowGap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
            <h1 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 'var(--text-2xl)', lineHeight: 1.1, margin: 0, letterSpacing: '-0.025em', color: 'var(--fg)' }}>cstack</h1>
            <span className="pill" style={{ fontFamily: MONO }}>open source · MIT</span>
          </div>
          <p style={{ ...PROSE, fontSize: 'var(--text-base)', margin: '0 0 18px' }}>
            One set of rules, hooks and skills shared by six coding agents: Claude Code, Codex, OpenCode, DeepSeek, Kimi and Grok Build. It is the setup I run every day, and which model does which job is decided by benchmarks, not habit.
          </p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <a href="https://github.com/Clupai8o0/cstack" target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ fontFamily: MONO }}><Icon name="github" size={12} /> Clupai8o0/cstack</a>
          </div>
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
          <div className="section-label" style={{ fontFamily: MONO }}>The problem</div>
          <p style={{ ...PROSE, margin: 0 }}>
            I run several agent sessions on the same repos at once, across more than one coding agent. Each tool wants its own rules file, its own skills and its own hooks, and several copies kept in step by hand drift apart. Sessions could edit the same file without knowing about each other. And subagents inherited whatever effort the session ran at, so tokens went on the most expensive setting without anyone deciding they should.
          </p>
        </div>

        {/* Solution */}
        <div style={{ marginBottom: 40 }}>
          <div className="section-label" style={{ fontFamily: MONO }}>The fix</div>
          <p style={{ ...PROSE, margin: 0 }}>
            cstack keeps one copy of everything. A sync script writes each agent its own rules file, links the same skills and points every agent at the same hooks, so a guardrail learned in one session applies in all of them. Then I measured: a routing benchmark built from real work with planted bugs, and a bake-off on real commits from one app. The routing rules in the README come from those runs.
          </p>
        </div>

        {/* System shape */}
        <div className="section-label" style={{ fontFamily: MONO }}>System shape</div>
        <div style={{ fontFamily: MONO, fontSize: 'var(--text-xs)', background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 2, padding: '14px 16px', marginBottom: 14, lineHeight: 1.8 }}>
          {SHAPE.map(([part, desc]) => (
            <div key={part} style={{ display: 'flex', flexWrap: 'wrap', columnGap: 16 }}>
              <span style={{ color: 'var(--accent)', width: 150, flexShrink: 0 }}>{part}</span>
              <span style={{ color: 'var(--muted)', flex: '1 1 200px' }}>{desc}</span>
            </div>
          ))}
        </div>
        <p style={{ ...PROSE, color: 'var(--muted)', margin: '0 0 40px' }}>
          The rule that holds it together: rules, skills and hooks live once, and every agent gets them by link or by generated file. Changing a rule means changing one file and running the sync.
        </p>

        {/* Key decisions */}
        <div className="section-label" style={{ fontFamily: MONO }}>Engineering details</div>
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
          <a href="https://github.com/Clupai8o0/cstack" target="_blank" rel="noopener noreferrer" className="btn" style={{ fontFamily: MONO }}><Icon name="github" size={12} /> source</a>
          <Link href="/projects" className="btn btn-ghost" style={{ fontFamily: MONO }}>← back to projects</Link>
        </div>

      </div>
    </PageShell>
  )
}
