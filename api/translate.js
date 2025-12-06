export default async function handler(request, response) {
    // 1. Настройка доступа (CORS), чтобы сайт мог стучаться сюда
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
    // Если браузер просто "спрашивает разрешение"
    if (request.method === 'OPTIONS') {
      return response.status(200).end();
    }
  
    // 2. Получаем текст от сайта
    const { text, targetLang } = request.body;
  
    if (!text) {
      return response.status(400).json({ error: 'Text is required' });
    }
  
    try {
      // 3. Звоним в DeepL (используя скрытый ключ)
      const deeplResponse = await fetch('https://api-free.deepl.com/v2/translate', {
        method: 'POST',
        headers: {
          'Authorization': `DeepL-Auth-Key ${process.env.DEEPL_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: [text],
          target_lang: targetLang || 'EN', // По умолчанию на английский
        }),
      });
  
      const data = await deeplResponse.json();
  
      if (!deeplResponse.ok) {
          throw new Error(data.message || 'DeepL API error');
      }
  
      // 4. Отправляем перевод обратно на сайт
      return response.status(200).json({ translatedText: data.translations[0].text });
  
    } catch (error) {
      console.error("Translation Error:", error);
      return response.status(500).json({ error: 'Translation failed' });
    }
  }