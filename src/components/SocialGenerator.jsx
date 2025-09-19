import React, { useState, useEffect } from 'react';
import { generateAIContent, getConfiguredProviders } from '../utils/aiProviders';

const examplePrompts = [
  {
    product: "Eco Water Bottles",
    audience: "Fitness Enthusiasts", 
    tone: "inspiring",
    platform: "Instagram",
    keywords: "hydration, eco-friendly, gym",
  },
  {
    product: "Freelance Coding Bootcamp",
    audience: "Aspiring Developers",
    tone: "professional", 
    platform: "LinkedIn",
    keywords: "remote jobs, skills, portfolio",
  },
  {
    product: "Luxury Skincare Line",
    audience: "Women 25-40",
    tone: "casual",
    platform: "Facebook", 
    keywords: "self-care, glow, beauty",
  },
  {
    product: "Comedy Podcast",
    audience: "Gen Z",
    tone: "funny",
    platform: "Twitter",
    keywords: "laugh, trending, satire",
  },
];

export default function SocialMediaGeneratorPage() {
  const [form, setForm] = useState({
    product: '',
    audience: '',
    tone: 'inspiring',
    platform: 'Instagram',
    keywords: ''
  });

  const [output, setOutput] = useState({ caption: '', tagline: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [usedProvider, setUsedProvider] = useState('');
  const [configuredProviders, setConfiguredProviders] = useState([]);

  useEffect(() => {
    // Check configured providers on mount
    const providers = getConfiguredProviders();
    setConfiguredProviders(providers);
    if (providers.length === 0) {
      setError('⚠️ No AI API keys configured. Please check your environment variables.');
    }
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (error && error.includes('Please fill')) {
      setError(''); // Clear validation errors when user starts typing
    }
  };

  const loadExample = (example) => {
    setForm(example);
    setError('');
  };

  const validateForm = () => {
    if (!form.product.trim()) {
      setError('Please enter a product or service name.');
      return false;
    }
    if (!form.audience.trim()) {
      setError('Please enter your target audience.');
      return false;
    }
    if (configuredProviders.length === 0) {
      setError('⚠️ No AI API keys configured. Please add API keys to your environment variables.');
      return false;
    }
    return true;
  };

  const generatePost = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setOutput({ caption: '', tagline: '' });
    setError('');
    setUsedProvider('');

    const prompt = `
Create a social media post with both a caption and tagline.

Details:
- Product/Service: ${form.product}
- Target Audience: ${form.audience}
- Tone: ${form.tone}
- Platform: ${form.platform}
- Keywords: ${form.keywords || 'None specified'}

Requirements:
- Caption: 2-3 sentences, engaging and ${form.tone}
- Tagline: Short, catchy phrase (5-8 words max)
- Optimize for ${form.platform}
- Include relevant emojis
- Make it actionable and compelling

Format your response exactly like this:
Caption: [Your caption here]
Tagline: [Your tagline here]
`;

    try {
      const result = await generateAIContent(prompt);
      
      if (result.success) {
        console.log(`✅ Post generated successfully using ${result.provider}`);
        setUsedProvider(result.provider);
        
        const text = result.content;
        const captionMatch = text.match(/Caption:\s*(.+?)(?=\n|Tagline:|$)/is);
        const taglineMatch = text.match(/Tagline:\s*(.+?)(?=\n|$)/is);

        setOutput({
          caption: captionMatch ? captionMatch[1].trim() : text.split('\n')[0]?.trim() || text.trim(),
          tagline: taglineMatch ? taglineMatch[1].trim() : text.split('\n')[1]?.trim() || 'Generated content'
        });
      } else {
        console.error('❌ All AI providers failed:', result.errors);
        setError(`❌ Generation failed: ${result.errors.join(', ')}`);
      }
    } catch (err) {
      console.error('🚨 Unexpected error:', err);
      setError('❌ Unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const clearOutput = () => {
    setOutput({ caption: '', tagline: '' });
    setError('');
    setUsedProvider('');
  };

  const copyToClipboard = async (text, type) => {
    if (!text) return;
    
    try {
      await navigator.clipboard.writeText(text);
      // Show success feedback
      const button = document.activeElement;
      const originalText = button.textContent;
      button.textContent = `✅ ${type} Copied!`;
      setTimeout(() => {
        button.textContent = originalText;
      }, 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      setError('Failed to copy to clipboard. Please try manually selecting the text.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-blue-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Header */}
        <div className="text-center mb-8 lg:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent mb-4">
            🚀 Social Media Post Generator
          </h1>
          <p className="text-gray-600 text-base sm:text-lg max-w-3xl mx-auto leading-relaxed">
            Create engaging social media posts and catchy taglines tailored to your audience and platform.
          </p>
          
          {/* Provider Status */}
          {configuredProviders.length > 0 ? (
            <div className="mt-4 inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
              ✅ {configuredProviders.length} AI provider{configuredProviders.length > 1 ? 's' : ''} ready
            </div>
          ) : (
            <div className="mt-4 inline-flex items-center px-3 py-1 rounded-full text-sm bg-red-100 text-red-800">
              ⚠️ No AI providers configured
            </div>
          )}
        </div>

        {/* Example Prompts */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-700 mb-4 text-center">💡 Try Example Campaigns:</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {examplePrompts.map((example, idx) => (
              <button
                key={idx}
                onClick={() => loadExample(example)}
                disabled={loading}
                className="p-4 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 text-left group disabled:opacity-50"
              >
                <div className="font-semibold text-teal-600 text-sm mb-1 group-hover:text-teal-700">
                  {example.product}
                </div>
                <div className="text-xs text-gray-500 mb-2">
                  {example.audience} • {example.platform}
                </div>
                <div className="text-xs text-gray-400">
                  {example.keywords}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="p-6 sm:p-8">
            <h3 className="text-xl font-bold text-gray-800 mb-6">📝 Campaign Details</h3>
            
            {/* Form */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Product/Service */}
              <div>
                <label htmlFor="product" className="block text-sm font-semibold text-gray-700 mb-2">
                  Product or Service Name *
                </label>
                <input
                  id="product"
                  name="product"
                  type="text"
                  placeholder="e.g. Eco-friendly water bottles"
                  value={form.product}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all duration-200 disabled:opacity-50"
                  maxLength={100}
                />
              </div>

              {/* Target Audience */}
              <div>
                <label htmlFor="audience" className="block text-sm font-semibold text-gray-700 mb-2">
                  Target Audience *
                </label>
                <input
                  id="audience"
                  name="audience"
                  type="text"
                  placeholder="e.g. Fitness enthusiasts aged 25-35"
                  value={form.audience}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all duration-200 disabled:opacity-50"
                  maxLength={100}
                />
              </div>

              {/* Tone */}
              <div>
                <label htmlFor="tone" className="block text-sm font-semibold text-gray-700 mb-2">
                  Tone & Style
                </label>
                <select
                  id="tone"
                  name="tone"
                  value={form.tone}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all duration-200 disabled:opacity-50 cursor-pointer"
                >
                  <option value="inspiring">✨ Inspiring</option>
                  <option value="funny">😄 Funny</option>
                  <option value="professional">💼 Professional</option>
                  <option value="casual">😊 Casual</option>
                  <option value="urgent">⚡ Urgent</option>
                  <option value="educational">📚 Educational</option>
                </select>
              </div>

              {/* Platform */}
              <div>
                <label htmlFor="platform" className="block text-sm font-semibold text-gray-700 mb-2">
                  Social Media Platform
                </label>
                <select
                  id="platform"
                  name="platform"
                  value={form.platform}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all duration-200 disabled:opacity-50 cursor-pointer"
                >
                  <option value="Instagram">📸 Instagram</option>
                  <option value="LinkedIn">💼 LinkedIn</option>
                  <option value="Twitter">🐦 Twitter</option>
                  <option value="Facebook">📘 Facebook</option>
                  <option value="TikTok">🎵 TikTok</option>
                  <option value="YouTube">🎥 YouTube</option>
                </select>
              </div>

              {/* Keywords */}
              <div className="lg:col-span-2">
                <label htmlFor="keywords" className="block text-sm font-semibold text-gray-700 mb-2">
                  Keywords & Hashtags (Optional)
                </label>
                <textarea
                  id="keywords"
                  name="keywords"
                  placeholder="e.g. sustainability, health, fitness, eco-friendly"
                  value={form.keywords}
                  onChange={handleChange}
                  disabled={loading}
                  rows={3}
                  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all duration-200 resize-none disabled:opacity-50"
                  maxLength={200}
                />
                <div className="text-sm text-gray-500 mt-1">
                  {form.keywords.length} / 200 characters
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <button
                onClick={generatePost}
                disabled={loading || !form.product.trim() || !form.audience.trim() || configuredProviders.length === 0}
                className={`flex-1 px-8 py-4 rounded-xl font-semibold text-white transition-all duration-200 ${
                  loading || !form.product.trim() || !form.audience.trim() || configuredProviders.length === 0
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating Post...
                  </span>
                ) : (
                  '🚀 Generate Post'
                )}
              </button>

              <button
                onClick={clearOutput}
                disabled={loading || (!output.caption && !output.tagline && !error)}
                className={`px-6 py-4 rounded-xl font-semibold border-2 transition-all duration-200 ${
                  loading || (!output.caption && !output.tagline && !error)
                    ? 'border-gray-300 text-gray-400 cursor-not-allowed'
                    : 'border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50'
                }`}
              >
                🗑️ Clear
              </button>
            </div>

            {/* Error Display */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 rounded-lg">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Success - Used Provider */}
            {usedProvider && (
              <div className="mb-6 text-center">
                <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  ✅ Generated using {usedProvider}
                </span>
              </div>
            )}

            {/* Generated Output */}
            {(output.caption || output.tagline) && (
              <div className="space-y-6">
                {output.caption && (
                  <div className="bg-gradient-to-r from-teal-50 to-blue-50 border-2 border-teal-200 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-teal-800 flex items-center">
                        ✨ Caption
                      </h3>
                      <button
                        onClick={() => copyToClipboard(output.caption, 'Caption')}
                        className="px-4 py-2 bg-teal-500 text-white rounded-lg text-sm font-medium hover:bg-teal-600 transition-all duration-200"
                      >
                        📋 Copy Caption
                      </button>
                    </div>
                    <p className="text-gray-800 leading-relaxed whitespace-pre-wrap text-lg">
                      {output.caption}
                    </p>
                    <div className="mt-3 text-sm text-teal-600">
                      {output.caption.length} characters
                    </div>
                  </div>
                )}

                {output.tagline && (
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-purple-800 flex items-center">
                        🎯 Tagline
                      </h3>
                      <button
                        onClick={() => copyToClipboard(output.tagline, 'Tagline')}
                        className="px-4 py-2 bg-purple-500 text-white rounded-lg text-sm font-medium hover:bg-purple-600 transition-all duration-200"
                      >
                        📋 Copy Tagline
                      </button>
                    </div>
                    <p className="text-gray-800 leading-relaxed whitespace-pre-wrap text-lg font-medium italic">
                      "{output.tagline}"
                    </p>
                    <div className="mt-3 text-sm text-purple-600">
                      {output.tagline.length} characters
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-sm text-gray-500">
          <p>
            Powered by Multiple AI Providers (Gemini, Cohere, OpenAI) | 
            <a href="https://codesthetic.com" target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:text-teal-700 underline ml-1">
              Developed by Codesthetic
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}