import type { Metadata } from 'next'
import Link from 'next/link'
import { PageShell } from '@/components/page-shell'
import { PageHeader } from '@/components/page-header'
import { Icon } from '@/components/icons'
import { Shot } from '@/components/case-study/shot'

const DESCRIPTION =
  'A watering advisor for vineyards, built overnight at Hack48 in March 2026. A gradient boosting model predicts weekly water, plain rules scale it to one block, and a voice assistant called Sage speaks the advice through Gemini and ElevenLabs. The March build is still live on Vercel.'

export const metadata: Metadata = {
  title: 'Farmers Intuition · Hack48',
  description: DESCRIPTION,
  alternates: { canonical: '/projects/farmers-intuition' },
  openGraph: {
    type: 'article',
    url: '/projects/farmers-intuition',
    title: 'Farmers Intuition · Hack48 · Samridh Limbu',
    description: DESCRIPTION,
    images: [{ url: '/projects/farmers-intuition/dashboard.webp', width: 2880, height: 1690, alt: 'The Farmers Intuition dashboard: six gauges for a 5 ha shiraz block at veraison, and a recommendation of 17,189 litres a day with high confidence' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Farmers Intuition · Hack48 · Samridh Limbu',
    description: DESCRIPTION,
    images: ['/projects/farmers-intuition/dashboard.webp'],
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

const CAPTION = { fontFamily: MONO, fontSize: 'var(--text-xs)', color: 'var(--muted)', lineHeight: 1.5, marginTop: 8 }

const METRICS = [
  { k: 'training rows, simulated', v: '780' },
  { k: 'models compared', v: '4' },
  { k: 'tests passing', v: '8 of 9' },
  { k: 'median local response', v: '20.5 ms' },
]

const ALERT_LOG = `{
  "baseline_weekly_l": 636195.64,
  "recommended_daily_l": 20903.57,
  "confidence": "high",
  "should_alert": true,
  "alerts": [
    "Soil moisture critically low at 18.0%",
    "Heat stress risk — temperature at 38.0°C",
    "Irrigation need shifted significantly (22% change)"
  ]
}`

const DECISIONS = [
  ['rules for the last step', 'a second model', 'The model has only seen three simulated farms. It knows nothing about grape varieties or growth stages. So the step from its farm-sized number to advice for one block is five multipliers in a config file, and every litre in the answer can be traced to a rule.'],
  ['ranking two tests', 'the best score on one year', 'Judged on 2025 alone, linear regression would have won. Tested one year at a time, it came last. Ranking both tests picked gradient boosting, which was close to the best in each.'],
  ['voice first', 'a dashboard only', 'A grower out in the rows cannot keep reading a screen. Sage answers in two or three sentences and quotes the numbers. The dashboard is for setting up the block and showing the working.'],
  ['lazy imports', 'loading everything at start-up', 'The first Vercel deploy returned 500 errors. The fix moved the heavy libraries into the functions that use them, so the Python function can start without them. The model file is now loaded on every request, and a local request still takes about 20 ms.'],
  ['state in memory', 'a database', 'The latest readings, the advice and the chat sessions live in Python memory. That was quick to build. The catch is that Vercel forgets them on every cold start, which is why the voice page sends default readings when the API has none.'],
]

const TIMELINE = [
  { date: '14 Mar 2026 · 23:49', title: 'Voice page first', body: 'The front end starts as a voice assistant screen. By 00:26 it has routes for ElevenLabs speech to text and text to speech.' },
  { date: '15 Mar · 01:09 to 01:35', title: 'Dashboard prototype and the model', body: 'A separate dashboard prototype with five knobs. Then Akash\'s first API commit: the simulated data, the training script, a trained model, the rules and nine tests.' },
  { date: '15 Mar · 02:52 to 04:31', title: 'Wired up and deployed', body: 'Gemini chat, the Vercel config, a CORS fix and the lazy-import fix. The dashboard starts posting to the API, and the mic switches from the browser\'s speech API to ElevenLabs.' },
  { date: '15 Mar · 06:19 to 08:53', title: 'Last fixes before demo time', body: 'Eighteen short commits across both repos. The savings card arrives around 08:00 and the Model Info card in the last commit. The live site serves that build.', current: true },
]

const STACK: [string, string[]][] = [
  ['Frontend', ['React 19', 'Vite 8', 'MediaRecorder', 'Web Audio']],
  ['Backend', ['FastAPI', 'Python 3.12', 'scikit-learn', 'pandas', 'joblib', 'Vercel']],
  ['AI', ['Gemini 2.5 Flash', 'ElevenLabs Scribe', 'ElevenLabs TTS']],
  ['Tooling', ['pytest', 'Claude Code']],
]

export default function FarmersIntuitionPage() {
  return (
    <PageShell>
      <div data-stagger style={{ maxWidth: 720, margin: '0 auto', padding: '36px 20px' }}>

        <PageHeader />

        {/* breadcrumb */}
        <div data-stagger-item style={{ fontFamily: MONO, fontSize: 'var(--text-xs)', color: 'var(--muted)', marginBottom: 16 }}>
          <span style={{ color: 'var(--accent)' }}>❯</span>{' '}
          cd <Link href="/projects" style={{ color: 'var(--fg)', textDecoration: 'none' }}>projects</Link>/farmers-intuition
        </div>

        {/* Banner */}
        <div data-stagger-item style={{ padding: '24px 0', marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', columnGap: 12, rowGap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
            <h1 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 'var(--text-2xl)', lineHeight: 1.1, margin: 0, letterSpacing: '-0.025em', color: 'var(--fg)' }}>Farmers Intuition</h1>
            <span className="pill" style={{ fontFamily: MONO }}>hack48 · mar 2026 · live</span>
          </div>
          <p style={{ ...PROSE, fontSize: 'var(--text-base)', margin: 0 }}>
            A watering advisor for vineyards, built overnight at Hack48. You set the day&apos;s conditions on the dashboard and it tells you how many litres to put on the block. A voice assistant called Sage reads the advice out and answers questions, so a grower can use it without looking at a screen.
          </p>
        </div>

        {/* Hero: the app itself */}
        <div data-stagger-item style={{ marginBottom: 24 }}>
          <Shot
            src="/projects/farmers-intuition/dashboard.webp"
            alt="The Farmers Intuition dashboard for a 5 ha shiraz block at veraison in the Yarra Valley: gauges at 24 °C, 45% humidity, 62% soil moisture and 8 mm rain, a recommendation of 17,189 litres a day and 120,322 a week with high confidence, and an estimated savings card"
            width={2880}
            height={1690}
            caption="The dashboard on a local copy of the March build, with made-up readings. The savings card is the app's own estimate against a fixed 4,500 L/ha/day schedule, not a measurement. No AI keys were set for this shot."
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
            Hack48, March 2026. Growers often water on a fixed schedule or by feel, and a weather app knows nothing about their soil or their vines. We tried to give them one number for the day, worked out from the conditions on the block.
          </p>
          <p style={{ ...PROSE, margin: 0 }}>
            Akash set up the API repo. I built the rest, partly with Claude Code, across three repos in one night. The training data is simulated: 780 weekly records from three made-up Victorian farms, 2021 to 2025. Nothing reads a real soil probe. The gauges stand in for sensors.
          </p>
        </div>

        {/* Illustration */}
        <div data-reveal style={{ maxWidth: 400, margin: '0 auto 40px' }}>
          <Shot
            src="/projects/farmers-intuition/idea.svg"
            alt="Line illustration: a sun, a rain cloud and a soil probe in a vine row each send a dotted line into one blue water drop, and a line from the drop runs to a phone sending out sound waves"
            width={400}
            height={520}
            caption="Illustration of the idea: sun, rain and soil go in, one watering number comes out, and the phone says it out loud."
          />
        </div>

        {/* How it fits together */}
        <div className="section-label" style={{ fontFamily: MONO }}>How it fits together</div>
        <p style={{ ...PROSE, margin: '0 0 14px' }}>
          There are two paths. The dashboard posts each change to <code>/environment</code> half a second after the last slider move. The API runs the model, applies the rules, checks the alert rules and keeps the result in memory.
        </p>
        <p style={{ ...PROSE, margin: '0 0 20px' }}>
          The voice page goes the other way. Speech goes to ElevenLabs and comes back as text. The text goes to <code>/chat</code>, which builds a prompt for Gemini from the stored readings. Gemini&apos;s reply goes back to ElevenLabs and plays as audio.
        </p>
        <div data-reveal style={{ maxWidth: 480, margin: '0 auto 32px' }}>
          <Shot
            src="/projects/farmers-intuition/system.svg"
            alt="System diagram: ElevenLabs at the top, linked to the voice page through /api/stt and /api/tts. The voice page posts to /chat and the dashboard posts to /environment on a FastAPI service on Vercel, where layer 1 (gradient boosting) feeds layer 2 (rules) and then the alert rules. The latest state feeds /chat, which sends a prompt to Gemini at the bottom."
            width={400}
            height={908}
            caption="System diagram, drawn from the code in the two main repos."
          />
        </div>
        <div data-reveal style={{ maxWidth: 480, margin: '0 auto 40px' }}>
          <Shot
            src="/projects/farmers-intuition/request-flow.svg"
            alt="Request flow. Asking Sage a question takes seven steps: tap the orb, /api/stt, GET /environment, POST /chat, Gemini answers, /api/tts, play the reply. When a rule fires on the dashboard: POST /environment returns should_alert, POST /chat with no message asks Gemini for a short warning, and the voice page opens and plays it."
            width={400}
            height={940}
            caption="What happens when you ask Sage a question, and when an alert rule fires."
          />
        </div>

        {/* The two layers */}
        <div className="section-label" style={{ fontFamily: MONO }}>Two layers, and one is rules</div>
        <p style={{ ...PROSE, margin: '0 0 14px' }}>
          Layer 1 is a gradient boosting model. It predicts a whole farm&apos;s weekly water from the region, the time of year and the last few weeks. That number is far too big for one small block.
        </p>
        <p style={{ ...PROSE, margin: '0 0 20px' }}>
          Layer 2 scales it down with plain rules from a config file. Block size is compared with a 25 ha reference, and each variety and growth stage has a factor. Rain takes off up to 35% and wet soil up to 25%.
        </p>
        <div data-reveal style={{ maxWidth: 560, margin: '0 auto 20px' }}>
          <Shot
            src="/projects/farmers-intuition/recommend-steps.webp"
            alt="Bar chart, litres per week after each step: model baseline 625k, land area 5 ha 125k (times 0.20), variety shiraz 125k (times 1.00), stage veraison 144k (times 1.15), rain 8 mm 139k (times 0.97), soil 62% wet 120k (times 0.87)"
            width={1120}
            height={1240}
            caption="Six calls to /recommend on a local copy of the API, 27 Oct 2026, adding one field each time (Yarra Valley, 24 °C, 45% humidity). Each multiplier is that step's ratio to the step before."
          />
        </div>
        <p style={{ ...PROSE, margin: '0 0 40px' }}>
          The &quot;confidence&quot; label is not a model score. It counts how many optional fields you filled in. In the calls above it went from low to medium at the third field and to high at the fourth.
        </p>

        {/* Model choice */}
        <div className="section-label" style={{ fontFamily: MONO }}>Picking the model</div>
        <p style={{ ...PROSE, margin: '0 0 20px' }}>
          The training script tries four models and tests each one twice. First on 2025, which it holds back from training. Then one year at a time from 2022, training only on the years before. It ranks the models on three error measures in both tests and keeps the lowest total.
        </p>
        <div data-reveal style={{ maxWidth: 560, margin: '0 auto 40px' }}>
          <Shot
            src="/projects/farmers-intuition/model-choice.webp"
            alt="Bar chart of RMSE in litres per week, 2025 holdout and walk-forward mean: gradient boosting 17.0k and 17.2k, linear regression 13.8k and 19.5k, hist gradient boosting 18.0k and 17.9k, random forest 18.2k and 18.4k"
            width={1120}
            height={1240}
            caption="Error from rerunning the repo's training script on 27 Oct 2026 with scikit-learn 1.8.0, on the simulated data. It picked the same model as the one committed in March (2025 R² 0.969). XGBoost was not installed, so it was skipped."
          />
        </div>

        {/* Alerts */}
        <div className="section-label" style={{ fontFamily: MONO }}>When something is wrong</div>
        <p style={{ ...PROSE, margin: '0 0 20px' }}>
          Five rules can raise an alert: soil under 30%, heat over 35 °C, mildew weather, soil over 85%, and a jump of more than 20% in the advice while the block settings stay the same. When one fires, the dashboard asks <code>/chat</code> for a short spoken warning and opens the voice page to play it.
        </p>
        <div data-reveal style={{ marginBottom: 32 }}>
          <pre style={LOG}>{ALERT_LOG}</pre>
          <div style={CAPTION}>The API&apos;s reply to one POST /environment for a hot, dry day (38 °C, 18% soil), on a local copy, 27 Oct 2026. Cut down to these fields with jq.</div>
        </div>
        <div data-reveal style={{ marginBottom: 40 }}>
          <Shot
            src="/projects/farmers-intuition/alert-phone.webp"
            alt="The dashboard on a phone with soil moisture at 18%: a recommendation of 18,662 litres a day with high confidence, an estimated savings card, and an Active Alerts card reading Soil moisture critically low at 18.0%"
            width={1170}
            height={2660}
            caption="On a phone, soil at 18%. The alert card comes from the rules. The spoken warning needs a Gemini key, so it is not in this shot."
            variant="mobile"
          />
        </div>

        {/* Recording with keys */}
        <div className="section-label" style={{ fontFamily: MONO }}>Sage, with keys set</div>
        <div data-reveal style={{ marginBottom: 40 }}>
          <video
            src="/projects/farmers-intuition/demo.mp4"
            poster="/projects/farmers-intuition/demo-poster.webp"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-label="Screen recording of Farmers Intuition with Gemini and ElevenLabs keys set"
            style={{ width: '100%', display: 'block', borderRadius: 2, background: 'var(--bg-2)' }}
          />
          <div style={CAPTION}>A screen recording of the hackathon build with Gemini and ElevenLabs keys set. Sage answers a question about the shiraz block, then warns that soil moisture is down to 7%.</div>
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
        <div className="section-label" style={{ fontFamily: MONO }}>Timeline, from the commits</div>
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

        {/* What I'd do differently */}
        <div className="section-label" style={{ fontFamily: MONO }}>What I&apos;d do differently</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 40 }}>
          <p style={{ ...PROSE, color: 'var(--muted)', margin: 0 }}>
            Pin scikit-learn. The saved model was made with version 1.8.0 and the requirements file leaves the version open. On 1.9.1 every recommendation fails with a 500 error.
          </p>
          <p style={{ ...PROSE, color: 'var(--muted)', margin: 0 }}>
            Fix the tests along with the code. The lazy-import change broke one of the nine tests, which still patches a function that no longer exists.
          </p>
          <p style={{ ...PROSE, color: 'var(--muted)', margin: 0 }}>
            Keep state somewhere that lasts, and compare savings with a grower&apos;s real schedule instead of a fixed 4,500 L/ha/day.
          </p>
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
          <a href="https://farmers-intuition.vercel.app" target="_blank" rel="noopener noreferrer" className="btn" style={{ fontFamily: MONO }}><Icon name="external" size={12} /> farmers-intuition.vercel.app</a>
          <a href="https://github.com/clupai8o0/farmers-intuition" target="_blank" rel="noopener noreferrer" className="btn" style={{ fontFamily: MONO }}><Icon name="github" size={12} /> frontend</a>
          <a href="https://github.com/Clupai8o0/Farmers_Intuition_API" target="_blank" rel="noopener noreferrer" className="btn" style={{ fontFamily: MONO }}><Icon name="github" size={12} /> api</a>
          <a href="https://github.com/Clupai8o0/farmers-intuition-dashboard" target="_blank" rel="noopener noreferrer" className="btn" style={{ fontFamily: MONO }}><Icon name="github" size={12} /> dashboard prototype</a>
          <Link href="/projects" className="btn btn-ghost" style={{ fontFamily: MONO }}>← back to projects</Link>
        </div>

      </div>
    </PageShell>
  )
}
