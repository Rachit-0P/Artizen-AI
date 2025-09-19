import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Topbar from './components/Topbar'
import Dashboard from './components/Dashboard'
import PosterPage from './components/PosterPage'
import SocialGenerator from './components/SocialGenerator'
import BioGenerator from './components/BioGenerator'

export default function App(){
  return (
    <div className='min-h-screen flex bg-slate-50 text-slate-800'>
      <Sidebar />
      <div className='flex-1 p-6'>
        <Topbar />
        <Routes>
          <Route path='/' element={<Dashboard />} />
          <Route path='/poster' element={<PosterPage />} />
          <Route path='/social' element={<SocialGenerator />} />
          <Route path='/bios' element={<BioGenerator />} />
        </Routes>
      </div>
    </div>
  )
}