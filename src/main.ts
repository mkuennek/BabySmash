import './style.css'

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
  shapeContainer.style.left = `${position.x}px`
  shapeContainer.style.top = `${position.y}px`
  shapeContainer.style.transform = `translate(-50%, -50%) rotate(${rotation}deg)`
  
  const shapeSVG = createShapeSVG(shapeType, size, color)
  shapeContainer.appendChild(shapeSVG)
  
  app.appendChild(shapeContainer)
  
  displayedElements.push({
    element: shapeContainer,
    createdAt: Date.now(),
  })
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
  characterElement.style.left = `${position.x}px`
  characterElement.style.top = `${position.y}px`
  characterElement.style.fontSize = `${fontSize}px`
  characterElement.style.color = color
  characterElement.style.transform = `translate(-50%, -50%) rotate(${rotation}deg)`
  characterElement.style.textShadow = `3px 3px 6px rgba(0, 0, 0, 0.3)`
  
  app.appendChild(characterElement)
  
  displayedElements.push({
    element: characterElement,
    createdAt: Date.now(),
  })
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
  } else if (isNumberKey(event.key)) {
    displayCharacter(event.key, 'number')
  } else if (event.key.length === 1 || isDisplayableKey(event.key)) {
    // Display shapes for other printable keys and special keys
    displayShape()
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
