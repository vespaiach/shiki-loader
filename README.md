# highlight-it

A simple, engine-agnostic syntax highlighting loader for web pages. Just include one script and you're done - no need to know what highlighting engine is being used under the hood.

## Quick Start

Add this single line to your HTML (at the end of your `body` tag):

```html
<script src="https://cdn.jsdelivr.net/gh/vespaiach/highlight-it@main/dist/highlight-it.js" integrity="sha384-zh0jk0z2/k745j30lRgmEzY6xGUxkwsJ4l37MZe1nmQR7yLDhM8n4m+G8ct7ZAyu" crossorigin="anonymous"></script>
```

That's it! Your code blocks will be automatically highlighted.

## Features

- 🚀 **Zero Configuration** - Works out of the box with sensible defaults
- 🎨 **Multiple Themes** - Built-in light and dark mode support
- 🔌 **Engine Agnostic** - Currently uses Prism.js, but designed to support multiple engines
- 📦 **Configuration Packs** - Pre-configured setups for different use cases
- 🎯 **Simple API** - Configure everything via query parameters

## Configuration

You can configure `highlight-it` by adding query parameters to the script URL. The script supports several configuration options:

### Configuration Packs

Choose between pre-configured setups optimized for different use cases:

#### Minimal Pack (Default)
```html
<script src="https://cdn.jsdelivr.net/gh/vespaiach/highlight-it@main/dist/highlight-it.js?config=minimal" defer></script>
```
- Lightweight setup with no plugins
- Basic Prism theme
- Ideal for simple use cases

#### Complete Pack
```html
<script src="https://cdn.jsdelivr.net/gh/vespaiach/highlight-it@main/dist/highlight-it.js?config=complete" defer></script>
```
- Full-featured setup with enhanced plugins
- Solarized Light / Twilight themes (auto-switching)
- Line numbers with CSS styling
- Line highlighting support
- Auto-loader for language detection

### Query Parameters

All configuration options can be set via query parameters:

| Parameter | Values | Default | Description |
|-----------|--------|---------|-------------|
| `config` or `pack` | `minimal`, `complete` | `minimal` | Pre-configured setup pack |
| `darkmode` or `darkMode` | `true`, `false`, `1`, `0`, `yes`, `no`, `on`, `off` | auto-detect | Enable dark mode theme |
| `verbose` | `true`, `false`, `1`, `0`, `yes`, `no`, `on`, `off` | `false` | Enable verbose logging |

### Examples

**Complete pack with dark mode:**
```html
<script src="https://cdn.jsdelivr.net/gh/vespaiach/highlight-it@main/dist/highlight-it.js?config=complete&darkMode=true" defer></script>
```

**Minimal pack with verbose logging:**
```html
<script src="https://cdn.jsdelivr.net/gh/vespaiach/highlight-it@main/dist/highlight-it.js?config=minimal&verbose=true" defer></script>
```

**Auto dark mode detection (default behavior):**
```html
<script src="https://cdn.jsdelivr.net/gh/vespaiach/highlight-it@main/dist/highlight-it.js?config=complete" defer></script>
```

When `darkMode` is not specified, the script automatically detects your system's color scheme preference using `prefers-color-scheme`.

**Note:** Each engine (Prism.js, highlight.js, etc.) defines its own minimal and complete configurations optimized for that engine's capabilities.

## How It Works

1. The script loads after your page renders (via `defer` attribute)
2. Configuration is parsed from query parameters or class attributes
3. The appropriate highlighting engine resources are loaded (themes, plugins, etc.)
4. Code blocks in your page are automatically highlighted
5. All requests happen after page load, so SEO is not affected

## Engine Architecture

While currently powered by Prism.js, `highlight-it` is designed with an engine abstraction layer that makes it possible to:
- Switch between different highlighting engines (Prism.js, highlight.js, Shiki, etc.)
- Add new engines without breaking existing code
- Configure engine-specific options

Future versions may support additional engines via the `engine` parameter:
```html
<script src="https://cdn.jsdelivr.net/gh/vespaiach/highlight-it@main/dist/highlight-it.js?engine=prism&config=modern" defer></script>
```

## Browser Support

- Chrome 58+
- Edge 58+
- Firefox 58+
- Safari 13+

## License

MIT - see [LICENSE](LICENSE) file

## References

- [PrismJS](https://github.com/PrismJS/prism) - Current highlighting engine
