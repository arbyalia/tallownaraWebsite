import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { getPayload } from 'payload'

import config from './payload.config'

const payload = await getPayload({ config })

const about = await payload.findGlobal({ slug: 'about' })

if (about.storyBody) {
  payload.logger.info('Tentang kami sudah berisi, dilewati.')
} else {
  await payload.updateGlobal({
    slug: 'about',
    data: {
      heroTitle: 'Inovasi berpadu dengan tradisi',
      storyBody: [
        'Tallownara adalah merek perawatan diri asal Indonesia yang dibangun di sekitar Nusantara Grass-Fed Tallow, bersumber dari Indonesia dan tersertifikasi halal serta organik.',
        'Cerita kami bermula dari kekhawatiran seorang ibu yang hidup dengan PMOS, yang bayinya memiliki dermatitis atopik dan kulit sensitif. Perjalanannya mencari perawatan kulit alami dan lembut menginspirasi misi untuk menciptakan produk yang menutrisi kulit melalui kesederhanaan, sebagaimana alam menopang umat manusia melalui keharmonisan keanekaragaman hayati.',
        'Dalam perjalanan ini, kami menemukan tallow: bahan alami, ramah lingkungan, dan berkelanjutan dengan sejarah panjang penggunaan dalam perawatan kulit, sejak peradaban Mesir dan Yunani kuno. Profil asam lemaknya memiliki kesamaan dengan lipid kulit manusia, menjadikannya bahan menjanjikan untuk kondisioning dan pelembapan kulit.',
      ].join('\n\n'),
      vision:
        'Menjadi merek perawatan diri yang dipercaya secara global dan berkelanjutan, dibangun di atas tallow dan bahan baku bersumber lokal.',
      missions: [
        {
          text: 'Menyediakan produk perawatan kulit alami berbasis tallow yang menutrisi dan melembapkan kulit, dengan panduan riset ilmiah.',
        },
        {
          text: 'Memberdayakan anak-anak yatim piatu dan kurang mampu melalui partisipasi mereka dalam proses produksi kami.',
        },
        {
          text: 'Mendidik pelanggan tentang praktik perawatan kulit holistik sekaligus mempromosikan keberlanjutan.',
        },
        {
          text: 'Tetap berkomitmen menggunakan bahan baku Indonesia berkualitas tinggi bersumber lokal untuk mendukung ekonomi nasional.',
        },
      ],
      sourcingTitle: 'Dari peternak Tuban ke toples kami',
      sourcingBody: [
        'Tallownara mengubah lemak yang bersumber dari peternak sapi lokal di Tuban menjadi perawatan kulit premium melalui proses rendering yang cermat.',
        'Melalui pendekatan ini, kami berupaya memaksimalkan nilai produk ternak organik bersumber lokal, memberdayakan petani Indonesia, serta berkontribusi pada hubungan yang lebih berkelanjutan antara manusia dan ekosistem Bumi.',
      ].join('\n\n'),
      sourcingPoints: [
        {
          title: 'Sapi yang diberi pakan rumput',
          body: 'Tallow kami berasal dari sapi grass-fed, halal, dan organik, bersumber dari peternak lokal.',
        },
        {
          title: 'Peralatan SS 316Ti',
          body: 'Rendering memakai peralatan baja tahan karat SS 316Ti berkualitas tinggi untuk menjaga kualitas bahan baku.',
        },
        {
          title: 'Uji laboratorium dan BPOM',
          body: 'Produk telah melalui pengujian keamanan laboratorium dan memperoleh izin BPOM Indonesia.',
        },
      ],
      team: [
        { name: 'Khoirur Rahman, S.Ag', role: 'Direktur Utama', group: 'founder' },
        { name: 'Uni Nofianti, S.Si', role: 'Direktur Operasional', group: 'founder' },
        { name: 'Rijal A. Ramadhan, S.M', role: 'Direktur Keuangan', group: 'founder' },
        { name: 'Dr. Tika Siti Jatnika, Dra. M,Si', role: 'Komisaris', group: 'founder' },
        {
          name: 'Prof. Dr. Widya Fatriasari, S.Hut, M.M',
          role: 'Badan Riset dan Inovasi Nasional (BRIN)',
          group: 'advisor',
        },
        { name: 'Yan Razif', role: 'Direktur Ekspor Indonesia', group: 'advisor' },
      ],
    },
  })
  payload.logger.info('Tentang kami terisi dari profil perusahaan.')
}

