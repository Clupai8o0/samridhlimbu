import type { Metadata } from 'next'
import Link from 'next/link'
import { PageShell } from '@/components/page-shell'
import { pageJsonLd } from '@/lib/seo'
import { PageHeader } from '@/components/page-header'
import { Icon } from '@/components/icons'
import { ArticleChart } from '@/components/article-chart'
import type { ChartBlock } from '@/lib/writing'

const DESCRIPTION =
  'cstack is one shared layer of rules, hooks and skills for six coding agents, from Claude Code and Codex to DeepSeek and Grok Build. In a benchmark on Opus 5, subagents at low effort cost 2.7x less per task than at extra-high ($0.33 vs $0.90) with no meaningful loss in score. Open source, MIT.'

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

const WRITE_UP = '/writing/cstack-one-layer-six-agents'

const METRICS = [
  { k: 'coding agents, one layer', v: '6' },
  { k: 'cheaper per task, low vs extra-high effort', v: '2.7×' },
  { k: 'hooks shared by every agent', v: '12' },
  { k: 'active guardrails, 27 Oct 2026', v: '76' },
  { k: 'lines of Python', v: '9,607' },
  { k: 'licence', v: 'MIT' },
]

const SHAPE: [string, string][] = [
  ['rules/', 'the one rules file, linked or turned into each agent\'s AGENTS.md'],
  ['hooks/', 'claims, queues, guardrails, memory recall, alerts'],
  ['skills/_core/', 'token economy, tool scoping, and a loader for the rest'],
  ['scripts/sync-agents.py', 'writes the other agents their AGENTS.md, skills and hooks'],
  ['scripts/second_opinion.py', 'calls outside models, sandboxed and policy-checked'],
  ['bakeoff/', 'run the same model bake-off on your own repo'],
]

type Figure = { src: string; alt: string; caption: string; width?: number; height?: number }

// phone version of each diagram, drawn portrait so its text stays readable
const mobile = (src: string) => src.replace(/\.svg$/, '-m.svg')

const DECISIONS: { a: string; b: string; note: string; figure?: Figure }[] = [
  {
    a: 'measured routing',
    b: 'one model for everything',
    note: 'Subagents run Opus at low effort, always pinned. In the benchmark, Opus 5 at low effort cost $0.33 a task instead of $0.90 at extra-high, with no meaningful loss in score. Coding that a test can judge goes to cheaper models, and outside models only see folders their policy allows. Most rules in the table come from measured runs; the README marks the few that are estimates.',
    figure: {
      src: '/writing/cstack/routing.svg',
      alt: 'Which model and effort each kind of job goes to: Sonnet 5.5 low (or Haiku 5.5 low for a short job) for coding a test decides, Opus 5.5 low for default subagent work, Opus 5.5 high for text people read and reviews, Fable 5.1 for the hardest coding, DeepSeek V4 Flash for bulk work on open or personal folders, and Codex reviewing every code change',
      caption: 'Routing. The model and effort for each kind of work, set from the benchmark and bake-off.',
    },
  },
  {
    a: 'reviews on the diff',
    b: 'a reviewer that explores the repo',
    note: 'Every code change gets an outside review before it counts as done. Codex does the review, so it costs almost no Claude usage. The script sends only the git diff with a findings-only brief, which keeps the reviewer from wandering the repo.',
    figure: {
      src: '/writing/cstack/review.svg',
      alt: 'Six steps of a review: the git diff, second_opinion.py --review adding a findings-only brief, model-policy.json choosing which models may see the folder, sandbox-exec for outside CLIs, a fallback ladder that starts with Codex, and findings back to the session, which fixes what it confirms',
      caption: 'Only the diff goes out, through the same policy, sandbox and fallback as every outside call.',
      width: 1200,
      height: 754,
    },
  },
  {
    a: 'guardrails learned from failures',
    b: 'the same mistake in the next session',
    note: 'When a session hits a failure another session could repeat, it adds a rule that warns, stops or queues matching commands. Every later session, in any of the six agents, checks it first. As of 27 Oct 2026 there are 76 active rules, learned since 18 Sep.',
    figure: {
      src: '/writing/cstack/guardrail-loop.svg',
      alt: 'A loop in four steps: something breaks once, guardrails.py learn turns it into a rule with an action of warn, stop, queue or deny, every session checks each command and edit against the rules, and on a stop the session checks the case and either fixes it or acknowledges and retries',
      caption: 'One failure becomes a rule that every later session checks.',
      width: 1200,
      height: 700,
    },
  },
  {
    a: 'hooks that fail open',
    b: 'hooks that can block work',
    note: 'A broken script never stops a session. The cost is that a fresh install has to be checked by hand, which the README says plainly.',
  },
]

