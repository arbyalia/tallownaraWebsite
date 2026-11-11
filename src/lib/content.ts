import config from '@payload-config'
import { getPayload } from 'payload'

export async function getAbout() {
  const payload = await getPayload({ config })
  return payload.findGlobal({ slug: 'about', depth: 1 })
}

export async function getSiteSettings() {
  try {
    const payload = await getPayload({ config })
    return await payload.findGlobal({ slug: 'site-settings', depth: 0 })
  } catch (error) {
    console.error('Gagal memuat identitas situs', error)
    return null
  }
}

export async function getProducts() {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'products',
    where: { isVisible: { equals: true } },
    sort: 'sortOrder',
    depth: 1,
    pagination: false,
  })
  return docs
}

export async function getProductBySlug(slug: string) {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'products',
    where: { and: [{ slug: { equals: slug } }, { isVisible: { equals: true } }] },
    depth: 1,
    limit: 1,
  })
  return docs[0] ?? null
}

export async function getApprovedReviews(productId: number) {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'reviews',
    where: { and: [{ status: { equals: 'disetujui' } }, { product: { equals: productId } }] },
    sort: '-createdAt',
    depth: 1,
    limit: 20,
  })
  return docs
}

export async function getFeaturedReviews() {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'reviews',
    where: { and: [{ status: { equals: 'disetujui' } }, { isFeatured: { equals: true } }] },
    sort: 'createdAt',
    depth: 1,
    limit: 4,
  })
  return docs
}

export async function getLegalPage(slug: string) {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'legal-pages',
    where: { slug: { equals: slug } },
    limit: 1,
  })
  return docs[0] ?? null
}

export async function getFaqs() {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({ collection: 'faqs', sort: 'sortOrder', pagination: false })
  return docs
}

export async function getVisibleAchievements() {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'achievements',
    where: { isVisible: { equals: true } },
    sort: 'sortOrder',
    depth: 1,
    pagination: false,
  })
  return docs
}
