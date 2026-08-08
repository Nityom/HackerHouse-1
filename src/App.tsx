import { useEffect, useRef, useState } from 'react'
import { Download, ImageUp, RefreshCw, Share2 } from 'lucide-react'
import './App.css'

const CARD_WIDTH = 1200
const CARD_HEIGHT = 1500
const SHARE_TEXT =
  'Goa mode: activated. I just made my HH Goa 2026 Builder ID. See you by the sea. #FrameInGoa'

type PhotoPosition = { x: number; y: number }

function roundedRect(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) {
  context.beginPath()
  context.roundRect(x, y, width, height, radius)
}

function fitText(
  context: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  startSize: number,
) {
  let size = startSize
  do {
    context.font = `900 ${size}px "Arial Black", sans-serif`
    size -= 2
  } while (context.measureText(text).width > maxWidth && size > 38)
}

function drawCoverPhoto(
  context: CanvasRenderingContext2D,
  image: HTMLImageElement,
  position: PhotoPosition,
  zoom: number,
) {
  const frame = { x: 72, y: 222, width: 1056, height: 780 }
  const scale = Math.max(frame.width / image.width, frame.height / image.height) * zoom
  const drawWidth = image.width * scale
  const drawHeight = image.height * scale
  const overflowX = Math.max(0, drawWidth - frame.width)
  const overflowY = Math.max(0, drawHeight - frame.height)
  const drawX = frame.x - overflowX / 2 + position.x * (overflowX / 2)
  const drawY = frame.y - overflowY / 2 + position.y * (overflowY / 2)

  context.save()
  roundedRect(context, frame.x, frame.y, frame.width, frame.height, 18)
  context.clip()
  context.drawImage(image, drawX, drawY, drawWidth, drawHeight)

  const shade = context.createLinearGradient(0, frame.y + 450, 0, frame.y + frame.height)
  shade.addColorStop(0, 'rgba(8, 12, 18, 0)')
  shade.addColorStop(1, 'rgba(8, 12, 18, .38)')
  context.fillStyle = shade
  context.fillRect(frame.x, frame.y, frame.width, frame.height)
  context.restore()
}

function drawCard(
  canvas: HTMLCanvasElement,
  photo: HTMLImageElement | null,
  name: string,
  role: string,
  title: string,
  position: PhotoPosition,
  zoom: number,
) {
  const context = canvas.getContext('2d')
  if (!context) return

  canvas.width = CARD_WIDTH
  canvas.height = CARD_HEIGHT
  context.fillStyle = '#f6f0df'
  context.fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT)

  context.fillStyle = '#0c38ed'
  context.fillRect(0, 0, CARD_WIDTH, 196)
  context.fillStyle = '#ff5b42'
  context.beginPath()
  context.arc(1085, 98, 230, 0, Math.PI * 2)
  context.fill()
  context.fillStyle = '#c9ff45'
  context.beginPath()
  context.arc(1085, 98, 154, 0, Math.PI * 2)
  context.fill()

  context.fillStyle = '#f6f0df'
  context.font = '900 54px "Arial Black", sans-serif'
  context.fillText('HACKER HOUSE', 70, 86)
  context.font = '700 30px "Arial Black", sans-serif'
  context.fillText('GOA · 2026', 73, 137)
  context.save()
  context.translate(992, 98)
  context.rotate(-0.11)
  context.fillStyle = '#101114'
  context.font = '900 36px "Arial Black", sans-serif'
  context.textAlign = 'center'
  context.fillText('BUILDER', 0, -8)
  context.fillText('PASS', 0, 38)
  context.restore()

  if (photo) {
    drawCoverPhoto(context, photo, position, zoom)
  } else {
    context.fillStyle = '#d8d1c0'
    roundedRect(context, 72, 222, 1056, 780, 18)
    context.fill()
    context.strokeStyle = '#101114'
    context.lineWidth = 4
    context.setLineDash([18, 16])
    roundedRect(context, 108, 258, 984, 708, 8)
    context.stroke()
    context.setLineDash([])
    context.fillStyle = '#101114'
    context.textAlign = 'center'
    context.font = '900 54px "Arial Black", sans-serif'
    context.fillText('YOUR FACE GOES HERE', 600, 600)
    context.font = '500 27px "Avenir Next", sans-serif'
    context.fillText('Portrait, landscape, off-centre - all welcome.', 600, 656)
    context.textAlign = 'left'
  }

  context.fillStyle = '#101114'
  context.fillRect(0, 1028, CARD_WIDTH, 472)
  context.fillStyle = '#c9ff45'
  context.font = '800 24px "Avenir Next", sans-serif'
  context.fillText('NAME / ALIAS', 72, 1084)

  const displayName = (name.trim() || 'YOUR NAME').toUpperCase()
  context.fillStyle = '#f6f0df'
  fitText(context, displayName, 1040, 100)
  context.fillText(displayName, 68, 1182)

  context.strokeStyle = '#f6f0df'
  context.globalAlpha = 0.28
  context.lineWidth = 2
  context.beginPath()
  context.moveTo(72, 1228)
  context.lineTo(1128, 1228)
  context.stroke()
  context.globalAlpha = 1

  context.fillStyle = '#ff5b42'
  context.font = '800 22px "Avenir Next", sans-serif'
  context.fillText('BUILDING WITH', 72, 1284)
  context.fillStyle = '#f6f0df'
  const displayRole = (role.trim() || 'FULL-STACK CURIOSITY').toUpperCase()
  fitText(context, displayRole, 610, 39)
  context.fillText(displayRole, 72, 1333)

  context.fillStyle = '#0c38ed'
  roundedRect(context, 744, 1251, 384, 112, 8)
  context.fill()
  context.fillStyle = '#c9ff45'
  context.font = '700 18px "Avenir Next", sans-serif'
  context.fillText('OFFICIAL BUILDER TITLE', 771, 1285)
  context.fillStyle = '#f6f0df'
  fitText(context, title, 330, 31)
  context.fillText(title.toUpperCase(), 771, 1334)

  context.fillStyle = '#f6f0df'
  context.font = '600 20px "Avenir Next", sans-serif'
  context.fillText('#FrameInGoa', 72, 1438)
  context.textAlign = 'right'
  context.fillText('15.046° N  ·  73.922° E', 1128, 1438)
  context.textAlign = 'left'
  for (let index = 0; index < 12; index += 1) {
    context.fillStyle = index % 3 === 0 ? '#ff5b42' : '#f6f0df'
    context.fillRect(465 + index * 22, 1418, index % 2 === 0 ? 8 : 14, 26)
  }
}

