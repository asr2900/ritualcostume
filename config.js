/**
 * config.js
 * -----------------------------------------------------------
 * INI ADALAH SATU-SATUNYA FILE YANG PERLU KAMU EDIT
 * saat menambah pilihan kostum baru (skin, hat, clothes, dst).
 * Kamu bisa menambah sampai ratusan pilihan per kategori — panel
 * tab di web akan otomatis bisa di-scroll ke samping.
 *
 * Cara menambah pilihan baru:
 * 1. Simpan gambar PNG baru (ukuran 600x600, background transparan)
 *    ke dalam folder assets/<kategori>/
 * 2. Tambahkan satu baris baru di array "options" kategori terkait,
 *    ikuti format yang sudah ada.
 *
 * "id"   -> nama unik untuk pilihan itu (bebas, tanpa spasi)
 * "name" -> nama yang tampil ke pengguna (teks di web ini pakai
 *           Bahasa Inggris, tapi kamu boleh isi apa saja)
 * "src"  -> lokasi file gambar. Isi null khusus untuk pilihan "kosong".
 * -----------------------------------------------------------
 */

// Urutan TUMPUKAN GAMBAR di canvas, dari paling belakang ke paling depan.
// Jangan diubah kecuali kamu memang ingin mengubah urutan visual avatar.
const LAYER_ORDER = ["background", "skin", "hat", "clothes", "glasses", "ritual"];

// Urutan TAB di panel kanan, dari kiri ke kanan.
// Ini BEDA dari LAYER_ORDER di atas — ini cuma urutan tombol kategori.
const TAB_ORDER = ["skin", "hat", "clothes", "glasses", "ritual", "background"];

const LAYERS = [
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
    id: "hat",
    label: "Hat",
    options: [
      { id: "none", name: "No Hat", src: null },
      { id: "hat-01", name: "Ember Hood", src: "assets/hat/hat-01.png" },
      { id: "hat-02", name: "Golden Circlet", src: "assets/hat/hat-02.png" },
    ],
  },
  {
    id: "clothes",
    label: "Clothes",
    options: [
      { id: "clothes-01", name: "Ember Robe", src: "assets/clothes/clothes-01.png" },
      { id: "clothes-02", name: "Verdigris Cloak", src: "assets/clothes/clothes-02.png" },
      { id: "clothes-03", name: "Obsidian Tunic", src: "assets/clothes/clothes-03.png" },
      { id: "clothes-03", name: "Obsidian huking", src: "assets/clothes/clothes-04.png" },
    ],
  },
  {
    id: "glasses",
    label: "Glasses",
    options: [
      { id: "none", name: "No Glasses", src: null },
      { id: "glasses-01", name: "Dark Lens", src: "assets/glasses/glasses-01.png" },
      { id: "glasses-02", name: "Golden Frame", src: "assets/glasses/glasses-02.png" },
    ],
  },
  {
    id: "ritual",
    label: "Ritual",
    options: [
      { id: "none", name: "No Ritual Effect", src: null },
      { id: "ritual-01", name: "Golden Aura", src: "assets/ritual/ritual-01.png" },
      { id: "ritual-02", name: "Verdigris Seal", src: "assets/ritual/ritual-02.png" },
    ],
  },
  {
    id: "background",
    label: "Background",
    options: [
      { id: "bg-01", name: "Ember Dusk", src: "assets/background/bg-01.png" },
      { id: "bg-02", name: "Verdigris Night", src: "assets/background/bg-02.png" },
      { id: "bg-03", name: "Golden Void", src: "assets/background/bg-03.png" },
    ],
  },
];
