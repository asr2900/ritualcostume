/**
 * api/ritual-identity.js
 * -----------------------------------------------------------
 * Vercel otomatis mendeteksi file di dalam folder /api sebagai
 * serverless function — ini jadi backend kecil, tanpa perlu
 * server terpisah atau build step.
 *
 * File ini yang menyimpan pemanggilan ke Anthropic API, supaya
 * API key TIDAK PERNAH dikirim ke browser pengguna.
 *
 * Cara pasang API key-nya:
 * 1. Buka dashboard project-mu di vercel.com
 * 2. Settings -> Environment Variables
 * 3. Tambahkan variabel bernama ANTHROPIC_API_KEY, isi dengan
 *    API key dari console.anthropic.com
 * 4. Redeploy project supaya variabel itu terbaca
 * -----------------------------------------------------------
 */

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { layerNames, answer1, answer2 } = req.body || {};

  if (
    !layerNames ||
    typeof layerNames !== "object" ||
    !answer1 ||
    !answer2 ||
    typeof answer1 !== "string" ||
    typeof answer2 !== "string"
  ) {
    res.status(400).json({ error: "Missing or invalid fields" });
    return;
  }

  // batasi panjang jawaban di sisi server juga, jangan cuma percaya
  // batas maxlength di browser
  const cleanAnswer1 = answer1.trim().slice(0, 150);
  const cleanAnswer2 = answer2.trim().slice(0, 150);

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error("ANTHROPIC_API_KEY is not set in the environment");
    res.status(500).json({ error: "Server is not configured" });
    return;
  }

  const traitLines = Object.entries(layerNames)
    .map(([label, name]) => `- ${label}: ${name}`)
    .join("\n");

  const prompt = `You are the lore-keeper of the Ritual Network — a decentralized AI infrastructure built to bring AI onchain, open and verifiable, owned by no single company.

A community member has just created their avatar with these traits:
${traitLines}

They answered two questions:
1. Why they joined: "${cleanAnswer1}"
2. What they believe Ritual will change: "${cleanAnswer2}"

Based on their visual identity and personal answers, give them:

1. A RITUAL NAME — a unique name that feels earned, not random. It should reflect both their visual aesthetic and their belief. 2-4 words. It can be poetic, mythic, or technical in tone. Avoid generic fantasy tropes.

2. A RITUAL IDENTITY — a short paragraph (3-4 sentences) written in second person ("You are..."). It should describe who this person is in the Ritual ecosystem: their role, their energy, what they stand for. Reference their specific answers and at least one visual trait naturally. It should feel personal enough that no two people could receive the same text.

Respond ONLY in this JSON format, no preamble, no explanation:
{
  "ritualName": "...",
  "ritualIdentity": "..."
}`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 1000,
        messages: [{ role: "user", content: prompt }],
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errText = await response.text();
      console.error("Anthropic API error:", response.status, errText);
      res.status(502).json({ error: "Upstream API error" });
      return;
    }

    const data = await response.json();
    const textBlock = (data.content || []).find((block) => block.type === "text");
    const rawText = textBlock ? textBlock.text : "";
    const cleaned = rawText.replace(/```json|```/g, "").trim();

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch (parseErr) {
      console.error("Failed to parse Anthropic response as JSON:", rawText);
      res.status(502).json({ error: "Malformed response from model" });
      return;
    }

    if (!parsed.ritualName || !parsed.ritualIdentity) {
      console.error("Response missing expected fields:", parsed);
      res.status(502).json({ error: "Malformed response from model" });
      return;
    }

    res.status(200).json({
      ritualName: parsed.ritualName,
      ritualIdentity: parsed.ritualIdentity,
    });
  } catch (err) {
    console.error("Ritual identity generation failed:", err);
    res.status(500).json({ error: "Generation failed" });
  }
}
