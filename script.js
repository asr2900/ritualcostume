/**
 * script.js
 * -----------------------------------------------------------
 * Logika utama aplikasi The Siggy Soul Forge.
 * -----------------------------------------------------------
 */

const canvas = document.getElementById("avatarCanvas");
const ctx = canvas.getContext("2d");

// state: menyimpan pilihan yang sedang aktif untuk tiap kategori
const state = {};
if (typeof LAYERS !== "undefined") {
  LAYERS.forEach((layer) => {
    state[layer.id] = layer.options[0].id;
  });
}

let activeTab = typeof TAB_ORDER !== "undefined" ? TAB_ORDER[0] : "";

let userHasCustomized = false;
function markCustomized() {
  if (userHasCustomized) return;
  userHasCustomized = true;
  const btn = document.getElementById("revealIdentityBtn");
  if (btn) btn.disabled = false;
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
    const optionId = state[layerId];
    const option = findOption(layerId, optionId);
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
let renderCounter = 0;

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

function getActiveLayerNames() {
  const names = {};
  if (typeof LAYER_ORDER === "undefined") return names;
  LAYER_ORDER.forEach((layerId) => {
    const layer = findLayer(layerId);
    const option = findOption(layerId, state[layerId]);
    if (layer) {
      names[layer.label] = option ? option.name : "None";
    }
  });
  return names;
}

function setIdentityPanelView(view) {
  if (identityFormView) identityFormView.hidden = view !== "form";
  if (identityLoadingView) identityLoadingView.hidden = view !== "loading";
  if (identityErrorView) identityErrorView.hidden = view !== "error";
  if (identityResultView) identityResultView.hidden = view !== "result";
}

function buildIdentityPanel() {
  if (identityPanel) identityPanel.hidden = false;
  setIdentityPanelView("form");
  if (identityQ1) identityQ1.focus();
}

function clearFieldError(el) {
  if (el) el.classList.remove("field-error");
}

function validateIdentityAnswers() {
  let valid = true;
  [identityQ1, identityQ2].forEach((el) => {
    if (el && !el.value.trim()) {
      el.classList.add("field-error");
      valid = false;
    } else if (el) {
      clearFieldError(el);
    }
  });
  return valid;
}

[identityQ1, identityQ2].forEach((el) => {
  if (el) el.addEventListener("input", () => clearFieldError(el));
});

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
  if (identityNameOutput) identityNameOutput.textContent = ritualName;
  if (identityDescOutput) identityDescOutput.textContent = ritualIdentity;
  
  const mintBtn = document.getElementById("mintBtn");
  const connectWalletBtn = document.getElementById("connectWalletBtn");
  if (mintBtn) mintBtn.hidden = false;
  if (connectWalletBtn) connectWalletBtn.hidden = true;
  
  setIdentityPanelView("result");
}

document.getElementById("revealIdentityBtn")?.addEventListener("click", buildIdentityPanel);

generateIdentityBtn?.addEventListener("click", async () => {
  if (!validateIdentityAnswers()) return;

  const layerNames = getActiveLayerNames();
  const answer1 = identityQ1 ? identityQ1.value.trim() : "";
  const answer2 = identityQ2 ? identityQ2.value.trim() : "";

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
  if (identityNote) identityNote.textContent = "Tell us more or edit your answers to get a different result.";
}

document.getElementById("identityErrorRetryBtn")?.addEventListener("click", backToIdentityForm);
document.getElementById("identityTryAgainBtn")?.addEventListener("click", backToIdentityForm);

identityCopyBtn?.addEventListener("click", async () => {
  if (!identityNameOutput || !identityDescOutput) return;
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

// ---------- RITUAL CARD & WEB3 ----------
const mintBtn = document.getElementById("mintBtn");
const connectWalletBtn = document.getElementById("connectWalletBtn");
let finalCardImageURL = "";

const CONTRACT_ABI = [
  "function mintCard(address recipient, string memory tokenURI) public returns (uint256)"
];
const CONTRACT_ADDRESS = "0xBb75b9220038bF1B12093551532cb1A89b93f99";

// Detail jaringan Ritual testnet — dipakai untuk memastikan wallet
// pengguna terhubung ke chain yang benar sebelum mint. Kalau contract-mu
// ternyata pindah ke mainnet Ritual nanti, cukup ganti nilai-nilai ini.
const RITUAL_CHAIN = {
  chainIdHex: "0x7bb", // 1979 dalam heksadesimal
  chainName: "Ritual Testnet",
  nativeCurrency: { name: "RITUAL", symbol: "RITUAL", decimals: 18 },
  rpcUrls: ["https://rpc.ritualfoundation.org"],
  blockExplorerUrls: ["https://explorer.ritualfoundation.org"],
};

// Memastikan wallet pengguna sedang berada di jaringan Ritual testnet.
// Kalau belum ditambahkan di wallet-nya, otomatis minta menambahkan.
// Tanpa ini, mintCard() akan gagal karena tidak ada contract di chain
// yang sedang aktif di wallet pengguna.
async function ensureRitualNetwork() {
  const currentChainId = await window.ethereum.request({ method: "eth_chainId" });
  if (currentChainId === RITUAL_CHAIN.chainIdHex) return;

  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: RITUAL_CHAIN.chainIdHex }],
    });
  } catch (switchError) {
    // error code 4902 = chain belum pernah ditambahkan ke wallet ini
    if (switchError.code === 4902) {
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: RITUAL_CHAIN.chainIdHex,
            chainName: RITUAL_CHAIN.chainName,
            nativeCurrency: RITUAL_CHAIN.nativeCurrency,
            rpcUrls: RITUAL_CHAIN.rpcUrls,
            blockExplorerUrls: RITUAL_CHAIN.blockExplorerUrls,
          },
        ],
      });
    } else {
      throw switchError;
    }
  }
}

