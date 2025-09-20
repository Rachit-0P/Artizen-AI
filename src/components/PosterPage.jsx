import React, { useState, useRef, useEffect } from 'react'

const DEMO_IMAGE = '/demo.jpeg'

const EXAMPLES = [
  {
    title: '🎨 Art Expo Extravaganza',
    subtitle: 'Featuring: Bold & Emerging Artists #ArtLovers #CreativeVibes',
    bg: '#0ea5a4',
  },
  {
    title: '🎶 Summer Music Fest 2025',
    subtitle: 'Live Bands, DJs & Good Vibes Only! #FestivalSeason #MusicMagic',
    bg: '#f97316',
  },
  {
    title: '🚀 Tech Conference 2024',
    subtitle: 'Innovate, Inspire, Impact 💡 #FutureTech #InnovatorsUnite',
    bg: '#2563eb',
  },
  {
    title: '🧘‍♀️ Yoga & Wellness Retreat',
    subtitle: 'Find Your Inner Peace & Balance 🌿 #MindBodySoul #ZenLife',
    bg: '#10b981',
  },
  {
    title: '📚 Book Fair Bonanza',
    subtitle: 'Discover New Worlds & Stories 📖 #BookWorm #ReadMore',
    bg: '#8b5cf6',
  },
  {
    title: '🌟 Cosmic Film Festival',
    subtitle: 'Explore the Universe Through Cinema 🎬 #SpaceMovies #FilmLovers',
    bg: '#7c3aed',
  },
  {
    title: '🍔 Gourmet Food Truck Rally',
    subtitle: 'Taste the Best Street Eats in Town! 🚚 #FoodieHeaven #StreetEats',
    bg: '#ef4444',
  },
  {
    title: '🌸 Spring Garden Gala',
    subtitle: 'Celebrate Nature’s Beauty 🌷 #BloomBright #GardenParty',
    bg: '#22c55e',
  },
]


