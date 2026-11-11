import type { CollectionConfig } from 'payload'

export const WebhookEvents: CollectionConfig = {
  slug: 'webhook-events',
  labels: { singular: 'Webhook', plural: 'Catatan webhook' },
  admin: { useAsTitle: 'eventId', group: 'Sistem', defaultColumns: ['eventId', 'source', 'createdAt'] },
  access: { create: () => false, update: () => false, delete: () => false },
  fields: [
    { name: 'eventId', type: 'text', required: true, unique: true, label: 'ID kejadian' },
    { name: 'source', type: 'text', required: true, label: 'Sumber' },
  ],
}
