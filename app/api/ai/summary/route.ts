import { streamText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';

// Create a custom provider for OpenRouter
const openrouter = createOpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { outcome, reflectionCode } = await req.json();

    const isDelayed = outcome === 'delayed' || outcome === 'redirected';
    
    // Map reflection code to readable text for AI
    const reflectionMap: Record<string, string> = {
      calmer: 'Merasa lebih tenang',
      lighter: 'Merasa lebih ringan',
      same: 'Merasa biasa saja',
      heavy: 'Masih merasa berat menahan dorongan',
      urge_too_strong: 'Dorongan impulsif terlalu kuat',
      stress: 'Sedang mengalami stres',
      chasing_loss: 'Merasa harus balik modal',
      avoid_thinking: 'Tidak ingin berpikir panjang',
      skipped: 'Melewati pertanyaan refleksi'
    };

    const userReflection = reflectionMap[reflectionCode] || 'Tidak diketahui';
    const actionResult = isDelayed ? 'berhasil menunda keputusan impulsif' : 'memutuskan untuk tetap melanjutkan pengeluaran impulsif';

    const systemPrompt = `Kamu adalah asisten suportif di aplikasi DompetJujur (aplikasi untuk jeda sebelum belanja impulsif).
Pengguna baru saja menyelesaikan sesi jeda 90 detik.
Hasil keputusan pengguna: ${actionResult}
Perasaan pengguna saat ini: ${userReflection}

Tugasmu:
1. Berikan HANYA 1-2 kalimat pendek yang sangat suportif, empati, dan netral.
2. JANGAN menghakimi jika pengguna memilih tetap lanjut (karena jujur itu langkah pertama yang baik).
3. JANGAN memberikan nasihat keuangan atau saran investasi.
4. Gunakan bahasa Indonesia kasual/sehari-hari (kamu/aku).
5. Jangan gunakan emoji berlebihan.`;

    if (!process.env.OPENROUTER_API_KEY) {
      const fallback = isDelayed 
        ? "Luar biasa! Kamu berhasil mengendalikan dorongan di waktu rawan. Semakin sering kamu berlatih menunda, semakin ringan rasanya di kemudian hari. Teruskan kebiasaan baik ini!"
        : "Tidak apa-apa. Hari ini mungkin berat, tapi ini bukan akhir. Kamu sudah mencoba yang terbaik. Mari kita coba lagi di kesempatan berikutnya."
      return new Response(fallback)
    }

    const modelName = process.env.LLM_MODEL || 'google/gemini-2.5-flash';

    const result = streamText({
      model: openrouter(modelName),
      system: systemPrompt,
      messages: [
        { role: 'user', content: 'Berikan kalimat suportif untukku sekarang.' }
      ],
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error('API Error:', error);
    return new Response(
      "Setiap langkah kecil untuk jujur pada diri sendiri adalah awal keputusan keuangan yang lebih sadar.", 
      { status: 200 }
    );
  }
}
