import type { Post } from '@/lib/writing'

const TOOL_TAG = `<tool name="write_file" path="index.html">
<!doctype html>
<h1>DSEC</h1>
</tool>`

const CORPUS_RUN = `$ python test_parser.py
ok clean write, stop ate close tag                  ok=True name=write_file reason=''
ok unquoted attrs                                   ok=True name=write_file reason=''
ok fenced block                                     ok=True name=write_file reason=''
ok json fallback                                    ok=True name=write_file reason=''
ok PROSE only — no tool (should fail, refundable)   ok=False name=None reason='no tool call — model replied in prose'
ok unknown tool (fail)                              ok=False name=delete_everything reason="unknown tool 'delete_everything'"
...
14/14 passed`

export const NOOP_POST: Post = {
  slug: 'noop-weak-model-timed-event',
  title: 'Making a weak model usable for a 60-minute build competition',
  date: '2026-11-09',
  readMin: 6,
  tags: ['ai-agents', 'python', 'postgres', 'events'],
  excerpt:
    'noop is a small terminal coding agent for a student build competition on a deliberately weak model, with 30 instructions per student. Three pieces carry it: a tool-call format a weak model can hit, a go/no-go gate that tests the model before the harness exists, and a meter that refunds the model\'s failures in SQL.',
  content: [
    {
      type: 'paragraph',
      dropCap: true,
      html:
        'In September I built noop, a small terminal coding agent in the style of Claude Code, for the Agentic Games, a 60-minute build competition planned by DSEC, the Deakin Software Engineering Club. Each student signs in with a code from a paper slip, gets 30 instructions to a deliberately weak open model (DeepSeek V3.2) and builds one small thing. The event was cancelled before it ran, so this post is about the design and its offline tests, not about a room of users.',
    },
    {
      type: 'paragraph',
      html:
        'The weak model was on purpose. It rewards students who give clear, small instructions, and it is cheap enough to run for 60 people. It also makes the tool hard to build. A weak model fumbles tool calls, and on a 30-instruction budget every fumble that costs a student an instruction feels unfair. Three pieces deal with that.',
    },
    { type: 'heading', level: 2, text: 'A format the model can hit' },
    {
      type: 'paragraph',
      html:
        'Most agents use JSON function calling. Weak models are bad at it when the argument is a whole file: every quote and newline in the HTML has to be escaped, and one slip breaks the call. noop asks for one XML-like tag per reply, with the file body raw inside it.',
    },
    { type: 'code', lang: 'html', label: 'One tool call', code: TOOL_TAG },
    {
      type: 'paragraph',
      html:
        'Generation stops at <code>&lt;/tool&gt;</code>, so a good reply arrives without its closing tag, and the parser treats that as normal. It also accepts the slips small models make: unquoted or single-quoted attributes, the tag wrapped in a code fence, and, as a last resort, a stray JSON object. It rejects prose with no tool, an empty reply, a write with no path and any tool not on the list of six. The parser is 139 lines of standard-library Python.',
    },
    {
      type: 'paragraph',
      html:
        'The corpus that tests it has 14 hand-written cases: 10 replies it must accept and 4 it must refuse. All 14 pass offline, with no key.',
    },
    { type: 'code', lang: 'bash', label: 'The parser corpus, trimmed', code: CORPUS_RUN },
    { type: 'heading', level: 2, text: 'Test the model before building the harness' },
    {
      type: 'paragraph',
      html:
        'The go/no-go gate was in the first commit, before the agent loop existed. It sends 20 student-style first prompts to the chosen model, from "make an app with the data" to pasted error messages, and runs every reply through the same parser file the harness later imports. It passes at 18 of 20 valid on the first attempt, and 19 of 20 within one free nudge. On 6 September DeepSeek V3.2 passed 20 of 20 on the first attempt, for less than a cent, and that settled the model and the format.',
    },
    {
      type: 'paragraph',
      html:
        'If it fails, the plan already says what to do: try the fallback model, or switch to native function calling behind the same interface. Because the harness loads the parser by path instead of copying it, a change to the parser\'s tolerance is a contract change, and the gate always measures what students would get. The gate has one limit: it checks only the first tool call. Whether a whole instruction reaches working code within its 5 tool calls is a separate question, and it was never tested on the real model.',
    },
    { type: 'heading', level: 2, text: 'Refund the model\'s failures, in SQL' },
    {
      type: 'paragraph',
      html:
        'The meter charges on intent: sending an instruction costs one. A turn that lands no file write or command is refunded, and the student sees "That failure was the model, not you — no instruction spent." Once a turn has landed real work, the instruction is spent, however badly the model flails afterwards. An early banner for first-timers promised more ("you won\'t be charged for its mistakes"), and a comment in the copy file records why it was narrowed.',
    },
    {
      type: 'list',
      items: [
        'Reads are free. Each instruction gets 5 counted tool calls, writes and commands only.',
        'If a turn hits that limit, the first continue is free. The second costs an instruction and says so before you press Enter.',
        'Slash commands like <code>/help</code> and <code>/undo</code> cost nothing, and any other line takes Enter to arm and Enter again to send.',
      ],
    },
    {
      type: 'paragraph',
      html:
        'All of this lives in Postgres, not Python. The charge is one guarded <code>UPDATE</code> that cannot take the balance below zero or start a third parallel turn. A retried request hits a unique index on the user and the client\'s idempotency key, and gets its original turn back. The ledger allows one charge and one refund per turn, and marking a turn interrupted and refunding it happen in one transaction, so a crash between them cannot lose an instruction. Before each charge, the student\'s model spend is summed in SQL against a $1.50 per-student cap. Tests run all of this against a real Postgres, including two sends on one key at once and two recovery sweeps racing each other.',
    },
    { type: 'heading', level: 2, text: 'Where the bugs actually were' },
    {
      type: 'paragraph',
      html:
        'I planned the build and ran it as six parts written in parallel by coding agents against a frozen contract. Each part passed its own tests and two reviews. The ten serious bugs found at merge were all between parts or in the built image. The API container could not boot at first, because five modules found the repo root by walking up from their own file, which works in a checkout and fails inside the image. Bringing the whole stack up for the first time found more, so a whole-stack smoke test became a gate.',
    },
    {
      type: 'paragraph',
      html:
        'A readiness audit on 7 September found nine defects, mostly in the organiser controls and runbook. The "+5" top-up button granted 1, because it sent a field name the API silently dropped. The fallback-model switch, the one lever for a model outage, was rejected by the API every time. The start command would have set a four-hour clock instead of one hour. Each was fixed with a test that catches it. None were model problems. The weak model was the part I had planned for, and the operator tools were where the risk was.',
    },
    { type: 'heading', level: 2, text: 'What is left' },
    {
      type: 'paragraph',
      html:
        'noop carries on as a DSEC club project. Before anyone uses it, the full loop has to run against the real model, and the corpus should grow from 14 cases to the 30 the plan asks for, using the slips those runs turn up.',
    },
  ],
}
