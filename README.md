# RitualCostume — Panduan dari Nol

Ini bukan cuma file penjelasan, ini peta jalan lengkap projekmu. Simpan file ini di repo-mu juga (nanti akan dijelaskan caranya) supaya kamu selalu bisa buka lagi kapan pun lupa langkahnya.

---

## 🔧 Perbaikan terbaru — kalau ada gambar background tidak muncul

Penyebab paling umum kasus ini: gambar background ter-upload ke **lokasi yang salah** (misalnya masuk ke `assets/bg-01.png`, padahal seharusnya `assets/background/bg-01.png`), atau nama filenya sedikit beda dari yang tertulis di `config.js`.

**Cara mengecek dengan cepat:**
1. Buka repo GitHub-mu, masuk ke folder `assets`, lalu masuk ke folder `background`.
2. Pastikan di dalam folder itu ada persis 3 file bernama: `bg-01.png`, `bg-02.png`, `bg-03.png` (huruf kecil semua, tanpa spasi, akhiran `.png`).
3. Kalau nama file kamu beda (misalnya `Background 1.png` atau `bg1.jpg`), itu penyebabnya — GitHub sensitif huruf besar/kecil dan config.js mencari nama yang persis sama.

**Cara paling gampang membetulkannya:** upload ulang 3 gambar backgroundmu ke dalam folder `assets/background/` (masuk dulu ke folder `background` di GitHub sebelum klik Upload files), dan pastikan saat upload namanya otomatis jadi `bg-01.png`, `bg-02.png`, `bg-03.png` — kalau perlu, rename dulu file di komputermu sebelum upload supaya namanya pas.

Kalau sudah dicek dan masih belum muncul juga, kirim screenshot isi folder `assets/background/` di GitHub, biar aku bandingkan langsung dengan `config.js`.

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
2. Dari komputer kamu, drag & drop file-file utama dulu: `index.html`, `style.css`, `script.js`, `config.js`, `README.md`.
3. Scroll ke bawah, isi commit message, klik **Commit changes**.

### Khusus untuk folder `assets/` (ini yang kemarin terlewat)

GitHub kadang tidak menangkap struktur folder kalau kamu drag file satu-satu dari dalam folder `assets`. Cara paling aman:

**Cara A — drag folder itu sendiri, bukan isinya:**
1. Buka **Add file → Upload files** lagi.
2. Di File Explorer (Windows) / Finder (Mac), jangan masuk ke dalam folder `assets`. Cukup **drag folder `assets` itu sendiri** (ikon foldernya) ke area upload GitHub.
3. Kalau berhasil, kamu akan melihat daftar file di area upload dengan path lengkap seperti `assets/skin/skin-01.png`, `assets/hat/hat-01.png`, dst. Kalau yang muncul cuma nama file tanpa `assets/...` di depannya, berarti strukturnya tidak terbawa — ulangi dengan cara B.

**Cara B — upload per subfolder (paling stabil, sedikit lebih banyak klik):**
1. Klik **Add file → Upload files**.
2. Masuk ke dalam folder `assets` di komputer kamu, lalu drag folder `skin` saja (satu folder) ke area upload.
3. Commit. Ulangi lagi untuk folder `hat`, `clothes`, `glasses`, `background`, `ritual` satu per satu (klik Upload files lagi tiap kali).

Cara B memang lebih banyak langkah, tapi hampir tidak pernah gagal karena setiap kali kamu cuma upload satu folder.

4. Setelah semua terupload, cek dengan membuka repo GitHub-mu di browser — pastikan struktur foldernya seperti ini:

```
ritualcostume/
├── index.html
├── style.css
├── script.js
├── config.js
├── README.md
└── assets/
    ├── background/
    ├── skin/
    ├── hat/
    ├── clothes/
    ├── glasses/
    └── ritual/
```

5. Vercel akan otomatis mendeteksi perubahan ini dan build ulang dalam beberapa detik. Buka lagi alamat `.vercel.app` kamu — sekarang gambar-gambar seharusnya sudah muncul di setiap swatch dan di preview avatar.

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

