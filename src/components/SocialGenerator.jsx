import React, { useState } from 'react'
import axios from 'axios'

export default function SocialMediaGeneratorPage() {
  const [form, setForm] = useState({
    product: 'Nature Explorer',
    audience: 'Kids',
    tone: 'inspiring',
    platform: 'Instagram',
    keywords: ''
  });

  const [output, setOutput] = useState({ caption: '', tagline: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const generatePost = async () => {
    setLoading(true);
    setOutput({ caption: '', tagline: '' });
    setError('');

    const prompt = `
Generate a social media post and a catchy tagline.

Details:
- Product: ${form.product}
- Audience: ${form.audience}
- Tone: ${form.tone}
- Platform: ${form.platform}
- Keywords: ${form.keywords}

Respond in this format:
Caption: <caption>
Tagline: <tagline>
    `;

    try {
      const res = await axios.post('/api/generate-social-post', form);

      setOutput({
        caption: res.data.caption,
        tagline: res.data.tagline,
      });

    } catch (err) {
      console.error(err);
      setError('Error generating content. Please try again.');
    } finally {
      setLoading(false);
    }

  };

  const clearOutput = () => {
    setOutput({ caption: '', tagline: '' });
    setError('');
  };

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

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-teal-600 text-center">
        🚀 Social Media Post Generator
      </h2>

      {/* Example Prompts */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">🎯 Try Example Prompts:</h3>
        <div className="flex flex-wrap gap-3">
          {examplePrompts.map((example, idx) => (
            <button
              key={idx}
              onClick={() => {
                setForm(example);
              }}
              className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-teal-100 transition text-sm"
            >
              {example.product}
            </button>
          ))}
        </div>
      </div>

      {/* Form Section */}
      <form
        onSubmit={e => {
          e.preventDefault();
          if (!loading) generatePost();
        }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
      >
        <h3 className="md:col-span-2 text-lg font-semibold text-gray-700 mb-2">
          📝 Fill in your campaign details:
        </h3>

        {/* Product */}
        <div className="flex flex-col">
          <label htmlFor="product" className="font-semibold mb-1 text-gray-700">
            Product or Service Name
          </label>
          <input
            id="product"
            name="product"
            placeholder="e.g. Nature Explorer"
            value={form.product}
            onChange={handleChange}
            required
            className="p-3 rounded-lg border border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-300 outline-none transition"
          />
        </div>

        {/* Audience */}
        <div className="flex flex-col">
          <label htmlFor="audience" className="font-semibold mb-1 text-gray-700">
            Target Audience
          </label>
          <input
            id="audience"
            name="audience"
            placeholder="e.g. Kids, Travelers"
            value={form.audience}
            onChange={handleChange}
            required
            className="p-3 rounded-lg border border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-300 outline-none transition"
          />
        </div>

        {/* Tone */}
        <div className="flex flex-col">
          <label htmlFor="tone" className="font-semibold mb-1 text-gray-700">
            Tone
          </label>
          <select
            id="tone"
            name="tone"
            value={form.tone}
            onChange={handleChange}
            className="p-3 rounded-lg border border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-300 outline-none cursor-pointer transition bg-white"
          >
            <option value="inspiring">Inspiring</option>
            <option value="funny">Funny</option>
            <option value="professional">Professional</option>
            <option value="casual">Casual</option>
          </select>
        </div>

        {/* Platform */}
        <div className="flex flex-col">
          <label htmlFor="platform" className="font-semibold mb-1 text-gray-700">
            Platform
          </label>
          <select
            id="platform"
            name="platform"
            value={form.platform}
            onChange={handleChange}
            className="p-3 rounded-lg border border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-300 outline-none cursor-pointer transition bg-white"
          >
            <option value="Instagram">Instagram</option>
            <option value="LinkedIn">LinkedIn</option>
            <option value="Twitter">Twitter</option>
            <option value="Facebook">Facebook</option>
          </select>
        </div>

        {/* Keywords */}
        <div className="md:col-span-2 flex flex-col">
          <label htmlFor="keywords" className="font-semibold mb-1 text-gray-700">
            Optional Keywords (comma separated)
          </label>
          <textarea
            id="keywords"
            name="keywords"
            placeholder="e.g. nature, adventure, explore"
            value={form.keywords}
            onChange={handleChange}
            rows={3}
            className="p-3 rounded-lg border border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-300 outline-none resize-vertical transition"
          />
        </div>
      </form>

      {/* Action Buttons */}
      <div className="flex flex-col md:flex-row gap-4 justify-center mb-8">
        <button
          onClick={generatePost}
          disabled={loading}
          className={`flex-1 max-w-xs px-6 py-3 text-lg font-bold rounded-xl text-white bg-teal-500 shadow-md transition 
            ${loading ? 'cursor-not-allowed opacity-70' : 'hover:bg-teal-600 hover:shadow-lg'}`}
        >
          {loading ? (
            <svg
              className="animate-spin mr-2 h-6 w-6 text-white inline-block"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="#fff"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray="31.4 31.4"
              />
            </svg>
          ) : null}
          {loading ? 'Generating...' : 'Generate Post'}
        </button>

        <button
          onClick={clearOutput}
          disabled={loading || (!output.caption && !output.tagline && !error)}
          className={`flex-1 max-w-xs px-6 py-3 text-lg font-bold rounded-xl border-2 border-teal-500 text-teal-500 bg-transparent transition
            ${loading ? 'cursor-not-allowed opacity-70' : 'hover:bg-teal-500 hover:text-white'}`}
        >
          Clear
        </button>
      </div>

      {/* Output */}
      {error && (
        <p className="text-red-600 font-semibold text-center mb-6">{error}</p>
      )}

      {(output.caption || output.tagline) && (
        <section className="bg-white border border-teal-200 rounded-xl p-6 shadow-md max-w-3xl mx-auto text-gray-900 leading-relaxed text-lg space-y-6">
          {output.caption && (
            <div>
              <h3 className="text-teal-600 font-bold text-xl mb-1">✨ Caption</h3>
              <p className="whitespace-pre-wrap">{output.caption}</p>
              <button
                onClick={() => navigator.clipboard.writeText(output.caption)}
                className="mt-3 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-teal-500 text-white rounded-md shadow-sm hover:bg-teal-600 transition"
              >
                📋 Copy Caption
              </button>

            </div>
          )}
          {output.tagline && (
            <div>
              <h3 className="text-teal-600 font-bold text-xl mb-1">🎯 Tagline</h3>
              <p className="italic text-gray-600 whitespace-pre-wrap">{output.tagline}</p>
              <button
                onClick={() => navigator.clipboard.writeText(output.tagline)}
                className="mt-3 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-teal-500 text-white rounded-md shadow-sm hover:bg-teal-600 transition"
              >
                📋 Copy Tagline
              </button>
            </div>
          )}
        </section>
      )}

      <footer className="mt-12 text-center text-gray-500 text-sm">
        Powered by OpenAI API | Developed by Codesthetic
      </footer>
    </div>
  );
}
