import { test, expect } from "vitest";
import type { SampAttributes } from "../samp-attributes";

test("SampAttributes - グローバル属性を含む場合 - 正しく設定できる", () => {
  const attributes: SampAttributes = {
    id: "output-sample",
    class: "sample-output",
    style: "font-family: monospace",
  };

  expect(attributes.id).toBe("output-sample");
  expect(attributes.class).toBe("sample-output");
  expect(attributes.style).toBe("font-family: monospace");
});
