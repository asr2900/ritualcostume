/**
 * script.js — logika builder avatar RitualCostume.
 * Setelah avatar dibuat, tombol Reveal menyimpan avatar + pilihan + background
 * ke sessionStorage lalu berpindah ke identity.html.
 */

const canvas = document.getElementById("avatarCanvas");
const ctx = canvas ? canvas.getContext("2d") : null;

// state: pilihan aktif tiap kategori
const state = {};
if (typeof LAYERS !== "undefined") {
  LAYERS.forEach((layer) => {
    state[layer.id] = layer.options[0].id;
  });
}

let activeTab = typeof TAB_ORDER !== "undefined" ? TAB_ORDER[0] : "";
let renderCounter = 0;

// Tombol Reveal baru aktif setelah pengguna mengganti minimal satu item.
let userHasCustomized = false;
function markCustomized() {
  if (userHasCustomized) return;
  userHasCustomized = true;
  const btn = document.getElementById("revealIdentityBtn");
  if (btn) btn.disabled = false;
  const hint = document.getElementById("revealHint");
  if (hint) hint.textContent = "Your avatar is ready — reveal your ritual identity.";
}

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
  return typeof LAYERS !== "undefined" ? LAYERS.find((l) => l.id === layerId) : null;
}
function findOption(layerId, optionId) {
  const layer = findLayer(layerId);
  return layer ? layer.options.find((o) => o.id === optionId) : null;
}

async function render() {
  const myRenderId = ++renderCounter;
  if (!canvas || !ctx) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const failedSrcs = [];

  for (const layerId of LAYER_ORDER) {
    const option = findOption(layerId, state[layerId]);
    if (!option || !option.src) continue;
    try {
      const img = await loadImage(option.src);
      if (myRenderId !== renderCounter) return;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    } catch (e) {
      failedSrcs.push(option.src);
    }
  }

  if (myRenderId !== renderCounter) return;
  showLoadStatus(failedSrcs);
}

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
    ". Check the filename & location in your GitHub repo — it must match config.js exactly (case-sensitive).";
  statusEl.classList.add("visible");
}

// ---------- TABS ----------
function buildTabs() {
  const tabsEl = document.getElementById("categoryTabs");
  if (!tabsEl || typeof TAB_ORDER === "undefined") return;
  tabsEl.innerHTML = "";

  TAB_ORDER.forEach((layerId) => {
    const layer = findLayer(layerId);
    if (!layer) return;
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

// ---------- SWATCH STRIP ----------
function buildSwatchStrip() {
  const strip = document.getElementById("swatchStrip");
  if (!strip) return;
  strip.innerHTML = "";

  const layer = findLayer(activeTab);
  if (!layer) return;

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

document.getElementById("scrollLeftBtn")?.addEventListener("click", () => {
  document.getElementById("swatchStrip")?.scrollBy({ left: -260, behavior: "smooth" });
});
document.getElementById("scrollRightBtn")?.addEventListener("click", () => {
  document.getElementById("swatchStrip")?.scrollBy({ left: 260, behavior: "smooth" });
});

// ---------- DOWNLOAD JPG ----------
document.getElementById("downloadBtn")?.addEventListener("click", () => {
  if (!canvas) return;
  const link = document.createElement("a");
  link.download = "ritualcostume-avatar.jpg";
  link.href = canvas.toDataURL("image/jpeg", 0.95);
  link.click();
});

// ---------- KUMPULKAN NAMA PILIHAN AKTIF ----------
function getActiveL
