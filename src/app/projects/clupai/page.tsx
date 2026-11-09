import type { Metadata } from 'next'
import Link from 'next/link'
import { PageShell } from '@/components/page-shell'
import { pageJsonLd } from '@/lib/seo'
import { PageHeader } from '@/components/page-header'
import { Icon } from '@/components/icons'
import { Shot } from '@/components/case-study/shot'

const DESCRIPTION =
  'clupai.com is the site for my software company. A Next.js 16 site rebuilt in November 2026 around one offer and one funnel, the Build Risk Check, with GSAP and matter-js motion that loads per page. Live since 7 November 2026.'

export const metadata: Metadata = {
  title: 'clupai.com · the site for my software company',
  description: DESCRIPTION,
  alternates: { canonical: '/projects/clupai' },
  openGraph: {
    type: 'article',
    url: '/projects/clupai',
    title: 'clupai.com · the site for my software company · Samridh Limbu',
    description: DESCRIPTION,
    images: [{ url: '/projects/clupai/question.webp', width: 2880, height: 1800, alt: 'The first question of the Build Risk Check: What are you building? with four answers' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'clupai.com · the site for my software company · Samridh Limbu',
    description: DESCRIPTION,
    images: [{ url: '/projects/clupai/question.webp', alt: 'The first question of the Build Risk Check: What are you building? with four answers' }],
  },
}

const MONO = '"JetBrains Mono", var(--font-mono), monospace'
const SANS = 'Inter, var(--font-inter), sans-serif'
const DISPLAY = 'Manrope, var(--font-manrope), sans-serif'
const GREEN = 'var(--term-green)'

const PROSE = { fontFamily: SANS, fontSize: 15, color: 'var(--fg-dim)', lineHeight: 1.65, maxWidth: 640 }

// Lighthouse 12, mobile preset, median of 3 runs on the live site, 9 Nov 2026.
const METRICS = [
  { k: 'Lighthouse perf, /start', v: '94' },
  { k: 'Lighthouse perf, home', v: '71' },
  { k: 'layout shift (CLS)', v: '0.005' },
  { k: 'commits since April', v: '92' },
]

const SHAPE: [string, string][] = [
  ['src/app/', 'Next.js 16 pages: home, work, products, how it works, about, start'],
  ['lib/risk-check.ts', 'the eight questions, the points and the advice, imported by the form, the result page and the API'],
  ['api/start-capture', 'rate limit and bot check, then scores the answer code again and emails the result'],
  ['motion/routes.js', 'picks one motion module per page; it downloads at the same time as boot.js'],
  ['motion/*.js', 'GSAP timelines, plus matter-js for the funnel tower and the products shelf'],
]

const DECISIONS = [
  ['one offer and one funnel', 'a page per service', 'The old site had a page per service, industry, suburb and comparison. The rebuild deleted them and kept one offer. Each old URL answers with a permanent redirect to /start, /products, /work or the home page, so links already out there still land on a live page.'],
  ['a score worked out from a code', 'trusting the browser', 'The eight answers travel as one digit each, like 01011104. The result page and the capture API both work the score out from that code, so a result link can be shared and the browser never sends a score. Five of the answers carry points. The total is scaled so the safest set of answers scores 100, and the three lowest-scoring areas become the risks, with ties broken in a fixed order. The budget answer decides whether the page offers a call.'],
  ['the result whatever the email does', 'a result that waits on the send', 'The last step asks for a name and email, then opens /start/result whether the capture call worked or not. A failed bot check, a missing mail key or a network error still shows the result, and the page says the copy did not go out. The result page renders on the server from the code alone. With JavaScript off, /start is one plain form with all eight questions and no contact step.'],
  ['motion code per page', 'one motion bundle for every page', 'Each page imports only its own motion module. Motion used to wait for an idle moment of up to 1.5 s, then download the boot code and the page code one after the other. Now both start at once, and later hero pictures load at low priority. Together those changes took the loader on a preview build from about 8.4 s to 5.8 s on a 1.6 Mbps test link.'],
  ['physics with firm rules', 'free-falling blocks', 'Each answer drops a block onto a tower with matter-js. In early builds the stack crept and tipped by itself after about three seconds, so the rules got strict: no bounce, a short drop, a block at most 1.4 times as wide as the one below, and a block that has sat still is pinned in place. A riskier answer gives a narrower block a little off centre. The result page unpins the blocks before it knocks the tower, so a low score can still fall.'],
]

const TIMELINE = [
  { date: '21 Apr 2026', title: 'First commit', body: 'A Next.js site for the company. By mid-May it had service, industry, suburb and comparison pages, pricing, a blog and two free tools.' },
  { date: '4–6 Nov 2026', title: 'The rebuild', body: 'One offer, a new look and every page redone on a branch in three days, 39 of the 92 commits. Codex, Grok and DeepSeek reviewed the code between rounds.' },
  { date: '7 Nov 2026', title: 'Live on clupai.com', body: 'Main fast-forwarded to the branch and deployed. Old URLs answer with permanent (308) redirects.' },
  { date: '9 Nov 2026', title: 'Small fixes', body: 'The "ai" in the logo stays blue on every page colour. This build is live now.', current: true },
]

const STACK: [string, string[]][] = [
  ['Frontend', ['Next.js 16', 'React 19', 'TypeScript', 'Tailwind CSS 4', 'GSAP', 'matter-js', 'Lenis']],
  ['Backend', ['Next.js route handlers', 'Resend', 'Cal.com API', 'Upstash rate limit', 'Cloudflare Turnstile']],
  ['Infra', ['Vercel', 'Vercel Analytics', 'Speed Insights', 'Google Analytics']],
]

export default function ClupaiPage() {
  return (
    <PageShell jsonLd={pageJsonLd(metadata)}>
      <div data-stagger style={{ maxWidth: 720, margin: '0 auto', padding: '36px 20px' }}>
        <PageHeader />

        {/* breadcrumb */}
        <div data-stagger-item style={{ fontFamily: MONO, fontSize: 'var(--text-xs)', color: 'var(--muted)', marginBottom: 16 }}>
          <span style={{ color: 'var(--accent)' }}>❯</span>{' '}
          cd <Link href="/projects" style={{ color: 'var(--fg)', textDecoration: 'none' }}>projects</Link>/clupai
        </div>

        {/* Banner */}
        <div data-stagger-item style={{ padding: '24px 0', marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', columnGap: 12, rowGap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
            <h1 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 'var(--text-2xl)', lineHeight: 1.1, margin: 0, letterSpacing: '-0.025em', color: 'var(--fg)' }}>clupai.com</h1>
            <span className="pill" style={{ color: GREEN, borderColor: 'rgba(74,222,128,0.3)', fontFamily: MONO }}>● live · since 7 Nov 2026</span>
          </div>
          <p style={{ ...PROSE, fontSize: 'var(--text-base)', margin: '0 0 18px' }}>
            The site for clupai, my software company. In November we rebuilt it around one offer and one way in: an eight-question Build Risk Check that gives a founder a score and three risks before any call. This page is about how the site is built and why.
          </p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <a href="https://clupai.com" target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ fontFamily: MONO }}><Icon name="external" size={12} /> clupai.com</a>
            <a href="https://github.com/Clupai8o0/clupai" target="_blank" rel="noopener noreferrer" className="btn" style={{ fontFamily: MONO }}><Icon name="github" size={12} /> code</a>
          </div>
        </div>

        {/* Hero shot */}
        <div data-stagger-item style={{ marginBottom: 24 }}>
          <Shot
            src="/projects/clupai/question.webp"
            alt="The first question of the Build Risk Check on a dark blurred photo: What are you building? with four answers, A platform or marketplace, An app for customers, A tool for my business, Not sure yet"
            width={2880}
            height={1800}
            caption="The first of eight questions on /start. The screenshots and the clip come from a local copy of the live code (commit 2d492a4) with no keys and made-up answers. Nothing was sent."
            priority
          />
        </div>

        {/* Metrics */}
        <div data-reveal className="cs-metrics" style={{ marginBottom: 12 }}>
          {METRICS.map((m) => (
            <div key={m.k} style={{ padding: '14px 16px 14px 0' }}>
              <div data-count style={{ fontFamily: DISPLAY, fontSize: 'var(--text-lg)', color: 'var(--accent)', fontWeight: 700, letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums' }}>{m.v}</div>
              <div style={{ fontFamily: MONO, fontSize: 'var(--text-xs)', color: 'var(--muted)', marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.06em', lineHeight: 1.4 }}>{m.k}</div>
            </div>
          ))}
        </div>
        <p style={{ ...PROSE, fontSize: 'var(--text-sm)', color: 'var(--muted)', margin: '0 0 40px' }}>
          Lighthouse 12 on the live site, mobile preset, median of three runs on 9 November. /start paints its largest element at 2.2 s. The home page takes 6.8 s. Its largest element is the first app picture inside the cut-out wordmark: in the median run it waits 2.0 s before it starts downloading, takes 2.5 s to arrive and 1.6 s more to paint. The redirect from clupai.com to www adds about 0.85 s to both pages.
        </p>

        {/* Problem */}
        <div style={{ marginBottom: 40 }}>
          <div className="section-label" style={{ fontFamily: MONO }}>The problem</div>
          <p style={{ ...PROSE, margin: 0 }}>
            Until November the site had pages for services, industries, Melbourne suburbs, comparisons and pricing, plus a blog and two free tools. Then the company stopped selling websites, SEO and automation and kept one offer: the first version of a product, built by a date both sides sign. The site needed one next step to match, and it had to be useful to a founder who never hires us.
          </p>
        </div>

        {/* Home shot */}
        <div data-reveal style={{ marginBottom: 40 }}>
          <Shot
            src="/projects/clupai/hero.webp"
            alt="The top of the clupai home page: clupai builds software by a date we both sign, a short line about the company and a Start a project button"
            width={2880}
            height={820}
            caption="The top of the home page. Below it, the clupai wordmark is cut out of the page and pictures of our apps play through the letters."
          />
        </div>

        {/* How it works */}
        <div className="section-label" style={{ fontFamily: MONO }}>How it works</div>
        <p style={{ ...PROSE, margin: '0 0 14px' }}>
          Most pages end with a link to /start. The check asks eight multiple-choice questions, one per screen, and each answer drops a block onto a tower. The last step asks where to send the result. The result page shows a score out of 100 and the three weakest areas, each with something to do this week. If the budget answer is A$10k or more, it also offers a 30-minute call.
        </p>
        <div style={{ fontFamily: MONO, fontSize: 'var(--text-xs)', background: 'var(--bg-2)', borderRadius: 2, padding: '14px 16px', marginBottom: 24, lineHeight: 1.8 }}>
          {SHAPE.map(([part, desc]) => (
            <div key={part} style={{ display: 'flex', flexWrap: 'wrap', columnGap: 16 }}>
              <span style={{ color: 'var(--accent)', width: 140, flexShrink: 0 }}>{part}</span>
              <span style={{ color: 'var(--muted)', flex: '1 1 200px' }}>{desc}</span>
            </div>
          ))}
        </div>

        {/* Clip */}
        <div data-reveal style={{ marginBottom: 40 }}>
          <div style={{ borderRadius: 2, overflow: 'hidden', background: 'var(--bg-2)' }}>
            <video
              src="/projects/clupai/demo.mp4"
              poster="/projects/clupai/demo-poster.webp"
              controls
              muted
              playsInline
              preload="metadata"
              aria-label="Walkthrough of the Build Risk Check: eight answers build a tower of blocks, then the result page shows a score of 64"
              style={{ width: '100%', height: 'auto', aspectRatio: '1440 / 900', objectFit: 'contain', display: 'block' }}
            />
          </div>
          <p style={{ fontFamily: SANS, fontSize: 'var(--text-sm)', color: 'var(--muted)', lineHeight: 1.6, margin: '10px 0 0' }}>
            Eight answers, a tower, then the result, sped up 1.4 times. The clip skips the contact step, and nothing was submitted.
          </p>
        </div>

        {/* Result shot */}
        <div data-reveal style={{ marginBottom: 40 }}>
          <Shot
            src="/projects/clupai/result.webp"
            alt="The result page: Your Build Risk Check, a large yellow score of 64, and the line Out of 100, and higher is safer"
            width={2880}
            height={1800}
            caption="The result for a made-up set of answers. The three risks and their advice sit below the score."
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

        {/* Shelf shot */}
        <div data-reveal style={{ marginBottom: 40 }}>
          <Shot
            src="/projects/clupai/shelf.webp"
            alt="The products page as a shelf: boxes for Tempo, Acknowledgement Force and cstack on a plank, and a spot saying This spot is empty. Could be yours."
            width={2880}
            height={1800}
            caption="/products is a shelf of boxes. The links are laid out by CSS, so the page works without JavaScript. With it, you can drag a box sideways to knock it over."
          />
        </div>

        {/* Motion */}
        <div className="section-label" style={{ fontFamily: MONO }}>Motion</div>
        <p style={{ ...PROSE, margin: '0 0 40px' }}>
          Motion is opt in. With reduced motion on or JavaScript off, the motion code never loads and each page shows its plain version. The home hero is then a still wordmark filled with one app picture. A picture that is still loading shows a grey placeholder band. One bug from the loader: animating CSS transform on SVG paths that already carry a transform attribute overrode their position, and the wordmark letters piled up at the left.
        </p>

        {/* Mobile shot */}
        <div data-reveal style={{ marginBottom: 40 }}>
          <Shot
            src="/projects/clupai/question-mobile.webp"
            alt="The first question of the Build Risk Check on a phone, with the four answers stacked at the bottom"
            width={1170}
            height={2532}
            caption="The same question on a phone, with the answers at the bottom of the screen."
            variant="mobile"
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

        {/* Next */}
        <div className="section-label" style={{ fontFamily: MONO }}>What is next</div>
        <p style={{ ...PROSE, color: 'var(--muted)', margin: '0 0 40px' }}>
          A 60-second video of me is planned for under the home hero. The player gets built once the video is recorded, so the page never shows an empty box.
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
          <a href="https://clupai.com/start" target="_blank" rel="noopener noreferrer" className="btn" style={{ fontFamily: MONO }}><Icon name="external" size={12} /> take the Build Risk Check</a>
          <a href="https://github.com/Clupai8o0/clupai" target="_blank" rel="noopener noreferrer" className="btn" style={{ fontFamily: MONO }}><Icon name="github" size={12} /> source</a>
          <Link href="/projects" className="btn btn-ghost" style={{ fontFamily: MONO }}>← back to projects</Link>
        </div>

      </div>
    </PageShell>
  )
}
