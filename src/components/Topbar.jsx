import React from 'react'

export default function Topbar() {
  return (
    <header className="mb-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-slate-800">👋 Hello, Human</h1>
          <p className="text-base text-teal-500">AI Artist Toolkit — create & promote your work</p>
        </div>

        <div className="flex items-center gap-3">
          <button className="px-4 py-2 rounded-full bg-teal-500 text-white hover:bg-teal-600 transition shadow">
            💬 Ask AI
          </button>
          <button className="px-4 py-2 rounded-full border border-slate-300 text-slate-700 hover:bg-slate-100 transition">
            📬 Get Updates
          </button>
        </div>
      </div>
    </header>
  )
}
