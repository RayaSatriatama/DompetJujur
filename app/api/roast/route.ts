import { streamText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';

// Create a custom provider for OpenRouter
const openrouter = createOpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { item_name, item_price, intent_description } = await req.json();

    const systemPrompt = `Kamu adalah asisten keuangan yang sangat sarkastik, tajam, namun lucu. 
Pengguna baru saja memaksa membeli barang impulsif ini meskipun sudah diminta jeda 90 detik.
Barang: ${item_name}
Harga: Rp ${item_price}
Alasan: ${intent_description}

Tugasmu: Berikan 'roasting' (sindiran keras) sepanjang maksimal 3 kalimat agar dia merasa sedikit bersalah tapi terhibur. Jangan gunakan emoji. Gunakan bahasa Indonesia gaul/kasual.`;

    const modelName = process.env.LLM_MODEL || 'deepseek/deepseek-v4-flash';

    const result = streamText({
      model: openrouter(modelName),
      system: systemPrompt,
      messages: [
        { role: 'user', content: 'Roast saya sekarang!' }
      ],
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error('API Error:', error);
    return new Response('Error connecting to AI', { status: 500 });
  }
}
