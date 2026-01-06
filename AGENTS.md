# AGENTS.md - BabySmash

This document provides guidance for AI coding agents working in this repository.

## Project Overview

BabySmash is a web-based educational application for babies and toddlers. When a child presses keys, clicks, or taps the screen, colorful letters, numbers, and shapes appear with sounds and animations. The app blocks harmful keyboard shortcuts while providing secret parent controls.

**Tech Stack:**
- TypeScript 5.x with strict mode
- Vite 7.x (build tool and dev server)
- Bun (JavaScript runtime and package manager)
- Vanilla TypeScript (no framework)
- CSS3 with custom properties

## Build/Lint/Test Commands

### Package Management
```bash
bun install          # Install dependencies
```

### Development
```bash
bun run dev          # Start dev server on http://localhost:5173
bun run build        # Build for production (outputs to /dist)
bun run preview      # Preview production build
```

### Type Checking
```bash
bunx tsc --noEmit    # Type check without emitting files
```

### Linting/Formatting
No linter or formatter is currently configured. If adding one:
- Prefer Biome or ESLint with TypeScript support
- Configure no-semicolons and single quotes to match existing style

### Testing
No test framework is currently configured. If adding one:
- Prefer Vitest (integrates well with Vite)
- Run single test: `bunx vitest run path/to/file.test.ts`
- Run tests in watch mode: `bunx vitest`

## Project Structure

```
BabySmash/
├── src/                    # Source code
│   ├── main.ts             # Application entry point
│   ├── style.css           # Global styles
│   └── vite-env.d.ts       # Vite type declarations
├── dist/                   # Build output (gitignored)
├── index.html              # HTML entry point (Vite convention)
├── package.json            # Package configuration
├── tsconfig.json           # TypeScript configuration
└── vite.config.ts          # Vite configuration
```

## Code Style Guidelines

### TypeScript Configuration

The project uses strict TypeScript. Key settings in `tsconfig.json`:
- `strict: true` - All strict type checking enabled
- `noUncheckedIndexedAccess: true` - Array/object access returns `T | undefined`
- `noFallthroughCasesInSwitch: true` - Require break/return in switch cases
- `noImplicitOverride: true` - Require `override` keyword
- `verbatimModuleSyntax: true` - Use `import type` for type-only imports

### Formatting

- **Indentation:** 2 spaces
- **Semicolons:** No trailing semicolons
- **Quotes:** Single quotes for strings
- **Trailing commas:** Use in objects/arrays
- **Line length:** No strict limit, but keep readable

### Imports

```typescript
// Style imports (side-effect only)
import './style.css'

// Named imports with destructuring
import { defineConfig } from 'vite'

// Type imports (required by verbatimModuleSyntax)
import type { SomeType } from './types'
```

### Naming Conventions

| Element | Convention | Example |
|---------|------------|---------|
| Files | kebab-case | `audio-manager.ts` |
| Classes | PascalCase | `AudioManager` |
| Functions | camelCase | `playSound()` |
| Variables | camelCase | `elementCount` |
| Constants | SCREAMING_SNAKE_CASE | `MAX_ELEMENTS` |
| Types/Interfaces | PascalCase | `GameConfig` |
| CSS classes | kebab-case | `.shape-container` |
| HTML IDs | kebab-case | `#app` |

### Type Patterns

```typescript
// Use generics for DOM queries
document.querySelector<HTMLDivElement>('#app')!

// Prefer interfaces for objects
interface GameConfig {
  maxElements: number
  soundEnabled: boolean
}

// Use type for unions/primitives
type ShapeType = 'circle' | 'square' | 'triangle' | 'star'
```

### Error Handling

- Use non-null assertions (`!`) only when element existence is guaranteed by HTML
- For runtime checks, prefer optional chaining and nullish coalescing
- Wrap async operations in try/catch with meaningful error messages

### CSS Conventions

- Use CSS custom properties for theming (`:root { --color-primary: ... }`)
- Mobile-first responsive design
- Use flexbox/grid for layouts
- Prefer `rem`/`em` for sizes, `vh`/`vw` for viewport-relative
- Dark mode default with `color-scheme: light dark`

## Architecture Notes

### Client-Side Only
The app runs entirely in the browser with no server dependencies. State is managed using local storage for preferences and in-memory state for game sessions.

### Event Handling
The app must capture and handle:
- Keyboard events (block harmful shortcuts, display letters/numbers)
- Mouse clicks (display shapes at click position)
- Touch events (multi-touch support for tablets)

### Performance
- Target 60fps for animations
- Use CSS animations/transitions where possible
- Use `requestAnimationFrame` for JavaScript animations

## Requirements Reference

See `Requirements.md` for the full feature specification.
