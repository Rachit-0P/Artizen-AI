// Powered by Google Gemini AI
// Dual Gemini API System with Backup Key for Reliability

const API_PROVIDERS = [
  {
    name: 'Gemini',
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
    name: 'Gemini (Backup)',
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
  }
];

// Main function to generate content with Gemini AI
export const generateAIContent = async (prompt) => {
  const errors = [];
  
  // Try each Gemini provider in order
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