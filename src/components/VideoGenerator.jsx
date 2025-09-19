import React, { useRef, useState } from 'react';

export default function VideoGenerator() {
  const canvasRef = useRef();
  const recorderRef = useRef(null);
  const [recording, setRecording] = useState(false);
  const [blobUrl, setBlobUrl] = useState('');
  const [mediaFiles, setMediaFiles] = useState([]);
  const [frameCount, setFrameCount] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [progress, setProgress] = useState(0);

  const canvasWidth = 640;
  const canvasHeight = 360;
  const fps = 30;
  const imageDuration = 150;

  function handleFileUpload(e) {
    const files = Array.from(e.target.files);
    setError('');
    
    if (files.length === 0) return;

    // Validate file types and sizes
    const validFiles = files.filter(file => {
      if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
        setError('Please select only image or video files');
        return false;
      }
      if (file.size > 50 * 1024 * 1024) { // 50MB limit
        setError('File size must be less than 50MB');
        return false;
      }
      return true;
    });

    if (validFiles.length !== files.length) return;

    setMediaFiles(validFiles);
    setBlobUrl('');
    setSuccess(`${validFiles.length} file(s) uploaded successfully!`);
    setTimeout(() => setSuccess(''), 3000);
  }

  function drawWithAspect(ctx, media, canvas, zoom = 1) {
    const cw = canvas.width;
    const ch = canvas.height;
    const mw = media.videoWidth || media.width;
    const mh = media.videoHeight || media.height;

    const cr = cw / ch;
    const mr = mw / mh;

    let drawWidth, drawHeight, offsetX, offsetY;

    if (mr > cr) {
      drawWidth = cw * zoom;
      drawHeight = (cw / mr) * zoom;
    } else {
      drawHeight = ch * zoom;
      drawWidth = (ch * mr) * zoom;
    }

    offsetX = (cw - drawWidth) / 2;
    offsetY = (ch - drawHeight) / 2;

    ctx.drawImage(media, offsetX, offsetY, drawWidth, drawHeight);
  }

  async function startRecording() {
    const canvas = canvasRef.current;
    if (!canvas) {
      setError('Canvas not ready');
      return;
    }

    if (mediaFiles.length === 0) {
      setError('Please upload at least one photo or video');
      return;
    }

    setError('');
    setProgress(0);

    const ctx = canvas.getContext('2d');
    ctx.textBaseline = 'top';

    const stream = canvas.captureStream(fps);
    let recorder;

    try {
      // Try different codec options for better compatibility
      const codecOptions = [
        'video/webm;codecs=vp9',
        'video/webm;codecs=vp8',
        'video/webm',
        'video/mp4'
      ];

      for (const codec of codecOptions) {
        if (MediaRecorder.isTypeSupported(codec)) {
          recorder = new MediaRecorder(stream, { mimeType: codec });
          break;
        }
      }

      if (!recorder) {
        recorder = new MediaRecorder(stream);
      }
    } catch (e) {
      setError('MediaRecorder not supported in this browser');
      return;
    }

    const chunks = [];
    recorder.ondataavailable = e => chunks.push(e.data);
    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: recorder.mimeType });
      const url = URL.createObjectURL(blob);
      setBlobUrl(url);
      setSuccess('Video generated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    };

    recorder.start();
    recorderRef.current = recorder;
    setRecording(true);
    setFrameCount(0);

    let current = 0;
    const totalFiles = mediaFiles.length;

    const drawMedia = async () => {
      if (current >= totalFiles) {
        stopRecording();
        return;
      }

      setProgress(((current + 1) / totalFiles) * 100);
      const file = mediaFiles[current];

      try {
        if (file.type.startsWith('image/')) {
          const img = new Image();
          img.src = URL.createObjectURL(file);
          await img.decode();

          let frame = 0;

          const animateImage = () => {
            if (frame++ > imageDuration) {
              current++;
              drawMedia();
              return;
            }

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Zoom & fade effects
            const zoom = 1 + (frame / imageDuration) * 0.1;
            const alpha =
              frame < 15
                ? frame / 15
                : frame > imageDuration - 15
                ? (imageDuration - frame) / 15
                : 1;

            ctx.globalAlpha = alpha;
            drawWithAspect(ctx, img, canvas, zoom);

            // Text overlay with better styling
            ctx.globalAlpha = 1;
            ctx.font = 'bold 24px "Poppins", sans-serif';
            ctx.fillStyle = 'white';
            ctx.strokeStyle = 'rgba(0,0,0,0.8)';
            ctx.lineWidth = 3;
            ctx.shadowColor = 'rgba(0,0,0,0.5)';
            ctx.shadowBlur = 8;
            
            const text = `Media ${current + 1} of ${totalFiles}`;
            const textWidth = ctx.measureText(text).width;
            const x = canvas.width - textWidth - 30;
            const y = canvas.height - 50;
            
            ctx.strokeText(text, x, y);
            ctx.fillText(text, x, y);
            ctx.shadowBlur = 0;

            setFrameCount(f => f + 1);
            requestAnimationFrame(animateImage);
          };

          animateImage();
        } else if (file.type.startsWith('video/')) {
          const video = document.createElement('video');
          video.src = URL.createObjectURL(file);
          video.muted = true;
          
          await new Promise((resolve, reject) => {
            video.onloadeddata = resolve;
            video.onerror = reject;
            video.load();
          });
          
          await video.play();

          let frames = 0;
          const maxFrames = imageDuration;

          const drawVideo = () => {
            if (frames++ >= maxFrames) {
              video.pause();
              current++;
              drawMedia();
              return;
            }

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawWithAspect(ctx, video, canvas, 1);
            setFrameCount(f => f + 1);
            requestAnimationFrame(drawVideo);
          };

          drawVideo();
        }
      } catch (err) {
        console.error('Error processing media file:', err);
        setError(`Failed to process file: ${file.name}`);
        stopRecording();
      }
    };

    drawMedia();
  }

  function stopRecording() {
    const r = recorderRef.current;
    if (r && r.state !== 'inactive') {
      r.stop();
    }
    setRecording(false);
    setProgress(0);
  }

  function clearFiles() {
    setMediaFiles([]);
    setBlobUrl('');
    setError('');
    setSuccess('');
    setProgress(0);
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-4">
          <h2 className="text-2xl font-bold text-white flex items-center">
            🎬 Animated Video Generator
          </h2>
          <p className="text-purple-100 mt-1">
            Create smooth animated videos from your photos and clips
          </p>
        </div>

        <div className="p-6 space-y-6">
          {/* Status Messages */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              ⚠️ {error}
            </div>
          )}
          {success && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
              ✅ {success}
            </div>
          )}

          {/* File Upload */}
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-gray-400 transition-colors">
            <div className="text-4xl mb-4">📁</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Upload Media Files</h3>
            <p className="text-gray-600 mb-4">
              Select photos and videos to create your animated video
            </p>
            <input
              type="file"
              accept="image/*,video/*"
              multiple
              onChange={handleFileUpload}
              className="block mx-auto text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 cursor-pointer"
            />
            <p className="text-xs text-gray-500 mt-2">
              Support: JPG, PNG, MP4, WebM • Max 50MB per file
            </p>
          </div>

          {/* Media Preview Grid */}
          {mediaFiles.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800">
                  📋 Media Files ({mediaFiles.length})
                </h3>
                <button
                  onClick={clearFiles}
                  className="px-3 py-1 text-sm bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Clear All
                </button>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {mediaFiles.map((file, idx) => (
                  <div key={idx} className="group relative">
                    <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                      {file.type.startsWith('image') ? (
                        <img 
                          src={URL.createObjectURL(file)} 
                          alt={file.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200" 
                        />
                      ) : (
                        <video 
                          src={URL.createObjectURL(file)} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                          muted
                        />
                      )}
                      <div className="absolute top-2 right-2">
                        <span className="px-2 py-1 text-xs bg-black/70 text-white rounded-full">
                          {file.type.startsWith('image') ? '🖼️' : '🎥'}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 mt-1 truncate" title={file.name}>
                      {file.name}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Canvas Preview */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">🎥 Preview Canvas</h3>
            <div className="bg-gray-50 rounded-xl p-4 flex justify-center">
              <canvas
                ref={canvasRef}
                width={canvasWidth}
                height={canvasHeight}
                className="max-w-full h-auto border border-gray-300 rounded-lg shadow-sm bg-white"
              />
            </div>
          </div>

          {/* Recording Status */}
          {recording && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-blue-800 font-medium">🔴 Recording in progress...</span>
                <span className="text-blue-600 text-sm">Frame {frameCount}</span>
              </div>
              <div className="bg-blue-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="text-blue-700 text-sm mt-2">
                Progress: {Math.round(progress)}%
              </p>
            </div>
          )}

          {/* Control Buttons */}
          <div className="flex flex-wrap gap-4">
            <button
              onClick={startRecording}
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg font-semibold hover:from-green-600 hover:to-teal-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center"
              disabled={recording || mediaFiles.length === 0}
            >
              ▶️ Start Recording
            </button>

            <button
              onClick={stopRecording}
              className="px-6 py-3 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center"
              disabled={!recording}
            >
              ⏹️ Stop Recording
            </button>

            {blobUrl && (
              <a
                href={blobUrl}
                download={`animated-video-${Date.now()}.webm`}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-all duration-200 flex items-center"
              >
                ⬇️ Download Video
              </a>
            )}
          </div>

          {/* Generated Video Preview */}
          {blobUrl && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">📺 Generated Video</h3>
              <div className="bg-gray-50 rounded-xl p-4">
                <video 
                  src={blobUrl} 
                  controls 
                  className="w-full max-w-2xl mx-auto rounded-lg shadow-sm"
                  poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 640 360'%3E%3Crect width='640' height='360' fill='%23f3f4f6'/%3E%3Ctext x='320' y='180' text-anchor='middle' dy='0.35em' font-family='sans-serif' font-size='24' fill='%236b7280'%3EClick to play%3C/text%3E%3C/svg%3E"
                />
              </div>
            </div>
          )}

          {/* Tips */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-semibold text-yellow-800 mb-2">💡 Pro Tips</h4>
            <ul className="text-yellow-700 text-sm space-y-1">
              <li>• Upload 3-8 media files for best results</li>
              <li>• Use high-quality images (1080p or higher)</li>
              <li>• Videos will be automatically trimmed to ~5 seconds each</li>
              <li>• The final video includes smooth zoom and fade effects</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}