# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a monorepo containing:
- **excalidraw/** - The main Excalidraw monorepo (React-based whiteboard library + web app)
- **excalidraw-desktop/** - Desktop application wrapper built with Tauri (Rust + vanilla JS)

## Directory Visualization

Always use `twig` with ignore patterns to exclude build artifacts and dependencies:

```bash
# Recommended twig usage - ignore common build/dependency directories
twig -i "node_modules,target,dist,build,cache,.cache,.next,coverage"

# With depth limit
twig --depth 3 -i "node_modules,target,dist,build,cache,.cache,.next,coverage"

# View only directories
twig --dirs-only -i "node_modules,target,dist,build,cache,.cache,.next,coverage"
```

**Directories to always ignore:**
- `node_modules` - Node.js dependencies
- `target` - Rust build artifacts
- `dist`, `build` - Compiled output
- `cache`, `.cache` - Cache directories
- `.next` - Next.js build
- `coverage` - Test coverage reports

## Excalidraw Monorepo Structure

### Core Packages (Dependency Order)
1. **@excalidraw/common** - Shared utilities, constants, helper functions
2. **@excalidraw/math** - 2D vector math, geometry operations (depends on common)
3. **@excalidraw/element** - Element-related logic and types (depends on common + math)
4. **@excalidraw/excalidraw** - Main React component library (depends on all above)
5. **@excalidraw/utils** - Additional utilities

### Applications
- **excalidraw-app/** - Full-featured web application (excalidraw.com) with collaboration, PWA support, end-to-end encryption
- **examples/** - Integration examples (NextJS, browser script)

### Development Environment
- Yarn workspaces for monorepo management
- TypeScript with strict configuration
- Vitest for testing (replaced Jest)
- ESBuild for package builds
- Vite for app builds
- React 19 with functional components and hooks

## Common Development Commands

### From Root Directory (excalidraw/)
```bash
# Testing
yarn test:app              # Run Vitest tests
yarn test:update           # Update test snapshots
yarn test:typecheck        # TypeScript type checking
yarn test:all              # Run all checks (typecheck, code, other, app tests)
yarn test:coverage         # Run tests with coverage
yarn test:ui               # Run tests with Vitest UI

# Building
yarn build:packages        # Build all core packages (common → math → element → excalidraw)
yarn build:app             # Build the web application
yarn build                 # Build both packages and app

# Development
yarn start                 # Start development server for web app
yarn start:example         # Build packages and start browser script example

# Code Quality
yarn fix                   # Auto-fix formatting and linting (prettier + eslint)
yarn fix:code              # Fix ESLint issues
yarn fix:other             # Fix Prettier issues
yarn test:code             # Lint code (ESLint)
yarn test:other            # Check formatting (Prettier)
```

### Individual Package Commands
```bash
# Build specific packages
yarn build:common          # Build @excalidraw/common
yarn build:math            # Build @excalidraw/math
yarn build:element         # Build @excalidraw/element
yarn build:excalidraw      # Build @excalidraw/excalidraw

# In a package directory (packages/excalidraw, packages/common, etc.)
yarn build:esm             # Build ES module output
yarn gen:types             # Generate TypeScript declarations
```

## Architecture Notes

### Package Dependencies
The packages have a clear dependency hierarchy:
- **common** has no internal dependencies
- **math** depends on **common**
- **element** depends on **common** and **math**
- **excalidraw** depends on **common**, **math**, and **element**

When making changes, build packages in order: `yarn build:packages` handles this automatically.

### Import Paths
The monorepo uses path aliases defined in `vitest.config.mts`:
- `@excalidraw/common` → `packages/common/src/index.ts`
- `@excalidraw/math` → `packages/math/src/index.ts`
- `@excalidraw/element` → `packages/element/src/index.ts`
- `@excalidraw/excalidraw` → `packages/excalidraw/index.tsx`
- `@excalidraw/utils` → `packages/utils/src/index.ts`

Deep imports work: `@excalidraw/math/types` → `packages/math/src/types.ts`

### Key Directories
- **packages/excalidraw/components/** - React UI components
- **packages/excalidraw/actions/** - User actions (toolbar, keyboard shortcuts)
- **packages/excalidraw/renderer/** - Canvas rendering logic
- **packages/excalidraw/scene/** - Scene management
- **packages/excalidraw/data/** - Data serialization/deserialization
- **packages/excalidraw/locales/** - i18n translations
- **excalidraw-app/collab/** - Real-time collaboration features
- **excalidraw-app/share/** - Shareable links functionality

## TypeScript & Code Standards

### From .github/copilot-instructions.md
- **TypeScript**: Use for all code; prefer implementations without allocation
- **Performance**: Trade RAM for CPU cycles when possible; prefer immutable data
- **React**: Functional components with hooks; follow hooks rules (no conditional hooks)
- **Math Types**: Always use the `Point` type from `packages/math/src/types.ts` instead of `{ x, y }`
- **Error Handling**: Use try/catch for async operations; implement error boundaries in React
- **Naming**: PascalCase for components/interfaces/types; camelCase for variables/functions/methods; ALL_CAPS for constants

### Testing Protocol
After making changes:
1. Run `yarn test:app` to verify tests pass
2. Fix any test failures
3. Update snapshots with `yarn test:update` if UI changes are intentional
4. Run `yarn test:typecheck` to ensure type safety

## Desktop Application (excalidraw-desktop/)

Built with Tauri v2:
- **src/** - Frontend (vanilla HTML/CSS/JS)
- **src-tauri/** - Rust backend
- Separate from the main Excalidraw monorepo
- Uses Tauri for native desktop features

## Build System Details

### Package Build Process
1. `rimraf dist` - Clean output directory
2. Build scripts (buildPackage.js/buildBase.js) - ESBuild compilation
3. `yarn gen:types` - Generate TypeScript declarations with `tsc`

### Output Structure
Each package produces:
- `dist/dev/` - Development build
- `dist/prod/` - Production build (optimized)
- `dist/types/` - TypeScript type declarations

### App Build
- Uses Vite for bundling
- PWA support via vite-plugin-pwa
- Environment variables: `VITE_APP_*` prefix

## Coverage Thresholds
Configured in `vitest.config.mts`:
- Lines: 60%
- Branches: 70%
- Functions: 63%
- Statements: 60%

## Release Process
```bash
yarn release          # Interactive release
yarn release:test     # Release with "test" tag
yarn release:next     # Release with "next" tag
yarn release:latest   # Release with "latest" tag
```

## Cleaning & Maintenance
```bash
yarn rm:build          # Remove all build artifacts
yarn rm:node_modules   # Remove all node_modules
yarn clean-install     # Clean install (remove node_modules + reinstall)
```
