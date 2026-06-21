import { env } from '../config/env.js';

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

// Proxies meal-plan generation to OpenRouter so the key stays server-side
// and the browser is not blocked by CORS. OpenRouter is OpenAI-compatible.
export async function generatePlan(req, res, next) {
  try {
    const { prompt } = req.body || {};

    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ message: 'A "prompt" string is required.' });
    }

    if (!env.openRouterApiKey) {
      return res.status(500).json({
        message: 'Server is missing OPENROUTER_API_KEY. Add it to backend/.env and restart.',
      });
    }

    const upstream = await fetch(OPENROUTER_URL, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${env.openRouterApiKey}`,
        // Optional OpenRouter attribution headers
        'HTTP-Referer': 'https://on-my-plate.vercel.app/ || http://localhost:5173/',
        'X-Title': 'On My Plate',
      },
      body: JSON.stringify({
        model: env.llmModel,
        max_tokens: 4000,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    const data = await upstream.json();

    if (!upstream.ok) {
      const detail = data?.error?.message || 'Upstream API error';
      return res.status(upstream.status).json({ message: detail });
    }

    const text = data?.choices?.[0]?.message?.content || '';
    res.json({ text });
  } catch (err) {
    next(err);
  }
}
