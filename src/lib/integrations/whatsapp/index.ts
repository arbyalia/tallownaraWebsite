export type WhatsappTemplate =
  | 'pesanan_dibuat'
  | 'pembayaran_diterima'
  | 'pesanan_dikirim'
  | 'pesanan_selesai'
  | 'kode_otp'

export type WhatsappMessage = { to: string; template: WhatsappTemplate; params: string[] }

async function sendViaMeta({ to, template, params }: WhatsappMessage): Promise<void> {
  const phoneNumberId = process.env.WA_PHONE_NUMBER_ID
  const token = process.env.WA_ACCESS_TOKEN
  if (!phoneNumberId || !token) throw new Error('Kredensial WhatsApp belum diisi')

  const bodyParameters = params.map((text) => ({ type: 'text', text }))
  const components: object[] = [{ type: 'body', parameters: bodyParameters }]
  if (template === 'kode_otp') {
    components.push({ type: 'button', sub_type: 'url', index: '0', parameters: bodyParameters })
  }

  const response = await fetch(`https://graph.facebook.com/v21.0/${phoneNumberId}/messages`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      to: to.replace('+', ''),
      type: 'template',
      template: { name: template, language: { code: 'id' }, components },
    }),
  })
  if (!response.ok) throw new Error(`WhatsApp gagal (${response.status})`)
}

export async function sendWhatsapp(message: WhatsappMessage): Promise<void> {
  if (process.env.WA_PROVIDER === 'meta') return sendViaMeta(message)
  console.info(`[whatsapp:console] ke ${message.to} · ${message.template} · ${message.params.join(' | ')}`)
}
