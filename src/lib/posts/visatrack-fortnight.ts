import type { Post } from '@/lib/writing'

const WINDOWS_CODE = `def _windows_containing(today, counted_by_day, sessions, profile):
    this_monday = _monday_on_or_before(today)
    starts = [
        this_monday - timedelta(days=offset)
        for offset in range(0, FORTNIGHT_DAYS, WINDOW_STEP_DAYS)
    ]
    ...

def _binding_window(windows):
    capped = [w for w in windows if w.cap_minutes is not None]
    ...
    return min(capped, key=lambda w: (w.remaining_minutes, -w.counted_minutes))`

const RUN_LOG = `$ uv run python scripts/run_engine.py      # report() on the demo student, from 5 Oct
2026-10-05 2026-10-18 39.0 ok
2026-10-12 2026-10-25 37.0 ok
2026-10-19 2026-11-01 38.0 ok
2026-10-26 2026-11-08 46.0 approaching
2026-11-02 2026-11-15 31.0 ok
2026-11-09 2026-11-22  5.0 ok`

export const VISATRACK_POST: Post = {
  slug: 'forty-eight-hours-a-fortnight',
  title: '48 hours a fortnight: why VisaTrack checks every Monday',
  date: '2026-11-09',
  readMin: 6,
  tags: ['visatrack', 'python', 'algorithms', 'students'],
  excerpt:
    'Student visa holders in Australia may work up to 48 hours a fortnight while their course is in session. The regulation defines a fortnight as 14 days starting on a Monday. VisaTrack treats every Monday as the start of one, so its fortnights overlap. How it counts them, with a worked example from its own engine. Not migration advice.',
  content: [
    {
      type: 'paragraph',
      dropCap: true,
      html:
        'International students on a subclass 500 visa may work up to 48 hours a fortnight while their course is in session. That is the line on the Home Affairs visa page. It sounds like a number you could track on a payslip. In July 2026 I built VisaTrack, an app that answers one question for a student: can I take another shift? This post is about one part of it, how it counts the fortnight.',
    },
    {
      type: 'paragraph',
      html:
        '<em>This post explains how one unreleased app reads a rule. It is not migration advice, and nothing here says the app is right for your case. For your own visa, ask a registered migration agent or your university\'s international student team.</em>',
    },
    { type: 'heading', level: 2, text: 'What the rule says' },
    {
      type: 'list',
      items: [
        'The cap: "work up to 48 hours a fortnight when your course of study or training is in session" (<a href="https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/student-500">Home Affairs, Student visa (subclass 500) page</a>, read 9 November 2026).',
        'The fortnight: visa condition 8105 in Schedule 8 of the Migration Regulations 1994 says "fortnight means the period of 14 days commencing on a Monday" (<a href="https://www.legislation.gov.au/F1996B03551/latest/text">legislation.gov.au</a>, compilation No. 289, read 9 November 2026). The clause says 40 hours, and subclause (2A) makes it 48 for Subclass 500 holders and for bridging visas granted on a Subclass 500 application.',
      ],
    },
    {
      type: 'paragraph',
      html:
        'The definition does not pick a first Monday, and it says nothing about pay cycles or rosters. VisaTrack reads it this way: every Monday starts its own 14-day window, each window overlaps the one before by a week, and every window has to stay at 48 hours or under. That is the app\'s reading, and the rest of this post follows it.',
    },
    { type: 'heading', level: 2, text: 'Why tidy pairs of weeks miss it' },
    {
      type: 'paragraph',
      html:
        'The simple way to track the rule is to pair weeks: weeks 1 and 2, then weeks 3 and 4. That only checks every second window. Picture weeks of 18, 20, 26 and 5 hours. The pairs come to 38 and 31, so both look fine. The window made of weeks 2 and 3 holds 46 hours, which is 2 short of the cap. Had week 3 been 30 hours, that window would be over the limit while both pairs still looked fine.',
    },
    {
      type: 'paragraph',
      html:
        'Those are the numbers of the demo student, a made-up student seeded for the screenshots. They work casual shifts at a campus café, a corner bakery and a library. The chart is the output of the app\'s <code>report()</code> function on that student, one bar per Monday-anchored window.',
    },
    {
      type: 'chart',
      kind: 'bar',
      title: 'The 46-hour window sits between two tidy pairs',
      subtitle: 'Counted hours in each 14-day window, labelled by its starting Monday. Demo student, VisaTrack engine output. Cap is 48.',
      caption: 'Pairing weeks from 19 Oct checks only the 19 Oct and 2 Nov windows (38 h and 31 h). The 26 Oct window, at 46 h, falls between them.',
      xLabel: 'window starting Monday',
      unit: 'hours',
      categories: ['5 Oct', '12 Oct', '19 Oct', '26 Oct', '2 Nov', '9 Nov'],
      series: [{ name: 'Counted hours', values: [39, 37, 38, 46, 31, 5] }],
    },
    { type: 'code', lang: 'log', label: 'engine output for the chart (earlier windows and the minutes-left column cut)', code: RUN_LOG },
    { type: 'heading', level: 2, text: 'How the engine counts it' },
    {
      type: 'paragraph',
      html:
        'Under that reading, every day falls in exactly two Monday windows: the one that started this Monday and the one that started last Monday. So the hours a student can still work today are the smaller of the two amounts left, not 48 minus "this fortnight". The engine steps back from this Monday 7 days at a time, never 14, and binds to the window with the least room.',
    },
    { type: 'code', lang: 'python', label: 'apps/api/visatrack_api/compliance/engine.py (trimmed)', code: WINDOWS_CODE },
    {
      type: 'paragraph',
      html:
        'Before any of that, the engine splits each shift by local day and takes off unpaid breaks. A shift past midnight counts on both days. Days and weeks follow the student\'s own Australian time zone, never UTC. The engine is a pure function: the current time is passed in, and it never reads the clock or the database. That makes every answer repeatable in a test. The API suite has 458 tests, and all of them passed when I ran it on 9 November.',
    },
    { type: 'heading', level: 2, text: 'A worked example' },
    {
      type: 'paragraph',
      html:
        'It is Monday 9 November. The demo student worked 26 hours last week and 5 hours today. A manager offers a 12-hour shift tomorrow, 7:00 to 19:00.',
    },
    {
      type: 'table',
      headers: ['Window', 'Hours so far', 'With the 12-hour shift', 'Left after it'],
      rows: [
        ['9 to 22 Nov ("this fortnight")', '5', '17', '31'],
        ['2 to 15 Nov', '31', '43', '5'],
      ],
    },
    {
      type: 'paragraph',
      html:
        'A tracker that only looks at the fortnight that started this Monday would say 31 hours are still free after the shift. The window that started last Monday would have 5 left. VisaTrack\'s "Can I take a shift?" check gives the smaller answer: "You can work 5 hours more", marked close to the limit.',
    },
    { type: 'heading', level: 2, text: 'The parts the rule leaves open' },
    {
      type: 'list',
      items: [
        '<strong>Breaks.</strong> The cap applies only when the course is in session. The engine needs the student\'s teaching periods and breaks, and without them it answers "unknown", never "fine". When a window mixes session days and break days, the engine counts only the session days against the cap. The app\'s rules file notes that neither the Act nor the Regulations define "in session", and lists this split as its own choice, not something taken from guidance.',
        '<strong>Non-Monday stretches.</strong> If only Monday windows count, a student could work 40 hours on a Saturday and Sunday, nothing the next week, then 40 hours on the Monday and Tuesday after that. Every Monday window would pass, yet one 14-day stretch would hold 80 hours. No source the rules file found says how Home Affairs would treat that, so the engine shows a warning, never a breach. The worked example trips it: Wednesday 28 October to Tuesday 10 November would hold 58 hours with the new shift.',
        '<strong>What counts as an hour.</strong> The rules file notes that no Home Affairs document defines it. The app counts time worked minus unpaid breaks and says so.',
      ],
    },
    {
      type: 'paragraph',
      html:
        'The case study has screenshots and a clip of the check: <a href="/projects/visatrack">VisaTrack</a>.',
    },
  ],
}
