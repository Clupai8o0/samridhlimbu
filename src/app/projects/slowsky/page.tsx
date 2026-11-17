import type { Metadata } from 'next'
import Link from 'next/link'
import { PageShell } from '@/components/page-shell'
import { pageJsonLd } from '@/lib/seo'
import { PageHeader } from '@/components/page-header'
import { Icon } from '@/components/icons'
import { Shot } from '@/components/case-study/shot'
import { ArticleChart } from '@/components/article-chart'
import type { ChartBlock } from '@/lib/writing'

const DESCRIPTION =
  'Slowsky shows any patch of sky on every visit by NASA\'s SPHEREx telescope, in date order, from real frames read straight from NASA\'s public archive. My solo entry for the NASA Space Apps Challenge 2026, built in one weekend with several AI models. Live and open source.'

const WRITE_UP = '/writing/slowsky-one-weekend-many-models'

export const metadata: Metadata = {
  title: 'Slowsky · watch the infrared sky change',
  description: DESCRIPTION,
  alternates: { canonical: '/projects/slowsky' },
  openGraph: {
    type: 'article',
    url: '/projects/slowsky',
    title: 'Slowsky · watch the infrared sky change · Samridh Limbu',
    description: DESCRIPTION,
    images: [{ url: '/projects/slowsky/hero.webp', width: 1600, height: 1000, alt: 'Slowsky showing Barnard\'s Star in a SPHEREx frame from 30 August 2025, with Gaia star rings, the tool column on the left and the target notes on the right' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Slowsky · watch the infrared sky change · Samridh Limbu',
    description: DESCRIPTION,
    images: ['/projects/slowsky/hero.webp'],
  },
}

const MONO = '"JetBrains Mono", var(--font-mono), monospace'
const SANS = 'Inter, var(--font-inter), sans-serif'
const DISPLAY = 'Manrope, var(--font-manrope), sans-serif'
const GREEN = 'var(--term-green)'

const PROSE = { fontFamily: SANS, fontSize: 15, color: 'var(--fg-dim)', lineHeight: 1.65, maxWidth: 640 }

const METRICS = [
  { k: 'hours, first commit to last', v: '32' },
  { k: 'tagged versions', v: '13' },
  { k: 'claims matched to a source', v: '147' },
]

const COMMITS_CHART: ChartBlock = {
  type: 'chart',
  kind: 'bar',
  title: 'Commits per three hours',
  subtitle: 'Non-merge commits in the Slowsky repo, 14 to 15 November 2026, Melbourne time. 488 in all.',
  xLabel: 'block starting',
  unit: 'commits',
  categories: ['Sat 12:00', '15:00', '18:00', '21:00', 'Sun 00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00'],
  series: [{ name: 'Commits', values: [48, 134, 92, 65, 18, 38, 38, 27, 9, 15, 3, 1] }],
}

const DECISIONS = [
  ['byte-range reads from S3', 'downloading whole files', 'The frames are FITS files in NASA\'s public S3 bucket. The page reads each file\'s header and wavelength table, then only the image rows that cover the view. It never downloads a whole file.'],
  ['one frame per visit, at one wavelength', 'every frame that covers the spot', 'Each part of a SPHEREx detector sees a slightly different wavelength. For each visit the page keeps the frame closest to the chosen wavelength, and only if that wavelength is within half the band the spot sees. Otherwise dates would differ in colour as well as time.'],
  ['a saved copy for the five presets', 'a 20 to 45 second wait on every visit', 'A live read takes 20 to 45 seconds, so the presets open from a small copy of real frames saved with the site: 24 frames each, 112 by 112 pixels. Go live reads the same target from the archive, and a preset falls back to the copy if the archive does not answer.'],
  ['test gates against astropy', 'checking alignment by eye', 'Three gates block every change. The sky mapping must match astropy within 0.01 pixel at 9 points on two real frames, an S3 cutout must sum to astropy\'s value within 1 part in 1000, and simulated stars must land within 0.3 pixel after regridding.'],
  ['"candidate", never "discovery"', 'calling a change a find', 'A change between two dates can be noise, a satellite trail or a detector hit. The page lists changes as candidates for a closer look and says what it cannot rule out.'],
  ['fixed sentence forms for the AI note', 'trusting the model\'s prose', 'Claude Opus 5.5 can write a short note on what the page measured. A checker keeps only sentences that match a fixed list of forms, filled from the page\'s own fact sheet, and drops the rest.'],
]

const STACK: [string, string[]][] = [
  ['Frontend', ['TypeScript', 'Vite', 'Canvas 2D', 'no UI framework', 'Vitest']],
  ['Backend', ['Vercel functions', 'IRSA SIA proxy', 'S3 range reads', 'Claude API']],
  ['Data', ['SPHEREx DR1 and QR3', 'Gaia DR3', '2MASS', 'Python and astropy for the snapshot']],
]

export default function SlowskyPage() {
  return (
    <PageShell jsonLd={pageJsonLd(metadata)}>
      <div data-stagger style={{ maxWidth: 720, margin: '0 auto', padding: '36px 20px' }}>

        <PageHeader />

        {/* breadcrumb */}
        <div data-stagger-item style={{ fontFamily: MONO, fontSize: 'var(--text-xs)', color: 'var(--muted)', marginBottom: 16 }}>
          <span style={{ color: 'var(--accent)' }}>❯</span>{' '}
          cd <Link href="/projects" style={{ color: 'var(--fg)', textDecoration: 'none' }}>projects</Link>/slowsky
        </div>

        {/* Banner */}
        <div data-stagger-item style={{ padding: '24px 0', marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', columnGap: 12, rowGap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
            <h1 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 'var(--text-2xl)', lineHeight: 1.1, margin: 0, letterSpacing: '-0.025em', color: 'var(--fg)' }}>Slowsky</h1>
            <span className="pill" style={{ fontFamily: MONO }}>nasa space apps · nov 2026 · live</span>
          </div>
          <p style={{ ...PROSE, fontSize: 'var(--text-base)', margin: '0 0 18px' }}>
            A web page for watching the infrared sky change. Pick a spot, and it shows that patch of sky on every visit by NASA&apos;s SPHEREx space telescope, in date order, from real NASA frames. My solo entry for the NASA Space Apps Challenge 2026.
          </p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <a href="https://slowsky.clupai.com" target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ fontFamily: MONO }}>slowsky.clupai.com ↗</a>
            <a href="https://github.com/Clupai8o0/slowsky" target="_blank" rel="noopener noreferrer" className="btn" style={{ fontFamily: MONO }}><Icon name="github" size={12} /> Clupai8o0/slowsky</a>
          </div>
        </div>

        {/* Hero */}
        <div data-stagger-item style={{ marginBottom: 24 }}>
          <Shot
            src="/projects/slowsky/hero.webp"
            alt="Slowsky showing Barnard's Star in a SPHEREx frame from 30 August 2025 at 0.85 µm, with Gaia star rings, the tool column on the left, a sky map and a caution card in the middle, and the target notes on the right"
            width={1600}
            height={1000}
            caption="Barnard's Star, the fastest-moving star in our sky, in Blink. The gold ring marks where its catalogue motion puts it on each date. The caution card says its centre is too bright for the camera."
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
            SPHEREx maps the whole sky in infrared light, in 102 colours, and comes back to each part of it again and again. The frames are public, but seeing how one spot changed means finding the right files, picking frames taken at the same colour and lining them up. Slowsky does that in the browser, then lets you blink between dates, stack them or subtract one from another.
          </p>
          <p style={{ ...PROSE, margin: 0 }}>
            The challenge was &quot;Planet X and SPHEREx&quot;. Slowsky is not a planet finder, and the page says so. Optical surveys have already ruled out about 78% of Planet Nine&apos;s predicted range, and what is left is around V 22 (Brown, Holman and Batygin 2024). SPHEREx reaches 19.5 to 19.9 AB below 3.8 µm, and only after its two-year survey (Bock et al. 2025). The bands differ, so it is a rough comparison, but one weekend&apos;s tool was never going to close that gap.
          </p>
        </div>

        {/* RW Aurigae */}
        <div data-reveal style={{ marginBottom: 24 }}>
          <Shot
            src="/projects/slowsky/brightness-curve.webp"
            alt="Slowsky's Charts tab for RW Aurigae: a brightness curve relative to two Gaia comparison stars, ranging from +49% to −20%, with a shaded band for the comparison stars' scatter"
            width={1600}
            height={1000}
            caption="RW Aurigae, a star that changes its brightness. The curve divides it by two Gaia comparison stars in the same field. A rough check, not calibrated photometry."
          />
        </div>
        <div data-reveal style={{ marginBottom: 40 }}>
          <Shot
            src="/projects/slowsky/subtract.webp"
            alt="Slowsky's Subtract view for RW Aurigae: the later visit minus the earlier one, with blue marking more light earlier and orange more light later"
            width={1600}
            height={1000}
            caption="Subtract takes one visit from another. Blue is more light in the earlier visit, orange more in the later one."
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

        {/* How it was built */}
        <div className="section-label" style={{ fontFamily: MONO }}>How it was built</div>
        <p style={{ ...PROSE, margin: '0 0 14px' }}>
          The build began after kick-off on Saturday 14 November. The first commit landed at 13:23 Melbourne time and the last at 21:18 on Sunday, and I submitted at 23:10. One orchestrator session in Claude Code took each version through the same seven steps: cut it into pieces, build each piece in its own worktree, run the piece&apos;s test itself, send the diff to two reviewers from different makers, merge, ship and tag, then report to my phone.
        </p>
        <p style={{ ...PROSE, margin: '0 0 14px' }}>
          Claude (Fable, Opus, Sonnet and Haiku), Codex, Gemini and Grok wrote and reviewed the code. The event terms ban working with Chinese-owned companies, so a guardrail blocked those models in the Slowsky folders, and every tool used is named in the README. I chose the idea and made the product calls.
        </p>
        <div style={{ marginBottom: 40 }}>
          <ArticleChart block={COMMITS_CHART} />
        </div>

        {/* Comet */}
        <div data-reveal style={{ marginBottom: 40 }}>
          <Shot
            src="/projects/slowsky/comet-co2.webp"
            alt="Slowsky's Extras tab: twelve small SPHEREx pictures of comet 3I/ATLAS from 3.96 to 4.36 µm, and a chart whose value peaks at 4.25 µm"
            width={1600}
            height={1000}
            caption="Comet 3I/ATLAS across twelve SPHEREx frames. It lights up at 4.25 µm, where the SPHEREx team reports carbon dioxide gas. The card redraws public frames with rough numbers and adds nothing new to that work."
          />
        </div>

        {/* Honesty */}
        <div className="section-label" style={{ fontFamily: MONO }}>Every claim has a source</div>
        <p style={{ ...PROSE, margin: '0 0 14px' }}>
          The repo&apos;s SOURCES.md matches 147 claims from the README and the page to a NASA page, a paper or the data itself. Claude Opus 5.5 checked them with the sources open, Gemini read them as a second maker, and Codex and Grok each opened the sources for 15 rows. These checks were all run by AI tools; no person has gone through the list line by line, and the file says so.
        </p>
        <p style={{ ...PROSE, margin: '0 0 40px' }}>
          One call went against the reviewers. A small neural network puts a sort hint under each candidate change. It was trained only on fake changes, and in tests it labelled 55% of faint fake movers as moving. Gemini and Opus reviews said its lines could mislead and advised against switching it on. I switched it on anyway, as an experiment labelled &quot;Not a verdict&quot;, with its limits written out in the README.
        </p>

        {/* Mobile shot */}
        <div data-reveal style={{ marginBottom: 40 }}>
          <Shot
            src="/projects/slowsky/phone.webp"
            alt="Slowsky on a phone: Barnard's Star in Blink with Gaia rings, play controls, and three dates from August 2025 to August 2026"
            width={1170}
            height={2360}
            caption="The same page on a phone, with the dates as a strip under the sky."
            variant="mobile"
          />
        </div>

        <p style={{ ...PROSE, margin: '0 0 40px' }}>
          The full build story, from byte ranges to the review loop: <Link href={WRITE_UP} style={{ color: 'var(--accent)' }}>Slowsky: one weekend, one person, many models</Link>.
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

        {/* Footer */}
        <div style={{ display: 'flex', gap: 8, paddingTop: 20, flexWrap: 'wrap' }}>
          <Link href="/projects" className="btn btn-ghost" style={{ fontFamily: MONO }}>← back to projects</Link>
        </div>

      </div>
    </PageShell>
  )
}
