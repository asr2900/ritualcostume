/**
 * api/mint-metadata.js
 * -----------------------------------------------------------
 * Endpoint ini menyiapkan metadata NFT sebelum mint:
 * 1. Menerima gambar Ritual Card (base64 data URL) dari browser
 * 2. Upload gambar itu ke IPFS lewat Pinata
 * 3. Membuat file JSON metadata standar NFT (name, description, image)
 * 4. Upload JSON itu juga ke IPFS
 * 5. Mengembalikan tokenURI (link ipfs:// ke JSON-nya, BUKAN gambarnya)
 *
 * PENTING: tokenURI yang dikirim ke smart contract harus kecil (cuma
 * satu link ipfs://), bukan gambar mentah. Gambar base64 bisa ratusan
 * KB — kalau itu dikirim langsung sebagai tokenURI on-chain, biaya gas-
 * nya bisa sangat besar atau transaksinya gagal total karena melebihi
 * gas limit block.
 *
 * Cara pasang PINATA_JWT:
 * 1. Daftar gratis di https://app.pinata.cloud
 * 2. Buka "API Keys" -> "New Key" -> centang izin pinFileToIPFS &
 *    pinJSONToIPFS -> Generate, lalu salin nilai "JWT" (bukan API Key
 *    biasa, harus yang JWT)
 * 2. Buka dashboard project-mu di vercel.com
 * 3. Settings -> Environment Variables
 * 4. Tambahkan variabel bernama PINATA_JWT, isi dengan JWT tadi
 * 5. Redeploy project supaya variabel itu terbaca
 * -----------------------------------------------------------
 */

export const config = {
  maxDuration: 30,
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { imageDataUrl, ritualName, ritualIdentity } = req.body || {};

  if (
    !imageDataUrl ||
    typeof imageDataUrl !== "string" ||
    !imageDataUrl.startsWith("data:image")
  ) {
    res.status(400).json({ error: "Missing or invalid imageDataUrl" });
    return;
  }
  if (!ritualName || !ritualIdentity) {
    res.status(400).json({ error: "Missing ritualName or ritualIdentity" });
    return;
  }

  const jwt = process.env.PINATA_JWT;
  if (!jwt) {
    console.error("PINATA_JWT is not set in the environment");
    res.status(500).json({ error: "Server is not configured" });
    return;
  }

  try {
    // 1. Ubah data URL base64 jadi data biner asli
    const matches = imageDataUrl.match(/^data:(image\/\w+);base64,(.+)$/);
    if (!matches) {
      res.status(400).json({ error: "imageDataUrl is not a valid base64 image" });
      return;
    }
    const mimeType = matches[1];
    const base64Data = matches[2];
    const imageBuffer = Buffer.from(base64Data, "base64");

    // 2. Upload gambar kartu ke IPFS lewat Pinata
    const imageForm = new FormData();
    imageForm.append("file", new Blob([imageBuffer], { type: mimeType }), "ritual-card.jpg");

    const imageUploadRes = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
      method: "POST",
      headers: { Authorization: `Bearer ${jwt}` },
      body: imageForm,
    });

    if (!imageUploadRes.ok) {
      const errText = await imageUploadRes.text();
      console.error("Pinata image upload failed:", imageUploadRes.status, errText);
      res.status(502).json({ error: "Failed to upload image to IPFS" });
      return;
    }

    const imageUploadData = await imageUploadRes.json();
    const imageCid = imageUploadData.IpfsHash;
    const imageUri = `ipfs://${imageCid}`;

    // 3. Buat JSON metadata standar NFT dan upload juga ke IPFS
    const metadata = {
      name: ritualName,
      description: ritualIdentity,
      image: imageUri,
    };

    const metadataUploadRes = await fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${jwt}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ pinataContent: metadata }),
    });

    if (!metadataUploadRes.ok) {
      const errText = await metadataUploadRes.text();
      console.error("Pinata metadata upload failed:", metadataUploadRes.status, errText);
      res.status(502).json({ error: "Failed to upload metadata to IPFS" });
      return;
    }

    const metadataUploadData = await metadataUploadRes.json();
    const metadataCid = metadataUploadData.IpfsHash;

    // Ini yang dikirim ke smart contract — kecil, cuma sebuah link
    res.status(200).json({ tokenURI: `ipfs://${metadataCid}` });
  } catch (err) {
    console.error("mint-metadata failed:", err);
    res.status(500).json({ error: "Failed to prepare NFT metadata" });
  }
}
