// Multi-Provider AI API System with Automatic Fallback
// If one provider fails, automatically tries the next one

const API_PROVIDERS = [
  {
    name: 'Google Gemini',
    apiKey: import.meta.env.VITE_GOOGLE_AI_API_KEY,
    endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent',
    callAPI: async (prompt, apiKey) => {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }],
          generationConfig: {
            temperature: 0.8,
            maxOutputTokens: 200,
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`);
      }

      const data = await response.json();
      return data.candidates[0]?.content?.parts[0]?.text || 'No response generated';
    }
  },
  {
    name: 'Google Gemini (Backup)',
    apiKey: import.meta.env.VITE_GOOGLE_AI_API_KEY_BACKUP,
    endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent',
    callAPI: async (prompt, apiKey) => {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }],
          generationConfig: {
            temperature: 0.8,
            maxOutputTokens: 200,
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Gemini Backup API error: ${response.status}`);
      }

      const data = await response.json();
      return data.candidates[0]?.content?.parts[0]?.text || 'No response generated';
    }
  },
  {
    name: 'Cohere',
    apiKey: import.meta.env.VITE_COHERE_API_KEY,
    endpoint: 'https://api.cohere.ai/v1/generate',
    callAPI: async (prompt, apiKey) => {
      const response = await fetch('https://api.cohere.ai/v1/generate', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'command',
          prompt: prompt,
          max_tokens: 200,
          temperature: 0.8,
          stop_sequences: [],
        }),
      });

      if (!response.ok) {
        throw new Error(`Cohere API error: ${response.status}`);
      }

      const data = await response.json();
      return data.generations[0]?.text?.trim() || 'No response generated';
    }
  },
  {
    name: 'OpenAI',
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    endpoint: 'https://api.openai.com/v1/chat/completions',
    callAPI: async (prompt, apiKey) => {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
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
      return data.choices[0]?.message?.content || 'No response generated';
    }
  }
];

// Main function to generate content with automatic fallback
export const generateAIContent = async (prompt) => {
  const errors = [];
  
  // Try each provider in order
  for (const provider of API_PROVIDERS) {
    // Skip if no API key is configured
    if (!provider.apiKey || provider.apiKey === 'your-api-key-here') {
      console.log(`⏭️ Skipping ${provider.name} - No API key configured`);
      continue;
    }

    try {
      console.log(`🔄 Trying ${provider.name}...`);
      const result = await provider.callAPI(prompt, provider.apiKey);
      console.log(`✅ Success with ${provider.name}`);
      return {
        success: true,
        content: result,
        provider: provider.name
      };
    } catch (error) {
      console.log(`❌ ${provider.name} failed:`, error.message);
      errors.push(`${provider.name}: ${error.message}`);
      continue;
    }
  }

  // If all providers failed
  return {
    success: false,
    content: null,
    provider: null,
    errors: errors
  };
};

// Helper function to check which providers are configured
export const getConfiguredProviders = () => {
  return API_PROVIDERS.filter(provider => 
    provider.apiKey && provider.apiKey !== 'your-api-key-here'
  ).map(provider => provider.name);
};

export { API_PROVIDERS };