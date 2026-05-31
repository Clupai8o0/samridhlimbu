'use server'

import { Resend } from 'resend'
import { notifyTelegram, tgEsc } from '@/lib/notify'

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

  if (message.trim().length < 10) {
    return { ok: false, error: 'message too short' }
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
          <p style="margin:0 0 6px;font-family:'SFMono-Regular',Menlo,monospace;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:#6b6b6b;">Your message</p>
          <table role="presentation" width="100%" style="border-top:1px solid #1f1f1f;">
            <tr><td style="padding:14px 0;font-size:14px;line-height:1.7;color:#e5e5e5;white-space:pre-wrap;">${escHtml(message)}</td></tr>
          </table>
        </td></tr>
        <tr><td style="padding:18px 36px 0;">
          <p style="margin:0;font-size:13px;line-height:1.65;color:#6b6b6b;">
            Can't find this in your inbox? Please check your spam or junk folder and mark us as "not spam" so our replies always reach you.
          </p>
        </td></tr>
        <tr><td style="padding:28px 36px 32px;">
          <div style="border-top:1px solid #1f1f1f;padding-top:18px;">
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
