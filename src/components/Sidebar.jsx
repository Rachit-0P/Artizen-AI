import React from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function Sidebar(){
  const location = useLocation()

  const links = [
    { to: '/', label: '🏠 Dashboard' },
    { to: '/poster', label: '🎨 Poster Generator' },
    { to: '/social', label: '📣 Social Posts Content' },
    { to: '/bios', label: '💬 Bios Writer' },
  ]

  return (
    <aside className='w-72 bg-white rounded-r-3xl p-8 flex flex-col gap-8 shadow-xl max-h-screen sticky top-0'>
      <div className='flex items-center gap-4'>
        <div className='w-12 h-12 rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center text-white font-extrabold text-lg select-none'>
          AH
        </div>
        <div>
          <div className='font-bold text-lg text-gray-900'>Hello Human</div>
          <div className='text-xs text-green-500 font-semibold tracking-wide'>⦿ Online</div>
        </div>
      </div>

      <nav className='flex-1 overflow-y-auto'>
        <ul className='space-y-3'>
          {links.map(({to, label}) => {
            const isActive = location.pathname === to
            return (
              <li key={to}>
                <Link
                  to={to}
                  className={`block px-4 py-3 rounded-xl font-semibold text-gray-700 transition-colors duration-300 select-none ${
                    isActive
                      ? 'bg-teal-100 text-teal-700 shadow-inner'
                      : 'hover:bg-teal-50 hover:text-teal-600'
                  }`}
                >
                  {label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      <div>
        <button className='w-full px-5 py-3 rounded-full bg-gradient-to-r from-teal-400 to-cyan-500 text-white font-bold shadow-lg hover:brightness-110 transition duration-300'>
          + Invite people
        </button>
      </div>
    </aside>
  )
}
