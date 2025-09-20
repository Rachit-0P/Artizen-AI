export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { product, audience, tone, platform, keywords } = req.body;

  if (!product || !audience || !tone || !platform) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const API_KEY = process.env.OPENAI_API_KEY;

  if (!API_KEY) {
    return res.status(500).json({ error: 'OpenAI API key not configured' });
  }

  const prompt = `
Generate a social media post and a catchy tagline.

Details:
- Product: ${product}
- Audience: ${audience}
- Tone: ${tone}
- Platform: ${platform}
- Keywords: ${keywords || 'N/A'}

Respond in this format:
Caption: <caption>
Tagline: <tagline>
`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.8,
        max_tokens: 200,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const text = data.choices[0].message.content;

    const captionMatch = text.match(/Caption:\s*(.+)/i);
    const taglineMatch = text.match(/Tagline:\s*(.+)/i);

    return res.status(200).json({
      caption: captionMatch ? captionMatch[1].trim() : '',
      tagline: taglineMatch ? taglineMatch[1].trim() : '',
    });
  } catch (error) {
    console.error('Social Post Error:', error.message);
    return res.status(500).json({ error: 'Failed to generate social media post' });
  }
}