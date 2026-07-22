/**
 * identity.js — halaman Ritual Identity.
 * Baca avatar + background dari sessionStorage, panggil API identity,
 * gambar KARTU NFT di canvas -> preview + gambar mint, lalu mint + link explorer.
 */

const avatarImage = sessionStorage.getItem("ritual.avatar");
const bgSrc = sessionStorage.getItem("ritual.bg") || "";

// Kalau dibuka tanpa membangun avatar dulu, kembalikan ke builder.
if (!avatarImage) window.location.replace("index.html");

const identityFormView = document.getElementById("identityForm");
const identityLoadingView = document.getElementById("identityLoading");
const identityErrorView = document.getElementById("identityErrorView");
const identityResultView = document.getElementById("identityResult");

const identityQ1 = document.getElementById("identityQ1");
const identityQ2 = document.getElementById("identityQ2");
const identityNote = document.getElementById("identityNote");
const generateIdentityBtn = document.getElementById("generateIdentityBtn");
const identityCopyBtn = document.getElementById("identityCopyBtn");

const previewImg = document.getElementById("identityAvatarPreview");
const cardPreviewImg = document.getElementById("cardPreview");
const mintStatus = document.getElementById("mintStatus");

if (previewImg && avatarImage) previewImg.src = avatarImage;
if (identityQ1) identityQ1.focus();

let currentName = "";
let currentIdentity = "";
let finalCardImageURL = "";

function setView(view) {
  if (identityFormView) identityFormView.hidden = view !== "form";
  if (identityLoadingView) identityLoadingView.hidden = view !== "loading";
  if (identityErrorView) identityErrorView.hidden = view !== "error";
  if (identityResultView) identityResultView.hidden = view !== "result";
}

function clearFieldError(el) { if (el) el.classList.remove("field-error"); }
function validateAnswers() {
  let valid = true;
  [identityQ1, identityQ2].forEach((el) => {
    if (el && !el.value.trim()) { el.classList.add("field-error"); valid = false; }
    else if (el) clearFieldError(el);
  });
  return valid;
}
[identityQ1, identityQ2].forEach((el) => {
  if (el) el.addEventListener("input", () => clearFieldError(el));
});

async function callIdentityAPI(answer1, answer2) {
  let layerNames = {};
  try { layerNames = JSON.parse(sessionStorage.getItem("ritual.layerNames") || "{}"); } catch (e) {}

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 48000);
  try {
    const response = await fetch("/api/ritual-identity", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ layerNames, answer1, answer2 }),
      signal: controller.signal,
    });
    if (!response.ok) throw new Error("Ritual identity request failed");
    const data = await response.json();
    if (!data.ritualName || !data.ritualIdentity) throw new Error("Malformed ritual identity response");
    return data;
  } finally {
    clearTimeout(timeoutId);
  }
}

async function showIdentityResult(ritualName, ritualIdentity) {
  currentName = ritualName;
  currentIdentity = ritualIdentity;

  await generateRitualCard(ritualName, ritualIdentity);
  if (cardPreviewImg) cardPreviewImg.src = finalCardImageURL;

  const mintBtn = document.getElementById("mintBtn");
  const connectWalletBtn = document.getElementById("connectWalletBtn");
  if (mintBtn) { mintBtn.hidden = false; mintBtn.disabled = false; }
  if (connectWalletBtn) { connectWalletBtn.hidden = true; connectWalletBtn.disabled = false; connectWalletBtn.textContent = "Connect Wallet"; }
  if (mintStatus) { mintStatus.hidden = true; mintStatus.className = "mint-status"; }

  setView("result");
  identityResultView.classList.remove("card-reveal");
  void identityResultView.offsetWidth;
  identityResultView.classList.add("card-reveal");
}

generateIdentityBtn?.addEventListener("click", async () => {
  if (!validateAnswers()) return;
  const answer1 = identityQ1 ? identityQ1.value.trim() : "";
  const answer2 = identityQ2 ? identityQ2.value.trim() : "";

  setView("loading");
  try {
    const { ritualName, ritualIdentity } = await callIdentityAPI(answer1, answer2);
    await showIdentityResult(ritualName, ritualIdentity);
  } catch (err) {
    setView("error");
  }
});

