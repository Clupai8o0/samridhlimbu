import type { Metadata } from 'next'
import Link from 'next/link'
import { PageShell } from '@/components/page-shell'
import { PageHeader } from '@/components/page-header'
import { Shot } from '@/components/case-study/shot'
import { ArticleChart } from '@/components/article-chart'
import type { ChartBlock } from '@/lib/writing'

const DESCRIPTION =
  'An Airtable-style grid that scrolls a 100,000-row table. Built solo in January 2026; I wrote the row loading four times and measured the versions locally.'

export const metadata: Metadata = {
  title: 'Airtable clone · 100k-row grid',
  description: DESCRIPTION,
  alternates: { canonical: '/projects/airtable' },
  openGraph: {
    type: 'article',
    url: '/projects/airtable',
    title: 'Airtable clone · 100k-row grid · Samridh Limbu',
    description: DESCRIPTION,
    images: [{ url: '/projects/airtable/grid.webp', width: 2880, height: 1772, alt: 'The Airtable clone grid showing a 100,000-row firewall log table with seven columns and one cell selected' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Airtable clone · 100k-row grid · Samridh Limbu',
    description: DESCRIPTION,
    images: ['/projects/airtable/grid.webp'],
  },
}

const MONO = '"JetBrains Mono", var(--font-mono), monospace'
const SANS = 'Inter, var(--font-inter), sans-serif'
const DISPLAY = 'Manrope, var(--font-manrope), sans-serif'
const GREEN = 'var(--term-green)'

const PROSE = { fontFamily: SANS, fontSize: 15, color: 'var(--fg-dim)', lineHeight: 1.65, maxWidth: 640 }
const BLOCK = { fontFamily: MONO, fontSize: 'var(--text-xs)', background: 'var(--bg-2)', borderRadius: 2, padding: '14px 16px', lineHeight: 1.8 }

const METRICS = [
  { k: 'rows in one table', v: '100,000' },
  { k: 'jump to row 50,000', v: '0.42 s' },
  { k: 'rows drawn at most', v: '63' },
]

const LOADERS: [string, string][] = [
  ['9 Jan', 'offset paging, 100 rows a page'],
  ['16 Jan', 'infinite scroll, 50 rows a page, cursor on the row id'],
  ['17 Jan', '500 rows a page, cursor on row order, next page at 50% scrolled'],
  ['17 Jan', 'fixed-height window: one count, 100-row pages by order range'],
]

const HEAP_CHART: ChartBlock = {
  type: 'chart',
  kind: 'line',
  title: 'Memory by row reached in a 100,000-row table',
  subtitle: 'Chrome JavaScript heap after garbage collection, with that row on screen',
  caption: 'Local production builds, same table, headless Chrome. The 17 Jan loader was scrolled down to each row; the current grid jumped to each row in turn.',
  xLabel: 'row on screen',
  unit: 'MB',
  categories: ['top', '5k', '10k', '15k', '20k', '25k', '30k', '35k'],
  series: [
    { name: '17 Jan loader', values: [53.0, 194.1, 374.7, 547.2, 728.3, 899.7, 1075.3, 1257.0] },
    { name: 'current grid', values: [11.4, 14.0, 16.7, 19.2, 21.6, 23.7, 26.2, 28.5] },
  ],
}

const DEPTH_CHART: ChartBlock = {
  type: 'chart',
  kind: 'line',
  title: 'Time to fetch 100 rows, by how deep they sit',
  subtitle: 'The app\'s own tRPC procedures against local Postgres, median of 7',
  caption: 'One run; a second saved run shows the same trend. Offset paging slows with depth, but at 100,000 rows the gap is a few milliseconds.',
  xLabel: 'first row of the page',
  unit: 'ms',
  categories: ['0', '10k', '25k', '50k', '75k', '99.9k'],
  series: [
    { name: 'offset', values: [5.6, 7.1, 6.1, 7.4, 8.6, 10.3] },
    { name: 'order cursor', values: [6.1, 6.1, 4.6, 4.5, 4.4, 4.6] },
    { name: 'order range', values: [6.1, 6.3, 4.9, 4.1, 4.3, 6.0] },
  ],
}

const MODEL: [string, string][] = [
  ['Base', 'a workspace, with a colour, owned by one user'],
  ['Table', 'belongs to a base'],
  ['Column', 'name, TEXT or NUMBER, and its position'],
  ['Row', 'just an id and its position'],
  ['Cell', 'one per row and column: a text or a number value'],
]

const DECISIONS = [
  ['a fixed-height window', 'infinite scroll', 'Infinite scroll only knows the rows it has fetched, so the scrollbar is wrong and reaching the end means loading everything before it. Here one count query sizes the scrollbar for the whole table, and the grid fetches only the pages in view plus two either side. Its own cache holds at most 10 pages and drops the least recently used.'],
  ['order ranges', 'offset paging', 'Every row stores its position, and the table and position are indexed together. Any page is one range query on that index, plus its cells, so pages can load in any order and in parallel. On the server, reaching row 50,000 with the old 500-row pages took about 1.9 s of requests in sequence; a count, then five range pages in parallel, took 23 to 32 ms.'],
  ['a row per cell', 'a JSON column per row', 'Each value is its own Cell, unique per row and column, with indexes on column and value. Columns are data, so adding one needs no schema change. The price is volume: 100,000 rows of 7 columns is 700,000 cells, and adding a column to a 40,003-row table wrote a cell for every row, which took 5.2 s.'],
  ['two keyboard modes', 'inputs that are always live', 'In grid mode the arrow keys and Tab move the selection, and typing, Enter or Backspace starts editing. In edit mode Enter saves, Escape cancels, and Tab saves and moves to the next cell, wrapping to the next row.'],
  ['ownership checks on the server', 'trusting ids from the browser', 'There are 22 API calls, not counting the starter template\'s sample. 21 of them check that every base, table, column, row or cell they touch belongs to the signed-in user. The odd one out is below.'],
]

const TIMELINE = [
  { date: '5–9 Jan 2026', title: 'Sign-in, bases and tables', body: 'T3 scaffold, Better Auth with email, GitHub and Google sign-in, a Postman collection for the API, bases with colours, and a views sidebar with placeholder content.' },
  { date: '10–14 Jan 2026', title: 'The grid', body: 'A virtualised table with keyboard navigation and cell editing, then renaming, deleting and dragging columns into a new order.' },
  { date: '16–17 Jan 2026', title: '100,000 rows', body: 'Row selection and deletion, the 100,000-row generator, and three rewrites of how rows load, ending with the fixed-height window. The only later commits update the Postman collection.', current: true },
]

const NEXT: [string, string][] = [
  ['Filters, sorts and views.', 'The schema has a View model with filters, sorts and hidden columns, and the cell indexes to back them, but no screen or route uses it. The one sort I had lived in the older table and went when the grid was rebuilt.'],
  ['Deleting rows.', 'Positions are never renumbered, and the grid finds the row for screen position n by looking for position n. In my test, deleting the third of five rows left a skeleton in its place and hid the last row, even after a reload.'],
  ['Column reordering.', 'It checks that the table is yours, then saves new positions for whatever column ids the browser sends, without checking that they belong to that table.'],
  ['The generator.', 'It writes 5,000 rows per database transaction, which is 35,000 cells on a 7-column table. On my laptop, busy with other work, one batch took 5.2 s, past the database library\'s 5-second limit per transaction, and the run stopped at 35,000 of 100,000 rows.'],
  ['Memory.', 'The current grid\'s heap still climbs by about 2.4 MB per jump, even though its own cache drops old pages. My guess is TanStack Query, which keeps every fetched page for five minutes by default.'],
  ['Tests.', 'There are none yet, and tests are still on the TODO list.'],
]

const STACK: [string, string[]][] = [
  ['Frontend', ['Next.js 15', 'React 19', 'TypeScript', 'Tailwind v4', 'shadcn/ui', 'TanStack Table', 'TanStack Virtual', 'TanStack Query', 'dnd-kit']],
  ['Backend', ['tRPC 11', 'Prisma 7', 'PostgreSQL', 'Better Auth', 'Zod']],
  ['Tooling', ['Postman', 'faker', 'Vercel']],
]

export default function AirtablePage() {
  return (
    <PageShell>
      <div data-stagger style={{ maxWidth: 720, margin: '0 auto', padding: '36px 20px' }}>

        <PageHeader />

        {/* breadcrumb */}
        <div data-stagger-item style={{ fontFamily: MONO, fontSize: 'var(--text-xs)', color: 'var(--muted)', marginBottom: 16 }}>
          <span style={{ color: 'var(--accent)' }}>❯</span>{' '}
          cd <Link href="/projects" style={{ color: 'var(--fg)', textDecoration: 'none' }}>projects</Link>/airtable
        </div>

        {/* Banner */}
        <div data-stagger-item style={{ padding: '24px 0', marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', columnGap: 12, rowGap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
            <h1 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 'var(--text-2xl)', lineHeight: 1.1, margin: 0, letterSpacing: '-0.025em', color: 'var(--fg)' }}>Airtable clone</h1>
            <span className="pill" style={{ fontFamily: MONO }}>solo build · jan 2026</span>
          </div>
          <p style={{ ...PROSE, fontSize: 'var(--text-base)', margin: 0 }}>
            A copy of Airtable&apos;s grid: bases, tables, text and number columns, and a spreadsheet you can drive from the keyboard. The hard part was size. The app has a button that adds 100,000 rows to a table, and the last two days of work went on making a table that big scroll without freezing the tab.
          </p>
        </div>

        {/* Hero: the app itself */}
        <div data-stagger-item style={{ marginBottom: 24 }}>
          <Shot
            src="/projects/airtable/grid.webp"
            alt="The grid for a table called Home lab firewall log: time, source, destination, port, protocol, bytes and action columns, a selected cell in row 3, and a 100,000 rows badge in the corner"
            width={2880}
            height={1772}
            caption="A 100,000-row table with one cell selected, filled by my own seed script because the app's generator stopped partway (more below). All screenshots are from a local demo account with seeded data, on the January build. A personal clone, not affiliated with Airtable; the logo in the app is Airtable's, via Icons8."
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
            I built it alone between 5 and 17 January 2026, in 86 commits. Filters, sorts and views were next, and never got built.
          </p>
        </div>

        {/* Four loaders */}
        <div className="section-label" style={{ fontFamily: MONO }}>Four ways to load rows</div>
        <p style={{ ...PROSE, margin: '0 0 14px' }}>
          I wrote the grid&apos;s row loading four times, each version aimed at the previous one&apos;s worst problem. Offset paging asks for &ldquo;skip 50,000 rows, then give me 100&rdquo;; cursor paging asks for &ldquo;the 100 rows after this one&rdquo;.
        </p>
        <div style={{ ...BLOCK, marginBottom: 18 }}>
          {LOADERS.map(([when, what], i) => (
            <div key={i} style={{ display: 'flex', flexWrap: 'wrap', columnGap: 16 }}>
              <span style={{ color: 'var(--accent)', width: 64, flexShrink: 0 }}>{when}</span>
              <span style={{ color: 'var(--muted)', flex: '1 1 200px' }}>{what}</span>
            </div>
          ))}
        </div>
        <p style={{ ...PROSE, margin: '0 0 18px' }}>
          The third version&apos;s commit message says &ldquo;lag is still persistent&rdquo;, and the numbers agree. I rebuilt the current code with that commit&apos;s loader swapped back in, and scrolled both builds down the same 100,000-row table in Chrome. The older grid&apos;s virtualiser still drew every row it had loaded: by row 35,000 it had 35,501 rows drawn in the page and 1,257 MB of JavaScript heap. After ten minutes it still had not reached row 50,000, and not a single frame completed in the five seconds of scrolling after that.
        </p>
        <div data-reveal>
          <ArticleChart block={HEAP_CHART} />
        </div>
        <p style={{ ...PROSE, margin: '0 0 18px' }}>
          In my 900 px-tall browser window, the current grid drew 43 to 63 rows wherever I was in the table. Pages that have not arrived yet show as grey skeleton rows. Jumping straight to row 50,000 took 0.42 s. In five seconds of steady scrolling from there, in headless Chrome, the slowest frame took 34 ms and the middle of the screen never showed a skeleton.
        </p>
        <div data-reveal style={{ marginBottom: 18 }}>
          <Shot
            src="/projects/airtable/jump.webp"
            alt="The grid after a jump to row 61,841: every row shows grey skeleton bars in place of values while its page loads"
            width={2880}
            height={1772}
            caption="Mid-jump: skeleton rows hold the space while the pages from row 61,841 load. I delayed the responses by four seconds for this shot; normally the skeletons are gone in a fraction of a second."
          />
        </div>
        <div data-reveal style={{ marginBottom: 18 }}>
          <Shot
            src="/projects/airtable/row-73k.webp"
            alt="The grid showing rows 73,413 onward with real values and one selected cell"
            width={2880}
            height={1772}
            caption="Rows 73,413 onward, a moment after a jump."
          />
        </div>
        <p style={{ ...PROSE, margin: '0 0 18px' }}>
          On the server, the stored position does the work. A page is &ldquo;positions 50,000 to 50,099&rdquo;, which is one indexed lookup however deep it sits. Offset paging has to skip rows first, so it slows down with depth, though at this size only by a few milliseconds.
        </p>
        <div data-reveal style={{ marginBottom: 22 }}>
          <ArticleChart block={DEPTH_CHART} />
        </div>

        {/* Data model */}
        <div className="section-label" style={{ fontFamily: MONO }}>Data model</div>
        <p style={{ ...PROSE, margin: '0 0 14px' }}>
          A table&apos;s columns are rows in the database too, and every value is a row of its own.
        </p>
        <div style={{ ...BLOCK, marginBottom: 40 }}>
          {MODEL.map(([part, desc]) => (
            <div key={part} style={{ display: 'flex', flexWrap: 'wrap', columnGap: 16 }}>
              <span style={{ color: 'var(--accent)', width: 64, flexShrink: 0 }}>{part}</span>
              <span style={{ color: 'var(--muted)', flex: '1 1 200px' }}>{desc}</span>
            </div>
          ))}
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

        {/* Selection shot */}
        <div data-reveal style={{ marginBottom: 40 }}>
          <Shot
            src="/projects/airtable/select.webp"
            alt="Rows 4 to 7 ticked with a bar reading 4 rows selected, Delete, Clear selection, and the Action cell in row 10 open for editing with the word Block"
            width={2880}
            height={1775}
            caption="Four rows picked with a Shift-click, and an edit in progress in row 10."
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

        {/* Mobile shot */}
        <div data-reveal style={{ marginBottom: 40 }}>
          <Shot
            src="/projects/airtable/grid-mobile.webp"
            alt="The clone on a phone: the sidebar with Create new and Grid view takes about two-thirds of the width, and the grid shows only part of the Time column"
            width={1170}
            height={2532}
            caption="On a phone. The layout is desktop-first: the sidebar keeps its width and the grid gets what is left."
            variant="mobile"
          />
        </div>

        {/* What I'd do next */}
        <div className="section-label" style={{ fontFamily: MONO }}>What I&apos;d fix next</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 40 }}>
          {NEXT.map(([lead, body]) => (
            <p key={lead} style={{ ...PROSE, color: 'var(--muted)', margin: 0 }}>
              <span style={{ color: 'var(--fg-dim)', fontWeight: 600 }}>{lead}</span> {body}
            </p>
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
          <Link href="/projects" className="btn btn-ghost" style={{ fontFamily: MONO }}>← back to projects</Link>
        </div>

      </div>
    </PageShell>
  )
}
