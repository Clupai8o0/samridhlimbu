import Anthropic from '@anthropic-ai/sdk'
import { after } from 'next/server'
import { alertAttacks, alertCapHit, alertNearCap, alertSiteLimit, alertVisitorLimit } from '@/lib/chat/alerts'
import { costOf, MODEL, MODEL_PRICED, monthKey, MONTHLY_CAP_USD, recordSpend, spentThisMonth, USES_FALLBACK, worstCase } from '@/lib/chat/budget'
import {
  answerIsSigned, CAPTCHA_READY, clean, DEPLOYED, IS_PROD, looksLikeAttack, newPass, PASS_TTL_SEC, readJson,
  readPass, sameOrigin, signAnswer, TURNSTILE_SITE_KEY, verifyCaptcha,
} from '@/lib/chat/guard'
import { SYSTEM, SYSTEM_TOKENS_EST } from '@/lib/chat/prompt'
import { STARTERS } from '@/lib/chat/starters'
import { CHAT_ENABLED } from '@/lib/chat/enabled'
import { addNumber, sharedStore } from '@/lib/chat/store'

export const runtime = 'nodejs'
export const maxDuration = 60

// Limits on what a visitor can send.
const MAX_TURNS = 12 // messages kept from the history, newest last
const MAX_MSG_CHARS = 600
const MAX_ANSWER_CHARS = 2000 // earlier answers sent back as history
const MAX_TOTAL_CHARS = 8000
const MAX_TOKENS = 700 // answers are asked to stay near 150 words

// Per-visitor and site-wide message limits.
const PER_IP_HOUR = 20
const PER_IP_DAY = 60
const PER_PASS = 40 // messages per passed captcha (it lasts 2 hours)
const SITE_DAY = 600

const client = process.env.ANTHROPIC_API_KEY ? new Anthropic({ maxRetries: 1 }) : null

// On any deployment the cap and limits must be shared across instances, or
// each cold start gets a fresh budget. Without Redis the chat stays off there.
const STORE_OK = sharedStore || !DEPLOYED

type State = 'on' | 'off' | 'paused' | 'budget'

function baseState(): State
{
  if (!client || !MODEL_PRICED || !STORE_OK || !CAPTCHA_READY) {
    return 'off'
  }
  return MONTHLY_CAP_USD === 0 ? 'paused' : 'on'
}

function whyOff(): string
{
  if (!MODEL_PRICED) {
    return `no price for model ${MODEL}`
  }
  if (!STORE_OK) {
    return 'no shared store (KV_REST_API_URL) on this deployment'
  }
  return 'no Turnstile keys (NEXT_PUBLIC_TURNSTILE_SITE_KEY / TURNSTILE_SECRET_KEY) on this deployment'
}

interface InMsg { role: 'user' | 'assistant'; content: string }

function parse(body: unknown): InMsg[] | null
{
  if (!body || typeof body !== 'object' || !Array.isArray((body as { messages?: unknown }).messages)) {
    return null
  }
  const raw = (body as { messages: unknown[] }).messages.slice(-MAX_TURNS)
  const out: InMsg[] = []
  const sigs: unknown[] = []
  const rawText: string[] = []
  for (const m of raw) {
    if (!m || typeof m !== 'object') {
      return null
    }
    const { role, content, sig } = m as { role?: unknown; content?: unknown; sig?: unknown }
    if ((role !== 'user' && role !== 'assistant') || typeof content !== 'string') {
      return null
    }
    const text = clean(content)
    if (!text || (role === 'user' && text.length > MAX_MSG_CHARS)) {
      return null
    }
    out.push({ role, content: text.slice(0, MAX_ANSWER_CHARS) })
    sigs.push(sig)
    rawText.push(content)
  }
  // Must start and end with the visitor, alternating in between.
  while (out.length && out[0].role !== 'user') {
    out.shift()
    sigs.shift()
    rawText.shift()
  }
  if (!out.length || out[out.length - 1].role !== 'user') {
    return null
  }
  for (let i = 1; i < out.length; i++) {
    if (out[i].role === out[i - 1].role) {
      return null
    }
  }
  // Every earlier answer must carry this server's signature over its question
  // and text. If any doesn't, keep only the new question.
  for (let i = 1; i < out.length; i += 2) {
    if (!answerIsSigned(rawText[i - 1], rawText[i], sigs[i])) {
      return [out[out.length - 1]]
    }
  }
  // Drop the oldest exchanges until the history fits; the last message stays.
  let total = out.reduce((n, m) => n + m.content.length, 0)
  while (out.length > 1 && total > MAX_TOTAL_CHARS) {
    total -= out[0].content.length + out[1].content.length
    out.splice(0, 2)
  }
  return out
}

