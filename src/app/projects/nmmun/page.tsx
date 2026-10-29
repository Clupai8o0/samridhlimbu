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
  'The website for NMMUN, the Model United Nations conference at New Millennium School, Bahrain. I built it in 2024 so the next year\'s student IT team could run it by editing content, without touching the components. They ran the 15-16 November 2024 conference on it, and 4 of their 105 commits touched a component or hook.'

const OG_IMAGE = {
  url: '/projects/nmmun/home-countdown.webp',
  width: 2880,
  height: 1800,
  alt: 'The NMMUN 2024-25 home page with a countdown, a notice about allocations, and Register and Contact Us buttons over a blurred photo',
}

export const metadata: Metadata = {
  title: 'NMMUN · conference website',
  description: DESCRIPTION,
  alternates: { canonical: '/projects/nmmun' },
  openGraph: {
    type: 'article',
    url: '/projects/nmmun',
    title: 'NMMUN · conference website · Samridh Limbu',
    description: DESCRIPTION,
    images: [OG_IMAGE],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NMMUN · conference website · Samridh Limbu',
    description: DESCRIPTION,
    images: [OG_IMAGE.url],
  },
}

const MONO = '"JetBrains Mono", var(--font-mono), monospace'
const SANS = 'Inter, var(--font-inter), sans-serif'
const DISPLAY = 'Manrope, var(--font-manrope), sans-serif'
const GREEN = 'var(--term-green)'

const PROSE = { fontFamily: SANS, fontSize: 15, color: 'var(--fg-dim)', lineHeight: 1.65, maxWidth: 640 }

const CODE = {
  fontFamily: MONO,
  fontSize: 'var(--text-xs)',
  lineHeight: 1.7,
  color: 'var(--fg-dim)',
  background: 'var(--bg-2)',
  borderRadius: 2,
  padding: '14px 16px',
  margin: 0,
  overflowX: 'auto' as const,
  whiteSpace: 'pre' as const,
}

const CODE_CAPTION = { fontFamily: MONO, fontSize: 'var(--text-xs)', color: 'var(--muted)', lineHeight: 1.5, marginTop: 8 }

const METRICS = [
  { k: 'pages', v: '8' },
  { k: 'councils', v: '14' },
  { k: 'participants, by the school\'s count', v: '500+' },
  { k: 'commits by the next team', v: '105' },
  { k: 'touching components or hooks', v: '4' },
]

const CONFIG_CODE = `//* Hero text
export const hero: EventStates = {
	beforeEvent: "Engage, Debate, Lead: Your diplomatic journey begins here",
	duringEvent: "NMMUN 2024 has started, we wish you all the very best!",
	afterEvent:
		"NMMUN 2024 is over. Thank you for joining us and we hope to see you next year!",
};

export const eventDate = "2024-11-15 08:00:00"; // YYYY-MM-DD HH-MM-SS
export const eventEndDate = "2024-11-16 18:00:00"; //! must always be after the event
export const eventDateInWords = "15th & 16th November, 2024";`

const BUG_CODE = `const t = eventDate.split(/[- : T]/); // ["2024", "11", "15", "08", "00", "00"]
const targetTime = new Date(
	parseInt(t[0]),
	parseInt(t[1]) - 1,
	parseInt(t[2]),
	parseInt(t[4]), // hours   <- the minutes
	parseInt(t[5]), // minutes <- the seconds
	parseInt(t[3])  // seconds <- the hours
);`

const COMMITS_CHART: ChartBlock = {
  type: 'chart',
  kind: 'bar',
  title: 'What the next team\'s 105 commits changed',
  subtitle: 'Commits that touched each area, Aug-Nov 2024. One commit can touch several.',
  unit: 'commits',
  categories: ['pages (app/)', 'data (lib/)', 'images', 'README', 'components, hooks'],
  series: [{ name: 'commits', values: [45, 44, 43, 15, 4] }],
}

