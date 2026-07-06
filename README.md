# RitualCostume — Panduan dari Nol

Ini bukan cuma file penjelasan, ini peta jalan lengkap projekmu. Simpan file ini di repo-mu juga (nanti akan dijelaskan caranya) supaya kamu selalu bisa buka lagi kapan pun lupa langkahnya.

---

## Peta besar (baca dulu sebelum mulai)

| Fase | Isi | Status |
|---|---|---|
| 0 | Siapkan repo GitHub + sambungkan ke Vercel | **kita kerjakan sekarang** |
| 1 | Upload starter project (yang sudah aku buatkan) ke repo | **kita kerjakan sekarang** |
| 2 | Ganti aset placeholder dengan gambar asli hasil desainmu | langkah kamu berikutnya |
| 3 | Rapikan tampilan (warna, font, layout) sesuai selera | opsional, bisa kapan saja |
| 4 | Sambungkan tombol "Mint" ke smart contract di testnet Ritual | fase lanjutan, butuh sesi terpisah |
| 5 | Beli domain / atur subdomain jika perlu sub-web | fase lanjutan |

Kita akan jalan pelan-pelan, satu fase selesai baru lanjut. Sekarang fokus ke **Fase 0 dan 1** dulu.

---

## FASE 0 — Membuat Repo GitHub

