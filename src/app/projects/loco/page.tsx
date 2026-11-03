import type { Metadata } from 'next'
import Link from 'next/link'
import { PageShell } from '@/components/page-shell'
import { pageJsonLd } from '@/lib/seo'
import { PageHeader } from '@/components/page-header'
import { Shot } from '@/components/case-study/shot'
import { CodePre } from '@/components/code-pre'

const DESCRIPTION =
  'Loco is a private Next.js app that browses a local videos folder as an offline course library: hashed paths, per-folder course or folder rendering, progress state, and a PDF viewer. Built in April–May 2024.'

export const metadata: Metadata = {
  title: 'Loco · offline course player',
  description: DESCRIPTION,
  alternates: { canonical: '/projects/loco' },
  openGraph: {
    type: 'article',
    url: '/projects/loco',
    title: 'Loco · offline course player · Samridh Limbu',
    description: DESCRIPTION,
    images: [{ url: '/projects/loco/home.webp', width: 2880, height: 1800, alt: 'Loco home screen listing two demo course folders, Discrete Maths and Intro to Algorithms' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Loco · offline course player · Samridh Limbu',
    description: DESCRIPTION,
    images: ['/projects/loco/home.webp'],
  },
}

const MONO = '"JetBrains Mono", var(--font-mono), monospace'
const SANS = 'Inter, var(--font-inter), sans-serif'
const DISPLAY = 'Manrope, var(--font-manrope), sans-serif'
const GREEN = 'var(--term-green)'

const PROSE = { fontFamily: SANS, fontSize: 15, color: 'var(--fg-dim)', lineHeight: 1.65, maxWidth: 640 }

const METRICS = [
  { k: 'API routes', v: '9' },
  { k: 'TypeScript files', v: '38' },
  { k: 'commits in the clone', v: '7' },
]

const HASH_CODE = `import Cryptr from "cryptr";

const cryptr = new Cryptr("secret");
export const encrypt = (s: string) => cryptr.encrypt(s);
export const decrypt = (s: string) => cryptr.decrypt(s);`

const READ_CODE = `path = nodePath.join(__dirname, "../../../../../public/videos", path);
const files = await fs.promises.readdir(path);
const resp = files.map((file) => ({
  title: file,
  path: nodePath.join(path, file),
  type: fileType(file),
  hash: encrypt(nodePath.join(path, file)),
}));`

const DECISIONS = [
  ['hashed absolute paths in the URL', 'raw filesystem paths', 'Cards link to /folder/<hash> or /course/<hash>. The hash is a Cryptr ciphertext of the absolute path, decrypted only on the server through /api/decrypt, so the browser never sees the disk path.'],
  ['config.json chooses course vs folder', 'one layout for everything', 'Opening a folder writes a default config with renderAs: folder. Setting it to course redirects into the course player with sidebar progress and video state.'],
  ['API routes that read the local disk', 'bundling courses into the app', 'Nine route handlers under app/api cover read-dir, decrypt, course cache and state, folder type and config. Courses live as files under public/videos on the machine that runs the server.'],
  ['file-type icons from the extension', 'a single generic card', 'lib/file-types.ts maps extensions onto video, PDF, image, code, zip and the rest, and the home cards pick a Lucide icon from that type.'],
]

const TIMELINE = [
  { date: '27 Apr 2024', title: 'Project init', body: 'create-next-app scaffold with the App Router, Tailwind and the first shadcn/ui pieces.' },
  { date: '27–30 Apr 2024', title: 'Cache, cards and state', body: 'Course cache and state routes, card truncation, and a fix so a state change did not close the player.' },
  { date: '1–12 May 2024', title: 'Last updates', body: 'Further UI passes. The last commit on 12 May is titled "forgotten updates". The repo stayed private.', current: true },
]

const STACK: [string, string[]][] = [
  ['Frontend', ['Next.js 14', 'React', 'TypeScript', 'Tailwind CSS', 'shadcn/ui', 'Lucide']],
  ['Server', ['App Router API routes', 'Node fs', 'Cryptr', 'sort-array']],
  ['Media', ['Local public/videos tree', 'PDF route']],
]

export default function LocoPage() {
  return (
    <PageShell jsonLd={pageJsonLd(metadata)}>
      <div data-stagger style={{ maxWidth: 720, margin: '0 auto', padding: '36px 20px' }}>

        <PageHeader />

        <div data-stagger-item style={{ fontFamily: MONO, fontSize: 'var(--text-xs)', color: 'var(--muted)', marginBottom: 16 }}>
          <span style={{ color: 'var(--accent)' }}>❯</span>{' '}
          cd <Link href="/projects" style={{ color: 'var(--fg)', textDecoration: 'none' }}>projects</Link>/loco
        </div>

        <div data-stagger-item style={{ padding: '24px 0', marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', columnGap: 12, rowGap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
            <h1 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 'var(--text-2xl)', lineHeight: 1.1, margin: 0, letterSpacing: '-0.025em', color: 'var(--fg)' }}>Loco</h1>
            <span className="pill" style={{ fontFamily: MONO }}>private · 2024</span>
          </div>
          <p style={{ ...PROSE, fontSize: 'var(--text-base)', margin: 0 }}>
            An offline course player for folders of videos, PDFs and notes on disk. Point it at a local <code style={{ fontFamily: MONO, fontSize: '0.9em' }}>public/videos</code> tree and the home page lists each top-level folder as a card. A folder can render as a plain directory or as a course with saved progress.
          </p>
        </div>

        <div data-stagger-item style={{ marginBottom: 16 }}>
          <Shot
            src="/projects/loco/home.webp"
            alt="Loco home page in light mode: the title Home, a sun theme toggle, and two folder cards labelled Discrete Maths and Intro to Algorithms"
            width={2880}
            height={1800}
            caption="Home, from a local run on my laptop. The two folders are fictional demo courses, not real class material."
            priority
          />
        </div>
        <p data-stagger-item style={{ ...PROSE, fontSize: 13, color: 'var(--muted)', margin: '0 0 32px' }}>
          The repository is private. Screenshots use seeded folder names only.
        </p>

        <div data-reveal style={{ marginBottom: 40 }}>
          <Shot
            src="/projects/loco/home-phone.webp"
            alt="Loco home on a phone: Home title, theme toggle, and the two demo folder cards stacked"
            width={1170}
            height={2532}
            caption="The same home view on a phone."
            variant="mobile"
          />
        </div>

        <div data-reveal className="cs-metrics" style={{ marginBottom: 40 }}>
          {METRICS.map((m) => (
            <div key={m.k} style={{ padding: '14px 16px 14px 0' }}>
              <div data-count style={{ fontFamily: DISPLAY, fontSize: 'var(--text-lg)', color: 'var(--accent)', fontWeight: 700, letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums' }}>{m.v}</div>
              <div style={{ fontFamily: MONO, fontSize: 'var(--text-xs)', color: 'var(--muted)', marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.06em', lineHeight: 1.4 }}>{m.k}</div>
            </div>
          ))}
        </div>

        <div style={{ marginBottom: 40 }}>
          <div className="section-label" style={{ fontFamily: MONO }}>Context</div>
          <p style={{ ...PROSE, margin: 0 }}>
            Built for personal offline study of course material that already lived as nested folders of videos and attachments. It was never deployed: the server has to sit on the same machine as the files. Seven commits land between 27 April and 12 May 2024.
          </p>
        </div>

        <div className="section-label" style={{ fontFamily: MONO }}>Paths without exposing them</div>
        <p style={{ ...PROSE, margin: '0 0 16px' }}>
          Every card hash is an encrypted absolute path. The client only ever posts that hash back; decrypt runs on the server. The passphrase in the checked-in cryptography module is the literal string <code style={{ fontFamily: MONO, fontSize: '0.9em' }}>secret</code>, so this is obfuscation for URLs, not a security boundary.
        </p>
        <div data-reveal style={{ marginBottom: 24 }}>
          <CodePre code={HASH_CODE} lang="typescript" />
        </div>
        <div data-reveal style={{ marginBottom: 40 }}>
          <CodePre code={READ_CODE} lang="typescript" />
          <p style={{ fontFamily: MONO, fontSize: 'var(--text-xs)', color: 'var(--muted)', marginTop: 8, lineHeight: 1.5 }}>From app/api/read-dir/route.ts — directory listing under public/videos.</p>
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

        <div className="section-label" style={{ fontFamily: MONO }}>What I&apos;d do differently</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 40 }}>
          <p style={{ ...PROSE, color: 'var(--muted)', margin: 0 }}>
            Put the Cryptr secret in an environment variable, and treat hashed URLs as convenience rather than protection.
          </p>
          <p style={{ ...PROSE, color: 'var(--muted)', margin: 0 }}>
            Normalise path separators once. Several helpers assumed Windows <code style={{ fontFamily: MONO, fontSize: '0.9em' }}>\\</code> paths; a local Mac run needed a small patch in the copy to browse nested folders.
          </p>
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
          <Link href="/projects" className="btn btn-ghost" style={{ fontFamily: MONO }}>← back to projects</Link>
        </div>

      </div>
    </PageShell>
  )
}
