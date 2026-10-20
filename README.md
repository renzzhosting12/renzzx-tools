# RenzX Tools

Website kumpulan tools online dengan dark mode hitam-ungu-biru neon, direktori website, pencarian, kategori, panel admin lokal, dan API serverless untuk Vercel.

## Fitur

- JSON Formatter / Minifier / Validator
- Base64 Encode dan Decode
- UUID v4 Generator
- Password Generator
- Text Counter
- URL Encoder dan Decoder
- Unix Timestamp Converter
- QR Code Generator (memakai layanan eksternal QR Server)
- Direktori website pilihan
- Pencarian lintas tools dan direktori
- Panel admin untuk menambah, mengedit, dan menghapus entri
- Endpoint API: `/api/health`, `/api/tools`, `/api/sites`
- Responsive untuk Android dan desktop

## Catatan penting panel admin

Panel admin saat ini **bersifat lokal di browser**. Perubahan disimpan ke `localStorage` perangkat/browser yang sedang dipakai. Perubahan tidak tersinkron ke pengunjung lain dan bukan sistem admin yang aman untuk produksi. Jangan memasukkan data rahasia. Untuk admin multi-user, tambahkan autentikasi server-side dan database (misalnya Neon PostgreSQL) sebelum dipakai secara publik.

Tool QR mengirim teks/URL yang dimasukkan ke layanan eksternal `api.qrserver.com`. Jangan gunakan untuk konten rahasia. Tool lain diproses di browser pengguna.

## Struktur proyek

```text
renzx-tools/
├── api/
│   ├── health.js
│   ├── sites.js
│   └── tools.js
├── assets/
├── app.js
├── index.html
├── package.json
├── styles.css
├── vercel.json
└── README.md
```

## Deployment lewat HP Android (gratis)

### Cara A — GitHub + Vercel

1. Ekstrak `renzx-tools-vercel.zip` di HP, atau unggah ZIP ke GitHub setelah mengekstraknya.
2. Buka [github.com](https://github.com), login, lalu buat repository baru bernama `renzx-tools`.
3. Unggah semua file dan folder proyek ke repository. Pastikan `index.html`, `styles.css`, `app.js`, `vercel.json`, dan folder `api/` ada di root repository, bukan di dalam folder bertingkat tambahan.
4. Buka [vercel.com](https://vercel.com) dan login, lalu pilih **Add New → Project**.
5. Impor repository `renzx-tools` dari GitHub.
6. Karena ini website statis dengan Vercel Functions, framework preset bisa dipilih **Other**. Build Command boleh dikosongkan; Output Directory gunakan root/default. Jangan mengatur output directory ke `public` karena file `index.html` berada di root.
7. Tekan **Deploy** dan tunggu proses selesai.
8. Setelah berhasil, Vercel akan memberi alamat subdomain seperti `nama-proyek.vercel.app`. Nama persisnya tergantung ketersediaan nama proyek; alamat belum dibuat sampai deployment berhasil.
9. Buka alamat yang diberikan Vercel. Tes `/api/health`, `/api/tools`, dan `/api/sites`.

### Cara B — lewat Vercel CLI (opsional)

Vercel CLI butuh terminal dengan Node.js. Di Android, gunakan lingkungan terminal yang kamu pahami; cara GitHub + dashboard Vercel biasanya lebih mudah.

## Tes API

- `GET /api/health` — status layanan.
- `GET /api/tools` — JSON berisi daftar tools bawaan.
- `GET /api/sites` — JSON berisi direktori website bawaan.

Contoh respons `/api/health`:

```json
{
  "success": true,
  "name": "RenzX Tools API",
  "version": "1.0.0",
  "status": "operational",
  "timestamp": "2026-01-01T00:00:00.000Z"
}
```

## Menambah tools

Untuk tools yang punya logika interaktif, tambahkan definisi pada `DEFAULT_TOOLS` dan markup serta logika pada `app.js`. Penambahan lewat panel admin hanya membuat entri custom di browser; itu tidak otomatis menghasilkan kode baru atau mengubah API publik.

## Keamanan dan batasan

- Tidak ada database cloud atau login admin pada versi ini.
- Jangan menyimpan token/API key rahasia di file frontend.
- Untuk API key, gunakan Vercel Environment Variables dan baca dari function server-side.
- Terapkan autentikasi dan validasi server-side sebelum membuat fitur admin yang mengubah data publik.
- Periksa syarat layanan situs eksternal yang ditautkan.
