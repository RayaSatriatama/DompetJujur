import { streamText } from 'ai'
import { createOpenAI } from '@ai-sdk/openai'

const openrouter = createOpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
})

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    // Jika API Key belum terkonfigurasi di Vercel, berikan balasan empati sebagai fallback
    if (!process.env.OPENROUTER_API_KEY) {
      const lastUserMsg = messages?.[messages.length - 1]?.content || ''
      const fallbackReply = `Terima kasih sudah berbagi. Menyadari pemicu belanja seperti "${lastUserMsg}" adalah langkah awal yang sangat baik. Cobalah beri dirimu jeda 90 detik sebelum mengambil keputusan, dan ingat bahwa kendali penuh ada di tanganmu.`
      return new Response(fallbackReply, { status: 200 })
    }

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
    const fallbackReply = 'Halo! Teman AI di sini untuk mendengarkan. Jeda sebentar sebelum belanja impulsif membantu pikiranmu tetap jernih dan tenang.'
    return new Response(fallbackReply, { status: 200 })
  }
}
