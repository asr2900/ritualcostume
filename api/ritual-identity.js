import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function executeWithRetry(apiCall, maxRetries = 2) {
  let attempt = 0;
  while (attempt < maxRetries) {
    try {
      return await apiCall();
    } catch (error) {
      attempt++;
      
      const isRateLimit = error.status === 429 || (error.message && error.message.includes("429"));
      const isUnavailable = error.status === 503 || (error.message && error.message.includes("503"));

      // Mengekstrak permintaan waktu tunggu dari Google (contoh: "Please retry in 31s")
      let delayStr = error.message.match(/retry in (\d+\.?\d*)s/);
      let requestedDelay = delayStr ? parseFloat(delayStr[1]) * 1000 : 0;

      // Jika Google meminta tunggu lebih dari 5 detik, HENTIKAN proses agar Vercel tidak timeout (10s limit)
      if (isRateLimit && requestedDelay > 5000) {
        console.warn(`[Limit Kuota] Google meminta tunggu ${Math.ceil(requestedDelay/1000)} detik. Menghentikan retry...`);
        throw new Error(`QUOTA_EXCEEDED`);
      }

      if ((isRateLimit || isUnavailable) && attempt < maxRetries) {
        const delay = requestedDelay > 0 ? requestedDelay : (Math.pow(2, attempt) * 1000 + Math.random() * 1000);
        console.warn(`[Retry] API Error. Mencoba lagi dalam ${Math.round(delay/1000)} detik... (${attempt}/${maxRetries})`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      } else {
        console.error("[Fatal Error] Gagal memanggil Gemini API:", error.message);
        throw error;
      }
    }
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed.' });
  }

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch (e) {
        return res.status(400).json({ error: 'Format JSON tidak valid.' });
      }
    }

    const { layerNames, answer1, answer2 } = body;

    if (!layerNames || !answer1 || !answer2) {
      return res.status(400).json({ 
        error: 'Data tidak lengkap. Pastikan mengirim layerNames, answer1, dan answer2.' 
      });
    }

    // Menggunakan gemini-1.5-flash sebagai solusi ampuh menghindari limit ketat di 2.0
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const promptText = `
    You are a master of the soul forge. Create a mystical, witty AI agent identity based on these attributes:
    - Visual traits: ${JSON.stringify(layerNames)}
    - User's inner thought 1: "${answer1}"
    - User's inner thought 2: "${answer2}"

    Respond ONLY with a valid JSON object strictly containing exactly two keys:
    1. "ritualName": A short, creative, mystical yet witty name for this entity.
    2. "ritualIdentity": A 2-3 sentence lore/description matching the personality.
    Do not include markdown tags like \`\`\`json.
    `;

    // Cukup gunakan maksimal 2 kali retries agar lebih aman dari limit timeout Vercel
    const result = await executeWithRetry(async () => {
      return await model.generateContent(promptText);
    }, 2);

    let responseText = result.response.text();
    responseText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();

    const parsedData = JSON.parse(responseText);

    return res.status(200).json({
      ritualName: parsedData.ritualName || "The Nameless One",
      ritualIdentity: parsedData.ritualIdentity || "A mysterious entity forged in silence."
    });

  } catch (error) {
    console.error("Gagal memproses request:", error);
    
    if (error.message === 'QUOTA_EXCEEDED') {
        return res.status(429).json({ 
          error: "Batas penggunaan API gratis tercapai. Harap tunggu 1 menit sebelum mencoba lagi."
        });
    }

    return res.status(500).json({ 
      error: "The forge is currently overwhelmed. Try again shortly."
    });
  }
}
