const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;
const API_KEY = process.env.OPENAI_API_KEY;

app.use(cors());
app.use(express.json());

// Route 1: Artist Bio Generator
app.post('/api/generate-artist-bio', async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
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
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: formattedPrompt }],
        temperature: 0.8,
        max_tokens: 200,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${API_KEY}`,
        },
      }
    );

    const bio = response.data.choices[0].message.content.trim();
    return res.json({ bio });
  } catch (error) {
    console.error('Artist Bio Error:', error.message);
    return res.status(500).json({ error: 'Failed to generate artist bio' });
  }
});

// Route 2: Social Media Post Generator
app.post('/api/generate-social-post', async (req, res) => {
  const { product, audience, tone, platform, keywords } = req.body;

  if (!product || !audience || !tone || !platform) {
    return res.status(400).json({ error: 'Missing required fields' });
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
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.8,
        max_tokens: 200,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${API_KEY}`,
        },
      }
    );

    const text = response.data.choices[0].message.content;

    const captionMatch = text.match(/Caption:\s*(.+)/i);
    const taglineMatch = text.match(/Tagline:\s*(.+)/i);

    return res.json({
      caption: captionMatch ? captionMatch[1].trim() : '',
      tagline: taglineMatch ? taglineMatch[1].trim() : '',
    });
  } catch (error) {
    console.error('Social Post Error:', error.message);
    return res.status(500).json({ error: 'Failed to generate social media post' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
