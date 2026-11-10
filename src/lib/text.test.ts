import { describe, expect, it } from 'vitest'

import { toParagraphs } from './text'

describe('toParagraphs', () => {
  it('memisahkan paragraf pada baris kosong', () => {
    expect(toParagraphs('Satu.\n\nDua.')).toEqual(['Satu.', 'Dua.'])
  })

  it('menangani akhir baris Windows dan baris kosong berisi spasi', () => {
    expect(toParagraphs('Satu.\r\n\r\nDua.\n   \nTiga.')).toEqual(['Satu.', 'Dua.', 'Tiga.'])
  })

  it('mempertahankan baris tunggal dalam satu paragraf', () => {
    expect(toParagraphs('Baris satu\nbaris dua')).toEqual(['Baris satu\nbaris dua'])
  })

  it('mengembalikan daftar kosong untuk nilai kosong', () => {
    expect(toParagraphs(null)).toEqual([])
    expect(toParagraphs(undefined)).toEqual([])
    expect(toParagraphs('  \n\n ')).toEqual([])
  })
})
