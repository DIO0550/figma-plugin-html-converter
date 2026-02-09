import { test, expect } from "vitest";
import type { VarAttributes } from "../var-attributes";

test("VarAttributes - グローバル属性を含む場合 - 正しく設定できる", () => {
  const attributes: VarAttributes = {
    id: "variable-x",
    class: "math-var",
    style: "font-style: italic",
  };

  expect(attributes.id).toBe("variable-x");
  expect(attributes.class).toBe("math-var");
  expect(attributes.style).toBe("font-style: italic");
});
