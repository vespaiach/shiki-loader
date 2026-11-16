// @ts-expect-error for simplicity, we can ignore type errors in this loader since it's meant to be used as a standalone script
import { bundledLanguages, codeToHtml } from "https://esm.sh/shiki@3.0.0";
import createShikiLoaderTransformer from "./transformer";
import { generateStyles, handleCopyButtonClick, readSearchParams } from "./utils";

// Shiki's plain-text languages are not part of bundledLanguages.
const languages = new Set([...Object.keys(bundledLanguages), "text", "plaintext", "txt", "plain"]);
const { theme, darkTheme } = readSearchParams(import.meta.url);
let hasRun = false;

async function highlight(root: ParentNode = document) {
  if (!hasRun) {
    hasRun = true;
    // Prepended so the host page's own CSS can override the loader's styles.
    document.head.prepend(generateStyles());
  }

  const highlightTasks = Array.from(root.querySelectorAll("pre code")).map(async (codeBlock) => {
    const element = codeBlock as HTMLElement;
    const parent = element.parentElement;
    if (!parent) return;

    // Extract language from class (e.g., language-js)
    const langClass = Array.from(element.classList).find((c) => /^(language|lang)-/.test(c));
    if (!langClass) return;

    const lang = langClass.replace(/^(language|lang)-/, "").toLowerCase();
    if (!languages.has(lang)) {
      console.warn("Unsupported language:", lang);
      return;
    }

    try {
      // Markup like <code>\n...\n</code> would otherwise render blank first and last lines.
      const code = (element.textContent || "").replace(/^\n|\n$/g, "");
      const html = await codeToHtml(code, {
        lang,
        // With two themes Shiki emits both sets of colors and loader.css switches between them.
        ...(darkTheme ? { themes: { light: theme, dark: darkTheme } } : { theme }),
        transformers: [createShikiLoaderTransformer(lang)],
      });

      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = html;
      const newPre = tempDiv.firstElementChild as HTMLElement | null;

      if (newPre) {
        for (const { name, value } of Array.from(parent.attributes)) {
          if (name !== "class" && name !== "style") newPre.setAttribute(name, value);
        }
        newPre.classList.add(...Array.from(parent.classList), langClass);
        newPre
          .querySelector<HTMLButtonElement>("button[data-target='copy']")
          ?.addEventListener("click", handleCopyButtonClick);
        parent.replaceWith(newPre);
      }
    } catch (err) {
      console.error(`Failed to highlight code block with language "${lang}":`, err);
    }
  });

  await Promise.allSettled(highlightTasks);
}

// Lets pages highlight content added after load: ShikiLoader.highlight(container)
Object.assign(window, { ShikiLoader: { highlight } });

// Side effect to automatically highlight on load
// Works both for scripts present at initial load and for
// scripts injected dynamically after DOMContentLoaded.
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    void highlight();
  });
} else {
  void highlight();
}
