# React TypeScript Vite SCSS Scaffold

React project template with TypeScript, Vite build system, Hot Module Replacement, SCSS modules, routing, testing, and code quality tools.

## Features

- React 18 with TypeScript for type-safe development
- Vite for fast development server and optimized builds  
- Hot Module Replacement (HMR) for instant feedback
- SCSS modules with scoped styling and camelCase conversion
- React Router for client-side routing and navigation
- Vitest with React Testing Library for unit testing
- Prettier for consistent code formatting
- ESLint with Prettier integration for code quality
- Husky with lint-staged for automated git hooks
- Path aliases for clean import statements
- clsx utility for conditional class names
- Modern Sass syntax with @use instead of deprecated @import

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Button/         
│   │   ├── Button.tsx
│   │   ├── Button.module.scss
│   │   └── Button.test.tsx
│   ├── Counter/
│   │   ├── Counter.tsx
│   │   ├── Counter.module.scss
│   │   └── Counter.test.tsx
│   ├── Navigation/
│   │   ├── Navigation.tsx
│   │   └── Navigation.module.scss
│   └── Router/
│       └── AppRouter.tsx
├── pages/              # Page components for routing
│   ├── Home/
│   │   ├── Home.tsx
│   │   └── Home.module.scss
│   ├── About/
│   │   ├── About.tsx
│   │   └── About.module.scss
│   └── NotFound/
│       ├── NotFound.tsx
│       └── NotFound.module.scss
├── styles/             # Global styles and design tokens
│   ├── variables.scss  # SCSS variables and design system
│   └── index.scss      # Global styles and CSS reset
├── test/               # Test configuration and setup
│   └── setup.ts        # Vitest setup file
├── types/              # TypeScript type definitions
│   └── scss.d.ts       # SCSS module type declarations
├── utils/              # Utility functions and helpers
│   └── clsx.ts         # Class name utility wrapper
├── hooks/              # Custom React hooks
├── App.tsx             # Root application component
├── App.module.scss     # Application-level styles
└── main.tsx            # Application entry point
```

## Getting Started

### Prerequisites

```bash
node --version  # Requires Node.js 16+
npm --version   # or yarn/pnpm
```

### Installation

```bash
# Install dependencies
npm install

# Setup git hooks
npm run prepare

# Or using yarn
yarn install
yarn prepare

# Or using pnpm
pnpm install
pnpm prepare
```

### Development

```bash
# Start development server
npm run dev

# Server will start at http://localhost:3000
```

### Testing

```bash
# Run tests
npm run test

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage

# Watch mode (default)
npm run test
```

### Code Quality

```bash
# Run linter
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format

# Check formatting
npm run format:check
```

### Building

```bash
# Create production build
npm run build

# Preview production build
npm run preview
```

## Configuration

### Path Aliases

Configured path aliases for cleaner imports:

```
@/           -> src/
@/components -> src/components/
@/styles     -> src/styles/
@/utils      -> src/utils/
@/types      -> src/types/
@/pages      -> src/pages/
@/hooks      -> src/hooks/
```

Usage example:
```typescript
import Button from '@/components/Button/Button'
import { cn } from '@/utils/clsx'
import Home from '@/pages/Home/Home'
```

### SCSS Modules

SCSS modules provide scoped styling with automatic class name generation:

```scss
/* Button.module.scss */
.primary-button {
  background: blue;
}
```

```typescript
/* Button.tsx */
import styles from './Button.module.scss'
import { cn } from '@/utils/clsx'

// Class name becomes camelCase: styles.primaryButton
<button className={cn(styles.primaryButton, 'additional-class')}>
  Click
</button>
```

### Global SCSS Variables

All SCSS variables from `src/styles/variables.scss` are automatically available in component modules via Vite configuration.

### Routing

React Router v6 configured with:
- BrowserRouter for clean URLs
- Route definitions in AppRouter component
- Navigation component with active link highlighting
- 404 Not Found page

### Testing

Vitest configured with:
- React Testing Library for component testing
- jsdom environment for DOM simulation
- Global test utilities and mocks
- Coverage reporting with v8
- Path aliases support in tests

### Code Quality Tools

Automated code quality with:
- ESLint for code linting and error detection
- Prettier for consistent code formatting
- Husky for git hook management
- lint-staged for pre-commit validation

Git hooks automatically run:
- ESLint with auto-fix on TypeScript files
- Prettier formatting on all supported files
- Only on staged files for fast commits

## Available Scripts

```bash
npm run dev          # Start development server with HMR
npm run build        # TypeScript compilation + Vite build
npm run preview      # Preview production build locally
npm run test         # Run tests in watch mode
npm run test:ui      # Run tests with UI interface
npm run test:coverage # Run tests with coverage report
npm run lint         # Run ESLint on TypeScript files
npm run lint:fix     # Run ESLint with auto-fix
npm run format       # Format code with Prettier
npm run format:check # Check if code is formatted
npm run prepare      # Setup git hooks (runs automatically)
```

## Development Workflow

1. Component development with instant HMR feedback
2. SCSS modules for component-scoped styling
3. TypeScript for compile-time error checking
4. Unit testing with Vitest and React Testing Library
5. Automatic code formatting with Prettier
6. ESLint for code quality enforcement
7. Pre-commit hooks ensure code quality
8. React Router for page navigation

## Build Output

Production builds are optimized with:
- Tree shaking for minimal bundle size
- CSS extraction and minification
- TypeScript compilation with type checking
- Asset optimization and chunking
- Route-based code splitting ready

## Technology Stack

### Core
- React 18.2.0
- TypeScript 5.2.2
- Vite 5.0.8

### Styling
- Sass 1.69.5
- SCSS Modules
- clsx 2.0.0

### Routing
- React Router 6.20.1

### Testing
- Vitest 1.0.4
- React Testing Library 14.1.2
- jsdom 23.0.1

### Code Quality
- ESLint 8.55.0
- Prettier 3.1.1
- Husky 8.0.3
- lint-staged 15.2.0

## Notes

- Uses modern Sass @use syntax instead of deprecated @import
- SCSS variables include !default flags for overridability
- Vite config optimized for development experience
- TypeScript strict mode enforces best practices
- Git hooks prevent commits with linting or formatting issues
- Test setup includes common mocks for browser APIs
- Path aliases configured in both build and test environments
