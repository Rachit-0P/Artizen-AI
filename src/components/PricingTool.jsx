import React, { useState } from 'react'

export default function PricingTool() {
  const [width, setWidth] = useState(30)
  const [height, setHeight] = useState(40)
  const [complexity, setComplexity] = useState(3)
  const [suggestion, setSuggestion] = useState('')

  function analyze() {
    const area = width * height
    const base = area * 2.5
    const minP = Math.round(base * (1 + complexity * 0.35))
    const maxP = Math.round(minP * 1.5)
    setSuggestion(
      `Suggested price range: ₹${minP.toLocaleString()} - ₹${maxP.toLocaleString()}`
    )
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg border border-gray-200 space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <h2 className="text-lg font-semibold text-gray-800">🎯 Artwork Pricing Estimator</h2>
        <p className="text-sm text-gray-500">
          Estimate a fair price based on artwork size and complexity.
        </p>
      </div>

      {/* Input Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="width" className="block text-sm font-medium text-gray-700 mb-1">
            Width (cm)
          </label>
          <input
            id="width"
            type="number"
            min="1"
            value={width}
            onChange={(e) => setWidth(Math.max(1, Number(e.target.value)))}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-400 focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="height" className="block text-sm font-medium text-gray-700 mb-1">
            Height (cm)
          </label>
          <input
            id="height"
            type="number"
            min="1"
            value={height}
            onChange={(e) => setHeight(Math.max(1, Number(e.target.value)))}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-400 focus:outline-none"
          />
        </div>
      </div>

      {/* Complexity Slider */}
      <div>
        <label htmlFor="complexity" className="block text-sm font-medium text-gray-700 mb-1">
          Complexity: <span className="font-semibold text-teal-600">{complexity}</span>/5
        </label>
        <input
          id="complexity"
          type="range"
          min="1"
          max="5"
          value={complexity}
          onChange={(e) => setComplexity(Number(e.target.value))}
          className="w-full mt-2 accent-teal-500 cursor-pointer"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={analyze}
          disabled={width < 1 || height < 1}
          className={`px-5 py-2 rounded-md text-white font-medium transition-all ${
            width < 1 || height < 1
              ? 'bg-teal-200 cursor-not-allowed'
              : 'bg-teal-500 hover:bg-teal-600'
          }`}
        >
          Analyze
        </button>
        <button
          onClick={() => setSuggestion('')}
          className="px-5 py-2 rounded-md border border-gray-300 hover:bg-gray-100 transition text-gray-700"
        >
          Clear
        </button>
      </div>

      {/* Output */}
      {suggestion && (
        <div className="bg-teal-50 border border-teal-200 p-4 rounded-lg text-teal-800 shadow-sm animate-fade-in">
          {suggestion}
        </div>
      )}
    </div>
  )
}
