# GEO Fix Guide: Shiki Loader

Companion to [`GEO-AUDIT-REPORT.md`](GEO-AUDIT-REPORT.md). Written 2026-11-15.

## Platform detected

| | |
|---|---|
| **Framework** | **Next.js 16 App Router** with `output: "export"` (static HTML), React 19, Tailwind + DaisyUI (`package.json`, `next.config.ts`) |
| **Host** | **GitHub Pages** project site (`server: GitHub.com`, Fastly `via: 1.1 varnish`) |
| **Deploy** | `.github/workflows/deploy-pages.yml`: **every push to `main` runs `bun test`, `build:lib`, `build` and deploys.** Merging a PR is the deploy. |

**What GitHub Pages can't do** (so no fix below asks for it):
- custom HTTP headers (HSTS, `Link`, `Vary: Accept`)
- content negotiation (Markdown via `Accept`)
- a host-root `robots.txt` for a *project* site
- server logs
- changing `cache-control: max-age=600`

The workarounds are noted where they matter.

**How the code was checked.** Fixes 1–6 and 8–9 were built together in a scratch copy of this repo. That build passed `biome check`, `tsc --noEmit` and `next build`. Every JSON-LD block in the exported HTML parsed as JSON. Lighthouse 13.6.0 then scored Accessibility **1.0** and Agentic Browsing **1.0** on the trial homepage. The live site scores 0.94 and 0.5.

---

## Quick wins (each under 30 min, high impact)

