import { expect, mock, spyOn, test } from "bun:test";

declare global {
  interface Window {
    ShikiLoader: { highlight(root?: ParentNode): Promise<void> };
  }
}

const tick = () => new Promise((resolve) => setTimeout(resolve, 0));

// index.ts highlights as a side effect of being imported, so the page is set up before the import.
// The query string stands in for the params on the real script URL.
test("highlights supported blocks on load and leaves the rest alone", async () => {
  const warn = spyOn(console, "warn").mockImplementation(() => {});
  document.body.innerHTML = `
    <pre id="first" class="site-code" data-file="a.js"><code class="language-JS">
const a = 1 &lt; 2;
</code></pre>
    <pre><code class="lang-ts">let b: number;</code></pre>
    <pre><code class="language-text">plain words</code></pre>
    <pre id="unknown"><code class="language-klingon">nuqneH</code></pre>
    <pre id="plain"><code>no language</code></pre>`;

  // @ts-expect-error the query string is not part of the module path TypeScript resolves
  await import("../index?theme=github-light&dark-theme=github-dark");
  await tick();

  const highlighted = Array.from(document.querySelectorAll<HTMLElement>(".shiki-loader-mockup-code"));
  expect(highlighted.map((el) => el.dataset.lang)).toEqual(["js", "ts", "text"]);
  expect(highlighted[0].dataset.theme).toBe("github-light+github-dark");

  // Surrounding newlines are trimmed, and the original <pre> attributes survive the swap.
  expect(highlighted[0].querySelector("code")?.textContent).toBe("const a = 1 < 2;");
  expect(highlighted[0].id).toBe("first");
  expect(highlighted[0].dataset.file).toBe("a.js");
  expect(highlighted[0].classList.contains("site-code")).toBe(true);
  expect(highlighted[0].classList.contains("language-JS")).toBe(true);

  expect(document.querySelector("#unknown code")?.textContent).toBe("nuqneH");
  expect(document.querySelector("#plain code")?.textContent).toBe("no language");
  // Only the block that names an unsupported language warns; the one with no language is silent.
  expect(warn).toHaveBeenCalledTimes(1);
  expect(document.head.querySelectorAll("style").length).toBe(1);
  warn.mockRestore();
});

test("ShikiLoader.highlight picks up blocks added later and wires their copy button", async () => {
  const writeText = mock(async (_text: string) => {});
  Object.defineProperty(navigator, "clipboard", { value: { writeText }, configurable: true });
  const before = document.querySelectorAll(".shiki-loader-mockup-code").length;
  const container = document.createElement("section");
  container.innerHTML = `<pre><code class="language-js">late()</code></pre>`;
  document.body.appendChild(container);

  await window.ShikiLoader.highlight(container);

  expect(document.querySelectorAll(".shiki-loader-mockup-code").length).toBe(before + 1);
  expect(document.head.querySelectorAll("style").length).toBe(1);

  container.querySelector("button")?.click();
  await tick();
  expect(writeText).toHaveBeenCalledTimes(1);
  expect(writeText).toHaveBeenCalledWith("late()");
});
