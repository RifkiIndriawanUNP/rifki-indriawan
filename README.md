# Portfolio — Mohammad Rifki Indriawan

Next.js (App Router) + TypeScript. Plain CSS, tanpa library UI.

## Menjalankan di lokal

```bash
npm install
npm run dev        # http://localhost:3000
```

## Mengubah isi

Semua teks ada di `src/data/` (profile, projects, experience). Tampilan tidak perlu disentuh.

Aset yang perlu kamu taruh sendiri (kalau belum ada, tampil placeholder):

| File | Fungsi |
|---|---|
| `public/images/profile.jpg` | foto di hero |
| `public/images/projects/*.png` | gambar kartu proyek (nama file ada di `projects.ts`) |
| `public/images/experience/*.jpg` | foto di panel experience (nama file ada di `experience.ts`) |
| `public/cv/CV_Mohammad_Rifki_Indriawan.pdf` | file CV untuk tombol CV |

## Deploy ke Vercel

Push ke GitHub, lalu Import Project di vercel.com. Tidak perlu konfigurasi tambahan.

## Catatan teknis

- Efek refraksi Liquid Glass memakai SVG displacement filter di `backdrop-filter`, hanya didukung browser Chromium (Chrome, Edge, Brave). Browser lain otomatis memakai frosted glass biasa.
- Kolam koi: `src/lib/koi.ts`. Minigame: `src/lib/fishGame.ts`.
"# portfolio" 
