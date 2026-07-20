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
  state[layer.id] = layer.options[0].id; // default: pilihan pertama
});

let activeTab = TAB_ORDER[0];

// menandai apakah user sudah pernah mengubah pilihan dari default,
// dipakai untuk mengaktifkan tombol "Reveal My Ritual Identity"
let userHasCustomized = false;
function markCustomized() {
  if (userHasCustomized) return;
  userHasCustomized = true;
  const btn = document.getElementById("revealIdentityBtn");
  if (btn) btn.disabled = false;
}

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

function findLayer(layerId) {
  return LAYERS.find((l) => l.id === layerId);
}
function findOption(layerId, optionId) {
  return findLayer(layerId).options.find((o) => o.id === optionId);
}

async function render() {
  // Penjaga anti-race-condition: kalau ada render() lain yang lebih baru
  // mulai duluan (misal user klik-klik cepat), render lama ini akan
  // menghentikan dirinya sendiri supaya tidak menimpa hasil yang benar.
  const myRenderId = ++renderCounter;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const failedSrcs = [];

  for (const layerId of LAYER_ORDER) {
    const optionId = state[layerId];
    const option = findOption(layerId, optionId);
    if (!option || !option.src) continue;
    try {
      const img = await loadImage(option.src);
      if (myRenderId !== renderCounter) return; // ada render lebih baru, batalkan
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    } catch (e) {
      failedSrcs.push(option.src);
    }
  }

  if (myRenderId !== renderCounter) return;
  showLoadStatus(failedSrcs);
}
let renderCounter = 0;

// ---------- Tampilkan pesan error langsung di halaman (bukan cuma console) ----------
function showLoadStatus(failedSrcs) {
  const statusEl = document.getElementById("loadStatus");
  if (!statusEl) return;
  if (failedSrcs.length === 0) {
    statusEl.textContent = "";
    statusEl.classList.remove("visible");
    return;
  }
  statusEl.innerHTML =
    "⚠ Couldn't load: " +
    failedSrcs.map((s) => `<code>${s}</code>`).join(", ") +
    ". Check the filename and location in your GitHub repo — it must match config.js exactly (case-sensitive).";
  statusEl.classList.add("visible");
}

// ---------- TABS ----------
function buildTabs() {
  const tabsEl = document.getElementById("categoryTabs");
  tabsEl.innerHTML = "";

  TAB_ORDER.forEach((layerId) => {
    const layer = findLayer(layerId);
    const btn = document.createElement("button");
    btn.className = "tab-btn" + (layerId === activeTab ? " active" : "");
    btn.textContent = layer.label;
    btn.addEventListener("click", () => {
      activeTab = layerId;
      tabsEl.querySelectorAll(".tab-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      buildSwatchStrip();
    });
    tabsEl.appendChild(btn);
  });
}

// ---------- SWATCH STRIP (horizontal, bisa ratusan item) ----------
function buildSwatchStrip() {
  const strip = document.getElementById("swatchStrip");
  strip.innerHTML = "";

  const layer = findLayer(activeTab);

  layer.options.forEach((option) => {
    const col = document.createElement("div");
    col.className = "swatch-col";

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
      strip.querySelectorAll(".swatch").forEach((s) => s.classList.remove("active"));
      btn.classList.add("active");
      markCustomized();
      render();
    });

    const label = document.createElement("span");
    label.className = "swatch-name";
    label.textContent = option.name;

    col.appendChild(btn);
    col.appendChild(label);
    strip.appendChild(col);
  });

  strip.scrollLeft = 0;
}

// tombol panah kiri/kanan untuk scroll strip (berguna kalau koleksi ratusan)
document.getElementById("scrollLeftBtn").addEventListener("click", () => {
  document.getElementById("swatchStrip").scrollBy({ left: -260, behavior: "smooth" });
});
document.getElementById("scrollRightBtn").addEventListener("click", () => {
  document.getElementById("swatchStrip").scrollBy({ left: 260, behavior: "smooth" });
});

// ---------- DOWNLOAD JPG ----------
document.getElementById("downloadBtn").addEventListener("click", () => {
  const link = document.createElement("a");
  link.download = "ritualcostume-avatar.jpg";
  link.href = canvas.toDataURL("image/jpeg", 0.95);
  link.click();
});

// ---------- SHARE TO X ----------
document.getElementById("shareBtn").addEventListener("click", () => {
  // Catatan: link intent X hanya bisa mengisi teks, tidak bisa otomatis
  // melampirkan gambar. Alurnya: unduh dulu JPG-nya, baru user upload
  // manual saat posting di X.
  const tweetText =
    `I just created a really cool custom ritual avatar. Show yourself and create magic.\n` +
    `${window.location.href}\n` +
    `Be part of a ritual that fully unites us and chants together.\n` +
    `#RITUAL @ritualnet`;

  const text = encodeURIComponent(tweetText);
  window.open(`https://twitter.com/intent/tweet?text=${text}`, "_blank");
});

