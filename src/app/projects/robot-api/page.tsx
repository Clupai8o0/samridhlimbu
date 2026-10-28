import type { Metadata } from 'next'
import Link from 'next/link'
import { PageShell } from '@/components/page-shell'
import { PageHeader } from '@/components/page-header'
import { Shot } from '@/components/case-study/shot'
import { ArticleChart } from '@/components/article-chart'
import { CodePre } from '@/components/code-pre'
import type { ChartBlock } from '@/lib/writing'

const DESCRIPTION =
  'A REST API for a moon robot simulator, built in C# and ASP.NET Core for SIT331 at Deakin, T1 2026. Robot commands, maps and users live in PostgreSQL, behind Basic auth with BCrypt, two roles, paged lists and a request log.'

export const metadata: Metadata = {
  title: 'Robot controller API · SIT331',
  description: DESCRIPTION,
  alternates: { canonical: '/projects/robot-api' },
  openGraph: {
    type: 'article',
    url: '/projects/robot-api',
    title: 'Robot controller API · SIT331 · Samridh Limbu',
    description: DESCRIPTION,
    images: [{ url: '/projects/robot-api/swagger.webp', width: 2880, height: 1680, alt: 'The Swagger page of the Robot Controller API, with the Authorize button and the seven Maps endpoints' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Robot controller API · SIT331 · Samridh Limbu',
    description: DESCRIPTION,
    images: ['/projects/robot-api/swagger.webp'],
  },
}

const MONO = '"JetBrains Mono", var(--font-mono), monospace'
const SANS = 'Inter, var(--font-inter), sans-serif'
const DISPLAY = 'Manrope, var(--font-manrope), sans-serif'
const GREEN = 'var(--term-green)'

const PROSE = { fontFamily: SANS, fontSize: 15, color: 'var(--fg-dim)', lineHeight: 1.65, maxWidth: 640 }

const LOG = {
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

const LOG_CAPTION = { fontFamily: MONO, fontSize: 'var(--text-xs)', color: 'var(--muted)', lineHeight: 1.5, marginTop: 8 }

const CODE = { fontFamily: MONO, fontSize: '0.9em' }

const METRICS = [
  { k: 'endpoints', v: '20' },
  { k: 'admin only', v: '10' },
  { k: 'Newman checks passed (in-memory API)', v: '160' },
  { k: 'median signed-in request', v: '119 ms' },
]

const TIMELINE = [
  { task: '2.1P to 2.2P', title: 'A minimal API in memory', body: 'Robot commands held in a list and one map size held in Program.cs, served by minimal API routes. 2.2P added a Postman collection to try them.' },
  { task: '3.2P', title: 'Controllers', body: 'The routes moved into a RobotCommandsController and a MapsController under /api. The data was still in memory.' },
  { task: '4.1P', title: 'PostgreSQL', body: 'Hand-written, parameterised SQL through Npgsql. The map table works out whether a map is square in a generated column.' },
  { task: '4.2C to 4.4H', title: 'Three storage layers behind one interface', body: '4.2C put storage behind an interface, with an ADO class and a generic repository that maps rows to objects with FastMember. 4.3D added EF Core, scaffolded from the database, and logged the SQL that EF writes for each method. One line per interface in Program.cs picks which one runs. 4.4H moved to snake_case tables and columns, with custom scaffolding templates.' },
  { task: '5.1P', title: 'Swagger', body: 'XML comments on each action became the Swagger page, with sample requests and the response codes each action can return. A stylesheet themes the UI. This line of work builds on the 4.1P data classes, not the interface.' },
  { task: '6.1P', title: 'Users and roles', body: 'A user table with BCrypt hashes, a Basic auth handler, and two policies: AdminOnly and UserOnly.' },
  { task: '7.1P', title: 'Paging and request logs', body: 'Page, limit, sort, search and a filter on the three main lists. A middleware logs each request with an ID. The Postman collection ran five times over in Newman, against the small in-memory API.', current: true },
]

const AUTH_LOG = `POST /api/robot-commands   (no auth)
-> 401

POST /api/robot-commands   (Basic, operator)
-> 403

POST /api/robot-commands   (Basic, admin)
{"name": "HOVER", "isMoveCommand": false, "description": "Hold position for one tick"}
-> 201
Location: http://127.0.0.1:3420/api/robot-commands/8

POST /api/robot-commands   (Basic, admin)
{"name": "hover", "isMoveCommand": false}
-> 409
A command with name 'hover' already exists.

PATCH /api/users/1   (Basic, operator)
-> 403`

const CELL_LOG = `GET /api/maps/3/11-3   (Basic, operator)
-> 200
true

GET /api/maps/3/12-3   (Basic, operator)
-> 400
false`

const REQUEST_LOG = `2381e70d-57ba-4ad6-b4e5-4121bdc1fe5b GET /api/maps 200 190ms
dafd696c-2853-468a-9d93-f4bb36248592 GET /api/maps/3/11-3 200 175ms
07363db5-7674-4275-accf-edcaafea89d9 GET /api/maps/3/12-3 400 189ms
a2ebac54-b248-4345-9a69-4b6f8fdd4f53 POST /api/robot-commands 401 1ms
620b6a2f-5b60-41c7-b4a5-e24bae8ec3d4 POST /api/robot-commands 403 101ms
f9220aa5-bbcd-4cb5-9954-4e8dbff6b986 POST /api/robot-commands 201 130ms
17a18c10-a1a3-4052-8a67-d56d40a320b1 POST /api/robot-commands 409 102ms
0055d0f8-48e3-4809-9615-d5b5e3762ffd PATCH /api/users/1 403 101ms`

const NEWMAN_LOG = `                     executed   failed
iterations                  5        0
requests                   65        0
test-scripts               65        0
prerequest-scripts          0        0
assertions                160        0

total run duration: 719ms
total data received: 1.54kB (approx)
average response time: 3ms [min: 1ms, max: 58ms, s.d.: 9ms]`

const AUTH_CHART: ChartBlock = {
  type: 'chart',
  kind: 'bar',
  title: 'Time inside the API per request',
  subtitle: 'Median of 30 requests each to GET /api/robot-commands/1, from the API’s own request log',
  unit: 'ms',
  categories: ['no auth header', 'wrong password', 'signed in'],
  series: [{ name: 'median', values: [0, 122.5, 119] }],
}

const DECISIONS = [
  ['a fixed list of sort columns', 'the sort text in the SQL', 'Values such as the search text go in as parameters, but a column name cannot be a parameter. So the sort field is looked up in a small dictionary of allowed columns, a leading minus flips it to descending, and anything else sorts by id. Nothing the caller types reaches the SQL as text.'],
  ['two queries per page', 'loading the whole table', 'Each list runs a COUNT with the same filters, then the page itself with LIMIT and OFFSET. Page is at least 1 and limit is held between 1 and 100, so a caller cannot ask for the whole table in one go. The reply carries page, limit, total and totalPages.'],
  ['policies on each action', 'role checks inside the code', 'Every action is tagged AdminOnly or UserOnly, except sign-up. Of the 20 endpoints, 10 are admin only: every create, update and delete on maps and commands, plus both user lists and replacing or deleting a user. The one rule a policy cannot express, that only the owner or an admin may change a user’s email and password, is a check on the caller’s ID and role inside that action.'],
  ['BCrypt', 'storing what was sent', 'Passwords are hashed with BCrypt before they are stored, each with its own salt. The stored hashes start with $2a$11$, so each check does 2^11 rounds of key setup. That is what makes guessing slow, and most of why every signed-in request is slow (see below).'],
  ['names that ignore case', 'exact matches', 'Before a create, the API looks for the name with ILIKE, so HOVER and hover count as the same command and the second gets a 409. Map names work the same way.'],
]

const STACK: [string, string[]][] = [
  ['API', ['C#', '.NET 10', 'ASP.NET Core controllers']],
  ['Data', ['PostgreSQL', 'Npgsql (SQL by hand)', 'EF Core 9 (4.3D to 4.4H)']],
  ['Auth', ['Basic auth handler', 'BCrypt.Net-Next', 'role policies']],
  ['Docs', ['Swashbuckle', 'XML comments']],
  ['Testing', ['Postman', 'Newman']],
]

export default function RobotApiPage() {
  return (
    <PageShell>
      <div data-stagger style={{ maxWidth: 720, margin: '0 auto', padding: '36px 20px' }}>

        <PageHeader />

        {/* breadcrumb */}
        <div data-stagger-item style={{ fontFamily: MONO, fontSize: 'var(--text-xs)', color: 'var(--muted)', marginBottom: 16 }}>
          <span style={{ color: 'var(--accent)' }}>❯</span>{' '}
          cd <Link href="/projects" style={{ color: 'var(--fg)', textDecoration: 'none' }}>projects</Link>/robot-api
        </div>

        {/* Banner */}
        <div data-stagger-item style={{ padding: '24px 0', marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', columnGap: 12, rowGap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
            <h1 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 'var(--text-2xl)', lineHeight: 1.1, margin: 0, letterSpacing: '-0.025em', color: 'var(--fg)' }}>Robot controller API</h1>
            <span className="pill" style={{ fontFamily: MONO }}>uni · SIT331 · T1 2026</span>
          </div>
          <p style={{ ...PROSE, fontSize: 'var(--text-base)', margin: 0 }}>
            A REST API for a robot that drives around a grid on the Moon. It stores the commands the robot understands, the maps it can drive on, and the people allowed to change them. I built it up task by task through SIT331 at Deakin, from a list in memory to PostgreSQL with sign-in, two roles, paged lists and a request log.
          </p>
        </div>

        {/* Hero */}
        <div data-stagger-item style={{ marginBottom: 24 }}>
          <Shot
            src="/projects/robot-api/swagger.webp"
            alt="The Swagger page titled Robot Controller API, OAS 3.0, described as a new backend service that provides resources for the Moon robot simulator, with an Authorize button and the Maps group: list, create, square maps only, get, update and delete by ID, and a check for whether a cell is on the map. Each row has a lock icon."
            width={2880}
            height={1680}
            caption="The Swagger page, generated from the XML comments in the controllers. Swagger marks every endpoint with a Basic auth lock."
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
            SIT331 builds one backend across the trimester. Each task adds a layer to the same robot controller API, so the repo holds a folder per task. The robot itself is a console simulator that takes commands such as PLACE, MOVE, LEFT, RIGHT and REPORT. The API is the part I wrote.
          </p>
          <p style={{ ...PROSE, margin: 0 }}>
            It was never deployed, and the repo is private. Everything below comes from a copy of the 7.1P code that I ran on 28 Oct 2026 against a local PostgreSQL, with made-up commands and maps and two test accounts, one admin and one operator.
          </p>
        </div>

        {/* Timeline */}
        <div className="section-label" style={{ fontFamily: MONO }}>How it grew</div>
        <div style={{ marginBottom: 40 }}>
          {TIMELINE.map((e, i) => (
            <div key={e.task} style={{ position: 'relative', marginLeft: 5, paddingLeft: 22, paddingBottom: i === TIMELINE.length - 1 ? 0 : 20 }}>
              <div data-timeline-dot style={{ position: 'absolute', left: -6, top: 4, width: 11, height: 11, borderRadius: 6, background: e.current ? 'var(--accent)' : 'var(--bg)', border: `1.5px solid ${e.current ? 'var(--accent)' : 'var(--muted-2)'}` }} />
              <div style={{ fontFamily: MONO, fontSize: 'var(--text-xs)', color: 'var(--muted)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{e.task}</div>
              <div style={{ fontFamily: SANS, fontSize: 15, fontWeight: 600, color: 'var(--fg)', marginBottom: 4 }}>{e.title}</div>
              <div style={{ fontFamily: SANS, fontSize: 'var(--text-sm)', color: 'var(--muted)', lineHeight: 1.6, maxWidth: 560 }}>{e.body}</div>
            </div>
          ))}
        </div>

        {/* Requests */}
        <div className="section-label" style={{ fontFamily: MONO }}>Who may do what</div>
        <p style={{ ...PROSE, margin: '0 0 14px' }}>
          Anyone signed in can read commands and maps. Only an admin can change them. Here is one create request sent four ways, then an operator trying to change the admin&apos;s password.
        </p>
        <div data-reveal style={{ marginBottom: 24 }}>
          <CodePre style={LOG} code={AUTH_LOG} />
          <div style={LOG_CAPTION}>Requests to the local copy, 28 Oct 2026, trimmed to the request bodies, status lines, Location header and error text. The Basic header is shown only as the account&apos;s role.</div>
        </div>
        <p style={{ ...PROSE, margin: '0 0 14px' }}>
          Lists come back a page at a time. This is the maps list in Swagger after signing in as the operator, two to a page, widest first.
        </p>
        <div data-reveal style={{ marginBottom: 24 }}>
          <Shot
            src="/projects/robot-api/maps-response.webp"
            alt="Swagger response for http://127.0.0.1:3420/api/maps?Page=1&Limit=2&Sort=-columns: code 200, a body with two maps, Lava tube at 30 by 2 and Tranquility grid at 20 by 20, then page 1, limit 2, total 5, totalPages 3, and response headers ending in www-authenticate Basic and an x-request-id"
            width={2800}
            height={1470}
            caption="GET /api/maps with Page=1, Limit=2 and Sort=-columns. Five maps in total, so three pages, and an X-Request-Id header."
          />
        </div>
        <p style={{ ...PROSE, margin: '0 0 14px' }}>
          One endpoint checks whether a cell is on a map. Cells count from 0, so on the 12 by 4 Crater rim map, column 11 is the last one.
        </p>
        <div data-reveal style={{ marginBottom: 24 }}>
          <CodePre style={LOG} code={CELL_LOG} />
          <div style={LOG_CAPTION}>Map 3 is Crater rim, 12 columns by 4 rows, from the seeded data.</div>
        </div>
        <p style={{ ...PROSE, margin: '0 0 14px' }}>
          The 7.1P middleware gives every request an ID, sends it back in a header, and logs the method, path, status and time taken.
        </p>
        <div data-reveal style={{ marginBottom: 40 }}>
          <CodePre style={LOG} code={REQUEST_LOG} />
          <div style={LOG_CAPTION}>Server log lines for the same probe requests as the two blocks above (the maps line is an API call, not the Swagger one), 28 Oct 2026, without the logger&apos;s prefix line.</div>
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

        {/* Cost of auth */}
        <div className="section-label" style={{ fontFamily: MONO }}>What sign-in costs</div>
        <p style={{ ...PROSE, margin: '0 0 20px' }}>
          Basic auth sends the email and password with every request, and the handler checks the password against its BCrypt hash every time. The request log shows what that costs. A request with no header is turned away before any check. A wrong password never reaches the endpoint, yet it takes about as long as a right one, so nearly all of that time goes on looking up the user and checking the BCrypt hash.
        </p>
        <div data-reveal style={{ marginBottom: 40 }}>
          <ArticleChart block={AUTH_CHART} />
          <div style={LOG_CAPTION}>Measured on 28 Oct 2026 on a MacBook, against the local copy and a local PostgreSQL. With no header the log shows 0 ms for all 30.</div>
        </div>

        {/* Testing */}
        <div className="section-label" style={{ fontFamily: MONO }}>Testing</div>
        <p style={{ ...PROSE, margin: '0 0 14px' }}>
          The 7.1P Postman collection has 13 requests with 32 checks between them: status codes, body shapes, the Location header on a create, and that the move list holds only move commands. Newman ran it five times over in the task report, 29 May 2026. I ran it again on 28 Oct 2026 and got the same result.
        </p>
        <div data-reveal style={{ marginBottom: 24 }}>
          <CodePre style={LOG} code={NEWMAN_LOG} />
          <div style={LOG_CAPTION}>Newman summary from the re-run, 28 Oct 2026, with the table&apos;s box lines removed.</div>
        </div>
        <p style={{ ...PROSE, margin: '0 0 40px' }}>
          That collection tests a small in-memory API kept in the 7.1P folder (<code style={CODE}>/robot-commands</code>, <code style={CODE}>/robot-map</code>), not the PostgreSQL one. The collections kept for the PostgreSQL API send 13 requests each but check nothing, so the checks on this page are the ones I ran by hand.
        </p>

        {/* What I'd do differently */}
        <div className="section-label" style={{ fontFamily: MONO }}>What I&apos;d do differently</div>
        <p style={{ ...PROSE, color: 'var(--muted)', margin: '0 0 14px' }}>
          Fix sign-up first. <code style={CODE}>POST /api/users</code> is open to anyone and lets the caller pick their own role, which is how I made the admin test account. The user replies also include the password hash, and any signed-in user can fetch any other user by ID.
        </p>
        <p style={{ ...PROSE, color: 'var(--muted)', margin: '0 0 40px' }}>
          Then stop paying for BCrypt on every request: check the password once and hand back a short-lived token. Point the Newman checks at the PostgreSQL API. And update Npgsql, because the build warns that 6.0.5 has a known high-severity advisory.
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
          <Link href="/projects" className="btn btn-ghost" style={{ fontFamily: MONO }}>← back to projects</Link>
        </div>

      </div>
    </PageShell>
  )
}
