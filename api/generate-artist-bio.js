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

  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  const API_KEY = process.env.OPENAI_API_KEY;

  if (!API_KEY) {
    return res.status(500).json({ error: 'OpenAI API key not configured' });
  }

  const formattedPrompt = `
Write a short professional artist bio for the given prompt. 
Prompt: ${prompt}

Each line shouldn't exceed 10 words.
Use third person point of view. Structure the bio in concise bullet points, 
each separated by creative and relevant hashtags. 
Highlight the artist's style 🖌️, preferred mediums 🎨, key themes 💭, 
and impact or recognition 🌍. Keep the tone imaginative, fresh, engaging ✨ and funny. 
Use expressive and artistic hashtags.
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
        messages: [{ role: 'user', content: formattedPrompt }],
        temperature: 0.8,
        max_tokens: 200,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const bio = data.choices[0].message.content.trim();
    
    return res.status(200).json({ bio });
  } catch (error) {
    console.error('Artist Bio Error:', error.message);
    return res.status(500).json({ error: 'Failed to generate artist bio' });
  }
}