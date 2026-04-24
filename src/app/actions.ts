'use server'

import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

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
    await resend.emails.send({
      from: 'contact@clupai.com',
      to: 'limbusamaka@icloud.com',
      replyTo: email,
      subject: `[samridhlimbu.com] message from ${name}`,
      text: `name: ${name}\nemail: ${email}\n\n${message}`,
    })
    return { ok: true }
  } catch {
    return { ok: false, error: 'send failed — try samridh@samridhlimbu.com' }
  }
}
