import { afterEach, describe, expect, mock, spyOn, test } from "bun:test";
import { generateStyles, handleCopyButtonClick, readSearchParams } from "../utils";

afterEach(() => {
  document.body.innerHTML = "";
});

describe("readSearchParams", () => {
  test("defaults to material-theme when the URL has no params", () => {
    expect(readSearchParams("https://cdn.example/renamed.abc123.js")).toEqual({ theme: "material-theme" });
  });

  test("reads theme and dark-theme from the script URL", () => {
    expect(
      readSearchParams("https://cdn.example/loader.js?theme=github-light&dark-theme=github-dark"),
    ).toEqual({
      theme: "github-light",
      darkTheme: "github-dark",
    });
  });

  test("ignores theme names Shiki does not bundle", () => {
    expect(readSearchParams("https://cdn.example/loader.js?theme=nope&dark-theme=also-nope")).toEqual({
      theme: "material-theme",
    });
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

test("handleCopyButtonClick keeps the Copy tooltip when the clipboard write fails", async () => {
  const writeText = mock(async (_text: string) => {
    throw new Error("denied");
  });
  Object.defineProperty(navigator, "clipboard", { value: { writeText }, configurable: true });
  const consoleError = spyOn(console, "error").mockImplementation(() => {});
  document.body.innerHTML = `<div class="shiki-loader-mockup-code"><div class="shiki-loader-tooltip" data-tip="Copy"><button></button></div><pre><code>const x = 1;</code></pre></div>`;
  const button = document.querySelector("button") as HTMLButtonElement;

  await handleCopyButtonClick({ currentTarget: button } as unknown as MouseEvent);

  expect(document.querySelector(".shiki-loader-tooltip")?.getAttribute("data-tip")).toBe("Copy");
  consoleError.mockRestore();
});
