import Anthropic from '@anthropic-ai/sdk'
import { costOf, MODEL, MODEL_PRICED, monthKey, MONTHLY_CAP_USD, recordSpend, USES_FALLBACK, worstCase } from '@/lib/chat/budget'
import { SYSTEM, SYSTEM_TOKENS_EST } from '@/lib/chat/prompt'
import { addNumber, sharedStore } from '@/lib/chat/store'

export const runtime = 'nodejs'
export const maxDuration = 60

// Limits on what a visitor can send.
const MAX_TURNS = 12 // messages kept from the history, newest last
const MAX_MSG_CHARS = 600
const MAX_TOTAL_CHARS = 8000
const MAX_TOKENS = 1500

// Per-visitor and site-wide message limits.
const PER_IP_HOUR = 20
const PER_IP_DAY = 60
const SITE_DAY = 600

const client = process.env.ANTHROPIC_API_KEY ? new Anthropic() : null

// In production the cap and limits must be shared across instances, or each
// cold start gets a fresh budget. Without Redis the chat stays off there.
const STORE_OK = sharedStore || process.env.NODE_ENV !== 'production'

interface InMsg { role: 'user' | 'assistant'; content: string }

function parse(body: unknown): InMsg[] | null
{
  if (!body || typeof body !== 'object' || !Array.isArray((body as { messages?: unknown }).messages)) {
    return null
  }
  const raw = (body as { messages: unknown[] }).messages.slice(-MAX_TURNS)
  const out: InMsg[] = []
  for (const m of raw) {
    if (!m || typeof m !== 'object') {
      return null
    }
    const { role, content } = m as { role?: unknown; content?: unknown }
    if ((role !== 'user' && role !== 'assistant') || typeof content !== 'string') {
      return null
    }
    const text = content.trim()
    if (!text || (role === 'user' && text.length > MAX_MSG_CHARS)) {
      return null
    }
    out.push({ role, content: text.slice(0, 4000) })
  }
  // Must start and end with the visitor, alternating in between.
  while (out.length && out[0].role !== 'user') {
    out.shift()
  }
  if (!out.length || out[out.length - 1].role !== 'user') {
    return null
  }
  for (let i = 1; i < out.length; i++) {
    if (out[i].role === out[i - 1].role) {
      return null
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
  return Response.json({ error, code }, { status })
}

function visitorId(req: Request): string
{
  const fwd = req.headers.get('x-forwarded-for')
  return (fwd?.split(',')[0] || req.headers.get('x-real-ip') || 'unknown').trim()
}

export async function POST(req: Request)
{
  if (!client || !MODEL_PRICED || !STORE_OK) {
    if (client) {
      console.error(!MODEL_PRICED ? `chat: no price for model ${MODEL}` : 'chat: no shared store (KV_REST_API_URL) in production')
    }
    return json(503, 'The chat is not switched on yet.', 'off')
  }
  if (MONTHLY_CAP_USD === 0) {
    return json(503, 'The chat is paused for now.', 'paused')
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return json(400, 'Bad request.', 'bad')
  }
  const msgs = parse(body)
  if (!msgs) {
    const last = (body as { messages?: { content?: unknown }[] } | null)?.messages?.at?.(-1)?.content
    const tooLong = typeof last === 'string' && last.trim().length > MAX_MSG_CHARS
    return json(400, tooLong ? `Keep messages under ${MAX_MSG_CHARS} characters.` : 'Bad request.', 'bad')
  }

  // Rate limits. Counted before the call, so failed calls still count.
  const ip = visitorId(req)
  const day = new Date().toISOString().slice(0, 10)
  const hour = new Date().toISOString().slice(0, 13)
  try {
    const [h, d] = await Promise.all([
      addNumber(`chat:ip:${ip}:${hour}`, 1, 3600),
      addNumber(`chat:ip:${ip}:${day}`, 1, 86400),
    ])
    if (h > PER_IP_HOUR || d > PER_IP_DAY) {
      return json(429, 'That is a lot of questions. Try again later, or write to Sam directly.', 'limit')
    }
    // Counted only once the visitor is within their own limits, so one
    // visitor can't use up the whole site's day.
    const s = await addNumber(`chat:site:${day}`, 1, 86400)
    if (s > SITE_DAY) {
      return json(429, 'The chat is busy today. Try again tomorrow, or write to Sam directly.', 'limit')
    }
  } catch (err) {
    console.error('chat: rate-limit store failed', err)
    return json(503, 'The chat is unavailable right now.', 'store')
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
    await recordSpend(-reserve, month).catch(() => {})
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

  const stream = client.beta.messages.stream(params, { signal: req.signal })
  const enc = new TextEncoder()
  const line = (o: object) => enc.encode(JSON.stringify(o) + '\n')

  // Settles to the real cost. Only called with the final usage: a stream cut
  // off part way (stopped, failed) keeps the whole reservation, because its
  // usage so far undercounts what is billed.
  const settle = async (usage: Anthropic.Beta.BetaUsage, model: string) => {
    const cost = costOf(usage, model)
    await recordSpend(cost - reserve, month).catch((err) => console.error('chat: settle failed', err))
  }

  const out = new ReadableStream<Uint8Array>({
    async start(controller)
    {
      try {
        for await (const ev of stream) {
          if (ev.type === 'content_block_delta' && ev.delta.type === 'text_delta') {
            controller.enqueue(line({ t: 'text', v: ev.delta.text }))
          }
        }
        const msg = await stream.finalMessage()
        await settle(msg.usage, msg.model)
        if (msg.stop_reason === 'refusal') {
          controller.enqueue(line({ t: 'error', v: "I can't help with that one. Ask me about Sam's projects instead." }))
        } else if (msg.stop_reason === 'max_tokens') {
          controller.enqueue(line({ t: 'text', v: '…' }))
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

  return new Response(out, {
    headers: {
      'Content-Type': 'application/x-ndjson; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
    },
  })
}
