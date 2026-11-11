export type EmailMessage = { to: string; subject: string; text: string }

async function sendViaResend({ to, subject, text }: EmailMessage): Promise<void> {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY ?? ''}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ from: process.env.EMAIL_FROM, to, subject, text }),
  })
  if (!response.ok) throw new Error(`Email gagal (${response.status})`)
}

export async function sendEmail(message: EmailMessage): Promise<void> {
  if (process.env.EMAIL_PROVIDER === 'resend') return sendViaResend(message)
  console.info(`[email:console] ke ${message.to} · ${message.subject}\n${message.text}`)
}
