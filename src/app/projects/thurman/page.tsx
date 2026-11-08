import type { Metadata } from 'next'
import Link from 'next/link'
import { PageShell } from '@/components/page-shell'
import { pageJsonLd } from '@/lib/seo'
import { PageHeader } from '@/components/page-header'
import { Shot } from '@/components/case-study/shot'
import { Icon } from '@/components/icons'

const DESCRIPTION =
  'Marketing site for Thurman Events Management: About, Services, Team, Gallery and a contact form that emails through a Next.js API route with Nodemailer. Live on Vercel since 2023.'

export const metadata: Metadata = {
  title: 'Thurman Events · events site',
  description: DESCRIPTION,
  alternates: { canonical: '/projects/thurman' },
  openGraph: {
    type: 'article',
    url: '/projects/thurman',
    title: 'Thurman Events · events site · Samridh Limbu',
    description: DESCRIPTION,
    images: [{ url: '/projects/thurman/home.webp', width: 2880, height: 1800, alt: 'Thurman Events Management home hero with gold branding and Contact Us / Learn More buttons' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Thurman Events · events site · Samridh Limbu',
    description: DESCRIPTION,
    images: ['/projects/thurman/home.webp'],
  },
}

const MONO = '"JetBrains Mono", var(--font-mono), monospace'
const SANS = 'Inter, var(--font-inter), sans-serif'
const DISPLAY = 'Manrope, var(--font-manrope), sans-serif'
const GREEN = 'var(--term-green)'

const PROSE = { fontFamily: SANS, fontSize: 15, color: 'var(--fg-dim)', lineHeight: 1.65, maxWidth: 640 }

const METRICS = [
  { k: 'marketing pages', v: '5' },
  { k: 'TypeScript lines', v: '2,669' },
  { k: 'commits (shallow log)', v: '46' },
]

const DECISIONS = [
  ['Pages Router + shared layouts', 'one long landing page', 'About, Services, Team, Gallery and Contact each get a route under pages/, with reusable layouts and content components so the gold branding stays consistent.'],
  ['Nodemailer on an API route', 'a third-party form service', 'The contact form posts to /api/send-email. service/mailService.ts sends through Gmail using NODEMAILER_EMAIL and NODEMAILER_PW from the environment.'],
  ['Framer Motion page transitions', 'instant route changes', 'A transition overlay and nextjs-toploader give feedback while the next page mounts. react-toastify reports whether the email call succeeded.'],
  ['next-sitemap in postbuild', 'hand-written sitemap', 'The production build runs next-sitemap after next build, and robots.txt ships with the static assets.'],
]

const TIMELINE = [
  { date: 'Sep 2023', title: 'Build and SEO pass', body: 'Most of the site lands in early September: pages, gallery assets, logo work, meta descriptions and a robots/sitemap pass.' },
  { date: '16 Sep 2023', title: 'Contact flow closed', body: 'Commit message "done and done" after the email route and content polish.' },
  { date: '4 May 2024', title: 'Sidebar logo fix', body: 'A missing logo in the sidebar was restored while the site stayed live on Vercel.' },
  { date: '26 Dec 2025', title: 'Archive README', body: 'Final README before treating the repo as archived history. The Vercel deployment remains up.', current: true },
]

const STACK: [string, string[]][] = [
  ['Frontend', ['Next.js 13 (Pages Router)', 'React 18', 'TypeScript', 'Tailwind CSS', 'Framer Motion']],
  ['Contact', ['Nodemailer', 'Gmail transport', 'react-toastify']],
  ['Infra', ['Vercel', 'next-sitemap']],
]

export default function ThurmanPage() {
  return (
    <PageShell jsonLd={pageJsonLd(metadata)}>
      <div data-stagger style={{ maxWidth: 720, margin: '0 auto', padding: '36px 20px' }}>

        <PageHeader />

        <div data-stagger-item style={{ fontFamily: MONO, fontSize: 'var(--text-xs)', color: 'var(--muted)', marginBottom: 16 }}>
          <span style={{ color: 'var(--accent)' }}>❯</span>{' '}
          cd <Link href="/projects" style={{ color: 'var(--fg)', textDecoration: 'none' }}>projects</Link>/thurman
        </div>

        <div data-stagger-item style={{ padding: '24px 0', marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', columnGap: 12, rowGap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
            <h1 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 'var(--text-2xl)', lineHeight: 1.1, margin: 0, letterSpacing: '-0.025em', color: 'var(--fg)' }}>Thurman Events</h1>
            <span className="pill" style={{ color: GREEN, fontFamily: MONO }}>● live · 2023</span>
          </div>
          <p style={{ ...PROSE, fontSize: 'var(--text-base)', margin: '0 0 16px' }}>
            A marketing site for Thurman Events Management: services, team, a photo gallery and a contact form that emails the business. Built in September 2023 and still served from Vercel.
          </p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <a href="https://thurman.vercel.app" target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ fontFamily: MONO }}><Icon name="external" size={12} /> live site</a>
            <a href="https://github.com/Clupai8o0/thurman" target="_blank" rel="noopener noreferrer" className="btn" style={{ fontFamily: MONO }}><Icon name="github" size={12} /> source</a>
          </div>
        </div>

        <div data-stagger-item style={{ marginBottom: 16 }}>
          <Shot
            src="/projects/thurman/home.webp"
            alt="Thurman Events Management home hero: gold THURMAN title, Events Management subtitle, Let's create memories together, and Contact Us / Learn More buttons over a dark event photo"
            width={2880}
            height={1800}
            caption="Home hero on the live site, captured 3 Nov 2026."
            priority
          />
        </div>
        <p data-stagger-item style={{ ...PROSE, fontSize: 13, color: 'var(--muted)', margin: '0 0 32px' }}>
          Screenshots are the public Vercel deployment. Team portraits and names on the live Team page belong to the business; this write-up does not repeat them.
        </p>

        <div data-reveal className="cs-metrics" style={{ marginBottom: 40 }}>
          {METRICS.map((m) => (
            <div key={m.k} style={{ padding: '14px 16px 14px 0' }}>
              <div data-count style={{ fontFamily: DISPLAY, fontSize: 'var(--text-lg)', color: 'var(--accent)', fontWeight: 700, letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums' }}>{m.v}</div>
              <div style={{ fontFamily: MONO, fontSize: 'var(--text-xs)', color: 'var(--muted)', marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.06em', lineHeight: 1.4 }}>{m.k}</div>
            </div>
          ))}
        </div>

        <div className="section-label" style={{ fontFamily: MONO }}>Services and contact</div>
        <p style={{ ...PROSE, margin: '0 0 20px' }}>
          The services page walks through what the business offers. Contact collects name, email, subject and message and hands them to Nodemailer; without the two env vars on Vercel the form cannot send.
        </p>
        <div data-reveal style={{ marginBottom: 24 }}>
          <Shot
            src="/projects/thurman/services.webp"
            alt="Thurman services page with gold headings and service sections on a dark background"
            width={2880}
            height={1800}
            caption="Services on the live site."
          />
        </div>
        <div data-reveal style={{ marginBottom: 24 }}>
          <Shot
            src="/projects/thurman/contact.webp"
            alt="Thurman contact page with a form for name, email, subject and message"
            width={2880}
            height={1800}
            caption="Contact form. Submissions go to /api/send-email."
          />
        </div>
        <div data-reveal style={{ marginBottom: 40 }}>
          <Shot
            src="/projects/thurman/home-phone.webp"
            alt="Thurman home hero on a phone: gold title, tagline and the two CTA buttons"
            width={1170}
            height={2532}
            caption="Home on a phone."
            variant="mobile"
          />
        </div>

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

        <div className="section-label" style={{ fontFamily: MONO }}>Stack</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 40 }}>
          {STACK.map(([label, items]) => (
            <div key={label} style={{ display: 'flex', gap: 12, alignItems: 'baseline' }}>
              <span style={{ fontFamily: MONO, fontSize: 'var(--text-xs)', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em', width: 80, flexShrink: 0 }}>{label}</span>
              <span style={{ fontFamily: MONO, fontSize: 'var(--text-xs)', color: 'var(--fg-dim)', lineHeight: 1.6 }}>{items.join(' · ')}</span>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 8, paddingTop: 20, flexWrap: 'wrap' }}>
          <a href="https://thurman.vercel.app" target="_blank" rel="noopener noreferrer" className="btn" style={{ fontFamily: MONO }}><Icon name="external" size={12} /> thurman.vercel.app</a>
          <a href="https://github.com/Clupai8o0/thurman" target="_blank" rel="noopener noreferrer" className="btn" style={{ fontFamily: MONO }}><Icon name="github" size={12} /> source</a>
          <Link href="/projects" className="btn btn-ghost" style={{ fontFamily: MONO }}>← back to projects</Link>
        </div>

      </div>
    </PageShell>
  )
}
