import { beforeAll, describe, expect, it } from 'vitest'

import { generateOtp, hashOtp, HISTORY_SESSION_MS, readSession, signSession, verifyOtpHash } from './otp'

beforeAll(() => {
  process.env.OTP_HASH_SECRET = 'rahasia-uji'
})

describe('OTP', () => {
  it('selalu 6 digit', () => {
    for (let i = 0; i < 100; i += 1) expect(generateOtp()).toMatch(/^\d{6}$/)
  })

  it('hash terikat ke nomor dan kode', () => {
    const hash = hashOtp('+628111', '123456')
    expect(hash).not.toContain('123456')
    expect(verifyOtpHash('+628111', '123456', hash)).toBe(true)
    expect(verifyOtpHash('+628111', '654321', hash)).toBe(false)
    expect(verifyOtpHash('+628222', '123456', hash)).toBe(false)
  })
})

describe('sesi riwayat', () => {
  it('membaca sesi sah', () => {
    expect(readSession(signSession('+628111'))).toBe('+628111')
  })

  it('menolak sesi kedaluwarsa dan yang diubah', () => {
    const token = signSession('+628111', 0)
    expect(readSession(token, HISTORY_SESSION_MS + 1)).toBeNull()
    expect(readSession(signSession('+628111').replace('+628111', '+628222'))).toBeNull()
    expect(readSession(undefined)).toBeNull()
  })
})