- `index.html` — struktur halaman: preview avatar + 4 kucing hitam berlari mengelilinginya di kiri, panel tab kostum di kanan.
- `style.css` — tema visual "magic dark green x turquoise": latar hijau gelap nyaris hitam, aksen toska bercahaya, putih & hitam sebagai warna pendukung, font playful (Baloo 2 untuk judul, Quicksand untuk teks).
- `config.js` — **file yang akan paling sering kamu edit.** Semua daftar pilihan (skin, hat, clothes, glasses, ritual, background) didefinisikan di sini.
- `script.js` — logika tab, strip scroll horizontal, penggambaran layer di canvas, tombol download, share ke X.
- `assets/` — gambar **placeholder** untuk tiap kategori, plus folder `logo/` berisi logo placeholder.

### Cara kerja panel kostum yang baru (tab, bukan daftar panjang ke bawah)

Sekarang panel kanan berbentuk **tab**: SKIN, HAT, CLOTHES, GLASSES, RITUAL, BACKGROUND (urutan ini sesuai permintaanmu, dari kiri ke kanan). Klik salah satu tab, di bawahnya muncul strip berisi semua pilihan kategori itu yang bisa di-scroll ke samping (drag, scroll mouse, atau klik tombol panah ‹ ›).

**Ini didesain supaya bisa menampung ratusan pilihan tanpa bikin halaman berantakan.** Kamu bisa isi sampai 100+ gambar per kategori di `config.js` — tidak perlu ubah HTML/CSS sama sekali, strip-nya otomatis bisa di-scroll sepanjang apa pun daftarnya.

### Urutan tumpukan gambar di canvas (beda dari urutan tab!)

Urutan **tab** (tampilan) ≠ urutan **tumpukan gambar** (bagaimana lapisan digambar di atas satu sama lain). Dua hal ini sengaja dipisah di `config.js`:

- `TAB_ORDER` — urutan tombol tab: `skin → hat → clothes → glasses → ritual → background`
- `LAYER_ORDER` — urutan gambar ditumpuk di canvas: `background → skin → hat → clothes → glasses → ritual`

Kalau salah satu mau diubah, edit array yang sesuai di bagian atas `config.js`.

### Mengganti logo

Logo ada di pojok kiri atas (lingkaran kecil di sebelah tulisan "RITUALCOSTUME"). Untuk menggantinya:

1. Siapkan gambar logo, idealnya persegi (misal 200x200 piksel), format PNG, background transparan kalau ada.
2. Beri nama file **persis** `logo.png`.
3. Di GitHub, masuk ke folder `assets/logo/`, klik **Add file → Upload files**, upload `logo.png` kamu — akan otomatis menimpa placeholder yang lama.
4. Refresh halaman Vercel-mu, logo baru langsung muncul. Tidak perlu edit `index.html` sama sekali karena sudah otomatis menunjuk ke file itu.

### Animasi kucing berlari

4 kucing hitam sekarang berlari mengelilingi lingkaran avatar (menggantikan animasi cincin putus-putus yang sebelumnya). Ini murni CSS (tidak pakai gambar terpisah), jadi otomatis menyesuaikan ukuran layar. Kalau kamu ingin ubah kecepatan larinya, cari `8s` di bagian `.cat-track` dan `.cat-pos` pada `style.css` — angka itu durasi satu putaran penuh, makin kecil makin cepat.

---

## FASE 2 — Mengganti aset placeholder dengan karya aslimu

### Aturan teknis gambar

1. Setiap gambar berukuran **600 x 600 piksel** persis (sama seperti canvas di `index.html`).
2. Format **PNG**, bukan JPG — karena PNG mendukung **background transparan**. Bagian yang transparan akan menampilkan lapisan di belakangnya (misal transparan di bagian tubuh untuk gambar topi, supaya skin di bawahnya tetap terlihat).
3. Simpan dengan nama yang sama seperti placeholder-nya kalau sekadar **mengganti** (contoh: gambar barumu tetap dinamai `skin-01.png`, menimpa yang lama). Kalau mau **menambah pilihan baru**, boleh nama bebas asal ditambahkan juga di `config.js` (lihat langkah di bawah).

### Alat yang bisa kamu pakai untuk membuat PNG transparan

