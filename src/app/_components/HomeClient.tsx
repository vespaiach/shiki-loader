"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Github from "@/components/icons/Github";
import Moon from "@/components/icons/Moon";
import Sun from "@/components/icons/Sun";
import Select from "@/components/Select";
import { SHIKI_THEMES } from "@/shiki-loader/themes";

const LOADER_URL = "https://cdn.jsdelivr.net/gh/vespaiach/shiki-loader@v2.1.0/public/shiki-loader.js";

const SAMPLES = [
  {
    lang: "javascript",
    code: `async function fetchUserData(userId) {
    try {
        const response = await fetch(\`/api/users/\${userId}\`);
        const data = await response.json();
        return { success: true, user: data };
    } catch (error) {
        console.error('Error fetching user:', error);
        return { success: false, error: error.message };
    }
}`,
  },
  {
    lang: "python",
    code: `@dataclass
class HighlightingEngine:
    name: str
    is_active: bool = True

    def toggle(self):
        self.is_active = not self.is_active`,
  },
];

const escapeHtml = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// Unhighlighted markup, written back into the preview before each re-highlight.
const SAMPLES_HTML = SAMPLES.map(
  ({ lang, code }) => `<pre><code class="language-${lang}">${escapeHtml(code)}</code></pre>`,
).join("");

type Highlight = (root?: ParentNode) => Promise<void>;

// One loader copy per theme URL: each copy reads its own theme from its URL.
const highlighters = new Map<string, Promise<Highlight>>();

function loadHighlighter(src: string): Promise<Highlight> {
  let highlighter = highlighters.get(src);
  if (!highlighter) {
    highlighter = new Promise<Highlight>((resolve, reject) => {
      const script = document.createElement("script");
      script.type = "module";
      script.src = src;
      // A module script's load event fires after it has run, so window.ShikiLoader is this copy's.
      script.onload = () =>
        resolve((window as unknown as { ShikiLoader: { highlight: Highlight } }).ShikiLoader.highlight);
      script.onerror = () => {
        highlighters.delete(src);
        reject(new Error(`Failed to load ${src}`));
      };
      document.body.appendChild(script);
    });
    highlighters.set(src, highlighter);
  }
  return highlighter;
}

