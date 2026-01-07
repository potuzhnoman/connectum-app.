import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fetch from 'node-fetch'; // Make sure this is installed or use global fetch if Node 18+

dotenv.config();

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const DEEPL_API_KEY = process.env.VITE_DEEPL_API_KEY;

// Real DeepL API integration
app.post('/api/translate', async (req, res) => {
  const { text, targetLang } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'Text is required' });
  }

  if (!DEEPL_API_KEY) {
    console.warn('DeepL API key missing, falling back to mock');
    return res.json({ translatedText: `[Mock Translation to ${targetLang}]: ${text}` });
  }

  try {
    console.log(`Translating: "${text.substring(0, 30)}..." to ${targetLang}`);

    const response = await fetch('https://api-free.deepl.com/v2/translate', {
      method: 'POST',
      headers: {
        'Authorization': `DeepL-Auth-Key ${DEEPL_API_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        text,
        target_lang: targetLang,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`DeepL API error: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    const translatedText = data.translations[0].text;

    res.json({ translatedText });
  } catch (error) {
    console.error('Translation error:', error);
    res.status(500).json({ error: 'Translation failed', details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Translation API server running on http://localhost:${PORT}`);
});
