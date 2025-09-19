import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Dashboard from './components/Dashboard';
import PosterPage from './components/PosterPage';
import SocialGenerator from './components/SocialGenerator';
import BioGenerator from './components/BioGenerator';

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex">
        {/* Sidebar */}
        <div className={`
          fixed lg:static inset-y-0 left-0 z-50 lg:z-auto
          transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
          transition-transform duration-300 ease-in-out lg:transition-none
        `}>
          <Sidebar />
        </div>

        {/* Main Content */}
        <div className="flex-1 w-full lg:w-auto">
          {/* Mobile Header */}
          <div className="lg:hidden bg-white shadow-sm border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
              aria-label="Open sidebar"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            
            <div className="font-bold text-xl bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Artizen AI
            </div>
            
            <div className="w-10"></div> {/* Spacer for centering */}
          </div>

          {/* Main Content Area */}
          <main className="p-4 lg:p-6">
            {/* Desktop Topbar */}
            <div className="hidden lg:block">
              <Topbar />
            </div>
            
            {/* Routes */}
            <div className="w-full">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/poster" element={<PosterPage />} />
                <Route path="/social" element={<SocialGenerator />} />
                <Route path="/bios" element={<BioGenerator />} />
                {/* Catch-all route for 404 */}
                <Route path="*" element={
                  <div className="min-h-[60vh] flex items-center justify-center">
                    <div className="text-center space-y-4">
                      <div className="text-6xl">🤔</div>
                      <h2 className="text-2xl font-bold text-gray-800">Page Not Found</h2>
                      <p className="text-gray-600">The page you're looking for doesn't exist.</p>
                      <a 
                        href="/"
                        className="inline-block px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                      >
                        Go to Dashboard
                      </a>
                    </div>
                  </div>
                } />
              </Routes>
            </div>
          </main>
        </div>
      </div>

      {/* Mobile Close Sidebar on Route Change */}
      <style jsx>{`
        @media (max-width: 1023px) {
          body {
            overflow-x: hidden;
          }
        }
      `}</style>
    </div>
  );
}