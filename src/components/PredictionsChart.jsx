import React, { useEffect, useState } from 'react';

const TREND_DATA = [
  { 
    label: 'Minimalist', 
    value: 32, 
    trend: '+5%', 
    color: 'from-green-400 to-green-500',
    description: 'Clean lines, simple forms, neutral colors'
  },
  { 
    label: 'Abstract', 
    value: 24, 
    trend: '+2%', 
    color: 'from-blue-400 to-blue-500',
    description: 'Non-representational, expressive forms'
  },
  { 
    label: 'Figurative', 
    value: 18, 
    trend: '-1%', 
    color: 'from-purple-400 to-purple-500',
    description: 'Human figures, realistic representation'
  },
  { 
    label: 'Landscape', 
    value: 14, 
    trend: '+3%', 
    color: 'from-teal-400 to-teal-500',
    description: 'Natural scenes, outdoor environments'
  },
  { 
    label: 'Digital Art', 
    value: 12, 
    trend: '+8%', 
    color: 'from-pink-400 to-pink-500',
    description: 'Computer-generated, digital medium'
  },
];

const MARKET_INSIGHTS = [
  {
    icon: '📈',
    title: 'Market Growth',
    value: '+15%',
    description: 'Overall art market growth this quarter'
  },
  {
    icon: '🎯',
    title: 'Top Price Range',
    value: '₹5K-₹50K',
    description: 'Most popular price bracket for emerging artists'
  },
  {
    icon: '🌟',
    title: 'Emerging Trend',
    value: 'Eco Art',
    description: 'Sustainable and environmentally conscious art'
  },
  {
    icon: '📱',
    title: 'Digital Sales',
    value: '+25%',
    description: 'Increase in online art purchases'
  }
];

export default function PredictionsChart() {
  const [animate, setAnimate] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState(null);

  const max = Math.max(...TREND_DATA.map(d => d.value));

  useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 px-6 py-4">
          <h2 className="text-2xl font-bold text-white flex items-center">
            📈 Art Market Trends & Predictions
          </h2>
          <p className="text-blue-100 mt-1">
            Data-driven insights for artistic styles and market demand
          </p>
        </div>

        <div className="p-6 space-y-8">
          {/* Market Insights Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {MARKET_INSIGHTS.map((insight, index) => (
              <div key={index} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{insight.icon}</span>
                  <div className="text-sm font-medium text-gray-600">{insight.title}</div>
                </div>
                <div className="text-xl font-bold text-gray-800 mb-1">{insight.value}</div>
                <div className="text-xs text-gray-600">{insight.description}</div>
              </div>
            ))}
          </div>

          {/* Main Chart */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-800">
                🎨 Style Demand Forecast
              </h3>
              <div className="text-sm text-gray-500">
                Predicted styles likely to sell • Next 6 months
              </div>
            </div>

            <div className="space-y-4">
              {TREND_DATA.map((item, index) => {
                const percentage = (item.value / max) * 100;
                const isPositiveTrend = item.trend.startsWith('+');

                return (
                  <div 
                    key={item.label} 
                    className="group cursor-pointer"
                    onClick={() => setSelectedStyle(selectedStyle === item.label ? null : item.label)}
                  >
                    <div className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-all duration-200">
                      {/* Style Name and Info */}
                      <div className="w-32 sm:w-40">
                        <div className="font-semibold text-gray-800">{item.label}</div>
                        <div className="text-xs text-gray-600">{item.description}</div>
                      </div>

                      {/* Progress Bar */}
                      <div className="flex-1 relative">
                        <div className="h-8 bg-gray-100 rounded-full overflow-hidden relative">
                          <div
                            className={`absolute left-0 top-0 h-full bg-gradient-to-r ${item.color} rounded-full transition-all duration-1000 ease-out`}
                            style={{
                              width: animate ? `${percentage}%` : '0%',
                            }}
                          />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-700">
                              {item.value}%
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Trend Indicator */}
                      <div className="w-16 text-right">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          isPositiveTrend 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {isPositiveTrend ? '↗' : '↘'} {item.trend}
                        </span>
                      </div>

                      {/* Expand Indicator */}
                      <div className="w-6">
                        <svg 
                          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                            selectedStyle === item.label ? 'rotate-180' : ''
                          }`} 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>

                    {/* Expanded Details */}
                    {selectedStyle === item.label && (
                      <div className="ml-4 pl-4 border-l-2 border-gray-200 py-3 space-y-2 animate-fadeIn">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Market Share:</span>
                            <span className="ml-2 font-semibold">{item.value}%</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Trend:</span>
                            <span className={`ml-2 font-semibold ${
                              isPositiveTrend ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {item.trend} vs last quarter
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-600">Demand:</span>
                            <span className="ml-2 font-semibold">
                              {item.value > 25 ? 'High' : item.value > 15 ? 'Medium' : 'Growing'}
                            </span>
                          </div>
                        </div>
                        <div className="text-xs text-gray-600 bg-gray-50 p-3 rounded-lg">
                          <strong>Recommendation:</strong> {
                            item.value > 25 
                              ? 'High demand style - consider focusing on this area for better market success.'
                              : item.value > 15 
                              ? 'Stable market presence - good for diversifying your portfolio.'
                              : 'Emerging opportunity - early adoption could provide competitive advantage.'
                          }
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Additional Insights */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <h4 className="font-bold text-blue-800 mb-3 flex items-center gap-2">
                <span>🔮</span> AI Predictions
              </h4>
              <ul className="text-blue-700 text-sm space-y-2">
                <li>• Minimalist art expected to continue strong growth</li>
                <li>• Digital art gaining momentum with NFT integration</li>
                <li>• Sustainable/eco-friendly themes trending upward</li>
                <li>• Mixed-media works showing increased interest</li>
              </ul>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-xl p-6">
              <h4 className="font-bold text-green-800 mb-3 flex items-center gap-2">
                <span>💡</span> Market Tips
              </h4>
              <ul className="text-green-700 text-sm space-y-2">
                <li>• Focus on trending styles for better sales potential</li>
                <li>• Consider combining popular elements from different styles</li>
                <li>• Monitor social media for emerging aesthetic trends</li>
                <li>• Price competitively within popular ranges</li>
              </ul>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
            <div className="text-yellow-800 text-sm">
              <strong>Disclaimer:</strong> This data is for demonstration purposes and represents simulated market trends. 
              Actual market conditions may vary. Always conduct your own research and consider multiple factors when making artistic and business decisions.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}