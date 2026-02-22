# Copilot Instructions for highlight-it

## Project Overview

This repo contains:

- A **browser-only Shiki loader** in [src/shiki-loader](src/shiki-loader) that can be built into a single script (public/shiki-loader.js) and dropped into any HTML page.
- A **Next.js demo app** (app directory) used to showcase and manually test the loader and its themes.

All logic is client-side; there is no Node runtime dependency for the loader itself.

## Shiki Loader Architecture

- Entry point: [src/shiki-loader/index.ts](src/shiki-loader/index.ts)
	- Imports Shiki from esm.sh (`codeToHtml`, `bundledLanguages`).
	- Auto-runs once on DOM ready, finds `pre code` blocks, and replaces them with highlighted HTML.
- Transformer: [src/shiki-loader/transformer.ts](src/shiki-loader/transformer.ts)
	- Wraps each Shiki `<pre>` in a container with language label and copy-to-clipboard button.
- Utilities: [src/shiki-loader/utils.ts](src/shiki-loader/utils.ts)
	- `readSearchParams()` reads `theme` and `dark-theme` from the loader script URL.
	- `generateStyles()` injects CSS from loader.css into a `<style>` element.
	- `handleCopyButtonClick()` implements robust clipboard copying and tooltip reset.
- Themes: [src/shiki-loader/themes.ts](src/shiki-loader/themes.ts)
	- Source of truth for supported Shiki theme names; keep this updated if adding/removing themes.

### Language Detection

- Languages are taken from Shiki `bundledLanguages` (via `Object.keys(bundledLanguages)`).
- The loader accepts `language-xxx` or `lang-xxx` classes on the `code` element.
- If a language is unknown or unsupported, it logs a warning and skips that block.

### Theme Selection & Dark Mode

- `readSearchParams()` returns `{ theme, darkTheme }` with default `theme = "material-theme"`.
- At runtime, `index.ts` checks `window.matchMedia('(prefers-color-scheme: dark)')`.
- Active theme logic:
	- If system is dark and `darkTheme` is set → use `darkTheme`.
	- Else → use `theme`.
- Theme values must be valid Shiki bundled theme names; unknown values fall back to `material-theme`.

## Build & Development Workflow

### Loader Build

- Command: `bun run build:lib`
	- Runs `bun build ./src/shiki-loader/index.ts --outfile ./public/shiki-loader.js --target browser --bundle --minify`.
	- Then runs `scripts/embed-loader-css.ts` to inline `loader.css` into the JS bundle via the `LOADER_CSS` placeholder in utils.ts.
- Result: a single browser-ready script at [public/shiki-loader.js](public/shiki-loader.js).

### Next.js App

- Dev server: `bun run dev`.
- Production build: `bun run build` then `bun run start`.
- The app under [src/app](src/app) is just a UI wrapper for demoing the loader; avoid coupling loader internals to Next-specific APIs.

### Quality Tooling

- Lint: `bun run lint` → Biome.
- Format: `bun run format` → Biome with 4-space indentation and single quotes.
- Type-check: `bun run type-check` (no emit).

## Implementation Guidelines for Copilot

- Keep the loader **framework-agnostic**:
	- Do not import React/Next into [src/shiki-loader](src/shiki-loader).
	- Only rely on standard DOM APIs and the Shiki esm.sh imports.
- Preserve browser-only behavior:
	- Access `document`, `window`, `navigator.clipboard` only in code that clearly runs in the browser.
	- Auto-run highlighting once; respect the `hasRun` guard in index.ts.
- When editing loader styles:
	- Modify [src/shiki-loader/loader.css](src/shiki-loader/loader.css), then rely on the embed script to inline it.
	- Do not hard-code large CSS blocks directly in TypeScript.
- When adding new themes:
	- Ensure Shiki actually supports the theme name.
	- Update [src/shiki-loader/themes.ts](src/shiki-loader/themes.ts) and, if needed, any UI in the demo app that lists themes.
- When changing public behavior of the loader:
	- Prefer adding new, clearly-named URL parameters over breaking existing ones (`theme`, `dark-theme`).
	- Keep configuration parsing contained in utils.ts.

## When Extending Functionality

- To add new UI controls around code blocks (e.g., line numbers toggle):
	- Extend the transformer in [src/shiki-loader/transformer.ts](src/shiki-loader/transformer.ts) to adjust the wrapper structure.
	- Add corresponding CSS rules in loader.css.
- To support additional script configuration:
	- Update `readSearchParams()` in utils.ts.
	- Keep the behavior simple and documented in README.md.

These instructions should guide Copilot to keep the Shiki loader small, browser-only, and easy to embed, while leaving the Next.js demo app free to evolve independently.
