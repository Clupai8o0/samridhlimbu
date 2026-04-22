import { PageShell } from '@/components/page-shell'
import { MonoPortrait } from '@/components/mono-portrait'
import { Prompt } from '@/components/prompt'

const MONO = '"JetBrains Mono", var(--font-mono), monospace'
const SANS = 'Inter, var(--font-inter), sans-serif'
const DISPLAY = 'Manrope, var(--font-manrope), sans-serif'
const GREEN = '#4ade80'

export default function AboutPage() {
  return (
    <PageShell>
      <div style={{ maxWidth: 600, margin: '0 auto', padding: '40px 28px' }}>

        {/* Header */}
        <div style={{ display: 'flex', gap: 18, alignItems: 'flex-start', marginBottom: 24 }}>
          <MonoPortrait size={72} />
          <div>
            <h1 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 24, margin: '0 0 4px', letterSpacing: -0.02, color: 'var(--fg)' }}>Samridh Limbu</h1>
            <div style={{ fontFamily: SANS, fontSize: 12.5, color: 'var(--muted)' }}>software engineer · melbourne · he/him</div>
          </div>
        </div>

        {/* Bio */}
        <div style={{ fontFamily: SANS, fontSize: 13.5, color: 'var(--fg-dim)', lineHeight: 1.7, display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
          <p style={{ margin: 0 }}>I&apos;m a 3rd-year CS (IoT) student at Deakin, on a Vice-Chancellor&apos;s International Scholarship, and president of DSEC. Most of my work is frontend-focused but I own the backend too.</p>
          <p style={{ margin: 0 }}>My day splits between Python/FastAPI and TypeScript/Next.js, with strong opinions about state machines over cron and why Postgres is usually the answer. I ship things, then I write about the trade-offs.</p>
          <p style={{ margin: 0 }}>Outside the terminal: long runs along the Yarra, bad coffee in good company, and a Notion graveyard of essays.</p>
        </div>

        {/* Visa note */}
        <div style={{ padding: '12px 14px', border: '1px solid var(--border)', borderLeft: `2px solid ${GREEN}`, marginBottom: 24, fontFamily: SANS, fontSize: 12, lineHeight: 1.55, color: 'var(--muted)' }}>
          Based in Melbourne on a subclass 500 student visa with work rights; eligible for subclass 485 post-study from mid-2027.
        </div>

        {/* Stack */}
        <Prompt>ls stack/</Prompt>
        <div style={{ marginTop: 12, display: 'grid', gridTemplateColumns: '90px 1fr', gap: '10px 20px', fontSize: 12, lineHeight: 1.7, marginBottom: 24 }}>
          <span style={{ color: 'var(--accent)', fontFamily: MONO, fontSize: 10.5 }}>languages/</span>
          <span style={{ color: 'var(--fg-dim)', fontFamily: SANS }}>TypeScript · Python · Go · Rust · SQL</span>
          <span style={{ color: 'var(--accent)', fontFamily: MONO, fontSize: 10.5 }}>frameworks/</span>
          <span style={{ color: 'var(--fg-dim)', fontFamily: SANS }}>Next.js · React · FastAPI · Remix · React Three Fiber</span>
          <span style={{ color: 'var(--accent)', fontFamily: MONO, fontSize: 10.5 }}>infra/</span>
          <span style={{ color: 'var(--fg-dim)', fontFamily: SANS }}>Postgres · Supabase · Vercel · Fly.io · Cloudflare</span>
        </div>

        {/* Other */}
        <div style={{ paddingTop: 16, borderTop: '1px solid var(--border)', fontFamily: SANS, fontSize: 12, color: 'var(--muted)', lineHeight: 1.6 }}>
          I also run{' '}
          <a href="https://clupai.com" target="_blank" rel="noopener noreferrer" className="t2-link">clupai.com</a>
          , a Melbourne studio where I take on freelance web, ads, and automation work for operators.
        </div>

      </div>
    </PageShell>
  )
}
