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

interface DisplayedLetter {
  element: HTMLDivElement
  createdAt: number
}

const displayedLetters: DisplayedLetter[] = []

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

// Display a letter on screen
function displayLetter(letter: string): void {
  const app = document.querySelector<HTMLDivElement>('#app')!
  
  const position = getRandomPosition()
  const fontSize = getRandomFontSize()
  const color = getRandomColor()
  const rotation = getRandomRotation()
  
  const letterElement = document.createElement('div')
  letterElement.className = 'letter'
  letterElement.textContent = letter.toUpperCase()
  letterElement.style.left = `${position.x}px`
  letterElement.style.top = `${position.y}px`
  letterElement.style.fontSize = `${fontSize}px`
  letterElement.style.color = color
  letterElement.style.transform = `translate(-50%, -50%) rotate(${rotation}deg)`
  letterElement.style.textShadow = `3px 3px 6px rgba(0, 0, 0, 0.3)`
  
  app.appendChild(letterElement)
  
  displayedLetters.push({
    element: letterElement,
    createdAt: Date.now(),
  })
}

// Check if the pressed key is a letter
function isLetterKey(key: string): boolean {
  return /^[a-zA-Z]$/.test(key)
}

// Handle keyboard events
function handleKeyDown(event: KeyboardEvent): void {
  // Prevent default browser behavior for all keys
  event.preventDefault()
  
  if (isLetterKey(event.key)) {
    displayLetter(event.key)
  }
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
