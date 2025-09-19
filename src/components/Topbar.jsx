import React, { useState, useEffect } from 'react';
import { getConfiguredProviders, generateAIContent } from '../utils/aiProviders';

export default function Topbar() {
  const [configuredProviders, setConfiguredProviders] = useState([]);
  const [showAskAI, setShowAskAI] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [aiQuestion, setAiQuestion] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [loadingAI, setLoadingAI] = useState(false);

  useEffect(() => {
    const providers = getConfiguredProviders();
    setConfiguredProviders(providers);
  }, []);

  const handleAskAI = async () => {
    if (!aiQuestion.trim()) return;
    
    setLoadingAI(true);
    setAiResponse('');

    const prompt = `You are an AI assistant for artists. Help answer this question about art, creativity, or artistic tools: "${aiQuestion}"

Please provide a helpful, encouraging, and practical response.`;

    try {
      const result = await generateAIContent(prompt);
      if (result.success) {
        setAiResponse(result.content);
      } else {
        setAiResponse('Sorry, I couldn\'t process your question right now. Please try again.');
      }
    } catch (error) {
      setAiResponse('An error occurred. Please try again.');
    } finally {
      setLoadingAI(false);
    }
  };

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
          {/* Action Buttons */}
          <button 
            onClick={() => setShowAskAI(true)}
            className="px-4 py-2 rounded-lg bg-blue-500 text-white font-medium hover:bg-blue-600 transition-colors flex items-center gap-2"
            title="Get AI assistance"
          >
            <span>🤖</span>
            <span className="hidden sm:inline">Ask AI</span>
          </button>
          
          <button 
            onClick={() => setShowSettings(true)}
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

      {/* Ask AI Modal */}
      {showAskAI && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-2xl font-bold text-gray-800 flex items-center">
                🤖 Ask AI Assistant
              </h3>
              <button
                onClick={() => {
                  setShowAskAI(false);
                  setAiQuestion('');
                  setAiResponse('');
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(80vh-140px)]">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ask me anything about art, creativity, or artistic tools:
                  </label>
                  <textarea
                    value={aiQuestion}
                    onChange={(e) => setAiQuestion(e.target.value)}
                    placeholder="e.g., How can I improve my color mixing technique? What are good marketing strategies for artists?"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    rows={3}
                    disabled={loadingAI}
                  />
                </div>
                <button
                  onClick={handleAskAI}
                  disabled={!aiQuestion.trim() || loadingAI}
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                    !aiQuestion.trim() || loadingAI
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  }`}
                >
                  {loadingAI ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Getting answer...
                    </span>
                  ) : (
                    'Get AI Answer'
                  )}
                </button>
                {aiResponse && (
                  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-medium text-blue-800 mb-2">AI Response:</h4>
                    <p className="text-gray-700 whitespace-pre-wrap">{aiResponse}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-2xl font-bold text-gray-800 flex items-center">
                ⚙️ Settings
              </h3>
              <button
                onClick={() => setShowSettings(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(80vh-140px)]">
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">API Configuration</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <span className="font-medium text-gray-700">Gemini API</span>
                        <p className="text-sm text-gray-500">Google Gemini AI integration</p>
                      </div>
                      <div className={`w-3 h-3 rounded-full ${configuredProviders.length > 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    </div>
                    <p className="text-sm text-gray-600">
                      API keys are configured through environment variables. 
                      {configuredProviders.length > 0 ? ' ✅ Ready to use!' : ' ⚠️ Not configured.'}
                    </p>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">About</h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p><strong>Version:</strong> 1.0.0</p>
                    <p><strong>AI Provider:</strong> Google Gemini</p>
                    <p><strong>Features:</strong> Bio Generation, Social Posts, Video Ideas</p>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">Support</h4>
                  <div className="text-sm text-gray-600">
                    <p>Need help? Contact support or check the documentation for API setup instructions.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}