const EFFORT_CHART: ChartBlock = {
  type: 'chart',
  kind: 'bar',
  title: 'Opus 5 cost per task, by effort',
  subtitle: 'Routing benchmark, 17 Sep 2026: 5 tasks from real work with planted bugs, 2 runs each, API list price.',
  caption: 'On the four tasks marked right or wrong, low effort scored 96-100% against 100% at extra-high. On the writing task it scored higher (8.0 vs 6.8 out of 10).',
  xLabel: 'effort',
  unit: 'USD',
  categories: ['low', 'medium', 'high', 'extra-high'],
  series: [{ name: 'Opus 5', values: [0.33, 0.42, 0.53, 0.9] }],
}

const BAKEOFF_CHART: ChartBlock = {
  type: 'chart',
  kind: 'bar',
  title: 'Cost to code 10 real tasks, by model',
  subtitle: 'Bake-off on the git history of a production React Native + Firebase app. Every model here passed 10/10. Haiku, Sonnet and Opus are 5.5 unless marked.',
  caption: 'DeepSeek V4 Flash is approximate. One app, one run per model, Sep-Oct 2026.',
  unit: 'USD',
  categories: ['Haiku low', 'DeepSeek', 'Sonnet low', 'Opus low', 'Opus high', 'Opus 5', 'Fable 5.1'],
  series: [{ name: 'cost', values: [1.44, 1.5, 4.78, 8.22, 16.12, 20.6, 26.95] }],
}

const REVIEW_CHART: ChartBlock = {
  type: 'chart',
  kind: 'bar',
  title: 'Bugs found of 17, by reviewer',
  subtitle: '5 real changes that passed their tests but held 17 bugs. First run, graded blind by Opus.',
  caption: 'Second runs: Opus 5.5 high 9, Fable 5.1 4. Small samples, Sep-Oct 2026.',
  unit: 'bugs',
  categories: ['Opus 5.5 high', 'DeepSeek', 'Grok 4.7', 'Fable 5.1', 'Astra'],
  series: [{ name: 'bugs found', values: [10, 9, 7, 6, 5] }],
}

const STACK: [string, string[]][] = [
  ['Agents', ['Claude Code', 'Codex', 'OpenCode', 'DeepSeek', 'Kimi', 'Grok Build']],
  ['Code', ['Python', 'Shell']],
  ['Infra', ['macOS launchd', 'sandbox-exec', 'kitty']],
]

function Diagram({ src, alt, caption, width, height }: Figure)
{
  return (
    <figure style={{ margin: 0 }}>
      <picture>
        <source media="(max-width: 640px)" srcSet={mobile(src)} />
        <img src={src} alt={alt} width={width} height={height} loading="lazy" style={{ width: '100%', height: 'auto', display: 'block', borderRadius: 4 }} />
      </picture>
      <figcaption style={{ fontFamily: MONO, fontSize: 'var(--text-xs)', color: 'var(--muted-2)', marginTop: 8, letterSpacing: '0.02em', lineHeight: 1.5 }}>
        {caption}
      </figcaption>
    </figure>
  )
}