const FOTO_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../public/foto')

async function foto(name: string, alt: string): Promise<number> {
  const filename = `${name}.webp`
  const { docs } = await payload.find({ collection: 'media', where: { filename: { equals: filename } }, limit: 1 })
  if (docs[0]) return docs[0].id
  const created = await payload.create({
    collection: 'media',
    data: { alt },
    filePath: path.join(FOTO_DIR, filename),
  })
  return created.id
}

// Foto halaman Tentang kami: hanya mengisi yang masih kosong.
const currentAbout = await payload.findGlobal({ slug: 'about', depth: 0 })
const TEAM_PHOTOS: Record<string, [string, string]> = {
  'Khoirur Rahman, S.Ag': ['tim-khoirur', 'Potret Khoirur Rahman'],
  'Uni Nofianti, S.Si': ['tim-uni', 'Potret Uni Nofianti'],
  'Rijal A. Ramadhan, S.M': ['tim-rijal', 'Potret Rijal A. Ramadhan'],
  'Dr. Tika Siti Jatnika, Dra. M,Si': ['tim-tika', 'Potret Dr. Tika Siti Jatnika'],
}
const team = await Promise.all(
  (currentAbout.team ?? []).map(async (member) => {
    const entry = TEAM_PHOTOS[member.name]
    return !member.photo && entry ? { ...member, photo: await foto(...entry) } : member
  }),
)
await payload.updateGlobal({
  slug: 'about',
  data: {
    team,
    storyImage:
      currentAbout.storyImage ?? (await foto('tangan-bayi', 'Tangan seorang ibu mengoleskan balm ke kaki bayi')),
    sourcingImage:
      currentAbout.sourcingImage ?? (await foto('produksi-ruang', 'Ruang produksi Tallownara yang bersih')),
  },
})

// Identitas dan angka (angka dari profil perusahaan).
const settings = await payload.findGlobal({ slug: 'site-settings' })
if (!settings.legalName) {
  await payload.updateGlobal({
    slug: 'site-settings',
    data: {
      legalName: '[[ISI: nama badan usaha]]',
      legalAddress: '[[ISI: alamat badan usaha]], Tuban, Jawa Timur',
      nib: '[[ISI: NIB]]',
      hours: 'Senin sampai Sabtu, [[ISI: jam buka]]',
      stats: [
        { value: '4,9/5', label: 'Peringkat e-commerce' },
        { value: '5K+', label: 'Produk terjual' },
        { value: '74%', label: 'Tingkat pembelian ulang' },
        { value: '356 kg', label: 'Lemak yang didaur ulang' },
      ],
    },
  })
}

// Produk. Harga, ukuran, dan berat adalah contoh sampai diisi pemilik.
const LUXURY_INGREDIENTS =
  'Beef Tallow, Simmondsia Chinensis (Jojoba) Seed Oil, Prunus Amygdalus Dulcis (Sweet Almond) Oil, Helianthus Annuus (Sunflower) Seed Oil, Calendula Officinalis Flower Extract (in Sunflower and Sweet Almond Oils), Rosa Canina Fruit Oil, Anthemis Nobilis Flower Oil, Lavandula Angustifolia Oil, Boswellia Carterii Oil.'
