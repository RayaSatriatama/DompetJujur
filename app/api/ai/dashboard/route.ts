import { streamText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';

const openrouter = createOpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { totalSessions, delayedCount, delayedAmount, topTrigger, lateNightCount } = await req.json();

    const formattedAmount = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(delayedAmount || 0);

    const systemPrompt = `Kamu adalah pakar dan pendamping finansial bijak di DompetJujur.
Tugasmu adalah memberikan 2-3 kalimat ringkas "Insight Mingguan/Bulanan AI" tentang pola jeda pengguna.

Data statistik pengguna bulan ini:
- Total Sesi Jeda: ${totalSessions || 0}
- Keputusan Berhasil Ditunda: ${delayedCount || 0}
- Nominal Berhasil Ditunda: ${formattedAmount}
- Pemicu (Trigger) Paling Sering: ${topTrigger || 'Belum ada'}
- Sesi di Larut Malam (> 22:00): ${lateNightCount || 0}

Aturan Penulisan:
1. Bahasa Indonesia hangat, kasual, suportif, netral, tanpa menghakimi.
2. Fokus pada apresiasi kesadaran pengguna memberi jarak sebelum belanja impulsif.
3. Berikan 1 tips konkret sederhana untuk menghadapi pemicu utama (${topTrigger}).
4. Maksimal 3 kalimat. Tanpa emoji berlebihan.`;

    const modelName = process.env.LLM_MODEL || 'deepseek/deepseek-v4-flash';

    const result = streamText({
      model: openrouter(modelName),
      system: systemPrompt,
      messages: [
        { role: 'user', content: 'Analisis statistik jedaku dan berikan insight suportif.' }
      ],
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error('AI Dashboard API Error:', error);
    return new Response('Gagal memuat insight AI', { status: 500 });
  }
}
