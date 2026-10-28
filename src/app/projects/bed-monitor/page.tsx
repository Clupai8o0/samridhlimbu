import type { Metadata } from 'next'
import Link from 'next/link'
import { PageShell } from '@/components/page-shell'
import { PageHeader } from '@/components/page-header'
import { Shot } from '@/components/case-study/shot'
import { ArticleChart } from '@/components/article-chart'
import { CodePre } from '@/components/code-pre'
import type { ChartBlock } from '@/lib/writing'

const DESCRIPTION =
  'An aged care bed monitor for SIT329 at Deakin, T2 2026. A SAMD21 board reads a thermistor, a force sensor mat and a tap button through register-level C, runs four FreeRTOS tasks, and sends one frame a second to a Python dashboard that logs to SQLite.'

export const metadata: Metadata = {
  title: 'Bed monitor · SIT329',
  description: DESCRIPTION,
  alternates: { canonical: '/projects/bed-monitor' },
  openGraph: {
    type: 'article',
    url: '/projects/bed-monitor',
    title: 'Bed monitor · SIT329 · Samridh Limbu',
    description: DESCRIPTION,
    images: [{ url: '/projects/bed-monitor/dashboard-help.webp', width: 2092, height: 1120, alt: 'The bed monitor dashboard showing 19.67 C, the bed occupied at 1041 g, and a red alarm bar reading HYPOTHERMIA and HELP, NURSE CALLED' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bed monitor · SIT329 · Samridh Limbu',
    description: DESCRIPTION,
    images: ['/projects/bed-monitor/dashboard-help.webp'],
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
  { k: 'FreeRTOS tasks', v: '4' },
  { k: 'host checks passing', v: '814' },
  { k: 'board frames in SQLite', v: '1,216' },
  { k: 'sequence gaps inside a connection', v: '0' },
]

const BANNER_LOG = `link
  SERCOM0 CTRLA = 0x40200106, CTRLB = 0x30000, BAUD = 63019
  asked for 115200 baud, got 115219, error 165 ppm against a limit of 20000 ppm
  D6 to D7 loopback: up
pins
  A0 thermistor, D4 mat, D6 TxD, D7 RxD, D8 red LED, D2 tap
scheduler
  tick 1000 Hz, priorities 0 to 8, heap free 13912 of 14336
  mat 5 at 10 ms, command 4 at 50 ms, link 3 at 1 s, temp 1 at 5 min`

const TAPS_LOG = `$AC,SEQ=482,UP=510000,BED=1,T=1934,TB=HYPO,MAT=21,F=0,OCC=0,ALM=02,TAPS=0,ST=27*6E
$AC,SEQ=483,UP=511000,BED=1,T=1934,TB=HYPO,MAT=4095,F=120,OCC=0,ALM=02,TAPS=1,ST=27*67
$AC,SEQ=484,UP=512000,BED=1,T=1934,TB=HYPO,MAT=4095,F=357,OCC=0,ALM=02,TAPS=4,ST=27*64
$AC,SEQ=485,UP=513000,BED=1,T=1934,TB=HYPO,MAT=4095,F=405,OCC=0,ALM=06,TAPS=8,ST=27*6C`

const STATS_LOG = `13|2026-09-07T04:47:01.890Z|1|stats|up 3083.0 s, TC3 ran 6166 times (2.00 a second), EIC took 3 edges and dropped 2 as bounce, busy waits adc 0 state 0 link 0, heap free 6704`

const SESSION_SECONDS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50', '51', '52', '53', '54', '55', '56', '57', '58', '59', '60', '61', '62', '63', '64', '65', '66', '67', '68', '69', '70', '71', '72', '73', '74', '75', '76', '77', '78', '79', '80']

const FORCE_CHART: ChartBlock = {
  type: 'chart',
  kind: 'line',
  title: 'Mat force',
  subtitle: 'Occupancy turns on 3 s after the load passes 400 g, off 3 s after it drops',
  xLabel: 'seconds',
  unit: 'g',
  categories: SESSION_SECONDS,
  series: [{ name: 'force', values: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 319, 804, 985, 1029, 1038, 1041, 1041, 1041, 1041, 1041, 1041, 1041, 1041, 1041, 1041, 1041, 1041, 1041, 121, 17, 0, 0, 0, 10, 206, 33, 520, 894, 1008, 1034, 1040, 1041, 1041, 1041, 1041, 1041, 1041, 1041, 1041, 1041, 1041, 1041, 1041, 1041, 1041, 1041, 212, 208, 47, 5, 0, 0, 0, 0, 124, 124, 18, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] }],
}

const TAPS_CHART: ChartBlock = {
  type: 'chart',
  kind: 'line',
  title: 'Taps counted',
  subtitle: 'None added while held; HELP latches at 14 (68 s), reset at 74 s',
  caption: "Real readings from the board, 8 Sep 2026: 81 frames from the dashboard's SQLite store, one a second. Grams use the placeholder calibration, so 1041 g is its ceiling, not a weight.",
  xLabel: 'seconds',
  categories: SESSION_SECONDS,
  series: [{ name: 'taps', values: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4, 5, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 7, 7, 7, 7, 7, 7, 10, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14] }],
}

const DECISIONS = [
  ['the LED on a hardware timer', 'a blink task', 'The blink has to keep a steady 1 second beat whatever else is running, so it is not a task at all. TC3 counts to 31249 at 62.5 kHz and its interrupt toggles the pin every 500 ms. No load on the scheduler can stretch it. After 51 minutes up, the board reported TC3 firing 6166 times, 2.00 a second.'],
  ['rate-monotonic priorities', 'priority by importance', 'The task with the shortest period gets the highest priority: the mat at 10 ms, commands at 50 ms, the link at 1 s, temperature at 5 minutes. Priority 2 is left empty because the kernel creates its own timer service task there.'],
  ['a tap is a pulse', 'any threshold crossing', 'The first tap detector counted someone getting into bed as a tap. Now a crossing only becomes a tap when the signal comes back down. One still up after 400 ms is a person, so it is thrown away.'],
  ['a mutex on the link', 'two tasks sharing the USART', 'The command task can pre-empt the link task halfway through a frame. Each byte is sent and then read back off the D6 to D7 jumper before the next, so a pre-emption there would mix two frames together. A third mutex fixed it. No host check could catch this one, because it needs two tasks running.'],
  ['one clock generator each', 'sharing generator 5', 'The timer and USART classes from earlier tasks both claimed clock generator 5 at different speeds. Nothing stops you rewriting a live generator, so it would have failed quietly: a 3 Hz blink, or every baud rate a third of what was asked. The USART moved to generator 6. The board reported 115219 baud against the 115200 asked for.'],
  ['microvolts', 'whole millivolts', 'Rounding the thermistor voltage to whole millivolts threw away about half the temperature resolution between 35 and 39 C. Working in microvolts, every one of the 233 ADC counts in that range changes the reading. The host checks confirm all 233.'],
]

const STACK: [string, string[]][] = [
  ['Board', ['Arduino Nano 33 IoT', 'SAMD21G18A', 'Cortex-M0+']],
  ['Firmware', ['C', 'CMSIS registers', 'FreeRTOS_SAMD21', 'ADC', 'EIC', 'TC3', 'SERCOM0']],
  ['Laptop', ['Python', 'Tkinter', 'SQLite']],
  ['Checks', ['C++ host tests', 'mock registers', 'simulator', 'arduino-cli']],
]

export default function BedMonitorPage() {
  return (
    <PageShell>
      <div data-stagger style={{ maxWidth: 720, margin: '0 auto', padding: '36px 20px' }}>

        <PageHeader />

        {/* breadcrumb */}
        <div data-stagger-item style={{ fontFamily: MONO, fontSize: 'var(--text-xs)', color: 'var(--muted)', marginBottom: 16 }}>
          <span style={{ color: 'var(--accent)' }}>❯</span>{' '}
          cd <Link href="/projects" style={{ color: 'var(--fg)', textDecoration: 'none' }}>projects</Link>/bed-monitor
        </div>

        {/* Banner */}
        <div data-stagger-item style={{ padding: '24px 0', marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', columnGap: 12, rowGap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
            <h1 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 'var(--text-2xl)', lineHeight: 1.1, margin: 0, letterSpacing: '-0.025em', color: 'var(--fg)' }}>Bed monitor</h1>
            <span className="pill" style={{ fontFamily: MONO }}>uni · SIT329 · T2 2026</span>
          </div>
          <p style={{ ...PROSE, fontSize: 'var(--text-base)', margin: 0 }}>
            A prototype bed monitor for aged care. A small board reads a temperature sensor, a pressure mat and a button, blinks an LED for a fever, and calls a nurse when someone taps the mat five times in two seconds. A dashboard on a laptop shows each bed and logs everything to a database.
          </p>
        </div>

        {/* Hero */}
        <div data-stagger-item style={{ marginBottom: 24 }}>
          <Shot
            src="/projects/bed-monitor/dashboard-help.webp"
            alt="The Aged care bed monitor dashboard connected to /dev/cu.usbmodem1101: body temperature 19.67 C marked hypothermia, bed occupied at 1041 g and 4095 counts, a red alarm bar reading HYPOTHERMIA and HELP, NURSE CALLED with an Attended, reset alarm button, and a link log of frames 2960 to 2969"
            width={2092}
            height={1120}
            caption="The dashboard on the real board, 7 Sep 2026. The thermistor was in room air, so 19.67 C reads as hypothermia. HELP came from taps on the mat. The grams come from a placeholder calibration, not a scale."
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
            Task 6.1D in SIT329, Advanced Embedded Systems, at Deakin. The unit is about programming an ARM Cortex-M0+ through its registers, so nothing in the running program calls digitalWrite, analogRead or attachInterrupt. The timer, ADC and USART classes come from my own earlier tasks in the unit.
          </p>
          <p style={{ ...PROSE, margin: 0 }}>
            The task sheet asked for temperature every 5 minutes, a red LED blinking once a second in a fever, an alarm above 39 C or below 35 C, bed occupancy from a force sensor, a HELP alarm on five taps in two seconds that a nurse can reset, and a dashboard that logs to a database.
          </p>
        </div>

        {/* How it fits together */}
        <div className="section-label" style={{ fontFamily: MONO }}>How it fits together</div>
        <p style={{ ...PROSE, margin: '0 0 20px' }}>
          Both analogue sensors share one ADC, so a mutex guards it and only the temperature task ever moves the multiplexer. The button interrupt stamps each press and drops the time into a queue for the mat task. Once a second the link task builds a text frame with a checksum. Each byte goes out on D6, comes back on D7 through a jumper wire, and is then passed on over USB. The dashboard checks the checksum, stores the frame and can send commands back.
        </p>
        <div style={{ margin: '0 auto 40px' }}>
          <Shot
            src="/projects/bed-monitor/system.svg"
            alt="Diagram: thermistor on A0 and FSR mat on D4 feed the ADC, the tap button on D2 feeds the EIC; TC3 drives the LED. The ADC and EIC feed four FreeRTOS tasks guarded by three mutexes. vLinkTask sends one frame a second through SERCOM0 and USB serial to bed_link.py on the laptop, which writes to SQLite and drives the Tk dashboard. Commands go back the other way."
            width={400}
            height={840}
            wide={{ src: '/projects/bed-monitor/system-wide.svg', width: 880, height: 544 }}
            caption="Diagram of the system, with the pins and task names from the code."
          />
        </div>

        {/* Timing */}
        <div className="section-label" style={{ fontFamily: MONO }}>Tasks and timing</div>
        <p style={{ ...PROSE, margin: '0 0 20px' }}>
          Four tasks, each woken on a fixed period with <code style={{ fontFamily: MONO, fontSize: '0.9em' }}>vTaskDelayUntil</code> so a late run does not push the next one back. The LED is not a task. A hardware timer interrupt toggles it, so nothing the scheduler does can slow the blink.
        </p>
        <div style={{ margin: '0 auto 24px' }}>
          <Shot
            src="/projects/bed-monitor/tasks.svg"
            alt="Timing diagram over one second: TC3_Handler fires at 500 and 1000 ms, vMatTask at priority 5 is released 100 times, vCommandTask at priority 4 twenty times, vLinkTask at priority 3 once, the timer service task at priority 2 is not used, and vTempTask at priority 1 runs every 5 minutes."
            width={400}
            height={548}
            wide={{ src: '/projects/bed-monitor/tasks-wide.svg', width: 860, height: 438 }}
            caption="When each task is released in one second, with the priorities and periods from Task6_1D.ino."
          />
        </div>
        <p style={{ ...PROSE, margin: '0 0 14px' }}>
          The board prints its own setup at boot. Here is part of that banner from 24 Aug 2026. The register values and the baud rate are read back off the hardware, not copied from the source.
        </p>
        <div data-reveal style={{ marginBottom: 40 }}>
          <CodePre style={LOG} code={BANNER_LOG} />
          <div style={LOG_CAPTION}>Serial output from the board, 24 Aug 2026. Lines copied as captured, trimmed to the link, pins and scheduler.</div>
        </div>

        {/* The mat */}
        <div className="section-label" style={{ fontFamily: MONO }}>Telling a tap from a person</div>
        <p style={{ ...PROSE, margin: '0 0 20px' }}>
          The same mat has to report occupancy and catch a call for help. Occupancy only changes after a reading has stayed past its threshold for 3 seconds: on above 400 g, off below 250 g. A tap has to rise and fall back within 400 ms, or it is not a tap.
        </p>
        <div style={{ margin: '0 auto 32px' }}>
          <Shot
            src="/projects/bed-monitor/tap-vs-step.svg"
            alt="Schematic of three signals: a short pulse that falls back inside 400 ms is counted as a tap; a step that stays up past 400 ms is thrown away; five pulses inside 2 seconds latch the HELP alarm."
            width={400}
            height={658}
            wide={{ src: '/projects/bed-monitor/tap-vs-step-wide.svg', width: 880, height: 480 }}
            caption="Schematic of the rule, not measured data."
          />
        </div>
        <p style={{ ...PROSE, margin: '0 0 20px' }}>
          Here is the rule on the real board. The dashboard stored every frame from this session in SQLite. The mat was held down twice, then tapped quickly.
        </p>
        <div data-reveal style={{ marginBottom: 24 }}>
          <ArticleChart block={FORCE_CHART} />
          <ArticleChart block={TAPS_CHART} />
        </div>
        <p style={{ ...PROSE, margin: '0 0 14px' }}>
          The same alarm in the raw serial stream from 7 Sep. TAPS climbs and ALM goes from 02 (hypothermia) to 06 (hypothermia and HELP).
        </p>
        <div data-reveal style={{ marginBottom: 24 }}>
          <CodePre style={LOG} code={TAPS_LOG} />
          <div style={LOG_CAPTION}>Four consecutive frames from the board, 7 Sep 2026, as captured.</div>
        </div>
        <div data-reveal style={{ marginBottom: 40 }}>
          <Shot
            src="/projects/bed-monitor/dashboard-reset.webp"
            alt="The dashboard after a reset: body temperature 20.03 C, bed EMPTY at 0 g, the alarm bar showing only HYPOTHERMIA, and the link log showing the load falling from 1041 g to 0 g, then sent RESET, board acknowledged RESET, and alarm word 0x06 to 0x02"
            width={2092}
            height={1272}
            caption="After pressing the reset button, 7 Sep 2026. The log shows the load going, the reset and the board's acknowledgement, and HELP clearing from the alarm word."
          />
        </div>

        {/* Proof */}
        <div className="section-label" style={{ fontFamily: MONO }}>What the logs show</div>
        <p style={{ ...PROSE, margin: '0 0 14px' }}>
          The SQLite file holds 1,216 frames from the real board, logged on three days: 24 Aug, 7 Sep and 8 Sep 2026. None has the stub bit set, so none was injected. The sequence number jumps six times, each time at a reconnect or a reboot, and never skips within a connection. Within a connection the temperature only changes at uptime 301 s and 3001 s, which is the 5-minute task running on time. The board also reported its own counters after 51 minutes up.
        </p>
        <div data-reveal style={{ marginBottom: 40 }}>
          <CodePre style={LOG} code={STATS_LOG} />
          <div style={LOG_CAPTION}>A row from the events table (id, time, bed, kind, detail), 7 Sep 2026: the board&apos;s STATS reply as the dashboard stored it.</div>
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
        <div className="section-label" style={{ fontFamily: MONO }}>Testing without the board</div>
        <p style={{ ...PROSE, margin: '0 0 40px' }}>
          The monitor logic is plain C with no hardware calls, so it compiles on a laptop and runs against 184 checks. The register classes run against mock registers: 630 more checks. A simulator built from the same C writes 2,761 frames over 46 minutes of virtual time, and 60 dashboard checks parse every one and match the Python checksum to the C one. I re-ran all of it on 27 Oct 2026 and all 874 passed. The board build was 44,484 of 262,144 bytes of flash on 7 Sep.
        </p>

        {/* What I'd do differently */}
        <div className="section-label" style={{ fontFamily: MONO }}>What I&apos;d do differently</div>
        <p style={{ ...PROSE, color: 'var(--muted)', margin: '0 0 40px' }}>
          Calibrate the sensors before building on them. The force numbers still come from two placeholder points, so the grams are not real weights. The thermistor constants were never measured off the part either. And with no mat plugged in, D4 floats: it read as about 450 g, an occupied bed and about seven taps a second, and nothing downstream can tell that from a real reading. A pull-down resistor and a fault check for that case would come first next time.
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