const SOAP_INGREDIENTS =
  'Aqua, Potassium Hydroxide, Organic Tallow, Ricinus Communis (Castor) Seed Oil, Cocos Nucifera (Coconut) Oil, Elaeis Guineensis (Palm) Oil, Hydroxyethylcellulose, Glycerin, Lavandula Angustifolia (Lavender) Oil, Vanilla Oleoresin, Benzyl Alcohol.'
const BALM_STORAGE = [
  'Simpan di tempat sejuk dan kering. Sebaiknya habiskan dalam 6 bulan setelah dibuka.',
  'Bila suhu penyimpanan berubah-ubah, tekstur balm bisa menjadi lebih lembut atau cair. Perubahan ini alami selama tidak muncul jamur atau aroma yang tidak biasa.',
].join('\n\n')

const PRODUCTS = [
  {
    slug: 'luxury-tallow-balm',
    name: 'Luxury Tallow Balm',
    tagline: 'Balm serbaguna dengan calendula untuk kulit kering',
    sizeLabel: '[[ISI: ukuran]]',
    price: 150000,
    stock: 50,
    weightGrams: 250,
    isBestSeller: true,
    bpomNumber: 'NA18250118219',
    halalNumber: '[[ISI: nomor sertifikat halal]]',
    description:
      'Pelembap serbaguna dari tallow sapi grass-fed dan minyak nabati, yang membantu melembapkan kulit kering. Bisa dipakai harian untuk wajah dan tubuh.\n\nTanpa petrolatum, paraben, sulfat, BHT, pewangi sintetis, dan pewarna sintetis.',
    benefits: ['Melembapkan kulit kering', 'Membantu menjaga skin barrier', 'Asam lemaknya menyerupai sebum, sehingga mudah menyerap', 'Serbaguna untuk wajah, tubuh, bibir, dan rambut kering'],
    howToUse: [
      'Sebagai pelembap: oleskan tipis pada kulit, lalu tambahkan sesuai kebutuhan hingga kulit terasa nyaman.',
      'Sebagai pijat: pijat perlahan melingkar, lalu vertikal dan horizontal, sekitar 1 menit pada area yang sama.',
      'Bisa juga dipakai sebagai cleansing balm untuk melepas riasan dan sebagai pelembap bibir.',
    ],
    ingredients: LUXURY_INGREDIENTS,
    storage: BALM_STORAGE,
    photos: [
      ['jar-whipped', 'Toples Luxury Tallow Balm dengan isi krim bertekstur lembut'],
      ['krim', 'Tekstur tallow balm berwarna gading'],
      ['jar-depan', 'Tampak depan toples Tallow Balm'],
    ],
  },
  {
    slug: 'tallow-balm-multifungsi',
    name: 'Tallow Balm Multifungsi',
    tagline: 'Pelembap alami grass-fed untuk bibir, tangan, dan wajah',
    sizeLabel: '[[ISI: ukuran]]',
    price: 120000,
    stock: 50,
    weightGrams: 250,
    isBestSeller: false,
    bpomNumber: '[[ISI: nomor BPOM]]',
    halalNumber: '[[ISI: nomor sertifikat halal]]',
    description:
      'Balm harian berbahan tallow sapi grass-fed yang praktis dibawa ke mana saja dan membantu melembapkan kulit.\n\nTanpa petrolatum, paraben, sulfat, BHT, pewangi sintetis, dan pewarna sintetis.',
    benefits: ['Melembapkan bibir, tangan, dan wajah', 'Membantu menjaga skin barrier'],
    howToUse: ['Ambil secukupnya, hangatkan di ujung jari, lalu oleskan tipis pada area yang terasa kering.'],
    ingredients: '[[ISI: komposisi lengkap]]',
    storage: BALM_STORAGE,
    photos: [
      ['jar-miring', 'Toples Tallow Balm Multifungsi'],
      ['toples-atas', 'Deretan toples balm terbuka dilihat dari atas'],
    ],
  },
  {
    slug: 'nourishing-tallow-liquid-soap',
    name: 'Nourishing Tallow Liquid Soap',
    tagline: 'Sabun cair tallow tanpa sulfat',
    sizeLabel: '[[ISI: ukuran]]',
    price: 95000,
    stock: 50,
    weightGrams: 300,
    isBestSeller: false,
    bpomNumber: 'NA18250702788',
    halalNumber: '[[ISI: nomor sertifikat halal]]',
    description:
      'Sabun cair dari tallow sapi grass-fed organik. Proses saponifikasi superfatting membantu membersihkan dengan lembut tanpa membuat kulit terasa kering.',
    benefits: ['Membersihkan dengan lembut', 'Melembapkan sekaligus membantu menjaga skin barrier', 'Tanpa sulfat'],
    howToUse: ['Tuang secukupnya pada telapak tangan atau spons, usap ke kulit basah, lalu bilas hingga bersih.'],
    ingredients: SOAP_INGREDIENTS,
    storage: 'Simpan di tempat sejuk dan kering, jauh dari sinar matahari langsung.',
    photos: [['botol-sabun', 'Botol Nourishing Tallow Liquid Soap']],
  },
]

