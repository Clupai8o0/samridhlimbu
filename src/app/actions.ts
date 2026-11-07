'use server'

import { headers } from 'next/headers'
import { Resend } from 'resend'
import { notifyTelegram, tgEsc } from '@/lib/notify'
import { describeAnswers, matchProjects, parseAnswers } from '@/lib/match'

const resend = new Resend(process.env.RESEND_API_KEY)

const FROM = 'contact@clupai.com'
const REPLY_TO = 'samridh@samridhlimbu.com'
const OWNER_EMAIL = 'limbusamaka@icloud.com'
const STUDIO = 'Samridh Limbu'
const SITE = 'samridhlimbu.com'

function escHtml(str: string) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export type ContactResult = { ok: true } | { ok: false; error: string }

export async function sendContact(data: {
  name: string
  email: string
  message: string
}): Promise<ContactResult> {
  const { name, email, message } = data

  if (!name.trim() || !email.trim() || !message.trim()) {
    return { ok: false, error: 'all fields required' }
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: 'invalid email address' }
  }

try {
    const tgText = [
      `🔔 <b>New contact</b> · ${tgEsc(SITE)}`,
      '',
      `👤 ${tgEsc(name)}`,
      `✉️  ${tgEsc(email)}`,
      '',
      `💬 ${tgEsc(message)}`,
    ].join('\n')

    const notifyPromise = notifyTelegram(tgText)

    const { error } = await resend.emails.send({
      from: FROM,
      to: OWNER_EMAIL,
      replyTo: email,
      subject: `${name} sent you a message`,
      text: `name: ${name}\nemail: ${email}\n\n${message}`,
    })

    await notifyPromise

    if (error) {
      return { ok: false, error: 'send failed — try samridh@samridhlimbu.com' }
    }

    const first = escHtml(name.split(' ')[0])
    const confirmHtml = `
<!DOCTYPE html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#050505;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#050505;padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#0d0d0d;border:1px solid #1f1f1f;border-radius:6px;overflow:hidden;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
        <tr><td style="padding:30px 36px 0;">
          <span style="font-weight:700;font-size:21px;letter-spacing:-0.02em;color:#e5e5e5;">${escHtml(STUDIO)}</span>
        </td></tr>
        <tr><td style="padding:26px 36px 0;">
          <p style="margin:0;font-family:'SFMono-Regular',Menlo,monospace;font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:#4da3ff;">Message received</p>
        </td></tr>
        <tr><td style="padding:12px 36px 0;">
          <h1 style="margin:0;font-size:27px;line-height:1.22;letter-spacing:-0.02em;color:#fff;font-weight:700;">Got it, ${first}. We're on it.</h1>
        </td></tr>
        <tr><td style="padding:18px 36px 0;">
          <p style="margin:0 0 16px;font-size:15px;line-height:1.72;color:#c9c9c9;">
            Thanks for reaching out. Your message landed with us, and a real human will reply within one business day. No autoresponder loop, no queue.
          </p>
        </td></tr>
        <tr><td style="padding:30px 36px 0;">
          <p style="margin:0 0 10px;font-family:'SFMono-Regular',Menlo,monospace;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:#6b6b6b;">Your message</p>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#151515;border-radius:4px;">
            <tr><td style="padding:14px 16px;font-size:14px;line-height:1.7;color:#e5e5e5;white-space:pre-wrap;">${escHtml(message)}</td></tr>
          </table>
        </td></tr>
        <tr><td style="padding:18px 36px 0;">
          <p style="margin:0;font-size:13px;line-height:1.65;color:#6b6b6b;">
            Can't find this in your inbox? Please check your spam or junk folder and mark us as "not spam" so our replies always reach you.
          </p>
        </td></tr>
        <tr><td style="padding:28px 36px 32px;">
          <div style="padding-top:18px;">
            <p style="margin:0;font-size:13px;color:#e5e5e5;font-weight:600;">${escHtml(STUDIO)}</p>
            <p style="margin:5px 0 0;font-size:12px;line-height:1.65;color:#6b6b6b;">We reply within one business day.</p>
          </div>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`

    resend.emails
      .send({
        from: FROM,
        to: email,
        replyTo: REPLY_TO,
        subject: 'We got your message',
        html: confirmHtml,
      })
      .catch((err) => console.warn('Confirmation email skipped:', err))

    return { ok: true }
  } catch {
    return { ok: false, error: 'send failed — try samridh@samridhlimbu.com' }
  }
}

// ─── Match funnel ───────────────────────────────────────────────────────────
// The visitor gets their shortlist by email; Sam gets their answers. The
// shortlist is rebuilt from the answers here, never taken from the browser.

const SITE_URL = 'https://samridhlimbu.com'

// Best-effort limit on how often one visitor, or one inbox, can be sent a
// shortlist. Kept in memory, so it is per server instance: it stops a loop
// from one browser, not a determined attacker.
const LIMIT = 3
const WINDOW_MS = 15 * 60 * 1000
const recent = new Map<string, number[]>()

function overLimit(key: string) {
  const now = Date.now()
  const hits = (recent.get(key) ?? []).filter(t => now - t < WINDOW_MS)
  if (hits.length >= LIMIT) {
    recent.set(key, hits)
    return true
  }
  hits.push(now)
  recent.set(key, hits)
  if (recent.size > 5000) {
    recent.clear()
  }
  return false
}

