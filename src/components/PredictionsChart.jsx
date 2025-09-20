import React, { useEffect, useState } from 'react'

export default function PredictionsChart() {
  const data = [
    { label: 'Minimalist', value: 32 },
    { label: 'Abstract', value: 24 },
    { label: 'Figurative', value: 18 },
    { label: 'Landscape', value: 14 },
    { label: 'Other', value: 12 },
  ]

  const max = Math.max(...data.map(d => d.value))

  // Animation trigger
  const [animate, setAnimate] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), 100) // slight delay for animation
    return () => clearTimeout(timer)
  }, [])

  // Dynamic gradient based on value
  const getBarColor = (value) => {
    if (value > 30) return 'from-green-400 to-green-500'
    if (value > 20) return 'from-teal-400 to-teal-500'
    return 'from-sky-400 to-sky-500'
  }

  return (
    <div className="space-y-4 p-6 bg-white dark:bg-slate-800 rounded-xl shadow-md">
      <h3 className="text-base font-semibold text-slate-700 dark:text-slate-100">
        🎨 Predicted styles likely to sell (demo forecast)
      </h3>
      <div className="space-y-3">
        {data.map(d => {
          const percentage = (d.value / max) * 100

          return (
            <div key={d.label} className="flex items-center gap-4">
              {/* Label */}
              <div className="w-28 text-sm text-slate-600 dark:text-slate-300">
                {d.label}
              </div>

              {/* Bar container */}
              <div className="flex-1 relative h-5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className={`absolute left-0 top-0 h-full bg-gradient-to-r ${getBarColor(d.value)} rounded-full transition-all duration-1000 ease-out`}
                  style={{
                    width: animate ? `${percentage}%` : '0%',
                  }}
                  title={`${d.value}%`}
                />
              </div>

              {/* Percentage */}
              <div className="w-12 text-sm text-right font-medium text-slate-700 dark:text-slate-100">
                {d.value}%
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
