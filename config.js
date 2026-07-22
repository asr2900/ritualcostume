/**
 * config.js — SATU-SATUNYA file yang perlu diedit saat menambah kostum.
 * id  -> unik, tanpa spasi
 * name-> teks yang tampil ke pengguna
 * src -> lokasi file PNG (600x600, transparan). null = pilihan kosong.
 */

// Urutan tumpukan gambar di canvas (belakang -> depan).
const LAYER_ORDER = ["background", "skin", "hat", "clothes", "glasses", "ritual"];

// Urutan tombol tab (kiri -> kanan).
const TAB_ORDER = ["skin", "hat", "clothes", "glasses", "ritual", "background"];

const LAYERS = [
  {
    id: "skin",
    label: "Skin",
    options: [
      { id: "skin-01", name: "Tan", src: "assets/skin/skin-01.png" },
      { id: "skin-02", name: "Deep", src: "assets/skin/skin-02.png" },
      // NOTE: file skin-03.png belum ada — upload dulu ke assets/skin/
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
      { id: "hat-03", name: "Obsidian Veil", src: "assets/hat/hat-03.png" },
    ],
  },
  {
    id: "clothes",
    label: "Clothes",
    options: [
      { id: "clothes-01", name: "Ember Robe", src: "assets/clothes/clothes-01.png" },
      { id: "clothes-02", name: "Verdigris Cloak", src: "assets/clothes/clothes-02.png" },
      { id: "clothes-03", name: "Obsidian Tunic", src: "assets/clothes/clothes-03.png" },
      { id: "clothes-04", name: "Golden Regalia", src: "assets/clothes/clothes-04.png" },
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
      // NOTE: file ritual-02.png belum ada — upload dulu ke assets/ritual/
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
