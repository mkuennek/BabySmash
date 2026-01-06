import './style.css'

// ============================================================================
// Audio System - Web Audio API for synthesized sounds
// ============================================================================

let audioContext: AudioContext | null = null

// Initialize audio context on first user interaction
async function getAudioContext(): Promise<AudioContext> {
  if (!audioContext) {
    audioContext = new AudioContext()
  }
  // Resume if suspended (browser autoplay policy)
  if (audioContext.state === 'suspended') {
    await audioContext.resume()
  }
  return audioContext
}

// Musical notes for letters (C major scale extended)
const LETTER_FREQUENCIES: Record<string, number> = {
  a: 261.63, // C4
  b: 293.66, // D4
  c: 329.63, // E4
  d: 349.23, // F4
  e: 392.00, // G4
  f: 440.00, // A4
  g: 493.88, // B4
  h: 523.25, // C5
  i: 587.33, // D5
  j: 659.25, // E5
  k: 698.46, // F5
  l: 783.99, // G5
  m: 880.00, // A5
  n: 987.77, // B5
  o: 1046.50, // C6
  p: 1174.66, // D6
  q: 1318.51, // E6
  r: 1396.91, // F6
  s: 1567.98, // G6
  t: 1760.00, // A6
  u: 1975.53, // B6
  v: 523.25, // C5
  w: 587.33, // D5
  x: 659.25, // E5
  y: 698.46, // F5
  z: 783.99, // G5
}

// Play a pleasant tone for letters
async function playLetterSound(letter: string): Promise<void> {
  const ctx = await getAudioContext()
  const frequency = LETTER_FREQUENCIES[letter.toLowerCase()] || 440

  const oscillator = ctx.createOscillator()
  const gainNode = ctx.createGain()

  oscillator.connect(gainNode)
  gainNode.connect(ctx.destination)

  oscillator.type = 'sine'
  oscillator.frequency.setValueAtTime(frequency, ctx.currentTime)

  // Gentle attack and decay for a pleasing sound
  gainNode.gain.setValueAtTime(0, ctx.currentTime)
  gainNode.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.05)
  gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4)

  oscillator.start(ctx.currentTime)
  oscillator.stop(ctx.currentTime + 0.4)
}

// Play a fun xylophone-like tone for numbers
async function playNumberSound(num: string): Promise<void> {
  const ctx = await getAudioContext()
  // Map numbers 0-9 to a pentatonic scale for pleasant sounds
  const pentatonic = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25, 783.99, 880.00]
  const frequency = pentatonic[parseInt(num)] || 440

  const oscillator = ctx.createOscillator()
  const gainNode = ctx.createGain()

  oscillator.connect(gainNode)
  gainNode.connect(ctx.destination)

  oscillator.type = 'triangle'
  oscillator.frequency.setValueAtTime(frequency, ctx.currentTime)

  // Quick attack, medium decay for xylophone effect
  gainNode.gain.setValueAtTime(0, ctx.currentTime)
  gainNode.gain.linearRampToValueAtTime(0.4, ctx.currentTime + 0.02)
  gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5)

  oscillator.start(ctx.currentTime)
  oscillator.stop(ctx.currentTime + 0.5)
}

// Play a fun "bloop" sound for shapes
async function playShapeSound(): Promise<void> {
  const ctx = await getAudioContext()

  // Random frequency in a fun range
  const baseFreq = 200 + Math.random() * 300

  const oscillator = ctx.createOscillator()
  const gainNode = ctx.createGain()

  oscillator.connect(gainNode)
  gainNode.connect(ctx.destination)

  oscillator.type = 'square'
  
  // Frequency sweep for a "bloop" effect
  oscillator.frequency.setValueAtTime(baseFreq * 1.5, ctx.currentTime)
  oscillator.frequency.exponentialRampToValueAtTime(baseFreq, ctx.currentTime + 0.1)

  gainNode.gain.setValueAtTime(0, ctx.currentTime)
  gainNode.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.02)
  gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3)

  oscillator.start(ctx.currentTime)
  oscillator.stop(ctx.currentTime + 0.3)
}

// ============================================================================
// Confetti System
// ============================================================================

const CONFETTI_COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
  '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
  '#F8B500', '#00D4AA', '#FF69B4', '#00CED1', '#FFD700',
]

