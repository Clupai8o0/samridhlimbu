import type { Metadata } from 'next'
import Link from 'next/link'
import { PageShell } from '@/components/page-shell'
import { PageHeader } from '@/components/page-header'
import { Shot } from '@/components/case-study/shot'
import { ArticleChart } from '@/components/article-chart'
import { CodePre } from '@/components/code-pre'
import type { ChartBlock } from '@/lib/writing'

const DESCRIPTION =
  'A catalogue API and web app for an imagined gallery of Aboriginal Australian art, built for SIT331 at Deakin in May 2026. Express and MongoDB behind, Next.js in front, Google sign-in turned into curator and viewer roles, 126 passing tests.'

export const metadata: Metadata = {
  title: 'Art Gallery · SIT331',
  description: DESCRIPTION,
  alternates: { canonical: '/projects/art-gallery' },
  openGraph: {
    type: 'article',
    url: '/projects/art-gallery',
    title: 'Art Gallery · SIT331 · Samridh Limbu',
    description: DESCRIPTION,
    images: [{ url: '/projects/art-gallery/gallery.webp', width: 2880, height: 1518, alt: 'The public gallery page: 9 works, style and tag filters, a search box and a grid of flat placeholder images' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Art Gallery · SIT331 · Samridh Limbu',
    description: DESCRIPTION,
    images: ['/projects/art-gallery/gallery.webp'],
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
  { k: 'domains', v: '5' },
  { k: 'API routes', v: '36' },
  { k: 'tests passing', v: '126' },
  { k: 'line coverage', v: '93%' },
]

const PROBE_LOG = `anonymous                          GET    /artifacts             -> 200 total=9
curator (drafts included)          GET    /artifacts             -> 200 total=12
anonymous                          GET    /exhibitions/:id       -> 200 works=4
curator (drafts included)          GET    /exhibitions/:id       -> 200 works=5
anonymous                          POST   /artifacts             -> 401 UNAUTHORIZED: Unauthorized
curator role, wrong signing key    POST   /artifacts             -> 401 UNAUTHORIZED: Unauthorized
viewer                             POST   /artifacts             -> 403 FORBIDDEN: Forbidden
curator                            POST   /artifacts             -> 201 created
curator, no title                  POST   /artifacts             -> 400 VALIDATION_ERROR: Validation failed
curator, artist still has works    DELETE /artists/:id           -> 409 CONFLICT: Cannot delete artist with existing artifacts
curator, ends before it starts     POST   /exhibitions           -> 422 UNPROCESSABLE: endDate must be greater than or equal to startDate
curator, publish it                PATCH  /artifacts/:id         -> 200 updated
curator, published back to draft   PATCH  /artifacts/:id         -> 422 UNPROCESSABLE: Cannot return an artifact to draft once it has been published
curator                            DELETE /artifacts/:id         -> 204`

const COVERAGE_CHART: ChartBlock = {
  type: 'chart',
  kind: 'bar',
  title: 'Backend test coverage',
  subtitle: 'Jest with --coverage over backend/src, my re-run on 28 Oct 2026. 126 of 126 tests passed.',
  caption: 'Lines 535 of 573, statements 580 of 633, functions 99 of 107, branches 187 of 268.',
  unit: '%',
  categories: ['lines', 'statements', 'functions', 'branches'],
  series: [{ name: 'covered', values: [93.4, 91.6, 92.5, 69.8] }],
}

const TIMELINE = [
  { date: '21–22 May 2026', title: 'A scaffold, then each domain filled in', body: 'The first commit already laid out all five domains. The commits up to 0.7 added the Mongo connection and request logging, then Swagger docs and tests for art styles, artifacts, exhibitions and tags, then authentication.' },
  { date: '22–23 May 2026', title: 'Front end and Google sign-in', body: 'The Next.js gallery and curator pages in 0.8, then a change to Google sign-in, bug fixes and a 1.0.0 submission polish.' },
  { date: '27–30 May 2026', title: 'Docs, curator UI and a Postman run', body: 'Diagrams and the presentation, a bigger curator UI, an admin role taken out to leave just curator and viewer, and a Newman report of the Postman collection.', current: true },
]

const DECISIONS = [
  ['roles inside a signed token', 'a users collection', 'The API never talks to Google. Auth.js does the sign-in, checks the email against a CURATOR_EMAILS list, and signs a 7-day HS256 token that carries the role. Express only checks the signature, so it keeps no sessions and there is no users table to keep in step. The price is revocation, below.'],
  ['public reads that look at the token', 'separate admin endpoints', 'The read routes that return works (the work list and pages, an exhibition and its works, an artist\'s works) accept an optional token. With none, they return published works only. A curator token adds drafts and archived works on the same URL. A bad or expired token there counts as no token rather than an error, and an unpublished work answers 404, not 403, so the public cannot tell it exists.'],
  ['integrity checks in the services', 'trusting the database', 'MongoDB has no foreign keys, so the service layer does that job. Deleting an artist or style that still has works returns 409. Deleting a tag removes it from every work, and deleting a work removes it from every exhibition. Creates and updates check that the artist, style and tags they point at exist.'],
  ['no way back to draft', 'free status edits', 'A work starts as a draft and can then be published or archived. Once it has left draft, sending it back returns 422, so a published work cannot be hidden again by quietly marking it as a draft.'],
  ['one error shape', 'whatever each route returns', 'Typed error classes for 400, 401, 403, 404, 409 and 422 all pass through one handler, which answers with an error code, a message and a details list. Lists always come back as data plus page metadata.'],
]

const STACK: [string, string[]][] = [
  ['API', ['Node.js', 'Express 4', 'Mongoose 9', 'MongoDB', 'jsonwebtoken', 'Helmet', 'express-rate-limit', 'Swagger UI']],
  ['Front end', ['Next.js 16', 'React 19', 'TypeScript', 'Tailwind v4', 'Auth.js v5', 'Google sign-in']],
  ['Tests', ['Jest', 'Supertest', 'mongodb-memory-server', 'Postman', 'Newman']],
]

export default function ArtGalleryPage() {
  return (
    <PageShell>
      <div data-stagger style={{ maxWidth: 720, margin: '0 auto', padding: '36px 20px' }}>

        <PageHeader />

        {/* breadcrumb */}
        <div data-stagger-item style={{ fontFamily: MONO, fontSize: 'var(--text-xs)', color: 'var(--muted)', marginBottom: 16 }}>
          <span style={{ color: 'var(--accent)' }}>❯</span>{' '}
          cd <Link href="/projects" style={{ color: 'var(--fg)', textDecoration: 'none' }}>projects</Link>/art-gallery
        </div>

        {/* Banner */}
        <div data-stagger-item style={{ padding: '24px 0', marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', columnGap: 12, rowGap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
            <h1 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 'var(--text-2xl)', lineHeight: 1.1, margin: 0, letterSpacing: '-0.025em', color: 'var(--fg)' }}>Art Gallery</h1>
            <span className="pill" style={{ fontFamily: MONO }}>uni · SIT331 · T1 2026</span>
          </div>
          <p style={{ ...PROSE, fontSize: 'var(--text-base)', margin: 0 }}>
            A catalogue for an imagined gallery of Aboriginal Australian art. Anyone can browse the published works and exhibitions. Curators sign in with Google to edit the catalogue, through a REST API on Express and MongoDB with a Next.js site in front.
          </p>
        </div>

        {/* Hero */}
        <div data-stagger-item style={{ marginBottom: 16 }}>
          <Shot
            src="/projects/art-gallery/gallery.webp"
            alt="The public Gallery page: 9 works, style filters (Painting, Printmaking, Textile, Works on paper), tag filters, a search box, and a row of four cards with flat geometric placeholder images by Demo Artists A to D"
            width={2880}
            height={1518}
            caption="The public gallery. A visitor with no account sees the 9 published works out of 12."
            priority
          />
        </div>
        <p data-stagger-item style={{ ...PROSE, fontSize: 13, color: 'var(--muted)', margin: '0 0 32px' }}>
          Every screen here is from a copy running on my laptop with placeholder data. The artists are Demo Artist A to E and the pictures are flat shapes I drew with a script. They are not real artworks. The repo&apos;s own seed names real artists, so I kept it out of the shots.
        </p>

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
            Task 5.2HD in SIT331 at Deakin. The brief was to pick three to five bounded contexts in a real domain and build a documented, tested service for them. I picked a gallery catalogue with five: artists, artifacts (the code&apos;s word for the works), art styles, exhibitions and tags, each with its own model, routes and service.
          </p>
          <p style={{ ...PROSE, margin: 0 }}>
            It was built in 23 commits between 21 and 30 May 2026, with a requirements document, architecture and data model notes, diagrams and a Postman collection alongside the code. It was never deployed, so there is no live site.
          </p>
        </div>

        {/* Timeline */}
        <div className="section-label" style={{ fontFamily: MONO }}>Timeline</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 22, marginBottom: 40, paddingLeft: 18, position: 'relative' }}>
          {TIMELINE.map((t) => (
            <div key={t.title} style={{ position: 'relative' }}>
              <span data-timeline-dot style={{ position: 'absolute', left: -18, top: 6, width: 8, height: 8, borderRadius: 999, background: t.current ? 'var(--accent)' : 'var(--muted)' }} />
              <div style={{ fontFamily: MONO, fontSize: 'var(--text-xs)', color: 'var(--muted)', marginBottom: 4 }}>{t.date}</div>
              <div style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 'var(--text-base)', color: 'var(--fg)', marginBottom: 4 }}>{t.title}</div>
              <div style={{ ...PROSE }}>{t.body}</div>
            </div>
          ))}
        </div>

        {/* Public side */}
        <div className="section-label" style={{ fontFamily: MONO }}>The public side</div>
        <p style={{ ...PROSE, margin: '0 0 20px' }}>
          Visitors can search titles and descriptions through a MongoDB text index, filter by style or tag, and open a work or an exhibition, and each work comes back from the API with its artist, style and tags already filled in. None of it needs an account.
        </p>
        <div data-reveal style={{ marginBottom: 24 }}>
          <Shot
            src="/projects/art-gallery/artwork.webp"
            alt="A work page for Red sun over blue by Demo Artist C: a flat image of a red circle on two bands of blue, a Published badge, and rows for year 2019, medium Acrylic on canvas, style Painting and the tag Colour study"
            width={2880}
            height={1520}
            caption="A work page. The description says plainly that it is a placeholder."
          />
        </div>
        <div data-reveal style={{ marginBottom: 24 }}>
          <Shot
            src="/projects/art-gallery/exhibition.webp"
            alt="The Colour and form exhibition page, 3 October to 14 December 2026, listing 4 works"
            width={2880}
            height={1650}
            caption="An exhibition. It holds five works, but one is a draft, so the public sees four."
          />
        </div>
        <div data-reveal style={{ marginBottom: 40 }}>
          <Shot
            src="/projects/art-gallery/gallery-phone.webp"
            alt="The gallery on a phone: the title, 9 works, a search box, wrapped style and tag chips, and two cards side by side"
            width={1170}
            height={2418}
            caption="The gallery on a phone, where the filter chips wrap and the cards drop to two across."
            variant="mobile"
          />
        </div>

        {/* Curators */}
        <div className="section-label" style={{ fontFamily: MONO }}>Who can do what</div>
        <p style={{ ...PROSE, margin: '0 0 14px' }}>
          There are two roles. Anyone who signs in with Google is a viewer, and an email on the curator list gets the curator role, which includes everything a viewer can do. All 24 routes that change data need a valid token with the curator role. The 12 read routes are public.
        </p>
        <p style={{ ...PROSE, margin: '0 0 20px' }}>
          The front end checks the same role. The Curator link only shows for curators, and the dashboard turns anyone else away. Google sign-in is not set up on my copy, so for these shots I made the session cookies locally with Auth.js&apos;s own encoder and a local secret.
        </p>
        <div data-reveal style={{ marginBottom: 24 }}>
          <Shot
            src="/projects/art-gallery/curator.webp"
            alt="The curator dashboard: a Curator nav with Dashboard and new artifact, exhibition, artist, art style and tag links, and an Artifacts list of 12 with one Archived, two Draft and nine Published, each with an Edit link"
            width={2880}
            height={2240}
            caption="Signed in as a curator. The list holds all 12 works, drafts and the archived one included, and there is a Curator link in the top bar."
          />
        </div>
        <div data-reveal style={{ marginBottom: 24 }}>
          <Shot
            src="/projects/art-gallery/viewer-403.webp"
            alt="The curator page for a viewer: 403 Forbidden, Curator access required, Your account has the viewer role, and a Browse Gallery button"
            width={2880}
            height={900}
            caption="The same address for a signed-in viewer, who gets no Curator link and a refusal. The message still says to ask an administrator, though the role really comes from the curator email list."
          />
        </div>
        <div data-reveal style={{ marginBottom: 24 }}>
          <Shot
            src="/projects/art-gallery/edit-artifact.webp"
            alt="The Edit Artifact form for Red sun over blue: title, description, artist and style dropdowns, year, medium, image URL, status Published, tag checkboxes, Save changes and Cancel, and a red Delete artifact button under Danger zone"
            width={2880}
            height={2360}
            caption="A curator editing a work, with delete kept apart at the bottom."
          />
        </div>
        <p style={{ ...PROSE, margin: '0 0 14px' }}>
          The API enforces the same rules on its own. I ran this against my copy as nobody, as a viewer and as a curator, plus a curator token signed with the wrong key.
        </p>
        <div data-reveal style={{ marginBottom: 40 }}>
          <CodePre style={LOG} code={PROBE_LOG} />
          <div style={LOG_CAPTION}>Responses from the local API, 28 Oct 2026, from a probe script I wrote for this page. IDs shortened to :id.</div>
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

        {/* Testing */}
        <div className="section-label" style={{ fontFamily: MONO }}>Testing</div>
        <p style={{ ...PROSE, margin: '0 0 20px' }}>
          The tests drive the real Express app through Supertest against a throwaway MongoDB that runs in memory, so each request goes through the same middleware and services as in production. There are 126 of them in 9 files. The README says 128, but my re-run counted 126 and all passed.
        </p>
        <div data-reveal>
          <ArticleChart block={COVERAGE_CHART} />
        </div>
        <p style={{ ...PROSE, margin: '0 0 40px' }}>
          Branch coverage is the weak one. The error handler&apos;s cases for Mongoose validation errors and duplicate keys never run in a test. Separately, the Postman collection was run through Newman on 30 May: the committed report shows 190 requests and 405 assertions over 5 iterations, none failed. I did not re-run that one.
        </p>

        {/* What I'd do differently */}
        <div className="section-label" style={{ fontFamily: MONO }}>What I&apos;d do differently</div>
        <p style={{ ...PROSE, color: 'var(--muted)', margin: '0 0 14px' }}>
          I would make roles revocable. A curator&apos;s role is fixed inside the token for 7 days, so taking an email off the list does nothing until the token runs out. A small users collection, or short tokens that get refreshed, would fix that.
        </p>
        <p style={{ ...PROSE, color: 'var(--muted)', margin: '0 0 14px' }}>
          Refuse to start without secrets. If the signing secret is missing, the front end falls back to <code style={CODE}>&quot;secret&quot;</code> and the API to a development string. Both should stop at boot instead.
        </p>
        <p style={{ ...PROSE, color: 'var(--muted)', margin: '0 0 40px' }}>
          The curator side also needs finishing. The exhibition page never sends the curator&apos;s token, so curators do not see drafts there even though the API would return them. On a phone the curator menu runs off the edge of the screen.
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
