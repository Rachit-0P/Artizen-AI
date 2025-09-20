import React, {useState} from 'react'

export default function Notifications(){
  const [subscribed, setSubscribed] = useState(false)
  const events = [
    {title:'Local Art Fair — Sat 12pm', id:1},
    {title:'Gallery Call: Open Submissions', id:2},
    {title:'Online Market Live', id:3},
  ]

  return (
    <div className='space-y-4'>
      <p className='text-sm text-gray-600'>
        Subscribe to local exhibitions and online showcases.
      </p>

      <div className='flex gap-3'>
        <button
          onClick={() => setSubscribed(true)}
          className={`px-4 py-2 rounded-full font-semibold transition-colors duration-300 shadow-md ${
            subscribed ? 'bg-teal-600 text-white shadow-lg' : 'bg-teal-500 text-white hover:bg-teal-500'
          }`}
          aria-pressed={subscribed}
        >
          Subscribe
        </button>
        <button
          onClick={() => setSubscribed(false)}
          className={`px-4 py-2 rounded-full font-semibold border-2 transition-colors duration-300 ${
            !subscribed
              ? 'border-gray-400 text-gray-600 cursor-default opacity-50'
              : 'border-teal-400 text-teal-600 hover:bg-teal-50'
          }`}
          disabled={!subscribed}
          aria-pressed={!subscribed}
        >
          Unsubscribe
        </button>
      </div>

      <div className='mt-3 space-y-2 max-h-48 overflow-y-auto'>
        {events.map(e => (
          <div
            key={e.id}
            className='bg-white rounded-lg p-3 shadow-sm border border-gray-200 text-gray-800 font-medium hover:bg-teal-50 transition-colors cursor-default'
          >
            {e.title}
          </div>
        ))}
      </div>

      <p
        className={`text-sm font-medium ${
          subscribed ? 'text-teal-600' : 'text-gray-500'
        }`}
        aria-live='polite'
      >
        {subscribed ? 'Subscribed — we will notify you!' : 'Not subscribed'}
      </p>
    </div>
  )
}