const TIMELINE = [
  { date: 'Feb-May 2024', title: 'Built alone, in a private repo', body: '34 commits. Every page, the component set and the countdown, filled with the content of the November 2023 conference.' },
  { date: 'May-Jun 2024', title: 'Handed over', body: 'Moved into a public repo. Added comments to the two data files and wrote a README for whoever came next: what to know first, how to install it, which files to edit, and to leave the components alone.' },
  { date: 'Aug-Nov 2024', title: 'The next IT team takes it', body: 'They made 105 commits: new councils and topics, chairs, allocations, team photos and the 2024 dates. 65 of them were on a fork that I merged back in September, after patching the countdown code. The patch kept the date bug described below.' },
  { date: '15-16 Nov 2024', title: 'The conference runs on it', body: 'Nobody committed between 13 and 26 November. The countdown, hero text and Register button were set to change on their own from the dates in the config.', current: true },
  { date: 'Dec 2025', title: 'Archived', body: 'I added a final README and archived the repo. nmmun.vercel.app still serves the November 2024 build.' },
]

const DECISIONS = [
  ['content files', 'editing the components', 'Event dates, hero and banner text, the itinerary and the dress code live in lib/config.ts. Councils, their topics, guides and chairs, the teams and every navigation link live in lib/links.ts. The README lists four places to edit, those two plus page metadata and each page\'s copy, and asks the next team to leave the components and layouts alone. 101 of their 105 commits did.'],
  ['dates decide the state', 'editing copy on the day', 'The hero, the banner and the Register button each have a before, during and after version. A hook compares the clock with the start and end dates, so on page load after the start the countdown gives way to "The event has started!!" and Register greys out, with no deploy.'],
  ['one council route', 'a page per council', 'All 14 councils render from one /council/[id] page that looks its id up in the councils list. Adding a council is a new entry in links.ts, with no new file.'],
  ['links out', 'a registration backend', 'Chair, delegate and security and runner applications were Google Forms, and allocations, rules of procedure and background guides were files on Google Drive. The site links to all of them and has no database or server code of its own.'],
]

const STACK: [string, string[]][] = [
  ['Frontend', ['Next.js 14 (App Router)', 'React 18', 'TypeScript', 'Tailwind CSS 3', 'shadcn/ui (Radix)', 'Framer Motion', 'Embla Carousel']],
  ['Content', ['lib/config.ts', 'lib/links.ts', 'Google Forms', 'Google Drive']],
  ['Hosting', ['Vercel']],
]