export async function sendMatch(data: {
  email: string
  name?: string
  note?: string
  answers: unknown
  /** Honeypot: hidden from people, filled by bots. */
  website?: string
}): Promise<ContactResult> {
  const email = (data.email ?? '').trim()
  const name = (data.name ?? '').trim().slice(0, 120)
  const note = (data.note ?? '').trim().slice(0, 1000)
  const answers = parseAnswers(data.answers)

  if (data.website) {
    return { ok: true }
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 200) {
    return { ok: false, error: 'invalid email address' }
  }
  if (!answers) {
    return { ok: false, error: 'answers missing, retake the quiz' }
  }

  const ip = ((await headers()).get('x-forwarded-for') ?? '').split(',')[0].trim() || 'unknown'
  const byIp = overLimit(`ip:${ip}`)
  const byInbox = overLimit(`to:${email.toLowerCase()}`)
  if (byIp || byInbox) {
    return { ok: false, error: 'too many tries, email samridh@samridhlimbu.com instead' }
  }

  const picks = matchProjects(answers)
  const lines = describeAnswers(answers)

  try {
    const notifyPromise = notifyTelegram([
      `🎯 <b>New match</b> · ${tgEsc(SITE)}`,
      '',
      `✉️  ${tgEsc(email)}${name ? ` · ${tgEsc(name)}` : ''}`,
      ...lines.map(l => tgEsc(l)),
      `picks: ${picks.map(p => tgEsc(p.name)).join(', ')}`,
      ...(note ? ['', `💬 ${tgEsc(note)}`] : []),
    ].join('\n'))

    const { error } = await resend.emails.send({
      from: FROM,
      to: OWNER_EMAIL,
      replyTo: email,
      subject: `Match: ${name || email} · ${lines[1].replace('role: ', '')}`,
      text: [
        `email: ${email}`,
        `name / company: ${name || '-'}`,
        ...lines,
        `picks: ${picks.map(p => p.name).join(', ')}`,
        '',
        note || '(no note)',
      ].join('\n'),
    })

    await notifyPromise

    if (error) {
      return { ok: false, error: 'send failed, try samridh@samridhlimbu.com' }
    }

    const rows = picks.map(p => `
        <tr><td style="padding:0 36px 14px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#151515;border-radius:4px;">
            <tr><td style="padding:14px 16px;">
              <a href="${SITE_URL}/projects/${p.slug}" style="font-size:16px;font-weight:700;color:#fff;text-decoration:none;">${escHtml(p.name)} →</a>
              <p style="margin:6px 0 0;font-size:14px;line-height:1.6;color:#c9c9c9;">${escHtml(p.blurb)}</p>
              ${p.reasons.length ? `<p style="margin:8px 0 0;font-family:'SFMono-Regular',Menlo,monospace;font-size:11px;color:#4da3ff;">${p.reasons.map(escHtml).join(' · ')}</p>` : ''}
            </td></tr>
          </table>
        </td></tr>`).join('')

    const shortlistHtml = `
<!DOCTYPE html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#050505;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#050505;padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#0d0d0d;border:1px solid #1f1f1f;border-radius:6px;overflow:hidden;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
        <tr><td style="padding:30px 36px 0;">
          <p style="margin:0;font-family:'SFMono-Regular',Menlo,monospace;font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:#4da3ff;">Your shortlist</p>
        </td></tr>
        <tr><td style="padding:12px 36px 0;">
          <h1 style="margin:0;font-size:24px;line-height:1.25;letter-spacing:-0.02em;color:#fff;font-weight:700;">${escHtml(lines[1].replace('role: ', ''))}: the work that fits</h1>
        </td></tr>
        <tr><td style="padding:14px 36px 22px;">
          <p style="margin:0;font-size:15px;line-height:1.7;color:#c9c9c9;">
            Thanks for taking a look. These are the case studies that match what you picked. I've got your details too, and I'll reply within one business day.
          </p>
        </td></tr>
        ${rows}
        <tr><td style="padding:14px 36px 32px;">
          <p style="margin:0 0 6px;font-size:14px;line-height:1.7;color:#c9c9c9;">
            Resume: <a href="${SITE_URL}/api/resume" style="color:#4da3ff;">samridhlimbu.com/api/resume</a><br>
            Everything else: <a href="${SITE_URL}/projects" style="color:#4da3ff;">samridhlimbu.com/projects</a>
          </p>
          <p style="margin:18px 0 0;font-size:13px;color:#e5e5e5;font-weight:600;">Samridh Limbu</p>
          <p style="margin:4px 0 0;font-size:12px;line-height:1.65;color:#6b6b6b;">Reply to this email to reach me directly.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`

    // Awaited: the modal says "sent", so the visitor's copy has to have gone.
    const sent = await resend.emails.send({
      from: FROM,
      to: email,
      replyTo: REPLY_TO,
      subject: 'Your shortlist from samridhlimbu.com',
      html: shortlistHtml,
    })
    if (sent.error) {
      return { ok: false, error: 'could not email that address, check it and try again' }
    }

    return { ok: true }
  } catch {
    return { ok: false, error: 'send failed, try samridh@samridhlimbu.com' }
  }
}
