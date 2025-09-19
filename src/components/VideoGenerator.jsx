import React, { useRef, useState } from 'react'

export default function VideoGenerator() {
  const canvasRef = useRef()
  const recorderRef = useRef(null)
  const [recording, setRecording] = useState(false)
  const [blobUrl, setBlobUrl] = useState('')
  const [mediaFiles, setMediaFiles] = useState([])
  const [frameCount, setFrameCount] = useState(0)

  const canvasWidth = 640
  const canvasHeight = 360
  const fps = 30
  const imageDuration = 150

  function handleFileUpload(e) {
    const files = Array.from(e.target.files)
    const validFiles = files.filter(file =>
      file.type.startsWith('image/') || file.type.startsWith('video/')
    )
    setMediaFiles(validFiles)
    setBlobUrl('')
  }

  function drawWithAspect(ctx, media, canvas, zoom = 1) {
    const cw = canvas.width
    const ch = canvas.height
    const mw = media.videoWidth || media.width
    const mh = media.videoHeight || media.height

    const cr = cw / ch
    const mr = mw / mh

    let drawWidth, drawHeight, offsetX, offsetY

    if (mr > cr) {
      drawWidth = cw * zoom
      drawHeight = (cw / mr) * zoom
    } else {
      drawHeight = ch * zoom
      drawWidth = (ch * mr) * zoom
    }

    offsetX = (cw - drawWidth) / 2
    offsetY = (ch - drawHeight) / 2

    ctx.drawImage(media, offsetX, offsetY, drawWidth, drawHeight)
  }

  async function startRecording() {
    const canvas = canvasRef.current
    if (!canvas) return alert('Canvas not ready')

    if (mediaFiles.length === 0) return alert('Upload at least one photo or video')

    const ctx = canvas.getContext('2d')
    ctx.textBaseline = 'top'

    const stream = canvas.captureStream(fps)
    let recorder

    try {
      recorder = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp9' })
    } catch (e) {
      try {
        recorder = new MediaRecorder(stream)
      } catch (e2) {
        alert('MediaRecorder not supported in this browser')
        return
      }
    }

    const chunks = []
    recorder.ondataavailable = e => chunks.push(e.data)
    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'video/webm' })
      const url = URL.createObjectURL(blob)
      setBlobUrl(url)
    }

    recorder.start()
    recorderRef.current = recorder
    setRecording(true)
    setFrameCount(0)

    let current = 0

    const drawMedia = async () => {
      if (current >= mediaFiles.length) {
        stopRecording()
        return
      }

      const file = mediaFiles[current]

      if (file.type.startsWith('image/')) {
        const img = new Image()
        img.src = URL.createObjectURL(file)
        await img.decode()

        let frame = 0

        const animateImage = () => {
          if (frame++ > imageDuration) {
            current++
            drawMedia()
            return
          }

          ctx.clearRect(0, 0, canvas.width, canvas.height)

          // Zoom & fade
          const zoom = 1 + (frame / imageDuration) * 0.1
          const alpha =
            frame < 15
              ? frame / 15
              : frame > imageDuration - 15
              ? (imageDuration - frame) / 15
              : 1

          ctx.globalAlpha = alpha
          drawWithAspect(ctx, img, canvas, zoom)

          // Optional text overlay
          ctx.globalAlpha = 1
          ctx.font = '24px sans-serif'
          ctx.fillStyle = 'white'
          ctx.shadowColor = 'rgba(0,0,0,0.5)'
          ctx.shadowBlur = 8
          ctx.fillText(`Post ${current + 1}`, 30, canvas.height - 40)
          ctx.shadowBlur = 0

          setFrameCount(f => f + 1)
          requestAnimationFrame(animateImage)
        }

        animateImage()
      } else if (file.type.startsWith('video/')) {
        const video = document.createElement('video')
        video.src = URL.createObjectURL(file)
        video.muted = true
        await video.play()

        let frames = 0
        const maxFrames = imageDuration

        const drawVideo = () => {
          if (frames++ >= maxFrames) {
            video.pause()
            current++
            drawMedia()
            return
          }

          ctx.clearRect(0, 0, canvas.width, canvas.height)
          drawWithAspect(ctx, video, canvas, 1)
          setFrameCount(f => f + 1)
          requestAnimationFrame(drawVideo)
        }

        drawVideo()
      }
    }

    drawMedia()
  }

  function stopRecording() {
    const r = recorderRef.current
    if (r && r.state !== 'inactive') r.stop()
    setRecording(false)
  }

  return (
    <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-md space-y-6 max-w-xl mx-auto">
      <h2 className="text-lg font-semibold text-slate-800 dark:text-white">
        🎬 Animated Video Generator
      </h2>

      <p className="text-sm text-slate-600 dark:text-slate-300">
        Upload photos or videos, and generate a beautiful animated clip with smooth zoom, fade, and proper aspect ratio.
      </p>

      {/* File Upload */}
      <input
        type="file"
        accept="image/*,video/*"
        multiple
        onChange={handleFileUpload}
        className="block text-sm text-slate-600 dark:text-slate-200 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
      />

      {/* Media Thumbnails */}
      {mediaFiles.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
          {mediaFiles.map((file, idx) => (
            <div key={idx} className="text-xs text-slate-700 dark:text-slate-200">
              {file.type.startsWith('image') ? (
                <img src={URL.createObjectURL(file)} className="rounded w-full h-28 object-cover" />
              ) : (
                <video src={URL.createObjectURL(file)} className="rounded w-full h-28 object-cover" />
              )}
              <div className="truncate">{file.name}</div>
            </div>
          ))}
        </div>
      )}

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        width={canvasWidth}
        height={canvasHeight}
        className="w-full max-w-full border border-slate-200 dark:border-slate-700 rounded shadow"
      />

      {recording && (
        <div className="text-sm text-slate-500">
          Recording... <span className="text-teal-500 font-semibold">Frame {frameCount}</span>
        </div>
      )}

      {/* Buttons */}
      <div className="flex flex-wrap items-center gap-4">
        <button
          onClick={startRecording}
          className="px-4 py-2 rounded bg-teal-500 hover:bg-teal-600 text-white font-medium disabled:opacity-50"
          disabled={recording || mediaFiles.length === 0}
        >
          ▶ Start Recording
        </button>

        <button
          onClick={stopRecording}
          className="px-4 py-2 rounded border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50"
          disabled={!recording}
        >
          ⏹ Stop
        </button>

        {blobUrl && (
          <a
            href={blobUrl}
            download="animated-clip.webm"
            className="px-4 py-2 rounded border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-700"
          >
            ⬇ Download Clip
          </a>
        )}
      </div>

      {/* Preview */}
      {blobUrl && (
        <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
          <h3 className="text-sm font-medium text-slate-800 dark:text-slate-100 mb-2">📺 Preview</h3>
          <video src={blobUrl} controls className="w-full rounded shadow" />
        </div>
      )}
    </div>
  )
}
