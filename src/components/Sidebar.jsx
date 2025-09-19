import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Sidebar() {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const links = [
    { to: '/', label: 'Dashboard', icon: '🏠' },
    { to: '/poster', label: 'Poster Generator', icon: '🎨' },
    { to: '/social', label: 'Social Posts', icon: '📱' },
    { to: '/bios', label: 'Artist Bios', icon: '✍️' },
  ];

  return (
    <aside 
      className={`${
        isCollapsed ? 'w-20' : 'w-72'
      } bg-white rounded-r-3xl p-6 flex flex-col gap-6 shadow-xl max-h-screen sticky top-0 transition-all duration-300 z-50`}
    >
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-extrabold text-lg select-none shrink-0">
          AI
        </div>
        {!isCollapsed && (
          <div className="min-w-0 flex-1">
            <div className="font-bold text-lg text-gray-900 truncate">Artizen AI</div>
            <div className="text-xs text-green-500 font-semibold tracking-wide flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Ready
            </div>
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 text-gray-500 hover:text-gray-700"
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <svg 
            className={`w-5 h-5 transition-transform duration-200 ${isCollapsed ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto">
        <ul className="space-y-2">
          {links.map(({ to, label, icon }) => {
            const isActive = location.pathname === to;
            return (
              <li key={to}>
                <Link
                  to={to}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 select-none group ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 shadow-sm border border-blue-100'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                  title={isCollapsed ? label : ''}
                >
                  <span className="text-xl shrink-0">{icon}</span>
                  {!isCollapsed && (
                    <span className="truncate group-hover:text-gray-900">{label}</span>
                  )}
                  {isActive && !isCollapsed && (
                    <span className="ml-auto">
                      <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      {!isCollapsed && (
        <div className="space-y-3">
          <div className="px-4 py-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100">
            <div className="text-sm font-medium text-gray-800 mb-1">🚀 Pro Tip</div>
            <div className="text-xs text-gray-600">
              Use keyboard shortcuts for faster navigation
            </div>
          </div>
          
          <button className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold shadow-lg hover:shadow-xl hover:from-purple-600 hover:to-blue-600 transition-all duration-200 flex items-center justify-center gap-2">
            <span>✨</span>
            <span>Upgrade</span>
          </button>
        </div>
      )}

      {isCollapsed && (
        <div className="flex flex-col gap-2">
          <button 
            className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center"
            title="Upgrade"
          >
            ✨
          </button>
        </div>
      )}
    </aside>
  );
}