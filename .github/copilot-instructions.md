# Copilot Instructions for highlight-it

## Project Overview
This is a **browser-only** syntax highlighting library that provides a zero-config solution for web pages. It's designed with an engine-agnostic architecture, currently implementing Prism.js as the first engine. The entire library is distributed as a single script file loaded via CDN.

## Architecture Pattern: Engine Abstraction

The codebase follows a strict engine abstraction pattern to support multiple highlighting engines:

- **Base Layer**: [engines/base.ts](engines/base.ts) defines the abstract `BaseEngine` class with resource loading and dependency management
- **Engine Interface**: [type.ts](type.ts) defines `HighlightEngine` interface requiring `initialize()` and `highlight()` methods
- **Implementation**: [engines/prism/index.ts](engines/prism/index.ts) extends `BaseEngine` to implement Prism.js-specific logic
- **Entry Point**: [highlight-it.ts](highlight-it.ts) instantiates and orchestrates the engine

When adding new engines, extend `BaseEngine` and implement the `HighlightEngine` interface.

## Configuration System

The project uses a **declarative YAML configuration** ([engines/prism/config.yaml](engines/prism/config.yaml)) to manage:
- Theme mappings (built-in vs external CDN URLs)
- Plugin dependencies with cascade loading
- URL prefixes for resource loading

Configuration is parsed from URL query parameters in the script tag (see [utils.ts](utils.ts#L62-L95) `parseScriptParams()`):
- `theme` or `config`: Theme selection (defaults to 'prism')
- `darkmode`/`darkMode`: Dark mode theme override
- `verbose`: Enable debug logging

## Critical Build & Development Workflow

**Build**: `bun build highlight-it.ts --outdir ./dist/ --target browser --bundle --minify`
- Uses Bun bundler (not webpack/rollup) to create single-file browser bundle
- Target is explicitly `browser`, not node
- Outputs to `dist/` directory

**Development/Testing**: `bun run test` starts an http-server
- Serves HTML test files from `test/e2e/` directory
- Test files load the script via CDN URL with query parameters (see [test/e2e/highlight-it-params-test.html](test/e2e/highlight-it-params-test.html))
- No automated test suite; verify in browser manually

**Type Checking**: `bun run type-check` or `type-check:watch`
- Uses TypeScript for type safety but outputs plain JS bundle

## Module Resolution Convention

Uses `@/` path alias (configured in [tsconfig.json](tsconfig.json#L22-L24)) for all internal imports:
```typescript
import { PrismEngine } from '@/engines';
import { log, error as logError } from '@/utils';
```
Never use relative paths like `../` or `./` for cross-file imports.

## Resource Loading Pattern

The [engines/base.ts](engines/base.ts) implements a **singleton resource tracking system**:
- Static `loadedResources` Set prevents duplicate script/link loading
- `loadResource()` method handles dependency cascading (loads deps first, then parent)
- Resources are appended to `document.body` using `appendToBody()` utility

Example from [engines/prism/index.ts](engines/prism/index.ts#L85-L94): plugins declare dependencies in config.yaml, and the loader automatically resolves them.

## Browser-Only Guards

The codebase includes essential browser environment checks:
- [highlight-it.ts](highlight-it.ts#L9-L11): `typeof document === 'undefined'` guard
- [highlight-it.ts](highlight-it.ts#L14-L17): `window.__highlightItInitialized` prevents double initialization
- Prism.js manual mode: `window.Prism = { manual: true }` in [engines/prism/index.ts](engines/prism/index.ts#L23-L28)

## Code Style

Uses Biome (not ESLint/Prettier) for linting and formatting:
- 4-space indentation
- Single quotes for JS/TS
- 110 character line width
- Run via Biome VSCode extension or CLI

## Theme System Logic

[engines/prism/index.ts](engines/prism/index.ts#L49-L73) implements smart theme selection:
1. Checks `prefers-color-scheme: dark` media query
2. Tries darkMode theme if dark + darkMode param exists
3. Falls back to light theme if not dark mode
4. Supports both built-in (Prism CDN) and external (prism-themes CDN) themes
5. Defaults to basic 'prism' theme if not found

When adding themes, update [engines/prism/config.yaml](engines/prism/config.yaml) under `builtIn.themes` or `external.themes`.
