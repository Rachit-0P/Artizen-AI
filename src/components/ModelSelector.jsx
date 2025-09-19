import React from 'react';
import { getConfiguredProviders } from '../utils/aiProviders';

const MODEL_INFO = {
  'Google Gemini': {
    icon: '🧠',
    description: 'Fast and creative responses',
    tier: 'FREE',
    color: 'blue'
  },
  'Google Gemini (Backup)': {
    icon: '🧠',
    description: 'Backup Gemini instance',
    tier: 'FREE',
    color: 'blue'
  },
  'Cohere': {
    icon: '⚡',
    description: 'Reliable text generation',
    tier: 'FREE',
    color: 'green'
  },
  'OpenAI': {
    icon: '🤖',
    description: 'Advanced language model',
    tier: 'PAID',
    color: 'purple'
  }
};

export default function ModelSelector({ selectedModel, onModelChange, className = '' }) {
  const configuredProviders = getConfiguredProviders();

  const getColorClasses = (color, isSelected) => {
    const colors = {
      blue: isSelected 
        ? 'bg-blue-50 border-blue-300 text-blue-700' 
        : 'border-gray-200 hover:border-blue-200 hover:bg-blue-25',
      green: isSelected 
        ? 'bg-green-50 border-green-300 text-green-700' 
        : 'border-gray-200 hover:border-green-200 hover:bg-green-25',
      purple: isSelected 
        ? 'bg-purple-50 border-purple-300 text-purple-700' 
        : 'border-gray-200 hover:border-purple-200 hover:bg-purple-25'
    };
    return colors[color] || colors.blue;
  };

  if (configuredProviders.length === 0) {
    return (
      <div className={`p-4 bg-yellow-50 border border-yellow-200 rounded-lg ${className}`}>
        <div className="flex items-center gap-2 text-yellow-800">
          <span>⚠️</span>
          <span className="font-medium">No AI providers configured</span>
        </div>
        <p className="text-sm text-yellow-700 mt-1">
          Please add your API keys to the .env file to use AI features.
        </p>
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          AI Model Selection
        </label>
        <button
          onClick={() => onModelChange(null)}
          className={`px-3 py-1 text-xs rounded-full transition-colors ${
            selectedModel === null
              ? 'bg-gray-800 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Auto
        </button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {configuredProviders.map((provider) => {
          const info = MODEL_INFO[provider];
          const isSelected = selectedModel === provider;
          
          return (
            <button
              key={provider}
              onClick={() => onModelChange(provider)}
              className={`p-3 border-2 rounded-lg text-left transition-all duration-200 ${getColorClasses(info.color, isSelected)}`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">{info.icon}</span>
                <span className="font-medium text-sm">{provider}</span>
                <span className={`px-2 py-0.5 text-xs rounded-full ${
                  info.tier === 'FREE' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-orange-100 text-orange-700'
                }`}>
                  {info.tier}
                </span>
              </div>
              <p className="text-xs text-gray-600">{info.description}</p>
            </button>
          );
        })}
      </div>
      
      <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
        <strong>Auto mode:</strong> Automatically tries all available models until one works.
        <br />
        <strong>Manual selection:</strong> Uses only the selected model and shows specific error if it fails.
      </div>
    </div>
  );
}