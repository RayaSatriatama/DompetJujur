const fs = require('fs')
const path = require('path')

// Manual minimal dotenv parser to avoid requiring 'dotenv' package if not installed
function loadEnv() {
  const envPath = path.resolve(__dirname, '../.env.local')
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf-8')
    content.split('\n').forEach(line => {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/)
      if (match) {
        const key = match[1]
        let value = match[2] || ''
        if (value.startsWith('"') && value.endsWith('"')) {
          value = value.slice(1, -1)
        }
        process.env[key] = value
      }
    })
  }
}

loadEnv()

async function testLLM() {
  const apiKey = process.env.OPENROUTER_API_KEY
  const model = process.env.LLM_MODEL

  if (!apiKey || !model) {
    console.error('Error: OPENROUTER_API_KEY or LLM_MODEL tidak ditemukan di .env.local')
    process.exit(1)
  }

  console.log(`Menguji LLM dengan model: ${model}`)
  console.log('Menghubungi OpenRouter API...')

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: 'user',
            content: 'Halo! Tolong jawab dengan kalimat singkat: "Koneksi berhasil!".'
          }
        ]
      })
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('API Error:', data)
      process.exit(1)
    }

    console.log('\n--- Hasil Respons LLM ---')
    console.log(data.choices[0].message.content)
    console.log('-------------------------\n')
    console.log('✅ Test Berhasil!')
  } catch (error) {
    console.error('Terjadi kesalahan saat menghubungi API:', error.message)
  }
}

testLLM()
