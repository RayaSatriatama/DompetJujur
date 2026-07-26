import { streamText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';

// Create a custom provider for OpenRouter
const openrouter = createOpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
});

export async function POST(req: Request) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  console.log('[summary] OPENROUTER_API_KEY present:', !!apiKey);

  try {
    const { outcome, reflectionCode } = await req.json();

    const isDelayed = outcome === 'delayed' || outcome === 'redirected';
    
    // Map reflection code to readable text for AI
    const reflectionMap: Record<string, string> = {
      calmer: 'lebih tenang',
      same: 'biasa saja',
      urge_too_strong: 'dorongan terlalu kuat',
      stress: 'sedang stres',
      chasing_loss: 'merasa harus balik modal',
      avoid_thinking: 'tidak ingin berpikir panjang',
      skipped: 'melewati refleksi',
    };

    const userReflection = reflectionMap[reflectionCode] || 'tidak diketahui';
    const actionResult = isDelayed ? 'berhasil menunda' : 'tetap melanjutkan';

    const systemPrompt = `Kamu asisten suportif DompetJujur. Pengguna baru selesai jeda 90 detik, hasilnya: ${actionResult}, perasaannya: ${userReflection}. Tulis TEPAT 1-2 kalimat singkat, empati, kasual bahasa Indonesia, tanpa emoji, tanpa nasihat keuangan.`;

    if (!apiKey) {
      console.warn('[summary] No OPENROUTER_API_KEY - returning static fallback');
      const fallback = isDelayed 
        ? 'Kamu berhasil menjeda. Itu keputusan yang bijak.'
        : 'Jujur pada diri sendiri itu langkah pertama yang baik.'
      return new Response(fallback)
    }

    const modelName = process.env.LLM_MODEL || 'google/gemini-2.5-flash';
    console.log('[summary] Using model:', modelName);

    const result = streamText({
      model: openrouter(modelName),
      system: systemPrompt,
      messages: [
        { role: 'user', content: 'Tulis catatannya sekarang.' }
      ],
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error('[summary] API Error:', error);
    return new Response(
      'Setiap langkah kecil untuk jujur pada diri sendiri adalah awal yang baik.', 
      { status: 200 }
    );
  }
}
