import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function executeWithRetry(apiCall, maxRetries = 3) {
  let attempt = 0;
  while (attempt < maxRetries) {
    try {
      return await apiCall();
    } catch (error) {
      attempt++;
      const isRateLimitOrUnavailable = 
        error.status === 429 || 
        error.status === 503 || 
        (error.message && (error.message.includes("429") || error.message.includes("503")));

      if (isRateLimitOrUnavailable && attempt < maxRetries) {
        const delay = Math.pow(2, attempt) * 1000 + Math.random() * 1000;
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

    // Menangkap data sesuai dengan yang dikirim oleh script.js
    const { layerNames, answer1, answer2 } = body;

    if (!layerNames || !answer1 || !answer2) {
      return res.status(400).json({ 
        error: 'Data tidak lengkap. Pastikan mengirim layerNames, answer1, dan answer2.' 
      });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Meracik prompt untuk The Siggy Soul Forge
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

    const result = await executeWithRetry(async () => {
      return await model.generateContent(promptText);
    }, 3);

    let responseText = result.response.text();
    
    // Membersihkan format markdown jika Gemini masih mengembalikannya
    responseText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();

    const parsedData = JSON.parse(responseText);

    // Mengirim balasan persis seperti yang diharapkan oleh script.js
    return res.status(200).json({
      ritualName: parsedData.ritualName || "The Nameless One",
      ritualIdentity: parsedData.ritualIdentity || "A mysterious entity forged in silence."
    });

  } catch (error) {
    console.error("Gagal memproses request:", error);
    return res.status(500).json({ 
      error: "The forge is currently overwhelmed. Try again shortly."
    });
  }
}
