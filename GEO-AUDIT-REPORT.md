# GEO + Technical SEO Audit (v2): Shiki Loader

**Site:** https://vespaiach.github.io/shiki-loader/ · **Audit date:** 2026-11-15 · **Method:** v2 prompt (evidence + confidence labels, rubric scoring)

> **Scope note.** This audits the **live** site. Two Critical fixes (homepage prerender, `public/llms.txt`) are already written in this repo's worktree but are **uncommitted and not deployed**, so the live findings below still show those problems. §6 projects the score once they ship.

Confidence labels: **Verified** = observed directly · **Inferred** = reasonable reading of evidence · **Not checkable** = needs data or access I don't have.

---

## 1. Executive summary

**Composite GEO score: 32/100, band: At risk (<50).**

Shiki Loader solves a real, specific problem: Shiki highlighting from one `<script>` tag. Every AI and search crawler can reach the site. No robots.txt blocks them and no firewall interferes: 14 bot user agents all got the same 200 response. The problem is what they get.

**Three biggest problems**
1. **The homepage is empty without JavaScript.** Its raw HTML has 0 words of body text; the rendered page has 409. Most AI crawlers don't run JS.
2. **No one else talks about it.** No Wikidata or Wikipedia entry, no npm package, no third-party mentions found, 181 jsDelivr hits in the past year.
3. **Thin, undated, anonymous content.** About 200 words on /about, no author, no dates, no facts or numbers, and no structured data.

**Three fastest wins**
1. **Deploy the homepage fix that's already written.** Commit and merge to `main`, and the existing GitHub Action redeploys. About 5 minutes.
2. **Add canonical, `metadataBase`, an absolute `og:url` and per-page titles.** About 20 lines in `layout.tsx` and `about/page.tsx`.
3. **Rewrite the two opening paragraphs answer-first** (§7.4) and fix the grammar errors visible to users and crawlers.

---

## 2. Score table

| Category | Weight | Score | Weighted | % of points verified |
|---|---:|---:|---:|---:|
| AI Citability & Visibility | 25% | 57 | 14.25 | 95% |
| Brand Authority Signals | 20% | 8 | 1.60 | 90% |
| Content Quality & E-E-A-T | 20% | 25 | 5.00 | 100% |
| Technical Foundations | 15% | 48 | 7.20 | 90% |
| Structured Data | 10% | 0 | 0.00 | 100% |
| Platform Optimization | 10% | 35 | 3.50 | 85% |
| **Composite** | | | **31.55 → 32** | |

### Sub-scores (math)

Categories with unverifiable points are scored on checked points only: score = earned ÷ checkable × 100.

| Category | Rubric item (max) | Earned | Evidence (§ / Appendix) |
|---|---|---:|---|
| **Citability** | Search/user bot access in robots.txt (20) | 20 | No robots.txt (404), so all bots are allowed. App. A |
| | Actual access past WAF/CDN (20) | 20 | 14 user agents × 3 URLs all return 200 with identical bytes. App. B |
| | Answer-first, extractable passages (25) | 6 | Homepage has 0 raw words. /about has one definition and a features list. §5 Track C |
| | Evidence density & sourcing (20) | 3 | No numbers or dates. Only outbound links are to Shiki and esm.sh. |
| | Snippet eligibility (10) | 5 of 5 checkable | No `nosnippet`, `max-snippet` or `noindex`. *Index status (5): Not checkable.* |
| | llms.txt / Markdown negotiation (5) | 0 | Both return 404. App. A |
| | **Total** | **54 / 95 → 57** | |
| **Brand** | Knowledge-base entities (20) | 0 of 15 checkable | Wikidata and Wikipedia APIs return 0 hits. *Knowledge-panel signs (5): Not checkable.* |
| | Official profiles + `sameAs` (20) | 5 | The GitHub repo has a homepage URL and topics. No `sameAs` on the site; no project LinkedIn or YouTube. |
| | Third-party reviews/directories (20) | 2 | Only the auto-generated jsDelivr page. `npm shiki-loader` returns 404. |
| | Community mentions (20) | 0 of 15 checkable | None found. *Private communities (5): Not checkable.* |
| | Press/listicles (20) | 0 | Not in "best syntax highlighter" roundups (Track F). |
| | **Total** | **7 / 90 → 8** | |
| **Content** | Author/expertise (25) | 2 | No byline. Only a GitHub link. |
| | First-hand experience & original data (25) | 6 | A working live demo with a theme previewer. No data. |
| | Freshness & date consistency (20) | 3 | No dates anywhere. Version `v2.1.0` appears only inside the snippet URL. |
| | Non-commodity value (20) | 8 | The live theme previewer and generated snippet aren't on Shiki's own docs. |
| | Readability (10) | 6 | Short and clear, but has grammar errors (§5 Track C). |
| | **Total** | **25 / 100** | |
| **Technical** | Server-rendered critical content (30) | 8 | Homepage CSR bailout; /about is prerendered. |
| | Indexability & canonicals (25) | 10 | Pages return 200 with `index, follow`. No canonical, no sitemap, relative `og:url`, duplicate titles. |
| | HTTPS/hygiene (15) | 12 | HTTPS is enforced. No HSTS header. 2-hop redirect for the no-slash HTTP URL. |
| | Core Web Vitals & mobile (20) | 8 of 10 checkable | Lab: LCP 0.8 s, CLS 0, TBT 940 ms on mobile. *Field data (10): Not checkable.* |
| | Agent readiness (10) | 5 | Lighthouse Agentic Browsing: home 0.5, about 1.0. No Markdown negotiation. |
| | **Total** | **43 / 90 → 48** | |
| **Structured data** | Valid & matches content (40) / Core graph (30) / Business-type (30) | 0 / 0 / 0 | No JSON-LD, Microdata or RDFa on either page. |
| **Platform** | Google AI (30) | 12 | Snippet-eligible. Googlebot renders JS, so it's less affected by the CSR bailout (Inferred). Thin and undated. |
| | ChatGPT / Bing / Copilot (30) | 6 of 20 checkable | OAI-SearchBot is allowed but gets an empty homepage. No Bing verification, no IndexNow. *Bing index (10): Not checkable.* |
| | Perplexity (20) | 5 | Access OK. No recency signals or data tables. Empty homepage. |
| | Claude & others (10) | 4 | Access OK. Empty homepage. /about is quotable. |
| | Measurement (10) | 3 of 5 checkable | GA4 `G-233H73TCVN` loads via GTM (Verified). *GSC and Bing AI reports (5): Not checkable.* |
| | **Total** | **30 / 85 → 35** | |