function backToForm() {
  setView("form");
  if (identityNote) identityNote.textContent = "Tell us more or edit your answers to get a different result.";
}
document.getElementById("identityErrorRetryBtn")?.addEventListener("click", backToForm);
document.getElementById("startOverBtn")?.addEventListener("click", () => {
  window.location.href = "index.html";
});

identityCopyBtn?.addEventListener("click", async () => {
  const shareText = `${currentName}\n\n${currentIdentity}`;
  try {
    await navigator.clipboard.writeText(shareText);
    const original = identityCopyBtn.textContent;
    identityCopyBtn.textContent = "Copied!";
    setTimeout(() => { identityCopyBtn.textContent = original; }, 1500);
  } catch (err) {
    console.error("Copy to clipboard failed:", err);
  }
});

// ===========================================================
//  GAMBAR KARTU NFT (trading-card)
// ===========================================================
function loadImagePromise(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function roundRect(c, x, y, w, h, r) {
  const radius = Math.min(r, w / 2, h / 2);
  c.beginPath();
  c.moveTo(x + radius, y);
  c.arcTo(x + w, y, x + w, y + h, radius);
  c.arcTo(x + w, y + h, x, y + h, radius);
  c.arcTo(x, y + h, x, y, radius);
  c.arcTo(x, y, x + w, y, radius);
  c.closePath();
}

function drawCover(c, img, x, y, w, h) {
  const ir = img.width / img.height;
  const r = w / h;
  let sx, sy, sw, sh;
  if (ir > r) { sh = img.height; sw = sh * r; sx = (img.width - sw) / 2; sy = 0; }
  else { sw = img.width; sh = sw / r; sx = 0; sy = (img.height - sh) / 2; }
  c.drawImage(img, sx, sy, sw, sh, x, y, w, h);
}

function drawDiamond(c, cx, cy, size) {
  const s = size / 2;
  c.save();
  c.strokeStyle = "#2ddac0";
  c.lineWidth = 3;
  c.beginPath();
  c.moveTo(cx, cy - s); c.lineTo(cx + s, cy); c.lineTo(cx, cy + s); c.lineTo(cx - s, cy);
  c.closePath(); c.stroke();
  c.beginPath();
  c.moveTo(cx, cy - s * 0.42); c.lineTo(cx + s * 0.42, cy); c.lineTo(cx, cy + s * 0.42); c.lineTo(cx - s * 0.42, cy);
  c.closePath(); c.stroke();
  c.restore();
}

function wrapText(c, text, x, y, maxWidth, lineHeight) {
  const words = (text || "").split(" ");
  let line = "";
  let cy = y;
  for (let n = 0; n < words.length; n++) {
    const test = line + words[n] + " ";
    if (c.measureText(test).width > maxWidth && n > 0) {
      c.fillText(line.trim(), x, cy);
      line = words[n] + " ";
      cy += lineHeight;
    } else {
      line = test;
    }
  }
  c.fillText(line.trim(), x, cy);
  return cy;
}

async function generateRitualCard(ritualName, ritualIdentity) {
  if (document.fonts && document.fonts.ready) { try { await document.fonts.ready; } catch (e) {} }

  const W = 800, H = 1120;
  const cardCanvas = document.createElement("canvas");
  cardCanvas.width = W; cardCanvas.height = H;
  const c = cardCanvas.getContext("2d");

  // 1) LATAR = background avatar
  let bgImg = null;
  try { if (bgSrc) bgImg = await loadImagePromise(bgSrc); } catch (e) {}
  if (!bgImg) { try { bgImg = await loadImagePromise(avatarImage); } catch (e) {} }

  if (bgImg) {
    drawCover(c, bgImg, 0, 0, W, H);
  } else {
    const g = c.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, "#0e2a22"); g.addColorStop(1, "#05100c");
    c.fillStyle = g; c.fillRect(0, 0, W, H);
  }
  const ov = c.createLinearGradient(0, 0, 0, H);
  ov.addColorStop(0, "rgba(5,16,12,0.55)");
  ov.addColorStop(0.55, "rgba(5,16,12,0.30)");
  ov.addColorStop(1, "rgba(5,16,12,0.92)");
  c.fillStyle = ov; c.fillRect(0, 0, W, H);

  // 2) BINGKAI MAGIC
  c.strokeStyle = "rgba(45,218,192,0.85)"; c.lineWidth = 6;
  roundRect(c, 24, 24, W - 48, H - 48, 34); c.stroke();
  c.strokeStyle = "rgba(45,218,192,0.40)"; c.lineWidth = 2;
  roundRect(c, 40, 40, W - 80, H - 80, 26); c.stroke();

  // 3) JENDELA ART = PFP full
  const ax = 80, ay = 90, aw = W - 160, ah = aw;
  const avatar = await loadImagePromise(avatarImage);
  c.save();
  roundRect(c, ax, ay, aw, ah, 18); c.clip();
  drawCover(c, avatar, ax, ay, aw, ah);
  c.restore();
  c.strokeStyle = "#2ddac0"; c.lineWidth = 4;
  roundRect(c, ax, ay, aw, ah, 18); c.stroke();

  // 4) JUDUL = rune + Ritual Name
  const titleY = ay + ah + 78;
  const name = (ritualName || "").toUpperCase();
  c.font = "800 44px 'Baloo 2', sans-serif";
  const nameWidth = c.measureText(name).width;
  const runeSize = 30, gap = 16;
  const totalW = runeSize + gap + nameWidth;
  const startX = (W - totalW) / 2;
  drawDiamond(c, startX + runeSize / 2, titleY - 15, runeSize);
  c.textAlign = "left";
  c.fillStyle = "#2ddac0";
  c.fillText(name, startX + runeSize + gap, titleY);

  c.strokeStyle = "rgba(45,218,192,0.35)"; c.lineWidth = 2;
  c.beginPath(); c.moveTo(80, titleY + 26); c.lineTo(W - 80, titleY + 26); c.stroke();

  // 5) DESKRIPSI = Ritual Identity
  c.textAlign = "center";
  c.font = "26px 'Quicksand', sans-serif";
  c.fillStyle = "#f4fffb";
  wrapText(c, ritualIdentity, W / 2, titleY + 74, W - 200, 38);

  // 6) FOOTER
  const footY = H - 66;
  c.strokeStyle = "rgba(45,218,192,0.25)"; c.lineWidth = 1;
  c.beginPath(); c.moveTo(80, footY - 30); c.lineTo(W - 80, footY - 30); c.stroke();

  drawDiamond(c, 96, footY - 8, 20);
  c.textAlign = "left";
  c.font = "700 24px 'Baloo 2', sans-serif";
  c.fillStyle = "#2ddac0";
  c.fillText("RITUALCOSTUME", 118, footY);

  c.textAlign = "right";
  c.font = "700 20px 'Baloo 2', sans-serif";
  c.fillStyle = "#f4fffb";
  c.fillText("RARE", W - 84, footY);

  finalCardImageURL = cardCanvas.toDataURL("image/jpeg", 0.95);
}

