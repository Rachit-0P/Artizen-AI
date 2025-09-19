import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getConfiguredProviders } from '../utils/aiProviders';
import VideoGenerator from './VideoGenerator';
import PricingTool from './PricingTool';
import PredictionsChart from './PredictionsChart';
import Notifications from './Notifications';

const MAIN_FEATURES = [
  {
    id: 'poster',
    title: 'Poster Generator',
    description: 'Create stunning promotional posters with AI-powered design tools',
    icon: '🎨',
    path: '/poster',
    gradient: 'from-purple-500 to-pink-500',
    active: true
  },
  {
    id: 'social',
    title: 'Social Media Posts',
    description: 'Generate engaging captions and content for all platforms',
    icon: '📱',
    path: '/social',
    gradient: 'from-teal-500 to-blue-500',
    active: true
  },
  {
    id: 'bios',
    title: 'Artist Bios',
    description: 'Professional artist biographies and descriptions',
    icon: '✍️',
    path: '/bios',
    gradient: 'from-green-500 to-emerald-500',
    active: true
  }
];

const DEMO_FEATURES = [
  {
    id: 'videos',
    title: 'Video Generator',
    description: 'Create short promotional videos and reels',
    icon: '🎬',
    demo: true
  },
  {
    id: 'pricing',
    title: 'Pricing Analysis',
    description: 'Market analysis and pricing suggestions',
    icon: '💰',
    demo: true
  },
  {
    id: 'predictions',
    title: 'Trend Predictions',
    description: 'Forecast demand trends and style popularity',
    icon: '📈',
    demo: true
  },
  {
    id: 'notifications',
    title: 'Exhibition Alerts',
    description: 'Local exhibitions and marketplace notifications',
    icon: '🔔',
    demo: true
  }
];

export default function Dashboard() {
  const [selectedDemo, setSelectedDemo] = useState(null);
  const [configuredProviders, setConfiguredProviders] = useState([]);

  useEffect(() => {
    const providers = getConfiguredProviders();
    setConfiguredProviders(providers);
  }, []);

  const renderDemoContent = (id) => {
    switch (id) {
      case 'videos':
        return <VideoGenerator />;
      case 'pricing':
        return <PricingTool />;
      case 'predictions':
        return <PredictionsChart />;
      case 'notifications':
        return <Notifications />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 bg-clip-text text-transparent mb-4">
            Artizen AI
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            AI-powered tools to help artists create, promote, and sell their work with professional marketing content.
          </p>
          
          {/* API Status */}
          <div className="mt-6">
            {configuredProviders.length > 0 ? (
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-green-100 text-green-800 font-medium">
                ✅ {configuredProviders.length} AI provider{configuredProviders.length > 1 ? 's' : ''} ready
              </div>
            ) : (
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-red-100 text-red-800 font-medium">
                ⚠️ No AI providers configured
              </div>
            )}
          </div>
        </div>

        {/* Main Features Grid */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">🚀 AI-Powered Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {MAIN_FEATURES.map((feature) => (
              <Link
                key={feature.id}
                to={feature.path}
                className="group relative overflow-hidden bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                <div className="relative p-8">
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-gray-900 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                  <div className="mt-6 flex items-center text-sm font-medium text-gray-500 group-hover:text-gray-700">
                    Open Tool
                    <svg className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Demo Features */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">🧪 Demo Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {DEMO_FEATURES.map((feature) => (
              <button
                key={feature.id}
                onClick={() => setSelectedDemo(feature)}
                className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 text-left border border-gray-100 hover:border-gray-200 group"
              >
                <div className="text-2xl mb-3">{feature.icon}</div>
                <h3 className="font-semibold text-gray-800 mb-2 group-hover:text-gray-900">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600">
                  {feature.description}
                </p>
                <div className="mt-4 text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full inline-block">
                  DEMO
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-16">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">⚡ Quick Actions</h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/social"
              className="flex-1 px-6 py-4 bg-gradient-to-r from-teal-500 to-blue-500 text-white rounded-xl font-semibold text-center hover:from-teal-600 hover:to-blue-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              🚀 Create Social Media Post
            </Link>
            <Link
              to="/bios"
              className="flex-1 px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold text-center hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              ✍️ Generate Artist Bio
            </Link>
            <Link
              to="/poster"
              className="flex-1 px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-semibold text-center hover:from-green-600 hover:to-emerald-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              🎨 Design Poster
            </Link>
          </div>
        </div>

        {/* Tips Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
              💡 Pro Tips
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <span className="text-green-500 mr-3 mt-1">✓</span>
                <span className="text-gray-600">Use high-resolution images for the best poster quality</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-3 mt-1">✓</span>
                <span className="text-gray-600">Keep social media captions concise and engaging</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-3 mt-1">✓</span>
                <span className="text-gray-600">Include relevant keywords in your artist bio</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-3 mt-1">✓</span>
                <span className="text-gray-600">Test different content styles to find your voice</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
              📊 Usage Stats
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">AI Providers Available</span>
                <span className="font-semibold text-gray-800">{configuredProviders.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Active Tools</span>
                <span className="font-semibold text-gray-800">{MAIN_FEATURES.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Demo Features</span>
                <span className="font-semibold text-gray-800">{DEMO_FEATURES.length}</span>
              </div>
            </div>
            
            {configuredProviders.length > 0 && (
              <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                <h4 className="font-semibold text-green-800 mb-2">Available Providers:</h4>
                <div className="flex flex-wrap gap-2">
                  {configuredProviders.map((provider, index) => (
                    <span key={index} className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                      {provider}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Demo Modal */}
        {selectedDemo && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 flex items-center">
                    {selectedDemo.icon} {selectedDemo.title}
                  </h3>
                  <p className="text-gray-600 mt-1">{selectedDemo.description}</p>
                </div>
                <button
                  onClick={() => setSelectedDemo(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                >
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
                {renderDemoContent(selectedDemo.id)}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}