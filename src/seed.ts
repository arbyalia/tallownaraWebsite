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

const { totalDocs } = await payload.count({ collection: 'achievements' })

if (totalDocs > 0) {
  payload.logger.info('Galeri sudah berisi, dilewati.')
} else {
  const placeholders = [
    { title: '[[ISI: nama lomba pertama]]', kind: 'lomba', location: '[[ISI: lokasi]]' },
    { title: '[[ISI: nama lomba kedua]]', kind: 'lomba', location: '[[ISI: lokasi]]' },
    { title: 'EcoFuture Jakarta', kind: 'acara', location: 'Jakarta' },
    { title: 'TEI 2026', kind: 'acara', location: '[[ISI: lokasi]]' },
  ] as const

  for (const [index, item] of placeholders.entries()) {
    await payload.create({
      collection: 'achievements',
      data: {
        ...item,
        dateLabel: '[[ISI: waktu]]',
        summary: '[[ISI: cerita singkat, lalu unggah foto]]',
        sortOrder: index + 1,
        isVisible: true,
      },
    })
  }
  payload.logger.info('Galeri terisi dengan placeholder.')
}

process.exit(0)