const productIds: Record<string, number> = {}
for (const [index, { photos, benefits, howToUse, ...product }] of PRODUCTS.entries()) {
  const { docs } = await payload.find({ collection: 'products', where: { slug: { equals: product.slug } }, limit: 1, depth: 0 })
  if (docs[0]) {
    productIds[product.slug] = docs[0].id
    continue
  }
  const images = []
  for (const [name, alt] of photos) images.push(await foto(name, alt))
  const created = await payload.create({
    collection: 'products',
    data: {
      ...product,
      images,
      benefits: benefits.map((text) => ({ text })),
      howToUse: howToUse.map((text) => ({ text })),
      isExamplePrice: true,
      isVisible: true,
      sortOrder: index + 1,
    },
  })
  productIds[product.slug] = created.id
}
payload.logger.info('Produk siap.')

// Testimoni dari profil perusahaan.
const { totalDocs: reviewCount } = await payload.count({ collection: 'reviews' })
if (reviewCount === 0) {
  await payload.create({
    collection: 'reviews',
    data: {
      authorName: 'Istri Duta Besar Indonesia untuk Serbia',
      product: productIds['luxury-tallow-balm'],
      rating: 5,
      body: 'Sempurna untuk seseorang di usia saya. Produk ini melembapkan kulit saya di iklim dingin Eropa tanpa meninggalkan rasa berminyak. Aromanya netral, tanpa bau daging sapi.',
      photo: await foto('testimoni-1', 'Pelanggan memegang toples Tallow Balm di pameran'),
      status: 'disetujui',
      isFeatured: true,
    },
  })
  await payload.create({
    collection: 'reviews',
    data: {
      authorName: 'Pokriva Gloria',
      product: productIds['luxury-tallow-balm'],
      rating: 5,
      body: 'Ini produk luar biasa! Saya sangat suka karena produk organik dari Indonesia.',
      photo: await foto('testimoni-2', 'Pelanggan memperlihatkan toples Tallow Balm'),
      status: 'disetujui',
      isFeatured: true,
    },
  })
}

// Pencapaian: placeholder lama diganti data dari profil perusahaan.
type Entry = {
  title: string
  kind: 'lomba' | 'acara'
  dateLabel: string
  location: string
  summary: string
  photos: [string, string][]
  replaces?: string
}

