import React, { useState } from 'react';

const ARTWORK_TYPES = [
  { name: 'Canvas Painting', multiplier: 1.0, icon: '🎨' },
  { name: 'Digital Art', multiplier: 0.7, icon: '💻' },
  { name: 'Sculpture', multiplier: 1.5, icon: '🗿' },
  { name: 'Photography', multiplier: 0.8, icon: '📸' },
  { name: 'Mixed Media', multiplier: 1.2, icon: '🎭' },
];

const COMPLEXITY_LEVELS = [
  { level: 1, name: 'Simple', description: 'Basic shapes, minimal detail' },
  { level: 2, name: 'Moderate', description: 'Some detail, moderate complexity' },
  { level: 3, name: 'Detailed', description: 'Good amount of detail' },
  { level: 4, name: 'Complex', description: 'High detail, intricate work' },
  { level: 5, name: 'Masterpiece', description: 'Extremely detailed, museum quality' },
];

export default function PricingTool() {
  const [width, setWidth] = useState(30);
  const [height, setHeight] = useState(40);
  const [complexity, setComplexity] = useState(3);
  const [artworkType, setArtworkType] = useState(ARTWORK_TYPES[0]);
  const [suggestion, setSuggestion] = useState('');
  const [analyzing, setAnalyzing] = useState(false);

  function analyze() {
    setAnalyzing(true);
    
    setTimeout(() => {
      const area = width * height;
      const basePrice = area * 2.5;
      const complexityMultiplier = 1 + (complexity - 1) * 0.4;
      const typeMultiplier = artworkType.multiplier;
      
      const finalBase = basePrice * complexityMultiplier * typeMultiplier;
      const minPrice = Math.round(finalBase * 0.8);
      const maxPrice = Math.round(finalBase * 1.3);
      
      const formattedMin = minPrice.toLocaleString('en-IN');
      const formattedMax = maxPrice.toLocaleString('en-IN');
      
      setSuggestion({
        min: minPrice,
        max: maxPrice,
        formattedMin,
        formattedMax,
        area,
        complexity: COMPLEXITY_LEVELS[complexity - 1].name
      });
      setAnalyzing(false);
    }, 1000);
  }

  function reset() {
    setWidth(30);
    setHeight(40);
    setComplexity(3);
    setArtworkType(ARTWORK_TYPES[0]);
    setSuggestion('');
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-500 px-6 py-4">
          <h2 className="text-2xl font-bold text-white flex items-center">
            💰 Artwork Pricing Estimator
          </h2>
          <p className="text-green-100 mt-1">
            Get data-driven pricing suggestions for your artwork
          </p>
        </div>

        <div className="p-6 space-y-8">
          {/* Artwork Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Artwork Type
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {ARTWORK_TYPES.map((type) => (
                <button
                  key={type.name}
                  onClick={() => setArtworkType(type)}
                  className={`p-3 rounded-xl border-2 transition-all duration-200 text-center ${
                    artworkType.name === type.name
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  <div className="text-2xl mb-1">{type.icon}</div>
                  <div className="text-sm font-medium">{type.name}</div>
                  <div className="text-xs text-gray-500">×{type.multiplier}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Dimensions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label htmlFor="width" className="block text-sm font-medium text-gray-700 mb-2">
                Width (cm)
              </label>
              <input
                id="width"
                type="number"
                min="1"
                max="500"
                value={width}
                onChange={(e) => setWidth(Math.max(1, Math.min(500, Number(e.target.value))))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label htmlFor="height" className="block text-sm font-medium text-gray-700 mb-2">
                Height (cm)
              </label>
              <input
                id="height"
                type="number"
                min="1"
                max="500"
                value={height}
                onChange={(e) => setHeight(Math.max(1, Math.min(500, Number(e.target.value))))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Complexity Slider */}
          <div>
            <label htmlFor="complexity" className="block text-sm font-medium text-gray-700 mb-2">
              Complexity Level: <span className="font-semibold text-green-600">
                {COMPLEXITY_LEVELS[complexity - 1].name}
              </span>
            </label>
            <input
              id="complexity"
              type="range"
              min="1"
              max="5"
              value={complexity}
              onChange={(e) => setComplexity(Number(e.target.value))}
              className="w-full mt-2 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-green"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Simple</span>
              <span>Moderate</span>
              <span>Detailed</span>
              <span>Complex</span>
              <span>Masterpiece</span>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              {COMPLEXITY_LEVELS[complexity - 1].description}
            </p>
          </div>

          {/* Current Info */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-xl">
            <div className="text-center">
              <div className="text-sm text-gray-600">Dimensions</div>
              <div className="font-semibold text-gray-800">{width} × {height} cm</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-600">Area</div>
              <div className="font-semibold text-gray-800">{(width * height).toLocaleString()} cm²</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-600">Type Multiplier</div>
              <div className="font-semibold text-gray-800">×{artworkType.multiplier}</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4">
            <button
              onClick={analyze}
              disabled={analyzing || width < 1 || height < 1}
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-semibold hover:from-green-600 hover:to-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2"
            >
              {analyzing ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Analyzing...
                </>
              ) : (
                <>
                  📊 Analyze Pricing
                </>
              )}
            </button>
            
            <button
              onClick={reset}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all duration-200"
            >
              🔄 Reset
            </button>
          </div>

          {/* Results */}
          {suggestion && (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6 space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">💡</span>
                <h3 className="text-xl font-bold text-green-800">Pricing Suggestion</h3>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="text-center p-4 bg-white rounded-lg border border-green-200">
                  <div className="text-sm text-green-600 font-medium">Minimum Price</div>
                  <div className="text-2xl font-bold text-green-800">₹{suggestion.formattedMin}</div>
                </div>
                <div className="text-center p-4 bg-white rounded-lg border border-green-200">
                  <div className="text-sm text-green-600 font-medium">Maximum Price</div>
                  <div className="text-2xl font-bold text-green-800">₹{suggestion.formattedMax}</div>
                </div>
              </div>
              
              <div className="text-center p-4 bg-green-100 rounded-lg">
                <div className="text-green-800 font-semibold">
                  Suggested Range: ₹{suggestion.formattedMin} - ₹{suggestion.formattedMax}
                </div>
                <div className="text-sm text-green-700 mt-1">
                  Based on {suggestion.area} cm² • {suggestion.complexity} complexity • {artworkType.name}
                </div>
              </div>
              
              <div className="text-xs text-green-700 bg-green-100 p-3 rounded-lg">
                <strong>Note:</strong> This is an estimated range based on size, complexity, and artwork type. 
                Consider your experience level, market demand, materials cost, and local market conditions when setting final prices.
              </div>
            </div>
          )}

          {/* Tips */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
            <h4 className="font-semibold text-yellow-800 mb-3 flex items-center gap-2">
              <span>💡</span> Pricing Tips
            </h4>
            <ul className="text-yellow-700 text-sm space-y-2">
              <li>• Factor in material costs and time invested</li>
              <li>• Research similar artworks in your local market</li>
              <li>• Consider your experience and reputation</li>
              <li>• Start with lower prices and increase as demand grows</li>
              <li>• Unique or commissioned pieces can command higher prices</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}