// ===========================================================
//  WEB3 / MINTING
// ===========================================================
const mintBtn = document.getElementById("mintBtn");
const connectWalletBtn = document.getElementById("connectWalletBtn");

const CONTRACT_ABI = [
  "function mintCard(address recipient, string memory tokenURI) public returns (uint256)"
];
const CONTRACT_ADDRESS = "0x6eb62E4B52AC49AD71792f47D853736ee8731e3D";

const RITUAL_CHAIN = {
  chainIdHex: "0x7bb", // 1979
  chainName: "Ritual Testnet",
  nativeCurrency: { name: "RITUAL", symbol: "RITUAL", decimals: 18 },
  rpcUrls: ["https://rpc.ritualfoundation.org"],
  blockExplorerUrls: ["https://explorer.ritualfoundation.org"],
};

function showMintSuccess(address, txUrl) {
  if (!mintStatus) return;
  const short = address.slice(0, 6) + "…" + address.slice(-4);
  mintStatus.className = "mint-status success";
  mintStatus.hidden = false;
  mintStatus.innerHTML =
    `✦ NFT RITUAL CARD minted to <code>${short}</code>.<br>` +
    `<a href="${txUrl}" target="_blank" rel="noopener">Check the transaction on Ritual Explorer ↗</a>`;
}

