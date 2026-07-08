/**
 * script.js
 * -----------------------------------------------------------
 * Logika utama. Kamu TIDAK perlu mengedit file ini untuk
 * menambah pilihan kostum baru — cukup edit config.js.
 * -----------------------------------------------------------
 */

const canvas = document.getElementById("avatarCanvas");
const ctx = canvas.getContext("2d");

// state: menyimpan pilihan yang sedang aktif untuk tiap kategori
const state = {};
LAYERS.forEach((layer) => {
  // default: pilihan pertama di array options
  state[layer.id] = layer.options[0].id;
});

// cache gambar supaya tidak load ulang setiap render
const imageCache = {};
function loadImage(src) {
  if (!src) return Promise.resolve(null);
  if (imageCache[src]) return Promise.resolve(imageCache[src]);
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      imageCache[src] = img;
      resolve(img);
    };
    img.onerror = reject;
    img.src = src;
  });
}

function findOption(layerId, optionId) {
  const layer = LAYERS.find((l) => l.id === layerId);
  return layer.options.find((o) => o.id === optionId);
}

async function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (const layerId of LAYER_ORDER) {
    const optionId = state[layerId];
    const option = findOption(layerId, optionId);
    if (!option || !option.src) continue;
    try {
      const img = await loadImage(option.src);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    } catch (e) {
      console.warn("Gagal memuat gambar:", option.src);
    }
  }
}

function buildPanels() {
  const container = document.getElementById("layerPanels");
  container.innerHTML = "";

  LAYERS.forEach((layer, index) => {
    const panel = document.createElement("div");
    panel.className = "layer-panel";

    const title = document.createElement("div");
    title.className = "layer-panel-title";
    title.innerHTML = `<span class="num">0${index + 1}</span> ${layer.label}`;
    panel.appendChild(title);

    const row = document.createElement("div");
    row.className = "swatch-row";

    layer.options.forEach((option) => {
      const btn = document.createElement("button");
      btn.className = "swatch";
      btn.title = option.name;
      btn.setAttribute("aria-label", option.name);

      if (option.src) {
        const img = document.createElement("img");
        img.src = option.src;
        img.alt = option.name;
        btn.appendChild(img);
      } else {
        btn.classList.add("empty");
        btn.textContent = "×";
      }

      if (state[layer.id] === option.id) btn.classList.add("active");

      btn.addEventListener("click", () => {
        state[layer.id] = option.id;
        // update tampilan aktif di dalam baris ini saja
        row.querySelectorAll(".swatch").forEach((s) => s.classList.remove("active"));
        btn.classList.add("active");
        render();
      });

      row.appendChild(btn);
    });

    panel.appendChild(row);
    container.appendChild(panel);
  });
}

// ---------- UNDUH JPG ----------
document.getElementById("downloadBtn").addEventListener("click", () => {
  const link = document.createElement("a");
  link.download = "ritualcostume-avatar.jpg";
  link.href = canvas.toDataURL("image/jpeg", 0.95);
  link.click();
});

// ---------- BAGIKAN KE X ----------
document.getElementById("shareBtn").addEventListener("click", () => {
  // Catatan penting (baca README.md bagian "Batasan berbagi ke X"):
  // Intent link X hanya bisa mengisi teks, TIDAK bisa otomatis
  // melampirkan gambar. Jadi alurnya: unduh dulu gambarnya, baru user
  // upload manual saat posting di X.
  //
  // Teks lengkap (termasuk link web) dimasukkan semua ke parameter
  // "text" saja, supaya urutannya persis seperti yang diinginkan
  // (link muncul di tengah, bukan otomatis ditempel di akhir oleh X).
  const tweetText =
    `I just created a really cool custom ritual avatar. Show yourself and create magic.\n` +
    `${window.location.href}\n` +
    `Be part of a ritual that fully unites us and chants together.\n` +
    `#RITUAL @ritualnet`;

  const text = encodeURIComponent(tweetText);
  window.open(`https://twitter.com/intent/tweet?text=${text}`, "_blank");
});

// ---------- MINT (placeholder, lihat README.md fase 4) ----------
document.getElementById("mintBtn").addEventListener("click", () => {
  alert("Fitur minting ke jaringan testnet Ritual akan dibangun di fase berikutnya.");
});

buildPanels();
render();
