import React, { useState, useEffect } from 'react';
import { generateAIContent, getConfiguredProviders } from '../utils/aiProviders';

const examplePrompts = [
  "Painter from Goa, works with acrylics",
  "Sculptor specializing in recycled materials",
  "Digital artist focusing on surreal landscapes",
  "Photographer capturing urban street life",
  "Mixed media artist exploring identity and culture"
];

export default function ArtistBioGenerator() {
  const [prompt, setPrompt] = useState('');
  const [bio, setBio] = useState('');
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

  const generateBio = async () => {
    if (!prompt.trim()) {
      setError('Please enter an artist description.');
      return;
    }

    if (configuredProviders.length === 0) {
      setError('⚠️ No AI API keys configured. Please add API keys to your environment variables.');
      return;
    }

    setLoading(true);
    setBio('');
    setError('');
    setUsedProvider('');

    const formattedPrompt = `
Write a creative and professional artist bio for: "${prompt}"

Requirements:
- Use third person point of view
- 2-3 sentences maximum
- Include artistic style and medium
- Make it engaging and professional
- Add relevant emojis
- Keep it concise but impactful
`;

    try {
      const result = await generateAIContent(formattedPrompt);
      
      if (result.success) {
        console.log(`✅ Bio generated successfully using ${result.provider}`);
        setUsedProvider(result.provider);
        setBio(result.content.trim());
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
    setBio('');
    setError('');
    setUsedProvider('');
  };

  const copyToClipboard = async () => {
    if (!bio) return;
    
    try {
      await navigator.clipboard.writeText(bio);
      // Show success feedback
      const originalText = 'Copy Bio';
      const button = event.target;
      button.textContent = '✅ Copied!';
      setTimeout(() => {
        button.textContent = originalText;
      }, 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      setError('Failed to copy to clipboard. Please try manually selecting the text.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Header */}
        <div className="text-center mb-8 lg:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            🎨 Artist Bio Generator
          </h1>
          <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Create compelling professional bios for artists. Perfect for portfolios, exhibitions, and social media.
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="p-6 sm:p-8">
            {/* Input Section */}
            <div className="mb-6">
              <label htmlFor="prompt" className="block text-lg font-semibold text-gray-800 mb-3">
                Describe the Artist:
              </label>
              <textarea
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., Contemporary painter from Mumbai specializing in abstract expressionism..."
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all duration-200 resize-none text-gray-800 placeholder-gray-400"
                rows={4}
                maxLength={300}
                disabled={loading}
              />
              <div className="flex justify-between items-center mt-2 text-sm text-gray-500">
                <span>{prompt.length} / 300 characters</span>
                {prompt.length > 250 && (
                  <span className="text-orange-500">⚠️ Consider shortening for better results</span>
                )}
              </div>
            </div>

            {/* Example Prompts */}
            <div className="mb-6">
              <h3 className="text-base font-semibold text-gray-700 mb-3">💡 Quick Examples:</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {examplePrompts.map((example, idx) => (
                  <button
                    key={idx}
                    onClick={() => setPrompt(example)}
                    disabled={loading}
                    className={`p-3 text-left text-sm rounded-lg border transition-all duration-200 ${
                      prompt === example
                        ? 'bg-purple-500 text-white border-purple-500 shadow-md'
                        : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-purple-50 hover:border-purple-300 disabled:opacity-50'
                    }`}
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <button
                onClick={generateBio}
                disabled={loading || !prompt.trim() || configuredProviders.length === 0}
                className={`flex-1 px-6 py-3 rounded-xl font-semibold text-white transition-all duration-200 ${
                  loading || !prompt.trim() || configuredProviders.length === 0
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating...
                  </span>
                ) : (
                  '✨ Generate Bio'
                )}
              </button>
              
              <button
                onClick={clearOutput}
                disabled={loading || (!bio && !error)}
                className={`px-6 py-3 rounded-xl font-semibold border-2 transition-all duration-200 ${
                  loading || (!bio && !error)
                    ? 'border-gray-300 text-gray-400 cursor-not-allowed'
                    : 'border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50'
                }`}
              >
                🗑️ Clear
              </button>
              
              {bio && (
                <button
                  onClick={copyToClipboard}
                  className="px-6 py-3 rounded-xl font-semibold border-2 border-green-300 text-green-700 hover:border-green-400 hover:bg-green-50 transition-all duration-200"
                >
                  📋 Copy Bio
                </button>
              )}
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

            {/* Generated Bio Output */}
            {bio && (
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-purple-800">📝 Generated Artist Bio</h3>
                  <div className="text-sm text-purple-600">
                    {bio.length} characters
                  </div>
                </div>
                
                <div className="prose prose-lg max-w-none">
                  <p className="text-gray-800 leading-relaxed whitespace-pre-wrap font-medium">
                    {bio}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-sm text-gray-500">
          <p>
            <a href="https://codesthetic.com" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:text-purple-700 underline">
              Developed by Codesthetic
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}