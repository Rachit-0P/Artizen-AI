import React, { useState, useRef, useEffect } from 'react';

const DEMO_IMAGE = '/demo.jpeg';

const EXAMPLES = [
  {
    title: '🎨 Art Expo Extravaganza',
    subtitle: 'Featuring: Bold & Emerging Artists #ArtLovers #CreativeVibes',
    bg: '#0ea5a4',
    category: 'Art'
  },
  {
    title: '🎶 Summer Music Fest 2025',
    subtitle: 'Live Bands, DJs & Good Vibes Only! #FestivalSeason #MusicMagic',
    bg: '#f97316',
    category: 'Music'
  },
  {
    title: '🚀 Tech Conference 2024',
    subtitle: 'Innovate, Inspire, Impact 💡 #FutureTech #InnovatorsUnite',
    bg: '#2563eb',
    category: 'Tech'
  },
  {
    title: '🧘‍♀️ Yoga & Wellness Retreat',
    subtitle: 'Find Your Inner Peace & Balance 🌿 #MindBodySoul #ZenLife',
    bg: '#10b981',
    category: 'Wellness'
  },
  {
    title: '📚 Book Fair Bonanza',
    subtitle: 'Discover New Worlds & Stories 📖 #BookWorm #ReadMore',
    bg: '#8b5cf6',
    category: 'Education'
  },
  {
    title: '🌟 Cosmic Film Festival',
    subtitle: 'Explore the Universe Through Cinema 🎬 #SpaceMovies #FilmLovers',
    bg: '#7c3aed',
    category: 'Entertainment'
  },
  {
    title: '🍔 Gourmet Food Truck Rally',
    subtitle: 'Taste the Best Street Eats in Town! 🚚 #FoodieHeaven #StreetEats',
    bg: '#ef4444',
    category: 'Food'
  },
  {
    title: '🌸 Spring Garden Gala',
    subtitle: 'Celebrate Nature\'s Beauty 🌷 #BloomBright #GardenParty',
    bg: '#22c55e',
    category: 'Nature'
  },
];

const COLOR_PRESETS = [
  { name: 'Ocean Blue', value: '#0ea5a4' },
  { name: 'Sunset Orange', value: '#f97316' },
  { name: 'Royal Blue', value: '#2563eb' },
  { name: 'Forest Green', value: '#10b981' },
  { name: 'Purple Magic', value: '#8b5cf6' },
  { name: 'Deep Purple', value: '#7c3aed' },
  { name: 'Crimson Red', value: '#ef4444' },
  { name: 'Spring Green', value: '#22c55e' },
  { name: 'Midnight Black', value: '#1f2937' },
  { name: 'Rose Gold', value: '#f59e0b' }
];