| Fix | What | Time | Who |
|---|---|---|---|
| [1](#fix-1-deploy-the-homepage-prerender-c-1) | Deploy the homepage prerender (already coded) | 5 min | developer |
| [2](#fix-2-deploy-llmstxt-l-1) | Deploy `llms.txt` (already written) | 2 min | developer |
| [3](#fix-3-canonical-metadatabase-og-and-per-page-titles-h-2) | Canonical, `metadataBase`, absolute `og:url`, `/about` title | 15 min | developer |
| [4](#fix-4-sitemapxml-h-3) | `sitemap.xml` | 5 min | developer |
| [8](#fix-8-label-the-theme-selects-m-4) | `aria-label` on theme selects | 2 min | developer |
| [9](#fix-9-small-cleanups-l-4-l-6-l-7) | Remove `keywords`/`robots` meta, add `<main>` to /about | 10 min | developer |
| [5](#fix-5-search-console-bing-webmaster-and-indexnow-h-3-a4-a5) | Search Console + Bing Webmaster (your accounts) | 20 min | you |

Fixes 1–4, 8 and 9 can go in one PR.

---

## Fix 1: Deploy the homepage prerender (C-1)

- **Issue:** the live homepage HTML has no body content, only a `BAILOUT_TO_CLIENT_SIDE_RENDERING` template ([report C-1](GEO-AUDIT-REPORT.md#c-1-homepage-ships-no-body-content-to-non-js-crawlers)).
- **Why it matters:** ChatGPT, Claude and Perplexity crawlers don't run JavaScript, so today they see a blank homepage.
- **Status:** **already applied in this worktree, uncommitted.** Locally verified: 0 BAILOUT markers, 421 words in raw HTML, and the `?theme=github-dark` URL parameter still works in a real browser.

**Steps**
1. Review the diff below (`git diff src/app`).
2. Commit it on this branch, open a PR, and merge to `main`. The Pages workflow deploys automatically.

**Code (the full change)**
```diff
--- a/src/app/page.tsx
+++ b/src/app/page.tsx
-import { Suspense } from "react";
 import HomeClient from "./_components/HomeClient";

 export default function Home() {
-  return (
-    <Suspense fallback={null}>
-      <HomeClient />
-    </Suspense>
-  );
+  return <HomeClient />;
 }
```
```diff
--- a/src/app/_components/HomeClient.tsx
+++ b/src/app/_components/HomeClient.tsx
-import { useSearchParams } from "next/navigation";
 ...
-  const params = useSearchParams();
-  const [theme, setTheme] = useState(() => {
-    const themeParam = params.get("theme") ?? "";
-    if (SHIKI_THEMES.includes(themeParam)) {
-      return themeParam;
-    }
-    return "material-theme";
-  });
-
-  const [darkTheme, setDarkTheme] = useState(() => {
-    const darkThemeParam = params.get("dark-theme") ?? "";
-    if (SHIKI_THEMES.includes(darkThemeParam)) {
-      return darkThemeParam;
-    }
-    return "";
-  });
+  const [theme, setTheme] = useState("material-theme");
+  const [darkTheme, setDarkTheme] = useState("");
+  const [ready, setReady] = useState(false);
+
+  // Read URL params after mount so the static export prerenders the page instead of bailing out to CSR.
+  useEffect(() => {
+    const params = new URLSearchParams(window.location.search);
+    const themeParam = params.get("theme") ?? "";
+    const darkThemeParam = params.get("dark-theme") ?? "";
+    if (SHIKI_THEMES.includes(themeParam)) {
+      setTheme(themeParam);
+    }
+    if (SHIKI_THEMES.includes(darkThemeParam)) {
+      setDarkTheme(darkThemeParam);
+    }
+    setReady(true);
+  }, []);
 ...
   useEffect(() => {
-    if (theme && !ranRef.current) {
+    if (ready && theme && !ranRef.current) {
 ...
-  }, [theme, darkTheme]);
+  }, [ready, theme, darkTheme]);
```

**Check it worked**
```bash
curl -s https://vespaiach.github.io/shiki-loader/ | grep -c BAILOUT
```
Expect `0`.
```bash
curl -s https://vespaiach.github.io/shiki-loader/ | grep -c 'cdn.jsdelivr.net/gh/vespaiach/shiki-loader'
```
Expect at least `1`. Also open `https://vespaiach.github.io/shiki-loader/?theme=github-dark`: the picker should show "Github Dark". Pick-up time is immediate for direct fetches, and days to weeks for recrawls.

**Risk / rollback:** for one frame the page renders with default themes before applying URL themes. Highlighting waits for `ready`, so the loader never loads the wrong theme. Rollback: `git revert <commit>`.
**Effort:** S · developer

---

## Fix 2: Deploy `llms.txt` (L-1)

- **Issue:** `/shiki-loader/llms.txt` returns 404 ([report L-1](GEO-AUDIT-REPORT.md#-low)).
- **Why it matters:** coding and browsing agents use it for a fast, accurate summary. **Google Search ignores it**, so expect no Google effect.
- **Status:** **already written** at `public/llms.txt` in this worktree (uncommitted). Its content is in report §7.2. Commit it with Fix 1.

**Check it worked:**
```bash
curl -sI https://vespaiach.github.io/shiki-loader/llms.txt | head -1
```
Expect `HTTP/2 200`.
**Risk / rollback:** none; delete the file to roll back. **Effort:** S · developer

---

## Fix 3: Canonical, `metadataBase`, OG and per-page titles (H-2)

- **Issue:** no canonical tags; `og:url` is the relative `"/"`; no share image; `/about` reuses the homepage title ([report H-2](GEO-AUDIT-REPORT.md#h-2-missing-canonical-metadatabase-valid-ogurl-share-image-and-per-page-titles)).
- **Why it matters:** canonicals and unique titles tell Google and Bing which URL to index and cite. A valid `og:url` and image make shared links look trustworthy.

**Steps**
1. Replace the `metadata` export in `src/app/layout.tsx` with the block below. It also drops `keywords` and `robots` (Fix 9).
2. Add the `metadata` export to `src/app/about/page.tsx` (block below).
3. Create a 1200×630 PNG at `public/og.png` showing the product name, tagline and the one-line `<script>` tag. **[ADD: image file]**. Until it exists, the `og:image` URL returns 404, so ship the image in the same PR.
4. Use **absolute** URLs. With `basePath: "/shiki-loader"`, a relative `"/"` resolves to `https://vespaiach.github.io/` and drops the project path.

**Code: `src/app/layout.tsx` (metadata only)**
```tsx
const siteUrl = "https://vespaiach.github.io/shiki-loader/";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${title} – Browser syntax highlighting`,
    template: `%s | ${title}`,
  },
  description,
  alternates: { canonical: siteUrl },
  openGraph: {
    title: `${title} – Browser-only syntax highlighting`,
    description,
    url: siteUrl,
    siteName: title,
    type: "website",
    images: [{ url: `${siteUrl}og.png`, width: 1200, height: 630, alt: "Shiki Loader" }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${title} – Browser-only syntax highlighting`,
    description,
    images: [`${siteUrl}og.png`],
  },
};
```

**Code: `src/app/about/page.tsx` (add at the top)**
```tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "How Shiki Loader works: one script tag that finds <pre><code> blocks and highlights them with Shiki, with dark mode, language labels and copy buttons.",
  alternates: { canonical: "https://vespaiach.github.io/shiki-loader/about" },
  // openGraph is replaced, not merged, so repeat the shared fields here
  openGraph: {
    title: "About Shiki Loader",
    description:
      "How Shiki Loader works: one script tag that finds <pre><code> blocks and highlights them with Shiki.",
    url: "https://vespaiach.github.io/shiki-loader/about",
    siteName: "Shiki Loader",
    type: "website",
    images: [
      {
        url: "https://vespaiach.github.io/shiki-loader/og.png",
        width: 1200,
        height: 630,
        alt: "Shiki Loader",
      },
    ],
  },
};
```
> The trial build caught that without its own `openGraph`, `/about` inherits the homepage's `og:url`.

**Check it worked**
```bash
curl -s https://vespaiach.github.io/shiki-loader/about | grep -oE '<title>[^<]*|rel="canonical" href="[^"]*"|og:url" content="[^"]*"'
```
Expect `About | Shiki Loader`, a canonical of `…/shiki-loader/about`, and an `og:url` of `…/shiki-loader/about`. Also run both URLs through https://www.opengraph.xyz/. Google picks up canonicals on its next crawl, typically within days.

**Risk / rollback:** a wrong canonical can de-index a page. These are self-referencing and exact, so the risk is low. Rollback: revert the commit. **Effort:** S · developer (+ designer for `og.png`)

---

## Fix 4: `sitemap.xml` (H-3)

- **Issue:** no sitemap anywhere ([report H-3](GEO-AUDIT-REPORT.md#h-3-no-sitemap-and-the-site-isnt-connected-to-bing-or-indexnow)).
- **Why it matters:** this project can't publish the host-root `robots.txt`, so a sitemap submitted directly in GSC and Bing is how the engines learn your URLs and change dates.

**Steps:** create `src/app/sitemap.ts`. The static export writes `out/sitemap.xml`, served at `/shiki-loader/sitemap.xml` (trial-verified).

```ts
import type { MetadataRoute } from "next";

export const dynamic = "force-static";

const base = "https://vespaiach.github.io/shiki-loader";

export default function sitemap(): MetadataRoute.Sitemap {
  // shortcut: one date for both pages; switch to per-page dates if pages start changing independently
  const lastModified = new Date();
  return [
    { url: `${base}/`, lastModified },
    { url: `${base}/about`, lastModified },
  ];
}
```
> `lastModified` is the build time. Every deploy marks both pages as changed. That's honest enough for a two-page site that only deploys on change; revisit if you add pages.

**Check it worked:**
```bash
curl -s https://vespaiach.github.io/shiki-loader/sitemap.xml
```
Expect two `<url>` entries. Then submit the sitemap (Fix 5).
**Risk / rollback:** none. Delete the file to roll back. **Effort:** S · developer

---

## Fix 5: Search Console, Bing Webmaster and IndexNow (H-3, A4, A5)

> **You need to do these steps in your own accounts.** I don't have access.

- **Issue:** no verified GSC or Bing property, so index status, the Generative AI report and the AI Performance report are invisible ([report §8](GEO-AUDIT-REPORT.md#8-not-checked--needs-your-data)).
- **Why it matters:** ChatGPT search and Copilot lean on Bing's index. Google's AI features need the site indexed and "included in Search generative AI features" in Search Console.

**Steps: Google Search Console**
1. https://search.google.com/search-console → **Add property** → **URL prefix** → `https://vespaiach.github.io/shiki-loader/`. A Domain property isn't possible on `github.io`.
2. Choose **HTML tag**, copy only the `content` value.
3. Add it to the `metadata` in `src/app/layout.tsx` and deploy:
   ```tsx
   verification: { google: "[PLACEHOLDER: GSC token]" },
   ```
   Don't commit the placeholder text itself; wait until you have the token.
4. Click **Verify** → **Sitemaps** → submit `sitemap.xml`.
5. **URL Inspection** → both URLs → **Request indexing**.
6. **Settings**: confirm the site is *included* in generative AI features. Then check **Performance → Generative AI** monthly (data starts 2026-05-18; impressions only).

**Steps: Bing Webmaster Tools**
1. https://www.bing.com/webmasters → **Import from Google Search Console**. No token is needed once GSC is verified. If you prefer meta-tag verification, add `other: { "msvalidate.01": "[PLACEHOLDER: Bing token]" }` inside the same `verification` object (trial-verified to render `<meta name="msvalidate.01">`).
2. Submit `https://vespaiach.github.io/shiki-loader/sitemap.xml`.
3. Use **URL Inspection** on both URLs, then check the **AI Performance** report monthly.

**Steps: IndexNow (optional; pings Bing and others on each deploy)**
1. Generate a key: run `openssl rand -hex 16` and save the output as `public/[PLACEHOLDER: key].txt`, with the key as the file's only content.
2. Add a step at the **end** of the `deploy` job in `.github/workflows/deploy-pages.yml`:
   ```yaml
      - name: Ping IndexNow
        run: |
          curl -sS -X POST https://api.indexnow.org/indexnow \
            -H 'Content-Type: application/json; charset=utf-8' \
            -d '{"host":"vespaiach.github.io","key":"[PLACEHOLDER: key]","keyLocation":"https://vespaiach.github.io/shiki-loader/[PLACEHOLDER: key].txt","urlList":["https://vespaiach.github.io/shiki-loader/","https://vespaiach.github.io/shiki-loader/about"]}' \
            -w '%{http_code}\n'
   ```
   `keyLocation` lets a key under `/shiki-loader/` authorize URLs under that path. A host-root key isn't possible on a project site.

**Check it worked:** GSC and Bing show "Verified". The workflow log for the IndexNow step shows `200` or `202`. Bing URL Inspection shows "Indexed" within days.
**Risk / rollback:** none to the site. Remove the meta tag and workflow step to undo. **Effort:** S · you (accounts) + developer (meta and workflow)

---

## Fix 6: JSON-LD structured data (M-1)

- **Issue:** zero structured data ([report M-1](GEO-AUDIT-REPORT.md#m-1-no-structured-data)).
- **Why it matters:** it states plainly that "Shiki Loader" is free MIT software by a named person, with this repo. That's entity clarity for Google, Bing and LLMs.
- **Expectation:** Breadcrumb is the only Google rich result you can earn here. Software App needs real ratings, so don't fake any. FAQ rich results ended 2026-05-07.

**Steps**
1. Create `src/components/JsonLd.tsx`. It escapes `<` because the data contains literal `<pre><code>`.
   ```tsx
   // Escape "<" so strings like "</script>" in the data can't close the tag early.
   export default function JsonLd({ data }: { data: object }) {
     const json = JSON.stringify(data).replace(/</g, "\\u003c");
     // biome-ignore lint/security/noDangerouslySetInnerHtml: static JSON-LD built from constants, "<" escaped above
     return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
   }
   ```
2. **`src/app/layout.tsx`:** add `import JsonLd from "@/components/JsonLd";`, the constant below, and `<JsonLd data={siteJsonLd} />` as the first child of `<body>`.
   ```tsx
   const siteJsonLd = {
     "@context": "https://schema.org",
     "@graph": [
       {
         "@type": "WebSite",
         "@id": `${siteUrl}#website`,
         url: siteUrl,
         name: title,
         description:
           "Browser-only syntax highlighting for code blocks using Shiki, added with a single script tag.",
         inLanguage: "en",
         publisher: { "@id": `${siteUrl}#author` },
       },
       {
         "@type": "Person",
         "@id": `${siteUrl}#author`,
         name: "[PLACEHOLDER: display name]",
         alternateName: "vespaiach",
         url: "https://github.com/vespaiach",
         sameAs: ["https://github.com/vespaiach", "https://www.vespaiach.com/", "https://x.com/vespaiach"],
       },
     ],
   };
   ```
   **Fill or decide:** `name` (the site shows none; your public GitHub profile has one). Remove any `sameAs` profile you don't want linked; the last two come from your GitHub profile.
3. **`src/app/page.tsx`** (after Fix 1) becomes:
   ```tsx
   import JsonLd from "@/components/JsonLd";
   import HomeClient from "./_components/HomeClient";

   const siteUrl = "https://vespaiach.github.io/shiki-loader/";

   const softwareJsonLd = {
     "@context": "https://schema.org",
     "@graph": [
       {
         "@type": "SoftwareApplication",
         "@id": `${siteUrl}#software`,
         name: "Shiki Loader",
         url: siteUrl,
         description:
           "A drop-in browser script that syntax-highlights <pre><code> blocks using Shiki, with language labels, copy-to-clipboard buttons and automatic dark mode.",
         applicationCategory: "DeveloperApplication",
         operatingSystem: "Any modern web browser",
         softwareVersion: "2.1.0",
         downloadUrl: "https://cdn.jsdelivr.net/gh/vespaiach/shiki-loader@v2.1.0/public/shiki-loader.js",
         license: "https://opensource.org/licenses/MIT",
         isAccessibleForFree: true,
         offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
         featureList: [
           "Automatic detection of <pre><code> blocks with language-* or lang-* classes",
           "Light and dark themes via prefers-color-scheme",
           "Language label on every code block",
           "Copy-to-clipboard button",
           "Single script tag, no build step",
         ],
         isPartOf: { "@id": `${siteUrl}#website` },
         author: { "@id": `${siteUrl}#author` },
         sameAs: ["https://github.com/vespaiach/shiki-loader"],
       },
       {
         "@type": "SoftwareSourceCode",
         "@id": `${siteUrl}#source`,
         name: "shiki-loader",
         codeRepository: "https://github.com/vespaiach/shiki-loader",
         programmingLanguage: ["TypeScript", "JavaScript"],
         runtimePlatform: "Web browser",
         license: "https://opensource.org/licenses/MIT",
         version: "2.1.0",
         targetProduct: { "@id": `${siteUrl}#software` },
         author: { "@id": `${siteUrl}#author` },
       },
     ],
   };

   export default function Home() {
     return (
       <>
         <JsonLd data={softwareJsonLd} />
         <HomeClient />
       </>
     );
   }
   ```
   **Keep `softwareVersion`, `version` and `downloadUrl` in step with each release** (they're also in `HomeClient.tsx` and the README).
4. **`src/app/about/page.tsx`:** add the breadcrumb and render `<JsonLd data={breadcrumbJsonLd} />` as the first child of the page wrapper:
   ```tsx
   const breadcrumbJsonLd = {
     "@context": "https://schema.org",
     "@type": "BreadcrumbList",
     itemListElement: [
       { "@type": "ListItem", position: 1, name: "Shiki Loader", item: "https://vespaiach.github.io/shiki-loader/" },
       { "@type": "ListItem", position: 2, name: "About", item: "https://vespaiach.github.io/shiki-loader/about" },
     ],
   };
   ```
5. Add `FAQPage` (report §7.3d) **only after** the visible FAQ from Fix 7 is live. Markup must match on-page text.

**Check it worked:** paste each URL into https://validator.schema.org/ (expect 0 errors) and https://search.google.com/test/rich-results (expect "Breadcrumbs" detected on `/about`). Or check from the shell:
```bash
curl -s https://vespaiach.github.io/shiki-loader/ | grep -c 'application/ld+json'
```
Expect `2`.
**Risk / rollback:** markup that doesn't match the page can trigger a manual action. Every value here is on the site or in the linked repo. Revert the commit to undo. **Effort:** S · developer

---

## Fix 7: Answer-first copy, dates, parameter table, FAQ (H-1, M-2, M-3)

- **Issue:** openings don't say what the product is; grammar errors; no dates, table or FAQ ([report H-1](GEO-AUDIT-REPORT.md#h-1-no-answer-first-evidence-dense-copy-on-either-page), M-2, M-3).
- **Why it matters:** AI answers quote short, self-contained passages with concrete facts. Today there's nothing like that to quote.
- **Rule:** only facts already true in the repo. Anything else is marked `[ADD: …]`.

**7a. Homepage intro** (`src/app/_components/HomeClient.tsx`, the `<p>` under the `<h1>`):
```tsx
<p className="text-center text-sm mb-12 font-normal">
  <strong>Shiki Loader adds Shiki syntax highlighting to any web page with one script tag.</strong> It finds
  every <code>&lt;pre&gt;&lt;code class="language-…"&gt;</code> block, highlights it with Shiki 3, and adds a
  language label and a copy button. No build step, no framework, MIT licensed. Latest: v2.1.0.
</p>
```

**7b. Homepage "Integration" section** (replace the `<h2>` and its `<p>`):
```tsx
<h2 className="font-semibold mb-2">How do I install Shiki Loader?</h2>
<ol className="list-decimal ml-5 mb-2 space-y-1">
  <li>Copy the HTML snippet on the right. It updates as you pick themes below.</li>
  <li>
    Paste it into your page's <code>&lt;body&gt;</code>, your theme footer, or a WordPress/Ghost custom HTML
    block.
  </li>
  <li>
    Give each <code>&lt;code&gt;</code> element a class like <code>language-js</code> or <code>lang-ts</code>.
    Unsupported languages are skipped with a console warning.
  </li>
  <li>
    Optional: pick a Dark Mode Override to switch themes automatically when the visitor's system is in dark
    mode.
  </li>
</ol>
```
This drops the `#the-script` bounce link and its `biome-ignore`. If you want to keep that animation, wrap "the HTML snippet on the right" in the existing `<a>`.

**7c. /about definition and heading** (`src/app/about/page.tsx`):
- Replace the "What is Shiki Loader?" paragraph:
  ```tsx
  <p className="mb-4">
    <strong>Shiki Loader is a ~9 KB browser script that brings the Shiki syntax highlighter to any HTML page.</strong>{" "}
    Load it with one <code>&lt;script type="module"&gt;</code> tag and it highlights every{" "}
    <code>&lt;pre&gt;&lt;code&gt;</code> block using any of Shiki's bundled themes, then adds a language badge and
    a copy-to-clipboard button. It works on static sites, WordPress, Ghost and plain HTML.
  </p>
  ```
  [ADD: a real site that uses it, if any. One named example is strong evidence.]
- Rename `How it works?` to `How does Shiki Loader work?`

**7d. Version and date line** (bottom of /about, above the footer):
```tsx
<p className="text-sm opacity-70">
  Latest version: <a href="https://github.com/vespaiach/shiki-loader/releases">v2.1.0</a> · Updated{" "}
  <time dateTime="[ADD: YYYY-MM-DD of the release]">[ADD: Month YYYY]</time> · MIT license · Maintained by{" "}
  <a href="https://github.com/vespaiach">[PLACEHOLDER: display name] (@vespaiach)</a>
</p>
```

**7e. Parameter table** (new /about section; values come from `readSearchParams()` in `src/shiki-loader/utils.ts`):
```tsx
<h2 className="text-2xl font-semibold mb-4 border-b pb-2">What options does Shiki Loader support?</h2>
<p>Options are URL parameters on the script tag. There is nothing else to configure.</p>
<table>
  <thead>
    <tr><th>Parameter</th><th>Default</th><th>What it does</th></tr>
  </thead>
  <tbody>
    <tr><td><code>theme</code></td><td><code>material-theme</code></td><td>Theme for all code blocks. Unknown names fall back to the default.</td></tr>
    <tr><td><code>dark-theme</code></td><td>none</td><td>Theme used when the visitor's system prefers dark mode.</td></tr>
  </tbody>
</table>
<p>
  To highlight code added after page load, call <code>window.ShikiLoader.highlight()</code>, optionally with a
  root element. Already-highlighted blocks are skipped.
</p>
```

**7f. Visible FAQ** (new /about section, same questions as report §7.3d; two answers are shortened for the page):
```tsx
<h2 className="text-2xl font-semibold mb-4 border-b pb-2">Frequently asked questions</h2>
<h3>How do I add Shiki syntax highlighting to a website without a build step?</h3>
<p>Add the Shiki Loader script tag to the page and give each code element a class such as language-js. Shiki Loader finds and highlights every pre/code block automatically.</p>
<h3>How do I enable dark mode?</h3>
<p>Add both theme and dark-theme parameters to the script URL, for example ?theme=github-light&amp;dark-theme=github-dark. The dark theme is used when the visitor's system prefers dark mode.</p>
<h3>How do I highlight code added after the page loads?</h3>
<p>Call window.ShikiLoader.highlight(), optionally passing a root element. Blocks that are already highlighted are skipped.</p>
<h3>What happens with an unknown language or theme?</h3>
<p>Code blocks with an unsupported language are skipped and a warning is logged to the console. Unknown theme names fall back to material-theme.</p>
<h3>Is Shiki Loader free?</h3>
<p>Yes. Shiki Loader is free and open source under the MIT license.</p>
```
Then add the `FAQPage` JSON-LD (report §7.3d) through `<JsonLd>`, after copying these visible answers into its `text` fields so markup and page match exactly.

**7g. Comparison (optional, M-3):** a table of *Shiki Loader / Prism.js / highlight.js / build-time Shiki* with rows: setup (script tag vs build plugin), where highlighting runs, theme source, dark mode, copy button built in. Fill every cell from each project's own docs; don't guess. **[ADD: verified cells]**

**Check it worked:**
```bash
curl -s https://vespaiach.github.io/shiki-loader/about | grep -c 'What options does Shiki Loader support'
```
Expect `1`. Run the same check on each new heading, then rerun the report's §7.5 prompt set after about 4 weeks.
**Risk / rollback:** copy only; revert to undo. **Effort:** M · content + developer

---

## Fix 8: Label the theme selects (M-4)

- **Issue:** both `<select>`s lack an accessible name, so Lighthouse `select-name` and `agent-accessibility-tree` fail ([report M-4](GEO-AUDIT-REPORT.md#m-4-theme-selects-have-no-accessible-name-fails-lighthouse-agentic-browsing)).
- **Why it matters:** screen-reader users and browsing agents (Google-Agent, Claude in Chrome) can't tell what each dropdown is.

**Code: `src/components/Select.tsx`** (one attribute):
```diff
-      <select className="select w-full" value={value ?? ""} onChange={onChange}>
+      <select className="select w-full" aria-label={label} value={value ?? ""} onChange={onChange}>
```
**Check it worked:** Lighthouse → Accessibility and Agentic Browsing on the homepage. Trial build: **both 1.0** (live: 0.94 / 0.5).
**Risk / rollback:** none. **Effort:** S · developer

---

## Fix 9: Small cleanups (L-4, L-6, L-7)

1. **Remove `keywords` and `robots` from `src/app/layout.tsx` metadata.** The Fix 3 block already omits them.
   - Pages are indexable by default.
   - This also stops the 404 page from carrying both `noindex` and `index, follow`. Trial-verified: the 404 page then has only `noindex`.
2. **Add a `<main>` landmark to /about:** in `src/app/about/page.tsx`, change the outermost `<div className="min-h-screen …">` and its closing `</div>` to `<main …>` and `</main>`.

**Check it worked:**
```bash
curl -s https://vespaiach.github.io/shiki-loader/404 | grep -o '<meta name="robots"[^>]*>'
```
Expect only `noindex`. Lighthouse Accessibility on /about should reach 1.0.
**Risk / rollback:** none. **Effort:** S · developer

---

## Fix 10: Cut the loader's main-thread time (M-5)

- **Issue:** on mobile (Lighthouse lab), `shiki-loader.js` spends **613 ms** scripting, and the homepage's TBT is **940 ms** ([report M-5](GEO-AUDIT-REPORT.md#m-5-mobile-total-blocking-time-is-940-ms-lab)).
- **Why it matters:** every site that embeds the loader pays this cost. A fast loader is also a claim you can then put on the site.
- **Status: design sketch, not built or tested.** This changes the published product, so it needs its own PR, tests in `src/shiki-loader/__tests__/`, `bun run build:lib`, a new release tag (for example v2.2.0), and updated snippet URLs. jsDelivr users pinned to `@v2.1.0` won't get it automatically.

**Approach** (`src/shiki-loader/index.ts`, `highlight()`): highlight blocks near the viewport first, and the rest when they scroll into view, yielding between blocks.
```ts
// sketch: replace the eager Promise.allSettled over all blocks
const io = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      io.unobserve(entry.target);
      void highlightBlock(entry.target as HTMLElement); // existing per-block logic, extracted
    }
  },
  { rootMargin: "200px" },
);
root.querySelectorAll("pre code").forEach((el) => io.observe(el));
```
**Check it worked:** Lighthouse mobile on the demo: TBT under 200 ms and Performance at least 0.9.
**Risk / rollback:** blocks far below the fold highlight later. Print/"find in page" before scrolling shows plain code. Keep an opt-out parameter if users complain. **Effort:** M · developer

---

## Fix 11: Build the off-site entity (H-4)

> **These happen outside the site, in your accounts.** I didn't do any of them.

- **Issue:** no Wikidata, npm or third-party mentions; 1 GitHub star ([report H-4](GEO-AUDIT-REPORT.md#h-4-almost-no-off-site-entity-footprint)).
- **Why it matters:** this is 20% of the score. LLMs describe tools that several independent sources describe consistently.

**Steps (highest leverage first)**
1. **Fix the GitHub "About" box** (repo → ⚙ next to About):
   - Description: `Add Shiki syntax highlighting to any web page with one script tag: language labels, copy buttons, dark mode. No build step.`
   - Add topics: `syntax-highlighter`, `code-highlighting`, `cdn`, `static-site`, `wordpress`, `ghost`.
2. **Publish to npm as `shiki-loader`** (the name is unclaimed):
   - The repo's `package.json` is `"private": true` (it's the Next app), so publish from a separate folder, e.g. `npm/package.json`:
     ```json
     {
       "name": "shiki-loader",
       "version": "2.1.0",
       "description": "Add Shiki syntax highlighting to any web page with one script tag.",
       "type": "module",
       "main": "shiki-loader.js",
       "files": ["shiki-loader.js", "README.md", "LICENSE"],
       "repository": { "type": "git", "url": "git+https://github.com/vespaiach/shiki-loader.git" },
       "homepage": "https://vespaiach.github.io/shiki-loader/",
       "license": "MIT",
       "keywords": ["shiki", "syntax-highlighting", "code-highlighting", "browser", "cdn"]
     }
     ```
   - Copy `public/shiki-loader.js`, `README.md` and `LICENSE` into that folder, then run `npm publish` there from your own npm account.
   - This adds `https://cdn.jsdelivr.net/npm/shiki-loader@2.1.0/shiki-loader.js` and unpkg URLs.
3. **Ecosystem listings:** open PRs or issues to add Shiki Loader to Shiki's integrations/community page (if it accepts entries) and to relevant "awesome" lists. Follow each list's contribution rules.
4. **One launch post** on dev.to or Hashnode: "Add Shiki highlighting to any static site with one script tag". Include a WordPress and a Ghost walkthrough with real screenshots. Cross-post to r/webdev and **Show HN** once.
5. **A 60-second demo video** (YouTube) showing paste → highlighted blocks → dark mode. Link the site in the description.
6. **Link it from your own site** (`vespaiach.com` doesn't mention it today) and add it to your GitHub profile README.
7. **Wikidata:** only after independent coverage exists (posts, listings). Wikidata needs notability references, so don't create it first.

Never buy or seed fake mentions or reviews; Google's AI guide warns against inauthentic mentions.

**Check it worked:** monthly, run the report's §7.5 prompt set; search `"shiki-loader"` on Reddit/HN; check `data.jsdelivr.com/v1/stats/packages/gh/vespaiach/shiki-loader?period=month` (baseline: 181 hits/year) and npm weekly downloads.
**Effort:** L, ongoing · you

---

## Fix 12: Measurement (M-6, Track G)

> **Do these in your GA4 and Search Console accounts.**

1. **GA4 AI channel:** Admin → Data display → Channel groups → **Copy** the default group → **Add new channel** named `AI assistants` → condition **Source** *matches regex*:
   ```text
   ^(chatgpt\.com|chat\.openai\.com|perplexity\.ai|www\.perplexity\.ai|copilot\.microsoft\.com|gemini\.google\.com|claude\.ai|chat\.mistral\.ai|meta\.ai|grok\.com|you\.com|duckduckgo\.com)$
   ```
   Drag it **above Referral**, save, and use it in Reports → Acquisition. Property: `G-233H73TCVN`. It only applies to new data.
2. **GSC Generative AI report** and **Bing AI Performance**: after Fix 5.
3. **Bot logs:** not available on GitHub Pages. If you ever need them, a custom domain behind Cloudflare gives AI-bot analytics. That's a hosting change, out of scope here.
4. **Monthly prompt test:** the report's §7.5 table. Log results in a sheet: date, engine, question, cited (y/n), cited URL.

**Effort:** S · you

---

## Fix 13 (optional): Explicit `robots.txt` (L-8)

- **Issue:** the host-root robots.txt returns 404. That already means "allow all", so **nothing is blocked today**.
- **Only if you want explicit control:** create a public repo named exactly `vespaiach/vespaiach.github.io` and enable Pages on it. Commit the report's §7.1 file as `robots.txt` at its root.
  - It applies to **every** project page under `vespaiach.github.io`.
  - Creating that repo also publishes a homepage at `https://vespaiach.github.io/`, so add an `index.html` (even a one-line redirect to your site).

**Check it worked:**
```bash
curl -s https://vespaiach.github.io/robots.txt | head -5
```
**Risk / rollback:** a wrong `Disallow` here hides *all* your project pages. Delete the repo to roll back. **Effort:** S · you

---

## Re-audit checklist (after the fixes ship)

Run these, then rescore with the report's rubric to compare with today's **32/100**.

| # | Check | Command / tool | Pass |
|---|---|---|---|
| 1 | No CSR bailout | `curl -s https://vespaiach.github.io/shiki-loader/ \| grep -c BAILOUT` | `0` |
| 2 | Install snippet in raw HTML | `curl -s …/shiki-loader/ \| grep -c 'cdn.jsdelivr.net/gh/vespaiach'` | ≥ 1 |
| 3 | Canonicals and titles | `curl -s …/about \| grep -oE '<title>[^<]*\|rel="canonical"[^>]*'` | About title, self canonical |
| 4 | Sitemap | `curl -sI …/shiki-loader/sitemap.xml` | 200 |
| 5 | llms.txt | `curl -sI …/shiki-loader/llms.txt` | 200 |
| 6 | JSON-LD | validator.schema.org on both URLs; Rich Results Test on /about | 0 errors; Breadcrumbs found |
| 7 | Lighthouse | Accessibility, Agentic Browsing, Performance (mobile) on both URLs | 1.0 / 1.0 / ≥ 0.9 after Fix 10 |
| 8 | Bot access unchanged | the report's App. B loop (14 UAs × 3 URLs) | all 200, same bytes as browser |
| 9 | GSC / Bing | URL Inspection on both URLs | Indexed |
| 10 | Answer-first copy | each H2 opens with a 40–80-word direct answer, visible in raw HTML | yes |
| 11 | Entity footprint | npm page live; search `"shiki-loader"`; jsDelivr monthly hits | growing vs baseline (181/yr) |
| 12 | AI citations | the report's §7.5 prompt set | track month over month |

*Aside: `bun run lint` currently fails on a formatting issue in `.claude/skills/wiki-llms-txt/.skillfish.json`, which predates this audit. Run `bunx biome format --write .claude/skills/wiki-llms-txt/.skillfish.json` so your pre-merge checklist passes. The deploy workflow doesn't run lint, so this doesn't block deploys.*