// ---------- MINT (placeholder) ----------
document.getElementById("mintBtn").addEventListener("click", () => {
  alert("Minting on the Ritual testnet will be built in the next phase.");
});

// ---------- RITUAL IDENTITY ----------
const identityPanel = document.getElementById("identityPanel");
const identityFormView = document.getElementById("identityForm");
const identityLoadingView = document.getElementById("identityLoading");
const identityErrorView = document.getElementById("identityErrorView");
const identityResultView = document.getElementById("identityResult");

const identityQ1 = document.getElementById("identityQ1");
const identityQ2 = document.getElementById("identityQ2");
const identityNote = document.getElementById("identityNote");
const identityNameOutput = document.getElementById("identityNameOutput");
const identityDescOutput = document.getElementById("identityDescOutput");
const generateIdentityBtn = document.getElementById("generateIdentityBtn");
const identityCopyBtn = document.getElementById("identityCopyBtn");

// membaca nama pilihan yang sedang aktif dari LAYERS config,
// dipakai sebagai bahan prompt ke Anthropic API
function getActiveLayerNames() {
  const names = {};
  LAYER_ORDER.forEach((layerId) => {
    const layer = findLayer(layerId);
    const option = findOption(layerId, state[layerId]);
    names[layer.label] = option ? option.name : "None";
  });
  return names;
}

// mengganti tampilan di dalam #identityPanel: "form" | "loading" | "error" | "result"
function setIdentityPanelView(view) {
  identityFormView.hidden = view !== "form";
  identityLoadingView.hidden = view !== "loading";
  identityErrorView.hidden = view !== "error";
  identityResultView.hidden = view !== "result";
}

// mengelola pembukaan panel (dipanggil saat tombol "Reveal My Ritual Identity" diklik)
function buildIdentityPanel() {
  identityPanel.hidden = false;
  setIdentityPanelView("form");
  identityQ1.focus();
}

function clearFieldError(el) {
  el.classList.remove("field-error");
}

function validateIdentityAnswers() {
  let valid = true;
  [identityQ1, identityQ2].forEach((el) => {
    if (!el.value.trim()) {
      el.classList.add("field-error");
      valid = false;
    } else {
      clearFieldError(el);
    }
  });
  return valid;
}

[identityQ1, identityQ2].forEach((el) => {
  el.addEventListener("input", () => clearFieldError(el));
});

// mengirim jawaban + kombinasi layer ke backend (lihat api/ritual-identity.js),
// yang lalu meneruskannya ke Anthropic API dengan API key yang tersimpan
// aman di environment server. TIDAK memanggil api.anthropic.com langsung
// dari browser supaya API key tidak pernah terekspos ke pengguna.
async function callAnthropicAPI(layerNames, answer1, answer2) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 48000);

  try {
    const response = await fetch("/api/ritual-identity", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ layerNames, answer1, answer2 }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) throw new Error("Ritual identity request failed");

    const data = await response.json();
    if (!data.ritualName || !data.ritualIdentity) {
      throw new Error("Malformed ritual identity response");
    }
    return data;
  } finally {
    clearTimeout(timeoutId);
  }
}

function showIdentityResult(ritualName, ritualIdentity) {
  identityNameOutput.textContent = ritualName;
  identityDescOutput.textContent = ritualIdentity;
  setIdentityPanelView("result");
}

document.getElementById("revealIdentityBtn").addEventListener("click", buildIdentityPanel);

generateIdentityBtn.addEventListener("click", async () => {
  if (!validateIdentityAnswers()) return;

  const layerNames = getActiveLayerNames();
  const answer1 = identityQ1.value.trim();
  const answer2 = identityQ2.value.trim();

  setIdentityPanelView("loading");

  try {
    const { ritualName, ritualIdentity } = await callAnthropicAPI(layerNames, answer1, answer2);
    showIdentityResult(ritualName, ritualIdentity);
  } catch (err) {
    setIdentityPanelView("error");
  }
});

function backToIdentityForm() {
  setIdentityPanelView("form");
  identityNote.textContent = "Tell us more or edit your answers to get a different result.";
}

document.getElementById("identityErrorRetryBtn").addEventListener("click", backToIdentityForm);
document.getElementById("identityTryAgainBtn").addEventListener("click", backToIdentityForm);

identityCopyBtn.addEventListener("click", async () => {
  const shareText = `${identityNameOutput.textContent}\n\n${identityDescOutput.textContent}`;
  try {
    await navigator.clipboard.writeText(shareText);
    const originalLabel = identityCopyBtn.textContent;
    identityCopyBtn.textContent = "Copied!";
    setTimeout(() => {
      identityCopyBtn.textContent = originalLabel;
    }, 1500);
  } catch (err) {
    console.error("Copy to clipboard failed:", err);
  }
});

buildTabs();
buildSwatchStrip();
render();