// Menyiapkan tokenURI yang aman untuk on-chain: upload gambar kartu +
// metadata ke IPFS lewat backend, lalu kembalikan link ipfs:// yang
// kecil. JANGAN pernah kirim base64 gambar mentah langsung ke
// mintCard() — ukurannya bisa ratusan KB dan gas-nya bisa meledak atau
// transaksinya gagal total.
async function prepareTokenURI(imageDataUrl, ritualName, ritualIdentity) {
  const response = await fetch("/api/mint-metadata", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ imageDataUrl, ritualName, ritualIdentity }),
  });

  if (!response.ok) {
    const errBody = await response.json().catch(() => ({}));
    throw new Error(errBody.error || "Failed to prepare NFT metadata");
  }

  const data = await response.json();
  if (!data.tokenURI) throw new Error("Metadata endpoint did not return a tokenURI");
  return data.tokenURI;
}

function generateRitualCard() {
  if (!identityNameOutput || !identityDescOutput || !canvas) return;
  const ritualName = identityNameOutput.textContent;
  const ritualIdentity = identityDescOutput.textContent;

  const cardCanvas = document.createElement("canvas");
  cardCanvas.width = 800;
  cardCanvas.height = 1200;
  const cardCtx = cardCanvas.getContext("2d");

  cardCtx.fillStyle = "#1a1a1a";
  cardCtx.fillRect(0, 0, cardCanvas.width, cardCanvas.height);

  cardCtx.drawImage(canvas, 100, 100, 600, 600);

  cardCtx.fillStyle = "#ffffff";
  cardCtx.font = "bold 48px sans-serif";
  cardCtx.textAlign = "center";
  cardCtx.fillText(ritualName.toUpperCase(), cardCanvas.width / 2, 800);

  cardCtx.font = "24px sans-serif";
  cardCtx.fillStyle = "#cccccc";
  const maxWidth = 700;
  const words = ritualIdentity.split(' ');
  let line = '';
  let y = 860;

  for(let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = cardCtx.measureText(testLine);
    const testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      cardCtx.fillText(line, cardCanvas.width / 2, y);
      line = words[n] + ' ';
      y += 35;
    } else {
      line = testLine;
    }
  }
  cardCtx.fillText(line, cardCanvas.width / 2, y);

  finalCardImageURL = cardCanvas.toDataURL("image/jpeg", 0.95);
}

mintBtn?.addEventListener("click", () => {
  generateRitualCard();
  mintBtn.hidden = true;
  if (connectWalletBtn) connectWalletBtn.hidden = false;
});

connectWalletBtn?.addEventListener("click", async () => {
  if (typeof window.ethereum === "undefined") {
    alert("Wallet Web3 tidak terdeteksi. Silakan pasang ekstensi MetaMask.");
    return;
  }

  try {
    connectWalletBtn.textContent = "Connecting Wallet...";
    connectWalletBtn.disabled = true;

    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    const walletAddress = accounts[0];

    // Pastikan wallet ada di jaringan Ritual testnet sebelum lanjut,
    // supaya bukan gagal diam-diam karena salah network.
    connectWalletBtn.textContent = "Checking network...";
    await ensureRitualNetwork();

    // Upload gambar + metadata ke IPFS dulu, ambil link kecilnya
    connectWalletBtn.textContent = "Preparing metadata...";
    const ritualName = identityNameOutput ? identityNameOutput.textContent : "";
    const ritualIdentity = identityDescOutput ? identityDescOutput.textContent : "";
    const tokenURI = await prepareTokenURI(finalCardImageURL, ritualName, ritualIdentity);

    connectWalletBtn.textContent = "Minting NFT...";

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    const validAddress = ethers.utils.getAddress(CONTRACT_ADDRESS);
    const ritualContract = new ethers.Contract(validAddress, CONTRACT_ABI, signer);

    const tx = await ritualContract.mintCard(walletAddress, tokenURI);
    await tx.wait();

    alert(`Sukses! NFT RITUAL CARD berhasil dicetak ke dompet Anda:\n${walletAddress}`);
    connectWalletBtn.textContent = "NFT Minted Successfully!";

  } catch (error) {
    console.error("Gagal melakukan proses minting:", error);
    // error.reason (kalau ada) berisi alasan revert asli dari smart
    // contract — jauh lebih berguna daripada error.message yang generik.
    const readableMessage =
      error.reason || error.data?.message || error.message || JSON.stringify(error);
    alert("ERROR DETAIL: " + readableMessage);
    connectWalletBtn.textContent = "Connect Wallet";
    connectWalletBtn.disabled = false;
  }
});

document.getElementById("shareBtn")?.addEventListener("click", () => {
  if (!identityNameOutput) return;
  const ritualName = identityNameOutput.textContent || "Ritualist";
  const tweetText =
    `I just forged my true identity as "${ritualName}" in The Siggy Soul Forge. Create your magic.\n` +
    `${window.location.href}\n` +
    `#RITUAL @ritualnet`;

  const text = encodeURIComponent(tweetText);
  window.open(`https://twitter.com/intent/tweet?text=${text}`, "_blank");
});

// Inisialisasi utama aplikasi
buildTabs();
buildSwatchStrip();
render();