function json(status: number, error: string, code: string)
{
  return Response.json({ error, code }, { status, headers: { 'Cache-Control': 'no-store' } })
}

function visitorId(req: Request): string
{
  const fwd = req.headers.get('x-forwarded-for')
  return (fwd?.split(',')[0] || req.headers.get('x-real-ip') || 'unknown').trim().slice(0, 64)
}

const enc = new TextEncoder()
const line = (o: object) => enc.encode(JSON.stringify(o) + '\n')

/** A fixed answer, streamed like a real one, that never reaches the model.
 *  Unsigned on purpose: the next request then drops this exchange, so a
 *  blocked question never reaches the model as history. */
function canned(text: string, headers: Record<string, string>)
{
  const body = new ReadableStream<Uint8Array>({
    start(controller)
    {
      controller.enqueue(line({ t: 'text', v: text }))
      controller.enqueue(line({ t: 'done' }))
      controller.close()
    },
  })
  return new Response(body, { headers })
}

/** What the chat panel needs before the first message: is it on, which
 *  captcha to show, and whether this visitor already passed one. */
export async function GET(req: Request)
{
  if (!CHAT_ENABLED) {
    return new Response(null, { status: 404 })
  }
  let state = baseState()
  if (state === 'on') {
    try {
      // Off once even one more worst-case request can't fit.
      if (await spentThisMonth() + worstCase(SYSTEM_TOKENS_EST, MAX_TOKENS) > MONTHLY_CAP_USD) {
        state = 'budget'
      }
    } catch {
      state = 'off'
    }
  }
  // Previews can show the out-of-budget screen: /?chat&demo=budget.
  const demo = new URL(req.url).searchParams.get('demo')
  if (!IS_PROD && (demo === 'budget' || demo === 'off')) {
    state = demo
  }
  return Response.json(
    { state, siteKey: state === 'on' ? TURNSTILE_SITE_KEY : null, verified: readPass(req) !== null },
    { headers: { 'Cache-Control': 'no-store' } },
  )
}

