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
  'Lock-In is a desk-side focus tracker for Deakin SIT210. An Arduino Uno reads the desk, a Raspberry Pi runs a five-state machine with a Gemini vision check every 75 seconds, and a Flask dashboard shows the state live over MQTT and Server-Sent Events.'

export const metadata: Metadata = {
  title: 'Lock-In · embedded focus tracker',
  description: DESCRIPTION,
  alternates: { canonical: '/projects/lock-in' },
  openGraph: {
    type: 'article',
    url: '/projects/lock-in',
    title: 'Lock-In · embedded focus tracker · Samridh Limbu',
    description: DESCRIPTION,
    images: [{ url: '/projects/lock-in/focus.webp', width: 2880, height: 1640, alt: 'The Lock-In dashboard in FOCUS: a 24:32 pomodoro ring, 27 s focused, 0 distractions and the desk sensor readings' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lock-In · embedded focus tracker · Samridh Limbu',
    description: DESCRIPTION,
    images: ['/projects/lock-in/focus.webp'],
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

const METRICS = [
  { k: 'tests passing', v: '51' },
  { k: 'median click to screen', v: '0.31 s' },
  { k: 'orchestrator tasks', v: '8' },
  { k: 'vision check every', v: '75 s' },
]

const SESSION_LOG = `2026-10-27 22:41:47 WARNING lockin.orchestrator: GEMINI_API_KEY missing — vision disabled
2026-10-27 22:41:47 INFO lockin.mqtt: mqtt connected: 127.0.0.1:3471
2026-10-27 22:41:49 INFO lockin.orchestrator: arduino hello: lock-in/1.0
2026-10-27 22:42:00 INFO lockin.fsm: FSM: AWAY -> IDLE (presence_hold)
2026-10-27 22:42:07 INFO lockin.fsm: FSM: IDLE -> FOCUS (button_single)
2026-10-27 22:42:17 WARNING lockin.orchestrator: ultrasonic blocked: 6.0 cm — something obstructing sensor
2026-10-27 22:42:19 INFO lockin.orchestrator: ultrasonic unblocked — restoring LED to FOCUS
2026-10-27 22:43:02 INFO lockin.orchestrator: vision skipped (camera offline)
2026-10-27 22:43:07 INFO lockin.fsm: FSM: FOCUS -> DEGRADING (desk_away)
2026-10-27 22:44:22 INFO lockin.fsm: FSM: DEGRADING -> FOCUS (focus_confirmed)
2026-10-27 22:44:42 INFO lockin.fsm: FSM: FOCUS -> BREAK (button_double)
2026-10-27 22:45:02 INFO lockin.fsm: FSM: BREAK -> FOCUS (button_resume)
2026-10-27 22:45:52 INFO lockin.fsm: FSM: FOCUS -> DEGRADING (desk_away)
2026-10-27 22:47:53 INFO lockin.fsm: FSM: DEGRADING -> BREAK (degrading_timeout)
2026-10-27 22:48:02 INFO lockin.fsm: FSM: BREAK -> FOCUS (button_resume)
2026-10-27 22:48:22 INFO lockin.fsm: FSM: FOCUS -> IDLE (button_long)
2026-10-27 22:48:22 INFO lockin.orchestrator: session 1 ended`

const FAILURE_LOG = `2026-10-27 22:53:41 WARNING lockin.mqtt: mqtt disconnected: [Errno 61] Connection refused (retry in 5.0s)
2026-10-27 22:53:56 INFO lockin.orchestrator: file cmd: {'type': 'button', 'action': 'single'}
2026-10-27 22:53:56 INFO lockin.fsm: FSM: IDLE -> FOCUS (button_single)
2026-10-27 22:56:11 INFO lockin.orchestrator: vision skipped (camera offline)
2026-10-27 22:57:26 INFO lockin.orchestrator: vision skipped (camera offline)`

const SERIAL_LOG = `2026-10-27 22:48:32 INFO lockin.serial: serial reconnecting in 5.0s
2026-10-27 22:48:37 WARNING lockin.serial: serial connect failed: [Errno 2] could not open port /dev/ttys002: [Errno 2] No such file or directory: '/dev/ttys002'
2026-10-27 22:48:37 INFO lockin.serial: serial reconnecting in 5.0s
2026-10-27 22:48:42 WARNING lockin.serial: serial connect failed: [Errno 2] could not open port /dev/ttys002: [Errno 2] No such file or directory: '/dev/ttys002'`

const TEST_LOG = `test_desk_away_triggers_degrading (test_fsm.FsmTest.test_desk_away_triggers_degrading) ... ok
test_low_confidence_vision_ignored (test_fsm.FsmTest.test_low_confidence_vision_ignored) ... ok
test_eof_triggers_reconnect (test_serial_reader.SerialReaderTest.test_eof_triggers_reconnect) ... serial EOF
ok
test_markdown_fenced_json (test_vision_judge.FocusJudgmentParseTest.test_markdown_fenced_json) ... ok
test_truncated_json (test_vision_judge.FocusJudgmentParseTest.test_truncated_json) ... ok
Ran 51 tests in 2.814s

OK`

const SUITES: [string, string, string][] = [
  ['test_fsm.py', '13', 'the main transitions and their holds, driven by a fake clock'],
  ['test_vision_judge.py', '25', 'parsing whatever Gemini sends back: fenced JSON, prose around it, truncated, wrong types'],
  ['test_serial_reader.py', '9', 'bad bytes, a port that fails to open, end of file, a full queue'],
  ['test_mqtt_integration.py', '4', 'round trips through a real broker; skipped when none is running'],
]

const LATENCY_CHART: ChartBlock = {
  type: 'chart',
  kind: 'line',
  title: 'Click to screen',
  subtitle: '40 clicks per build, sorted fastest to slowest',
  caption: 'File polling: median 2.75 s, from 1.42 to 3.48 s. MQTT and SSE: median 0.31 s, from 0.04 to 0.49 s. Measured in a browser on a Mac on 27 Oct 2026 over localhost. Before: commit caa9d82. After: c8d9299.',
  xLabel: 'click, fastest to slowest',
  unit: 's',
  categories: Array.from({ length: 40 }, (_, i) => String(i + 1)),
  series: [
    { name: 'file polling', values: [1.42, 1.7, 1.71, 1.8, 1.83, 1.84, 1.84, 1.92, 1.94, 2.03, 2.04, 2.11, 2.11, 2.22, 2.32, 2.39, 2.43, 2.57, 2.59, 2.73, 2.76, 2.8, 2.82, 2.82, 2.83, 3.05, 3.06, 3.12, 3.12, 3.13, 3.14, 3.24, 3.31, 3.35, 3.35, 3.35, 3.35, 3.38, 3.4, 3.48] },
    { name: 'MQTT and SSE', values: [0.04, 0.05, 0.05, 0.06, 0.07, 0.09, 0.11, 0.12, 0.12, 0.13, 0.13, 0.15, 0.2, 0.22, 0.23, 0.23, 0.25, 0.26, 0.3, 0.31, 0.32, 0.32, 0.32, 0.33, 0.33, 0.34, 0.35, 0.35, 0.36, 0.36, 0.37, 0.39, 0.39, 0.41, 0.41, 0.42, 0.43, 0.43, 0.45, 0.49] },
  ],
}

const DECISIONS = [
  ['the state machine decides', 'trusting the model', 'My first version asked Gemini every 30 seconds and believed the answer. It flipped between FOCUS and DEGRADING all the time, because one bad frame, a hand over the face or a glance down at paper, was enough. Now a judgment below 0.6 confidence is ignored, leaving the desk only counts after 30 seconds, and getting back to FOCUS takes 60 seconds of steady focus. Gemini is one input among the sensors.'],
  ['a state machine with no I/O', 'one that reads the clock and the ports', 'fsm.py takes events in and hands back a list of actions. The clock is passed in, so the 13 FSM tests move time with a fake clock instead of waiting, and none of them needs a serial port or a network.'],
  ['None on failure', 'exceptions', 'camera_client.capture() returns None on a timeout or an HTTP error, and the vision judge returns None on anything it cannot parse. The orchestrator treats None as an ordinary case: it logs "vision skipped" and carries on with the sensors.'],
  ['a webcam server on a laptop', 'an ESP32-CAM', 'The ESP32-CAM dropped frames over Wi-Fi and gave blurry JPEGs under a desk lamp. A small Flask server on a laptop serves a JPEG at GET /capture in the same shape, so the Pi side only needed a new URL.'],
  ['MQTT with a file fallback', 'polling a file', 'The first dashboard polled a snapshot file, and a click took a median 2.75 seconds to show. MQTT and Server-Sent Events brought the median down to 0.31 seconds. If the broker is down, commands still reach the Pi through a file.'],
]

const STACK: [string, string[]][] = [
  ['Hardware', ['Arduino Uno', 'Raspberry Pi', 'HC-SR501 PIR', 'HC-SR04', 'DHT22', 'LDR', '3 LEDs', 'passive piezo', 'push button']],
  ['Firmware', ['Arduino C++', 'interrupts on D2 and D3', 'newline-delimited JSON at 115200 baud']],
  ['Pi', ['Python asyncio', 'pyserial-asyncio', 'aiohttp', 'google-genai (Gemini 2.5 Flash)', 'aiomqtt', 'SQLite', 'systemd (Type=notify, watchdog)']],
  ['Dashboard', ['Flask', 'Jinja', 'paho-mqtt', 'Server-Sent Events', 'mosquitto']],
]

export default function LockInPage() {
  return (
    <PageShell>
      <div data-stagger style={{ maxWidth: 720, margin: '0 auto', padding: '36px 20px' }}>

        <PageHeader />

        {/* breadcrumb */}
        <div data-stagger-item style={{ fontFamily: MONO, fontSize: 'var(--text-xs)', color: 'var(--muted)', marginBottom: 16 }}>
          <span style={{ color: 'var(--accent)' }}>❯</span>{' '}
          cd <Link href="/projects" style={{ color: 'var(--fg)', textDecoration: 'none' }}>projects</Link>/lock-in
        </div>

        {/* Banner */}
        <div data-stagger-item style={{ padding: '24px 0', marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', columnGap: 12, rowGap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
            <h1 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 'var(--text-2xl)', lineHeight: 1.1, margin: 0, letterSpacing: '-0.025em', color: 'var(--fg)' }}>Lock-In</h1>
            <span className="pill" style={{ fontFamily: MONO }}>sit210 · may 2026</span>
          </div>
          <p style={{ ...PROSE, fontSize: 'var(--text-base)', margin: 0 }}>
            A focus tracker that sits on the desk instead of running on the laptop. An Arduino Uno reads presence, distance, temperature and light once a second. A Raspberry Pi combines those readings, the button and a Gemini check of a webcam still every 75 seconds, and puts the desk in one of five states. It answers with an LED and a buzzer and logs the session. A dashboard on the Pi shows it all live.
          </p>
        </div>

        {/* Hero */}
        <div data-stagger-item style={{ marginBottom: 24 }}>
          <Shot
            src="/projects/lock-in/focus.webp"
            alt="The Lock-In dashboard in FOCUS: a 24:32 pomodoro ring, 27 s focused, 0 distractions, 0 of 4 pomodoros, Arduino on, camera and vision off, and readings of 22.6 degrees, 47% humidity, light 612 and 62 cm"
            width={2880}
            height={1640}
            caption="The Today tab, 27 seconds into a session. The screens on this page come from the real orchestrator and dashboard running on a Mac, with a script standing in for the Arduino. There was no camera and no Gemini key, so vision is off in every shot."
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
            A solo project for Deakin&apos;s SIT210 Embedded Systems Development, submitted in May 2026 with a report, a demo video and a <Link href="/writing/lock-in-embedded-focus-tracker" style={{ color: 'var(--fg)' }}>build guide</Link>. Pomodoro apps and site blockers live on the device that distracts me, and they can&apos;t tell whether I worked or just left a timer running. A box on the desk can watch the desk itself and answer with lights and sound I can&apos;t swipe away. There is no hosted demo; the repository is the record.
          </p>
        </div>

        {/* How it fits together */}
        <div className="section-label" style={{ fontFamily: MONO }}>How it fits together</div>
        <p style={{ ...PROSE, margin: '0 0 20px' }}>
          The Pi is the only part that talks to everything else, and the only place session state lives. The Uno sends a JSON frame every second over USB serial and gets LED and buzzer commands back. On the Pi, the orchestrator runs eight asyncio tasks around a single state machine and writes sessions to SQLite. It publishes a snapshot to a local MQTT broker twice a second, and the Flask dashboard passes each one to the browser.
        </p>
        <div style={{ margin: '0 auto 40px' }}>
          <Shot
            src="/projects/lock-in/system.svg"
            alt="Diagram: sensors feed the Arduino Uno, which drives 3 LEDs and a piezo and talks to the Raspberry Pi over USB serial at 115200 baud with JSON. On the Pi, orchestrator.py runs 8 asyncio tasks around one FSM and writes to SQLite; it publishes lockin/snapshot at 2 Hz, retained, to mosquitto; the Flask dashboard subscribes and streams to the browser over SSE at /api/stream. Button presses go back through POST /api/button and the cmd topic. A webcam still comes in over HTTP GET /capture, and the focus judgment from Gemini 2.5 Flash."
            width={400}
            height={860}
            wide={{ src: '/projects/lock-in/system-wide.svg', width: 900, height: 460 }}
            caption="Diagram of the system, with the ports, topics and rates from the code."
          />
        </div>

        {/* The state machine */}
        <div className="section-label" style={{ fontFamily: MONO }}>Five states</div>
        <p style={{ ...PROSE, margin: '0 0 20px' }}>
          Every sensor transition waits for a hold, so no single distance reading moves the state. A Gemini judgment acts at once, but only at 0.6 confidence or more. The ultrasonic sensor decides whether I&apos;m at the desk; the PIR only keeps me counted as present.
        </p>
        <div style={{ margin: '0 auto 24px' }}>
          <Shot
            src="/projects/lock-in/fsm.svg"
            alt="State diagram: AWAY to IDLE after 5 s at the desk within 100 cm; IDLE to FOCUS on a single press; FOCUS to DEGRADING when vision says unfocused with confidence of at least 0.6, or after 30 s off the desk; DEGRADING back to FOCUS after 60 s back and focused; DEGRADING to BREAK after 120 s; a double press goes to BREAK and a single press resumes FOCUS. A 2.5 s long press ends the session; 5 minutes with no one present goes to AWAY; 10 minutes with no one in BREAK goes to IDLE; 25 focused minutes starts a BREAK."
            width={400}
            height={1048}
            wide={{ src: '/projects/lock-in/fsm-wide.svg', width: 880, height: 500 }}
            caption="The state machine, with the hold times and thresholds from fsm.py and config.py."
          />
        </div>
        <div style={{ margin: '0 auto 24px' }}>
          <Shot
            src="/projects/lock-in/distance.svg"
            alt="Schematic of the HC-SR04 distance bands: under 10 cm means the sensor is blocked, with a red LED and a warning beep; 10 to 100 cm is at the desk; 100 to 150 cm is off the desk but still present; beyond 150 cm or no echo counts as present only if the PIR fired in the last 30 s. Off the desk for 30 s in FOCUS goes to DEGRADING; not present for 5 minutes goes to AWAY."
            width={400}
            height={650}
            wide={{ src: '/projects/lock-in/distance-wide.svg', width: 900, height: 300 }}
            caption="Schematic of how the distance reading is read, not measured data."
          />
        </div>
        <p style={{ ...PROSE, margin: '0 0 14px' }}>
          Here is one session from the run behind the screenshots. The script sat down, pressed the button, put a hand over the sensor, walked away twice and pressed the button again. The timestamps show the holds: DEGRADING 30 seconds after leaving, FOCUS again 60 seconds after coming back, and BREAK after 120 seconds in DEGRADING.
        </p>
        <div data-reveal style={{ marginBottom: 40 }}>
          <CodePre style={LOG} code={SESSION_LOG} />
          <div style={LOG_CAPTION}>Orchestrator log, 27 Oct 2026, simulated Arduino. Lines copied as logged, trimmed to the state changes and a few warnings.</div>
        </div>

        {/* Screens */}
        <div className="section-label" style={{ fontFamily: MONO }}>The dashboard</div>
        <p style={{ ...PROSE, margin: '0 0 20px' }}>
          Flask serves four tabs: Today, History, Distractions and Settings. The face, the ring and the cards change with the state, and the side panel shows which parts are online and the latest readings.
        </p>
        <div style={{ marginBottom: 24 }}>
          <Shot
            src="/projects/lock-in/away.webp"
            alt="The dashboard in DEGRADING with a frowning red face, 2m 11s focused out of 4m 42s, 2 distractions, 1 of 4 pomodoros, and the distance reading empty"
            width={2880}
            height={1640}
            caption="DEGRADING after the second walk away. The distance reading is empty because nothing is in front of the sensor."
          />
        </div>
        <div style={{ marginBottom: 24 }}>
          <Shot
            src="/projects/lock-in/degrading-phone.webp"
            alt="The dashboard on a phone in DEGRADING, with the tabs along the top, the face in the ring and the focused and session cards below"
            width={1170}
            height={2330}
            caption="The Today tab on a phone, back at the desk after the first walk away, before the 60-second hold ends."
            variant="mobile"
          />
        </div>
        <div style={{ marginBottom: 40 }}>
          <Shot
            src="/projects/lock-in/history.webp"
            alt="The History tab: one session on 27 Oct 2026 with 2m 31s focused out of 6m 14s, 2 distractions and 2 breaks, and a Download CSV button"
            width={2880}
            height={1330}
            caption="History after that session, from SQLite, with a CSV export."
          />
        </div>

        {/* The MQTT switch */}
        <div className="section-label" style={{ fontFamily: MONO }}>From polling to push</div>
        <p style={{ ...PROSE, margin: '0 0 20px' }}>
          The first dashboard wrote a button press to a file that the Pi read once a second, and the browser fetched the state every 2 seconds. A click took seconds to show. In the last commits before the report, I moved both directions onto MQTT and pushed state to the browser over Server-Sent Events. To check the gain, I ran both builds against the same simulated Arduino and had a browser click Start and Break in turn, 40 clicks per build, timing until the state badge changed.
        </p>
        <div data-reveal style={{ marginBottom: 40 }}>
          <ArticleChart block={LATENCY_CHART} />
        </div>

        {/* Failure */}
        <div className="section-label" style={{ fontFamily: MONO }}>When a part fails</div>
        <p style={{ ...PROSE, margin: '0 0 14px' }}>
          Each part can drop out without taking the rest down. With the broker stopped, the dashboard wrote commands to the old file and the Pi still acted on them, and with no camera the vision task skipped its turn every 75 seconds.
        </p>
        <div data-reveal style={{ marginBottom: 14 }}>
          <CodePre style={LOG} code={FAILURE_LOG} />
          <div style={LOG_CAPTION}>Orchestrator log with no MQTT broker running, 27 Oct 2026. Lines copied as logged, trimmed.</div>
        </div>
        <p style={{ ...PROSE, margin: '0 0 14px' }}>
          That run also found a gap. The open page never changed: in 8 of 8 clicks the badge stayed put for the full 10 seconds. The Server-Sent Events stream stays open and sends keep-alives even with no broker behind it, so the browser never falls back to polling. Going by the code, a reload helps only when the dashboard never reached the broker, as here: the page is then rendered from the snapshot file. If the broker drops mid-session, the dashboard keeps serving its last MQTT snapshot.
        </p>
        <p style={{ ...PROSE, margin: '0 0 14px' }}>
          When the Uno goes away, the serial reader retries every 5 seconds until it comes back.
        </p>
        <div data-reveal style={{ marginBottom: 40 }}>
          <CodePre style={LOG} code={SERIAL_LOG} />
          <div style={LOG_CAPTION}>Orchestrator log after the simulated Arduino exited, 27 Oct 2026. Lines copied as logged.</div>
        </div>

        {/* Hardware */}
        <div className="section-label" style={{ fontFamily: MONO }}>Hardware</div>
        <p style={{ ...PROSE, margin: '0 0 20px' }}>
          The PIR and the button sit on the Uno&apos;s two interrupt pins, so a press or a movement is caught between frames. The Uno sends one frame a second and only moves the LEDs and buzzer when the Pi tells it to.
        </p>
        <div style={{ margin: '0 auto 24px' }}>
          <Shot
            src="/projects/lock-in/wiring.svg"
            alt="Pin map: PIR HC-SR501 on D2 (INT0), push button on D3 (INT1, active-low with the internal pull-up), HC-SR04 trigger D4 and echo D5, DHT22 on D7 with a 10 kilo-ohm pull-up, LDR on A0 in a divider with 10 kilo-ohms. Outputs: red LED D6, yellow LED D8, green LED D10, each through 220 ohms, and a passive piezo on D9. USB serial to the Raspberry Pi at 115200 baud."
            width={400}
            height={840}
            wide={{ src: '/projects/lock-in/wiring-wide.svg', width: 900, height: 352 }}
            caption="Pin map from lock_in_arduino.ino and the setup guide in the repo."
          />
        </div>
        <div style={{ marginBottom: 40 }}>
          <Shot
            src="/projects/lock-in/tinkercad.webp"
            alt="Tinkercad breadboard view: HC-SR04 and PIR at the top, a piezo, a temperature sensor marked TMP, a push button, an LDR and three LEDs with resistors on the breadboard, wired to an Arduino Uno"
            width={804}
            height={669}
            caption="The circuit in Tinkercad. The part marked TMP stands in for the DHT22, which Tinkercad does not have."
          />
        </div>

        {/* Tests */}
        <div className="section-label" style={{ fontFamily: MONO }}>Tests</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
          {SUITES.map(([file, n, what]) => (
            <div key={file} style={{ display: 'flex', gap: 12, alignItems: 'baseline', flexWrap: 'wrap' }}>
              <span style={{ fontFamily: MONO, fontSize: 'var(--text-xs)', color: 'var(--accent)', width: 200, flexShrink: 0 }}>{file} · {n}</span>
              <span style={{ fontFamily: SANS, fontSize: 'var(--text-sm)', color: 'var(--muted)', lineHeight: 1.55, flex: '1 1 240px' }}>{what}</span>
            </div>
          ))}
        </div>
        <div data-reveal style={{ marginBottom: 40 }}>
          <CodePre style={LOG} code={TEST_LOG} />
          <div style={LOG_CAPTION}>python -m unittest -v on the four suites, run on Linux on 28 Oct 2026 with mosquitto in a container. Lines copied as printed, trimmed to a few tests and the result.</div>
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

        {/* What I'd do differently */}
        <div className="section-label" style={{ fontFamily: MONO }}>What I&apos;d do differently</div>
        <p style={{ ...PROSE, color: 'var(--muted)', margin: '0 0 40px' }}>
          Start with the state machine and its tests, not the wiring; I lost time on FSM bugs that came from timing assumptions. Run a small local vision model first and keep Gemini as the fallback, because a Gemini call took two to three seconds when I built it, which is why the check runs only every 75 seconds. And make the browser start polling when the stream goes quiet, not only when it errors.
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
          <a href="https://github.com/clupai8o0/lock-in-complete" target="_blank" rel="noopener noreferrer" className="btn" style={{ fontFamily: MONO }}><Icon name="github" size={12} /> source</a>
          <Link href="/writing/lock-in-embedded-focus-tracker" className="btn" style={{ fontFamily: MONO }}>build guide</Link>
          <Link href="/projects" className="btn btn-ghost" style={{ fontFamily: MONO }}>← back to projects</Link>
        </div>

      </div>
    </PageShell>
  )
}