function canvasBlob(canvas: HTMLCanvasElement) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob)
      else reject(new Error('Could not create the image.'))
    }, 'image/png')
  })
}

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const dragRef = useRef<{ x: number; y: number; start: PhotoPosition } | null>(null)
  const [photo, setPhoto] = useState<HTMLImageElement | null>(null)
  const [photoName, setPhotoName] = useState('')
  const [name, setName] = useState('')
  const [role, setRole] = useState('')
  const [builderTitle, setBuilderTitle] = useState('SUNSET SHIPPER')
  const [position, setPosition] = useState<PhotoPosition>({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [error, setError] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    if (canvasRef.current) {
      drawCard(canvasRef.current, photo, name, role, builderTitle, position, zoom)
    }
  }, [photo, name, role, builderTitle, position, zoom])

  async function loadPhoto(file: File) {
    setError('')
    const hasImageExtension = /\.(jpe?g|png|heic|heif)$/i.test(file.name)
    if (!file.type.startsWith('image/') && !hasImageExtension) {
      setError('Choose a JPG, PNG, or HEIC image.')
      return
    }

    setIsProcessing(true)
    try {
      const isHeicCandidate = /\.(heic|heif)$/i.test(file.name) || /hei[cf]/i.test(file.type)
      let source: Blob = file
      if (isHeicCandidate) {
        const { heicTo, isHeic } = await import('heic-to')
        if (await isHeic(file)) {
          source = await heicTo({ blob: file, type: 'image/jpeg', quality: 0.9 })
        }
      }
      const url = URL.createObjectURL(source)
      const image = new Image()
      image.onload = () => {
        setPhoto(image)
        setPhotoName(file.name)
        setPosition({ x: 0, y: 0 })
        setZoom(1)
        setIsProcessing(false)
        URL.revokeObjectURL(url)
      }
      image.onerror = () => {
        URL.revokeObjectURL(url)
        setIsProcessing(false)
        setError('That photo could not be read. Try another image.')
      }
      image.src = url
    } catch {
      setIsProcessing(false)
      setError('That photo could not be converted. Try another image.')
    }
  }

  function downloadBlob(blob: Blob) {
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = `hh-goa-builder-${name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'id'}.png`
    document.body.appendChild(anchor)
    anchor.click()
    anchor.remove()
    window.setTimeout(() => URL.revokeObjectURL(url), 1000)
  }

  async function downloadCard() {
    if (!canvasRef.current) return
    downloadBlob(await canvasBlob(canvasRef.current))
  }

  async function shareCard() {
    if (!canvasRef.current) return
    const blob = await canvasBlob(canvasRef.current)
    const file = new File([blob], 'hh-goa-2026-builder-id.png', { type: 'image/png' })
    const shareData = { text: SHARE_TEXT, files: [file] }
    if (navigator.canShare?.(shareData)) {
      try {
        await navigator.share(shareData)
        return
      } catch (shareError) {
        if (shareError instanceof DOMException && shareError.name === 'AbortError') return
      }
    }
    downloadBlob(blob)
    window.open(`https://x.com/intent/post?text=${encodeURIComponent(SHARE_TEXT)}`, '_blank', 'noopener,noreferrer')
  }

  function randomizeTitle() {
    const first = ['SUNSET', 'COCONUT', 'MIDNIGHT', 'CHAOS', 'MONSOON', 'TURBO']
    const second = ['SHIPPER', 'ARCHITECT', 'HACKER', 'ALCHEMIST', 'DEBUGGER', 'PIRATE']
    setBuilderTitle(`${first[Math.floor(Math.random() * first.length)]} ${second[Math.floor(Math.random() * second.length)]}`)
  }

  function handlePointerMove(event: React.PointerEvent<HTMLCanvasElement>) {
    if (!dragRef.current || !photo) return
    const bounds = event.currentTarget.getBoundingClientRect()
    const deltaX = (event.clientX - dragRef.current.x) / bounds.width
    const deltaY = (event.clientY - dragRef.current.y) / bounds.height
    setPosition({
      x: Math.max(-1, Math.min(1, dragRef.current.start.x + deltaX * 3)),
      y: Math.max(-1, Math.min(1, dragRef.current.start.y + deltaY * 3.8)),
    })
  }

  return (
    <main>
      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="Hacker House Goa home">HH<span>/</span>GOA</a>
        <div className="event-mark"><span>BUILDER ID STATION</span><strong>2026</strong></div>
      </header>

      <section className="intro" id="top">
        <p className="eyebrow">HACKER HOUSE · GOA · 2026</p>
        <h1>MAKE YOUR<br />BUILDER ID.</h1>
        <p className="intro-copy">One photo. One badge. Zero forms to submit. Your image never leaves this device.</p>
      </section>

      <section className="studio" aria-label="Builder ID generator">
        <div className="controls">
          <div className="step-heading"><span>01</span><div><strong>DROP YOUR PHOTO</strong><small>JPG, PNG or iPhone HEIC</small></div></div>
          <button className="upload-zone" type="button" disabled={isProcessing} onClick={() => inputRef.current?.click()}>
            <span className="upload-symbol" aria-hidden="true"><ImageUp size={24} strokeWidth={2.5} /></span>
            <strong>{isProcessing ? 'READING PHOTO...' : photo ? 'CHANGE PHOTO' : 'CHOOSE A PHOTO'}</strong>
            <small>{isProcessing ? 'Converting iPhone photos locally' : photoName || 'Tap to browse your camera roll'}</small>
          </button>
          <input
            ref={inputRef}
            className="visually-hidden"
            type="file"
            accept="image/jpeg,image/png,image/heic,image/heif,.heic,.heif"
            onChange={(event) => {
              const file = event.target.files?.[0]
              if (file) loadPhoto(file)
            }}
          />
          {error && <p className="error" role="alert">{error}</p>}
          {photo && (
            <label className="zoom-control">
              <span>PHOTO ZOOM</span>
              <input type="range" min="1" max="2" step="0.01" value={zoom} onChange={(event) => setZoom(Number(event.target.value))} />
              <small>Drag the preview to reposition</small>
            </label>
          )}

          <div className="step-heading details-heading"><span>02</span><div><strong>MAKE IT YOURS</strong><small>Keep it short. Keep it loud.</small></div></div>
          <label className="text-field"><span>NAME / ALIAS</span><input value={name} maxLength={24} placeholder="e.g. Anya" onChange={(event) => setName(event.target.value)} /></label>
          <label className="text-field"><span>STACK / ROLE</span><input value={role} maxLength={32} placeholder="e.g. Rust + robotics" onChange={(event) => setRole(event.target.value)} /></label>
          <div className="text-field title-field">
            <label htmlFor="builder-title">BUILDER TITLE</label>
            <div><input id="builder-title" value={builderTitle} maxLength={28} onChange={(event) => setBuilderTitle(event.target.value)} /><button type="button" onClick={randomizeTitle} aria-label="Generate another builder title" title="Generate another title"><RefreshCw size={20} /></button></div>
          </div>
        </div>

        <div className="preview-column">
          <div className="preview-label"><span>LIVE OUTPUT</span><span>1200 × 1500 PNG</span></div>
          <div className="canvas-wrap">
            <canvas
              ref={canvasRef}
              onPointerDown={(event) => {
                if (!photo) return
                event.currentTarget.setPointerCapture(event.pointerId)
                dragRef.current = { x: event.clientX, y: event.clientY, start: position }
              }}
              onPointerMove={handlePointerMove}
              onPointerUp={() => { dragRef.current = null }}
              onPointerCancel={() => { dragRef.current = null }}
              aria-label="Preview of your HH Goa Builder ID"
            />
          </div>
          <div className="actions">
            <button className="download-button" type="button" onClick={downloadCard}><Download size={19} /> <span>DOWNLOAD PNG</span></button>
            <button className="share-button" type="button" onClick={shareCard}><Share2 size={19} /> <span>SHARE TO X</span></button>
          </div>
          <p className="share-note">On mobile, your finished image is passed directly to the share sheet with <strong>#FrameInGoa</strong> ready to post.</p>
        </div>
      </section>

      <footer><span>BUILT FOR THE BUILDERS</span><span>GOA, INDIA · 2026</span></footer>
    </main>
  )
}

export default App
