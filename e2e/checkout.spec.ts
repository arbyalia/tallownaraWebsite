import AxeBuilder from '@axe-core/playwright'
import { expect, test, type Page } from '@playwright/test'

async function expectNoAxeViolations(page: Page) {
  const { violations } = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag22aa']).analyze()
  expect(violations.map(({ id, nodes }) => `${id}: ${nodes[0]?.target}`)).toEqual([])
}

test('tamu bisa membeli sampai pesanan Dibayar lewat simulasi', async ({ page }) => {
  await page.goto('/produk/luxury-tallow-balm')
  await page.getByRole('button', { name: /Masukkan .* ke keranjang/ }).click()
  await expect(page.getByRole('status').filter({ hasText: 'Sudah masuk' })).toBeVisible()
  await expectNoAxeViolations(page)

  await page.goto('/keranjang')
  await expect(page.getByRole('heading', { name: 'Keranjang', exact: true })).toBeVisible()
  await expectNoAxeViolations(page)
  await page.getByRole('link', { name: 'Lanjut ke checkout' }).click()

  await page.getByRole('button', { name: 'Lanjut ke pembayaran' }).click()
  await expect(page.locator('#customerName')).toBeFocused()
  await expect(page.getByText('Isi nama lengkap penerima')).toBeVisible()

  await page.getByLabel('Nama lengkap').fill('Pembeli Uji Coba')
  await page.getByLabel('Email').fill('uji@example.com')
  await page.getByLabel('Nomor WhatsApp').fill('0812 3456 7890')
  await page.getByLabel('Kecamatan tujuan').fill('Gubeng')
  await page.getByRole('button', { name: /Gubeng/ }).click()
  await page.getByLabel('Alamat lengkap').fill('Jl. Contoh Nomor 12, RT 01 RW 02')
  await page.getByRole('radio', { name: /JNE Reguler/ }).check()
  await page.getByRole('checkbox').check()
  await expectNoAxeViolations(page)

  await page.reload()
  await expect(page.getByLabel('Nama lengkap')).toHaveValue('Pembeli Uji Coba')
  await page.getByRole('radio', { name: /JNE Reguler/ }).check()
  await page.getByRole('checkbox').check()

  await page.getByRole('button', { name: 'Lanjut ke pembayaran' }).click()
  await page.waitForURL(/bayar-simulasi/)
  const code = page.url().match(/TLN-[A-Z0-9]{6}/)?.[0]
  expect(code).toBeTruthy()

  await page.getByRole('button', { name: /Bayar pesanan/ }).click()
  await page.waitForURL(/\/pesanan\//)
  await expect(page.getByRole('heading', { name: code })).toBeVisible()
  await expect(page.locator('[aria-current="step"]')).toContainText('Dibayar')
  await expectNoAxeViolations(page)

  await page.goto('/lacak')
  await page.getByLabel('Kode pesanan').fill(code!)
  await page.getByLabel('4 digit nomor WA').fill('7890')
  await page.getByRole('button', { name: 'Lacak pesanan' }).click()
  await expect(page.locator('[aria-current="step"]')).toContainText('Dibayar')

  const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth)
  expect(scrollWidth).toBeLessThanOrEqual(page.viewportSize()!.width)
})

for (const path of ['/', '/produk', '/tentang-kami', '/galeri', '/faq', '/kontak', '/syarat-ketentuan']) {
  test(`halaman ${path} lolos axe dan tanpa scroll horizontal`, async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 })
    await page.goto(path)
    await expectNoAxeViolations(page)
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth)
    expect(scrollWidth).toBeLessThanOrEqual(375)
  })
}
