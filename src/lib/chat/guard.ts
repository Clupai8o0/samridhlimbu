// Checks that run before the chat spends anything: where the request came
// from, its size, what is in it, and whether a person sent it (captcha).
import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto'

/** Production on Vercel, or `next start` locally. Previews and dev are not. */
export const IS_PROD = process.env.VERCEL_ENV
  ? process.env.VERCEL_ENV === 'production'
  : process.env.NODE_ENV === 'production'

/** Any deployment (production or preview), or `next start`. Only plain local
 *  dev may use test captcha keys and in-memory counters. */
export const DEPLOYED = Boolean(process.env.VERCEL_ENV) || process.env.NODE_ENV === 'production'

export const ENV_LABEL = process.env.VERCEL_ENV && process.env.VERCEL_ENV !== 'production'
  ? `[${process.env.VERCEL_ENV}] `
  : ''

// ── Origin ─────────────────────────────────────────────────────────────

/** Only this site's own pages may call the chat, so other sites can't use it
 *  as a free model. Scripts can fake these headers; the captcha covers them. */
export function sameOrigin(req: Request): boolean
{
  const site = req.headers.get('sec-fetch-site')
  if (site && site !== 'same-origin') {
    return false
  }
  const origin = req.headers.get('origin')
  const host = req.headers.get('x-forwarded-host') ?? req.headers.get('host')
  if (!origin || !host) {
    return false
  }
  try {
    return new URL(origin).host === host
  } catch {
    return false
  }
}

// ── Body ───────────────────────────────────────────────────────────────

const MAX_BODY_BYTES = 24_000

/** Reads a JSON body, refusing anything that isn't JSON or is too big. */
export async function readJson(req: Request): Promise<{ ok: true; body: unknown } | { ok: false; status: number }>
{
  if (!(req.headers.get('content-type') ?? '').toLowerCase().startsWith('application/json')) {
    return { ok: false, status: 415 }
  }
  if (Number(req.headers.get('content-length') ?? 0) > MAX_BODY_BYTES) {
    return { ok: false, status: 413 }
  }
  const text = await req.text()
  if (text.length > MAX_BODY_BYTES) {
    return { ok: false, status: 413 }
  }
  try {
    return { ok: true, body: JSON.parse(text) }
  } catch {
    return { ok: false, status: 400 }
  }
}

/** Removes invisible and control characters (used to hide instructions) and
 *  long runs of blank lines. Keeps ordinary newlines. */
export function clean(s: string): string
{
  return s
    .normalize('NFKC')
    .replace(/[\u0000-\u0008\u000B-\u001F\u007F-\u009F­​-‏‪-‮⁠-⁯﻿-\u{E0000}-\u{E007F}]/gu, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

// Obvious attempts to change the bot's rules. These get a fixed reply and
// never reach the model, so they cost nothing.
const ATTACKS = [
  /\b(ignore|disregard|forget|override|bypass)\b.{0,20}\b(your|these|all|any|previous|prior|above|earlier)\b.{0,20}\b(instructions?|rules|prompt|guidelines)\b/i,
  /\b(reveal|print|repeat|show|output|leak|tell me)\b.{0,20}\byour\b.{0,20}\b(system prompt|prompt|instructions|rules)\b/i,
  /\byour (system|developer|hidden|initial) (prompt|message|instructions)\b/i,
  /\b(jailbreak|DAN mode|developer mode|god mode)\b/i,
  /\byou are (now|no longer)\b/i,
  /\bpretend (to be|you are|you're)\b/i,
  /<\/?\s*(system|site_content|instructions?)\s*>/i,
]

export function looksLikeAttack(text: string): boolean
{
  return ATTACKS.some((re) => re.test(text))
}

// ── Captcha (Cloudflare Turnstile) ─────────────────────────────────────

// Cloudflare's published test keys, which always pass. Only plain local dev
// uses them; every deployment needs real keys (anyone can sign with these).
const TEST_SITE_KEY = '1x00000000000000000000AA'
const TEST_SECRET = '1x0000000000000000000000000000000AA'

export const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || (DEPLOYED ? '' : TEST_SITE_KEY)
const TURNSTILE_SECRET = process.env.TURNSTILE_SECRET_KEY || (DEPLOYED ? '' : TEST_SECRET)

export const CAPTCHA_READY = Boolean(TURNSTILE_SITE_KEY && TURNSTILE_SECRET)

export async function verifyCaptcha(token: string, ip: string): Promise<boolean>
{
  if (!token || token.length > 2048) {
    return false
  }
  // One retry: a dropped connection shouldn't make a person solve it again.
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
        method: 'POST',
        body: new URLSearchParams({ secret: TURNSTILE_SECRET, response: token, remoteip: ip }),
        signal: AbortSignal.timeout(6000),
        cache: 'no-store',
      })
      const data = (await res.json()) as { success?: boolean }
      return data.success === true
    } catch (err) {
      console.error(`chat: captcha check failed (try ${attempt + 1})`, err)
    }
  }
  return false
}

// A passed captcha gives the visitor a signed cookie for a while, so they
// don't solve one per message. Each pass also has its own message limit.

const PASS_COOKIE = 'chat_pass'
export const PASS_TTL_SEC = 2 * 3600
const SIGNING_KEY = process.env.CHAT_SIGNING_SECRET || TURNSTILE_SECRET

function sign(data: string): string
{
  return createHmac('sha256', SIGNING_KEY).update(data).digest('base64url')
}

/** The pass id from a valid, unexpired cookie, or null. */
export function readPass(req: Request): string | null
{
  const raw = (req.headers.get('cookie') ?? '')
    .split(';')
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${PASS_COOKIE}=`))
    ?.slice(PASS_COOKIE.length + 1)
  if (!raw || !SIGNING_KEY) {
    return null
  }
  const [id, exp, sig] = raw.split('.')
  if (!id || !exp || !sig || Number(exp) < Date.now() / 1000) {
    return null
  }
  const want = Buffer.from(sign(`${id}.${exp}`))
  const got = Buffer.from(sig)
  return want.length === got.length && timingSafeEqual(want, got) ? id : null
}

/** A new pass: its id, and the Set-Cookie header that carries it. */
export function newPass(): { id: string; cookie: string }
{
  const id = randomBytes(12).toString('base64url')
  const exp = Math.floor(Date.now() / 1000) + PASS_TTL_SEC
  const value = `${id}.${exp}.${sign(`${id}.${exp}`)}`
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : ''
  return {
    id,
    cookie: `${PASS_COOKIE}=${value}; Path=/api/chat; Max-Age=${PASS_TTL_SEC}; HttpOnly; SameSite=Strict${secure}`,
  }
}

// ── Signed answers ─────────────────────────────────────────────────────

// The browser sends the conversation back each time. Every answer carries a
// signature over its question and text, so a visitor can't write fake
// "assistant" turns (with instructions in them) into the history.

export function signAnswer(question: string, answer: string): string
{
  return sign(JSON.stringify(['answer', clean(question), answer]))
}

export function answerIsSigned(question: string, answer: string, sig: unknown): boolean
{
  if (typeof sig !== 'string' || !SIGNING_KEY) {
    return false
  }
  const want = Buffer.from(signAnswer(question, answer))
  const got = Buffer.from(sig)
  return want.length === got.length && timingSafeEqual(want, got)
}