export default function PosterPage() {
  const [title, setTitle] = useState(EXAMPLES[0].title)
  const [subtitle, setSubtitle] = useState(EXAMPLES[0].subtitle)
  const [bg, setBg] = useState(EXAMPLES[0].bg)
  const [photo, setPhoto] = useState(null)
  const imgRef = useRef()

  function escapeXmlSafe(input) {
    const div = document.createElement('div')
    div.textContent = input
    return div.innerHTML
  }

  function generate() {
    const imageSrc = photo || DEMO_IMAGE

    const wrapText = (text, maxCharsPerLine) => {
      const words = text.split(' ')
      const lines = []
      let currentLine = ''

      for (const word of words) {
        if ((currentLine + ' ' + word).trim().length <= maxCharsPerLine) {
          currentLine += ' ' + word
        } else {
          lines.push(currentLine.trim())
          currentLine = word
        }
      }
      if (currentLine.trim()) lines.push(currentLine.trim())
      return lines
    }

    const titleLines = wrapText(title, 18)
    const subtitleLines = wrapText(subtitle, 30)

    const TITLE_LINE_HEIGHT = 76
    const SUBTITLE_LINE_HEIGHT = 44

    const titleTspans = titleLines
      .map((line, i) => `<tspan x="400" dy="${i === 0 ? 0 : TITLE_LINE_HEIGHT}">${escapeXmlSafe(line)}</tspan>`)
      .join('\n')

    const subtitleTspans = subtitleLines
      .map((line, i) => `<tspan x="400" dy="${i === 0 ? 0 : SUBTITLE_LINE_HEIGHT}">${escapeXmlSafe(line)}</tspan>`)
      .join('\n')

    const titleStartY = 160
    const subtitleStartY = titleStartY + titleLines.length * TITLE_LINE_HEIGHT
    const imageStartY = subtitleStartY + subtitleLines.length * SUBTITLE_LINE_HEIGHT + 40 // extra spacing
    const footerPadding = 60
    const imageHeight = 560
    const footerY = imageStartY + imageHeight + footerPadding
    const svgHeight = footerY + 80

    const photoSvg = `
      <rect x="120" y="${imageStartY}" width="560" height="${imageHeight}" fill="white"/>
      <rect x="128" y="${imageStartY + 8}" width="544" height="${imageHeight - 16}" fill="black"/>
      <image href="${imageSrc}" x="136" y="${imageStartY + 16}" width="528" height="${imageHeight - 32}" preserveAspectRatio="xMidYMid slice" />
    `

    const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='800' height='${svgHeight}'>
      <style>
        .title {
          font-family: 'Poppins', 'Inter', sans-serif;
          font-size: 72px;
          font-weight: 700;
          fill: white;
        }
        .subtitle {
          font-family: 'Poppins', 'Inter', sans-serif;
          font-size: 36px;
          font-weight: 500;
          fill: white;
        }
        .footer {
          font-family: 'Poppins', 'Inter', sans-serif;
          font-size: 28px;
          fill: white;
        }
      </style>
      <rect width='100%' height='100%' fill='#f8fafc'/>
      <rect x='40' y='40' width='720' height='${svgHeight - 80}' rx='24' fill='${bg}'/>

      <text x='400' y='${titleStartY}' text-anchor='middle' class='title'>${titleTspans}</text>
      <text x='400' y='${subtitleStartY}' text-anchor='middle' class='subtitle'>${subtitleTspans}</text>
      ${photoSvg}
      <text x='400' y='${footerY}' text-anchor='middle' class='footer'>Visit the show — Sat 7pm</text>
    </svg>`

    const url = 'data:image/svg+xml;utf8,' + encodeURIComponent(svg)
    if (imgRef.current) imgRef.current.src = url
  }


  function downloadSVG() {
    const a = document.createElement('a')
    a.href = imgRef.current.src
    a.download = 'poster.svg'
    a.click()
  }

  function downloadPNG() {
    const img = new Image()
    img.onload = () => {
      const c = document.createElement('canvas')
      c.width = img.width
      c.height = img.height
      const ctx = c.getContext('2d')
      ctx.drawImage(img, 0, 0)
      const url = c.toDataURL('image/png')
      const a = document.createElement('a')
      a.href = url
      a.download = 'poster.png'
      a.click()
    }
    img.crossOrigin = 'anonymous'
    img.src = imgRef.current.src
  }

  function handlePhotoUpload(e) {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      setPhoto(reader.result)
      setTimeout(() => generate(), 0) 
    }
    reader.readAsDataURL(file)
  }

  function applyExample(index) {
    const example = EXAMPLES[index]
    setTitle(example.title)
    setSubtitle(example.subtitle)
    setBg(example.bg)
    setPhoto(null) 
    setTimeout(() => generate(), 0)
  }

  useEffect(() => {
    generate()
  }, [])



  return (
    <div className='max-w-6xl mx-auto px-6 py-10'>
      <h1 className='text-3xl font-bold text-gray-800 mb-6'>🎨 Custom Poster Designer</h1>

      {/* Example Prompts */}
      <div className='mb-6'>
        <h2 className='text-lg font-semibold mb-2'>Try Example Prompts:</h2>
        <div className='flex flex-wrap gap-3'>
          {EXAMPLES.map((ex, i) => (
            <button
              key={i}
              onClick={() => applyExample(i)}
              className='px-3 py-1 rounded-md border border-gray-300 hover:bg-gray-100'
            >
              {ex.title}
            </button>
          ))}
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
        {/* Controls */}
        <div className='space-y-5'>
          <div>
            <label className='block text-sm font-medium text-gray-700'>Poster Title</label>
            <input
              className='mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-400'
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder='Enter main event title'
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700'>Subtitle</label>
            <input
              className='mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-400'
              value={subtitle}
              onChange={e => setSubtitle(e.target.value)}
              placeholder='Short subtitle or description'
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700'>Background Color</label>
            <input
              type='color'
              className='mt-1 w-16 h-10 p-1 rounded border'
              value={bg}
              onChange={e => setBg(e.target.value)}
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700'>Upload Center Image</label>
            <input type='file' accept='image/*' onChange={handlePhotoUpload} className='mt-2' />
            <p className='text-xs text-gray-500 pt-1'>Upload your own image to personalize the poster.</p>
          </div>

          {/* Action Buttons */}
          <div className='pt-4 flex flex-wrap gap-3'>
            <button
              onClick={generate}
              className='px-4 py-2 rounded-md bg-teal-500 text-white hover:bg-teal-600 transition'
            >
              🖼️ Generate Poster
            </button>
            <button
              onClick={downloadSVG}
              className='px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100'
            >
              ⬇️ Download SVG
            </button>
            <button
              onClick={downloadPNG}
              className='px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100'
            >
              ⬇️ Download PNG
            </button>
          </div>
        </div>

        {/* Poster Preview */}
        <div className='md:col-span-2'>
          <div className='bg-white p-5 rounded-xl shadow-lg border'>
            <div className='mb-3 text-gray-500 text-sm'>Live Preview</div>
            <img
              ref={imgRef}
              alt='poster preview'
              className='w-full rounded-lg border object-contain bg-slate-100'
              style={{ maxHeight: '720px' }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