const CONFETTI_COUNT = 15 // Number of confetti particles per key press

interface ConfettiParticle {
  element: HTMLDivElement
  x: number
  y: number
  vx: number
  vy: number
  rotation: number
  rotationSpeed: number
  scale: number
  opacity: number
}

// Create a single confetti particle
function createConfettiParticle(originX: number, originY: number): ConfettiParticle {
  const element = document.createElement('div')
  element.className = 'confetti'
  
  // Random color
  const color = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)]!
  
  // Random shape (rectangle or square)
  const width = 8 + Math.random() * 8
  const height = Math.random() > 0.5 ? width : width * 2
  
  element.style.width = `${width}px`
  element.style.height = `${height}px`
  element.style.backgroundColor = color
  element.style.left = `${originX}px`
  element.style.top = `${originY}px`
  
  return {
    element,
    x: originX,
    y: originY,
    vx: (Math.random() - 0.5) * 15, // Random horizontal velocity
    vy: -8 - Math.random() * 10, // Initial upward velocity
    rotation: Math.random() * 360,
    rotationSpeed: (Math.random() - 0.5) * 15,
    scale: 0.5 + Math.random() * 0.5,
    opacity: 1,
  }
}

// Animate confetti particles
function animateConfetti(particles: ConfettiParticle[]): void {
  const gravity = 0.4
  const friction = 0.99
  const fadeRate = 0.015
  
  function update(): void {
    let activeCount = 0
    
    for (const particle of particles) {
      if (particle.opacity <= 0) continue
      
      activeCount++
      
      // Apply physics
      particle.vy += gravity
      particle.vx *= friction
      particle.x += particle.vx
      particle.y += particle.vy
      particle.rotation += particle.rotationSpeed
      particle.opacity -= fadeRate
      
      // Update element position
      particle.element.style.transform = `translate(-50%, -50%) rotate(${particle.rotation}deg) scale(${particle.scale})`
      particle.element.style.left = `${particle.x}px`
      particle.element.style.top = `${particle.y}px`
      particle.element.style.opacity = String(Math.max(0, particle.opacity))
    }
    
    if (activeCount > 0) {
      requestAnimationFrame(update)
    } else {
      // Clean up particles when animation is done
      for (const particle of particles) {
        particle.element.remove()
      }
    }
  }
  
  requestAnimationFrame(update)
}

// Spawn confetti at a given position
function spawnConfetti(originX: number, originY: number): void {
  const app = document.querySelector<HTMLDivElement>('#app')!
  const particles: ConfettiParticle[] = []
  
  for (let i = 0; i < CONFETTI_COUNT; i++) {
    const particle = createConfettiParticle(originX, originY)
    particles.push(particle)
    app.appendChild(particle.element)
  }
  
  animateConfetti(particles)
}

// Spawn confetti at a random position on screen
function spawnConfettiRandom(): void {
  const x = 100 + Math.random() * (window.innerWidth - 200)
  const y = 100 + Math.random() * (window.innerHeight - 200)
  spawnConfetti(x, y)
}

// ============================================================================
// Visual Display System
// ============================================================================

// Configuration
const MAX_ELEMENTS = 30 // Clear screen after this many elements

// Baby-friendly color palette - bright, high-contrast colors
const COLORS = [
  '#FF6B6B', // Red
  '#4ECDC4', // Teal
  '#45B7D1', // Sky Blue
  '#96CEB4', // Sage Green
  '#FFEAA7', // Yellow
  '#DDA0DD', // Plum
  '#98D8C8', // Mint
  '#F7DC6F', // Gold
  '#BB8FCE', // Purple
  '#85C1E9', // Light Blue
  '#F8B500', // Orange
  '#00D4AA', // Turquoise
]

// Shape types for non-letter/number keys
type ShapeType = 'circle' | 'square' | 'triangle' | 'star'

const SHAPES: ShapeType[] = ['circle', 'square', 'triangle', 'star']

interface DisplayedElement {
  element: HTMLDivElement
  createdAt: number
}

const displayedElements: DisplayedElement[] = []

