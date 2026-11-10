import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: { singular: 'Admin', plural: 'Admin' },
  admin: { useAsTitle: 'email' },
  auth: true,
  fields: [],
}
