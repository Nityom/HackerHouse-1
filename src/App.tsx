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
  const frame = { x: 600, y: 665, radius: 260 }
  const diameter = frame.radius * 2
  const scale = Math.max(diameter / image.width, diameter / image.height) * zoom
  const drawWidth = image.width * scale
  const drawHeight = image.height * scale
  const overflowX = Math.max(0, drawWidth - diameter)
  const overflowY = Math.max(0, drawHeight - diameter)
  const drawX = frame.x - drawWidth / 2 + position.x * (overflowX / 2)
  const drawY = frame.y - drawHeight / 2 + position.y * (overflowY / 2)

  context.save()
  context.beginPath()
  context.arc(frame.x, frame.y, frame.radius, 0, Math.PI * 2)
  context.clip()
  context.drawImage(image, drawX, drawY, drawWidth, drawHeight)
  context.restore()
}

function drawSpark(context: CanvasRenderingContext2D, x: number, y: number, size: number, color: string) {
  context.save()
  context.translate(x, y)
  context.fillStyle = color
  context.beginPath()
  context.moveTo(0, -size)
  context.lineTo(size * 0.22, -size * 0.22)
  context.lineTo(size, 0)
  context.lineTo(size * 0.22, size * 0.22)
  context.lineTo(0, size)
  context.lineTo(-size * 0.22, size * 0.22)
  context.lineTo(-size, 0)
  context.lineTo(-size * 0.22, -size * 0.22)
  context.closePath()
  context.fill()
  context.restore()
}

function drawPalm(context: CanvasRenderingContext2D, x: number, y: number, scale: number, color: string) {
  context.save()
  context.translate(x, y)
  context.scale(scale, scale)
  context.strokeStyle = color
  context.fillStyle = color
  context.lineWidth = 9
  context.lineCap = 'round'
  context.beginPath()
  context.moveTo(0, 120)
  context.quadraticCurveTo(-10, 55, 4, 0)
  context.stroke()
  for (let index = 0; index < 7; index += 1) {
    const angle = -Math.PI * 0.92 + index * (Math.PI * 0.82 / 6)
    context.save()
    context.rotate(angle)
    context.beginPath()
    context.ellipse(40, 0, 44, 10, 0, 0, Math.PI * 2)
    context.fill()
    context.restore()
  }
  context.restore()
}

function drawBrushLabel(
  context: CanvasRenderingContext2D,
  text: string,
  y: number,
  width: number,
  fill: string,
  textColor: string,
  fontSize: number,
) {
  const x = (CARD_WIDTH - width) / 2
  context.fillStyle = fill
  context.beginPath()
  context.moveTo(x - 18, y + 13)
  context.lineTo(x + 16, y)
  context.lineTo(x + width - 8, y + 7)
  context.lineTo(x + width + 20, y + 18)
  context.lineTo(x + width - 3, y + 72)
  context.lineTo(x + 12, y + 78)
  context.closePath()
  context.fill()
  context.fillStyle = textColor
  context.textAlign = 'center'
  fitText(context, text, width - 60, fontSize)
  context.fillText(text, CARD_WIDTH / 2, y + 59)
  context.textAlign = 'left'
}

function drawSticker(
  context: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  width: number,
  fill: string,
  angle: number,
) {
  context.save()
  context.translate(x, y)
  context.rotate(angle)
  context.fillStyle = '#052d25'
  context.fillRect(6, 7, width, 48)
  context.fillStyle = fill
  context.beginPath()
  context.moveTo(0, 4)
  context.lineTo(width - 9, 0)
  context.lineTo(width, 43)
  context.lineTo(8, 49)
  context.closePath()
  context.fill()
  context.fillStyle = fill === '#052d25' ? '#f3ead2' : '#052d25'
  context.textAlign = 'center'
  context.font = '900 25px "Arial Black", sans-serif'
  context.fillText(text, width / 2, 35)
  context.restore()
  context.textAlign = 'left'
}

function drawSunset(context: CanvasRenderingContext2D, x: number, y: number) {
  context.save()
  context.beginPath()
  context.rect(x - 92, y - 72, 184, 120)
  context.clip()
  context.fillStyle = '#f5b800'
  context.beginPath()
  context.arc(x, y, 53, Math.PI, 0)
  context.fill()
  context.strokeStyle = '#052d25'
  context.lineWidth = 7
  for (let line = 0; line < 5; line += 1) {
    context.beginPath()
    context.moveTo(x - 100, y + line * 17)
    for (let point = 0; point <= 10; point += 1) {
      context.lineTo(x - 100 + point * 20, y + line * 17 + (point % 2 ? 6 : 0))
    }
    context.stroke()
  }
  context.restore()
}