// Clear all elements from the screen with a fade-out effect
function clearAllElements(): void {
  const app = document.querySelector<HTMLDivElement>('#app')!
  
  // Add fade-out class to all elements
  displayedElements.forEach(({ element }) => {
    element.classList.add('fade-out')
  })
  
  // Remove elements after animation completes
  setTimeout(() => {
    displayedElements.forEach(({ element }) => {
      if (element.parentNode === app) {
        app.removeChild(element)
      }
    })
    displayedElements.length = 0 // Clear the array
  }, 500) // Match the CSS animation duration
}

// Check if we need to clear the screen
function checkAndClearScreen(): void {
  if (displayedElements.length >= MAX_ELEMENTS) {
    clearAllElements()
  }
}

// Get a random color from the palette
function getRandomColor(): string {
  return COLORS[Math.floor(Math.random() * COLORS.length)]!
}

// Get a random position on the screen
function getRandomPosition(): { x: number; y: number } {
  const padding = 100 // Keep letters away from edges
  const x = padding + Math.random() * (window.innerWidth - padding * 2)
  const y = padding + Math.random() * (window.innerHeight - padding * 2)
  return { x, y }
}

// Get a random font size for variety
function getRandomFontSize(): number {
  return 80 + Math.floor(Math.random() * 120) // 80px to 200px
}

// Get a random rotation for visual interest
function getRandomRotation(): number {
  return -30 + Math.random() * 60 // -30 to 30 degrees
}

// Get a random shape type
function getRandomShape(): ShapeType {
  return SHAPES[Math.floor(Math.random() * SHAPES.length)]!
}

// Get a random size for shapes (similar to font size for consistency)
function getRandomShapeSize(): number {
  return 80 + Math.floor(Math.random() * 120) // 80px to 200px
}

// Create an SVG element for a shape
function createShapeSVG(shapeType: ShapeType, size: number, color: string): SVGSVGElement {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  svg.setAttribute('width', String(size))
  svg.setAttribute('height', String(size))
  svg.setAttribute('viewBox', '0 0 100 100')
  svg.style.overflow = 'visible'

  let shapeElement: SVGElement

  switch (shapeType) {
    case 'circle':
      shapeElement = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
      shapeElement.setAttribute('cx', '50')
      shapeElement.setAttribute('cy', '50')
      shapeElement.setAttribute('r', '45')
      break

    case 'square':
      shapeElement = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
      shapeElement.setAttribute('x', '5')
      shapeElement.setAttribute('y', '5')
      shapeElement.setAttribute('width', '90')
      shapeElement.setAttribute('height', '90')
      shapeElement.setAttribute('rx', '5')
      break

    case 'triangle':
      shapeElement = document.createElementNS('http://www.w3.org/2000/svg', 'polygon')
      shapeElement.setAttribute('points', '50,5 95,95 5,95')
      break

    case 'star':
      shapeElement = document.createElementNS('http://www.w3.org/2000/svg', 'polygon')
      // 5-pointed star
      const outerRadius = 45
      const innerRadius = 20
      const centerX = 50
      const centerY = 50
      const points: string[] = []
      for (let i = 0; i < 10; i++) {
        const radius = i % 2 === 0 ? outerRadius : innerRadius
        const angle = (i * Math.PI) / 5 - Math.PI / 2
        const x = centerX + radius * Math.cos(angle)
        const y = centerY + radius * Math.sin(angle)
        points.push(`${x},${y}`)
      }
      shapeElement.setAttribute('points', points.join(' '))
      break
  }

  shapeElement.setAttribute('fill', color)
  shapeElement.setAttribute('stroke', 'rgba(255, 255, 255, 0.3)')
  shapeElement.setAttribute('stroke-width', '2')
  
  // Add drop shadow filter
  const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs')
  const filter = document.createElementNS('http://www.w3.org/2000/svg', 'filter')
  filter.setAttribute('id', 'shadow')
  filter.setAttribute('x', '-20%')
  filter.setAttribute('y', '-20%')
  filter.setAttribute('width', '140%')
  filter.setAttribute('height', '140%')
  
  const feDropShadow = document.createElementNS('http://www.w3.org/2000/svg', 'feDropShadow')
  feDropShadow.setAttribute('dx', '3')
  feDropShadow.setAttribute('dy', '3')
  feDropShadow.setAttribute('stdDeviation', '3')
  feDropShadow.setAttribute('flood-opacity', '0.3')
  
  filter.appendChild(feDropShadow)
  defs.appendChild(filter)
  svg.appendChild(defs)
  
  shapeElement.setAttribute('filter', 'url(#shadow)')
  svg.appendChild(shapeElement)

  return svg
}

