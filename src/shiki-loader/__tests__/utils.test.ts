import { afterEach, describe, expect, mock, test } from "bun:test";
import { generateStyles, handleCopyButtonClick, readSearchParams } from "../utils";

afterEach(() => {
  document.head.innerHTML = "";
  document.body.innerHTML = "";
});

function addScript(src: string) {
  const script = document.createElement("script");
  script.setAttribute("src", src);
  document.head.appendChild(script);
}

describe("readSearchParams", () => {
  test("defaults to material-theme when no loader script is on the page", () => {
    expect(readSearchParams()).toEqual({ theme: "material-theme" });
  });

  test("reads theme and dark-theme from the loader script URL", () => {
    addScript("https://cdn.example/shiki-loader.js?theme=github-light&dark-theme=github-dark");

    expect(readSearchParams()).toEqual({ theme: "github-light", darkTheme: "github-dark" });
  });

  test("ignores theme names Shiki does not bundle", () => {
    addScript("https://cdn.example/shiki-loader.js?theme=nope&dark-theme=also-nope");

    expect(readSearchParams()).toEqual({ theme: "material-theme" });
  });

  test("ignores scripts that are not the loader", () => {
    addScript("https://cdn.example/other.js?theme=github-light");

    expect(readSearchParams()).toEqual({ theme: "material-theme" });
  });
});

test("generateStyles returns a style element", () => {
  expect(generateStyles().tagName).toBe("STYLE");
});

test("handleCopyButtonClick copies the code and flips the tooltip to Copied", async () => {
  const writeText = mock(async (_text: string) => {});
  Object.defineProperty(navigator, "clipboard", { value: { writeText }, configurable: true });
  document.body.innerHTML = `<div class="shiki-loader-mockup-code"><div class="shiki-loader-tooltip" data-tip="Copy"><button></button></div><pre><code>const x = 1;</code></pre></div>`;
  const button = document.querySelector("button") as HTMLButtonElement;

  await handleCopyButtonClick({ currentTarget: button } as unknown as MouseEvent);

  expect(writeText).toHaveBeenCalledWith("const x = 1;");
  expect(document.querySelector(".shiki-loader-tooltip")?.getAttribute("data-tip")).toBe("Copied");
});
