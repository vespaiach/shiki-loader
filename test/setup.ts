import { mock } from "bun:test";
import { GlobalRegistrator } from "@happy-dom/global-registrator";

// Script tags in tests only carry a URL for the loader to read; nothing should be fetched.
GlobalRegistrator.register({ settings: { handleDisabledFileLoadingAsSuccess: true } });

// The loader imports Shiki from a URL at runtime. Tests use this small fake instead of the network.
// The fake echoes lang and theme into the markup so tests can assert on what the loader asked for.
mock.module("https://esm.sh/shiki@3.0.0", () => ({
  bundledLanguages: { js: {}, ts: {} },
  bundledThemes: { "material-theme": {}, "github-light": {}, "github-dark": {} },
  codeToHtml: async (code: string, options: { lang: string; theme: string }) => {
    const pre = document.createElement("pre");
    pre.appendChild(document.createElement("code")).textContent = code;
    return `<div class="shiki-loader-mockup-code" data-lang="${options.lang}" data-theme="${options.theme}"><div class="shiki-loader-tooltip" data-tip="Copy"><button type="button" data-target="copy"></button></div>${pre.outerHTML}</div>`;
  },
}));