function showMintError(msg) {
  if (!mintStatus) return;
  mintStatus.className = "mint-status error";
  mintStatus.hidden = false;
  mintStatus.textContent = "⚠ " + msg;
}

async function ensureRitualNetwork() {
  const currentChainId = await window.ethereum.request({ method: "eth_chainId" });
  if (currentChainId === RITUAL_CHAIN.chainIdHex) return;
  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: RITUAL_CHAIN.chainIdHex }],
    });
  } catch (switchError) {
    if (switchError.code === 4902) {
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [{
          chainId: RITUAL_CHAIN.chainIdHex,
          chainName: RITUAL_CHAIN.chainName,
          nativeCurrency: RITUAL_CHAIN.nativeCurrency,
          rpcUrls: RITUAL_CHAIN.rpcUrls,
          blockExplorerUrls: RITUAL_CHAIN.blockExplorerUrls,
        }],
      });
    } else {
      throw switchError;
    }
  }
}

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

mintBtn?.addEventListener("click", async () => {
  if (!finalCardImageURL) await generateRitualCard(currentName, currentIdentity);
  mintBtn.hidden = true;
  if (connectWalletBtn) connectWalletBtn.hidden = false;
});

connectWalletBtn?.addEventListener("click", async () => {
  if (typeof window.ethereum === "undefined") {
    showMintError("Wallet Web3 tidak terdeteksi. Silakan pasang ekstensi MetaMask.");
    return;
  }
  try {
    if (mintStatus) mintStatus.hidden = true;
    connectWalletBtn.textContent = "Connecting Wallet...";
    connectWalletBtn.disabled = true;

    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    const walletAddress = accounts[0];

    connectWalletBtn.textContent = "Checking network...";
    await ensureRitualNetwork();

    connectWalletBtn.textContent = "Preparing metadata...";
    const tokenURI = await prepareTokenURI(finalCardImageURL, currentName, currentIdentity);

    connectWalletBtn.textContent = "Minting NFT...";
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const validAddress = ethers.utils.getAddress(CONTRACT_ADDRESS);
    const ritualContract = new ethers.Contract(validAddress, CONTRACT_ABI, signer);

    const tx = await ritualContract.mintCard(walletAddress, tokenURI);
    await tx.wait();

    const explorerBase = RITUAL_CHAIN.blockExplorerUrls[0].replace(/\/$/, "");
    const txUrl = `${explorerBase}/tx/${tx.hash}`;
    showMintSuccess(walletAddress, txUrl);
    connectWalletBtn.textContent = "NFT Minted Successfully!";
  } catch (error) {
    console.error("Gagal melakukan proses minting:", error);
    const readableMessage =
      error.reason || error.data?.message || error.message || JSON.stringify(error);
    showMintError(readableMessage);
    connectWalletBtn.textContent = "Connect Wallet";
    connectWalletBtn.disabled = false;
  }
});

document.getElementById("shareBtn")?.addEventListener("click", () => {
  const ritualName = currentName || "Ritualist";
  const tweetText =
    `I just forged my true identity as "${ritualName}" in RitualCostume. Create your magic.\n` +
    `${window.location.origin}\n` +
    `#RITUAL @ritualnet`;
  const text = encodeURIComponent(tweetText);
  window.open("https://twitter.com/intent/tweet?text=" + text, "_blank");
});
