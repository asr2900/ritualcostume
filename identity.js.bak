/**
 * identity.js — halaman Ritual Identity.
 * Membaca avatar + pilihan dari sessionStorage (dikirim dari builder),
 * memanggil /api/ritual-identity, menampilkan hasil dalam kartu magic,
 * lalu menangani minting NFT lewat /api/mint-metadata + smart contract.
 */

// ---------- DATA DARI BUILDER ----------
const avatarImage = sessionStorage.getItem("ritual.avatar");
let layerNames = {};
try {
  layerNames = JSON.parse(sessionStorage.getItem("ritual.layerNames") || "{}");
} catch (e) {
  layerNames = {};
}

// Kalau dibuka tanpa membangun avatar dulu, kembalikan ke builder.
if (!avatarImage) window.location.replace("index.html");

// ---------- ELEMEN ----------
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

const previewImg = document.getElementById("identityAvatarPreview");
const cardAvatarImg = document.getElementById("cardAvatar");
if (previewImg && avatarImage) previewImg.src = avatarImage;
if (cardAvatarImg && avatarImage) cardAvatarImg.src = avatarImage;
if (identityQ1) identityQ1.focus();

// ---------- VIEW SWITCH ----------
function setView(view) {
  if (identityFormView) identityFormView.hidden = view !== "form";
  if (identityLoadingView) identityLoadingView.hidden = view !== "loading";
  if (identityErrorView) identityErrorView.hidden = view !== "error";
  if (identityResultView) identityResultView.hidden = view !== "result";
}

// ---------- VALIDASI ----------
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

// ---------- PANGGIL API IDENTITY ----------
async function callIdentityAPI(names, answer1, answer2) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 48000);
  try {
    const response = await fetch("/api/ritual-identity", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ layerNames: names, answer1, answer2 }),
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

function showIdentityResult(ritualName, ritualIdentity) {
  if (identityNameOutput) identityNameOutput.textContent = ritualName;
  if (identityDescOutput) identityDescOutput.textContent = ritualIdentity;

  const mintBtn = document.getElementById("mintBtn");
  const connectWalletBtn = document.getElementById("connectWalletBtn");
  if (mintBtn) { mintBtn.hidden = false; mintBtn.disabled = false; }
  if (connectWalletBtn) connectWalletBtn.hidden = true;

  setView("result");
  // trigger animasi reveal kartu
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
    const { ritualName, ritualIdentity } = await callIdentityAPI(layerNames, answer1, answer2);
    showIdentityResult(ritualName, ritualIdentity);
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
  if (!identityNameOutput || !identityDescOutput) return;
  const shareText = `${identityNameOutput.textContent}\n\n${identityDescOutput.textContent}`;
  try {
    await navigator.clipboard.writeText(shareText);
    const original = identityCopyBtn.textContent;
    identityCopyBtn.textContent = "Copied!";
    setTimeout(() => { identityCopyBtn.textContent = original; }, 1500);
  } catch (err) {
    console.error("Copy to clipboard failed:", err);
  }
});

// ---------- RITUAL CARD (untuk NFT) & WEB3 ----------
const mintBtn = document.getElementById("mintBtn");
const connectWalletBtn = document.getElementById("connectWalletBtn");
let finalCardImageURL = "";

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

function loadImagePromise(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

// Susun kartu 800x1200 bertema magic dari avatar tersimpan.
async function generateRitualCard() {
  if (!identityNameOutput || !identityDescOutput || !avatarImage) return;
  const ritualName = identityNameOutput.textContent;
  const ritualIdentity = identityDescOutput.textContent;

  const cardCanvas = document.createElement("canvas");
  cardCanvas.width = 800;
  cardCanvas.height = 1200;
  const c = cardCanvas.getContext("2d");

  // latar gradient magic
  const grad = c.createLinearGradient(0, 0, 0, 1200);
  grad.addColorStop(0, "#0e2a22");
  grad.addColorStop(1, "#05100c");
  c.fillStyle = grad;
  c.fillRect(0, 0, 800, 1200);

  // bingkai avatar (kotak)
  const avatar = await loadImagePromise(avatarImage);
  c.drawImage(avatar, 100, 100, 600, 600);
  c.strokeStyle = "#2ddac0";
  c.lineWidth = 4;
  c.strokeRect(100, 100, 600, 600);

  // nama
  c.fillStyle = "#2ddac0";
  c.font = "bold 52px 'Baloo 2', sans-serif";
  c.textAlign = "center";
  c.fillText((ritualName || "").toUpperCase(), 400, 800);

  // deskripsi (word wrap)
  c.font = "26px 'Quicksand', sans-serif";
  c.fillStyle = "#f4fffb";
  const maxWidth = 640;
  const words = (ritualIdentity || "").split(" ");
  let line = "";
  let y = 870;
  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + " ";
    if (c.measureText(testLine).width > maxWidth && n > 0) {
      c.fillText(line, 400, y);
      line = words[n] + " ";
      y += 38;
    } else {
      line = testLine;
    }
  }
  c.fillText(line, 400, y);

  finalCardImageURL = cardCanvas.toDataURL("image/jpeg", 0.95);
}

mintBtn?.addEventListener("click", async () => {
  mintBtn.disabled = true;
  await generateRitualCard();
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

    connectWalletBtn.textContent = "Checking network...";
    await ensureRitualNetwork();

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
    `I just forged my true identity as "${ritualName}" in RitualCostume. Create your magic.\n` +
    `${window.location.origin}\n` +
    `#RITUAL @ritualnet`;
  const text = encodeURIComponent(tweetText);
  window.open(`https://twitter.com/intent/tweet?text=${text}`, "_blank");
});
