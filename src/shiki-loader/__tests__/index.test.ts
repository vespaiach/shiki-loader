import { expect, test } from "bun:test";

// index.ts highlights as a side effect of being imported, and only once,
// so the whole page is set up first and every assertion runs against that one pass.
test("highlights supported blocks with the dark theme and leaves the rest alone", async () => {
  window.matchMedia = (() => ({ matches: true })) as unknown as typeof window.matchMedia;
  const script = document.createElement("script");
  script.setAttribute("src", "https://cdn.example/shiki-loader.js?theme=github-light&dark-theme=github-dark");
  document.head.appendChild(script);
  document.body.innerHTML = `
    <pre><code class="language-js">const a = 1 &lt; 2;</code></pre>
    <pre><code class="lang-ts">let b: number;</code></pre>
    <pre id="unknown"><code class="language-klingon">nuqneH</code></pre>
    <pre id="plain"><code>no language</code></pre>`;

  await import("../index");
  await new Promise((resolve) => setTimeout(resolve, 0));

  const highlighted = Array.from(document.querySelectorAll<HTMLElement>(".shiki-loader-mockup-code"));
  expect(highlighted.map((el) => el.dataset.lang)).toEqual(["js", "ts"]);
  expect(highlighted.map((el) => el.dataset.theme)).toEqual(["github-dark", "github-dark"]);
  expect(highlighted[0].classList.contains("language-js")).toBe(true);
  expect(highlighted[1].classList.contains("lang-ts")).toBe(true);
  expect(highlighted[0].querySelector("code")?.textContent).toBe("const a = 1 < 2;");

  expect(document.querySelector("#unknown code")?.textContent).toBe("nuqneH");
  expect(document.querySelector("#plain code")?.textContent).toBe("no language");
  expect(document.head.querySelector("style")).not.toBeNull();
});
