import { describe, test, expect } from "vitest";
import type { VarAttributes } from "../var-attributes";

describe("VarAttributes", () => {
  test("VarAttributesはグローバル属性を含むことができる", () => {
    const attributes: VarAttributes = {
      id: "variable-x",
      class: "math-var",
      style: "font-style: italic",
    };

    expect(attributes.id).toBe("variable-x");
    expect(attributes.class).toBe("math-var");
    expect(attributes.style).toBe("font-style: italic");
  });
});
