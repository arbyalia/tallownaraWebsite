import config from '@payload-config'
import { getPayload } from 'payload'

export async function getAbout() {
  const payload = await getPayload({ config })
  return payload.findGlobal({ slug: 'about', depth: 1 })
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
