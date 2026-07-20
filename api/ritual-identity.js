import { GoogleGenerativeAI } from "@google/generative-ai";

// 1. Inisialisasi SDK Gemini
// Pastikan kamu sudah memasukkan GEMINI_API_KEY di menu Environment Variables Vercel
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * 2. Fungsi Anti-Crash (Retry Logic dengan Exponential Backoff)
 * Fungsi ini akan menahan proses dan mencoba ulang jika server Gemini penuh atau limit.
 */
async function executeWithRetry(apiCall, maxRetries = 3) {
  let attempt = 0;

  while (attempt < maxRetries) {
    try {
      // Mencoba mengeksekusi request ke Gemini
      return await apiCall();
    } catch (error) {
      attempt++;

      // Mengecek apakah error disebabkan oleh 429 (Limit) atau 503 (Server Sibuk)
      const isRateLimitOrUnavailable = 
        error.status === 429 || 
        error.status === 503 || 
        (error.message && (error.message.includes("429") || error.message.includes("503")));

      if (isRateLimitOrUnavailable && attempt < maxRetries) {
        // Menghitung jeda tunggu: 2 detik, 4 detik, 8 detik (+ sedikit angka acak)
        const delay = Math.pow(2, attempt) * 1000 + Math.random() * 1000;
        
        console.warn(`[Sistem Terbantu] Gemini API Error ${error.status || ''}. Mencoba lagi dalam ${Math.round(delay/1000)} detik... (Percobaan ${attempt}/${maxRetries})`);
        
        // Jeda sesaat sebelum mengulang
        await new Promise((resolve) => setTimeout(resolve, delay));
      } else {
        // Lempar error jika bukan karena limit/server sibuk, atau sudah mentok 3x coba
        console.error("[Error Fatal] Gagal memanggil Gemini API:", error.message);
        throw error;
      }
    }
  }
}

// 3. Endpoint Vercel Serverless Function Utama
export default async function handler(req, res) {
  // Hanya izinkan request POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed. Harap gunakan POST.' });
  }

  try {
    // Ambil input dari frontend (sesuaikan 'prompt' ini dengan nama variabel di frontend kamu)
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt tidak boleh kosong.' });
    }

    // Inisialisasi model (menggunakan model yang sama dengan log error kamu)
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // 4. Eksekusi Gemini dengan fungsi Retry
    const result = await executeWithRetry(async () => {
      return await model.generateContent(prompt);
    }, 3); // 3 adalah maksimal percobaan

    // Ambil hasil teksnya
    const responseText = result.response.text();

    // Kirim balasan sukses ke frontend
    return res.status(200).json({ 
        success: true, 
        data: responseText 
    });

  } catch (error) {
    console.error("Gagal memproses request:", error);
    
    // Kirim balasan error yang rapi ke frontend jika gagal total
    return res.status(500).json({ 
      success: false, 
      error: "Sistem sedang sibuk atau batas kuota tercapai. Silakan coba beberapa saat lagi.",
      details: error.message
    });
  }
}
