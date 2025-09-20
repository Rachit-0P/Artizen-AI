import React, {useState, useEffect, useRef} from 'react'
import VideoGenerator from './VideoGenerator'
import PricingTool from './PricingTool'
import PredictionsChart from './PredictionsChart'
import Notifications from './Notifications'
import { Link } from 'react-router-dom'

function Card({children, className=''}){
  const ref = useRef()
  useEffect(()=>{
    const el = ref.current
    if(!el) return
    function onMouse(e){
      const rect = el.getBoundingClientRect()
      const x = e.clientX - rect.left - rect.width/2
      const y = e.clientY - rect.top - rect.height/2
      const rx = (-y / rect.height) * 8
      const ry = (x / rect.width) * 8
      el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(0px)`
    }
    function onLeave(){ el.style.transform = '' }
    el.addEventListener('mousemove', onMouse)
    el.addEventListener('mouseleave', onLeave)
    return ()=>{ el.removeEventListener('mousemove', onMouse); el.removeEventListener('mouseleave', onLeave) }
  },[])
  return <div ref={ref} className={`tilt-card bg-white/95 rounded-3xl p-6 shadow-lg ${className}`}>{children}</div>
}

const FEATURES = [
  {id:'poster', title:'Generate promotional posters', short:'Create high-quality posters and download SVGs.'},
  {id:'videos', title:'Short videos & reels', short:'Auto-create short promotional videos (demo).'},
  {id:'pricing', title:'Market analysis & pricing', short:'Suggest fair pricing ranges.'},
  {id:'posts', title:'Social posts & hashtags', short:'Generate captions and hashtag ideas.'},
  {id:'bios', title:'Engaging bios & descriptions', short:'Write artist bios and artwork descriptions.'},
  {id:'notify', title:'Local exhibitions & notifications', short:'Alerts for local shows and marketplaces.'},
  {id:'predict', title:'Style & sales prediction', short:'Forecast demand trends for styles.'},
]

export default function Dashboard(){
  const [open, setOpen] = useState(null)

  function renderContent(id){
    if(id==='videos') return <VideoGenerator />
    if(id==='pricing') return <PricingTool />
    if(id==='notify') return <Notifications />
    if(id==='predict') return <PredictionsChart />
    return null
  }

  return (
    <main className='grid grid-cols-12 gap-8 p-6 max-w-7xl mx-auto min-h-screen'>
      <section className='col-span-12 md:col-span-8'>
        <Card>
          <div className='flex flex-col md:flex-row items-start md:items-center justify-between mb-6'>
            <h3 className='font-extrabold text-3xl text-gray-900 leading-tight'>AI that helps artists promote and sell</h3>
            <div className='text-sm text-gray-500 mt-2 md:mt-0'>Try the demos</div>
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6'>
            {FEATURES.map(f => {
              if (f.id === 'poster') {
                return (
                  <Link
                    key={f.id}
                    to="/poster"
                    className="block p-5 rounded-2xl text-black font-semibold shadow-md hover:shadow-xl transition-shadow duration-300"
                    style={{
                      background: 'linear-gradient(to right, rgba(20, 184, 166, 0.4), rgba(6, 182, 212, 0.4))',
                      border: '2px solid rgba(20, 184, 166, 0.7)',
                    }}
                  >
                    <div className='text-lg'>{f.title}</div>
                    <div className='text-sm opacity-90 mt-2'>{f.short}</div>
                  </Link>
                )
              }
              if (f.id === 'posts') {
                return (
                  <Link
                    key={f.id}
                    to="/social"
                    className="block p-5 rounded-2xl text-black font-semibold shadow-md hover:shadow-xl transition-shadow duration-300"
                    style={{
                      background: 'linear-gradient(to right, rgba(20, 184, 166, 0.4), rgba(6, 182, 212, 0.4))',
                      border: '2px solid rgba(20, 184, 166, 0.7)', 
                    }}
                  >
                    <div className='text-lg'>{f.title}</div>
                    <div className='text-sm opacity-90 mt-2'>{f.short}</div>
                  </Link>
                )
              }
              if (f.id === 'bios') {
                return (
                  <Link
                    key={f.id}
                    to="/bios"
                    className="block p-5 rounded-2xl text-black font-semibold shadow-md hover:shadow-xl transition-shadow duration-300"
                    style={{
                      background: 'linear-gradient(to right, rgba(20, 184, 166, 0.4), rgba(6, 182, 212, 0.4))',
                      border: '2px solid rgba(20, 184, 166, 0.7)', 
                    }}
                  >
                    <div className='text-lg'>{f.title}</div>
                    <div className='text-sm opacity-90 mt-2'>{f.short}</div>
                  </Link>
                )
              }
              return (
                <button
                  key={f.id}
                  onClick={() => setOpen(f)}
                  className='text-left p-5 rounded-2xl border border-gray-300 hover:border-teal-400 hover:shadow-lg transition-all duration-300 bg-white shadow-sm group block text-left p-4 rounded-xl border border-slate-100 hover:border-teal-400 hover:bg-teal-50 transition duration-200'
                >
                  <div className='font-semibold text-gray-900 text-lg'>{f.title}</div>
                  <div className='text-sm text-gray-600 mt-2'>{f.short}</div>
                </button>
              )
            })}
          </div>

          <div className='mt-8'>
            <h4 className='font-semibold text-xl mb-3 text-gray-800'>Quick actions</h4>
            <div className='flex gap-4 flex-wrap'>
              <Link to='/poster' className='px-5 py-3 rounded-full bg-teal-500 hover:bg-teal-600 text-white font-semibold shadow-md transition-colors duration-300'>Go to Poster Generator</Link>
              <button onClick={()=> setOpen({id:'videos', title:'Short videos & reels'})} className='px-5 py-3 rounded-full border border-teal-500 text-teal-600 font-semibold hover:bg-teal-50 transition-colors duration-300 shadow-sm'>Export sample video</button>
            </div>
          </div>
        </Card>
      </section>

      <aside className='col-span-12 md:col-span-4 space-y-6 mt-8 md:mt-0'>
        <Card>
          <h4 className='font-semibold text-xl mb-3 text-gray-800'>Tips</h4>
          <ul className='text-sm text-gray-600 list-disc ml-6 space-y-2'>
            <li>Use high-resolution images for posters and videos.</li>
            <li>Keep captions short and include targeted hashtags.</li>
            <li>Test pricing with small limited editions first.</li>
          </ul>
        </Card>
        <Card>
          <h4 className='font-semibold text-xl mb-3 text-gray-800'>Notifications</h4>
          <Notifications />
        </Card>
      </aside>

      {open && (
        <div className='fixed inset-0 bg-black/50 backdrop-blur-sm modal-backdrop flex items-center justify-center p-6 z-50'>
          <div className='bg-white rounded-3xl p-8 w-full max-w-3xl shadow-2xl max-h-[90vh] overflow-y-auto'>
            <div className='flex items-start justify-between gap-6'>
              <div>
                <h3 className='font-extrabold text-2xl text-gray-900'>{open.title}</h3>
                <p className='text-sm text-gray-600 mt-3'>{open.short}</p>
              </div>
              <div>
                <button onClick={()=> setOpen(null)} className='px-4 py-2 rounded-full border border-gray-300 hover:bg-gray-100 transition-colors duration-200'>Close</button>
              </div>
            </div>
            <div className='mt-6'>
              {renderContent(open.id)}
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
