import React, { useState } from 'react';
import axios from 'axios';

const examplePrompts = [
  "Painter from Goa, works with acrylics",
  "Sculptor specializing in recycled materials",
  "Digital artist focusing on surreal landscapes",
  "Photographer capturing urban street life",
  "Mixed media artist exploring identity and culture"
];

export default function ArtistBioGenerator() {
  const [prompt, setPrompt] = useState(examplePrompts[0]);
  const [bio, setBio] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showRaw, setShowRaw] = useState(false);
  const [rawResponse, setRawResponse] = useState(null);

  const generateBio = async () => {
    setLoading(true);
    setBio('');
    setError('');
    setRawResponse(null);

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
      const res = await axios.post('/api/generate-artist-bio', { prompt });

      // Your backend returns { bio: '...' }, so just use that
      setBio(res.data.bio);
      setRawResponse(res.data); // Optional: keep if you want to show the raw JSON

    } catch (err) {
      console.error(err);
      setError('Failed to generate artist bio. Please try again.');
    } finally {
      setLoading(false);
    }

  };

  const clearBio = () => {
    setBio('');
    setError('');
    setRawResponse(null);
  };

  const copyToClipboard = () => {
    if (bio) {
      navigator.clipboard.writeText(bio);
      alert('Bio copied to clipboard!');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 font-sans">
      <h1 className="text-4xl font-bold text-teal-600 mb-6 text-center">🎨 Artist Bio Generator</h1>

      <p className="mb-8 text-center text-gray-700 text-lg max-w-2xl mx-auto">
        Generate a witty, artistic, and professional bio for any kind of artist. Great for social media, portfolios, and exhibitions!
      </p>

      <div className="mb-6">
        <label htmlFor="prompt" className="block text-gray-700 font-semibold text-lg mb-2">
          Enter a short artist description:
        </label>
        <textarea
          id="prompt"
          rows={3}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g. Painter from Goa, works with acrylics"
          className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-300 resize-y"
          aria-label="Artist description input"
          maxLength={200}
        />
        <div className="text-sm text-gray-500 mt-1">Character count: {prompt.length} / 200</div>
      </div>

      <div className="mb-6">
        <h3 className="font-semibold text-gray-700 mb-2">Or try an example:</h3>
        <div className="flex flex-wrap gap-3">
          {examplePrompts.map((ex, i) => (
            <button
              key={i}
              onClick={() => setPrompt(ex)}
              className={`px-4 py-2 rounded-full border transition ${
                prompt === ex
                  ? 'bg-teal-500 text-white border-teal-500'
                  : 'bg-white text-teal-600 border-teal-300 hover:bg-teal-50'
              }`}
            >
              {ex}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-4 mt-4">
        <button
          onClick={generateBio}
          disabled={loading || !prompt.trim()}
          className={`px-6 py-3 text-white font-semibold rounded-lg bg-teal-500 transition ${
            loading || !prompt.trim() ? 'opacity-60 cursor-not-allowed' : 'hover:bg-teal-600'
          }`}
          aria-label="Generate artist bio"
        >
          {loading ? 'Generating...' : 'Generate Bio'}
        </button>

        <button
          onClick={clearBio}
          disabled={loading || (!bio && !error)}
          className={`px-6 py-3 font-semibold rounded-lg border border-teal-500 text-teal-500 transition ${
            loading ? 'opacity-60 cursor-not-allowed' : 'hover:bg-teal-50'
          }`}
          aria-label="Clear bio and errors"
        >
          Clear
        </button>

        <button
          onClick={copyToClipboard}
          disabled={!bio}
          className={`px-6 py-3 font-semibold rounded-lg border border-teal-500 text-teal-500 transition ${
            !bio ? 'opacity-60 cursor-not-allowed' : 'hover:bg-teal-50'
          }`}
          aria-label="Copy generated bio to clipboard"
        >
          Copy Bio
        </button>

      </div>

      {error && (
        <div className="mt-6 text-red-600 font-semibold" role="alert">
          {error}
        </div>
      )}

      {bio && (
        <div className="mt-10 bg-white border border-gray-200 rounded-lg p-6 shadow-md">
          <h3 className="text-teal-600 font-bold text-xl mb-3">📝 Generated Bio:</h3>
          <p className="text-gray-800 whitespace-pre-line leading-relaxed">{bio}</p>
        </div>
      )}

      <footer className="mt-12 text-center text-gray-500 text-sm">
        Powered by OpenAI API | Developed by <a href="https://codesthetic.com" target="_blank" className="underline hover:text-gray-700">Codesthetic</a>
      </footer>
    </div>
  );
}