**Composite:** 57×0.25 + 8×0.20 + 25×0.20 + 48×0.15 + 0×0.10 + 35×0.10 = 14.25 + 1.60 + 5.00 + 7.20 + 0 + 3.50 = **31.55 ≈ 32**

> **Why this is higher than the v1 report's 22.** The v2 rubric gives 40 citability points for crawler *access*, which this site passes fully. The underlying problems are the same.

---

## 3. Site profile

| | |
|---|---|
| **Business type** | **Other: free open-source developer tool** (MIT JS library + demo site). *Inferred:* you didn't provide one. No pricing, products or locations. The closest model is SaaS, so schema uses `SoftwareApplication` + `SoftwareSourceCode`, with a `Person` as publisher, since it's a solo project with no organization. |
| **Stack** | Next.js 16 App Router, `output: "export"`, React 19, Tailwind + DaisyUI, GTM → GA4. Deployed by GitHub Actions (`.github/workflows/deploy-pages.yml`, on push to `main`) to **GitHub Pages**. *Verified (repo + headers).* |
| **CDN / server** | `server: GitHub.com`, `via: 1.1 varnish`, `x-served-by: cache-chi-…`, `x-fastly-request-id` (Fastly). No WAF or bot management detected. `cache-control: max-age=600`. *Verified.* |
| **Target questions** | Not provided. Derived from the product (see Track F). |
| **Competitors** | Not provided. Inferred from search results that rank for the same intent: `shiki-element` (npm), Shiki's own CDN usage guide (shiki.style), Prism.js, highlight.js. |

**Pages audited.** The site has only 2 indexable pages. No sitemap exists, and internal links reach nothing else, so the 25-page limit didn't apply.

| # | URL | Why chosen |
|---|---|---|
| 1 | `/shiki-loader/` | Homepage: the product, install snippet and live demo. Highest value. |
| 2 | `/shiki-loader/about` | The only explanatory content: definition, features, how it works. |
| — | `/shiki-loader/shiki-loader.js` | Access test only (the product file is served from the site). |
| — | `/shiki-loader/404` | Hygiene check (soft 404). |
| Off-site | `github.com/vespaiach/shiki-loader`, jsDelivr | Main corroborating sources for the entity. |

---

## 4. Prioritized action plan

Effort: S = under 1 h · M = half a day · L = multi-day or ongoing.

### 🔴 Critical

#### C-1. Homepage ships no body content to non-JS crawlers
- **Evidence (Verified):** `curl https://vespaiach.github.io/shiki-loader/` returns 9,091 B with no `<h1>` or body text, only:
  ```html
  <!--$!--><template data-dgst="BAILOUT_TO_CLIENT_SIDE_RENDERING"></template><!--/$-->
  ```
  The rendered DOM (browser, same URL) has 1 H1, 2 H2s, 409 words and the `<script>` install snippet. Raw HTML has none of them (App. C).
- **Cause (Verified, repo):** `src/app/page.tsx` wraps `HomeClient` (which calls `useSearchParams()`) in `<Suspense fallback={null}>`. With `output: "export"`, the prerendered HTML is the fallback, which is empty.
- **Engines affected:** OAI-SearchBot / ChatGPT-User, Claude-SearchBot / Claude-User, PerplexityBot / Perplexity-User, DuckAssistBot, MistralAI and other non-rendering fetchers. Googlebot and Bingbot render JS, so Google AI Overviews and Copilot are less affected (*Inferred*: rendering is deferred and not guaranteed).
- **Fix: already written in this worktree, uncommitted.** `HomeClient` reads `window.location.search` in a mount effect, and `page.tsx` drops `Suspense`. Diff in `GEO-FIX-GUIDE.md` → Fix 1.
- **Effort:** S (commit + merge). **Impact:** highest of any item. The homepage becomes quotable by every engine.
- **Verify:** after deploy, `curl -s https://vespaiach.github.io/shiki-loader/ | grep -c 'cdn.jsdelivr.net/gh/vespaiach/shiki-loader'` should be ≥ 1, and `grep -c BAILOUT` should be 0. (Local build: 0 BAILOUT, 421 words in raw HTML.)

### 🟠 High

#### H-1. No answer-first, evidence-dense copy on either page
- **Evidence (Verified):** the homepage's first paragraph is *"The effortless way to highlight your code snippets."* It doesn't say what the product is, what it runs on, or how. The /about definition has a grammar error: *"…helps you to quickly add with a syntax-highlighting engine to your web pages…"*. The homepage has *"Simply copy this snippet the HTML snippet on the right"*. The /about H2 *"How it works?"* is ungrammatical.
- **Engines:** all (ChatGPT, Perplexity, Claude, Google AI).
- **Fix:** rewrites in §7.4. Add a parameters table and a "Re-highlight dynamic content" section, using facts already in the README.
- **Effort:** S–M. **Impact:** high for citation. **Verify:** each H2 section opens with a 40–80-word self-contained answer, and `grep` the new copy in raw HTML.

#### H-2. Missing canonical, `metadataBase`, valid `og:url`, share image and per-page titles
- **Evidence (Verified):** neither page has a `<link rel="canonical">`. Homepage: `<meta property="og:url" content="/"/>` (relative, invalid for Open Graph). `twitter:card=summary_large_image` but no image is declared, and `/shiki-loader/opengraph-image.png` returns 404. `/about` has `<title>Shiki Loader – Browser syntax highlighting</title>`, the same as the homepage.
- **Engines:** Google, Bing; link previews in ChatGPT, Slack, X and LinkedIn.
- **Fix:** see `GEO-FIX-GUIDE.md` → Fix 3. **Effort:** S. **Verify:** `curl -s URL | grep -E 'rel="canonical"|og:url|og:image|<title>'`.

#### H-3. No sitemap, and the site isn't connected to Bing or IndexNow
- **Evidence (Verified):** `/sitemap.xml` and `/shiki-loader/sitemap.xml` return 404. There's no `msvalidate.01` meta tag and no IndexNow key file. Bing and Google index status: *Not checkable* without the Webmaster accounts.
- **Engines:** ChatGPT search and Copilot (both lean on Bing), Google.
- **Fix:** add `src/app/sitemap.ts`, verify in Bing Webmaster Tools (import from GSC), and optionally add IndexNow. Guide → Fixes 4–5. **Effort:** S. **Verify:** `curl -sI …/sitemap.xml` returns 200, and Bing Webmaster URL Inspection shows "Indexed".