export default function NmmunPage() {
  return (
    <PageShell>
      <div data-stagger style={{ maxWidth: 720, margin: '0 auto', padding: '36px 20px' }}>

        <PageHeader />

        {/* breadcrumb */}
        <div data-stagger-item style={{ fontFamily: MONO, fontSize: 'var(--text-xs)', color: 'var(--muted)', marginBottom: 16 }}>
          <span style={{ color: 'var(--accent)' }}>❯</span>{' '}
          cd <Link href="/projects" style={{ color: 'var(--fg)', textDecoration: 'none' }}>projects</Link>/nmmun
        </div>

        {/* Banner */}
        <div data-stagger-item style={{ padding: '24px 0', marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', columnGap: 12, rowGap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
            <h1 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 'var(--text-2xl)', lineHeight: 1.1, margin: 0, letterSpacing: '-0.025em', color: 'var(--fg)' }}>NMMUN</h1>
            <span className="pill" style={{ fontFamily: MONO }}>school conference · 2024 · archived</span>
          </div>
          <p style={{ ...PROSE, fontSize: 'var(--text-base)', margin: '0 0 16px' }}>
            The website for the New Millennium Model United Nations, a two-day conference at New Millennium School, Bahrain. I built it in 2024 so the next year&apos;s student IT team could run it by editing content, without touching the components. They ran the November 2024 conference on it, more than 500 participants by the school&apos;s count, and 4 of their 105 commits touched a component or hook.
          </p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <a href="https://nmmun.vercel.app" target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ fontFamily: MONO }}><Icon name="external" size={12} /> nmmun.vercel.app</a>
            <a href="https://github.com/Clupai8o0/nmmun" target="_blank" rel="noopener noreferrer" className="btn" style={{ fontFamily: MONO }}><Icon name="github" size={12} /> source</a>
          </div>
        </div>

        {/* Hero */}
        <div data-stagger-item style={{ marginBottom: 24 }}>
          <Shot
            src="/projects/nmmun/home-countdown.webp"
            alt="The NMMUN 2024-25 home page: a brown notice bar about the Allocations page, a countdown reading 13 days 13 hours 59 minutes, the navigation and a Register button, and the title NMMUN 2024-25 with 15th & 16th November, 2024 and Register and Contact Us buttons over a heavily blurred photo"
            width={2880}
            height={1800}
            caption="The home page, run locally with the browser clock set to about 10:00 on 1 Nov 2024 in Bahrain. The carousel photos show students, so they are blurred here."
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
            NMMUN is run by students, and its IT team changes every year. I was Head of IT for the 2023 conference, and the site had to work for whoever took over. The README asks the next team for basic HTML, CSS and JavaScript, some React, and at least one web project done before.
          </p>
          <p style={{ ...PROSE, margin: 0 }}>
            Apart from the application forms, the site is where delegates, chairs and the security and runner team find what they need. It lists the councils with their topics and background guides, links the allocations, rules of procedure and code of conduct, sets out the two-day itinerary and the dress code, and explains how to register and pay. Applications themselves were Google Forms.
          </p>
        </div>

        {/* Councils */}
        <div className="section-label" style={{ fontFamily: MONO }}>Councils</div>
        <p style={{ ...PROSE, margin: '0 0 20px' }}>
          Fourteen councils in 2024, from beginner ones like UNHRC to the Security Council and two crisis councils. Each card opens the same page template, filled from its entry in the data file.
        </p>
        <div style={{ marginBottom: 24 }}>
          <Shot
            src="/projects/nmmun/councils-grid.webp"
            alt="The Councils page: a header photo of flags outside a UN building, then a grid of 14 council logos with their names, UNSC, UNCSTD, UNHRC, UNODC, IMF, UNEP, WHO, ICJ, FIFA, UNCSW, HCC, LOK SABHA, JCC and Suits"
            width={2880}
            height={3170}
            caption="The Councils page from the local run. All 14 come from the councils list in lib/links.ts."
          />
        </div>
        <div style={{ marginBottom: 40 }}>
          <Shot
            src="/projects/nmmun/council-unsc.webp"
            alt="The UNSC council page: the Security Council logo, a description of the council, two topics on cyber warfare and on nuclear, chemical and biochemical attacks, a Background Guide button, and two chair cards showing a grey silhouette and the word Chair"
            width={2880}
            height={2390}
            caption="One council page. The chairs were students, so in the local copy their names and photos were swapped for the role and the site's own placeholder image."
          />
        </div>

        {/* How the handover works */}
        <div className="section-label" style={{ fontFamily: MONO }}>How the handover works</div>
        <p style={{ ...PROSE, margin: '0 0 14px' }}>
          Most of what changes from one year to the next sits in two files. lib/config.ts holds the dates and the text that depends on them; lib/links.ts holds the councils, teams and navigation. Each block in config.ts starts with a comment saying what it controls.
        </p>
        <div data-reveal style={{ marginBottom: 24 }}>
          <CodePre code={CONFIG_CODE} lang="ts" style={CODE} />
          <div style={CODE_CAPTION}>From lib/config.ts as the 2024 team left it. Lines copied as committed, trimmed to the hero text and the dates.</div>
        </div>
        <p style={{ ...PROSE, margin: '0 0 20px' }}>
          From those two dates the site works out which of three states it is in. Before the start there is a countdown and an open Register button. Once it passes, the countdown becomes a notice, the hero changes its line and Register is disabled. After the end date the notice goes and the hero thanks people for coming.
        </p>
        <div style={{ marginBottom: 32 }}>
          <Shot
            src="/projects/nmmun/event-started.webp"
            alt="The home page during the conference: the countdown replaced by 'The event has started!!', both Register buttons greyed out, and the hero line 'NMMUN 2024 has started, we wish you all the very best!', with the brown notice bar above still asking people to check the Allocations page"
            width={2880}
            height={1400}
            caption="The same page with the clock set to 15 Nov 2024, 11:00. The notice bar at the top should have changed too, and did not (see below)."
          />
        </div>
        <p style={{ ...PROSE, margin: '0 0 20px' }}>
          The next team worked on it from August to November 2024 and stayed out of the components almost entirely.
        </p>
        <div data-reveal>
          <ArticleChart block={COMMITS_CHART} />
        </div>
        <p data-reveal style={{ ...PROSE, color: 'var(--muted)', margin: '0 0 40px' }}>
          Counted from git log over their 105 commits, merges left out. The 4 that touched code changed the footer, the sidebar, the Contact Us link and the countdown (the hook and both timer components).
        </p>

        {/* Info page */}
        <div className="section-label" style={{ fontFamily: MONO }}>The information page</div>
        <p style={{ ...PROSE, margin: '0 0 20px' }}>
          One page holds the allocations, rules of procedure, the code of conduct, the itinerary and the dress code. The itinerary is two arrays in config.ts drawn as timelines.
        </p>
        <div style={{ marginBottom: 32 }}>
          <Shot
            src="/projects/nmmun/itinerary.webp"
            alt="The itinerary section of the Information page: two timelines, Day 1 on Friday 15th November 2024 from Registration at 8:00 to Council Session Three ending at 5:00 p.m., and Day 2 on Saturday 16th November from Council Session Four at 8:00 to the Closing Ceremony ending at 6:00 p.m."
            width={2880}
            height={1540}
            caption="The itinerary, from the itineraryDay1 and itineraryDay2 arrays in lib/config.ts."
          />
        </div>
        <div style={{ marginBottom: 40 }}>
          <Shot
            src="/projects/nmmun/phone-home.webp"
            alt="The NMMUN home page on a phone: the allocations notice wrapping to four lines, the logo, a countdown reading 13 days 13 hours 59 minutes, a menu button, and the title with Register and Contact Us buttons over a blurred photo"
            width={1170}
            height={2100}
            caption="The home page on a phone, same clock, photos blurred."
            variant="mobile"
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

        {/* Timeline */}
        <div className="section-label" style={{ fontFamily: MONO }}>Timeline</div>
        <div style={{ marginBottom: 40 }}>
          {TIMELINE.map((e, i) => (
            <div key={e.date} style={{ position: 'relative', marginLeft: 5, paddingLeft: 22, paddingBottom: i === TIMELINE.length - 1 ? 0 : 20 }}>
              <div data-timeline-dot style={{ position: 'absolute', left: -6, top: 4, width: 11, height: 11, borderRadius: 6, background: e.current ? 'var(--accent)' : 'var(--bg)', border: `1.5px solid ${e.current ? 'var(--accent)' : 'var(--muted-2)'}` }} />
              <div style={{ fontFamily: MONO, fontSize: 'var(--text-xs)', color: 'var(--muted)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{e.date}</div>
              <div style={{ fontFamily: SANS, fontSize: 15, fontWeight: 600, color: 'var(--fg)', marginBottom: 4 }}>{e.title}</div>
              <div style={{ fontFamily: SANS, fontSize: 'var(--text-sm)', color: 'var(--muted)', lineHeight: 1.6, maxWidth: 560 }}>{e.body}</div>
            </div>
          ))}
        </div>

        {/* What I'd do differently */}
        <div className="section-label" style={{ fontFamily: MONO }}>What I&apos;d do differently</div>
        <p style={{ ...PROSE, margin: '0 0 14px' }}>
          Test the clock code, because two bugs in it shipped and are still in the live build. The countdown builds its target date with the hour, minute and second in the wrong slots, so 08:00:00 becomes 00:00:08. On 1 November at about 10:00 it read 13 days 13 hours, where 13 days 22 hours was right, and the site would have said the event had started at midnight. It also reads the date in the visitor&apos;s time zone where it should use Bahrain&apos;s.
        </p>
        <div data-reveal style={{ marginBottom: 24 }}>
          <CodePre code={BUG_CODE} lang="ts" style={CODE} />
          <div style={CODE_CAPTION}>From hooks/useTime.ts. The comments on the last three arguments are mine, added for this page.</div>
        </div>
        <p style={{ ...PROSE, margin: '0 0 40px' }}>
          The notice bar reads the event state once, when it first appears, before the time hook has worked anything out. So it never leaves its pre-event message, as the screenshot above shows. And the per-second countdown is written out three times, in the hook and in both timer components, so every change to it has to be made three times. The repo has no tests at all. A single function from a date and time zone to a state, with a handful of tests around it, would have caught the date bugs.
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
          <a href="https://nmmun.vercel.app" target="_blank" rel="noopener noreferrer" className="btn" style={{ fontFamily: MONO }}><Icon name="external" size={12} /> nmmun.vercel.app</a>
          <a href="https://github.com/Clupai8o0/nmmun" target="_blank" rel="noopener noreferrer" className="btn" style={{ fontFamily: MONO }}><Icon name="github" size={12} /> source</a>
          <Link href="/projects" className="btn btn-ghost" style={{ fontFamily: MONO }}>← back to projects</Link>
        </div>

      </div>
    </PageShell>
  )
}
