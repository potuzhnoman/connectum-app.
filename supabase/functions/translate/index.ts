import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

console.log("Translate function started");

serve(async (req) => {
  // 1. Настройка доступа (CORS)
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      }
    })
  }

  // 2. Получаем текст от клиента
  const { text, targetLang } = await req.json()

  if (!text) {
    return new Response(
      JSON.stringify({ error: 'Text is required' }),
      {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    )
  }

  try {
    // 3. Звоним в DeepL (используя ключ из переменных окружения)
    const deeplResponse = await fetch('https://api-free.deepl.com/v2/translate', {
      method: 'POST',
      headers: {
        'Authorization': `DeepL-Auth-Key ${Deno.env.get('DEEPL_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: [text],
        target_lang: targetLang || 'EN',
      }),
    })

    const data = await deeplResponse.json()

    if (!deeplResponse.ok) {
      throw new Error(data.message || 'DeepL API error')
    }

    // 4. Отправляем перевод обратно
    return new Response(
      JSON.stringify({ translatedText: data.translations[0].text }),
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    )

  } catch (error) {
    console.error("Translation Error:", error)
    return new Response(
      JSON.stringify({ error: 'Translation failed' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    )
  }
})
