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
        console.warn(`[Retry] Gemini API Error ${error.status || ''}. Mencoba lagi dalam ${Math.round(delay/1000)} detik... (${attempt}/${maxRetries})`);
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
    return res.status(405).json({ error: 'Method Not Allowed. Harap gunakan POST.' });
  }

  try {
    // Penanganan khusus: Kadang Vercel membaca body sebagai string jika Content-Type di frontend kurang tepat
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch (e) {
        return res.status(400).json({ error: 'Format data tidak valid. Pastikan mengirim JSON.' });
      }
    }

    // Tangkap berbagai kemungkinan nama variabel dari script.js
    const prompt = body.prompt || body.message || body.text || body.input;

    if (!prompt) {
      return res.status(400).json({ 
        error: 'Prompt kosong atau nama variabel tidak cocok. Pastikan script.js mengirim data dengan key "prompt".' 
      });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const result = await executeWithRetry(async () => {
      return await model.generateContent(prompt);
    }, 3);

    const responseText = result.response.text();

    return res.status(200).json({ 
        success: true, 
        data: responseText 
    });

  } catch (error) {
    console.error("Gagal memproses request:", error);
    return res.status(500).json({ 
      success: false, 
      error: "Sistem sedang sibuk atau batas kuota tercapai. Silakan coba beberapa saat lagi.",
      details: error.message
    });
  }
}