const ENTRIES: Entry[] = [
  {
    title: 'Pemenang Pertama UMi Youthpreneur 2025',
    replaces: '[[ISI: nama lomba pertama]]',
    kind: 'lomba',
    dateLabel: '2025',
    location: '[[ISI: lokasi]]',
    summary: 'Diakui atas inovasi dan potensi kewirausahaan dalam mengembangkan Tallownara sebagai merek perawatan kulit halal bersumber lokal.',
    photos: [['umi-juara', 'Perwakilan Tallownara menerima penghargaan Juara 1 UMi Youthpreneur 2025']],
  },
  {
    title: '3 Teratas Kategori Perawatan Diri, DCE Telkomsel 2026',
    replaces: '[[ISI: nama lomba kedua]]',
    kind: 'lomba',
    dateLabel: '2026',
    location: '[[ISI: lokasi]]',
    summary: '3 teratas dalam program kewirausahaan dan pengembangan bisnis digital nasional.',
    photos: [['panggung', 'Perwakilan Tallownara memberi presentasi di panggung']],
  },
  {
    title: 'Pengakuan pasar internasional',
    kind: 'acara',
    dateLabel: '[[ISI: waktu]]',
    location: 'Serbia, Eropa',
    summary: 'Menerima minat pasar internasional dan peluang ekspor dari Serbia, termasuk minat dari mitra ritel lokal.',
    photos: [
      ['pameran-3', 'Tim Tallownara bersama mitra di stan Indonesia'],
      ['pameran-2', 'Tim Tallownara bersama pengunjung pameran'],
      ['pameran-1', 'Tim Tallownara bersama mitra di stan Indonesia'],
      ['pameran-4', 'Tim Tallownara bersama pengunjung di stan'],
      ['pameran-5', 'Tim Tallownara bersama pengunjung di stan'],
      ['rak-ritel', 'Rak toko ritel di Serbia'],
    ],
  },
  {
    title: 'Smesco Meet the Market, UMKM Terpilih',
    kind: 'acara',
    dateLabel: '[[ISI: waktu]]',
    location: '[[ISI: lokasi]]',
    summary: 'Dipilih di antara 250 UMKM Indonesia terpilih untuk peluang akses pasar dan pengembangan bisnis.',
    photos: [],
  },
  {
    title: 'Pertemuan Bisnis Chungnam Overseas Trade Fair 2026',
    kind: 'acara',
    dateLabel: '2026',
    location: '[[ISI: lokasi]]',
    summary: 'Berpartisipasi dalam program pencocokan bisnis internasional yang menghubungkan pelaku usaha Indonesia dengan pasar luar negeri potensial.',
    photos: [],
  },
  { title: 'EcoFuture Jakarta', kind: 'acara', dateLabel: '[[ISI: waktu]]', location: 'Jakarta', summary: '[[ISI: cerita singkat, lalu unggah foto]]', photos: [] },
  { title: 'TEI 2026', kind: 'acara', dateLabel: '2026', location: '[[ISI: lokasi]]', summary: '[[ISI: cerita singkat, lalu unggah foto]]', photos: [] },
]

for (const [index, { replaces, photos, ...entry }] of ENTRIES.entries()) {
  const { docs } = await payload.find({
    collection: 'achievements',
    where: { title: { in: [entry.title, replaces ?? entry.title] } },
    limit: 1,
    depth: 0,
  })
  const existing = docs[0]
  if (existing && !(existing.title === replaces || existing.summary?.startsWith('[[ISI') || !existing.photos?.length)) continue

  const photoIds = []
  for (const [name, alt] of photos) photoIds.push(await foto(name, alt))
  const data = { ...entry, photos: photoIds, sortOrder: index + 1, isVisible: true }
  if (existing) await payload.update({ collection: 'achievements', id: existing.id, data })
  else await payload.create({ collection: 'achievements', data })
}
payload.logger.info('Pencapaian siap.')