export default function CstackPage() {
  return (
    <PageShell jsonLd={pageJsonLd(metadata)}>
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
            One set of rules, hooks and skills shared by six coding agents: Claude Code, Codex, OpenCode, DeepSeek, Kimi and Grok Build. It is the setup I run every day, and benchmarks I ran on my own work decide which model does which job.
          </p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <a href="https://github.com/Clupai8o0/cstack" target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ fontFamily: MONO }}><Icon name="github" size={12} /> Clupai8o0/cstack</a>
            <Link href={WRITE_UP} className="btn" style={{ fontFamily: MONO }}>read the write-up →</Link>
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
            I run several agent sessions on the same repos at once, across more than one coding agent. Each tool wants its own rules file, skills and hooks, and copies kept in step by hand drift apart. Sessions edited the same file without knowing about each other, and subagents inherited the session&apos;s effort, extra-high included, without anyone choosing it.
          </p>
        </div>

        {/* Solution */}
        <div style={{ marginBottom: 40 }}>
          <div className="section-label" style={{ fontFamily: MONO }}>The fix</div>
          <p style={{ ...PROSE, margin: 0 }}>
            cstack keeps one copy of everything, so a guardrail learned in one session applies in all of them. Then I measured: a routing benchmark built from real work with planted bugs, and a bake-off on real commits from one app.
          </p>
        </div>

        {/* How it fits together */}
        <div className="section-label" style={{ fontFamily: MONO }}>How it fits together</div>
        <p style={{ ...PROSE, margin: '0 0 18px' }}>
          Claude Code links the rules and skills straight from the cstack folder. A sync script writes Codex, OpenCode, DeepSeek and Kimi their own AGENTS.md, and Grok Build reads Claude&apos;s files itself plus one short DELTA file. The same hooks run in all six.
        </p>
        <div data-reveal style={{ marginBottom: 20 }}>
          <Diagram
            src="/writing/cstack/layer.svg"
            alt="The cstack folder holds the rules, agent deltas, hooks, core skills, mods and model policy. Claude Code gets the rules by symlink, sync-agents.py writes AGENTS.md, skill links and hook config for Codex, OpenCode, dsh and kimi, and Grok Build reads Claude's files itself and gets only a DELTA.md"
            caption="One source, six agents. Edit a rule once and run the sync."
            width={1200}
            height={770}
          />
        </div>
        <div data-reveal style={{ fontFamily: MONO, fontSize: 'var(--text-xs)', background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 2, padding: '14px 16px', marginBottom: 40, lineHeight: 1.8 }}>
          {SHAPE.map(([part, desc]) => (
            <div key={part} style={{ display: 'flex', flexWrap: 'wrap', columnGap: 16 }}>
              <span style={{ color: 'var(--accent)', width: 200, flexShrink: 0 }}>{part}</span>
              <span style={{ color: 'var(--muted)', flex: '1 1 200px' }}>{desc}</span>
            </div>
          ))}
        </div>

        {/* Two sessions, one file */}
        <div className="section-label" style={{ fontFamily: MONO }}>Two sessions, one file</div>
        <p style={{ ...PROSE, margin: '0 0 18px' }}>
          A hook claims each file a session edits, in one JSON file every agent shares. A second session is blocked from that file in the same worktree and warned in another one. The two sessions then agree on a handoff, and the claim drops when the first one releases.
        </p>
        <div data-reveal style={{ marginBottom: 40 }}>
          <Diagram
            src="/writing/cstack/claims.svg"
            alt="Timeline in five steps: session A edits a file and claims it in claude-claims.json in the git common dir; session B tries the same file and is blocked, or only warned in another worktree; B messages A; A sends one handoff and releases; B edits the file"
            caption="Session B is blocked until A hands over and releases the claim."
            width={1200}
            height={680}
          />
        </div>

        {/* Key decisions */}
        <div className="section-label" style={{ fontFamily: MONO }}>Engineering details</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, marginBottom: 40 }}>
          {DECISIONS.map(({ a, b, note, figure }) => (
            <div key={a}>
              <div style={{ fontFamily: MONO, fontSize: 'var(--text-xs)', marginBottom: 6, lineHeight: 1.5 }}>
                <span style={{ color: GREEN }}>{a}</span>
                <span style={{ color: 'var(--muted)' }}> over </span>
                <span style={{ color: 'var(--muted)', textDecoration: 'line-through' }}>{b}</span>
              </div>
              <div style={{ ...PROSE }}>{note}</div>
              {figure ? (
                <div style={{ marginTop: 16 }}>
                  <Diagram {...figure} />
                </div>
              ) : null}
            </div>
          ))}
        </div>

        {/* Measured */}
        <div className="section-label" style={{ fontFamily: MONO }}>Measured</div>
        <p style={{ ...PROSE, margin: 0 }}>
          The routing rules come from two runs on my own work. For coding, every model below passed all 10 tasks, so cost and speed decided.
        </p>
        <div data-reveal>
          <ArticleChart block={EFFORT_CHART} />
        </div>
        <div data-reveal>
          <ArticleChart block={BAKEOFF_CHART} />
        </div>
        <p data-reveal style={{ ...PROSE, margin: '0 0 18px' }}>
          On review, Opus 5.5 at high effort found 9-10 of 17 real bugs that had passed their tests. 4 of 5 security-rules bugs went unfound by every model, so those still need a person.
        </p>
        <div data-reveal>
          <ArticleChart block={REVIEW_CHART} />
        </div>
        <p data-reveal style={{ ...PROSE, color: 'var(--muted)', margin: '0 0 40px' }}>
          One person, one app, small samples, Sep-Oct 2026. The effort benchmark ran on Opus 5 and has not been re-run on 5.5.
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
          <a href="https://github.com/Clupai8o0/cstack" target="_blank" rel="noopener noreferrer" className="btn" style={{ fontFamily: MONO }}><Icon name="github" size={12} /> source</a>
          <Link href={WRITE_UP} className="btn" style={{ fontFamily: MONO }}>read the write-up</Link>
          <Link href="/projects" className="btn btn-ghost" style={{ fontFamily: MONO }}>← back to projects</Link>
        </div>

      </div>
    </PageShell>
  )
}