// Display a shape on screen
function displayShape(): void {
  const app = document.querySelector<HTMLDivElement>('#app')!
  
  const position = getRandomPosition()
  const size = getRandomShapeSize()
  const color = getRandomColor()
  const rotation = getRandomRotation()
  const shapeType = getRandomShape()
  
  const shapeContainer = document.createElement('div')
  shapeContainer.className = 'shape'
  // Use left/top for positioning, CSS custom property for initial rotation
  shapeContainer.style.left = `${position.x}px`
  shapeContainer.style.top = `${position.y}px`
  shapeContainer.style.setProperty('--initial-rotation', `${rotation}deg`)
  
  const shapeSVG = createShapeSVG(shapeType, size, color)
  shapeContainer.appendChild(shapeSVG)
  
  app.appendChild(shapeContainer)
  
  displayedElements.push({
    element: shapeContainer,
    createdAt: Date.now(),
  })
  
  // Check if we need to clear the screen
  checkAndClearScreen()
}

// Display a character (letter or number) on screen
function displayCharacter(character: string, className: string): void {
  const app = document.querySelector<HTMLDivElement>('#app')!
  
  const position = getRandomPosition()
  const fontSize = getRandomFontSize()
  const color = getRandomColor()
  const rotation = getRandomRotation()
  
  const characterElement = document.createElement('div')
  characterElement.className = className
  characterElement.textContent = character.toUpperCase()
  // Use left/top for positioning, CSS custom property for initial rotation
  characterElement.style.left = `${position.x}px`
  characterElement.style.top = `${position.y}px`
  characterElement.style.fontSize = `${fontSize}px`
  characterElement.style.color = color
  characterElement.style.setProperty('--initial-rotation', `${rotation}deg`)
  characterElement.style.textShadow = `3px 3px 6px rgba(0, 0, 0, 0.3)`
  
  app.appendChild(characterElement)
  
  displayedElements.push({
    element: characterElement,
    createdAt: Date.now(),
  })
  
  // Check if we need to clear the screen
  checkAndClearScreen()
}

// Check if the pressed key is a letter
function isLetterKey(key: string): boolean {
  return /^[a-zA-Z]$/.test(key)
}

// Check if the pressed key is a number
function isNumberKey(key: string): boolean {
  return /^[0-9]$/.test(key)
}

// Handle keyboard events
function handleKeyDown(event: KeyboardEvent): void {
  // Prevent default browser behavior for all keys
  event.preventDefault()
  
  if (isLetterKey(event.key)) {
    displayCharacter(event.key, 'letter')
    playLetterSound(event.key)
    spawnConfettiRandom()
  } else if (isNumberKey(event.key)) {
    displayCharacter(event.key, 'number')
    playNumberSound(event.key)
    spawnConfettiRandom()
  } else if (event.key.length === 1 || isDisplayableKey(event.key)) {
    // Display shapes for other printable keys and special keys
    displayShape()
    playShapeSound()
    spawnConfettiRandom()
  }
}

// Check if a key should trigger a shape display
function isDisplayableKey(key: string): boolean {
  // List of special keys that should display shapes
  const displayableKeys = [
    'Enter', 'Space', 'Tab', 'Backspace', 'Delete',
    'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight',
    'Home', 'End', 'PageUp', 'PageDown',
    'Insert', 'Escape'
  ]
  return displayableKeys.includes(key)
}

// Initialize the app
function init(): void {
  const app = document.querySelector<HTMLDivElement>('#app')!
  app.innerHTML = '' // Clear the initial content
  app.className = 'baby-smash-container'
  
  // Add keyboard event listener
  document.addEventListener('keydown', handleKeyDown)
  
  // Focus the document to capture keyboard events
  document.body.focus()
}

// Start the app when DOM is ready
document.addEventListener('DOMContentLoaded', init)

// Also initialize immediately if DOM is already loaded
if (document.readyState !== 'loading') {
  init()
}
