# shiki-loader

[![Deploy to GitHub Pages](https://github.com/vespaiach/shiki-loader/actions/workflows/deploy-pages.yml/badge.svg)](https://github.com/vespaiach/shiki-loader/actions/workflows/deploy-pages.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Shiki](https://img.shields.io/badge/Powered%20by-Shiki-ff69b4)](https://shiki.style/)

A drop-in browser script that automatically syntax-highlights `<pre><code>` blocks using [Shiki](https://shiki.style/). Nothing to install and no build step for consumers, framework-agnostic. Shiki itself is loaded from [esm.sh](https://esm.sh/) at runtime.

**[Live Demo](https://vespaiach.github.io/shiki-loader/)**

## Features

- Automatic detection and highlighting of all `<pre><code>` blocks on the page
- 60+ bundled themes, with a light/dark pair that follows `prefers-color-scheme` live
- All [Shiki bundled languages](https://shiki.style/languages) supported out of the box
- Language label and copy-to-clipboard button on every code block
- Self-contained single script — CSS is embedded, Shiki is loaded from [esm.sh](https://esm.sh/) at runtime
- Works with any static site, CMS, blog, or HTML page

## Quick Start

Add a single `<script>` tag to your HTML:

```html
<script src="https://cdn.jsdelivr.net/gh/vespaiach/shiki-loader@main/public/shiki-loader.js" type="module"></script>
```

That's it. All code blocks with a language class will be highlighted on page load.

### Specify Themes

```html
<!-- Single theme -->
<script src="https://cdn.jsdelivr.net/gh/vespaiach/shiki-loader@main/public/shiki-loader.js?theme=github-dark" type="module"></script>

<!-- Light and dark mode themes -->
<script
  src="https://cdn.jsdelivr.net/gh/vespaiach/shiki-loader@main/public/shiki-loader.js?theme=github-light&dark-theme=github-dark"
  type="module"
></script>
```

### Code Block Format

The loader highlights any `<code>` element inside a `<pre>` that has a `language-*` or `lang-*` class:

```html
<pre><code class="language-typescript">
const greeting: string = 'Hello, world!';
console.log(greeting);
</code></pre>
```

## Configuration

The loader is configured entirely via URL query parameters on the script `src`.

| Parameter    | Values                       | Default          | Description                                      |
| ------------ | ---------------------------- | ---------------- | ------------------------------------------------ |
| `theme`      | Any bundled Shiki theme name | `material-theme` | Theme used in light mode (and dark if no dark-theme) |
| `dark-theme` | Any bundled Shiki theme name | _(none)_         | Theme used when system prefers dark mode         |

When `dark-theme` is set, each block is rendered with both themes and CSS switches between them via `prefers-color-scheme`, so the colors follow the system setting live, without a reload. Without `dark-theme`, `theme` is always used.

Language names are case-insensitive. `text`, `plaintext`, `txt` and `plain` get the wrapper and copy button without highlighting. Blocks with an unsupported language, or no language class, are left untouched.

### Highlighting Content Added Later

The loader runs once when the page loads. For content inserted afterwards (SPA navigation, lazy-loaded comments), call:

```js
await window.ShikiLoader.highlight(container); // or highlight() for the whole document
```

Blocks that are already highlighted are skipped, so it is safe to call repeatedly.

### Customizing the Look

The loader's styles are inserted at the top of `<head>`, so your own stylesheet overrides them without `!important`:

```css
/* Hide the window dots */
.shiki-loader-mockup-code:before { display: none; }

/* Scroll long lines instead of wrapping them */
.shiki-loader-mockup-code pre { white-space: pre; display: block; }

/* Hide the language label */
.shiki-loader-language-label { display: none; }
```

Any `id`, classes and other attributes on the original `<pre>` are carried over to the highlighted block.

### Supported Themes

Popular themes include:

| Light                       | Dark                         |
| --------------------------- | ---------------------------- |
| `github-light`              | `github-dark`                |
| `one-light`                 | `one-dark-pro`               |
| `catppuccin-latte`          | `catppuccin-mocha`           |
| `material-theme-lighter`    | `material-theme-darker`      |
| `rose-pine-dawn`            | `rose-pine`                  |
| `solarized-light`           | `solarized-dark`             |
| `everforest-light`          | `everforest-dark`            |
| `min-light`                 | `nord`                       |

See [src/shiki-loader/themes.ts](src/shiki-loader/themes.ts) for the full list of 60+ themes.

## Self-Hosting

Build the loader locally and serve `shiki-loader.js` from your own domain:

```bash
git clone https://github.com/vespaiach/shiki-loader.git
cd shiki-loader
bun install
bun run build:lib
```

The output file is `public/shiki-loader.js`. Copy it to your project's static assets and reference it in your HTML:

```html
<script src="/assets/shiki-loader.js?theme=dracula" type="module"></script>
```

## How It Works

1. The script reads `theme` and `dark-theme` from its own URL (`import.meta.url`), so it must be loaded with `type="module"`
2. On DOM ready, it injects its embedded CSS once
3. Finds all `<pre><code>` elements with a `language-*` or `lang-*` class
4. Highlights each block using Shiki (loaded from esm.sh at runtime), with both themes when `dark-theme` is set
5. Wraps each block with a language label and copy-to-clipboard button
6. Exposes `window.ShikiLoader.highlight()` for content added later

## Development

### Prerequisites

- [Bun](https://bun.sh/) 1.0+

### Setup

```bash
bun install
bun run type-check    # Verify TypeScript setup
bun run build:lib     # Build the loader
```

### Scripts

| Command             | Purpose                                                |
| ------------------- | ------------------------------------------------------ |
| `bun run dev`       | Start Next.js dev server at localhost:3000              |
| `bun run build:lib` | Build standalone loader to `public/shiki-loader.js`    |
| `bun run build`     | Build Next.js static site                              |
| `bun run start`     | Run production server                                  |
| `bun run lint`      | Lint with Biome                                        |
| `bun run format`    | Format with Biome                                      |
| `bun run type-check`| TypeScript type-check (no emit)                        |
| `bun test`          | Run tests                                              |

### Project Structure

```
src/
├── shiki-loader/          # The standalone loader (framework-agnostic)
│   ├── index.ts           # Entry point — DOM detection and highlighting
│   ├── transformer.ts     # Wraps highlighted blocks with UI (label + copy button)
│   ├── utils.ts           # URL param parsing, CSS injection, clipboard handling
│   ├── loader.css         # Styles embedded into the bundle at build time
│   └── themes.ts          # List of supported Shiki themes
├── app/                   # Next.js demo app
│   ├── layout.tsx         # Root layout (Tailwind + DaisyUI)
│   ├── page.tsx           # Home page
│   ├── about/page.tsx     # About page
│   └── _components/       # Demo-specific components
└── components/            # Shared UI components (Select, icons)
```

### Build Pipeline

`bun run build:lib` does:
1. Bundles `src/shiki-loader/index.ts` with Bun (`--target browser --bundle --minify`)
2. Runs `scripts/embed-loader-css.ts` to inline `loader.css` into the JS bundle
3. Outputs final self-contained script to `public/shiki-loader.js`

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/my-feature`)
3. Run checks before committing:
   ```bash
   bun run lint
   bun run type-check
   bun run build:lib
   bun run build
   ```
4. Open a pull request

## License

[MIT](LICENSE) - Trinh Nguyen