#### H-4. Almost no off-site entity footprint
- **Evidence:**
  - Wikidata `wbsearchentities` for "shiki-loader", "shiki loader" and "vespaiach" all return `[]` (Verified).
  - Wikipedia full-text search for "shiki-loader" returns `totalhits: 0` (Verified).
  - GitHub: 1 star, 0 forks (Verified, v1 run). GitHub code search for `shiki-loader.js vespaiach` finds only your own repo (Verified).
  - jsDelivr: 181 hits in the past year (Verified).
  - `registry.npmjs.org/shiki-loader` returns 404, so the name is unclaimed (Verified).
  - Web searches for the project on Reddit, HN, LinkedIn and YouTube return no results about it (Verified for the search tool used; coverage *Inferred*).
- **Engines:** all. LLMs trust entities that several independent sources describe consistently.
- **Fix:** publish to npm; submit to Shiki ecosystem/awesome lists; write one launch post and do a Show HN; fix the GitHub repo description typo. Never seek fake or inauthentic mentions (Google's AI guide warns against this). Guide → Fix 11. **Effort:** L (ongoing).

### 🟡 Medium

#### M-1. No structured data
- **Evidence (Verified):** zero `application/ld+json` blocks in raw HTML and the rendered DOM on both pages.
- **Fix:** JSON-LD graph in §7.3: `WebSite`, `Person`, `SoftwareApplication`, `SoftwareSourceCode`, `BreadcrumbList`.
  - **Rich-result reality (Verified, Google docs):** the Software App rich result *requires* `aggregateRating` or `review`. This site has neither, so **no rich result is expected**. Never add fabricated ratings. The markup still helps entity understanding.
  - `FAQPage` rich results stopped for all sites on 2026-05-07 (multiple sources; Google keeps using the markup for understanding).
  - BreadcrumbList is still an active rich result.
- **Engines:** Google (understanding, breadcrumbs), Bing; LLMs indirectly. **Effort:** S. **Verify:** validator.schema.org and Google's Rich Results Test (breadcrumb).

#### M-2. No author, dates or changelog (E-E-A-T and freshness)
- **Evidence (Verified):** no byline, no `datePublished`/`dateModified`, no release notes on either page. Releases exist only as GitHub tags v1.0.0 to v2.1.0.
- **Fix:** add a "Latest: v2.1.0 · Updated [date] · MIT · by [name]" line and a short changelog section from the GitHub releases. Keep dates in sync with schema `dateModified` and sitemap `lastModified`. **Effort:** S. **Engines:** Perplexity (recency), Google, ChatGPT.

#### M-3. No extractable reference data (tables, FAQ, comparison)
- **Evidence (Verified):** neither page has a `<table>`, an FAQ or a comparison. The README has a config section that isn't on the site.
- **Fix:** add (a) a URL-parameter table (`theme`, `dark-theme`, defaults, fallback), (b) a visible 5-question FAQ (§7.3 has matching markup), and (c) a fact-based comparison with Prism.js, highlight.js and build-time Shiki, using only features you can verify. **Effort:** M. **Engines:** Perplexity and ChatGPT especially.

#### M-4. Theme `<select>`s have no accessible name (fails Lighthouse Agentic Browsing)
- **Evidence (Verified, Lighthouse 13.6.0):** `agent-accessibility-tree` and `select-name` both score 0: *"Select element must have an accessible name"*, `<select class="select w-full">`. Cause: `src/components/Select.tsx` uses `<legend>` inside a nested `<fieldset>`, which doesn't label the `<select>`.
- **Fix:** add `aria-label={label}` or a `<label htmlFor>`. Guide → Fix 8. **Effort:** S. **Impact:** screen-reader users plus browsing agents (Google-Agent, Claude in Chrome, etc.).

#### M-5. Mobile Total Blocking Time is 940 ms (lab)
- **Evidence (Verified, Lighthouse mobile, simulated):** Performance 0.79, TBT 940 ms, LCP 0.8 s, CLS 0. The largest JS cost is `cdn.jsdelivr.net/gh/vespaiach/shiki-loader@v2.1.0/public/shiki-loader.js?theme=material-theme` at **613 ms** of scripting. Desktop: Performance 1.0.
- This is the product's own highlighting work, so it affects every site that uses the loader. That makes it a strong "lightweight" claim to earn before you make it.
- **Fix:** yield to the main thread between blocks, or highlight off-screen blocks lazily (IntersectionObserver). Guide → Fix 10. **Effort:** M. **Field data:** *Not checkable*. The PSI API quota was exhausted and CrUX likely has no data at this traffic level.

#### M-6. AI measurement not set up (beyond GA4)
- **Evidence:** GA4 `G-233H73TCVN` is in GTM container `GTM-TXB9CSX9` (Verified). Whether an AI-referrer channel group exists, and whether the GSC Generative AI and Bing AI Performance reports are in use: *Not checkable*.
- **Fix:** §7.5 regex plus the steps in the guide → Fix 12. **Effort:** S.

### 🟢 Low

| # | Issue | Evidence | Conf. | Fix | Effort |
|---|---|---|---|---|---|
| L-1 | `llms.txt` not deployed | `/shiki-loader/llms.txt` returns 404. The repo-root `llms.txt` isn't in `public/`. | Verified | Ready in the worktree (`public/llms.txt`). **Google Search ignores llms.txt** (Google AI guide). It's mainly for coding and browsing agents. Lighthouse's `llms-txt` audit currently reports N/A for this subpath. | S |
| L-2 | No HSTS header | Homepage response has no `strict-transport-security`. The hstspreload.org API returns `status: unknown` for `github.io`. | Verified (header) / Inferred (preload) | GitHub Pages doesn't allow custom headers. Only a custom domain behind a CDN could add one. | — |
| L-3 | 2-hop redirect on `http://…/shiki-loader` | 301 → `https://…/shiki-loader`, then 301 → `https://…/shiki-loader/` | Verified | Always link to `https://vespaiach.github.io/shiki-loader/` (with slash). The hosting behavior can't be changed. | S |
| L-4 | `/shiki-loader/404` returns 200 (soft 404) with two conflicting robots metas (`noindex` and `index, follow`) | curl output, App. A | Verified | Harmless: Google applies the most restrictive rule. Cleanup: move `robots` metadata out of the root layout into `page.tsx` files so `not-found` keeps only `noindex`. | S |
| L-5 | No Markdown negotiation (`Accept: text/markdown` → `text/html`, `vary: Accept-Encoding`) | App. A | Verified | GitHub Pages can't do content negotiation. Optional: static `index.md`/`about.md` linked with `rel="alternate" type="text/markdown"` per llmstxt.org. Not useful for Google. | M |
| L-6 | `<meta name="keywords">` present | Homepage head | Verified | Remove (no major engine uses it). | S |
| L-7 | `/about` has no `<main>` landmark | Lighthouse `landmark-one-main` = 0 | Verified | Wrap the content in `<main>`. | S |
| L-8 | Host-root robots.txt not controllable | `/robots.txt` returns 404 at `vespaiach.github.io` | Verified | Nothing is blocked today, so no action is needed. For explicit control, create the `vespaiach/vespaiach.github.io` user-site repo (affects all your project pages) or use a custom domain. File in §7.1. | M |

**Checked and fine (no action):** no Disallow rules for any bot; no deprecated `anthropic-ai`/`Claude-Web` lines to clean up; no `Content-Signal` directives; no `nosnippet`/`max-snippet`/`data-nosnippet`; no spam patterns (no hidden text, cloaking, keyword stuffing, fake reviews or fake authors). The keywords meta is benign.

---

## 5. Analysis detail by track

### Track A: AI crawler access

**A1. robots.txt.** `https://vespaiach.github.io/robots.txt` returns **404** (GitHub's HTML 404 page, 9,115 B). Under RFC 9309 a 4xx robots.txt means "no restrictions", so every bot below is **allowed** for `/shiki-loader/` and `/shiki-loader/about`. *Verified.* Bot roles come from the official docs fetched today (OpenAI, Anthropic, Perplexity, Google) and the ai-robots-txt list (208 bots, last commit 2026-11-14).

| Role | Bots | Status | Notes |
|---|---|---|---|
| AI search indexing | OAI-SearchBot, Claude-SearchBot, PerplexityBot, Bingbot, Googlebot, Applebot, DuckAssistBot, MistralAI-Index | Allowed | Recommended: keep allowed. |
| User-triggered fetchers | ChatGPT-User, Claude-User, Perplexity-User, Google-Agent, meta-externalfetcher, MistralAI-User | Allowed | OpenAI, Perplexity and Google docs say these generally **don't** follow robots.txt anyway. |
| Training / product tokens | GPTBot, ClaudeBot, Google-Extended, Applebot-Extended, meta-externalagent, CCBot, Bytespider, Amazonbot | Allowed | Policy choice. For an open-source dev tool, allowing training helps models *know* the tool exists. `Google-Extended` "does not impact a site's inclusion in Google Search" (Google docs); it doesn't control AI Overviews. |
| Deprecated | anthropic-ai, Claude-Web | Not referenced | Anthropic's page lists only ClaudeBot, Claude-User and Claude-SearchBot. Nothing to clean up. |

**Recommended stance:** allow everything, which is today's default. No change needed unless you want an explicit file (§7.1).

**A2. Content-Signal.** None. There's no robots.txt and no Cloudflare in front of the site. *Verified.*

**A3. Actual access.** 14 user agents × 3 URLs, 1 s apart: **all 200, byte-identical to Chrome** (App. B). No challenge pages, no 403/429. *Verified at the UA level.* GitHub Pages and Fastly showed no UA-based bot blocking. IP-verified bot treatment can't be tested with spoofed UAs (*Inferred* the same).

**A4. Google AI eligibility.** Meta robots is `index, follow` on both pages. There are no `nosnippet`, `max-snippet` or `data-nosnippet` markers (grep of raw HTML). *Verified.* Whether pages are indexed, and the Search Console "generative AI features" inclusion setting: *Not checkable*. Google's AI guide says a site must be "included in Search generative AI features in Search Console".

**A5. Bing.** No `msvalidate.01` meta, no IndexNow key file. Bing index status: *Not checkable* (no Bing Webmaster access; I didn't scrape Bing results).

### Track B: Technical

- **Rendering (Verified):** see App. C. Homepage: everything is JS-only. /about: fully prerendered (201 words, H1 + 4 H2s, links in raw HTML).
- **Indexability (Verified):** all 200 except trailing-slash `/about/` → 404 (not linked anywhere). No canonicals, no sitemap, no hreflang (single language, `lang="en"`). /about is linked from the homepage, but only through client-rendered JS (orphaned for non-JS crawlers until C-1 ships).
- **Security (Verified):** HTTPS enforced by 301. No HSTS header. Lighthouse Best Practices 1.0, so no mixed content.
- **Performance and mobile:** Lighthouse 13.6.0, lab, run locally with headless Chrome because the shared PSI API quota was exhausted:

| Page | Mode | Perf | A11y | Best Pr. | SEO | Agentic | FCP | LCP | TBT | CLS |
|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| / | mobile | 0.79 | 0.94 | 1.00 | 1.00 | 0.50 | 0.8 s | 0.8 s | 940 ms | 0 |
| / | desktop | 1.00 | 0.94 | 1.00 | 1.00 | 0.50 | 0.3 s | 0.3 s | 70 ms | 0.025 |
| /about | mobile | 1.00 | 0.98 | 1.00 | 1.00 | 1.00 | 0.9 s | 0.9 s | 90 ms | 0 |
| /about | desktop | 1.00 | 0.98 | 1.00 | 1.00 | 1.00 | 0.3 s | 0.3 s | 0 ms | 0 |

  Field data (CrUX): *Not checkable*. Viewport meta is present, and the layout is responsive (`flex-col md:flex-row`).
- **Agent readiness (Verified):** the Agentic Browsing category has these audits: `agent-accessibility-tree` (fail on /, pass on /about), CLS (pass), and `llms-txt`, `ard-schema` and three `webmcp-*` audits (all N/A, informational). Markdown negotiation isn't supported.
- **E-commerce checks:** N/A.

### Track C: Citability & content quality (per page, 0–5)

| Item | `/` (rendered; raw HTML = 0 on all) | `/about` |
|---|---:|---:|
| 1. Answer-first | 1: *"The effortless way to highlight your code snippets."* (no what/how) | 3: *"shiki-loader is a tiny, copy-and-paste script that helps you to quickly add with a syntax-highlighting engine to your web pages…"* (right idea, broken grammar) |
| 2. Question-shaped headings | 0: "Integration", "Live Preview" | 3: "What is Shiki Loader?", "How it works?" |
| 3. Extractable structure | 2: code snippet, no steps or table | 3: 5-item "Key Features" list |
| 4. Evidence density | 0 | 1: links to shiki.style and esm.sh, no numbers |
| 5. Entity clarity | 2: never says it's a browser script powered by Shiki | 4 |
| 6. Freshness | 1: version only inside a URL | 0 |
| 7. E-E-A-T | 1: GitHub link only | 1: "Open Source" section, no author |
| 8. Non-commodity value | 3: live theme previewer + generated snippet are unique | 2 |
| **Total / 40** | **10** | **17** |

Facts that exist in the repo but aren't on the site (usable, not invented): 64 bundled themes in `themes.ts`; Shiki 3.0.0 from esm.sh; `window.ShikiLoader.highlight(root?)`; unknown languages log a warning and are skipped; unknown themes fall back to `material-theme`; MIT; releases v1.0.0 to v2.1.0; the built loader is ~9.2 KB (`/shiki-loader.js`, 9,250 B).

### Track D: Structured data
No JSON-LD, Microdata or RDFa found (raw HTML and rendered DOM, both pages). *Verified.* Gaps and snippets are in §7.3. They're all filled with real values, except the Person's display name, which the site never shows.

### Track E: Brand authority & entity presence

| Source | Finding | Conf. |
|---|---|---|
| Wikipedia | Not found (API `totalhits: 0`) | Verified |
| Wikidata | Not found ("shiki-loader", "shiki loader", "vespaiach" all return `[]`) | Verified |
| Google Knowledge Panel | No signs (no entity in Wikidata, which commonly feeds it) | Inferred |
| GitHub | [repo](https://github.com/vespaiach/shiki-loader): 1 star, 0 forks, topics `shiki`, `shiki-loader`, `syntax-highlighting`, homepage set. The description has the same "add with a" typo. | Verified |
| npm | Not published (`registry.npmjs.org/shiki-loader` returns 404) | Verified |
| jsDelivr | 181 hits/year, rank ~1.5 M | Verified |
| LinkedIn / YouTube / Crunchbase / G2 | Not found (not expected for a free OSS library, except YouTube demos) | Verified (search) |
| Reddit / HN / dev.to | Not found | Verified (search); coverage Inferred |
| "Best X" listicles | Not included. Roundups surfaced cover Prismatic, Enlighter and highlight.js plugins ([wpmayor](https://wpmayor.com/best-syntax-highlighter-plugin-for-wordpress/), [speckyboy](https://speckyboy.com/?p=89402)) | Verified (search) |
| Author's own site | vespaiach.com doesn't mention shiki-loader | Verified |
| Name consistency | GitHub, the site and the README all say "Shiki Loader"/"shiki-loader" ✅. The site has no `sameAs` to reconcile. | Verified |

**Qualitative rating: very weak.** The only source for the entity is the owner's repo.

### Track F: Platform readiness & live spot check

| Engine | Ready? | Blocking issue |
|---|---|---|
| Google AI Overviews / AI Mode | Partly | Eligible (no snippet blocks), but thin, undated, no canonical or sitemap. Google renders JS. |
| ChatGPT search | No | OAI-SearchBot gets an empty homepage. Bing status unknown, no Bing verification. |
| Microsoft Copilot | Unknown | Bing index *Not checkable*. No IndexNow. |
| Perplexity | No | Empty homepage for PerplexityBot. No dates, tables or stats. |
| Claude | Partly | Claude-SearchBot and Claude-User reach /about content. Homepage is empty. |

**Live spot check (web search as a proxy; Inferred).** I can't query ChatGPT, Perplexity or Claude directly. Web search for the derived target questions:

| Query | Cited instead | Shiki Loader cited? |
|---|---|---|
| "how to add Shiki syntax highlighting to a static HTML page with a script tag CDN no build step" | [shiki-element](https://www.npmjs.com/package/shiki-element), [docsify-shiki](https://www.npmjs.com/package/docsify-shiki), [Shiki guide](https://shiki.style/guide/), a CodePen | No |
| "best client-side syntax highlighter for WordPress or Ghost blog 2026" | WordPress plugin roundups (Prismatic, Enlighter) | No |
| "Shiki dark mode light theme prefers-color-scheme browser script copy button language label" | [shiki.style dual themes](https://shiki.style/guide/dual-themes), `shiki-header-with-copy` | No |
| "shiki-loader" (Reddit/HN/LinkedIn/YouTube) | Unrelated Shiki projects | No |

Use §7.5's prompt test set to measure the real assistants monthly.

### Track G: Measurement

| Item | Status |
|---|---|
| GA4 | Present: `G-233H73TCVN` via GTM `GTM-TXB9CSX9` (*Verified*) |
| GA4 AI-referrer channel group | *Not checkable*. Regex in §7.5. |
| GSC Generative AI performance report | *Not checkable*. Needs a verified GSC property for `https://vespaiach.github.io/shiki-loader/`. |
| Bing Webmaster AI Performance | *Not checkable*. Site not verified (no `msvalidate.01`). |
| Server logs | **Not available on GitHub Pages.** No access logs, so bot-hit analysis isn't possible on this host. |

---

## 6. 30/60/90-day roadmap

| Window | Actions | Expected composite |
|---|---|---|
| **Days 1–30** | C-1 deploy (S) · H-1 rewrites (S–M) · H-2 meta and canonical (S) · H-3 sitemap + GSC + Bing + IndexNow (S) · M-4 select labels (S) · L-1 llms.txt (S) · L-6, L-7 (S) | ~40–45 (est.) |
| **Days 31–60** | M-1 JSON-LD (S) · M-2 byline, dates, changelog (S) · M-3 params table, FAQ, comparison (M) · M-6 GA4 channel group and AI reports (S) · H-4 start: npm publish, fix GitHub description, awesome-list PRs (M) | ~50–55 (est.) |
| **Days 61–90** | H-4 continue: launch post + Show HN, WordPress/Ghost how-to posts, short demo video (L) · M-5 main-thread yielding in the loader (M) · first monthly prompt-test run (§7.5) and re-audit | ~55–65 (est.; Brand drives the rest) |

*Projections are estimates, not measurements. They assume the fixes ship as written.*

---

## 7. Ready-to-deploy assets

### 7.1 Recommended `robots.txt` (only deployable via a `vespaiach.github.io` user-site repo or a custom domain)

```text
# robots.txt for vespaiach.github.io
# Applies to ALL project pages on this host (including /shiki-loader/).
# Stance: maximum visibility. Allow search, user-triggered and training bots.

# --- AI search indexing (citations in AI answers) ---
User-agent: OAI-SearchBot
User-agent: Claude-SearchBot
User-agent: PerplexityBot
User-agent: DuckAssistBot
User-agent: MistralAI-Index
User-agent: Applebot
Allow: /

# --- Classic search (also feeds Google AI Overviews / AI Mode and Copilot) ---
User-agent: Googlebot
User-agent: Bingbot
Allow: /

# --- User-triggered fetchers (several ignore robots.txt; listed for clarity) ---
User-agent: ChatGPT-User
User-agent: Claude-User
User-agent: Perplexity-User
User-agent: Google-Agent
Allow: /

# --- Training / product-use tokens: policy choice. Allowed so models learn the tool exists ---
# Google-Extended does NOT affect Search or AI Overviews.
User-agent: GPTBot
User-agent: ClaudeBot
User-agent: Google-Extended
User-agent: Applebot-Extended
User-agent: CCBot
Allow: /

User-agent: *
Allow: /

# Cloudflare Content Signals (only honored by some parties; harmless elsewhere)
Content-Signal: search=yes, ai-input=yes, ai-train=yes

Sitemap: https://vespaiach.github.io/shiki-loader/sitemap.xml
```

### 7.2 `llms.txt` (low priority)

> **Label:** low priority. **Ignored by Google Search** (Google's AI guide says new machine-readable files aren't needed). Mainly used by coding and browsing agents, and checked by Lighthouse's `llms-txt` audit. Format per llmstxt.org: H1, `>` summary, detail paragraphs, H2 link lists, `## Optional`.
>
> **Already written:** `public/llms.txt` in this worktree (uncommitted) has the same content as below. Once deployed it's served at `https://vespaiach.github.io/shiki-loader/llms.txt`, which covers URLs under `/shiki-loader/`.

```markdown
# Shiki Loader

> Shiki Loader is a free, open-source (MIT) browser script that adds Shiki syntax highlighting to any web page with a single `<script>` tag. It automatically finds `<pre><code>` blocks with `language-*` or `lang-*` classes, highlights them using Shiki 3 loaded from esm.sh at runtime, and wraps each block with a language label and a copy-to-clipboard button. No build step, npm install, or framework is required.

Key facts:
- Install: `<script src="https://cdn.jsdelivr.net/gh/vespaiach/shiki-loader@v2.1.0/public/shiki-loader.js" type="module"></script>`
- Configuration is via URL query parameters on the script tag: `theme` (default `material-theme`) and optional `dark-theme`, which is applied automatically when the visitor's system prefers dark mode.
- Unknown theme names fall back to `material-theme`; unknown languages are skipped with a console warning.
- Supports all Shiki bundled languages and 60+ Shiki themes.
- Call `window.ShikiLoader.highlight(root?)` to highlight code added after page load; already-highlighted blocks are skipped.
- Works on static sites, WordPress, Ghost, and any plain HTML page. Self-hosting is supported.
- Latest version: v2.1.0. License: MIT. Maintainer: vespaiach.

## Docs

- [Home and live demo](https://vespaiach.github.io/shiki-loader/): Copy-paste install snippet, theme picker, and live highlighted examples
- [About](https://vespaiach.github.io/shiki-loader/about): What Shiki Loader is, key features, and how it works
- [README](https://github.com/vespaiach/shiki-loader/blob/main/README.md): Full usage guide covering CDN install, theme and dark-theme parameters, re-highlighting dynamic content, and self-hosting

## Source

- [GitHub repository](https://github.com/vespaiach/shiki-loader): Source code, issues, and releases
- [Releases](https://github.com/vespaiach/shiki-loader/releases): Version history and changelog
- [Loader script on jsDelivr](https://cdn.jsdelivr.net/gh/vespaiach/shiki-loader@v2.1.0/public/shiki-loader.js): The built, minified script

## Optional

- [Shiki documentation](https://shiki.style/): The underlying highlighting engine, list of themes and languages
- [Full repository context for coding agents](https://raw.githubusercontent.com/vespaiach/shiki-loader/main/llms-full.txt): Detailed source-level documentation
```

### 7.3 JSON-LD (validated: each block parses as JSON)

Render each as `<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />`. Placement is in `GEO-FIX-GUIDE.md` → Fix 6.

**Placeholders to fill:** `[PLACEHOLDER: display name]`. Your site never shows a name; your public GitHub profile shows one, so use it if you want it attached. Also: remove any `sameAs` URL you don't want linked. The two non-GitHub ones come from your public GitHub profile.

**a) Sitewide graph: `WebSite` + `Person` (in `layout.tsx`)**
```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://vespaiach.github.io/shiki-loader/#website",
      "url": "https://vespaiach.github.io/shiki-loader/",
      "name": "Shiki Loader",
      "description": "Browser-only syntax highlighting for code blocks using Shiki, added with a single script tag.",
      "inLanguage": "en",
      "publisher": { "@id": "https://vespaiach.github.io/shiki-loader/#author" }
    },
    {
      "@type": "Person",
      "@id": "https://vespaiach.github.io/shiki-loader/#author",
      "name": "[PLACEHOLDER: display name]",
      "alternateName": "vespaiach",
      "url": "https://github.com/vespaiach",
      "sameAs": [
        "https://github.com/vespaiach",
        "https://www.vespaiach.com/",
        "https://x.com/vespaiach"
      ]
    }
  ]
}
```

**b) Homepage: `SoftwareApplication` + `SoftwareSourceCode` (in `page.tsx`)**
No `aggregateRating`/`review`, so this won't produce a Google rich result; it's for entity understanding. Every value is visible on the site or in the linked repo.
```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "@id": "https://vespaiach.github.io/shiki-loader/#software",
      "name": "Shiki Loader",
      "url": "https://vespaiach.github.io/shiki-loader/",
      "description": "A drop-in browser script that syntax-highlights <pre><code> blocks using Shiki, with language labels, copy-to-clipboard buttons and automatic dark mode.",
      "applicationCategory": "DeveloperApplication",
      "operatingSystem": "Any modern web browser",
      "softwareVersion": "2.1.0",
      "downloadUrl": "https://cdn.jsdelivr.net/gh/vespaiach/shiki-loader@v2.1.0/public/shiki-loader.js",
      "license": "https://opensource.org/licenses/MIT",
      "isAccessibleForFree": true,
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
      "featureList": [
        "Automatic detection of <pre><code> blocks with language-* or lang-* classes",
        "Light and dark themes via prefers-color-scheme",
        "Language label on every code block",
        "Copy-to-clipboard button",
        "Single script tag, no build step"
      ],
      "isPartOf": { "@id": "https://vespaiach.github.io/shiki-loader/#website" },
      "author": { "@id": "https://vespaiach.github.io/shiki-loader/#author" },
      "sameAs": ["https://github.com/vespaiach/shiki-loader"]
    },
    {
      "@type": "SoftwareSourceCode",
      "@id": "https://vespaiach.github.io/shiki-loader/#source",
      "name": "shiki-loader",
      "codeRepository": "https://github.com/vespaiach/shiki-loader",
      "programmingLanguage": ["TypeScript", "JavaScript"],
      "runtimePlatform": "Web browser",
      "license": "https://opensource.org/licenses/MIT",
      "version": "2.1.0",
      "targetProduct": { "@id": "https://vespaiach.github.io/shiki-loader/#software" },
      "author": { "@id": "https://vespaiach.github.io/shiki-loader/#author" }
    }
  ]
}
```

**c) `/about`: `BreadcrumbList`** (an active Google rich result)
```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Shiki Loader", "item": "https://vespaiach.github.io/shiki-loader/" },
    { "@type": "ListItem", "position": 2, "name": "About", "item": "https://vespaiach.github.io/shiki-loader/about" }
  ]
}
```

**d) `FAQPage`: only after you add the same Q&As as visible text (M-3).** No SERP feature since 2026-05-07; still used for understanding. Every answer below matches the README and loader code.
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How do I add Shiki syntax highlighting to a website without a build step?",
      "acceptedAnswer": { "@type": "Answer", "text": "Add <script src=\"https://cdn.jsdelivr.net/gh/vespaiach/shiki-loader@v2.1.0/public/shiki-loader.js\" type=\"module\"></script> to the page and give each <code> element a class such as language-js. Shiki Loader finds and highlights every <pre><code> block automatically." }
    },
    {
      "@type": "Question",
      "name": "How do I enable dark mode?",
      "acceptedAnswer": { "@type": "Answer", "text": "Add both theme and dark-theme parameters to the script URL, for example ?theme=github-light&dark-theme=github-dark. The dark theme is used when the visitor's system prefers dark mode." }
    },
    {
      "@type": "Question",
      "name": "How do I highlight code added after the page loads?",
      "acceptedAnswer": { "@type": "Answer", "text": "Call window.ShikiLoader.highlight(), optionally passing a root element. Blocks that are already highlighted are skipped." }
    },
    {
      "@type": "Question",
      "name": "What happens with an unknown language or theme?",
      "acceptedAnswer": { "@type": "Answer", "text": "Code blocks with an unsupported language are skipped and a warning is logged to the console. Unknown theme names fall back to material-theme." }
    },
    {
      "@type": "Question",
      "name": "Is Shiki Loader free?",
      "acceptedAnswer": { "@type": "Answer", "text": "Yes. Shiki Loader is free and open source under the MIT license. The source code is at github.com/vespaiach/shiki-loader." }
    }
  ]
}
```

### 7.4 Before/after rewrites (facts from the site and repo only)

**1. Homepage intro** (under the H1)
- **Before:** *"The effortless way to highlight your code snippets."*
- **After (59 words):** **Shiki Loader adds Shiki syntax highlighting to any web page with one `<script>` tag.** It finds every `<pre><code class="language-…">` block, highlights it with Shiki 3 (loaded from esm.sh), and adds a language label and a copy button. It needs no build step and no framework, and it's free under the MIT license. Latest version: v2.1.0.

**2. Homepage "Integration" section** (heading → "How do I install Shiki Loader?")
- **Before:** *"Simply copy this snippet the HTML snippet on the right and paste it into the `<body>` tag of your web pages."*
- **After:** **Paste one script tag before `</body>` and mark your code blocks with a language class.**
  1. Copy the HTML snippet on the right (it updates as you pick themes below).
  2. Paste it into your page's `<body>`, theme footer, or a WordPress/Ghost custom HTML block.
  3. Give each `<code>` element a class like `language-js` or `lang-ts`. Unknown languages are skipped with a console warning.
  4. Optional: add `dark-theme=` to switch themes automatically in dark mode.

**3. /about "What is Shiki Loader?"**
- **Before:** *"shiki-loader is a tiny, copy-and-paste script that helps you to quickly add with a syntax-highlighting engine to your web pages without any setup headaches."*
- **After (64 words):** **Shiki Loader is a ~9 KB browser script that brings the Shiki syntax highlighter to any HTML page.** Load it with one `<script type="module">` tag and it highlights all `<pre><code>` blocks on the page using one of 64 Shiki themes. It also adds a language badge and a copy-to-clipboard button. It works on static sites, WordPress, Ghost and plain HTML. [ADD: a real site that uses it, if any]

Also rename **"How it works?"** to **"How does Shiki Loader work?"**

### 7.5 Measurement assets

**GA4 AI-referrer channel** (Admin → Data display → Channel groups → copy the default → add a channel *above* "Referral"; condition: Source matches regex):
```text
^(chatgpt\.com|chat\.openai\.com|perplexity\.ai|www\.perplexity\.ai|copilot\.microsoft\.com|gemini\.google\.com|claude\.ai|chat\.mistral\.ai|meta\.ai|grok\.com|you\.com|duckduckgo\.com)$
```
*Re-check this list quarterly. `duckduckgo.com` also carries normal search traffic, so drop it if that skews the numbers.*

**Monthly prompt test set.** Run each question in a fresh chat with web search on. Record cited/not cited and the cited URL.

| # | Question | Engines | "Good" looks like |
|---|---|---|---|
| 1 | How do I add Shiki syntax highlighting to a plain HTML page without a build step? | ChatGPT, Perplexity, Claude, Google AI Mode | Names Shiki Loader and shows the jsDelivr script tag |
| 2 | What's the easiest way to add syntax highlighting to a WordPress or Ghost blog using Shiki? | ChatGPT, Perplexity, Copilot | Shiki Loader listed as an option, with a link |
| 3 | Is there a drop-in script that highlights `<pre><code>` blocks with a copy button and language label? | All | Shiki Loader cited |
| 4 | How do I make Shiki switch themes with prefers-color-scheme dark mode? | Google AI Overview, Perplexity | Shiki Loader mentioned next to the shiki.style dual-themes docs |
| 5 | Shiki vs Prism.js vs highlight.js for a static site, client-side? | Perplexity, ChatGPT | Shiki Loader mentioned as the client-side Shiki option |
| 6 | What is shiki-loader? | All | An accurate one-sentence definition, MIT, link to the site or repo |
| 7 | How do I highlight code that's added to the page dynamically with Shiki? | ChatGPT, Claude | `window.ShikiLoader.highlight()` cited |
| 8 | Free CDN script for syntax highlighting with 60+ themes? | Perplexity, Copilot | Shiki Loader cited |

---

## 8. Not checked / needs your data

| Item | Why not | How to check |
|---|---|---|
| Google index status of both URLs | No GSC access | GSC → URL Inspection on each URL. Or search `site:vespaiach.github.io/shiki-loader`. |
| GSC "generative AI features" inclusion setting + Generative AI performance report | No GSC access | GSC → Settings; Performance → Generative AI (data from 2026-05-18) |
| Bing index, Bing AI Performance | No Bing Webmaster access | Bing Webmaster Tools → Add site → Import from GSC → URL Inspection / AI Performance |
| Core Web Vitals field data | PSI API quota exhausted; low traffic likely means no CrUX data | pagespeed.web.dev → the "Discover what your real users are experiencing" panel |
| Knowledge panel | Personalized/regional | Search "Shiki Loader" in Google, logged out |
| Real assistant citations | Can't query ChatGPT/Perplexity/Claude directly | Run the §7.5 prompt set |
| AI bot hits in logs | GitHub Pages has no access logs | Not possible on this host. GA4 only sees human referrals. |
| Private community mentions (Discord, Slack) | Not indexed | Manual |

---

## 9. Appendix: raw evidence

### A. Discovery fetches (2026-11-15/16 UTC, curl, 1 s apart)
```text
http://vespaiach.github.io/shiki-loader   -> 301 Location: https://vespaiach.github.io/shiki-loader
https://vespaiach.github.io/shiki-loader  -> 301 location: https://vespaiach.github.io/shiki-loader/
https://vespaiach.github.io/shiki-loader/ -> 200 text/html; charset=utf-8, 9091 B
  server: GitHub.com | via: 1.1 varnish | x-fastly-request-id: … | cache-control: max-age=600
  vary: Accept-Encoding | (no strict-transport-security, no x-robots-tag, no link header)
/robots.txt                     -> 404   /sitemap.xml -> 404   /sitemap_index.xml -> 404
/shiki-loader/sitemap.xml       -> 404   /llms.txt -> 404      /shiki-loader/llms.txt -> 404
/shiki-loader/llms-full.txt     -> 404   /shiki-loader/index.md -> 404   /shiki-loader/about.md -> 404
/shiki-loader/about             -> 200 (18958 B)   /shiki-loader/about/ -> 404
/shiki-loader/404               -> 200 (soft 404; contains both robots "noindex" and "index, follow")
/shiki-loader/does-not-exist    -> 404
Accept: text/markdown on / and /about -> content-type: text/html; vary: Accept-Encoding
hstspreload.org/api/v2/status?domain=github.io -> {"status":"unknown"}
```

### B. Bot access test (UA strings from official docs; full list in the audit scratchpad `uas.tsv`)

| Bot | / | /about | /shiki-loader.js |
|---|---|---|---|
| Browser (Chrome) | 200 · 9091 B | 200 · 18958 B | 200 · 9250 B |
| Googlebot Smartphone | 200 · 9091 B | 200 · 18958 B | 200 · 9250 B |
| Bingbot | 200 · 9091 B | 200 · 18958 B | 200 · 9250 B |
| OAI-SearchBot | 200 · 9091 B | 200 · 18958 B | 200 · 9250 B |
| ChatGPT-User | 200 · 9091 B | 200 · 18958 B | 200 · 9250 B |
| GPTBot | 200 · 9091 B | 200 · 18958 B | 200 · 9250 B |
| Claude-SearchBot | 200 · 9091 B | 200 · 18958 B | 200 · 9250 B |
| Claude-User | 200 · 9091 B | 200 · 18958 B | 200 · 9250 B |
| ClaudeBot | 200 · 9091 B | 200 · 18958 B | 200 · 9250 B |
| PerplexityBot | 200 · 9091 B | 200 · 18958 B | 200 · 9250 B |
| Perplexity-User | 200 · 9091 B | 200 · 18958 B | 200 · 9250 B |
| Applebot | 200 · 9091 B | 200 · 18958 B | 200 · 9250 B |
| DuckAssistBot | 200 · 9091 B | 200 · 18958 B | 200 · 9250 B |
| Google-Agent | 200 · 9091 B | 200 · 18958 B | 200 · 9250 B |

### C. Raw vs rendered (homepage)

| Element | Raw HTML (curl) | Rendered DOM (browser) |
|---|---|---|
| `<h1>` | none | "Shiki Loader" |
| `<h2>` | none | "Integration", "Live Preview" |
| Body words | 0 | 409 |
| Install `<script>` snippet | absent | present |
| Links | none in body | `/shiki-loader/about`, GitHub repo, `#the-script` |
| JSON-LD | 0 | 0 |
| Canonical | none | none |
| Highlighted code blocks | 0 | 3 (`pre.shiki`) |

Raw HTML body excerpt:
```html
<body class="antialiased"><div hidden=""><!--$--><!--/$--></div><!--$!--><template data-dgst="BAILOUT_TO_CLIENT_SIDE_RENDERING"></template><!--/$-->
```
Local build with the uncommitted C-1 fix: `grep -c BAILOUT out/index.html` returns 0. H1 "Shiki Loader", H2s "Integration" and "Live Preview", 421 words, snippet present.

### D. Schema extracts
None found on `/` or `/about` (raw or rendered).

### E. Lighthouse 13.6.0 (local headless Chrome, lab)
See the §5 Track B table. Failing audits:
- `/` mobile: `total-blocking-time` (0.29), `interactive` (0.43), `max-potential-fid` (0.1), `unused-javascript`, `legacy-javascript-insight`, `render-blocking-insight`, `network-dependency-tree-insight`, `cache-insight`, `select-name` (0), `agent-accessibility-tree` (0)
- `/about`: `landmark-one-main` (0), plus the same JS and cache insights
- Bootup on `/` mobile: shiki-loader.js 613 ms scripting, Next chunk `69be39811437728d.js` 148 ms, unattributable 706 ms
- Agentic Browsing audits on `/`: `agent-accessibility-tree`=0, `cumulative-layout-shift`=1, `llms-txt`/`ard-schema`/`webmcp-*` = not applicable

### F. Official docs consulted (fetched 2026-11-15)
- OpenAI bots: https://developers.openai.com/api/docs/bots (redirected from platform.openai.com/docs/bots)
- Anthropic crawlers: https://support.claude.com/en/articles/8896518
- Perplexity bots: https://docs.perplexity.ai/guides/bots
- Google crawlers: https://developers.google.com/crawling/docs/crawlers-fetchers/google-common-crawlers and …/google-user-triggered-fetchers
- Google AI features guide: https://developers.google.com/search/docs/fundamentals/ai-optimization-guide
- Google structured data gallery and Software App docs: https://developers.google.com/search/docs/appearance/structured-data/search-gallery, …/software-app
- FAQ rich-result retirement (2026-05-07), secondary sources: [SEJ](https://www.searchenginejournal.com/google-drops-faq-rich-results/574429/), [ppc.land](https://ppc.land/google-kills-faq-rich-results-what-seos-saw-coming-since-2019/)
- llms.txt spec: https://llmstxt.org
- Community bot list: https://github.com/ai-robots-txt/ai.robots.txt (robots.json, 208 bots, last commit 2026-11-14)
