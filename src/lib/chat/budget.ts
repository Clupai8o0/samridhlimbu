import type Anthropic from '@anthropic-ai/sdk'
import { addNumber, getNumber } from './store'

// Dollars per million tokens. Cache writes use the 5-minute TTL (1.25x input).
// Haiku 5.5 rates are for prompts under 100K tokens; the corpus stays well under.
interface Rate { input: number; output: number; cacheRead: number; cacheWrite: number }

const RATES: Record<string, Rate> = {
  'claude-opus-5-5': { input: 4, output: 20, cacheRead: 0.2, cacheWrite: 5 },
  'claude-sonnet-5-5': { input: 2, output: 10, cacheRead: 0.2, cacheWrite: 2.5 },
  'claude-haiku-5-5': { input: 0.1, output: 0.5, cacheRead: 0.01, cacheWrite: 0.125 },
}

// Used for any model not in the table (a fallback model, say), so the cap
// errs on the side of counting too much.
const UNKNOWN: Rate = { input: 5, output: 25, cacheRead: 0.5, cacheWrite: 6.25 }

export const MODEL = process.env.CHAT_MODEL || 'claude-opus-5-5'

// A model with no known price can't be held to the cap, so the chat stays off.
export const MODEL_PRICED = MODEL in RATES

// Opus and Sonnet 5.5 retry a refused answer on a fallback model, which is
// billed as a second attempt.
export const USES_FALLBACK = MODEL.startsWith('claude-opus-') || MODEL === 'claude-sonnet-5-5'

const capEnv = Number(process.env.CHAT_MONTHLY_CAP_USD)
export const MONTHLY_CAP_USD = Number.isFinite(capEnv) && capEnv >= 0 ? capEnv : 10

interface TokenUse
{
  input_tokens: number
  output_tokens: number
  cache_read_input_tokens?: number | null
  cache_creation_input_tokens?: number | null
}

function price(u: TokenUse, model: string): number
{
  const r = RATES[model] ?? UNKNOWN
  return (
    u.input_tokens * r.input +
    u.output_tokens * r.output +
    (u.cache_read_input_tokens ?? 0) * r.cacheRead +
    (u.cache_creation_input_tokens ?? 0) * r.cacheWrite
  ) / 1e6
}

// Cost of one finished request. With a server-side fallback the response
// lists each model that ran, so each part is priced at its own model's rate.
export function costOf(usage: Anthropic.Beta.BetaUsage, model: string): number
{
  const parts = (usage.iterations ?? []).filter(
    (it): it is Anthropic.Beta.BetaMessageIterationUsage | Anthropic.Beta.BetaFallbackMessageIterationUsage =>
      it.type === 'message' || it.type === 'fallback_message',
  )
  if (parts.length === 0) {
    return price(usage, model)
  }
  return parts.reduce((sum, it) => sum + price(it, ('model' in it && it.model) || model), 0)
}

// Worst case for one request: the whole prompt written to cache, plus the
// output cap, at the dearer of the configured model and the unknown rate.
// With a fallback, two attempts can be billed.
export function worstCase(promptTokens: number, maxTokens: number): number
{
  const r = RATES[MODEL] ?? UNKNOWN
  const w = Math.max(r.cacheWrite, r.input, UNKNOWN.cacheWrite)
  const one = (promptTokens * w + maxTokens * Math.max(r.output, UNKNOWN.output)) / 1e6
  return USES_FALLBACK ? one * 2 : one
}

export function monthKey(): string
{
  const d = new Date()
  return `chat:spend:${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`
}

const MONTH_TTL = 40 * 24 * 3600

export async function spentThisMonth(): Promise<number>
{
  return getNumber(monthKey())
}

// Pass the key taken when the reservation was made, so a request that
// straddles month-end settles against the month it was reserved in.
export async function recordSpend(usd: number, key = monthKey()): Promise<number>
{
  return addNumber(key, Number(usd.toFixed(6)), MONTH_TTL)
}