// Halaman kebijakan dan FAQ: templat awal, perlu ditinjau pemilik dan penasihat hukum.
const IDENTITY = '[[ISI: nama badan usaha]], beralamat di [[ISI: alamat badan usaha]]'
const LEGAL = [
  {
    slug: 'syarat-ketentuan',
    title: 'Syarat & Ketentuan',
    lead: 'Dengan berbelanja di tallownara.com, Anda menyetujui ketentuan berikut.',
    sections: [
      ['Penjual', `Website ini dikelola oleh ${IDENTITY}, NIB [[ISI: NIB]].`],
      ['Pemesanan', 'Pesanan dibuat tanpa perlu akun. Anda wajib mengisi nama, email, nomor WhatsApp, dan alamat dengan benar. Setiap pesanan mendapat kode dengan awalan TLN-.'],
      ['Harga dan pembayaran', 'Harga tercantum dalam rupiah. Ongkos kirim dihitung otomatis sesuai alamat dan kurir pilihan Anda. Pembayaran tersedia melalui QRIS, virtual account, e-wallet, dan kartu. Bayar di tempat (COD) belum tersedia.\n\nPesanan yang tidak dibayar dalam 24 jam otomatis kedaluwarsa.'],
      ['Stok', 'Stok dikurangi setelah pembayaran terkonfirmasi. Bila stok habis setelah Anda membayar, kami akan menghubungi Anda untuk mengganti produk atau mengembalikan dana.'],
      ['Pengiriman', 'Pesanan dikirim dari Tuban, Jawa Timur melalui kurir yang Anda pilih. Nomor resi kami kirim lewat WhatsApp. Estimasi waktu berasal dari kurir dan dapat berubah.'],
      ['Penggunaan produk', 'Produk kami adalah kosmetik, bukan obat. Hentikan pemakaian dan hubungi tenaga kesehatan bila muncul reaksi yang tidak diinginkan.'],
      ['Hukum yang berlaku', 'Ketentuan ini tunduk pada hukum Republik Indonesia. Sengketa diselesaikan lebih dulu secara musyawarah.'],
    ],
  },
  {
    slug: 'kebijakan-pengembalian',
    title: 'Kebijakan pengembalian',
    lead: 'Bila pesanan Anda bermasalah, kami bantu menyelesaikannya.',
    sections: [
      ['Batas waktu', 'Pengajuan dilakukan paling lambat 2 hari kerja setelah paket diterima, berdasarkan data pengiriman kurir.'],
      ['Yang bisa diajukan', 'Produk rusak saat diterima, produk tidak sesuai pesanan, atau jumlah barang kurang. Demi kebersihan, produk yang sudah dibuka tanpa cacat tidak dapat dikembalikan.'],
      ['Cara mengajukan', 'Hubungi WhatsApp +62 815-819-2911 atau hello@tallownara.com. Sertakan kode pesanan, foto produk, dan video saat membuka paket.'],
      ['Penyelesaian', 'Setelah pengajuan disetujui, kami mengirim produk pengganti atau mengembalikan dana melalui metode yang disepakati dalam [[ISI: jumlah hari]] hari kerja. Ongkos kirim pengembalian karena kesalahan kami menjadi tanggungan kami.'],
    ],
  },
  {
    slug: 'kebijakan-privasi',
    title: 'Kebijakan privasi',
    lead: 'Kami menjaga data pribadi Anda sesuai Undang-Undang Nomor 27 Tahun 2022 tentang Pelindungan Data Pribadi.',
    sections: [
      ['Pengendali data', `Pengendali data pribadi adalah ${IDENTITY}. Hubungi hello@tallownara.com untuk urusan data pribadi.`],
      ['Data yang kami kumpulkan', 'Nama, email, nomor WhatsApp, alamat pengiriman, serta rincian pesanan. Kami tidak menyimpan nomor kartu Anda; data pembayaran diproses langsung oleh penyedia pembayaran.'],
      ['Tujuan penggunaan', 'Memproses dan mengirim pesanan, mengirim notifikasi status pesanan, memverifikasi akses Riwayat pesanan, dan memenuhi kewajiban hukum. Kami tidak mengirim promosi lewat notifikasi pesanan.'],
      ['Pihak yang menerima data', 'Data dibagikan seperlunya kepada penyedia pembayaran (Midtrans), agregator dan kurir pengiriman, dan penyedia layanan pesan (WhatsApp, email). Kami tidak menjual data Anda.'],
      ['Lama penyimpanan', 'Data pesanan disimpan selama [[ISI: masa simpan]] untuk keperluan layanan dan pembukuan, lalu dihapus atau dianonimkan.'],
      ['Hak Anda', 'Anda berhak mengakses, memperbaiki, menghapus data, dan menarik persetujuan sesuai ketentuan UU PDP. Kirim permintaan ke hello@tallownara.com.'],
      ['Keamanan', 'Kami menggunakan koneksi terenkripsi dan membatasi akses data hanya kepada pihak yang berkepentingan.'],
    ],
  },
]

