export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.DEEPL_API_KEY;

  try {
    const { text, targetLang } = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return res.status(400).json({ error: 'Text is required' });
    }

    const target = (targetLang || 'EN').toString().toUpperCase();

    if (!apiKey) {
      return res.json({ translatedText: `[Mock Translation to ${target}]: ${text}` });
    }

    const response = await fetch('https://api-free.deepl.com/v2/translate', {
      method: 'POST',
      headers: {
        Authorization: `DeepL-Auth-Key ${apiKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        text,
        target_lang: target,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(502).json({ error: 'DeepL API error', details: `${response.status} ${errorText}` });
    }

    const data = await response.json();
    const translatedText = data?.translations?.[0]?.text;

    if (!translatedText) {
      return res.status(502).json({ error: 'No translation returned' });
    }

    return res.json({ translatedText });
  } catch (error) {
    return res.status(500).json({ error: 'Translation failed', details: error?.message || String(error) });
  }
}