Kamu tidak butuh software mahal. Beberapa opsi gratis:
- **Photopea** (photopea.com) — seperti Photoshop tapi jalan di browser, gratis, bisa ekspor PNG transparan.
- **Canva** — buat desain lalu saat download pilih format PNG, aktifkan "Transparent background" (fitur ini di Canva gratis untuk elemen tertentu, kalau tidak tersedia bisa pakai Photopea).
- **remove.bg** — kalau kamu punya gambar dengan background solid dan mau dihapus otomatis jadi transparan.

### Tips penting: menjaga posisi tetap konsisten antar layer

Karena semua gambar ditumpuk di canvas yang sama (600x600) pada posisi (0,0), **posisi objek di dalam kanvasmu harus konsisten** antar satu kategori dengan kategori lain. Contoh: kalau kepala di gambar `skin-01.png` berada di tengah-atas kanvas, maka topi di `hat-01.png` juga harus digambar pas di atas posisi kepala itu — bukan di posisi acak.

Cara paling gampang: buka semua layer-mu jadi *layer terpisah dalam satu file kerja* di Photopea/software desainmu (bukan file terpisah dari awal), atur semua posisinya sampai pas, **baru** ekspor satu-satu jadi PNG terpisah dengan ukuran kanvas 600x600 yang sama untuk semuanya. Placeholder yang aku buatkan sudah mengikuti prinsip ini — kamu bisa jadikan placeholder itu sebagai "panduan posisi" sementara kamu gambar ulang.

### Langkah upload aset baru

1. Buka repo GitHub kamu, masuk ke folder `assets/<kategori>/` yang sesuai (misalnya `assets/hat/`).
2. Klik **Add file → Upload files** di dalam folder itu.
3. Drag gambar PNG barumu, commit.
4. Kalau kamu **mengganti** file lama dengan nama sama: GitHub otomatis akan bilang "ini akan menimpa file yang sudah ada" — itu normal, lanjutkan saja.
5. Kalau kamu **menambah pilihan baru** (nama file baru): buka `config.js`, cari kategori yang sesuai (misal `hat`), tambahkan satu baris baru di dalam array `options`, formatnya:
   ```js
   { id: "hat-03", name: "Nama Yang Tampil Ke User", src: "assets/hat/hat-03.png" },
   ```
6. Commit perubahan `config.js` itu juga lewat GitHub (edit file langsung di browser: buka file → klik ikon pensil → edit → commit).
7. Tunggu beberapa detik, refresh alamat Vercel kamu — pilihan baru akan langsung muncul di panel.

Begitu kamu siap dengan aset pertamamu, kirim ke aku (boleh screenshot hasilnya atau filenya) dan aku bantu cek posisinya, rapikan kalau ada yang kurang pas.

---

## Catatan penting soal berbagi ke X

Link "intent" X (`twitter.com/intent/tweet`) **hanya bisa** mengisi teks + link secara otomatis — X tidak mengizinkan gambar ikut terlampir otomatis lewat cara ini (alasan keamanan dari pihak X sendiri, bukan batasan dari sisi kita). Jadi alur yang paling realistis:

1. Pengguna klik **"Unduh JPG"** dulu → gambar tersimpan di perangkat mereka.
2. Klik **"Bagikan ke X"** → terbuka jendela compose tweet dengan teks sudah terisi.
3. Pengguna tinggal lampirkan gambar yang baru diunduh secara manual.

Ini pattern yang sama dipakai kebanyakan web serupa (Canva, Notion, dll) — bukan sesuatu yang perlu diperbaiki, memang begitu cara kerja platform X.

### Teks tweet yang sudah dipasang

```
I just created a really cool custom ritual avatar. Show yourself and create magic.
(alamat web otomatis terisi di sini)
Be part of a ritual that fully unites us and chants together.
#RITUAL @ritualnet
```

Alamat web otomatis diisi dengan `window.location.href` (alamat halaman yang sedang dibuka pengguna), jadi kalau kamu pindah domain nanti, teks ini otomatis ikut update tanpa perlu diedit manual. Kalau suatu saat kamu ingin ubah kalimatnya lagi, edit bagian `tweetText` di `script.js`.

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