for (const { sections, ...page } of LEGAL) {
  const { totalDocs: exists } = await payload.count({ collection: 'legal-pages', where: { slug: { equals: page.slug } } })
  if (exists > 0) continue
  await payload.create({
    collection: 'legal-pages',
    data: { ...page, updatedLabel: '[[ISI: tanggal terbit]]', sections: sections.map(([heading, body]) => ({ heading, body })) },
  })
}

const { totalDocs: faqCount } = await payload.count({ collection: 'faqs' })
if (faqCount === 0) {
  const FAQS: [string, string, 'produk' | 'pesanan' | 'pengiriman'][] = [
    ['Apa itu tallow?', 'Tallow adalah lemak sapi yang dimurnikan. Asam lemaknya menyerupai sebum pada kulit manusia, sehingga sudah dipakai sebagai pelembap sejak ribuan tahun lalu.', 'produk'],
    ['Apakah aromanya seperti daging sapi?', 'Tidak. Tallow kami melalui penyaringan ganda, dan pembeli kami menggambarkan aromanya netral.', 'produk'],
    ['Apakah produknya terdaftar di BPOM dan halal?', 'Ya. Nomor notifikasi BPOM dan informasi sertifikat halal tercantum di halaman setiap produk.', 'produk'],
    ['Berapa lama produk bisa dipakai setelah dibuka?', 'Tallow balm sebaiknya dihabiskan dalam 6 bulan setelah dibuka. Simpan di tempat sejuk dan kering.', 'produk'],
    ['Mengapa tekstur balm berubah?', 'Suhu yang berubah-ubah bisa membuat balm lebih lembut atau cair. Ini alami selama tidak muncul jamur atau aroma yang tidak biasa.', 'produk'],
    ['Apakah saya harus membuat akun?', 'Tidak. Anda cukup mengisi nama, email, nomor WhatsApp, dan alamat saat checkout.', 'pesanan'],
    ['Metode pembayaran apa saja yang tersedia?', 'QRIS, virtual account bank, e-wallet, dan kartu. Bayar di tempat (COD) belum tersedia.', 'pesanan'],
    ['Berapa lama batas pembayaran?', 'Pesanan otomatis kedaluwarsa bila belum dibayar dalam 24 jam.', 'pesanan'],
    ['Bagaimana cara melacak pesanan?', 'Buka halaman Lacak pesanan, lalu masukkan kode pesanan dan 4 digit terakhir nomor WhatsApp Anda.', 'pengiriman'],
    ['Dari mana pesanan dikirim?', 'Dari Tuban, Jawa Timur. Ongkos kirim dan estimasi tiba muncul otomatis saat checkout.', 'pengiriman'],
    ['Bagaimana bila produk rusak saat diterima?', 'Ajukan paling lambat 2 hari kerja setelah paket diterima, sertakan kode pesanan dan video membuka paket. Lihat Kebijakan pengembalian untuk rinciannya.', 'pengiriman'],
  ]
  for (const [index, [question, answer, category]] of FAQS.entries()) {
    await payload.create({ collection: 'faqs', data: { question, answer, category, sortOrder: index + 1 } })
  }
}

process.exit(0)
