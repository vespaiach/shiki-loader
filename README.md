# shiki-loader 

Browser-only syntax highlighting for code blocks using [Shiki](https://shiki.style/).

This repo contains two pieces:

- `shiki-loader`: a standalone browser script that finds `pre code` blocks on the page and highlights them with Shiki
- A small Next.js demo app that showcases the loader and available themes

## Quick Start (CDN script)

1. Build the loader (if you're working from this repo):

```bash
bun run build:lib
```

This produces `public/shiki-loader.js`.

2. Include the script at the end of your HTML `body`:

```html
<script src="/shiki-loader.js" defer></script>
```

All `pre code` blocks with a language class (for example `language-ts`, `lang-js`) will be highlighted automatically on page load.

## Script Configuration

The loader is configured entirely via URL query parameters on the script `src`.

### Query Parameters

| Parameter     | Values                        | Default          | Description                                     |
|--------------|-------------------------------|------------------|-------------------------------------------------|
| `theme`      | Any bundled Shiki theme name  | `material-theme` | Base theme used in light and dark mode         |
| `dark-theme` | Any bundled Shiki theme name  | _(none)_         | Optional dark theme, used if system is in dark |

The script automatically detects dark mode using `prefers-color-scheme: dark`. If `dark-theme` is provided and the system is in dark mode, that theme is used; otherwise `theme` is used.

### Example Usage

Use the same theme in both light and dark mode:

```html
<script src="/shiki-loader.js?theme=github-dark" defer></script>
```

Use different themes for light and dark mode:

```html
<script src="/shiki-loader.js?theme=github-light&dark-theme=github-dark" defer></script>
```

## Supported Languages

The loader ships with all Shiki bundled languages. A block is highlighted when:

- It is inside a `pre` element
- The `code` element has a class starting with `language-` or `lang-` (for example `language-ts`, `lang-js`)
- The language is part of Shiki's `bundledLanguages`

If the language is not supported, a warning is logged and the block is left unchanged.

## Bundled Themes

The loader exposes all Shiki bundled themes; common examples include:

- `github-dark`, `github-light`
- `one-dark-pro`, `one-light`
- `nord`, `night-owl`, `dracula`
- `material-theme`, `material-theme-darker`, `material-theme-lighter`
- `catppuccin-mocha`, `catppuccin-latte`, `rose-pine`, `rose-pine-dawn`

The full list is maintained in [src/shiki-loader/themes.ts](src/shiki-loader/themes.ts).

## UI Features

The loader wraps each highlighted block with a small UI shell (see [src/shiki-loader/transformer.ts](src/shiki-loader/transformer.ts)):

- Language label in the top-left corner
- Copy-to-clipboard button with tooltip state ("Copy" → "Copied")
- All styling is injected at runtime from `loader.css` into a `<style>` tag

## Local Development

This repository is a Next.js app using Bun.

### Requirements

- Bun

### Scripts

- `bun run dev` – Start the Next.js dev server
- `bun run build` – Build the Next.js app
- `bun run start` – Start the production server
- `bun run build:lib` – Build `public/shiki-loader.js` from `src/shiki-loader/index.ts`
- `bun run lint` – Run Biome checks
- `bun run format` – Format with Biome
- `bun run type-check` – Type-check the project

## License

MIT – see [LICENSE](LICENSE)