function drawBeachScene(
  context: CanvasRenderingContext2D,
  cream: string,
  green: string,
  pink: string,
  yellow: string,
) {
  context.save()
  roundedRect(context, 170, 402, 860, 535, 28)
  context.clip()

  const sky = context.createLinearGradient(0, 402, 0, 630)
  sky.addColorStop(0, '#f7df9b')
  sky.addColorStop(1, cream)
  context.fillStyle = sky
  context.fillRect(170, 402, 860, 245)

  context.fillStyle = yellow
  context.beginPath()
  context.arc(835, 548, 86, Math.PI, 0)
  context.fill()
  context.strokeStyle = pink
  context.lineWidth = 7
  context.beginPath()
  context.arc(835, 548, 99, Math.PI * 1.08, Math.PI * 1.92)
  context.stroke()

  context.fillStyle = '#157f7a'
  context.fillRect(170, 548, 860, 285)
  context.fillStyle = '#0b5f5a'
  context.beginPath()
  context.moveTo(170, 638)
  for (let point = 0; point <= 18; point += 1) {
    context.lineTo(170 + point * 50, 620 + (point % 2 ? 24 : 0))
  }
  context.lineTo(1030, 760)
  context.lineTo(170, 760)
  context.closePath()
  context.fill()
  context.fillStyle = green
  context.beginPath()
  context.moveTo(170, 724)
  for (let point = 0; point <= 18; point += 1) {
    context.lineTo(170 + point * 50, 705 + (point % 2 ? 18 : 0))
  }
  context.lineTo(1030, 842)
  context.lineTo(170, 842)
  context.closePath()
  context.fill()

  context.strokeStyle = cream
  context.lineWidth = 8
  context.lineCap = 'round'
  for (let wave = 0; wave < 5; wave += 1) {
    const waveY = 594 + wave * 58
    context.beginPath()
    for (let point = 0; point <= 20; point += 1) {
      const waveX = 180 + point * 44
      const y = waveY + Math.sin(point * 1.6 + wave) * 11
      if (point === 0) context.moveTo(waveX, y)
      else context.lineTo(waveX, y)
    }
    context.stroke()
  }

  context.fillStyle = '#e6c77f'
  context.beginPath()
  context.moveTo(170, 812)
  context.quadraticCurveTo(390, 765, 590, 835)
  context.quadraticCurveTo(825, 905, 1030, 802)
  context.lineTo(1030, 937)
  context.lineTo(170, 937)
  context.closePath()
  context.fill()
  context.strokeStyle = cream
  context.lineWidth = 12
  context.beginPath()
  context.moveTo(170, 810)
  context.quadraticCurveTo(390, 767, 590, 834)
  context.quadraticCurveTo(825, 900, 1030, 803)
  context.stroke()

  context.strokeStyle = green
  context.fillStyle = cream
  context.lineWidth = 5
  context.beginPath()
  context.moveTo(285, 540)
  context.lineTo(285, 655)
  context.stroke()
  context.beginPath()
  context.moveTo(287, 548)
  context.lineTo(367, 620)
  context.lineTo(287, 620)
  context.closePath()
  context.fill()
  context.stroke()
  context.fillStyle = pink
  context.beginPath()
  context.moveTo(260, 655)
  context.lineTo(375, 655)
  context.lineTo(350, 677)
  context.lineTo(282, 677)
  context.closePath()
  context.fill()

  context.save()
  context.translate(943, 765)
  context.rotate(0.2)
  context.fillStyle = yellow
  context.strokeStyle = green
  context.lineWidth = 6
  context.beginPath()
  context.ellipse(0, 0, 30, 137, 0, 0, Math.PI * 2)
  context.fill()
  context.stroke()
  context.strokeStyle = pink
  context.beginPath()
  context.moveTo(0, -100)
  context.quadraticCurveTo(-18, 0, 0, 104)
  context.stroke()
  context.restore()

  context.restore()
  context.strokeStyle = green
  context.lineWidth = 4
  roundedRect(context, 170, 402, 860, 535, 28)
  context.stroke()
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
  const cream = '#f3ead2'
  const green = '#052d25'
  const pink = '#ed2f70'
  const yellow = '#f5b800'
  const ink = '#102b27'

  context.fillStyle = green
  context.fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT)
  context.fillStyle = cream
  roundedRect(context, 26, 26, 1148, 1448, 70)
  context.fill()
  context.strokeStyle = yellow
  context.lineWidth = 6
  roundedRect(context, 40, 40, 1120, 1420, 58)
  context.stroke()
  context.strokeStyle = green
  context.lineWidth = 3
  roundedRect(context, 53, 53, 1094, 1394, 48)
  context.stroke()

  context.fillStyle = 'rgba(5, 45, 37, 0.18)'
  for (let dot = 0; dot < 240; dot += 1) {
    const x = 66 + ((dot * 83) % 1065)
    const y = 62 + ((dot * 137) % 1370)
    context.fillRect(x, y, dot % 5 === 0 ? 3 : 1.5, dot % 7 === 0 ? 3 : 1.5)
  }

  context.fillStyle = yellow
  context.save()
  context.translate(928, 240)
  context.rotate(-0.04)
  context.fillRect(-125, -42, 250, 76)
  context.restore()

  context.fillStyle = ink
  context.textAlign = 'center'
  context.font = '900 92px "Arial Black", sans-serif'
  context.fillText('HACKER', 515, 190)
  context.fillStyle = pink
  context.font = '900 108px "Arial Black", sans-serif'
  context.fillText('HOUSE', 535, 294)
  context.fillStyle = ink
  context.font = '900 78px "Arial Black", sans-serif'
  context.save()
  context.translate(915, 267)
  context.rotate(-0.06)
  context.fillText('GOA', 0, 0)
  context.restore()
  context.font = '600 27px "Avenir Next", sans-serif'
  context.fillStyle = green
  context.fillText('CODE · CONNECT · CHILL · REPEAT', 600, 342)
  context.textAlign = 'left'

  context.save()
  context.translate(139, 150)
  context.rotate(-0.09)
  context.fillStyle = cream
  context.strokeStyle = green
  context.lineWidth = 9
  context.fillRect(-72, -78, 154, 190)
  context.strokeRect(-72, -78, 154, 190)
  context.fillStyle = pink
  context.font = '900 34px "Arial Black", sans-serif'
  context.fillText('GOA', -52, -29)
  context.fillStyle = ink
  context.font = '800 21px "Arial Black", sans-serif'
  context.fillText('INDIA', -51, 1)
  drawPalm(context, 25, 10, 0.55, green)
  context.restore()

  context.save()
  context.translate(1004, 150)
  context.rotate(0.08)
  context.strokeStyle = green
  context.lineWidth = 4
  context.beginPath()
  context.arc(0, 0, 88, 0, Math.PI * 2)
  context.stroke()
  context.beginPath()
  context.arc(0, 0, 70, 0, Math.PI * 2)
  context.stroke()
  context.fillStyle = green
  context.textAlign = 'center'
  context.font = '800 17px "Arial Black", sans-serif'
  context.fillText('BUILT IN GOA', 0, -49)
  drawPalm(context, 0, -4, 0.42, green)
  context.font = '700 14px "Avenir Next", sans-serif'
  context.fillText('SHIP FROM PARADISE', 0, 62)
  context.restore()

  drawBeachScene(context, cream, green, pink, yellow)

  drawSpark(context, 266, 386, 17, yellow)
  drawSpark(context, 950, 390, 15, pink)
  drawSpark(context, 1080, 575, 13, yellow)
  drawSpark(context, 120, 690, 13, pink)
  drawPalm(context, 1044, 520, 1.05, green)
  drawPalm(context, 102, 570, 0.78, green)

  drawSticker(context, 'BUILD', 78, 760, 172, yellow, -0.09)
  drawSticker(context, 'SHIP', 93, 820, 172, pink, 0.04)
  drawSticker(context, 'REPEAT', 72, 880, 195, green, -0.04)
  context.save()
  context.translate(1016, 790)
  context.rotate(0.08)
  context.fillStyle = cream
  context.strokeStyle = green
  context.lineWidth = 5
  roundedRect(context, -105, -67, 210, 134, 8)
  context.fill()
  context.stroke()
  context.fillStyle = green
  context.textAlign = 'center'
  context.font = '900 25px "Arial Black", sans-serif'
  context.fillText("LET'S BUILD", 0, -20)
  context.fillText('SOMETHING', 0, 15)
  context.fillStyle = pink
  context.fillText('DOPE!', 0, 50)
  context.restore()
  context.fillStyle = pink
  context.font = '900 55px monospace'
  context.fillText('</>', 945, 930)
  drawSunset(context, 107, 1268)

  context.fillStyle = yellow
  context.beginPath()
  context.arc(600, 665, 281, 0, Math.PI * 2)
  context.fill()
  context.fillStyle = pink
  context.beginPath()
  context.arc(600, 665, 270, 0, Math.PI * 2)
  context.fill()
  context.fillStyle = '#dedede'
  context.beginPath()
  context.arc(600, 665, 258, 0, Math.PI * 2)
  context.fill()

  if (photo) {
    drawCoverPhoto(context, photo, position, zoom)
  } else {
    context.fillStyle = '#747474'
    context.beginPath()
    context.arc(600, 610, 88, 0, Math.PI * 2)
    context.fill()
    context.beginPath()
    context.moveTo(430, 820)
    context.quadraticCurveTo(445, 685, 535, 670)
    context.quadraticCurveTo(600, 735, 665, 670)
    context.quadraticCurveTo(755, 685, 770, 820)
    context.quadraticCurveTo(600, 900, 430, 820)
    context.fill()
    context.fillStyle = ink
    context.textAlign = 'center'
    context.font = '800 24px "Avenir Next", sans-serif'
    context.fillText('ADD YOUR PHOTO', 600, 900)
    context.textAlign = 'left'
  }

  const displayName = (name.trim() || 'YOUR NAME').toUpperCase()
  const displayRole = (role.trim() || 'FULL-STACK CURIOSITY').toUpperCase()
  drawBrushLabel(context, displayName, 948, 650, green, cream, 64)
  drawBrushLabel(context, displayRole, 1034, 510, yellow, ink, 33)

  context.fillStyle = 'rgba(243, 234, 210, 0.96)'
  context.strokeStyle = pink
  context.lineWidth = 3
  roundedRect(context, 165, 1135, 870, 190, 26)
  context.fill()
  context.stroke()
  context.fillStyle = pink
  context.beginPath()
  context.arc(215, 1192, 27, 0, Math.PI * 2)
  context.fill()
  context.fillStyle = green
  context.font = '800 18px "Avenir Next", sans-serif'
  context.fillText('BUILDER TITLE', 260, 1185)
  context.font = '900 29px "Arial Black", sans-serif'
  context.fillText(title.toUpperCase(), 260, 1225)
  context.fillStyle = yellow
  context.beginPath()
  context.arc(215, 1270, 27, 0, Math.PI * 2)
  context.fill()
  context.fillStyle = green
  context.font = '800 18px "Avenir Next", sans-serif'
  context.fillText('BASE CAMP', 260, 1263)
  context.font = '900 29px "Arial Black", sans-serif'
  context.fillText('GOA, INDIA · 2026', 260, 1303)

  drawPalm(context, 1000, 1190, 0.7, green)
  context.fillStyle = green
  context.fillRect(65, 1364, 1070, 3)
  context.fillStyle = pink
  context.save()
  context.translate(600, 1408)
  context.rotate(-0.025)
  context.fillRect(-275, -35, 550, 65)
  context.fillStyle = green
  context.textAlign = 'center'
  context.font = '900 32px "Arial Black", sans-serif'
  context.fillText('#FRAMEINGOA', 0, 10)
  context.restore()
  context.fillStyle = green
  context.textAlign = 'right'
  context.font = '800 18px "Avenir Next", sans-serif'
  context.fillText('BUILDER ID · HH-GOA-2026', 1110, 1440)
  context.fillStyle = green
  for (let bar = 0; bar < 18; bar += 1) {
    context.fillRect(78 + bar * 8, 1392, bar % 3 === 0 ? 5 : 2, 40)
  }
  context.textAlign = 'left'
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
        <h1>MAKE YOUR<br /><span>BUILDER ID.</span></h1>
        <p className="intro-copy"><strong>Code. Connect. Chill. Repeat.</strong><br />One photo, one badge, zero forms to submit. Your image never leaves this device.</p>
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
