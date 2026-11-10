import { z } from 'zod'

const serverEnvSchema = z.object({
  DATABASE_URL: z.string().min(1, 'Isi DATABASE_URL di berkas .env'),
  PAYLOAD_SECRET: z.string().min(32, 'Isi PAYLOAD_SECRET di .env, minimal 32 karakter acak'),
})

const parsed = serverEnvSchema.safeParse(process.env)

if (!parsed.success) {
  const messages = parsed.error.issues.map((issue) => `- ${issue.message}`).join('\n')
  throw new Error(`Konfigurasi .env belum lengkap:\n${messages}`)
}

export const serverEnv = parsed.data
