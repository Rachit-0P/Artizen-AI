import React, { useState, useEffect } from 'react';
import { getConfiguredProviders } from '../utils/aiProviders';

export default function Topbar() {
  const [configuredProviders, setConfiguredProviders] = useState([]);

  useEffect(() => {
    const providers = getConfiguredProviders();
    setConfiguredProviders(providers);
  }, []);

  return (
    <header className="mb-8 lg:mb-12">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        {/* Header Section */}
        <div className="space-y-3 flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            AI Artist Toolkit
          </h1>
          <p className="text-gray-600">
            Create, promote, and enhance your artistic work with AI-powered tools
          </p>
        </div>

        {/* Status and Actions */}
        <div className="flex items-center gap-3">
          {/* API Status */}
          <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg shadow-sm border border-gray-200">
            {configuredProviders.length > 0 ? (
              <>
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-700">
                  {configuredProviders.length} AI provider{configuredProviders.length > 1 ? 's' : ''}
                </span>
              </>
            ) : (
              <>
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-700">
                  No providers
                </span>
              </>
            )}
          </div>

          {/* Action Buttons */}
          <button 
            className="px-4 py-2 rounded-lg bg-blue-500 text-white font-medium hover:bg-blue-600 transition-colors flex items-center gap-2"
            title="Get AI assistance"
          >
            <span>🤖</span>
            <span className="hidden sm:inline">Ask AI</span>
          </button>
          
          <button 
            className="p-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors"
            title="Settings"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}