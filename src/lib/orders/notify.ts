import { sendEmail } from '../integrations/email'
import { sendWhatsapp, type WhatsappTemplate } from '../integrations/whatsapp'
import { formatRupiah } from '../money'

type NotifiableOrder = {
  code: string
  customerName: string
  customerEmail: string
  customerPhone: string
  total: number
  courierName?: string | null
  trackingNumber?: string | null
}

const SUBJECTS: Record<Exclude<WhatsappTemplate, 'kode_otp'>, string> = {
  pesanan_dibuat: 'Pesanan Anda kami terima',
  pembayaran_diterima: 'Pembayaran Anda sudah masuk',
  pesanan_dikirim: 'Pesanan Anda dalam perjalanan',
  pesanan_selesai: 'Pesanan Anda telah selesai',
}

function paramsFor(template: keyof typeof SUBJECTS, order: NotifiableOrder): string[] {
  switch (template) {
    case 'pesanan_dibuat':
      return [order.customerName, order.code, formatRupiah(order.total)]
    case 'pesanan_dikirim':
      return [order.customerName, order.code, order.courierName ?? '-', order.trackingNumber ?? '-']
    default:
      return [order.customerName, order.code]
  }
}

/** Kegagalan notifikasi dicatat, tetapi tidak boleh menggagalkan pesanan. */
export async function notifyOrder(template: keyof typeof SUBJECTS, order: NotifiableOrder): Promise<void> {
  const params = paramsFor(template, order)
  const results = await Promise.allSettled([
    sendWhatsapp({ to: order.customerPhone, template, params }),
    sendEmail({
      to: order.customerEmail,
      subject: `${SUBJECTS[template]} (${order.code})`,
      text: `Halo ${order.customerName}, kode pesanan Anda ${order.code}. Lacak di /lacak dengan kode ini dan 4 digit terakhir nomor WhatsApp Anda.`,
    }),
  ])
  for (const result of results) {
    if (result.status === 'rejected') console.error(`Notifikasi ${template} gagal`, result.reason)
  }
}