export default function PosterPage() {
  const [title, setTitle] = useState(EXAMPLES[0].title);
  const [subtitle, setSubtitle] = useState(EXAMPLES[0].subtitle);
  const [bg, setBg] = useState(EXAMPLES[0].bg);
  const [photo, setPhoto] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const imgRef = useRef();
  const fileInputRef = useRef();

  function escapeXmlSafe(input) {
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
  }

  function generate() {
    if (!title.trim()) {
      setError('Please enter a title for your poster');
      return;
    }

    setIsGenerating(true);
    setError('');

    try {
      const imageSrc = photo || DEMO_IMAGE;

      const wrapText = (text, maxCharsPerLine) => {
        const words = text.split(' ');
        const lines = [];
        let currentLine = '';

        for (const word of words) {
          if ((currentLine + ' ' + word).trim().length <= maxCharsPerLine) {
            currentLine += ' ' + word;
          } else {
            lines.push(currentLine.trim());
            currentLine = word;
          }
        }
        if (currentLine.trim()) lines.push(currentLine.trim());
        return lines;
      };

      const titleLines = wrapText(title, 18);
      const subtitleLines = wrapText(subtitle, 30);

      const TITLE_LINE_HEIGHT = 76;
      const SUBTITLE_LINE_HEIGHT = 44;

      const titleTspans = titleLines
        .map((line, i) => `<tspan x="400" dy="${i === 0 ? 0 : TITLE_LINE_HEIGHT}">${escapeXmlSafe(line)}</tspan>`)
        .join('\n');

      const subtitleTspans = subtitleLines
        .map((line, i) => `<tspan x="400" dy="${i === 0 ? 0 : SUBTITLE_LINE_HEIGHT}">${escapeXmlSafe(line)}</tspan>`)
        .join('\n');

      const titleStartY = 160;
      const subtitleStartY = titleStartY + titleLines.length * TITLE_LINE_HEIGHT;
      const imageStartY = subtitleStartY + subtitleLines.length * SUBTITLE_LINE_HEIGHT + 40;
      const footerPadding = 60;
      const imageHeight = 560;
      const footerY = imageStartY + imageHeight + footerPadding;
      const svgHeight = footerY + 80;

      const photoSvg = `
        <rect x="120" y="${imageStartY}" width="560" height="${imageHeight}" fill="white"/>
        <rect x="128" y="${imageStartY + 8}" width="544" height="${imageHeight - 16}" fill="black"/>
        <image href="${imageSrc}" x="136" y="${imageStartY + 16}" width="528" height="${imageHeight - 32}" preserveAspectRatio="xMidYMid slice" />
      `;

      const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='800' height='${svgHeight}'>
        <style>
          .title {
            font-family: 'Poppins', 'Inter', sans-serif;
            font-size: 72px;
            font-weight: 700;
            fill: white;
          }
          .subtitle {
            font-family: 'Poppins', 'Inter', sans-serif;
            font-size: 36px;
            font-weight: 500;
            fill: white;
          }
          .footer {
            font-family: 'Poppins', 'Inter', sans-serif;
            font-size: 28px;
            fill: white;
          }
        </style>
        <rect width='100%' height='100%' fill='#f8fafc'/>
        <rect x='40' y='40' width='720' height='${svgHeight - 80}' rx='24' fill='${bg}'/>

        <text x='400' y='${titleStartY}' text-anchor='middle' class='title'>${titleTspans}</text>
        <text x='400' y='${subtitleStartY}' text-anchor='middle' class='subtitle'>${subtitleTspans}</text>
        ${photoSvg}
        <text x='400' y='${footerY}' text-anchor='middle' class='footer'>Visit the show — Sat 7pm</text>
      </svg>`;

      const url = 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
      if (imgRef.current) {
        imgRef.current.src = url;
        setSuccess('Poster generated successfully!');
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      setError('Failed to generate poster. Please try again.');
      console.error('Poster generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  }

  function downloadSVG() {
    try {
      const a = document.createElement('a');
      a.href = imgRef.current.src;
      a.download = `poster-${Date.now()}.svg`;
      a.click();
      setSuccess('SVG downloaded successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to download SVG file');
      console.error('SVG download error:', err);
    }
  }

  function downloadPNG() {
    try {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width * 2; // Higher resolution
        canvas.height = img.height * 2;
        const ctx = canvas.getContext('2d');
        ctx.scale(2, 2);
        ctx.drawImage(img, 0, 0);
        const url = canvas.toDataURL('image/png');
        const a = document.createElement('a');
        a.href = url;
        a.download = `poster-${Date.now()}.png`;
        a.click();
        setSuccess('PNG downloaded successfully!');
        setTimeout(() => setSuccess(''), 3000);
      };
      img.onerror = () => {
        setError('Failed to download PNG file');
      };
      img.crossOrigin = 'anonymous';
      img.src = imgRef.current.src;
    } catch (err) {
      setError('Failed to download PNG file');
      console.error('PNG download error:', err);
    }
  }

  function handlePhotoUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('Image file size must be less than 10MB');
      return;
    }

    setError('');
    const reader = new FileReader();
    reader.onload = () => {
      setPhoto(reader.result);
      setTimeout(() => generate(), 100);
    };
    reader.onerror = () => {
      setError('Failed to read image file');
    };
    reader.readAsDataURL(file);
  }

  function applyExample(index) {
    const example = EXAMPLES[index];
    setTitle(example.title);
    setSubtitle(example.subtitle);
    setBg(example.bg);
    setPhoto(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setTimeout(() => generate(), 100);
  }

  function resetPoster() {
    setTitle('');
    setSubtitle('');
    setBg('#0ea5a4');
    setPhoto(null);
    setError('');
    setSuccess('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }

  useEffect(() => {
    generate();
  }, [title, subtitle, bg]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 bg-clip-text text-transparent mb-4">
            🎨 Poster Designer
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Create stunning promotional posters with customizable text, colors, and images
          </p>
        </div>

        {/* Status Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-center">
            ⚠️ {error}
          </div>
        )}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-center">
            ✅ {success}
          </div>
        )}

        {/* Example Templates */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">🚀 Quick Start Templates</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {EXAMPLES.map((example, index) => (
              <button
                key={index}
                onClick={() => applyExample(index)}
                className="p-4 text-left bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 border border-gray-100 hover:border-gray-200 group"
                style={{ borderLeftColor: example.bg, borderLeftWidth: '4px' }}
              >
                <div className="font-semibold text-gray-800 text-sm mb-1 group-hover:text-gray-900">
                  {example.title}
                </div>
                <div className="text-xs text-gray-500 mb-2">{example.category}</div>
                <div className="text-xs text-gray-600 line-clamp-2">
                  {example.subtitle}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Controls Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-xl font-bold text-gray-800 mb-6">🎛️ Customize Your Poster</h3>
              
              <div className="space-y-6">
                {/* Title Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Poster Title *
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter your event title..."
                    maxLength={100}
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    {title.length}/100 characters
                  </div>
                </div>

                {/* Subtitle Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subtitle
                  </label>
                  <textarea
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    placeholder="Add a description or hashtags..."
                    rows={3}
                    maxLength={200}
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    {subtitle.length}/200 characters
                  </div>
                </div>

                {/* Color Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Background Color
                  </label>
                  <div className="flex items-center gap-3 mb-3">
                    <input
                      type="color"
                      className="w-12 h-12 rounded-lg border-2 border-gray-300 cursor-pointer"
                      value={bg}
                      onChange={(e) => setBg(e.target.value)}
                    />
                    <input
                      type="text"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      value={bg}
                      onChange={(e) => setBg(e.target.value)}
                      placeholder="#000000"
                    />
                  </div>
                  <div className="grid grid-cols-5 gap-2">
                    {COLOR_PRESETS.map((color, index) => (
                      <button
                        key={index}
                        onClick={() => setBg(color.value)}
                        className="w-8 h-8 rounded-lg border-2 border-gray-300 hover:border-gray-400 transition-colors"
                        style={{ backgroundColor: color.value }}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Center Image
                  </label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Upload JPG, PNG, or WebP (max 10MB)
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="pt-4 space-y-3">
                  <button
                    onClick={generate}
                    disabled={isGenerating || !title.trim()}
                    className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-teal-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
                  >
                    {isGenerating ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Generating...
                      </>
                    ) : (
                      '🎨 Generate Poster'
                    )}
                  </button>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={downloadSVG}
                      className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-sm font-medium"
                    >
                      📄 SVG
                    </button>
                    <button
                      onClick={downloadPNG}
                      className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-sm font-medium"
                    >
                      🖼️ PNG
                    </button>
                  </div>
                  
                  <button
                    onClick={resetPoster}
                    className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 text-sm font-medium"
                  >
                    🔄 Reset
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Poster Preview */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-800">📋 Live Preview</h3>
                <div className="text-sm text-gray-500">
                  Auto-updates as you type
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-xl p-6 flex items-center justify-center">
                <img
                  ref={imgRef}
                  alt="Poster preview"
                  className="max-w-full h-auto rounded-lg shadow-lg"
                  style={{ maxHeight: '600px' }}
                />
              </div>
              
              <div className="mt-4 text-center text-sm text-gray-500">
                Your poster will be generated in high resolution when downloaded
              </div>
            </div>
          </div>
        </div>

        {/* Tips Section */}
        <div className="mt-12 bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">💡 Pro Tips</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="flex items-start">
              <div className="text-2xl mr-4">🎯</div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Keep it Simple</h4>
                <p className="text-gray-600 text-sm">Use clear, concise text that's easy to read from a distance</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="text-2xl mr-4">🌈</div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Color Contrast</h4>
                <p className="text-gray-600 text-sm">Choose colors that create good contrast for readability</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="text-2xl mr-4">📸</div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">High-Quality Images</h4>
                <p className="text-gray-600 text-sm">Use high-resolution images for the best print quality</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}