import { APIError, type CollectionConfig, type Field } from 'payload'

import { notifyOrder } from '../lib/orders/notify'
import { canTransition, ORDER_STATUSES, STATUS_LABELS, type OrderStatus } from '../lib/orders/status'

const readOnly = { readOnly: true }

const moneyField = (name: string, label: string): Field => ({
  name,
  type: 'number',
  label,
  required: true,
  admin: readOnly,
})

export const Orders: CollectionConfig = {
  slug: 'orders',
  labels: { singular: 'Pesanan', plural: 'Pesanan' },
  admin: {
    useAsTitle: 'code',
    defaultColumns: ['code', 'status', 'customerName', 'total', 'trackingNumber', 'createdAt'],
    group: 'Toko',
    description: 'Status Dibayar hanya diisi otomatis dari konfirmasi gateway pembayaran.',
  },
  defaultSort: '-createdAt',
  access: { create: () => false, delete: () => false },
  hooks: {
    beforeChange: [
      ({ data, operation, originalDoc, req }) => {
        const nextStatus = data.status as OrderStatus | undefined
        const now = new Date().toISOString()

        if (operation === 'create') {
          data.statusHistory = [{ status: nextStatus ?? 'menunggu_pembayaran', at: now }]
          return data
        }

        const currentStatus = originalDoc?.status as OrderStatus
        if (!nextStatus || nextStatus === currentStatus) return data

        if (!canTransition(currentStatus, nextStatus)) {
          throw new APIError(
            `Status tidak bisa diubah dari ${STATUS_LABELS[currentStatus]} ke ${STATUS_LABELS[nextStatus]}.`,
            400,
            undefined,
            true,
          )
        }
        if (nextStatus === 'dibayar' && !req.context.verifiedPayment) {
          throw new APIError('Status Dibayar hanya bisa datang dari konfirmasi gateway.', 400, undefined, true)
        }
        if (nextStatus === 'dikirim' && !(data.trackingNumber ?? originalDoc?.trackingNumber)) {
          throw new APIError('Isi nomor resi sebelum mengubah status ke Dikirim.', 400, undefined, true)
        }

        data.statusHistory = [...(originalDoc?.statusHistory ?? []), { status: nextStatus, at: now }]
        return data
      },
    ],
    afterChange: [
      async ({ doc, previousDoc, operation }) => {
        if (operation !== 'update' || doc.status === previousDoc?.status) return doc
        if (doc.status === 'dikirim') await notifyOrder('pesanan_dikirim', doc)
        if (doc.status === 'selesai') await notifyOrder('pesanan_selesai', doc)
        return doc
      },
    ],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Ringkasan',
          fields: [
            { name: 'code', type: 'text', label: 'Kode pesanan', required: true, unique: true, admin: readOnly },
            {
              name: 'status',
              type: 'select',
              label: 'Status',
              required: true,
              defaultValue: 'menunggu_pembayaran',
              options: ORDER_STATUSES.map((value) => ({ value, label: STATUS_LABELS[value] })),
            },
            {
              name: 'items',
              type: 'array',
              label: 'Barang',
              required: true,
              admin: readOnly,
              fields: [
                { name: 'productId', type: 'number', required: true, label: 'ID produk' },
                { name: 'name', type: 'text', required: true, label: 'Nama' },
                { name: 'unitPrice', type: 'number', required: true, label: 'Harga satuan' },
                { name: 'quantity', type: 'number', required: true, label: 'Jumlah' },
                { name: 'weightGrams', type: 'number', required: true, label: 'Berat (gram)' },
              ],
            },
            {
              type: 'row',
              fields: [
                moneyField('subtotal', 'Subtotal'),
                moneyField('shippingCost', 'Ongkir'),
                moneyField('total', 'Total'),
              ],
            },
          ],
        },
        {
          label: 'Pembeli',
          fields: [
            { name: 'customerName', type: 'text', label: 'Nama', required: true, admin: readOnly },
            { name: 'customerEmail', type: 'email', label: 'Email', required: true, admin: readOnly },
            { name: 'customerPhone', type: 'text', label: 'Nomor WhatsApp', required: true, index: true, admin: readOnly },
            { name: 'addressStreet', type: 'textarea', label: 'Alamat', required: true, admin: readOnly },
            { name: 'areaLabel', type: 'text', label: 'Kecamatan', required: true, admin: readOnly },
            { name: 'areaId', type: 'text', label: 'Kode area agregator', required: true, admin: readOnly },
            { name: 'postalCode', type: 'text', label: 'Kode pos', required: true, admin: readOnly },
          ],
        },
        {
          label: 'Pengiriman',
          fields: [
            { name: 'trackingNumber', type: 'text', label: 'Nomor resi', index: true },
            { name: 'shippingProvider', type: 'text', label: 'Penyedia', required: true, admin: readOnly },
            { name: 'courierCode', type: 'text', label: 'Kode kurir', required: true, admin: readOnly },
            { name: 'courierName', type: 'text', label: 'Kurir', required: true, admin: readOnly },
            { name: 'serviceCode', type: 'text', label: 'Kode layanan', required: true, admin: readOnly },
            { name: 'serviceName', type: 'text', label: 'Layanan', required: true, admin: readOnly },
          ],
        },
        {
          label: 'Pembayaran',
          fields: [
            { name: 'paymentProvider', type: 'text', label: 'Penyedia', admin: readOnly },
            { name: 'paymentUrl', type: 'text', label: 'Tautan pembayaran', admin: readOnly },
            { name: 'accessToken', type: 'text', label: 'Token akses halaman pesanan', required: true, admin: { hidden: true } },
            { name: 'expiresAt', type: 'date', label: 'Batas pembayaran', required: true, index: true, admin: readOnly },
            { name: 'paidAt', type: 'date', label: 'Dibayar pada', admin: readOnly },
          ],
        },
        {
          label: 'Riwayat',
          fields: [
            {
              name: 'statusHistory',
              type: 'array',
              label: 'Riwayat status',
              admin: readOnly,
              fields: [
                { name: 'status', type: 'text', required: true, label: 'Status' },
                { name: 'at', type: 'date', required: true, label: 'Waktu' },
              ],
            },
          ],
        },
      ],
    },
  ],
}