1. Buka [github.com](https://github.com) dan login ke akunmu.
2. Klik tombol hijau **"New"** (atau ikon `+` di kanan atas → **New repository**).
3. Isi:
   - **Repository name**: `ritualcostume` (boleh diganti nanti, tidak masalah)
   - **Public** atau **Private**: pilih **Public** dulu supaya Vercel gratis bisa deploy tanpa batasan.
   - Centang **"Add a README file"** — TIDAK USAH dicentang, karena kita akan upload README sendiri.
4. Klik **Create repository**.

Sekarang kamu punya repo kosong. Alamatnya akan seperti:
`https://github.com/username-kamu/ritualcostume`

---

## FASE 1 — Upload Starter Project (tanpa perlu tahu perintah git)

Karena kamu belum familiar dengan git/terminal, kita pakai cara paling gampang dulu: **upload lewat browser**.

1. Di halaman repo yang baru dibuat, klik **"uploading an existing file"** (link ini muncul otomatis di repo kosong), atau klik tombol **Add file → Upload files**.
2. Dari komputer kamu, **drag & drop seluruh isi folder** `ritualcostume` yang sudah aku siapkan (semua file: `index.html`, `style.css`, `script.js`, `config.js`, `README.md`, dan folder `assets/` beserta isinya).
   - Pastikan struktur foldernya tetap sama persis seperti yang aku kirim. GitHub akan mempertahankan struktur folder saat kamu drag folder ke area upload.
3. Scroll ke bawah, isi kolom commit message misalnya: `upload starter project`.
4. Klik **Commit changes**.

Setelah selesai, repo kamu sekarang berisi semua file project.

> **Catatan untuk nanti:** cara upload manual ini cukup untuk sekarang. Begitu kamu mulai sering gonta-ganti file, kita akan pindah ke cara yang lebih efisien pakai GitHub Desktop (aplikasi, tanpa perlu ketik command sama sekali). Tapi itu belakangan saja, tidak perlu dipikirkan sekarang.

---

## FASE 0.5 (paralel) — Menyambungkan Vercel

1. Buka [vercel.com](https://vercel.com) dan login pakai akun GitHub yang sama.
2. Klik **Add New → Project**.
3. Vercel akan menampilkan daftar repo GitHub kamu. Cari **ritualcostume**, klik **Import**.
4. Karena project ini HTML/CSS/JS polos (bukan Next.js/React), di bagian **Framework Preset** pilih **"Other"**. Biarkan **Build Command** dan **Output Directory** kosong/default — Vercel otomatis menyajikan file statis apa adanya.
5. Klik **Deploy**.
6. Tunggu 30–60 detik. Setelah selesai, Vercel memberi kamu alamat seperti:
   `https://ritualcostume.vercel.app`

Buka alamat itu di browser. Kalau avatar lab-nya muncul dan kamu bisa klik-klik ganti kostum, **berarti Fase 0 dan 1 sukses total.**

---

## Cara kerja pengecekan satu-per-satu

Setiap kali kamu upload perubahan baru ke GitHub (lewat cara apa pun), Vercel **otomatis** akan build ulang dan update alamat websitemu dalam hitungan detik. Jadi alur kerja normalmu nanti:

```
edit file  →  upload ke GitHub  →  Vercel auto-deploy  →  cek di browser
```

Tidak perlu setting tambahan apa pun untuk ini, sudah otomatis begitu repo tersambung.

---

## Tentang starter project yang aku buatkan

Aku sudah bangun kerangka fungsional lengkap supaya kamu punya sesuatu yang **benar-benar bisa dicoba**, bukan cuma teori:

- `index.html` — struktur halaman: panel preview avatar di kiri, panel pilihan kostum di kanan.
- `style.css` — tampilan visual bertema "ritual lab": gelap, aksen bara/emas/verdigris, cincin sigil berputar pelan di sekeliling avatar.
- `config.js` — **file yang akan paling sering kamu edit.** Semua daftar pilihan (skin, hat, clothes, glasses, background) didefinisikan di sini. Tambah gambar baru = tambah satu baris di sini.
- `script.js` — logika penggambaran layer di canvas, tombol unduh JPG, dan tombol bagikan ke X.
- `assets/` — gambar **placeholder** (bentuk & warna sederhana) untuk tiap kategori, supaya demo langsung jalan. Ini yang akan kamu ganti satu-satu dengan karya aslimu di Fase 2.

### Urutan tumpukan gambar (dari belakang ke depan)
`background → skin → clothes → glasses → hat`

Kalau nanti karyamu perlu urutan berbeda (misal rambut di atas topi, dsb), tinggal bilang ke aku, gampang diubah.

---

## FASE 2 — Mengganti aset placeholder dengan karya aslimu

Aturan mainnya simpel:

1. Setiap gambar berukuran **600x600 piksel**, format **PNG dengan background transparan**.
2. Simpan dengan nama yang sama seperti placeholder-nya (atau nama baru — asal kamu juga tambahkan barisnya di `config.js`).
3. Upload ke folder `assets/<kategori>/` yang sesuai lewat GitHub (Add file → Upload files, pilih folder tujuan).
4. Kalau menambah pilihan **baru** (bukan sekadar mengganti), tambahkan satu entri baru di `config.js` — formatnya sudah ada contohnya dan dikomentari dalam bahasa Indonesia.

Begitu kamu siap dengan aset pertamamu, kirim ke aku dan aku bantu pasang & rapikan satu per satu.

---

## Catatan penting soal berbagi ke X

Link "intent" X (`twitter.com/intent/tweet`) **hanya bisa** mengisi teks + link secara otomatis — X tidak mengizinkan gambar ikut terlampir otomatis lewat cara ini (alasan keamanan dari pihak X sendiri, bukan batasan dari sisi kita). Jadi alur yang paling realistis:

1. Pengguna klik **"Unduh JPG"** dulu → gambar tersimpan di perangkat mereka.
2. Klik **"Bagikan ke X"** → terbuka jendela compose tweet dengan teks sudah terisi.
3. Pengguna tinggal lampirkan gambar yang baru diunduh secara manual.

Ini pattern yang sama dipakai kebanyakan web serupa (Canva, Notion, dll) — bukan sesuatu yang perlu diperbaiki, memang begitu cara kerja platform X.

---

## FASE 4 — Minting NFT di testnet Ritual (belum dibangun)

Bagian ini sengaja belum aku buat sekarang karena butuh beberapa keputusan dulu dari kamu:

- Apakah sudah ada **smart contract** NFT-nya, atau perlu dibuatkan dari nol?
- Mau pakai library apa untuk koneksi wallet (biasanya **wagmi** atau **ethers.js**)?
- Wallet apa yang mau didukung (Metamask saja, atau lebih banyak)?

Begitu Fase 0–2 sudah jalan dan kamu nyaman dengan alurnya, kita lanjut ke sesi khusus untuk fase ini. Tombol "Mint" di halaman sudah aku siapkan tempatnya (masih nonaktif/disabled), jadi struktur sudah siap dipasangi begitu waktunya tiba.

---

## Kalau ada yang error / bingung

Screenshot saja apa yang kamu lihat (pesan error, tampilan aneh, dll) dan kirim ke aku bareng penjelasan singkat kamu lagi coba apa. Kita selesaikan satu-satu, tidak masalah kalau harus bolak-balik.