export async function POST(req: Request)
{
  if (!CHAT_ENABLED) {
    return new Response(null, { status: 404 })
  }
  const state = baseState()
  if (state === 'off') {
    if (client) {
      console.error(`chat: off, ${whyOff()}`)
    }
    return json(503, 'The chat is not switched on yet.', 'off')
  }
  if (state === 'paused') {
    return json(503, 'The chat is paused for now.', 'paused')
  }
  if (!sameOrigin(req)) {
    return json(403, 'Not allowed.', 'origin')
  }

  const read = await readJson(req)
  if (!read.ok) {
    return json(read.status, 'Bad request.', 'bad')
  }
  const body = read.body
  const msgs = parse(body)
  if (!msgs) {
    const last = (body as { messages?: { content?: unknown }[] } | null)?.messages?.at?.(-1)?.content
    const tooLong = typeof last === 'string' && clean(last).length > MAX_MSG_CHARS
    return json(400, tooLong ? `Keep messages under ${MAX_MSG_CHARS} characters.` : 'Bad request.', 'bad')
  }

  // Captcha: a valid pass cookie, or a fresh Turnstile token that earns one.
  const ip = visitorId(req)
  const headers: Record<string, string> = {
    'Content-Type': 'application/x-ndjson; charset=utf-8',
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
  }
  let pass = readPass(req)
  if (!pass) {
    const token = (body as { captcha?: unknown }).captcha
    if (typeof token !== 'string' || !(await verifyCaptcha(token, ip))) {
      return json(403, 'Please confirm you are human, then send again.', 'captcha')
    }
    const fresh = newPass()
    pass = fresh.id
    headers['Set-Cookie'] = fresh.cookie
  }

  // Rate limits. Counted before the call, so failed calls still count.
  const day = new Date().toISOString().slice(0, 10)
  const hour = new Date().toISOString().slice(0, 13)
  try {
    const [h, d, p] = await Promise.all([
      addNumber(`chat:ip:${ip}:${hour}`, 1, 3600),
      addNumber(`chat:ip:${ip}:${day}`, 1, 86400),
      addNumber(`chat:pass:${pass}`, 1, PASS_TTL_SEC),
    ])
    if (h > PER_IP_HOUR || d > PER_IP_DAY || p > PER_PASS) {
      after(alertVisitorLimit)
      return json(429, 'That is a lot of questions. Try again later, or write to Sam directly.', 'limit')
    }
    // Counted only once the visitor is within their own limits, so one
    // visitor can't use up the whole site's day.
    const s = await addNumber(`chat:site:${day}`, 1, 86400)
    if (s > SITE_DAY) {
      after(() => alertSiteLimit(SITE_DAY))
      return json(429, 'The chat is busy today. Try again tomorrow, or write to Sam directly.', 'limit')
    }
  } catch (err) {
    console.error('chat: rate-limit store failed', err)
    return json(503, 'The chat is unavailable right now.', 'store')
  }

  // Cheap checks that answer without the model. Earlier questions were
  // checked when they were sent (their answers are signed), so only the new one.
  const question = msgs[msgs.length - 1].content
  if (looksLikeAttack(question)) {
    after(async () => {
      const n = await addNumber(`chat:attacks:${day}`, 1, 86400).catch(() => 0)
      if (n >= 10) {
        await alertAttacks(n)
      }
    })
    return canned(`I only answer questions about Sam's work, and my rules stay as they are. Try: "${STARTERS[0]}"`, headers)
  }

  // Reserve the worst case against the monthly cap first, so parallel
  // requests can't all slip under it; settle to the real cost afterwards.
  const historyTokens = Math.ceil(msgs.reduce((n, m) => n + m.content.length, 0) / 3)
  const reserve = worstCase(SYSTEM_TOKENS_EST + historyTokens, MAX_TOKENS)
  const month = monthKey()
  let total: number
  try {
    total = await recordSpend(reserve, month)
  } catch (err) {
    console.error('chat: spend store failed', err)
    return json(503, 'The chat is unavailable right now.', 'store')
  }
  if (total > MONTHLY_CAP_USD) {
    const spent = await recordSpend(-reserve, month).catch(() => total - reserve)
    after(() => alertCapHit(spent, MONTHLY_CAP_USD))
    return json(503, "The chat has used this month's budget. Write to Sam directly instead.", 'budget')
  }

  const params: Anthropic.Beta.MessageCreateParamsStreaming = {
    model: MODEL,
    max_tokens: MAX_TOKENS,
    system: [{ type: 'text', text: SYSTEM, cache_control: { type: 'ephemeral' } }],
    messages: msgs,
    output_config: { effort: 'low' },
    stream: true,
  }
  // Server-side refusal fallback on the models that support it.
  if (USES_FALLBACK) {
    params.betas = ['server-side-fallback-2026-07-01']
    params.fallbacks = 'default'
  }

  const stream = client!.beta.messages.stream(params, { signal: req.signal })

  // Settles to the real cost. Only called with the final usage: a stream cut
  // off part way (stopped, failed) keeps the whole reservation, because its
  // usage so far undercounts what is billed.
  const settle = async (usage: Anthropic.Beta.BetaUsage, model: string) => {
    const cost = costOf(usage, model)
    try {
      const now = await recordSpend(cost - reserve, month)
      if (now >= MONTHLY_CAP_USD * 0.8) {
        // Inside the stream, after the request scope, so awaited here; it
        // sends at most once a month.
        await alertNearCap(now, MONTHLY_CAP_USD)
      }
    } catch (err) {
      console.error('chat: settle failed', err)
    }
  }

  const out = new ReadableStream<Uint8Array>({
    async start(controller)
    {
      let full = ''
      try {
        for await (const ev of stream) {
          if (ev.type === 'content_block_delta' && ev.delta.type === 'text_delta') {
            full += ev.delta.text
            controller.enqueue(line({ t: 'text', v: ev.delta.text }))
          }
        }
        const msg = await stream.finalMessage()
        await settle(msg.usage, msg.model)
        if (msg.stop_reason === 'refusal') {
          controller.enqueue(line({ t: 'error', v: "I can't help with that one. Ask me about Sam's projects instead." }))
        } else if (msg.stop_reason === 'max_tokens') {
          full += '…'
          controller.enqueue(line({ t: 'text', v: '…' }))
        }
        if (full && msg.stop_reason !== 'refusal') {
          controller.enqueue(line({ t: 'sig', v: signAnswer(question, full) }))
        }
        controller.enqueue(line({ t: 'done' }))
      } catch (err) {
        if (!req.signal.aborted) {
          console.error('chat: stream failed', err)
          const busy = err instanceof Anthropic.RateLimitError || err instanceof Anthropic.InternalServerError
          controller.enqueue(line({ t: 'error', v: busy ? 'The model is busy. Try again in a minute.' : 'Something went wrong. Try again.' }))
        }
      } finally {
        try {
          controller.close()
        } catch {
          // already closed by an aborted request
        }
      }
    },
    cancel()
    {
      stream.abort()
    },
  })

  return new Response(out, { headers })
}