export default function HomeClient() {
  const [theme, setTheme] = useState("github-light");
  const [darkTheme, setDarkTheme] = useState("github-dark");
  const [dark, setDark] = useState(false);
  const [ready, setReady] = useState(false);
  const [copied, setCopied] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);
  const queueRef = useRef(Promise.resolve());

  // Read URL params after mount so the static export prerenders the page instead of bailing out to CSR.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.has("theme") || params.has("dark-theme")) {
      const themeParam = params.get("theme") ?? "";
      const darkThemeParam = params.get("dark-theme") ?? "";
      if (SHIKI_THEMES.includes(themeParam)) setTheme(themeParam);
      setDarkTheme(SHIKI_THEMES.includes(darkThemeParam) ? darkThemeParam : "");
    }
    setDark(document.documentElement.dataset.theme === "dark");
    setReady(true);
  }, []);

  // Keep the URL shareable without reloading the page.
  useEffect(() => {
    if (!ready) return;
    const params = new URLSearchParams({ theme });
    if (darkTheme) params.set("dark-theme", darkTheme);
    window.history.replaceState(null, "", `?${params}`);
  }, [ready, theme, darkTheme]);

  // The preview shows exactly what a visitor in the current mode would see.
  useEffect(() => {
    if (!ready) return;
    const src = `${LOADER_URL}?theme=${dark && darkTheme ? darkTheme : theme}`;
    let stale = false;
    // Serialized so a slow, older load can't highlight blocks meant for a newer theme.
    queueRef.current = queueRef.current.then(async () => {
      if (stale) return;
      try {
        const highlight = await loadHighlighter(src);
        const root = previewRef.current;
        if (stale || !root) return;
        root.innerHTML = SAMPLES_HTML;
        await highlight(root);
      } catch (err) {
        console.error(err);
      }
    });
    return () => {
      stale = true;
    };
  }, [ready, theme, darkTheme, dark]);

  const toggleDark = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.dataset.theme = next ? "dark" : "light";
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {
      // Storage blocked: the toggle still works for this visit.
    }
  };

  const snippet = `<script src="${LOADER_URL}?theme=${theme}${darkTheme ? `&dark-theme=${darkTheme}` : ""}" type="module"></script>`;

  const copySnippet = async () => {
    try {
      await navigator.clipboard.writeText(snippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard blocked: the snippet is still selectable above.
    }
  };

  const activeTheme = dark && darkTheme ? darkTheme : theme;

  return (
    <div className="modernist min-h-screen bg-mod-bg font-mod text-[15px] leading-[1.55] text-mod-ink">
      <div className="border-b-2 border-mod-rule">
        <header className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-5 gap-y-3 px-4 py-3.5 sm:px-6">
          <span className="mr-auto flex items-center gap-2.5 text-lg font-extrabold">
            Shiki Loader
            <span className="bg-mod-accent-tint px-2.5 py-0.5 text-[11px] font-normal text-mod-accent-tint-text">
              v2.1.0
            </span>
          </span>
          <nav aria-label="Site" className="flex flex-wrap items-center gap-5 text-sm">
            <Link href="/about" className="hover:text-mod-accent">
              About
            </Link>
            <a
              href="https://github.com/vespaiach/shiki-loader"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-mod-accent">
              <Github size={16} aria-hidden="true" />
              GitHub
            </a>
            <button
              type="button"
              onClick={toggleDark}
              aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
              aria-pressed={dark}
              className="flex min-h-11 cursor-pointer items-center gap-2 border border-mod-rule px-3.5 font-extrabold hover:bg-mod-ink/7 active:bg-mod-ink/14">
              {dark ? <Sun size={16} aria-hidden="true" /> : <Moon size={16} aria-hidden="true" />}
              {dark ? "Light" : "Dark"}
            </button>
          </nav>
        </header>
      </div>

      <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 pt-7 pb-2 sm:px-6">
        <h1 className="text-3xl leading-[1.12] font-extrabold tracking-[-0.015em] sm:text-4xl">
          Shiki syntax highlighting for any page. One script tag.
        </h1>
        <p className="max-w-170 text-[17px]">
          Pick your themes, copy the script, and every{" "}
          <code className="text-sm">&lt;pre&gt;&lt;code class="language-…"&gt;</code> block gets highlighted
          with Shiki 3, a language label and a copy button. No build step, no framework, MIT licensed.
        </p>
      </div>

      <main className="mx-auto flex max-w-7xl flex-wrap items-start gap-6 px-4 pt-5 pb-8 sm:px-6">
        <section
          aria-labelledby="customize-h"
          className="flex min-w-0 flex-[1_1_340px] flex-col gap-4 border-2 border-mod-ink bg-mod-surface p-5">
          <div className="flex flex-col gap-1">
            <p className="text-[13px] font-extrabold tracking-[0.08em] text-mod-accent-text uppercase">
              Step 01
            </p>
            <h2 id="customize-h" className="text-2xl leading-[1.12] font-extrabold tracking-[-0.015em]">
              Customize your themes
            </h2>
          </div>
          <Select id="theme" label="Light theme" value={theme} onChange={(e) => setTheme(e.target.value)} />
          <Select
            id="dark-theme"
            label="Dark theme"
            value={darkTheme}
            emptyLabel="None (always use the light theme)"
            onChange={(e) => setDarkTheme(e.target.value)}
          />
          <p className="text-[13px] text-mod-muted">
            Visitors in dark mode see the dark theme. Use the header toggle to preview it here.
          </p>

          <hr className="my-1 h-0.5 border-0 bg-mod-rule" />

          <div className="flex flex-col gap-1">
            <p className="text-[13px] font-extrabold tracking-[0.08em] text-mod-accent-text uppercase">
              Step 02
            </p>
            <h3 className="text-xl leading-[1.12] font-extrabold tracking-[-0.015em]">Copy the script</h3>
          </div>
          {/* No language class, so the loader leaves this block alone. */}
          <pre className="border border-mod-rule bg-mod-bg p-3 text-xs leading-relaxed break-all whitespace-pre-wrap">
            <code>{snippet}</code>
          </pre>
          <button
            type="button"
            onClick={copySnippet}
            className="flex min-h-11 w-full cursor-pointer items-center gap-1.5 bg-mod-accent px-3.5 text-sm font-extrabold text-mod-bg hover:bg-mod-accent-hover">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true">
              <rect x="9" y="9" width="13" height="13" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
            <span aria-live="polite">{copied ? "Copied" : "Copy script"}</span>
          </button>
        </section>

        <section aria-labelledby="preview-h" className="flex min-w-0 flex-[999_1_560px] flex-col gap-4">
          <div className="flex flex-wrap items-baseline justify-between gap-2 border-b-2 border-mod-rule pb-2">
            <h2 id="preview-h" className="text-2xl leading-[1.12] font-extrabold tracking-[-0.015em]">
              Live preview
            </h2>
            <span className="border border-mod-accent px-2.5 py-0.5 text-[11px] text-mod-accent-text">
              Showing {activeTheme}
              {dark && !darkTheme ? " (no dark theme set)" : ""}
            </span>
          </div>
          {/* The loader rewrites this markup, so React renders it once and never touches it again. */}
          <div
            ref={previewRef}
            className="flex flex-col gap-4"
            // biome-ignore lint/security/noDangerouslySetInnerHtml: constant, escaped sample markup
            dangerouslySetInnerHTML={{ __html: SAMPLES_HTML }}
          />
        </section>
      </main>

      <section aria-labelledby="steps-h" className="mx-auto max-w-7xl px-4 pb-8 sm:px-6">
        <h2
          id="steps-h"
          className="mb-3 text-[13px] font-extrabold tracking-[0.08em] text-mod-accent-text uppercase">
          Step 03 · Mark up your code
        </h2>
        <div className="flex flex-wrap gap-6">
          <div className="min-w-0 flex-[1_1_240px] border-t-2 border-mod-ink pt-3">
            <h3 className="mb-1.5 font-extrabold">Paste the script</h3>
            <p className="text-[13px]">
              Put it in your page's <code>&lt;body&gt;</code>, your theme footer, or a WordPress or Ghost
              custom HTML block.
            </p>
          </div>
          <div className="min-w-0 flex-[1_1_240px] border-t-2 border-mod-ink pt-3">
            <h3 className="mb-1.5 font-extrabold">Add a language class</h3>
            <p className="text-[13px]">
              Give each <code>&lt;code&gt;</code> element a class like <code>language-js</code> or{" "}
              <code>lang-ts</code>. Unsupported languages are skipped with a console warning.
            </p>
          </div>
          <div className="min-w-0 flex-[1_1_240px] border-t-2 border-mod-ink pt-3">
            <h3 className="mb-1.5 font-extrabold">Content added later</h3>
            <p className="text-[13px]">
              Call <code>ShikiLoader.highlight()</code> after inserting new code blocks.
            </p>
          </div>
        </div>
      </section>

      <footer className="border-t-2 border-mod-rule">
        <div className="mx-auto flex max-w-7xl flex-wrap gap-x-6 gap-y-2 px-4 py-4 text-[13px] text-mod-muted sm:px-6">
          <span>MIT licensed</span>
          <span>Built on Shiki 3</span>
          <a
            href="https://github.com/vespaiach/shiki-loader"
            className="text-mod-accent-text hover:underline">
            Source on GitHub
          </a>
        </div>
      </footer>
    </div>
  );
}
