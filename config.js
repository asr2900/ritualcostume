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
      { id: "skin-01", name: "usual", src: "assets/skin/skin-01.png" },
      { id: "skin-02", name: "cool", src: "assets/skin/skin-02.png" },
      { id: "skin-03", name: "sweet", src: "assets/skin/skin-03.png" },
      { id: "skin-04", name: "mad", src: "assets/skin/skin-04.png" },
    ],
  },
  {
    id: "hat",
    label: "Hat",
    options: [
      { id: "none", name: "No Hat", src: null },
      { id: "hat-01", name: "usual", src: "assets/hat/hat-01.png" },
      { id: "hat-02", name: "black metal", src: "assets/hat/hat-02.png" },
      { id: "hat-03", name: "rimuru", src: "assets/hat/hat-03.png" },
      { id: "hat-04", name: "saber", src: "assets/hat/hat-04.png" },
      { id: "hat-05", name: "sweet hair", src: "assets/hat/hat-05.png" },
      { id: "hat-06", name: "naughty", src: "assets/hat/hat-06.png" },
      { id: "hat-07", name: "Santa Jess", src: "assets/hat/hat-07.png" },
      { id: "hat-08", name: "dignified", src: "assets/hat/hat-08.png" },
      { id: "hat-09", name: "graceful", src: "assets/hat/hat-09.png" },
      { id: "hat-10", name: "yellow siggy", src: "assets/hat/hat-10.png" },
      { id: "hat-11", name: "red siggy", src: "assets/hat/hat-11.png" },
    ],
  },
  {
    id: "clothes",
    label: "Clothes",
    options: [
      { id: "clothes-01", name: "1", src: "assets/clothes/clothes-01.png" },
      { id: "clothes-02", name: "2", src: "assets/clothes/clothes-02.png" },
      { id: "clothes-03", name: "3", src: "assets/clothes/clothes-03.png" },
      { id: "clothes-04", name: "4", src: "assets/clothes/clothes-04.png" },
      { id: "clothes-05", name: "5", src: "assets/clothes/clothes-05.png" },
      { id: "clothes-06", name: "6", src: "assets/clothes/clothes-06.png" },
      { id: "clothes-07", name: "7", src: "assets/clothes/clothes-07.png" },
      { id: "clothes-08", name: "8", src: "assets/clothes/clothes-08.png" },
      { id: "clothes-09", name: "9", src: "assets/clothes/clothes-09.png" },
      { id: "clothes-10", name: "10", src: "assets/clothes/clothes-10.png" },
      { id: "clothes-11", name: "11", src: "assets/clothes/clothes-11.png" },
      { id: "clothes-12", name: "12", src: "assets/clothes/clothes-12.png" },
      { id: "clothes-13", name: "13", src: "assets/clothes/clothes-13.png" },
      { id: "clothes-14", name: "14", src: "assets/clothes/clothes-14.png" },
      { id: "clothes-15", name: "15", src: "assets/clothes/clothes-15.png" },
      { id: "clothes-16", name: "16", src: "assets/clothes/clothes-16.png" },
    ],
  },
  {
    id: "glasses",
    label: "Glasses",
    options: [
      { id: "none", name: "No Glasses", src: null },
      { id: "glasses-01", name: "1", src: "assets/glasses/glasses-01.png" },
      { id: "glasses-02", name: "2", src: "assets/glasses/glasses-02.png" },
      { id: "glasses-03", name: "3", src: "assets/glasses/glasses-03.png" },
      { id: "glasses-04", name: "4", src: "assets/glasses/glasses-04.png" },
      { id: "glasses-05", name: "5", src: "assets/glasses/glasses-05.png" },
      { id: "glasses-06", name: "6", src: "assets/glasses/glasses-06.png" },
      { id: "glasses-07", name: "7", src: "assets/glasses/glasses-07.png" },
      { id: "glasses-08", name: "8", src: "assets/glasses/glasses-08.png" },
      { id: "glasses-09", name: "9", src: "assets/glasses/glasses-09.png" },
      { id: "glasses-10", name: "10", src: "assets/glasses/glasses-10.png" },
    ],
  },
  {
    id: "ritual",
    label: "Ritual",
    options: [
      { id: "ritual-01", name: "1", src: "assets/ritual/ritual-01.png" },
      { id: "ritual-02", name: "2", src: "assets/ritual/ritual-02.png" },
      { id: "ritual-03", name: "3", src: "assets/ritual/ritual-03.png" },
      { id: "ritual-04", name: "4", src: "assets/ritual/ritual-04.png" },
    ],
  },
  {
    id: "background",
    label: "Background",
    options: [
      { id: "bg-01", name: "1", src: "assets/background/bg-01.png" },
      { id: "bg-02", name: "2", src: "assets/background/bg-02.png" },
      { id: "bg-03", name: "3", src: "assets/background/bg-03.png" },
      { id: "bg-04", name: "4", src: "assets/background/bg-04.png" },
      { id: "bg-05", name: "5", src: "assets/background/bg-05.png" },
      { id: "bg-06", name: "6", src: "assets/background/bg-06.png" },
      { id: "bg-07", name: "7", src: "assets/background/bg-07.png" },
      { id: "bg-08", name: "8", src: "assets/background/bg-08.png" },
      { id: "bg-09", name: "9", src: "assets/background/bg-09.png" },
      { id: "bg-10", name: "10", src: "assets/background/bg-10.png" },
      { id: "bg-11", name: "11", src: "assets/background/bg-11.png" },
      { id: "bg-12", name: "12", src: "assets/background/bg-12.png" },
      { id: "bg-13", name: "13", src: "assets/background/bg-13.png" },
      { id: "bg-14", name: "14", src: "assets/background/bg-14.png" },
    ],
  },
];
