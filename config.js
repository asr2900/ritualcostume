/**
 * config.js
 * -----------------------------------------------------------
 * INI ADALAH SATU-SATUNYA FILE YANG PERLU KAMU EDIT
 * saat menambah pilihan kostum baru (skin, hat, clothes, dst).
 *
 * Cara menambah pilihan baru:
 * 1. Simpan gambar PNG baru (ukuran 600x600, background transparan)
 *    ke dalam folder assets/<kategori>/
 * 2. Tambahkan satu baris baru di array "options" kategori terkait,
 *    ikuti format yang sudah ada.
 *
 * "id"   -> nama unik untuk pilihan itu (bebas, tanpa spasi)
 * "name" -> nama yang tampil ke pengguna (boleh pakai spasi)
 * "src"  -> lokasi file gambar. Isi null khusus untuk pilihan "kosong".
 * -----------------------------------------------------------
 */

const LAYER_ORDER = ["background", "skin", "clothes", "glasses", "hat"];
// ^ urutan ini menentukan tumpukan gambar di canvas, dari paling
//   belakang ke paling depan. Jangan diubah kecuali kamu memang
//   ingin mengubah urutan tumpukan visual avatar.

const LAYERS = [
  {
    id: "background",
    label: "Background",
    options: [
      { id: "bg-01", name: "Senja Bara", src: "assets/background/bg-01.png" },
      { id: "bg-02", name: "Malam Verdigris", src: "assets/background/bg-02.png" },
      { id: "bg-03", name: "Ruang Emas", src: "assets/background/bg-03.png" },
    ],
  },
  {
    id: "skin",
    label: "Skin",
    options: [
      { id: "skin-01", name: "Tan", src: "assets/skin/skin-01.png" },
      { id: "skin-02", name: "Deep", src: "assets/skin/skin-02.png" },
      { id: "skin-03", name: "Fair", src: "assets/skin/skin-03.png" },
    ],
  },
  {
    id: "clothes",
    label: "Clothes",
    options: [
      { id: "clothes-01", name: "Jubah Bara", src: "assets/clothes/clothes-01.png" },
      { id: "clothes-02", name: "Mantel Verdigris", src: "assets/clothes/clothes-02.png" },
      { id: "clothes-03", name: "Tunik Obsidian", src: "assets/clothes/clothes-03.png" },
    ],
  },
  {
    id: "glasses",
    label: "Glasses",
    options: [
      { id: "none", name: "Tanpa Kacamata", src: null },
      { id: "glasses-01", name: "Lensa Gelap", src: "assets/glasses/glasses-01.png" },
      { id: "glasses-02", name: "Bingkai Emas", src: "assets/glasses/glasses-02.png" },
    ],
  },
  {
    id: "hat",
    label: "Hat",
    options: [
      { id: "none", name: "Tanpa Topi", src: null },
      { id: "hat-01", name: "Tudung Bara", src: "assets/hat/hat-01.png" },
      { id: "hat-02", name: "Lingkar Emas", src: "assets/hat/hat-02.png" },
    ],
  },
];
