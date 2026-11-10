# Tallownara

Website profil dan toko online tallownara.com. Next.js, Payload CMS 3, PostgreSQL, dan Tailwind CSS v4.

## Kebutuhan

- Node.js `^22.23.4` atau `>=24.22.1`
- Docker Desktop
- pnpm, tersedia lewat `corepack pnpm` (versi terkunci di `package.json`)

## Menjalankan di komputer lokal

```bash
cp .env.example .env              # lalu isi POSTGRES_PASSWORD, DATABASE_URL, PAYLOAD_SECRET
corepack pnpm install
corepack pnpm db:up               # menyalakan PostgreSQL di port 5433
corepack pnpm dev
```

- Website: http://localhost:3000
- Panel admin: http://localhost:3000/admin (kunjungan pertama membuat akun admin)

## Perintah lain

| Perintah | Fungsi |
|---|---|
| `corepack pnpm lint` | Pemeriksaan kode |
| `corepack pnpm typecheck` | Pemeriksaan tipe TypeScript |
| `corepack pnpm test` | Tes unit |
| `corepack pnpm build` | Build produksi |
| `corepack pnpm db:down` | Mematikan database (data tetap tersimpan) |
| `corepack pnpm generate:types` | Membuat ulang tipe Payload setelah koleksi berubah |
| `corepack pnpm generate:importmap` | Membuat ulang import map admin |

## Masalah umum

Bila muncul `unable to get local issuer certificate` di macOS, arahkan Node ke daftar sertifikat sistem:

```bash
export NODE_EXTRA_CA_CERTS=/etc/ssl/cert.pem
```
