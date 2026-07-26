import { streamText } from 'ai'
import { createOpenAI } from '@ai-sdk/openai'

const openrouter = createOpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
})

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    const systemPrompt = `Kamu adalah "Teman AI Jujur", asisten psikologi & keuangan pribadi yang empati di aplikasi DompetJujur.
Prinsip utama kamu:
1. Tenang, dewasa, manusiawi, suportif, privat, dan SANGAT TIDAK MENGHAKIMI.
2. Tidak memberikan nasihat investasi hukum/keuangan formal atau rekomendasi saham/pinjol.
3. Bantu pengguna mengenali pemicu belanja impulsif (stres, bosan, gajian, pelarian, Paylater) dan berikan saran praktis untuk menciptakan jeda/jarak 90 detik.
4. Gunakan bahasa Indonesia kasual yang hangat dan sopan (kamu/aku).
5. Berikan jawaban yang ringkas (2-4 paragraf singkat) agar nyaman dibaca di layar HP/mobile.`

    const modelName = process.env.LLM_MODEL || 'deepseek/deepseek-v4-flash'

    const result = streamText({
      model: openrouter(modelName),
      system: systemPrompt,
      messages,
    })

    return result.toTextStreamResponse()
  } catch (error) {
    console.error('AI Chat Error:', error)
    return new Response('Gagal terhubung dengan Teman AI', { status: 500 })
  }
}
