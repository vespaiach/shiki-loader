import { expect, test } from "bun:test";
import createShikiLoaderTransformer from "../transformer";

test("wraps the pre node with a label, a copy button and the original node", () => {
  const pre = { type: "element", tagName: "pre", properties: { class: "shiki nord", style: "color:#fff" } };

  const wrapper = createShikiLoaderTransformer("ts").pre(pre);

  expect(wrapper.tagName).toBe("div");
  expect(wrapper.properties.class).toBe("shiki nord shiki-loader-mockup-code");
  expect(wrapper.properties.style).toBe("color:#fff");

  const [label, tooltip, original] = wrapper.children;
  expect(label.children[0].value).toBe("ts");
  expect(tooltip.children[0].properties["data-target"]).toBe("copy");
  expect(original).toBe(pre);
});

test("handles a pre node without class or style", () => {
  const wrapper = createShikiLoaderTransformer("js").pre({ type: "element", tagName: "pre" });

  expect(wrapper.properties.class).toBe("shiki-loader-mockup-code");
  expect(wrapper.properties.style).toBe("");
});
