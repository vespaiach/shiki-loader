# Copilot Instructions for shiki-loader

## Project Overview

This repo contains:

- A **browser-only Shiki loader** in [src/shiki-loader](src/shiki-loader) that can be built into a single script (public/shiki-loader.js) and dropped into any HTML page.
- A **Next.js demo app** (app directory) used to showcase and manually test the loader and its themes.

All logic is client-side; there is no Node runtime dependency for the loader itself.

## Shiki Loader Architecture

- Entry point: [src/shiki-loader/index.ts](src/shiki-loader/index.ts)
	- Imports Shiki from esm.sh (`codeToHtml`, `bundledLanguages`).
	- Auto-runs on DOM ready, finds `pre code` blocks, and replaces them with highlighted HTML.
	- Exposes `window.ShikiLoader.highlight(root?)` so pages can highlight content added later; already-highlighted blocks are skipped.
	- The built script starts with an ES `import`, so it must be loaded with `type="module"`.
- Transformer: [src/shiki-loader/transformer.ts](src/shiki-loader/transformer.ts)
	- Wraps each Shiki `<pre>` in a container with language label and copy-to-clipboard button.
- Utilities: [src/shiki-loader/utils.ts](src/shiki-loader/utils.ts)
	- `readSearchParams(src)` reads `theme` and `dark-theme` from the given script URL (`index.ts` passes `import.meta.url`).
	- `generateStyles()` injects CSS from loader.css into a `<style>` element.
	- `handleCopyButtonClick()` copies the code and shows "Copied" only when the copy succeeded, then resets the tooltip.
- Themes: [src/shiki-loader/themes.ts](src/shiki-loader/themes.ts)
	- Source of truth for supported Shiki theme names; keep this updated if adding/removing themes.

### Language Detection

- Languages are taken from Shiki `bundledLanguages` (via `Object.keys(bundledLanguages)`), plus the plain-text names `text`, `plaintext`, `txt` and `plain`.
- The loader accepts `language-xxx` or `lang-xxx` classes on the `code` element; names are case-insensitive.
- A block that names an unsupported language logs a warning and is skipped. A block with no language class is skipped silently.

### Theme Selection & Dark Mode

- `readSearchParams(src)` returns `{ theme, darkTheme }` with default `theme = "material-theme"`.
- Theme logic:
	- If `darkTheme` is set → Shiki renders both themes (`themes: { light, dark }`) and loader.css switches between them with a `prefers-color-scheme` media query, so colors follow the system live.
	- Else → `theme` is always used.
- Theme values must be valid Shiki bundled theme names; unknown values fall back to `material-theme`.

## Build & Development Workflow

### Loader Build

- Command: `bun run build:lib`
	- Runs `bun build ./src/shiki-loader/index.ts --outfile ./public/shiki-loader.js --target browser --bundle --minify`.
	- Then runs `scripts/embed-loader-css.ts` to inline `loader.css` into the JS bundle via the `LOADER_CSS` placeholder in utils.ts.
- Result: a single browser-ready script at [public/shiki-loader.js](public/shiki-loader.js). It is checked in because jsDelivr serves it from the repo, so rebuild and commit it whenever the loader source changes.

### Next.js App

- Dev server: `bun run dev`.
- Production build: `bun run build` then `bun run start`.
- The app under [src/app](src/app) is just a UI wrapper for demoing the loader; avoid coupling loader internals to Next-specific APIs.

### Quality Tooling

- Lint: `bun run lint` → Biome.
- Format: `bun run format` → Biome with 2-space indentation, 110-character line width and double quotes.
- Type-check: `bun run type-check` (no emit).
- Tests: `bun test`. Tests live in [src/shiki-loader/__tests__](src/shiki-loader/__tests__); [test/setup.ts](test/setup.ts) provides a happy-dom DOM and a fake for the esm.sh Shiki import.

## Implementation Guidelines for Copilot

- Keep the loader **framework-agnostic**:
	- Do not import React/Next into [src/shiki-loader](src/shiki-loader).
	- Only rely on standard DOM APIs and the Shiki esm.sh imports.
- Preserve browser-only behavior:
	- Access `document`, `window`, `navigator.clipboard` only in code that clearly runs in the browser.
	- Keep `highlight()` safe to call repeatedly; the `hasRun` guard in index.ts only ensures the CSS is injected once.
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
